# 26 DAYS — Visual Design Spec: The Drift

## Document Purpose
This is the aesthetic bible for The Drift. Every color, every font size, every shadow, every animation is defined here. Your friend should follow this document with zero creative interpretation -- the beauty is in the specificity. If something isn't specified here, it should be asked about, not improvised.

---

## 1. Design Philosophy

The Drift is not sci-fi. It's not cyberpunk. It's not "dark mode with glowing borders."

The Drift feels like floating through a watercolor painting of space. Think: if Hayao Miyazaki designed a space station interior. Soft, warm, quiet, alive. Nothing aggressive. Nothing sharp. Every element feels like it belongs in an environment that breathes.

**Key principles:**
- **Soft over sharp.** Rounded corners, gradient edges, no hard borders. Elements fade into their surroundings rather than being boxed in.
- **Warm over cold.** Even the darkest backgrounds have warmth. No pure black. No cold blue LEDs. The light sources feel organic, like bioluminescence.
- **Breathing over static.** Nothing on screen is truly still. Subtle pulsing, slow drifting, gentle parallax. The interface feels alive without being distracting.
- **Restraint over spectacle.** The most beautiful moments are quiet ones -- a structure slowly glowing to life when you complete a challenge. Not explosions. Not confetti. A slow, satisfying bloom of light.

**Visual references (for mood, not copying):**
- The nebula scenes in Interstellar -- soft gas clouds, not harsh stars
- Journey (the game) -- vast, quiet, warm desert-space
- Ori and the Blind Forest -- bioluminescent environments that feel alive
- Moebius/Jean Giraud artwork -- pastel sci-fi with organic shapes
- James Turrell light installations -- color that feels like it has weight

---

## 2. Color System

### 2.1 Core Palette

Every color below is defined as a CSS custom property and a Tailwind extension.

#### Backgrounds (deep to light)
```
--drift-void:        #0F0E1A    // Deepest background. Not black -- a dark indigo with warmth.
--drift-deep:        #171528    // Primary app background. Deep but not oppressive.
--drift-mid:         #1E1B35    // Card backgrounds, panels. Noticeably lighter than deep.
--drift-surface:     #262342    // Elevated surfaces. Modals, dropdowns, tooltips.
--drift-raised:      #2E2A50    // Highest elevation. Active states, selected items.
```

#### Accent Colors (the light in the void)
```
--drift-lavender:    #B8A9E8    // Primary accent. Used for interactive elements, links, focus states.
--drift-rose:        #E8A9C0    // Secondary accent. Success states, completed items, warmth.
--drift-gold:        #E8CFA9    // Tertiary accent. XP, rewards, highlights, premium feel.
--drift-ice:         #A9D8E8    // Quaternary accent. Information, hints, subtle callouts.
--drift-sage:        #A9E8C0    // Success/pass. Test passing, completion indicators.
```

#### Text
```
--drift-text-primary:    #EDE8F5    // Primary text. Soft ivory with a lavender tint. NOT pure white.
--drift-text-secondary:  #9B93B4    // Secondary text. Muted lavender-grey.
--drift-text-tertiary:   #6B6488    // Tertiary text. Timestamps, metadata, subtle labels.
--drift-text-ghost:      #4A4468    // Ghost text. Placeholder text, disabled states.
```

#### Semantic Colors
```
--drift-pass:        #7DE8A9    // Test passed. Soft green, not neon.
--drift-fail:        #E87D8A    // Test failed. Soft red-rose, not aggressive.
--drift-warning:     #E8C77D    // Warnings. Warm gold.
--drift-info:        #7DB8E8    // Information. Calm blue.
```

#### Glow Colors (for animations and highlights -- used with blur/opacity, never as flat fills)
```
--drift-glow-lavender:  #C4B5F0
--drift-glow-rose:      #F0B5CD
--drift-glow-gold:      #F0D9B5
--drift-glow-ice:       #B5E0F0
--drift-glow-sage:      #B5F0CD
```

