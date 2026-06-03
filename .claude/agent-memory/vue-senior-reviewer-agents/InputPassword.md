# InputPassword — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-05-29
- **리뷰 결과**: PASS
- **루프 횟수**: 1회
- **반복 발견 패턴**: v-bind="$attrs" 순서 — rules 문서 기준으로 반대 순서(attrs 먼저, 명시 바인딩 나중). 단, Wrapper가 type/disabled 제어권을 가져야 하는 구조상 현재 순서가 실제로는 더 안전하게 동작하는 역설적 상황
- **rules 보강 제안**: rules/components.md "v-bind=$attrs 순서 규칙"에 Wrapper 컴포넌트 예외 케이스(Base에 전달 시 내부 prop이 우선권을 가져야 할 경우) 설명 추가 권고

## 검토 포인트

- `isVisible ref + inputType computed` 조합: Vue 관용구에 완전히 부합 (PASS)
- Wrapper v-model relay (`@update:model-value="emit('update:modelValue', $event)"`) 패턴: 올바름
- `error: string` (Wrapper) → `!!error: boolean` (Base) 변환 패턴: 의도적·올바른 설계
- `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"`: 존재 확인
- props mutation 없음 / watch 남용 없음 확인
- `handleToggle` disabled early return: 네이티브 disabled와 이중 차단 (a11y 권고 패턴 준수)
