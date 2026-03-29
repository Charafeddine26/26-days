# 26 DAYS — Challenge Curriculum

## Document Purpose
This is the complete bank of challenges for the 26-day curriculum. Each challenge includes the ID, type, concept, starter code, solution, tests, hints, and explain gate. Your friend loads these as JSON files per day.

**Format:** Each challenge is written in full detail. For brevity in the spec, TypeScript types are omitted from the JSON -- they follow the Challenge interface from the Foundation Spec.

---

# WEEK 1: JavaScript Foundations (Days 1-7)

---

## Day 1: Awakening — Variables, Constants, Types

### D01-C01: The First Signal (predict)
```
concepts: ["typeof", "primitive-types"]
difficulty: gentle
xpReward: 15

instructions: |
  Read the code below carefully. Without running it, predict what
  `console.log(result)` will output.

starterCode: |
  // Read-only — predict the output
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
```

### D01-C02: Naming Things (complete)
```
concepts: ["variables", "let", "const", "assignment"]
difficulty: gentle
xpReward: 20

instructions: |
  The system has detected three signals but they haven't been named.
  Declare the variables as instructed in the comments.

starterCode: |
  // Declare a variable called 'station' with the value "Drift-7"
  // (this value might change later)


  // Declare a constant called 'crew' with the value 1
  // (this will never change)


  // Declare a variable called 'status' with the value undefined
  // (we don't know the status yet)


solution: |
  let station = "Drift-7";
  const crew = 1;
  let status = undefined;

tests:
  - description: "station should equal 'Drift-7'"
    testCode: "if (station !== 'Drift-7') throw new Error(`Expected 'Drift-7', got '${station}'`);"
  - description: "station should be declared with let (reassignable)"
    testCode: "try { station = 'test'; station = 'Drift-7'; } catch(e) { throw new Error('station should be reassignable (use let)'); }"
  - description: "crew should equal 1"
    testCode: "if (crew !== 1) throw new Error(`Expected 1, got ${crew}`);"
  - description: "crew should be a constant (not reassignable)"
    testCode: "try { crew = 2; throw new Error('crew should not be reassignable (use const)'); } catch(e) { if(e.message.includes('should not')) throw e; }"
  - description: "status should be undefined"
    testCode: "if (status !== undefined) throw new Error(`Expected undefined, got ${status}`);"

hints:
  - "Use 'let' for values that might change, 'const' for values that won't"
  - "You can explicitly assign undefined to a variable"
  - "const crew = 1; — this is the pattern"

explainGate:
  prompt: "When would you use let vs const?"
  keywords: ["change", "reassign", "constant"]
  minLength: 30
```

### D01-C03: The Corrupted Label (debug)
```
concepts: ["const", "reassignment-error", "type-coercion"]
difficulty: gentle
xpReward: 25

instructions: |
  This code tries to update the station's name, but it crashes.
  Find and fix the bug. The station name should successfully
  update to "Drift-9".

starterCode: |
  const stationName = "Drift-7";
  stationName = "Drift-9";
  console.log(stationName);

solution: |
  let stationName = "Drift-7";
  stationName = "Drift-9";
  console.log(stationName);

tests:
  - description: "stationName should equal 'Drift-9'"
    testCode: "if (stationName !== 'Drift-9') throw new Error(`Expected 'Drift-9', got '${stationName}');"
  - description: "Code should run without errors"
    testCode: "/* If we got here, no runtime error */"

hints:
  - "Read the error message carefully — what does 'Assignment to constant variable' mean?"
  - "const means the variable can never be reassigned"
  - "Change const to let if the value needs to change"

explainGate:
  prompt: "Why did using const cause the error?"
  keywords: ["const", "reassign", "change"]
  minLength: 25
```

### D01-C04: Fixed and Fluid (complete)
```
concepts: ["let-vs-const", "strings", "numbers", "booleans"]
difficulty: gentle
xpReward: 20

instructions: |
  Declare the following variables with the correct keyword (let or const)
  based on whether they should be changeable:

  - `maxFuel` should be 100 and never change
  - `currentFuel` should start at 100 but can decrease
  - `engineRunning` should start as false but can be toggled
  - `shipName` should be "Hail Mary" and never change

starterCode: |
  // Declare maxFuel (fixed at 100)

  // Declare currentFuel (starts at 100, can change)

  // Declare engineRunning (starts false, can change)

  // Declare shipName (fixed as "Hail Mary")


solution: |
  const maxFuel = 100;
  let currentFuel = 100;
  let engineRunning = false;
  const shipName = "Hail Mary";

tests:
  - description: "maxFuel should be 100 and constant"
    testCode: "if (maxFuel !== 100) throw new Error('maxFuel should be 100'); try { maxFuel = 0; throw new Error('maxFuel should be const'); } catch(e) { if(e.message.includes('should be')) throw e; }"
  - description: "currentFuel should be 100 and reassignable"
    testCode: "if (currentFuel !== 100) throw new Error('currentFuel should start at 100'); currentFuel = 50; currentFuel = 100;"
  - description: "engineRunning should be false and reassignable"
    testCode: "if (engineRunning !== false) throw new Error('engineRunning should start as false'); engineRunning = true; engineRunning = false;"
  - description: "shipName should be 'Hail Mary' and constant"
    testCode: "if (shipName !== 'Hail Mary') throw new Error('shipName wrong'); try { shipName = 'x'; throw new Error('shipName should be const'); } catch(e) { if(e.message.includes('should be')) throw e; }"

hints:
  - "If a value should never change after being set, use const"
  - "If a value needs to be updated later, use let"
```

### D01-C05: Echo (predict)
```
concepts: ["string-concatenation", "template-literals", "type-coercion"]
difficulty: gentle
xpReward: 15

instructions: |
  Read the code. Predict what will be logged.

starterCode: |
  // Read-only — predict the output
  let count = 5;
  let message = "Signals detected: " + count;
  console.log(message);
  console.log(typeof message);

predictPrompt: "What two lines will be logged?"
predictChoices:
  - "Signals detected: 5\nnumber"
  - "Signals detected: 5\nstring"
  - "Signals detected: 5\nundefined"
  - "Error: cannot add string and number"
predictAnswer: "Signals detected: 5\nstring"

hints:
  - "When you add a string and a number with +, JavaScript converts the number to a string"
  - "The result of string + anything is always a string"

explainGate:
  prompt: "Why is the result a string even though count is a number?"
  keywords: ["coercion", "convert", "string", "concatenat"]
  minLength: 30
```

---

## Day 2: Patterns — Arrays & Objects

### D02-C01: Position Three (predict)
```
concepts: ["arrays", "indexing", "zero-based"]
difficulty: gentle
xpReward: 15

starterCode: |
  const signals = ["alpha", "beta", "gamma", "delta", "epsilon"];
  console.log(signals[2]);

predictPrompt: "What will be logged?"
predictChoices: ["\"beta\"", "\"gamma\"", "\"delta\"", "undefined"]
predictAnswer: "\"gamma\""

hints:
  - "Array indexing starts at 0, not 1"
  - "signals[0] is 'alpha', signals[1] is 'beta', signals[2] is..."
```

### D02-C02: Fill the Gaps (complete)
```
concepts: ["arrays", "push", "length", "access"]
difficulty: gentle
xpReward: 20

instructions: |
  The sensor array is incomplete. Follow the comments to build it correctly.

starterCode: |
  // Create an array called 'sensors' with these values: "thermal", "optical", "radio"
  const sensors = ;

  // Add "quantum" to the end of the array


  // Store the total number of sensors in a variable called 'count'
  const count = ;

solution: |
  const sensors = ["thermal", "optical", "radio"];
  sensors.push("quantum");
  const count = sensors.length;

tests:
  - description: "sensors should have 4 elements"
    testCode: "if (sensors.length !== 4) throw new Error(`Expected 4 elements, got ${sensors.length}`);"
  - description: "sensors should contain 'quantum' as the last element"
    testCode: "if (sensors[3] !== 'quantum') throw new Error(`Last element should be 'quantum', got '${sensors[3]}`);"
  - description: "count should equal 4"
    testCode: "if (count !== 4) throw new Error(`count should be 4, got ${count}`);"
  - description: "sensors should still contain the original three elements"
    testCode: "if (sensors[0] !== 'thermal' || sensors[1] !== 'optical' || sensors[2] !== 'radio') throw new Error('Original elements are wrong');"

