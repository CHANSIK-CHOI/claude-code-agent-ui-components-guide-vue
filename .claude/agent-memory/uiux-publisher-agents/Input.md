# Input — 구현 메모

- **파일 경로**: components/atoms/Input.vue
- **계층**: atoms
- **구현 완료일**: 2026-05-29
- **비표준 구현**: 없음
  - `?skipsvgo` 패턴으로 InputClearSvg import (SVGO stroke/fill 제거 방지 — Icon 메모리 동일 패턴)
  - 루트 `.input`에 `display: flex; align-items: center` — 가로 방향이므로 `flex-direction: column + gap` 금지 규칙과 무관
  - `input__field`는 `flex: 1` (기존 `width: 100%` 대체)
  - `v-if="showClear || $slots.suffix"` 조건으로 suffix div 렌더 여부 제어 — 빈 suffix 영역이 공간 차지하지 않음
- **개발자 핸드오프**: 없음 (퍼블리셔 담당 props만)

## 구조 요약

- `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` → `<input>` 요소에 배치
- `aria-invalid="true"` — error 상태에서만 적용
- `hideClear` prop (기본 false): true이면 clear 버튼 항상 미표시
- `suffix` named slot: clear 버튼 오른쪽에 Wrapper가 요소 삽입 (비밀번호 토글, 타이머 등)
- `showClear` computed: hideClear=false + disabled=false + readonly=false + modelValue.length>0 모두 충족 시 true
- clear 버튼 클릭: update:modelValue('') + clear emit 발행
- `input__clearBtn`: border/background none, 1.6rem×1.6rem, InputClearSvg 렌더
- 라벨/툴팁/도움말은 FormField (molecules) 담당 — Input 자체에는 없음
- id 자동 생성 없음 — 사용처에서 $attrs로 직접 전달
