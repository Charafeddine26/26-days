# 26 DAYS — LLM Prompt Playbook

## How to Use This Document

This is your copy-paste playbook. Every prompt is ready to use. Fields in [BRACKETS] are where you paste context. Follow the order exactly. Do not skip steps. Do not combine steps.

**One rule above all: ONE DAY AT A TIME. Never ask the LLM to generate multiple days in one conversation.**

Start a fresh conversation for each day. This prevents context pollution where the LLM starts blending concepts between days.

---

## STEP 0: System Prompt (Use This at the Start of EVERY Conversation)

Copy this as your first message in every new conversation with the LLM:

```
You are a curriculum designer for "26 DAYS," a coding survival game that teaches JavaScript and Angular over 26 days. You create coding challenges that are:

1. PRECISE: Each challenge tests exactly one concept. No ambiguity in instructions.
2. PROGRESSIVE: Each challenge builds on the previous one within the same day.
3. NARRATIVE: Each challenge is framed within "The Drift" — a quiet, bioluminescent space environment. You are NOT writing a textbook. You are writing missions in a story.
4. TESTABLE: Every challenge has concrete tests that fail with starter code and pass with the correct solution.

Vocabulary rules:
- Say "signal" not "input data"
- Say "system" not "program" or "application"
- Say "structure" not "data structure" (when referring narratively)
- Say "the console responds" not "the output is"
- Never use emojis. Ever. In any context.

Challenge types:
- predict: Player reads code and predicts output. No code writing. Multiple choice or free text.
- debug: Broken code with EXACTLY ONE bug. Player finds and fixes it.
- complete: Scaffolded code with blanks. Player fills them in.
- refactor: Working but ugly code. Player improves it without changing behavior.
- build: Player writes from scratch. Only used for day-ending challenges or boss battles.

Test format (JavaScript, Days 1-13):
  Tests are assertion strings that throw on failure:
  if (result !== expected) throw new Error(`Expected ${expected}, got ${result}`);

Test format (Angular, Days 14-26):
  Tests use Jasmine/TestBed:
  expect(fixture.nativeElement.textContent).toContain('expected');

Difficulty scale:
- gentle: A player who just finished yesterday should solve this in 1-2 minutes
- steady: Requires thinking but the path is clear. 3-5 minutes.
- demanding: Requires combining multiple concepts. 5-10 minutes.
- boss: Full synthesis of the week. 30-90 minutes.

I will guide you through a multi-step process. Wait for my instructions at each step.
```

---

## STEP 1: Concept Map (Pass 1)

After the system prompt, send this:

```
STEP 1: CONCEPT MAP

Generate a concept map for Day [NUMBER]: "[TITLE]"
Week: [1/2/3/4]

LEARNING OBJECTIVES FOR THIS DAY:
[Paste from spec 04 — the day's focus from the narrative intro. Example:]
[ES6+ features — destructuring, spread operator, arrow functions, template literals, default parameters, rest operator]

CONCEPTS ALREADY COVERED IN PREVIOUS DAYS (do NOT re-teach these):
[Paste this cumulative list. Update it as you progress through days.]

Day 1: variables (let/const), primitive types, typeof, type coercion, string concatenation
Day 2: arrays (indexing, push, length), objects (dot/bracket notation, property access), undefined for missing keys
Day 3: if/else, else if, comparison operators, logical operators (&&, ||, !), switch, ternary
Day 4: for loops, for...of, while loops, infinite loop debugging, .map(), .filter(), .reduce()
Day 5: function declaration, parameters, return values, scope, higher-order functions, callbacks as arguments
Day 6: DOM (querySelector, getElementById, createElement, appendChild, textContent, style, classList, setAttribute, addEventListener)
Day 7: BOSS — synthesis of days 1-6
Day 8: setTimeout, callbacks, asynchronous execution, event loop order
Day 9: Promise constructor, resolve, reject, .then(), .catch(), promise chaining
Day 10: async/await, rewriting promise chains, try/catch in async functions
[Add more days as you generate them]

CONCEPTS COMING IN THE NEXT 2 DAYS (do NOT teach these yet):
[Paste from the curriculum. Example:]
Day 12: ES modules (import/export, named vs default), TypeScript basics (type annotations, interfaces)
Day 13: BOSS — debug async pipeline with TypeScript

CHALLENGE COUNT: [4 or 5, check the count table in spec 05]

OUTPUT FORMAT — for each challenge provide:
1. Order (1 to N)
2. Type (predict / debug / complete / refactor / build)
3. Exact concept tested (be specific: "destructuring object properties" not just "destructuring")
4. What the player must demonstrate to pass
5. How it builds on the previous challenge in this day
6. Difficulty (gentle / steady / demanding)
7. Whether it needs an explain gate (yes + the question, or no)

Rules:
- Challenge 1 MUST be the easiest (predict or gentle complete)
- Difficulty MUST strictly increase across challenges
- Each challenge introduces exactly ONE new concept while reinforcing previous ones
- A predict challenge tests reading comprehension, not writing
- A debug challenge has exactly ONE bug, not multiple
```