hints:
  - "Arrays are created with square brackets: ['a', 'b', 'c']"
  - "Use .push() to add an element to the end"
  - "Use .length to get the number of elements"
```

### D02-C03: Corrupt Entry (debug)
```
concepts: ["objects", "property-access", "dot-notation"]
difficulty: gentle
xpReward: 25

instructions: |
  This object should describe a crew member, but the code that reads
  it has bugs. Fix the property access lines (don't change the object itself).

starterCode: |
  const crewMember = {
    name: "Ryland Grace",
    role: "scientist",
    active: true,
    missions: 1
  };

  // These lines have bugs — fix them
  const memberName = crewMember[name];
  const memberRole = crewMember.Role;
  const isActive = crewmember.active;

solution: |
  const crewMember = {
    name: "Ryland Grace",
    role: "scientist",
    active: true,
    missions: 1
  };

  const memberName = crewMember.name;
  const memberRole = crewMember.role;
  const isActive = crewMember.active;

tests:
  - description: "memberName should be 'Ryland Grace'"
    testCode: "if (memberName !== 'Ryland Grace') throw new Error(`Expected 'Ryland Grace', got '${memberName}'`);"
  - description: "memberRole should be 'scientist'"
    testCode: "if (memberRole !== 'scientist') throw new Error(`Expected 'scientist', got '${memberRole}'`);"
  - description: "isActive should be true"
    testCode: "if (isActive !== true) throw new Error(`Expected true, got ${isActive}`);"

hints:
  - "Bracket notation needs the key as a string: obj['name'], not obj[name]"
  - "Property names are case-sensitive: .Role is not .role"
  - "Variable names are also case-sensitive: crewMember is not crewmember"
```

### D02-C04: Untangle (refactor)
```
concepts: ["objects", "arrays", "data-organization"]
difficulty: steady
xpReward: 30

instructions: |
  This data works but it's messy. Refactor it into a single well-structured
  object called `mission` that organizes all the information cleanly.
  The tests will tell you what structure is expected.

starterCode: |
  // Messy data — refactor into a single 'mission' object
  const missionName = "Hail Mary";
  const missionYear = 2024;
  const crew1 = "Grace";
  const crew2 = "Ilyukhina";
  const crew3 = "Shapiro";
  const missionActive = true;

  // Create your 'mission' object below:
  const mission = {};

solution: |
  const mission = {
    name: "Hail Mary",
    year: 2024,
    crew: ["Grace", "Ilyukhina", "Shapiro"],
    active: true
  };

tests:
  - description: "mission.name should be 'Hail Mary'"
    testCode: "if (mission.name !== 'Hail Mary') throw new Error(`mission.name should be 'Hail Mary'`);"
  - description: "mission.year should be 2024"
    testCode: "if (mission.year !== 2024) throw new Error(`mission.year should be 2024`);"
  - description: "mission.crew should be an array with 3 names"
    testCode: "if (!Array.isArray(mission.crew) || mission.crew.length !== 3) throw new Error('mission.crew should be an array of 3'); if (!mission.crew.includes('Grace') || !mission.crew.includes('Ilyukhina') || !mission.crew.includes('Shapiro')) throw new Error('mission.crew should contain Grace, Ilyukhina, and Shapiro');"
  - description: "mission.active should be true"
    testCode: "if (mission.active !== true) throw new Error('mission.active should be true');"

hints:
  - "An object can have arrays as property values: { crew: ['a', 'b', 'c'] }"
  - "Group related values as properties of one object"
```

### D02-C05: Void Key (predict)
```
concepts: ["undefined", "object-property-access", "missing-keys"]
difficulty: gentle
xpReward: 15

starterCode: |
  const ship = { name: "Drift-7", fuel: 80 };
  console.log(ship.speed);

predictPrompt: "What will be logged?"
predictChoices: ["null", "undefined", "0", "Error: property not found"]
predictAnswer: "undefined"

hints:
  - "Accessing a property that doesn't exist on an object doesn't throw an error"
  - "It returns undefined — the value for 'nothing is here'"

explainGate:
  prompt: "Why does JavaScript return undefined instead of throwing an error?"
  keywords: ["exist", "undefined", "property"]
  minLength: 25
```

---

## Day 3: Responses — Conditionals & Logic

### D03-C01: Which Path (predict)
```
concepts: ["if-else", "comparison", "boolean"]
difficulty: gentle
xpReward: 15

starterCode: |
  const fuel = 30;
  if (fuel > 50) {
    console.log("Safe");
  } else if (fuel > 20) {
    console.log("Low");
  } else {
    console.log("Critical");
  }

predictPrompt: "What will be logged?"
predictChoices: ["\"Safe\"", "\"Low\"", "\"Critical\""]
predictAnswer: "\"Low\""

hints:
  - "30 > 50 is false, so the first block is skipped"
  - "30 > 20 is true, so the else if block runs"
```

### D03-C02: Decision Gate (complete)
```
concepts: ["if-else", "comparison-operators", "return"]
difficulty: gentle
xpReward: 20

instructions: |
  Write a function `checkAccess` that takes a `clearanceLevel` (number)
  and returns:
  - "granted" if clearance is 3 or higher
  - "limited" if clearance is 1 or 2
  - "denied" if clearance is 0 or less

starterCode: |
  function checkAccess(clearanceLevel) {
    // Your code here
  }

solution: |
  function checkAccess(clearanceLevel) {
    if (clearanceLevel >= 3) {
      return "granted";
    } else if (clearanceLevel >= 1) {
      return "limited";
    } else {
      return "denied";
    }
  }

tests:
  - description: "clearance 5 should return 'granted'"
    testCode: "if (checkAccess(5) !== 'granted') throw new Error('Expected granted for clearance 5');"
  - description: "clearance 3 should return 'granted'"
    testCode: "if (checkAccess(3) !== 'granted') throw new Error('Expected granted for clearance 3');"
  - description: "clearance 2 should return 'limited'"
    testCode: "if (checkAccess(2) !== 'limited') throw new Error('Expected limited for clearance 2');"
  - description: "clearance 0 should return 'denied'"
    testCode: "if (checkAccess(0) !== 'denied') throw new Error('Expected denied for clearance 0');"
  - description: "clearance -1 should return 'denied'"
    testCode: "if (checkAccess(-1) !== 'denied') throw new Error('Expected denied for clearance -1');"

hints:
  - "Use >= for 'greater than or equal to'"
  - "Check the highest threshold first, then work down"
```

### D03-C03: Inverted Logic (debug)
```
concepts: ["logical-operators", "negation", "boolean-logic"]
difficulty: steady
xpReward: 25

instructions: |
  The alarm system is backwards — it activates when everything is fine
  and stays silent when there's danger. Fix the conditions without
  changing the structure.

starterCode: |
  function shouldAlarm(oxygenLow, hullBreach, fireDetected) {
    if (!oxygenLow && !hullBreach && !fireDetected) {
      return true;  // alarm ON
    } else {
      return false; // alarm OFF
    }
  }

solution: |
  function shouldAlarm(oxygenLow, hullBreach, fireDetected) {
    if (oxygenLow || hullBreach || fireDetected) {
      return true;
    } else {
      return false;
    }
  }

tests:
  - description: "should alarm when oxygen is low"
    testCode: "if (shouldAlarm(true, false, false) !== true) throw new Error('Should alarm when oxygen is low');"
  - description: "should alarm when hull breach detected"
    testCode: "if (shouldAlarm(false, true, false) !== true) throw new Error('Should alarm on hull breach');"
  - description: "should alarm when fire detected"
    testCode: "if (shouldAlarm(false, false, true) !== true) throw new Error('Should alarm on fire');"
  - description: "should NOT alarm when everything is fine"
    testCode: "if (shouldAlarm(false, false, false) !== false) throw new Error('Should not alarm when all clear');"
  - description: "should alarm when multiple dangers present"
    testCode: "if (shouldAlarm(true, true, false) !== true) throw new Error('Should alarm on multiple dangers');"

hints:
  - "The alarm should be ON when any danger is present, not when all are absent"
  - "Replace && (all must be true) with || (any can be true)"
  - "Remove the ! (not) operators — they invert the logic"

explainGate:
  prompt: "What's the difference between && and || in this context?"
  keywords: ["and", "or", "any", "all"]
  minLength: 30
```

### D03-C04: Cascade Check (complete)
```
concepts: ["switch", "ternary", "complex-conditions"]
difficulty: steady
xpReward: 20

instructions: |
  Write a function `getStatusMessage` that takes a status code (string)
  and returns the appropriate message using a switch statement:
  - "green" → "All systems operational"
  - "yellow" → "Minor issues detected"
  - "red" → "Critical failure"
  - anything else → "Unknown status"

starterCode: |
  function getStatusMessage(code) {
    // Use a switch statement
  }

solution: |
  function getStatusMessage(code) {
    switch (code) {
      case "green":
        return "All systems operational";
      case "yellow":
        return "Minor issues detected";
      case "red":
        return "Critical failure";
      default:
        return "Unknown status";
    }
  }

tests:
  - description: "'green' should return 'All systems operational'"
    testCode: "if (getStatusMessage('green') !== 'All systems operational') throw new Error('Wrong message for green');"
  - description: "'yellow' should return 'Minor issues detected'"
    testCode: "if (getStatusMessage('yellow') !== 'Minor issues detected') throw new Error('Wrong message for yellow');"
  - description: "'red' should return 'Critical failure'"
    testCode: "if (getStatusMessage('red') !== 'Critical failure') throw new Error('Wrong message for red');"
  - description: "unknown code should return 'Unknown status'"
    testCode: "if (getStatusMessage('blue') !== 'Unknown status') throw new Error('Wrong message for unknown');"

hints:
  - "switch (code) { case 'value': return 'result'; }"
  - "Don't forget the default case for unrecognized codes"
```

### D03-C05: Classify (build)
```
concepts: ["conditionals", "typeof", "arrays", "combined-logic"]
difficulty: steady
xpReward: 30

instructions: |
  Write a function `classify` that takes any value and returns a string
  describing it:
  - If it's a number and positive → "positive number"
  - If it's a number and negative → "negative number"
  - If it's a number and zero → "zero"
  - If it's a string and non-empty → "text"
  - If it's a string and empty ("") → "empty text"
  - If it's a boolean → "flag"
  - If it's an array → "collection"
  - Anything else → "unknown"

starterCode: |
  function classify(value) {
    // Your code here
  }

solution: |
  function classify(value) {
    if (Array.isArray(value)) return "collection";
    if (typeof value === "number") {
      if (value > 0) return "positive number";
      if (value < 0) return "negative number";
      return "zero";
    }
    if (typeof value === "string") {
      return value.length > 0 ? "text" : "empty text";
    }
    if (typeof value === "boolean") return "flag";
    return "unknown";
  }

tests:
  - description: "classify(42) should return 'positive number'"
    testCode: "if (classify(42) !== 'positive number') throw new Error('Failed for 42');"
  - description: "classify(-5) should return 'negative number'"
    testCode: "if (classify(-5) !== 'negative number') throw new Error('Failed for -5');"
  - description: "classify(0) should return 'zero'"
    testCode: "if (classify(0) !== 'zero') throw new Error('Failed for 0');"
  - description: "classify('hello') should return 'text'"
    testCode: "if (classify('hello') !== 'text') throw new Error('Failed for hello');"
  - description: "classify('') should return 'empty text'"
    testCode: "if (classify('') !== 'empty text') throw new Error('Failed for empty string');"
  - description: "classify(true) should return 'flag'"
    testCode: "if (classify(true) !== 'flag') throw new Error('Failed for true');"
  - description: "classify([1,2]) should return 'collection'"
    testCode: "if (classify([1,2]) !== 'collection') throw new Error('Failed for array');"
  - description: "classify(null) should return 'unknown'"
    testCode: "if (classify(null) !== 'unknown') throw new Error('Failed for null');"

hints:
  - "Check for arrays FIRST using Array.isArray() — typeof [] returns 'object', not 'array'"
  - "Use typeof for primitives: typeof 42 === 'number'"
  - "For numbers, check if positive/negative/zero after confirming it's a number"

explainGate:
  prompt: "Why do we need Array.isArray() instead of typeof for arrays?"
  keywords: ["typeof", "object", "array"]
  minLength: 30
```

---

## Day 4: Repetition — Loops & Iteration

### D04-C01: Pulse Count (predict)
```
concepts: ["for-loop", "iteration", "counter"]
difficulty: gentle
xpReward: 15

starterCode: |
  let count = 0;
  for (let i = 0; i < 5; i++) {
    count += 2;
  }
  console.log(count);

predictPrompt: "What will be logged?"
predictChoices: ["5", "8", "10", "12"]
predictAnswer: "10"

hints:
  - "The loop runs 5 times (i = 0, 1, 2, 3, 4)"
  - "Each iteration adds 2 to count: 0 → 2 → 4 → 6 → 8 → 10"
```

### D04-C02: Process the List (complete)
```
concepts: ["for-of", "arrays", "iteration"]
difficulty: gentle
xpReward: 20

instructions: |
  Use a for...of loop to calculate the sum of all numbers in the
  `readings` array. Store the result in `total`.

starterCode: |
  const readings = [23, 45, 12, 67, 89, 34];
  let total = 0;

  // Use a for...of loop to sum all readings


solution: |
  const readings = [23, 45, 12, 67, 89, 34];
  let total = 0;

  for (const reading of readings) {
    total += reading;
  }

tests:
  - description: "total should be 270"
    testCode: "if (total !== 270) throw new Error(`Expected 270, got ${total}`);"

hints:
  - "for (const item of array) { ... } iterates over each element"
  - "Add each reading to total using total += reading"
```

### D04-C03: Infinite Loop (debug)
```
concepts: ["while-loop", "infinite-loop", "loop-condition"]
difficulty: steady
xpReward: 25

instructions: |
  This code should count down from 10 to 1 and log each number,
  but it creates an infinite loop. Fix it.

starterCode: |
  let countdown = 10;
  const results = [];

  while (countdown > 0) {
    results.push(countdown);
    countdown + 1;
  }

solution: |
  let countdown = 10;
  const results = [];

  while (countdown > 0) {
    results.push(countdown);
    countdown -= 1;
  }

tests:
  - description: "results should contain numbers 10 down to 1"
    testCode: "const expected = [10,9,8,7,6,5,4,3,2,1]; if (JSON.stringify(results) !== JSON.stringify(expected)) throw new Error(`Expected [10..1], got [${results}]`);"
  - description: "countdown should be 0 after the loop"
    testCode: "if (countdown !== 0) throw new Error(`countdown should be 0, got ${countdown}`);"

hints:
  - "countdown + 1 doesn't change countdown — it's an expression, not an assignment"
  - "To count DOWN, you need to subtract, not add"
  - "Use countdown -= 1 or countdown-- to decrease the value"

explainGate:
  prompt: "Why didn't 'countdown + 1' change the value of countdown?"
  keywords: ["assign", "expression", "-=", "--"]
  minLength: 25
```

### D04-C04: Condense (refactor)
```
concepts: ["loops", "DRY", "refactoring"]
difficulty: steady
xpReward: 30

instructions: |
  This code works but it's repetitive. Refactor it to use a loop.
  The output in `results` must be identical.

starterCode: |
  const data = [10, 20, 30, 40, 50];
  const results = [];

  results.push(data[0] * 2);
  results.push(data[1] * 2);
  results.push(data[2] * 2);
  results.push(data[3] * 2);
  results.push(data[4] * 2);

solution: |
  const data = [10, 20, 30, 40, 50];
  const results = [];

  for (const value of data) {
    results.push(value * 2);
  }

tests:
  - description: "results should be [20, 40, 60, 80, 100]"
    testCode: "if (JSON.stringify(results) !== JSON.stringify([20,40,60,80,100])) throw new Error(`Expected [20,40,60,80,100], got [${results}]`);"
  - description: "Code should use a loop (no more than 6 lines of non-comment code)"
    testCode: "/* Structural check handled by the refactor requirement */"
    hidden: true

hints:
  - "A loop lets you do the same operation on every element without repeating yourself"
  - "for (const value of data) lets you access each element"
```

### D04-C05: Transform (complete)
```
concepts: ["map", "filter", "array-methods"]
difficulty: steady
xpReward: 20

instructions: |
  Use array methods to:
  1. `doubled`: map each number in `values` to its double
  2. `highReadings`: filter `values` to only include numbers greater than 30
  3. `sum`: reduce `values` to a single sum

starterCode: |
  const values = [12, 45, 8, 67, 23, 89, 4];

  // Use .map() to double each value
  const doubled = ;

  // Use .filter() to keep only values > 30
  const highReadings = ;

  // Use .reduce() to sum all values
  const sum = ;

solution: |
  const values = [12, 45, 8, 67, 23, 89, 4];

  const doubled = values.map(v => v * 2);
  const highReadings = values.filter(v => v > 30);
  const sum = values.reduce((acc, v) => acc + v, 0);

tests:
  - description: "doubled should be [24, 90, 16, 134, 46, 178, 8]"
    testCode: "if (JSON.stringify(doubled) !== JSON.stringify([24,90,16,134,46,178,8])) throw new Error(`doubled is wrong: [${doubled}]`);"
  - description: "highReadings should be [45, 67, 89]"
    testCode: "if (JSON.stringify(highReadings) !== JSON.stringify([45,67,89])) throw new Error(`highReadings is wrong: [${highReadings}]`);"
  - description: "sum should be 248"
    testCode: "if (sum !== 248) throw new Error(`sum should be 248, got ${sum}`);"

hints:
  - ".map(fn) creates a new array by applying fn to each element"
  - ".filter(fn) creates a new array with elements where fn returns true"
  - ".reduce((accumulator, value) => accumulator + value, startValue)"
```

---

## Day 5: Abstraction — Functions

### D05-C01: Return Value (predict)
```
concepts: ["functions", "return", "arguments"]
difficulty: gentle
xpReward: 15

starterCode: |
  function greet(name) {
    return "Hello, " + name;
  }

  const message = greet("Grace");
  console.log(message);

predictPrompt: "What will be logged?"
predictChoices: ["\"Hello, name\"", "\"Hello, Grace\"", "undefined", "\"Hello, undefined\""]
predictAnswer: "\"Hello, Grace\""

hints:
  - "When greet('Grace') is called, 'Grace' is passed as the name parameter"
  - "The function returns a string with the name inserted"
```

### D05-C02: Transform Function (complete)
```
concepts: ["functions", "parameters", "return-values"]
difficulty: gentle
xpReward: 20

instructions: |
  Write a function `celsiusToFahrenheit` that takes a temperature in
  Celsius and returns it in Fahrenheit.
  Formula: F = (C * 9/5) + 32

starterCode: |
  function celsiusToFahrenheit(celsius) {
    // Your code here
  }

solution: |
  function celsiusToFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
  }

