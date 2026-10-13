# Manual review report

Generated from `app/data/questions.json`.

Every question listed here was solved with something other than full
confidence, or could not be solved at all. These are the items worth a
human decision before the bank is treated as authoritative.

## Summary

- Total questions: **640**
- Answered: **636** of 640
- Flagged needsReview: **97**
- No answer recorded: **4**

### Needs review by topic

| Topic | Flagged |
| --- | --- |
| Operating Systems | 34 |
| Programming and Data Structures | 22 |
| Computer Networks | 13 |
| Theory of Computation | 8 |
| Database Management Systems | 8 |
| Computer Architecture and Organization | 5 |
| Web Technologies | 5 |
| Digital Logic and Microprocessor | 2 |

### Needs review by confidence

| Confidence | Count |
| --- | --- |
| medium | 39 |
| high | 36 |
| low | 22 |

## How to work through this

1. Fix the answers here, or override them in the app from the question
   screen. Overrides are stored locally and applied on top of the bank,
   so no JSON editing is needed.
2. Anything you correct by hand should also be fixed in
   `app/data/questions.json`, otherwise the next `merge.py` run will
   overwrite it with the solver output.

---

## 1. No answer recorded

4 question(s). These could not be solved at all. Either the source question is incomplete, or the options contradict the theory. They show as unanswered in the app until a decision is made.

#### `q_0148` - Programming and Data Structures / Binary trees

- Source: page 39, section DSA, question 16
- Difficulty: hard | Confidence: low
- Answer recorded: **NONE**

**Question:** In a binary tree, which of the following is not a valid argument?

- **A**: It should have at least one node.
- **B**: 2
- **C**: 3
- **D**: 0

**Why flagged:** Question text is garbled: options B, C and D are bare numerals (2, 3, 0) with the arguments they were supposed to state missing.

#### `q_0150` - Programming and Data Structures / Recursion and complexity

- Source: page 40, section DSA, question 18
- Difficulty: medium | Confidence: low
- Answer recorded: **NONE**

Code:

```
f1=O(n),f2=O(log n), f3=O(n^2) f4=O(2n)
```

**Question:** Which of the given options provides the decreasing order of asymptotic complexity of functions f1, f2, f3 and f4?

- **A**: f1, f2, f3, f4
- **B**: f2, f1, f4,f3
- **C**: f1, f2, f4, f3
- **D**: f1, f3, f2, f4

**Why flagged:** f4 is printed as O(2n), which is Theta(n) and tied with f1; the decreasing order is f3, f1, f4, f2, which none of the four options gives (f4 is likely an OCR error for 2^n).

#### `q_0555` - Database Management Systems / Keys and functional dependencies

- Source: page 152, section DBMS, question 45
- Difficulty: hard | Confidence: low
- Answer recorded: **NONE**

**Question:** For a relation R(A,B,C,D,E,F,G), the candidate keys are AB, AC, and DE. Which of the following is not a proper subset of the candidate key?

- **A**: BC
- **B**: DE
- **C**: C
- **D**: AD

**Why flagged:** Multiple options are correct: BC, DE and AD are all not proper subsets of any candidate key, so the question as printed has no unique answer and correctAnswer is null.

#### `q_0562` - Database Management Systems / ER modelling

- Source: page 154, section DBMS, question 52
- Difficulty: hard | Confidence: low
- Answer recorded: **NONE**

**Question:** If an attribute is added to the superclass entity, the condition for propagating this change in subclass entity is

- **A**: Attribute defined membership
- **B**: Predicate defined membership
- **C**: Both Attribute defined and Predicate defined membership
- **D**: Overlapping participation

**Why flagged:** The question contradicts standard EER theory: an attribute added to a superclass is always inherited by subclasses, and none of the four options expresses that condition.

## 2. Duplicate questions

30 question(s). Both copies were kept, as agreed. They still consume exam-blueprint slots, so decide whether to remove one or leave them.

#### `q_0137` - Programming and Data Structures / Strings in C

- Source: page 36, section DSA, question 5
- Difficulty: medium | Confidence: high
- Answer recorded: **A**

Code:

```
char c[]="VITEEE2022";
char *p=c;
printf("%s",p+p[1]-p[3]);
```

**Question:** Consider the following code snippet

- **A** (recorded answer): EE2022
- **B**: EEE2022
- **C**: E2022
- **D**: Error

**Why flagged:** extractionFlags mark this as duplicate-stem-of:q_0197,q_0209; the first two are genuine repeats of the same snippet but q_0209 is a different question.

#### `q_0138` - Programming and Data Structures / Arrays in C

- Source: page 36, section DSA, question 6
- Difficulty: easy | Confidence: high
- Answer recorded: **D**

Code:

```
int main()
{
int s[5];
s++;
printf("the array is at memory location %d",s);
return 0;
}
```

**Question:** //considering the initial memory location of s is 1000 and one integer is of 4 byte Predict the output

- **A**: 1002
- **B**: 1004
- **C**: 1020
- **D** (recorded answer): Error

**Why flagged:** extractionFlags mark this as duplicate-stem-of:q_0198,q_0199; the stem and code are repeated verbatim in those two questions.

#### `q_0197` - Programming and Data Structures / Strings in C

- Source: page 53, section DSA, question 65
- Difficulty: medium | Confidence: high
- Answer recorded: **A**

Code:

```
char c[]="VITEEE2022";
char *p=c;
printf("%s",p+p[1]-p[3]);
```

**Question:** Consider the following code snippet

- **A** (recorded answer): EE2022
- **B**: EEE2022
- **C**: E2022
- **D**: Error

**Why flagged:** extractionFlags mark this as duplicate-stem-of:q_0137,q_0209; the stem and code are verbatim identical to q_0137 (q_0209 is unrelated).

#### `q_0198` - Programming and Data Structures / Arrays in C

- Source: page 53, section DSA, question 66
- Difficulty: easy | Confidence: high
- Answer recorded: **D**

Code:

```
int main()
{
int s[5];
s++;
printf("the array is at memory location %d",s);
return 0;
}
```

**Question:** //considering the initial memory location of s is 1000 and one integer is of 4 byte Predict the output

- **A**: 1002
- **B**: 1004
- **C**: 1020
- **D** (recorded answer): Error

**Why flagged:** extractionFlags mark this as duplicate-stem-of:q_0138,q_0199; the stem and code are repeated verbatim across those questions.

#### `q_0199` - Programming and Data Structures / Pointers in C

- Source: page 54, section DSA, question 67
- Difficulty: medium | Confidence: high
- Answer recorded: **A**

Code:

```
int main()
{
int s[5];
printf("%d %d",s+1,&s+1);
return 0;
}
```

**Question:** //considering the initial memory location of s is 1000 and one integer is of 4 byte Predict the output

- **A** (recorded answer): 1004 1020
- **B**: 1004 1004
- **C**: 1020 garbage value
- **D**: Not even pass compilation

**Why flagged:** extractionFlags mark this as duplicate-stem-of:q_0138,q_0198; only the stem is shared, the code and answer differ from both.

#### `q_0209` - Programming and Data Structures / Pointers in C

- Source: page 57, section DSA, question 77
- Difficulty: easy | Confidence: high
- Answer recorded: **C**

Code:

```
#include <stdio.h>
int main(void)
{
int num=10;
const int * p=&num;
*p=100;
printf("i=%d",num);
return 0;
}
```

**Question:** Consider the following code snippet

- **A**: i=100
- **B**: i=10
- **C** (recorded answer): compile time error
- **D**: Runtime error

