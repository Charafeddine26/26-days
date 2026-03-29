# 26 DAYS — Challenge Generation Playbook

## Document Purpose
This is a step-by-step guide for using an LLM to generate the remaining ~80 challenges while keeping them coherent, progressive, and aligned with the existing specs. Follow this process exactly. Do NOT dump all specs at once and say "generate everything." That's how you get slop.

---

## The Problem

LLMs generating coding challenges tend to:
- Repeat the same concept in different words
- Jump difficulty randomly (easy → impossible → easy)
- Forget what was already generated
- Produce generic exercises disconnected from the narrative
- Test surface-level syntax instead of real understanding
- Write tests that don't actually verify the right thing
- Ignore the specific tech stack decisions (e.g., using NgModules when we specified standalone)

The fix: **never let the LLM generate blind.** Every generation step gets context about what came before, what comes after, and what the constraints are.

---

## The Pipeline: 4 Passes

```
Pass 1: Concept Map         (plan what each challenge teaches)
Pass 2: Challenge Skeletons  (structure without code)
Pass 3: Full Implementation  (code, tests, hints)
Pass 4: Validation           (cross-check against curriculum)
```

Each pass feeds into the next. Never skip a pass.

---

## PASS 1: Concept Map

### Goal
For each day that needs challenges, produce an exact list of what each challenge teaches, its type, difficulty, and how it connects to adjacent challenges.

### Prompt Template

```
You are designing a coding curriculum. I will give you:
1. The day's learning objectives
2. What was covered in previous days (so you don't repeat)
3. What comes in future days (so you don't teach ahead)
4. The challenge types available and what they mean

Your job: output a CONCEPT MAP for this day's 4-5 challenges.
For each challenge, specify:
- Order (1-5)
- Type (predict / debug / complete / refactor / build)
- Exact concept being tested (be specific: not "loops" but "for...of with index tracking")
- What the player must demonstrate to pass
- How it builds on the previous challenge in the same day
- Difficulty (gentle / steady / demanding)
- Whether it needs an explain gate (yes/no + the core question)

Constraints:
- Challenge 1 is always the easiest (predict or gentle complete)
- Last challenge is the hardest
- Each challenge introduces exactly ONE new idea while reinforcing previous ones
- Never test two new concepts simultaneously
- "predict" challenges have no code writing — just reading and understanding
- "debug" challenges have working-but-broken code with exactly one bug
- "complete" challenges have scaffolding with blanks to fill
- "refactor" challenges have working ugly code to improve
- "build" challenges require writing from scratch

===

DAY [X]: [TITLE]
Week: [1/2/3/4]
Learning objectives: [from spec 04 narrative + spec 01 curriculum table]

ALREADY COVERED (do not re-teach):
[Paste the concept lists from all previous days]

COMING NEXT (do not teach yet):
[Paste the concept lists from the next 2-3 days]

EXISTING CHALLENGES FOR THIS DAY (if any):
[Paste any challenges already written in spec 05]

Generate the concept map.
```

### Example Input (for Day 11)

```
DAY 11: Modern Syntax
Week: 2
Learning objectives: ES6+ features — destructuring, spread operator, arrow functions, template literals, default parameters, rest operator

ALREADY COVERED (days 1-10):
- Variables (let, const), types (typeof, primitives), type coercion
- Arrays (indexing, push, length, map, filter, reduce)
- Objects (property access, dot/bracket notation, nested)
- Conditionals (if/else, switch, ternary, logical operators)
- Loops (for, for...of, while, infinite loop debugging)
- Functions (parameters, return, scope, higher-order, callbacks)
- DOM (querySelector, createElement, appendChild, events, addEventListener)
- setTimeout, callbacks, asynchronous execution, event loop
- Promises (constructor, resolve, reject, .then, .catch, chaining)
- Async/await (rewriting promise chains, try/catch, loading states)

COMING NEXT (days 12-13):
- Day 12: Modules (import/export), TypeScript basics (types, interfaces)
- Day 13: Boss battle — debug broken async pipeline with TypeScript

Generate the concept map for Day 11's 4 challenges.
```

### Expected Output Format