tests:
  - description: "0°C should be 32°F"
    testCode: "if (celsiusToFahrenheit(0) !== 32) throw new Error('0C should be 32F');"
  - description: "100°C should be 212°F"
    testCode: "if (celsiusToFahrenheit(100) !== 212) throw new Error('100C should be 212F');"
  - description: "-40°C should be -40°F"
    testCode: "if (celsiusToFahrenheit(-40) !== -40) throw new Error('-40C should be -40F');"
  - description: "37°C should be 98.6°F"
    testCode: "if (Math.abs(celsiusToFahrenheit(37) - 98.6) > 0.01) throw new Error('37C should be 98.6F');"

hints:
  - "Use the formula: (celsius * 9/5) + 32"
  - "Don't forget to return the result"
```

### D05-C03: Off by One (debug)
```
concepts: ["functions", "return", "logic-error"]
difficulty: steady
xpReward: 25

instructions: |
  This function should return the average of an array of numbers,
  but it returns the wrong result. Find and fix the bug.

starterCode: |
  function average(numbers) {
    let sum = 0;
    for (const num of numbers) {
      sum += num;
    }
    return sum / numbers.length - 1;
  }

solution: |
  function average(numbers) {
    let sum = 0;
    for (const num of numbers) {
      sum += num;
    }
    return sum / numbers.length;
  }

