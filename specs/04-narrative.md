# 26 DAYS — Narrative Spec: The Drift x Project Hail Mary

## Document Purpose
This document scripts the entire 26-day narrative of The Drift -- the story text shown before and after each day's challenges, how it parallels Project Hail Mary (PHM), and the emotional arc that keeps the player coming back. Your friend implements this as static JSON loaded per day.

**SPOILER WARNING:** This document references the full plot of Project Hail Mary by Andy Weir. The player should read the book alongside the game, so the in-game narrative never spoils upcoming chapters -- it echoes and reframes what they've already read.

---

## 1. Narrative Architecture

### The Parallel Structure

The Drift tells its own story, but it's designed to emotionally mirror PHM at every beat:

```
PHM:         Ryland wakes up → understands the ship → solves problems → finds Rocky → builds together → saves Earth
The Drift:   You wake up     → understand the code  → solve challenges → find depth  → build mastery  → ready for internship
```

The game NEVER says "this is like the book." The parallels are felt, not explained. The player will notice them naturally as they read alongside playing.

### Narrative Voice

The Drift's text is written in **second person present tense** ("You open your eyes. The light is soft."). It's intimate, immediate, and personal. The tone is:

- **Quiet, not dramatic.** No exclamation marks. No "YOU MUST SAVE THE UNIVERSE." The stakes are personal and understated.
- **Poetic, not purple.** Cormorant Garamond carries a lot of the elegance. The words themselves should be simple and precise.
- **Curious, not commanding.** The narrative invites exploration, doesn't demand it. "Something flickers in the distance" not "Go to the flickering light."
- **Warm, not cold.** This is space, but it's not lonely space. The Drift has a quiet presence, almost like it's alive and waiting for you.

### Text Length Guidelines

```
Day narrative intro:    80-150 words (30-60 seconds of reading)
Day narrative outro:    60-120 words (the reward, shorter)
Challenge narrativeHook: 20-40 words (1-2 sentences, very brief)
PHM connection note:    30-50 words (a gentle nudge to read)
```

---

## 2. The Drift's Story (Overview)

### Act 1: Awakening (Days 1-7, Week 1)
You wake in The Drift with nothing. You don't know where you are or how you got here. The systems around you are dormant -- vast structures of unknown purpose, silent and dark. You begin to name things, recognize patterns, interact with the most basic elements of this place. Each thing you understand brings a small light. By the end of the week, you've illuminated a small cluster of the constellation. It's not much, but it's yours.

**Emotional arc:** Confusion → curiosity → small sparks of confidence
**PHM parallel:** Ryland wakes up in the ship, doesn't know who he is, starts figuring out the basics

### Act 2: Signals (Days 8-13, Week 2)
The Drift isn't empty. You start to detect signals -- patterns that arrive asynchronously, data that resolves after delays, messages that were sent long ago and are only now reaching you. The structures are trying to communicate, but in a language of time and sequence you don't yet speak. You learn to listen, to wait, to chain one understanding onto another. A larger pattern begins to emerge.

**Emotional arc:** Frustration with complexity → learning patience → breakthrough moments
**PHM parallel:** Ryland encounters Rocky, learns to communicate across a language barrier, starts solving larger problems

### Act 3: Architecture (Days 14-20, Week 3)
You now understand enough to see the architecture of this place. The Drift isn't random -- it's structured. Components connect to services. Data flows through defined paths. What seemed like chaos was a system, built with intention by something that came before you. You begin to not just read the structures but rebuild them. Dormant systems come online. The Drift glows brighter than you've ever seen it.

**Emotional arc:** Overwhelm at scale → recognition of patterns → growing competence
**PHM parallel:** Ryland and Rocky work together to understand the astrophage, building increasingly complex solutions

### Act 4: Resonance (Days 21-26, Week 4)
Everything connects. The skills you built in isolation now work in concert. You can take raw input, transform it, route it, display it, validate it. The Drift is nearly alive -- a web of light and structure that you understood into existence. On the final day, you stand in the middle of something beautiful and complete. You built this. You're ready.

**Emotional arc:** Synthesis → mastery → quiet pride
**PHM parallel:** The final mission, Ryland's sacrifice and triumph, the feeling that all the small steps led to something that mattered

---

## 3. Day-by-Day Narrative Script

### Day 1: Awakening

