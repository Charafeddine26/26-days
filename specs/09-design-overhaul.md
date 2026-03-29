# 26 DAYS -- Design Overhaul Spec: Breathing Life Into The Drift

## For the Designer

This document is your creative brief. It builds on the existing specs (02-visual-design and 03-ui-ux-flow) which define the *structure* -- screens, components, states, interactions. That architecture stays. What changes is the *feeling*.

### CRITICAL: Visual Only -- Do Not Touch Functionality

**This overhaul is strictly cosmetic.** The platform's functionality, logic, and backend must remain completely untouched. Specifically:

- **No changes to application logic.** Services, state management, data flow, routing guards, progress tracking, XP calculations, streak logic, challenge evaluation, code execution -- none of it changes. If it lives in `core/services/`, `core/models/`, `core/guards/`, or `core/utils/`, it is off-limits.
- **No changes to data models or API contracts.** The shape of challenges, days, progress objects, drift state -- all stay identical. No new fields, no removed fields, no renamed properties.
- **No changes to user-facing behavior.** Every button should still do what it does. Every navigation path should still work. Every keyboard shortcut, every test runner flow, every hint system, every explain gate -- unchanged. If a user could describe what the app *does*, their description should be identical before and after this overhaul.
- **No changes to component inputs/outputs or event bindings.** The Angular component API (signals, computed values, event handlers, service injections) stays as-is. You are reskinning the templates and styles, not rewriting the components.
- **What IS in scope:** HTML templates, CSS/SCSS, Tailwind classes, SVG markup, animation keyframes, design tokens, asset files (textures, icons, SVGs), font imports, and any new purely-presentational components (e.g., a `<drift-noise-layer>` that renders a texture overlay with zero logic).

Think of it this way: if you `git diff` the result, the changes should be overwhelmingly in `.html`, `.css`, `.svg`, and asset files. Any `.ts` changes should be limited to template-supporting concerns (adding a CSS class, adjusting an SVG attribute binding, importing a new presentational component). The test suite should pass identically before and after every phase.

---

The work is divided into **4 phases**, each building on the last. Each phase is a complete, shippable visual upgrade. You don't need to finish all 4 to improve the app -- Phase 1 alone will transform it. But each subsequent phase compounds the effect.

**Phase dependencies:**
```
Phase 1: Foundation Layer    (can ship alone)
    |
Phase 2: The Living Map      (requires Phase 1)
    |
Phase 3: Screen Polish       (requires Phase 1, benefits from Phase 2)
    |
Phase 4: Cinematic Details   (requires all above)
```

---

## The Problem (Context for All Phases)

Right now The Drift looks like every other dark-themed coding platform with pastel accents. The constellation map is just dots and lines on a dark background. The cards are rectangles with borders. The typography is clean but forgettable.

**What's missing:**
- **Texture.** Everything is flat CSS. No grain, no organic quality, no sense of material.
- **Contrast drama.** The palette is all mid-tones. Nothing pops.
- **Spatial depth.** Cards float but nothing recedes. No atmospheric perspective.
- **Visual narrative.** The story talks about bioluminescence and alien structures, but the UI is clean rectangles.
- **Typography personality.** Cormorant Garamond is there but underused.

---

## The Vision: Organic Futurism

Not cyberpunk. Not flat design. Not glassmorphism-as-a-trend.

Think: **what if a coral reef grew inside a spacecraft.**

### Reference Constellation (mood, not imitation)

**Primary mood:**
- James Turrell's *Roden Crater* -- light that feels solid, color that has mass
- The bioluminescent deep-sea sequences in *Blue Planet II* -- light born from living things
- Olafur Eliasson's installations -- *The Weather Project* and *Your Rainbow Panorama* -- engineered awe through simple means
- The art direction of *Cocoon* (2023 game) -- warm minimalism with organic geometry

**Secondary references:**
- Ernst Haeckel's *Kunstformen der Natur* -- the geometry of living things (radiolaria, jellyfish, diatoms)
- Peter Saville's Unknown Pleasures cover -- data as landscape, beauty in signal
- Denis Villeneuve's *Arrival* title sequences -- minimal, tense, otherworldly without being aggressive
- Ryoji Ikeda's data installations -- when information becomes overwhelming beauty

**What we're NOT:**
- Dribbble dark-mode dashboards
- Neon-on-black "hacker" aesthetics
- Smooth gradient blobs (the 2021 trend)
- Anything that looks like it was made with a Figma glassmorphism plugin

---
---

# PHASE 1: Foundation Layer