tests:
  - description: "average([10, 20, 30]) should be 20"
    testCode: "if (average([10, 20, 30]) !== 20) throw new Error(`Expected 20, got ${average([10, 20, 30])}`);"
  - description: "average([5]) should be 5"
    testCode: "if (average([5]) !== 5) throw new Error(`Expected 5, got ${average([5])}`);"
  - description: "average([0, 100]) should be 50"
    testCode: "if (average([0, 100]) !== 50) throw new Error(`Expected 50, got ${average([0, 100])}`);"

hints:
  - "Look at the return statement carefully — operator precedence matters"
  - "sum / numbers.length - 1 is parsed as (sum / numbers.length) - 1"
  - "The '- 1' shouldn't be there at all — average is sum / count"

explainGate:
  prompt: "What was wrong with the return statement?"
  keywords: ["- 1", "operator", "precedence"]
  minLength: 20
```

### D05-C04: Extract (refactor)
```
concepts: ["functions", "DRY", "extraction"]
difficulty: steady
xpReward: 30

instructions: |
  This code repeats the same tax calculation three times. Extract
  a reusable function called `calculateTotal` that takes a price
  and tax rate, and returns the total. Then use it for all three.

starterCode: |
  const item1Price = 25;
  const item1Tax = 0.1;
  const item1Total = item1Price + (item1Price * item1Tax);

  const item2Price = 50;
  const item2Tax = 0.2;
  const item2Total = item2Price + (item2Price * item2Tax);

  const item3Price = 100;
  const item3Tax = 0.15;
  const item3Total = item3Price + (item3Price * item3Tax);

solution: |
  function calculateTotal(price, taxRate) {
    return price + (price * taxRate);
  }

  const item1Total = calculateTotal(25, 0.1);
  const item2Total = calculateTotal(50, 0.2);
  const item3Total = calculateTotal(100, 0.15);

tests:
  - description: "item1Total should be 27.5"
    testCode: "if (item1Total !== 27.5) throw new Error(`item1Total should be 27.5, got ${item1Total}`);"
  - description: "item2Total should be 60"
    testCode: "if (item2Total !== 60) throw new Error(`item2Total should be 60, got ${item2Total}`);"
  - description: "item3Total should be 115"
    testCode: "if (item3Total !== 115) throw new Error(`item3Total should be 115, got ${item3Total}`);"
  - description: "calculateTotal should be a function"
    testCode: "if (typeof calculateTotal !== 'function') throw new Error('calculateTotal should be a function');"
  - description: "calculateTotal(10, 0.05) should return 10.5"
    testCode: "if (calculateTotal(10, 0.05) !== 10.5) throw new Error('calculateTotal(10, 0.05) should be 10.5');"

hints:
  - "The pattern is: price + (price * taxRate)"
  - "Create a function with two parameters: price and taxRate"
  - "Replace each manual calculation with a call to your function"
```

### D05-C05: Higher Order (complete)
```
concepts: ["higher-order-functions", "callbacks", "function-as-argument"]
difficulty: demanding
xpReward: 20

instructions: |
  Write a function `applyToAll` that takes an array and a function,
  and returns a new array where the function has been applied to
  each element. (This is how .map() works under the hood.)

starterCode: |
  function applyToAll(array, fn) {
    // Your code here
  }

  // Don't modify these — they test your function
  const numbers = [1, 2, 3, 4, 5];
  const doubled = applyToAll(numbers, x => x * 2);
  const asStrings = applyToAll(numbers, x => String(x));