**After the LLM responds, review the concept map. Check:**
- Does difficulty actually increase?
- Is there any concept from the "do not teach yet" list?
- Is there any concept from the "already covered" list being re-taught without a new angle?
- Does each challenge test ONE thing?

If anything is wrong, tell the LLM what to fix. Do not proceed until the concept map is solid.

---

## STEP 2: Skeletons (Pass 2)

Once you approve the concept map:

```
STEP 2: CHALLENGE SKELETONS

Good concept map. Now generate detailed skeletons for each challenge.

NARRATIVE CONTEXT FOR DAY [NUMBER]:
[Paste the full narrative intro and challenge hooks from spec 04. Example:]

Narrative intro: "The builders left tools scattered throughout The Drift — shortcuts, compressed syntax, patterns that do in one line what used to take five. Destructuring. Spread operators. Template literals. Arrow functions. These aren't just convenient. They're how modern systems expect you to speak."

Challenge hooks:
1. "A destructured assignment. Which variables hold which values?"
2. "Spread an array into a new one with additional elements."
3. "An arrow function lost its `this` context. The reference is wrong."
4. "Old-style syntax. Modernize it with ES6+ features."

REFERENCE CHALLENGES (this is what quality looks like — match this style):
[Paste 2 complete challenges from spec 05. Pick ones similar in type. Example for a predict + complete pair:]

---
REFERENCE 1 (predict, from Day 1):
id: d01-c01
title: "The First Signal"
type: predict
difficulty: gentle
concepts: ["typeof", "primitive-types"]
narrativeHook: "A symbol pulses faintly on the nearest surface. What does it represent?"
instructions: "Read the code below carefully. Without running it, predict what console.log(result) will output."
starterCode: |
  let signal = 42;
  let result = typeof signal;
  console.log(result);
predictPrompt: "What will be logged to the console?"
predictChoices: ["42", "\"number\"", "\"string\"", "undefined"]
predictAnswer: "\"number\""
hints:
  - "typeof returns a string describing the type of a value"
  - "typeof 42 doesn't return the number itself"
explainGate:
  prompt: "What does the typeof operator return, and why is it a string?"
  keywords: ["string", "type", "describes"]
  minLength: 30
xpReward: 15
---
REFERENCE 2 (debug, from Day 1):
[Paste a debug challenge]
---

For each challenge, produce:
- id (format: d[DAY]-c[ORDER], e.g. d11-c01)
- title (evocative, 2-5 words, no "Exercise" or "Practice")
- type, difficulty, concepts
- narrativeHook (1-2 sentences, must reference The Drift)
- instructions (full markdown, unambiguous, under 150 words)
- Description of what starterCode should contain (don't write code yet)
- Description of the solution approach (don't write code yet)
- 3-5 test descriptions (what each test verifies)
- 3 hints (progressive: gentle nudge → more direct → almost gives it away)
- explainGate if applicable (prompt + keywords + minLength)
- xpReward (predict=15, debug=25, complete=20, refactor=30, build=50)
```

**Review each skeleton. Check:**
- Are instructions under 150 words and unambiguous?
- Do narrative hooks mention The Drift (not generic coding talk)?
- Are hints actually progressive (not three versions of the same thing)?
- Does the explain gate require understanding, not just "because it works"?

---

## STEP 3: Implementation (Pass 3) — ONE AT A TIME

This is the most important step. Generate challenges one by one.

### For Challenge 1 of the day:

