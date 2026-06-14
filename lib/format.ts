// A tiny, dependency-free code formatter — VS Code-style auto-indent for the
// in-browser editor. It re-indents by bracket depth (2 spaces/level) and trims
// trailing whitespace, while staying aware of strings, comments, and template
// literals so it never touches their contents. It does NOT reflow or add
// operator spacing (that needs a real parser) — its job is clean indentation.

interface ScanState {
  depth: number;
  inBlock: boolean; // inside /* … */
  inTpl: boolean; // inside a multi-line `template`
}

// Scan one line, updating bracket depth + whether we end inside a comment/template.
function scanLine(text: string, s: ScanState): ScanState {
  let { depth, inBlock, inTpl } = s;
  let i = 0;
  const n = text.length;
  while (i < n) {
    const c = text[i];
    const c2 = text[i + 1];
    if (inBlock) {
      if (c === "*" && c2 === "/") {
        inBlock = false;
        i += 2;
        continue;
      }
      i++;
      continue;
    }
    if (inTpl) {
      if (c === "\\") {
        i += 2;
        continue;
      }
      if (c === "`") {
        inTpl = false;
        i++;
        continue;
      }
      i++; // template contents are opaque (incl. ${…})
      continue;
    }
    if (c === "/" && c2 === "/") break; // line comment — ignore the rest
    if (c === "/" && c2 === "*") {
      inBlock = true;
      i += 2;
      continue;
    }
    if (c === '"' || c === "'") {
      const q = c;
      i++;
      while (i < n) {
        if (text[i] === "\\") {
          i += 2;
          continue;
        }
        if (text[i] === q) {
          i++;
          break;
        }
        i++;
      }
      continue;
    }
    if (c === "`") {
      i++;
      let closed = false;
      while (i < n) {
        if (text[i] === "\\") {
          i += 2;
          continue;
        }
        if (text[i] === "`") {
          i++;
          closed = true;
          break;
        }
        i++;
      }
      if (!closed) inTpl = true;
      continue;
    }
    if (c === "{" || c === "(" || c === "[") depth++;
    else if (c === "}" || c === ")" || c === "]") depth--;
    i++;
  }
  return { depth, inBlock, inTpl };
}

const isCloser = (ch: string) => ch === "}" || ch === ")" || ch === "]";

export function formatCode(src: string): string {
  const lines = src.replace(/\t/g, "  ").split("\n");
  const out: string[] = [];
  let state: ScanState = { depth: 0, inBlock: false, inTpl: false };

  for (const raw of lines) {
    // Preserve the contents of multi-line comments / template literals verbatim.
    if (state.inBlock || state.inTpl) {
      out.push(raw.replace(/[ \t]+$/, ""));
      state = scanLine(raw, state);
      continue;
    }

    const trimmed = raw.trim();
    if (trimmed === "") {
      out.push("");
      continue;
    }

    // A line that starts by closing a block dedents itself one level.
    let lineDepth = state.depth;
    if (isCloser(trimmed[0])) lineDepth -= 1;
    if (lineDepth < 0) lineDepth = 0;

    out.push("  ".repeat(lineDepth) + trimmed);
    state = scanLine(trimmed, state);
    if (state.depth < 0) state.depth = 0;
  }

  // Collapse runs of blank lines to at most one.
  return out.join("\n").replace(/\n{3,}/g, "\n\n");
}
