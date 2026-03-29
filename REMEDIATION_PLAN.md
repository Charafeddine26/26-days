# 4-Phase Remediation Plan: Days 14–26

Audit conducted 2026-03-07. Criteria: spec 01 (data model), spec 05 (curriculum intent), spec 06 (generation rules — concept coverage, difficulty curve, test quality, repetition, teaching-ahead).

---

## Phase 1 — Critical Structural Bugs

**Days: 15, 20, 26, and the `environment` field pattern**

These are failures that cause the app to either crash, produce false-positive results, or fail to render the correct environment. They need fixing before anything else is testable.

---

### Day 15, d15-c02 — "Signal List"

**What's there and why it's broken:**

The solution and starter code both set up a structural template problem:

```html
<li *ngFor="let signal of signals" *ngIf="signal.active">
```

Angular forbids two structural directives on the same host element. This does not compile. Any player who copies the hint or follows this solution into a real Angular project gets a compiler error. The tests are all class-level assertions (checking `c.signals.length`, `c.activeCount`) — they never touch the template. This means a completely broken template passes all tests. That is the definition of a false positive.

**What's missing:**

The challenge should teach exactly how to combine `*ngFor` and `*ngIf`, which is a real gotcha that every Angular developer faces. The solution currently sidesteps the actual lesson.

**Proposed fix:**

Switch to Angular 17+ control flow syntax throughout, since the project uses Angular 17+. The solution becomes:

```html
<ul>
  @for (signal of signals; track signal.id) {
    @if (signal.active) {
      <li>{{ signal.id }}: {{ signal.strength }}</li>
    }
  }
</ul>
```

The starter code should show the structure with the inner `@if` missing:

```html
<ul>
  @for (signal of signals; track signal.id) {
    <!-- Only render active signals here -->
  }
</ul>
```

The three tests currently test class logic only. Add a fourth test that actually validates the template output produces the right number of rendered elements. Since this runs in StackBlitz, a proper Jasmine test using TestBed should verify `fixture.nativeElement.querySelectorAll('li').length === 3` returns the active count.

Also update the predict challenge (d15-c01) to use `@for`/`@if` syntax instead of `*ngFor`/`*ngIf`, for consistency. The predict challenge was written with the old directive syntax, which is technically still valid in Angular 17 but inconsistent with what the project uses.

**Day concepts array:** Add `control-flow` and remove the misleading `ngFor`/`ngIf` labels that imply directive syntax. Keep both as valid pathways in the explain gate so players who know the old syntax aren't penalized.

---

### Day 20, d20-c01 — "The Structure Awakens" (Boss Battle)

**What's there and why it's broken:**

The boss challenge has `"files": [...]` with three separate files, which is the correct multi-file structure. But the challenge object is missing:

```json
"environment": "stackblitz"
```

The `boss-battle.component.ts` checks `challenge.environment === 'stackblitz'` to decide whether to embed a StackBlitz instance or render a standard Monaco editor. Without this field, the boss loads as a single-file Monaco editor. The player sees only the `starterCode` (which is a code comment, not actual editable content), not the three separate tab files. The multi-file experience — the entire point of a boss battle in Week 3 — is invisible.

**What's missing:**

The `starterCode` field currently shows only the first file as a comment. This was presumably intended as a fallback display. Now that `environment: stackblitz` is added, the `starterCode` becomes vestigial. It should be updated to either be a genuine single-file fallback, or marked clearly as the StackBlitz seed starter.

**Proposed fix:**

```json
{
  "id": "d20-c01",
  "environment": "stackblitz",
  "starterCode": "// Open the tabs above to see the three files with bugs.",
  "files": [
    { "name": "catalog.component.ts", "...": "..." },
    { "name": "detail.component.ts", "...": "..." },
    { "name": "app.service.ts", "...": "..." }
  ]
}
```