**Goal:** Transform every surface from "flat CSS" to "material." Establish light, texture, and typographic identity. This phase touches everything but changes nothing structurally -- it's a skin upgrade applied across the entire app.

**Estimated scope:** Design tokens + global styles + typography rules + component reskin

---

## 1.1 Noise and Grain

Every background surface should carry a subtle noise texture. Not uniform static -- organic, like film grain or handmade paper under a microscope.

```
Implementation approach:
- A repeating SVG noise filter (feTurbulence) layered at 2-4% opacity
- Different frequency per elevation level:
    drift-void:     baseFrequency="0.65" numOctaves="4"   (fine grain, deep space static)
    drift-deep:     baseFrequency="0.55" numOctaves="3"   (medium grain)
    drift-mid:      baseFrequency="0.45" numOctaves="3"   (slightly coarser)
    drift-surface:  baseFrequency="0.35" numOctaves="2"   (soft, frosted glass)
- Grain color: tinted slightly toward the surface color, not neutral grey
- This single addition transforms every surface from "CSS flat color" to "material"
```

## 1.2 Light Source Logic

The current design has no light direction. Everything is evenly lit from nowhere.

```
Primary light:    Top-left bias (subtle). Gradients, card highlights, and glow
                  positions should all subtly agree that light comes from upper-left.
                  Not harsh directional lighting -- ambient bias.

How this manifests:
- Card borders: top/left edge slightly brighter (rgba accent, 0.10),
  bottom/right slightly darker (rgba accent, 0.04). Not a bevel -- a hint.
- Card inner shadow: inset 0 1px 0 rgba(accent, 0.06) on top edge only.
- Gradient overlays on cards shift from upper-left (lighter) to lower-right.
- Glass elements catch more "light" on their upper-left quadrant.
```

## 1.3 Color Temperature Zoning

The palette stays. What changes is *which accent dominates where*:

```
Narrative/story zones:   Warm shift -- rose and gold dominate, lavender recedes
Code/editor zones:       Cool shift -- ice and lavender dominate, gold recedes
Celebration moments:     Full spectrum -- all accents bloom together briefly
Home/constellation:      Neutral-warm -- balanced, nebula glows set the mood

This isn't new hex values. It's emphasis control. The same #B8A9E8 lavender
feels different alone vs. surrounded by warm rose tones.
```

## 1.4 Typography Overhaul

### The Narrative Voice (Cormorant Garamond)

Currently used too timidly. It should feel *inscribed, not typed*.

```
- Size differential: Push narrative text to 20-24px with 1.9-2.0 line-height.
  Currently both story and UI text sit in the 14-18px range. Separate them.

- Italic cuts: Story body text in Cormorant Garamond 300 italic -- feels like
  a personal journal. Reserve upright for headings.

- Letter-spacing: Add 0.02-0.04em tracking to Cormorant headings (Day titles,
  section names). Gives them a carved, architectural quality.

- Drop caps: First letter of each narrative passage = drop cap.
  Cormorant Garamond 700, 3x body size, --drift-lavender at 60% opacity.
  Floated left. This single detail signals "this is a story, not a UI."

- Narrative text column: max-width 520px, centered within its container.
  Generous margins that feel literary -- like a book page, not a UI panel.
```

### The UI Voice (Inter)

```
Current problem: too many things are Inter 400. Everything looks the same.

- Labels/metadata: Inter 400, but use --text-xs (12px) more aggressively.
  Small text should be *small*. Creates breathing room.
- Interactive elements (buttons, nav): Inter 500, always. Never 400.
- Numbers that matter (XP, countdown, streak): Inter 700, one size larger
  than surrounding text. Numbers are anchors.
- Challenge titles: Inter 600, --text-lg minimum. Mission names need presence.
```

### Code Outside the Editor

```
When code appears in instructions (inline `code`, blocks, console output):
- Background: --drift-void (not --drift-mid -- a window into the editor's world)
- Left border: 2px solid, color matches challenge type
- Padding: 2px 8px inline, 12px 16px for blocks
- Inset shadow: inset 0 1px 4px rgba(15,14,26,0.5)
- Code snippets exist at a different depth than prose
```

## 1.5 Card Reskin

### Standard Cards

```
Keep: rounded corners (12px), padding (24px), subtle gradient overlay.

Add:
- Directional border (light source, see 1.2)
- Inner shadow on top edge (see 1.2)
- Noise texture at surface frequency (see 1.1)
- Hover: keep translateY(-2px), add rotateX(1deg) rotateY(-0.5deg).
  Barely perceptible but gives 3D quality. Parent needs perspective(1000px).
```

