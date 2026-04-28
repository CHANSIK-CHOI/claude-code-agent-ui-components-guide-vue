# Input — QA 검수 메모

- **검수일**: 2026-04-28
- **검수 결과**: PASS (4회차)
- **루프 횟수**: 4회차 — PASS 확정
- **발견한 BLOCKER 요약**: 없음
- **WARN 요약**: 없음
- **INFO 요약**:
  - `useTemplateRef` 관련 콘솔 메시지가 dev session에서 여전히 관찰됨 (캐시 artifact). Input.vue에 `useTemplateRef` 사용 없음. Vue 3.5.33 업그레이드 후 dev server 재기동 시 해소 예상.

## 수정 이력 확인
- `Input.vue:78` — `rgba(17, 17, 17, 0.12)` → `rgba($border-input-focus, 0.12)` 정상 적용 확인
- `package.json` — `"vue": "^3.5.0"` 적용, 실제 설치 버전 3.5.33 확인
- `$border-input-focus` 토큰은 `_variables.scss` 91번째 줄에 `$_neutral-900`(#111111)으로 정의됨

## 재발 방지 메모
- `useTemplateRef`는 Vue 3.5에서 추가된 API. Nuxt 3.21+ 는 이를 auto-import 목록에 포함하므로 Vue 3.4.x 사용 시 런타임 에러 발생. `"vue": "^3.5.0"` 유지 필수.
- SCSS box-shadow에 rgba raw 값 사용 금지 — `rgba($token, opacity)` 형식으로 토큰 참조 (`rules/tokens.md` 준수)
- uid 자동 생성 패턴(`Math.random`, `_uid`) 사용 금지 — id는 `v-bind="$attrs"` 위임으로 처리, 사용처에서 직접 `id="..."` 전달
- 스펙 토큰명은 반드시 `_variables.scss` 실제 토큰명과 일치 확인 필요 (`$border-default` → `$line-200`, `$text-strong` → `$text-900`, `$text-secondary` → `$text-600`, `$text-disabled` → `$text-300` 오류 발생 이력)
- FormField의 helper 요소 id는 `helper-{inputId}` 패턴 자동 생성 — `aria-describedby` 연결 시 이 패턴 준수 필수
- `label[for]` ↔ `input[id]` 연결은 `v-bind="$attrs"`로 id를 `<input>`에 직접 전달함으로써 정상 작동 확인됨
