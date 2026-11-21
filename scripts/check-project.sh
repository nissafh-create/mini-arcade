#!/usr/bin/env bash
# Quick health check of the repository.
# Exit code 0 = everything is fine, 1 = something is wrong.
set -euo pipefail
 
fail() {
  echo "FAIL: $1" >&2
  exit 1
}
 
# 1. Required files must exist
for f in README.md .gitignore .env.example requirements.txt requirements-dev.txt app/app.py tests/test_app.py; do
  [ -f "$f" ] || fail "missing file: $f"
done
 
# 2. The secret file must never be tracked by Git
if git ls-files --error-unmatch .env >/dev/null 2>&1; then
  fail ".env is tracked by git (secret leak risk)"
fi
 
# 3. .env must be listed in .gitignore
grep -qx '\.env' .gitignore || fail ".env is not listed in .gitignore"
 
# 4. The tests must pass
python3 -m pytest -q || fail "tests failed"
 
echo "OK: all checks passed"
