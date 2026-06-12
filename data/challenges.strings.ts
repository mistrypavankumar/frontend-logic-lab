import { Challenge } from "@/lib/types";

// E3 — Strings: the text utilities every frontend needs (slugs, query strings,
// search highlighting, formatting, validation, masking, case conversion).
export const stringChallenges: Challenge[] = [
  {
    id: "ch-slugify",
    slug: "slug-generator",
    title: "Slug Generator",
    difficulty: "Intermediate",
    category: "Strings",
    tags: ["string", "regex", "url"],
    relatedMethods: ["replace"],
    flags: { realWorld: true },
    problem:
      "Implement slugify(text): lowercase, replace runs of non-alphanumeric characters with a single hyphen, and trim leading/trailing hyphens.",
    realWorldScenario: "Turning a blog/product title into a URL-safe slug like /posts/my-first-post.",
    example: { input: 'slugify("Hello World!")', output: '"hello-world"' },
    constraints: ["Lowercase", "Collapse separators to one hyphen", "No leading/trailing hyphen"],
    starterCode: `function slugify(text) {
  // lowercase, hyphenate, trim hyphens
}`,
    builtInSolution: { language: "ts", code: "// No single built-in; chain String methods + regex" },
    manualSolution: { language: "ts", code: "text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).join('-')" },
    internalImplementation: {
      language: "ts",
      code: `function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}`,
    },
    solution: `function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}`,
    tests: [
      { name: "basic title", kind: "normal", call: 'slugify("Hello World!")', expected: "hello-world" },
      { name: "collapses spaces/symbols", kind: "normal", call: 'slugify("  React.js   Rocks!!  ")', expected: "react-js-rocks" },
      { name: "empty string", kind: "empty", call: 'slugify("")', expected: "" },
    ],
    hiddenTests: [
      { name: "only symbols → empty", kind: "invalid", call: 'slugify("@#$")', expected: "" },
    ],
    hints: ["Lowercase first.", "Replace [^a-z0-9]+ with a hyphen.", "Strip leading/trailing hyphens with ^-+|-+$."],
    explanation:
      "Replace any run of non-alphanumerics with one hyphen, then trim stray hyphens at the ends. Lowercasing keeps URLs canonical.",
    edgeCases: ["Only symbols → empty string", "Accented letters are stripped (normalize first if you need them)", "Leading/trailing separators removed"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    industrialNotes: ["For unicode titles, normalize('NFKD') and strip diacritics before slugifying."],
    commonMistakes: ["Leaving trailing hyphens.", "Not collapsing repeated separators."],
  },
  {
    id: "ch-parse-query",
    slug: "query-string-parser",
    title: "Query String Parser",
    difficulty: "Intermediate",
    category: "Strings",
    tags: ["string", "url", "parsing"],
    relatedMethods: ["URLSearchParams"],
    flags: { realWorld: true, dataTransformation: true },
    problem:
      "Implement parseQuery(qs) that turns a query string (with or without a leading '?') into an object, decoding values.",
    realWorldScenario: "Reading filters/page from the URL into app state.",
    example: { input: 'parseQuery("?a=1&b=2")', output: '{a:"1", b:"2"}' },
    constraints: ["Strip a leading '?'", "Decode percent-encoding", "Empty string → {}"],
    starterCode: `function parseQuery(qs) {
  // turn "a=1&b=2" into { a: "1", b: "2" }
}`,
    builtInSolution: { language: "ts", code: "Object.fromEntries(new URLSearchParams(qs))" },
    manualSolution: { language: "ts", code: "split on '&', then on '=', decodeURIComponent each part" },
    internalImplementation: {
      language: "ts",
      code: `function parseQuery(qs) {
  const out = {};
  const s = qs.startsWith("?") ? qs.slice(1) : qs;
  if (!s) return out;
  for (const pair of s.split("&")) {
    const [rawK, rawV = ""] = pair.split("=");
    if (!rawK) continue;
    out[decodeURIComponent(rawK)] = decodeURIComponent(rawV);
  }
  return out;
}`,
    },
    solution: `function parseQuery(qs) {
  const out = {};
  const s = qs.startsWith("?") ? qs.slice(1) : qs;
  if (!s) return out;
  for (const pair of s.split("&")) {
    const [rawK, rawV = ""] = pair.split("=");
    if (!rawK) continue;
    out[decodeURIComponent(rawK)] = decodeURIComponent(rawV);
  }
  return out;
}`,
    tests: [
      { name: "parses pairs", kind: "normal", call: 'parseQuery("?a=1&b=2")', expected: { a: "1", b: "2" } },
      { name: "decodes value", kind: "normal", call: 'parseQuery("q=hello%20world")', expected: { q: "hello world" } },
      { name: "flag with no value", kind: "normal", call: 'parseQuery("?flag")', expected: { flag: "" } },
      { name: "empty → {}", kind: "empty", call: 'parseQuery("")', expected: {} },
    ],
    hiddenTests: [
      { name: "duplicate key: last wins", kind: "duplicate", call: 'parseQuery("a=1&a=2")', expected: { a: "2" } },
    ],
    hints: ["Strip a leading '?'.", "Split on '&', then each on '='.", "decodeURIComponent both sides."],
    explanation:
      "Split into pairs, then key/value, decoding each. URLSearchParams does all this natively and also handles repeated keys via getAll.",
    edgeCases: ["No value → empty string", "Duplicate keys: last wins (URLSearchParams keeps both)", "Always decode to handle %20 etc."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    industrialNotes: ["Prefer URLSearchParams in production; it handles edge cases and repeated keys."],
    commonMistakes: ["Forgetting to decode values.", "Crashing on a key with no '='."],
  },
  {
    id: "ch-build-query",
    slug: "query-string-builder",
    title: "Query String Builder",
    difficulty: "Beginner",
    category: "Strings",
    tags: ["string", "url"],
    relatedMethods: ["URLSearchParams"],
    flags: { realWorld: true, dataTransformation: true },
    problem:
      "Implement buildQuery(obj) that turns an object into a query string, encoding keys and values.",
    realWorldScenario: "Building a shareable, filtered URL from current app state.",
    example: { input: 'buildQuery({a:1, b:2})', output: '"a=1&b=2"' },
    constraints: ["Encode keys and values", "Join pairs with '&'"],
    starterCode: `function buildQuery(obj) {
  // turn { a: 1, b: 2 } into "a=1&b=2"
}`,
    builtInSolution: { language: "ts", code: "new URLSearchParams(obj).toString()" },
    manualSolution: { language: "ts", code: "Object.entries(obj).map(([k,v]) => k + '=' + v).join('&')" },
    internalImplementation: {
      language: "ts",
      code: `function buildQuery(obj) {
  return Object.entries(obj)
    .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v))
    .join("&");
}`,
    },
    solution: `function buildQuery(obj) {
  return Object.entries(obj)
    .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v))
    .join("&");
}`,
    tests: [
      { name: "builds query", kind: "normal", call: "buildQuery({a:1,b:2})", expected: "a=1&b=2" },
      { name: "encodes spaces", kind: "normal", call: 'buildQuery({q:"hello world"})', expected: "q=hello%20world" },
      { name: "empty object", kind: "empty", call: "buildQuery({})", expected: "" },
    ],
    hiddenTests: [
      { name: "encodes special chars", kind: "normal", call: 'buildQuery({redirect:"/a?b=c"})', expected: "redirect=%2Fa%3Fb%3Dc" },
    ],
    hints: ["Object.entries → map to 'k=v'.", "encodeURIComponent both sides.", "join('&')."],
    explanation:
      "Encode each key and value so special characters survive, then join with '&'. URLSearchParams does this and is the production choice.",
    edgeCases: ["Special chars must be encoded", "Empty object → ''", "Decide how to handle undefined/array values"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    industrialNotes: ["Skip undefined/null values so you don't emit 'key=undefined'."],
    commonMistakes: ["Not encoding values (breaks on &, =, spaces)."],
  },
  {
    id: "ch-highlight-keyword",
    slug: "highlight-search-keyword",
    title: "Highlight Search Keyword",
    difficulty: "Advanced",
    category: "Strings",
    tags: ["string", "search", "ui"],
    relatedMethods: ["RegExp.escape", "replace"],
    flags: { realWorld: true },
    problem:
      "Implement highlight(text, term) that wraps every (case-insensitive) occurrence of term in <mark>...</mark>, preserving the original casing. Empty term returns text unchanged.",
    realWorldScenario: "Highlighting the user's search term inside results.",
    example: { input: 'highlight("Hello World", "world")', output: '"Hello <mark>World</mark>"' },
    constraints: ["Case-insensitive match", "Preserve original casing in the output", "Handle special characters literally"],
    starterCode: `function highlight(text, term) {
  // wrap matches of term in <mark>...</mark>
}`,
    builtInSolution: { language: "ts", code: "text.replace(new RegExp(RegExp.escape(term), 'gi'), '<mark>$&</mark>')" },
    manualSolution: { language: "ts", code: "text.split(term).join('<mark>' + term + '</mark>') // exact-case only" },
    internalImplementation: {
      language: "ts",
      code: `function highlight(text, term) {
  if (!term) return text;
  const lower = text.toLowerCase();
  const t = term.toLowerCase();
  let result = "", i = 0;
  while (i < text.length) {
    const idx = lower.indexOf(t, i);
    if (idx === -1) { result += text.slice(i); break; }
    result +=
      text.slice(i, idx) +
      "<mark>" + text.slice(idx, idx + term.length) + "</mark>";
    i = idx + term.length;
  }
  return result;
}`,
    },
    solution: `function highlight(text, term) {
  if (!term) return text;
  const lower = text.toLowerCase();
  const t = term.toLowerCase();
  let result = "", i = 0;
  while (i < text.length) {
    const idx = lower.indexOf(t, i);
    if (idx === -1) { result += text.slice(i); break; }
    result +=
      text.slice(i, idx) +
      "<mark>" + text.slice(idx, idx + term.length) + "</mark>";
    i = idx + term.length;
  }
  return result;
}`,
    tests: [
      { name: "wraps match", kind: "normal", call: 'highlight("Hello world", "world")', expected: "Hello <mark>world</mark>" },
      { name: "case-insensitive, preserves case", kind: "normal", call: 'highlight("Hello World", "world")', expected: "Hello <mark>World</mark>" },
      { name: "special chars literal", kind: "invalid", call: 'highlight("a.b.c", ".")', expected: "a<mark>.</mark>b<mark>.</mark>c" },
      { name: "empty term unchanged", kind: "empty", call: 'highlight("text", "")', expected: "text" },
    ],
    hiddenTests: [
      { name: "multiple adjacent matches", kind: "duplicate", call: 'highlight("aaa", "a")', expected: "<mark>a</mark><mark>a</mark><mark>a</mark>" },
    ],
    hints: ["Compare lowercased text/term to find positions.", "Slice the ORIGINAL text to keep its casing.", "Advance the index past each match."],
    explanation:
      "Match positions on lowercased copies but slice the original text so casing is preserved. The index-walk avoids regex-escaping pitfalls with special characters.",
    edgeCases: ["Empty term → unchanged", "Special regex chars handled literally", "Overlapping handled by advancing past the match"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    industrialNotes: ["If you use the RegExp approach, ALWAYS escape the term (RegExp.escape) to avoid ReDoS/broken patterns."],
    commonMistakes: ["Building a RegExp from raw user input without escaping.", "Lowercasing the output and losing original casing."],
  },
  {
    id: "ch-template-format",
    slug: "template-formatter",
    title: "Template Formatter",
    difficulty: "Intermediate",
    category: "Strings",
    tags: ["string", "regex", "template"],
    relatedMethods: ["replace"],
    flags: { realWorld: true },
    problem:
      "Implement format(template, data) that replaces {key} placeholders with data[key]. Unknown placeholders are left as-is.",
    realWorldScenario: "Filling i18n message templates like 'Hello {name}, you have {count} items'.",
    example: { input: 'format("Hi {name}!", {name:"Ana"})', output: '"Hi Ana!"' },
    constraints: ["Replace {key} with data[key]", "Leave unknown {key} untouched"],
    starterCode: `function format(template, data) {
  // replace {key} placeholders from data
}`,
    builtInSolution: { language: "ts", code: "// No built-in interpolation for runtime strings; use replace + regex" },
    manualSolution: { language: "ts", code: "Object.keys(data).reduce((s,k) => s.split('{'+k+'}').join(data[k]), template)" },
    internalImplementation: {
      language: "ts",
      code: `function format(template, data) {
  return template.replace(/\\{(\\w+)\\}/g, (match, key) =>
    key in data ? String(data[key]) : match
  );
}`,
    },
    solution: `function format(template, data) {
  return template.replace(/\\{(\\w+)\\}/g, (match, key) =>
    key in data ? String(data[key]) : match
  );
}`,
    tests: [
      { name: "fills placeholder", kind: "normal", call: 'format("Hi {name}!", {name:"Ana"})', expected: "Hi Ana!" },
      { name: "multiple placeholders", kind: "normal", call: 'format("{a}+{b}={c}", {a:1,b:2,c:3})', expected: "1+2=3" },
      { name: "unknown left as-is", kind: "invalid", call: 'format("Hi {name}", {})', expected: "Hi {name}" },
    ],
    hiddenTests: [
      { name: "no placeholders", kind: "normal", call: 'format("plain text", {x:1})', expected: "plain text" },
    ],
    hints: ["Match {word} with a regex capturing the key.", "Replace only when the key exists in data; otherwise return the match unchanged."],
    explanation:
      "A regex captures the key inside braces; the replacer looks it up in data, leaving unknown placeholders intact so missing values are visible, not silently blank.",
    edgeCases: ["Unknown key kept as {key}", "Numbers/booleans stringified", "Nested braces not supported (keep it simple)"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    industrialNotes: ["For real i18n use a library (pluralization, locale rules) — this is the core idea."],
    commonMistakes: ["Replacing unknown keys with 'undefined'.", "Not stringifying non-string values."],
  },
  {
    id: "ch-count-words",
    slug: "count-words",
    title: "Count Words",
    difficulty: "Beginner",
    category: "Strings",
    tags: ["string", "regex"],
    relatedMethods: ["split", "trim"],
    flags: {},
    problem:
      "Implement countWords(str) that counts words, treating any run of whitespace as a single separator. Empty/blank → 0.",
    realWorldScenario: "A live word counter for a textarea (tweet/bio limits).",
    example: { input: 'countWords("hello   world")', output: "2" },
    constraints: ["Collapse multiple spaces/tabs/newlines", "Trim ends", "Blank → 0"],
    starterCode: `function countWords(str) {
  // count words separated by any whitespace
}`,
    builtInSolution: { language: "ts", code: "(str.trim().match(/\\S+/g) || []).length" },
    manualSolution: { language: "ts", code: "str.trim().split(' ').filter(Boolean).length // spaces only" },
    internalImplementation: {
      language: "ts",
      code: `function countWords(str) {
  const trimmed = str.trim();
  if (trimmed === "") return 0;
  return trimmed.split(/\\s+/).length;
}`,
    },
    solution: `function countWords(str) {
  const trimmed = str.trim();
  if (trimmed === "") return 0;
  return trimmed.split(/\\s+/).length;
}`,
    tests: [
      { name: "two words", kind: "normal", call: 'countWords("hello world")', expected: 2 },
      { name: "collapses extra spaces", kind: "normal", call: 'countWords("  hello   world  ")', expected: 2 },
      { name: "empty → 0", kind: "empty", call: 'countWords("")', expected: 0 },
      { name: "only spaces → 0", kind: "invalid", call: 'countWords("    ")', expected: 0 },
    ],
    hiddenTests: [
      { name: "tabs and newlines", kind: "normal", call: 'countWords("a\\tb\\nc")', expected: 3 },
    ],
    hints: ["Trim first.", "Return 0 for an empty trimmed string.", "Split on \\s+ (any whitespace run)."],
    explanation:
      "Trimming then splitting on whitespace runs avoids counting empty strings from double spaces. The blank check prevents [''].length === 1 false positives.",
    edgeCases: ["Multiple spaces collapse", "Tabs/newlines are whitespace too", "Blank string → 0 (not 1)"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n) for the split array",
    industrialNotes: ["For CJK text, word counting needs locale-aware segmentation (Intl.Segmenter)."],
    commonMistakes: ["split(' ') leaving empty strings.", "Returning 1 for an empty string."],
  },
  {
    id: "ch-validate-email",
    slug: "validate-email",
    title: "Validate an Email (basic)",
    difficulty: "Intermediate",
    category: "Strings",
    tags: ["string", "regex", "validation"],
    relatedMethods: ["test"],
    flags: { realWorld: true },
    problem:
      "Implement isValidEmail(email): true if it looks like text@text.text with no spaces. (Pragmatic check, not full RFC.)",
    realWorldScenario: "Inline form validation before submit.",
    example: { input: 'isValidEmail("a@b.com")', output: "true" },
    constraints: ["Require one @ and a dot in the domain", "No whitespace", "Keep it pragmatic, not RFC-complete"],
    starterCode: `function isValidEmail(email) {
  // basic shape check: text@text.text, no spaces
}`,
    builtInSolution: { language: "ts", code: "// HTML: <input type='email'> validates natively in forms" },
    manualSolution: { language: "ts", code: "email.includes('@') && email.split('@')[1]?.includes('.')" },
    internalImplementation: {
      language: "ts",
      code: `function isValidEmail(email) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}`,
    },
    solution: `function isValidEmail(email) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}`,
    tests: [
      { name: "valid email", kind: "normal", call: 'isValidEmail("a@b.com")', expected: true },
      { name: "missing @", kind: "invalid", call: 'isValidEmail("ab.com")', expected: false },
      { name: "missing domain dot", kind: "invalid", call: 'isValidEmail("a@b")', expected: false },
      { name: "has spaces", kind: "invalid", call: 'isValidEmail("a b@c.com")', expected: false },
    ],
    hiddenTests: [
      { name: "subdomain ok", kind: "normal", call: 'isValidEmail("x@mail.co.uk")', expected: true },
      { name: "empty → false", kind: "empty", call: 'isValidEmail("")', expected: false },
    ],
    hints: ["Pattern: non-space-non-@ + '@' + non-space-non-@ + '.' + non-space-non-@.", "Anchor with ^ and $."],
    explanation:
      "A pragmatic regex covers 99% of UI needs: something, @, something, dot, something — no spaces. Full RFC email validation is famously impractical.",
    edgeCases: ["Don't over-engineer — the real test is sending a confirmation email", "Subdomains allowed", "Empty → false"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    industrialNotes: ["Prefer <input type='email'> + server confirmation over clever regexes."],
    commonMistakes: ["Copying a monstrous RFC regex.", "Forgetting to anchor (^...$), allowing partial matches."],
  },
  {
    id: "ch-mask-data",
    slug: "mask-sensitive-data",
    title: "Mask Sensitive Data",
    difficulty: "Beginner",
    category: "Strings",
    tags: ["string", "security"],
    relatedMethods: ["slice", "repeat"],
    flags: { realWorld: true },
    problem:
      "Implement mask(str, visible = 4) that hides all but the last `visible` characters behind '*'. Short strings are returned unchanged.",
    realWorldScenario: "Showing **** **** **** 1111 for a saved card, or masking emails/tokens in logs.",
    example: { input: 'mask("4111111111111111")', output: '"************1111"' },
    constraints: ["Keep the last `visible` characters", "Replace the rest with '*'", "If length <= visible, return as-is"],
    starterCode: `function mask(str, visible = 4) {
  // hide all but the last few characters behind asterisks
}`,
    builtInSolution: { language: "ts", code: "// No built-in; slice + repeat" },
    manualSolution: { language: "ts", code: "str.slice(0, -visible).replace(/./g, '*') + str.slice(-visible)" },
    internalImplementation: {
      language: "ts",
      code: `function mask(str, visible = 4) {
  if (str.length <= visible) return str;
  return "*".repeat(str.length - visible) + str.slice(-visible);
}`,
    },
    solution: `function mask(str, visible = 4) {
  if (str.length <= visible) return str;
  return "*".repeat(str.length - visible) + str.slice(-visible);
}`,
    tests: [
      { name: "masks a card", kind: "normal", call: 'mask("4111111111111111")', expected: "************1111" },
      { name: "custom visible count", kind: "normal", call: 'mask("secret", 2)', expected: "****et" },
      { name: "short string unchanged", kind: "invalid", call: 'mask("123")', expected: "123" },
    ],
    hiddenTests: [
      { name: "exactly visible length", kind: "normal", call: 'mask("1234", 4)', expected: "1234" },
    ],
    hints: ["If length <= visible, return it unchanged.", "Repeat '*' for the hidden part, then append the visible tail."],
    explanation:
      "Compute how many characters to hide, build that many '*', and append the visible suffix. Guarding short strings avoids negative repeat counts.",
    edgeCases: ["length <= visible → unchanged (no negative repeat)", "visible = 0 masks everything", "Doesn't mask the actual stored value — display only"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    industrialNotes: ["Mask only at the display/log layer; never store masked values as the source of truth."],
    commonMistakes: ["repeat() with a negative count throws — guard short strings."],
  },
  {
    id: "ch-camel-to-kebab",
    slug: "camel-to-kebab",
    title: "camelCase → kebab-case",
    difficulty: "Intermediate",
    category: "Strings",
    tags: ["string", "regex", "case"],
    relatedMethods: ["replace"],
    flags: {},
    problem:
      "Implement camelToKebab(str) converting 'myVariableName' to 'my-variable-name'.",
    realWorldScenario: "Converting JS object keys to CSS custom property or data-attribute names.",
    example: { input: 'camelToKebab("myVariableName")', output: '"my-variable-name"' },
    constraints: ["Insert a hyphen before each uppercase letter", "Lowercase the result"],
    starterCode: `function camelToKebab(str) {
  // myVariableName -> my-variable-name
}`,
    builtInSolution: { language: "ts", code: "// No built-in; regex replace" },
    manualSolution: { language: "ts", code: "[...str].map(c => c >= 'A' && c <= 'Z' ? '-' + c.toLowerCase() : c).join('')" },
    internalImplementation: {
      language: "ts",
      code: `function camelToKebab(str) {
  return str.replace(/([A-Z])/g, (m) => "-" + m.toLowerCase());
}`,
    },
    solution: `function camelToKebab(str) {
  return str.replace(/([A-Z])/g, (m) => "-" + m.toLowerCase());
}`,
    tests: [
      { name: "converts camelCase", kind: "normal", call: 'camelToKebab("myVariableName")', expected: "my-variable-name" },
      { name: "single word", kind: "normal", call: 'camelToKebab("color")', expected: "color" },
      { name: "empty", kind: "empty", call: 'camelToKebab("")', expected: "" },
    ],
    hiddenTests: [
      { name: "consecutive capitals", kind: "invalid", call: 'camelToKebab("getURL")', expected: "get-u-r-l" },
    ],
    hints: ["Match each uppercase letter.", "Replace it with '-' + its lowercase."],
    explanation:
      "Insert a hyphen before each capital and lowercase it. Note: consecutive capitals (URL) each get a hyphen — a known simplification.",
    edgeCases: ["Consecutive capitals → each hyphenated (getURL → get-u-r-l)", "Already lowercase → unchanged", "Empty → ''"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    industrialNotes: ["Acronyms (URL, ID) need extra rules if you want get-url instead of get-u-r-l."],
    commonMistakes: ["Producing a leading hyphen if the string starts uppercase (handle if needed)."],
  },
  {
    id: "ch-snake-to-camel",
    slug: "snake-to-camel",
    title: "snake_case → camelCase",
    difficulty: "Intermediate",
    category: "Strings",
    tags: ["string", "regex", "case"],
    relatedMethods: ["replace"],
    flags: { realWorld: true, dataTransformation: true },
    problem:
      "Implement snakeToCamel(str) converting 'my_variable_name' to 'myVariableName'.",
    realWorldScenario: "Converting snake_case API fields to camelCase JS properties.",
    example: { input: 'snakeToCamel("my_variable_name")', output: '"myVariableName"' },
    constraints: ["Remove underscores", "Uppercase the letter following each underscore"],
    starterCode: `function snakeToCamel(str) {
  // my_variable_name -> myVariableName
}`,
    builtInSolution: { language: "ts", code: "// No built-in; regex replace" },
    manualSolution: { language: "ts", code: "str.split('_').map((w,i) => i ? w[0].toUpperCase()+w.slice(1) : w).join('')" },
    internalImplementation: {
      language: "ts",
      code: `function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}`,
    },
    solution: `function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}`,
    tests: [
      { name: "converts snake_case", kind: "normal", call: 'snakeToCamel("my_variable_name")', expected: "myVariableName" },
      { name: "single word", kind: "normal", call: 'snakeToCamel("color")', expected: "color" },
      { name: "empty", kind: "empty", call: 'snakeToCamel("")', expected: "" },
    ],
    hiddenTests: [
      { name: "leading word kept lowercase", kind: "normal", call: 'snakeToCamel("user_id")', expected: "userId" },
    ],
    hints: ["Match '_' followed by a letter.", "Replace with the uppercased letter (dropping the underscore)."],
    explanation:
      "Each underscore+letter becomes the uppercased letter, removing the underscore. The first word stays lowercase since it has no preceding underscore.",
    edgeCases: ["Leading word stays lowercase", "Trailing underscore left as-is", "Empty → ''"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    industrialNotes: ["Normalizing API field casing at the boundary keeps the rest of the app consistent."],
    commonMistakes: ["Uppercasing the first word.", "Leaving stray underscores."],
  },
];
