// Best-effort source instrumentation for the live execution trace.
//
// We inject a `trace()` call at the top of every for / while / for-of / for-in
// loop body so the runner can record each iteration's loop variable — WITHOUT
// the learner having to add anything. It is deliberately conservative:
//
//   * It scans with full awareness of strings, template literals, and comments,
//     so it never mistakes a keyword/brace inside text for real code.
//   * Each injected call is wrapped in try/catch, so it can never throw into the
//     learner's code (grading is unaffected).
//   * On ANY error it returns the original source unchanged, and the runner
//     additionally validates the result by constructing a Function — if that
//     fails it falls back to the original too. So a bug here can at worst make
//     the trace empty; it can never break running or grading.

type Insertion = { index: number; text: string };

const isIdent = (ch: string) => /[A-Za-z0-9_$]/.test(ch);

/** From a `(` index, return the index of the matching `)` (or -1). */
function matchParen(code: string, open: number): number {
  let depth = 0;
  let i = open;
  const n = code.length;
  while (i < n) {
    const c = code[i];
    if (c === "/" && code[i + 1] === "/") {
      i += 2;
      while (i < n && code[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && code[i + 1] === "*") {
      i += 2;
      while (i < n && !(code[i] === "*" && code[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    if (c === '"' || c === "'") {
      i = skipString(code, i, c);
      continue;
    }
    if (c === "`") {
      i = skipTemplate(code, i);
      continue;
    }
    if (c === "(") depth++;
    else if (c === ")") {
      depth--;
      if (depth === 0) return i;
    }
    i++;
  }
  return -1;
}

/** From the opening quote index, return the index just past the closing quote. */
function skipString(code: string, i: number, quote: string): number {
  const n = code.length;
  let j = i + 1;
  while (j < n) {
    if (code[j] === "\\") {
      j += 2;
      continue;
    }
    if (code[j] === quote) return j + 1;
    j++;
  }
  return n;
}

/** From the opening backtick index, return the index just past the closing one. */
function skipTemplate(code: string, i: number): number {
  const n = code.length;
  let j = i + 1;
  while (j < n) {
    const c = code[j];
    if (c === "\\") {
      j += 2;
      continue;
    }
    if (c === "`") return j + 1;
    if (c === "$" && code[j + 1] === "{") {
      // Skip a balanced ${ ... } expression (which may nest strings/templates).
      let depth = 1;
      j += 2;
      while (j < n && depth > 0) {
        const cj = code[j];
        if (cj === "\\") {
          j += 2;
          continue;
        }
        if (cj === "`") {
          j = skipTemplate(code, j);
          continue;
        }
        if (cj === '"' || cj === "'") {
          j = skipString(code, j, cj);
          continue;
        }
        if (cj === "{") depth++;
        else if (cj === "}") depth--;
        j++;
      }
      continue;
    }
    j++;
  }
  return n;
}

/** Pull the loop's controlled variable name from a header like `(let i = 0; …)`. */
function parseLoopVar(header: string): string | null {
  let m = header.match(/(?:let|const|var)\s+([A-Za-z_$][\w$]*)\s+(?:of|in)\b/);
  if (m) return m[1];
  m = header.match(/(?:let|const|var)\s+([A-Za-z_$][\w$]*)/);
  if (m) return m[1];
  m = header.match(/\(\s*([A-Za-z_$][\w$]*)\s*=/); // `for (i = 0; …)`
  if (m) return m[1];
  return null;
}

function snippet(kind: string, varName: string | null): string {
  if (varName) {
    return `try{__tracePush(${JSON.stringify(kind + " " + varName)},{${varName}:${varName}});}catch(_e){}`;
  }
  return `try{__tracePush(${JSON.stringify(kind + " iteration")},{});}catch(_e){}`;
}

/**
 * Returns `code` with trace calls injected at loop-body starts, or the original
 * string unchanged if anything looks off.
 */
export function instrumentLoops(code: string): string {
  try {
    const ins: Insertion[] = [];
    const n = code.length;
    let i = 0;
    while (i < n) {
      const c = code[i];
      // Skip comments / strings / templates so we never scan inside text.
      if (c === "/" && code[i + 1] === "/") {
        i += 2;
        while (i < n && code[i] !== "\n") i++;
        continue;
      }
      if (c === "/" && code[i + 1] === "*") {
        i += 2;
        while (i < n && !(code[i] === "*" && code[i + 1] === "/")) i++;
        i += 2;
        continue;
      }
      if (c === '"' || c === "'") {
        i = skipString(code, i, c);
        continue;
      }
      if (c === "`") {
        i = skipTemplate(code, i);
        continue;
      }

      // Loop keyword at a word boundary?
      const kw =
        code.startsWith("for", i) ? "for" : code.startsWith("while", i) ? "while" : null;
      const prevOk = i === 0 || !isIdent(code[i - 1]);
      if (kw && prevOk && !isIdent(code[i + kw.length])) {
        let j = i + kw.length;
        while (j < n && /\s/.test(code[j])) j++;
        if (code[j] === "(") {
          const close = matchParen(code, j);
          if (close !== -1) {
            let k = close + 1;
            while (k < n && /\s/.test(code[k])) k++;
            if (code[k] === "{") {
              const header = code.slice(j, close + 1);
              const varName = kw === "while" ? null : parseLoopVar(header);
              ins.push({ index: k + 1, text: snippet(kw, varName) });
            }
            i = close + 1;
            continue;
          }
        }
      }
      i++;
    }

    if (ins.length === 0) return code;
    // Apply from the end so earlier indices stay valid.
    ins.sort((a, b) => b.index - a.index);
    let out = code;
    for (const { index, text } of ins) {
      out = out.slice(0, index) + text + out.slice(index);
    }
    return out;
  } catch {
    return code; // never let instrumentation break the run
  }
}
