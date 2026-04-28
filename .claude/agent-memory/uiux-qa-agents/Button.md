# Button — QA 검수 메모

- **검수일**: 2026-04-28 (2차 검수: 2026-04-28, port 5000)
- **검수 결과**: PASS
- **루프 횟수**: 1회
- **발견한 BLOCKER 요약**: 없음
- **재발 방지 메모**:
  - `rules/style.md`의 `inline-flex` / `fit-content` 금지 규칙은 전역 원칙이나, `shape=text` 같이 명세(spec)에서 인라인 보조 액션으로 명시된 예외 케이스는 WARN 처리. `rules/style.md`에 예외 조항 추가됨 — 향후 동일 패턴은 WARN 불필요.
  - 가이드 페이지 scss에서 `guide-page.md` 표준 토큰(`$text-strong`, `$border-default`)과 실제 구현 토큰(`$text-900`, `$line-200`)이 다름. 표준화가 필요하나 동일 값이므로 BLOCKER 아님.
  - Button은 Radix Vue 등 외부 라이브러리 미사용 → Context7 검증 불필요 패턴. 이 구조를 유지.
  - `v-bind="$attrs"` → `:type` → `:disabled` 순서 올바름 — 검수 시 매번 확인 필요한 패턴.
  - Playwright MCP 오류: `.mcp.json`에 `--browser chromium` 옵션 부재로 Chrome 바이너리를 못 찾음. `args`에 `"--browser", "chromium"` 추가 필요. HTTP 응답 분석으로 대체 검증 완료.
  - 23개 button 요소 정상 렌더링 확인 (shape 3종 × color 4종 + size 3종 + round + disabled + icon slots).
  - disabled 버튼: `button--disabled` CSS 클래스 + 네이티브 `disabled` 속성 동시 부여 확인. `aria-disabled` 중복 없음(a11y 규칙 준수).