### Narrative Cards

```
Push the existing glass + rose left border further:

- Rose left border becomes a gradient: brighter at top, fades to transparent
  at bottom. Like a streak of light illuminating the edge of a page.
- Background: subtle gradient from slightly warmer (top-left) to slightly
  cooler (bottom-right). 2-3% differential -- subliminal.
- Dialogue lines: 24px left indent, thin vertical rose line (1px, 20%),
  Cormorant Garamond 400 (not 300).
```

## 1.6 Scroll and Edge Treatments

```
Everywhere scrolling exists (Day View, Progress View):
- Soft fade-out at top and bottom edges (mask-image: linear-gradient).
  Content dissolves into the background, never cuts off sharply.
- Top fade: 24px. Bottom fade: 48px.

Viewport edges (home screen especially):
- Subtle vignette: edges darken by 5-10%. Frames the content, adds depth.
```

## Phase 1 Deliverables

```
1. Design tokens update:
   - Noise texture (tileable SVG or PNG, one per elevation level)
   - Updated shadow values with directional bias
   - Typography scale with clear narrative vs. UI separation

2. Component reskin mockups:
   - Standard card (default, hover, active)
   - Narrative card (with drop cap, dialogue treatment)
   - All button states (primary, secondary, success, disabled)
   - Badge variants (all 5 challenge types)
   - Code block (inline and block variants)

3. Global treatment samples:
   - A before/after of any screen showing noise + light + typography changes
   - The vignette and scroll fade treatments
```

---
---

# PHASE 2: The Living Map

**Goal:** Transform the constellation home screen from a diagram into a landscape. This is the hero moment -- the screen that makes someone take a screenshot and share it.

**Requires:** Phase 1 (texture and light system)

---

## 2.1 Node Redesign: From Dots to Organisms

Current nodes are simple circles. They should feel like **living things**.

```
Dormant nodes:
  Not just a dim circle. A faint concentric ring pattern -- like the
  cross-section of a dormant seed or sleeping cell. 2-3 rings at 3-6%
  opacity, slightly irregular spacing. Organic, not mechanical.

  On hover (even locked): rings briefly pulse outward like sonar, then settle.

Available/Awakening nodes:
  Rings begin to separate and drift outward slowly (20s ambient cycle).
  Inner core brightens. A faint radial gradient extends beyond the node
  boundary -- light bleeding into fog.
  Think: a cell beginning to divide, or a flower about to open.

Active (in-progress) nodes:
  Rings are now distinct orbits. 2-3 tiny particles (1-2px) trace along
  orbital paths. Core pulses with glow extending into surrounding space.
  Think: an atom visualized by a dreaming physicist.

Completed/Radiant nodes:
  Orbits dissolve into stable warm glow. No movement -- completion is
  stillness. Light radiates outward (gradient fading into background).
  A single sharp point of light at center -- a stabilized star.
  Think: main sequence. Calm. Permanent. Warm.

Boss nodes (completed):
  Larger, more complex geometry. Instead of circles, a subtle geometric
  form -- hexagonal rosette or a sacred geometry pattern at low opacity.
  Gold-tinted. These are the constellation's landmarks.
```

## 2.2 Connection Lines: From Lines to Pathways

```
Current: straight <line> elements between nodes.

Redesign: organic curves, like mycelium threads or neural pathways.

- SVG <path> with subtle cubic bezier curves instead of <line>
- Slight wobble: control points offset 5-15px from midpoint,
  perpendicular to connection direction
- Wobble direction: deterministic from day numbers (not random per frame)

Lit connections (both nodes completed):
- Gradient stroke: brighter near nodes, dimmer at midpoint
- A single dot of light travels along the path (8-12 second cycle,
  back and forth). A signal being transmitted.
- Slight glow via filter: drop-shadow

Unlit connections:
- 4-6% opacity. Discoverable on inspection, not cluttering.
- On hover of either endpoint: brightens to 15%, showing where it leads.
```

## 2.3 Background Atmosphere: Depth Layers

