#!/usr/bin/env bash
# Verify the whole project: TypeScript type-check (the real build gate) +
# run every lesson/challenge test against its own solution.
#
# Usage:  bash scripts/verify.sh
#
# Why this exists: `next build` prints "✓ Compiled successfully" BEFORE the
# type-check stage, so that message alone is NOT proof of a green build.
# Gate on `tsc --noEmit` exit 0 AND all content tests passing.
set -e
cd "$(dirname "$0")/.."

echo "== tsc --noEmit (build gate) =="
npx tsc --noEmit
echo "tsc OK"

echo "== compiling data to /tmp/fllverify =="
rm -rf /tmp/fllverify
cat > tsconfig.verify.json <<'EOF'
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false, "module": "commonjs", "moduleResolution": "node",
    "baseUrl": ".", "outDir": "/tmp/fllverify", "jsx": "react",
    "declaration": false, "incremental": false, "composite": false
  },
  "include": ["data/**/*.ts", "lib/types.ts"]
}
EOF
npx tsc -p tsconfig.verify.json || true   # type errors already caught above; we only need emit
rm -f tsconfig.verify.json

echo "== running content tests =="
node scripts/verify-content.cjs
