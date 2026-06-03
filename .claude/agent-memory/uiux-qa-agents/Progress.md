# Progress — QA 검수 메모

- **검수일**: 2026-05-29
- **검수 결과**: PASS
- **루프 횟수**: 7차 재검수 (tooltipText prop 통합 Tooltip 기능 추가 검수)
- **발견한 BLOCKER 요약**: 없음
- **재발 방지 메모**:
  - tooltipText prop 방식: indicatorSlot 내 `.tooltip__alwaysOpen`(분기B) 정상 마운트. bubbleClass, anchorWidth/Height, indicatorSlotLeft 모두 spec 일치.
  - #indicator 슬롯 방식: tooltipAlwaysOpen 없음(올바른 v-else-if 분기), role="tooltip" bubble 정상 렌더링.
  - tooltipColor="primary"/side="bottom"/arrowAlign="left"/bgColor 커스텀 3가지 variant 모두 bubble 클래스·backgroundColor 실측 일치.
  - Tooltip이 슬라이더 변경 시 indicatorSlotLeft가 max(0%, {n}%)로 갱신되어 따라 이동 정상.
  - Context7이 Radix Vue Progress API를 반환 못할 경우 node_modules/radix-vue/dist/Progress/ProgressRoot.d.ts 직접 확인.
  - ProgressRoot 실제 props: modelValue(number|null), max(number), getValueLabel — 구현 :model-value="displayValue" 바인딩 정확.
  - ProgressIndicator: PrimitiveProps만 상속, 별도 prop 없음 — style 바인딩 transform 처리 올바른 패턴.
  - $bg-tertiary = rgb(245,245,245) 실측 일치. 인디케이터 gradient 정확.
  - 콘솔 에러: kakao SDK CSP — Progress 컴포넌트 무관한 전역 이슈.
