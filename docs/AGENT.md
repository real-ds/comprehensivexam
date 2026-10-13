# ROLE
You are a senior full-stack engineer and a careful subject-matter tutor. Build a complete, polished MCQ quiz application from the question bank that already exists in this project directory.

# INPUT
- The project directory contains a ~180-page PDF of MCQs across several topics.
- The PDF has QUESTIONS AND OPTIONS ONLY. There are NO answers or solutions.
- Start by exploring the directory to find the PDF(s) and any existing files. Do not assume file names.

# PHASE 1: EXTRACT AND STRUCTURE THE QUESTION BANK
1. Extract every question from the PDF (use pdfplumber / PyMuPDF; fall back to OCR if pages are scanned). Preserve question numbering, options (A/B/C/D, or however many exist), code snippets, tables, math, and any images or diagrams (save images to /public/assets/ and reference them).
2. Detect topics from the PDF's headings or sections. If there are no clear headings, cluster the questions into sensible topics and name them. Print the final topic list with question counts.
3. Normalize everything into one JSON file (questions.json) with this schema:

{
  "id": "q_0001",
  "topic": "Operating Systems",
  "subtopic": "Scheduling",
  "difficulty": "easy | medium | hard",
  "question": "...",
  "code": "optional code block",
  "image": "optional path",
  "options": [{"key": "A", "text": "..."}, ...],
  "correctAnswer": "B",
  "explanation": "Step-by-step reasoning for why B is correct and why each other option is wrong",
  "marks": 1,
  "sourcePage": 42,
  "confidence": "high | medium | low",
  "needsReview": false
}

4. Write a validation script that checks: no duplicate IDs, every question has at least 2 options, every question has a correctAnswer that matches an option key, and every question has an explanation. Report counts per topic and list any extraction problems (broken options, missing text, merged questions).

# PHASE 2: GENERATE CORRECT ANSWERS AND REASONING
Since the PDF has no solutions, you must solve every question yourself.
- Work through each question carefully and independently. For calculation/code-output/logic questions, actually compute or run the code to verify; do not guess.
- Write the explanation as clear reasoning: the core concept, the steps, why the correct option is right, and a one-line reason each wrong option fails.
- Assign a confidence level. If a question is ambiguous, has a typo, has no correct option, or has more than one defensible answer, set needsReview=true and say why in the explanation.
- Process in batches by topic and save progress after each batch so work isn't lost.
- Do a second verification pass on all low/medium-confidence questions and on every calculation or code-output question.
- Produce a review report (review_report.md) listing all needsReview questions so I can check them manually.
- Build a small in-app "Report an issue / override answer" feature so I can correct any answer later without editing JSON by hand (overrides saved locally and applied on top of questions.json).

# PHASE 3: BUILD THE APPLICATION
Tech: React + TypeScript + Vite + Tailwind (static app, no backend, runs fully in the browser). Store progress in localStorage/IndexedDB. If you strongly prefer another stack, state why before starting. Must be responsive (mobile and desktop) with light and dark mode and a clean, modern, minimal UI. Support rendering code blocks with syntax highlighting and math (KaTeX) where the questions need them.

## Home screen
Three clear mode cards (Study, Test, Exam), a topic overview with question counts, and a summary of overall progress and recent attempts.

## MODE 1: STUDY MODE
Purpose: learn the material, not be tested.
- Pick a topic (or All) and optionally filter by subtopic, difficulty, bookmarked, or "not yet studied".
- Show one question at a time with all options. The correct answer is clearly highlighted along with the full explanation and per-option reasoning (collapsible).
- Previous/Next navigation, jump-to-question, and a searchable question list.
- Bookmark/star questions and add personal notes.
- Mark questions as "understood" or "needs revision"; track % studied per topic.
- Keyboard shortcuts (arrows to navigate, B to bookmark).

## MODE 2: TEST MODE
Purpose: practise a chosen topic in a typical quiz manner.
- Setup screen: choose topic(s), number of questions (10/20/30/all/custom), difficulty, shuffle questions and options (on/off), optional timer (off/per-question/total), and feedback style: (a) instant feedback after each answer, or (b) feedback only at the end.
- Quiz screen: one question per screen, progress bar, question counter, timer if enabled, select an option then Submit/Next, Skip, and Mark for Review. A question palette shows answered / unanswered / marked / current states.
- With instant feedback: after answering, show correct/incorrect, the correct answer, and the explanation.
- Results screen: score, accuracy, time taken, per-topic/subtopic breakdown, and a full question-by-question review (your answer vs correct answer + explanation). Buttons: Retry wrong answers only, Retake, Back to Home.
- Save every attempt to history.

## MODE 3: EXAM MODE (BLIND TEST)
Purpose: a realistic exam simulation.
- Exactly 100 questions = 100 marks (1 mark each), balanced across all topics. Use a proportional allocation based on each topic's share of the bank with a minimum of 1 question per topic, rounded so the total is exactly 100. Show a blueprint (questions per topic) on the start screen. Pick questions randomly each attempt, with a mix of difficulties, no duplicates, and shuffle questions and options. Optionally avoid questions seen in the last exam.
- BLIND: no correctness feedback, no explanations, and no running score during the exam. Never reveal answers until the final submit.
- Fixed total timer (default 100 minutes, configurable on the start screen), always visible, auto-submit when it ends.
- Question palette with answered / unanswered / marked-for-review states, ability to move freely between questions and change answers, plus a confirmation dialog before submission showing counts of answered, unanswered, and marked questions.
- Optional negative marking (off by default; configurable, e.g. -0.25 per wrong).
- Warn on accidental refresh/close, and auto-save state so an interrupted exam can be resumed with the remaining time.
- Result analysis after submit: total score out of 100, percentage, time spent, topic-wise score table and chart, strengths/weaknesses, and a full review with correct answers and explanations. Offer "Practise weak topics" which jumps to Test mode pre-filtered.
- Save all exam attempts and show a score-trend chart over time.

## Progress and analytics (all modes)
A dashboard with accuracy by topic, attempt history, score trends, weak-topic detection, bookmarks, and a way to reset or export/import progress as JSON.

# QUALITY REQUIREMENTS
- Accessible (keyboard navigable, good contrast, proper labels) and fast even with 1000+ questions.
- Handle edge cases: questions with images, code, tables, 2-6 options, very long text, and topics with few questions.
- Clean, well-structured, commented code; a README with setup, how to re-run extraction, and how to add or edit questions.
- Add tests for the exam blueprint logic (exactly 100 questions, topic balance, no duplicates) and for scoring.

# WORKING STYLE
- First, inspect the directory and PDF, then present a short plan with the detected topics and question counts, and flag any extraction problems before building.
- Work in the phases above and confirm each phase is complete (with counts and validation output) before moving on.
- Do not invent questions or silently drop any. If extraction is uncertain for a question, flag it rather than guess.
- At the end, give me: how to run the app, final question counts per topic, and the list of questions that need my manual review.