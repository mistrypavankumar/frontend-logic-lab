import { TestingLesson } from "@/lib/types";

// The Testing track: from "what is a test?" to TDD, mocks, fake timers, DOM
// testing and mutation testing. Every lab scenario is verified by
// scripts/verify-testing.cjs: model tests pass on the real code, catch every
// mutant, and TDD reference code passes the given tests.
//
// NOTE: code lives in template literals — regex backslashes are written "\\s".

export const testingLessons: TestingLesson[] = [
  // =====================================================================
  // BEGINNER
  // =====================================================================
  {
    slug: "what-is-a-test",
    title: "What is a test?",
    level: "Beginner",
    icon: "🧪",
    minutes: 10,
    env: "js",
    summary: "A test is code that runs your code and checks the answer. Learn Arrange → Act → Assert and write your first passing tests.",
    sections: [
      {
        title: "Why test at all?",
        body: [
          "Every time you change code you risk breaking something that used to work. A test is a tiny program that runs your code with a known input and checks the output — automatically, in milliseconds, every time.",
          "Good tests give you three things: confidence to change code (refactoring), early warning when something breaks (a regression), and living documentation that shows exactly how a function is meant to be used.",
        ],
      },
      {
        title: "The shape of every test: Arrange → Act → Assert",
        body: [
          "`describe` groups related tests. `it` (or `test`) is one test case with a sentence-like name. Inside, almost every test does three things: **Arrange** the inputs, **Act** by calling the code once, and **Assert** that the result is what you expected with `expect(...)`.",
          "If no assertion fails, the test passes ✓. If one throws, the test fails ✕ and tells you what it expected and what it actually received.",
        ],
        code: {
          language: "js",
          code: `describe("sum", () => {
  it("adds two numbers", () => {
    const a = 2, b = 3;         // Arrange
    const result = sum(a, b);   // Act
    expect(result).toBe(5);     // Assert
  });
});`,
        },
        output: "✓ sum › adds two numbers (1 ms)\n\nTests: 1 passed, 1 total",
      },
      {
        title: "What a failure looks like",
        body: [
          "A failing test is good news — it found a problem before your users did. Read the message: it shows the assertion, the value you expected, and the value you got.",
        ],
        code: { language: "js", code: `expect(sum(2, 2)).toBe(5);` },
        output: "✕ sum › adds two numbers\n\n  expect(received).toBe(5)\n  Expected: 5\n  Received: 4",
      },
      {
        title: "The testing pyramid",
        body: [
          "**Unit tests** check one small piece (a function) in isolation — fast and plentiful. **Integration tests** check several pieces working together (a form + its validation + an API call). **End-to-end (E2E) tests** drive the real app in a real browser like a user would — slow, so you keep only a few for the critical paths (sign up, checkout).",
          "Most of your tests should be unit tests, fewer integration tests, and a handful of E2E tests.",
        ],
      },
    ],
    keyPoints: [
      "A test runs your code with a known input and checks the output.",
      "Arrange → Act → Assert: set up, do one thing, check the result.",
      "Name tests like sentences: it(\"adds two numbers\").",
      "A test with no expect() can never fail — it proves nothing.",
    ],
    visualization: {
      code: `it("adds two numbers", () => {
  const a = 2, b = 3;
  const result = sum(a, b);
  expect(result).toBe(5);
});`,
      language: "js",
      lanes: ["Arrange", "Act", "Assert", "Result"],
      frames: [
        { note: "The test runner finds the test and calls its function.", line: 1, lanes: {} },
        { note: "Arrange: prepare the inputs the code needs.", line: 2, lanes: { Arrange: ["a = 2", "b = 3"] } },
        { note: "Act: call the code under test — one action per test.", line: 3, lanes: { Arrange: ["a = 2", "b = 3"], Act: ["sum(2, 3) → 5"] } },
        { note: "Assert: compare what you got with what you expected.", line: 4, lanes: { Arrange: ["a = 2", "b = 3"], Act: ["sum(2, 3) → 5"], Assert: ["expect(5).toBe(5) ✓"] } },
        { note: "No assertion threw, so the test passes.", line: 5, lanes: { Arrange: ["a = 2", "b = 3"], Act: ["sum(2, 3) → 5"], Assert: ["expect(5).toBe(5) ✓"], Result: ["✓ adds two numbers"] } },
        { note: "If sum had a bug and returned 6, toBe would throw — and the runner reports exactly what went wrong.", line: 4, lanes: { Act: ["sum(2, 3) → 6"], Assert: ["expect(6).toBe(5) ✕"], Result: ["✕ Expected: 5", "   Received: 6"] } },
      ],
    },
    quiz: [
      {
        prompt: "A test opens the whole app in a real browser, logs in, adds an item to the cart and clicks Pay. What kind of test is it?",
        kind: "multiple-choice",
        choices: ["Unit test", "Integration test", "End-to-end test"],
        answer: "End-to-end test",
        explanation: "It drives the real app through the UI, like a user — that's end-to-end. Keep these few and focused on critical paths: they're slow and brittle compared to unit tests.",
        distractorExplanations: {
          "Unit test": "A unit test checks one small piece (usually a function) in isolation, without a browser.",
          "Integration test": "Integration tests combine a few units, but they don't drive the full app in a real browser.",
        },
      },
      {
        prompt: "Will this test ever fail?",
        code: `it("adds numbers", () => {
  sum(2, 3);
});`,
        kind: "multiple-choice",
        choices: ["Yes, if sum is wrong", "No — it never checks the result"],
        answer: "No — it never checks the result",
        explanation: "There's no expect(), so nothing can throw. Even if sum returned \"banana\" this test would pass. A test must assert something to prove anything.",
        distractorExplanations: {
          "Yes, if sum is wrong": "Only an assertion can make a test fail (or a crash). This test calls sum but never looks at what it returned.",
        },
      },
    ],
    scenarios: [
      {
        id: "sum",
        title: "sum(a, b)",
        description: "Write at least 2 passing tests for sum. The first one is done — add one for negative numbers (or zero).",
        goal: "pass",
        minTests: 2,
        code: `function sum(a, b) {
  return a + b;
}`,
        starterTests: `describe("sum", () => {
  it("adds two positive numbers", () => {
    // Arrange
    const a = 2, b = 3;
    // Act
    const result = sum(a, b);
    // Assert
    expect(result).toBe(5);
  });

  // TODO: add a test for negative numbers
});`,
        solutionTests: `describe("sum", () => {
  it("adds two positive numbers", () => {
    expect(sum(2, 3)).toBe(5);
  });

  it("adds negative numbers", () => {
    expect(sum(-2, -3)).toBe(-5);
  });

  it("returns the same number when adding zero", () => {
    expect(sum(7, 0)).toBe(7);
  });
});`,
        hint: "Copy the first it(...) block, change the name and the numbers: expect(sum(-2, -3)).toBe(-5).",
      },
      {
        id: "capitalize",
        title: "capitalize(word)",
        description: "capitalize turns \"hELLO\" into \"Hello\". Write at least 2 tests — try a normal word and a messy one.",
        goal: "pass",
        minTests: 2,
        code: `function capitalize(word) {
  if (!word) return "";
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}`,
        starterTests: `describe("capitalize", () => {
  it("capitalizes a lowercase word", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  // TODO: what about "hELLO"? or an empty string?
});`,
        solutionTests: `describe("capitalize", () => {
  it("capitalizes a lowercase word", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("fixes mixed case", () => {
    expect(capitalize("hELLO")).toBe("Hello");
  });

  it("returns an empty string for empty input", () => {
    expect(capitalize("")).toBe("");
  });
});`,
      },
      {
        id: "is-even",
        title: "isEven(n)",
        description: "Write at least 3 tests for isEven: an even number, an odd number, and one surprise (0 or a negative number).",
        goal: "pass",
        minTests: 3,
        code: `function isEven(n) {
  return n % 2 === 0;
}`,
        starterTests: `describe("isEven", () => {
  it("returns true for an even number", () => {
    expect(isEven(4)).toBe(true);
  });

  // TODO: an odd number, and 0 or a negative number
});`,
        solutionTests: `describe("isEven", () => {
  it("returns true for an even number", () => {
    expect(isEven(4)).toBe(true);
  });

  it("returns false for an odd number", () => {
    expect(isEven(7)).toBe(false);
  });

  it("treats 0 as even", () => {
    expect(isEven(0)).toBe(true);
  });

  it("works for negative numbers", () => {
    expect(isEven(-6)).toBe(true);
  });
});`,
      },
    ],
  },

  {
    slug: "matchers",
    title: "Assertions & matchers",
    level: "Beginner",
    icon: "🎯",
    minutes: 15,
    env: "js",
    summary: "toBe vs toEqual, truthiness, numbers, strings, arrays, objects and errors — pick the right matcher and your failures explain themselves.",
    sections: [
      {
        title: "toBe vs toEqual — the #1 beginner mistake",
        body: [
          "`toBe` checks identity with `===` (well, `Object.is`). It's perfect for numbers, strings and booleans. But two objects or arrays with the same contents are still two different objects, so `toBe` fails.",
          "`toEqual` compares by value — recursively checking every key and item. Use it for arrays and objects.",
        ],
        code: {
          language: "js",
          code: `expect(2 + 2).toBe(4);                         // ✓ primitives
expect([1, 2]).toBe([1, 2]);                   // ✕ different arrays
expect([1, 2]).toEqual([1, 2]);                // ✓ same contents
expect({ a: 1 }).toEqual({ a: 1 });            // ✓`,
        },
      },
      {
        title: "The everyday matchers",
        body: [
          "Truthiness: `toBeTruthy`, `toBeFalsy`, `toBeNull`, `toBeUndefined`, `toBeDefined`. Numbers: `toBeGreaterThan`, `toBeLessThanOrEqual`, and `toBeCloseTo` for decimals. Strings: `toMatch` with a substring or regex. Arrays: `toContain`, `toHaveLength`. Objects: `toHaveProperty`.",
          "Put `.not` in front of any matcher to flip it: `expect(list).not.toContain(\"spam\")`.",
        ],
        code: {
          language: "js",
          code: `expect(user.email).toMatch("@");
expect(cart.items).toHaveLength(3);
expect(tags).toContain("sale");
expect(order).toHaveProperty("status", "paid");
expect(0.1 + 0.2).toBeCloseTo(0.3);            // floating point!
expect(errors).not.toContain("required");`,
        },
      },
      {
        title: "Testing that code throws",
        body: [
          "To check an error, give `expect` a **function** that calls your code — not the result of calling it. If you call it directly, the error is thrown before `expect` ever runs and the test crashes instead of asserting.",
        ],
        code: {
          language: "js",
          code: `expect(() => divide(1, 0)).toThrow();                     // ✓
expect(() => divide(1, 0)).toThrow("Cannot divide by zero"); // ✓ checks the message
expect(divide(1, 0)).toThrow();                            // ✕ throws too early`,
        },
      },
    ],
    keyPoints: [
      "toBe for primitives, toEqual for arrays and objects.",
      "toBeCloseTo for decimals — 0.1 + 0.2 is not exactly 0.3.",
      "Wrap code that should throw: expect(() => fn()).toThrow().",
      "A precise matcher gives a precise failure message.",
    ],
    quiz: [
      {
        prompt: "Does this test pass?",
        code: `expect({ name: "Ada" }).toBe({ name: "Ada" });`,
        kind: "multiple-choice",
        choices: ["Yes", "No"],
        answer: "No",
        explanation: "toBe uses identity (===). Two separate object literals are never the same object, even with identical contents. Use toEqual.",
        distractorExplanations: { Yes: "The contents match, but toBe doesn't compare contents — it checks whether both sides are the very same object." },
      },
      {
        prompt: "Which assertion correctly checks 0.1 + 0.2?",
        kind: "multiple-choice",
        choices: ["expect(0.1 + 0.2).toBe(0.3)", "expect(0.1 + 0.2).toBeCloseTo(0.3)", "expect(0.1 + 0.2).toEqual(0.3)"],
        answer: "expect(0.1 + 0.2).toBeCloseTo(0.3)",
        explanation: "0.1 + 0.2 is 0.30000000000000004 in JavaScript (binary floating point). toBeCloseTo compares within a small tolerance.",
        distractorExplanations: {
          "expect(0.1 + 0.2).toBe(0.3)": "0.1 + 0.2 === 0.30000000000000004, so an exact comparison fails.",
          "expect(0.1 + 0.2).toEqual(0.3)": "toEqual is still exact for numbers — the tiny rounding error makes it fail.",
        },
      },
    ],
    scenarios: [
      {
        id: "create-user",
        title: "createUser — objects",
        description: "This test fails. Run it, read the error, then fix the assertion so it compares the object by value. Your tests must use toEqual.",
        goal: "pass",
        minTests: 1,
        mustUse: ["toEqual("],
        code: `function createUser(name) {
  return { name, role: "user", tags: [] };
}`,
        starterTests: `describe("createUser", () => {
  it("creates a user object", () => {
    const user = createUser("Ada");
    // ❌ Run me — then read the error message
    expect(user).toBe({ name: "Ada", role: "user", tags: [] });
  });
});`,
        solutionTests: `describe("createUser", () => {
  it("creates a user object", () => {
    const user = createUser("Ada");
    expect(user).toEqual({ name: "Ada", role: "user", tags: [] });
  });

  it("starts with no tags", () => {
    expect(createUser("Ada").tags).toHaveLength(0);
  });
});`,
        hint: "toBe checks identity; toEqual checks contents.",
      },
      {
        id: "divide",
        title: "divide — errors",
        description: "divide throws on division by zero. Add a test that proves it — your tests must use toThrow.",
        goal: "pass",
        minTests: 2,
        mustUse: ["toThrow("],
        code: `function divide(a, b) {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
}`,
        starterTests: `describe("divide", () => {
  it("divides two numbers", () => {
    expect(divide(10, 2)).toBe(5);
  });

  // TODO: check that divide(1, 0) throws "Cannot divide by zero"
});`,
        solutionTests: `describe("divide", () => {
  it("divides two numbers", () => {
    expect(divide(10, 2)).toBe(5);
  });

  it("throws when dividing by zero", () => {
    expect(() => divide(1, 0)).toThrow("Cannot divide by zero");
  });
});`,
        hint: "Wrap the call in an arrow function: expect(() => divide(1, 0)).toThrow(\"…\").",
      },
      {
        id: "total",
        title: "total — decimals",
        description: "The money test fails because of floating point. Fix it — your tests must use toBeCloseTo.",
        goal: "pass",
        minTests: 1,
        mustUse: ["toBeCloseTo("],
        code: `function total(prices) {
  return prices.reduce((sum, p) => sum + p, 0);
}`,
        starterTests: `describe("total", () => {
  it("adds up prices", () => {
    // ❌ Run me — why does 0.1 + 0.2 fail?
    expect(total([0.1, 0.2])).toBe(0.3);
  });
});`,
        solutionTests: `describe("total", () => {
  it("adds up prices", () => {
    expect(total([0.1, 0.2])).toBeCloseTo(0.3);
  });

  it("is 0 for an empty cart", () => {
    expect(total([])).toBe(0);
  });
});`,
      },
    ],
  },

  {
    slug: "edge-cases",
    title: "Think like a tester: edge cases",
    level: "Beginner",
    icon: "🔍",
    minutes: 15,
    env: "js",
    summary: "Bugs hide at the edges: boundaries, empty input, weird spacing. Learn boundary values and equivalence partitions — then hunt real bugs.",
    sections: [
      {
        title: "Happy-path tests catch almost nothing",
        body: [
          "A test that only checks the obvious case (\"30-year-olds can vote\") passes for the correct code — and for most buggy versions too. Bugs live where behaviour **changes**: at boundaries, on empty input, and with unexpected values.",
          "In this lesson's lab you'll see it directly: we run your tests against several deliberately broken versions of the code (**mutants**). A good suite catches every one.",
        ],
      },
      {
        title: "Boundary value analysis",
        body: [
          "If a rule says `age >= 18`, test **17, 18 and 19** — just below, exactly on, and just above the boundary. The most common bug in the world is an off-by-one: `>` instead of `>=`.",
        ],
        code: {
          language: "js",
          code: `expect(canVote(17)).toBe(false); // just below
expect(canVote(18)).toBe(true);  // exactly on the boundary
expect(canVote(19)).toBe(true);  // just above`,
        },
      },
      {
        title: "Equivalence partitions",
        body: [
          "Split inputs into groups that should behave the same, and pick one value from each group: for `clamp(n, 0, 10)` that's below the range, inside it, and above it — plus the two boundaries.",
          "The classic edge-case checklist: **empty** (\"\", [], 0), **one item**, **many items**, **negative numbers**, **extra whitespace**, **mixed case**, **null/undefined**, **very large values**.",
        ],
      },
    ],
    keyPoints: [
      "Test just below, on, and just above every boundary.",
      "One value per equivalence partition is enough.",
      "Always try empty input and messy input.",
      "A suite is only as good as the bugs it catches.",
    ],
    quiz: [
      {
        prompt: "A discount applies to orders of $50 or more. Which set of test values is best?",
        kind: "multiple-choice",
        choices: ["10, 100", "49.99, 50, 50.01", "50, 60, 70"],
        answer: "49.99, 50, 50.01",
        explanation: "Boundary value analysis: just below, exactly on, and just above $50. That's where an off-by-one (> vs >=) would hide.",
        distractorExplanations: {
          "10, 100": "Both are far from the boundary — a > vs >= bug would pass both.",
          "50, 60, 70": "No value below the boundary, so a bug that always applies the discount slips through.",
        },
      },
    ],
    scenarios: [
      {
        id: "can-vote",
        title: "canVote(age)",
        description: "People aged 18 and over can vote. The starter test only checks 30 — run it and look at the Bug hunt. Add tests until every bug is caught.",
        goal: "catch",
        code: `function canVote(age) {
  return age >= 18;
}`,
        starterTests: `describe("canVote", () => {
  it("lets adults vote", () => {
    expect(canVote(30)).toBe(true);
  });
});`,
        solutionTests: `describe("canVote", () => {
  it("lets adults vote", () => {
    expect(canVote(30)).toBe(true);
  });

  it("lets 18-year-olds vote (boundary)", () => {
    expect(canVote(18)).toBe(true);
  });

  it("does not let 17-year-olds vote", () => {
    expect(canVote(17)).toBe(false);
  });
});`,
        mutants: [
          { label: "Uses > instead of >= (18-year-olds rejected)", code: `function canVote(age) {\n  return age > 18;\n}` },
          { label: "Lets 17-year-olds vote", code: `function canVote(age) {\n  return age >= 17;\n}` },
          { label: "Everyone can vote", code: `function canVote(age) {\n  return true;\n}` },
        ],
        hint: "Test 17, 18 and 19 — just below, on, and above the boundary.",
      },
      {
        id: "clamp",
        title: "clamp(n, min, max)",
        description: "clamp keeps a number inside [min, max]: clamp(15, 0, 10) → 10. Catch all 3 bugs.",
        goal: "catch",
        code: `function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}`,
        starterTests: `describe("clamp", () => {
  it("keeps a number that is already in range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });
});`,
        solutionTests: `describe("clamp", () => {
  it("keeps a number that is already in range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("raises numbers below the range to min", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("lowers numbers above the range to max", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("keeps the exact boundaries", () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });
});`,
        mutants: [
          { label: "Ignores the upper limit", code: `function clamp(n, min, max) {\n  return Math.max(n, min);\n}` },
          { label: "Ignores the lower limit", code: `function clamp(n, min, max) {\n  return Math.min(n, max);\n}` },
          { label: "Off-by-one at the lower boundary", code: `function clamp(n, min, max) {\n  if (n === min) return min + 1;\n  return Math.min(Math.max(n, min), max);\n}` },
        ],
        hint: "One value below the range, one above, and the two exact boundaries.",
      },
      {
        id: "initials",
        title: "getInitials(name)",
        description: "getInitials(\"ada lovelace\") → \"AL\". Messy input breaks naive code. Catch all 4 bugs.",
        goal: "catch",
        code: `function getInitials(fullName) {
  return fullName
    .trim()
    .split(/\\s+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .join("");
}`,
        starterTests: `describe("getInitials", () => {
  it("returns the initials of a full name", () => {
    expect(getInitials("Ada Lovelace")).toBe("AL");
  });
});`,
        solutionTests: `describe("getInitials", () => {
  it("returns the initials of a full name", () => {
    expect(getInitials("Ada Lovelace")).toBe("AL");
  });

  it("uppercases lowercase names", () => {
    expect(getInitials("grace hopper")).toBe("GH");
  });

  it("ignores extra spaces", () => {
    expect(getInitials("  ada   lovelace ")).toBe("AL");
  });

  it("uses every part of the name", () => {
    expect(getInitials("Mary Ann Smith")).toBe("MAS");
  });

  it("returns an empty string for an empty name", () => {
    expect(getInitials("")).toBe("");
  });
});`,
        mutants: [
          { label: "Breaks on extra spaces", code: `function getInitials(fullName) {\n  return fullName\n    .split(" ")\n    .map((part) => part[0].toUpperCase())\n    .join("");\n}` },
          { label: "Forgets to uppercase", code: `function getInitials(fullName) {\n  return fullName.trim().split(/\\s+/).filter(Boolean).map((part) => part[0]).join("");\n}` },
          { label: "Only uses the first name", code: `function getInitials(fullName) {\n  return fullName.trim().split(/\\s+/).filter(Boolean).slice(0, 1).map((part) => part[0].toUpperCase()).join("");\n}` },
          { label: "Crashes on an empty string", code: `function getInitials(fullName) {\n  return fullName.trim().split(/\\s+/).map((part) => part[0].toUpperCase()).join("");\n}` },
        ],
        hint: "Try lowercase input, extra spaces, three names, and an empty string.",
      },
    ],
  },

  // =====================================================================
  // INTERMEDIATE
  // =====================================================================
  {
    slug: "async-testing",
    title: "Testing async code",
    level: "Intermediate",
    icon: "⏳",
    minutes: 20,
    env: "js",
    summary: "Promises, async/await, resolves/rejects — and the missing-await bug that makes broken tests pass.",
    sections: [
      {
        title: "Make the test wait",
        body: [
          "If your code returns a promise, the test must **wait** for it. Mark the test `async` and `await` the result — otherwise the test finishes before the promise settles, and nothing gets checked.",
        ],
        code: {
          language: "js",
          code: `it("loads the user's name", async () => {
  const name = await getUserName(api, 1);
  expect(name).toBe("Ada");
});`,
        },
      },
      {
        title: "resolves and rejects",
        body: [
          "`expect(promise).resolves.toBe(x)` waits for the promise and checks its value. `expect(promise).rejects.toThrow(\"msg\")` checks that it fails with an error. Both return a promise — so you **must** `await` (or `return`) them.",
        ],
        code: {
          language: "js",
          code: `await expect(getUserName(api, 1)).resolves.toBe("Ada");
await expect(getUserName(api, 99)).rejects.toThrow("User not found");`,
        },
      },
      {
        title: "The silent killer: a missing await",
        body: [
          "Without `await`, the assertion runs **after** the test has already been marked as passed. The test goes green even when the code is broken. This is one of the most common real-world testing bugs.",
          "This lab warns you when it spots it — and the Bug hunt shows the broken code your test let through.",
        ],
        code: {
          language: "js",
          code: `// ❌ always passes — the assertion is never awaited
it("rejects bad config", () => {
  expect(loadConfig("{}")).rejects.toThrow("apiUrl");
});

// ✅ actually checks
it("rejects bad config", async () => {
  await expect(loadConfig("{}")).rejects.toThrow("apiUrl");
});`,
        },
      },
    ],
    keyPoints: [
      "async test + await the code under test.",
      "await expect(p).resolves / .rejects — never forget the await.",
      "Test both the success path and the failure path.",
      "A missing await turns a test into a false positive.",
    ],
    quiz: [
      {
        prompt: "loadData() returns a promise that rejects. Does this test pass?",
        code: `it("fails nicely", () => {
  expect(loadData()).resolves.toEqual([]);
});`,
        kind: "multiple-choice",
        choices: ["It fails", "It passes — by accident"],
        answer: "It passes — by accident",
        explanation: "The assertion returns a promise that nobody awaits. The test function finishes immediately with no error, so it's reported as passing. Add async + await.",
        distractorExplanations: { "It fails": "It should — but the failure happens after the test already finished, so the runner never sees it." },
      },
    ],
    scenarios: [
      {
        id: "user-name",
        title: "getUserName(api, id)",
        description: "A fake api is set up for you (user 1 exists, others don't). The starter test is too weak — catch all 3 bugs. Test the error path too.",
        goal: "catch",
        code: `async function getUserName(api, id) {
  const user = await api.getUser(id);
  if (!user) throw new Error("User not found");
  return user.name.trim();
}`,
        starterTests: `const api = {
  getUser: async (id) => (id === 1 ? { name: "  Ada  " } : null),
};

describe("getUserName", () => {
  it("returns the user's name", async () => {
    const name = await getUserName(api, 1);
    expect(name).toBeDefined();
  });
});`,
        solutionTests: `const api = {
  getUser: async (id) => (id === 1 ? { name: "  Ada  " } : null),
};

describe("getUserName", () => {
  it("returns the trimmed name", async () => {
    await expect(getUserName(api, 1)).resolves.toBe("Ada");
  });

  it("rejects when the user doesn't exist", async () => {
    await expect(getUserName(api, 2)).rejects.toThrow("User not found");
  });
});`,
        mutants: [
          { label: "Doesn't trim the name", code: `async function getUserName(api, id) {\n  const user = await api.getUser(id);\n  if (!user) throw new Error("User not found");\n  return user.name;\n}` },
          { label: "Returns null instead of throwing", code: `async function getUserName(api, id) {\n  const user = await api.getUser(id);\n  if (!user) return null;\n  return user.name.trim();\n}` },
          { label: "Returns the whole user object", code: `async function getUserName(api, id) {\n  const user = await api.getUser(id);\n  if (!user) throw new Error("User not found");\n  return user;\n}` },
        ],
        hint: "toBeDefined is too weak — check the exact value with resolves.toBe, and the error with rejects.toThrow.",
      },
      {
        id: "load-config",
        title: "loadConfig — the missing await",
        description: "This test LOOKS right but has a hidden bug. Run it, check the Bug hunt and the warnings, then fix it and catch all 3 bugs.",
        goal: "catch",
        code: `async function loadConfig(text) {
  const config = JSON.parse(text);
  if (!config.apiUrl) throw new Error("Invalid config: apiUrl is required");
  return { retries: 3, ...config };
}`,
        starterTests: `describe("loadConfig", () => {
  it("rejects a config without apiUrl", () => {
    // ⚠️ Something is missing on the next line…
    expect(loadConfig('{"retries": 5}')).rejects.toThrow("apiUrl");
  });
});`,
        solutionTests: `describe("loadConfig", () => {
  it("rejects a config without apiUrl", async () => {
    await expect(loadConfig('{"retries": 5}')).rejects.toThrow("apiUrl");
  });

  it("adds the default retries", async () => {
    await expect(loadConfig('{"apiUrl": "/api"}')).resolves.toEqual({ apiUrl: "/api", retries: 3 });
  });

  it("keeps the user's own retries", async () => {
    await expect(loadConfig('{"apiUrl": "/api", "retries": 5}')).resolves.toEqual({ apiUrl: "/api", retries: 5 });
  });
});`,
        mutants: [
          { label: "Never validates apiUrl", code: `async function loadConfig(text) {\n  const config = JSON.parse(text);\n  return { retries: 3, ...config };\n}` },
          { label: "Drops the default retries", code: `async function loadConfig(text) {\n  const config = JSON.parse(text);\n  if (!config.apiUrl) throw new Error("Invalid config: apiUrl is required");\n  return config;\n}` },
          { label: "Default overrides the user's value", code: `async function loadConfig(text) {\n  const config = JSON.parse(text);\n  if (!config.apiUrl) throw new Error("Invalid config: apiUrl is required");\n  return { ...config, retries: 3 };\n}` },
        ],
        hint: "Make the test async and put await in front of expect(...).rejects.",
      },
      {
        id: "retry",
        title: "retry(fn, attempts)",
        description: "retry calls fn until it succeeds, up to `attempts` times, then throws the last error. Catch all 3 bugs — count how many times fn was called.",
        goal: "catch",
        code: `async function retry(fn, attempts) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}`,
        starterTests: `describe("retry", () => {
  it("returns the value when fn succeeds", async () => {
    const result = await retry(async () => "ok", 3);
    expect(result).toBe("ok");
  });
});`,
        solutionTests: `describe("retry", () => {
  it("retries until fn succeeds", async () => {
    let calls = 0;
    const flaky = async () => {
      calls++;
      if (calls < 3) throw new Error("not yet");
      return "ok";
    };
    await expect(retry(flaky, 3)).resolves.toBe("ok");
    expect(calls).toBe(3);
  });

  it("gives up after the last attempt and rethrows", async () => {
    let calls = 0;
    const broken = async () => {
      calls++;
      throw new Error("down");
    };
    await expect(retry(broken, 2)).rejects.toThrow("down");
    expect(calls).toBe(2);
  });
});`,
        mutants: [
          { label: "Tries one time too few", code: `async function retry(fn, attempts) {\n  let lastError;\n  for (let i = 0; i < attempts - 1; i++) {\n    try {\n      return await fn();\n    } catch (err) {\n      lastError = err;\n    }\n  }\n  throw lastError;\n}` },
          { label: "Tries one time too many", code: `async function retry(fn, attempts) {\n  let lastError;\n  for (let i = 0; i <= attempts; i++) {\n    try {\n      return await fn();\n    } catch (err) {\n      lastError = err;\n    }\n  }\n  throw lastError;\n}` },
          { label: "Swallows the final error", code: `async function retry(fn, attempts) {\n  for (let i = 0; i < attempts; i++) {\n    try {\n      return await fn();\n    } catch (err) {}\n  }\n}` },
        ],
        hint: "Make a fake fn that fails twice then succeeds, and count its calls.",
      },
    ],
  },

  {
    slug: "mocks-spies",
    title: "Mocks, spies & stubs",
    level: "Intermediate",
    icon: "🎭",
    minutes: 20,
    env: "js",
    summary: "Replace emails, network calls and storage with fakes you control — then assert how your code used them.",
    sections: [
      {
        title: "Why fake things?",
        body: [
          "Real dependencies are slow (network), unpredictable (time, randomness) or have side effects you don't want in a test (sending a real email). Pass a **fake** in instead, and your test becomes fast, repeatable and safe.",
          "Design tip: code that takes its dependencies as arguments (`notifyUser(user, sendEmail)`) is far easier to test than code that imports them directly.",
        ],
      },
      {
        title: "jest.fn() — a mock function",
        body: [
          "`jest.fn()` creates a function that records every call. Then you can assert **how** it was used: `toHaveBeenCalled`, `toHaveBeenCalledTimes(n)`, `toHaveBeenCalledWith(...args)`.",
          "Make it return something with `mockReturnValue(x)`, or a promise with `mockResolvedValue(x)` / `mockRejectedValue(err)`.",
        ],
        code: {
          language: "js",
          code: `const sendEmail = jest.fn();
notifyUser({ email: "ada@example.com", optIn: true }, sendEmail);

expect(sendEmail).toHaveBeenCalledTimes(1);
expect(sendEmail).toHaveBeenCalledWith("ada@example.com", "Welcome aboard!");

const fetchJson = jest.fn().mockResolvedValue({ items: [] });`,
        },
      },
      {
        title: "jest.spyOn — watch a real method",
        body: [
          "`jest.spyOn(object, \"method\")` wraps an existing method so calls are recorded (the original still runs). Use it when the dependency lives on an object, like `localStorage.removeItem`.",
          "Don't over-mock: mock the **boundaries** (network, time, storage) and keep your own logic real. A test that mocks everything only tests the mocks.",
        ],
        code: {
          language: "js",
          code: `const storage = { removeItem() {} };
const spy = jest.spyOn(storage, "removeItem");
logout(storage);
expect(spy).toHaveBeenCalledWith("token");`,
        },
      },
    ],
    keyPoints: [
      "Mock what's slow, random or has side effects.",
      "Pass dependencies in — it makes code testable.",
      "Assert calls: toHaveBeenCalledTimes / toHaveBeenCalledWith.",
      "Mock boundaries, not your own logic.",
    ],
    quiz: [
      {
        prompt: "Why might this test still pass when notifyUser sends the email twice?",
        code: `const sendEmail = jest.fn();
notifyUser(user, sendEmail);
expect(sendEmail).toHaveBeenCalled();`,
        kind: "multiple-choice",
        choices: ["toHaveBeenCalled only checks 'at least once'", "jest.fn() ignores the second call"],
        answer: "toHaveBeenCalled only checks 'at least once'",
        explanation: "Use toHaveBeenCalledTimes(1) to pin the exact number of calls.",
        distractorExplanations: { "jest.fn() ignores the second call": "The mock records every call — the assertion just doesn't look at the count." },
      },
    ],
    scenarios: [
      {
        id: "notify-user",
        title: "notifyUser — jest.fn()",
        description: "Only opted-in users get the welcome email. The starter test only checks the return value — catch all 3 bugs by asserting on the sendEmail mock.",
        goal: "catch",
        code: `function notifyUser(user, sendEmail) {
  if (!user.optIn) return false;
  sendEmail(user.email, "Welcome aboard!");
  return true;
}`,
        starterTests: `describe("notifyUser", () => {
  it("returns true for opted-in users", () => {
    const sendEmail = jest.fn();
    const result = notifyUser({ email: "ada@example.com", optIn: true }, sendEmail);
    expect(result).toBe(true);
  });
});`,
        solutionTests: `describe("notifyUser", () => {
  it("emails opted-in users once, with the right subject", () => {
    const sendEmail = jest.fn();
    notifyUser({ email: "ada@example.com", optIn: true }, sendEmail);
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith("ada@example.com", "Welcome aboard!");
  });

  it("never emails users who opted out", () => {
    const sendEmail = jest.fn();
    const result = notifyUser({ email: "bob@example.com", optIn: false }, sendEmail);
    expect(result).toBe(false);
    expect(sendEmail).not.toHaveBeenCalled();
  });
});`,
        mutants: [
          { label: "Emails users who opted out", code: `function notifyUser(user, sendEmail) {\n  sendEmail(user.email, "Welcome aboard!");\n  return true;\n}` },
          { label: "Wrong subject line", code: `function notifyUser(user, sendEmail) {\n  if (!user.optIn) return false;\n  sendEmail(user.email, "Welcome!");\n  return true;\n}` },
          { label: "Sends the email twice", code: `function notifyUser(user, sendEmail) {\n  if (!user.optIn) return false;\n  sendEmail(user.email, "Welcome aboard!");\n  sendEmail(user.email, "Welcome aboard!");\n  return true;\n}` },
        ],
        hint: "expect(sendEmail).toHaveBeenCalledTimes(1) and toHaveBeenCalledWith(email, subject). Also test an opted-out user.",
      },
      {
        id: "load-in-stock",
        title: "loadInStock — mocking fetch",
        description: "loadInStock fetches /api/products and returns names of products in stock. Use a mock fetchJson with mockResolvedValue. Catch all 3 bugs.",
        goal: "catch",
        code: `async function loadInStock(fetchJson) {
  const data = await fetchJson("/api/products");
  return data.items.filter((p) => p.stock > 0).map((p) => p.name);
}`,
        starterTests: `describe("loadInStock", () => {
  it("returns product names", async () => {
    const fetchJson = jest.fn().mockResolvedValue({
      items: [{ name: "Pen", stock: 4 }],
    });
    const names = await loadInStock(fetchJson);
    expect(names).toEqual(["Pen"]);
  });
});`,
        solutionTests: `describe("loadInStock", () => {
  it("returns only products that are in stock", async () => {
    const fetchJson = jest.fn().mockResolvedValue({
      items: [
        { name: "Pen", stock: 4 },
        { name: "Ink", stock: 0 },
      ],
    });
    await expect(loadInStock(fetchJson)).resolves.toEqual(["Pen"]);
  });

  it("calls the products endpoint", async () => {
    const fetchJson = jest.fn().mockResolvedValue({ items: [] });
    await loadInStock(fetchJson);
    expect(fetchJson).toHaveBeenCalledWith("/api/products");
  });
});`,
        mutants: [
          { label: "Calls the wrong URL", code: `async function loadInStock(fetchJson) {\n  const data = await fetchJson("/api/product");\n  return data.items.filter((p) => p.stock > 0).map((p) => p.name);\n}` },
          { label: "Keeps out-of-stock items", code: `async function loadInStock(fetchJson) {\n  const data = await fetchJson("/api/products");\n  return data.items.map((p) => p.name);\n}` },
          { label: "Treats stock 0 as in stock", code: `async function loadInStock(fetchJson) {\n  const data = await fetchJson("/api/products");\n  return data.items.filter((p) => p.stock >= 0).map((p) => p.name);\n}` },
        ],
        hint: "Include a product with stock: 0, and check the URL with toHaveBeenCalledWith.",
      },
      {
        id: "logout",
        title: "logout — jest.spyOn",
        description: "logout clears the token and the user from storage, then returns the login route. Spy on storage.removeItem and catch all 3 bugs.",
        goal: "catch",
        code: `function logout(storage) {
  storage.removeItem("token");
  storage.removeItem("user");
  return "/login";
}`,
        starterTests: `describe("logout", () => {
  it("redirects to the login page", () => {
    const storage = { removeItem() {} };
    expect(logout(storage)).toBe("/login");
  });
});`,
        solutionTests: `describe("logout", () => {
  it("redirects to the login page", () => {
    const storage = { removeItem() {} };
    expect(logout(storage)).toBe("/login");
  });

  it("clears the token and the user", () => {
    const storage = { removeItem() {} };
    const spy = jest.spyOn(storage, "removeItem");
    logout(storage);
    expect(spy).toHaveBeenCalledWith("token");
    expect(spy).toHaveBeenCalledWith("user");
    expect(spy).toHaveBeenCalledTimes(2);
  });
});`,
        mutants: [
          { label: "Forgets to remove the user", code: `function logout(storage) {\n  storage.removeItem("token");\n  return "/login";\n}` },
          { label: "Removes the wrong key", code: `function logout(storage) {\n  storage.removeItem("tokens");\n  storage.removeItem("user");\n  return "/login";\n}` },
          { label: "Redirects to the home page", code: `function logout(storage) {\n  storage.removeItem("token");\n  storage.removeItem("user");\n  return "/";\n}` },
        ],
      },
    ],
  },

  {
    slug: "fake-timers",
    title: "Fake timers: debounce & time",
    level: "Intermediate",
    icon: "⏱️",
    minutes: 15,
    env: "js",
    summary: "Don't wait real seconds in tests. Freeze time with fake timers and fast-forward it to test debounce, toasts and polling.",
    sections: [
      {
        title: "Real time makes tests slow and flaky",
        body: [
          "Code that uses `setTimeout` (debounce, auto-hiding toasts, polling) is awkward to test with real time: waiting 3 seconds per test is slow, and timing can vary on a busy CI machine — the classic **flaky test**.",
          "Fake timers replace `setTimeout`/`setInterval` with a clock **you** control. Nothing fires until you move time forward.",
        ],
        code: {
          language: "js",
          code: `beforeEach(() => {
  jest.useFakeTimers();
});

it("calls after the wait", () => {
  const fn = jest.fn();
  const debounced = debounce(fn, 300);
  debounced("a");

  jest.advanceTimersByTime(299);
  expect(fn).not.toHaveBeenCalled();   // not yet!

  jest.advanceTimersByTime(1);
  expect(fn).toHaveBeenCalledWith("a"); // exactly at 300 ms
});`,
        },
      },
      {
        title: "Test the timing boundaries",
        body: [
          "Just like number boundaries, test **just before** the timer (nothing happened yet) and **exactly when** it fires. For debounce, also check that rapid calls collapse into one call with the latest arguments.",
          "`jest.runAllTimers()` fast-forwards until no timers are left — handy when you don't care about exact timing.",
        ],
      },
    ],
    keyPoints: [
      "jest.useFakeTimers() in beforeEach.",
      "jest.advanceTimersByTime(ms) moves the fake clock.",
      "Check just before AND exactly at the deadline.",
      "Fake time = fast, deterministic tests (no flakiness).",
    ],
    scenarios: [
      {
        id: "debounce",
        title: "debounce(fn, wait)",
        description: "debounce waits until calls stop for `wait` ms, then calls fn once with the latest arguments. Catch all 3 bugs with fake timers.",
        goal: "catch",
        code: `function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}`,
        starterTests: `describe("debounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it("eventually calls the function", () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);
    debounced("a");
    jest.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalled();
  });
});`,
        solutionTests: `describe("debounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it("waits for the full delay", () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);
    debounced("a");
    jest.advanceTimersByTime(299);
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("collapses rapid calls into one, with the latest arguments", () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);
    debounced("a");
    debounced("b");
    debounced("c");
    jest.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("c");
  });
});`,
        mutants: [
          { label: "Calls immediately (no delay)", code: `function debounce(fn, wait) {\n  return (...args) => fn(...args);\n}` },
          { label: "Never resets the timer (fires for every call)", code: `function debounce(fn, wait) {\n  return (...args) => {\n    setTimeout(() => fn(...args), wait);\n  };\n}` },
          { label: "Drops the arguments", code: `function debounce(fn, wait) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(), wait);\n  };\n}` },
        ],
        hint: "Advance 299 ms and check it was NOT called; call it 3 times quickly and check it ran once with the last value.",
      },
      {
        id: "toast",
        title: "showToast(message, onHide, duration)",
        description: "A toast is visible, then hides after `duration` ms (default 3000) and calls onHide. Catch all 3 bugs.",
        goal: "catch",
        code: `function showToast(message, onHide, duration = 3000) {
  const toast = { message, visible: true };
  setTimeout(() => {
    toast.visible = false;
    onHide(toast);
  }, duration);
  return toast;
}`,
        starterTests: `describe("showToast", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it("hides after the duration", () => {
    const toast = showToast("Saved", jest.fn(), 2000);
    jest.advanceTimersByTime(2000);
    expect(toast.visible).toBe(false);
  });
});`,
        solutionTests: `describe("showToast", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it("stays visible until the duration is over", () => {
    const toast = showToast("Saved", jest.fn(), 2000);
    jest.advanceTimersByTime(1999);
    expect(toast.visible).toBe(true);
    jest.advanceTimersByTime(1);
    expect(toast.visible).toBe(false);
  });

  it("calls onHide with the toast", () => {
    const onHide = jest.fn();
    const toast = showToast("Saved", onHide, 2000);
    jest.advanceTimersByTime(2000);
    expect(onHide).toHaveBeenCalledWith(toast);
  });

  it("defaults to 3 seconds", () => {
    const toast = showToast("Saved", jest.fn());
    jest.advanceTimersByTime(2999);
    expect(toast.visible).toBe(true);
    jest.advanceTimersByTime(1);
    expect(toast.visible).toBe(false);
  });
});`,
        mutants: [
          { label: "Hides after half the time", code: `function showToast(message, onHide, duration = 3000) {\n  const toast = { message, visible: true };\n  setTimeout(() => {\n    toast.visible = false;\n    onHide(toast);\n  }, duration / 2);\n  return toast;\n}` },
          { label: "Never calls onHide", code: `function showToast(message, onHide, duration = 3000) {\n  const toast = { message, visible: true };\n  setTimeout(() => {\n    toast.visible = false;\n  }, duration);\n  return toast;\n}` },
          { label: "Wrong default duration (5 s)", code: `function showToast(message, onHide, duration = 5000) {\n  const toast = { message, visible: true };\n  setTimeout(() => {\n    toast.visible = false;\n    onHide(toast);\n  }, duration);\n  return toast;\n}` },
        ],
      },
    ],
  },

  {
    slug: "dom-testing",
    title: "Testing the UI (DOM & Testing Library)",
    level: "Intermediate",
    icon: "🖱️",
    minutes: 25,
    env: "dom",
    summary: "Render a component, find elements the way a user would (by role, label, text), click and type — then assert what's on screen.",
    sections: [
      {
        title: "Test behaviour, not implementation",
        body: [
          "Users don't know about your variables or CSS classes — they see text, buttons and inputs. Testing Library encourages tests that interact with the UI **the way a user does**, so your tests survive refactors and catch real problems.",
          "The flow: **render** the component, **find** elements with `screen` queries, **interact** with `userEvent`, then **assert** on what's visible.",
        ],
        code: {
          language: "js",
          code: `render(createCounter());

await userEvent.click(screen.getByRole("button", { name: "Increment" }));

expect(screen.getByText("Count: 1")).toBeInTheDocument();`,
        },
      },
      {
        title: "Which query should I use?",
        body: [
          "Prefer queries that match how people (and screen readers) find things: **getByRole** (with a name) → **getByLabelText** for form fields → **getByPlaceholderText** → **getByText** → and only as a last resort **getByTestId**.",
          "`getBy…` throws if nothing (or more than one thing) matches. `queryBy…` returns null instead — use it to assert something is **not** there. `getAllBy…` returns a list. `findBy…` waits for something to appear (async).",
        ],
        code: {
          language: "js",
          code: `screen.getByRole("button", { name: "Sign in" });
screen.getByLabelText("Email");
expect(screen.queryByRole("alert")).toBeNull();     // not shown
expect(screen.getAllByRole("listitem")).toHaveLength(2);`,
        },
      },
      {
        title: "DOM matchers",
        body: [
          "`toBeInTheDocument`, `toHaveTextContent`, `toBeDisabled` / `toBeEnabled`, `toHaveValue`, `toBeVisible`, `toHaveClass`, `toHaveAttribute` — they read like the requirement they check.",
          "Bonus: if `getByRole(\"button\", { name: \"Sign in\" })` can't find your button, a screen reader user probably can't either. Good tests nudge you toward accessible UI.",
        ],
      },
    ],
    keyPoints: [
      "render → find → interact → assert.",
      "Query by role and label first; test IDs last.",
      "getBy throws, queryBy returns null, findBy waits.",
      "Assert what the user sees, not internal state.",
    ],
    quiz: [
      {
        prompt: "Which query is the best default for a \"Save\" button?",
        kind: "multiple-choice",
        choices: [
          "screen.getByTestId(\"save-btn\")",
          "screen.getByRole(\"button\", { name: \"Save\" })",
          "container.querySelector(\".btn-primary\")",
        ],
        answer: "screen.getByRole(\"button\", { name: \"Save\" })",
        explanation: "It finds the element the way a user / screen reader does, and it breaks if the button stops being a real accessible button.",
        distractorExplanations: {
          "screen.getByTestId(\"save-btn\")": "Works, but it's a last resort — it ignores what the user actually sees.",
          "container.querySelector(\".btn-primary\")": "Ties the test to CSS class names, which change all the time and mean nothing to users.",
        },
      },
    ],
    scenarios: [
      {
        id: "counter",
        title: "Counter",
        description: "A counter with Increment and Reset buttons (try it in 👀 Preview). The starter only checks the first render — catch all 3 bugs.",
        goal: "catch",
        preview: "createCounter(0)",
        code: `function createCounter(start = 0) {
  let count = start;
  const root = document.createElement("div");
  root.innerHTML =
    '<p data-testid="value">Count: ' + count + '</p>' +
    '<button type="button">Increment</button> ' +
    '<button type="button">Reset</button>';
  const value = root.querySelector("p");
  const [inc, reset] = root.querySelectorAll("button");
  inc.addEventListener("click", () => {
    count += 1;
    value.textContent = "Count: " + count;
  });
  reset.addEventListener("click", () => {
    count = start;
    value.textContent = "Count: " + count;
  });
  return root;
}`,
        starterTests: `describe("Counter", () => {
  it("shows the starting count", () => {
    render(createCounter());
    expect(screen.getByText("Count: 0")).toBeInTheDocument();
  });
});`,
        solutionTests: `describe("Counter", () => {
  it("shows the starting count", () => {
    render(createCounter());
    expect(screen.getByText("Count: 0")).toBeInTheDocument();
  });

  it("increments by one on click", async () => {
    render(createCounter());
    await userEvent.click(screen.getByRole("button", { name: "Increment" }));
    expect(screen.getByTestId("value")).toHaveTextContent("Count: 1");
  });

  it("resets to the starting value", async () => {
    render(createCounter(5));
    await userEvent.click(screen.getByRole("button", { name: "Increment" }));
    await userEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByTestId("value")).toHaveTextContent("Count: 5");
  });
});`,
        mutants: [
          { label: "Increments by 2", code: `function createCounter(start = 0) {\n  let count = start;\n  const root = document.createElement("div");\n  root.innerHTML = '<p data-testid="value">Count: ' + count + '</p><button type="button">Increment</button> <button type="button">Reset</button>';\n  const value = root.querySelector("p");\n  const [inc, reset] = root.querySelectorAll("button");\n  inc.addEventListener("click", () => { count += 2; value.textContent = "Count: " + count; });\n  reset.addEventListener("click", () => { count = start; value.textContent = "Count: " + count; });\n  return root;\n}` },
          { label: "Forgets to update the text", code: `function createCounter(start = 0) {\n  let count = start;\n  const root = document.createElement("div");\n  root.innerHTML = '<p data-testid="value">Count: ' + count + '</p><button type="button">Increment</button> <button type="button">Reset</button>';\n  const value = root.querySelector("p");\n  const [inc, reset] = root.querySelectorAll("button");\n  inc.addEventListener("click", () => { count += 1; });\n  reset.addEventListener("click", () => { count = start; value.textContent = "Count: " + count; });\n  return root;\n}` },
          { label: "Reset goes to 0 instead of the start value", code: `function createCounter(start = 0) {\n  let count = start;\n  const root = document.createElement("div");\n  root.innerHTML = '<p data-testid="value">Count: ' + count + '</p><button type="button">Increment</button> <button type="button">Reset</button>';\n  const value = root.querySelector("p");\n  const [inc, reset] = root.querySelectorAll("button");\n  inc.addEventListener("click", () => { count += 1; value.textContent = "Count: " + count; });\n  reset.addEventListener("click", () => { count = 0; value.textContent = "Count: " + count; });\n  return root;\n}` },
        ],
        hint: "Click Increment and check the text; start at 5, increment, reset, and check it's back to 5.",
      },
      {
        id: "login-form",
        title: "Login form",
        description: "Sign in is disabled until both fields are filled; an email without @ shows an error instead of submitting. Catch all 3 bugs.",
        goal: "catch",
        preview: `createLoginForm((data) => {
  document.body.insertAdjacentHTML("beforeend", "<p>✅ Submitted: " + data.email + "</p>");
})`,
        code: `function createLoginForm(onSubmit) {
  const root = document.createElement("div");
  root.innerHTML =
    '<label for="email">Email</label> <input id="email" type="email" /><br />' +
    '<label for="password">Password</label> <input id="password" type="password" />' +
    '<p role="alert" hidden></p>' +
    '<button type="button" disabled>Sign in</button>';
  const email = root.querySelector("#email");
  const password = root.querySelector("#password");
  const error = root.querySelector("[role=alert]");
  const button = root.querySelector("button");
  const update = () => {
    button.disabled = !(email.value && password.value);
  };
  email.addEventListener("input", update);
  password.addEventListener("input", update);
  button.addEventListener("click", () => {
    if (!email.value.includes("@")) {
      error.textContent = "Enter a valid email";
      error.hidden = false;
      return;
    }
    error.hidden = true;
    onSubmit({ email: email.value, password: password.value });
  });
  return root;
}`,
        starterTests: `describe("LoginForm", () => {
  it("starts with the button disabled", () => {
    render(createLoginForm(jest.fn()));
    expect(screen.getByRole("button", { name: "Sign in" })).toBeDisabled();
  });
});`,
        solutionTests: `describe("LoginForm", () => {
  it("enables Sign in once both fields are filled", async () => {
    render(createLoginForm(jest.fn()));
    await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "secret");
    expect(screen.getByRole("button", { name: "Sign in" })).toBeEnabled();
  });

  it("shows an error for an invalid email and doesn't submit", async () => {
    const onSubmit = jest.fn();
    render(createLoginForm(onSubmit));
    await userEvent.type(screen.getByLabelText("Email"), "ada");
    await userEvent.type(screen.getByLabelText("Password"), "secret");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits the email and password", async () => {
    const onSubmit = jest.fn();
    render(createLoginForm(onSubmit));
    await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "secret");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(onSubmit).toHaveBeenCalledWith({ email: "ada@example.com", password: "secret" });
  });
});`,
        mutants: [
          { label: "Sign in never becomes enabled", code: `function createLoginForm(onSubmit) {\n  const root = document.createElement("div");\n  root.innerHTML = '<label for="email">Email</label><input id="email" type="email" /><label for="password">Password</label><input id="password" type="password" /><p role="alert" hidden></p><button type="button" disabled>Sign in</button>';\n  const email = root.querySelector("#email");\n  const password = root.querySelector("#password");\n  const error = root.querySelector("[role=alert]");\n  const button = root.querySelector("button");\n  button.addEventListener("click", () => {\n    if (!email.value.includes("@")) { error.textContent = "Enter a valid email"; error.hidden = false; return; }\n    onSubmit({ email: email.value, password: password.value });\n  });\n  return root;\n}` },
          { label: "Submits invalid emails", code: `function createLoginForm(onSubmit) {\n  const root = document.createElement("div");\n  root.innerHTML = '<label for="email">Email</label><input id="email" type="email" /><label for="password">Password</label><input id="password" type="password" /><p role="alert" hidden></p><button type="button" disabled>Sign in</button>';\n  const email = root.querySelector("#email");\n  const password = root.querySelector("#password");\n  const button = root.querySelector("button");\n  const update = () => { button.disabled = !(email.value && password.value); };\n  email.addEventListener("input", update);\n  password.addEventListener("input", update);\n  button.addEventListener("click", () => onSubmit({ email: email.value, password: password.value }));\n  return root;\n}` },
          { label: "Sends the password as the email", code: `function createLoginForm(onSubmit) {\n  const root = document.createElement("div");\n  root.innerHTML = '<label for="email">Email</label><input id="email" type="email" /><label for="password">Password</label><input id="password" type="password" /><p role="alert" hidden></p><button type="button" disabled>Sign in</button>';\n  const email = root.querySelector("#email");\n  const password = root.querySelector("#password");\n  const error = root.querySelector("[role=alert]");\n  const button = root.querySelector("button");\n  const update = () => { button.disabled = !(email.value && password.value); };\n  email.addEventListener("input", update);\n  password.addEventListener("input", update);\n  button.addEventListener("click", () => {\n    if (!email.value.includes("@")) { error.textContent = "Enter a valid email"; error.hidden = false; return; }\n    onSubmit({ email: password.value, password: password.value });\n  });\n  return root;\n}` },
        ],
        hint: "Type into the fields with userEvent.type(screen.getByLabelText(\"Email\"), …), then check the button, the alert, and the onSubmit mock.",
      },
      {
        id: "todo-list",
        title: "Todo list",
        description: "Type a todo and click Add. Empty todos are ignored, the input clears, and the counter says \"1 item\" / \"2 items\". Catch all 3 bugs.",
        goal: "catch",
        preview: "createTodoList()",
        code: `function createTodoList() {
  const root = document.createElement("div");
  root.innerHTML =
    '<input aria-label="New todo" placeholder="What needs doing?" /> ' +
    '<button type="button">Add</button>' +
    '<ul aria-label="Todos"></ul>' +
    '<p data-testid="count">0 items</p>';
  const input = root.querySelector("input");
  const list = root.querySelector("ul");
  const count = root.querySelector("p");
  root.querySelector("button").addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
    input.value = "";
    const n = list.children.length;
    count.textContent = n + (n === 1 ? " item" : " items");
  });
  return root;
}`,
        starterTests: `describe("TodoList", () => {
  it("starts empty", () => {
    render(createTodoList());
    expect(screen.getByTestId("count")).toHaveTextContent("0 items");
  });
});`,
        solutionTests: `describe("TodoList", () => {
  it("adds a todo and clears the input", async () => {
    render(createTodoList());
    const input = screen.getByLabelText("New todo");
    await userEvent.type(input, "Buy milk");
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByRole("listitem")).toHaveTextContent("Buy milk");
    expect(input).toHaveValue("");
    expect(screen.getByTestId("count")).toHaveTextContent("1 item");
  });

  it("ignores empty todos", async () => {
    render(createTodoList());
    await userEvent.type(screen.getByLabelText("New todo"), "   ");
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("pluralises the counter", async () => {
    render(createTodoList());
    const input = screen.getByLabelText("New todo");
    const add = screen.getByRole("button", { name: "Add" });
    await userEvent.type(input, "One");
    await userEvent.click(add);
    expect(screen.getByTestId("count")).toHaveTextContent(/^1 item$/);
    await userEvent.type(input, "Two");
    await userEvent.click(add);
    expect(screen.getByTestId("count")).toHaveTextContent("2 items");
  });
});`,
        mutants: [
          { label: "Adds empty todos", code: `function createTodoList() {\n  const root = document.createElement("div");\n  root.innerHTML = '<input aria-label="New todo" /><button type="button">Add</button><ul aria-label="Todos"></ul><p data-testid="count">0 items</p>';\n  const input = root.querySelector("input");\n  const list = root.querySelector("ul");\n  const count = root.querySelector("p");\n  root.querySelector("button").addEventListener("click", () => {\n    const li = document.createElement("li");\n    li.textContent = input.value.trim();\n    list.appendChild(li);\n    input.value = "";\n    const n = list.children.length;\n    count.textContent = n + (n === 1 ? " item" : " items");\n  });\n  return root;\n}` },
          { label: "Doesn't clear the input", code: `function createTodoList() {\n  const root = document.createElement("div");\n  root.innerHTML = '<input aria-label="New todo" /><button type="button">Add</button><ul aria-label="Todos"></ul><p data-testid="count">0 items</p>';\n  const input = root.querySelector("input");\n  const list = root.querySelector("ul");\n  const count = root.querySelector("p");\n  root.querySelector("button").addEventListener("click", () => {\n    const text = input.value.trim();\n    if (!text) return;\n    const li = document.createElement("li");\n    li.textContent = text;\n    list.appendChild(li);\n    const n = list.children.length;\n    count.textContent = n + (n === 1 ? " item" : " items");\n  });\n  return root;\n}` },
          { label: "Says \"1 items\"", code: `function createTodoList() {\n  const root = document.createElement("div");\n  root.innerHTML = '<input aria-label="New todo" /><button type="button">Add</button><ul aria-label="Todos"></ul><p data-testid="count">0 items</p>';\n  const input = root.querySelector("input");\n  const list = root.querySelector("ul");\n  const count = root.querySelector("p");\n  root.querySelector("button").addEventListener("click", () => {\n    const text = input.value.trim();\n    if (!text) return;\n    const li = document.createElement("li");\n    li.textContent = text;\n    list.appendChild(li);\n    input.value = "";\n    count.textContent = list.children.length + " items";\n  });\n  return root;\n}` },
        ],
        hint: "Add one todo and check the list item, the input value and the \"1 item\" text. Then try adding only spaces.",
      },
    ],
  },

  // =====================================================================
  // ADVANCED
  // =====================================================================
  {
    slug: "tdd",
    title: "Test-driven development (TDD)",
    level: "Advanced",
    icon: "🔴",
    minutes: 25,
    env: "js",
    summary: "Red → Green → Refactor. Here the tests are written first — your job is to write the code that makes them pass, one at a time.",
    sections: [
      {
        title: "Red → Green → Refactor",
        body: [
          "**Red:** write a small failing test for the next bit of behaviour. **Green:** write the simplest code that makes it pass — even if it's ugly. **Refactor:** clean the code up while the tests stay green. Repeat.",
          "TDD forces you to decide what the code should do before you write it, keeps each step tiny, and leaves you with a full test suite for free.",
        ],
      },
      {
        title: "Let the tests drive",
        body: [
          "In this lab the tests are fixed (see the 🧪 tests tab). Run them — they're red. Make the **first** one pass with the simplest change, run again, then move to the next. Resist writing everything at once.",
        ],
        code: {
          language: "js",
          code: `// Step 1 — the simplest thing that passes "lowercases words"
function slugify(title) {
  return title.toLowerCase().replace(" ", "-");
}
// Step 2 — the next test fails on multiple spaces… improve it.`,
        },
      },
    ],
    keyPoints: [
      "Red: a failing test first.",
      "Green: the simplest code that passes.",
      "Refactor with the tests as your safety net.",
      "Small steps — one test at a time.",
    ],
    scenarios: [
      {
        id: "slugify",
        title: "slugify(title)",
        description: "Turn a title into a URL slug: \"What's new?\" → \"whats-new\". The tests are given — write slugify until they're all green.",
        goal: "implement",
        code: `function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\\s-]/g, "")
    .trim()
    .replace(/[\\s-]+/g, "-");
}`,
        starterCode: `function slugify(title) {
  // Make the tests pass, one at a time.
  return title;
}`,
        starterTests: `describe("slugify", () => {
  it("lowercases and joins words with dashes", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes punctuation", () => {
    expect(slugify("What's new?")).toBe("whats-new");
  });

  it("collapses extra spaces and trims the ends", () => {
    expect(slugify("  Many   spaces  ")).toBe("many-spaces");
  });

  it("returns an empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });
});`,
        hint: "toLowerCase → remove characters that aren't letters, digits, spaces or dashes → trim → replace runs of spaces/dashes with one dash.",
      },
      {
        id: "format-duration",
        title: "formatDuration(seconds)",
        description: "3661 → \"1h 1m 1s\", 60 → \"1m\", 0 → \"0s\". Write formatDuration until all tests pass.",
        goal: "implement",
        code: `function formatDuration(seconds) {
  if (seconds === 0) return "0s";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const parts = [];
  if (h) parts.push(h + "h");
  if (m) parts.push(m + "m");
  if (s) parts.push(s + "s");
  return parts.join(" ");
}`,
        starterCode: `function formatDuration(seconds) {
  // Make the tests pass, one at a time.
}`,
        starterTests: `describe("formatDuration", () => {
  it("shows seconds", () => {
    expect(formatDuration(45)).toBe("45s");
  });

  it("shows whole minutes without 0s", () => {
    expect(formatDuration(60)).toBe("1m");
  });

  it("shows hours, minutes and seconds", () => {
    expect(formatDuration(3661)).toBe("1h 1m 1s");
  });

  it("skips empty parts", () => {
    expect(formatDuration(7200)).toBe("2h");
  });

  it("shows 0s for zero", () => {
    expect(formatDuration(0)).toBe("0s");
  });
});`,
        hint: "h = floor(s / 3600), m = floor((s % 3600) / 60), s % 60 — collect the non-zero parts.",
      },
      {
        id: "validate-password",
        title: "validatePassword(password)",
        description: "Return a list of error messages (empty when valid). Rules: 8+ characters, a number, an uppercase letter — in that order.",
        goal: "implement",
        code: `function validatePassword(password) {
  const errors = [];
  if (password.length < 8) errors.push("Must be at least 8 characters");
  if (!/[0-9]/.test(password)) errors.push("Must contain a number");
  if (!/[A-Z]/.test(password)) errors.push("Must contain an uppercase letter");
  return errors;
}`,
        starterCode: `function validatePassword(password) {
  const errors = [];
  // Make the tests pass, one at a time.
  return errors;
}`,
        starterTests: `describe("validatePassword", () => {
  it("accepts a strong password", () => {
    expect(validatePassword("Secret123")).toEqual([]);
  });

  it("requires 8 characters", () => {
    expect(validatePassword("Sh0rtPw")).toEqual(["Must be at least 8 characters"]);
  });

  it("requires a number and an uppercase letter", () => {
    expect(validatePassword("longpassword")).toEqual([
      "Must contain a number",
      "Must contain an uppercase letter",
    ]);
  });

  it("reports every problem for an empty password", () => {
    expect(validatePassword("")).toHaveLength(3);
  });
});`,
        hint: "One if per rule, pushing its message: password.length < 8, /[0-9]/, /[A-Z]/.",
      },
    ],
  },

  {
    slug: "integration-testing",
    title: "Integration tests: a whole feature",
    level: "Advanced",
    icon: "🧩",
    minutes: 20,
    env: "js",
    summary: "Test several pieces working together through their public API — a cart, a search pipeline — like a user of the feature would.",
    sections: [
      {
        title: "Units can pass while the feature is broken",
        body: [
          "Each piece can be correct on its own and still fail together: the cart adds items fine and computes totals fine, but adding the same product twice creates two lines that `remove` only half-deletes.",
          "Integration tests exercise a **flow** through the public API — add, add again, remove, apply a coupon, read the total — and check the end result.",
        ],
        code: {
          language: "js",
          code: `const cart = createCart();
cart.add({ id: 1, price: 10 }, 2);
cart.add({ id: 1, price: 10 });       // same product again
cart.remove(1);

expect(cart.count()).toBe(0);         // fully removed?
expect(cart.total()).toBe(0);`,
        },
      },
      {
        title: "Use realistic fixtures",
        body: [
          "Set up a small but realistic data set (a handful of products with different names and prices) once, and run several scenarios against it. Choose the data so each rule is visible: mixed case for search, different prices for sorting, more items than one page for pagination.",
        ],
      },
    ],
    keyPoints: [
      "Test flows through the public API.",
      "Assert the end result the user would see.",
      "Pick fixture data that exercises every rule.",
      "Mock only the outside world (network), keep your modules real.",
    ],
    scenarios: [
      {
        id: "cart",
        title: "Shopping cart",
        description: "createCart() has add, remove, count and total(coupon). SAVE10 takes 10% off. Catch all 3 bugs by testing flows, not single calls.",
        goal: "catch",
        code: `function createCart() {
  const items = [];
  return {
    add(product, qty = 1) {
      const existing = items.find((i) => i.id === product.id);
      if (existing) existing.qty += qty;
      else items.push({ id: product.id, price: product.price, qty });
    },
    remove(id) {
      const i = items.findIndex((it) => it.id === id);
      if (i !== -1) items.splice(i, 1);
    },
    count() {
      return items.reduce((n, it) => n + it.qty, 0);
    },
    total(coupon) {
      const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
      const off = coupon === "SAVE10" ? subtotal * 0.1 : 0;
      return Math.round((subtotal - off) * 100) / 100;
    },
  };
}`,
        starterTests: `describe("cart", () => {
  it("counts an added item", () => {
    const cart = createCart();
    cart.add({ id: 1, price: 5 });
    expect(cart.count()).toBe(1);
  });
});`,
        solutionTests: `describe("cart", () => {
  it("merges the same product and removes it completely", () => {
    const cart = createCart();
    cart.add({ id: 1, price: 10 }, 2);
    cart.add({ id: 1, price: 10 });
    expect(cart.count()).toBe(3);
    cart.remove(1);
    expect(cart.count()).toBe(0);
  });

  it("totals price × quantity", () => {
    const cart = createCart();
    cart.add({ id: 1, price: 10 }, 2);
    cart.add({ id: 2, price: 5 });
    expect(cart.total()).toBe(25);
  });

  it("SAVE10 takes 10% off", () => {
    const cart = createCart();
    cart.add({ id: 1, price: 25 }, 2);
    expect(cart.total("SAVE10")).toBe(45);
  });
});`,
        mutants: [
          { label: "Adding the same product twice creates a duplicate line", code: `function createCart() {\n  const items = [];\n  return {\n    add(product, qty = 1) { items.push({ id: product.id, price: product.price, qty }); },\n    remove(id) { const i = items.findIndex((it) => it.id === id); if (i !== -1) items.splice(i, 1); },\n    count() { return items.reduce((n, it) => n + it.qty, 0); },\n    total(coupon) {\n      const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);\n      const off = coupon === "SAVE10" ? subtotal * 0.1 : 0;\n      return Math.round((subtotal - off) * 100) / 100;\n    },\n  };\n}` },
          { label: "Coupon takes $10 off instead of 10%", code: `function createCart() {\n  const items = [];\n  return {\n    add(product, qty = 1) { const e = items.find((i) => i.id === product.id); if (e) e.qty += qty; else items.push({ id: product.id, price: product.price, qty }); },\n    remove(id) { const i = items.findIndex((it) => it.id === id); if (i !== -1) items.splice(i, 1); },\n    count() { return items.reduce((n, it) => n + it.qty, 0); },\n    total(coupon) {\n      const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);\n      const off = coupon === "SAVE10" ? 10 : 0;\n      return Math.round((subtotal - off) * 100) / 100;\n    },\n  };\n}` },
          { label: "Total ignores quantity", code: `function createCart() {\n  const items = [];\n  return {\n    add(product, qty = 1) { const e = items.find((i) => i.id === product.id); if (e) e.qty += qty; else items.push({ id: product.id, price: product.price, qty }); },\n    remove(id) { const i = items.findIndex((it) => it.id === id); if (i !== -1) items.splice(i, 1); },\n    count() { return items.reduce((n, it) => n + it.qty, 0); },\n    total(coupon) {\n      const subtotal = items.reduce((s, it) => s + it.price, 0);\n      const off = coupon === "SAVE10" ? subtotal * 0.1 : 0;\n      return Math.round((subtotal - off) * 100) / 100;\n    },\n  };\n}` },
        ],
        hint: "Add the same product twice then remove it; use a quantity > 1 when checking the total; check SAVE10 on a $50 cart.",
      },
      {
        id: "search",
        title: "Product search pipeline",
        description: "searchProducts filters by a case-insensitive query, sorts by price (asc or desc) and paginates (2 per page). Catch all 3 bugs.",
        goal: "catch",
        code: `function searchProducts(products, { query = "", sort = "price-asc", page = 1, perPage = 2 } = {}) {
  const q = query.trim().toLowerCase();
  const matched = products.filter((p) => p.name.toLowerCase().includes(q));
  const sorted = [...matched].sort((a, b) =>
    sort === "price-desc" ? b.price - a.price : a.price - b.price
  );
  const start = (page - 1) * perPage;
  return {
    total: matched.length,
    items: sorted.slice(start, start + perPage).map((p) => p.name),
  };
}`,
        starterTests: `const products = [
  { name: "Blue Pen", price: 3 },
  { name: "Red Pen", price: 1 },
  { name: "Notebook", price: 5 },
  { name: "pencil", price: 2 },
];

describe("searchProducts", () => {
  it("counts all products with no query", () => {
    expect(searchProducts(products).total).toBe(4);
  });
});`,
        solutionTests: `const products = [
  { name: "Blue Pen", price: 3 },
  { name: "Red Pen", price: 1 },
  { name: "Notebook", price: 5 },
  { name: "pencil", price: 2 },
];

describe("searchProducts", () => {
  it("searches case-insensitively", () => {
    expect(searchProducts(products, { query: "PEN" }).total).toBe(3);
  });

  it("returns the second page in price order", () => {
    expect(searchProducts(products, { page: 2 }).items).toEqual(["Blue Pen", "Notebook"]);
  });

  it("sorts by price descending", () => {
    expect(searchProducts(products, { sort: "price-desc" }).items).toEqual(["Notebook", "Blue Pen"]);
  });
});`,
        mutants: [
          { label: "Search is case-sensitive", code: `function searchProducts(products, { query = "", sort = "price-asc", page = 1, perPage = 2 } = {}) {\n  const matched = products.filter((p) => p.name.includes(query.trim()));\n  const sorted = [...matched].sort((a, b) => (sort === "price-desc" ? b.price - a.price : a.price - b.price));\n  const start = (page - 1) * perPage;\n  return { total: matched.length, items: sorted.slice(start, start + perPage).map((p) => p.name) };\n}` },
          { label: "Pages are off by one", code: `function searchProducts(products, { query = "", sort = "price-asc", page = 1, perPage = 2 } = {}) {\n  const q = query.trim().toLowerCase();\n  const matched = products.filter((p) => p.name.toLowerCase().includes(q));\n  const sorted = [...matched].sort((a, b) => (sort === "price-desc" ? b.price - a.price : a.price - b.price));\n  const start = page * perPage;\n  return { total: matched.length, items: sorted.slice(start, start + perPage).map((p) => p.name) };\n}` },
          { label: "Ignores price-desc", code: `function searchProducts(products, { query = "", sort = "price-asc", page = 1, perPage = 2 } = {}) {\n  const q = query.trim().toLowerCase();\n  const matched = products.filter((p) => p.name.toLowerCase().includes(q));\n  const sorted = [...matched].sort((a, b) => a.price - b.price);\n  const start = (page - 1) * perPage;\n  return { total: matched.length, items: sorted.slice(start, start + perPage).map((p) => p.name) };\n}` },
        ],
        hint: "Search for \"PEN\" (uppercase), ask for page 2, and try sort: \"price-desc\".",
      },
    ],
  },

  {
    slug: "test-strategy",
    title: "Test strategy: coverage, mutants & flaky tests",
    level: "Advanced",
    icon: "🧭",
    minutes: 20,
    env: "js",
    summary: "100% coverage can still miss bugs. Learn mutation testing, how to kill flaky tests, and where E2E tools like Playwright fit.",
    sections: [
      {
        title: "Coverage lies — mutants don't",
        body: [
          "**Code coverage** tells you which lines ran during the tests. It does **not** tell you whether anything was checked. Two tests can execute every line of `isLeapYear` and still miss three different bugs.",
          "**Mutation testing** (tools: Stryker) changes your code in small ways — `>=` to `>`, `&&` to `||`, deleting a line — and reruns the suite. Every mutant that survives is a bug your tests would miss. That's exactly what this course's Bug hunt does.",
        ],
        code: {
          language: "js",
          code: `// 100% line coverage…
expect(isLeapYear(2024)).toBe(true);
expect(isLeapYear(2023)).toBe(false);
// …but "every 4th year", "ignore the 400 rule" and
// "every even year" bugs all still pass.`,
        },
      },
      {
        title: "Flaky tests and how to kill them",
        body: [
          "A **flaky** test sometimes passes and sometimes fails with no code change. Common causes: real time (`setTimeout`, `Date.now()`), randomness, real network calls, tests that depend on each other's order or shared state, and animations.",
          "Fixes: fake timers, a seeded/mocked random, mocked network, a fresh setup in `beforeEach`, and waiting for UI with `findBy…` instead of fixed sleeps. Never \"fix\" flakiness by adding retries.",
        ],
      },
      {
        title: "End-to-end tests (Playwright / Cypress)",
        body: [
          "E2E tools drive a real browser against the real app — the closest thing to a user. They're slow and need a running server, so keep a few for critical journeys (sign up, checkout) and push everything else down the pyramid.",
        ],
        code: {
          language: "js",
          code: `// Playwright
test("user can check out", async ({ page }) => {
  await page.goto("/shop");
  await page.getByRole("button", { name: "Add to cart" }).first().click();
  await page.getByRole("link", { name: "Cart" }).click();
  await page.getByRole("button", { name: "Checkout" }).click();
  await expect(page.getByText("Order confirmed")).toBeVisible();
});`,
        },
      },
    ],
    keyPoints: [
      "Coverage = lines run; it doesn't prove correctness.",
      "Mutation score = bugs your tests actually catch.",
      "Flaky tests come from time, randomness, network and shared state.",
      "Many unit, some integration, few E2E.",
    ],
    visualization: {
      code: `function isLeapYear(y) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}`,
      language: "js",
      lanes: ["Your tests", "Mutant", "Outcome"],
      frames: [
        { note: "Start: your suite checks 2024 → true and 2023 → false. Coverage: 100%.", line: 2, lanes: { "Your tests": ["2024 → true", "2023 → false"] } },
        { note: "Mutant 1 deletes the 100-year rule: y % 4 === 0. Run the suite again…", line: 2, lanes: { "Your tests": ["2024 → true ✓", "2023 → false ✓"], Mutant: ["y % 4 === 0"], Outcome: ["🔴 survived"] } },
        { note: "Every test still passes, so this bug would ship. Add a test for 1900 (not a leap year).", line: 2, lanes: { "Your tests": ["2024 → true", "2023 → false", "1900 → false"], Mutant: ["y % 4 === 0"], Outcome: ["🟢 caught by 1900"] } },
        { note: "Mutant 2 drops the 400-year rule. 2000 IS a leap year — add it, and this mutant dies too.", line: 2, lanes: { "Your tests": ["…", "2000 → true"], Mutant: ["no || y % 400"], Outcome: ["🟢 caught by 2000"] } },
        { note: "When every mutant is caught, your suite really specifies the behaviour — not just runs the lines.", lanes: { Outcome: ["Mutation score 100%"] } },
      ],
    },
    quiz: [
      {
        prompt: "A test sometimes fails on CI with no code change. Which is the most likely cause?",
        kind: "multiple-choice",
        choices: [
          "It waits a real 100 ms for an animation",
          "It uses toEqual instead of toBe",
          "It has a long descriptive name",
        ],
        answer: "It waits a real 100 ms for an animation",
        explanation: "Real time is the #1 source of flakiness: a busy CI machine can take longer. Use fake timers or wait for the UI state with findBy… instead.",
      },
    ],
    scenarios: [
      {
        id: "leap-year",
        title: "isLeapYear — kill the mutants",
        description: "The starter suite has 100% line coverage. Run it: 3 of 4 mutants survive. Leap years: divisible by 4, except centuries, except every 400 years.",
        goal: "catch",
        code: `function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}`,
        starterTests: `describe("isLeapYear", () => {
  it("knows a leap year", () => {
    expect(isLeapYear(2024)).toBe(true);
  });

  it("knows a normal year", () => {
    expect(isLeapYear(2023)).toBe(false);
  });
});`,
        solutionTests: `describe("isLeapYear", () => {
  it("knows a leap year", () => {
    expect(isLeapYear(2024)).toBe(true);
  });

  it("knows a normal year", () => {
    expect(isLeapYear(2023)).toBe(false);
  });

  it("centuries are not leap years", () => {
    expect(isLeapYear(1900)).toBe(false);
  });

  it("…unless divisible by 400", () => {
    expect(isLeapYear(2000)).toBe(true);
  });

  it("an even year isn't automatically a leap year", () => {
    expect(isLeapYear(2022)).toBe(false);
  });
});`,
        mutants: [
          { label: "Ignores the 100-year rule", code: `function isLeapYear(year) {\n  return year % 4 === 0;\n}` },
          { label: "Ignores the 400-year rule", code: `function isLeapYear(year) {\n  return year % 4 === 0 && year % 100 !== 0;\n}` },
          { label: "Every even year is a leap year", code: `function isLeapYear(year) {\n  return year % 2 === 0;\n}` },
          { label: "Uses || instead of &&", code: `function isLeapYear(year) {\n  return year % 4 === 0 || year % 100 !== 0 || year % 400 === 0;\n}` },
        ],
        hint: "Try 1900 (a century), 2000 (divisible by 400) and 2022 (even but not leap).",
      },
      {
        id: "page-count",
        title: "pageCount(totalItems, perPage)",
        description: "How many pages do we need? 25 items at 10 per page → 3. perPage must be positive. Catch all 3 bugs.",
        goal: "catch",
        code: `function pageCount(totalItems, perPage) {
  if (perPage <= 0) throw new Error("perPage must be positive");
  return Math.ceil(totalItems / perPage);
}`,
        starterTests: `describe("pageCount", () => {
  it("rounds a partial page up", () => {
    expect(pageCount(25, 10)).toBe(3);
  });
});`,
        solutionTests: `describe("pageCount", () => {
  it("rounds a partial page up", () => {
    expect(pageCount(25, 10)).toBe(3);
  });

  it("doesn't add an extra page for an exact fit", () => {
    expect(pageCount(20, 10)).toBe(2);
  });

  it("has no pages when there are no items", () => {
    expect(pageCount(0, 10)).toBe(0);
  });

  it("rejects a non-positive page size", () => {
    expect(() => pageCount(10, 0)).toThrow("perPage must be positive");
  });
});`,
        mutants: [
          { label: "Rounds down (loses the last page)", code: `function pageCount(totalItems, perPage) {\n  if (perPage <= 0) throw new Error("perPage must be positive");\n  return Math.floor(totalItems / perPage);\n}` },
          { label: "Always adds one page", code: `function pageCount(totalItems, perPage) {\n  if (perPage <= 0) throw new Error("perPage must be positive");\n  return Math.floor(totalItems / perPage) + 1;\n}` },
          { label: "No guard — returns Infinity for perPage 0", code: `function pageCount(totalItems, perPage) {\n  return Math.ceil(totalItems / perPage);\n}` },
        ],
      },
    ],
  },
];

export function getTestingLesson(slug: string): TestingLesson | undefined {
  return testingLessons.find((l) => l.slug === slug);
}
