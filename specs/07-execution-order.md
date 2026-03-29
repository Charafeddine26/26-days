# 26 DAYS — Execution Order

## Who Does What, When

```
YOU  = challenge generation with LLM
HIM  = building the app
BOTH = testing together

Timeline assumes he's full-time on this.
```

---

## Phase 0: Calibration Day (Do This FIRST, Together)

**Before anyone goes heads-down, do one full day end-to-end.**

Why: Your friend needs to know exactly what shape the challenge JSON takes so he builds the loader correctly. You need to know if your LLM output actually works when dropped into the app. If you each go off and build separately for 3 days, you'll discover incompatibilities that waste time.

```
Step 1: He reads spec 01 (foundation) + spec 02 (visual design) + spec 03 (UI/UX flow)
Step 2: He scaffolds the Angular project, installs deps, sets up Tailwind config with Drift colors
Step 3: He builds ONE screen: the Challenge View (spec 03, section 5)
        Just the layout — Monaco editor, instructions panel, test results panel
        Hardcode a single challenge to test with
Step 4: You take Day 1 challenges from spec 05 (already written) and format them as actual JSON
Step 5: He loads your JSON into his challenge screen
Step 6: You BOTH verify: does the challenge display correctly? Do tests run? Does pass/fail work?
Step 7: Fix any schema mismatches between what you generate and what his code expects

THIS IS THE MOST IMPORTANT STEP. Do not skip it.
Once this works, you can parallelize everything.
```

---

## Phase 1: Parallel Work Begins

After calibration, you split:

### Him (App Shell) — ~5-7 days
Build in this order:

```
1. Core services (progress.service, challenge.service, code-runner.service)
2. Web Worker sandbox for JS execution
3. Challenge View (full, with Monaco, tests, hints, explain gate)
4. Day View (mission list, narrative panel)
5. Home Screen (The Drift map — start simple, add visual polish later)
6. Countdown banner + streak system
7. Onboarding flow
8. Progress View
9. Settings View
10. Day unlock logic + routing guards
11. XP/level system
12. Visual polish: animations, particles, transitions
13. StackBlitz integration (for Angular challenges, weeks 3-4)
14. Sound (last — nice to have)
```

### You (Challenge Generation) — ~5-7 days
Generate in this order:

```
Round 1: VALIDATE what's already written
  - Take the Day 1-10 challenges from spec 05
  - Format them as proper JSON files
  - Test each one mentally: does the starter code parse? Does the solution pass the tests?
  - Fix any issues

Round 2: Generate Week 2 gaps (Days 11-12)
  - These are JS-only, simpler to generate
  - Run the full 4-pass pipeline from spec 06

Round 3: Generate Week 3 (Days 14-20) — THE CRITICAL BATCH
  - Angular challenges are harder to write correctly
  - Do Day 14 first (already partially done), validate it works
  - Then 15 → 16 → 17 → 18 → 19 → 20 in order
  - Each day: full 4-pass pipeline
  - After Day 14 + 15 are done, give them to your friend to test in StackBlitz
  - Fix issues before continuing to Day 16+

Round 4: Generate Week 4 (Days 21-25)
  - By now you'll have a rhythm
  - Day 25 (review) is generated LAST because it references all previous content

Round 5: Boss battles quality check
  - Days 7, 13, 20, 26 boss battles exist in spec 05
  - Review and expand them with proper StackBlitz project definitions (for 20 and 26)
```

---

## Phase 2: Integration Testing

Once he has the app running and you have all challenges:

```
1. Drop all challenge JSON files into the app
2. Play through Days 1-3 yourselves. Actually solve the challenges.
3. Note every friction point:
   - Instructions unclear?
   - Test passes when it shouldn't?
   - Test fails when it shouldn't?
   - Difficulty spike too harsh?
   - Hints unhelpful?
4. Fix and iterate
5. Play through Days 7 (first boss), 14 (first Angular day), 26 (final boss)
6. Fix and iterate again
```

---

## Phase 3: Polish & Ship

```
- He polishes animations, transitions, visual evolution
- You proofread all narrative text
- Both: final playthrough of all 26 days (or at least days 1, 7, 14, 20, 26)
- Ship it
```

---

## Summary Timeline

```
Day 0:         Calibration (together)
Days 1-3:      You: format existing challenges + generate Days 11-12
               Him: core services + challenge view + code runner
Days 4-7:      You: generate Days 14-20 (Angular week)
               Him: day view + home screen + drift map + countdown
Days 8-10:     You: generate Days 21-25 + boss battle polish
               Him: progress view + settings + XP + visual polish
Days 11-12:    Integration testing, bug fixes
Day 13+:       Polish, final playthrough, ship
```

The goal: app is playable within ~2 weeks so you can start using it yourself with ~12 days left before your internship. Even a partially complete version (Days 1-14) would be massively valuable.