**Why flagged:** extractionFlags mark this as duplicate-stem-of:q_0137,q_0197, but this question and its code are entirely different; the flag is spurious.

#### `q_0211` - Programming and Data Structures / Recursion and complexity

- Source: page 57, section DSA, question 79
- Difficulty: medium | Confidence: high
- Answer recorded: **C**

Code:

```
int part(int n)
{
int x = 1, k;
if (n =
= 1) return x;
for (k =1; k<n; ++k)
x = x + fun(k) * fun(n-k);
return x;
}
```

**Question:** Consider the following code snippet What would be the output for fun(5)

- **A**: 49
- **B**: 50
- **C** (recorded answer): 51
- **D**: 52

**Why flagged:** The snippet defines the function as int part(int n) but its body calls fun, which is never declared, so the code as printed does not compile; also flagged exact-duplicate-of:q_0212.

#### `q_0212` - Programming and Data Structures / Recursion and complexity

- Source: page 58, section DSA, question 80
- Difficulty: medium | Confidence: high
- Answer recorded: **C**

Code:

```
int part(int x)
{
int i = 1, n;
if (x = =
1) return i;
for (n =1; n<x; ++n)
i = i + fun(n) * fun(x-n);
return i;
}
```

**Question:** Consider the following code snippet What would be the output for fun(5)

- **A**: 49
- **B**: 50
- **C** (recorded answer): 51
- **D**: 52

**Why flagged:** extractionFlags mark this exact-duplicate-of:q_0211, and the snippet defines int part(int x) while calling the undeclared fun, so it does not compile as printed.

#### `q_0282` - Operating Systems / Process scheduling

- Source: page 78, section OS, question 22
- Difficulty: easy | Confidence: high
- Answer recorded: **B**

**Question:** CPU scheduling is the basis of ___________

- **A**: multiprocessor systems
- **B** (recorded answer): multiprogramming operating systems
- **C**: larger memory sized systems
- **D**: none

**Why flagged:** Near-duplicate stem of q_0393 (extractionFlags duplicate-stem-of); answered independently as instructed.

#### `q_0284` - Operating Systems / Process concepts

- Source: page 79, section OS, question 24
- Difficulty: medium | Confidence: high
- Answer recorded: **C**

**Question:** In operating system, each process has its own __________

- **A**: open files
- **B**: pending alarms, signals, and signal handlers
- **C** (recorded answer): address space and global variables
- **D**: all

**Why flagged:** Near-duplicate stem of q_0387 (extractionFlags duplicate-stem-of); answered independently as instructed.

#### `q_0291` - Operating Systems / Process scheduling

- Source: page 81, section OS, question 31
- Difficulty: easy | Confidence: high
- Answer recorded: **A**

**Question:** Scheduling is done so as to ____________

- **A** (recorded answer): increase CPU utilization
- **B**: decrease CPU utilization
- **C**: keep the CPU more idle
- **D**: none

**Why flagged:** Near-duplicate stem of q_0293 (extractionFlags duplicate-stem-of); answered independently as instructed.

#### `q_0293` - Operating Systems / Process scheduling

- Source: page 81, section OS, question 33
- Difficulty: easy | Confidence: high
- Answer recorded: **B**

**Question:** Scheduling is done so as to ____________

- **A**: increase the turnaround time
- **B** (recorded answer): decrease the turnaround time
- **C**: keep the turnaround time same
- **D**: there is no relation between scheduling and turnaround time

**Why flagged:** Near-duplicate stem of q_0291 (extractionFlags duplicate-stem-of); answered independently as instructed.

#### `q_0300` - Operating Systems / Process scheduling

- Source: page 83, section OS, question 40
- Difficulty: easy | Confidence: high
- Answer recorded: **A**

**Question:** The portion of the process scheduler in an operating system that dispatches processes is concerned with ____________

- **A** (recorded answer): assigning ready processes to CPU
- **B**: assigning ready processes to waiting queue
- **C**: assigning running processes to blocked queue
- **D**: all

**Why flagged:** Near-duplicate stem of q_0339 (extractionFlags duplicate-stem-of); answered independently as instructed.

#### `q_0301` - Operating Systems / Scheduling algorithms

- Source: page 83, section OS, question 41
- Difficulty: easy | Confidence: high
- Answer recorded: **B**

**Question:** What is FIFO algorithm?

- **A**: first executes the job that came in last in the queue
- **B** (recorded answer): first executes the job that came in first in the queue
- **C**: first executes the job that needs minimal processor
- **D**: first executes the job that has maximum processor needs

**Why flagged:** Exact duplicate of q_0304 (extractionFlags exact-duplicate-of); answered independently as instructed.

#### `q_0302` - Operating Systems / Process scheduling

- Source: page 83, section OS, question 42
- Difficulty: easy | Confidence: high
- Answer recorded: **B**

**Question:** The strategy of making processes that are logically runnable to be temporarily suspended is called ____________

- **A**: Non preemptive scheduling
- **B** (recorded answer): Preemptive scheduling
- **C**: Shortest job first
- **D**: First come First served

**Why flagged:** Exact duplicate of q_0305 (extractionFlags exact-duplicate-of); answered independently as instructed.

#### `q_0304` - Operating Systems / Scheduling algorithms

- Source: page 84, section OS, question 44
- Difficulty: easy | Confidence: high
- Answer recorded: **B**

**Question:** What is FIFO algorithm?

- **A**: first executes the job that came in last in the queue
- **B** (recorded answer): first executes the job that came in first in the queue
- **C**: first executes the job that needs minimal processor
- **D**: first executes the job that has maximum processor needs

**Why flagged:** Exact duplicate of q_0301 (extractionFlags exact-duplicate-of); answered independently as instructed.

#### `q_0305` - Operating Systems / Process scheduling

- Source: page 84, section OS, question 45
- Difficulty: easy | Confidence: high
- Answer recorded: **B**

**Question:** The strategy of making processes that are logically runnable to be temporarily suspended is called ____________

- **A**: Non preemptive scheduling
- **B** (recorded answer): Preemptive scheduling
- **C**: Shortest job first
- **D**: First come First served

**Why flagged:** Exact duplicate of q_0302 (extractionFlags exact-duplicate-of); answered independently as instructed.

#### `q_0312` - Operating Systems / Scheduling algorithms

- Source: page 86, section OS, question 52
- Difficulty: medium | Confidence: high
- Answer recorded: **A**

**Question:** The FCFS algorithm is particularly troublesome for ____________

- **A** (recorded answer): time sharing systems
- **B**: multiprogramming systems
- **C**: multiprocessor systems
- **D**: operating systems

**Why flagged:** Near-duplicate stem of q_0350 (extractionFlags duplicate-stem-of); answered independently as instructed.

#### `q_0339` - Operating Systems / Process scheduling

- Source: page 94, section OS, question 79
- Difficulty: easy | Confidence: high
- Answer recorded: **C**

**Question:** The portion of the process scheduler in an operating system that dispatches processes is concerned with ____________

- **A**: assigning ready processes to waiting queue
- **B**: assigning running processes to blocked queue
- **C** (recorded answer): assigning ready processes to CPU
- **D**: all

**Why flagged:** Near-duplicate stem of q_0300 (extractionFlags duplicate-stem-of), with the option letters permuted; answered independently as instructed.

#### `q_0348` - Operating Systems / Deadlock detection and recovery

- Source: page 97, section OS, question 88
- Difficulty: medium | Confidence: high
- Answer recorded: **A**

**Question:** A deadlock avoidance algorithm dynamically examines the __________ to ensure that a circular wait condition can never exist.

