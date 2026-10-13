"""
Phase 1, step 2 - validate the extracted bank.

Runs against the per-topic raw files after extraction, and against the merged
questions.json once answers exist. The two modes check different things:

  raw mode          structural integrity of the extraction only. Answer fields
                    are expected to be missing at this point, so their absence
                    is reported as "pending" rather than as a failure.

  merged mode       the full set of assertions from the brief: unique ids, at
                    least two options, a correctAnswer that matches an option
                    key, and a non-empty explanation.

Usage:
    python app/scripts/validate.py                 # raw extraction
    python app/scripts/validate.py --merged        # final questions.json
"""

from __future__ import annotations

import argparse
import json
from collections import Counter
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = REPO_ROOT / "app" / "data" / "raw"
ANSWER_DIR = REPO_ROOT / "app" / "data" / "answers"
MERGED_PATH = REPO_ROOT / "app" / "data" / "questions.json"

VALID_OPTION_KEYS = "ABCDEFGH"
VALID_CONFIDENCE = {"high", "medium", "low"}
VALID_DIFFICULTY = {"easy", "medium", "hard"}


class Report:
    """Collects failures and warnings so everything is reported at once."""

    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []
        self.notes: list[str] = []

    def error(self, message: str) -> None:
        self.errors.append(message)

    def warn(self, message: str) -> None:
        self.warnings.append(message)

    def note(self, message: str) -> None:
        self.notes.append(message)


# --------------------------------------------------------------------------
# Shared structural checks
# --------------------------------------------------------------------------


def check_structure(question: dict, report: Report) -> None:
    """Validate everything that does not depend on an answer existing."""
    qid = question.get("id", "<no id>")

    question_text = (question.get("question") or "").strip()
    code_text = (question.get("code") or "").strip()
    if not question_text and not code_text:
        report.error(f"{qid}: no question text and no code block")

    options = question.get("options") or []
    if len(options) < 2:
        report.error(f"{qid}: only {len(options)} option(s), at least 2 required")

    keys = [o.get("key") for o in options]
    for key in keys:
        if key not in VALID_OPTION_KEYS:
            report.error(f"{qid}: invalid option key {key!r}")
    expected = list(VALID_OPTION_KEYS[: len(options)])
    if keys != expected:
        report.warn(f"{qid}: option keys are {keys}, expected {expected}")

    for option in options:
        if not (option.get("text") or "").strip():
            report.error(f"{qid}: option {option.get('key')} has empty text")

    texts = [(o.get("text") or "").strip().lower() for o in options]
    duplicates = [t for t, n in Counter(texts).items() if n > 1]
    if duplicates:
        report.warn(f"{qid}: repeated option text {duplicates}")

    marks = question.get("marks")
    if marks is None:
        report.warn(f"{qid}: no marks value")
    elif not isinstance(marks, (int, float)) or marks <= 0:
        report.error(f"{qid}: marks must be a positive number, got {marks!r}")

    if not question.get("topic"):
        report.error(f"{qid}: no topic")
    if not isinstance(question.get("sourcePage"), int):
        report.warn(f"{qid}: sourcePage is not an integer")


def check_answer(question: dict, report: Report) -> None:
    """Validate the fields produced in Phase 2."""
    qid = question.get("id", "<no id>")
    keys = [o.get("key") for o in (question.get("options") or [])]

    answer = question.get("correctAnswer")
    if not answer:
        report.error(f"{qid}: no correctAnswer")
    elif answer not in keys:
        report.error(f"{qid}: correctAnswer {answer!r} is not one of {keys}")

    explanation = (question.get("explanation") or "").strip()
    if not explanation:
        report.error(f"{qid}: no explanation")
    elif len(explanation) < 40:
        report.warn(f"{qid}: explanation is very short ({len(explanation)} chars)")

    confidence = question.get("confidence")
    if confidence not in VALID_CONFIDENCE:
        report.error(f"{qid}: confidence {confidence!r} must be one of {sorted(VALID_CONFIDENCE)}")

    difficulty = question.get("difficulty")
    if difficulty not in VALID_DIFFICULTY:
        report.error(f"{qid}: difficulty {difficulty!r} must be one of {sorted(VALID_DIFFICULTY)}")

    if not (question.get("subtopic") or "").strip():
        report.warn(f"{qid}: no subtopic")


# --------------------------------------------------------------------------
# Modes
# --------------------------------------------------------------------------