**PHM chapters to read:** 1-2
**PHM connection:** Like Ryland, you wake up with no context. Everything is unfamiliar. You start by naming what you see.

**Narrative Intro:**
> You open your eyes to soft light. It's not sunlight -- it's something cooler, more diffused, like dawn filtered through deep water. You're floating, or close to it. The space around you is vast and formless, a watercolor indigo that stretches in every direction.
>
> There are structures here. You can feel them more than see them -- shapes at the edge of perception, dormant, waiting. They're built in a language you don't understand. Not yet.
>
> The first step is always the same: name what you see.

**Challenge Narrative Hooks:**
1. (predict) "A symbol pulses faintly on the nearest surface. What does it represent?"
2. (complete) "The console responds to names. Give this value an identity."
3. (debug) "Something was named wrong. The system rejects it. Find the error."
4. (complete) "Two values. The system asks which one can change and which is fixed."
5. (predict) "You type a name. The system echoes something back. What will it say?"

**Narrative Outro:**
> Five small lights where there were none. It doesn't seem like much, but look at the map -- where everything was dark, something now responds to you. The Drift noticed. You named things, and naming things is the first act of understanding.
>
> Rest. Tomorrow, the patterns get more complex.

---

### Day 2: Patterns

**PHM chapters to read:** 3-4
**PHM connection:** Ryland starts understanding the ship's systems through observation. You start recognizing how data has structure.

**Narrative Intro:**
> The structures around you aren't random. You can see that now. There's repetition -- shapes that echo each other, values that cluster into groups. The Drift organizes itself in collections, and if you can understand how things group together, you can start to read this place like a map.
>
> Collections of things. Ordered sequences. Key-value pairs. The language of this place is built on these foundations.

**Challenge Narrative Hooks:**
1. (predict) "An ordered sequence glows on the wall. What lives at position three?"
2. (complete) "The system shows you a collection but it's missing entries. Fill the gaps."
3. (debug) "A data structure is corrupt. One element is in the wrong form."
4. (refactor) "The data works but it's tangled. Untangle it into something clean."
5. (predict) "You access a key that doesn't exist. What does the void return?"

**Narrative Outro:**
> The shapes make sense now. Arrays hold sequences. Objects hold meaning. You can reach into a structure and pull out exactly what you need. The cluster around you grows a little brighter. The Drift is starting to respond to understanding.

---

### Day 3: Responses

**PHM chapters to read:** 5-6
**PHM connection:** Ryland begins experimenting with the ship, getting the systems to respond. You learn to make code respond to conditions.

**Narrative Intro:**
> The Drift doesn't just store data -- it reacts. Touch a structure and it changes state. Provide a condition and the entire pathway reroutes. This place is conditional at its core: if one thing is true, the light flows one way. If not, another path illuminates.
>
> You're not just reading anymore. You're making decisions. The Drift follows.

**Challenge Narrative Hooks:**
1. (predict) "Two paths diverge. The condition is set. Which path lights up?"
2. (complete) "The system needs a decision gate. Write the condition that routes the flow."
3. (debug) "The logic is inverted. Things that should pass are blocked, and vice versa."
4. (complete) "A series of checks, each more specific. Build the cascade."
5. (build) "The Drift presents raw data. Filter it, categorize it, respond differently to each type."

**Narrative Outro:**
> You've taught the system to choose. Conditions, branches, cascading logic -- the Drift's pathways are becoming more sophisticated under your hands. What was binary is now nuanced. Three more lights join the constellation.

---

### Day 4: Repetition

**PHM chapters to read:** 7
**PHM connection:** Ryland establishes routines on the ship. Repetitive tasks become manageable through systems. You learn loops.

**Narrative Intro:**
> Some structures here repeat. The same pattern, over and over, each iteration slightly different from the last. You could interact with each one individually, but there's a faster way -- tell the system the pattern once, and it propagates. Loop through. Iterate. Transform.
>
> Repetition in The Drift isn't tedious. It's powerful.

**Challenge Narrative Hooks:**
1. (predict) "A loop runs. How many times will the signal pulse?"
2. (complete) "The system needs to process a list. Write the iteration."
3. (debug) "An infinite loop. The system is frozen. Break the cycle."
4. (refactor) "Five nearly identical lines. Condense them into one elegant loop."
5. (complete) "Transform every element in the collection. Map the old shape to the new."

