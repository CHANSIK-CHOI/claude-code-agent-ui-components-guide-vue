# Tooltip — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-05-20
- **리뷰 결과**: PASS
- **루프 횟수**: 11차 (bgColor / textColor props 추가 리뷰)
- **반복 발견 패턴**: 없음 (이번 차수 신규 이슈 없음)

### 11차 수정 범위

- `bgColor` prop 추가: 말풍선 배경 커스텀 색상. `customStyle` computed에서 `backgroundColor` 바인딩
- `textColor` prop 추가: 말풍선 텍스트 커스텀 색상. `textColorStyle` computed에서 텍스트 span에 직접 바인딩 (scoped/global color 상속 우선 적용)
- `arrowFill` computed: `bgColor ?? (color === 'primary' ? '#00addb' : '#333333')` — bgColor 우선, color variant fallback

### 11차 BLOCKER/WARN: 0건

### 11차 INFO 2건

1. **`customStyle` `...{}` 스프레드 불필요**: `{ ...({} 분기) }` → 바로 삼항 객체 반환으로 단순화 가능. 오동작 없음.
2. **`textColorStyle` CSSProperties 타입 미명시**: `:style` 바인딩에 `CSSProperties` 제네릭 명시 권고. 선택 사항.

### 10차 WARN 해소 확인 (이번 차수)

- `display: inline-flex` → 코드 확인 결과 이미 `flex`로 수정됨
- `ref 초기값` 방식 → 코드 확인 결과 이미 `ref(props.alwaysOpen)` 적용됨

### 유지 중인 수용 사항

- `arrowFill` raw hex (`#333333`, `#00addb`) — inline SVG `:fill` 바인딩 구조상 불가피, spec hex와 일치
- `:deep()` + `:global()` 이중 선언 — Radix Vue 동적 DOM 생성 특성상 필수
- `alwaysOpen true→false` 전환 시 `emit('close')` 미발생 — spec 요건 없음
- `Math.random()` 기반 `tooltipId` — 10차 INFO 수용, SSR 환경 아니면 실용적 문제 없음
- TooltipContent 마크업 중복 (분기 A/B) — portal `:disabled` prop 구조 한계로 현행 유지

### rules 보강 제안

- `rules/style.md` `inline-flex` 예외 목록에 Tooltip wrapper(`tooltip__alwaysOpen`) 케이스 추가 검토 (10차에서 이어짐, flex로 수정되어 실질 이슈 해소)