Also verify the Day 20 JSON has `"timeLimitMinutes": 60` at the challenge level (it does — confirmed) and that `bonusXp.speedThresholdMs: 2400000` (40 min of 60 min available as speed window — confirmed correct).

---

### Day 26, d26-c01 — "Resonance" (Final Boss)

**What's there and why it's broken:**

Same structural issue as Day 20. `"files": [...]` is present, `"environment": "stackblitz"` is absent. For the final challenge of the entire 26-day program — the culmination — it renders as a single-file Monaco editor with three empty class stubs. The player cannot work in the intended environment.

**What's missing:**

The final boss also needs more scaffolding than it currently has. The starter code gives the player three empty class stubs with no indication of the required constructor dependencies:

```typescript
export class MissionStore { }
export class MissionDashboard { results: any[] = []; }
export class MissionPipeline { }
```

But the challenge requires `MissionDashboard` to receive `MissionStore` via constructor injection, and `MissionPipeline` to do the same. There is no indication of this in the starter code. The instructions mention it, but for a 90-minute build challenge the scaffolding should make the architecture visible:

```typescript
export class MissionStore {
  private missions: { id: number; name: string; status: 'pending' | 'active' | 'complete' }[] = [];
  private nextId = 1;
  // Your code here
}

export class MissionDashboard {
  results: any[] = [];

  constructor(private store: MissionStore) {}
  // Your code here
}

export class MissionPipeline {
  constructor(private store: MissionStore) {}
  // Your code here
}
```

The constructor signatures should be pre-written. The boss challenge tests the player's ability to implement the methods, not to divine the architecture from prose.

**Proposed fix:**

```json
{
  "id": "d26-c01",
  "environment": "stackblitz",
  "starterCode": "// Open mission-control.ts to begin.",
  "files": [
    {
      "name": "mission-control.ts",
      "content": "// Updated with constructor scaffolding as above"
    }
  ]
}
```

---

### Phase 1 Summary

| Day | File | Fix | Effort |
|---|---|---|---|
| 15 | d15-c02 template | Rewrite solution and starter to `@for/@if`, add template test | Medium |
| 15 | d15-c01 predict | Update to `@for/@if` syntax for consistency | Small |
| 20 | d20-c01 | Add `"environment": "stackblitz"` | Trivial |
| 26 | d26-c01 | Add `"environment": "stackblitz"`, update starter code scaffolding | Small |

---

## Phase 2 — API Integrity (HTTP and RxJS)

**Days: 18, 22**

These are days where the title, narrative, and concept list all promise a specific technology — and then every single challenge delivers a simulation of that technology instead. Players can complete "HTTP" day and "RxJS Foundations" day without ever importing a single real API. This is the curriculum's most serious conceptual failure.

---

### Day 18 — HTTP

**The problem in full:**

Every challenge in this day uses one of these approaches:
- `Promise.resolve(['alpha', 'beta', 'gamma'])` as "simulated HTTP"
- `function of(...args) { return { subscribe: (cb) => cb(args) }; }` as a fake Observable

The day teaches loading states, error handling, and the subscribe pattern — these are real skills. But the player graduates Day 18 having never seen:
- `import { HttpClient } from '@angular/common/http'`
- `this.http.get<T[]>('/api/endpoint')`
- `provideHttpClient()` in app config
- Response typing
- The actual cold Observable that HttpClient returns

**What needs replacing, and what should replace it:**

Keep d18-c01 (the "Cold Observable" predict challenge). It's conceptually correct and well-written. Its lesson — Observables are lazy, subscribe triggers execution — is the right foundation.

d18-c02 (Loading State with Promise) should be rewritten as an actual Angular component using `HttpClient`. The pattern of three states (loading/success/error) is correct but should be demonstrated with real Angular syntax:

