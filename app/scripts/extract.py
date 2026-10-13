"""
Phase 1, step 1 - extract the MCQ bank from the source PDF into per-topic JSON.

The source PDF (docs/COMPREHENSIVE EXAMINATIONS.pdf) is not a single uniform
document. It is two documents pasted together, and they use different
conventions:

  Pages 1-162   Styled paper. Section heading, then a "Question N" heading,
                a free-text stem, and lowercase "a)" style options.
                NO answer key.

  Pages 163-172 Plain-text paper ("Web Technology - Comprehensive Examination").
                "N." style question numbers, uppercase "A." style options,
                and an inline "Answer: X" line.
                HAS an answer key.

This module handles both with separate adapters, then normalises everything
into one schema. It does not invent, drop or reorder anything: every question
seen on a page is emitted, and anything suspicious is recorded in
`extractionFlags` for review rather than silently "fixed".

Usage:
    python app/scripts/extract.py
"""

from __future__ import annotations

import json
import re
from pathlib import Path

import fitz  # PyMuPDF

# --------------------------------------------------------------------------
# Paths
# --------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parents[2]
PDF_PATH = REPO_ROOT / "docs" / "COMPREHENSIVE EXAMINATIONS.pdf"
RAW_DIR = REPO_ROOT / "app" / "data" / "raw"

# Pages 1-162 are the styled paper, pages 163-172 the plain-text one.
STYLED_LAST_PAGE = 162  # 1-based, inclusive

# --------------------------------------------------------------------------
# Topic mapping
# --------------------------------------------------------------------------

# `slug` is used for filenames; `order` fixes the global question id sequence so
# ids stay stable across re-runs of the extractor.
TOPICS = [
    {"slug": "computer-networks", "markers": ["CN"], "title": "Computer Networks"},
    {
        "slug": "programming-dsa",
        "markers": ["DSA"],
        "title": "Programming and Data Structures",
    },
    {
        "slug": "digital-logic-microprocessor",
        "markers": ["Digital MP"],
        "title": "Digital Logic and Microprocessor",
    },
    {"slug": "operating-systems", "markers": ["OS"], "title": "Operating Systems"},
    {
        "slug": "theory-of-computation",
        "markers": ["TOC"],
        "title": "Theory of Computation",
    },
    {
        "slug": "computer-architecture",
        "markers": ["CAO"],
        "title": "Computer Architecture and Organization",
    },
    {
        "slug": "database-management-systems",
        "markers": ["DBMS"],
        "title": "Database Management Systems",
    },
    {
        "slug": "web-technologies",
        "markers": ["Web Technology"],
        "title": "Web Technologies",
    },
]

# Marker text -> topic dict. "DBMS" and "Web Technology" are unstyled body text
# rather than real headings, so detection is by exact-line match, not font.
MARKER_TO_TOPIC = {
    marker: topic for topic in TOPICS for marker in topic["markers"]
}

# --------------------------------------------------------------------------
# Line-level regular expressions
# --------------------------------------------------------------------------

# Styled paper: a bare "Question 12" heading.
RE_STYLED_HEADING = re.compile(r"^Question\s+(\d+)\s*$")

# Styled paper options are lowercase a) b) c) d).
#
# Restricted to a-h on purpose. Questions that enumerate statements as "i)",
# "ii)", "iii)" sit in the stem, and a permissive [a-z] class silently ate the
# "i)" line as an option and then discarded it, losing the statements entirely.
# The source never uses more than four options, so a-h loses nothing.
RE_STYLED_OPTION = re.compile(r"^([a-h])\)\s*(.*)$")

# Enumerated statements inside a stem, e.g. "iii) Round robin is better ...".
RE_ROMAN_ENUM = re.compile(r"\b(?:i|ii|iii|iv|v|vi|vii|viii|ix|x)\)\s+\S")

# Plain-text paper: "1. text" - but Q36 in the source is "36 Which status..."
# with no separator at all, so the separator is optional. The trailing
# lookahead prevents matching a bare number that is part of prose.
RE_PLAIN_HEADING = re.compile(r"^(\d{1,3})\s*[\.\)]?\s+(?=\S)(.*)$")

# Plain-text paper options are uppercase "A. text".
RE_PLAIN_OPTION = re.compile(r"^([A-Z])[\.\)]\s*(.*)$")

# The inline answer key. Checked before the option patterns so that
# "Answer: A. 200" is never mistaken for an option row.
RE_PLAIN_ANSWER = re.compile(r"^Answer\s*:\s*([A-Z])\b")

# Boilerplate headers repeated on every plain-text page.
PLAIN_NOISE = ("Web Technology", "Comprehensive Examination", "MCQs")