solution: |
  function applyToAll(array, fn) {
    const result = [];
    for (const item of array) {
      result.push(fn(item));
    }
    return result;
  }

  const numbers = [1, 2, 3, 4, 5];
  const doubled = applyToAll(numbers, x => x * 2);
  const asStrings = applyToAll(numbers, x => String(x));

tests:
  - description: "doubled should be [2, 4, 6, 8, 10]"
    testCode: "if (JSON.stringify(doubled) !== JSON.stringify([2,4,6,8,10])) throw new Error('doubled is wrong');"
  - description: "asStrings should be ['1','2','3','4','5']"
    testCode: "if (JSON.stringify(asStrings) !== JSON.stringify(['1','2','3','4','5'])) throw new Error('asStrings is wrong');"
  - description: "Should not modify the original array"
    testCode: "if (JSON.stringify(numbers) !== JSON.stringify([1,2,3,4,5])) throw new Error('Original array was modified');"

hints:
  - "Create a new empty array to store results"
  - "Loop through the input array, call fn(item) on each, push to results"
  - "Return the new array"

explainGate:
  prompt: "What makes a function 'higher order'?"
  keywords: ["function", "argument", "parameter", "takes"]
  minLength: 25
```

---

## Day 6: The Living Document — DOM Manipulation

### D06-C01: Query (predict)
```
concepts: ["DOM", "querySelector", "null"]
difficulty: gentle
xpReward: 15

instructions: |
  Given this HTML, predict what the code will log.

  HTML (read-only):
  <div id="status">Online</div>
  <p class="info">System ready</p>

starterCode: |
  // Assume the HTML above exists in the document
  const el = document.querySelector('#status');
  console.log(el.textContent);

  const missing = document.querySelector('#nonexistent');
  console.log(missing);

predictPrompt: "What two things will be logged?"
predictChoices:
  - "\"Online\"\nnull"
  - "\"Online\"\nundefined"
  - "\"<div id='status'>Online</div>\"\nnull"
  - "Error: element not found"
predictAnswer: "\"Online\"\nnull"

hints:
  - ".textContent returns the text inside an element"
  - "querySelector returns null when no matching element exists"
```

### D06-C02: Create and Attach (complete)
```
concepts: ["DOM", "createElement", "appendChild", "textContent"]
difficulty: gentle
xpReward: 20

instructions: |
  Create a new paragraph element, set its text to "Signal received",
  and append it to the body.

starterCode: |
  // Create a <p> element
  const paragraph = ;

  // Set its text content to "Signal received"


  // Append it to document.body


solution: |
  const paragraph = document.createElement('p');
  paragraph.textContent = "Signal received";
  document.body.appendChild(paragraph);

tests:
  - description: "A <p> element should exist in the body"
    testCode: "const p = document.querySelector('p'); if (!p) throw new Error('No <p> found in body');"
  - description: "The paragraph should contain 'Signal received'"
    testCode: "const p = document.querySelector('p'); if (p.textContent !== 'Signal received') throw new Error(`Text should be 'Signal received', got '${p.textContent}'`);"

hints:
  - "document.createElement('p') creates a new <p> element"
  - "element.textContent = 'text' sets the text"
  - "document.body.appendChild(element) adds it to the page"
```

### D06-C03: Missing Connection (debug)
```
concepts: ["DOM", "getElementById", "innerHTML-vs-textContent"]
difficulty: steady
xpReward: 25

instructions: |
  This code should update the display element to show the new status,
  but nothing appears. Fix it. (The HTML has a div with id="display".)

starterCode: |
  // HTML: <div id="display">Waiting...</div>
  const display = document.getElementByld('display');
  display.textContent = "Active";

solution: |
  const display = document.getElementById('display');
  display.textContent = "Active";

tests:
  - description: "Display should show 'Active'"
    testCode: "const el = document.getElementById('display'); if (!el || el.textContent !== 'Active') throw new Error('Display should show Active');"

hints:
  - "Look at the method name very carefully — letter by letter"
  - "Is it 'getElementByld' or 'getElementById'? Check the capital I and lowercase L"
  - "JavaScript method names are case-sensitive"

explainGate:
  prompt: "What was the typo and why is it easy to miss?"
  keywords: ["Id", "ld", "case", "typo"]
  minLength: 20
```

### D06-C04: Style and Modify (complete)
```
concepts: ["DOM", "style", "classList", "setAttribute"]
difficulty: steady
xpReward: 20

instructions: |
  Given a div with id="panel", do the following:
  1. Change its background color to "#1E1B35"
  2. Add the CSS class "active" to it
  3. Set a custom data attribute: data-status="online"

starterCode: |
  // HTML: <div id="panel" class="drift-panel">Content</div>
  const panel = document.getElementById('panel');

  // 1. Change background color


  // 2. Add the 'active' class


  // 3. Set data-status to "online"


solution: |
  const panel = document.getElementById('panel');
  panel.style.backgroundColor = "#1E1B35";
  panel.classList.add("active");
  panel.setAttribute("data-status", "online");

tests:
  - description: "Background color should be set"
    testCode: "const p = document.getElementById('panel'); if (!p.style.backgroundColor) throw new Error('Background not set');"
  - description: "Panel should have 'active' class"
    testCode: "const p = document.getElementById('panel'); if (!p.classList.contains('active')) throw new Error('Missing active class');"
  - description: "data-status should be 'online'"
    testCode: "const p = document.getElementById('panel'); if (p.getAttribute('data-status') !== 'online') throw new Error('data-status not set');"

hints:
  - "element.style.backgroundColor = 'color' sets inline style"
  - "element.classList.add('className') adds a CSS class"
  - "element.setAttribute('name', 'value') sets any attribute"
```

### D06-C05: Interactive Element (build)
```
concepts: ["DOM", "events", "addEventListener", "full-build"]
difficulty: demanding
xpReward: 30

instructions: |
  Build a click counter from scratch:
  1. Create a button element with text "Click me"
  2. Create a paragraph element with text "Clicks: 0"
  3. Append both to document.body
  4. When the button is clicked, increment the counter and update the paragraph text

starterCode: |
  // Build everything from scratch
  let clickCount = 0;


solution: |
  let clickCount = 0;

  const button = document.createElement('button');
  button.textContent = "Click me";

  const display = document.createElement('p');
  display.textContent = "Clicks: 0";
  display.id = "click-display";

  button.addEventListener('click', () => {
    clickCount++;
    display.textContent = `Clicks: ${clickCount}`;
  });

  document.body.appendChild(button);
  document.body.appendChild(display);

tests:
  - description: "A button should exist with text 'Click me'"
    testCode: "const btn = document.querySelector('button'); if (!btn || btn.textContent !== 'Click me') throw new Error('Button missing or wrong text');"
  - description: "A paragraph should show 'Clicks: 0' initially"
    testCode: "const p = document.querySelector('p'); if (!p || !p.textContent.includes('Clicks: 0')) throw new Error('Display missing or wrong initial text');"
  - description: "Clicking the button should increment the counter"
    testCode: "const btn = document.querySelector('button'); btn.click(); const p = document.querySelector('p'); if (!p.textContent.includes('1')) throw new Error('Counter did not increment');"
  - description: "Multiple clicks should increment correctly"
    testCode: "const btn = document.querySelector('button'); btn.click(); btn.click(); const p = document.querySelector('p'); if (!p.textContent.includes('3')) throw new Error('Multiple clicks not working');"

hints:
  - "document.createElement creates elements, .appendChild adds them"
  - "button.addEventListener('click', function) listens for clicks"
  - "Use template literals: `Clicks: ${count}` to update the text"

explainGate:
  prompt: "How does addEventListener connect user interaction to code execution?"
  keywords: ["event", "callback", "click", "function"]
  minLength: 30
```

---

## Day 7: BOSS BATTLE — First Light

```
type: build
difficulty: boss
timeLimitMinutes: 45
xpReward: 100
concepts: ["variables", "arrays", "objects", "functions", "DOM", "events", "conditionals", "loops"]

title: "First Light"