```typescript
// d18-c02 replacement concept: "Loading State"
// Player completes a service method that calls http.get() and manages state
// Type: complete, steady

@Injectable({ providedIn: 'root' })
export class SignalService {
  constructor(private http: HttpClient) {}

  getSignals(): Observable<Signal[]> {
    return this.http.get<Signal[]>('/api/signals');
  }
}

@Component({ ... })
export class SignalFeedComponent implements OnInit {
  loading = true;
  signals: Signal[] = [];
  error = '';

  constructor(private signalService: SignalService) {}

  ngOnInit() {
    // Subscribe to signalService.getSignals()
    // Set loading, signals, error appropriately
    // Your code here
  }
}
```

The tests should use a mock `HttpClient` via `HttpClientTestingModule` and `HttpTestingController`. This is a Week 3 challenge — players can handle real Angular testing patterns at this point.

d18-c03 (Missing Subscribe) is a legitimate lesson but currently uses a fake Observable. It should use `HttpClient` directly so the lesson becomes: "You called `http.get()` but forgot to subscribe." That's more memorable than a fake shim.

d18-c04 (Three-State Fetch) should be the demanding integration piece: a component that calls `http.get()` using the HttpClient service, handles three states, and uses Angular's actual error structure (`HttpErrorResponse`). The loading/success/error pattern is correct — it just needs to use real APIs.

**New concepts to add:**
- `provideHttpClient()` — introduce in d18-c01's explainGate or a hint ("HttpClient must be provided via provideHttpClient() in app.config.ts")
- `HttpErrorResponse` from `@angular/common/http`

**Challenge type change:** d18-c02 should become a `complete` challenge where the class methods are scaffolded and the player fills in the subscribe call and state assignment. This is more appropriate than the current Promise-based approach.

---

### Day 22 — RxJS Foundations

**The problem in full:**

- d22-c02 explicitly tells the player NOT to use RxJS. "Implement without RxJS — use plain array methods." In a day called RxJS Foundations.
- d22-c03 and d22-c04 use hand-rolled Observable and Subject classes. The player never imports `rxjs`.

The day teaches the CONCEPTS correctly — filter/map operators, memory leaks, subjects. But the lesson is abstracted away from the actual library. When the player opens a real Angular codebase and sees `import { BehaviorSubject, takeUntilDestroyed } from 'rxjs'`, they have no recognition.

**What needs replacing:**

d22-c02 needs to be rewritten as an actual RxJS pipeline. The core lesson (filter → map in sequence) is excellent — it just needs to use the real operators:

```typescript
// d22-c02 replacement: player completes the pipe() operator chain
import { of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export class StreamProcessor {
  output: string[] = [];

  process(values: number[]): void {
    of(...values).pipe(
      filter(v => /* Your code here */),
      map(v => /* Your code here */)
    ).subscribe(result => this.output.push(result));
  }
}
```

This teaches three things at once: `of()` as a creation operator, `pipe()` for chaining, and operators as arguments to pipe. These are the three concepts every RxJS tutorial starts with.

d22-c03 (Subscription Leak) is conceptually excellent. The fix is minimal: replace the hand-rolled Observable with an actual `interval()` from RxJS. The lesson — store subscription, unsubscribe in ngOnDestroy — is the most practically important RxJS lesson in the entire week. Make it real:

```typescript
import { interval } from 'rxjs';
import { Subscription } from 'rxjs';

// interval(100) replaces the hand-rolled setInterval Observable
```

d22-c04 (Event Bus) using a hand-rolled Subject should become a real `BehaviorSubject` or `Subject` from RxJS. The implementation is nearly identical — `this.bus = new Subject()`, `this.bus.next(event)`, `this.bus.subscribe(handler)`. The player should import these from `'rxjs'`.

**New challenge to consider (optional):**

Day 22 is missing a challenge on `takeUntilDestroyed` or `take()` / `takeUntil()` — the modern Angular pattern for automatic subscription cleanup. Since d22-c03 teaches manual unsubscribe, a complementary challenge on automatic cleanup would complete the picture. This is optional but would close a real gap.

---

### Phase 2 Summary

