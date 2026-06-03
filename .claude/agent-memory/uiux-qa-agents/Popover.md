# Popover — QA 검수 메모

- **검수일**: 2026-05-14
- **검수 결과**: PASS (18차 — stopWrapperFix setTimeout 지연 수정 검수)
- **루프 횟수**: 18차
- **발견한 BLOCKER 요약**: 없음
- **재발 방지 메모**:
  - **[stopWrapperFix 지연 해제 수정 — 핵심]** `proxyOpen===false` 즉시 `stopWrapperFix()` 호출 시 Radix가 wrapper transform을 원본 x오프셋 포함값으로 복원 → 닫힘 애니메이션이 옆으로 이동하는 버그. `setTimeout(stopWrapperFix, 250)`으로 수정. 측정값: 닫힘 애니메이션 중(50ms) wrapper transform=`translateX(-50%) translateY(480px)` — x축 오프셋 없음 확인
  - **[MutationObserver 해제 후 안전]** 300ms 후 wrapper transform 유지 확인. 비활성(closed) 패널의 Radix 원본 transform(`translate(286px,...)`)은 `__inner opacity:0 + pointer-events:none`으로 차단되어 무관
  - **[__panel]** position:fixed(!important) + wrapper left:50%+translateX(-50%)+width:min(600px,100%) 중앙 정렬 정상
  - **[data-has-been-opened]** 열림 시 마킹, flash 방지 정상. 닫힘 애니메이션 `popoverSlideDownAndFade-[hash]` 정상 적용 확인
  - **[키보드 접근성]** Tab 포커스, Enter/Space 열기, Escape 닫기 모두 정상. Escape 후 트리거로 포커스 복귀 확인
  - **[닫기 버튼]** aria-label="닫기" 전체 4개 패널 모두 정상
  - **[v-model:open 외부 제어]** 열기/닫기 버튼으로 제어 + stateText 반영 정상
  - **[portal=true]** PopoverPortal :to="container" prop 정상
  - **[카카오 CSP 에러, 네이버 페이 WARNING, amplitude WARNING]** 프로젝트 공통 — Popover 무관
  - **[WARN]** spec §7 "600px" 표기와 실제 html:11px 기준 660px 렌더링 불일치 — 60rem 선언 자체는 올바름. spec 표기 보정 권고 수준 유지