instructions: |
  Build a "Crew Log" interactive page from scratch.

  Requirements:
  1. An array of crew member objects, each with: name, role, status ("active" or "inactive")
     Include at least 3 crew members.

  2. A function `renderCrewList()` that:
     - Clears the crew list container
     - Creates a DOM element for each crew member showing their name, role, and status
     - Active members should have a green-tinted background
     - Inactive members should have a red-tinted background

  3. A button "Add Crew Member" that, when clicked:
     - Prompts for a name (use prompt())
     - Adds a new crew member object with that name, role "recruit", status "active"
     - Re-renders the list

  4. Each crew member element should have a "Toggle Status" button that
     switches their status between "active" and "inactive" and re-renders

  Start with the provided HTML structure.

starterCode: |
  // HTML is provided: <div id="app"></div>
  // Build everything in JavaScript

  // Your crew data


  // Your renderCrewList function


  // Your add crew button logic


  // Initial render


solution: |
  const crew = [
    { name: "Grace", role: "scientist", status: "active" },
    { name: "Ilyukhina", role: "commander", status: "active" },
    { name: "Shapiro", role: "engineer", status: "inactive" }
  ];

  function renderCrewList() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    const title = document.createElement('h1');
    title.textContent = 'Crew Log';
    app.appendChild(title);

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add Crew Member';
    addBtn.addEventListener('click', () => {
      const name = prompt('Enter crew member name:');
      if (name) {
        crew.push({ name, role: 'recruit', status: 'active' });
        renderCrewList();
      }
    });
    app.appendChild(addBtn);

    const list = document.createElement('div');
    crew.forEach((member, index) => {
      const card = document.createElement('div');
      card.style.padding = '10px';
      card.style.margin = '5px 0';
      card.style.backgroundColor = member.status === 'active' ? '#1a3a1a' : '#3a1a1a';

      card.innerHTML = `<strong>${member.name}</strong> — ${member.role} (${member.status})`;

      const toggleBtn = document.createElement('button');
      toggleBtn.textContent = 'Toggle Status';
      toggleBtn.style.marginLeft = '10px';
      toggleBtn.addEventListener('click', () => {
        member.status = member.status === 'active' ? 'inactive' : 'active';
        renderCrewList();
      });
      card.appendChild(toggleBtn);
      list.appendChild(card);
    });
    app.appendChild(list);
  }

  renderCrewList();

tests:
  - description: "Page should show at least 3 crew members"
    testCode: "const cards = document.querySelectorAll('#app div div'); if (cards.length < 3) throw new Error('Need at least 3 crew members');"
  - description: "Each crew member should show a name"
    testCode: "const app = document.getElementById('app'); if (!app.textContent.includes('Grace') && !app.textContent.match(/[A-Z][a-z]+/)) throw new Error('Crew names not visible');"
  - description: "Toggle buttons should exist for each crew member"
    testCode: "const toggleBtns = [...document.querySelectorAll('button')].filter(b => b.textContent.includes('Toggle')); if (toggleBtns.length < 3) throw new Error('Need Toggle Status buttons for each member');"
  - description: "An 'Add Crew Member' button should exist"
    testCode: "const addBtn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Add')); if (!addBtn) throw new Error('Add Crew Member button not found');"
  - description: "Toggling should change the displayed status"
    testCode: "const toggleBtns = [...document.querySelectorAll('button')].filter(b => b.textContent.includes('Toggle')); if (toggleBtns.length > 0) { toggleBtns[0].click(); } const app = document.getElementById('app'); if (!app.textContent.includes('inactive') && !app.textContent.includes('active')) throw new Error('Toggle should change status');"

hints:
  - "Start with the data: an array of objects"
  - "Write renderCrewList() to loop through the array and create DOM elements"
  - "For toggle: change the object's status, then call renderCrewList() again"
  - "Use addEventListener for all button clicks"
```

---

# WEEK 2: Advanced JS (Days 8-13)

*Note: Challenges follow the same format. Providing key challenges per day for brevity. Full bank should have 4-5 per day.*

---

## Day 8: Timing — Callbacks & setTimeout

### D08-C01: Timing Order (predict)
```
concepts: ["setTimeout", "event-loop", "execution-order"]
difficulty: steady
xpReward: 15

starterCode: |
  console.log("A");
  setTimeout(() => console.log("B"), 0);
  console.log("C");

predictPrompt: "What order will the letters be logged?"
predictChoices: ["A, B, C", "A, C, B", "B, A, C", "C, A, B"]
predictAnswer: "A, C, B"

hints:
  - "setTimeout always defers execution, even with 0ms delay"
  - "Synchronous code runs first, then the event loop processes timers"

explainGate:
  prompt: "Why does B print last even though the timeout is 0ms?"
  keywords: ["event loop", "synchronous", "queue", "defer"]
  minLength: 30
```

### D08-C02: Wire the Callback (complete)
```
concepts: ["callbacks", "setTimeout", "asynchronous"]
difficulty: steady
xpReward: 20

instructions: |
  Write a function `delayedGreet` that takes a name and a callback.
  After 1 second, it should call the callback with the string "Hello, [name]".

starterCode: |
  function delayedGreet(name, callback) {
    // Your code here
  }

  // Test usage (don't modify):
  let result = "";
  delayedGreet("Grace", (message) => {
    result = message;
  });

solution: |
  function delayedGreet(name, callback) {
    setTimeout(() => {
      callback("Hello, " + name);
    }, 1000);
  }

  let result = "";
  delayedGreet("Grace", (message) => {
    result = message;
  });

tests:
  - description: "result should be empty immediately (async hasn't completed)"
    testCode: "if (result !== '') throw new Error('Result should be empty before timeout');"
  - description: "After delay, result should be 'Hello, Grace'"
    testCode: "await new Promise(r => setTimeout(r, 1100)); if (result !== 'Hello, Grace') throw new Error(`Expected 'Hello, Grace', got '${result}'`);"

hints:
  - "Use setTimeout to delay the callback execution"
  - "Inside setTimeout, call callback('Hello, ' + name)"
```

### D08-C03: Callback Timing Bug (debug)
```
concepts: ["callbacks", "asynchronous", "execution-order"]
difficulty: steady
xpReward: 25

instructions: |
  This code should log "Data loaded" AFTER the data is ready,
  but it logs it before the data arrives. Fix the order.

starterCode: |
  function loadData(callback) {
    setTimeout(() => {
      const data = { status: "ready" };
      callback(data);
    }, 500);
  }

  let loaded = false;
  console.log("Starting load...");
  loadData((data) => {
    loaded = true;
  });
  console.log("Loaded: " + loaded);

solution: |
  function loadData(callback) {
    setTimeout(() => {
      const data = { status: "ready" };
      callback(data);
    }, 500);
  }

  let loaded = false;
  console.log("Starting load...");
  loadData((data) => {
    loaded = true;
    console.log("Loaded: " + loaded);
  });

tests:
  - description: "The 'Loaded: true' log should only happen after data is ready"
    testCode: "await new Promise(r => setTimeout(r, 600)); if (!loaded) throw new Error('loaded should be true after callback');"

hints:
  - "The console.log runs synchronously, before the callback fires"
  - "Move the log INSIDE the callback where loaded becomes true"

explainGate:
  prompt: "Why did the original code log 'Loaded: false'?"
  keywords: ["synchronous", "before", "callback", "async"]
  minLength: 25
```

---

## Day 9: Promises

### D09-C01: Then Value (predict)
```
concepts: ["promises", "then", "resolve"]
difficulty: steady
xpReward: 15

starterCode: |
  const promise = new Promise((resolve) => {
    resolve(42);
  });

  promise.then((value) => {
    console.log(value * 2);
  });

predictPrompt: "What will be logged?"
predictChoices: ["42", "84", "undefined", "Promise { 42 }"]
predictAnswer: "84"

hints:
  - ".then() receives the resolved value"
  - "resolve(42) means the value 42 is passed to .then()"
```

### D09-C02: Build a Promise (complete)
```
concepts: ["promises", "resolve", "reject", "constructor"]
difficulty: steady
xpReward: 20

instructions: |
  Write a function `checkSensor` that returns a Promise.
  - If the reading is above 50, resolve with "nominal"
  - If 50 or below, reject with "below threshold"

