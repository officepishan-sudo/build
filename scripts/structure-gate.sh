#!/usr/bin/env bash
# structure-gate.sh - שער מבנה וקריאות לקוד (בעלים: code-structure)
#
# מדפיס שורת CHECK לכל בדיקה ושורת סיכום אחת בפורמט של new-app-kit:
#   GATE structure exit=<n>
# exit=0 כשאין הפרות חוסמות. אזהרות (warn) לא מפילות.
#
# שימוש:
#   structure-gate.sh [--root DIR] [--report] [--baseline FILE] [--write-baseline FILE]
#                     [--max-file N] [--max-function N] [--max-component N]
#                     [--max-test-file N] [--data-layer GLOB[,GLOB...]] [--no-madge] [--no-ruff]
#
#   --report            רק דוח (10 הקבצים והפונקציות הגדולים ביותר) - לא נכשל
#   --baseline FILE     "ratchet" לאפליקציה קיימת: הפרות שמופיעות בקובץ לא מפילות,
#                       הפרה חדשה כן. (שורה = "<check>\t<path>")
#   --write-baseline F  כותב את כל ההפרות הנוכחיות כקובץ baseline ויוצא 0
#   קובץ .structure-gate.conf בשורש (KEY=VALUE) קובע ברירות מחדל לפרויקט:
#     MAX_FILE, MAX_FUNCTION, MAX_COMPONENT, MAX_TEST_FILE, DATA_LAYER, SRC_DIRS, EXCLUDE
#
# ספי ברירת המחדל (ראו SKILL.md "תקציבים"): קובץ 300 שורות, פונקציה 50,
# רכיב React 150, קובץ בדיקה 500. הבדיקות הן היוריסטיות (awk, לא AST):
# מדויקות מספיק כדי לתפוס קובץ של 900 שורות, לא כדי לריב על 52 מול 50.
# מגבלות ידועות: מתודות של class לא נמדדות (רק function/const-arrow ברמה
# העליונה ו-def ב-Python); קובץ class ענק נתפס ע"י file-size. קבצי בדיקה
# נמדדים רק בגודל קובץ (500). על דיוק ברמת הפונקציה - ESLint/Ruff.
# WHY: קובץ של 1,000 שורות/DB בכל מקום = הסוכן הבא שובר בלי להבין; הספים הם default הנדסי (SIZE_MODE), השכבות הן כלל. WHAT_PROVES_IT: 0 הפרות (או baseline שרק יורד). OWNER: הבונה. SOURCE: code-structure SKILL, sources-of-truth.
set -u

ROOT="."
MODE="gate"
BASELINE=""
WRITE_BASELINE=""
MAX_FILE=300
MAX_FUNCTION=50
MAX_COMPONENT=150
MAX_TEST_FILE=500
# v2-experiment red-team round (new-app-kit, ביקורת חוץ - sonnet-new-blind, exploit מאומת): הגלוב המקורי תפס
# רק תיקייה בשם db/dal ("src/db"), לא קובץ שטוח יחיד ("src/db.ts") - אפליקציה קטנה ולגיטימית עם db.ts שטוח
# קיבלה false-positive על db-outside-data-layer. הוספת db.ts/dal.ts/db/index.ts כתבניות נוספות.
# סבב אימות סופי (Opus final-breaker §3.6, new-app-kit): db.ts/dal.ts שטוחים תוקנו רק ל-TS - אותו FP חוזר על .js
# (Node בלי TypeScript) ו-.py - הוספת המקבילות.
# סבב שני של שישה סוכנים (sonnet-naive): *.repository.ts (נקודה) לא תואם budget-repository.ts (מקף) - קונבנציית
# שם-קובץ-עם-מקף-לפני-repository נפוצה לא-פחות מהנקודה. נוספו וריאנטי מקף/underscore.
DATA_LAYER="*/repository.ts,*.repository.ts,*-repository.ts,*-repository.js,*-repository.mjs,*-repository.cjs,*_repository.py,*/repositories,lib/db,lib/dal,src/db,src/dal,src/server/db,db.ts,dal.ts,db.js,dal.js,db.mjs,dal.mjs,db.cjs,dal.cjs,db.py,dal.py,db/index.ts,dal/index.ts,db/index.js,dal/index.js,data,*/data,prisma,tests,scripts,lib/prisma.ts,src/lib/prisma.ts,*/api/health,*/api/health/*,*/health/route.ts"
SRC_DIRS=""
EXCLUDE="node_modules,.next,dist,build,coverage,.git,.venv,venv,__pycache__,migrations,alembic,versions,generated,*.d.ts,*.min.js,*.config.*,.claude,labs"
USE_MADGE=1
USE_RUFF=1