- **A** (recorded answer): resource allocation state
- **B**: system storage state
- **C**: operating system
- **D**: resources

**Why flagged:** Near-duplicate stem of q_0361 (extractionFlags duplicate-stem-of); answered independently as instructed.

#### `q_0350` - Operating Systems / Scheduling algorithms

- Source: page 97, section OS, question 90
- Difficulty: medium | Confidence: high
- Answer recorded: **C**

**Question:** The FCFS algorithm is particularly troublesome for ____________

- **A**: operating systems
- **B**: multiprocessor systems
- **C** (recorded answer): time sharing systems
- **D**: multiprogramming systems

**Why flagged:** Near-duplicate stem of q_0312 (extractionFlags duplicate-stem-of), with the option letters permuted; answered independently as instructed.

#### `q_0361` - Operating Systems / Deadlocks

- Source: page 101, section OS, question 101
- Difficulty: medium | Confidence: high
- Answer recorded: **D**

**Question:** A deadlock avoidance algorithm dynamically examines the __________ to ensure that a circular wait condition can never exist.

- **A**: operating system
- **B**: resources
- **C**: system storage state
- **D** (recorded answer): resource allocation state

**Why flagged:** extractionFlags mark this as duplicate-stem-of:q_0348, which lies outside this shard; answered independently as instructed.

#### `q_0387` - Operating Systems / Process concepts

- Source: page 108, section OS, question 127
- Difficulty: easy | Confidence: high
- Answer recorded: **D**

**Question:** In operating system, each process has its own __________

- **A**: address space and global variables
- **B**: open files
- **C**: pending alarms, signals and signal handlers
- **D** (recorded answer): all

**Why flagged:** extractionFlags mark this as duplicate-stem-of:q_0284, which lies outside this shard; answered independently as instructed.

#### `q_0390` - Operating Systems / Classical IPC

- Source: page 108, section OS, question 130
- Difficulty: easy | Confidence: high
- Answer recorded: **B**

**Question:** What is interprocess communication?

- **A**: communication within the process
- **B** (recorded answer): communication between two process
- **C**: communication between two threads of same process
- **D**: none

**Why flagged:** extractionFlags mark this as duplicate-stem-of:q_0441, which is also in this shard; both entries were answered independently as instructed.

#### `q_0393` - Operating Systems / Process scheduling

- Source: page 109, section OS, question 133
- Difficulty: easy | Confidence: high
- Answer recorded: **A**

**Question:** CPU scheduling is the basis of ___________

- **A** (recorded answer): multiprogramming operating systems
- **B**: larger memory sized systems
- **C**: multiprocessor systems
- **D**: none

**Why flagged:** extractionFlags mark this as duplicate-stem-of:q_0282, which lies outside this shard; answered independently as instructed.

#### `q_0441` - Operating Systems / Classical IPC

- Source: page 122, section OS, question 181
- Difficulty: easy | Confidence: high
- Answer recorded: **B**

**Question:** What is Interprocess communication?

- **A**: allows processes to communicate and synchronize their actions when using the same address space
- **B** (recorded answer): allows processes to communicate and synchronize their actions
- **C**: allows the processes to only synchronize their actions without communication
- **D**: none

**Why flagged:** extractionFlags mark this as duplicate-stem-of:q_0390, which is also in this shard; both entries were answered independently as instructed.

#### `q_0594` - Web Technologies / JavaScript arrays and strings

- Source: page 164, section Web Technology, question 5
- Difficulty: easy | Confidence: high
- Answer recorded: **A**

**Question:** Which method adds an element at the end of an array?

- **A** (recorded answer): push()
- **B**: pop()
- **C**: shift()
- **D**: unshift()

**Why flagged:** Exact duplicate of q_0601 (sourceNumber 5 and 12 are byte-identical questions, question, options and printed answer). Answered independently; the bank should keep only one copy.

#### `q_0598` - Web Technologies / JavaScript arrays and strings

- Source: page 164, section Web Technology, question 9
- Difficulty: easy | Confidence: high
- Answer recorded: **A**

Code:

```
let str = "JavaScript";
console.log(str.substring(0,4));
```

**Question:** What will be the output?

- **A** (recorded answer): Java
- **B**: JavaS
- **C**: Script
- **D**: avaS

**Why flagged:** Shares the generic stem "What will be the output?" with q_0607 (extractionFlags duplicate-stem-of:q_0607); the two are unrelated code snippets. Answered independently from its own code, but the shared stem is too generic to identify the question in isolation.

#### `q_0601` - Web Technologies / JavaScript arrays and strings

- Source: page 165, section Web Technology, question 12
- Difficulty: easy | Confidence: high
- Answer recorded: **A**

**Question:** Which method adds an element at the end of an array?

- **A** (recorded answer): push()
- **B**: pop()
- **C**: shift()
- **D**: unshift()

**Why flagged:** Exact duplicate of q_0594 (sourceNumber 5 and 12 are byte-identical questions, question, options and printed answer). Answered independently; the bank should keep only one copy.

#### `q_0607` - Web Technologies / JavaScript arrays and strings

- Source: page 166, section Web Technology, question 18
- Difficulty: easy | Confidence: high
- Answer recorded: **B**

Code:

```
console.log(Array.isArray([10, 20, 30]));
```

**Question:** What will be the output?

- **A**: false
- **B** (recorded answer): true
- **C**: undefined
- **D**: Error

**Why flagged:** Shares the generic stem "What will be the output?" with q_0598 (extractionFlags duplicate-stem-of:q_0598); the two are unrelated code snippets. Answered independently from its own code, but the shared stem is too generic to identify the question in isolation.

## 3. Repeated option text

5 question(s). Two or more options are identical, so the question has no unique answer. This is a defect in the source paper.

#### `q_0119` - Computer Networks / Routing protocols

- Source: page 31, section CN, question 119
- Difficulty: easy | Confidence: medium
- Answer recorded: **A**

**Question:** Static routing table

- **A** (recorded answer): Contains information entered manually
- **B**: is updated periodically by using one of the dynamic routing protocols
- **C**: is updated periodically by using one of the dynamic routing protocols
- **D**: None

**Why flagged:** Options B and C are identical in the source ('is updated periodically by using one of the dynamic routing protocols'); the duplicate does not affect the answer, which is A.

#### `q_0192` - Programming and Data Structures / Stacks and queues

- Source: page 52, section DSA, question 60
- Difficulty: medium | Confidence: high
- Answer recorded: **B**

**Question:** In a circular queue with the capacity of n elements, insertion and deletion are performed using rear and front respectively. Initially rear and front are set to 1. Which of the following condition must be true for the queue to be full.

- **A**: front=rear
- **B** (recorded answer): front=rear+1
- **C**: front=rear+1
- **D**: rear=front+1

**Why flagged:** Options B and C are word-for-word identical ('front=rear+1'), so the single-answer question has two indistinguishable correct options.

#### `q_0355` - Operating Systems / Deadlock detection and recovery

- Source: page 99, section OS, question 95
- Difficulty: medium | Confidence: medium
- Answer recorded: **A**

**Question:** The wait-for graph is a deadlock detection algorithm that is applicable when ____________

- **A** (recorded answer): all resources have a single instance
- **B**: all resources have multiple instances
- **C**: all resources have multiple instances
- **D**: all

**Why flagged:** Options B and C are word-for-word identical ("all resources have multiple instances"), so the option set is defective; A is the only distinct statement and is the intended answer.

#### `q_0356` - Operating Systems / Deadlock detection and recovery