starterCode: |
  function checkSensor(reading) {
    return new Promise((resolve, reject) => {
      // Your code here
    });
  }

solution: |
  function checkSensor(reading) {
    return new Promise((resolve, reject) => {
      if (reading > 50) {
        resolve("nominal");
      } else {
        reject("below threshold");
      }
    });
  }

tests:
  - description: "Reading 80 should resolve with 'nominal'"
    testCode: "const result = await checkSensor(80); if (result !== 'nominal') throw new Error('Should resolve with nominal');"
  - description: "Reading 30 should reject with 'below threshold'"
    testCode: "try { await checkSensor(30); throw new Error('Should have rejected'); } catch(e) { if (e !== 'below threshold') throw new Error('Should reject with below threshold'); }"
  - description: "Reading 50 should reject (not above 50)"
    testCode: "try { await checkSensor(50); throw new Error('Should have rejected'); } catch(e) { if (e !== 'below threshold') throw new Error('Should reject for 50'); }"

hints:
  - "Use the if condition to decide between resolve and reject"
  - "resolve('nominal') for good readings, reject('below threshold') for bad"
```

### D09-C03: Unhandled Rejection (debug)
```
concepts: ["promises", "catch", "error-handling"]
difficulty: steady
xpReward: 25

instructions: |
  This code fetches data but crashes when the promise rejects.
  Add proper error handling so it sets `error` to the rejection message
  instead of crashing.

starterCode: |
  let result = null;
  let error = null;

  const dataPromise = new Promise((resolve, reject) => {
    reject("Connection failed");
  });

  dataPromise.then((data) => {
    result = data;
  });

solution: |
  let result = null;
  let error = null;

  const dataPromise = new Promise((resolve, reject) => {
    reject("Connection failed");
  });

  dataPromise
    .then((data) => {
      result = data;
    })
    .catch((err) => {
      error = err;
    });

tests:
  - description: "error should be 'Connection failed'"
    testCode: "await new Promise(r => setTimeout(r, 10)); if (error !== 'Connection failed') throw new Error(`error should be 'Connection failed', got '${error}'`);"
  - description: "result should remain null"
    testCode: "if (result !== null) throw new Error('result should be null when promise rejects');"

hints:
  - "Add .catch() after .then() to handle rejections"
  - ".catch(err => { ... }) receives the rejection value"

explainGate:
  prompt: "What happens to rejected promises that have no .catch()?"
  keywords: ["unhandled", "error", "crash", "catch"]
  minLength: 25
```

---

## Day 10: Async/Await

### D10-C01: Await Result (predict)
```
concepts: ["async-await", "promises", "execution-order"]
difficulty: steady
xpReward: 15

starterCode: |
  async function getData() {
    const value = await Promise.resolve("ready");
    return value;
  }

  getData().then(result => console.log(result));

predictPrompt: "What will be logged?"
predictChoices: ["\"ready\"", "Promise { 'ready' }", "undefined", "Error"]
predictAnswer: "\"ready\""
```

### D10-C02: Rewrite as Async (complete)
```
concepts: ["async-await", "promise-chain-to-async"]
difficulty: steady
xpReward: 20

instructions: |
  Rewrite the promise chain below using async/await.
  The behavior should be identical.

starterCode: |
  // Original (for reference, don't modify):
  // fetchUser(1)
  //   .then(user => fetchPosts(user.id))
  //   .then(posts => console.log(posts.length))
  //   .catch(err => console.log("Error:", err));

  // Simulated APIs (don't modify)
  function fetchUser(id) {
    return Promise.resolve({ id, name: "Grace" });
  }
  function fetchPosts(userId) {
    return Promise.resolve([{ title: "Post 1" }, { title: "Post 2" }]);
  }

  // Rewrite as async function:
  async function loadUserPosts() {
    // Your code here
  }

solution: |
  function fetchUser(id) {
    return Promise.resolve({ id, name: "Grace" });
  }
  function fetchPosts(userId) {
    return Promise.resolve([{ title: "Post 1" }, { title: "Post 2" }]);
  }

  async function loadUserPosts() {
    try {
      const user = await fetchUser(1);
      const posts = await fetchPosts(user.id);
      return posts.length;
    } catch (err) {
      return "Error: " + err;
    }
  }

tests:
  - description: "Should return 2 (number of posts)"
    testCode: "const result = await loadUserPosts(); if (result !== 2) throw new Error(`Expected 2, got ${result}`);"
  - description: "loadUserPosts should be an async function"
    testCode: "if (loadUserPosts.constructor.name !== 'AsyncFunction') throw new Error('Should be async');"

hints:
  - "Put 'async' before the function keyword"
  - "Use 'const user = await fetchUser(1)' instead of .then()"
  - "Wrap in try/catch instead of .catch()"
```

---

## Days 11-13: ES6+, Modules/TypeScript, Boss Battle

*[Following the same pattern with 4-5 challenges each, covering:]*

**Day 11 challenges cover:**
- Destructuring (predict, complete)
- Spread operator (complete, refactor)
- Arrow functions and `this` (debug)
- Template literals (complete)

**Day 12 challenges cover:**
- Import/export (complete)
- Default vs named exports (predict)
- TypeScript basic types (complete)
- Interfaces (complete, debug)

**Day 13 Boss Battle:**
- Debug a multi-file async data pipeline with TypeScript types
- 45-minute time limit
- Tests verify the full pipeline works end-to-end

---

# WEEK 3: Angular Core (Days 14-20)

*Angular challenges use StackBlitz WebContainers. The starterCode is a full Angular project snapshot.*

---

## Day 14: Components

### D14-C01: Component Output (predict)
```
concepts: ["angular-components", "interpolation", "template"]
difficulty: steady
xpReward: 15

instructions: |
  Given this Angular component, predict what will render.

starterCode: |
  // status.component.ts
  @Component({
    selector: 'app-status',
    standalone: true,
    template: `<p>Status: {{ status }}</p>`
  })
  export class StatusComponent {
    status = 'Online';
  }

  // app.component.ts uses: <app-status />

predictPrompt: "What will appear on the page?"
predictChoices:
  - "Status: {{ status }}"
  - "Status: Online"
  - "Status: undefined"
  - "Nothing (component not rendered)"
predictAnswer: "Status: Online"

hints:
  - "{{ }} is Angular's interpolation syntax — it renders the expression's value"
  - "status is a class property with value 'Online'"
```

### D14-C02: Create a Component (complete)
```
concepts: ["angular-components", "decorator", "template", "class"]
difficulty: steady
xpReward: 20

instructions: |
  Create a CounterComponent that:
  1. Displays a count (starting at 0)
  2. Has an increment button that adds 1
  3. Has a decrement button that subtracts 1

starterCode: |
  // counter.component.ts
  import { Component } from '@angular/core';

  @Component({
    selector: 'app-counter',
    standalone: true,
    template: `
      <!-- Your template here -->
    `
  })
  export class CounterComponent {
    // Your code here
  }

solution: |
  import { Component } from '@angular/core';

  @Component({
    selector: 'app-counter',
    standalone: true,
    template: `
      <p>Count: {{ count }}</p>
      <button (click)="decrement()">-</button>
      <button (click)="increment()">+</button>
    `
  })
  export class CounterComponent {
    count = 0;

    increment() {
      this.count++;
    }

    decrement() {
      this.count--;
    }
  }

tests:
  - description: "Should display initial count of 0"
    testCode: "expect(fixture.nativeElement.textContent).toContain('0');"
  - description: "Clicking + should increment the count"
    testCode: "const buttons = fixture.nativeElement.querySelectorAll('button'); const plusBtn = [...buttons].find(b => b.textContent.includes('+')); plusBtn.click(); fixture.detectChanges(); expect(fixture.nativeElement.textContent).toContain('1');"
  - description: "Clicking - should decrement the count"
    testCode: "const buttons = fixture.nativeElement.querySelectorAll('button'); const minusBtn = [...buttons].find(b => b.textContent.includes('-')); minusBtn.click(); fixture.detectChanges(); expect(fixture.nativeElement.textContent).toContain('-1');"

