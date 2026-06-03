# Progress — 구현 메모

- **파일 경로**: components/atoms/Progress.vue
- **계층**: atoms
- **구현 완료일**: 2026-05-29
- **비표준 구현**:
  - 인디케이터 배경 `linear-gradient(90deg, #19C2EF 0%, #A2EFD0 100%)` — spec §6에 "토큰 없음 — SCSS 인라인 선언" 명시에 따라 raw hex 직접 사용
  - Radix Vue는 `--radix-progress-indicator-width` CSS 변수 미제공 — `transform: translateX(-{100-percentage}%)` 방식으로 너비 표현 (인디케이터는 width:100% 고정, transform으로 이동)
  - 마운트 애니메이션: `displayValue` ref를 0으로 초기화 → `onMounted` 내 setTimeout(300ms) 후 실제 `value`로 전환. CSS transition이 0→실제값 애니메이션 처리. `watch(() => props.value)` 로 외부 변경 동기화. Radix Vue 공식 예시 패턴과 동일
  - indeterminate 상태 없음 — value 타입 `number` 단일 (null 제거)
  - `progress__wrap` div가 루트(ProgressRoot 밖 래퍼). CSS `max()` SCSS 내장 함수 충돌 대응 → `indicatorLeft` computed에서 문자열 `"max(0%, ${pct}%)"` 반환 후 `:style` 바인딩
  - **[2026-05-29 Tooltip 통합 추가]**: `tooltipText` prop + Tooltip 외관 6개 prop 추가. `tooltipText` 있으면 `progress__indicatorSlot` 안에 `<Tooltip :always-open="true" />` 자동 마운트. `#trigger`에 `progress__tooltipAnchor`(크기 0 span) 주입. `v-if="tooltipText"` / `v-else-if="$slots.indicator"` 분기로 상호 배타적 렌더링. Tooltip import: `import Tooltip from './Tooltip.vue'` (상대 경로)
- **개발자 핸드오프**: 없음 (읽기 전용 표시 컴포넌트, API 연동 불필요)
