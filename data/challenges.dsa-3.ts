import { Challenge } from "@/lib/types";

// The interview patterns that were missing: Graphs (BFS/DFS on grids and
// dependency graphs), Heaps & Top-K, Tries, Tree BFS (level order) and Sorting
// algorithms. Mostly Intermediate/Advanced — the level product companies ask.
// Every test is checked against its own solution by scripts/verify.sh.

// JavaScript has no built-in heap, so heap problems ship this one in the
// starter code (learners focus on the PATTERN) and reuse it in the solution.
const HEAP = `// A tiny binary heap. compare(a, b) < 0 means "a comes out first".
class Heap {
  constructor(compare = (a, b) => a - b) {
    this.items = [];
    this.compare = compare;
  }
  get size() {
    return this.items.length;
  }
  peek() {
    return this.items[0];
  }
  push(x) {
    const a = this.items;
    a.push(x);
    let i = a.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.compare(a[parent], a[i]) <= 0) break;
      [a[parent], a[i]] = [a[i], a[parent]];
      i = parent;
    }
  }
  pop() {
    const a = this.items;
    const top = a[0];
    const last = a.pop();
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = l + 1;
        let best = i;
        if (l < a.length && this.compare(a[l], a[best]) < 0) best = l;
        if (r < a.length && this.compare(a[r], a[best]) < 0) best = r;
        if (best === i) break;
        [a[best], a[i]] = [a[i], a[best]];
        i = best;
      }
    }
    return top;
  }
}`;

/**
 * Builds a binary-tree object literal ({val,left,right} | null) from LeetCode's
 * level-order array notation, so tree tests stay readable: tree([3,9,20,null,null,15,7]).
 */
function tree(values: (number | null)[]): string {
  type N = { val: number; left: N | null; right: N | null };
  if (values.length === 0 || values[0] === null) return "null";
  const make = (val: number): N => ({ val, left: null, right: null });
  const root = make(values[0]);
  const queue: N[] = [root];
  let i = 1;
  while (queue.length > 0 && i < values.length) {
    const node = queue.shift() as N;
    const l = values[i++];
    if (l !== null && l !== undefined) {
      node.left = make(l);
      queue.push(node.left);
    }
    const r = values[i++];
    if (r !== null && r !== undefined) {
      node.right = make(r);
      queue.push(node.right);
    }
  }
  const src = (n: N | null): string =>
    n ? `{val:${n.val},left:${src(n.left)},right:${src(n.right)}}` : "null";
  return src(root);
}

const TREE_NOTE =
  "A node is { val, left, right } and an empty tree is null. (Examples write trees in level-order, e.g. [3,9,20,null,null,15,7].)";

