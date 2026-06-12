import { Challenge } from "@/lib/types";

// E5 — Frontend Industrial: the real UI-logic engines (filtering, tables,
// carts, coupons, permissions, trees, breadcrumbs, validation, undo/redo,
// toast queue). These compose the earlier primitives into shippable features.
export const industrialChallenges: Challenge[] = [
  {
    id: "ch-product-filter",
    slug: "product-filter-engine",
    title: "Product Filter Engine",
    difficulty: "Industrial",
    category: "Frontend",
    tags: ["filter", "ecommerce", "composition"],
    relatedMethods: ["filter"],
    flags: { realWorld: true, dataTransformation: true, interview: true },
    problem:
      "Implement filterProducts(products, filters) applying only the filters that are present: category, minPrice, maxPrice, inStock, and a case-insensitive name search.",
    realWorldScenario: "The filter sidebar on any e-commerce listing page.",
    example: { input: 'filterProducts(products, { category:"fruit", maxPrice:20 })', output: "products matching ALL active filters" },
    constraints: ["Skip filters that are absent (undefined)", "A product must pass EVERY active filter", "search matches name, case-insensitively"],
    starterCode: `function filterProducts(products, filters = {}) {
  // keep products that pass every ACTIVE filter
}`,
    builtInSolution: { language: "ts", code: "// Compose predicates with Array.filter" },
    manualSolution: { language: "ts", code: "for-loop pushing products that pass each present filter" },
    internalImplementation: {
      language: "ts",
      code: `function filterProducts(products, filters = {}) {
  return products.filter((p) => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.minPrice != null && p.price < filters.minPrice) return false;
    if (filters.maxPrice != null && p.price > filters.maxPrice) return false;
    if (filters.inStock && !p.inStock) return false;
    if (filters.search &&
        !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}`,
    },
    solution: `function filterProducts(products, filters = {}) {
  return products.filter((p) => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.minPrice != null && p.price < filters.minPrice) return false;
    if (filters.maxPrice != null && p.price > filters.maxPrice) return false;
    if (filters.inStock && !p.inStock) return false;
    if (filters.search &&
        !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}`,
    tests: [
      { name: "filters by category", kind: "normal", call: 'filterProducts([{name:"Apple",category:"fruit",price:10,inStock:true},{name:"Beef",category:"meat",price:50,inStock:false}], {category:"fruit"})', expected: [{ name: "Apple", category: "fruit", price: 10, inStock: true }] },
      { name: "price range", kind: "normal", call: 'filterProducts([{name:"Apple",category:"fruit",price:10,inStock:true},{name:"Beef",category:"meat",price:50,inStock:false}], {minPrice:20,maxPrice:60})', expected: [{ name: "Beef", category: "meat", price: 50, inStock: false }] },
      { name: "in stock only", kind: "normal", call: 'filterProducts([{name:"Apple",category:"fruit",price:10,inStock:true},{name:"Beef",category:"meat",price:50,inStock:false}], {inStock:true})', expected: [{ name: "Apple", category: "fruit", price: 10, inStock: true }] },
      { name: "no filters → all", kind: "empty", call: 'filterProducts([{name:"Apple",category:"fruit",price:10,inStock:true}], {})', expected: [{ name: "Apple", category: "fruit", price: 10, inStock: true }] },
    ],
    hiddenTests: [
      { name: "combined filters exclude", kind: "normal", call: 'filterProducts([{name:"Apple",category:"fruit",price:10,inStock:true}], {category:"fruit",maxPrice:5})', expected: [] },
      { name: "search is case-insensitive", kind: "normal", call: 'filterProducts([{name:"Apple",category:"fruit",price:10,inStock:true}], {search:"APP"})', expected: [{ name: "Apple", category: "fruit", price: 10, inStock: true }] },
    ],
    hints: ["Use != null so minPrice/maxPrice of 0 still apply.", "Return false the moment a present filter fails.", "Lowercase both sides of the search."],
    explanation:
      "Each present filter is an early-exit guard; a product survives only if it passes all of them. Checking `!= null` (not just truthy) lets a price of 0 work as a real bound.",
    edgeCases: ["minPrice/maxPrice of 0 must still apply (use != null, not truthiness)", "Empty filters → return everything", "Absent filters are ignored"],
    timeComplexity: "O(n · f) for f filters",
    spaceComplexity: "O(n) result",
    industrialNotes: ["Drive filters from URL query params so the filtered view is shareable/bookmarkable.", "Memoize the result; re-filtering every keystroke on huge lists janks the UI."],
    commonMistakes: ["Using truthiness for numeric bounds (drops 0).", "Re-filtering on every render without memoization."],
  },
  {
    id: "ch-table-controller",
    slug: "table-sort-filter-pagination",
    title: "Table: Sort + Filter + Pagination",
    difficulty: "Industrial",
    category: "Frontend",
    tags: ["table", "sort", "pagination", "composition"],
    relatedMethods: ["sort", "slice", "filter"],
    flags: { realWorld: true, dataTransformation: true, interview: true },
    problem:
      "Implement tableView(rows, opts) that filters by a query (any field), sorts by sortKey/sortDir, then paginates. Return { rows, total, totalPages }. Must not mutate the input.",
    realWorldScenario: "Every admin data table: search box + sortable headers + pager.",
    example: { input: 'tableView(rows, { query:"a", sortKey:"name", page:1, pageSize:10 })', output: "{ rows: [...page], total, totalPages }" },
    constraints: ["Order: filter → sort → paginate", "Don't mutate rows", "total = filtered count; totalPages from pageSize"],
    starterCode: `function tableView(rows, opts = {}) {
  // filter (query), then sort (sortKey/sortDir), then paginate
}`,
    builtInSolution: { language: "ts", code: "// Compose filter + toSorted/[...].sort + slice" },
    manualSolution: { language: "ts", code: "filter, copy+sort, then slice the page window" },
    internalImplementation: {
      language: "ts",
      code: `function tableView(rows, opts = {}) {
  const { sortKey, sortDir = "asc", page = 1, pageSize = 10, query = "" } = opts;
  let result = rows;
  if (query) {
    const q = query.toLowerCase();
    result = result.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(q)));
  }
  if (sortKey) {
    result = [...result].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortDir === "asc" ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }
  const total = result.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  return { rows: result.slice(start, start + pageSize), total, totalPages };
}`,
    },
    solution: `function tableView(rows, opts = {}) {
  const { sortKey, sortDir = "asc", page = 1, pageSize = 10, query = "" } = opts;
  let result = rows;
  if (query) {
    const q = query.toLowerCase();
    result = result.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(q)));
  }
  if (sortKey) {
    result = [...result].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortDir === "asc" ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }
  const total = result.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  return { rows: result.slice(start, start + pageSize), total, totalPages };
}`,
    tests: [
      { name: "sort + paginate page 1", kind: "normal", call: 'tableView([{n:3},{n:1},{n:2}], {sortKey:"n", pageSize:2, page:1})', expected: { rows: [{ n: 1 }, { n: 2 }], total: 3, totalPages: 2 } },
      { name: "page 2 is partial", kind: "normal", call: 'tableView([{n:3},{n:1},{n:2}], {sortKey:"n", pageSize:2, page:2})', expected: { rows: [{ n: 3 }], total: 3, totalPages: 2 } },
      { name: "query filters first", kind: "normal", call: 'tableView([{name:"Apple"},{name:"Banana"}], {query:"app"})', expected: { rows: [{ name: "Apple" }], total: 1, totalPages: 1 } },
      { name: "sort descending", kind: "normal", call: 'tableView([{n:1},{n:2}], {sortKey:"n", sortDir:"desc"})', expected: { rows: [{ n: 2 }, { n: 1 }], total: 2, totalPages: 1 } },
    ],
    hiddenTests: [
      { name: "does not mutate input", kind: "mutation", call: '(()=>{const r=[{n:3},{n:1}];tableView(r,{sortKey:"n"});return r;})()', expected: [{ n: 3 }, { n: 1 }] },
      { name: "empty rows", kind: "empty", call: "tableView([], {pageSize:10})", expected: { rows: [], total: 0, totalPages: 0 } },
    ],
    hints: ["Filter, THEN sort, THEN slice — order matters for correct totals.", "Copy before sorting so the input isn't mutated.", "start = (page - 1) * pageSize."],
    explanation:
      "The pipeline order is the whole point: filter narrows the set, sort orders the survivors, slice cuts the page. total/totalPages are computed from the FILTERED set, not the original.",
    edgeCases: ["totalPages of empty set is 0", "Copy before sort (sort mutates)", "query searches across all fields via Object.values"],
    timeComplexity: "O(n log n) from the sort",
    spaceComplexity: "O(n)",
    industrialNotes: ["For huge datasets, push filter/sort/paginate to the server and treat this as the client mirror.", "Keep sort stable; use toSorted to avoid mutating state."],
    commonMistakes: ["Paginating before filtering (wrong totals).", "Sorting the original array in place."],
  },
  {
    id: "ch-cart-total-tax",
    slug: "cart-total-calculator",
    title: "Cart Total Calculator",
    difficulty: "Intermediate",
    category: "Frontend",
    tags: ["reduce", "ecommerce", "money"],
    relatedMethods: ["reduce"],
    flags: { realWorld: true },
    problem:
      "Implement cartTotal(items, opts) = sum of price*qty (qty defaults to 1), plus tax (subtotal*taxRate) and flat shipping. Round to 2 decimals.",
    realWorldScenario: "The order summary box at checkout.",
    example: { input: "cartTotal([{price:100,qty:2}], {taxRate:0.1, shipping:20})", output: "240" },
    constraints: ["qty defaults to 1", "tax = subtotal * taxRate", "round to 2 decimals"],
    starterCode: `function cartTotal(items, opts = {}) {
  // subtotal + tax + shipping, rounded to 2 decimals
}`,
    builtInSolution: { language: "ts", code: "items.reduce(...) then add tax + shipping" },
    manualSolution: { language: "ts", code: "loop summing price*qty, then apply tax and shipping" },
    internalImplementation: {
      language: "ts",
      code: `function cartTotal(items, opts = {}) {
  const { taxRate = 0, shipping = 0 } = opts;
  const subtotal = items.reduce((s, i) => s + i.price * (i.qty ?? 1), 0);
  const total = subtotal + subtotal * taxRate + shipping;
  return Math.round(total * 100) / 100;
}`,
    },
    solution: `function cartTotal(items, opts = {}) {
  const { taxRate = 0, shipping = 0 } = opts;
  const subtotal = items.reduce((s, i) => s + i.price * (i.qty ?? 1), 0);
  const total = subtotal + subtotal * taxRate + shipping;
  return Math.round(total * 100) / 100;
}`,
    tests: [
      { name: "subtotal only", kind: "normal", call: "cartTotal([{price:100,qty:2},{price:50,qty:1}])", expected: 250 },
      { name: "with tax", kind: "normal", call: "cartTotal([{price:100,qty:1}], {taxRate:0.1})", expected: 110 },
      { name: "with tax + shipping", kind: "normal", call: "cartTotal([{price:100,qty:2}], {taxRate:0.1, shipping:20})", expected: 240 },
      { name: "qty defaults to 1", kind: "normal", call: "cartTotal([{price:10}])", expected: 10 },
      { name: "empty cart", kind: "empty", call: "cartTotal([])", expected: 0 },
    ],
    hiddenTests: [
      { name: "rounds to 2 decimals", kind: "normal", call: "cartTotal([{price:99.99,qty:1}], {taxRate:0.1})", expected: 109.99 },
    ],
    hints: ["reduce price*qty into a subtotal.", "Default qty with ?? 1.", "Round with Math.round(total*100)/100."],
    explanation:
      "Sum line totals, apply the tax rate to the subtotal, add flat shipping, then round once at the end to avoid floating-point cents drift.",
    edgeCases: ["Missing qty → treat as 1", "Empty cart → 0", "Round once at the end, not per item"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    industrialNotes: ["Money math: prefer integer cents or a decimal library to dodge float errors in real billing.", "Round at the boundary (display/charge), not mid-calculation."],
    commonMistakes: ["Forgetting the qty default.", "Rounding each item separately (accumulates error)."],
  },
  {
    id: "ch-coupon-engine",
    slug: "coupon-discount-engine",
    title: "Coupon Discount Engine",
    difficulty: "Advanced",
    category: "Frontend",
    tags: ["ecommerce", "rules", "money"],
    relatedMethods: [],
    flags: { realWorld: true, interview: true },
    problem:
      "Implement applyCoupon(total, coupon) supporting {type:'percent'|'fixed', value, minSpend?, maxDiscount?}. Respect minSpend (no discount below it) and cap the discount at maxDiscount. Never return below 0.",
    realWorldScenario: "Promo-code logic at checkout.",
    example: { input: 'applyCoupon(1000, {type:"percent", value:50, maxDiscount:100})', output: "900" },
    constraints: ["percent = total*value/100; fixed = value", "Below minSpend → no discount", "Cap discount at maxDiscount", "Result >= 0"],
    starterCode: `function applyCoupon(total, coupon) {
  // compute discounted total honoring minSpend + maxDiscount
}`,
    builtInSolution: { language: "ts", code: "// Pure rule evaluation — no built-in" },
    manualSolution: { language: "ts", code: "branch on type; clamp with Math.min/Math.max" },
    internalImplementation: {
      language: "ts",
      code: `function applyCoupon(total, coupon) {
  if (!coupon) return total;
  if (coupon.minSpend != null && total < coupon.minSpend) return total;
  let discount = coupon.type === "percent"
    ? total * (coupon.value / 100)
    : coupon.value;
  if (coupon.maxDiscount != null) discount = Math.min(discount, coupon.maxDiscount);
  return Math.max(0, Math.round((total - discount) * 100) / 100);
}`,
    },
    solution: `function applyCoupon(total, coupon) {
  if (!coupon) return total;
  if (coupon.minSpend != null && total < coupon.minSpend) return total;
  let discount = coupon.type === "percent"
    ? total * (coupon.value / 100)
    : coupon.value;
  if (coupon.maxDiscount != null) discount = Math.min(discount, coupon.maxDiscount);
  return Math.max(0, Math.round((total - discount) * 100) / 100);
}`,
    tests: [
      { name: "percent discount", kind: "normal", call: 'applyCoupon(200, {type:"percent", value:10})', expected: 180 },
      { name: "fixed discount", kind: "normal", call: 'applyCoupon(200, {type:"fixed", value:50})', expected: 150 },
      { name: "below minSpend → no discount", kind: "invalid", call: 'applyCoupon(50, {type:"percent", value:10, minSpend:100})', expected: 50 },
      { name: "caps at maxDiscount", kind: "normal", call: 'applyCoupon(1000, {type:"percent", value:50, maxDiscount:100})', expected: 900 },
    ],
    hiddenTests: [
      { name: "discount can't exceed total", kind: "invalid", call: 'applyCoupon(30, {type:"fixed", value:50})', expected: 0 },
      { name: "no coupon", kind: "nullish", call: "applyCoupon(100, null)", expected: 100 },
    ],
    hints: ["Guard minSpend first (return total unchanged).", "Compute discount by type, then Math.min with maxDiscount.", "Math.max(0, ...) so you never refund."],
    explanation:
      "Order of rules matters: check eligibility (minSpend), compute the raw discount, cap it (maxDiscount), then floor the result at 0. Each rule is an independent, testable clamp.",
    edgeCases: ["minSpend not met → full price", "Fixed discount larger than total → 0, not negative", "No coupon → unchanged"],
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    industrialNotes: ["Always re-validate coupons server-side; client logic is for UX preview only.", "Model stacking rules explicitly — order of application changes the total."],
    commonMistakes: ["Allowing negative totals.", "Applying the discount before the minSpend check."],
  },
  {
    id: "ch-role-permission",
    slug: "role-permission-checker",
    title: "Role Permission Checker",
    difficulty: "Intermediate",
    category: "Frontend",
    tags: ["set", "auth", "permissions"],
    relatedMethods: ["isSubsetOf", "Set"],
    flags: { realWorld: true, interview: true },
    problem:
      "Implement can(userPermissions, required) → true only if the user has ALL required permissions.",
    realWorldScenario: "Route guards and conditionally-rendered admin actions.",
    example: { input: 'can(["read","write","admin"], ["read","write"])', output: "true" },
    constraints: ["User must have EVERY required permission", "Empty required → true"],
    starterCode: `function can(userPermissions, required) {
  // does the user have all required permissions?
}`,
    builtInSolution: { language: "ts", code: "new Set(required).isSubsetOf(new Set(userPermissions))" },
    manualSolution: { language: "ts", code: "required.every(r => userPermissions.includes(r))" },
    internalImplementation: {
      language: "ts",
      code: `function can(userPermissions, required) {
  const have = new Set(userPermissions);   // O(1) lookups
  return required.every((perm) => have.has(perm));
}`,
    },
    solution: `function can(userPermissions, required) {
  const have = new Set(userPermissions);
  return required.every((perm) => have.has(perm));
}`,
    tests: [
      { name: "has all required", kind: "normal", call: 'can(["read","write","admin"], ["read","write"])', expected: true },
      { name: "missing one", kind: "normal", call: 'can(["read"], ["read","write"])', expected: false },
      { name: "empty required → true", kind: "empty", call: 'can(["read"], [])', expected: true },
      { name: "no permissions, something required", kind: "invalid", call: 'can([], ["read"])', expected: false },
    ],
    hiddenTests: [
      { name: "exact match", kind: "normal", call: 'can(["a","b"], ["a","b"])', expected: true },
    ],
    hints: ["Put user permissions in a Set for O(1) lookups.", "required.every(...) short-circuits on the first missing one.", "Empty required is vacuously true."],
    explanation:
      "This is a subset check: required ⊆ userPermissions. A Set makes each membership test O(1), so the whole check is O(n). The native Set.isSubsetOf expresses it directly.",
    edgeCases: ["Empty required → true (vacuous)", "Duplicate permissions don't matter (Set)", "Order-independent"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n) for the Set",
    industrialNotes: ["Enforce permissions on the SERVER too — hiding a button isn't security.", "Model 'any of' vs 'all of' explicitly; they're different checks."],
    commonMistakes: ["includes() in a loop → O(n·m).", "Confusing 'has any' with 'has all'."],
  },
  {
    id: "ch-menu-tree",
    slug: "menu-tree-builder",
    title: "Build a Menu Tree from Flat Data",
    difficulty: "Advanced",
    category: "Frontend",
    tags: ["tree", "recursion", "normalization"],
    relatedMethods: [],
    flags: { dataTransformation: true, interview: true, realWorld: true },
    problem:
      "Implement buildTree(items) turning flat items ({id, parentId}) into a nested tree where each node gets a children[] array. Root items have parentId null.",
    realWorldScenario: "Rendering nested nav menus, comment threads, or category trees from a flat API list.",
    example: { input: "buildTree([{id:1,parentId:null},{id:2,parentId:1}])", output: "[{id:1, parentId:null, children:[{id:2, parentId:1, children:[]}]}]" },
    constraints: ["Root = parentId null", "Every node gets children[] (empty if none)", "Preserve sibling order"],
    starterCode: `function buildTree(items, rootId = null) {
  // group by parentId, then recurse to nest children
}`,
    builtInSolution: { language: "ts", code: "// No built-in; group-by-parent then recurse" },
    manualSolution: { language: "ts", code: "build a Map of id→node with children[], then link each to its parent" },
    internalImplementation: {
      language: "ts",
      code: `function buildTree(items, rootId = null) {
  const byParent = {};
  for (const item of items) {
    const p = item.parentId ?? null;
    if (!byParent[p]) byParent[p] = [];
    byParent[p].push(item);
  }
  function build(parentId) {
    return (byParent[parentId] || []).map((item) => ({
      ...item,
      children: build(item.id),
    }));
  }
  return build(rootId);
}`,
    },
    solution: `function buildTree(items, rootId = null) {
  const byParent = {};
  for (const item of items) {
    const p = item.parentId ?? null;
    if (!byParent[p]) byParent[p] = [];
    byParent[p].push(item);
  }
  function build(parentId) {
    return (byParent[parentId] || []).map((item) => ({
      ...item,
      children: build(item.id),
    }));
  }
  return build(rootId);
}`,
    tests: [
      { name: "single root", kind: "normal", call: "buildTree([{id:1,parentId:null}])", expected: [{ id: 1, parentId: null, children: [] }] },
      { name: "one child", kind: "normal", call: "buildTree([{id:1,parentId:null},{id:2,parentId:1}])", expected: [{ id: 1, parentId: null, children: [{ id: 2, parentId: 1, children: [] }] }] },
      { name: "empty input", kind: "empty", call: "buildTree([])", expected: [] },
    ],
    hiddenTests: [
      { name: "two levels deep", kind: "normal", call: "buildTree([{id:1,parentId:null},{id:2,parentId:1},{id:3,parentId:2}])", expected: [{ id: 1, parentId: null, children: [{ id: 2, parentId: 1, children: [{ id: 3, parentId: 2, children: [] }] }] }] },
      { name: "two siblings", kind: "normal", call: "buildTree([{id:1,parentId:null},{id:2,parentId:1},{id:3,parentId:1}])", expected: [{ id: 1, parentId: null, children: [{ id: 2, parentId: 1, children: [] }, { id: 3, parentId: 1, children: [] }] }] },
    ],
    hints: ["First bucket items by their parentId.", "Recurse: a node's children are the items whose parentId is this node's id.", "Start the recursion from the root (parentId null)."],
    explanation:
      "Grouping by parentId first turns the O(n²) 'scan for children' into O(n); the recursion then nests each node's children by looking up its id in the groups.",
    edgeCases: ["Empty input → []", "Leaf nodes still get children: []", "Orphans (missing parent) won't appear under root — decide how to handle them"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    industrialNotes: ["The group-first approach avoids the naive O(n²) repeated filtering.", "Guard against cycles in untrusted data (a parent pointing at its descendant)."],
    commonMistakes: ["Filtering the whole array for children at each node (O(n²)).", "Forgetting leaf nodes need an empty children array."],
  },
  {
    id: "ch-breadcrumbs",
    slug: "breadcrumb-generator",
    title: "Breadcrumb Generator",
    difficulty: "Advanced",
    category: "Frontend",
    tags: ["tree", "navigation", "lookup"],
    relatedMethods: [],
    flags: { realWorld: true },
    problem:
      "Implement breadcrumbs(items, currentId) returning the path from the root down to currentId (inclusive), following parentId links. Unknown id → [].",
    realWorldScenario: "The 'Home / Products / Shoes' trail on a category page.",
    example: { input: "breadcrumbs(items, 3).map(x => x.label)", output: '["Home", "Products", "Shoes"]' },
    constraints: ["Walk up via parentId, then reverse to root→current", "Unknown id → []"],
    starterCode: `function breadcrumbs(items, currentId) {
  // walk parent links from current up to root, then reverse
}`,
    builtInSolution: { language: "ts", code: "// No built-in; id lookup + walk up the chain" },
    manualSolution: { language: "ts", code: "index by id, then follow parentId, unshifting each node" },
    internalImplementation: {
      language: "ts",
      code: `function breadcrumbs(items, currentId) {
  const byId = {};
  for (const item of items) byId[item.id] = item;
  const trail = [];
  let cur = byId[currentId];
  while (cur) {
    trail.unshift(cur);
    cur = cur.parentId != null ? byId[cur.parentId] : null;
  }
  return trail;
}`,
    },
    solution: `function breadcrumbs(items, currentId) {
  const byId = {};
  for (const item of items) byId[item.id] = item;
  const trail = [];
  let cur = byId[currentId];
  while (cur) {
    trail.unshift(cur);
    cur = cur.parentId != null ? byId[cur.parentId] : null;
  }
  return trail;
}`,
    tests: [
      { name: "full trail to leaf", kind: "normal", call: 'breadcrumbs([{id:1,parentId:null,label:"Home"},{id:2,parentId:1,label:"Products"},{id:3,parentId:2,label:"Shoes"}], 3).map(x=>x.label)', expected: ["Home", "Products", "Shoes"] },
      { name: "root only", kind: "normal", call: 'breadcrumbs([{id:1,parentId:null,label:"Home"}], 1).map(x=>x.label)', expected: ["Home"] },
      { name: "unknown id → []", kind: "invalid", call: 'breadcrumbs([{id:1,parentId:null,label:"Home"}], 99)', expected: [] },
    ],
    hiddenTests: [
      { name: "middle node", kind: "normal", call: 'breadcrumbs([{id:1,parentId:null,label:"Home"},{id:2,parentId:1,label:"Products"},{id:3,parentId:2,label:"Shoes"}], 2).map(x=>x.label)', expected: ["Home", "Products"] },
    ],
    hints: ["Index items by id for O(1) lookups.", "Start at current and unshift each node while walking parentId.", "Stop when parentId is null."],
    explanation:
      "Walking UP from the current node and unshifting builds the trail in root→current order without a second reverse pass. The id index keeps each hop O(1).",
    edgeCases: ["Unknown currentId → []", "Root node → single-item trail", "Broken parent link stops the walk safely"],
    timeComplexity: "O(depth)",
    spaceComplexity: "O(n) for the index",
    industrialNotes: ["Cache the id index if you generate breadcrumbs for many pages from the same tree."],
    commonMistakes: ["Building the trail current→root and forgetting to reverse.", "Infinite loop if data has a cycle — guard with a visited set."],
  },
  {
    id: "ch-multistep-validator",
    slug: "multi-step-form-validator",
    title: "Multi-Step Form Validator",
    difficulty: "Advanced",
    category: "Frontend",
    tags: ["forms", "validation"],
    relatedMethods: [],
    flags: { realWorld: true },
    problem:
      "Implement validateStep(fields, values) returning an errors map. Each field is {name, required?, minLength?}. 'Required' when required and empty; 'Too short' when shorter than minLength.",
    realWorldScenario: "Per-step validation in a checkout/onboarding wizard.",
    example: { input: 'validateStep([{name:"email", required:true}], {})', output: '{ email: "Required" }' },
    constraints: ["Only add a key for invalid fields", "Required beats minLength", "Empty errors object means the step is valid"],
    starterCode: `function validateStep(fields, values) {
  // return { fieldName: message } for invalid fields only
}`,
    builtInSolution: { language: "ts", code: "// HTML constraint validation handles simple cases natively" },
    manualSolution: { language: "ts", code: "loop fields; push messages by rule" },
    internalImplementation: {
      language: "ts",
      code: `function validateStep(fields, values) {
  const errors = {};
  for (const f of fields) {
    const v = values[f.name];
    if (f.required && (v == null || v === "")) {
      errors[f.name] = "Required";
    } else if (f.minLength != null && typeof v === "string" && v.length < f.minLength) {
      errors[f.name] = "Too short";
    }
  }
  return errors;
}`,
    },
    solution: `function validateStep(fields, values) {
  const errors = {};
  for (const f of fields) {
    const v = values[f.name];
    if (f.required && (v == null || v === "")) {
      errors[f.name] = "Required";
    } else if (f.minLength != null && typeof v === "string" && v.length < f.minLength) {
      errors[f.name] = "Too short";
    }
  }
  return errors;
}`,
    tests: [
      { name: "valid step", kind: "normal", call: 'validateStep([{name:"email", required:true}], {email:"a@b.com"})', expected: {} },
      { name: "missing required", kind: "invalid", call: 'validateStep([{name:"email", required:true}], {})', expected: { email: "Required" } },
      { name: "too short", kind: "invalid", call: 'validateStep([{name:"pw", required:true, minLength:6}], {pw:"123"})', expected: { pw: "Too short" } },
      { name: "multiple fields", kind: "normal", call: 'validateStep([{name:"a", required:true},{name:"b", required:true}], {a:"x"})', expected: { b: "Required" } },
    ],
    hiddenTests: [
      { name: "required beats minLength", kind: "invalid", call: 'validateStep([{name:"pw", required:true, minLength:6}], {pw:""})', expected: { pw: "Required" } },
    ],
    hints: ["Add a key ONLY when a rule fails.", "Check required (empty) before minLength.", "An empty errors object means valid."],
    explanation:
      "Each field maps to at most one message; required is checked first so an empty value reports 'Required' rather than 'Too short'. The caller treats {} as a valid step.",
    edgeCases: ["Empty/whitespace handling is a choice (here '' is empty)", "A field can pass with no rules", "isFormValid = every step's errors are empty"],
    timeComplexity: "O(fields)",
    spaceComplexity: "O(invalid fields)",
    industrialNotes: ["Return a field→message map so the UI can show errors inline next to each input.", "Compose steps: isFormValid = steps.every(s => Object.keys(validateStep(s, values)).length === 0)."],
    commonMistakes: ["Reporting both Required and Too short for the same empty field.", "Adding keys for valid fields."],
  },
  {
    id: "ch-undo-redo",
    slug: "undo-redo-manager",
    title: "Undo/Redo Manager",
    difficulty: "Advanced",
    category: "Frontend",
    tags: ["state", "closure", "history"],
    relatedMethods: [],
    flags: { realWorld: true, interview: true },
    problem:
      "Implement createHistory(initial) returning { current(), push(state), undo(), redo() }. push records a new state; undo/redo move through history. A new push after undo clears the redo stack.",
    realWorldScenario: "Undo/redo in an editor, form builder, or drawing tool.",
    example: { input: "h.push(1); h.push(2); h.undo(); h.current()", output: "1" },
    constraints: ["Two stacks: past + future", "push clears future", "undo/redo are no-ops at the ends"],
    starterCode: `function createHistory(initial) {
  // return { current, push, undo, redo } using past/future stacks
}`,
    builtInSolution: { language: "ts", code: "// No built-in; classic two-stack pattern" },
    manualSolution: { language: "ts", code: "track present + past[] + future[]" },
    internalImplementation: {
      language: "ts",
      code: `function createHistory(initial) {
  let present = initial;
  const past = [];
  const future = [];
  return {
    current: () => present,
    push(state) { past.push(present); present = state; future.length = 0; },
    undo() { if (past.length) { future.push(present); present = past.pop(); } return present; },
    redo() { if (future.length) { past.push(present); present = future.pop(); } return present; },
  };
}`,
    },
    solution: `function createHistory(initial) {
  let present = initial;
  const past = [];
  const future = [];
  return {
    current: () => present,
    push(state) { past.push(present); present = state; future.length = 0; },
    undo() { if (past.length) { future.push(present); present = past.pop(); } return present; },
    redo() { if (future.length) { past.push(present); present = future.pop(); } return present; },
  };
}`,
    tests: [
      { name: "push updates current", kind: "normal", call: "(()=>{const h=createHistory(0);h.push(1);h.push(2);return h.current();})()", expected: 2 },
      { name: "undo goes back", kind: "normal", call: "(()=>{const h=createHistory(0);h.push(1);h.push(2);h.undo();return h.current();})()", expected: 1 },
      { name: "redo goes forward", kind: "normal", call: "(()=>{const h=createHistory(0);h.push(1);h.undo();h.redo();return h.current();})()", expected: 1 },
      { name: "undo past start is a no-op", kind: "invalid", call: "(()=>{const h=createHistory(5);h.undo();return h.current();})()", expected: 5 },
    ],
    hiddenTests: [
      { name: "push clears redo", kind: "normal", call: "(()=>{const h=createHistory(0);h.push(1);h.undo();h.push(9);h.redo();return h.current();})()", expected: 9 },
    ],
    hints: ["Keep present + a past stack + a future stack.", "undo: push present to future, pop past into present.", "push must clear future (the redo branch is now invalid)."],
    explanation:
      "Two stacks model time: undo moves present→future and pulls from past; redo does the reverse. A fresh push invalidates the redo branch, so future is cleared — exactly how editors behave.",
    edgeCases: ["undo/redo at the ends do nothing", "A new push after undo erases the redo history", "Store immutable snapshots, not references you'll mutate"],
    timeComplexity: "O(1) per operation",
    spaceComplexity: "O(history length)",
    industrialNotes: ["Cap history length to bound memory.", "Store snapshots (or diffs) — never push a reference you'll later mutate."],
    commonMistakes: ["Forgetting to clear future on push (redo jumps to a stale branch).", "Pushing mutable references that change underneath you."],
  },
  {
    id: "ch-toast-queue",
    slug: "toast-queue-manager",
    title: "Toast Queue Manager",
    difficulty: "Advanced",
    category: "Frontend",
    tags: ["state", "queue", "ui"],
    relatedMethods: [],
    flags: { realWorld: true },
    problem:
      "Implement createToastQueue(max) returning { add(toast), dismiss(id), list() }. Keep at most `max` toasts; when full, drop the OLDEST.",
    realWorldScenario: "A notification/toast system that won't flood the screen.",
    example: { input: "q.add({id:1}); q.add({id:2}); q.add({id:3}) with max 2", output: "list() → [{id:2},{id:3}]" },
    constraints: ["Cap visible toasts at max (drop oldest)", "dismiss removes by id", "list returns current toasts in order"],
    starterCode: `function createToastQueue(max = 3) {
  // return { add, dismiss, list }; cap at max, drop oldest
}`,
    builtInSolution: { language: "ts", code: "// No built-in; bounded queue over an array" },
    manualSolution: { language: "ts", code: "push then slice the tail to max; filter by id to dismiss" },
    internalImplementation: {
      language: "ts",
      code: `function createToastQueue(max = 3) {
  let toasts = [];
  return {
    add(toast) {
      toasts = [...toasts, toast];
      if (toasts.length > max) toasts = toasts.slice(toasts.length - max);
    },
    dismiss(id) { toasts = toasts.filter((t) => t.id !== id); },
    list: () => toasts,
  };
}`,
    },
    solution: `function createToastQueue(max = 3) {
  let toasts = [];
  return {
    add(toast) {
      toasts = [...toasts, toast];
      if (toasts.length > max) toasts = toasts.slice(toasts.length - max);
    },
    dismiss(id) { toasts = toasts.filter((t) => t.id !== id); },
    list: () => toasts,
  };
}`,
    tests: [
      { name: "adds within cap", kind: "normal", call: "(()=>{const q=createToastQueue(3);q.add({id:1});q.add({id:2});return q.list().map(t=>t.id);})()", expected: [1, 2] },
      { name: "drops oldest over cap", kind: "normal", call: "(()=>{const q=createToastQueue(2);q.add({id:1});q.add({id:2});q.add({id:3});return q.list().map(t=>t.id);})()", expected: [2, 3] },
      { name: "dismiss by id", kind: "normal", call: "(()=>{const q=createToastQueue(3);q.add({id:1});q.add({id:2});q.dismiss(1);return q.list().map(t=>t.id);})()", expected: [2] },
    ],
    hiddenTests: [
      { name: "dismiss unknown id is harmless", kind: "invalid", call: "(()=>{const q=createToastQueue(3);q.add({id:1});q.dismiss(99);return q.list().map(t=>t.id);})()", expected: [1] },
    ],
    hints: ["Append, then if over max keep only the last `max` with slice.", "dismiss = filter out the matching id.", "list returns the current array."],
    explanation:
      "A bounded queue: each add appends and trims the front so only the newest `max` survive. dismiss filters by id. Returning new arrays keeps it React-state friendly.",
    edgeCases: ["Adding over capacity drops the oldest", "Dismissing an unknown id is a no-op", "Order preserved (oldest → newest)"],
    timeComplexity: "O(n) per add/dismiss (n = current toasts, small)",
    spaceComplexity: "O(max)",
    industrialNotes: ["Pair with auto-dismiss timers (setTimeout) and clear them on manual dismiss to avoid leaks.", "Returning new arrays makes this drop straight into React state."],
    commonMistakes: ["Mutating the array in place (breaks React change detection).", "Dropping the newest instead of the oldest when full."],
  },
];