# --- טעינת conf בלי source (סבב 9; new-app-kit/scripts/lib-conf.sh - מועתק כאן כדי לא לתלות בנתיב הערכה) ---
load_kv_conf() {   # file key-regex [--export]: רק KEY=value; $(...)/`/;/&/| = כישלון; מפתח לא מוכר = כישלון
  local file="$1" re="$2" export_flag="${3:-}" n=0 line key val
  [ -f "$file" ] || return 0
  while IFS= read -r line || [ -n "$line" ]; do
    n=$((n+1)); line="${line%%#*}"; line="${line%"${line##*[![:space:]]}"}"; [ -z "${line// }" ] && continue
    [[ "$line" =~ ^([A-Za-z][A-Za-z0-9_]{0,63})=\"?([^\"\$\`\;\&\|\<\>[:cntrl:]]{0,512})\"?$ ]] || { echo "CONF $file:$n rejected (KEY=value only, no shell): ${line:0:60}" >&2; return 1; }
    key="${BASH_REMATCH[1]}"; val="${BASH_REMATCH[2]}"
    [[ "$key" =~ ^($re)$ ]] || { echo "CONF $file:$n unknown key: $key" >&2; return 1; }
    printf -v "$key" '%s' "$val"; [ "$export_flag" != --export ] || export "$key"
  done < "$file"
  return 0
}
load_kv_conf "$ROOT/.structure-gate.conf" 'MAX_[A-Z_]+|DATA_LAYER|SRC_DIRS|EXCLUDE|USE_MADGE|USE_RUFF|BASELINE|SIZE_MODE' || { echo "GATE structure exit=2 (.structure-gate.conf לא תקין - KEY=value בלבד)"; exit 2; }

while [ $# -gt 0 ]; do
  case "$1" in
    --root) ROOT="$2"; shift 2;
      load_kv_conf "$ROOT/.structure-gate.conf" 'MAX_[A-Z_]+|DATA_LAYER|SRC_DIRS|EXCLUDE|USE_MADGE|USE_RUFF|BASELINE|SIZE_MODE' || { echo "GATE structure exit=2 (.structure-gate.conf לא תקין)"; exit 2; } ;;
    --report) MODE="report"; shift ;;
    --baseline) BASELINE="$2"; shift 2 ;;
    --write-baseline) WRITE_BASELINE="$2"; shift 2 ;;
    --max-file) MAX_FILE="$2"; shift 2 ;;
    --max-function) MAX_FUNCTION="$2"; shift 2 ;;
    --max-component) MAX_COMPONENT="$2"; shift 2 ;;
    --max-test-file) MAX_TEST_FILE="$2"; shift 2 ;;
    --data-layer) DATA_LAYER="$2"; shift 2 ;;
    --no-madge) USE_MADGE=0; shift ;;
    --no-ruff) USE_RUFF=0; shift ;;
    -h|--help) sed -n 2,25p "$0"; exit 0 ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