### 2.2 Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        drift: {
          void: '#0F0E1A',
          deep: '#171528',
          mid: '#1E1B35',
          surface: '#262342',
          raised: '#2E2A50',

          lavender: '#B8A9E8',
          rose: '#E8A9C0',
          gold: '#E8CFA9',
          ice: '#A9D8E8',
          sage: '#A9E8C0',

          'text-primary': '#EDE8F5',
          'text-secondary': '#9B93B4',
          'text-tertiary': '#6B6488',
          'text-ghost': '#4A4468',

          pass: '#7DE8A9',
          fail: '#E87D8A',
          warning: '#E8C77D',
          info: '#7DB8E8',

          'glow-lavender': '#C4B5F0',
          'glow-rose': '#F0B5CD',
          'glow-gold': '#F0D9B5',
          'glow-ice': '#B5E0F0',
          'glow-sage': '#B5F0CD',
        },
      },
      // ... (continued in sections below)
    },
  },
  plugins: [],
} satisfies Config;
```

### 2.3 Color Usage Rules

**NEVER use:**
- Pure black (`#000000`) anywhere
- Pure white (`#FFFFFF`) anywhere
- Neon colors (saturated cyan, electric blue, hot pink)
- Flat, opaque accent colors as backgrounds (accents are always used with transparency or as glows)

**ALWAYS:**
- Background colors transition smoothly via gradients, never hard edges between two background tones
- Accent colors at full opacity are only for small elements: text links, icons, badges, small indicators
- Larger areas using accent colors must use them at 10-20% opacity (e.g., a card with a subtle lavender wash)
- Glows are achieved with `box-shadow` using glow colors at 20-40% opacity with 20-60px blur

---

## 3. Typography

### 3.1 Font Stack

```css
/* Headings, narrative text, story content */
--font-display: 'Cormorant Garamond', 'Garamond', serif;

/* Body text, UI labels, challenge instructions */
--font-body: 'Inter', system-ui, sans-serif;

/* Code, editor, console output */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

**Why these fonts:**
- **Cormorant Garamond**: Elegant, literary, slightly otherworldly. Perfect for the narrative and story text. It signals "this is a story, not a tutorial." Free on Google Fonts.
- **Inter**: Clean, highly legible at small sizes, excellent for UI. Doesn't compete with Cormorant. Free on Google Fonts.
- **JetBrains Mono**: Best free monospace font. Ligatures for code readability. The player will see this at their internship too.

### 3.2 Type Scale

All sizes in rem. Base = 16px.

```
--text-xs:      0.75rem    / 1rem       (12px / 16px leading)    // Badges, timestamps, metadata
--text-sm:      0.875rem   / 1.25rem    (14px / 20px leading)    // Secondary labels, hints
--text-base:    1rem       / 1.625rem   (16px / 26px leading)    // Body text, instructions
--text-lg:      1.125rem   / 1.75rem    (18px / 28px leading)    // Emphasized body, challenge titles
--text-xl:      1.25rem    / 1.75rem    (20px / 28px leading)    // Section headers
--text-2xl:     1.5rem     / 2rem       (24px / 32px leading)    // Day titles
--text-3xl:     1.875rem   / 2.25rem    (30px / 36px leading)    // Page headers
--text-4xl:     2.25rem    / 2.5rem     (36px / 40px leading)    // Hero numbers (countdown, XP)
--text-5xl:     3rem       / 1          (48px)                   // The big countdown number
--text-hero:    4.5rem     / 1          (72px)                   // "26 DAYS" logo text only
```

### 3.3 Font Weight Usage

```
Cormorant Garamond:
  300 (Light)     — Narrative body text, story passages
  400 (Regular)   — Story emphasis, subheadings
  600 (SemiBold)  — Day titles, major story beats
  700 (Bold)      — The "26 DAYS" logo only

Inter:
  400 (Regular)   — Body text, instructions, labels
  500 (Medium)    — Buttons, nav items, emphasis
  600 (SemiBold)  — Challenge titles, section headers
  700 (Bold)      — Critical UI elements (countdown number, streak number)

JetBrains Mono:
  400 (Regular)   — Code in editor
  700 (Bold)      — Keywords in syntax highlighting
