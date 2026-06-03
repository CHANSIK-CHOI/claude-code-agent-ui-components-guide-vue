# FormField — QA 검수 메모

- **검수일**: 2026-05-28
- **검수 결과**: PASS
- **루프 횟수**: 재검수 (errorText/successText/helperText 동시 표시 동작 변경 이후)
- **발견한 BLOCKER 요약**: 없음
- **재발 방지 메모**:
  - errorText / successText / helperText 세 메시지는 각각 독립적인 `v-if`로 렌더링 — 동시 표시 시 DOM에 모두 존재하며 순서 errorText(위) → successText → helperText(아래) 정상 (Playwright DOM 직접 확인)
  - 도움말 래퍼(`div.formField__helperArea`)에 단일 `id="helper-{inputId}"` 부여 패턴 정상 — role은 래퍼가 아닌 자식 `<p>`에만 부여됨 (`helperAreaWithRole=0`)
  - `aria-describedby`는 단일 `id` 하나만 참조 (`helper-{inputId}`)
  - `showHelperIcon`은 errorText/successText 유무와 무관하게 helperText 있을 때만 아이콘 렌더링 — `aria-hidden="true"` 정상 적용
  - `inputId` 없는 경우 `id="helper-undefined"` 미생성 확인 / 라벨 `<span>` 태그로 출력 (19 label 태그 + 1 span 태그 실측)
  - `required` `*`에 `aria-hidden="true"` 전체 3곳 정상 적용
  - 콘솔 에러 1건은 Kakao SDK CSP 차단 — FormField 무관 (전역 공통 외부 스크립트)
  - Context7 불필요 — Radix Vue/vant 미사용, Vue 3 기본 기능만 사용
  - $text-label / $text-helper 토큰 미정의 → $text-500(#777777) 대체 사용. tokens.md 목록에 없으므로 올바른 대체
  - SCSS element modifier 패턴(.#{$b}__helper--error flat 선언): 동작 정상