- Source: page 99, section OS, question 96
- Difficulty: easy | Confidence: medium
- Answer recorded: **A**

**Question:** An edge from process Pi to Pj in a wait for graph indicates that ____________

- **A** (recorded answer): Pi is waiting for Pj to release a resource that Pi needs
- **B**: Pi is waiting for Pj to release a resource that Pi needs
- **C**: all resources have multiple instances
- **D**: all

**Why flagged:** Options A and B are word-for-word identical, so two option keys carry the same correct statement.

#### `q_0416` - Operating Systems / Process scheduling

- Source: page 115, section OS, question 156
- Difficulty: easy | Confidence: high
- Answer recorded: **B**

**Question:** In a time-sharing operating system, when the time slot given to a process is completed, the process goes from the running state to the __________

- **A**: Blocked state
- **B** (recorded answer): Ready state
- **C**: Suspended state
- **D**: Suspended state

**Why flagged:** Known source defect: options C and D are identical ("Suspended state"); the original fourth option was most likely "Terminated state", but B is correct either way.

## 4. Flagged for review

58 question(s). Answered, but the solver was not fully confident. Each entry gives the reason.

#### `q_0015` - Computer Networks / Network security

- Source: page 4, section CN, question 15
- Difficulty: easy | Confidence: medium
- Answer recorded: **D**

**Question:** Which type of encryption algorithm uses different keys for encryption and decryption?

- **A**: a.Public key encryption algorithm
- **B**: b. Private key encryption algorithm
- **C**: c. Symmetric key encryption algorithm
- **D** (recorded answer): d. Asymmetric key encryption algorithm

**Why flagged:** Options A (public key encryption algorithm) and D (asymmetric key encryption algorithm) are synonyms, so both are defensible; answered D as the standard textbook term.

#### `q_0017` - Computer Networks / Network security

- Source: page 4, section CN, question 17
- Difficulty: easy | Confidence: medium
- Answer recorded: **D**

**Question:** Which type of encryption algorithm is more secure?

- **A**: Public key encryption algorithm
- **B**: Private key encryption algorithm
- **C**: Symmetric key encryption algorithm
- **D** (recorded answer): Asymmetric key encryption algorithm

**Why flagged:** Options A (public key encryption algorithm) and D (asymmetric key encryption algorithm) describe the same class, so both are defensible; answered D as the standard term.

#### `q_0021` - Computer Networks / Network security

- Source: page 5, section CN, question 21
- Difficulty: hard | Confidence: medium
- Answer recorded: **C**

Code:

```
(I) S can
(II) A third party attacker
(III) R can launch a
```

**Question:** A sender S sends a message m to receiver R, which is digitally signed by S with its private key. In this scenario, one or more of the following security violations can take place. launch a birthday attack to replace m with a fraudulent message. can launch a birthday attack to replace m with a fraudulent message. birthday attack to replace m with a fraudulent message. Which of the following are possible security violations.

- **A**: (I) and (II) only
- **B**: (I) only
- **C** (recorded answer): (II) only
- **D**: (II) and (III) only

**Why flagged:** The stem is garbled by column scrambling: fragments of statements (I), (II) and (III) are interleaved with the closing line 'Which of the following are possible security violations'. Answered from the standard version of this question, where only a third-party attacker can mount the birthday attack.

#### `q_0026` - Computer Networks / Network security

- Source: page 6, section CN, question 26
- Difficulty: hard | Confidence: medium
- Answer recorded: **D**

**Question:** Among the fourth-generation firewalls, Dynamic packet filters firewall that work at_________.

- **A**: Application Layer
- **B**: TCP
- **C**: UDP
- **D** (recorded answer): TCP, UDP

**Why flagged:** The transport layer spans both TCP and UDP, so option D overlaps with the single-protocol options B and C; answered D as the complete description of the layer.

#### `q_0030` - Computer Networks / Network security

- Source: page 7, section CN, question 30
- Difficulty: hard | Confidence: low
- Answer recorded: **A**

**Question:** Encryption and decryption provide secrecy, or confidentiality, but not............

- **A** (recorded answer): Authentication
- **B**: Integrity
- **C**: Privacy
- **D**: All of the above

**Why flagged:** The option set is defective: both Authentication and Integrity are true statements while Privacy is the very confidentiality encryption provides, so All of the above is false as printed; answered A as the canonical textbook claim.

#### `q_0036` - Computer Networks / Network security

- Source: page 9, section CN, question 36
- Difficulty: hard | Confidence: low
- Answer recorded: **C**

**Question:** If _________ is needed, a cryptosystem must be applied over the scheme.

- **A**: integrity
- **B**: confidentiality
- **C** (recorded answer): nonrepudiation
- **D**: authentication

**Why flagged:** The stem is garbled ('If _________ is needed, a cryptosystem must be applied over the scheme'), so the original blank cannot be recovered with certainty; answered nonrepudiation on the reading that only non-repudiation forces a signature cryptosystem over the message.

#### `q_0043` - Computer Networks / Network security

- Source: page 10, section CN, question 43
- Difficulty: medium | Confidence: medium
- Answer recorded: **A**

**Question:** Which system uses a trusted third party interface?

- **A** (recorded answer): Public-Key Certificates
- **B**: Public announcements
- **C**: Publicly available directories
- **D**: Public-Key authority

**Why flagged:** A public-key authority also relies on a trusted third party, so options A and D are both defensible; answered A, which is how the source MCQ bank keys this item.

#### `q_0060` - Computer Networks / Physical layer and transmission

- Source: page 15, section CN, question 60
- Difficulty: easy | Confidence: medium
- Answer recorded: **A**

**Question:** Which Topology is used in Ethernet?

- **A** (recorded answer): Bus
- **B**: Star
- **C**: Mesh
- **D**: Ring

**Why flagged:** Classical Ethernet uses a bus but modern switched Ethernet is physically a star, so both A and B are defensible depending on which Ethernet is meant; answered A per the standard textbook and source MCQ bank key.

#### `q_0081` - Computer Networks / Error detection and correction

- Source: page 21, section CN, question 81
- Difficulty: hard | Confidence: medium
- Answer recorded: **C**

**Question:** A receiver receives the code 11001100111. When it uses the Hamming encoding algorithm, the result is 0101. Which bit is in error?

- **A**: 1
- **B**: 3
- **C** (recorded answer): 5
- **D**: No Error

**Why flagged:** Inconsistent data: recomputing the Hamming parity checks of 11001100111 gives syndrome 0001 (error at bit 8, not an option), not the printed 0101. Answered from the printed syndrome as the question instructs; 0101 read as p1p2p4p8 would instead give bit 10.

#### `q_0090` - Computer Networks / Application layer protocols

- Source: page 23, section CN, question 90
- Difficulty: medium | Confidence: low
- Answer recorded: **B**

**Question:** To efficiently manage the hardware and software components configuration management is required. It includes:

- **A**: Monitoring the user behavior and his/her usage pattern
- **B** (recorded answer): Replacement of the network components
- **C**: Documentation is done only for the hardware changes in the network, software update is not required.
- **D**: Managing the access of the user's to the network.

**Why flagged:** No printed option states the standard answer (documentation of both hardware and software changes). Option C appears to be a mangled version of that answer but as printed it asserts software updates need not be documented, which is false, so B was chosen as the best printed option.

#### `q_0109` - Computer Networks / Physical layer and transmission

- Source: page 28, section CN, question 109
- Difficulty: medium | Confidence: medium
- Answer recorded: **A**