```
STEP 3: FULL IMPLEMENTATION — Challenge 1

Implement this challenge skeleton with actual code.

SKELETON:
[Paste skeleton for challenge 1 from Step 2]

RULES:
- starterCode must parse without errors (except for intentional blanks marked with comments)
- solution must pass ALL tests
- tests must FAIL with the unmodified starterCode
- For predict challenges: no starterCode editing, just predictPrompt/predictChoices/predictAnswer
- Variable names should be thematic when natural: signal, reading, system, crew, drift, beacon
  (but don't force it — clarity beats theme)
- Keep code concise: starterCode 5-20 lines, solution 5-25 lines
- For "complete" type: mark editable areas with "// Your code here"
- For "debug" type: the bug must be subtle but logical (not a random typo unless the concept IS about careful reading)

OUTPUT FORMAT (JSON-ready):
{
  "id": "d[XX]-c[XX]",
  "dayNumber": [X],
  "order": [X],
  "type": "[type]",
  "difficulty": "[difficulty]",
  "concepts": ["concept1", "concept2"],
  "week": [X],
  "title": "[Title]",
  "narrativeHook": "[1-2 sentences]",
  "instructions": "[Full markdown instructions]",
  "starterCode": "[The code the player sees]",
  "solution": "[The correct code]",
  "readOnlyRegions": [],
  "predictPrompt": "[Only for predict type]",
  "predictChoices": ["[Only for predict type]"],
  "predictAnswer": "[Only for predict type]",
  "tests": [
    {
      "description": "[What this test checks]",
      "testCode": "[The assertion code]",
      "hidden": false
    }
  ],
  "hints": ["[Hint 1 - vague]", "[Hint 2 - clearer]", "[Hint 3 - almost answer]"],
  "explainGate": {
    "prompt": "[Question]",
    "keywords": ["word1", "word2"],
    "minLength": [number]
  },
  "xpReward": [number],
  "bonusXp": {
    "noHints": 5,
    "firstTry": 10,
    "speedBonus": 5,
    "speedThresholdMs": 120000
  }
}
```

### For Challenge 2+ of the day:

```
STEP 3: FULL IMPLEMENTATION — Challenge [N]

Here is the completed Challenge [N-1] for context (match the style and build on it):
[Paste the FULL JSON of the previous challenge]

Now implement Challenge [N].

SKELETON:
[Paste skeleton for this challenge from Step 2]

SAME RULES AS BEFORE. The difficulty must be visibly higher than Challenge [N-1].

Output the full JSON.
```

**Repeat for each challenge in the day. Always paste the previous challenge as context.**

**After each challenge, verify:**
- Does the starterCode parse? (Paste it into a JS console or TS playground)
- Does the solution actually pass the tests? (Mentally run through each test)
- Do the tests fail with the starterCode? (Check that blanks/bugs would cause failure)
- Is this harder than the previous challenge?

---

## STEP 4: Validation (Pass 4)

After all challenges for the day are implemented:

```
STEP 4: VALIDATION

Review these [N] challenges as a curriculum quality reviewer.

TODAY'S CHALLENGES:
[Paste ALL challenges for this day]

YESTERDAY'S CHALLENGES (for repetition check):
[Paste the concept list + titles from the previous day. You don't need full code, just:]
Previous day concepts covered:
- d[XX]-c01: [concept] ([type])
- d[XX]-c02: [concept] ([type])
- ...

TOMORROW'S PLANNED CONCEPTS (for teach-ahead check):
[Paste from spec 04/05]

CHECK FOR:

1. CONCEPT COVERAGE
   - Does each planned concept appear in exactly one challenge?
   - Any unplanned concepts sneaking in?
   - Any planned concepts missing?

2. DIFFICULTY CURVE
   - Is challenge 1 genuinely the easiest?
   - Does difficulty strictly increase?
   - Rate each challenge 1-10 difficulty and confirm the order makes sense

3. REPETITION
   - Any concept repeated from yesterday without a new angle?
   - Any two challenges today testing the same thing?

4. TEACH-AHEAD
   - Any challenge requiring knowledge from tomorrow or later?

5. TEST QUALITY
   - Any test that would pass with wrong code? (false positive)
   - Any test that would fail with correct code? (false negative)
   - Are error messages in tests helpful?

6. NARRATIVE CONSISTENCY
   - Do all narrative hooks reference The Drift?
   - Is the tone consistent (quiet, curious, warm)?

7. RED FLAGS
   - Any instructions starting with "Write a function that..." (too textbook-y)?
   - Any debug challenge with more than one bug?
   - Any variable named foo/bar/temp/data1?
   - Any challenge over 150 words of instructions?
   - Any predict challenge with ambiguous answers?

Output: PASS or FAIL for each category, specific issues found, suggested fixes.
```

