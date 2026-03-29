# 26 DAYS — UI/UX Flow Spec

## Document Purpose
This describes every screen, every user state, every transition, and every interaction in the app. Your friend follows this as a storyboard. Combined with the Visual Design Spec, there should be zero ambiguity about what to build.

---

## 1. App States Overview

The app has exactly these states, in order of first encounter:

```
1. First Launch (onboarding)
2. Home (The Drift map -- daily hub)
3. Day View (a single day's missions + narrative)
4. Challenge View (the actual coding challenge)
5. Boss Battle View (weekly timed challenge)
6. Day Complete (celebration + story continuation)
7. Progress View (stats, skill tree, history)
8. Settings View
```

---

## 2. First Launch / Onboarding

**When:** The very first time the player opens the app. No data in localStorage.

### Screen 2.1: The Awakening

```
Full viewport. --drift-void background with absolutely nothing else for 2 seconds.
Then, slowly (over 3 seconds):

A single point of light appears at center.
It's --drift-lavender at 30% opacity, just a dot, maybe 4px.

Text fades in below it (Cormorant Garamond 300, --text-2xl, --drift-text-primary):
  "You don't remember how you got here."

Hold for 3 seconds. Text fades out (1 second).

New text fades in:
  "The systems around you are dark. Silent."

Hold 3 seconds. Fade out.

New text:
  "But something in you knows: you have 26 days."

Hold 3 seconds. Fade out.

The center dot pulses once, brighter.

New text:
  "26 days to understand this place."
  Below it, slightly smaller (--text-lg, --drift-text-secondary):
  "26 days to bring it back to life."

Hold 4 seconds. Fade out.

The dot begins a slow pulse animation.
```

### Screen 2.2: Start Configuration

```
The dramatic intro transitions to a minimal setup screen.
The dot from the intro remains, now in the upper portion of the screen.

Below it, a .drift-glass card appears (reveal animation):

  "Before we begin"
  (Cormorant Garamond 400, --text-xl)

  "When does your internship start?"
  (Inter 400, --text-base, --drift-text-secondary)

  [Date picker input]
    Style: --drift-mid background, subtle lavender border
    Default: 26 days from today
    Allows adjustment if the player's timeline differs

  "This sets your countdown. Every day that passes without progress
   will be felt."
  (Inter 400, --text-sm, --drift-text-tertiary)

  [ Begin The Drift ]    (Primary button, --drift-lavender gradient)

  Below the button, very small:
  "Progress is stored locally on this device."
  (Inter 400, --text-xs, --drift-text-ghost)
```

### Screen 2.3: Transition to Home

```
When the player clicks "Begin The Drift":

  The setup card fades out (300ms)
  The center dot expands into the first day node
  Other nodes fade in at very low opacity (dormant)
  The background nebula glow slowly appears
  The countdown banner slides in from the top
  The first node pulses invitingly

  Total transition: ~2 seconds
  This should feel like "the system is booting up for the first time"
```

---

## 3. Home Screen (The Drift Map)

**When:** Every time the player opens the app (after first launch) or navigates to `/`.

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [19] days remaining    │    47% ready ━━━━━━━░░░░    │ 🌿 7 │  ← Countdown banner
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                                                             │
│              ·                                              │
│           · ·  ·                         ·                  │
│          ·   ·                      ·  ·                    │
│        ·  ·                       ·  ·  ·                   │
│       ·      ·                  ·                           │
│     ●  ·  ·                   ·                             │  ← The Drift constellation
│    ● ●                      ·                               │     (● = completed nodes)
│   ● ●  ●                                                   │     (◉ = current/available)
│  ●  ● ●                                                    │     (· = dormant/locked)
│    ◉                                                        │
│                                                             │
│                                                             │
│                                                      [◎][⚙]│  ← Floating controls
└─────────────────────────────────────────────────────────────┘
```

### Interaction Details

**Node hover:**
```
A tooltip appears near the hovered node (positioned to avoid viewport edges).

Tooltip content for completed node:
  ┌─────────────────────────────┐
  │ Day 5: Naming the Patterns  │  (Inter 600, --text-sm)
  │ Arrays & Objects            │  (Inter 400, --text-xs, --drift-text-secondary)
  │ ✓ Completed                 │  (Inter 400, --text-xs, --drift-sage)
  └─────────────────────────────┘

