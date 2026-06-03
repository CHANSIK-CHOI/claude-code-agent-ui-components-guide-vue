# Input — QA 검수 메모

- **검수일**: 2026-05-29
- **검수 결과**: PASS
- **루프 횟수**: 1회 (hideClear/suffix/clear 이벤트 신규 추가 검수)
- **발견한 BLOCKER 요약**: 없음
- **WARN 요약**:
  - 가이드 페이지 `Icon` import 경로 `@nd/components/icons/Icon.vue` 직접 import — barrel 우회 패턴 (가이드 페이지 기능 영향 없음)
- **INFO 요약**: 없음

## 이번 검수 항목 (2026-05-29 신규)
- `hideClear` prop: true 시 값 있어도 clear 버튼 미표시 — DOM에서 `.input__suffix` 자체 제거 확인
- `suffix` named slot: border 안쪽 우측 표시, clear 버튼 왼쪽에 나란히 렌더 — 정상
- `clear` 이벤트: 클릭 시 `update:modelValue('')` → `clear` 순서 발행, 이벤트 로그 표시 — 정상
- clear 버튼 표시 조건 4가지 조합 (`hideClear=false` AND `disabled=false` AND `readonly=false` AND 값≥1자) — 모두 정상
- `aria-invalid="true"` DOM 속성 실측 확인 (Playwright 접근성 트리에는 미노출, DOM 직접 확인)
- `v-bind="$attrs"` → `<input>` 맨 앞 배치 확인 — 명시 바인딩 우선순위 정상
- CSP 에러(Kakao SDK): 전역 인프라 이슈, Input 컴포넌트 무관

## 재발 방지 메모 (이전 이력 포함)
- `hideClear`/`disabled`/`readonly` 조합 시 `v-if="showClear || $slots.suffix"`로 suffix div 자체 DOM 제거 패턴 — DOM 검증 필수
- `v-bind="$attrs"` 위치: `<input>` 태그 명시 바인딩보다 항상 먼저 (순서 역전 시 외부 속성에 내부값 덮어씌워짐)
- `aria-invalid="true"` Playwright 접근성 트리에서 별도 attr 미노출 — `browser_evaluate`로 DOM 직접 확인 필요
- SCSS 토큰명 주의: `$border-default` → `$line-200`, `$text-strong` → `$text-900`, `$text-secondary` → `$text-600`, `$text-disabled` → `$text-300`
- FormField helper id 패턴: `helper-{inputId}` — `aria-describedby` 연결 시 준수 필수