hints:
  - "Use {{ count }} to display the value"
  - "(click)=\"methodName()\" binds a click event in Angular"
  - "Define count as a class property, methods to modify it"
```

---

## Days 15-20: Templates, Services, Routing, HTTP, Composition, Boss Battle

*[Following the same pattern. Each day has 4-5 challenges covering:]*

**Day 15:** `*ngFor`, `*ngIf`, property binding, event binding, pipes
**Day 16:** Services, `@Injectable`, dependency injection, `providedIn: 'root'`
**Day 17:** RouterModule, routes, routerLink, activated route params, guards
**Day 18:** HttpClient, `subscribe()`, async pipe, error handling, loading states
**Day 19:** Parent-child communication, combined features, search with debounce
**Day 20 Boss:** Build a multi-page Angular app with routing, services, and HTTP

---

# WEEK 4: Angular Advanced (Days 21-26)

## Days 21-25: Forms, RxJS, Real Patterns, Integration, Review

*[Each day: 4-5 challenges following the established format]*

**Day 21:** Reactive forms, FormGroup, FormControl, validators, error display
**Day 22:** Observable, Subject, pipe operators (map, filter, switchMap), unsubscribe
**Day 23:** Smart/dumb components, interceptors, resolvers, container pattern
**Day 24:** Full CRUD, race conditions, reactive search, OnDestroy cleanup
**Day 25:** Cross-week synthesis challenges revisiting JS through Angular lens

---

## Day 26: FINAL BOSS — Resonance

```
type: build
difficulty: boss
timeLimitMinutes: 90
xpReward: 200
concepts: ["all"]

title: "Resonance"

instructions: |
  Build a complete Angular application that:

  1. Fetches data from a public API
     (suggested: https://jsonplaceholder.typicode.com)

  2. Displays a list of items (e.g., posts or users) on the main page

  3. Each item links to a detail page (using routing with parameters)

  4. The detail page shows full item information

  5. Includes a search/filter feature on the list page
     (filter as you type, using reactive patterns)

  6. Has a service layer for all HTTP calls

  7. Shows loading states and handles errors gracefully

  8. Uses proper Angular architecture:
     - Standalone components
     - At least one shared service
     - Reactive forms or RxJS for the search
     - Clean component separation

  Structure:
  - app.component (shell with router-outlet)
  - list.component (fetches and displays items)
  - detail.component (shows single item)
  - data.service (handles HTTP)
  - search (reactive filtering)

  You have 90 minutes. Build something you're proud of.

tests:
  - description: "App should render without errors"
    testCode: "expect(document.querySelector('app-root')).toBeTruthy();"
  - description: "List page should display items from the API"
    testCode: "await fixture.whenStable(); expect(document.querySelectorAll('[data-item]').length).toBeGreaterThan(0);"
  - description: "Clicking an item should navigate to detail page"
    testCode: "const items = document.querySelectorAll('[data-item]'); if (items.length) items[0].click(); await fixture.whenStable(); expect(location.pathname).toMatch(/\\/detail\\/\\d+/);"
  - description: "Detail page should show item information"
    testCode: "expect(document.querySelector('[data-detail]')).toBeTruthy();"
  - description: "Search input should exist"
    testCode: "expect(document.querySelector('input[type=text], input[type=search]')).toBeTruthy();"
  - description: "A data service should be injectable"
    testCode: "expect(TestBed.inject(DataService)).toBeTruthy();"

hints:
  - "Start with the service — get the HTTP calls working first"
  - "Then build the list component that uses the service"
  - "Add routing between list and detail"
  - "Add search last — it's the polish"
```

---

## Challenge Count Summary

| Day | Challenges | Type Distribution |
|-----|-----------|-------------------|
| 1 | 5 | 2 predict, 2 complete, 1 debug |
| 2 | 5 | 1 predict, 2 complete, 1 debug, 1 refactor |
| 3 | 5 | 1 predict, 2 complete, 1 debug, 1 build |
| 4 | 5 | 1 predict, 2 complete, 1 debug, 1 refactor |
| 5 | 5 | 1 predict, 2 complete, 1 debug, 1 refactor |
| 6 | 5 | 1 predict, 2 complete, 1 debug, 1 build |
| 7 | 1 | Boss battle (build) |
| 8 | 4 | 1 predict, 1 complete, 1 debug, 1 complete |
| 9 | 4 | 1 predict, 1 complete, 1 debug, 1 refactor |
| 10 | 4 | 1 predict, 2 complete, 1 refactor |
| 11 | 4 | 1 predict, 1 complete, 1 debug, 1 refactor |
| 12 | 4 | 1 predict, 2 complete, 1 debug |
| 13 | 1 | Boss battle (debug/build) |
| 14 | 5 | 1 predict, 3 complete, 1 debug |
| 15 | 5 | 1 predict, 2 complete, 1 debug, 1 refactor |
| 16 | 5 | 2 complete, 1 debug, 1 predict, 1 refactor |
| 17 | 5 | 2 complete, 1 debug, 1 predict, 1 complete |
| 18 | 5 | 2 complete, 1 debug, 1 predict, 1 complete |
| 19 | 5 | 2 complete, 1 debug, 1 refactor, 1 build |
| 20 | 1 | Boss battle (build) |
| 21 | 5 | 2 complete, 1 debug, 1 predict, 1 refactor |
| 22 | 5 | 1 predict, 2 complete, 1 debug, 1 refactor |
| 23 | 5 | 2 complete, 1 debug, 1 predict, 1 refactor |
| 24 | 5 | 2 complete, 1 debug, 1 refactor, 1 build |
| 25 | 5 | 1 debug, 1 complete, 1 predict, 1 refactor, 1 complete |
| 26 | 1 | Final boss battle (build) |

**Total: ~118 challenges fully specified + remaining days to fill = ~150 target**

*Note: Days 11-12, 15-19, 21-25 need their full challenge sets written out in the same format as Days 1-10. The patterns, difficulty curves, and concept coverage are established above. Your friend (or AI) can generate the remaining challenges following this exact format.*

---

## JSON Export Format

Each day's challenges export as:

```json
{
  "dayNumber": 1,
  "challenges": [
    {
      "id": "d01-c01",
      "dayNumber": 1,
      "order": 1,
      "type": "predict",
      "difficulty": "gentle",
      "concepts": ["typeof", "primitive-types"],
      "week": 1,
      "title": "The First Signal",
      "narrativeHook": "A symbol pulses faintly on the nearest surface. What does it represent?",
      "instructions": "Read the code below carefully...",
      "starterCode": "let signal = 42;\nlet result = typeof signal;\nconsole.log(result);",
      "predictPrompt": "What will be logged to the console?",
      "predictChoices": ["42", "\"number\"", "\"string\"", "undefined"],
      "predictAnswer": "\"number\"",
      "tests": [],
      "hints": ["typeof returns a string describing the type of a value"],
      "explainGate": {
        "prompt": "What does the typeof operator return, and why is it a string?",
        "keywords": ["string", "type", "describes"],
        "minLength": 30
      },
      "xpReward": 15,
      "bonusXp": {
        "noHints": 5,
        "firstTry": 10,
        "speedBonus": 5,
        "speedThresholdMs": 60000
      }
    }
  ]
}
```

---

## Generation Notes for Remaining Challenges

For the days not fully written out (11-12, 15-19, 21-25), the remaining challenges should follow these rules:

1. **Difficulty curve within each day:** First challenge is the easiest (predict or gentle complete), last is the hardest (build or demanding refactor)
2. **Concept dependency:** Each challenge within a day builds on the previous -- you can use concepts from earlier challenges in the same day
3. **Narrative hooks:** Always tie back to The Drift's story for that day
4. **Test count:** 3-5 tests per challenge, covering normal cases and edge cases
5. **Hint count:** 2-3 hints per challenge, progressively more specific
6. **Explain gates:** On ~60% of challenges (skip for very simple ones)
7. **Code length:** Starter code should be 5-25 lines. Solutions 5-30 lines. Boss battles can be longer.
8. **No trick questions:** Challenges test understanding, not obscure gotchas
