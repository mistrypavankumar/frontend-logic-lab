import { Lesson } from "@/lib/types";

// 10 MVP lessons. Theory is intentionally short — every lesson ends with a
// practice task so learners write code, not just read it.
export const lessons: Lesson[] = [
  {
    id: "l1",
    slug: "html-structure",
    title: "HTML Structure",
    category: "HTML",
    difficulty: "Beginner",
    order: 1,
    estimatedMinutes: 8,
    summary:
      "HTML is the skeleton of a web page. You use tags to label each piece of content — a heading, a paragraph, an image, a button. The browser reads these labels and shows them.",
    realLifeExample:
      "Think of a school notebook. The title on top, headings for each section, and lines of notes below. HTML tags are just labels that say 'this is a title', 'this is a paragraph'.",
    codeExample: {
      language: "html",
      code: `<article>
  <h1>My First Page</h1>
  <p>Hello! This is a paragraph.</p>
  <button>Click me</button>
</article>`,
    },
    practiceTask:
      "Build a tiny profile card in HTML: a heading with your name, a paragraph about you, and a list of 3 hobbies using <ul> and <li>.",
    practiceStarter: `<section>
  <h1>Your name</h1>
  <!-- add a paragraph about you -->
  <!-- add a <ul> with three <li> hobbies -->
</section>`,
    hint:
      "A list uses <ul> as the container, and each item goes inside its own <li> tag.",
    solution: {
      language: "html",
      code: `<section>
  <h1>Pavan</h1>
  <p>I am learning frontend development.</p>
  <ul>
    <li>Coding</li>
    <li>Reading</li>
    <li>Football</li>
  </ul>
</section>`,
    },
    explanation:
      "Each tag describes what the content IS. <h1> is the main heading, <p> is a paragraph, and a <ul> wraps <li> items. The browser uses these labels to display and to help screen readers understand the page.",
    nextLessonSlug: "css-layout",
  },
  {
    id: "l2",
    slug: "css-layout",
    title: "CSS Layout & The Box Model",
    category: "CSS",
    difficulty: "Beginner",
    order: 2,
    estimatedMinutes: 9,
    summary:
      "CSS styles your HTML. The key idea is the box model: every element is a box with content, padding (space inside), border, and margin (space outside).",
    realLifeExample:
      "Imagine a framed photo. The photo is the content, the white mat around it is padding, the wooden frame is the border, and the gap to the next frame on the wall is the margin.",
    codeExample: {
      language: "css",
      code: `.card {
  padding: 16px;      /* space inside */
  border: 1px solid #ccc;
  margin: 12px;       /* space outside */
  border-radius: 8px;
}`,
    },
    practiceTask:
      "Style a .box class so it has 20px padding, a 2px solid blue border, 10px margin, and rounded corners.",
    practiceStarter: `.box {
  /* add padding, border, margin and border-radius */
}`,
    hint:
      "Order does not matter, but a common order is padding, border, margin, then border-radius.",
    solution: {
      language: "css",
      code: `.box {
  padding: 20px;
  border: 2px solid blue;
  margin: 10px;
  border-radius: 6px;
}`,
    },
    explanation:
      "Padding pushes content away from the border (inside the box). Margin pushes other elements away (outside the box). Understanding this difference fixes 90% of early spacing bugs.",
    nextLessonSlug: "flexbox",
  },
  {
    id: "l3",
    slug: "flexbox",
    title: "Flexbox",
    category: "CSS",
    difficulty: "Beginner",
    order: 3,
    estimatedMinutes: 10,
    summary:
      "Flexbox lays out items in a row or column and lets you space and align them easily. Set display: flex on a container and its children become flex items.",
    realLifeExample:
      "Think of books on a shelf. You can push them to the left, center them, or spread them out evenly. Flexbox is the shelf — justify-content decides the spacing.",
    codeExample: {
      language: "css",
      code: `.navbar {
  display: flex;
  justify-content: space-between; /* ends apart */
  align-items: center;            /* vertically centered */
  gap: 16px;
}`,
    },
    practiceTask:
      "Make a .row that displays 3 boxes side by side, centered horizontally, with 12px gap between them.",
    practiceStarter: `.row {
  /* turn on flex, center the items, add a 12px gap */
}`,
    hint:
      "display: flex turns on flex. justify-content: center centers along the row.",
    solution: {
      language: "css",
      code: `.row {
  display: flex;
  justify-content: center;
  gap: 12px;
}`,
    },
    explanation:
      "justify-content controls the MAIN axis (the row direction by default). align-items controls the CROSS axis. gap adds spacing without needing margins on each child.",
    nextLessonSlug: "css-grid",
  },
  {
    id: "l4",
    slug: "css-grid",
    title: "CSS Grid",
    category: "CSS",
    difficulty: "Intermediate",
    order: 4,
    estimatedMinutes: 11,
    summary:
      "Grid lays things out in rows AND columns at the same time. It is perfect for galleries, dashboards, and card layouts.",
    realLifeExample:
      "Think of an egg tray or a chess board — fixed rows and columns where each item drops into a cell.",
    codeExample: {
      language: "css",
      code: `.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  gap: 16px;
}`,
    },
    practiceTask:
      "Create a .cards grid with 2 equal columns and a 20px gap. Bonus: make it 1 column on small screens.",
    practiceStarter: `.cards {
  /* display grid, 2 equal columns, 20px gap */
}`,
    hint:
      "1fr means '1 fraction of free space'. repeat(2, 1fr) makes two equal columns.",
    solution: {
      language: "css",
      code: `.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (max-width: 600px) {
  .cards { grid-template-columns: 1fr; }
}`,
    },
    explanation:
      "grid-template-columns defines how many columns and their sizes. Using 1fr makes columns share space equally. A media query swaps to a single column on small screens for a responsive layout.",
    nextLessonSlug: "javascript-basics",
  },
  {
    id: "l5",
    slug: "javascript-basics",
    title: "JavaScript Basics",
    category: "JavaScript",
    difficulty: "Beginner",
    order: 5,
    estimatedMinutes: 10,
    summary:
      "JavaScript makes pages interactive. You store data in variables (let / const), use types like strings and numbers, and combine them in expressions.",
    realLifeExample:
      "A variable is like a labeled box. You write 'price' on the box and put 100 inside. Later you open 'price' and the 100 is still there.",
    codeExample: {
      language: "js",
      code: `const name = "Pavan";   // text (string)
let age = 25;            // number
let isLearning = true;   // boolean

console.log(name + " is " + age);`,
    },
    mentalModel:
      "A variable is a labeled box. `const` is a box you seal (can't reassign the label); `let` is a box you can swap the contents of later.",
    examples: [
      {
        title: "const vs let",
        code: `const country = "India"; // can't be reassigned
let score = 0;           // can change
score = 10;`,
        output: "score → 10",
        note: "Default to const; use let only when the value really changes.",
      },
      {
        title: "Types at a glance",
        code: `typeof "hi";    // "string"
typeof 42;      // "number"
typeof true;    // "boolean"
typeof undefined; // "undefined"`,
        note: "Strings, numbers, booleans are the everyday types; typeof tells you which.",
      },
      {
        title: "Template literals (cleaner strings)",
        code: `const name = "Pavan", age = 25;
\`\${name} is \${age}\`;`,
        output: `"Pavan is 25"`,
        note: "Backticks with ${} read better than \"a\" + b + \"c\" concatenation.",
      },
    ],
    practiceTask:
      "Create a const for a product name and a let for its price. Then log a sentence like 'Shoes cost 1500'.",
    practiceStarter: `const product = "Shoes";
let price = 1500;
// log a sentence like: Shoes cost 1500
`,
    practiceRunnable: true,
    hint:
      "Use const for values that won't change, let for values that might. Join text with + or use a template string `like ${this}`.",
    solution: {
      language: "js",
      code: `const product = "Shoes";
let price = 1500;
console.log(\`\${product} cost \${price}\`);`,
    },
    explanation:
      "const is for values you won't reassign; let is for values you will. Template strings (backticks with ${}) are the cleanest way to mix text and variables.",
    nextLessonSlug: "arrays-objects",
  },
  {
    id: "l6",
    slug: "arrays-objects",
    title: "Arrays & Objects",
    category: "JavaScript",
    difficulty: "Beginner",
    order: 6,
    estimatedMinutes: 11,
    summary:
      "An array is an ordered list of values. An object groups related values by name (key: value). Together they model almost all real-world data.",
    realLifeExample:
      "An array is a shopping list (item 1, item 2, item 3). An object is one product's details: { name, price, inStock }.",
    codeExample: {
      language: "js",
      code: `const fruits = ["apple", "banana", "mango"];
console.log(fruits[0]); // "apple"

const user = { name: "Pavan", age: 25 };
console.log(user.name); // "Pavan"`,
    },
    mentalModel:
      "An array is a numbered row of lockers (access by position: [0], [1], …). An object is a set of labeled drawers (access by name: .price, .name).",
    examples: [
      {
        title: "Array — access & length",
        code: `const fruits = ["apple", "banana", "mango"];
fruits[1];        // "banana"
fruits.length;    // 3`,
        note: "Arrays are zero-indexed: the first item is [0].",
      },
      {
        title: "Object — read & add fields",
        code: `const user = { name: "Pavan", age: 25 };
user.name;        // "Pavan"
user.city = "Pune"; // add a new field`,
        note: "Dot access reads a property; assigning a new key adds one.",
      },
      {
        title: "Array OF objects (the real-world shape)",
        code: `const products = [
  { name: "Shoes", price: 1500 },
  { name: "Bag", price: 900 },
];
products[0].name; // "Shoes"`,
        output: `"Shoes"`,
        note: "Most API data is exactly this: a list of objects.",
      },
      {
        title: "Nested object",
        code: `const order = { id: 1, customer: { name: "Ana" } };
order.customer.name;`,
        output: `"Ana"`,
        note: "Chain the access to reach into nested data.",
      },
    ],
    practiceTask:
      "Make an array of 3 product objects, each with name and price. Then log the name of the second product.",
    practiceStarter: `const products = [
  { name: "Shoes", price: 1500 },
  { name: "Bag", price: 900 },
  { name: "Cap", price: 300 },
];
// log the name of the SECOND product
`,
    practiceRunnable: true,
    hint:
      "Arrays start counting at 0, so the second item is at index 1. Access object values with dot notation: item.name.",
    solution: {
      language: "js",
      code: `const products = [
  { name: "Shoes", price: 1500 },
  { name: "Bag", price: 900 },
  { name: "Cap", price: 300 },
];
console.log(products[1].name); // "Bag"`,
    },
    explanation:
      "Arrays use number indexes starting at 0. Objects use named keys. An array of objects (like products[1].name) is the most common shape of data you'll work with in frontend apps.",
    nextLessonSlug: "conditions-loops",
  },
  {
    id: "l7",
    slug: "conditions-loops",
    title: "Conditions & Loops",
    category: "JavaScript",
    difficulty: "Beginner",
    order: 7,
    estimatedMinutes: 12,
    summary:
      "Conditions (if / else) let your code make decisions. Loops let your code repeat an action for every item in a list.",
    realLifeExample:
      "Condition: IF it rains, take an umbrella, ELSE wear sunglasses. Loop: greet every guest at the door, one by one.",
    codeExample: {
      language: "js",
      code: `const score = 75;
if (score >= 50) {
  console.log("Pass");
} else {
  console.log("Fail");
}

const nums = [1, 2, 3];
for (const n of nums) {
  console.log(n * 2); // 2, 4, 6
}`,
    },
    mentalModel:
      "A condition is a fork in the road (go this way IF…). A loop is a conveyor belt — the same action runs once for every item that passes by.",
    examples: [
      {
        title: "if / else if / else",
        code: `const score = 75;
if (score >= 90) "A";
else if (score >= 50) "Pass";
else "Fail";`,
        output: `"Pass"`,
        note: "Checks run top to bottom; the first true branch wins.",
      },
      {
        title: "for…of — loop the values",
        code: `for (const n of [1, 2, 3]) {
  console.log(n * 2); // 2, 4, 6
}`,
        note: "for…of gives you each value directly — cleaner than a C-style index loop.",
      },
      {
        title: "Condition inside a loop (filter by hand)",
        code: `const evens = [];
for (const n of [1, 2, 3, 4]) {
  if (n % 2 === 0) evens.push(n);
}
evens; // [2, 4]`,
        output: "[2, 4]",
        note: "A loop + an if is exactly what Array.filter does for you.",
      },
      {
        title: "Ternary — a one-line if/else",
        code: `const age = 20;
const label = age >= 18 ? "adult" : "minor";`,
        output: `"adult"`,
        note: "Great for picking one of two values; don't nest them deeply.",
      },
    ],
    practiceTask:
      "Given an array of numbers, loop through them and log only the even ones.",
    practiceStarter: `const nums = [1, 2, 3, 4, 5, 6];
// loop through nums and log ONLY the even numbers
`,
    practiceRunnable: true,
    hint:
      "A number is even when number % 2 === 0 (the remainder after dividing by 2 is zero).",
    solution: {
      language: "js",
      code: `const nums = [1, 2, 3, 4, 5, 6];
for (const n of nums) {
  if (n % 2 === 0) {
    console.log(n); // 2, 4, 6
  }
}`,
    },
    explanation:
      "The for...of loop visits each item. Inside, the if uses the modulo operator (%) to check evenness. Combining loops + conditions is the core of almost every filter and search you'll write.",
    nextLessonSlug: "functions",
  },
  {
    id: "l8",
    slug: "functions",
    title: "Functions",
    category: "JavaScript",
    difficulty: "Beginner",
    order: 8,
    estimatedMinutes: 10,
    summary:
      "A function is a reusable block of code. You give it inputs (parameters), it does work, and it returns an output. Write once, use many times.",
    realLifeExample:
      "A coffee machine: you put in water and beans (inputs), press a button, and get coffee (output). You don't rebuild the machine each time.",
    codeExample: {
      language: "js",
      code: `function add(a, b) {
  return a + b;
}
console.log(add(2, 3)); // 5

// Arrow function version
const double = (n) => n * 2;
console.log(double(5)); // 10`,
    },
    examples: [
      {
        title: "Function declaration",
        code: `function greet(name) {
  return "Hi " + name;
}
greet("Ana");`,
        output: `"Hi Ana"`,
        note: "The classic form. return sends a value back to whoever called it.",
      },
      {
        title: "Arrow function",
        code: `const greet = (name) => "Hi " + name;
greet("Ana");`,
        output: `"Hi Ana"`,
        note: "Shorter syntax — a single expression is returned automatically (no braces, no return).",
      },
      {
        title: "Default parameter",
        code: `function greet(name = "there") {
  return "Hi " + name;
}
greet();`,
        output: `"Hi there"`,
        note: "Defaults fill in when an argument is missing.",
      },
      {
        title: "Two inputs, one output",
        code: `const area = (w, h) => w * h;
area(4, 3);`,
        output: "12",
        note: "Same idea with two inputs. A function is just: inputs → work → output.",
      },
    ],
    practiceTask:
      "Write a function getDiscount(price) that returns the price after a 10% discount.",
    practiceStarter: `function getDiscount(price) {
  // return the price after a 10% discount
}`,
    practiceTests: [
      { name: "10% off 1000 is 900", call: "getDiscount(1000)", expected: 900 },
      { name: "10% off 200 is 180", call: "getDiscount(200)", expected: 180 },
    ],
    hint:
      "10% off means you pay 90%. Multiply the price by 0.9 and return it.",
    solution: {
      language: "js",
      code: `function getDiscount(price) {
  return price * 0.9;
}
console.log(getDiscount(1000)); // 900`,
    },
    explanation:
      "Parameters (price) are the inputs. return sends a value back to whoever called the function. Pure functions like this — same input, same output, no side effects — are the easiest code to test and trust.",
    nextLessonSlug: "react-components-props",
  },
  {
    id: "l9",
    slug: "react-components-props",
    title: "React Components & Props",
    category: "React",
    difficulty: "Intermediate",
    order: 9,
    estimatedMinutes: 12,
    summary:
      "A React component is a function that returns UI (JSX). Props are the inputs you pass to a component, so the same component can show different data.",
    realLifeExample:
      "A component is a rubber stamp. Props are the ink — same stamp shape, different message each time you press it.",
    codeExample: {
      language: "jsx",
      code: `function Greeting({ name }) {
  return <h2>Hello, {name}!</h2>;
}

// Use it with different props
<Greeting name="Pavan" />
<Greeting name="Sara" />`,
    },
    practiceTask:
      "Create a ProductCard component that takes name and price as props and renders them inside a div.",
    practiceStarter: `function ProductCard({ name, price }) {
  // return a <div> showing the name and price
}

// Use it like: <ProductCard name="Shoes" price={1500} />`,
    hint:
      "Destructure props in the function arguments: function ProductCard({ name, price }). Show values with {curly braces} in JSX.",
    solution: {
      language: "jsx",
      code: `function ProductCard({ name, price }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>₹{price}</p>
    </div>
  );
}

// <ProductCard name="Shoes" price={1500} />`,
    },
    explanation:
      "Components are reusable functions that return JSX. Props flow DOWN from parent to child and are read-only inside the child. This 'one component, many props' pattern is how React apps stay DRY.",
    nextLessonSlug: "state-events",
  },
  {
    id: "l10",
    slug: "state-events",
    title: "State & Events",
    category: "React",
    difficulty: "Intermediate",
    order: 10,
    estimatedMinutes: 13,
    summary:
      "State is data that can change over time inside a component. useState gives you a value and a function to update it. Events (like onClick) trigger those updates and React re-renders the UI.",
    realLifeExample:
      "A scoreboard at a match. The score is the state. Every time someone scores (an event), you update the number and the board re-displays it.",
    codeExample: {
      language: "jsx",
      code: `import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`,
    },
    practiceTask:
      "Build a Like button that starts at 0 and increases by 1 each click. Show 'Likes: N'.",
    practiceStarter: `import { useState } from "react";

function LikeButton() {
  // add state for likes, and a button that increases it on click
}`,
    hint:
      "useState(0) gives [likes, setLikes]. In onClick call setLikes(likes + 1).",
    solution: {
      language: "jsx",
      code: `import { useState } from "react";

function LikeButton() {
  const [likes, setLikes] = useState(0);
  return (
    <button onClick={() => setLikes(likes + 1)}>
      Likes: {likes}
    </button>
  );
}`,
    },
    explanation:
      "useState returns the current value and a setter. You never change state directly — you call the setter, and React re-renders with the new value. Events connect user actions to state changes. This loop (event → setState → re-render) is the engine of every React app.",
    nextLessonSlug: undefined,
  },
];

export function getLesson(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug);
}

export const orderedLessons = [...lessons].sort((a, b) => a.order - b.order);