```
Layer stack (back to front):

1. Base: --drift-void solid
2. Deep nebula: 2-3 large elliptical gradients at oblique angles, overlapping.
   Glow palette at 3-7% opacity. Asymmetric -- space feels vast and off-center.
3. Dust field: SVG noise layer at 1-2% opacity. Interstellar dust texture.
4. Star field: Static layer of 80-120 tiny dots (1-2px), pseudo-random,
   5-15% opacity each. Some tinted (lavender, ice, rose). These don't move.
   Deep background stars for depth reference.
5. Particle field (existing, enhanced):
   - Vary size more: 1px to 5px
   - Vary opacity more: 5% to 40%
   - Occasional "large" particles (6-8px), very faint, very slow -- distant
     jellyfish or spores
   - Particles cluster slightly near active nodes (attraction bias)
6. Constellation layer: connections, nodes, labels
7. Atmospheric overlay: vignette (from Phase 1)
```

## 2.4 Week Regions

```
Each week's cluster sits within a faint, irregular boundary:
- Organic blob shape (amoeba, cloud, old-map territory). Not geometric.
- SVG <path> with smooth curves, filled with week accent at 2-3%, no stroke.
- Boss defeated: region becomes 4-6% visible with faint inner glow.
- Regions overlap slightly at edges where weeks connect.
```

## 2.5 Node Light Casting

```
Completed nodes don't just glow -- they cast light.

- Nearby connection lines brighten where they approach a radiant node
- The nebula glow intensifies in regions with more completed nodes
  (the nebula gradient opacity is a function of nearby completion count)
- Adjacent dormant nodes pick up a faint color wash from nearby lit nodes

The map is a living light ecosystem where progress illuminates space.
```

## Phase 2 Deliverables

```
1. High-fidelity constellation mockups in 3 states:
   a) Day 1: almost empty, one node glowing, vast quiet void
   b) Day 13: two week clusters alive, connections drawing, regions forming
   c) Day 26: full radiance, all nodes connected, structures visible

2. Node design sheet:
   - All 4 node states at 2x zoom (dormant, awakening, active, radiant)
   - Boss node variant
   - Hover states for each

3. Assets:
   - Star field background layer (static SVG or PNG, tileable or full-viewport)
   - Week region boundary shapes (4 organic blob SVG paths)
   - Connection line curve samples (showing the wobble/bezier approach)

4. Animation storyboards:
   - Node state transitions (dormant -> awakening -> active -> radiant)
   - Connection draw animation
   - Light-casting behavior (how node completion affects surroundings)
```

---
---

# PHASE 3: Screen Polish

**Goal:** Bring the Phase 1 foundation and Phase 2 atmosphere into every individual screen. Each screen gets its own focused pass.

**Requires:** Phase 1. Benefits from Phase 2 but doesn't strictly need it.

---

## 3.1 Countdown Banner: Emotional Barometer

The banner is always visible. It should function as an ambient emotional indicator, not just a data display.

```
Redesign: a living instrument panel. Not sci-fi HUD -- more like the
dashboard of a deep-sea research vessel. Analog warmth, not digital cold.

Left: Days remaining
  - Number: Inter 700, --text-2xl
  - Color transitions smoothly via HSL interpolation as days decrease:
    gold (calm) -> rose (urgent) -> fail-red (critical). Continuous, no jumps.
  - Below: thin "fuel gauge" line (60-80px). Filled = number color.
    Unfilled = --drift-text-ghost.
  - Label: "days remaining", --drift-text-tertiary, Inter 400, --text-xs

Center: Readiness
  - Percentage: Inter 700, --text-xl
  - Below: circular arc gauge (120deg sweep, not full circle). Submarine dial.
    Radius 20px, stroke 3px. Background arc in --drift-text-ghost.
    Filled arc in readiness color (same logic as spec 02).
    Tick marks at 25%, 50%, 75% (1px, --drift-text-ghost).

Right: Streak
  - Custom wisp SVG + streak number (Inter 600)
  - When streak > 7: 2-3 afterimage wisps trailing behind (progressively
    more transparent and smaller). Shows momentum.

Dividers: Not lines. Thin vertical gradients (1px wide) fading from
transparent at top/bottom to --drift-text-ghost at center. 60% of banner height.
```

## 3.2 Challenge Screen: The Workspace

Where the player spends 80% of their time. Focused but atmospheric.

### Instructions Panel

```
Should feel like reading a field journal.

- Background: --drift-mid base + warm-shifted noise at 3% + faint
  top-to-bottom gradient (lighter at top, darker at bottom)
- Section dividers: 3 small dots (centered, 3px each, --drift-text-ghost,
  8px gap). Literary convention, not UI chrome.
- Type badge: pill + faint type icon (Lucide, 14px) beside it +
  subtle inner glow matching type color. Indicator light, not label.
```

### Editor Container