| Day | Challenge | Action | Impact |
|---|---|---|---|
| 18 | d18-c02 | Rewrite with real `HttpClient` and subscribe pattern | High |
| 18 | d18-c03 | Replace fake Observable with real `HttpClient.get()` example | High |
| 18 | d18-c04 | Add `HttpErrorResponse` typing, use real HttpClient | High |
| 22 | d22-c02 | Rewrite with real `of()`, `pipe()`, `filter`, `map` from rxjs | High |
| 22 | d22-c03 | Replace hand-rolled Observable with `interval()` from rxjs | Medium |
| 22 | d22-c04 | Replace hand-rolled Subject with `Subject` from `'rxjs'` | Medium |

---

## Phase 3 — Curriculum Integrity (Missing Concepts + Wrong Types)

**Days: 17, 19, 23**

These days have concept gaps — things listed in the `concepts` array that never appear in any challenge — and one structural misclassification (a refactor labeled as debug).

---

### Day 17 — Routing

**The problem:**

`routerLink` and `router-outlet` are listed as concepts. `router-outlet` appears only in a prediction question (not taught as something the player writes). `routerLink` is never mentioned in any challenge's instructions, starter code, or tests. The day teaches `ActivatedRoute` and `Router.navigate()` well, but the template-side of routing is completely absent.

**What `routerLink` means for a learner:**

`Router.navigate()` is programmatic navigation — you call it from a method. `routerLink` is declarative navigation — you put it in a template as an attribute. Real Angular apps use both. A nav bar uses `routerLink`. A button-click handler uses `router.navigate()`. Learning only the second half produces a developer who has to put navigation logic in every component class instead of the template.

**What to add:**

Replace d17-c02 (currently a complete challenge teaching `snapshot.paramMap.get()`) with a two-part approach: keep the `snapshot.paramMap.get()` concept but restructure d17-c02 as a `complete` challenge that also writes a `routerLink` binding. Then add a new challenge (or replace d17-c04 if keeping the count at 4) specifically on `routerLink`.

A minimal `routerLink` complete challenge:

```typescript
// d17-c02 revised: "Link the Beacons"
// Template already written — player writes the component class
// Template uses: <a [routerLink]="['/beacon', beacon.id]">{{ beacon.name }}</a>
// Player must provide the beacons array and understand why [routerLink] takes an array
```

The predict challenge (d17-c01) should be updated to include `<router-outlet>` in the code being read, so the player encounters it in a real context rather than just seeing it mentioned abstractly.

**Hint inaccuracy in d17-c01:**

The hint says "Angular matches routes in order but matches the most specific path." Change this to: "Angular matches routes top-to-bottom. The first route that fully matches the URL wins. `'signals'` doesn't match `/signals/7` because it has no `:id` segment — so the router keeps looking and finds `'signals/:id'`."

---

### Day 19 — Composition

**The problems:**

1. d19-c01 ("Shared State") repeats d16-c01 ("One Instance") — both predict challenges ask about singleton service sharing. No new angle.
2. `debounce` listed in concepts, never taught.
3. d19-c04 lists `routing` in its concepts but contains no routing.

**What d19-c01 should be instead:**

The composition day should open with a predict that shows all three layers working together — a component calling a service that makes a call, with the result flowing back through a subscription. Something like: "Trace the data flow — what does the component display after `ngOnInit()` completes?" This tests composition-level understanding, not just singleton knowledge, which was already tested in Day 16.

**What to do about `debounce`:**

`debounce` is a composition-level concept — you use it when a component's search input fires too many requests. It belongs exactly here. Replace d19-c03 (the "Stale Cache" debug challenge) with a `debounce`-focused challenge. The stale cache concept — while interesting — could be repurposed for Day 24. Day 19's theme is composition, and debounce is the most natural composition challenge: it requires knowing Observables (Day 18) + event binding (Day 15) + services (Day 16) simultaneously.

A debounce complete challenge:

