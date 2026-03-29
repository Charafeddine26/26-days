# 26 DAYS — Foundation Spec

## Document Purpose
This is the technical foundation for "26 DAYS," a 26-day coding survival game that teaches JavaScript and Angular through daily micro-challenges wrapped in a narrative space exploration experience called "The Drift." This spec covers architecture, tech stack, data models, and challenge format. Your friend should read this first before anything else.

---

## 1. Tech Stack

### Core Framework
**Angular 17+ (Standalone Components, Signals)**
- Why: The app IS the learning material. By week 3, the player literally studies this app's source code. Use Angular's latest patterns so the player learns modern Angular, not legacy.
- Standalone components only (no NgModules except where strictly necessary)
- Use Signals for reactive state (not RxJS for UI state -- reserve RxJS for HTTP and complex async flows, which the player will learn in week 4)
- SSR not needed. This is a fully client-side SPA.

### Styling
**Tailwind CSS 3.4+**
- Why: Utility-first means your friend can replicate the visual spec pixel-perfectly by following class lists. No interpretation needed.
- Custom theme config for The Drift's palette (defined in Visual Design Spec)
- `@apply` only in base layer for reusable component classes (buttons, cards, inputs)
- No component libraries (no Angular Material, no PrimeNG). Every component is hand-built to match The Drift's aesthetic.

### Animation
**GSAP 3 (GreenSock Animation Platform)**
- Why: The Drift's organic, fluid, bioluminescent animations need precision that CSS transitions can't deliver. GSAP handles complex timelines, morphing, particle effects, and scroll-driven animations.
- Use GSAP's ScrollTrigger for parallax and reveal effects
- Use GSAP's MotionPath for floating/drifting particle movements
- Combine with CSS custom properties for color transitions that feel alive

### Code Editor (In-Challenge)
**Monaco Editor (@aspect-build/angular-monaco-editor or custom wrapper)**
- Why: Same editor engine as VS Code. The player gets familiar with the tool they'll actually use at work.
- Syntax highlighting, autocomplete, error squiggles
- Custom theme matching The Drift's palette (dark indigo background, soft-glow syntax colors)
- Read-only regions for challenge scaffolding (player can only edit designated zones)

### Code Execution Engine

#### Weeks 1-2 (JavaScript Challenges)
**Sandboxed eval via Web Workers**
- Create a Web Worker that receives code as a string
- Worker runs the code in an isolated context (no DOM access, no network)
- Worker captures console.log output, return values, and errors
- Test assertions run inside the Worker, return pass/fail results
- Timeout: 5 seconds max execution, then kill the Worker
- Implementation: a `CodeRunner` service that posts code + tests to the Worker and returns a structured result

```typescript
// Simplified interface
interface ExecutionResult {
  status: 'pass' | 'fail' | 'error' | 'timeout';
  output: string[];           // captured console.log lines
  testResults: TestResult[];  // individual test pass/fail
  error?: string;             // runtime error message
  executionTime: number;      // ms
}

interface TestResult {
  description: string;
  passed: boolean;
  expected?: string;
  received?: string;
}
```

#### Weeks 3-4 (Angular Challenges)
**StackBlitz WebContainers (SDK)**
- Why: Angular requires a build step (TypeScript compilation, template parsing). You can't eval() an Angular component. StackBlitz's WebContainers run a full Node.js environment in the browser -- no backend needed.
- Embed a StackBlitz instance per challenge with pre-configured Angular project
- Player edits specific files within the embedded environment
- Tests run inside the WebContainer (Jasmine/Karma or Jest, pre-configured)
- The embedded preview shows the running Angular app in real-time

**Fallback option:** If StackBlitz SDK licensing or complexity is an issue, use a lightweight backend (Node.js + Docker) that receives code, compiles, runs tests, and returns results. But WebContainers are strongly preferred for the zero-backend architecture.

### Data & State