cd "$ROOT" || { echo "GATE structure exit=2 (root not found)"; exit 2; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
VIOL="$TMP/violations.tsv"   # check<TAB>path<TAB>detail
WARN="$TMP/warnings.tsv"
: > "$VIOL"; : > "$WARN"

# ---------- איסוף קבצי מקור ----------
prune_args=()
IFS=',' read -r -a ex_arr <<< "$EXCLUDE"
for e in "${ex_arr[@]}"; do
  [ -z "$e" ] && continue
  prune_args+=( -o -name "$e" )
done
find_src() {
  # $1 = extra -name filters (passed as string of -o -name ... )
  # shellcheck disable=SC2086
  if [ -n "$SRC_DIRS" ]; then
    IFS=',' read -r -a dirs <<< "$SRC_DIRS"
    find "${dirs[@]}" \( -false "${prune_args[@]}" \) -prune -o -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' -o -name '*.mjs' -o -name '*.py' \) -print 2>/dev/null
  else
    find . \( -false "${prune_args[@]}" \) -prune -o -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' -o -name '*.mjs' -o -name '*.py' \) -print 2>/dev/null
  fi
}
find_src | sed 's#^\./##' | sort > "$TMP/files.txt"
TOTAL_FILES=$(wc -l < "$TMP/files.txt" | tr -d ' ')
if [ "$TOTAL_FILES" -eq 0 ]; then
  echo "CHECK files ok count=0 (no source files under $ROOT)"
  echo "GATE structure exit=0"; exit 0
fi

is_test_file() {
  case "$1" in
    tests/*|test/*|*/tests/*|*/__tests__/*|*.test.*|*.spec.*|*test_*.py|*_test.py|conftest.py) return 0 ;;
    *) return 1 ;;
  esac
}

# ---------- 1. גודל קובץ ----------
: > "$TMP/sizes.tsv"
while IFS= read -r f; do
  n=$(wc -l < "$f" | tr -d ' ')
  printf '%s\t%s\n' "$n" "$f" >> "$TMP/sizes.tsv"
  if is_test_file "$f"; then lim=$MAX_TEST_FILE; else lim=$MAX_FILE; fi
  # סבב 10: SIZE_MODE=soft → בין הסף ל-2× = אזהרה (default הנדסי, לא סטנדרט); מעל 2× = כישלון (hard). strict (ברירת מחדל) = כמו קודם
  if [ "$n" -gt "$lim" ]; then
    if [ "${SIZE_MODE:-strict}" = soft ] && [ "$n" -le $(( lim * 2 )) ]; then printf 'file-size\t%s\t%s lines > %s (soft: warning below %s)\n' "$f" "$n" "$lim" $(( lim * 2 )) >> "$WARN"
    else printf 'file-size\t%s\t%s lines > %s\n' "$f" "$n" "$lim" >> "$VIOL"; fi
  fi
done < "$TMP/files.txt"

# ---------- 2. אורך פונקציות ורכיבים (היוריסטיקה) ----------
# TS/JS: פונקציה = שורה שמתחילה (אחרי רווחים / export / async) ב-function NAME(
#        או const NAME = (…) => / async (…) => / function(, ברמת סוגריים 0-1.
#        אורך = עד שהמאזן של { } חוזר לרמה של ההתחלה.
# רכיב React = פונקציה בשם שמתחיל באות גדולה בקובץ tsx/jsx.
# Python: def/async def - אורך לפי הזחה.
awk_ts='
function flush(   len, lim, kind) {
  if (cur == "") return
  len = NR - start
  kind = (isComp ? "component" : "function")
  lim = (isComp ? maxComp : maxFn)
  printf "%s\t%s\t%s\t%d\t%d\n", kind, FILENAME, cur, len, lim
  cur = ""
}
BEGIN { depth = 0; cur = "" }
{
  line = $0
  # strip strings and comments crudely
  gsub(/\/\/.*$/, "", line)
  gsub(/"[^"]*"/, "\"\"", line); gsub(/\x27[^\x27]*\x27/, "\x27\x27", line); gsub(/`[^`]*`/, "``", line)
  if (cur == "" && depth <= 1) {
    if (match(line, /^[ \t]*(export[ \t]+)?(default[ \t]+)?(async[ \t]+)?function[ \t]*\*?[ \t]*[A-Za-z_$][A-Za-z0-9_$]*[ \t]*[<(]/)) {
      s = substr(line, RSTART, RLENGTH); sub(/.*function[ \t]*\*?[ \t]*/, "", s); sub(/[ \t]*[<(].*/, "", s)
      cur = s; start = NR; startDepth = depth
    } else if (match(line, /^[ \t]*(export[ \t]+)?(const|let|var)[ \t]+[A-Za-z_$][A-Za-z0-9_$]*[^=]*=[ \t]*(async[ \t]*)?(\([^)]*\)|[A-Za-z_$][A-Za-z0-9_$]*)[ \t]*(:[^=]*)?=>/) ||
              match(line, /^[ \t]*(export[ \t]+)?(const|let|var)[ \t]+[A-Za-z_$][A-Za-z0-9_$]*[^=]*=[ \t]*(React\.)?(memo|forwardRef)\(/) ||
              match(line, /^[ \t]*(export[ \t]+)?(const|let|var)[ \t]+[A-Za-z_$][A-Za-z0-9_$]*[^=]*=[ \t]*(async[ \t]+)?function/)) {
      s = line; sub(/^[ \t]*(export[ \t]+)?(const|let|var)[ \t]+/, "", s); sub(/[^A-Za-z0-9_$].*/, "", s)
      cur = s; start = NR; startDepth = depth
    }
    if (cur != "") { isComp = (isTsx && cur ~ /^[A-Z]/) ? 1 : 0 }
  }
  n = gsub(/\{/, "{", line); m = gsub(/\}/, "}", line)
  depth += n - m
  if (cur != "" && NR > start && depth <= startDepth) flush()
  else if (cur != "" && depth < 0) { depth = 0; flush() }
}
END { if (cur != "") flush() }
'
awk_py='
function flush(   len) {
  if (cur == "") return
  len = last - start + 1
  printf "function\t%s\t%s\t%d\t%d\n", FILENAME, cur, len, maxFn
  cur = ""
}
BEGIN { cur = "" }
{
  if (match($0, /^[ \t]*(async[ \t]+)?def[ \t]+[A-Za-z_][A-Za-z0-9_]*/)) {
    ind = match($0, /[^ \t]/) - 1
    if (cur != "" && ind <= curInd) flush()
    if (cur == "") {
      s = $0; sub(/^[ \t]*(async[ \t]+)?def[ \t]+/, "", s); sub(/[^A-Za-z0-9_].*/, "", s)
      cur = s; start = NR; curInd = ind; last = NR
    }
    next
  }
  if (cur != "") {
    if ($0 ~ /^[ \t]*$/ || $0 ~ /^[ \t]*#/) next
    ind = match($0, /[^ \t]/) - 1
    if (ind <= curInd) flush(); else last = NR
  }
}
END { if (cur != "") flush() }
'
: > "$TMP/fns.tsv"
while IFS= read -r f; do
  is_test_file "$f" && continue
  case "$f" in
    *.py) awk -v maxFn="$MAX_FUNCTION" "$awk_py" "$f" >> "$TMP/fns.tsv" ;;
    *.tsx|*.jsx) awk -v maxFn="$MAX_FUNCTION" -v maxComp="$MAX_COMPONENT" -v isTsx=1 "$awk_ts" "$f" >> "$TMP/fns.tsv" ;;
    *) awk -v maxFn="$MAX_FUNCTION" -v maxComp="$MAX_COMPONENT" -v isTsx=0 "$awk_ts" "$f" >> "$TMP/fns.tsv" ;;
  esac