**Narrative Outro:**
> What took five steps now takes one. You can feel the efficiency -- the Drift responds faster when you speak in loops. Map. Filter. Reduce. These aren't just methods. They're a way of thinking.

---

### Day 5: Abstraction

**PHM chapters to read:** 8
**PHM connection:** Ryland starts building reusable procedures on the ship. You learn functions -- reusable blocks of logic.

**Narrative Intro:**
> The Drift rewards patterns you can name and reuse. You've been writing instructions inline, step by step. But what if you could bundle a set of steps, give it a name, and invoke it whenever you need it? The ancient builders of this place did exactly that. Their structures are built on layers of abstraction -- functions that call functions that call functions.
>
> It's time to build your own.

**Challenge Narrative Hooks:**
1. (predict) "A named function is called with arguments. What returns?"
2. (complete) "The system expects a function that transforms input to output. Define it."
3. (debug) "A function exists but returns the wrong thing. The logic is close but off."
4. (refactor) "Repeated code scattered across the system. Extract it into one clean function."
5. (complete) "A function that takes another function as input. Higher-order thinking."

**Narrative Outro:**
> You've reached a threshold. Functions aren't just convenience -- they're the way complex systems stay comprehensible. Name a thing, define its behavior, reuse it endlessly. The builders of this place knew this well. You're beginning to think the way they did.

---

### Day 6: The Living Document

**PHM chapters to read:** 9
**PHM connection:** Ryland interacts with the ship's interfaces more directly. You learn the DOM -- the living structure of a webpage.

**Narrative Intro:**
> There's a layer beneath the code. A structure that the code manipulates -- a document that lives and changes. Nodes, elements, a tree of content that renders into something visible. The Drift shows you this layer now: the interface between logic and perception. What you code here becomes what you see.

**Challenge Narrative Hooks:**
1. (predict) "You query the document for an element. What does it return?"
2. (complete) "Create an element, give it content, attach it to the tree."
3. (debug) "The element should appear but doesn't. Something in the DOM wiring is wrong."
4. (complete) "Change an element's text, its style, its attributes. Make it respond."
5. (build) "Build a small interactive element from scratch: HTML, style, and behavior."

**Narrative Outro:**
> You can see it now -- the bridge between code and form. Everything visible is a node in a tree, and every node can be reached, changed, created, destroyed. The interface is yours to shape.

---

### Day 7: BOSS BATTLE -- First Light

**PHM chapters to read:** 10
**PHM connection:** Ryland has his first major success on the ship. You prove everything you've learned.

**Narrative Intro:**
> A structure at the center of the first cluster has been dark since you arrived. It's larger than the others -- a nexus point, something the builders clearly intended to be important. Every skill you've gathered this week connects here.
>
> It's time to bring it online. No hints. No fragments. Just you and what you've learned.
>
> You have 45 minutes.

**Boss Battle:** Build a small interactive page from scratch that uses variables, arrays, objects, functions, DOM manipulation, and event handling. A mini-project that synthesizes Week 1.

**Narrative Outro:**
> The nexus ignites. Not with fire -- with light. A slow, warm bloom that spreads through every node you've activated this week, connecting them, making them brighter than they were alone. The first cluster of The Drift is alive.
>
> You did that. Seven days ago you woke up with nothing.
>
> The second region awaits, and the signals there are more complex. But you're not the same person who woke up in the dark.

---

### Day 8: Timing

**PHM chapters to read:** 11
**PHM connection:** Ryland encounters problems that require patience and precise timing. You learn callbacks and timing functions.

**Narrative Intro:**
> The second region is different. The structures here don't respond immediately -- they answer on their own schedule. Send a signal and the response comes back seconds later, or minutes, or not at all. The builders designed these systems to work across time, not just across space.
>
> To work here, you need to learn patience. And callbacks.

**Challenge Narrative Hooks:**
1. (predict) "A setTimeout fires. When does the callback execute relative to the next line?"
2. (complete) "The system needs a delayed response. Wire the callback."
3. (debug) "The timing is wrong. A callback fires before the data is ready."
4. (predict) "Three timers, different delays. In what order do they resolve?"
5. (complete) "An event listener that waits for the right moment, then acts."

