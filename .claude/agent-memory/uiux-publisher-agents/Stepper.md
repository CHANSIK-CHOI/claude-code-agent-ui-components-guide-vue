# Stepper — 구현 메모

- **파일 경로**: components/atoms/Stepper.vue
- **계층**: atoms
- **구현 완료일**: 2026-04-27
- **비표준 구현**:
  - Radix Vue 미사용 — NumberField가 Alpha 상태이므로 자체 구현
  - 복합 컴포넌트 attrs 분산 위임 패턴:
    - `$attrs` → `<input>` (id, name, aria-label, aria-describedby 등 폼·접근성 속성)
    - `decrementAttrs` prop → 감소 `<button>`
    - `incrementAttrs` prop → 증가 `<button>`
  - `type="text" inputmode="numeric"` 사용 — 브라우저 기본 스피너 회피
  - `inputBuffer` ref로 직접 입력 중 임시 표시값 관리 (blur 시 clamp 처리)
  - 버튼 attrs 위임 순서: `v-bind="props.decrementAttrs"` 먼저 → 명시 바인딩 나중 (내부 기본값 보호)
- **개발자 핸드오프**: 없음 (순수 UI 조작 컴포넌트)