done < "$TMP/files.txt"
if [ "${SIZE_MODE:-strict}" = soft ]; then
  awk -F'\t' '$4 > $5 && $4 <= 2*$5 { printf "%s-size\t%s\t%s: %d lines > %d (soft)\n", $1, $2, $3, $4, $5 }' "$TMP/fns.tsv" >> "$WARN"
  awk -F'\t' '$4 > 2*$5 { printf "%s-size\t%s\t%s: %d lines > %d (hard: 2x)\n", $1, $2, $3, $4, $5 }' "$TMP/fns.tsv" >> "$VIOL"
else
  awk -F'\t' '$4 > $5 { printf "%s-size\t%s\t%s: %d lines > %d\n", $1, $2, $3, $4, $5 }' "$TMP/fns.tsv" >> "$VIOL"
fi

# ---------- 3. שכבות: גישה ל-DB מחוץ לשכבת הנתונים ----------
in_data_layer() {
  local f="$1" g
  IFS=',' read -r -a globs <<< "$DATA_LAYER"
  for g in "${globs[@]}"; do
    [ -z "$g" ] && continue
    case "$f" in
      $g|$g/*|*/$g|*/$g/*) return 0 ;;
    esac
  done
  return 1
}
while IFS= read -r f; do
  case "$f" in *.py) continue ;; esac
  is_test_file "$f" && continue
  # סבב שני של שישה סוכנים (sonnet-naive): ייבוא סוג/enum בלבד מ-@prisma/client (למשל `import { Role } from
  # '@prisma/client'` לשימוש בוולידציה, בלי PrismaClient/שאילתה) סימן "גישת DB" - Prisma, בניגוד ל-pg/knex/drizzle,
  # מייצא גם types/enums מאותה חבילה שממנה מייבאים את הלקוח עצמו. עבור @prisma/client בלבד: ייבוא לא מספיק -
  # צריך גם PrismaClient או קריאת שאילתה בפועל. שאר החבילות (pg/knex/drizzle/...) לא סובלות מהאידיום הזה - נשארות כפי שהיו.
  db_hit=0
  grep -qE "from ['\"](@/lib/prisma|\.{1,2}/(lib/)?prisma|drizzle-orm|knex|pg|mysql2|better-sqlite3)['\"]" "$f" && db_hit=1
  { [ "$db_hit" = 0 ] && grep -qE "from ['\"]@prisma/client['\"]" "$f" && grep -qE '\bPrismaClient\b' "$f"; } && db_hit=1
  grep -qE 'prisma\.[a-zA-Z_]+\.(find|create|update|delete|upsert|count|aggregate|groupBy)' "$f" && db_hit=1
  if [ "$db_hit" = 1 ]; then
    if ! in_data_layer "$f"; then
      printf 'db-outside-data-layer\t%s\t%s\n' "$f" "DB/ORM access outside the data layer - move the query to a repository (DATA_LAYER globs: see --help)" >> "$VIOL"
    fi
  fi
done < "$TMP/files.txt"
# Python: ORM session בתוך routers
while IFS= read -r f; do
  case "$f" in *.py) ;; *) continue ;; esac
  is_test_file "$f" && continue
  case "$f" in *router*|*routes*|*views*|*endpoints*|*api/*)
    if grep -qE "^\s*(db|session)\.(query|execute|add|commit)\(|select\(.*\)\.where\(" "$f"; then
      printf 'db-outside-data-layer\t%s\t%s\n' "$f" "ORM calls inside a router/view - move to repository/service" >> "$VIOL"
    fi ;;
  esac
done < "$TMP/files.txt"

# ---------- 4. עמודי Next.js שהם client components ----------
while IFS= read -r f; do
  case "$f" in
    */page.tsx|page.tsx|*/layout.tsx|layout.tsx)
      if head -5 "$f" | grep -qE "^['\"]use client['\"]"; then
        printf 'client-page\t%s\t%s\n' "$f" "page/layout is a client component - keep it a thin server component, move interactivity to a child" >> "$WARN"
      fi ;;
  esac