**Question:** Data transmission speed of LAN technology is

- **A** (recorded answer): upto 100 Mbps
- **B**: upto 20 Mbps
- **C**: upto 1000 Mbps
- **D**: None

**Why flagged:** Loosely worded and date sensitive: both A (100 Mbps, the conventional LAN figure) and C (1000 Mbps, Gigabit Ethernet) are defensible; answered with the classic textbook figure.

#### `q_0127` - Computer Networks / Switching and routing

- Source: page 33, section CN, question 127
- Difficulty: medium | Confidence: medium
- Answer recorded: **A**

**Question:** Discarding policy that

- **A** (recorded answer): routers may prevent congestion and at the same time may not harm the integrity of the transmission
- **B**: can also prevent congestion in virtual-circuit networks
- **C**: If the sender feels that a sent packet is lost or corrupted, the packet needs to be retransmitted
- **D**: None

**Why flagged:** The stem 'Discarding policy that' is truncated in the source. Answered from the options, where A states the defining property of a discarding (junk-filtering) policy.

#### `q_0163` - Programming and Data Structures / Graphs

- Source: page 44, section DSA, question 31
- Difficulty: medium | Confidence: low
- Answer recorded: **C**

**Question:** Why graph traversal is difficult than tree traversal ?

- **A**: Because tree is binary
- **B**: Because tree is undefined
- **C** (recorded answer): Because tree have the root
- **D**: All the options

**Why flagged:** All three stated reasons are poor; the real cause is cycles and the absence of a root, and option A ('tree is binary') is factually wrong, so only C is defensible.

#### `q_0165` - Programming and Data Structures / Sorting

- Source: page 44, section DSA, question 33
- Difficulty: easy | Confidence: high
- Answer recorded: **B**

Code:

```
void insertionsort(int arr[],int size)
{
I,j,value;
for(i=1;i<size;i++)
{
value=arr[i];
j=i;
while(...)
{
arr[j]=arr[j-1];
j=j-1;
}
```

**Question:** Consider the code given below: int what is line of code required for while statement to run the insertion sort

- **A**: (j>0)\|\|(arr[j-1]>value)
- **B** (recorded answer): (j>0)&&(arr[j-1]>value)
- **C**: (j>0)&&(arr[j+1]>value)
- **D**: (j>0)&&(arr[j+1]<value)

**Why flagged:** The code declares 'I,j,value;' instead of 'int i,j,value;', so the snippet as printed does not compile (gcc: 'I' undeclared); appears to be an OCR defect.

#### `q_0169` - Programming and Data Structures / Trees

- Source: page 45, section DSA, question 37
- Difficulty: medium | Confidence: low
- Answer recorded: **B**

**Question:** How many different trees are possible with 10 nodes?

- **A**: 512
- **B** (recorded answer): 1024
- **C**: 1014
- **D**: 90

**Why flagged:** The question does not define what makes two trees different; the standard answer (Catalan number for binary tree shapes) is 16796, which is not among the options, so 1024 is only a guess at the intended counting rule.

#### `q_0171` - Programming and Data Structures / Trees

- Source: page 46, section DSA, question 39
- Difficulty: easy | Confidence: medium
- Answer recorded: **B**

**Question:** There are 8, 15, 13, 14 nodes in 4 different trees. Which of them could have formed a full binary tree?

- **A**: 8
- **B** (recorded answer): 15
- **C**: 13
- **D**: 14

**Why flagged:** Both 13 and 15 satisfy the standard definition of a full binary tree (odd node count), so two options are defensible; 15 is chosen as the unique answer only if 'full' is read as 'perfect'.

#### `q_0200` - Programming and Data Structures / Pointers in C

- Source: page 54, section DSA, question 68
- Difficulty: medium | Confidence: high
- Answer recorded: **C**

Code:

```
#include<stdio.h>
int main ()
{
int arrayVal[]={5,8,12,14,18,19};
*pointerVal=(int*) (&arrayVal +1);
printf("%d",*( pointerVal -1));
0;
}
```

**Question:** int return Output of the above will be

- **A**: 12
- **B**: 5
- **C** (recorded answer): 19
- **D**: 18

**Why flagged:** As printed the code never declares pointerVal (gcc: 'pointerVal' undeclared), so it does not compile; the answer assumes the obvious missing declaration int *pointerVal.

#### `q_0201` - Programming and Data Structures / Arrays in C

- Source: page 54, section DSA, question 69
- Difficulty: easy | Confidence: medium
- Answer recorded: **B**

Code:

```
int main()
{
int i;
int s[5]={1};
for(i=0;i<5;i++)
{
printf("%d",arr[i]);
}
return 0;
}
```

**Question:** What will be the output of the following code snippet

- **A**: 1 followed by four garbage value
- **B** (recorded answer): 1 0 0 0 0
- **C**: 1 1 1 1 1
- **D**: 0 0 0 0 0

**Why flagged:** The snippet declares int s[5] but the loop prints arr[i], an undeclared identifier, so as printed it does not compile (gcc: 'arr' undeclared); answered as printed assuming the intended array is s.

#### `q_0218` - Programming and Data Structures / C language fundamentals

- Source: page 59, section DSA, question 86
- Difficulty: easy | Confidence: medium
- Answer recorded: **B**

**Question:** Structure in C language is

- **A**: a collection of elements that can be of same data type
- **B** (recorded answer): a collection of elements that can be of different data type
- **C**: Elements of a structure are called members
- **D**: All the options

**Why flagged:** Options B and C are both true statements about structures, so the single-answer format does not fit; B is chosen as the definition.

#### `q_0222` - Programming and Data Structures / C language fundamentals

- Source: page 60, section DSA, question 90
- Difficulty: easy | Confidence: medium
- Answer recorded: **C**

Code:

```
int main()
{
{
int items;
char name[10];
}a;
strcpy(a.name, "TAJ");
a.items=10;
printf("%s", a.name);
return 0;
}
```

**Question:** What is the output of C program with structures.? structure hotel

- **A**: TAJ
- **B**: Empty string
- **C** (recorded answer): Compiler error
- **D**: None of the options

**Why flagged:** The snippet is garbled: '{ int items; char name[10]; } a;' is missing the struct tag (the stem shows 'structure hotel'), so as printed it does not compile; the intended answer is most likely A (TAJ).

#### `q_0223` - Programming and Data Structures / Arrays in C

- Source: page 61, section DSA, question 91
- Difficulty: medium | Confidence: low
- Answer recorded: **A**

Code:

```
#include<stdio.h>
int main()
{
ant arr[5], i=0;
while(i<5)
arr[i]=++i;
for(i=0;i<5;i++)
printf("%d,",arr[i]);
return 0;
}
```

**Question:** What will be the output of the program in C?

- **A** (recorded answer): 1,2,3,4,5
- **B**: Garbage value, 1, 2, 3, 4,
- **C**: 0, 1, 2, 3, 4,
- **D**: 2, 3, 4, 5, 6,

**Why flagged:** arr[i] = ++i modifies and reads i in one expression with no sequencing, so it is undefined behaviour; MinGW gcc prints 'Garbage value, 1, 2, 3, 4,' (option B) while the textbook answer is A.

#### `q_0224` - Programming and Data Structures / Arrays in C

- Source: page 61, section DSA, question 92
- Difficulty: easy | Confidence: medium
- Answer recorded: **C**

Code:

```
#include<stdio.h>
void main()
{
arr[10];
printf("%d %d",arr[-2],arr[11]);
}
```

**Question:** What is the output of this program? int