**Narrative Outro:**
> Time isn't linear here. Things happen when they're ready, not when you expect them to. But you're learning to listen for the signals, to set up callbacks that fire at precisely the right moment. The Drift's second region is starting to hum.

---

### Day 9: Promises

**PHM chapters to read:** 12
**PHM connection:** Ryland makes and receives promises with Rocky -- commitments that resolve later. You learn Promises.

**Narrative Intro:**
> A promise is a signal sent with intention. "I will resolve. Eventually. Trust me." The structures in this region communicate through promises -- commitments of future data. Some fulfill. Some reject. Your job is to handle both, gracefully.

**Challenge Narrative Hooks:**
1. (predict) "A promise resolves. What value arrives in .then()?"
2. (complete) "Build a promise that resolves after a condition is met."
3. (debug) "A promise rejects but nobody catches it. The system throws a silent error."
4. (complete) "Chain three promises. The output of each feeds the next."
5. (refactor) "Nested callbacks, three levels deep. Flatten them into a promise chain."

**Narrative Outro:**
> Promises changed how you think about data. It's not "give me the value now." It's "tell me when the value is ready, and I'll know what to do with it." The async patterns of The Drift are becoming second nature.

---

### Day 10: Async Fluency

**PHM chapters to read:** 13-14
**PHM connection:** Ryland and Rocky develop a smoother communication system. You learn async/await -- the cleaner syntax for promises.

**Narrative Intro:**
> There's an easier way to speak with time. Instead of chaining and nesting, you can simply wait. The word is literal: await. Tell the system you're willing to pause, and it gives you the value when it's ready. The code reads like prose instead of machinery.

**Challenge Narrative Hooks:**
1. (predict) "An async function awaits two promises. What's the final value?"
2. (complete) "Rewrite this promise chain using async/await."
3. (debug) "The await is there but the function isn't async. The system chokes."
4. (complete) "Fetch data, handle the loading state, handle the error state."
5. (refactor) "A callback pyramid. Transform it into clean async/await."

**Narrative Outro:**
> The code you write now reads like a story: do this, wait for that, then continue. No more nesting into oblivion. The structures in this region respond to you fluidly, as if you've learned their natural cadence.

---

### Day 11: Modern Syntax

**PHM chapters to read:** 15
**PHM connection:** Ryland discovers more advanced tools on the ship that make his work easier. You learn ES6+ features.

**Narrative Intro:**
> The builders left tools scattered throughout The Drift -- shortcuts, compressed syntax, patterns that do in one line what used to take five. Destructuring. Spread operators. Template literals. Arrow functions. These aren't just convenient. They're how modern systems expect you to speak.

**Challenge Narrative Hooks:**
1. (predict) "A destructured assignment. Which variables hold which values?"
2. (complete) "Spread an array into a new one with additional elements."
3. (debug) "An arrow function lost its `this` context. The reference is wrong."
4. (refactor) "Old-style syntax. Modernize it with ES6+ features."
5. (complete) "Template literals, default parameters, rest operator. Use them all."

**Narrative Outro:**
> Your code is getting tighter. More expressive. What used to be verbose and fragile is now concise and clear. The builders of this place would recognize your syntax. You're writing in their dialect now.

---

### Day 12: Modules & Types

**PHM chapters to read:** 16-17
**PHM connection:** Ryland organizes his knowledge into systems. Rocky and Ryland develop a shared type system for communication. You learn modules and TypeScript basics.

**Narrative Intro:**
> Everything you've built so far lives in one place. But real systems are organized -- separated into modules, each with a clear purpose and clear boundaries. And the signals between them have types: this is a number, this is a string, this is a promise of an array. The Drift enforces these boundaries. Violate them and the system goes dark.

**Challenge Narrative Hooks:**
1. (predict) "A module exports two functions. What's available to the importer?"
2. (complete) "Split this monolith into modules with proper imports and exports."
3. (debug) "A type error. The function expects a string but receives a number."
4. (complete) "Define an interface. Make the data conform to its shape."
5. (predict) "TypeScript catches an error at compile time. What is it?"

**Narrative Outro:**
> Structure. Boundaries. Types. Your code is no longer a single stream of consciousness -- it's an architecture of cooperating modules, each speaking a typed language. The Drift rewards this order with clarity.

---

### Day 13: BOSS BATTLE -- Deep Signal