```typescript
// Player completes a SearchComponent that debounces input
// Uses setTimeout to simulate debounce (300ms delay, cancel previous if new input arrives)
// Concept: don't fire on every keystroke, only after the user pauses
```

**What to do about d19-c04's mislabeled concepts:**

Remove `"routing"` from d19-c04's `concepts` array. The challenge teaches selection state and master-detail pattern — these are composition concepts, not routing. Routing is already covered in Day 17.

---

### Day 23 — Real Patterns

**The problems:**

1. `interceptors` listed in concepts, never taught.
2. d23-c03 ("Fat Component") is labeled `type: "debug"` but has working code that needs to be refactored.

**d23-c03 type fix:**

Change `"type": "debug"` to `"type": "refactor"`. This is a one-field change. The challenge itself is well-constructed — good scenario, good tests, good solution. It just has the wrong label. Spec 06 is explicit: "debug challenges have working-but-broken code with exactly one bug." This challenge has no bug — it has a design issue.

**What to do about interceptors:**

HTTP interceptors are a significant real-world Angular concept — they add auth headers, log requests, handle global error responses. They belong in this day because they're a "real pattern" that professionals use.

Interceptors require `HttpClient` to be meaningful. If Day 18 is fixed first (Phase 2), then by Day 23 the player knows what an HTTP request looks like. An interceptor challenge at Day 23 is appropriate.

Replace d23-c04 ("Container Split") with an interceptor challenge, OR add it as a 5th challenge. "Container Split" is a good challenge — consider moving it to Day 24 as an integration exercise instead.

A minimal interceptor complete challenge:

```typescript
// Player completes an AuthInterceptor that adds an Authorization header
// Type: complete, demanding
// Tests verify that the intercepted request has the header set

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authToken = 'Bearer drift-7';
  const authReq = req.clone({
    // Your code here: add Authorization header
  });
  return next(authReq);
}
```

This teaches `HttpRequest.clone()`, the functional interceptor pattern (modern Angular), and header manipulation — all patterns the player will encounter immediately in any real Angular project that has authentication.

---

### Phase 3 Summary

| Day | Issue | Fix |
|---|---|---|
| 17 | `routerLink` never taught | Replace or augment d17-c02 to include a `[routerLink]` binding challenge |
| 17 | Hint inaccuracy in d17-c01 | Rewrite hint to explain top-to-bottom matching correctly |
| 19 | d19-c01 repeats Day 16 | Replace with a composition predict (trace full component → service → data flow) |
| 19 | `debounce` missing | Replace d19-c03 with a debounce complete challenge |
| 19 | d19-c04 mislabeled concepts | Remove `"routing"` from concepts array |
| 23 | d23-c03 wrong type | Change `"type": "debug"` to `"type": "refactor"` |
| 23 | `interceptors` missing | Replace d23-c04 with functional interceptor complete challenge |

---

## Phase 4 — Difficulty Curves and Polish

**Days: 14, 21, 24, 25**

These are issues that don't break functionality but violate the spec's learning design principles — wrong ordering, flat curves, missing concepts in the day's declared scope.

---

### Day 14 — Components (residual)

**What's fine:** The four challenges are solid. The predict is genuine, the debug is clean (one clear typo bug), the complete challenges are well-scoped.

**What's missing:**

`@Output()` and `EventEmitter` are never introduced. The `concepts` array for Day 14 includes `property-binding` but d14-c04 (Crew Badge) only teaches `@Input` — `@Output()` is never introduced anywhere in the day. In Angular, `@Input` and `@Output` are conceptually paired: a parent passes data in via Input, the child notifies the parent via Output. Teaching one without the other leaves a gap.

Consider replacing d14-c04 with a challenge that teaches both `@Input()` and `@Output()` together, or restructure d14-c04 to extend the Crew Badge into an interactive component that emits events. At minimum, add `@Output`, `EventEmitter` to the day's `concepts` array and ensure a challenge covers them.

---

### Day 21 — Forms (residual)

