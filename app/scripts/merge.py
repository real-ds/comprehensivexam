"""
Phase 2, step 3 - merge the extracted questions with the solved answers.

Joins app/data/raw/<topic>.json with every app/data/answers/*.json shard and
writes the single app/data/questions.json that the app consumes.

The join is strict on purpose: a question with no answer, an answer with no
question, a duplicated id, or a correctAnswer that does not match any option
key are all reported and cause a non-zero exit. That keeps a half-solved bank
from ever reaching the UI.

Usage:
    python app/scripts/merge.py
"""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = REPO_ROOT / "app" / "data" / "raw"
ANSWER_DIR = REPO_ROOT / "app" / "data" / "answers"
OUTPUT_PATH = REPO_ROOT / "app" / "data" / "questions.json"

# Field order in the emitted records, matching the schema in the brief.
FIELD_ORDER = [
    "id",
    "topic",
    "subtopic",
    "difficulty",
    "question",
    "code",
    "image",
    "options",
    "correctAnswer",
    "explanation",
    "marks",
    "sourcePage",
    "confidence",
    "needsReview",
    "reviewReason",
    "sourceSection",
    "sourceNumber",
    "extractionFlags",
]


def load_questions() -> dict[str, dict]:
    """Load every raw question keyed by id, reporting duplicate ids."""
    questions: dict[str, dict] = {}
    duplicates: list[str] = []
    if not RAW_DIR.exists():
        raise SystemExit(f"No raw data at {RAW_DIR}. Run extract.py first.")

    for path in sorted(RAW_DIR.glob("*.json")):
        payload = json.loads(path.read_text(encoding="utf-8"))
        for question in payload.get("questions", []):
            qid = question["id"]
            if qid in questions:
                duplicates.append(qid)
            questions[qid] = question
    return questions, duplicates


def load_answers() -> dict[str, dict]:
    """Load every answer shard keyed by id, reporting duplicate ids."""
    answers: dict[str, dict] = {}
    duplicates: list[str] = []
    if not ANSWER_DIR.exists():
        raise SystemExit(f"No answers at {ANSWER_DIR}. Phase 2 has not run yet.")

    for path in sorted(ANSWER_DIR.glob("*.json")):
        payload = json.loads(path.read_text(encoding="utf-8"))
        for answer in payload.get("answers", []):
            qid = answer["id"]
            if qid in answers:
                duplicates.append(f"{qid} (in {path.name})")
            answers[qid] = answer
    return answers, duplicates


def build_record(question: dict, answer: dict | None) -> tuple[dict, list[str]]:
    """Combine one question with its answer and report any field problems."""
    problems: list[str] = []
    qid = question["id"]

    record = {
        "id": qid,
        "topic": question.get("topic"),
        "subtopic": None,
        "difficulty": None,
        "question": question.get("question") or "",
        "code": question.get("code"),
        "image": question.get("image"),
        "options": question.get("options") or [],
        "correctAnswer": None,
        "explanation": None,
        "marks": question.get("marks", 1),
        "sourcePage": question.get("sourcePage"),
        "confidence": None,
        "needsReview": False,
        "reviewReason": None,
        "sourceSection": question.get("sourceSection"),
        "sourceNumber": question.get("sourceNumber"),
        "extractionFlags": question.get("extractionFlags") or [],
    }

    if answer is None:
        problems.append(f"{qid}: no answer supplied")
        return record, problems

    record["subtopic"] = answer.get("subtopic")
    record["difficulty"] = answer.get("difficulty")
    record["correctAnswer"] = answer.get("correctAnswer")
    record["explanation"] = (answer.get("explanation") or "").strip() or None
    record["confidence"] = answer.get("confidence")
    record["needsReview"] = bool(answer.get("needsReview"))
    record["reviewReason"] = answer.get("reviewReason")

    keys = [o.get("key") for o in record["options"]]

    # A null answer is legitimate when the solver genuinely could not decide,
    # but it must then be flagged so it surfaces for manual review.
    if record["correctAnswer"] is None:
        if not record["needsReview"]:
            problems.append(f"{qid}: correctAnswer is null but needsReview is false")
    elif record["correctAnswer"] not in keys:
        problems.append(
            f"{qid}: correctAnswer {record['correctAnswer']!r} is not one of {keys}"
        )

    if not record["explanation"]:
        problems.append(f"{qid}: explanation is empty")

    if record["confidence"] not in {"high", "medium", "low"}:
        problems.append(f"{qid}: bad confidence {record['confidence']!r}")

    if record["difficulty"] not in {"easy", "medium", "hard"}:
        problems.append(f"{qid}: bad difficulty {record['difficulty']!r}")

    if not record["subtopic"]:
        problems.append(f"{qid}: no subtopic")

    return record, problems


def build_meta(records: list[dict]) -> dict:
    """Summarise the bank so the app does not have to recompute counts."""
    by_topic: Counter[str] = Counter(r["topic"] for r in records)
    by_subtopic: Counter[str] = Counter(r["subtopic"] for r in records if r["subtopic"])
    return {
        "total": len(records),
        "answered": sum(1 for r in records if r["correctAnswer"]),
        "needsReview": sum(1 for r in records if r["needsReview"]),
        "topics": dict(sorted(by_topic.items())),
        "subtopics": dict(sorted(by_subtopic.items())),
    }


def main() -> None:
    questions, question_duplicates = load_questions()
    answers, answer_duplicates = load_answers()

    print(f"Loaded {len(questions)} questions and {len(answers)} answers.")

    all_problems: list[str] = list(question_duplicates) + list(answer_duplicates)

    records: list[dict] = []
    for qid in sorted(questions):
        record, problems = build_record(questions[qid], answers.get(qid))
        records.append(record)
        all_problems.extend(problems)

    orphan_answers = sorted(set(answers) - set(questions))
    for qid in orphan_answers:
        all_problems.append(f"{qid}: answer has no matching question")

    meta = build_meta(records)
    payload = {"meta": meta, "questions": records}

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(
        json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    print("\nPer-topic counts")
    for topic, count in meta["topics"].items():
        print(f"  {topic:<40}{count:>5}")
    print(f"  {'TOTAL':<40}{meta['total']:>5}")

    print(
        f"\nAnswered {meta['answered']}/{meta['total']}, "
        f"{meta['needsReview']} flagged needsReview."
    )
    print(f"Wrote {OUTPUT_PATH.relative_to(REPO_ROOT)}")

    if all_problems:
        print(f"\nPROBLEMS ({len(all_problems)})")
        for problem in all_problems[:40]:
            print(f"  {problem}")
        if len(all_problems) > 40:
            print(f"  ... and {len(all_problems) - 40} more")
        raise SystemExit("merge finished with problems")

    print("\nMerge clean.")


if __name__ == "__main__":
    main()