**PHM chapters to read:** 18
**PHM connection:** A major turning point in the book. Ryland and Rocky face their biggest challenge yet. You face yours.

**Narrative Intro:**
> A transmission arrives from the deepest part of this region. It's broken -- the data pipeline that once carried it has decayed. Promises fail silently. Types are mismatched. Modules are disconnected. The builders left this system unfinished, or perhaps time broke it.
>
> You have 45 minutes. Trace the data from source to destination. Fix every broken link. Make the signal complete.

**Boss Battle:** Debug a broken async data pipeline -- a multi-file system with promises, async/await, imports/exports, TypeScript interfaces, and error handling. The player traces data through the system and fixes each break.

**Narrative Outro:**
> The signal arrives. Complete, intact, decoded. A deep tone resonates through the second cluster, and every node you activated this week brightens in response. The two clusters -- week one and week two -- are now connected by a single, luminous thread.
>
> The third region is different. It's not code fragments and functions. It's architecture. Components, services, systems that compose into something larger than their parts. This is where understanding becomes building.

---

### Day 14: Components

**PHM chapters to read:** 19
**PHM connection:** Ryland starts building complex systems from modular parts. You learn Angular components.

**Narrative Intro:**
> The third region reveals itself not as scattered fragments but as interconnected components. Each one is a self-contained unit -- its own template, its own logic, its own appearance. They combine like organs in a living thing, each serving a purpose, all working together.
>
> This is Angular. This is how real applications are built. And this is the architecture of The Drift itself.

**Challenge Narrative Hooks:**
1. (predict) "A component renders with an input. What appears in the template?"
2. (complete) "Create your first component. Template, class, and decorator."
3. (debug) "The component renders but the data doesn't show. The binding is broken."
4. (complete) "A parent passes data to a child. Wire the @Input."
5. (complete) "A child emits an event to its parent. Wire the @Output."

**Narrative Outro:**
> Your first Angular components. They're simple, but they're modular, composable, and alive. The Drift's third region responds to this -- structures that were monolithic start to separate into distinct, glowing components.

---

### Day 15: Templates

**PHM chapters to read:** 20
**PHM connection:** Ryland develops better visual interfaces for his systems. You learn Angular template syntax.

**Narrative Intro:**
> Components need a face. The template is where data becomes visible -- where values become text, where arrays become lists, where conditions become presence or absence. The Drift's visual language is its template syntax: binding, directives, pipes. Learn to speak it and the structures show you their contents.

**Challenge Narrative Hooks:**
1. (predict) "A template interpolates a value. What renders on screen?"
2. (complete) "Display a list of items using *ngFor."
3. (debug) "The conditional rendering is wrong. An element shows when it should hide."
4. (complete) "Two-way binding. The input updates the display and vice versa."
5. (refactor) "Raw template logic. Extract it into pipes and cleaner directives."

**Narrative Outro:**
> Templates are the bridge between data and perception. What lives in your TypeScript now renders in the view, and what the user touches flows back. The loop is closing.

---

### Day 16: Services

**PHM chapters to read:** 21
**PHM connection:** Ryland creates shared systems that multiple parts of the ship can access. You learn Angular services and dependency injection.

**Narrative Intro:**
> Not everything belongs in a component. Some knowledge needs to be shared -- data that multiple components access, logic that shouldn't be duplicated. The builders of The Drift centralized these in services: singleton providers that any component can request. The Drift gives them to you through injection. Ask, and you receive.

**Challenge Narrative Hooks:**
1. (complete) "Create a service that holds shared state. Inject it into two components."
2. (debug) "Two components show different data from the same service. Something is wrong with the provider scope."
3. (predict) "A service is provided in root. How many instances exist?"
4. (complete) "Move business logic from a component into a service. The component becomes thin."
5. (refactor) "Duplicated logic in three components. Centralize it in a service."

**Narrative Outro:**
> The architecture is maturing. Components for the view, services for the shared logic. Clean separation. The Drift's third cluster is taking shape -- not just nodes, but connections, data flowing through defined channels.

---

### Day 17: Routing

**PHM chapters to read:** 22
**PHM connection:** Ryland navigates between different sections of the ship's systems. You learn Angular routing.

**Narrative Intro:**
> The Drift has rooms. Or rather, it has views -- distinct spaces you can navigate between, each with its own purpose. Routing is how you map addresses to views, how you move from one context to another without losing your place. The builders designed pathways. You're learning to walk them.

