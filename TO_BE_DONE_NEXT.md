# TO BE DONE NEXT

Status snapshot taken 2026-03-07.

---

## What Is Built

| Area | Files | Status |
|------|-------|--------|
| Challenge model + service | `challenge.model.ts`, `challenge.service.ts` | Done |
| Code runner + Web Worker | `code-runner.service.ts`, `code-runner.worker.ts` | Done |
| StackBlitz runner | `stackblitz-runner.service.ts` | Done |
| Challenge view | `challenge.component.ts/html` (predict, code, tests, hints, explain gate, completion overlay, StackBlitz embed) | Done |
| Boss Battle view | `boss-battle.component.ts/html` (timer with color urgency, multi-file tabs, gold completion overlay, `/day/:dayNumber/boss` route) | Done |
| Progress model + service | `progress.model.ts`, `progress.service.ts` (localStorage, XP, levels, streak, readiness) | Done |
| Day view | `day.component.ts/html` (narrative card, sequential mission list, boss routing) | Done |
| Home / Drift Map | `home.component.ts/html` (26-day grid, status colors) | Done — grid only, not constellation |
| Onboarding | `onboarding.component.ts/html` (2-step: intro + date picker) | Done |
| Progress view | `progress.component.ts/html` (stat cards, basic challenge list) | Partial — skill constellation and full history missing |
| Settings view | `settings.component.ts/html` (date, calendar lock, volume, export/import/reset) | Done |
| Countdown banner | `countdown-banner.component.ts/html` (days remaining, readiness, streak) | Done |
| Day Complete screen | `day-complete.component.ts/html` (XP, narrative outro, PHM note, Return to Drift) | Done |
| Day unlock guard | `day-unlock.guard.ts` | Done |
| Routing | All routes with lazy loading + guards (including `/day/:dayNumber/boss`) | Done |
| Design system | Tailwind + Drift palette, fonts, glass/card/button classes, animations | Done |
| Challenge content | `day-01.json` through `day-21.json` (21 days) | Done — days 22-26 missing |

---

## What Remains — Ordered by Priority

---

### PRIORITY 1: The Drift Constellation Map (spec 03, section 3)

The home screen is currently a CSS grid. The spec defines an organic constellation: nodes at relative positions forming week-based clusters, SVG connection lines between completed nodes, dormant/awakening/active/radiant visual states, nebula background gradient, hover tooltips, shake animation on locked clicks, and the whole map growing visibly as days complete.

This is the visual soul of the product. Everything else builds on it.

**What needs building:**
- `drift-state.service.ts` — tracks which elements are alive, connection states, ambient intensity
- `drift.model.ts` — `DriftMapState`, `DriftElement`, `DriftConnection` interfaces (spec 01, section 3.4)
- Rewrite `home.component.html` — SVG or canvas-based constellation instead of grid
- Node hover tooltips (day title, progress, status)
- Connection lines that draw between completed adjacent nodes
- Shake animation on locked node clicks
- Week-based cluster positioning (week 1: lower-left, week 4: upper-right)

**Feeds into:** Drift unlock animations when challenges complete, drift-state-driven bloom on day complete.

---

### PRIORITY 2: Challenge data for days 22-26

Days 22-26 (Angular weeks 3-4) are missing. Day 20 exists but is a boss battle and needs verification.

| Day | Topic | Notes |
|-----|-------|-------|
| 22 | Angular: Reactive Forms | Week 4 |
| 23 | Angular: RxJS patterns | Week 4 |
| 24 | Angular: Real integration patterns | Week 4 |
| 25 | Angular: Review + integration | References all previous content — generate last |
| 26 | Final Boss Battle | Week 4 capstone, StackBlitz environment |

**Approach:** Use the 4-pass pipeline from spec 06 + prompts from spec 08. One day per conversation.

---

### PRIORITY 3: Drift State Service + Unlock Animations (spec 01, section 3.4)

When a day completes, the spec defines `DriftUnlock` animations on the constellation: nodes light up, connection lines draw, structure elements activate. Currently nothing happens on the map when a day is completed.

**What needs building:**
- `drift.model.ts` — `DriftMapState`, `DriftElement`, `DriftConnection`, `DriftUnlock`
- `drift-state.service.ts` — reads `PlayerProgress`, computes which elements are active/dormant/radiant, exposes unlock event stream
- Wire `DriftUnlock[]` data from each day's JSON into the service on day complete
- Boss battle completion: multiple nodes connect at once, larger structure element activates (`reef` or `beacon` type), gold bloom

**Note:** The `DriftUnlock[]` field is defined in spec 01 (Day model) but is not in the current `challenge.model.ts`. Add it alongside this work.

---

### PRIORITY 4: Keyboard Shortcuts (spec 03, section 10)

| Shortcut | Action | Where |
|----------|--------|-------|
| `Escape` | Go back | Global `@HostListener` |
| `Ctrl+Enter` | Run code | `ChallengeComponent`, `BossBattleComponent` |
| `Ctrl+Shift+Enter` | Submit | `ChallengeComponent`, `BossBattleComponent` |
| `Ctrl+H` | Toggle hints | `ChallengeComponent`, `BossBattleComponent` |
| `Ctrl+Shift+P` | Quick navigate palette | Global — floating search to jump to any day/challenge |

Quick navigate palette: `.drift-glass` floating card, centered, `rounded-2xl`, text input that filters available days/challenges by name.

---

### PRIORITY 5: Progress View — Skill Constellation + Challenge History (spec 03, section 8)