def load_raw() -> list[dict]:
    """Load every per-topic raw file, sorted by topic name for stable output."""
    if not RAW_DIR.exists():
        raise SystemExit(f"No raw data at {RAW_DIR}. Run extract.py first.")
    questions: list[dict] = []
    for path in sorted(RAW_DIR.glob("*.json")):
        payload = json.loads(path.read_text(encoding="utf-8"))
        questions.extend(payload.get("questions", []))
    return questions


def validate_raw(questions: list[dict]) -> Report:
    report = Report()

    ids = [q.get("id") for q in questions]
    for qid, count in Counter(ids).items():
        if count > 1:
            report.error(f"duplicate id {qid} appears {count} times")
    missing = [i for i in ids if not i]
    if missing:
        report.error(f"{len(missing)} question(s) have no id")

    for question in questions:
        check_structure(question, report)

    answered = sum(1 for q in questions if q.get("printedAnswer"))
    report.note(f"{answered} question(s) arrived with a printed answer key")

    flagged = [q for q in questions if q.get("extractionFlags")]
    return report, flagged, answered


def validate_merged(questions: list[dict]) -> Report:
    report = Report()

    ids = [q.get("id") for q in questions]
    for qid, count in Counter(ids).items():
        if count > 1:
            report.error(f"duplicate id {qid} appears {count} times")

    for question in questions:
        check_structure(question, report)
        check_answer(question, report)
    return report


# --------------------------------------------------------------------------
# Output
# --------------------------------------------------------------------------


def print_topics(questions: list[dict]) -> None:
    """Print the per-topic question count table."""
    by_topic: dict[str, list[dict]] = {}
    for question in questions:
        by_topic.setdefault(question.get("topic", "<none>"), []).append(question)

    print(f"{'TOPIC':<40}{'QUESTIONS':>10}{'ANSWERED':>10}{'FLAGGED':>9}")
    print("-" * 69)
    for topic in sorted(by_topic):
        items = by_topic[topic]
        answered = sum(1 for q in items if q.get("correctAnswer") or q.get("printedAnswer"))
        flagged = sum(1 for q in items if q.get("extractionFlags"))
        print(f"{topic:<40}{len(items):>10}{answered:>10}{flagged:>9}")
    print("-" * 69)
    print(f"{'TOTAL':<40}{len(questions):>10}")


def print_flags(questions: list[dict]) -> None:
    """Print a grouped breakdown of extraction flags."""
    counts: Counter[str] = Counter()
    examples: dict[str, list[str]] = {}
    for question in questions:
        for flag in question.get("extractionFlags", []):
            name = flag.split(":")[0]
            counts[name] += 1
            if len(examples.setdefault(name, [])) < 3:
                examples[name].append(f"{question['id']} (p{question.get('sourcePage')})")

    if not counts:
        print("No extraction flags.")
        return

    print("\nExtraction flags")
    for name, count in counts.most_common():
        print(f"  {name:<26}{count:>5}   e.g. {', '.join(examples[name])}")


def print_issues(report: Report, limit: int = 25) -> None:
    """Print errors and warnings, truncated to stay readable."""
    if report.errors:
        print(f"\nERRORS ({len(report.errors)})")
        for message in report.errors[:limit]:
            print(f"  {message}")
        if len(report.errors) > limit:
            print(f"  ... and {len(report.errors) - limit} more")

    if report.warnings:
        print(f"\nWARNINGS ({len(report.warnings)})")
        for message in report.warnings[:limit]:
            print(f"  {message}")
        if len(report.warnings) > limit:
            print(f"  ... and {len(report.warnings) - limit} more")


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate the extracted question bank.")
    parser.add_argument(
        "--merged",
        action="store_true",
        help="validate app/data/questions.json instead of the raw extraction",
    )
    args = parser.parse_args()

    if args.merged:
        if not MERGED_PATH.exists():
            raise SystemExit(f"{MERGED_PATH} not found. Run merge.py first.")
        payload = json.loads(MERGED_PATH.read_text(encoding="utf-8"))
        questions = payload["questions"] if isinstance(payload, dict) else payload
        print_topics(questions)
        report = validate_merged(questions)
        flagged: list[dict] = []
        answered = sum(1 for q in questions if q.get("correctAnswer"))
    else:
        questions = load_raw()
        print_topics(questions)
        report, flagged, answered = validate_raw(questions)

    print(f"\nAnswered: {answered}/{len(questions)}")

    print_issues(report)
    print_flags(questions)

    review = [q for q in questions if q.get("needsReview")]
    if review:
        print(f"\n{len(review)} question(s) flagged needsReview for manual checking.")

    print("\nRESULT:", "PASS" if not report.errors else f"FAIL ({len(report.errors)} errors)")


if __name__ == "__main__":
    main()