```

### 3.4 Text Color Pairing Rules

| Context | Font | Color | Example |
|---------|------|-------|---------|
| Narrative/story text | Cormorant Garamond 300 | `--drift-text-primary` | Story passages |
| Narrative emphasis | Cormorant Garamond 400 | `--drift-lavender` | Character dialogue, key moments |
| UI body text | Inter 400 | `--drift-text-primary` | Challenge instructions |
| UI secondary | Inter 400 | `--drift-text-secondary` | Descriptions, hints |
| UI labels | Inter 500 | `--drift-text-secondary` | Form labels, nav items |
| UI headers | Inter 600 | `--drift-text-primary` | Section titles |
| Numbers (XP, streak, countdown) | Inter 700 | `--drift-gold` or `--drift-lavender` | "47% ready", "Day 12" |
| Code | JetBrains Mono 400 | (syntax theme colors) | In-editor code |
| Console output | JetBrains Mono 400 | `--drift-text-secondary` | Logged values |
| Pass/fail | Inter 500 | `--drift-pass` / `--drift-fail` | Test result text |

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

Use Tailwind's default spacing scale. Key spacings:

```
4px   (p-1)    — Tight internal padding (badges, tiny elements)
8px   (p-2)    — Standard internal padding (buttons, small cards)
12px  (p-3)    — Medium padding
16px  (p-4)    — Standard card padding, section gaps
24px  (p-6)    — Between related sections
32px  (p-8)    — Between major sections
48px  (p-12)   — Page-level spacing
64px  (p-16)   — Hero section spacing
```

### 4.2 Border Radius

Everything is soft. Nothing has sharp corners.

```
--radius-sm:     8px    (rounded-lg)     — Buttons, badges, inputs
--radius-md:     12px   (rounded-xl)     — Cards, panels
--radius-lg:     16px   (rounded-2xl)    — Modal containers, major sections
--radius-xl:     24px   (rounded-3xl)    — Hero cards, the countdown container
--radius-full:   9999px (rounded-full)   — Circular elements, pills
```

**No element in the entire app uses `rounded-none` or `rounded-sm`.** The minimum radius for any visible element is 8px.

### 4.3 Layout Principles

- **Max content width:** 1200px, centered. Wider screens show more of The Drift background.
- **No hard grid.** The layout should feel organic. Use flexbox and logical grouping rather than rigid 12-column grids.
- **Generous whitespace.** When in doubt, add more space. Cramped = stressful. Spacious = calm.
- **Cards float.** Cards don't sit on a flat surface. They hover over the background with subtle shadows and a slight transparency, as if suspended in the medium of The Drift.

---

## 5. Elevation & Depth

The Drift has no flat surfaces. Everything exists at a depth.

### 5.1 Shadow System

Shadows in The Drift are NOT grey. They are tinted with the ambient color.

```css
/* Level 1: Subtle lift (buttons, badges) */
--shadow-1: 0 2px 8px rgba(15, 14, 26, 0.3),
            0 1px 3px rgba(15, 14, 26, 0.2);

/* Level 2: Card float (standard cards, panels) */
--shadow-2: 0 4px 16px rgba(15, 14, 26, 0.4),
            0 2px 6px rgba(15, 14, 26, 0.2);

/* Level 3: Elevated (modals, dropdowns, hover states) */
--shadow-3: 0 8px 32px rgba(15, 14, 26, 0.5),
            0 4px 12px rgba(15, 14, 26, 0.3);

/* Glow shadow (active/focus elements -- layered on top of regular shadow) */
--shadow-glow-lavender: 0 0 20px rgba(184, 169, 232, 0.15),
                        0 0 40px rgba(184, 169, 232, 0.08);

--shadow-glow-rose:     0 0 20px rgba(232, 169, 192, 0.15),
                        0 0 40px rgba(232, 169, 192, 0.08);

--shadow-glow-gold:     0 0 20px rgba(232, 207, 169, 0.15),
                        0 0 40px rgba(232, 207, 169, 0.08);

--shadow-glow-sage:     0 0 20px rgba(169, 232, 192, 0.15),
                        0 0 40px rgba(169, 232, 192, 0.08);
```

### 5.2 Glass Effect (used for floating panels and overlays)

```css
.drift-glass {
  background: rgba(30, 27, 53, 0.6);    /* --drift-mid at 60% */
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(184, 169, 232, 0.08);  /* very subtle lavender border */
}
```

Use this for: navigation bars, floating panels, modal backdrops, tooltips. The background content should be faintly visible through glass elements, creating depth.

---

## 6. Component Visual Specs

### 6.1 Buttons

#### Primary Button
```
Background:     Linear gradient 135deg from --drift-lavender to #9B8AD8 (slightly darker lavender)
Text:           --drift-void (dark text on light button)
Font:           Inter 500, --text-sm
Padding:        10px 20px
Border radius:  --radius-sm (8px)
Shadow:         --shadow-1 + --shadow-glow-lavender
Border:         None

Hover:
  Background:   Gradient shifts 10% brighter
  Shadow:       --shadow-2 + --shadow-glow-lavender (intensified: opacity from 0.15 to 0.25)
  Transform:    translateY(-1px)
  Transition:   all 200ms ease-out

Active:
  Transform:    translateY(0)
  Shadow:       --shadow-1

Disabled:
  Background:   --drift-surface
  Text:         --drift-text-ghost
  Shadow:       None
  Cursor:       not-allowed
```

#### Secondary Button (ghost variant)
```
Background:     transparent
Text:           --drift-lavender
Font:           Inter 500, --text-sm
Padding:        10px 20px
Border radius:  --radius-sm (8px)
Border:         1px solid rgba(184, 169, 232, 0.2)
Shadow:         None