# The styled paper was exported from a word processor that leaked literal
# "<br />" tags into the text layer instead of emitting line breaks. All 493 of
# them sit in the styled paper; the plain-text paper has none.
RE_BR = re.compile(r"<br\s*/?>", re.IGNORECASE)

# Leading-token patterns that only ever start source code.
RE_CODE_HINT = re.compile(
    r"^(#include|#define|let |const |var |console\.log|printf|print |scanf|def |class "
    r"|public |private |import |package |return |if\s*\(|for\s*\(|while\s*\(|switch\s*\()"
)

# A line made up entirely of punctuation, e.g. a lone "{" or "});".
RE_CODE_ONLY_SYMBOLS = re.compile(r"^[{}();]+$")


def page_lines(page: fitz.Page) -> list[str]:
    """Split a page into cleaned lines, turning leaked <br /> into breaks."""
    return [clean_line(line) for line in RE_BR.sub("\n", page.get_text()).split("\n")]


def looks_like_code(line: str) -> bool:
    """True when a stem line is source code rather than English prose.

    Deliberately conservative: when in doubt the line is kept as prose. A
    misjudgement here can never swallow the question text, because prose and
    code are only ever separated, never discarded.
    """
    if RE_CODE_HINT.match(line):
        return True
    # Strong statement terminators are reliable at any length.
    if line.endswith((";", "{", "}", ");", "};")):
        return True
    # Weak ones are only trusted on short lines, otherwise prose that merely
    # ends in "...{R(Y)," would be mistaken for code.
    if len(line.split()) <= 6 and line.endswith(("),", "))", "];")):
        return True
    if RE_CODE_ONLY_SYMBOLS.match(line):
        return True
    # A short line that opens and closes a call is code, e.g. "int main()".
    if "(" in line and ")" in line and len(line.split()) <= 5:
        return True
    return False

# --------------------------------------------------------------------------
# Text normalisation
# --------------------------------------------------------------------------

# The PDF uses typographic quotes and dashes throughout. Curly quotes are
# folded to straight ASCII so that JSON, code snippets and the UI stay
# predictable. Real math symbols (epsilon, membership, arrows) are preserved
# verbatim because they carry meaning.
CHAR_MAP = {
    "‘": "'",
    "’": "'",
    "“": '"',
    "”": '"',
    "–": "-",
    "—": "-",
    "…": "...",
    "ﬁ": "fi",
    "ﬂ": "fl",
    "�": "",
}


def clean_line(text: str) -> str:
    """Normalise whitespace and smart punctuation on a single line."""
    for src, dst in CHAR_MAP.items():
        text = text.replace(src, dst)
    text = text.replace("\u00a0", " ")
    return re.sub(r"\s+", " ", text).strip()


def split_code_and_prose(lines: list[str]) -> tuple[str, str]:
    """Separate a stem's code lines from its prose lines.

    Returns (question_text, code_text). Every input line lands in exactly one of
    the two outputs, so no character is ever lost. When the whole stem is code
    the prose side is legitimately empty and the flag `empty-stem` records it.
    """
    prose: list[str] = []
    code: list[str] = []
    for line in lines:
        if not line:
            continue
        if looks_like_code(line):
            code.append(line)
        else:
            prose.append(line)
    return " ".join(prose), "\n".join(code)


# --------------------------------------------------------------------------
# Question record
# --------------------------------------------------------------------------

OPT_KEYS = "ABCDEFGH"


def make_question(
    *,
    topic_title: str,
    source_section: str,
    source_number: int,
    source_page: int,
    stem_lines: list[str],
    option_lines: list[tuple[str, str]],
    printed_answer: str | None,
    flags: list[str],
) -> dict:
    """Build one normalised question record."""
    question, code = split_code_and_prose(stem_lines)

    # Normalise option keys to uppercase A..H while preserving document order.
    # Anything outside a-h is a bug in the parser, not something to drop
    # quietly, so it is recorded as a flag and kept as a positional fallback.
    options = []
    for position, (key, text) in enumerate(option_lines):
        index = ord(key.upper()) - ord("A")
        if 0 <= index < len(OPT_KEYS):
            options.append({"key": OPT_KEYS[index], "text": text})
        else:
            flags.append(f"unexpected-option-key:{key}")
            if len(options) < len(OPT_KEYS):
                options.append({"key": OPT_KEYS[len(options)], "text": text})

    return {
        "topic": topic_title,
        "sourceSection": source_section,
        "sourceNumber": source_number,
        "sourcePage": source_page,
        "question": question,
        "code": code or None,
        "options": options,
        "printedAnswer": printed_answer,
        "marks": 1,
        "extractionFlags": flags,
    }


# --------------------------------------------------------------------------
# Adapter 1 - styled paper, pages 1 to STYLED_LAST_PAGE
# --------------------------------------------------------------------------