```
DAY 11 CONCEPT MAP:

Challenge 1 (predict, gentle):
  Concept: destructuring assignment — extracting values from objects
  Tests: player reads a destructuring statement and predicts which variables get which values
  Builds on: object property access (Day 2)
  Explain gate: yes — "What does destructuring save you compared to manual property access?"

Challenge 2 (complete, steady):
  Concept: spread operator — copying and merging arrays and objects
  Tests: player uses spread to merge two arrays and add properties to an object
  Builds on: challenge 1 (destructuring) + arrays (Day 2)
  Explain gate: no (straightforward application)

Challenge 3 (debug, steady):
  Concept: arrow functions and lexical `this`
  Tests: player finds a bug where a regular function's `this` is wrong and fixes it with an arrow function
  Builds on: functions (Day 5) + event handlers (Day 6)
  Explain gate: yes — "Why do arrow functions handle `this` differently from regular functions?"

Challenge 4 (refactor, demanding):
  Concept: combining all ES6+ features — refactor old-style code to modern syntax
  Tests: player rewrites a block using destructuring, spread, arrow functions, template literals, default params
  Builds on: challenges 1-3 + all previous days
  Explain gate: yes — "Which ES6+ feature do you think improves readability the most, and why?"
```

### Quality Check Before Moving to Pass 2
Ask yourself (or the LLM):
- Does each challenge test exactly one new thing?
- Is the difficulty strictly increasing within the day?
- Are there any concepts here that were already covered in a previous day's challenge?
- Are there any concepts here that belong to a future day?
- Does the predict challenge make sense without writing code?
- Does the debug challenge have a single, clear bug (not ambiguous)?

If any answer is wrong, regenerate the concept map before proceeding.

---

## PASS 2: Challenge Skeletons

### Goal
For each challenge in the concept map, produce the full structure WITHOUT the actual code. This forces the LLM to think about pedagogy before implementation.

### Prompt Template

```
You are writing challenge skeletons for a coding learning game.
I will give you:
1. The concept map for this day (from Pass 1)
2. The challenge format specification
3. The narrative context for this day
4. Two example fully-written challenges from a previous day (as reference for quality/style)

Your job: for each challenge in the concept map, produce a SKELETON with:
- id, title, type, difficulty, concepts
- narrativeHook (1-2 sentences connecting to The Drift story)
- instructions (the full challenge prompt as markdown, clear and concise)
- What the starterCode should contain (describe it, don't write the actual code yet)
- What the solution approach is (describe it, don't write the actual code yet)
- Test descriptions (what each test checks — 3-5 tests)
- Hints (3 progressive hints, vague → specific)
- Explain gate prompt and keywords (if applicable)
- xpReward

Constraints:
- Instructions must be unambiguous. A player should never wonder "what does this mean?"
- The narrative hook must reference The Drift (not generic coding speak)
- Tests should verify behavior, not implementation details
  (test that the output is correct, not that they used a specific method name)
- Hints must be progressive: hint 1 is a gentle nudge, hint 2 is more direct, hint 3 almost gives the answer
- The explain gate question should be answerable in 1-2 sentences and test genuine understanding

===

DAY [X] CONCEPT MAP:
[Paste the output from Pass 1]

NARRATIVE CONTEXT (from spec 04):
[Paste the day's narrative intro and the challenge hooks]

REFERENCE CHALLENGES (from spec 05):
[Paste 2 fully-written challenges from a similar day as quality examples]

Generate the skeletons.
```

### Quality Check Before Moving to Pass 3
For each skeleton, verify:
- Can a junior developer understand the instructions without external help?
- Is the narrative hook specific to The Drift, not generic ("the system needs..." not "write a function that...")?
- Do the test descriptions cover edge cases, not just the happy path?
- Are the hints actually progressive (not three versions of the same hint)?
- Does the explain gate test understanding, not just recall?

---

## PASS 3: Full Implementation

### Goal
Take each skeleton and produce the final challenge with actual starterCode, solution, and test code.

### Prompt Template

```
You are implementing coding challenges for a browser-based JavaScript/Angular learning game.

CRITICAL RULES:
1. All JavaScript runs in a Web Worker sandbox (no DOM, no fetch, no require/import)
   EXCEPTION: Day 6 (DOM) challenges run in a simulated DOM environment
   EXCEPTION: Days 14-26 (Angular) challenges run in StackBlitz
2. Tests are assertions that throw errors on failure. Format:
   if (condition) throw new Error('message');
3. starterCode is what the player sees. It must have clear "// Your code here" markers
4. Read-only code (if any) should be clearly commented as "// Don't modify this"
5. Solutions must be MINIMAL — no extra code beyond what's needed
6. For predict challenges: no tests, just predictPrompt, predictChoices, predictAnswer
7. Variable/function names should be thematic (use space/drift/signal/system terminology
   when natural, but don't force it — clarity over theme)

I will give you:
1. The challenge skeleton (from Pass 2)
2. The day's concept focus
3. 2-3 already-completed challenges from the SAME DAY or adjacent days
   (so you match the code style and difficulty calibration)

Write the complete challenge.

===

SKELETON:
[Paste one skeleton from Pass 2]

ALREADY WRITTEN FOR THIS DAY:
[Paste any challenges already completed for this day]

REFERENCE (from spec 05, adjacent day):
[Paste 1-2 similar-type challenges as code style reference]
```

