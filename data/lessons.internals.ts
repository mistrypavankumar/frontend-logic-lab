import { Lesson } from "@/lib/types";

// Advanced JS internals — the mental models that explain "why did this happen".
// Mostly conceptual; the few sync-checkable ones (closures, immutable update)
// are auto-graded.
export const internalsLessons: Lesson[] = [
  {
    id: "in-event-loop",
    slug: "event-loop",
    title: "The Event Loop, Microtasks & Macrotasks",
    category: "JavaScript Internals",
    difficulty: "Advanced",
    order: 201,
    estimatedMinutes: 11,
    relatedMethods: ["queueMicrotask", "Promise", "setTimeout"],
    summary:
      "JavaScript runs on one thread. The event loop runs all synchronous code, then drains the microtask queue (Promises), then takes one macrotask (timers, events), and repeats.",
    realLifeExample:
      "A receptionist (the loop) finishes the person at the desk (sync), clears every sticky note left on the desk (microtasks), then calls the next person from the waiting room (one macrotask).",
    codeExample: {
      language: "ts",
      code: `console.log('1');
setTimeout(() => console.log('4'), 0);      // macrotask
Promise.resolve().then(() => console.log('3')); // microtask
console.log('2');
// Order: 1, 2, 3, 4`,
    },
    visualization: {
      language: "ts",
      code: `console.log('1');
setTimeout(() => console.log('4'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('2');`,
      lanes: ["Call stack", "Microtasks", "Macrotasks (timers)", "Console"],
      frames: [
        {
          line: 1,
          note: "Run the synchronous line. console.log('1') executes immediately.",
          lanes: { "Call stack": ["console.log('1')"], Microtasks: [], "Macrotasks (timers)": [], Console: ["1"] },
        },
        {
          line: 2,
          note: "setTimeout doesn't run now — it hands its callback to the timer queue (a macrotask) and returns.",
          lanes: { "Call stack": ["setTimeout(…)"], Microtasks: [], "Macrotasks (timers)": ["() => log '4'"], Console: ["1"] },
        },
        {
          line: 3,
          note: "Promise.then schedules its callback on the microtask queue. Still nothing logged.",
          lanes: { "Call stack": [".then(…)"], Microtasks: ["() => log '3'"], "Macrotasks (timers)": ["() => log '4'"], Console: ["1"] },
        },
        {
          line: 4,
          note: "Run the next synchronous line. console.log('2') executes immediately.",
          lanes: { "Call stack": ["console.log('2')"], Microtasks: ["() => log '3'"], "Macrotasks (timers)": ["() => log '4'"], Console: ["1", "2"] },
        },
        {
          note: "Synchronous code is done and the call stack is empty. The event loop now drains ALL microtasks before touching any macrotask.",
          lanes: { "Call stack": [], Microtasks: ["() => log '3'"], "Macrotasks (timers)": ["() => log '4'"], Console: ["1", "2"] },
        },
        {
          note: "Microtask runs: console.log('3'). The microtask queue is now empty.",
          lanes: { "Call stack": ["() => log '3'"], Microtasks: [], "Macrotasks (timers)": ["() => log '4'"], Console: ["1", "2", "3"] },
        },
        {
          note: "Microtasks are empty, so the loop takes ONE macrotask: the timer callback runs, logging '4'.",
          lanes: { "Call stack": ["() => log '4'"], Microtasks: [], "Macrotasks (timers)": [], Console: ["1", "2", "3", "4"] },
        },
        {
          note: "Done. Final order: 1, 2, 3, 4 — the Promise (microtask) always beats setTimeout(0) (macrotask), even though both are 'async'.",
          lanes: { "Call stack": [], Microtasks: [], "Macrotasks (timers)": [], Console: ["1", "2", "3", "4"] },
        },
      ],
    },
    practiceTask:
      "Predict the console order, then explain WHY the Promise logs before the setTimeout even though both are 'async'.",
    practiceStarter: `// Predict the output order in comments:
console.log('A');
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));
console.log('B');
// Your prediction: ?`,
    hint: "Sync code first. Then ALL microtasks (Promise callbacks). Then macrotasks (timers).",
    solution: {
      language: "ts",
      code: `// Output: A, B, promise, timeout
// 1) sync: A, B
// 2) microtasks drain fully: promise
// 3) one macrotask: timeout`,
    },
    explanation:
      "The microtask queue is fully emptied between each macrotask, so Promise callbacks always beat setTimeout(0). This explains most ordering surprises.",
    deepDive: {
      problemSolved: "Understanding execution order of sync code, Promises, and timers — the root of countless async bugs.",
      realWorldUseCase: "Why a state update 'lands' before a timer, or why awaiting flushes differently than setTimeout.",
      edgeCases: [
        "A microtask scheduling more microtasks can starve timers (UI freeze)",
        "await is sugar over .then — its continuation is a microtask",
        "requestAnimationFrame runs before paint, separate from these queues",
      ],
      timeComplexity: "—",
      spaceComplexity: "—",
      browserSupport: "Conceptual — applies to every JS runtime.",
      industrialNotes: ["When the UI 'jank's, suspect long sync tasks or microtask floods blocking the loop."],
      commonMistakes: ["Believing setTimeout(0) runs immediately or before Promises."],
    },
  },
  {
    id: "in-closures",
    slug: "closures",
    title: "Closures",
    category: "JavaScript Internals",
    difficulty: "Intermediate",
    order: 202,
    estimatedMinutes: 9,
    relatedMethods: [],
    summary:
      "A closure is a function that 'remembers' the variables from where it was created, even after that outer function has returned. It's how functions keep private state.",
    realLifeExample:
      "A vending machine keeps its own coin count inside — you can press buttons (call the function) but can't reach in and change the count directly.",
    codeExample: {
      language: "ts",
      code: `function makeCounter() {
  let count = 0;            // private
  return () => ++count;     // closes over count
}
const next = makeCounter();
next(); next(); // 1, 2`,
    },
    visualization: {
      language: "ts",
      code: `function makeCounter() {
  let count = 0;
  return () => ++count;
}
const next = makeCounter();
next(); next();`,
      lanes: ["Call stack", "Closure scope", "Output"],
      frames: [
        {
          line: 5,
          note: "Call makeCounter(). A new call frame is pushed onto the stack.",
          lanes: { "Call stack": ["makeCounter()"], "Closure scope": [], Output: [] },
        },
        {
          line: 2,
          note: "Inside makeCounter, a private variable `count` is created and set to 0.",
          lanes: { "Call stack": ["makeCounter()"], "Closure scope": ["count: 0"], Output: [] },
        },
        {
          line: 3,
          note: "makeCounter returns an arrow function. That arrow 'closes over' count — it keeps a live link to it.",
          lanes: { "Call stack": ["makeCounter()"], "Closure scope": ["count: 0"], Output: [] },
        },
        {
          line: 5,
          note: "makeCounter's frame pops off the stack — but `count` is NOT garbage-collected, because the returned function (now `next`) still references it.",
          lanes: { "Call stack": [], "Closure scope": ["count: 0 (kept alive by next)"], Output: [] },
        },
        {
          line: 6,
          note: "First next() call: the arrow runs, ++count makes count 1, and returns 1.",
          lanes: { "Call stack": ["next() ⇒ ++count"], "Closure scope": ["count: 1"], Output: ["1"] },
        },
        {
          line: 6,
          note: "Second next() call: the SAME closed-over count persists, so ++count makes it 2.",
          lanes: { "Call stack": ["next() ⇒ ++count"], "Closure scope": ["count: 2"], Output: ["1", "2"] },
        },
        {
          note: "That's a closure: count lives on between calls, private and shared only with the function that closed over it. It's how functions keep state without globals.",
          lanes: { "Call stack": [], "Closure scope": ["count: 2"], Output: ["1", "2"] },
        },
      ],
    },
    practiceTask:
      "Implement makeCounter() returning a function that increments and returns a private count each call.",
    practiceStarter: `function makeCounter() {
  // keep a private count, return a function that increments + returns it
}`,
    practiceTests: [
      { name: "counts up", kind: "normal", call: "(()=>{const c=makeCounter();c();c();return c();})()", expected: 3 },
      { name: "instances are independent", kind: "normal", call: "(()=>{const a=makeCounter();const b=makeCounter();a();a();return b();})()", expected: 1 },
    ],
    hint: "Declare `let count = 0` inside, then return a function that does count++ / ++count.",
    solution: {
      language: "ts",
      code: `function makeCounter() {
  let count = 0;
  return function () {
    count += 1;
    return count;
  };
}`,
    },
    explanation:
      "Each makeCounter() call creates a fresh `count` that only its returned function can see — independent, private state via closure.",
    deepDive: {
      problemSolved: "Private state, data hiding, and 'remembering' values between calls without globals or classes.",
      realWorldUseCase: "Debounce/throttle timers, once()-style guards, custom hooks, module-private caches.",
      builtInSolution: { language: "ts", code: "// Closures are a language feature, not a method." },
      internalImplementation: {
        language: "ts",
        code: `function once(fn) {
  let called = false, result;            // closed-over state
  return (...args) => {
    if (!called) { called = true; result = fn(...args); }
    return result;
  };
}`,
      },
      edgeCases: [
        "Closures in a loop with var capture the SAME variable — use let (block-scoped) per iteration",
        "Long-lived closures holding big objects can leak memory",
        "Each closure instance has its own captured environment",
      ],
      timeComplexity: "O(1) access",
      spaceComplexity: "O(1) per captured variable (held as long as the closure lives)",
      browserSupport: "Universal.",
      whenNotToUse: "When module/class state is clearer — don't over-nest functions just to hide a variable.",
      industrialNotes: ["The classic var-in-loop bug is now solved by let; know why it happened."],
      commonMistakes: ["var in loops capturing the final value.", "Leaking memory via closures that outlive their need."],
    },
  },
  {
    id: "in-this",
    slug: "this-binding",
    title: "`this` Binding",
    category: "JavaScript Internals",
    difficulty: "Advanced",
    order: 203,
    estimatedMinutes: 10,
    summary:
      "`this` is decided by HOW a function is called, not where it's defined. Method call → the object; plain call → undefined (strict); arrow function → inherits `this` from its surroundings.",
    realLifeExample:
      "'this' is like the word 'here' — its meaning depends entirely on where you're standing when you say it, not on the map.",
    codeExample: {
      language: "ts",
      code: `const user = {
  name: 'Ana',
  greet() { return 'Hi ' + this.name; }, // method call → this = user
};
user.greet();           // "Hi Ana"
const g = user.greet;
g();                    // this is undefined → error/NaN`,
    },
    visualization: {
      language: "ts",
      code: `const user = {
  name: 'Ana',
  greet() { return 'Hi ' + this.name; },
};
user.greet();
const g = user.greet;
g();`,
      lanes: ["Call", "this →", "Result"],
      frames: [
        {
          line: 5,
          note: "Called as a method — there's an object to the LEFT of the dot. That object (user) becomes `this`, so this.name is 'Ana'.",
          lanes: { Call: ["user.greet()"], "this →": ["user"], Result: ["'Hi Ana'"] },
        },
        {
          line: 6,
          note: "Here we grab the function ALONE into a plain variable. Nothing is called yet — but the link to `user` is gone.",
          lanes: { Call: ["const g = user.greet"], "this →": ["— (detached from user)"], Result: [] },
        },
        {
          line: 7,
          note: "A bare call g() has nothing to the left of a dot, so `this` is undefined (strict mode). this.name then throws. Same function, different call site → different `this`.",
          lanes: { Call: ["g()"], "this →": ["undefined"], Result: ["TypeError: can't read 'name' of undefined"] },
        },
        {
          note: "`this` is decided by HOW a function is called, not where it's defined. Method call → the object; bare call → undefined; arrow → inherits from its surroundings. Fix a detached method with .bind(user) or an arrow.",
          lanes: { Call: ["—"], "this →": ["set by the call site"], Result: ["user.greet.bind(user) → works"] },
        },
      ],
    },
    practiceTask:
      "Explain why `const g = user.greet; g()` loses `this`, and two ways to fix it (bind, or an arrow wrapper).",
    practiceStarter: `// Why does this break, and how do you fix it?
const user = { name: 'Ana', greet() { return 'Hi ' + this.name; } };
const g = user.greet;
// g() -> this is undefined. Fixes:
// 1) const g = user.greet.bind(user);
// 2) const g = () => user.greet();
`,
    hint: "this is set at CALL time by the object before the dot. A detached function has no object, so this is undefined.",
    solution: {
      language: "ts",
      code: `// Fix 1: bind permanently
const g1 = user.greet.bind(user);
// Fix 2: arrow keeps the call on the object
const g2 = () => user.greet();
// Both return "Hi Ana"`,
    },
    explanation:
      "obj.method() sets this = obj. Detaching the function drops that link. bind() locks this; arrows capture the enclosing this.",
    deepDive: {
      problemSolved: "The #1 source of 'this is undefined' bugs in event handlers and callbacks.",
      realWorldUseCase: "Passing a class method as an event handler (onClick={this.handleClick}) without losing this.",
      manualSolution: { language: "ts", code: "this.handleClick = this.handleClick.bind(this); // in constructor" },
      internalImplementation: {
        language: "ts",
        code: `// call/apply/bind set this explicitly:
function greet() { return 'Hi ' + this.name; }
greet.call({ name: 'Ana' });  // "Hi Ana"
const bound = greet.bind({ name: 'Bo' });`,
      },
      edgeCases: [
        "Arrow functions ignore call/apply/bind for this",
        "In strict mode a plain call's this is undefined (not the global object)",
        "Class fields with arrow functions auto-bind this",
      ],
      timeComplexity: "—",
      spaceComplexity: "bind creates a new function (small cost)",
      browserSupport: "Universal.",
      whenNotToUse: "Avoid relying on dynamic this in shared utilities — prefer explicit params or arrows.",
      industrialNotes: ["In modern React you rarely fight this — function components + hooks sidestep it."],
      commonMistakes: ["Passing obj.method as a callback and losing this.", "Using an arrow as an object method expecting this = the object."],
    },
  },
  {
    id: "in-prototypes",
    slug: "prototypes-classes",
    title: "Prototypes & Classes",
    category: "JavaScript Internals",
    difficulty: "Advanced",
    order: 204,
    estimatedMinutes: 10,
    summary:
      "Objects link to a prototype; property lookups walk up the prototype chain. `class` is friendly syntax over this prototype mechanism.",
    realLifeExample:
      "Looking for a rule: check your own desk first, then your manager's, then the company handbook — walking up a chain until found.",
    codeExample: {
      language: "ts",
      code: `class Animal {
  constructor(name) { this.name = name; }
  speak() { return this.name + ' makes a sound'; }
}
class Dog extends Animal {
  speak() { return this.name + ' barks'; } // overrides
}
new Dog('Rex').speak(); // "Rex barks"`,
    },
    visualization: {
      language: "ts",
      code: `class Animal {
  speak() { return this.name + ' makes a sound'; }
}
class Dog extends Animal {
  speak() { return this.name + ' barks'; }
}
new Dog('Rex').speak();`,
      lanes: ["Object", "Prototype chain", "Result"],
      frames: [
        {
          line: 7,
          note: "new Dog('Rex') builds an object with its OWN property name='Rex', linked to Dog.prototype, which links up to Animal.prototype, then Object.prototype.",
          lanes: {
            Object: ["rex = { name: 'Rex' }"],
            "Prototype chain": ["rex", "Dog.prototype", "Animal.prototype", "Object.prototype"],
            Result: [],
          },
        },
        {
          line: 7,
          note: "Calling rex.speak() first looks for `speak` on the object ITSELF. rex only has `name` — not found here.",
          lanes: {
            Object: ["rex = { name: 'Rex' }"],
            "Prototype chain": ["rex 👈 no speak", "Dog.prototype", "Animal.prototype", "Object.prototype"],
            Result: [],
          },
        },
        {
          line: 5,
          note: "Not found, so walk UP one link to Dog.prototype. speak() is here (Dog's override). The search stops and this method runs.",
          lanes: {
            Object: ["rex = { name: 'Rex' }"],
            "Prototype chain": ["rex", "Dog.prototype 👈 speak() ✓", "Animal.prototype", "Object.prototype"],
            Result: ["Dog.prototype.speak()"],
          },
        },
        {
          line: 2,
          note: "If Dog had NOT defined speak, the search would keep walking up to Animal.prototype.speak ('makes a sound'). That's the prototype chain — lookups climb it until found.",
          lanes: {
            Object: ["rex = { name: 'Rex' }"],
            "Prototype chain": ["rex", "Dog.prototype (no speak)", "Animal.prototype 👈 fallback", "Object.prototype"],
            Result: ["would be 'Rex makes a sound'"],
          },
        },
        {
          note: "Because Dog overrides speak, the answer is 'Rex barks'. `class` is just friendly syntax over this prototype-chain lookup.",
          lanes: {
            Object: ["rex = { name: 'Rex' }"],
            "Prototype chain": ["rex", "Dog.prototype ✓", "Animal.prototype", "Object.prototype"],
            Result: ["'Rex barks'"],
          },
        },
      ],
    },
    practiceTask:
      "Explain where `speak` lives (on the prototype, not each instance) and why that saves memory for 1000 dogs.",
    practiceStarter: `// Reasoning exercise:
// - new Dog('Rex') stores only { name }.
// - speak() lives once on Dog.prototype, shared by ALL dogs.
// - Lookup walks: instance -> Dog.prototype -> Animal.prototype -> Object.prototype.
`,
    hint: "Methods are defined once on the prototype and shared; instances store only their own data fields.",
    solution: {
      language: "ts",
      code: `// 1000 dogs = 1000 small {name} objects + ONE shared speak() on the prototype.
// If speak were defined per-instance (in the constructor), you'd have 1000 copies.`,
    },
    explanation:
      "Shared methods on the prototype mean instances stay lightweight; the chain provides inheritance and overriding.",
    deepDive: {
      problemSolved: "Memory-efficient shared behavior and inheritance without copying methods onto every instance.",
      realWorldUseCase: "Framework class hierarchies, Error subclasses, understanding why instanceof works.",
      internalImplementation: {
        language: "ts",
        code: `function Animal(name) { this.name = name; }
Animal.prototype.speak = function () { return this.name + ' makes a sound'; };
// 'class' compiles to roughly this prototype wiring.`,
      },
      edgeCases: [
        "Modifying Object.prototype affects EVERY object (never do it)",
        "instanceof walks the prototype chain",
        "Arrow functions can't be constructors (no prototype)",
      ],
      timeComplexity: "Lookup is O(chain depth), usually tiny",
      spaceComplexity: "Methods stored once per class, not per instance",
      browserSupport: "class: universal (ES2015+).",
      whenNotToUse: "Plain data — prefer objects/closures over classes when there's no shared behavior or inheritance.",
      industrialNotes: ["Modern React favors functions + hooks over class components, but prototypes underpin the language."],
      commonMistakes: ["Defining methods inside the constructor (one copy per instance).", "Patching built-in prototypes."],
    },
  },
  {
    id: "in-references",
    slug: "references-shallow-deep",
    title: "References, Shallow vs Deep Copy",
    category: "JavaScript Internals",
    difficulty: "Intermediate",
    order: 205,
    estimatedMinutes: 9,
    relatedMethods: ["structuredClone"],
    practiceChallengeIds: ["ch-deep-clone"],
    summary:
      "Objects and arrays are held by REFERENCE. Copying with spread/assign is SHALLOW — nested objects are still shared, so editing the copy can change the original.",
    realLifeExample:
      "Sharing a Google Doc link (reference): edits by anyone change the one document. A true copy means downloading a separate file.",
    codeExample: {
      language: "ts",
      code: `const a = { user: { age: 20 } };
const b = { ...a };       // shallow copy
b.user.age = 99;
a.user.age;               // 99 — nested object was shared!`,
    },
    visualization: {
      language: "ts",
      code: `const a = { user: { age: 20 } };
const b = { ...a };
b.user.age = 99;
a.user.age; // ?`,
      lanes: ["Variables", "Heap (objects)"],
      frames: [
        {
          line: 1,
          note: "a points to object #1. Its `user` field isn't a value — it's a reference to a SEPARATE object #2.",
          lanes: {
            Variables: ["a → #1"],
            "Heap (objects)": ["#1: { user → #2 }", "#2: { age: 20 }"],
          },
        },
        {
          line: 2,
          note: "Spread builds a NEW top-level object #3 and copies a's slots into it — but the `user` slot is copied as-is: the same reference to #2. That's what 'shallow' means.",
          lanes: {
            Variables: ["a → #1", "b → #3"],
            "Heap (objects)": ["#1: { user → #2 }", "#2: { age: 20 }", "#3: { user → #2 }"],
          },
        },
        {
          line: 3,
          note: "b.user is #2. a.user is ALSO #2 — the same object. Mutating it through b changes the one shared object.",
          lanes: {
            Variables: ["a → #1", "b → #3"],
            "Heap (objects)": ["#1: { user → #2 }", "#2: { age: 99 }", "#3: { user → #2 }"],
          },
        },
        {
          line: 4,
          note: "So a.user.age is 99, even though we only touched b. The top level was copied; the nested object was shared.",
          lanes: {
            Variables: ["a → #1", "b → #3"],
            "Heap (objects)": ["#1: { user → #2 }", "#2: { age: 99 }", "#3: { user → #2 }"],
          },
        },
        {
          note: "Takeaway: a shallow copy duplicates only the top level. For independent nested data, deep-clone (e.g. structuredClone(a)).",
          lanes: {
            Variables: ["a → #1", "b → #3"],
            "Heap (objects)": ["#1: { user → #2 }", "#2: { age: 99 }", "#3: { user → #2 }"],
          },
        },
      ],
    },
    practiceTask:
      "Run the editor to PROVE spread is shallow: copy a nested object, mutate the copy's nested field, and log the original.",
    practiceStarter: `const original = { user: { age: 20 } };
const copy = { ...original };
copy.user.age = 99;
console.log('original.user.age =', original.user.age); // what prints?
`,
    practiceRunnable: true,
    hint: "Spread copies only the top level. The nested `user` object is the same reference in both.",
    solution: {
      language: "ts",
      code: `// Logs: original.user.age = 99
// Because { ...original } copied the reference to user, not the user object itself.
// Deep copy fix: structuredClone(original)`,
    },
    explanation:
      "Primitives copy by value; objects/arrays copy by reference. A shallow copy duplicates the outer container but shares inner objects.",
    deepDive: {
      problemSolved: "The 'I changed the copy but the original changed too' bug.",
      realWorldUseCase: "Safely snapshotting state for undo, or editing config without corrupting the source.",
      builtInSolution: { language: "ts", code: "const deep = structuredClone(original);" },
      manualSolution: { language: "ts", code: "const deep = JSON.parse(JSON.stringify(original)); // loses Dates/undefined/functions" },
      internalImplementation: {
        language: "ts",
        code: `function deepClone(v) {
  if (v === null || typeof v !== 'object') return v;
  if (Array.isArray(v)) return v.map(deepClone);
  const out = {};
  for (const k of Object.keys(v)) out[k] = deepClone(v[k]);
  return out;
}`,
      },
      edgeCases: ["Shallow copy shares ALL nested references", "Two equal-looking objects are !== (compared by identity)", "Arrays are objects — same rules"],
      timeComplexity: "Shallow O(top-level keys), deep O(all nodes)",
      spaceComplexity: "Deep copy is O(n)",
      browserSupport: "structuredClone: Chrome 98+, FF 94+, Safari 15.4+, Node 17+.",
      whenNotToUse: "Don't deep-clone huge state on every render — clone only the path you change.",
      industrialNotes: ["Immutable updates (spread the path you change) avoid both shared-reference bugs and full deep clones."],
      commonMistakes: ["Assuming spread is deep.", "Comparing objects with === expecting value equality."],
    },
  },
  {
    id: "in-immutability",
    slug: "immutability",
    title: "Immutability & Immutable Updates",
    category: "JavaScript Internals",
    difficulty: "Intermediate",
    order: 206,
    estimatedMinutes: 9,
    relatedMethods: ["with", "toSorted", "structuredClone"],
    summary:
      "Immutable updates produce a NEW value instead of changing the old one. React relies on this to detect changes (new reference = re-render).",
    realLifeExample:
      "Instead of editing a signed contract, you draft a new version — the old one stays as a record, and everyone can see something changed.",
    codeExample: {
      language: "ts",
      code: `// mutate (bad in React state):
state.items.push(x);
// immutable (good):
const next = [...state.items, x];`,
    },
    practiceTask:
      "Implement markDone(todos, id) returning a NEW array where the matching todo's done=true (no mutation).",
    practiceStarter: `function markDone(todos, id) {
  // return a new array; flip done to true for the matching id
}`,
    practiceTests: [
      {
        name: "marks matching todo",
        kind: "normal",
        call: "markDone([{id:1,done:false},{id:2,done:false}], 1)",
        expected: [{ id: 1, done: true }, { id: 2, done: false }],
      },
      {
        name: "does not mutate input",
        kind: "mutation",
        call: "(()=>{const t=[{id:1,done:false}];markDone(t,1);return t[0].done;})()",
        expected: false,
      },
    ],
    hint: "map over todos; for the matching id return { ...todo, done: true }, otherwise return the todo unchanged.",
    solution: {
      language: "ts",
      code: `function markDone(todos, id) {
  return todos.map((t) => (t.id === id ? { ...t, done: true } : t));
}`,
    },
    explanation:
      "map builds a new array; the spread creates a new object only for the changed item. New references let React know exactly what to re-render.",
    deepDive: {
      problemSolved: "Mutating state breaks React's change detection and causes stale UI and hard-to-trace bugs.",
      realWorldUseCase: "Every reducer/state update: adding, editing, removing list items immutably.",
      builtInSolution: { language: "ts", code: "items.with(i, { ...items[i], done: true }) // ES2023" },
      manualSolution: { language: "ts", code: "items.map((x, idx) => (idx === i ? { ...x, done: true } : x))" },
      internalImplementation: { language: "ts", code: "// Libraries like Immer let you 'mutate' a draft and produce an immutable result." },
      edgeCases: [
        "Object.freeze prevents top-level mutation but is shallow",
        "Spreading only copies one level — spread each nested path you change",
        "Immutable !== deep clone; you reuse unchanged branches",
      ],
      timeComplexity: "O(n) for the changed list level",
      spaceComplexity: "O(n) for the new container (unchanged nested objects are reused)",
      browserSupport: "Spread/map universal; with()/toSorted() ES2023 (see those lessons).",
      whenNotToUse: "Performance-critical local computations not tied to UI — local mutation can be fine.",
      industrialNotes: ["Pair immutable updates with toSorted/toReversed/with for clean, mutation-free reducers."],
      commonMistakes: ["push/splice/sort directly on state.", "Deep-cloning everything when you only changed one branch."],
    },
  },
  {
    id: "in-gc",
    slug: "garbage-collection",
    title: "Garbage Collection (basics)",
    category: "JavaScript Internals",
    difficulty: "Advanced",
    order: 207,
    estimatedMinutes: 8,
    summary:
      "JS frees memory automatically: anything no longer REACHABLE from a root (globals, the stack, live closures) becomes eligible for collection. Leaks happen when you keep references you forgot about.",
    realLifeExample:
      "A cleaning crew throws out boxes nobody can reach anymore — but a box still tied to a rope you're holding (a lingering reference) never gets cleared.",
    codeExample: {
      language: "ts",
      code: `let data = loadHugeThing();
useItOnce(data);
data = null; // drop the reference → now collectible

// Leak: a listener you never remove keeps its closure (and captured data) alive
window.addEventListener('resize', onResize); // remove it on cleanup!`,
    },
    practiceTask:
      "List three common frontend memory leaks (unremoved listeners, dangling timers/intervals, growing caches/closures) and how to fix each.",
    practiceStarter: `// Common leaks & fixes:
// 1) addEventListener without removeEventListener -> remove on cleanup
// 2) setInterval never cleared -> clearInterval on unmount
// 3) caches/closures that only grow -> cap size, use WeakMap, or clear
`,
    hint: "Anything reachable from a root stays in memory. Leaks = references you keep but no longer need.",
    solution: {
      language: "ts",
      code: `// Fixes:
// useEffect(() => { window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []);
// const id = setInterval(f, 1000); return () => clearInterval(id);
// Use WeakMap/WeakRef for caches keyed by objects so entries can be collected.`,
    },
    explanation:
      "The collector keeps whatever is reachable. Your job is to drop references (cleanup) so unused memory becomes reachable-by-nobody and gets freed.",
    deepDive: {
      problemSolved: "Memory leaks that slowly degrade SPA performance over a long session.",
      realWorldUseCase: "useEffect cleanups, removing listeners, clearing intervals, bounding caches.",
      internalImplementation: { language: "ts", code: "// WeakMap entries vanish when the key object is collected — ideal for object-keyed caches." },
      edgeCases: [
        "Closures capture and keep variables alive longer than expected",
        "Detached DOM nodes still referenced in JS won't be freed",
        "You cannot force GC; you only make memory unreachable",
      ],
      timeComplexity: "—",
      spaceComplexity: "—",
      browserSupport: "Conceptual — every runtime has a GC (V8 uses generational + mark-sweep).",
      whenNotToUse: "Don't micro-optimize GC; focus on not leaking (cleanups) instead.",
      industrialNotes: ["Most SPA leaks are missing useEffect cleanups — always return a cleanup for subscriptions."],
      commonMistakes: ["Forgetting removeEventListener / clearInterval.", "Caches that only grow."],
    },
  },
  {
    id: "in-bigo",
    slug: "big-o-for-frontend",
    title: "Big-O for Frontend Engineers",
    category: "JavaScript Internals",
    difficulty: "Intermediate",
    order: 208,
    summary:
      "Big-O describes how work grows with input size. For frontend, the big wins are avoiding O(n²) (nested loops / includes-in-a-loop) by using Sets/Maps for O(1) lookups.",
    estimatedMinutes: 9,
    realLifeExample:
      "Finding a name: flipping through every page (O(n)) vs using the index tab (O(1)). With 10 names either is fine; with 100,000 the difference is everything.",
    codeExample: {
      language: "ts",
      code: `// O(n^2): for each order, scan all users
orders.filter(o => users.find(u => u.id === o.userId));
// O(n): build a lookup once, then O(1) checks
const byId = new Map(users.map(u => [u.id, u]));
orders.filter(o => byId.has(o.userId));`,
    },
    practiceTask:
      "Rewrite an O(n²) 'does array B contain each item of A' check into an O(n) version using a Set.",
    practiceStarter: `function commonCount(a, b) {
  // BAD idea: a.filter(x => b.includes(x)).length  // O(n*m)
  // Make it O(n+m) using a Set:
}`,
    practiceTests: [
      { name: "counts common items", kind: "normal", call: "commonCount([1,2,3,4],[2,4,6])", expected: 2 },
      { name: "handles large overlap", kind: "large", call: "commonCount(Array.from({length:1000},(_,i)=>i), [1,2,3])", expected: 3 },
    ],
    hint: "Put b in a Set (O(m)), then count a's items where set.has(x) (each O(1)).",
    solution: {
      language: "ts",
      code: `function commonCount(a, b) {
  const setB = new Set(b);
  return a.filter((x) => setB.has(x)).length;
}`,
    },
    explanation:
      "includes() inside filter() rescans b every time → O(n·m). A Set turns each lookup into O(1), so the whole thing is O(n+m).",
    deepDive: {
      problemSolved: "Sluggish UIs from accidental O(n²) work on lists that grow (search, joins, dedupe).",
      realWorldUseCase: "Joining orders↔users, deduping, checking membership in large lists, virtualized tables.",
      builtInSolution: { language: "ts", code: "const set = new Set(items); set.has(x); // O(1)" },
      manualSolution: { language: "ts", code: "items.includes(x); // O(n) per call — avoid in loops" },
      edgeCases: [
        "Small N: clarity beats micro-optimization",
        "Sorting is O(n log n) — fine, but don't re-sort on every render",
        "Watch hidden O(n) ops (spread/clone) inside loops",
      ],
      timeComplexity: "Target O(n)/O(n log n); avoid O(n²)",
      spaceComplexity: "Lookups trade O(n) memory for speed — usually worth it",
      browserSupport: "Conceptual.",
      whenNotToUse: "Premature optimization on tiny lists — measure first.",
      industrialNotes: ["The single biggest frontend perf fix: replace includes-in-a-loop with a Set/Map lookup."],
      commonMistakes: ["array.includes inside .filter/.map on large lists.", "Re-sorting/re-grouping every render instead of memoizing."],
    },
  },
];