**Challenge Narrative Hooks:**
1. (complete) "Define two routes. Map paths to components."
2. (debug) "The route exists but navigating to it shows a blank page. What's missing?"
3. (complete) "Add a route with a parameter. Read the parameter in the component."
4. (predict) "A routerLink points to '/items/3'. What component renders?"
5. (complete) "Navigation guards. Prevent access to a route unless a condition is met."

**Narrative Outro:**
> You can navigate The Drift now. Not just see it, not just understand it, but move through it with purpose. Each route is a door, each parameter is a key. The application has spatial awareness.

---

### Day 18: HTTP

**PHM chapters to read:** 23
**PHM connection:** Ryland sends and receives data from external sources. You learn Angular's HttpClient.

**Narrative Intro:**
> The Drift doesn't exist in isolation. There are signals from outside -- data sources, APIs, external systems that respond to requests. Angular speaks to them through HTTP: get, post, put, delete. The verbs of the external world. You're about to open a channel.

**Challenge Narrative Hooks:**
1. (complete) "Inject HttpClient. Make a GET request. Display the result."
2. (debug) "The HTTP call fires but the component never updates. The subscription is missing."
3. (complete) "Handle loading, success, and error states for an HTTP request."
4. (predict) "An HTTP GET returns an Observable. What happens if nobody subscribes?"
5. (complete) "POST data to an endpoint. Send a body, receive a response."

**Narrative Outro:**
> The Drift is connected now. Data flows in from the outside, rendered by your components, managed by your services, navigated by your routes. The system is becoming real.

---

### Day 19: Composition

**PHM chapters to read:** 24
**PHM connection:** Ryland combines everything he's learned into more sophisticated solutions. You build complex Angular features.

**Narrative Intro:**
> Everything you've learned this week works in isolation. But real systems compose -- a component that uses a service that makes HTTP calls, displayed through a template with routing and parameters. Today you compose. Today the individual skills become a coherent whole.

**Challenge Narrative Hooks:**
1. (complete) "A list page that fetches data from an API and displays it with routing."
2. (debug) "The detail page loads but shows stale data. The service caches incorrectly."
3. (refactor) "A fat component that does everything. Decompose it into components + a service."
4. (complete) "A search feature: input, HTTP call, filtered results, debounced."
5. (build) "A master-detail layout. List on the left, detail on the right. Fully wired."

**Narrative Outro:**
> This is what it feels like. Not individual skills, but orchestration. Components, services, HTTP, routing -- all working in concert. The Drift's third cluster blazes with interconnected light.

---

### Day 20: BOSS BATTLE -- The Structure Awakens

**PHM chapters to read:** 25
**PHM connection:** A pivotal moment where everything Ryland built is tested. Your Angular knowledge faces its test.

**Narrative Intro:**
> The largest structure in the third region -- a complex of interconnected chambers, each dependent on the others -- has been dark since you arrived. It's an application. A real one, with routes, components, services, HTTP calls, and state management. The builders left it unfinished.
>
> Finish it. Bring the whole thing online. You have 60 minutes.

**Boss Battle:** Build a working multi-page Angular application with at least 3 routes, shared services, HTTP data fetching, and component composition.

**Narrative Outro:**
> The structure awakens. Not suddenly -- in stages. First the routing map illuminates, then the services pulse, then the components render one by one until the entire complex is alive, glowing with the warm gold of something complete and functioning.
>
> Three clusters active. One remains. The final region is where mastery lives.

---

### Day 21: Forms

**PHM chapters to read:** 26
**PHM connection:** Ryland needs precise input mechanisms for critical operations. You learn Angular forms.

**Narrative Intro:**
> The final region requires precision. Input, validation, error handling -- every piece of data that enters the system must be verified and shaped. The builders were careful here. Forms are how users speak to applications, and that conversation must be handled with care.

**Challenge Narrative Hooks:**
1. (complete) "A reactive form with three fields. Build it, bind it, read the values."
2. (debug) "The form submits but the values are null. The bindings are disconnected."
3. (complete) "Add validators: required, minLength, pattern. Show error messages conditionally."
4. (predict) "A form is touched, dirty, and invalid. What does the template show?"
5. (refactor) "Template-driven form to reactive form. Same behavior, better control."