### IMPORTANT: Generate One Challenge at a Time

Do NOT generate all 4-5 challenges in one prompt. Generate challenge 1, review it, then generate challenge 2 with challenge 1 included as context. This ensures:
- Each challenge can reference what was established in the previous one
- Difficulty actually escalates (the LLM can see what "gentle" looked like and go harder)
- No accidental concept repetition within the same day

### Quality Check for Each Challenge

Run these checks before accepting:

**Code quality:**
- Does the starterCode compile/parse without errors (minus the blanks)?
- Does the solution actually pass all the tests?
- Are the tests self-contained (no external dependencies)?
- Do the tests actually fail with the starterCode and pass with the solution?

**Pedagogical quality:**
- Does this challenge teach the ONE concept it's supposed to?
- Could a player who completed all previous challenges reasonably solve this?
- Is there exactly one correct approach, or are multiple valid? (Multiple valid is fine, but tests must accept all valid solutions)
- Are edge cases in the tests fair (not "gotcha" cases the player couldn't predict)?

**Narrative quality:**
- Does the narrative hook feel like The Drift, not a textbook?
- Is the title evocative (not "Exercise 3" or "Array Practice")?

---

## PASS 4: Validation

### Goal
Cross-check the entire generated day against the curriculum to catch drift, gaps, and inconsistencies.

### Prompt Template

```
You are a curriculum quality reviewer. I will give you:
1. A day's worth of completed challenges (4-5 challenges)
2. The concept map that was planned for this day
3. The previous day's challenges (to check for repetition)
4. The next day's planned concepts (to check for teaching-ahead)

Check for these issues:

CONCEPT COVERAGE:
- Does each planned concept from the concept map appear in exactly one challenge?
- Are there any concepts being tested that weren't in the plan?
- Are there any planned concepts that got dropped?

DIFFICULTY CURVE:
- Is challenge 1 genuinely the easiest?
- Does difficulty strictly increase?
- Could you rank them by difficulty and does that match the stated order?

REPETITION:
- Does any challenge repeat a concept from a previous day WITHOUT adding new depth?
  (Revisiting a concept is fine if there's a new angle — e.g., "arrays in Day 2" vs "arrays with async map in Day 10")
- Are any two challenges within this day testing the same thing?

TEACHING-AHEAD:
- Does any challenge require knowledge from a future day?
- Does any test assume the player knows something not yet taught?

TEST QUALITY:
- Do any tests have false positives (would pass with wrong code)?
- Do any tests have false negatives (would fail with correct code)?
- Are error messages in tests helpful (tell the player what went wrong)?

NARRATIVE:
- Do all narrative hooks reference The Drift consistently?
- Is the tone consistent across challenges (quiet, curious, warm)?

Output a report with:
- PASS or FAIL for each category
- Specific issues found (if any)
- Suggested fixes (if any)

===

[Paste the day's challenges, previous day's challenges, and next day's concept plan]
```

---

## Generation Order

Generate days in this order (not sequentially) to maximize context:

```
ALREADY DONE (in spec 05):
  Days 1-10 (fully written)
  Day 14 (partially written)
  Day 26 (boss battle written)

GENERATE IN THIS ORDER:

Phase A — Fill Week 2 gaps:
  1. Day 11 (ES6+) — has narrative, needs challenges
  2. Day 12 (Modules/TS) — has narrative, needs challenges

Phase B — Week 3 core (most critical — Angular intro):
  3. Day 15 (Templates) — after Day 14 which is partially done
  4. Day 16 (Services)
  5. Day 17 (Routing)
  6. Day 18 (HTTP)
  7. Day 19 (Composition)
  8. Day 20 (Boss battle)

Phase C — Week 4:
  9. Day 21 (Forms)
  10. Day 22 (RxJS)
  11. Day 23 (Real patterns)
  12. Day 24 (Integration)
  13. Day 25 (Review)

Why this order:
- Week 2 gaps are small (2 days) and build directly on existing Day 10
- Week 3 is the most important — it's the Angular introduction,
  and bad challenges here would derail the entire second half
- Week 4 builds on Week 3, so Week 3 must be solid first
- Day 25 (review) is generated last because it references ALL previous content
```

---

## Context Window Management

This is the practical problem: your LLM has a context window limit. You can't dump all 5 specs + all existing challenges at once.

### What to include per prompt:

**Pass 1 (Concept Map):**
- The day's narrative from spec 04 (~100 words)
- The concept lists from ALL previous days (just the bullet-point lists, ~20 words per day)
- The next 2-3 days' concept lists
- The challenge type definitions (once, ~200 words)
Total: ~1,500 words. Fits easily.

**Pass 2 (Skeletons):**
- The concept map output from Pass 1
- The day's narrative (intro + challenge hooks)
- 2 full reference challenges from spec 05 (~400 words each)
Total: ~2,000 words. Fits easily.

**Pass 3 (Implementation):**
- One skeleton at a time
- 1-2 already-written challenges from the same day
- 1-2 reference challenges from a similar day in spec 05
Total: ~1,500 words per challenge. Fits easily.

**Pass 4 (Validation):**
- The full day's challenges (~2,000-3,000 words)
- Previous day's challenges (~2,000 words)
- Next day's concept plan (~200 words)
Total: ~5,000 words. Fits in most models.

### What NOT to include:
- The full visual design spec (irrelevant to challenge content)
- The full UI/UX flow spec (irrelevant to challenge content)
- The full foundation spec (only the Challenge interface is relevant)
- Challenges from days far away (only adjacent days matter)

---

## Angular Challenge Special Rules (Days 14-26)

Angular challenges are fundamentally different from JS challenges. When generating them:

### Must use:
- Standalone components (NOT NgModules)
- Signals where appropriate (modern Angular)
- `@Component`, `@Injectable`, `@Input`, `@Output` decorators
- Proper TypeScript types on everything

### Must NOT use:
- NgModules (AppModule, SharedModule, etc.) — we use standalone
- `any` type — always use proper types or interfaces
- jQuery or direct DOM manipulation in Angular components
- Deprecated APIs (e.g., `ComponentFactoryResolver`)

### Test format for Angular:
Angular tests use Jasmine syntax in a TestBed environment:
```typescript
// Setup
const fixture = TestBed.createComponent(MyComponent);
const component = fixture.componentInstance;
fixture.detectChanges();

// Assert
expect(fixture.nativeElement.textContent).toContain('expected text');
```

Include this format reference in every Angular challenge generation prompt.

### StackBlitz Project Structure:
Each Angular challenge needs a minimal project definition:
```
Files the player sees and can edit:
  - The component/service file(s) relevant to the challenge

Files provided but read-only:
  - app.config.ts (routing, HttpClient provision)
  - main.ts (bootstrap)
  - Test file (*.spec.ts)
  - Any supporting files (mock services, test data)
```

---

## Master Checklist

Before declaring a day's challenges complete, verify:

- [ ] Concept map covers all learning objectives for the day
- [ ] No concept repetition from previous days (unless deepening)
- [ ] No concept from future days used
- [ ] Difficulty increases across the day's challenges
- [ ] Challenge 1 is genuinely approachable for someone who just finished yesterday
- [ ] Last challenge is the hardest of the day
- [ ] All narrative hooks reference The Drift
- [ ] All titles are evocative (no "Exercise X" or "Practice Y")
- [ ] All instructions are unambiguous
- [ ] All starterCode parses without errors
- [ ] All solutions pass all tests
- [ ] All tests fail with the starterCode
- [ ] No test has false positives or false negatives
- [ ] Hints are progressive (vague → specific)
- [ ] Explain gates test understanding, not recall
- [ ] XP rewards are consistent with difficulty
- [ ] Challenge count matches the plan (4-5 regular days, 1 for boss days)
- [ ] JSON format matches the schema in spec 05

---

## Red Flags to Watch For

If the LLM produces any of these, reject and regenerate:

1. **"Write a function that..."** as the first words of instructions. The Drift doesn't talk like a textbook. Rephrase as narrative.

2. **Testing implementation instead of behavior.** Bad: "should use Array.map()". Good: "should return [2, 4, 6] when given [1, 2, 3]".

3. **Multiple bugs in a debug challenge.** Each debug challenge has EXACTLY ONE bug. If the LLM adds two, it's testing debugging patience, not concept understanding.

4. **Solution uses concepts not yet taught.** If Day 11 is about destructuring but the solution uses optional chaining (?.), that's teaching ahead.

5. **Tests that pass with empty/wrong code.** Every test should fail if the player submits the starterCode unchanged.

6. **Generic variable names.** `foo`, `bar`, `data1`, `temp`. Use thematic names: `signal`, `reading`, `crew`, `system`, `drift`, `beacon`.

7. **Challenges that are too long.** If the instructions are more than 150 words, it's too complex. Split into two challenges.

8. **Predict challenges with ambiguous answers.** If two choices could be argued as correct, the challenge is broken.

9. **Explain gates that can be answered with "because it works."** The question should require naming a specific mechanism.

10. **Boss battles that are just bigger versions of regular challenges.** Boss battles must synthesize multiple concepts from the week, not just be a longer version of a single concept.
