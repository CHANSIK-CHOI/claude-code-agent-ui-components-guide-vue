# Select — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-05-20
- **리뷰 결과**: PASS
- **루프 횟수**: 3차 (1차: trigger truncate / 2차: content--filter CSS 변수 교체 + item truncate / 3차: dual script block 패턴 검토)
- **반복 발견 패턴**: 없음 (이전 WARN이었던 useId() 버전 핀 불일치 → 모듈 카운터 교체로 해소)

## 3차 변경사항 (집중 검토)

`let _selectUid = 0`을 `<script setup>` 내부에서 `<script lang="ts">` 모듈 스코프 블록으로 이동.
`<script lang="ts">` + `<script setup lang="ts">` dual script block 패턴 도입.

### dual script block 패턴 — Vue 3.4 / Nuxt 3.10 유효

Vue 3 SFC 스펙 공식 지원 패턴. `@vue/compiler-sfc`가 두 블록을 하나의 ES 모듈로 합성:
- `<script>` 블록: ES 모듈 스코프 → 파일 import 시 단 한 번 실행, 이후 캐시
- `<script setup>` 블록: `setup()` 함수 내부 → 인스턴스 생성마다 실행

### SSR 안전성 — 문제 없음

모듈 스코프 카운터(`_selectUid`)는 인스턴스 간 공유되어 단조 증가한다.
각 인스턴스는 `ref()`로 자신의 `_internalId`를 캡처해 독립 유지.
`attrs.id` 우선 적용 구조로 FormField(molecules)가 `id` 전달 시 내부 ID 미사용.
요청별 사용자 데이터가 아니므로 SSR 요청 간 데이터 오염 해당 없음.

## 유지 확인 항목 (PASS 항목 — 변동 없음)

- `defineOptions({ inheritAttrs: false })` + `v-bind` 순서 준수
- rootAttrs/triggerAttrs 3단계 위임 전략 정합
- `proxyValue` computed get/set v-model 양방향 바인딩 정합
- `selectedLabel` computed로 파생
- `$z-modal + 1` 수치 직접 연산, 주석으로 사유 추적 가능
- `:deep()` — SelectPortal body 마운트 특성상 불가피, 정당한 사유

## rules 보강 제안

- `rules/components.md`에 "Vue 3.4 ID 생성 표준 패턴: dual script block + 모듈 카운터" 예시 추가 권고
  (useId() 버전 핀 불일치가 반복 발견된 컴포넌트 — Checkbox, TextArea, Select 3회. 패턴 확정되었으므로 rules 문서화 우선순위 높음)
