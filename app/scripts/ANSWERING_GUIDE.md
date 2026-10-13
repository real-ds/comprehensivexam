# Phase 2 answering guide

The source PDF ships **no answer key**, so every answer here is reasoned out from
first principles. This guide is the contract every solving agent follows so the
merged bank stays consistent.

## Your task

You are given one or more slices of `app/data/raw/<slug>.json`. For **only** the
questions assigned to you, decide the correct option and write a full
explanation, then save your work as JSON.

## Output file

Write exactly one file, and nothing else:

```
app/data/answers/<slug>.json           # un-sharded topics
app/data/answers/<slug>-part1.json     # sharded topics
app/data/answers/<slug>-part2.json
```

Shape:

```json
{
  "topic": "Operating Systems",
  "answers": [
    {
      "id": "q_0001",
      "subtopic": "Scheduling",
      "difficulty": "easy",
      "correctAnswer": "B",
      "explanation": "Core reasoning...\n\nWhy B is correct: ...\n\nWhy the others are wrong:\n- A: ...\n- C: ...",
      "confidence": "high",
      "needsReview": false,
      "reviewReason": null
    }
  ]
}
```

Include **every** question you were assigned, in the same order as the input.
Never omit a question. If you cannot determine an answer, still emit the entry
with `correctAnswer: null`, `confidence: "low"`, `needsReview: true` and a
`reviewReason`.

## Rules

1. `correctAnswer` must be one of the existing option `key` values (usually
   `"A"`, but the source sometimes has only 2 or 3 options). Never invent a key.
2. Answer the question **as written**. If the source contains a typo, still give
   the best answer to the question as printed, then flag it.
3. For any calculation, count, address, timing or code-output question, actually
   compute or run it. `node` and `python` are both available. Do not guess.
4. Never invent, reword or "improve" the question or options. Copy verbatim.
5. `difficulty` is `easy` | `medium` | `hard` — how hard the question is for a
   student, not how long it took you.
6. `subtopic` must come from the vocabulary for your topic listed below.

## Confidence

- `high` — unambiguous, standard textbook fact, answer verified.
- `medium` — correct but the question is loosely worded or has an odd option set.
- `low` — genuinely uncertain, or two options are defensible.

## When to set `needsReview: true`

Always flag, with a short `reviewReason`:

- two or more options are identical or both correct (`correctAnswer` null if you
  cannot break the tie)
- the question text is garbled or truncated
- the code in `code` does not compile or references an undeclared variable
- the options are all wrong or none matches your conclusion
- the question contradicts standard theory
- the question is a near-duplicate of another (`duplicate-stem-of` /
  `exact-duplicate-of` in `extractionFlags`) — answer it anyway, flag it
- you had to guess between two defensible options

`fill-in-the-blank` and `code-detected` flags are **not** review reasons.

## Explanation format

Plain text, no markdown headings, exactly this shape:

```
<Core concept, then the reasoning in 2-5 sentences. Include the key definition
or rule and how it settles this question.>

Why <X> is correct: <one or two sentences>

Why the others are wrong:
- <A>: <one line>
- <C>: <one line>
```

List every option that is not correct, one line each, keyed by its letter. Keep
lines to a single sentence. Reference the option text briefly so the line still
makes sense out of context.

## Subtopic vocabulary

Use these labels verbatim.

**Computer Networks** — OSI and TCP/IP models; Physical layer and transmission;
Data link layer and framing; Error detection and correction; MAC and addressing;
Switching and routing; IP addressing and subnetting; Routing protocols;
Transport layer; TCP and UDP; Application layer protocols; Network security;
Socket programming

**Programming and Data Structures** — Arrays and strings; Linked lists; Stacks
and queues; Trees; Binary trees; Heaps; Graphs; Sorting; Searching; Recursion
and complexity; Hashing; C language fundamentals; Pointers in C; Arrays in C;
Strings in C; Memory management in C; File handling in C

**Digital Logic and Microprocessor** — Number systems and codes; Boolean algebra
and simplification; Karnaugh maps; Combinational circuits; Adder and subtractor;
Multiplexers and demultiplexers; Encoders and decoders; Sequential circuits;
Flip-flops; Counters and registers; Memory and peripherals; 8085 architecture;
8085 instructions and programming; 8086 architecture

**Operating Systems** — Process concepts; Process scheduling; Scheduling
algorithms; Synchronization; Semaphores; Deadlocks; Classical IPC; Threads;
Memory management; Virtual memory; Page replacement; Disk and file systems; I/O
and device management; Multiprocessor and distributed systems; Security;
Deadlock detection and recovery

**Theory of Computation** — Finite automata; Deterministic finite automata;
Non-deterministic finite automata; Regular expressions and languages; Context
free grammars; Parsing; Pushdown automata; Turing machines; Decidability;
Computability

**Computer Architecture and Organization** — Number representation; Boolean
logic and gates; Combinational logic; Sequential logic; Registers; Data path and
control unit; Instruction set; Addressing modes; Instruction formats;
Pipeline; Memory hierarchy; Cache; Virtual memory; Memory interfacing; I/O and
interrupts; Memory and memory organization

**Database Management Systems** — ER modelling; Relational model; Keys and
functional dependencies; Normalization; Relational algebra; SQL DDL; SQL DML;
SQL DCL and TCL; Joins and subqueries; Indexing and hashing; Transactions and
concurrency control; Database recovery

**Web Technologies** — HTML and DOM; CSS; JavaScript basics; JavaScript objects;
JavaScript arrays and strings; JavaScript dates; JavaScript functions and
events; Regular expressions; Web servers; HTTP and request-response; HTTP
methods and status codes; State management; Cookies and sessions; AJAX; Web
architecture

## Known source defects already found

Do not re-report these as extraction bugs, but do flag them on the specific
question via `needsReview` if you answer them:

- `q_0201` declares `int s[5]` but prints `arr[i]` — undeclared identifier.
- `q_0511` has garbled text: "mentioned _________ 2 rectangles".
- `q_0119`, `q_0192`, `q_0355`, `q_0356`, `q_0416` have two identical options.