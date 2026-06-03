# InputAuth — 구현 메모

- **파일 경로**: components/atoms/InputAuth.vue
- **계층**: atoms
- **구현 완료일**: 2026-05-29
- **비표준 구현**:
  - `error` prop: spec은 `string | boolean`이나 Input.vue Base가 `boolean`만 지원. Wrapper에서 `!!error`로 Boolean 캐스팅 후 Input Base에 위임. Spec 이탈 항목으로 보고됨.
  - `setInterval` / `clearInterval`로 자체 타이머 구현 (Radix Vue 미사용, 순수 Vue Composition API)
  - `watch` immediate 없음 — 마운트 시 active 상태가 false이면 타이머 미시작 (autoStart로만 시작)
- **개발자 핸드오프**:
  - `active` prop: false→true 전환 시 타이머 리셋+재시작 (인증번호 재발송 후 외부에서 제어)
  - `@timer-start` / `@timer-end` emit: 타이머 시작/만료 시 수신해 UI 상태 제어
  - `modelValue` prop: v-model로 인증번호 입력값 연동
