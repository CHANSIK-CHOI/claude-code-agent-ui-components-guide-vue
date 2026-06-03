#!/usr/bin/env bash
# Stop hook — 이번에 변경된 파일의 타입 에러만 vue-tsc 로 검사한다.
#
# 동작 조건:
#   - 토글 플래그(.claude/hooks/.typecheck-on) 가 존재할 때만 검사. 없으면 즉시 통과(종료).
#   - git working tree 에서 변경된 **/*.{ts,tsx,vue} 파일만 대상.
#   - vue-tsc 는 프로젝트 전체를 컴파일하지만, 출력에서 "이번에 변경된 파일" 경로의
#     에러만 필터링한다. 작업과 무관한 기존 에러는 무시.
#   - 에러 발견 시 exit 2 + stderr 로 Claude 에 되먹여 수정 후 재종료를 유도.
#   - 무한 루프 방지: .typecheck-attempts 카운터로 최대 3회까지만 차단, 이후 통과.
#
# Input  : stdin JSON (Stop hook context — { stop_hook_active, cwd, ... })
# Output : exit 2 (타입 에러 발견, 종료 차단) / exit 0 (그 외)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FLAG_FILE="$SCRIPT_DIR/.typecheck-on"
ATTEMPT_FILE="$SCRIPT_DIR/.typecheck-attempts"
MAX_ATTEMPTS=3

# 1) 토글 OFF → 검사 없이 즉시 통과
if [ ! -f "$FLAG_FILE" ]; then
  rm -f "$ATTEMPT_FILE"
  exit 0
fi

# 2) stdin 읽어 stop_hook_active 판단 (무한 루프 가드용)
raw=$(cat)
active=$(printf '%s' "$raw" | node -e '
let d = "";
process.stdin.on("data", (c) => (d += c)).on("end", () => {
  try {
    process.stdout.write(JSON.parse(d).stop_hook_active ? "1" : "0");
  } catch (e) {
    process.stdout.write("0");
  }
});
' 2>/dev/null)

# 3) 프로젝트 루트로 이동 (.claude/hooks → .claude → root)
ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$ROOT" || exit 0

# 4) 변경된 타입 대상 파일 수집 (staged/unstaged/untracked 모두)
changed=$(git -c core.quotepath=false status --porcelain 2>/dev/null \
  | cut -c4- \
  | sed 's/.* -> //' \
  | sed 's/^"//; s/"$//' \
  | grep -E '\.(ts|tsx|vue)$' || true)

# 변경된 대상 파일이 없으면 검사할 것 없음 → 통과
if [ -z "$changed" ]; then
  rm -f "$ATTEMPT_FILE"
  exit 0
fi

# 5) vue-tsc 전체 타입체크 실행 (출력 캡처)
tsc_out=$(npx vue-tsc --noEmit 2>&1 || true)

# 6) 출력에서 "이번에 변경된 파일" 에러만 필터 (멀티라인 상세 포함)
collected=$(printf '%s\n' "$tsc_out" | CHANGED="$changed" node -e '
let d = "";
process.stdin.on("data", (c) => (d += c)).on("end", () => {
  const changed = new Set(
    (process.env.CHANGED || "")
      .split("\n")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  );
  const out = [];
  let keep = false;
  for (const line of d.split("\n")) {
    const m = line.match(/^(.+?)\((\d+),(\d+)\): error TS\d+/);
    if (m) {
      const p = m[1].trim().replace(/\\/g, "/").toLowerCase();
      keep = changed.has(p);
      if (keep) out.push(line);
    } else if (/^\s/.test(line)) {
      if (keep) out.push(line); // 직전 에러의 들여쓰기 상세 설명 줄
    } else {
      keep = false;
    }
  }
  process.stdout.write(out.join("\n"));
});
' 2>/dev/null)

# 7) 에러 없음 → 카운터 리셋 후 통과
if [ -z "$collected" ]; then
  rm -f "$ATTEMPT_FILE"
  exit 0
fi

# 8) 무한 루프 가드 — 현재까지 차단 횟수
n=0
if [ "$active" = "1" ] && [ -f "$ATTEMPT_FILE" ]; then
  n=$(grep -o '[0-9]*' "$ATTEMPT_FILE" | head -n1)
  n=${n:-0}
fi

if [ "$n" -ge "$MAX_ATTEMPTS" ]; then
  # 최대 시도 도달 — 더는 막지 않고 경고만 남기고 통과
  printf '[typecheck] %s회 시도 후에도 타입 에러가 남아 종료를 허용합니다. 수동 확인이 필요합니다:\n\n%s\n' "$MAX_ATTEMPTS" "$collected" >&2
  rm -f "$ATTEMPT_FILE"
  exit 0
fi

# 9) 차단 — 카운터 증가 후 exit 2 + stderr
printf '%s' "$((n + 1))" > "$ATTEMPT_FILE"
printf '[typecheck] 변경한 파일에 타입 에러가 있습니다. 종료 전에 수정하세요:\n\n%s\n\n(이 검사를 끄려면: .claude/hooks/.typecheck-on 파일 삭제 또는 "타입체크 꺼줘" 요청)\n' "$collected" >&2
exit 2