- **A**: 0 0
- **B**: Garbage value 0
- **C** (recorded answer): Garbage value Garbage value
- **D**: Compilation Error

**Why flagged:** The stem is garbled, with a dangling 'int' at the end; the code field as printed has 'arr[10];' with no type, which would be a compile error.

#### `q_0232` - Programming and Data Structures / Strings in C

- Source: page 63, section DSA, question 100
- Difficulty: medium | Confidence: low
- Answer recorded: **C**

Code:

```
#include<stdio.h>
#include<string.h>
void main()
{
char str1[20]= "VIT", char str2[20]= "Chennai";
printf("%s",strcpy(str2,strcat(str1,str2)));
}
```

**Question:** what will be the output of the program

- **A**: ChennaiVIT
- **B**: Chennai
- **C** (recorded answer): VIT Chennai
- **D**: VIT

**Why flagged:** The declaration 'char str1[20]= "VIT", char str2[20]= "Chennai";' is a syntax error (duplicate type specifier); no option offers 'Compilation Error', so C is the intended answer for the corrected code.

#### `q_0243` - Digital Logic and Microprocessor / Sequential circuits

- Source: page 67, section Digital MP, question 8
- Difficulty: easy | Confidence: high
- Answer recorded: **B**

**Question:** If an active-HIGH S-R latch has a 0 on the S input and a 1 on the R input and then the R input goes to 0, the latch will be ________.

- **A**: SET
- **B** (recorded answer): RESET
- **C**: Clear
- **D**: Invalid

**Why flagged:** Options B (RESET) and C (Clear) are effectively synonymous descriptions of the same Q = 0 state, so the option set cannot distinguish between two correct labels.

#### `q_0253` - Digital Logic and Microprocessor / Flip-flops

- Source: page 70, section Digital MP, question 18
- Difficulty: medium | Confidence: medium
- Answer recorded: **B**

**Question:** Which of the following is correct for a gated D-type flip-flop?

- **A**: The Q output is either SET or RESET as soon as the input goes HIGH or LOW
- **B** (recorded answer): The output complement follows the input when enabled
- **C**: Only one of the inputs can be HIGH at a time
- **D**: The output toggles if one of the inputs is held HIGH

**Why flagged:** Option B is imprecisely worded (the complementary output follows the complement of D, not D), and option A would be correct for an ungated D flip-flop, so the intended answer cannot be pinned down cleanly.

#### `q_0270` - Operating Systems / I/O and device management

- Source: page 75, section OS, question 10
- Difficulty: medium | Confidence: medium
- Answer recorded: **B**

**Question:** In a memory mapped input/output __________

- **A**: the CPU uses polling to watch the control bit constantly, looping to see if a device is ready
- **B** (recorded answer): the CPU writes one data byte to the data register and sets a bit in control register to show that a byte is available
- **C**: the CPU receives an interrupt when the device is ready for the next byte
- **D**: the CPU runs a user written code and does accordingly

**Why flagged:** Standard MCQ banks key this item as (b), but memory-mapped I/O is purely an addressing scheme and is equally usable with polling (a) or interrupts (c); the options describe different I/O techniques rather than one correct memory-mapped behaviour.

#### `q_0292` - Operating Systems / Process scheduling

- Source: page 81, section OS, question 32
- Difficulty: medium | Confidence: medium
- Answer recorded: **A**

**Question:** What is Turnaround time?

- **A** (recorded answer): the total waiting time for a process to finish execution
- **B**: the total time spent in the ready queue
- **C**: the total time spent in the running queue
- **D**: the total time from the completion till the submission of a process

**Why flagged:** No option states the correct definition (submission to completion); option A only approximates it by speaking of total waiting time.

#### `q_0320` - Operating Systems / Synchronization

- Source: page 89, section OS, question 60
- Difficulty: hard | Confidence: medium
- Answer recorded: **B**

**Question:** A minimum of _____ variable(s) is/are required to be shared between processes to solve the critical section problem.

- **A**: 1
- **B** (recorded answer): 2
- **C**: 3
- **D**: 4

**Why flagged:** Option A (1) is defensible if an atomic test-and-set or a wait/signal semaphore is assumed; the standard bank answer for this item is two variables for pure software busy-waiting.

#### `q_0322` - Operating Systems / Semaphores

- Source: page 89, section OS, question 62
- Difficulty: hard | Confidence: low
- Answer recorded: **D**

Code:

```
P(mutex)
{Critical Section}
V(mutex)
```

**Question:** Each process Pi, i = 0,1,2,3,......,9 is coded as follows. repeat forever The code for P10 is identical except that it uses V(mutex) instead of P(mutex). What is the largest number of processes that can be inside the critical section at any moment (the mutex being initialized to 1)?

- **A**: 1
- **B**: 2
- **C**: 3
- **D** (recorded answer): None

**Why flagged:** Published keys disagree: standard MCQ banks answer 3 (treating the semaphore as if it stays small), GATE-oriented solutions answer none of the mentioned because a counting semaphore can be inflated without limit by P10, and 2 would follow only under a binary semaphore assumption.

#### `q_0333` - Operating Systems / Deadlock detection and recovery

- Source: page 93, section OS, question 73
- Difficulty: medium | Confidence: medium
- Answer recorded: **C**

**Question:** A system is in the safe state if ____________

- **A**: the system can allocate resources to each process in some order and still avoid a deadlock
- **B**: there exist a safe sequence
- **C** (recorded answer): all
- **D**: none

**Why flagged:** Options A and B are both correct restatements of the same definition, so the question has two defensible keys; C (all) is used to cover both, but a reviewer may prefer A or B alone.

#### `q_0336` - Operating Systems / Deadlocks

- Source: page 94, section OS, question 76
- Difficulty: medium | Confidence: medium
- Answer recorded: **B**

**Question:** To avoid deadlock ____________

- **A**: there must be a fixed number of resources to allocate
- **B** (recorded answer): resource allocation must be done only once
- **C**: all deadlocked processes must be aborted
- **D**: inversion technique can be used

**Why flagged:** The widely circulated answer key for this item gives (a), but a fixed number of resources is not a recognised deadlock avoidance technique, while (b) is the standard all-or-nothing request; the option set is poorly worded.

#### `q_0357` - Operating Systems / Deadlock detection and recovery

- Source: page 99, section OS, question 97
- Difficulty: medium | Confidence: medium
- Answer recorded: **B**

**Question:** If the wait for graph contains a cycle ____________

- **A**: then a deadlock does not exist
- **B** (recorded answer): then a deadlock exists
- **C**: hen a deadlock exists
- **D**: either deadlock exists or system is in a safe state

**Why flagged:** Option C is a truncated copy of option B ("hen" is a lost "T"), so two keys carry the same correct statement; B is given as the properly spelled one.

#### `q_0359` - Operating Systems / Deadlock detection and recovery

- Source: page 100, section OS, question 99
- Difficulty: medium | Confidence: medium
- Answer recorded: **A**

**Question:** For an effective operating system, when to check for deadlock?

- **A** (recorded answer): at fixed time intervals
- **B**: every time a resource request is made
- **C**: every time a resource request is made at fixed time intervals
- **D**: none

**Why flagged:** Widely circulated answer keys for this exact item select option C ("every time a resource request is made at fixed time intervals"), but that wording is self-contradictory; the textbook rule is periodic invocation at fixed time intervals, so A is given here.

#### `q_0363` - Operating Systems / Memory management

- Source: page 101, section OS, question 103
- Difficulty: medium | Confidence: medium
- Answer recorded: **C**

**Question:** The main memory accommodates ____________