done < "$TMP/files.txt"

# ---------- 5. קוד שרת בתוך client component ----------
while IFS= read -r f; do
  case "$f" in *.tsx|*.ts|*.jsx|*.js) ;; *) continue ;; esac
  if head -5 "$f" | grep -qE "^['\"]use client['\"]"; then
    if grep -qE "from ['\"](fs|node:fs|child_process|node:child_process|nodemailer|@prisma/client|server-only)['\"]" "$f"; then
      printf 'server-import-in-client\t%s\t%s\n' "$f" "'use client' file imports server-only module" >> "$VIOL"
    fi
  fi
done < "$TMP/files.txt"

# ---------- 6. barrel files ----------
grep -E '(^|/)index\.(ts|js)$' "$TMP/files.txt" | while IFS= read -r f; do
  if [ "$(grep -cvE '^\s*(export\s.*from|//|/\*|\*|$)' "$f")" -eq 0 ]; then
    printf 'barrel-file\t%s\t%s\n' "$f" "re-export only index - avoid barrels (bundle size, cycles); import from the module file" >> "$WARN"
  fi
done

# ---------- 7. פונקציות עזר כפולות (אותו שם ב-2+ קבצים) ----------
awk -F'\t' '$1=="function" && $3 !~ /^(main|default|handler|GET|POST|PUT|PATCH|DELETE|run|setup|teardown|render|test|it|describe|Page|Layout|middleware|config|__init__|__str__|__repr__)$/ && length($3) > 3 { print $3 "\t" $2 }' "$TMP/fns.tsv" \
 | grep -vE '\t(tests?|__tests__)/' | sort -u | awk -F'\t' '{ c[$1]++; p[$1] = p[$1] ", " $2 } END { for (k in c) if (c[k] >= 2) printf "duplicate-helper\t%s\t%s defined in %d files:%s\n", k, k, c[k], substr(p[k], 2) }' >> "$WARN"

