#!/usr/bin/env bash
# Stop hook — .docs-dirty 플래그 존재 시 변경 파일 목록과 함께 /sync-docs 실행 안내 출력.
#
# Input  : stdin JSON (Stop hook context)
# Output : exit 0 항상

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FLAG_FILE="$SCRIPT_DIR/.docs-dirty"

[ -f "$FLAG_FILE" ] || exit 0

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "[docs-sync] .claude/ 파일이 변경되었습니다."
echo "[docs-sync] 변경된 파일:"

while IFS= read -r f; do
  [ -n "$f" ] && echo "  - $f"
done < "$FLAG_FILE"

echo ""
echo "[docs-sync] CLAUDE.md + ONBOARDING.md 를 최신 상태로 유지하려면"
echo "[docs-sync] 다음 메시지에서 '/sync-docs' 를 실행하세요."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

rm -f "$FLAG_FILE"
exit 0
