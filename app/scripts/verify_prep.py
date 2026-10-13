"""
Phase 2, step 5 - build the second-pass verification worklists.

The brief asks for an independent second look at:
  - every question the solver was not fully confident about (medium/low), and
  - every calculation or code-output question, which are the easiest to get
    subtly wrong, and
  - every question left unanswered, in case a fresh reading can resolve them.

This script slices those out of questions.json into one worklist per topic so a
verification agent only has to read the questions it must judge, not all 640.

Usage:
    python app/scripts/verify_prep.py
"""

from __future__ import annotations

import json
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
QUESTIONS_PATH = REPO_ROOT / "app" / "data" / "questions.json"
VERIFY_DIR = REPO_ROOT / "app" / "data" / "verify"

# Slugs matching the answer shard files each agent may edit.
TOPIC_SLUGS = {
    "Computer Networks": "computer-networks",
    "Programming and Data Structures": "programming-dsa",
    "Digital Logic and Microprocessor": "digital-logic-microprocessor",
    "Operating Systems": "operating-systems",
    "Theory of Computation": "theory-of-computation",
    "Computer Architecture and Organization": "computer-architecture",
    "Database Management Systems": "database-management-systems",
    "Web Technologies": "web-technologies",
}


def needs_verification(question: dict) -> tuple[bool, list[str]]:
    """Decide whether a question belongs in the second pass, and why."""
    reasons: list[str] = []
    if question.get("confidence") in {"medium", "low"}:
        reasons.append(f"confidence={question['confidence']}")
    if not question.get("correctAnswer"):
        reasons.append("no answer recorded")
    if question.get("code"):
        reasons.append("code/calculation question")
    elif "stem-enumeration" in question.get("extractionFlags", []):
        reasons.append("enumerated statements, easy to mis-parse")
    return bool(reasons), reasons


def main() -> None:
    if not QUESTIONS_PATH.exists():
        raise SystemExit(f"{QUESTIONS_PATH} not found. Run merge.py first.")

    payload = json.loads(QUESTIONS_PATH.read_text(encoding="utf-8"))
    questions = payload["questions"]

    grouped: dict[str, list[dict]] = {topic: [] for topic in TOPIC_SLUGS}

    for question in questions:
        required, reasons = needs_verification(question)
        if not required:
            continue
        topic = question["topic"]
        if topic not in grouped:
            continue
        grouped[topic].append(
            {
                "id": question["id"],
                "verifyReasons": reasons,
                "topic": topic,
                "subtopic": question.get("subtopic"),
                "question": question.get("question"),
                "code": question.get("code"),
                "options": question.get("options"),
                "currentAnswer": question.get("correctAnswer"),
                "currentConfidence": question.get("confidence"),
                "currentExplanation": question.get("explanation"),
                "currentNeedsReview": question.get("needsReview"),
                "currentReviewReason": question.get("reviewReason"),
                "sourcePage": question.get("sourcePage"),
            }
        )

    VERIFY_DIR.mkdir(parents=True, exist_ok=True)

    total = 0
    for topic, slug in TOPIC_SLUGS.items():
        items = grouped[topic]
        path = VERIFY_DIR / f"{slug}.json"
        path.write_text(
            json.dumps({"topic": topic, "questions": items}, indent=2, ensure_ascii=False),
            encoding="utf-8",
        )
        total += len(items)
        print(f"  {topic:<40}{len(items):>4}")

    print(f"  {'TOTAL':<40}{total:>4} to verify")
    print(f"\nWrote {len(TOPIC_SLUGS)} worklists to {VERIFY_DIR.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()