#### Progress & State: LocalStorage + IndexedDB
- LocalStorage for lightweight state: current day, streak count, XP, settings
- IndexedDB (via `idb` library) for heavier data: challenge completion history, code snapshots, explanation text the player typed
- No backend, no auth, no database server. This is a single-player experience. Everything lives on the player's machine.
- Export/import progress as JSON (backup mechanism)

#### Challenge Content: Static JSON files
- All challenges are authored as JSON and bundled with the app at build time
- Loaded lazily per day (don't load all 150 challenges on app init)
- Structure defined below in Data Models

### Build & Dev
- **Angular CLI** for project scaffolding, builds, and dev server
- **pnpm** as package manager (faster, stricter than npm)
- **ESLint + Prettier** pre-configured (the player will see clean code when studying the source)

---

## 2. Project Structure

```
26-days/
├── src/
│   ├── app/
│   │   ├── core/                          # Singleton services, guards, interceptors
│   │   │   ├── services/
│   │   │   │   ├── progress.service.ts    # Tracks day completion, XP, streaks
│   │   │   │   ├── challenge.service.ts   # Loads and manages challenge data
│   │   │   │   ├── code-runner.service.ts # Sandboxed code execution (weeks 1-2)
│   │   │   │   ├── narrative.service.ts   # Story text, chapter mapping
│   │   │   │   ├── drift-state.service.ts # Visual state of The Drift (what's alive, what's dormant)
│   │   │   │   └── audio.service.ts       # Ambient sound management
│   │   │   ├── guards/
│   │   │   │   └── day-unlock.guard.ts    # Prevents accessing future days
│   │   │   └── models/
│   │   │       ├── challenge.model.ts
│   │   │       ├── progress.model.ts
│   │   │       ├── narrative.model.ts
│   │   │       └── drift.model.ts
│   │   │
│   │   ├── features/
│   │   │   ├── home/                      # The Drift main view (hub/map)
│   │   │   │   ├── home.component.ts
│   │   │   │   ├── home.component.html
│   │   │   │   └── components/
│   │   │   │       ├── drift-map/         # The visual constellation/reef map
│   │   │   │       ├── countdown/         # "18 days left, 47% ready"
│   │   │   │       ├── streak-display/    # Current streak indicator
│   │   │   │       └── day-node/          # Individual day entry point on the map
│   │   │   │
│   │   │   ├── day/                       # A single day's mission screen
│   │   │   │   ├── day.component.ts
│   │   │   │   ├── day.component.html
│   │   │   │   └── components/
│   │   │   │       ├── mission-list/      # The day's challenge list
│   │   │   │       ├── challenge-card/    # Individual challenge preview
│   │   │   │       └── narrative-panel/   # Story text for the day
│   │   │   │
│   │   │   ├── challenge/                 # The challenge execution screen
│   │   │   │   ├── challenge.component.ts
│   │   │   │   ├── challenge.component.html
│   │   │   │   └── components/
│   │   │   │       ├── code-editor/       # Monaco editor wrapper
│   │   │   │       ├── instructions/      # Challenge prompt panel
│   │   │   │       ├── test-results/      # Green/red test feedback
│   │   │   │       ├── explain-gate/      # "Explain why this works" input
│   │   │   │       ├── output-console/    # Console output display
│   │   │   │       └── hint-system/       # Progressive hint reveals
│   │   │   │
│   │   │   ├── boss-battle/              # Weekly boss battle screen
│   │   │   │   ├── boss-battle.component.ts
│   │   │   │   └── components/
│   │   │   │       ├── timer/            # Countdown timer for timed battles
│   │   │   │       └── stackblitz-embed/ # Full editor for Angular challenges
│   │   │   │
│   │   │   ├── progress/                 # Stats, skill tree, history
│   │   │   │   └── components/
│   │   │   │       ├── skill-tree/       # Visual skill progression
│   │   │   │       ├── stats-panel/      # XP, streaks, completion %
│   │   │   │       └── readiness-meter/  # The "X% ready" gauge
│   │   │   │
│   │   │   └── settings/                 # User preferences
│   │   │
│   │   ├── shared/                       # Reusable UI components
│   │   │   ├── components/
│   │   │   │   ├── drift-button/         # Styled button
│   │   │   │   ├── drift-card/           # Styled card container
│   │   │   │   ├── drift-badge/          # XP/streak badges
│   │   │   │   ├── glow-text/            # Text with soft glow effect
│   │   │   │   ├── particle-field/       # Background particle animation
│   │   │   │   └── floating-panel/       # Panel that "floats" with subtle animation
│   │   │   ├── pipes/
│   │   │   └── directives/
│   │   │       └── parallax.directive.ts  # Subtle parallax on mouse move
│   │   │
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   │
│   ├── assets/
│   │   ├── challenges/                    # Challenge JSON files
│   │   │   ├── day-01.json
│   │   │   ├── day-02.json
│   │   │   └── ...
│   │   ├── narrative/                     # Story text files
│   │   │   ├── day-01.json
│   │   │   └── ...
│   │   ├── audio/                         # Ambient sounds
│   │   │   ├── drift-ambient.mp3
│   │   │   └── challenge-complete.mp3
│   │   └── images/                        # Minimal -- most visuals are CSS/SVG/Canvas
│   │       └── drift-structures/          # SVG fragments for Drift map elements
│   │
│   ├── styles/
│   │   ├── tailwind.css                   # Tailwind imports + base layer
│   │   ├── drift-theme.css                # CSS custom properties for The Drift
│   │   ├── monaco-theme.ts                # Monaco editor theme definition
│   │   └── animations.css                 # Reusable GSAP-triggered CSS states
│   │
│   └── workers/
│       └── code-runner.worker.ts          # Web Worker for sandboxed JS execution
│
├── tailwind.config.ts                     # Custom Drift palette + theme extensions
├── angular.json
├── tsconfig.json
├── package.json
└── README.md
```

---

## 3. Data Models

### 3.1 Challenge

```typescript
/**
 * A single challenge within a day's missions.
 */
interface Challenge {
  id: string;                    // e.g., "d01-c03" (day 1, challenge 3)
  dayNumber: number;             // 1-26
  order: number;                 // Position within the day (1-5)

  // Classification
  type: ChallengeType;
  difficulty: 'gentle' | 'steady' | 'demanding' | 'boss';
  concepts: string[];            // e.g., ["variables", "let-vs-const", "type-coercion"]
  week: 1 | 2 | 3 | 4;

  // Content
  title: string;                 // e.g., "The First Signal"
  narrativeHook: string;         // 1-2 sentences connecting to the story
                                 // e.g., "The console flickers. A pattern repeats in the static.
                                 //        If you can name what you see, the system responds."

  instructions: string;          // Markdown. The actual challenge prompt.

  // Code
  starterCode: string;           // What appears in the editor when the challenge loads
  readOnlyRegions?: CodeRegion[];// Regions the player cannot edit
  solution: string;              // The correct code (never shown to player, used for hints)

  // For "Predict" type challenges
  predictPrompt?: string;        // "What will this code output?"
  predictAnswer?: string;        // The correct prediction
  predictChoices?: string[];     // Multiple choice options (if applicable)

  // Testing
  tests: ChallengeTest[];       // Assertion tests

  // Explain gate
  explainGate?: {
    prompt: string;              // "Why does `const` prevent reassignment but not mutation?"
    keywords: string[];          // Words/phrases that should appear in a good explanation
                                 // Not for strict validation -- for gentle guidance
    minLength: number;           // Minimum character count (e.g., 40)
  };

  // Hints (progressive reveal)
  hints: string[];               // Array of hints, revealed one at a time
                                 // e.g., ["Think about what `typeof` returns for arrays",
                                 //        "Arrays are objects in JavaScript",
                                 //        "Use Array.isArray() instead of typeof"]

  // Rewards
  xpReward: number;              // Base XP for completion
  bonusXp?: {
    noHints: number;             // Bonus if solved without hints
    firstTry: number;            // Bonus if solved on first submission
    speedBonus: number;          // Bonus if solved under time threshold
    speedThresholdMs: number;    // Time threshold for speed bonus
  };

  // Time limit (boss battles only)
  timeLimitMinutes?: number;
}

type ChallengeType =
  | 'predict'     // Read code, predict output
  | 'debug'       // Find and fix the bug
  | 'complete'    // Fill in the blanks
  | 'refactor'    // Improve working code
  | 'build';      // Write from scratch

interface CodeRegion {
  startLine: number;
  endLine: number;
}

interface ChallengeTest {
  description: string;           // "should return the sum of two numbers"
  testCode: string;              // The actual test assertion code
                                 // Runs in the sandbox after the player's code
  hidden?: boolean;              // If true, description shown but test code hidden
                                 // (prevents reverse-engineering the answer from tests)
}
```

### 3.2 Day

```typescript
/**
 * A single day's content package.
 */
interface Day {
  dayNumber: number;             // 1-26
  week: 1 | 2 | 3 | 4;

  // Narrative
  title: string;                 // e.g., "Awakening"
  narrativeIntro: string;        // Story text shown before challenges (markdown)
  narrativeOutro: string;        // Story text shown after all challenges complete (markdown)
  phmChapters: number[];         // Which Project Hail Mary chapters to read today
                                 // e.g., [1, 2] for day 1
  phmConnectionNote: string;     // Brief note on how today's story connects to PHM
                                 // "Like Ryland waking up in an unknown ship, you're
                                 //  encountering a system with no context. Start by naming
                                 //  what you see."

  // Challenges
  challengeIds: string[];        // Ordered list of challenge IDs for this day

  // Drift state changes
  driftUnlocks: DriftUnlock[];   // What lights up in The Drift when this day is completed

  // Learning objectives
  concepts: string[];            // Concepts covered this day
  conceptsPreview: string;       // One-line summary: "Variables, constants, and basic types"
}

interface DriftUnlock {
  elementId: string;             // ID of the Drift map element to activate
  animation: 'glow' | 'connect' | 'reveal' | 'pulse' | 'bloom';
  color?: string;                // Override color for this unlock
  delay?: number;                // Delay before animation plays (ms)
}
```

### 3.3 Player Progress

```typescript
/**
 * The player's complete state. Stored in IndexedDB.
 */
interface PlayerProgress {
  // Core
  startDate: string;             // ISO date of day 1
  currentDay: number;            // Highest unlocked day

  // Streak
  streak: number;                // Current consecutive days
  longestStreak: number;
  lastCompletedDate: string;     // ISO date

  // XP & Level
  totalXp: number;
  level: number;                 // Derived from totalXp via thresholds

  // Per-day tracking
  days: Record<number, DayProgress>;

  // Skill tree
  skills: Record<string, SkillNode>;

  // Stats
  totalChallengesCompleted: number;
  totalChallengesAttempted: number;
  firstTryCompletions: number;
  noHintCompletions: number;
  totalTimeSpentMs: number;
}

interface DayProgress {
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  unlockedAt?: string;           // ISO datetime
  completedAt?: string;          // ISO datetime
  challenges: Record<string, ChallengeProgress>;
}

interface ChallengeProgress {
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  attempts: number;
  hintsUsed: number;
  completedAt?: string;
  timeSpentMs: number;
  xpEarned: number;
  explanation?: string;          // What the player typed in the explain gate
  codeSnapshot?: string;         // Their final submitted code
  firstTry: boolean;
}

interface SkillNode {
  id: string;                    // e.g., "js-variables", "ng-components"
  label: string;
  category: 'js-fundamentals' | 'js-advanced' | 'typescript' | 'angular-core' | 'angular-advanced';
  level: number;                 // 0 = locked, 1-3 = bronze/silver/gold
  challengeIds: string[];        // Challenges that contribute to this skill
  completedChallengeIds: string[];
}
```

### 3.4 Drift Map State

```typescript
/**
 * Visual state of The Drift -- what's alive, what's dormant.
 */
interface DriftMapState {
  elements: Record<string, DriftElement>;
  connections: DriftConnection[];  // Lines/paths between activated elements
  ambientIntensity: number;        // 0-1, increases as more is unlocked
  regionName: string;              // Changes as player progresses through weeks
}

interface DriftElement {
  id: string;
  type: 'node' | 'structure' | 'reef' | 'current' | 'beacon';
  position: { x: number; y: number };  // Relative coordinates (0-100 range)
  status: 'dormant' | 'awakening' | 'active' | 'radiant';
  linkedDay: number;
  label?: string;                  // Shown on hover when active
  glowColor: string;               // Hex color from the Drift palette
  size: 'small' | 'medium' | 'large';
}

interface DriftConnection {
  from: string;                    // element ID
  to: string;                     // element ID
  status: 'hidden' | 'faint' | 'visible' | 'bright';
  activatesOnDay: number;
}
```

---

## 4. Challenge Execution Pipeline

### 4.1 JavaScript Challenges (Days 1-13)

```
Player writes code in Monaco Editor
        │
        ▼
Challenge Service combines:
  - Player's code
  - Challenge test code
  - Execution wrapper (captures console.log, handles errors)
        │
        ▼
Posts combined script to Web Worker
        │
        ▼
Worker executes in sandboxed context:
  - No DOM access
  - No fetch/network
  - No require/import
  - 5-second timeout
        │
        ▼
Worker returns ExecutionResult:
  - console output
  - test results (pass/fail per test)
  - errors (if any)
        │
        ▼
Challenge component displays results:
  - Green checks / red X per test
  - Console output panel
  - Error messages with line numbers
        │
        ▼
If all tests pass:
  - Show explain gate (if configured)
  - Award XP
  - Update progress
  - Trigger Drift animation
```

### 4.2 Angular Challenges (Days 14-26)

```
Challenge loads with pre-configured StackBlitz project
        │
        ▼
StackBlitz SDK embeds a full Angular dev environment:
  - Pre-installed dependencies
  - Pre-written test files
  - Player edits specific component/service files
        │
        ▼
StackBlitz runs Angular dev server internally:
  - Live preview of the running app
  - Real-time TypeScript compilation
        │
        ▼
Player clicks "Run Tests":
  - StackBlitz runs `ng test --watch=false`
  - Test output captured and parsed
        │
        ▼
Results displayed in the app's test panel
(same green/red UI as JS challenges)
        │
        ▼
Same completion flow: explain gate → XP → Drift animation
```

---

## 5. Routing

```typescript
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,            // The Drift map + countdown + streak
  },
  {
    path: 'day/:dayNumber',
    component: DayComponent,             // Day's mission list + narrative
    canActivate: [dayUnlockGuard],       // Blocks access to future days
  },
  {
    path: 'day/:dayNumber/challenge/:challengeId',
    component: ChallengeComponent,       // The actual coding challenge
    canActivate: [dayUnlockGuard],
  },
  {
    path: 'day/:dayNumber/boss',
    component: BossBattleComponent,      // Weekly boss battle
    canActivate: [dayUnlockGuard],
  },
  {
    path: 'progress',
    component: ProgressComponent,        // Stats, skill tree, history
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
```

---

## 6. Day Unlock Logic

```typescript
/**
 * A day unlocks when:
 * 1. The previous day is completed (all challenges passed), AND
 * 2. The calendar date is >= startDate + (dayNumber - 1)
 *
 * Exception: Day 1 is always available.
 *
 * This dual condition ensures:
 * - You can't skip ahead even if you finish early
 * - You can't access day 5 content on day 1 even if you blaze through
 * - BUT if you miss a day, you can catch up (do day 3 and 4 on the same real day
 *   if day 3 was already unlocked)
 *
 * The real-date lock is OPTIONAL and configurable. For testing or if the player
 * starts late, they can disable it in settings and unlock purely by completion.
 */
```

---

## 7. XP & Level System

```typescript
const XP_THRESHOLDS = [
  0,      // Level 0: "Adrift"
  100,    // Level 1: "Conscious"
  250,    // Level 2: "Observing"
  500,    // Level 3: "Decoding"
  800,    // Level 4: "Translating"
  1200,   // Level 5: "Interfacing"
  1700,   // Level 6: "Navigating"
  2300,   // Level 7: "Orchestrating"
  3000,   // Level 8: "Architecting"
  3800,   // Level 9: "Resonating"
  4800,   // Level 10: "Awakened"
];

// XP rewards per challenge type
const BASE_XP = {
  predict: 15,
  debug: 25,
  complete: 20,
  refactor: 30,
  build: 50,       // Boss battles
};

// Multipliers
const STREAK_MULTIPLIER = {
  3: 1.1,    // 3-day streak: +10%
  7: 1.25,   // 7-day streak: +25%
  14: 1.5,   // 14-day streak: +50%
  21: 2.0,   // 21-day streak: 2x (you're a machine)
};
```

---

## 8. Streak System

```
Streak rules:
- A day is "completed" when ALL challenges for that day are passed (tests green + explain gates done)
- The streak increments when you complete a day's challenges
- The streak resets to 0 if a calendar day passes with no day completed
  (specifically: if today > lastCompletedDate + 1 day, streak = 0)
- Grace period: none. The pressure is the point.
- The streak is displayed prominently on every screen
- When streak breaks: a somber animation plays in The Drift (lights dim slightly,
  a structure goes dormant). This should feel like loss, not punishment.
```

---

## 9. Readiness Score

```typescript
/**
 * The "X% ready for your internship" score.
 * This is NOT just "challenges completed / total challenges."
 * It weights different skills and factors:
 */
function calculateReadiness(progress: PlayerProgress): number {
  const weights = {
    challengeCompletion: 0.40,    // % of challenges completed
    conceptCoverage: 0.25,        // % of unique concepts encountered
    explainGateQuality: 0.15,     // Average explain gate completion
    consistency: 0.10,            // Streak factor
    bossBattles: 0.10,            // Boss battles completed
  };

  // Each factor returns 0-100
  // Final score is weighted average
  // Displayed as: "47% ready" with the countdown: "18 days left"
}
```

---

## 10. Key Technical Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Angular 17+ standalone | Meta-learning: player studies the app's own code |
| Styling | Tailwind CSS | Precise control, easy to spec, no abstraction leaks |
| Animation | GSAP 3 | Complex organic animations that CSS can't handle |
| Code editor | Monaco | Industry standard, teaches real tooling |
| JS execution | Web Workers | Sandboxed, no backend needed, instant feedback |
| Angular execution | StackBlitz WebContainers | Full Angular environment in-browser, no backend |
| State storage | IndexedDB + LocalStorage | No backend, no auth, single-player |
| Challenge content | Static JSON | Simple to author, version-control, and load lazily |
| Package manager | pnpm | Fast, strict, disk-efficient |
| No component library | Custom components only | The Drift aesthetic can't be achieved with Material |

---

## Next Specs
- **02-visual-design.md** — The Drift aesthetic bible (colors, typography, spacing, every component's visual spec)
- **03-ui-ux-flow.md** — Every screen, state, transition, and interaction
- **04-narrative.md** — 26-day story script, PHM chapter mapping
- **05-challenge-curriculum.md** — All 150+ challenges with code and tests