def extract_styled(document: fitz.Document) -> list[dict]:
    """Extract the styled paper.

    Sections are delimited by a standalone marker line. A question begins at a
    "Question N" heading, its stem runs to the first option, and each option
    runs until the next option or the next heading. That continuation rule is
    what preserves long options that wrap onto a second line.
    """
    questions: list[dict] = []
    section = None
    current: dict | None = None
    stem: list[str] = []
    options: list[tuple[str, str]] = []
    flags: list[str] = []

    def flush() -> None:
        """Close the in-progress question and append it."""
        nonlocal current, stem, options, flags
        if current is not None and section is not None:
            questions.append(
                make_question(
                    topic_title=section["title"],
                    source_section=section["markers"][0],
                    source_number=current["number"],
                    source_page=current["page"],
                    stem_lines=stem,
                    option_lines=options,
                    printed_answer=None,
                    flags=flags,
                )
            )
        current, stem, options, flags = None, [], [], []

    def flush_option_text() -> None:
        """Attach any accumulated wrapped text to the previous option."""
        if options and _option_buffer:
            joined = (options[-1][1] + " " + " ".join(_option_buffer)).strip()
            options[-1] = (options[-1][0], joined)
            _option_buffer.clear()

    _option_buffer: list[str] = []

    for page_index in range(STYLED_LAST_PAGE):
        page = document[page_index]
        page_number = page_index + 1

        for line in page_lines(page):
            if not line:
                continue

            # A section marker ends the previous section and starts a new one.
            if line in MARKER_TO_TOPIC:
                flush()
                section = MARKER_TO_TOPIC[line]
                continue

            # A question heading closes the previous question.
            heading = RE_STYLED_HEADING.match(line)
            if heading:
                flush_option_text()
                flush()
                current = {"number": int(heading.group(1)), "page": page_number}
                continue

            if current is None:
                continue

            option = RE_STYLED_OPTION.match(line)
            if option:
                flush_option_text()
                options.append((option.group(1), option.group(2)))
                continue

            # Anything else is either stem text (before the first option) or
            # wrapped continuation of the most recent option.
            if options:
                _option_buffer.append(line)
            else:
                stem.append(line)

        flush_option_text()

    flush()
    return questions


# --------------------------------------------------------------------------
# Adapter 2 - plain-text paper, pages STYLED_LAST_PAGE+1 to end
# --------------------------------------------------------------------------


def extract_plain(document: fitz.Document) -> list[dict]:
    """Extract the plain-text paper, which carries its own answer key."""
    questions: list[dict] = []
    topic = MARKER_TO_TOPIC["Web Technology"]
    current: dict | None = None
    stem: list[str] = []
    options: list[tuple[str, str]] = []
    printed: str | None = None
    flags: list[str] = []

    def flush() -> None:
        """Close the in-progress question and append it."""
        nonlocal current, stem, options, printed, flags
        if current is not None:
            questions.append(
                make_question(
                    topic_title=topic["title"],
                    source_section="Web Technology",
                    source_number=current["number"],
                    source_page=current["page"],
                    stem_lines=stem,
                    option_lines=options,
                    printed_answer=printed,
                    flags=flags,
                )
            )
        current, stem, options, printed, flags = None, [], [], None, []

    _option_buffer: list[str] = []

    def flush_option_text() -> None:
        if options and _option_buffer:
            joined = (options[-1][1] + " " + " ".join(_option_buffer)).strip()
            options[-1] = (options[-1][0], joined)
            _option_buffer.clear()

    def expected_letter() -> str | None:
        """The option letter expected next, or None once all eight are used."""
        return OPT_KEYS[len(options)] if len(options) < len(OPT_KEYS) else None

    for page_index in range(STYLED_LAST_PAGE, document.page_count):
        page = document[page_index]
        page_number = page_index + 1

        for line in page_lines(page):
            if not line or line in PLAIN_NOISE:
                continue

            # The inline answer key. Checked first so that "Answer: A. 200" is
            # never parsed as an option row.
            answer = RE_PLAIN_ANSWER.match(line)
            if answer and current is not None:
                printed = answer.group(1)
                continue

            # A question begins on a line whose leading number continues the
            # run. Requiring strict succession stops a wrapped option that
            # happens to start with a digit from splitting a question - and it
            # is what recovers Q36, whose "." is missing in the source PDF.
            heading = RE_PLAIN_HEADING.match(line)
            if heading:
                number = int(heading.group(1))
                if current is None or number == current["number"] + 1:
                    flush_option_text()
                    flush()
                    current = {"number": number, "page": page_number}
                    stem.append(heading.group(2))
                    continue

            option = RE_PLAIN_OPTION.match(line)
            if option and current is not None:
                expected = expected_letter()
                if expected is not None and option.group(1) != expected:
                    # A real question boundary was missed. Keep the text rather
                    # than dropping it, and record the anomaly.
                    flags.append(
                        f"option-sequence:{option.group(1)}-expected-{expected}"
                    )
                flush_option_text()
                options.append((option.group(1), option.group(2)))
                continue

            if current is None:
                continue

            if options:
                _option_buffer.append(line)
            else:
                stem.append(line)

        flush_option_text()

    flush()
    return questions