**If anything fails, go back to Step 3 and regenerate the problematic challenge(s).**

---

## ANGULAR-SPECIFIC PROMPTS (Days 14-26)

For Angular days, add this to the system prompt:

```
ANGULAR-SPECIFIC RULES (add to system prompt for Days 14-26):

This game uses Angular 17+ with these mandatory patterns:
- Standalone components ONLY (no NgModules, no AppModule, no SharedModule)
- Component decorator: @Component({ selector: '...', standalone: true, imports: [...], template: `...` })
- Services: @Injectable({ providedIn: 'root' })
- Signals for simple reactive state (signal(), computed(), effect())
- RxJS only for HTTP and complex async (not for simple UI state)
- Proper TypeScript types everywhere (never use 'any')
- HttpClient injected via inject() function, not constructor injection
- Modern control flow: @if, @for, @switch (not *ngIf, *ngFor)

NEVER USE:
- NgModules (AppModule, SharedModule, etc.)
- Constructor-based dependency injection (use inject() function)
- Old structural directives (*ngIf, *ngFor, *ngSwitch)
- The 'any' type
- jQuery or direct DOM manipulation

Test environment: Jasmine + TestBed
Tests look like:
  describe('ComponentName', () => {
    let fixture: ComponentFixture<MyComponent>;
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MyComponent]
      }).compileComponents();
      fixture = TestBed.createComponent(MyComponent);
      fixture.detectChanges();
    });
    it('should display title', () => {
      expect(fixture.nativeElement.textContent).toContain('Title');
    });
  });
```

---

## THE FULL SEQUENCE (Day by Day)

Here's your exact workflow for each day. Check off each step.

### For each day you generate:

```
[ ] 1. Start fresh LLM conversation
[ ] 2. Paste system prompt (Step 0)
[ ] 3. If Angular day (14+), add Angular-specific rules
[ ] 4. Send concept map prompt (Step 1)
[ ] 5. Review concept map. Fix issues. Approve.
[ ] 6. Send skeleton prompt (Step 2)
[ ] 7. Review skeletons. Fix issues. Approve.
[ ] 8. Send implementation prompt for Challenge 1 (Step 3)
[ ] 9. Verify challenge 1: code parses, solution passes tests, tests fail with starter
[ ] 10. Send implementation prompt for Challenge 2 (with C1 as context)
[ ] 11. Verify challenge 2 (same checks + harder than C1?)
[ ] 12. Repeat for challenges 3, 4, 5
[ ] 13. Send validation prompt (Step 4) with all challenges
[ ] 14. Fix any issues found
[ ] 15. Save the day's challenges as day-[XX].json
[ ] 16. Update your "ALREADY COVERED" concept list for the next day
```

---

## MAINTAINING THE CONCEPT LIST

This is crucial. After completing each day, update this running list. You paste it into every Step 1 prompt.

```
MASTER CONCEPT LIST (update after each day):

Day 1: variables (let/const), primitive types, typeof, type coercion, string concatenation
Day 2: arrays (indexing, push, length), objects (dot/bracket notation, property access), undefined for missing keys
Day 3: if/else, comparison operators (>, >=, ===), logical operators (&&, ||, !), switch, ternary
Day 4: for loops, for...of, while loops, break conditions, .map(), .filter(), .reduce()
Day 5: function declaration, parameters, return values, scope, higher-order functions, callbacks as arguments
Day 6: DOM (querySelector, getElementById, createElement, appendChild, textContent, style, classList, setAttribute, addEventListener)
Day 7: BOSS — synthesis of week 1
Day 8: setTimeout, callbacks, asynchronous execution, event loop, execution order
Day 9: Promise constructor, resolve, reject, .then(), .catch(), promise chaining
Day 10: async/await, rewriting promise chains, try/catch, error handling in async functions
Day 11: [UPDATE AFTER GENERATING] destructuring, spread operator, arrow functions, template literals, default parameters, rest operator
Day 12: [UPDATE AFTER GENERATING] ...
...
```

