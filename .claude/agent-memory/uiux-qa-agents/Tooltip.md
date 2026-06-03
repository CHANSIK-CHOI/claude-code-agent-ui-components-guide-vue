# Tooltip — QA 검수 메모

- **검수일**: 2026-05-20
- **검수 결과**: PASS
- **루프 횟수**: 24차 (textColor 직접 바인딩 수정 후 재검수)
- **발견한 BLOCKER 요약**: 없음
- **정상 동작 확인 항목**:
  - [분기 B alwaysOpen=true] textColor="#13AFAB" → tooltip__bubble-text에 `:style="textColorStyle"` 직접 바인딩 → getComputedStyle.color=rgb(19,175,171) 정상 적용 (실측 확인)
  - [분기 A alwaysOpen=false] textColor="#13AFAB" → hover 후 tooltip__text에 `:style="textColorStyle"` 직접 바인딩 → getComputedStyle.color=rgb(19,175,171) 정상 적용 (실측 확인)
  - bgColor/textColor 미지정 시 기본 동작 완전 보존 — primary=rgb(0,173,219)/dark=rgb(51,51,51), textColor=rgb(255,255,255) (흰색)
  - bgColor prop → bubble/content backgroundColor 인라인 style 정상 적용 (실측: rgb(228,245,245)=#E4F5F5)
  - bgColor → SVG 꼬리 arrowFill computed 동일 반영 정상
  - 분기 A hover/focus 열림, aria-describedby Radix 자동 처리 정상
  - alwaysOpen 분기 B 자체 absolute 구현 정상, aria-describedby 수동 연결 정상
  - TooltipPortal `:disabled="!portal"` + `:to="container"` → Radix Vue 1.9.17 실제 API 일치 (이전 검수에서 확인 완료)
  - 콘솔 에러: Kakao SDK CSP 차단 1건 (컴포넌트 무관 전역 에러)
- **재발 방지 메모**:
  - textColor 등 색상 커스텀은 반드시 텍스트 요소에 직접 `:style` 바인딩 필요 — 부모에 바인딩 시 SCSS `color: $text-white` specificity(class 선택자 > 상속)로 차단됨
  - alwaysOpen=true 분기에서 TooltipRoot 완전 제거로 broken aria-describedby 근본 해소됨 (22차 기수정)