# --------------------------------------------------------------------------
# Post-processing
# --------------------------------------------------------------------------


def assign_ids(questions: list[dict]) -> list[dict]:
    """Stamp a stable global id on every question.

    Ids follow fixed topic order then source number, so re-running the
    extractor produces the same ids as long as the source PDF is unchanged.
    """
    order = {topic["title"]: i for i, topic in enumerate(TOPICS)}
    questions.sort(key=lambda q: (order.get(q["topic"], 99), q["sourceNumber"]))

    for index, question in enumerate(questions, start=1):
        question["id"] = f"q_{index:04d}"
    return questions


def flag_duplicates(questions: list[dict]) -> None:
    """Mark repeated stems within a topic.

    Both copies are kept (an agreed decision), so the flag exists purely to
    surface them in review_report.md rather than let them skew the exam
    blueprint. Exact repeats - same stem *and* same options - are reported
    separately from same-stem variants, because only the former is certainly a
    copy-paste error in the source.
    """
    grouped: dict[tuple[str, str], list[dict]] = {}
    for question in questions:
        fingerprint = (question["topic"], question["question"].strip().lower())
        grouped.setdefault(fingerprint, []).append(question)

    for group in grouped.values():
        if len(group) < 2:
            continue
        option_signatures = {
            tuple(o["text"].strip().lower() for o in q["options"]) for q in group
        }
        exact = len(option_signatures) == 1
        for question in group:
            others = ",".join(q["id"] for q in group if q["id"] != question["id"])
            label = "exact-duplicate-of" if exact else "duplicate-stem-of"
            question["extractionFlags"].append(f"{label}:{others}")


def flag_suspicious(questions: list[dict]) -> None:
    """Record structural problems worth a human glance."""
    for question in questions:
        letters = [o["key"] for o in question["options"]]

        if len(question["options"]) < 2:
            question["extractionFlags"].append("fewer-than-two-options")
        if letters != list("ABCDEFGH")[: len(letters)]:
            question["extractionFlags"].append("non-sequential-option-keys")

        if not question["question"]:
            question["extractionFlags"].append("empty-stem")
        if any(not o["text"] for o in question["options"]):
            question["extractionFlags"].append("empty-option-text")

        # Runs of underscores are fill-in-the-blank questions. That is normal
        # content here, not a defect, so the flag is informational.
        if "___" in question["question"]:
            question["extractionFlags"].append("fill-in-the-blank")

        # Stems that enumerate statements are worth seeing explicitly: they are
        # the shape that previously lost content to the option regex.
        if RE_ROMAN_ENUM.search(question["question"]):
            question["extractionFlags"].append("stem-enumeration")

        if question["code"]:
            question["extractionFlags"].append("code-detected")

        if question["printedAnswer"] and question["printedAnswer"] not in letters:
            question["extractionFlags"].append("printed-answer-not-an-option")


# --------------------------------------------------------------------------
# Entry point
# --------------------------------------------------------------------------


def main() -> None:
    if not PDF_PATH.exists():
        raise SystemExit(f"PDF not found: {PDF_PATH}")

    document = fitz.open(PDF_PATH)
    print(f"Source: {PDF_PATH.name} ({document.page_count} pages)")

    styled = extract_styled(document)
    plain = extract_plain(document)
    questions = assign_ids(styled + plain)

    flag_suspicious(questions)
    flag_duplicates(questions)

    RAW_DIR.mkdir(parents=True, exist_ok=True)

    for topic in TOPICS:
        subset = [q for q in questions if q["topic"] == topic["title"]]
        target = RAW_DIR / f"{topic['slug']}.json"
        target.write_text(
            json.dumps({"topic": topic["title"], "questions": subset}, indent=2, ensure_ascii=False),
            encoding="utf-8",
        )
        answered = sum(1 for q in subset if q["printedAnswer"])
        print(f"  {topic['title']:<38} {len(subset):>4} questions" + (f"  ({answered} pre-answered)" if answered else ""))

    flag_count = sum(1 for q in questions if q["extractionFlags"])
    print(f"  {'TOTAL':<38} {len(questions):>4} questions")
    print(f"\n{flag_count} question(s) carry extraction flags -> review in Phase 1 report.")


if __name__ == "__main__":
    main()