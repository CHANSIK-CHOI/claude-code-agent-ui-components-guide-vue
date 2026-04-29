# Select — QA 검수 메모

- **검수일**: 2026-04-29
- **검수 결과**: PASS
- **루프 횟수**: 3회차 (2회 루프백 후 최종 PASS)
- **발견한 BLOCKER 요약**: 없음 (전 루프의 모든 BLOCKER 해결 확인)

## 루프 이력 요약

| 루프 | 이슈 | 결과 |
|------|------|------|
| 1회차 | BLOCKER 1: error 상태 border-color 미적용 / BLOCKER 2: Math.random() SSR Hydration Mismatch | FAIL |
| 2회차 | BLOCKER 1 해결 / BLOCKER 2: 카운터 방식(++_selectUidCounter)으로 교체 시도했으나 mismatch 여전히 발생 | FAIL |
| 3회차 | Nuxt `useId()` 적용 후 Hydration 경고 완전 해소 | PASS |

## 최종 검증 결과 (3회차)

### 콘솔 에러
- Vue 앱 관련 에러/경고 없음
- `[Vue warn]: Hydration attribute mismatch` 없음
- 전체 콘솔 에러는 HMR WebSocket(port 24678) 재연결 시도 — 앱 동작과 무관

### Hydration Mismatch 해결 방법
- `Math.random()` → 카운터(`++_selectUidCounter`) → **Nuxt `useId()`** 순서로 변경
- Nuxt 3.9+ 내장 `useId()`는 Vue 3.5의 `useId()`와 다른 Nuxt 전용 composable
- `data-n-ids` 속성으로 SSR-safe한 연속 ID 생성 확인: `"0FwZPdIu5p:0"` ~ `"0FwZPdIu5p:14"`
- 프로젝트 Nuxt 버전(3.10.3)에서 정상 동작 확인

### 동작 검증
- Trigger 클릭 → 드롭다운 오픈: 정상
- ArrowDown + Enter 키보드 선택: 정상 (하의 선택 후 드롭다운 닫힘)
- Esc 키 닫힘: 정상
- error 상태 border-color: `rgb(255, 81, 70)` — $color-danger 토큰 적용 확인
- error 상태 aria-invalid: `"true"` — 정상
- disabled Trigger 클릭 차단: 정상 (Playwright 클릭 시도 timeout — enabled 아님)
- disabled 속성 전달: `disabled` 네이티브 속성 + `data-disabled=""` Radix Vue 속성 모두 확인

## 재발 방지 메모
- **Nuxt SSR + 내부 uid 생성**: `Math.random()`, 모듈 레벨 카운터 모두 SSR/CSR 불일치 유발. 반드시 Nuxt `useId()`(Nuxt 3.9+)를 사용할 것
- **Vue 3.5 `useId()` vs Nuxt `useId()`**: 프로젝트는 Vue 3.4.19 사용 금지 대상이지만, Nuxt 3.10의 `useId()`는 별개 composable로 사용 가능
- **border-color 에러 상태**: modifier(`--error`) 선언 시 반드시 `border-color` 포함 (1회차 BLOCKER 재발 방지)