- **A**: cpu
- **B**: user processes
- **C** (recorded answer): operating system
- **D**: all

**Why flagged:** Option B (user processes) is also factually true of main memory, and the natural answer would be D "all" if it did not wrongly include the CPU; C is the keyed answer.

#### `q_0386` - Operating Systems / Process concepts

- Source: page 107, section OS, question 126
- Difficulty: medium | Confidence: medium
- Answer recorded: **B**

**Question:** The systems which allow only one process execution at a time, are called __________

- **A**: uniprogramming systems
- **B** (recorded answer): uniprocessing systems
- **C**: unitasking systems
- **D**: none

**Why flagged:** Options A ("uniprogramming systems") and B ("uniprocessing systems") are both defensible readings of the stem; B is the key used by this source bank while A is the technically precise term.

#### `q_0407` - Operating Systems / Process scheduling

- Source: page 113, section OS, question 147
- Difficulty: medium | Confidence: medium
- Answer recorded: **A**

**Question:** When the process issues an I/O request __________

- **A** (recorded answer): It is placed in an I/O queue
- **B**: It is placed in a waiting queue
- **C**: It is placed in the ready queue
- **D**: It is placed in the Job queue

**Why flagged:** Option B ("placed in a waiting queue") expresses the same outcome as A in different words; A is the term used for the device/I-O queue and is the keyed answer.

#### `q_0408` - Operating Systems / Process concepts

- Source: page 113, section OS, question 148
- Difficulty: medium | Confidence: medium
- Answer recorded: **A**

**Question:** What will happen when a process terminates?

- **A** (recorded answer): It is removed from all queues
- **B**: It is removed from all, but the job queue
- **C**: Its process control block is de-allocated
- **D**: Its process control block is never de-allocated

**Why flagged:** Both A and C describe what the textbook says happens on termination (removal from all queues and freeing the PCB), so two options are defensible; A is the keyed answer.

#### `q_0446` - Operating Systems / Classical IPC

- Source: page 123, section OS, question 186
- Difficulty: medium | Confidence: medium
- Answer recorded: **B**

**Question:** Which of the following are TRUE for direct communication?

- **A**: A communication link can be associated with N number of process(N = max. number of processes supported by system)
- **B** (recorded answer): A communication link is associated with exactly two processes
- **C**: Exactly N/2 links exist between each pair of processes(N = max. number of processes supported by system)
- **D**: Exactly two link exists between each pair of processes

**Why flagged:** Options B and D are both textbook-true for direct communication (a link is associated with exactly two processes, and exactly two links exist between each pair, one per direction), so the single-answer option set admits two keys.

#### `q_0448` - Theory of Computation / Finite automata

- Source: page 124, section TOC, question 1
- Difficulty: easy | Confidence: medium
- Answer recorded: **D**

Code:

```
Statement 1: A Finite automata can be represented graphically;
can be its states;
```

**Question:** Statement 2: The nodes Statement 3: The edges or arcs can be used for transitions Which of the following make the correct combination?

- **A**: Statement 1 is false but Statement 2 and 3 are correct
- **B**: Statement 1 and 2 are correct while 3 is wrong
- **C**: None of the mentioned statements are correct
- **D** (recorded answer): All of the mentioned statements are correct

**Why flagged:** the stem is scrambled: the three statements are split across the question field and the code field ('Statement 1: A Finite automata can be represented graphically' / 'can be its states;'), so the question had to be reconstructed before answering.

#### `q_0464` - Theory of Computation / Context free grammars

- Source: page 128, section TOC, question 17
- Difficulty: hard | Confidence: low
- Answer recorded: **A**

**Question:** which of the following grammar are useless productions S→aS \| A \| C A→a B→aa C→aCb

- **A** (recorded answer): S→aS \| A \| C A→a B→aa C→aCb
- **B**: S→aS \| A \| C A→a
- **C**: S→aS \| A \| C B→aa
- **D**: S→C B→aa C→aCb

**Why flagged:** all four options contain useless symbols or productions (verified by computing generating/reachable non-terminals), so the question has no unique correct option; option A was chosen only because it is the grammar that the extraction also printed inside the stem.

#### `q_0468` - Theory of Computation / Context free grammars

- Source: page 129, section TOC, question 21
- Difficulty: medium | Confidence: medium
- Answer recorded: **D**

**Question:** A grammar G is called a CFG if production has

- **A**: only one terminal in LHS
- **B**: any combination of terminals and non-terminals on its RHS
- **C**: RHS always starting with non-terminals
- **D** (recorded answer): only one terminal in LHS and any combination of terminals and non-terminals on its RHS

**Why flagged:** options A and D say 'terminal in LHS' where the CFG condition requires a non-terminal; the intended key is D (it is the only option stating both conditions) but the printed wording is technically wrong.

#### `q_0469` - Theory of Computation / Context free grammars

- Source: page 129, section TOC, question 22
- Difficulty: medium | Confidence: low
- Answer recorded: **C**

**Question:** Which of the following grammar is ambiguous

- **A**: S→aS\|Sa\|a
- **B**: S→0S0\|1S1\|0\|1\|ε
- **C** (recorded answer): S→S0S0S\|1
- **D**: All of these

**Why flagged:** two options are correct: both A (S->aS\|Sa\|a, witness 'aa') and C (S->S0S0S\|1, witness '101010101') are ambiguous, verified by counting parse trees, so the key must be checked against the source.

#### `q_0472` - Theory of Computation / Finite automata

- Source: page 130, section TOC, question 25
- Difficulty: easy | Confidence: low
- Answer recorded: **B**

**Question:** Which of the following machines accepts regular languages

- **A**: NFA
- **B** (recorded answer): DFA
- **C**: PDA
- **D**: All

**Why flagged:** the option set has more than one defensible answer: NFA accepts exactly the regular languages as well, and since regular is a subset of context free a PDA can accept them too, so 'All' is also arguable; B is the conventional key.

#### `q_0474` - Theory of Computation / Pushdown automata

- Source: page 130, section TOC, question 27
- Difficulty: hard | Confidence: medium
- Answer recorded: **A**

**Question:** which of the following languages are accepted by NPDA but not by DPDA

- **A** (recorded answer): palindrome of even length
- **B**: L={0^m 1^n 2^p \| m,n,p>=0 and m=n}
- **C**: L={0^m 1^n 2^m \| m=n+p,n,p>=0}
- **D**: none