Hover:
  Background:   rgba(184, 169, 232, 0.08)
  Border:       1px solid rgba(184, 169, 232, 0.35)
  Shadow:       --shadow-glow-lavender (subtle)

Active:
  Background:   rgba(184, 169, 232, 0.12)
```

#### Success Button (used for "Submit" when confident)
```
Same as Primary but:
  Gradient:     --drift-sage to #78D0A0
  Glow:         --shadow-glow-sage
  Text:         --drift-void
```

### 6.2 Cards

#### Standard Card (challenge card, info card)
```
Background:     --drift-mid
Border:         1px solid rgba(184, 169, 232, 0.06)
Border radius:  --radius-md (12px)
Padding:        24px
Shadow:         --shadow-2

Contains a very subtle gradient overlay:
  background-image: linear-gradient(
    135deg,
    rgba(184, 169, 232, 0.03) 0%,
    transparent 60%
  );
  This gives a barely-perceptible lavender warmth to the top-left corner.

Hover (where applicable):
  Border:       1px solid rgba(184, 169, 232, 0.12)
  Shadow:       --shadow-2 + --shadow-glow-lavender (subtle)
  Transform:    translateY(-2px)
  Transition:   all 300ms ease-out
```

#### Narrative Card (story text container)
```
Same as Standard Card but:
  Background:   --drift-surface with 80% opacity
  Uses .drift-glass effect
  Border:       1px solid rgba(232, 169, 192, 0.08) (rose tint, not lavender)
  Left border:  3px solid rgba(232, 169, 192, 0.3) (visible rose accent on left edge)
  Padding:      32px
  Font:         Cormorant Garamond 300, --text-lg, --drift-text-primary
  Line height:  1.8 (extra generous for readability)
```

#### Challenge Type Badge
Each challenge type has a distinct color-coded badge.

```
All badges:
  Font:         Inter 600, --text-xs, uppercase, letter-spacing 0.05em
  Padding:      4px 10px
  Border radius: --radius-full (pill shape)
  Border:       1px solid (color at 25%)

Type-specific:
  predict:   bg rgba(169, 216, 232, 0.12)  text --drift-ice      border --drift-ice
  debug:     bg rgba(232, 125, 138, 0.12)  text --drift-fail     border --drift-fail
  complete:  bg rgba(184, 169, 232, 0.12)  text --drift-lavender border --drift-lavender
  refactor:  bg rgba(232, 207, 169, 0.12)  text --drift-gold     border --drift-gold
  build:     bg rgba(169, 232, 192, 0.12)  text --drift-sage     border --drift-sage
```

### 6.3 The Code Editor

```
Container:
  Background:   --drift-void
  Border:       1px solid rgba(184, 169, 232, 0.08)
  Border radius: --radius-md (12px)
  Shadow:       --shadow-2
  Overflow:     hidden (border radius clips the Monaco editor)

Editor header bar:
  Background:   rgba(23, 21, 40, 0.8)  (--drift-deep at 80%)
  Height:       36px
  Padding:      0 16px
  Border bottom: 1px solid rgba(184, 169, 232, 0.06)
  Contains:
    - File name (Inter 400, --text-xs, --drift-text-secondary)
    - Challenge type badge (small variant)
    - Line/column indicator (Inter 400, --text-xs, --drift-text-tertiary)

Monaco theme (define as custom theme):
  Background:           #0F0E1A (--drift-void)
  Foreground:           #EDE8F5 (--drift-text-primary)
  Cursor:               #B8A9E8 (--drift-lavender)
  Selection:            rgba(184, 169, 232, 0.15)
  Line highlight:       rgba(184, 169, 232, 0.04)
  Line numbers:         #4A4468 (--drift-text-ghost)
  Active line number:   #9B93B4 (--drift-text-secondary)

  Syntax colors:
    Keywords:           #B8A9E8 (lavender)         — if, else, return, const, let, function
    Strings:            #E8A9C0 (rose)             — 'hello', "world", `template`
    Numbers:            #E8CFA9 (gold)             — 42, 3.14, 0xFF
    Functions:          #A9D8E8 (ice)              — myFunction, addEventListener
    Types/classes:      #A9E8C0 (sage)             — Array, Promise, HTMLElement
    Comments:           #6B6488 (text-tertiary)    — // this is a comment
    Operators:          #9B93B4 (text-secondary)   — =, +, ===, =>
    Brackets:           #9B93B4 (text-secondary)   — (), [], {}
    Properties:         #EDE8F5 (text-primary)     — .length, .map, .value
    Punctuation:        #6B6488 (text-tertiary)    — ;, ,, .