**After generating Day 11, you fill in the actual concepts that were covered, then use the updated list when generating Day 12.**

---

## BOSS BATTLE PROMPTS (Days 7, 13, 20, 26)

Boss battles need a different prompt because they're synthesis challenges:

```
STEP 3 (BOSS BATTLE): FULL IMPLEMENTATION

This is a boss battle for Day [X], the end of Week [X].

CONCEPTS THIS BOSS MUST SYNTHESIZE (everything from this week):
[Paste the concept lists for all days in this week]

BOSS REQUIREMENTS FROM SPEC:
[Paste the boss battle description from spec 04 narrative]

THE BOSS MUST:
1. Require using at least 4-5 distinct concepts from this week
2. Feel like building something real, not answering quiz questions
3. Have a time limit of [45/60/90] minutes (not enforced by tests, just displayed)
4. Have 5-6 tests that verify the major features work
5. Have a clear, unambiguous spec of what to build
6. Include a narrative intro that feels climactic for the week

THE BOSS MUST NOT:
1. Require any concept from future weeks
2. Be trivially solvable by doing one thing well (must require breadth)
3. Have ambiguous requirements (player should never wonder "what exactly do I build?")
4. Have tests that are too strict about implementation (test behavior, not method names)

Output the full challenge JSON.
[For Angular bosses (Days 20, 26): also output the StackBlitz project file structure]
```

---

## WHEN THINGS GO WRONG

### The LLM gives you generic challenges
Send this:
```
This challenge is too generic. It reads like a Codecademy exercise. Remember:
- The narrative hook must reference The Drift (the bioluminescent space environment)
- Instructions should feel like missions, not homework
- Variable names should be thematic (signal, reading, system, crew) not generic (data, result, output)
Rewrite it.
```

### The LLM's difficulty is flat (all challenges feel the same)
Send this:
```
The difficulty isn't escalating. Challenge [N] should be noticeably harder than Challenge [N-1].
Here's what I mean:
- Challenge 1 should be solvable in under 2 minutes by anyone who finished yesterday
- Challenge [N] should make the player pause and think for 5+ minutes
- The last challenge should be the hardest of the day

Specifically, Challenge [N] is too easy because [explain why]. Make it harder by [suggest a direction].
```

### The LLM writes tests that don't work
Send this:
```
This test has a problem: [describe the issue].
Remember:
- Tests must FAIL with the starterCode unchanged
- Tests must PASS with the solution
- Tests check BEHAVIOR not IMPLEMENTATION (don't check method names, check outputs)
- Error messages must tell the player what went wrong: "Expected X, got Y"
- Use strict equality (===) not loose (==)
Fix the test.
```

### The LLM teaches concepts from future days
Send this:
```
This challenge uses [concept], which isn't taught until Day [X]. The player won't know this yet.
Replace it with something achievable using only these concepts:
[Paste the "already covered" list]
```

### The LLM repeats a previous day's challenge with different words
Send this:
```
This is essentially the same as Day [X] Challenge [Y] — both test [concept] in [similar way].
Either:
a) Add a genuinely new angle (combine it with a newer concept)
b) Replace it with a challenge about [suggest alternative concept from today's objectives]
```

---

## OUTPUT FILE FORMAT

After completing each day, save as `day-[XX].json`:

```json
{
  "dayNumber": 11,
  "week": 2,
  "title": "Modern Syntax",
  "challenges": [
    { ... challenge 1 JSON ... },
    { ... challenge 2 JSON ... },
    { ... challenge 3 JSON ... },
    { ... challenge 4 JSON ... }
  ]
}
```

Save in: `26-days/src/assets/challenges/day-11.json`

---

## TOTAL TIME ESTIMATE

Per day of challenges:
- Step 1 (concept map): 10-15 minutes
- Step 2 (skeletons): 15-20 minutes
- Step 3 (implementation): 10-15 minutes per challenge x 4-5 = 40-75 minutes
- Step 4 (validation): 10-15 minutes
- Fixes and iteration: 15-30 minutes

**Total per day: ~1.5-2.5 hours**

You have ~13 days to generate (Days 11-12, 15-25).
At 2 hours each: ~26 hours of work.
Spread over 5-7 real days: 4-5 hours/day.

Doable. Start with Day 11 — it's the smallest gap and builds directly on the existing Day 10 challenges, so it's the easiest to calibrate on.