**Narrative Outro:**
> Forms are the most human part of any application. They're where real people type real things and expect the system to understand. You handle that now -- validation, feedback, guidance. The Drift's final region begins to glow.

---

### Day 22: RxJS Foundations

**PHM chapters to read:** 27
**PHM connection:** Ryland learns to process continuous streams of data from the astrophage. You learn RxJS basics.

**Narrative Intro:**
> The Drift speaks in streams. Not single values but continuous flows of data -- events, HTTP responses, user interactions, time itself. RxJS is the language of these streams: Observables that emit, operators that transform, subscriptions that listen. The most powerful pattern in Angular lives here.

**Challenge Narrative Hooks:**
1. (predict) "An Observable emits three values. What does the subscriber see?"
2. (complete) "Create an Observable from an event. Transform it with map and filter."
3. (debug) "A subscription leaks. The component is destroyed but the Observable keeps emitting."
4. (complete) "Combine two Observables. When both emit, produce a combined result."
5. (refactor) "Imperative event handling. Convert it to a reactive stream with RxJS."

**Narrative Outro:**
> Streams. Flows. Reactive patterns. You're no longer waiting for data -- you're responding to it as it arrives, transforming it in flight, composing it into new streams. The Drift's final region pulses with current.

---

### Day 23: Real Patterns

**PHM chapters to read:** 28
**PHM connection:** Ryland applies everything he's learned to solve real, complex problems. You learn real-world Angular patterns.

**Narrative Intro:**
> Theory becomes practice. The patterns you'll see in real codebases -- at your internship, in production apps, in open-source projects. Smart and dumb components. Container patterns. Resolver guards. Interceptors. The patterns that separate working code from professional code.

**Challenge Narrative Hooks:**
1. (complete) "Build a smart component that manages state and a dumb component that just renders."
2. (debug) "An HTTP interceptor adds auth headers but breaks one specific endpoint."
3. (complete) "A resolver that pre-fetches data before a route activates."
4. (refactor) "A component with mixed concerns. Separate into container and presentational."
5. (predict) "An interceptor modifies the request. What does the server receive?"

**Narrative Outro:**
> These are the patterns that professionals use. Not because they're complex, but because they make complex applications manageable. You're writing code that a team could read, maintain, and build upon. That's what your internship will ask of you.

---

### Day 24: Integration

**PHM chapters to read:** 29
**PHM connection:** Everything comes together for Ryland. Every skill, every relationship, every piece of knowledge. You integrate everything you've learned.

**Narrative Intro:**
> Two days remain. The Drift has taught you everything it can in isolation. Now: integration. Take forms, services, HTTP, routing, RxJS, and component patterns, and make them work as a single system. This is the real skill -- not knowing each piece, but knowing how they fit together.

**Challenge Narrative Hooks:**
1. (complete) "A form that validates, submits via HTTP, handles loading and errors, and navigates on success."
2. (debug) "A race condition: two HTTP calls return in the wrong order. The UI shows stale data."
3. (complete) "A reactive search: keyup Observable, debounced, with HTTP calls and error handling."
4. (refactor) "A tangled component. Extract services, add proper typing, implement OnDestroy cleanup."
5. (build) "A complete CRUD feature: list, create, edit, delete. Services, routing, forms, HTTP."

**Narrative Outro:**
> Everything connects. Every skill you've built over 24 days works in harmony. The Drift's final cluster blazes, and the connections between all four clusters form a web of light that spans the entire map.

---

### Day 25: Review & Strengthen

**PHM chapters to read:** 30 (the final chapters)
**PHM connection:** Before the final mission, Ryland reviews everything, ensures every system is solid. You review and strengthen weak areas.

**Narrative Intro:**
> Tomorrow is the last day. Today, you revisit. The Drift shows you where your understanding is brightest and where it's still fragile. Each challenge today is a synthesis -- a concept from an earlier week, revisited with everything you now know. Stronger foundations make for a stronger finish.

**Challenge Narrative Hooks:**
1. (debug) "A JavaScript scoping issue buried inside an Angular service. Both worlds collide."
2. (complete) "A TypeScript generic function used in an Angular pipe."
3. (predict) "An async Angular test. What order do the lifecycle hooks fire in?"
4. (refactor) "A week-1 style function. Rewrite it using everything you've learned since."
5. (complete) "An RxJS stream that combines user input, HTTP data, and timer events."