**What's fine:** The predict/complete/debug/complete structure is solid. The custom FormGroup shim is a reasonable tradeoff for the sandbox environment.

**What's missing:**

`valueChanges` — the Observable that fires whenever a form field changes — is entirely absent. This is the bridge between forms and RxJS, and it's a major omission for a day at this position (Day 21, one day before the RxJS day). A `predict` challenge showing `form.get('callsign').valueChanges.subscribe(...)` would prime the player for Day 22.

`FormBuilder` is not mentioned anywhere. `FormBuilder` is how 95% of Angular developers actually create reactive forms — `inject(FormBuilder)` and `fb.group({...})` is what they'll see in real codebases. This doesn't need a full new challenge — the explain gate of d21-c02 could ask the player to describe how `FormBuilder.group({...})` is equivalent to their manual construction.

**Proposed addition:**

Add a predict challenge (as the new d21-c01, shifting others down) showing `valueChanges`:

```typescript
// form.get('query').valueChanges.subscribe(v => console.log(v));
// User types 'a', then 'al', then 'alp'
// How many times does the subscriber fire? What are the values?
```

This is gentle (just reading and tracing), teaches `valueChanges`, and directly sets up Day 22's Observable lessons.

---

### Day 24 — Integration (difficulty curve)

**The problem:**

Challenges 1, 2, and 3 are all `steady`. Spec 06 requires strictly increasing difficulty within a day.

**Proposed reordering and recalibration:**

- d24-c01 ("Submit and Navigate") — change difficulty to `gentle`. It's the cleanest, most scaffolded challenge. The steps are laid out 1-6 in the instructions. This is approachable. Adjust xpReward to 20.
- d24-c02 ("Race Condition") — keep `steady`. Race conditions are genuinely harder than a guarded submit.
- d24-c03 ("Clean Shutdown") — change to `demanding`. It requires understanding two cleanup mechanisms simultaneously (interval AND subscription). The explain gate should explicitly reference Day 22: "You saw subscription cleanup in Day 22. What's the difference between clearing an interval and unsubscribing from an Observable?"
- d24-c04 ("CRUD Service") — keep `demanding`. Five methods to implement, return value semantics, edge cases. xpReward of 35 is correct.

---

### Day 25 — Review & Strengthen (order fix + concept check)

**The problem:**

Current order violates spec 06's "Challenge 1 is always the easiest, difficulty strictly increases" rule:

| Position | Challenge | Type | Difficulty |
|---|---|---|---|
| 1 | d25-c01 | debug | steady |
| 2 | d25-c02 | complete | steady |
| 3 | d25-c03 | predict | **gentle** |
| 4 | d25-c04 | complete | demanding |

A gentle predict at position 3, after two steady challenges, is a direct violation.

**Proposed reorder:**

| Position | Challenge | Type | Difficulty |
|---|---|---|---|
| 1 | d25-c03 (was pos 3) | predict | gentle |
| 2 | d25-c01 (was pos 1) | debug | steady |
| 3 | d25-c02 (was pos 2) | complete | steady → promote to demanding |
| 4 | d25-c04 (was pos 4) | complete | demanding → capstone |

Update each challenge's `"order"` field accordingly.

**TypeScript generics concern:**

d25-c02 uses `export async function retry<T>(fn: () => Promise<T>, times: number): Promise<T>`. TypeScript generics were not explicitly taught in the curriculum. If day-12.json and day-13.json do not cover generic functions, the `<T>` signature will feel alien. Two options:
1. Simplify to `retry(fn: () => Promise<any>, times: number): Promise<any>` and add a note ("A full implementation uses generics — see the solution")
2. Add a hint: "The `<T>` is a TypeScript generic — it means the function works with any return type. You don't need to understand it to solve the challenge."

**Promise.allSettled concern in d25-c04:**

