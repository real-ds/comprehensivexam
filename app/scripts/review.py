"""
Phase 2, step 4 - generate review_report.md.

Produces the manual checklist the brief asks for: every question that Phase 2
could not answer with confidence, grouped so the worst problems surface first.

Grouping order:
  1. No answer at all - the bank is incomplete for these.
  2. Duplicate questions - both copies kept, per the agreed decision.
  3. Repeated option text - the question cannot have a unique answer.
  4. Everything else flagged needsReview, with the solver's own reason.

Usage:
    python app/scripts/review.py
"""

from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
QUESTIONS_PATH = REPO_ROOT / "app" / "data" / "questions.json"
REPORT_PATH = REPO_ROOT / "review_report.md"


def escape(text: str | None) -> str:
    """Flatten a question or option into one report-friendly line."""
    if not text:
        return "_none_"
    flattened = " ".join(str(text).split())
    return flattened.replace("|", "\\|")


def render_entry(question: dict) -> list[str]:
    """Render one question as a markdown block."""
    lines = [
        f"#### `{question['id']}` - {question['topic']} / {question.get('subtopic') or '_no subtopic_'}",
        "",
        f"- Source: page {question.get('sourcePage')}, section {question.get('sourceSection')}, question {question.get('sourceNumber')}",
        f"- Difficulty: {question.get('difficulty') or 'unknown'} | Confidence: {question.get('confidence') or 'unknown'}",
    ]

    answer = question.get("correctAnswer")
    lines.append(f"- Answer recorded: **{answer if answer else 'NONE'}**")

    if question.get("code"):
        code = "\n".join(question["code"].splitlines()[:12])
        lines += ["", "Code:", "", "```", code, "```"]

    lines += ["", f"**Question:** {escape(question.get('question'))}", ""]
    for option in question.get("options", []):
        marker = " (recorded answer)" if option["key"] == answer else ""
        lines.append(f"- **{option['key']}**{marker}: {escape(option.get('text'))}")

    if question.get("reviewReason"):
        lines += ["", f"**Why flagged:** {escape(question['reviewReason'])}"]

    lines.append("")
    return lines


def section(title: str, note: str, questions: list[dict]) -> list[str]:
    """Render a titled section of question entries."""
    if not questions:
        return []
    lines = [f"## {title}", "", f"{len(questions)} question(s). {note}", ""]
    for question in questions:
        lines += render_entry(question)
    return lines


def main() -> None:
    if not QUESTIONS_PATH.exists():
        raise SystemExit(f"{QUESTIONS_PATH} not found. Run merge.py first.")

    payload = json.loads(QUESTIONS_PATH.read_text(encoding="utf-8"))
    questions = payload["questions"] if isinstance(payload, dict) else payload
    meta = payload.get("meta", {}) if isinstance(payload, dict) else {}

    unanswered = [q for q in questions if not q.get("correctAnswer")]
    flagged = [q for q in questions if q.get("needsReview")]

    def has_flag(question: dict, prefix: str) -> bool:
        return any(f.startswith(prefix) for f in question.get("extractionFlags", []))

    duplicates = [
        q
        for q in flagged
        if has_flag(q, "exact-duplicate-of") or has_flag(q, "duplicate-stem-of")
    ]
    repeated_options: list[dict] = []
    for question in questions:
        texts = [o["text"].strip().lower() for o in question.get("options", [])]
        if len(set(texts)) != len(texts):
            repeated_options.append(question)
    other = [
        q
        for q in flagged
        if q not in unanswered
        and q not in duplicates
        and q not in repeated_options
    ]

    by_topic = Counter(q["topic"] for q in flagged)
    by_confidence = Counter(q.get("confidence") for q in flagged)

    lines = [
        "# Manual review report",
        "",
        f"Generated from `{QUESTIONS_PATH.relative_to(REPO_ROOT).as_posix()}`.",
        "",
        "Every question listed here was solved with something other than full",
        "confidence, or could not be solved at all. These are the items worth a",
        "human decision before the bank is treated as authoritative.",
        "",
        "## Summary",
        "",
        f"- Total questions: **{len(questions)}**",
        f"- Answered: **{meta.get('answered', len(questions) - len(unanswered))}** of {len(questions)}",
        f"- Flagged needsReview: **{len(flagged)}**",
        f"- No answer recorded: **{len(unanswered)}**",
        "",
        "### Needs review by topic",
        "",
        "| Topic | Flagged |",
        "| --- | --- |",
    ]
    for topic, count in sorted(by_topic.items(), key=lambda kv: -kv[1]):
        lines.append(f"| {topic} | {count} |")

    lines += [
        "",
        "### Needs review by confidence",
        "",
        "| Confidence | Count |",
        "| --- | --- |",
    ]
    for level, count in sorted(by_confidence.items(), key=lambda kv: -kv[1]):
        lines.append(f"| {level} | {count} |")

    lines += [
        "",
        "## How to work through this",
        "",
        "1. Fix the answers here, or override them in the app from the question",
        "   screen. Overrides are stored locally and applied on top of the bank,",
        "   so no JSON editing is needed.",
        "2. Anything you correct by hand should also be fixed in",
        "   `app/data/questions.json`, otherwise the next `merge.py` run will",
        "   overwrite it with the solver output.",
        "",
        "---",
        "",
    ]

    lines += section(
        "1. No answer recorded",
        "These could not be solved at all. Either the source question is "
        "incomplete, or the options contradict the theory. They show as "
        "unanswered in the app until a decision is made.",
        unanswered,
    )
    lines += section(
        "2. Duplicate questions",
        "Both copies were kept, as agreed. They still consume exam-blueprint "
        "slots, so decide whether to remove one or leave them.",
        duplicates,
    )
    lines += section(
        "3. Repeated option text",
        "Two or more options are identical, so the question has no unique "
        "answer. This is a defect in the source paper.",
        repeated_options,
    )
    lines += section(
        "4. Flagged for review",
        "Answered, but the solver was not fully confident. Each entry gives "
        "the reason.",
        other,
    )

    REPORT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"Wrote {REPORT_PATH.relative_to(REPO_ROOT)}")
    print(f"  no answer recorded : {len(unanswered)}")
    print(f"  duplicates         : {len(duplicates)}")
    print(f"  repeated options   : {len(repeated_options)}")
    print(f"  flagged for review : {len(other)}")
    print(f"  total flagged      : {len(flagged)} of {len(questions)}")


if __name__ == "__main__":
    main()