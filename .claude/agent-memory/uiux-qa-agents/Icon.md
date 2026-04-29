# Icon — QA 검수 메모

- **검수일**: 2026-04-29
- **검수 결과**: PASS
- **루프 횟수**: 1회 (루프백 없음)
- **발견한 BLOCKER 요약**: 없음

## 검수 범위

`size` prop에 `number` 타입 추가 변경 검수
- `IconPresetSize` / `IconSize` 타입 분리
- `sizeStyle` computed — string/number 분기 처리
- `makeIcon()` / `CartIcon` Vue prop 타입 선언 방식

## 검증 결과 요약

### 코드 사실 체크

| 항목 | 결과 |
|------|------|
| `types.ts` — `IconPresetSize` / `IconSize` 분리 | PASS |
| `Icon.vue` `sizeStyle` computed — `typeof props.size === 'number'` 판별 | PASS — reactive unwrap된 props에서 꺼낸 값, typeof 정상 동작 |
| size가 string → color만 반영, style 없으면 `undefined` | PASS |
| size가 number → `{ width, height }` + color 병합 | PASS |
| `makeIcon()` props 선언 `[String, Number] as unknown as () => IconSize` | PASS |
| `CartIcon` size prop 동일 선언 | PASS |

### Playwright 검증

| 시나리오 | 결과 |
|----------|------|
| ② 커스텀 사이즈 섹션 렌더링 | PASS — 세 예시 정상 표시 |
| `:size="32"` → `width:32px; height:32px;` inline style + `class="icon"` (프리셋 class 없음) | PASS |
| `:size="50"` → `width:50px; height:50px;` | PASS |
| `:size="72"` + color → `width:72px; height:72px; color:#0CB5E2;` | PASS |
| 프리셋 `'md'` → `class="icon icon--md"`, inline style 없음 (빈 string), 24×24px 렌더 | PASS |
| `aria-hidden="true"` 장식 아이콘 기본 적용 | PASS |
| `label` prop 전달 시 `role="img"` + `aria-label` | PASS (접근성 트리에서 `img "홈으로 이동"` 확인) |
| 콘솔 에러 (앱 관련) | 없음 — HMR WebSocket(port 24678) 재연결 에러만 존재, 앱 동작 무관 |

## 재발 방지 메모

- **number size inline style 생성**: `sizeStyle` computed에서 `typeof props.size === 'number'`로 분기. `props.size`를 직접 참조하므로 Vue 3 reactive context에서 unwrap된 값 — 추가 `.value` 불필요
- **makeIcon() Options API prop 타입**: `[String, Number] as unknown as () => IconSize` 패턴 — Vue Options API에서 Union 타입을 표현하는 유일한 방법. `<script setup>` generic 방식과 혼용하지 않도록 주의
- **HMR 콘솔 에러 패턴**: `localhost:24678/_nuxt/` ERR_CONNECTION_REFUSED는 Nuxt DevTools HMR 전용 에러 — 앱 코드와 무관, BLOCKER 판정 제외