```
Editor header bar redesign:
  - Left: 6px colored dot (status light). Pulses when unsaved,
    steady when saved, --drift-sage when all tests pass.
  - Center-left: Filename (JetBrains Mono 400, --text-xs)
  - Right: Line:col (--drift-text-ghost, --text-xs)
  - Bottom border: gradient (accent at 20% fading to transparent at edges)

Editor gutter:
  Faint vertical gradient on right edge of line numbers area:
  1px-wide fade from --drift-lavender at 4% to transparent.
  Separates gutter from code without a hard line.
```

### Test Results: The Quiet Celebration

```
When all tests pass:
1. Each test row brightens in sequence (100ms stagger)
2. Thin horizontal light-sweep crosses left to right (300ms):
   gradient band, 20px tall, accent at 8%, translating across.
   A scanner beam, but gentle.
3. Panel border transitions to --drift-sage at 12% over 600ms
4. Single quiet tone (if audio enabled)

No confetti. No fireworks. Restraint IS the celebration.
```

## 3.3 Day Complete Screen: The Payoff

```
1. Editor text dissolves (characters scatter/fade randomly, 400ms --
   code being absorbed). Instructions panel fades normally.

2. Completion overlay appears. Behind the glass: Drift constellation
   faintly visible (10%), just-completed node blooming in background.

3. "Day X Complete": Cormorant Garamond 600, letter-spacing 0.08em.
   Each letter fades in at 30ms stagger. An engraving revealing itself.

4. XP counter counts up from 0. Each number change sheds a tiny gold
   particle (1-2px) drifting upward and fading. Gold dust. Subtle.

5. Narrative outro: word-by-word reveal, max-width 480px, centered,
   line-height 2.0. The story payoff.

6. "Return to The Drift" button: fades in 2 seconds AFTER narrative
   finishes. Intentional delay -- let the player sit with the story.
```

## 3.4 Progress View: Data as Art

### Skill Constellation

```
Not a node graph with labels. A radial diagram:

- Center: player's level (Cormorant Garamond 700, --text-4xl, --drift-lavender)
- Six axes radiating outward, one per skill category
- Each axis has 3 concentric rings (3 mastery levels)
- Filled portions glow with skill's accent color
- Result: irregular polygon -- a unique "fingerprint" of abilities

Rendered as constellation, not chart:
- Axes are faint connection paths (like the map lines)
- Filled area is a gradient glow, not polygon fill
- Skill nodes are small points of light where axis meets ring
- Whole thing slowly rotates (60 seconds per revolution). Alive.
```

### Challenge History

```
- Left-edge color bar (2px) per row, matching challenge type. Scannable.
- XP right-aligned in --drift-gold. Visual anchor.
- Time/attempts: --drift-text-tertiary, --text-xs. Secondary.
- Completed rows: faint sage wash (2% opacity background)
- Feels like a flight log or research journal.
```

## 3.5 Onboarding: First Impression

### The Void

```
Opening seconds: NOT pure --drift-void.
Start at #050409 (near-black with indigo hint), transition to #0F0E1A
over 3 seconds. Eyes adjusting to a dark room.
Noise texture fades in from 0% during transition. Void gains texture.
```

### The First Light

```
First point of light (4px, --drift-lavender at 30%):
- 2 seconds to bloom (slower than anything else in the app)
- Starts as 1px, expands to 4px
- Sheds faint light ring (radial gradient, 40px, lavender at 3%)
- Barely-visible ripple expands outward (circle scales 0 -> 120px,
  fades 5% -> 0%, 3 seconds)
This is the birth of a star. Make it feel like one.
```

### Text Cadence

```
Word-by-word reveal at 60ms per word (slower than in-game text).
2.5 seconds of silence between sentences.
Central light pulses once between sentences -- a heartbeat.

Final sentence ("26 days to bring it back to life"):
  Cormorant Garamond 600, --text-3xl. "bring it back to life" transitions
  from --drift-text-primary to --drift-sage over 2 seconds. The meaning lights up.
```

## Phase 3 Deliverables

```
1. Screen mockups:
   - Countdown banner in 4 urgency states (26 days, 15 days, 5 days, 0 days)
   - Challenge View (instructions + editor + test results, all-pass state)
   - Day Complete screen (mid-animation, showing text reveal + XP dust)
   - Progress View (skill constellation + history list)
   - Onboarding (3-4 key frames: void, first light, text, setup)

2. Component details:
   - Editor header bar with status light states
   - Test result rows (pass, fail, pending, all-pass celebration)
   - Skeleton/loading states with ripple shimmer
   - Countdown banner sections at detail level

3. Animation specifications:
   - Light-sweep for test panel
   - XP counter gold dust particles
   - Onboarding text reveal timing
   - Code dissolution effect
```