**Narrative Outro:**
> Solid. You can feel it. Not just knowledge but fluency -- the difference between knowing the words and speaking the language. Tomorrow, you prove it.

---

### Day 26: FINAL BOSS -- Resonance

**PHM chapters to read:** Finish the book if you haven't.
**PHM connection:** The final mission. Everything on the line. Ryland's arc concludes. Yours is about to begin.

**Narrative Intro:**
> Twenty-five days ago you woke up in the dark. You didn't know what a variable was, or a component, or a promise. Now look at the map. Look at what you built.
>
> One structure remains. The largest. The deepest. It sits at the convergence of all four clusters, a beacon that's been waiting for someone with enough understanding to activate it.
>
> This is your final challenge. Build a real application -- one that talks to a real API, with real routing, real forms, real services, real patterns. Not a tutorial. A thing that works.
>
> You have 90 minutes. But you won't need them all.

**Boss Battle:** Build a mini-application from scratch that hits a real (public) API, displays data in a list with routing to detail views, includes a search/filter feature, handles loading and error states, and uses proper Angular architecture (services, components, reactive patterns).

**Narrative Outro:**
> The beacon ignites.
>
> Not slowly this time. A wave of light sweeps from the lower-left of the map to the upper-right, tracing the exact path you walked over 26 days. Every node you activated, every connection you made, every structure you brought online -- they all resonate, all at once, a constellation of understanding that spans the entire Drift.
>
> You built this. Not the app. Not the code. This -- the knowledge in your mind, the patterns you can now see, the confidence that you can look at someone else's code and understand it.
>
> Your internship starts soon. You're ready.
>
> The Drift is alive. And so are you.

---

## 4. PHM Chapter-to-Day Mapping (Summary)

| Day | PHM Chapters | PHM Theme | Drift Parallel |
|-----|-------------|-----------|----------------|
| 1 | 1-2 | Waking up, total confusion | Variables, naming things |
| 2 | 3-4 | Understanding the ship | Data structures |
| 3 | 5-6 | Experimenting with systems | Conditionals |
| 4 | 7 | Establishing routines | Loops |
| 5 | 8 | Building reusable procedures | Functions |
| 6 | 9 | Interfacing with the ship | DOM |
| 7 | 10 | First major success | Boss: Interactive page |
| 8 | 11 | Timing and patience | Callbacks, timing |
| 9 | 12 | Promises made with Rocky | Promises |
| 10 | 13-14 | Smoother communication | Async/await |
| 11 | 15 | Advanced ship tools | ES6+ features |
| 12 | 16-17 | Organizing knowledge | Modules, TypeScript |
| 13 | 18 | Major turning point | Boss: Async pipeline |
| 14 | 19 | Modular building | Angular components |
| 15 | 20 | Visual interfaces | Templates |
| 16 | 21 | Shared systems | Services, DI |
| 17 | 22 | Navigation | Routing |
| 18 | 23 | External communication | HTTP |
| 19 | 24 | Combining skills | Composition |
| 20 | 25 | Pivotal test | Boss: Multi-page app |
| 21 | 26 | Precision input | Forms |
| 22 | 27 | Data streams | RxJS basics |
| 23 | 28 | Professional techniques | Real patterns |
| 24 | 29 | Full integration | Integration |
| 25 | 30 | Pre-mission review | Review & strengthen |
| 26 | Finish | The final mission | Boss: Full application |

---

## 5. Narrative JSON Format

Each day's narrative is stored as a JSON file:

```json
{
  "dayNumber": 1,
  "title": "Awakening",
  "narrativeIntro": "You open your eyes to soft light...",
  "narrativeOutro": "Five small lights where there were none...",
  "phmChapters": [1, 2],
  "phmConnectionNote": "Like Ryland, you wake up with no context. Everything is unfamiliar. You start by naming what you see.",
  "challengeHooks": [
    {
      "challengeOrder": 1,
      "hook": "A symbol pulses faintly on the nearest surface. What does it represent?"
    },
    {
      "challengeOrder": 2,
      "hook": "The console responds to names. Give this value an identity."
    }
  ]
}
```

---

## Next Spec
- **05-challenge-curriculum.md** — All 150+ challenges with code and tests