**Why flagged:** option C is internally inconsistent as printed ({0^m 1^n 2^m with the condition m = n + p leaves p unused and reduces to the regular language {0^m 2^m}); the key A rests on even-length palindromes requiring the nondeterministic halfway-point guess.

#### `q_0479` - Theory of Computation / Regular expressions and languages

- Source: page 131, section TOC, question 32
- Difficulty: medium | Confidence: medium
- Answer recorded: **B**

**Question:** which of the following language is not regular

- **A**: L={a^n \| n>=0}
- **B** (recorded answer): L={a^n*n \| n>=0}
- **C**: L={a^2n \| n>=0}
- **D**: all

**Why flagged:** option B is printed as 'L={a^n*n \| n>=0}', which is not a valid language definition; read as {a^n b^n \| n >= 0} it is the only non-regular option, but as printed the item has no well-defined non-regular option.

#### `q_0485` - Theory of Computation / Regular expressions and languages

- Source: page 133, section TOC, question 38
- Difficulty: easy | Confidence: medium
- Answer recorded: **A**

Code:

```
Σ {0,1}Σ^3 = {000, 001, 010, 011, 100, 101, 110, 111 }
```

**Question:** _none_

- **A** (recorded answer): correct
- **B**: wrong

**Why flagged:** extractionFlags show an empty stem: the question text was lost and only the code field carries the statement, which had to be read as the third power of the binary alphabet before it could be judged true or false.

#### `q_0488` - Computer Architecture and Organization / Memory interfacing

- Source: page 134, section CAO, question 1
- Difficulty: easy | Confidence: medium
- Answer recorded: **C**

**Question:** In memory transfer location address is supplied by____ that puts this on address bus

- **A**: ALU
- **B**: CPU
- **C** (recorded answer): MAR
- **D**: MDR

**Why flagged:** The published key for this item in the source question bank is CPU, but the register that puts the address on the address bus is unambiguously the MAR; answered as printed using standard theory.

#### `q_0489` - Computer Architecture and Organization / Data path and control unit

- Source: page 134, section CAO, question 2
- Difficulty: easy | Confidence: low
- Answer recorded: **B**

**Question:** Control memory is part of ______ that has addressable storage registers and used as temporary storage for data

- **A**: ROM
- **B** (recorded answer): RAM
- **C**: CPU
- **D**: Memory

**Why flagged:** Stem is garbled and contradicts standard theory (control memory/control store is normally a ROM inside the CPU); the source text defines control memory as a RAM of addressable storage registers, which is why RAM was chosen.

#### `q_0497` - Computer Architecture and Organization / Addressing modes

- Source: page 136, section CAO, question 10
- Difficulty: easy | Confidence: medium
- Answer recorded: **B**

**Question:** which addressing is a way of direct addressing

- **A**: Immediate addressing
- **B** (recorded answer): Direct addressing
- **C**: Register addressing
- **D**: None of these

**Why flagged:** Stem is tautological/garbled ("which addressing is a way of direct addressing"); answered B as printed, which is the only option consistent with the wording.

#### `q_0505` - Computer Architecture and Organization / Memory interfacing

- Source: page 138, section CAO, question 18
- Difficulty: easy | Confidence: low
- Answer recorded: **B**

**Question:** Which operation puts memory address in memory address register and data in DR

- **A**: Memory read
- **B** (recorded answer): Memory write
- **C**: Both
- **D**: None

**Why flagged:** Genuinely ambiguous: in a memory read the address also goes into the MAR and the returned data lands in the DR, so option C (Both) is defensible as well as B; answered B as the published key has it.

#### `q_0506` - Computer Architecture and Organization / Memory interfacing

- Source: page 138, section CAO, question 19
- Difficulty: easy | Confidence: low
- Answer recorded: **D**

**Question:** The memory bus is also referred as______

- **A**: Data bus
- **B**: Address bus
- **C**: Memory bus
- **D** (recorded answer): All of these

**Why flagged:** Stem appears mis-extracted or garbled: the standard synonym for the memory bus is the system bus, which is not offered, and none of the individual options is a true synonym; answered D as the only option that can cover the whole memory bus.

#### `q_0511` - Database Management Systems / ER modelling

- Source: page 140, section DBMS, question 1
- Difficulty: easy | Confidence: high
- Answer recorded: **A**

**Question:** While drawing the ER diagram for a relation "student registers a course", "registers" should be mentioned _________ 2 rectangles.

- **A** (recorded answer): inside a diamond between
- **B**: over the line connecting
- **C**: inside an oval between
- **D**: inside a rectangle between

**Why flagged:** Question text is garbled in the source ("mentioned _________ 2 rectangles"); the trailing "2 rectangles" fragment appears to be leftover page text, but the ER-modelling answer itself is unambiguous.

#### `q_0530` - Database Management Systems / Database recovery

- Source: page 146, section DBMS, question 20
- Difficulty: medium | Confidence: low
- Answer recorded: **C**

**Question:** Which of the following is not a recovery technique?

- **A**: Deferred update
- **B**: Immediate update
- **C** (recorded answer): Two-phase commit
- **D**: Recovery management

**Why flagged:** Option D ("Recovery management") also reads as something that is not a "technique" since it is the subsystem, so both C and D can be defended; answered C as the better fit but the option set is ambiguous.

#### `q_0541` - Database Management Systems / Relational model

- Source: page 148, section DBMS, question 31
- Difficulty: medium | Confidence: low
- Answer recorded: **D**

**Question:** Which of the following statement(s) are incorrect

- **A**: In non-relational databases, schemas are need to be defined before adding data
- **B**: NoSQL databases allows the insertion of data without a predefined schema
- **C**: NewSQL databases allows the insertion of data without a predefined schema
- **D** (recorded answer): All the statements

**Why flagged:** Two statements (A and C) are incorrect but are not offered together, and option D "All the statements" is itself false because B is correct; answered D as the likely exam key, but the option set does not admit a strictly correct single answer.

#### `q_0545` - Database Management Systems / Transactions and concurrency control

- Source: page 150, section DBMS, question 35
- Difficulty: hard | Confidence: medium
- Answer recorded: **A**

Code:

```
S : r1(x),w1(x),r2(x),r1(y),w1(y),w2(x),r2(y), c1, c2;
```

**Question:** Consider the following schedule and state that which of the following statement(s) is (are) true? I: S is recoverable. II: If the order of w1(x) and w2(x) are interchanged, then S will be a non-recoverable schedule.

- **A** (recorded answer): Only I
- **B**: Only II
- **C**: Both I and II
- **D**: None of the options

**Why flagged:** Statement II cannot be made true by any literal reading of the printed schedule: interchanging w1(x) and w2(x) leaves c1 before c2, and it additionally breaks T1's own operation order (r1(x), w1(x), r1(y), w1(y) becomes r1(x), r1(y), w1(y), w1(x)). The stem most likely should read "if the order of c1 and c2 are interchanged", which does make the schedule non-recoverable and would give C; the source wording needs checking against the official key.

#### `q_0565` - Database Management Systems / ER modelling

- Source: page 155, section DBMS, question 55
- Difficulty: hard | Confidence: low
- Answer recorded: **B**

**Question:** Identify the simple attribute.

- **A**: name
- **B** (recorded answer): grade
- **C**: Color
- **D**: VehicleRegistrationNumber

**Why flagged:** No mini-world is given and both "grade" and "Color" qualify as simple attributes, so the question has more than one defensible answer; answered B as the intended choice.

#### `q_0573` - Database Management Systems / Database recovery

- Source: page 157, section DBMS, question 63
- Difficulty: easy | Confidence: low
- Answer recorded: **A**

**Question:** Which of the following is correct with respect to Two phase commit protocol?

- **A** (recorded answer): Ensures serializability
- **B**: Prevents Deadlock
- **C**: Detects Deadlock
- **D**: Recover from Deadlock

**Why flagged:** No option states the actual guarantee of two-phase commit (atomicity of the distributed transaction); answered A as the only defensible option, but the option set does not offer atomicity.

#### `q_0639` - Web Technologies / State management

- Source: page 172, section Web Technology, question 50
- Difficulty: medium | Confidence: medium
- Answer recorded: **B**

**Question:** Which is more secure for storing sensitive user data?

- **A**: Cookies
- **B** (recorded answer): Sessions
- **C**: Local storage
- **D**: Cache

**Why flagged:** Genuinely contestable opinion-shaped question. B matches the printed key and is the textbook answer, but A is defensible when the cookie is set Secure, HttpOnly and SameSite with signed values, and stateless signed tokens are a common alternative; the question supplies no threat model, so the secure answer depends on assumptions not stated in the stem.

