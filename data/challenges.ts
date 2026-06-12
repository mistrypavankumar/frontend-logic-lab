import { Challenge } from "@/lib/types";

// Logic challenges. Focus is on THINKING, not memorizing syntax.
// Pure-function challenges include `tests` so the in-browser editor can run
// and auto-grade the learner's code. React-component challenges have no tests.
export const challenges: Challenge[] = [
  {
    id: "c1",
    slug: "filter-products-by-category",
    title: "Filter Products by Category",
    difficulty: "Beginner",
    category: "Filtering",
    tags: ["array", "filter"],
    problem:
      "Given a list of products, return only the products that belong to a given category.",
    example: {
      input: `filterByCategory(products, "shoes")`,
      output: `[{ name: "Runner", category: "shoes" }]`,
    },
    starterCode: `function filterByCategory(products, category) {
  // return only products whose category matches
}`,
    hints: [
      "Array.filter keeps items where the test returns true.",
      "Compare each product's category to the wanted category with ===.",
    ],
    solution: `function filterByCategory(products, category) {
  return products.filter((p) => p.category === category);
}`,
    explanation:
      "filter walks every item and keeps the ones where your test returns true. Here the test is 'does this product's category equal the one we want?'. filter never changes the original array — it returns a new one.",
    tests: [
      {
        name: "keeps only matching category",
        call: `filterByCategory([{name:"Runner",category:"shoes"},{name:"Tote",category:"bags"}], "shoes")`,
        expected: [{ name: "Runner", category: "shoes" }],
      },
      {
        name: "returns empty when nothing matches",
        call: `filterByCategory([{name:"Tote",category:"bags"}], "shoes")`,
        expected: [],
      },
    ],
  },
  {
    id: "c2",
    slug: "search-users-by-name",
    title: "Search Users by Name",
    difficulty: "Beginner",
    category: "Searching",
    tags: ["array", "filter", "string"],
    problem:
      "Return all users whose name contains the search text. The search must be case-insensitive.",
    example: {
      input: `searchUsers(users, "an")  // users = [{name:"Ana"},{name:"Bob"}]`,
      output: `[{ name: "Ana" }]`,
    },
    starterCode: `function searchUsers(users, query) {
  // return users whose name includes query (ignore upper/lower case)
}`,
    hints: [
      "Lowercase both the name and the query before comparing.",
      "String.includes checks if one string is inside another.",
    ],
    solution: `function searchUsers(users, query) {
  const q = query.toLowerCase();
  return users.filter((u) => u.name.toLowerCase().includes(q));
}`,
    explanation:
      "By lowercasing both sides, 'An', 'an' and 'AN' all match. includes returns true when the query appears anywhere in the name. This is the exact logic behind a live search box.",
    tests: [
      {
        name: "matches case-insensitively",
        call: `searchUsers([{name:"Ana"},{name:"Bob"}], "AN")`,
        expected: [{ name: "Ana" }],
      },
      {
        name: "matches anywhere in the name",
        call: `searchUsers([{name:"Johnathan"},{name:"Bob"}], "than")`,
        expected: [{ name: "Johnathan" }],
      },
    ],
  },
  {
    id: "c3",
    slug: "sort-orders-by-price",
    title: "Sort Orders by Price",
    difficulty: "Intermediate",
    category: "Sorting",
    tags: ["array", "sort"],
    problem:
      "Sort a list of orders from cheapest to most expensive without mutating the original array.",
    example: {
      input: `sortByPrice([{price:30},{price:10},{price:20}])`,
      output: `[{price:10},{price:20},{price:30}]`,
    },
    starterCode: `function sortByPrice(orders) {
  // return a NEW sorted array (ascending by price)
}`,
    hints: [
      "sort mutates the array — copy it first with [...orders].",
      "The compare function returns a.price - b.price for ascending order.",
    ],
    solution: `function sortByPrice(orders) {
  return [...orders].sort((a, b) => a.price - b.price);
}`,
    explanation:
      "[...orders] makes a shallow copy so the original stays untouched. sort's compare function: a negative result means 'a comes first'. a.price - b.price is negative when a is cheaper, giving ascending order. Swap to b.price - a.price for descending.",
    tests: [
      {
        name: "sorts ascending by price",
        call: `sortByPrice([{price:30},{price:10},{price:20}])`,
        expected: [{ price: 10 }, { price: 20 }, { price: 30 }],
      },
    ],
  },
  {
    id: "c4",
    slug: "sort-items-by-date",
    title: "Sort Items by Date (Newest First)",
    difficulty: "Intermediate",
    category: "Sorting",
    tags: ["array", "sort", "date"],
    problem:
      "Sort posts so the newest date comes first. Dates are ISO strings like '2024-05-01'.",
    example: {
      input: `sortByNewest([{date:"2024-01-01"},{date:"2024-05-01"}])`,
      output: `[{date:"2024-05-01"},{date:"2024-01-01"}]`,
    },
    starterCode: `function sortByNewest(posts) {
  // newest date first
}`,
    hints: [
      "new Date(str) turns a date string into a comparable Date.",
      "Subtracting two Dates gives a number you can sort by.",
    ],
    solution: `function sortByNewest(posts) {
  return [...posts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
}`,
    explanation:
      "new Date(string) converts to a timestamp. Subtracting Dates coerces them to numbers (milliseconds). Using b - a (instead of a - b) flips the order so the newest is first.",
    tests: [
      {
        name: "newest date comes first",
        call: `sortByNewest([{date:"2024-01-01"},{date:"2024-05-01"},{date:"2024-03-01"}])`,
        expected: [
          { date: "2024-05-01" },
          { date: "2024-03-01" },
          { date: "2024-01-01" },
        ],
      },
    ],
  },
  {
    id: "c5",
    slug: "build-pagination",
    title: "Build Pagination Logic",
    difficulty: "Intermediate",
    category: "Pagination",
    tags: ["array", "slice", "math"],
    problem:
      "Given an array, a page number (starting at 1), and a page size, return only the items for that page.",
    example: {
      input: `paginate([1,2,3,4,5], 2, 2)  // page 2, size 2`,
      output: `[3, 4]`,
    },
    starterCode: `function paginate(items, page, pageSize) {
  // return the slice of items for this page
}`,
    hints: [
      "The first item of a page is at index (page - 1) * pageSize.",
      "slice(start, end) returns items from start up to (not including) end.",
    ],
    solution: `function paginate(items, page, pageSize) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}`,
    explanation:
      "Page 1 starts at index 0, page 2 at index pageSize, and so on — that's (page - 1) * pageSize. slice grabs exactly pageSize items from there. The total page count is Math.ceil(items.length / pageSize).",
    tests: [
      {
        name: "page 1 returns the first chunk",
        call: `paginate([1,2,3,4,5], 1, 2)`,
        expected: [1, 2],
      },
      {
        name: "page 2 returns the next chunk",
        call: `paginate([1,2,3,4,5], 2, 2)`,
        expected: [3, 4],
      },
      {
        name: "last page may be partial",
        call: `paginate([1,2,3,4,5], 3, 2)`,
        expected: [5],
      },
    ],
  },
  {
    id: "c6",
    slug: "validate-form",
    title: "Validate a Sign-up Form",
    difficulty: "Intermediate",
    category: "Forms",
    tags: ["object", "validation", "conditions"],
    problem:
      "Return an object of error messages for any invalid fields. Name is required, email must contain '@', password must be at least 6 characters. No errors means the object is empty.",
    example: {
      input: `validate({ name: "", email: "x", password: "123" })`,
      output: `{ name: "Name is required", email: "Invalid email", password: "Too short" }`,
    },
    starterCode: `function validate({ name, email, password }) {
  const errors = {};
  // add a message for each invalid field
  return errors;
}`,
    hints: [
      "Only add a key to errors when that field fails its rule.",
      "Check email with email.includes('@') and password with password.length >= 6.",
    ],
    solution: `function validate({ name, email, password }) {
  const errors = {};
  if (!name) errors.name = "Name is required";
  if (!email.includes("@")) errors.email = "Invalid email";
  if (password.length < 6) errors.password = "Too short";
  return errors;
}`,
    explanation:
      "Each rule adds a message only when it fails. The caller can then check Object.keys(errors).length === 0 to know the form is valid. Returning a map of field → message makes it easy to show errors next to each input.",
    tests: [
      {
        name: "valid input has no errors",
        call: `validate({ name: "Ana", email: "a@b.com", password: "secret" })`,
        expected: {},
      },
      {
        name: "reports every invalid field",
        call: `validate({ name: "", email: "x", password: "123" })`,
        expected: {
          name: "Name is required",
          email: "Invalid email",
          password: "Too short",
        },
      },
    ],
  },
  {
    id: "c7",
    slug: "toggle-todos",
    title: "Toggle Completed Todos",
    difficulty: "Beginner",
    category: "State Logic",
    tags: ["array", "map", "immutability"],
    problem:
      "Flip the 'done' status of the todo with a matching id. Return a NEW array (don't mutate).",
    example: {
      input: `toggleTodo([{id:1,done:false}], 1)`,
      output: `[{id:1, done:true}]`,
    },
    starterCode: `function toggleTodo(todos, id) {
  // return a new array with the matching todo's done flipped
}`,
    hints: [
      "map returns a new array of the same length.",
      "For the matching id, spread the todo and flip done: { ...t, done: !t.done }.",
    ],
    solution: `function toggleTodo(todos, id) {
  return todos.map((t) =>
    t.id === id ? { ...t, done: !t.done } : t
  );
}`,
    explanation:
      "map builds a new array. For the matching todo we create a fresh object with done flipped; every other todo is returned unchanged. This immutable pattern is exactly how you update one item in React state.",
    tests: [
      {
        name: "flips only the matching todo",
        call: `toggleTodo([{id:1,done:false},{id:2,done:true}], 1)`,
        expected: [
          { id: 1, done: true },
          { id: 2, done: true },
        ],
      },
      {
        name: "leaves others unchanged",
        call: `toggleTodo([{id:1,done:false},{id:2,done:false}], 2)`,
        expected: [
          { id: 1, done: false },
          { id: 2, done: true },
        ],
      },
    ],
  },
  {
    id: "c8",
    slug: "calculate-cart-total",
    title: "Calculate Cart Total",
    difficulty: "Beginner",
    category: "Reduce",
    tags: ["array", "reduce", "math"],
    problem: "Add up the price * quantity of every item in a shopping cart.",
    example: {
      input: `cartTotal([{price:100, qty:2}, {price:50, qty:1}])`,
      output: `250`,
    },
    starterCode: `function cartTotal(cart) {
  // sum of price * qty for every item
}`,
    hints: [
      "reduce builds a single value from an array.",
      "Start the running total at 0 and add item.price * item.qty each step.",
    ],
    solution: `function cartTotal(cart) {
  return cart.reduce((total, item) => total + item.price * item.qty, 0);
}`,
    explanation:
      "reduce carries a running 'total' across the array. The second argument (0) is the starting value. Each step adds that item's line price. reduce is the go-to tool whenever many values collapse into one (sum, count, max).",
    tests: [
      {
        name: "multiplies price by quantity",
        call: `cartTotal([{price:100, qty:2}, {price:50, qty:1}])`,
        expected: 250,
      },
      { name: "empty cart is 0", call: `cartTotal([])`, expected: 0 },
    ],
  },
  {
    id: "c9",
    slug: "show-hide-ui",
    title: "Show / Hide UI Based on State",
    difficulty: "Beginner",
    category: "Conditional Rendering",
    tags: ["react", "useState", "boolean"],
    problem:
      "Build a React component with a button that shows or hides a secret message. Clicking toggles it.",
    example: {
      input: `Click "Toggle" once`,
      output: `The message "It's a secret!" appears; click again to hide.`,
    },
    starterCode: `function SecretBox() {
  // use a boolean state and conditional rendering
}`,
    hints: [
      "useState(false) holds whether the message is visible.",
      "Use {visible && <p>...</p>} to render only when visible is true.",
    ],
    solution: `import { useState } from "react";

function SecretBox() {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <button onClick={() => setVisible((v) => !v)}>Toggle</button>
      {visible && <p>It's a secret!</p>}
    </div>
  );
}`,
    explanation:
      "A boolean in state decides what shows. {visible && <p/>} renders the paragraph only when visible is true (because true && X gives X, and false && X gives nothing). setVisible(v => !v) safely flips the previous value.",
  },
  {
    id: "c10",
    slug: "build-tabs",
    title: "Build Tabs",
    difficulty: "Intermediate",
    category: "UI Logic",
    tags: ["react", "useState", "map"],
    problem:
      "Build a tabs component. Clicking a tab shows its content and highlights the active tab.",
    example: {
      input: `tabs = ["Home", "Profile", "Settings"]`,
      output: `Clicking "Profile" shows its panel and marks it active.`,
    },
    starterCode: `function Tabs({ tabs }) {
  // track the active index, render buttons + the active panel
}`,
    hints: [
      "Store the active index in state (start at 0).",
      "Map tabs to buttons; compare index === active to style the active one.",
    ],
    solution: `import { useState } from "react";

function Tabs({ tabs }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="tab-row">
        {tabs.map((label, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={i === active ? "active" : ""}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="panel">Content for {tabs[active]}</div>
    </div>
  );
}`,
    explanation:
      "One number in state — the active index — drives everything. Buttons set it on click; the panel reads tabs[active]; the active button is styled by comparing i === active. Tracking 'which one is selected' as an index is a pattern you'll reuse for carousels, steps, and menus.",
  },
  {
    id: "c11",
    slug: "build-accordion",
    title: "Build an Accordion",
    difficulty: "Intermediate",
    category: "UI Logic",
    tags: ["react", "useState", "toggle"],
    problem:
      "Build an accordion where clicking a question opens its answer and closes any other open one (only one open at a time).",
    example: {
      input: `items = [{q, a}, {q, a}]`,
      output: `Click a question to expand its answer; opening another closes the first.`,
    },
    starterCode: `function Accordion({ items }) {
  // track which index is open (or null for none)
}`,
    hints: [
      "Store the open index, or null when all are closed.",
      "Clicking an already-open item should close it: set back to null.",
    ],
    solution: `import { useState } from "react";

function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div>
      {items.map((item, i) => (
        <div key={i}>
          <button onClick={() => setOpen(open === i ? null : i)}>
            {item.q}
          </button>
          {open === i && <p>{item.a}</p>}
        </div>
      ))}
    </div>
  );
}`,
    explanation:
      "A single 'open' index enforces 'only one open'. Clicking the open item sets it to null (closes it); clicking another replaces the value (closing the previous automatically). {open === i && ...} shows only the matching answer.",
  },
  {
    id: "c12",
    slug: "quiz-logic",
    title: "Quiz Scoring Logic",
    difficulty: "Intermediate",
    category: "Logic",
    tags: ["array", "loop", "compare"],
    problem:
      "Given the correct answers and the user's answers (both arrays of the same length), return how many the user got right.",
    example: {
      input: `score(["a","b","c"], ["a","x","c"])`,
      output: `2`,
    },
    starterCode: `function score(correct, answers) {
  // count how many positions match
}`,
    hints: [
      "Walk both arrays by the same index.",
      "Add 1 each time correct[i] === answers[i].",
    ],
    solution: `function score(correct, answers) {
  let points = 0;
  for (let i = 0; i < correct.length; i++) {
    if (correct[i] === answers[i]) points++;
  }
  return points;
}`,
    explanation:
      "Because both arrays line up by position, you compare index by index and count the matches. This same index-matching idea powers quizzes, diffing two lists, and form-answer checking.",
    tests: [
      {
        name: "counts matching positions",
        call: `score(["a","b","c"], ["a","x","c"])`,
        expected: 2,
      },
      {
        name: "all correct",
        call: `score(["a","b"], ["a","b"])`,
        expected: 2,
      },
      {
        name: "none correct",
        call: `score(["a","b"], ["x","y"])`,
        expected: 0,
      },
    ],
  },
  {
    id: "c13",
    slug: "multi-step-form",
    title: "Multi-Step Form Navigation",
    difficulty: "Advanced",
    category: "Forms",
    tags: ["react", "useState", "steps"],
    problem:
      "Build the navigation logic for a 3-step form: Next moves forward, Back moves backward, and you can't go past the first or last step.",
    example: {
      input: `On step 0, click Back`,
      output: `Stays on step 0 (no negative steps).`,
    },
    starterCode: `function Wizard({ steps }) {
  // track current step; clamp between 0 and steps.length - 1
}`,
    hints: [
      "Math.min stops you going past the last step; Math.max stops going below 0.",
      "next: Math.min(step + 1, last). back: Math.max(step - 1, 0).",
    ],
    solution: `import { useState } from "react";

function Wizard({ steps }) {
  const [step, setStep] = useState(0);
  const last = steps.length - 1;
  const next = () => setStep((s) => Math.min(s + 1, last));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div>
      <h3>Step {step + 1} of {steps.length}: {steps[step]}</h3>
      <button onClick={back} disabled={step === 0}>Back</button>
      <button onClick={next} disabled={step === last}>Next</button>
    </div>
  );
}`,
    explanation:
      "The current step is a single number. Math.min and Math.max 'clamp' it so it can never leave the valid range. Disabling the buttons at the edges makes the UI match the logic. Clamping a value between two bounds is a tiny trick you'll use constantly.",
  },
  {
    id: "c14",
    slug: "reusable-table",
    title: "Reusable Table Component",
    difficulty: "Advanced",
    category: "Components",
    tags: ["react", "props", "map"],
    problem:
      "Build a Table component that takes a list of column definitions and an array of row objects, and renders any data passed in.",
    example: {
      input: `columns = [{key:"name", label:"Name"}], rows = [{name:"Ana"}]`,
      output: `A table with a "Name" header and one row showing "Ana".`,
    },
    starterCode: `function Table({ columns, rows }) {
  // render a header from columns and a row per data object
}`,
    hints: [
      "Map columns to <th> for the header.",
      "For each row, map columns again and read row[col.key].",
    ],
    solution: `function Table({ columns, rows }) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {columns.map((col) => (
              <td key={col.key}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}`,
    explanation:
      "The component knows nothing about your specific data — it just maps columns for the header and, per row, reads row[col.key] for each cell. Driving a component entirely from props/data like this is the heart of reusable UI: one Table works for users, orders, products, anything.",
  },
  {
    id: "c15",
    slug: "group-by-category",
    title: "Count Items per Category",
    difficulty: "Intermediate",
    category: "Reduce",
    tags: ["array", "reduce", "object"],
    problem:
      "Given a list of items each with a category, return an object counting how many items are in each category.",
    example: {
      input: `countByCategory([{cat:"a"},{cat:"b"},{cat:"a"}])`,
      output: `{ a: 2, b: 1 }`,
    },
    starterCode: `function countByCategory(items) {
  // return { category: count }
}`,
    hints: [
      "Use reduce with an empty object {} as the starting value.",
      "For each item: acc[item.cat] = (acc[item.cat] || 0) + 1.",
    ],
    solution: `function countByCategory(items) {
  return items.reduce((acc, item) => {
    acc[item.cat] = (acc[item.cat] || 0) + 1;
    return acc;
  }, {});
}`,
    explanation:
      "reduce builds up an object instead of a number. (acc[item.cat] || 0) reads the current count or starts at 0 if the category is new, then adds 1. Grouping/counting with reduce powers dashboards, tags, and analytics.",
    tests: [
      {
        name: "counts each category",
        call: `countByCategory([{cat:"a"},{cat:"b"},{cat:"a"}])`,
        expected: { a: 2, b: 1 },
      },
      { name: "empty list is empty object", call: `countByCategory([])`, expected: {} },
    ],
  },

  // ---------------------------------------------------------------------------
  // New real-world frontend logic problems
  // ---------------------------------------------------------------------------
  {
    id: "c16",
    slug: "title-case",
    title: "Title-Case a Heading",
    difficulty: "Beginner",
    category: "Strings",
    tags: ["string", "map", "split"],
    problem:
      "Capitalize the first letter of every word in a string (e.g. for a product title or page heading).",
    example: {
      input: `titleCase("frontend logic lab")`,
      output: `"Frontend Logic Lab"`,
    },
    starterCode: `function titleCase(text) {
  // capitalize the first letter of each word
}`,
    hints: [
      "Split the string into words with text.split(' ').",
      "For each word, uppercase the first char and add the rest: w[0].toUpperCase() + w.slice(1).",
      "Join the words back with a space.",
    ],
    solution: `function titleCase(text) {
  return text
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}`,
    explanation:
      "split turns the sentence into an array of words. map transforms each word — first letter uppercased, rest untouched. join glues them back with spaces. split → map → join is one of the most reused string patterns in UI work.",
    tests: [
      {
        name: "capitalizes each word",
        call: `titleCase("frontend logic lab")`,
        expected: "Frontend Logic Lab",
      },
      { name: "single word", call: `titleCase("hello")`, expected: "Hello" },
    ],
  },
  {
    id: "c17",
    slug: "unique-values",
    title: "Get Unique Tags",
    difficulty: "Beginner",
    category: "Arrays",
    tags: ["array", "set", "dedupe"],
    problem:
      "Remove duplicates from a list (e.g. building a list of unique tags or categories for filter chips).",
    example: {
      input: `unique(["react", "css", "react", "html"])`,
      output: `["react", "css", "html"]`,
    },
    starterCode: `function unique(items) {
  // return the list with duplicates removed (keep first occurrence order)
}`,
    hints: [
      "A Set automatically drops duplicate values.",
      "Spread a Set back into an array: [...new Set(items)].",
    ],
    solution: `function unique(items) {
  return [...new Set(items)];
}`,
    explanation:
      "A Set is a collection that can't hold duplicates. Putting the array into a Set drops repeats; spreading it back with [...] gives a normal array in original order. This is the standard way to build unique filter options from data.",
    tests: [
      {
        name: "removes duplicates",
        call: `unique(["react","css","react","html"])`,
        expected: ["react", "css", "html"],
      },
      {
        name: "works with numbers",
        call: `unique([1,2,2,3,3,3])`,
        expected: [1, 2, 3],
      },
    ],
  },
  {
    id: "c18",
    slug: "most-expensive-product",
    title: "Find the Most Expensive Product",
    difficulty: "Intermediate",
    category: "Arrays",
    tags: ["array", "reduce", "max"],
    problem:
      "Return the single product object with the highest price from a list.",
    example: {
      input: `maxByPrice([{name:"A",price:10},{name:"B",price:30}])`,
      output: `{ name: "B", price: 30 }`,
    },
    starterCode: `function maxByPrice(products) {
  // return the product with the highest price
}`,
    hints: [
      "reduce can carry the 'best so far' as it walks the list.",
      "Keep the current item if its price is higher than the best so far.",
    ],
    solution: `function maxByPrice(products) {
  return products.reduce((best, p) => (p.price > best.price ? p : best));
}`,
    explanation:
      "With no starting value, reduce uses the first item as the initial 'best'. Each step compares the current product's price to the best so far and keeps the bigger one. This 'reduce to find the winner' pattern works for max, min, longest, cheapest — anything.",
    tests: [
      {
        name: "returns the priciest",
        call: `maxByPrice([{name:"A",price:10},{name:"B",price:30},{name:"C",price:20}])`,
        expected: { name: "B", price: 30 },
      },
      {
        name: "single item",
        call: `maxByPrice([{name:"Solo",price:5}])`,
        expected: { name: "Solo", price: 5 },
      },
    ],
  },
  {
    id: "c19",
    slug: "average-rating",
    title: "Average Star Rating",
    difficulty: "Intermediate",
    category: "Reduce",
    tags: ["array", "reduce", "math"],
    problem:
      "Calculate the average rating from a list of reviews, rounded to 1 decimal place.",
    example: {
      input: `averageRating([{rating:5},{rating:4}])`,
      output: `4.5`,
    },
    starterCode: `function averageRating(reviews) {
  // average of the rating values, rounded to 1 decimal
}`,
    hints: [
      "Sum all ratings with reduce, then divide by reviews.length.",
      "Round to 1 decimal with Math.round(x * 10) / 10.",
    ],
    solution: `function averageRating(reviews) {
  const sum = reviews.reduce((total, r) => total + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}`,
    explanation:
      "First reduce the ratings into a sum, then divide by how many there are. Math.round(x*10)/10 is the classic trick to round to one decimal place. This is the exact logic behind a product's star average.",
    tests: [
      {
        name: "averages two ratings",
        call: `averageRating([{rating:5},{rating:4}])`,
        expected: 4.5,
      },
      {
        name: "rounds to 1 decimal",
        call: `averageRating([{rating:4},{rating:5},{rating:3}])`,
        expected: 4,
      },
    ],
  },
  {
    id: "c20",
    slug: "chunk-array",
    title: "Split a List into Rows",
    difficulty: "Intermediate",
    category: "Arrays",
    tags: ["array", "loop", "slice"],
    problem:
      "Split a flat array into groups of a given size — useful for laying items into grid rows.",
    example: {
      input: `chunk([1,2,3,4,5], 2)`,
      output: `[[1,2],[3,4],[5]]`,
    },
    starterCode: `function chunk(items, size) {
  // return an array of arrays, each up to "size" long
}`,
    hints: [
      "Step through the array in jumps of `size` (i += size).",
      "Use items.slice(i, i + size) to grab each group.",
    ],
    solution: `function chunk(items, size) {
  const rows = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}`,
    explanation:
      "By jumping the index forward by `size` each loop, slice carves out one group at a time. The last group is naturally shorter if the items don't divide evenly. This is handy for splitting items into rows or pages of cards.",
    tests: [
      {
        name: "groups by size with a partial last row",
        call: `chunk([1,2,3,4,5], 2)`,
        expected: [[1, 2], [3, 4], [5]],
      },
      {
        name: "exact division",
        call: `chunk([1,2,3,4], 2)`,
        expected: [[1, 2], [3, 4]],
      },
    ],
  },
  {
    id: "c21",
    slug: "toggle-filter",
    title: "Toggle a Filter Chip",
    difficulty: "Beginner",
    category: "State Logic",
    tags: ["array", "includes", "immutability"],
    problem:
      "Manage selected filters: if a value is already selected, remove it; otherwise add it. Return a NEW array.",
    example: {
      input: `toggleFilter(["red"], "blue")`,
      output: `["red", "blue"]`,
    },
    starterCode: `function toggleFilter(selected, value) {
  // add value if missing, remove it if present
}`,
    hints: [
      "Use selected.includes(value) to check if it's already there.",
      "Remove with filter; add by spreading: [...selected, value].",
    ],
    solution: `function toggleFilter(selected, value) {
  return selected.includes(value)
    ? selected.filter((v) => v !== value)
    : [...selected, value];
}`,
    explanation:
      "includes checks membership. If present, filter returns a new array without it; if missing, we spread the old array plus the new value. Returning a new array (never mutating) is exactly how you'd update multi-select filter state in React.",
    tests: [
      {
        name: "adds when missing",
        call: `toggleFilter(["red"], "blue")`,
        expected: ["red", "blue"],
      },
      {
        name: "removes when present",
        call: `toggleFilter(["red","blue"], "red")`,
        expected: ["blue"],
      },
    ],
  },
  {
    id: "c22",
    slug: "total-pages",
    title: "Count Total Pages",
    difficulty: "Beginner",
    category: "Pagination",
    tags: ["math", "ceil"],
    problem:
      "Given the total number of items and the page size, return how many pages are needed.",
    example: {
      input: `totalPages(10, 3)`,
      output: `4`,
    },
    starterCode: `function totalPages(totalItems, pageSize) {
  // how many pages fit all the items?
}`,
    hints: [
      "Dividing may give a decimal — you always round UP.",
      "Math.ceil rounds up to the next whole number.",
    ],
    solution: `function totalPages(totalItems, pageSize) {
  return Math.ceil(totalItems / pageSize);
}`,
    explanation:
      "10 items at 3 per page need 4 pages (3 + 3 + 3 + 1). Math.ceil rounds the division up so the leftover items still get their own page. Pair this with the earlier paginate challenge to build full pagination UI.",
    tests: [
      { name: "rounds up partial pages", call: `totalPages(10, 3)`, expected: 4 },
      { name: "exact fit", call: `totalPages(9, 3)`, expected: 3 },
      { name: "no items, no pages", call: `totalPages(0, 3)`, expected: 0 },
    ],
  },
  {
    id: "c23",
    slug: "truncate-text",
    title: "Truncate Long Text",
    difficulty: "Beginner",
    category: "Strings",
    tags: ["string", "conditions", "slice"],
    problem:
      "Shorten text to a maximum length and add '…' when it was cut. If it already fits, return it unchanged.",
    example: {
      input: `truncate("Hello world", 5)`,
      output: `"Hello…"`,
    },
    starterCode: `function truncate(text, max) {
  // add an ellipsis only when the text is longer than max
}`,
    hints: [
      "First check: if text.length <= max, return it as-is.",
      "Otherwise return text.slice(0, max) + '…'.",
    ],
    solution: `function truncate(text, max) {
  if (text.length <= max) return text;
  return text.slice(0, max) + "…";
}`,
    explanation:
      "The early return handles short text cleanly — no ellipsis when none is needed. Otherwise slice keeps the first `max` characters and we append a single ellipsis character. This is the logic behind 'Read more' previews and card descriptions.",
    tests: [
      {
        name: "truncates and adds ellipsis",
        call: `truncate("Hello world", 5)`,
        expected: "Hello…",
      },
      {
        name: "leaves short text unchanged",
        call: `truncate("Hi", 5)`,
        expected: "Hi",
      },
    ],
  },
  {
    id: "c24",
    slug: "search-and-sort",
    title: "Search AND Sort Products",
    difficulty: "Advanced",
    category: "Filtering",
    tags: ["array", "filter", "sort", "chaining"],
    problem:
      "Filter products whose name contains the query (case-insensitive), then sort the matches by price (low → high). This is the real combo behind most product pages.",
    example: {
      input: `searchAndSort(products, "ap")`,
      output: `[{name:"Apricot",price:20},{name:"Apple",price:30}]`,
    },
    starterCode: `function searchAndSort(products, query) {
  // 1) keep products whose name includes query (ignore case)
  // 2) return them sorted by price ascending
}`,
    hints: [
      "Do the filter first, then sort the smaller result.",
      "Chain them: products.filter(...).sort(...).",
      "Lowercase both name and query for the includes check.",
    ],
    solution: `function searchAndSort(products, query) {
  const q = query.toLowerCase();
  return products
    .filter((p) => p.name.toLowerCase().includes(q))
    .sort((a, b) => a.price - b.price);
}`,
    explanation:
      "filter returns a new array, and .sort runs on that result — so chaining them reads top to bottom: first narrow the list, then order it. Because filter already returned a fresh array, sorting it does not mutate the original. Combining filter + sort is exactly how a real catalog with a search box and price ordering works.",
    tests: [
      {
        name: "filters by name then sorts by price",
        call: `searchAndSort([{name:"Apple",price:30},{name:"Banana",price:10},{name:"Apricot",price:20}], "ap")`,
        expected: [
          { name: "Apricot", price: 20 },
          { name: "Apple", price: 30 },
        ],
      },
      {
        name: "no matches returns empty",
        call: `searchAndSort([{name:"Banana",price:10}], "xyz")`,
        expected: [],
      },
    ],
  },
];

export function getChallenge(slug: string): Challenge | undefined {
  return challenges.find((c) => c.slug === slug);
}

/** Unique challenge categories (topics) for the practice page filter. */
export const challengeTopics: string[] = Array.from(
  new Set(challenges.map((c) => c.category))
).sort();