export const dsaChallenges3: Challenge[] = [
  // ================= Graphs (BFS / DFS) =================
  {
    id: "dsa-number-of-islands", slug: "dsa-number-of-islands",
    title: "Number of Islands", difficulty: "Intermediate",
    category: "DSA · Graphs", tags: ["dsa", "graph", "dfs", "bfs", "grid"],
    reviewTags: ["graph", "dfs", "dsa"], flags: { interview: true },
    problem: "Given a grid of 1s (land) and 0s (water), count the islands. An island is a group of 1s connected up/down/left/right (not diagonally). Don't modify the input grid.",
    frontendScenario: "Counting connected regions — selected cells in a spreadsheet, clusters on a map, or groups of adjacent seats in a booking UI.",
    mentalModel: "Walk the grid. Every time you step on unvisited land, you've found a new island — then 'paint' the whole island as visited so you never count it again.",
    example: { input: "numIslands([[1,1,0],[0,1,0],[0,0,1]])", output: "2" },
    constraints: ["Diagonal cells are NOT connected.", "The grid may be empty ([])."],
    pseudocode: {
      understand: "Count groups of touching 1s.",
      input: "A 2D array of 0/1.",
      output: "A number — how many separate groups.",
      steps: [
        "Copy the grid so we can mark cells without touching the input.",
        "Scan every cell.",
        "If it's land (1): count += 1, then DFS/BFS from it, turning every connected 1 into 0.",
        "Return the count.",
      ],
    },
    starterCode: `function numIslands(grid) {\n  // count groups of 1s connected up/down/left/right\n}`,
    solution: `function numIslands(grid) {
  const g = grid.map((row) => [...row]); // don't mutate the input
  let count = 0;
  const sink = (r, c) => {
    if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] !== 1) return;
    g[r][c] = 0; // mark visited
    sink(r + 1, c);
    sink(r - 1, c);
    sink(r, c + 1);
    sink(r, c - 1);
  };
  for (let r = 0; r < g.length; r++) {
    for (let c = 0; c < g[0].length; c++) {
      if (g[r][c] === 1) {
        count++;
        sink(r, c);
      }
    }
  }
  return count;
}`,
    explanation: "Each unvisited land cell starts a new island; a DFS then 'sinks' every cell connected to it so it's never counted again. Every cell is visited a constant number of times → O(rows × cols).",
    tests: [
      { name: "three islands", kind: "normal", call: "numIslands([[1,1,0,0,0],[1,1,0,0,0],[0,0,1,0,0],[0,0,0,1,1]])", expected: 3 },
      { name: "one big island", kind: "normal", call: "numIslands([[1,1,1,1,0],[1,1,0,1,0],[1,1,0,0,0],[0,0,0,0,0]])", expected: 1 },
      { name: "diagonals don't connect", kind: "normal", call: "numIslands([[1,0],[0,1]])", expected: 2 },
      { name: "empty grid", kind: "empty", call: "numIslands([])", expected: 0 },
    ],
    hiddenTests: [
      { name: "all water", kind: "empty", call: "numIslands([[0,0],[0,0]])", expected: 0 },
      { name: "input not mutated", kind: "mutation", call: "(() => { const g = [[1,1],[0,1]]; numIslands(g); return g; })()", expected: [[1, 1], [0, 1]] },
    ],
    hints: ["Scan every cell; land you haven't visited = a new island.", "From that cell, visit all connected land (DFS or BFS) and mark it visited.", "Mark visited by changing 1 → 0 on a COPY of the grid."],
    commonMistakes: ["Counting diagonal neighbours as connected.", "Forgetting bounds checks before reading g[r][c].", "Mutating the caller's grid."],
    timeComplexity: "O(rows × cols)", spaceComplexity: "O(rows × cols)",
  },
  {
    id: "dsa-flood-fill", slug: "dsa-flood-fill",
    title: "Flood Fill (Paint Bucket)", difficulty: "Beginner",
    category: "DSA · Graphs", tags: ["dsa", "graph", "dfs", "grid"],
    reviewTags: ["graph", "dfs", "dsa"], flags: { interview: true },
    problem: "Implement the paint-bucket tool. Starting at image[sr][sc], recolor that pixel and every pixel connected to it (up/down/left/right) that has the SAME original color. Return a new image; don't mutate the input.",
    frontendScenario: "Literally the paint-bucket tool in a drawing app — and the same idea as 'select all connected cells' in a grid editor.",
    example: { input: "floodFill([[1,1,1],[1,1,0],[1,0,1]], 1, 1, 2)", output: "[[2,2,2],[2,2,0],[2,0,1]]" },
    starterCode: `function floodFill(image, sr, sc, color) {\n  // return a NEW image with the connected region recolored\n}`,
    solution: `function floodFill(image, sr, sc, color) {
  const grid = image.map((row) => [...row]);
  const start = grid[sr][sc];
  if (start === color) return grid; // nothing to do (and avoids looping forever)
  const stack = [[sr, sc]];
  while (stack.length) {
    const [r, c] = stack.pop();
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length) continue;
    if (grid[r][c] !== start) continue;
    grid[r][c] = color;
    stack.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]);
  }
  return grid;
}`,
    explanation: "An iterative DFS with an explicit stack: pop a pixel, skip it if it's out of bounds or not the original color, otherwise paint it and push its four neighbours. If the new color equals the old one, return early — otherwise painted pixels still 'match' and you'd loop forever.",
    tests: [
      { name: "classic example", kind: "normal", call: "floodFill([[1,1,1],[1,1,0],[1,0,1]], 1, 1, 2)", expected: [[2, 2, 2], [2, 2, 0], [2, 0, 1]] },
      { name: "same color = unchanged", kind: "normal", call: "floodFill([[0,0,0],[0,0,0]], 0, 0, 0)", expected: [[0, 0, 0], [0, 0, 0]] },
      { name: "single pixel", kind: "normal", call: "floodFill([[5]], 0, 0, 9)", expected: [[9]] },
    ],
    hiddenTests: [
      { name: "input not mutated", kind: "mutation", call: "(() => { const img = [[1,1],[1,0]]; floodFill(img, 0, 0, 5); return img; })()", expected: [[1, 1], [1, 0]] },
    ],
    hints: ["Remember the ORIGINAL color at the start pixel.", "Visit neighbours that still have the original color; paint them as you go.", "Handle color === original up front."],
    commonMistakes: ["Infinite loop when the new color equals the old one.", "Painting pixels of a different original color.", "Mutating the input image."],
    timeComplexity: "O(rows × cols)", spaceComplexity: "O(rows × cols)",
  },
  {
    id: "dsa-shortest-path-grid", slug: "dsa-shortest-path-grid",
    title: "Shortest Path in a Grid", difficulty: "Advanced",
    category: "DSA · Graphs", tags: ["dsa", "graph", "bfs", "grid"],
    reviewTags: ["graph", "bfs", "dsa"], flags: { interview: true },
    problem: "A grid has 0 (open) and 1 (wall) cells. Moving up/down/left/right, return the minimum number of steps from the top-left to the bottom-right cell, or -1 if it can't be reached (including when either end is a wall).",
    frontendScenario: "Pathfinding for a game board or a maze, or the fewest clicks between two screens in a navigation graph — BFS finds shortest paths in unweighted graphs.",
    mentalModel: "Drop a stone in water: BFS expands in rings — every cell at distance 1, then all at distance 2… The first time the ring touches the target, that's the shortest distance.",
    example: { input: "shortestPath([[0,0,0],[1,1,0],[0,0,0]])", output: "4" },
    starterCode: `function shortestPath(grid) {\n  // fewest steps from [0,0] to the bottom-right, or -1\n}`,
    solution: `function shortestPath(grid) {
  const rows = grid.length, cols = grid[0].length;
  if (grid[0][0] === 1 || grid[rows - 1][cols - 1] === 1) return -1;
  const seen = grid.map((row) => row.map(() => false));
  seen[0][0] = true;
  const queue = [[0, 0, 0]]; // [row, col, steps]
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (let head = 0; head < queue.length; head++) {
    const [r, c, steps] = queue[head];
    if (r === rows - 1 && c === cols - 1) return steps;
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (seen[nr][nc] || grid[nr][nc] === 1) continue;
      seen[nr][nc] = true;
      queue.push([nr, nc, steps + 1]);
    }
  }
  return -1;
}`,
    explanation: "BFS visits cells in order of distance, so the first time we dequeue the target we have the shortest path. Mark cells seen when ENQUEUED (not when dequeued) so nothing is queued twice. A moving 'head' index avoids O(n) queue.shift().",
    tests: [
      { name: "go around the wall", kind: "normal", call: "shortestPath([[0,0,0],[1,1,0],[0,0,0]])", expected: 4 },
      { name: "winding path", kind: "normal", call: "shortestPath([[0,1,0,0,0],[0,1,0,1,0],[0,0,0,1,0]])", expected: 10 },
      { name: "blocked", kind: "normal", call: "shortestPath([[0,1],[1,0]])", expected: -1 },
      { name: "already there", kind: "normal", call: "shortestPath([[0]])", expected: 0 },
    ],
    hiddenTests: [
      { name: "start is a wall", kind: "invalid", call: "shortestPath([[1,0],[0,0]])", expected: -1 },
    ],
    hints: ["Unweighted shortest path → BFS, not DFS.", "Queue entries carry [row, col, steps].", "Mark a cell visited when you push it, not when you pop it."],
    commonMistakes: ["Using DFS (finds A path, not the shortest).", "Marking visited on dequeue → the same cell is queued many times.", "Using queue.shift() in a loop (O(n) each)."],
    timeComplexity: "O(rows × cols)", spaceComplexity: "O(rows × cols)",
  },
  {
    id: "dsa-course-schedule", slug: "dsa-course-schedule",
    title: "Course Schedule (Detect a Cycle)", difficulty: "Advanced",
    category: "DSA · Graphs", tags: ["dsa", "graph", "topological-sort", "bfs"],
    reviewTags: ["graph", "topological-sort", "dsa"], flags: { interview: true },
    problem: "There are numCourses courses labelled 0…numCourses-1. prerequisites[i] = [a, b] means you must take b before a. Return true if you can finish every course (i.e. the dependency graph has no cycle).",
    frontendScenario: "Exactly what a bundler does when it orders modules — and how it detects circular imports. Same for task runners and dependency-aware form steps.",
    mentalModel: "Repeatedly take any course with zero remaining prerequisites. If you get stuck before taking them all, the leftovers are waiting on each other — a cycle.",
    example: { input: "canFinish(2, [[1,0],[0,1]])", output: "false" },
    pseudocode: {
      understand: "Can the dependencies be ordered so every course comes after its prerequisites?",
      input: "A course count and a list of [course, prerequisite] pairs.",
      output: "true / false.",
      steps: [
        "Build an adjacency list prereq → courses that need it, and count each course's incoming edges.",
        "Queue every course with 0 incoming edges.",
        "Pop a course, count it as taken, and decrement each dependent's count; queue any that hit 0.",
        "If taken === numCourses there was no cycle.",
      ],
    },
    starterCode: `function canFinish(numCourses, prerequisites) {\n  // true if there's no cycle in the dependency graph\n}`,
    solution: `function canFinish(numCourses, prerequisites) {
  const next = Array.from({ length: numCourses }, () => []);
  const indegree = new Array(numCourses).fill(0);
  for (const [course, pre] of prerequisites) {
    next[pre].push(course);
    indegree[course]++;
  }
  const queue = [];
  for (let i = 0; i < numCourses; i++) if (indegree[i] === 0) queue.push(i);
  let taken = 0;
  for (let head = 0; head < queue.length; head++) {
    taken++;
    for (const course of next[queue[head]]) {
      indegree[course]--;
      if (indegree[course] === 0) queue.push(course);
    }
  }
  return taken === numCourses;
}`,
    explanation: "Kahn's algorithm (topological sort by BFS): only courses whose prerequisites are all done can be taken. Courses in a cycle never reach indegree 0, so they're never taken and taken < numCourses. O(V + E).",
    tests: [
      { name: "simple chain", kind: "normal", call: "canFinish(2, [[1,0]])", expected: true },
      { name: "two-course cycle", kind: "normal", call: "canFinish(2, [[1,0],[0,1]])", expected: false },
      { name: "longer chain", kind: "normal", call: "canFinish(4, [[1,0],[2,1],[3,2]])", expected: true },
      { name: "three-course cycle", kind: "normal", call: "canFinish(3, [[0,1],[1,2],[2,0]])", expected: false },
    ],
    hiddenTests: [
      { name: "no prerequisites", kind: "empty", call: "canFinish(3, [])", expected: true },
      { name: "cycle beside a valid part", kind: "normal", call: "canFinish(5, [[1,0],[3,2],[2,3],[4,1]])", expected: false },
    ],
    hints: ["Model it as a directed graph: prerequisite → course.", "Count incoming edges (indegree) per course.", "Process courses with indegree 0; if you can't process them all, there's a cycle."],
    commonMistakes: ["Reversing the edge direction.", "Only checking for direct 2-course cycles.", "Forgetting courses that have no edges at all."],
    timeComplexity: "O(V + E)", spaceComplexity: "O(V + E)",
  },

  // ================= Heaps & Top-K =================
  {
    id: "dsa-kth-largest", slug: "dsa-kth-largest",
    title: "Kth Largest Element", difficulty: "Intermediate",
    category: "DSA · Heaps", tags: ["dsa", "heap", "top-k"],
    reviewTags: ["heap", "top-k", "dsa"], flags: { interview: true },
    problem: "Return the kth largest element in an unsorted array (the kth largest in sorted order, not the kth distinct). A Heap class is provided in the starter because JavaScript has no built-in one.",
    frontendScenario: "'Show the 10 highest-scoring items' from a stream of results without sorting everything — a size-k heap keeps only what matters.",
    mentalModel: "Keep a small 'leaderboard' of the k biggest numbers seen so far. Its smallest member sits on top; anything smaller than that can't make the board. At the end, the top of the board IS the kth largest.",
    example: { input: "findKthLargest([3,2,1,5,6,4], 2)", output: "5" },
    pseudocode: {
      understand: "Find the number that would sit at position k if the array were sorted largest-first.",
      input: "An array of numbers and k.",
      output: "One number.",
      steps: [
        "Create a MIN-heap.",
        "Push each number; if the heap grows past k, pop (throws away the smallest).",
        "The heap now holds the k largest; its minimum (peek) is the answer.",
      ],
    },
    starterCode: `${HEAP}\n\nfunction findKthLargest(nums, k) {\n  // keep a min-heap of size k\n}`,
    solution: `${HEAP}

function findKthLargest(nums, k) {
  const heap = new Heap(); // min-heap of the k largest seen so far
  for (const n of nums) {
    heap.push(n);
    if (heap.size > k) heap.pop();
  }
  return heap.peek();
}`,
    explanation: "A min-heap capped at k holds the k largest values; its root is the smallest of them, i.e. the kth largest overall. Each push/pop is O(log k), so the total is O(n log k) — better than sorting (O(n log n)) when k is small.",
    tests: [
      { name: "k = 2", kind: "normal", call: "findKthLargest([3,2,1,5,6,4], 2)", expected: 5 },
      { name: "with duplicates", kind: "duplicate", call: "findKthLargest([3,2,3,1,2,4,5,5,6], 4)", expected: 4 },
      { name: "single element", kind: "normal", call: "findKthLargest([1], 1)", expected: 1 },
    ],
    hiddenTests: [
      { name: "negatives", kind: "normal", call: "findKthLargest([-1,-1], 2)", expected: -1 },
      { name: "all equal", kind: "duplicate", call: "findKthLargest([7,7,7], 3)", expected: 7 },
    ],
    hints: ["Sorting works (O(n log n)) — interviewers will ask for better.", "A heap of size k only ever stores the k biggest so far.", "Min-heap: pop whenever size exceeds k."],
    commonMistakes: ["Using a max-heap of all n items (O(n log n) again).", "Returning the kth DISTINCT largest.", "Sorting with .sort() and no comparator (sorts as strings!)."],
    timeComplexity: "O(n log k)", spaceComplexity: "O(k)",
  },
  {
    id: "dsa-top-k-frequent", slug: "dsa-top-k-frequent",
    title: "Top K Frequent Elements", difficulty: "Intermediate",
    category: "DSA · Heaps", tags: ["dsa", "heap", "top-k", "hash", "bucket-sort"],
    reviewTags: ["top-k", "hash", "dsa"], flags: { interview: true },
    problem: "Return the k most frequent numbers, most frequent first. Break ties by the smaller number first.",
    frontendScenario: "'Trending tags', 'most-used emojis', 'top search terms' — count, then pick the top k.",
    example: { input: "topKFrequent([1,1,1,2,2,3], 2)", output: "[1,2]" },
    starterCode: `function topKFrequent(nums, k) {\n  // count, then take the k most frequent (ties → smaller number first)\n}`,
    solution: `function topKFrequent(nums, k) {
  const count = new Map();
  for (const n of nums) count.set(n, (count.get(n) || 0) + 1);
  // Bucket sort: buckets[f] = numbers that appear exactly f times.
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [n, f] of count) buckets[f].push(n);
  const out = [];
  for (let f = buckets.length - 1; f > 0 && out.length < k; f--) {
    const tied = buckets[f].sort((a, b) => a - b);
    for (const n of tied) {
      if (out.length === k) break;
      out.push(n);
    }
  }
  return out;
}`,
    explanation: "Count with a Map, then put each number into a bucket indexed by its frequency (a frequency can't exceed n). Walking buckets from high to low gives the most frequent first in O(n) — beating both full sorting and a heap. (A size-k heap is O(n log k) and is the go-to when you can't bucket.)",
    tests: [
      { name: "classic", kind: "normal", call: "topKFrequent([1,1,1,2,2,3], 2)", expected: [1, 2] },
      { name: "single", kind: "normal", call: "topKFrequent([1], 1)", expected: [1] },
      { name: "tie → smaller first", kind: "duplicate", call: "topKFrequent([5,3,5,3,1,1,1], 2)", expected: [1, 3] },
    ],
    hiddenTests: [
      { name: "zeros count", kind: "normal", call: "topKFrequent([3,0,1,0], 1)", expected: [0] },
      { name: "all tied", kind: "duplicate", call: "topKFrequent([4,4,5,5,6,6], 2)", expected: [4, 5] },
    ],
    hints: ["First count occurrences with a Map.", "A number's frequency is between 1 and n — use that as an array index.", "Walk frequencies from high to low until you have k."],
    commonMistakes: ["Returning frequencies instead of the numbers.", "Using an object for counts and getting string keys back.", "Ignoring the tie-break rule."],
    timeComplexity: "O(n) (bucket sort)", spaceComplexity: "O(n)",
  },
  {
    id: "dsa-last-stone-weight", slug: "dsa-last-stone-weight",
    title: "Last Stone Weight", difficulty: "Intermediate",
    category: "DSA · Heaps", tags: ["dsa", "heap", "simulation"],
    reviewTags: ["heap", "dsa"], flags: { interview: true },
    problem: "Each turn, smash the two heaviest stones x ≤ y together: if they're equal both are destroyed, otherwise a stone of weight y − x remains. Return the weight of the last stone, or 0 if none are left. (A Heap class is provided.)",
    frontendScenario: "Any 'always process the biggest/most urgent next' loop — a priority queue of jobs, toasts, or uploads.",
    example: { input: "lastStoneWeight([2,7,4,1,8,1])", output: "1" },
    starterCode: `${HEAP}\n\nfunction lastStoneWeight(stones) {\n  // repeatedly smash the two heaviest\n}`,
    solution: `${HEAP}

function lastStoneWeight(stones) {
  const heap = new Heap((a, b) => b - a); // max-heap
  for (const s of stones) heap.push(s);
  while (heap.size > 1) {
    const y = heap.pop();
    const x = heap.pop();
    if (y !== x) heap.push(y - x);
  }
  return heap.size ? heap.pop() : 0;
}`,
    explanation: "A max-heap always hands you the heaviest stone in O(log n), and re-inserting the leftover is O(log n) too. Re-sorting the array every turn would be O(n log n) per turn.",
    tests: [
      { name: "classic", kind: "normal", call: "lastStoneWeight([2,7,4,1,8,1])", expected: 1 },
      { name: "one stone", kind: "normal", call: "lastStoneWeight([1])", expected: 1 },
      { name: "equal pair destroys", kind: "duplicate", call: "lastStoneWeight([2,2])", expected: 0 },
    ],
    hiddenTests: [
      { name: "leftover after equal smash", kind: "normal", call: "lastStoneWeight([10,4,2,10])", expected: 2 },
      { name: "no stones", kind: "empty", call: "lastStoneWeight([])", expected: 0 },
    ],
    hints: ["You always need the two LARGEST — that's a max-heap.", "Pass a comparator (a, b) => b - a to flip the provided min-heap.", "Push the difference back if it's non-zero."],
    commonMistakes: ["Sorting the whole array every turn.", "Forgetting the 'no stones left' case."],
    timeComplexity: "O(n log n)", spaceComplexity: "O(n)",
  },
  {
    id: "dsa-merge-k-sorted", slug: "dsa-merge-k-sorted",
    title: "Merge K Sorted Arrays", difficulty: "Advanced",
    category: "DSA · Heaps", tags: ["dsa", "heap", "merge"],
    reviewTags: ["heap", "dsa"], flags: { interview: true },
    problem: "Given an array of sorted arrays, merge them into one sorted array. (A Heap class is provided.)",
    frontendScenario: "Merging several already-sorted feeds (notifications from different services, each sorted by time) into one timeline without re-sorting everything.",
    mentalModel: "Each list has a 'front runner'. Keep all the front runners in a min-heap; repeatedly take the smallest and replace it with the next item from the same list.",
    example: { input: "mergeKSorted([[1,4,5],[1,3,4],[2,6]])", output: "[1,1,2,3,4,4,5,6]" },
    starterCode: `${HEAP}\n\nfunction mergeKSorted(lists) {\n  // heap of each list's current front element\n}`,
    solution: `${HEAP}

function mergeKSorted(lists) {
  const heap = new Heap((a, b) => a[0] - b[0]); // entries: [value, listIndex, itemIndex]
  lists.forEach((list, i) => {
    if (list.length) heap.push([list[0], i, 0]);
  });
  const out = [];
  while (heap.size) {
    const [value, li, ii] = heap.pop();
    out.push(value);
    if (ii + 1 < lists[li].length) heap.push([lists[li][ii + 1], li, ii + 1]);
  }
  return out;
}`,
    explanation: "The heap never holds more than k entries (one per list), so each of the N total items costs O(log k): O(N log k) overall. Concatenating and sorting would be O(N log N) and ignores that the inputs are already sorted.",
    tests: [
      { name: "three lists", kind: "normal", call: "mergeKSorted([[1,4,5],[1,3,4],[2,6]])", expected: [1, 1, 2, 3, 4, 4, 5, 6] },
      { name: "no lists", kind: "empty", call: "mergeKSorted([])", expected: [] },
      { name: "uneven lengths", kind: "normal", call: "mergeKSorted([[5],[1,2,3]])", expected: [1, 2, 3, 5] },
    ],
    hiddenTests: [
      { name: "empty lists inside", kind: "empty", call: "mergeKSorted([[],[1],[]])", expected: [1] },
      { name: "multi-digit numbers", kind: "normal", call: "mergeKSorted([[2,10],[1,100]])", expected: [1, 2, 10, 100] },
    ],
    hints: ["Start with the first element of every non-empty list in a min-heap.", "Store WHERE each value came from: [value, listIndex, itemIndex].", "After popping, push the next item from that same list."],
    commonMistakes: ["Concatenating then .sort() with no comparator (sorts as strings).", "Pushing from empty lists.", "Losing track of which list a value came from."],
    timeComplexity: "O(N log k)", spaceComplexity: "O(k) extra",
  },

  // ================= Tries =================
  {
    id: "dsa-search-suggestions", slug: "dsa-search-suggestions",
    title: "Search Suggestions (Autocomplete)", difficulty: "Intermediate",
    category: "DSA · Tries", tags: ["dsa", "trie", "string", "autocomplete"],
    reviewTags: ["trie", "dsa"], flags: { interview: true, realWorld: true },
    problem: "Build typeahead. After each character of searchWord is typed, return up to 3 products (alphabetically smallest) that start with what's been typed so far. Return an array with one list per typed character.",
    frontendScenario: "The dropdown under every search box. A trie answers 'what starts with this prefix?' in time proportional to the prefix, not the size of the catalogue.",
    mentalModel: "A trie is a tree of letters: each path from the root spells a prefix. If every node also remembers its 3 best words, typing a letter is just one step down the tree.",
    example: { input: `suggestedProducts(["mobile","mouse","moneypot","monitor","mousepad"], "mou")`, output: `[["mobile","moneypot","monitor"],["mobile","moneypot","monitor"],["mouse","mousepad"]]` },
    starterCode: `function suggestedProducts(products, searchWord) {\n  // one list of up to 3 suggestions per typed character\n}`,
    solution: `function suggestedProducts(products, searchWord) {
  const root = { children: {}, top: [] };
  // Insert in sorted order so each node's "top" fills with the smallest words.
  for (const word of [...products].sort()) {
    let node = root;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = { children: {}, top: [] };
      node = node.children[ch];
      if (node.top.length < 3) node.top.push(word);
    }
  }
  const out = [];
  let node = root;
  for (const ch of searchWord) {
    node = node && node.children[ch];
    out.push(node ? node.top : []);
  }
  return out;
}`,
    explanation: "Sort once, then insert every product into a trie; each node keeps the first 3 words that pass through it — which, thanks to sorted insertion, are the 3 smallest. Each keystroke is then a single step down the trie. Once a prefix has no match, every longer prefix has none either.",
    tests: [
      { name: "mouse", kind: "normal", call: `suggestedProducts(["mobile","mouse","moneypot","monitor","mousepad"], "mouse")`, expected: [["mobile", "moneypot", "monitor"], ["mobile", "moneypot", "monitor"], ["mouse", "mousepad"], ["mouse", "mousepad"], ["mouse", "mousepad"]] },
      { name: "narrowing down", kind: "normal", call: `suggestedProducts(["bags","baggage","banner","box","cloths"], "bags")`, expected: [["baggage", "bags", "banner"], ["baggage", "bags", "banner"], ["baggage", "bags"], ["bags"]] },
      { name: "no match", kind: "empty", call: `suggestedProducts(["apple"], "b")`, expected: [[]] },
    ],
    hiddenTests: [
      { name: "no products", kind: "empty", call: `suggestedProducts([], "ab")`, expected: [[], []] },
      { name: "input not mutated", kind: "mutation", call: `(() => { const p = ["b","a"]; suggestedProducts(p, "a"); return p; })()`, expected: ["b", "a"] },
    ],
    hints: ["Sort the products first.", "In a trie, each node = one prefix. Store up to 3 words at each node.", "Walk the trie one character per keystroke."],
    commonMistakes: ["Re-filtering the whole product list on every keystroke (O(n·m) per key).", "Sorting the caller's array in place.", "Continuing to look up children after the prefix already failed."],
    timeComplexity: "O(n log n · L) to build, O(L) per query", spaceComplexity: "O(total characters)",
  },
  {
    id: "dsa-implement-trie", slug: "dsa-implement-trie",
    title: "Implement a Trie", difficulty: "Intermediate",
    category: "DSA · Tries", tags: ["dsa", "trie", "design"],
    reviewTags: ["trie", "dsa"], flags: { interview: true },
    problem: "Write createTrie() returning an object with insert(word), search(word) → true if that exact word was inserted, and startsWith(prefix) → true if any inserted word starts with prefix.",
    frontendScenario: "The data structure behind autocomplete, route matching (/users/:id), and spell-checkers.",
    example: { input: `const t = createTrie(); t.insert("apple"); [t.search("apple"), t.search("app"), t.startsWith("app")]`, output: "[true, false, true]" },
    starterCode: `function createTrie() {\n  // each node: { children: {}, end: false }\n  return {\n    insert(word) {},\n    search(word) {},\n    startsWith(prefix) {},\n  };\n}`,
    solution: `function createTrie() {
  const root = { children: {}, end: false };
  // Follow s letter by letter; null if the path breaks.
  const walk = (s) => {
    let node = root;
    for (const ch of s) {
      node = node.children[ch];
      if (!node) return null;
    }
    return node;
  };
  return {
    insert(word) {
      let node = root;
      for (const ch of word) {
        if (!node.children[ch]) node.children[ch] = { children: {}, end: false };
        node = node.children[ch];
      }
      node.end = true; // a word finishes here
    },
    search(word) {
      const node = walk(word);
      return !!node && node.end;
    },
    startsWith(prefix) {
      return walk(prefix) !== null;
    },
  };
}`,
    explanation: "Each node maps a character to the next node. insert creates missing nodes and flags the last one as a word end. search and startsWith share one walk; the only difference is that search also requires the end flag. All operations are O(word length), regardless of how many words are stored.",
    tests: [
      { name: "search vs startsWith", kind: "normal", call: `(() => { const t = createTrie(); t.insert("apple"); return [t.search("apple"), t.search("app"), t.startsWith("app")]; })()`, expected: [true, false, true] },
      { name: "insert a prefix word", kind: "normal", call: `(() => { const t = createTrie(); t.insert("apple"); t.insert("app"); return t.search("app"); })()`, expected: true },
      { name: "longer than stored", kind: "normal", call: `(() => { const t = createTrie(); t.insert("cat"); return [t.search("ca"), t.startsWith("cats"), t.search("cat")]; })()`, expected: [false, false, true] },
    ],
    hiddenTests: [
      { name: "empty trie", kind: "empty", call: `createTrie().search("a")`, expected: false },
      { name: "empty prefix", kind: "empty", call: `createTrie().startsWith("")`, expected: true },
    ],
    hints: ["Node shape: { children: {}, end: false }.", "insert: walk/create one node per character, then set end = true.", "search and startsWith both walk the trie — only search checks end."],
    commonMistakes: ["Returning true from search for a prefix that was never inserted as a word.", "Storing whole words at the root instead of one char per level."],
    timeComplexity: "O(L) per operation", spaceComplexity: "O(total characters)",
  },
  {
    id: "dsa-replace-words", slug: "dsa-replace-words",
    title: "Replace Words with Roots", difficulty: "Intermediate",
    category: "DSA · Tries", tags: ["dsa", "trie", "string"],
    reviewTags: ["trie", "dsa"], flags: { interview: true },
    problem: "Given a list of root words and a sentence, replace every word in the sentence with the SHORTEST root that is a prefix of it (leave it unchanged if no root matches). Return the new sentence.",
    frontendScenario: "Normalizing search terms to their stem, or collapsing URL paths to their registered route prefix.",
    example: { input: `replaceWords(["cat","bat","rat"], "the cattle was rattled by the battery")`, output: `"the cat was rat by the bat"` },
    starterCode: `function replaceWords(roots, sentence) {\n  // replace each word with its shortest matching root\n}`,
    solution: `function replaceWords(roots, sentence) {
  const root = { children: {}, end: false };
  for (const r of roots) {
    let node = root;
    for (const ch of r) {
      if (!node.children[ch]) node.children[ch] = { children: {}, end: false };
      node = node.children[ch];
    }
    node.end = true;
  }
  const shortestRoot = (word) => {
    let node = root;
    for (let i = 0; i < word.length; i++) {
      node = node.children[word[i]];
      if (!node) return word; // no root matches
      if (node.end) return word.slice(0, i + 1); // first (shortest) root found
    }
    return word;
  };
  return sentence.split(" ").map(shortestRoot).join(" ");
}`,
    explanation: "Put the roots in a trie. For each word, walk the trie and stop at the FIRST node marked as a root end — that's the shortest matching root. Checking every root against every word would be O(roots × words × length).",
    tests: [
      { name: "classic", kind: "normal", call: `replaceWords(["cat","bat","rat"], "the cattle was rattled by the battery")`, expected: "the cat was rat by the bat" },
      { name: "single letters", kind: "normal", call: `replaceWords(["a","b","c"], "aadsfasf absbs bbab cadsfafs")`, expected: "a a b c" },
      { name: "shortest wins", kind: "normal", call: `replaceWords(["aa","a"], "aaa")`, expected: "a" },
    ],
    hiddenTests: [
      { name: "no roots", kind: "empty", call: `replaceWords([], "hello world")`, expected: "hello world" },
    ],
    hints: ["Insert every root into a trie.", "Walk each word through the trie; stop at the first word-end node.", "If the path breaks, keep the original word."],
    commonMistakes: ["Returning the LONGEST matching root.", "Matching roots anywhere in the word instead of only as a prefix."],
    timeComplexity: "O(total characters)", spaceComplexity: "O(total root characters)",
  },
  {
    id: "dsa-longest-word", slug: "dsa-longest-word",
    title: "Longest Word Built One Letter at a Time", difficulty: "Advanced",
    category: "DSA · Tries", tags: ["dsa", "trie", "string", "set"],
    reviewTags: ["trie", "dsa"], flags: { interview: true },
    problem: "Return the longest word in the list that can be built one character at a time, where every prefix along the way (\"w\", \"wo\", \"wor\"…) is also in the list. On a tie, return the alphabetically smallest. Return \"\" if none.",
    frontendScenario: "Validating that every step of a nested path exists (/a, /a/b, /a/b/c) — a prefix-chain check.",
    example: { input: `longestWord(["w","wo","wor","worl","world"])`, output: `"world"` },
    starterCode: `function longestWord(words) {\n  // every prefix must also be a word\n}`,
    solution: `function longestWord(words) {
  // Shorter words first (so prefixes are seen before the words built on them),
  // alphabetical within the same length (so the first longest is the smallest).
  const sorted = [...words].sort((a, b) => a.length - b.length || (a < b ? -1 : a > b ? 1 : 0));
  const buildable = new Set([""]);
  let best = "";
  for (const w of sorted) {
    if (buildable.has(w.slice(0, -1))) {
      buildable.add(w);
      if (w.length > best.length) best = w;
    }
  }
  return best;
}`,
    explanation: "A word is buildable if the word minus its last letter is buildable. Processing shorter words first guarantees that answer is already known. A trie does the same thing (a word is valid if every node on its path is a word end); a Set of buildable words is the hashing equivalent and simpler to write in an interview — say both.",
    tests: [
      { name: "world", kind: "normal", call: `longestWord(["w","wo","wor","worl","world"])`, expected: "world" },
      { name: "tie → alphabetical", kind: "normal", call: `longestWord(["a","banana","app","appl","ap","apply","apple"])`, expected: "apple" },
      { name: "no single-letter start", kind: "invalid", call: `longestWord(["abc"])`, expected: "" },
    ],
    hiddenTests: [
      { name: "empty list", kind: "empty", call: `longestWord([])`, expected: "" },
      { name: "two chains, same length", kind: "normal", call: `longestWord(["b","ba","bac","a","ab","abc"])`, expected: "abc" },
    ],
    hints: ["A word counts only if word.slice(0, -1) also counts.", "Process words shortest-first so prefixes are decided before longer words.", "Sort alphabetically within a length to get the tie-break for free."],
    commonMistakes: ["Only checking that the word minus one letter EXISTS, not that it is itself buildable.", "Getting the tie-break backwards."],
    timeComplexity: "O(n log n · L)", spaceComplexity: "O(n · L)",
  },

  // ================= Tree BFS (level order) =================
  {
    id: "dsa-level-order", slug: "dsa-level-order",
    title: "Binary Tree Level Order Traversal", difficulty: "Intermediate",
    category: "DSA · Tree BFS", tags: ["dsa", "tree", "bfs", "queue"],
    reviewTags: ["tree", "bfs", "dsa"], flags: { interview: true },
    problem: `Return the values of a binary tree level by level, left to right, as an array of arrays. ${TREE_NOTE}`,
    frontendScenario: "Rendering a nested menu or org chart row by row, or processing a DOM tree breadth-first (e.g. 'what's visible at depth 2?').",
    mentalModel: "A queue holds one whole level. Note its length, take exactly that many nodes off the front (that's this level), and push their children (that's the next level).",
    example: { input: "levelOrder(root)  // root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" },
    pseudocode: {
      understand: "Group node values by depth.",
      input: "The root node (or null).",
      output: "An array of levels, each an array of values.",
      steps: [
        "If root is null return [].",
        "queue = [root].",
        "While the queue isn't empty: size = queue.length; pop size nodes into this level, pushing their children.",
        "Push the level to the result.",
      ],
    },
    starterCode: `function levelOrder(root) {\n  // [[level 0 values], [level 1 values], ...]\n}`,
    solution: `function levelOrder(root) {
  if (!root) return [];
  const result = [];
  let level = [root];
  while (level.length) {
    result.push(level.map((node) => node.val));
    const next = [];
    for (const node of level) {
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    level = next;
  }
  return result;
}`,
    explanation: "BFS processes a tree one level at a time. Keeping the current level as its own array (and building the next one from its children) makes the level boundaries explicit — no need to track depth per node. Every node is visited once → O(n).",
    tests: [
      { name: "three levels", kind: "normal", call: `levelOrder(${tree([3, 9, 20, null, null, 15, 7])})`, expected: [[3], [9, 20], [15, 7]] },
      { name: "single node", kind: "normal", call: `levelOrder(${tree([1])})`, expected: [[1]] },
      { name: "empty tree", kind: "empty", call: "levelOrder(null)", expected: [] },
    ],
    hiddenTests: [
      { name: "gaps in the tree", kind: "normal", call: `levelOrder(${tree([1, 2, 3, 4, null, null, 5])})`, expected: [[1], [2, 3], [4, 5]] },
    ],
    hints: ["Breadth-first = a queue (or level-by-level arrays).", "Process the tree one LEVEL at a time.", "Skip null children."],
    commonMistakes: ["Using recursion/DFS and getting values in the wrong order.", "Pushing null children into the queue.", "Mixing two levels into one array."],
    timeComplexity: "O(n)", spaceComplexity: "O(w) (w = widest level)",
  },
  {
    id: "dsa-min-depth", slug: "dsa-min-depth",
    title: "Minimum Depth of Binary Tree", difficulty: "Beginner",
    category: "DSA · Tree BFS", tags: ["dsa", "tree", "bfs"],
    reviewTags: ["tree", "bfs", "dsa"], flags: { interview: true },
    problem: `Return the number of nodes on the shortest path from the root down to the nearest LEAF (a node with no children). ${TREE_NOTE}`,
    frontendScenario: "'What's the fewest clicks to reach a final page in this menu?' — BFS stops as soon as it finds the first leaf.",
    example: { input: "minDepth(root)  // root = [3,9,20,null,null,15,7]", output: "2" },
    starterCode: `function minDepth(root) {\n  // depth of the nearest leaf (null tree → 0)\n}`,
    solution: `function minDepth(root) {
  if (!root) return 0;
  let level = [root];
  let depth = 1;
  while (level.length) {
    const next = [];
    for (const node of level) {
      if (!node.left && !node.right) return depth; // first leaf = shallowest
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    level = next;
    depth++;
  }
  return depth;
}`,
    explanation: "BFS visits levels top-down, so the first leaf it meets is the shallowest one and we can stop early — great for lopsided trees. The classic bug with recursion is min(left, right) when one side is null: a missing child is not a leaf, so it must not count as depth 0.",
    tests: [
      { name: "leaf on level 2", kind: "normal", call: `minDepth(${tree([3, 9, 20, null, null, 15, 7])})`, expected: 2 },
      { name: "one-sided chain", kind: "normal", call: `minDepth(${tree([2, null, 3, null, 4, null, 5, null, 6])})`, expected: 5 },
      { name: "empty tree", kind: "empty", call: "minDepth(null)", expected: 0 },
    ],
    hiddenTests: [
      { name: "root with one child is not a leaf", kind: "normal", call: `minDepth(${tree([1, 2])})`, expected: 2 },
    ],
    hints: ["A leaf has NO children.", "BFS level by level; return the depth at the first leaf.", "A root with only one child is NOT a leaf."],
    commonMistakes: ["1 + Math.min(minDepth(left), minDepth(right)) — returns 1 for a root with one child.", "Treating a null child as a leaf."],
    timeComplexity: "O(n)", spaceComplexity: "O(w)",
  },
  {
    id: "dsa-right-side-view", slug: "dsa-right-side-view",
    title: "Binary Tree Right Side View", difficulty: "Intermediate",
    category: "DSA · Tree BFS", tags: ["dsa", "tree", "bfs"],
    reviewTags: ["tree", "bfs", "dsa"], flags: { interview: true },
    problem: `Imagine standing to the right of the tree. Return the values you can see, top to bottom (the last node of each level). ${TREE_NOTE}`,
    frontendScenario: "Showing the last item at each depth of a nested structure — e.g. the most recent reply at each thread depth.",
    example: { input: "rightSideView(root)  // root = [1,2,3,null,5,null,4]", output: "[1,3,4]" },
    starterCode: `function rightSideView(root) {\n  // last value of each level\n}`,
    solution: `function rightSideView(root) {
  if (!root) return [];
  const view = [];
  let level = [root];
  while (level.length) {
    view.push(level[level.length - 1].val);
    const next = [];
    for (const node of level) {
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    level = next;
  }
  return view;
}`,
    explanation: "It's level-order traversal where you keep only the LAST node of each level. Note it isn't 'walk right children only' — when a level's rightmost node is a left child, you still see it.",
    tests: [
      { name: "classic", kind: "normal", call: `rightSideView(${tree([1, 2, 3, null, 5, null, 4])})`, expected: [1, 3, 4] },
      { name: "right chain", kind: "normal", call: `rightSideView(${tree([1, null, 3])})`, expected: [1, 3] },
      { name: "empty tree", kind: "empty", call: "rightSideView(null)", expected: [] },
    ],
    hiddenTests: [
      { name: "deep left node is visible", kind: "normal", call: `rightSideView(${tree([1, 2, 3, 4])})`, expected: [1, 3, 4] },
    ],
    hints: ["Do a level-order traversal.", "From each level, keep only the last node."],
    commonMistakes: ["Only following .right pointers — misses left-side nodes that stick out deeper."],
    timeComplexity: "O(n)", spaceComplexity: "O(w)",
  },
  {
    id: "dsa-zigzag-level-order", slug: "dsa-zigzag-level-order",
    title: "Zigzag Level Order Traversal", difficulty: "Intermediate",
    category: "DSA · Tree BFS", tags: ["dsa", "tree", "bfs"],
    reviewTags: ["tree", "bfs", "dsa"], flags: { interview: true },
    problem: `Return level-order values, but alternate direction each level: left→right, then right→left, and so on. ${TREE_NOTE}`,
    frontendScenario: "A twist interviewers add after level order to check you can adapt a pattern instead of memorizing it.",
    example: { input: "zigzagLevelOrder(root)  // root = [3,9,20,null,null,15,7]", output: "[[3],[20,9],[15,7]]" },
    starterCode: `function zigzagLevelOrder(root) {\n  // level order, alternating direction\n}`,
    solution: `function zigzagLevelOrder(root) {
  if (!root) return [];
  const result = [];
  let level = [root];
  let leftToRight = true;
  while (level.length) {
    const values = level.map((node) => node.val);
    result.push(leftToRight ? values : values.reverse());
    const next = [];
    for (const node of level) {
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    level = next;
    leftToRight = !leftToRight;
  }
  return result;
}`,
    explanation: "Traverse normally (always left→right) and only flip the VALUES of every other level. Trying to reverse the traversal order itself tangles up which children come next.",
    tests: [
      { name: "three levels", kind: "normal", call: `zigzagLevelOrder(${tree([3, 9, 20, null, null, 15, 7])})`, expected: [[3], [20, 9], [15, 7]] },
      { name: "full tree", kind: "normal", call: `zigzagLevelOrder(${tree([1, 2, 3, 4, 5, 6, 7])})`, expected: [[1], [3, 2], [4, 5, 6, 7]] },
      { name: "empty tree", kind: "empty", call: "zigzagLevelOrder(null)", expected: [] },
    ],
    hints: ["Start from your level-order solution.", "Flip a boolean each level; reverse that level's values when it's false."],
    commonMistakes: ["Reversing the order children are queued (breaks the next level).", "Reversing every level."],
    timeComplexity: "O(n)", spaceComplexity: "O(w)",
  },

  // ================= Sorting =================
  {
    id: "dsa-sort-colors", slug: "dsa-sort-colors",
    title: "Sort Colors (0s, 1s and 2s)", difficulty: "Intermediate",
    category: "DSA · Sorting", tags: ["dsa", "sorting", "two-pointers", "in-place"],
    reviewTags: ["sorting", "two-pointers", "dsa"], flags: { interview: true },
    problem: "An array contains only 0, 1 and 2. Sort it IN PLACE in a single pass without .sort(), and return the same array.",
    frontendScenario: "Partitioning items into three buckets — e.g. 'errors, warnings, info' or 'pinned, normal, archived' — in one pass.",
    mentalModel: "Three zones: everything left of `low` is 0, everything right of `high` is 2. A `mid` pointer scans the unknown middle, throwing 0s left and 2s right.",
    example: { input: "sortColors([2,0,2,1,1,0])", output: "[0,0,1,1,2,2]" },
    starterCode: `function sortColors(nums) {\n  // one pass, in place, no .sort()\n  return nums;\n}`,
    solution: `function sortColors(nums) {
  let low = 0, mid = 0, high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 2) {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--; // don't move mid: the swapped-in value is still unchecked
    } else {
      mid++;
    }
  }
  return nums;
}`,
    explanation: "Dijkstra's Dutch National Flag algorithm. [0, low) holds 0s, [low, mid) holds 1s, (high, end] holds 2s, and [mid, high] is unknown. Each step shrinks the unknown region by one → O(n) time, O(1) space.",
    tests: [
      { name: "classic", kind: "normal", call: "sortColors([2,0,2,1,1,0])", expected: [0, 0, 1, 1, 2, 2] },
      { name: "three items", kind: "normal", call: "sortColors([2,0,1])", expected: [0, 1, 2] },
      { name: "empty", kind: "empty", call: "sortColors([])", expected: [] },
      { name: "sorts in place", kind: "mutation", call: `(() => { const a = [2,1,0]; const r = sortColors(a); return r === a && a.join(""); })()`, expected: "012" },
    ],
    hiddenTests: [
      { name: "all twos", kind: "duplicate", call: "sortColors([2,2,2])", expected: [2, 2, 2] },
    ],
    hints: ["Counting 0s/1s/2s then rewriting is two passes — try for one.", "Use three pointers: low, mid, high.", "After swapping a 2 to the end, re-check the value that came back to mid."],
    commonMistakes: ["Advancing mid after swapping with high.", "Returning a new array instead of sorting in place."],
    timeComplexity: "O(n)", spaceComplexity: "O(1)",
  },
  {
    id: "dsa-merge-sort", slug: "dsa-merge-sort",
    title: "Implement Merge Sort", difficulty: "Intermediate",
    category: "DSA · Sorting", tags: ["dsa", "sorting", "recursion", "divide-and-conquer"],
    reviewTags: ["sorting", "recursion", "dsa"], flags: { interview: true },
    problem: "Implement merge sort: return a NEW array of the numbers sorted ascending, without using .sort() and without mutating the input.",
    frontendScenario: "Merge sort is stable (equal items keep their order) — the property you rely on when users sort a table by one column, then another.",
    mentalModel: "Split the pile in half until every pile has one card (already sorted), then repeatedly merge two sorted piles by always taking the smaller top card.",
    example: { input: "mergeSort([5,2,4,6,1,3])", output: "[1,2,3,4,5,6]" },
    pseudocode: {
      understand: "Sort by splitting, sorting halves recursively, and merging.",
      input: "An array of numbers.",
      output: "A new sorted array.",
      steps: [
        "Base case: length ≤ 1 → return a copy.",
        "Split at the middle; mergeSort each half.",
        "Merge: compare the fronts of both halves, push the smaller, advance that side.",
        "Append whatever is left over.",
      ],
    },
    starterCode: `function mergeSort(arr) {\n  // split, sort halves, merge — no .sort()\n}`,
    solution: `function mergeSort(arr) {
  if (arr.length <= 1) return [...arr];
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    // <= keeps equal items in their original order (stable)
    if (left[i] <= right[j]) out.push(left[i++]);
    else out.push(right[j++]);
  }
  while (i < left.length) out.push(left[i++]);
  while (j < right.length) out.push(right[j++]);
  return out;
}`,
    explanation: "There are log n levels of splitting, and each level does O(n) merging work → O(n log n) always (no bad worst case, unlike quick sort). The cost is O(n) extra memory for the merged arrays.",
    tests: [
      { name: "classic", kind: "normal", call: "mergeSort([5,2,4,6,1,3])", expected: [1, 2, 3, 4, 5, 6] },
      { name: "numbers, not strings", kind: "normal", call: "mergeSort([10,1,2])", expected: [1, 2, 10] },
      { name: "duplicates & negatives", kind: "duplicate", call: "mergeSort([3,-1,3,0,-1])", expected: [-1, -1, 0, 3, 3] },
      { name: "empty", kind: "empty", call: "mergeSort([])", expected: [] },
    ],
    hiddenTests: [
      { name: "input not mutated", kind: "mutation", call: "(() => { const a = [3,1,2]; mergeSort(a); return a; })()", expected: [3, 1, 2] },
      { name: "2000 items", kind: "large", call: "(() => { const a = Array.from({ length: 2000 }, (_, i) => 2000 - i); return mergeSort(a).every((v, i) => v === i + 1); })()", expected: true },
    ],
    hints: ["Base case: arrays of length 0 or 1 are already sorted.", "Write a merge step for two SORTED arrays first.", "Use two indices, one per half."],
    commonMistakes: ["Calling .sort() with no comparator — sorts as strings: [10,1,2] → [1,10,2].", "Forgetting to copy the leftovers after the merge loop.", "Using < instead of <= (loses stability)."],
    timeComplexity: "O(n log n)", spaceComplexity: "O(n)",
  },
  {
    id: "dsa-quick-sort", slug: "dsa-quick-sort",
    title: "Implement Quick Sort", difficulty: "Intermediate",
    category: "DSA · Sorting", tags: ["dsa", "sorting", "recursion", "partition"],
    reviewTags: ["sorting", "recursion", "dsa"], flags: { interview: true },
    problem: "Implement quick sort: return a NEW array sorted ascending, without .sort() and without mutating the input. (Partition a copy in place.)",
    frontendScenario: "Quick sort's partition step is the core of 'quickselect' — finding the median or the top-k without fully sorting.",
    mentalModel: "Pick a pivot; move everything smaller to its left and everything else to its right. The pivot is now in its final spot — repeat on each side.",
    example: { input: "quickSort([3,6,8,10,1,2,1])", output: "[1,1,2,3,6,8,10]" },
    starterCode: `function quickSort(arr) {\n  // copy, partition around a pivot, recurse on both sides\n}`,
    solution: `function quickSort(arr) {
  const a = [...arr];
  const sort = (lo, hi) => {
    if (lo >= hi) return;
    const mid = (lo + hi) >> 1;
    [a[mid], a[hi]] = [a[hi], a[mid]]; // middle element as the pivot
    const pivot = a[hi];
    let i = lo; // a[lo..i) < pivot
    for (let j = lo; j < hi; j++) {
      if (a[j] < pivot) {
        [a[i], a[j]] = [a[j], a[i]];
        i++;
      }
    }
    [a[i], a[hi]] = [a[hi], a[i]]; // pivot to its final place
    sort(lo, i - 1);
    sort(i + 1, hi);
  };
  sort(0, a.length - 1);
  return a;
}`,
    explanation: "Lomuto partition: one index scans, another marks where the next 'smaller than pivot' item goes. Average O(n log n) with O(log n) stack. Choosing the middle element as pivot avoids the O(n²) worst case on already-sorted input that a 'last element' pivot hits.",
    tests: [
      { name: "classic", kind: "normal", call: "quickSort([3,6,8,10,1,2,1])", expected: [1, 1, 2, 3, 6, 8, 10] },
      { name: "numbers, not strings", kind: "normal", call: "quickSort([10,1,2])", expected: [1, 2, 10] },
      { name: "empty", kind: "empty", call: "quickSort([])", expected: [] },
    ],
    hiddenTests: [
      { name: "input not mutated", kind: "mutation", call: "(() => { const a = [2,1]; quickSort(a); return a; })()", expected: [2, 1] },
      { name: "already sorted, 2000 items", kind: "large", call: "(() => { const a = Array.from({ length: 2000 }, (_, i) => i); return quickSort(a).every((v, i) => v === i); })()", expected: true },
    ],
    hints: ["Copy the array first, then sort the copy in place.", "Partition: everything < pivot to the left, then put the pivot right after them.", "Recurse on the two sides of the pivot's final index."],
    commonMistakes: ["Always picking the first/last element as pivot → O(n²) on sorted input.", "Including the pivot in a recursive call → infinite recursion.", "Sorting the caller's array."],
    timeComplexity: "O(n log n) average, O(n²) worst", spaceComplexity: "O(log n) stack",
  },
  {
    id: "dsa-largest-number", slug: "dsa-largest-number",
    title: "Largest Number (Custom Comparator)", difficulty: "Advanced",
    category: "DSA · Sorting", tags: ["dsa", "sorting", "comparator", "string"],
    reviewTags: ["sorting", "dsa"], flags: { interview: true },
    problem: "Arrange the non-negative integers so that, concatenated, they form the largest possible number. Return it as a string.",
    frontendScenario: "The real lesson: writing a comparator that encodes a business rule (here: 'which order of these two gives a bigger result?') — the same skill as custom table sorting.",
    example: { input: "largestNumber([3,30,34,5,9])", output: `"9534330"` },
    starterCode: `function largestNumber(nums) {\n  // sort with a custom comparator, then join\n}`,
    solution: `function largestNumber(nums) {
  const parts = nums.map(String);
  // a goes before b if "a"+"b" is bigger than "b"+"a".
  parts.sort((a, b) => (b + a > a + b ? 1 : b + a < a + b ? -1 : 0));
  const joined = parts.join("");
  return joined[0] === "0" ? "0" : joined; // [0,0] → "0", not "00"
}`,
    explanation: "Comparing numbers by value fails (30 vs 3 → '303' < '330'). Comparing the two possible concatenations decides the order directly, and that rule is transitive, so it's a valid sort. Equal-length strings of digits compare correctly as strings. O(n log n) comparisons.",
    tests: [
      { name: "two numbers", kind: "normal", call: "largestNumber([10,2])", expected: "210" },
      { name: "classic", kind: "normal", call: "largestNumber([3,30,34,5,9])", expected: "9534330" },
      { name: "all zeros", kind: "invalid", call: "largestNumber([0,0])", expected: "0" },
    ],
    hiddenTests: [
      { name: "single", kind: "normal", call: "largestNumber([1])", expected: "1" },
      { name: "zero and one", kind: "normal", call: "largestNumber([0,1])", expected: "10" },
    ],
    hints: ["Sorting by numeric value or plain string order both fail on 3 vs 30.", "Compare a+b vs b+a as strings.", "Handle a result of all zeros."],
    commonMistakes: ["Returning '00' for [0,0].", "Plain string sort: puts '30' before '3' wrongly.", "Comparator that returns a boolean instead of a number."],
    timeComplexity: "O(n log n · d)", spaceComplexity: "O(n)",
  },
];