Tooltip content for available node:
  ┌─────────────────────────────┐
  │ Day 8: Signals in the Dark  │
  │ Async & Promises            │
  │ 0/4 challenges              │  (--drift-lavender)
  │ ▸ Start                     │  (--drift-lavender, hover underline)
  └─────────────────────────────┘

Tooltip content for locked node:
  ┌─────────────────────────────┐
  │ Day 15                      │
  │ Locked                      │  (--drift-text-ghost)
  │ Complete Day 14 to unlock   │  (--drift-text-tertiary)
  └─────────────────────────────┘
```

**Node click:**
```
Completed node:   Navigates to /day/:dayNumber (review mode)
Available node:   Navigates to /day/:dayNumber
In-progress node: Navigates to /day/:dayNumber
Locked node:      Brief shake animation (translateX: 0 → -3px → 3px → -2px → 2px → 0, 400ms)
                  Tooltip shows lock message
```

**Returning to home after completing a day:**
```
The newly completed node transitions from in-progress to completed state.
Connection lines draw to adjacent completed nodes.
The next day's node transitions from locked to available (if calendar allows).
Any DriftUnlock animations play.
This should feel rewarding -- the map visibly grows each time you return.
```

### Edge States

**All challenges complete for today but more exist:**
```
The current day node shows completed.
The next day node either:
  - Pulses (if it's the next calendar day and unlocked)
  - Shows locked (if it's too early by calendar)
The home screen shows a soft message near center:
  "Today's missions are complete. Rest, or read ahead."
  (Cormorant Garamond 300, --text-base, --drift-text-secondary)
```

**Player hasn't done today's missions (returning user):**
```
The available/in-progress node pulses more urgently.
The countdown number is slightly brighter than usual.
A subtle prompt appears near the available node:
  "Your missions await"
  (Cormorant Garamond 300, --text-sm, --drift-lavender, slow fade in/out cycle)
```

**Streak is broken (player returns after missing a day):**
```
On load, before showing the map, a brief interstitial (2 seconds):
  The Drift dims slightly (ambient intensity drops by 20%)
  Text appears:
    "The signal faded while you were away."
    (Cormorant Garamond 300, --text-xl, --drift-text-secondary)
  Below:
    "Streak reset to 0. But the path remains."
    (Inter 400, --text-sm, --drift-text-tertiary)
  Auto-dismisses after 3 seconds, or click anywhere to dismiss.
  The streak counter on the banner shows 0 with dormant icon.
```

---

## 4. Day View

**When:** Player clicks on an available or in-progress day node.

### Entry Transition
```
From the home screen, the clicked node scales up while everything else fades.
The transition takes 600ms.
The Day View slides in from a subtle fade + translateY(12px).
```

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back  │  [19] days remaining  │  47% ready  │  🌿 7     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    ┌──────────────────────────────────────────────┐         │
│    │              Day 8: Signals in the Dark       │         │
│    │                                               │         │
│    │  The corridors hum with a low frequency you   │         │
│    │  couldn't hear before. Something is trying    │         │  ← Narrative card
│    │  to communicate, but the signals arrive       │         │     (story intro)
│    │  out of order, fragmented. You need to        │         │
│    │  learn to wait for them properly.             │         │
│    │                                               │         │
│    │  PHM: Read chapters 10-11 before starting.    │         │
│    └──────────────────────────────────────────────┘         │
│                                                             │
│    Missions                                                 │
│                                                             │
│    ┌────────────────────────────────────────────┐           │
│    │  ◉ 1. Callback Echoes         [predict]    │  ✓        │
│    ├────────────────────────────────────────────┤           │
│    │  ◎ 2. The Broken Promise      [debug]      │  →        │  ← Mission list
│    ├────────────────────────────────────────────┤           │
│    │  ○ 3. Waiting for Light       [complete]   │  locked   │
│    ├────────────────────────────────────────────┤           │
│    │  ○ 4. Chained Transmissions   [refactor]   │  locked   │
│    └────────────────────────────────────────────┘           │
│                                                             │
│    Concepts: callbacks, promises, async/await, error handling│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Components

#### Narrative Card
```
Positioned at the top, below the countdown banner.
Uses the Narrative Card style from Visual Design Spec (glass, rose left border).
Content is the day's narrativeIntro field.

At the bottom of the narrative text, a PHM reading suggestion:
  "Before you begin: read Project Hail Mary chapters [X-Y]"
  (Inter 400, --text-sm, --drift-ice)
  This is a suggestion, not a gate. The player can skip to challenges.

If the player has already read the story (completed challenges):
  The narrativeIntro is replaced with narrativeOutro when all challenges are done.
```

#### Mission List
```
Vertical list of challenge cards, sequential.

Challenge card states:

  Completed (✓):
    Left accent: 3px solid --drift-sage
    Background: standard card + very faint sage overlay (rgba, 3%)
    Title: --drift-text-primary
    Type badge: as defined in Visual Design
    Right side: checkmark icon in --drift-sage
    Click: opens challenge in review mode (see solution, re-read explanation)

  Available (current, →):
    Left accent: 3px solid --drift-lavender, with pulse glow
    Background: standard card
    Title: --drift-text-primary
    Type badge: as defined
    Right side: arrow-right icon in --drift-lavender
    Click: opens challenge

  Locked (○):
    Left accent: none
    Background: --drift-mid at 50% opacity
    Title: --drift-text-ghost
    Type badge: greyed out
    Right side: lock icon in --drift-text-ghost
    Click: brief shake animation, nothing happens

Challenges unlock sequentially within a day.
You must complete challenge 1 before challenge 2 becomes available.
Exception: if a day has been previously completed (review mode), all are accessible.
```

#### Concepts Preview
```
Below the mission list, a subtle line of text:
  "Concepts: [comma-separated list]"
  (Inter 400, --text-xs, --drift-text-tertiary)
  These are the concepts from the Day model.
```

### Back Navigation
```
The back arrow (top-left of countdown banner) returns to home.
Transition: Day View fades out + translateY(12px), home fades in.
The Drift map shows any updates (completed challenges update the node state).
```

---

## 5. Challenge View

**When:** Player clicks on an available challenge from the Day View.

This is where the player spends most of their time. It must feel focused but not claustrophobic.

### Layout (Desktop, > 1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Day 8  │  [19] days remaining  │  47% ready  │  🌿 7       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ Instructions ──────────────┐  ┌─ Editor ─────────────────┐ │
│  │                              │  │ script.js            1:1  │ │
│  │  The Broken Promise          │  │───────────────────────── │ │
│  │  [debug]                     │  │                          │ │
│  │                              │  │  function fetchData() {  │ │
│  │  "A system tried to send a   │  │    return new Promise(   │ │
│  │   response, but the message  │  │      (resolve, reject)   │ │
│  │   never arrived. The promise │  │      => {                │ │
│  │   was made but broken.       │  │        setTimeout(() =>  │ │
│  │   Find out why."             │  │        {                 │ │
│  │                              │  │          reslove('data'); │ │
│  │  The function fetchData()    │  │        }, 1000);         │ │
│  │  should resolve with the     │  │      }                   │ │
│  │  string 'data' after 1       │  │    );                    │ │
│  │  second. But something is    │  │  }                       │ │
│  │  wrong. Find and fix the     │  │                          │ │
│  │  bug.                        │  │                          │ │
│  │                              │  │                          │ │
│  │                              │  │                          │ │
│  │  ┌─ Hints ──────────┐       │  │                          │ │
│  │  │ Hint 1 of 3  [▸]  │       │  │                          │ │
│  │  └────────────────────┘       │  │                          │ │
│  │                              │  │                          │ │
│  └──────────────────────────────┘  └──────────────────────────┘ │
│                                                                 │
│  ┌─ Output / Tests ─────────────────────────────────────────┐   │
│  │  Console    Tests (0/2)                                   │   │
│  │                                                           │   │
│  │  No output yet. Run your code to see results.             │   │
│  │                                                           │   │
│  │                                    [ Run ]  [ Submit ]    │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ◉──◎──○──○            Day 8: 1/4            [ ← Prev ] [Next →]│
└─────────────────────────────────────────────────────────────────┘
```

### Split: 35% instructions / 65% editor

The divider between instructions and editor is draggable (resize handle, --drift-text-ghost, hover: --drift-lavender).

### Instructions Panel

```
Scrollable if content exceeds height.

Structure:
  1. Challenge title (Inter 600, --text-lg)
  2. Type badge (pill, colored per type)
  3. Narrative hook (Cormorant Garamond 300, --text-base, --drift-text-primary, italic)
     This is the narrativeHook from the challenge model -- 1-2 sentences
     connecting the challenge to the story.
  4. Divider (1px line, --drift-surface, with 24px margin top/bottom)
  5. Instructions (Inter 400, --text-base, --drift-text-primary)
     Rendered as markdown. Can include:
       - Inline code: `backtick` styled with JetBrains Mono, --drift-mid background,
         rounded-md padding-x 6px, --drift-lavender text
       - Code blocks: Full JetBrains Mono, --drift-void background, --radius-sm,
         padding 16px, with syntax highlighting
       - Bold, italic, lists -- standard markdown styling
  6. Hints section (at the bottom of instructions)
```

### Hints System

```
Collapsed by default. Shows "Hints (0/3 used)" with a toggle arrow.

Clicking expands to show:
  ┌─ Hints ──────────────────────────────────┐
  │                                           │
  │  Hint 1:                                  │
  │  "Think about what happens when you       │
  │   misspell a method name."                │
  │                                           │
  │  [ Reveal Hint 2 ]        -10 XP          │
  │                                           │
  │  Hint 3: locked (reveal hint 2 first)     │
  │                                           │
  └───────────────────────────────────────────┘

Rules:
  - Hints reveal sequentially. You can't skip to hint 3.
  - Each hint reveal costs XP (shown next to the button: "-10 XP")
  - Already-revealed hints stay visible
  - The XP cost is deducted from the bonusXp.noHints reward, not from total XP
    (you never go negative, you just don't get the bonus)
  - Reveal animation: text fades in + slight translateY, 400ms
```

### Editor Panel

```
Monaco Editor with The Drift theme (defined in Visual Design Spec).

Header bar: filename, type badge (small), line:col indicator.

The editor loads with starterCode from the challenge.
Read-only regions (if defined) are visually indicated:
  - Background: slightly different shade (--drift-deep instead of --drift-void)
  - A thin left border in --drift-text-ghost
  - Cursor cannot enter these regions
  - Text in read-only regions uses a slightly lower opacity (0.7)

Editor features:
  - Syntax highlighting (Drift theme)
  - Basic autocomplete (for built-in JS/TS methods)
  - Bracket matching (highlighted with --drift-lavender at 15% opacity)
  - Error squiggles (--drift-fail underline, not red background)
  - Line numbers (--drift-text-ghost, active line: --drift-text-secondary)
  - Current line highlight (--drift-lavender at 4% opacity)
  - Minimap: OFF (too cluttered for short challenge code)
  - Word wrap: ON
```

### Output / Tests Panel

```
Below the editor (or in a horizontal split -- configurable).
Height: ~25-30% of the viewport, resizable.

Two tabs: "Console" and "Tests (X/Y)"

Console tab:
  Shows console.log output from the player's code.
  Each line: JetBrains Mono 400, --text-sm
  Prefixed with a subtle ">" in --drift-text-ghost
  Errors: --drift-fail text, with the error message
  Warnings: --drift-warning text
  Empty state: "No output yet. Run your code to see results."
               (Inter 400, --text-sm, --drift-text-ghost)

Tests tab:
  Shows test results (as defined in Visual Design Spec section 6.4)
  Before running: shows test descriptions with neutral status (--drift-text-ghost)
  After running: green checks / red X with details

  For hidden tests: shows description but "Test code hidden" in --drift-text-ghost
    instead of expected/received values on failure.
```

### Action Buttons

```
Bottom-right of the output panel:

  [ Run ]     Secondary button. Runs the code, shows console output. Does NOT run tests.
              Keyboard shortcut: Ctrl+Enter (shown as tooltip on hover)

  [ Submit ]  Primary button. Runs the code AND tests. Evaluates pass/fail.
              Keyboard shortcut: Ctrl+Shift+Enter (shown as tooltip)

Between buttons, a subtle divider (4px gap, no visual line).

When running:
  Button text changes to a small loading animation (the Lucide loader icon spinning)
  Button is disabled during execution
  Timeout: 5 seconds, then "Execution timed out" error in console
```

### Submission Flow

```
Player clicks Submit:

  1. Code executes in sandbox
  2. Tests run
  3. Results appear in Tests tab (with per-test animations)

  If any test fails:
    - Failed tests show in red with details
    - Console shows relevant output
    - No other action. Player can edit and resubmit.
    - Attempt counter increments silently.

  If all tests pass:
    - All test rows turn green (staggered, 100ms between each)
    - The test panel gets the glow animation (section 6.4 in Visual Design)
    - A brief bloom animation from the Submit button
    - 800ms pause for the moment to land

    Then:
    - If the challenge has an explainGate: the Explain Gate slides in
    - If no explainGate: immediately show completion state
```

### Explain Gate

```
Appears after all tests pass (if configured for this challenge).

The instructions panel transforms:
  Previous content slides out (300ms)
  Explain gate slides in (400ms)

  ┌─ Explain to Continue ────────────────────┐
  │                                           │
  │  "Why did your fix work?"                 │
  │  (or custom explainGate.prompt)           │
  │                                           │
  │  ┌─────────────────────────────────────┐  │
  │  │                                     │  │
  │  │  [Text area for player's            │  │
  │  │   explanation]                      │  │
  │  │                                     │  │
  │  │                                     │  │
  │  └─────────────────────────────────────┘  │
  │                                           │
  │  23/40 characters                         │
  │  (--drift-text-tertiary, or               │
  │   --drift-sage when >= minLength)         │
  │                                           │
  │                      [ Continue → ]       │
  │                                           │
  └───────────────────────────────────────────┘

The text area:
  Style: --drift-void background, Inter 400, --text-base
  Border: 1px solid --drift-lavender at 15%, focus: at 30%
  Placeholder: "Explain in your own words..."
  Min height: 80px

The character counter:
  Shows current/minimum
  Color changes from --drift-text-tertiary to --drift-sage when minimum met
  The Continue button enables when minimum met

The Continue button is disabled until minLength is reached.

The explanation is NOT auto-graded. The keywords in the model are used for
optional gentle guidance (future iteration). For MVP, any text above minLength
passes.

Clicking Continue:
  - Saves explanation to ChallengeProgress
  - Awards XP (with animations)
  - Marks challenge complete
  - Shows completion state
```

### Challenge Completion State

```
After all tests pass (and explain gate, if applicable):

The entire challenge view gets a subtle transformation:
  - A bloom animation radiates from the center
  - The background slightly brightens (--drift-deep → slightly lighter, 2%)

An overlay card appears center-screen (reveal animation):
  ┌─────────────────────────────────────────┐
  │                                         │
  │           Mission Complete               │
  │      (Cormorant Garamond 600, --text-xl)│
  │                                         │
  │              +25 XP                      │
  │      (Inter 700, --text-2xl, --drift-gold)
  │      (number counts up from 0, 600ms)   │
  │                                         │
  │   Bonuses:                              │
  │     First try    +10 XP                 │
  │     No hints     +5 XP                  │
  │   (each line reveals with 200ms stagger)│
  │                                         │
  │         [ Next Mission → ]              │
  │                                         │
  └─────────────────────────────────────────┘

If this was the LAST challenge of the day:
  The button says "Complete Day →" instead
  Clicking navigates to the Day Complete screen

If not the last:
  "Next Mission →" navigates to the next challenge
  The mission progress dots at the bottom update
```

### Predict-Type Challenge (Variant)

```
Predict challenges have a different UI:

Instead of Monaco editor, the code panel shows:
  - Read-only code block (styled like the editor but not editable)
  - Below it, either:
    a) A text input: "What will this code output?"
       (single line, Inter 400, --drift-void background)
    b) Multiple choice options (if predictChoices is defined):
       Radio buttons styled as cards:
         ┌──────────────────────────────┐
         │  ○  "undefined"              │
         ├──────────────────────────────┤
         │  ○  "[object Object]"        │
         ├──────────────────────────────┤
         │  ○  "42"                     │
         ├──────────────────────────────┤
         │  ○  "TypeError"              │
         └──────────────────────────────┘
       Each option is a card-style row (--drift-mid background)
       Hover: --drift-surface background, lavender border
       Selected: --drift-lavender border, lavender background at 8%

Submit checks the player's answer against predictAnswer.
  - Correct: green bloom, same completion flow
  - Incorrect: the selected option flashes red briefly,
    then the correct answer highlights in green,
    and below it an explanation appears:
      "The output is [X] because [explanation from solution field]"
    The player can then click "I understand → Continue"
    This still counts as a completion (no XP penalty for wrong prediction)
    but firstTry bonus is lost.
```

---

## 6. Boss Battle View

**When:** Days 7, 13, 20, 26 (end of each week).

### Differences from Regular Challenge

```
1. Timer:
   A visible countdown timer in the top-right area of the editor panel.
   Style: Inter 700, --text-xl
   Color: --drift-gold when > 50% time remaining
          --drift-warning when 25-50%
          --drift-fail when < 25% (also starts pulsing)
   The timer is not fatal -- when it expires, a message appears:
     "Time's up. But you can keep working."
     (--drift-text-secondary)
   The timer turning to 0 just means no speed bonus XP.

2. Scale:
   Boss battles are larger -- multiple files, more complex requirements.
   The editor may need tabs for multiple files (for Angular challenges).
   Tab bar style: same as editor header, tabs are --drift-mid background,
   active tab has a bottom border in --drift-lavender.

3. Narrative:
   Boss battles have a more dramatic narrative hook.
   "The structure at the heart of this cluster is failing.
    Its systems are interconnected -- fix one and you'll
    understand the others. But time is short."

4. Completion:
   Boss battle completion triggers a more dramatic Drift unlock:
   - Multiple nodes connect at once
   - A larger structure element activates (the "reef" or "beacon" types)
   - The bloom animation is bigger and uses --drift-gold

5. For Angular boss battles (weeks 3-4):
   The Monaco editor is replaced with an embedded StackBlitz instance.
   The StackBlitz embed fills the entire editor panel area.
   Custom styling wraps the embed to match The Drift aesthetic:
   - Container: --drift-void border, --radius-md, --shadow-2
   - StackBlitz's own UI shows inside (can't be fully themed,
     but the container integrates it)
```

---

## 7. Day Complete Screen

**When:** Player completes the last challenge of a day.

```
Full-viewport overlay with .drift-glass background.

Center content, stacked vertically:

  ┌──────────────────────────────────────────────────┐
  │                                                  │
  │              Day 8 Complete                       │
  │     (Cormorant Garamond 600, --text-3xl)         │
  │                                                  │
  │     "Signals in the Dark"                         │
  │     (Cormorant Garamond 300, --text-xl,          │
  │      --drift-lavender)                            │
  │                                                  │
  │              +120 XP                              │
  │     (Inter 700, --text-4xl, --drift-gold,        │
  │      counts up from 0)                            │
  │                                                  │
  │     ━━━━━━━━━━━━━━━━━━━━━━━                      │  ← thin divider
  │                                                  │
  │     [Narrative outro text here.                   │
  │      The story continues...                       │
  │      Cormorant Garamond 300, --text-base,        │
  │      --drift-text-primary, max-width 560px,      │
  │      centered, line-height 1.8]                   │
  │                                                  │
  │     "In Project Hail Mary, Ryland is starting     │
  │      to understand the ship's systems too.        │
  │      Read chapters 12-13 to see what he           │
  │      discovers next."                             │
  │     (Inter 400, --text-sm, --drift-ice)           │
  │                                                  │
  │     Day 8 streak: 8 days                          │
  │     (wisp icon + number, --drift-gold)            │
  │                                                  │
  │         [ Return to The Drift ]                   │
  │         (Primary button)                          │
  │                                                  │
  └──────────────────────────────────────────────────┘

Background: while this screen is visible, the Drift map is subtly
visible behind the glass overlay, and the newly completed node's
bloom animation plays in the background.
```

---

## 8. Progress View

**When:** Player clicks the stats icon from the home screen.

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back  │  [19] days remaining  │  47% ready  │  🌿 7     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Your Journey                                               │
│  (Cormorant Garamond 600, --text-2xl)                       │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Level 5  │  │ 1,247 XP │  │ 8 day    │  │ 67%      │   │
│  │Interfacing│  │ total    │  │ streak   │  │ ready    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                             │
│  Skill Constellation                                        │
│  (Interactive skill tree visualization)                     │
│                                                             │
│       [JS Fundamentals]──[JS Advanced]                      │
│              │                 │                             │
│         [TypeScript]     [Async Patterns]                   │
│              │                 │                             │
│       [Angular Core]──[Angular Advanced]                    │
│                                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                             │
│  Challenge History                                          │
│  (Scrollable list of completed challenges with XP earned)   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Stat Cards

```
Four stat cards in a horizontal row.
Each card: standard card style, 120px width, centered text.

  Value: Inter 700, --text-2xl, accent color
  Label: Inter 400, --text-xs, --drift-text-secondary

Colors:
  Level:     --drift-lavender (value shows level name, e.g., "Interfacing")
  XP:        --drift-gold
  Streak:    --drift-gold (wisp icon beside number)
  Readiness: color varies by percentage (same as countdown banner)
```

### Skill Constellation

```
The skill tree is NOT a traditional tree or grid. It mirrors The Drift aesthetic.

It's a smaller constellation map, like a focused section of The Drift.
Nodes represent skill categories (6 total):
  1. JS Fundamentals     (--drift-lavender)
  2. JS Advanced         (--drift-ice)
  3. TypeScript          (--drift-rose)
  4. Async Patterns      (--drift-gold)
  5. Angular Core        (--drift-sage)
  6. Angular Advanced    (--drift-sage, brighter)

Each node has 3 levels (visualized as concentric rings or brightness):
  Level 0 (locked):   Dormant (same as Drift map dormant node)
  Level 1 (bronze):   Faint glow
  Level 2 (silver):   Medium glow
  Level 3 (gold):     Full glow + radiant

Clicking a skill node shows a tooltip with:
  - Skill name
  - Level (1/3, 2/3, etc.)
  - List of related challenges and their completion status
  - Concepts within this skill

Connection lines between related skills follow the same style as Drift map connections.
```

### Challenge History

```
Scrollable list below the skill constellation.
Each row is a compact card:

  ┌──────────────────────────────────────────────────────────┐
  │  Day 5, Challenge 3    "Naming the Patterns"    +30 XP  │
  │  [refactor] Arrays & Objects     3 attempts     12 min  │
  └──────────────────────────────────────────────────────────┘

Row style: --drift-mid background, --radius-sm, padding 12px 16px
First line: Inter 500, --text-sm, --drift-text-primary
Second line: Inter 400, --text-xs, --drift-text-secondary

Click expands to show:
  - The player's final code snapshot
  - Their explanation (if applicable)
  - Test results
```

---

## 9. Settings View

**When:** Player clicks the settings icon from home screen.

```
Minimal. This is not a complex settings page.

┌─────────────────────────────────────────────────────┐
│  Settings                                           │
│  (Cormorant Garamond 600, --text-2xl)               │
│                                                     │
│  Internship Start Date                              │
│  [Date picker]                                      │
│  (Adjusts the countdown. Warning if changed.)       │
│                                                     │
│  Day Unlock Mode                                    │
│  ○ Calendar-locked (one new day per real day)       │
│  ● Completion-only (unlock by finishing previous)   │
│  (Radio buttons, standard card-style rows)          │
│                                                     │
│  Sound                                              │
│  Ambient music    [━━━━━━━░░░░] 15%                │
│  Sound effects    [━━━━━━━━░░░] 30%                │
│  (Sliders with --drift-lavender fill)               │
│                                                     │
│  Data                                               │
│  [ Export Progress ]  (Secondary button)            │
│  [ Import Progress ]  (Secondary button)            │
│  [ Reset All Data ]   (Danger button: --drift-fail  │
│                        border, confirms before       │
│                        executing)                    │
│                                                     │
│  About                                              │
│  "26 DAYS -- The Drift"                             │
│  "A 26-day coding survival experience."             │
│  (--drift-text-tertiary)                            │
│                                                     │
└─────────────────────────────────────────────────────┘

The Reset All Data button requires a confirmation:
  A modal appears:
    "This will erase all progress. Your Drift will go dark.
     This cannot be undone."
    [ Cancel ]  [ Reset Everything ]
    The reset button is --drift-fail styled.
```

---

## 10. Keyboard Shortcuts

```
Global:
  Escape          — Go back (same as clicking back arrow)

Challenge view:
  Ctrl+Enter      — Run code (without tests)
  Ctrl+Shift+Enter — Submit (run code + tests)
  Ctrl+H          — Toggle hint panel
  Ctrl+/          — Toggle comment (Monaco built-in)

Navigation:
  Ctrl+Shift+P    — Quick navigate (similar to VS Code command palette)
                    Shows a floating search that lets you jump to any
                    available day or challenge by typing its name.
                    Style: .drift-glass, centered, --radius-lg
```

---

## 11. Transition Map (Complete)

Every route transition in the app:

```
Home → Day View:
  Clicked node scales up, other elements fade
  Day View reveals with translateY(12px) → 0, opacity 0 → 1
  Duration: 600ms

Day View → Challenge View:
  Day View slides left + fades
  Challenge View slides in from right + fades in
  Duration: 400ms

Challenge View → Challenge View (next):
  Current challenge slides left
  Next challenge slides in from right
  Duration: 300ms

Challenge View → Day View (back):
  Challenge View slides right + fades
  Day View slides in from left + fades in
  Duration: 400ms

Day View → Home (back):
  Day View fades + translateY(12px)
  Home fades in, constellation visible
  Duration: 500ms

Day View → Day Complete:
  Day View fades to 50% opacity
  Day Complete overlay fades in over it
  Duration: 600ms

Day Complete → Home:
  Overlay fades out
  Home fades in with the updated Drift map
  Bloom animation plays on the completed node
  Duration: 800ms

Any → Progress View:
  Current view fades
  Progress View slides in from bottom
  Duration: 400ms

Any → Settings View:
  Same as Progress View transition
```

---

## 12. Loading States

```
When loading challenge data:
  The instructions panel shows a skeleton loader:
    3-4 lines of --drift-surface rectangles with rounded corners
    pulsing in opacity (0.3 → 0.6 → 0.3, 1.5s cycle)
  The editor shows nothing (just --drift-void)

When executing code:
  The Run/Submit button shows a spinning loader icon
  The output panel shows:
    "Running..." with a subtle dot animation (...  → .  → ..  → ...)
  Duration should be < 1 second for JS challenges

When loading StackBlitz (Angular challenges):
  A full-panel skeleton loader
  Below it: "Initializing environment..."
  (This can take a few seconds on first load)

When transitioning between screens:
  Content fades out before new content fades in
  Never show a blank white/black screen
  The background particles continue animating during transitions
```

---

## 13. Error States

```
Code execution error:
  The console tab shows the error in --drift-fail text
  Common errors get a helpful tooltip:
    "ReferenceError: x is not defined"
    → "Looks like 'x' hasn't been declared. Check your variable names."
    (Inter 400, --text-xs, --drift-text-secondary, below the error)

Network error (if applicable):
  A toast notification slides in from the top:
    .drift-glass background, --drift-warning left border
    "Connection issue. Your progress is saved locally."
    Auto-dismisses after 5 seconds.

StackBlitz load failure:
  The embed area shows:
    "Environment failed to load."
    [ Retry ]  [ Switch to offline mode ]
    Offline mode falls back to Monaco editor with test descriptions
    (can't run Angular tests, but can still write code)

Data corruption (IndexedDB):
  On detection, show a modal:
    "Your progress data may be corrupted."
    [ Try to recover ]  [ Export what's left ]  [ Reset ]
```

---

## Next Specs
- **04-narrative.md** — 26-day story script, PHM chapter mapping
- **05-challenge-curriculum.md** — All 150+ challenges with code and tests