# ---------- 8. מעגלי ייבוא (madge אם מותקן) ----------
if [ "$USE_MADGE" -eq 1 ] && [ "$MODE" = "gate" ] && ls ./*.ts ./*.tsx ./src ./app ./lib >/dev/null 2>&1; then
  if [ -x node_modules/.bin/madge ] || command -v madge >/dev/null 2>&1; then
    MADGE=$( [ -x node_modules/.bin/madge ] && echo node_modules/.bin/madge || echo madge )
    targets=""; for d in src app lib components; do [ -d "$d" ] && targets="$targets $d"; done
    if [ -n "$targets" ]; then
      # shellcheck disable=SC2086
      out=$($MADGE --circular --extensions ts,tsx,js,jsx $targets 2>/dev/null)
      if echo "$out" | grep -qE '^[0-9]+\) '; then
        echo "$out" | grep -E '^[0-9]+\) ' | while IFS= read -r l; do printf 'circular-import\t%s\t%s\n' "${l#*) }" "cycle" >> "$VIOL"; done
      fi
    fi
  else
    echo "CHECK circular-import skipped (madge not installed: npm i -D madge)"
  fi
fi

# ---------- 9. Python: ruff complexity ----------
if [ "$USE_RUFF" -eq 1 ] && [ "$MODE" = "gate" ] && grep -q '\.py$' "$TMP/files.txt"; then
  if command -v ruff >/dev/null 2>&1; then
    ruff check --quiet --select C901,PLR0912,PLR0913,PLR0915 --output-format concise . 2>/dev/null \
      | grep -E '^[^:]+:[0-9]+:[0-9]+: ' | while IFS= read -r l; do
        p="${l%%:*}"; printf 'py-complexity\t%s\t%s\n' "$p" "${l#*: }" >> "$VIOL"
      done
  else
    echo "CHECK py-complexity skipped (ruff not installed: pip install ruff)"
  fi
fi

# ---------- דוח ----------
echo "== structure report: $TOTAL_FILES source files (root=$ROOT) =="
echo "-- 10 largest files (limit $MAX_FILE, tests $MAX_TEST_FILE):"
sort -rn "$TMP/sizes.tsv" | head -10 | awk -F'\t' '{ printf "   %5d  %s\n", $1, $2 }'
echo "-- 10 longest functions/components (limit $MAX_FUNCTION / $MAX_COMPONENT):"
sort -t$'\t' -k4,4rn "$TMP/fns.tsv" | head -10 | awk -F'\t' '{ printf "   %5d  %-9s %s  (%s)\n", $4, $1, $3, $2 }'

# ---------- baseline (ratchet) ----------
if [ -n "$WRITE_BASELINE" ]; then
  # סבב 8.1: כתיבת baseline = אישור אדם מהטרמינל (agent-safety 2.2); הקובץ שומר גם את המדד (שורות) - הפרה שגדלה = חדשה
  lib=""; for c in "$(dirname "$0")/../../new-app-kit/scripts/lib-approve.sh" "$HOME/.claude/skills/new-app-kit/scripts/lib-approve.sh"; do [ -f "$c" ] && { lib="$c"; break; }; done
  [ -n "$lib" ] || { echo "GATE structure exit=2 (--write-baseline דורש new-app-kit/scripts/lib-approve.sh - אישור אדם)"; exit 2; }
  . "$lib"; confirm_tty "APPROVE-BASELINE" "כתיבת baseline של $(wc -l < "$VIOL" | tr -d ' ') הפרות ל-$WRITE_BASELINE (הן יסבלו מעכשיו; רק ירידה מותרת)" || { echo "GATE structure exit=2 (baseline לא אושר)"; exit 2; }
  awk -F'\t' '{ m=""; if (match($3, /[0-9]+/)) m=substr($3, RSTART, RLENGTH); print $1 "\t" $2 "\t" m }' "$VIOL" | sort -u > "$WRITE_BASELINE"
  echo "baseline written: $WRITE_BASELINE ($(wc -l < "$WRITE_BASELINE" | tr -d ' ') entries) by $(human_name)"
  echo "GATE structure exit=1 (baseline written - run the gate again to verify)"; exit 1
fi
if [ -n "$BASELINE" ] && [ -f "$BASELINE" ]; then
  awk -F'\t' 'NR==FNR { b[$1 "\t" $2] = ($3 == "" ? "any" : $3); next }
    { k = $1 "\t" $2; m=""; if (match($3, /[0-9]+/)) m=substr($3, RSTART, RLENGTH);
      if (k in b && (b[k] == "any" || m == "" || m+0 <= b[k]+0)) print $0 "\t(baseline)" > "/dev/stderr";
      else if (k in b) print $0 " (grew beyond baseline " b[k] ")"; else print $0 }' "$BASELINE" "$VIOL" > "$TMP/new.tsv" 2> "$TMP/known.tsv"
  KNOWN=$(wc -l < "$TMP/known.tsv" | tr -d ' ')
  mv "$TMP/new.tsv" "$VIOL"
  echo "-- baseline: $KNOWN known violations tolerated (ratchet: a known violation that grew, or a new one, fails)"
fi

# ---------- סיכום ----------
rc=0
for chk in file-size function-size component-size db-outside-data-layer server-import-in-client circular-import py-complexity; do
  n=$(awk -F'\t' -v c="$chk" '$1==c' "$VIOL" | wc -l | tr -d ' ')
  if [ "$n" -gt 0 ]; then
    echo "CHECK $chk FAIL count=$n"
    awk -F'\t' -v c="$chk" '$1==c { printf "   %s  -  %s\n", $2, $3 }' "$VIOL" | head -40
    rc=1
  else
    echo "CHECK $chk ok count=0"
  fi
done
for chk in client-page barrel-file duplicate-helper; do
  n=$(awk -F'\t' -v c="$chk" '$1==c' "$WARN" | wc -l | tr -d ' ')
  if [ "$n" -gt 0 ]; then
    echo "CHECK $chk warn count=$n"
    awk -F'\t' -v c="$chk" '$1==c { printf "   %s  -  %s\n", $2, $3 }' "$WARN" | head -20
  else
    echo "CHECK $chk ok count=0"
  fi
done

if [ "$MODE" = "report" ]; then echo "REPORT structure exit=$rc (advisory, not a gate - release-gate ignores it)"; exit 0; fi
echo "GATE structure exit=$rc"
exit $rc