`Promise.allSettled` is not taught anywhere in the curriculum before this point. Day 10 covers basic Promises (`.then`, `.catch`, `async/await`). `Promise.allSettled` is non-trivial — it never rejects and returns an array of status objects. The hints for d25-c04 explain it adequately, but the explain gate should ask specifically: "What is the difference between `Promise.all` and `Promise.allSettled`, and why is `allSettled` the right choice when some requests might fail?"

---

### Phase 4 Summary

| Day | Issue | Fix |
|---|---|---|
| 14 | `@Output`/`EventEmitter` never taught | Replace d14-c04 or add it to a revised challenge pairing Input + Output |
| 21 | `valueChanges` missing, no bridge to Day 22 | Add predict challenge showing `valueChanges.subscribe()` as new d21-c01 |
| 21 | `FormBuilder` not mentioned | Add to explain gate of d21-c02 |
| 24 | d24-c01 too hard for position 1 | Change difficulty to `gentle`, adjust xpReward to 20 |
| 24 | Flat difficulty curve (steady × 3) | Promote d24-c03 to `demanding` |
| 25 | d25-c03 is position 3 but is the gentlest | Reorder: c03 → c01 → c02 → c04, update `order` fields |
| 25 | TypeScript generics in d25-c02 | Add hint explaining `<T>` or simplify signature |
| 25 | `Promise.allSettled` untaught | Add explainGate question targeting the allSettled vs all distinction |

---

## Full Phase Overview

```
Phase 1 — Critical structural bugs (Days 15, 20, 26)
  Fix: invalid Angular template in d15-c02
  Fix: add "environment": "stackblitz" to d20-c01 and d26-c01
  Fix: add constructor scaffolding to d26-c01 starter code

  Prerequisites for: everything else (app must render correctly before content matters)

Phase 2 — API integrity (Days 18, 22)
  Fix: rewrite d18-c02, d18-c03, d18-c04 to use real HttpClient
  Fix: rewrite d22-c02 to use real rxjs operators
  Fix: replace hand-rolled Observable/Subject in d22-c03, d22-c04 with real rxjs

  Prerequisites for: Phase 3 interceptor challenge (needs player to know HttpClient)

Phase 3 — Curriculum integrity (Days 17, 19, 23)
  Fix: add routerLink challenge to Day 17
  Fix: replace d19-c01 (repeat), replace d19-c03 (add debounce)
  Fix: change d23-c03 type to refactor
  Fix: replace d23-c04 with interceptor challenge

  Can run in parallel with Phase 2

Phase 4 — Difficulty curves and polish (Days 14, 21, 24, 25)
  Fix: add @Output challenge to Day 14
  Fix: add valueChanges predict to Day 21
  Fix: reorder Day 25 challenges (c03 first)
  Fix: promote Day 24 d24-c01 to gentle difficulty
  Fix: add hints/explainGate for generics and Promise.allSettled in Day 25

  Run last — these require Phase 2-3 content to be stable first
```

---

## Concept Gap Register

All concepts listed in day `concepts[]` arrays that are never taught in any challenge:

| Day | Missing Concept | Severity |
|---|---|---|
| 15 | `two-way-binding` | High — core Angular form pattern |
| 17 | `routerLink` | High — template-side navigation |
| 17 | `router-outlet` (not written) | Medium — shown but not authored |
| 18 | `httpClient` (real API) | Critical — the day is named after it |
| 19 | `debounce` | Medium — practical composition pattern |
| 22 | actual `rxjs` imports | Critical — the day is named after it |
| 23 | `interceptors` | High — ubiquitous in production code |

## False Positive Register

Tests that pass with incorrect or incomplete player code:

| Day | Challenge | Issue |
|---|---|---|
| 15 | d15-c02 | Broken template passes all class-level tests |
| 16 | d16-c03 | Tests don't verify DI injection was used |

## Wrong Challenge Type Register

| Day | Challenge | Labeled As | Should Be |
|---|---|---|---|
| 23 | d23-c03 | `debug` | `refactor` |
