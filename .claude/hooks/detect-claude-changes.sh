#!/usr/bin/env bash
# PostToolUse hook — .claude/rules|agents|commands 파일 변경 시 .docs-dirty 플래그 기록.
# sync-docs가 수정하는 CLAUDE.md / ONBOARDING.md 자체는 감지 대상에서 제외해 재귀 트리거 방지.
#
# Input  : stdin JSON ({ tool_name, tool_input: { file_path, ... }, tool_response })
# Output : exit 0 항상 (PostToolUse는 차단 훅이 아님)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FLAG_FILE="$SCRIPT_DIR/.docs-dirty"

raw=$(cat)
[ -z "$raw" ] && exit 0

path=$(printf '%s' "$raw" | node -e '
let d = "";
process.stdin.on("data", (c) => (d += c)).on("end", () => {
  try {
    const j = JSON.parse(d);
    process.stdout.write((j.tool_input?.file_path ?? "").replace(/\\/g, "/"));
  } catch (e) {}
});
' 2>/dev/null)

[ -z "$path" ] && exit 0

# 감지 대상: .claude/rules/, .claude/agents/, .claude/commands/ 아래 .md 파일
case "$path" in
  *.claude/rules/*.md|*.claude/agents/*.md|*.claude/commands/*.md) ;;
  *) exit 0 ;;
esac

# 플래그 파일에 변경 파일 경로를 한 줄씩 기록 (중복 제거)
{ [ -f "$FLAG_FILE" ] && cat "$FLAG_FILE"; printf '%s\n' "$path"; } \
  | sort -u > "$FLAG_FILE.tmp" && mv "$FLAG_FILE.tmp" "$FLAG_FILE"

exit 0