---
---

# PHASE 4: Cinematic Details

**Goal:** The final polish. Micro-interactions, ambient behaviors, sound-visual sync, and the edge cases that separate "good" from "unforgettable." These are the details that make people say "how did they think of that."

**Requires:** Phases 1-3

---

## 4.1 Cursor Proximity Effects (Constellation)

```
When cursor moves near a node (within ~40px), before hover triggers:
- Node glow extends slightly toward cursor
- Nearby particles drift toward cursor (attraction)
- Closest connection lines brighten by 3-5%

May be cut for performance. But if achievable: the map feels alive and
responsive to your presence, not just your clicks.
```

## 4.2 Idle State

```
Home screen, no interaction for 30+ seconds:
- Particle field gradually slows (settling)
- Nebula glow pulses very slowly (15-20s cycle, 2% opacity shift)
- Active node's pulse slows to match
- Labels fade to slightly lower opacity

The Drift is resting. Still alive, but calm.

First interaction after idle: brief "awakening" -- particles accelerate,
glows brighten over 600ms. You've stirred the water.
```

## 4.3 Loading States

```
Replace uniform skeleton shimmer with:
- Shapes pulse in sequence (staggered 120ms each) -- ripple effect
- Skeleton color: --drift-surface with noise texture (even loading is textured)
- Constellation loading: faint low-opacity full constellation (all nodes at 5%)
  that resolves into actual state. Faster than blank -> pop-in.
```

## 4.4 Sound-Visual Synchronization (if audio implemented)

```
Ambient music swell:
- Particle field briefly accelerates
- Nebula glow pulses 1-2%
- Active node glow intensifies

Completion tone: bloom animation synchronizes with sound attack.

Streak-break tone:
- Screen brightness drops 3%, recovers over 2 seconds
- Particle field pauses 0.5s, then resumes slowly

Micro-synchronizations. Not consciously noticed. But they make the
experience feel "real" because sight and sound agree.
```

## Phase 4 Deliverables

```
1. Interaction prototypes:
   - Cursor proximity effect demo (video or interactive prototype)
   - Idle -> awakening transition
   - Loading ripple effect

2. Sound-visual sync spec:
   - Timing chart mapping audio events to visual responses
   - If audio assets exist: annotated with sync points

3. Edge case designs:
   - Streak broken interstitial (visual dimming, wisp dissolution)
   - Error states (code timeout, StackBlitz load failure)
   - Empty states (no progress yet, no history)
```

---
---

# Accessibility (Applies to All Phases)

```
prefers-reduced-motion:
- All ambient animations stop
- Transitions reduce to 200ms opacity-only
- Noise texture remains (not motion)
- Constellation shows final states, no pulses
- Light source bias remains
- Drop caps remain
- Word-by-word reveal -> block fade-in

prefers-contrast: more:
- Noise texture opacity doubles
- Border opacities increase 50%
- Text-secondary brightens toward text-primary
- Glow effects increase in opacity
- Node state size differences increase

Color vision:
- Never rely on color alone for pass/fail (icons already differ: check vs X)
- Constellation node states differ in shape/pattern, not just color
  (dormant = rings, active = orbits, radiant = stable glow, etc.)
```

---

# Summary: Phase at a Glance

| Phase | What Changes | Impact | Scope |
|-------|-------------|--------|-------|
| **1: Foundation** | Texture, light, typography, cards, edges | Everything feels material instead of flat | Global styles + all components |
| **2: Living Map** | Nodes, connections, atmosphere, regions | Home screen becomes a landscape | Home screen only |
| **3: Screen Polish** | Banner, challenge, completion, progress, onboarding | Each screen gets its own visual identity | Per-screen focused passes |
| **4: Cinematic** | Proximity, idle, loading, sound sync | The app feels alive and responsive | Micro-interactions layer |

---

## Final Note: The Soul of It

The Drift is about a person alone in an unfamiliar place, slowly understanding it, slowly bringing it to life. The design should mirror that journey. Day 1 should feel lonely and vast. Day 26 should feel warm and alive. The player's progress doesn't just fill a progress bar -- it literally transforms the visual environment they inhabit.

Every design decision should serve this question: **does this make the player feel like they're inside a living world that responds to their effort?**

If the answer is no, it's just decoration. Cut it.

If the answer is yes, refine it until it feels inevitable.