```

### 6.4 Test Results Panel

```
Container:
  Background:   --drift-mid
  Border:       1px solid rgba(184, 169, 232, 0.06)
  Border radius: --radius-md (12px)
  Padding:      16px

Individual test result row:
  Height:       auto (min 40px)
  Padding:      8px 12px
  Border radius: --radius-sm (8px)
  Margin bottom: 4px
  Display:      flex, align-items center, gap 12px

  Pass state:
    Background:   rgba(125, 232, 169, 0.06)
    Left icon:    Circle with checkmark, --drift-pass, 18px
    Text:         Inter 400, --text-sm, --drift-text-primary
    The entire row has a very faint green glow

  Fail state:
    Background:   rgba(232, 125, 138, 0.06)
    Left icon:    Circle with X, --drift-fail, 18px
    Text:         Inter 400, --text-sm, --drift-text-primary
    Below text:   Expected/Received diff (JetBrains Mono 400, --text-xs)
      Expected:   --drift-pass
      Received:   --drift-fail

  Transition between states:
    When a test flips from fail to pass, the row background transitions
    over 600ms with a subtle pulse animation (opacity 0.06 → 0.15 → 0.06)
    and the icon scales from 0.8 → 1.1 → 1.0

All tests passing state:
  The entire container gets a brief glow animation:
    box-shadow animates from none to --shadow-glow-sage over 800ms
    then settles to a subtle persistent glow
  A thin progress bar at the top fills from left to right in --drift-sage