**Skill Constellation:**
- 6 skill nodes: JS Fundamentals, JS Advanced, TypeScript, Async Patterns, Angular Core, Angular Advanced
- Each has 3 levels (dormant → bronze → silver → gold), visualized as concentric ring brightness
- Positioned as a mini-constellation (same aesthetic as the Drift map)
- Click shows tooltip: skill name, level, related challenges and their completion status
- Powered by `PlayerProgress.skills` (needs to be populated in `progress.service.ts` as challenges complete)

**Challenge History:**
- Scrollable list below the skill constellation
- Each row: Day, challenge title, XP earned, attempts, time spent
- Expandable to show final code snapshot and explanation text
- Requires saving `codeSnapshot` and `explanation` on completion — these fields exist in `ChallengeProgress` model but are not currently saved in `completeChallenge()`

**Fix needed in `challenge.component.ts` and `boss-battle.component.ts`:** Pass `codeSnapshot` (final `code()` value) and `explanation` (from explain gate) to `progressService.completeChallenge()`.

---

### PRIORITY 6: Visual Polish Pass (spec 02 + spec 03)

In rough order of impact:

#### 6.1 GSAP animation pass
The spec requires GSAP for organic animations. Currently everything uses CSS transitions. Key targets:
- Bloom animation on challenge/day completion (circle of light, scale 0→1.5, opacity 0.6→0, 1200ms)
- Boss battle completion: larger gold bloom
- Node state transitions on the constellation map
- Particle field background (30-50 slow-drifting dots, bioluminescent glow colors)

#### 6.2 Route transitions (spec 03, section 11)
- Home → Day: clicked node scales up, others fade, Day slides in from translateY(12px)
- Day → Challenge: slide left/right (400ms)
- Challenge → Challenge (next): slide left (300ms)
- Day → Day Complete: Day fades to 50%, overlay fades in over it

#### 6.3 Countdown banner urgency (spec 02, section 6.5)
Color shifts: gold (26-10 days) → rose (9-4 days) → fail (3-1 days). Pulse speed increases as deadline approaches.

#### 6.4 Streak broken interstitial (spec 03, section 3)
On home load after a missed day: brief 2-second overlay — "The signal faded while you were away. Streak reset to 0. But the path remains." Drift dims 20%. Auto-dismisses or click to dismiss.

#### 6.5 Node hover tooltips on Drift Map
Day title, concept preview, challenge progress (X/4), status text. Positioned to avoid viewport edges.

#### 6.6 Skeleton loaders (spec 03, section 12)
Pulsing `bg-drift-surface` rectangles while challenge JSON loads. 3-4 lines in the instructions panel, blank editor.

#### 6.7 Reduced motion support
Respect `prefers-reduced-motion`: disable ambient particles and GSAP timelines, reduce all transitions to opacity-only at 200ms.

---

### PRIORITY 7: Spec Alignment Fixes

Small gaps between current implementation and spec that don't block functionality but create debt:

| Gap | Fix |
|-----|-----|
| `PlayerProgress.skills` not populated | Wire skill tracking into `completeChallenge()` in progress.service.ts |
| `codeSnapshot` not saved on completion | Pass final code to `completeChallenge()` in both challenge components |
| `explanation` not saved on completion | Pass explanation text to `completeChallenge()` after explain gate |
| `DriftUnlock[]` not in Day model | Add field to `challenge.model.ts` when Drift state service is built (P3) |
| Readiness score is `completedDays / 26` | Implement weighted formula from spec 01 section 9 when more data is tracked |
| IndexedDB not used | Progress uses localStorage only — fine for MVP, migrate if data grows large |

---

### PRIORITY 8: Additional Services (when needed)

| Service | Purpose | When |
|---------|---------|------|
| `narrative.service.ts` + `narrative.model.ts` | Story text/chapter mapping if separated from JSON | If narrative data grows or needs querying |
| `audio.service.ts` | Ambient drone, completion tones, streak sounds | Last — nice-to-have |

---

### PRIORITY 9: Sound (spec 02, section 10)

- Ambient drone loop (low volume, user-adjustable via Settings)
- Challenge complete: singing bowl tone
- Test pass: subtle ding / Test fail: soft thud
- Day complete: ascending tone sequence
- Streak milestone/break: chord / descending tone

**Files:** `audio.service.ts` + assets in `src/assets/audio/`

---

## Recommended Execution Order

```
Next session:
  - P1 (Drift constellation map) ......... core visual work
  - P4 (keyboard shortcuts) .............. quick wins, one session

Following sessions:
  - P2 (days 22-26 content) .............. content generation
  - P3 (drift state + unlock anims) ...... wires map to game state
  - P5 (skill constellation + history) ... completes progress view

Polish pass (near end):
  - P6 (GSAP, route transitions, etc.)
  - P7 (spec alignment fixes)
  - P8 (services)
  - P9 (sound)
```

---

## File Impact Summary (New Files Still Needed)

| Priority | Files |
|----------|-------|
| P1 | `drift-state.service.ts`, `drift.model.ts`, rewrite `home.component.html` |
| P2 | `src/assets/challenges/day-22.json` through `day-26.json` |
| P3 | Add `DriftUnlock[]` to `challenge.model.ts`, implement `drift-state.service.ts` |
| P4 | Modify `challenge.component.ts`, `boss-battle.component.ts`, add global key handler |
| P5 | Modify `progress.component.ts/html`, add skill tracking to `progress.service.ts` |
| P6 | `styles/animations.css` GSAP additions, route transition wiring |
| P9 | `audio.service.ts`, `src/assets/audio/` |
