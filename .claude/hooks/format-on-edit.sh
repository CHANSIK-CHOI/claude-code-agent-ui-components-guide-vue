#!/usr/bin/env bash
# PostToolUse hook — Edit/Write 직후 해당 파일을 prettier --write 로 자동 포맷.
# .prettierignore 가 node_modules/.nuxt/.output/dist 등을 거르므로 별도 제외 로직 불필요.
# 대상 확장자(.vue/.ts/.tsx/.js/.mjs/.json/.scss/.css)만 처리하고, 그 외는 무시한다.
#
# Input  : stdin JSON ({ tool_name, tool_input: { file_path, ... }, ... })
# Output : exit 0 항상 (PostToolUse 는 차단 훅이 아니다)

raw=$(cat)
[ -z "$raw" ] && exit 0

# node 로 JSON 파싱 (jq 의존 없음 — 프로젝트에 node 필수 존재)
path=$(printf '%s' "$raw" | node -e '
let d = "";
process.stdin.on("data", (c) => (d += c)).on("end", () => {
  try {
    const j = JSON.parse(d);
    process.stdout.write(j.tool_input?.file_path ?? "");
  } catch (e) {}
});
' 2>/dev/null)

[ -z "$path" ] && exit 0

# 포맷 대상 확장자만 처리
case "$path" in
  *.vue|*.ts|*.tsx|*.js|*.mjs|*.json|*.scss|*.css) ;;
  *) exit 0 ;;
esac

# 파일이 실제로 존재할 때만 (삭제/이동된 경우 스킵)
[ -f "$path" ] || exit 0

# prettier --write. --ignore-unknown 으로 .prettierignore 대상이면 조용히 통과.
npx prettier --write --ignore-unknown "$path" >/dev/null 2>&1

# 포맷 실패가 작업을 막아선 안 된다 — 항상 통과
exit 0