```

### 6.5 The Countdown Banner

This is ALWAYS visible. It's the emotional engine of the app.

```
Position:       Fixed at the top of the viewport OR integrated into the nav bar
                (not a separate floating element -- it's part of the architecture)
Height:         48px
Background:     .drift-glass
Border bottom:  1px solid rgba(184, 169, 232, 0.06)

Layout (flex, space-between, center aligned):

Left section:
  "[X] days remaining"
  - The number: Inter 700, --text-xl, --drift-gold
  - "days remaining": Inter 400, --text-sm, --drift-text-secondary
  - The number pulses very subtly (opacity 0.9 → 1.0 → 0.9, 4s cycle)

  The urgency increases visually as days decrease:
    26-20 days: --drift-gold text, calm pulse
    19-10 days: --drift-gold text, slightly faster pulse
    9-4 days:   --drift-rose text, noticeable pulse
    3-1 days:   --drift-fail text, persistent glow, faster pulse
    0 days:     "Internship begins" in --drift-sage with bloom animation

Center section:
  Readiness score
  - "[X]% ready"
  - The number: Inter 700, --text-lg, color varies by %:
      0-25%:    --drift-fail
      26-50%:   --drift-warning
      51-75%:   --drift-gold
      76-100%:  --drift-sage
  - A thin horizontal bar beneath the text (120px wide, 3px tall, rounded-full)
    filled proportionally with the same color

Right section:
  Streak display
  - A small flame-like icon (SVG, not emoji) in --drift-gold
  - The streak number: Inter 600, --text-base, --drift-gold
  - "day streak": Inter 400, --text-xs, --drift-text-tertiary

The entire banner has a very subtle gradient that shifts based on
how many days remain -- warmer (more gold/rose) as the deadline approaches.
```

### 6.6 Streak Display (Detailed)

```
The streak icon is NOT a fire emoji. It is a custom SVG that looks like
a soft, luminous wisp -- think of a small bioluminescent tendril that
curves upward, like a small flame made of light rather than fire.

Streak states:
  0 (broken):     Icon is --drift-text-ghost, no animation, feels dormant
  1-2:            Icon is --drift-gold at 60% opacity, very slow pulse
  3-6:            Icon is --drift-gold at 80%, gentle sway animation
  7-13:           Icon is --drift-gold at 100%, sway + subtle particle emission
  14-20:          Icon glows (add --shadow-glow-gold), particles increase
  21-26:          Icon radiates (brighter glow, more particles, the wisp
                  appears taller/more complex as if it's grown)

When streak breaks:
  The wisp dissolves (opacity fadeout over 2 seconds, particles scatter)
  Replaced by the dormant state
  This should feel genuinely sad -- a quiet loss, not a punishment screen
```

### 6.7 The Drift Map (Home Screen)

This is the centerpiece of the visual experience. It's what the player sees first and returns to every day.

```
Full viewport height, no scroll (or minimal scroll on very small screens)
Background: --drift-void with layered effects:

Layer 1 (deepest): Solid --drift-void
Layer 2: A CSS radial gradient creating a soft, off-center nebula glow
  - Center offset to ~30% from left, 40% from top
  - Colors: rgba(184, 169, 232, 0.05) center, transparent edge
  - Size: 60% of viewport
Layer 3: A second gradient, positioned differently
  - Center at ~70% from left, 60% from top
  - Colors: rgba(232, 169, 192, 0.03) center, transparent edge
  - Size: 40% of viewport
Layer 4: Particle field (GSAP animated)
  - 30-50 small circles (2-4px diameter) floating slowly
  - Colors: random from glow palette at 20-40% opacity
  - Movement: very slow drift in random directions, 20-40s per cycle
  - Some particles pulse (opacity oscillation)
Layer 5: Connection lines (SVG overlay)
  - Thin lines (1px, --drift-lavender at 10% opacity) connecting activated day nodes
  - Lines appear and slowly brighten when a new day is completed
Layer 6: Day nodes (positioned on the map)
  - 26 nodes arranged in an organic constellation pattern
  - NOT a straight line or grid. Think: a reef structure, a neural network,
    a constellation. Organic but with implicit structure.
  - Nodes cluster roughly by week:
    Week 1 (days 1-7):   Lower-left region
    Week 2 (days 8-13):  Center-left, slightly higher
    Week 3 (days 14-20): Center-right, higher still
    Week 4 (days 21-26): Upper-right region
  - This creates a visual journey from lower-left to upper-right

Day node states:
  Dormant (locked):
    Circle: 12px diameter
    Fill: --drift-surface
    Border: 1px solid rgba(184, 169, 232, 0.08)
    No glow
    Opacity: 0.4

  Available (unlocked but not started):
    Circle: 14px diameter
    Fill: --drift-mid
    Border: 1px solid rgba(184, 169, 232, 0.2)
    Subtle pulse animation (scale 1.0 → 1.05 → 1.0, 3s cycle)
    Glow: faint --shadow-glow-lavender

  In Progress:
    Circle: 16px diameter
    Fill: --drift-lavender at 20%
    Border: 1.5px solid --drift-lavender at 40%
    Pulse animation (scale 1.0 → 1.08 → 1.0, 2s cycle)
    Glow: visible --shadow-glow-lavender
    Inner dot: 4px, --drift-lavender (indicates "you are here")

  Completed:
    Circle: 14px diameter
    Fill: radial gradient from --drift-sage center to --drift-mid edge
    Border: 1px solid --drift-sage at 30%
    Steady glow: --shadow-glow-sage (no pulse, it's stable now)

  Boss battle (completed):
    Circle: 20px diameter
    Fill: radial gradient from --drift-gold center to --drift-mid edge
    Border: 1.5px solid --drift-gold at 40%
    Steady glow: --shadow-glow-gold
    Slightly brighter than regular completed nodes

Day node hover:
  Scale up to 1.2
  Glow intensifies
  A tooltip appears with:
    Background: .drift-glass
    Content: "Day [X]: [Title]" + "Concepts: [list]" + status
  Transition: 200ms ease-out

Day node click:
  Navigates to /day/:dayNumber
  Transition: the clicked node expands (scale to ~3x) while everything else
  fades out (opacity → 0), creating a zoom-in effect, then route changes
```

### 6.8 Navigation

```
No traditional nav bar with tabs. The navigation is minimal and spatial.

Top bar (always visible):
  The countdown banner (section 6.5 above) serves as the top bar
  Left: countdown | Center: readiness | Right: streak
  A small "back" arrow appears contextually (when not on home) --
    --drift-text-secondary, hover: --drift-lavender

Bottom-right floating controls (only on home screen):
  Two small circular buttons (40px diameter, .drift-glass):
    1. Progress/stats icon (a simple chart glyph) → navigates to /progress
    2. Settings icon (a gear glyph) → navigates to /settings
  These float with a subtle bob animation (translateY oscillation, 6s cycle)

Within the challenge screen:
  Navigation is linear: prev challenge ← → next challenge
  Arrow buttons at the bottom, same as Secondary Button style
  Progress dots between them showing X/Y challenges done today
```

---

## 7. Animation Principles

### 7.1 Timing Functions

```css
/* The Drift doesn't use linear or ease. Everything has organic timing. */
--ease-drift:       cubic-bezier(0.25, 0.46, 0.45, 0.94);   /* Default for most transitions */
--ease-drift-in:    cubic-bezier(0.55, 0.06, 0.68, 0.19);   /* For elements entering from rest */
--ease-drift-out:   cubic-bezier(0.22, 0.61, 0.36, 1);      /* For elements settling */
--ease-drift-bloom: cubic-bezier(0.16, 1, 0.3, 1);          /* For celebration moments -- slight overshoot */
```

### 7.2 Core Animations

#### Pulse (for living elements)
```
Gentle opacity + scale oscillation
Scale: 1.0 → 1.03 → 1.0
Opacity: var → var*1.1 → var
Duration: 3-5 seconds
Easing: sine (smooth, no acceleration spikes)
Use: active nodes, streak icon, available challenges
```

#### Float (for ambient elements)
```
Slow vertical + slight horizontal drift
TranslateY: 0 → -5px → 0
TranslateX: 0 → 2px → 0 (offset phase from Y)
Duration: 15-25 seconds
Easing: sine
Use: particles, decorative elements, floating panels
```

#### Bloom (for completion celebrations)
```
A circle of light expands outward from the source
Scale: 0 → 1.5
Opacity: 0.6 → 0
Duration: 1200ms
Easing: --ease-drift-bloom
Color: matches the element (sage for pass, gold for XP, lavender for unlock)
Implemented as a pseudo-element or separate div
Use: challenge completion, day completion, streak milestone
```

#### Reveal (for new content appearing)
```
Opacity: 0 → 1
TranslateY: 12px → 0
Duration: 400ms
Easing: --ease-drift-out
Stagger: 80ms between sequential items
Use: challenge list loading, test results appearing, narrative text
```

#### Connection Draw (for Drift map lines)
```
SVG stroke-dasharray animation
Line appears to draw itself from point A to point B
Duration: 800ms
Easing: --ease-drift
Opacity: 0 → 0.15
Use: when a new day is completed, connecting it to the previous
```

### 7.3 Animation Rules

- **No animation longer than 2 seconds** except ambient loops (float, pulse)
- **No animation that blocks interaction.** The player should never wait for an animation to finish before they can click something.
- **Reduced motion:** Respect `prefers-reduced-motion`. When active, disable all ambient animations, reduce transitions to opacity-only at 200ms, remove parallax. The app should still feel beautiful without motion.
- **Performance:** All animations target `transform` and `opacity` only (GPU-composited). Never animate `width`, `height`, `margin`, `padding`, or `box-shadow` directly.
  - Exception: box-shadow glow can animate via CSS custom property + houdini, or use a pseudo-element with opacity animation instead.

---

## 8. Iconography

**No emojis. Ever. Anywhere.** Not in the UI, not in challenge text, not in narrative, not in console output.

Icons are custom SVGs or from **Lucide** (consistent stroke style, 1.5px stroke weight, rounded caps).

```
Icon set needed:
  Navigation:
    - Back arrow (chevron-left)
    - Settings (a minimal gear OR three horizontal sliders)
    - Stats (bar-chart-2 or trending-up)

  Challenge types:
    - Predict: eye
    - Debug: bug (from Lucide, not an emoji-style bug)
    - Complete: puzzle-piece or code
    - Refactor: refresh-cw or git-merge
    - Build: layers or box

  Status:
    - Pass: circle-check (NOT a checkmark emoji)
    - Fail: circle-x
    - Locked: lock
    - In progress: loader (animated rotation, slow)
    - Hint: lightbulb

  Streak: Custom SVG wisp (described in section 6.6)

  Misc:
    - XP: a small diamond or star shape (geometric, not emoji)
    - Timer: clock
    - Day number: just the number itself, no icon wrapper

Icon color follows the element's text color.
Icon size: 16px for inline, 20px for buttons, 24px for standalone.
```

---

## 9. Responsive Design

The Drift is designed for desktop-first. This is a "sit at your computer and learn" experience.

```
Breakpoints:
  sm:   640px    (unlikely to be used, but graceful)
  md:   768px    (tablet -- usable but not primary)
  lg:   1024px   (small laptop -- fully functional)
  xl:   1280px   (standard laptop -- primary target)
  2xl:  1536px   (large monitor -- more breathing room)

The Drift Map:
  < 768px:  Nodes arranged vertically as a scrollable list instead of constellation
  768-1024: Constellation compresses, fewer particles, closer spacing
  > 1024:   Full constellation layout

Challenge Screen:
  < 768px:  Instructions above, editor below (stacked)
  768-1024: Side by side, 40/60 split (instructions/editor)
  > 1024:   Side by side, 35/65 split

Monaco Editor:
  Minimum height: 300px
  Preferred height: 60vh on challenge screen
```

---

## 10. Sound Design (Optional but Recommended)

If your friend has time, ambient sound elevates The Drift from "looks nice" to "immersive."

```
Ambient layer:
  A continuous, low-volume ambient track
  Think: gentle space drone + distant wind chime-like tones
  Volume: very low (user-adjustable, default 15%)
  Loops seamlessly
  Crossfades when entering/leaving challenge view

Interaction sounds (subtle, not gamey):
  Challenge complete:  A soft, resonant tone (like a singing bowl, 1 second)
  Test pass:           A quiet, high "ding" (think: glass tap, 0.3 seconds)
  Test fail:           A muted, low tone (not harsh, not a buzzer -- a soft thud, 0.3 seconds)
  Day complete:        A longer, warmer tone sequence (ascending, 2 seconds)
  Streak milestone:    A gentle chord (3 notes, warm, 1.5 seconds)
  Streak break:        A quiet, descending tone (melancholy, not punishing, 1 second)
  XP gained:           A tiny crystalline sound (like a tiny bell, 0.2 seconds)

All sounds must:
  - Be synthesized or royalty-free
  - Feel organic (no 8-bit, no arcade, no notification sounds)
  - Be individually togglable
  - Respect system mute
```

---

## 11. The Drift Progression: Visual Evolution Over 26 Days

This is the payoff. The Drift changes as the player progresses.

```
Day 1:
  Almost everything is dormant. The map is dark and quiet.
  Only the first node glows softly. Minimal particles.
  The void feels vast and empty.
  Background nebula glow is barely visible.

Days 2-7 (Week 1):
  The lower-left cluster of nodes gradually activates.
  Connections draw between completed nodes.
  Particles increase slightly.
  The background nebula glow becomes slightly more visible.
  Colors: predominantly lavender tones.

Days 8-13 (Week 2):
  The center-left cluster activates.
  A second nebula glow appears (the rose one).
  Particles become more varied in color.
  Connection lines between week 1 and week 2 clusters draw in.
  A faint "current" animation appears -- a slow-moving stream of
  particles flowing between the two active clusters.
  Colors: lavender + rose.

Days 14-20 (Week 3):
  The center-right cluster comes alive.
  A third visual element: large, faint geometric shapes start to
  materialize in the background (the "structures" / "reefs").
  These are transparent SVG shapes at ~5% opacity that slowly
  become more visible as more nodes are completed.
  The particle field is now noticeably alive.
  Connection lines form a visible network.
  Colors: lavender + rose + sage (Angular is growth).

Days 21-26 (Week 4):
  The upper-right cluster activates.
  The gold accent becomes prominent (advanced knowledge = gold).
  The background structures are now clearly visible geometric forms.
  All four nebula glows are active, the map has depth and life.
  The particle field is rich but not cluttered.
  Connection lines form an intricate web across all clusters.

Day 26 (Completion):
  Everything is alive. The entire constellation is connected.
  A final animation plays: a wave of light sweeps across the entire map
  from lower-left to upper-right (your journey path), and all elements
  brighten to their maximum. Structures fully materialize.
  The countdown banner changes to: "Day 0 -- You are ready" in --drift-sage
  with a warm, full-screen bloom animation.
  This should feel like watching a sunrise after 26 days of night.
```

---

## 12. Anti-Patterns (What NOT to Do)

To prevent your friend from defaulting to generic developer aesthetics:

| Do NOT | Do Instead |
|--------|-----------|
| Use pure black backgrounds | Use --drift-void (#0F0E1A) minimum |
| Add neon glow borders | Glows are always soft, always with blur, always at low opacity |
| Use emoji anywhere | Lucide icons or custom SVGs only |
| Add confetti or fireworks for celebrations | Use the bloom animation -- a quiet circle of expanding light |
| Use hard card borders | Borders are always rgba at 6-12% opacity |
| Center everything | Asymmetric, organic layout. Things drift off-center intentionally |
| Use pure white text | Text is always tinted: ivory-lavender (#EDE8F5) |
| Add a hamburger menu | Navigation is spatial, not hidden behind a menu |
| Make things bounce or wiggle | Animations are slow, smooth, organic. Nothing bouncy |
| Use stock gradients (blue-to-purple default) | All gradients use the defined Drift palette |
| Add too many particles | Start sparse, build over 26 days. Day 1 should feel quiet and empty |
| Make it look like a dashboard | It's an experience, not a SaaS product |

---

## Next Specs
- **03-ui-ux-flow.md** — Every screen, state, transition, and interaction
- **04-narrative.md** — 26-day story script, PHM chapter mapping
- **05-challenge-curriculum.md** — All 150+ challenges with code and tests
