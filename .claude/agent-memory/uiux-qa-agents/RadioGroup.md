# RadioGroup — QA 검수 메모

- **검수일**: 2026-05-13
- **검수 결과**: FAIL (5차 — 4차 수정 후 재검수)
- **루프 횟수**: 5회
- **발견한 BLOCKER 요약**: 화살표 키 탐색 시 선택 상태 미변경 — 4차 수정(`:default-value` uncontrolled 모드 전환 + `EXCLUDED_KEYS`에 `defaultValue` 추가)에서도 동일 증상 재현. Playwright 실증.

## 4차 수정 내용 및 5차 검수 결과

4차 수정은 `:model-value` controlled 모드 → `:default-value` uncontrolled 모드로 전환을 시도했으나,
화살표 키 후 ArrowRight/ArrowDown 모두 포커스만 이동하고 선택 상태(`data-state`, `aria-checked`)는 변경되지 않았음.

### 5차 검수 검증 데이터

- 첫 번째 그룹("배송지 선택")에서 ArrowRight 입력 → 포커스 이동 없음, `data-state='checked'` 변화 없음
- vertical 그룹("결제 수단 선택")에서 ArrowDown → 포커스 "무통장입금"으로 이동했으나 `ariaChecked: "false"`, `dataState: "unchecked"` 상태 유지, 선택 상태 변경 없음
- 클릭 선택 정상 동작 (회귀 없음)
- disabled 아이템/그룹 차단 정상
- 초기값(`defaultValue`) 반영 정상
- error 상태 시각 정상 (빨간 테두리)
- orientation horizontal/vertical 레이아웃 정상
- Tab 키 그룹 간 이동 정상

## 근본 원인 (4차 검수에서 확정, 5차에서 재확인)

Radix Vue 1.x RadioGroupItem 소스의 화살표 키 처리 흐름:
1. `keydown` → `u.value = true`
2. RovingFocus → 다음 아이템 포커스 이동 + `onFocus` 콜백 `setTimeout(0)` 예약
3. `keyup` → `u.value = false` (setTimeout보다 먼저!)
4. `setTimeout` 콜백 실행 시 `u.value === false` → `.click()` 미실행 → `changeModelValue` 미호출

Playwright `browser_press_key`는 keydown → keyup을 즉시 연속 발화하므로 `u.value`가 항상 false.
**실제 브라우저에서도 빠른 키 입력 시 재현 가능한 구조적 버그.**

uncontrolled 모드(`defaultValue`)로 전환해도 동일 타이밍 버그로 `.click()`이 미실행되어 해결되지 않음.

## 해결 방향 (publisher 재검토 필요)

uncontrolled 모드 전환(4차)으로도 해결 안 됨이 확인됨. 다음 옵션 검토 필요:

**옵션 A — keydown 이벤트 직접 핸들링**:
RadioGroupRoot에 `@keydown.arrow-right`, `@keydown.arrow-left`, `@keydown.arrow-up`, `@keydown.arrow-down` 핸들러를 직접 추가하여 Radix의 타이밍 버그를 우회. 포커스 이동과 동시에 internalValue 갱신 + Radix 내부 `.click()` 직접 호출.

**옵션 B — 네이티브 `<input type="radio">` + roving tabindex 자체 구현**:
Radix RadioGroup을 완전히 대체. 복잡도 높음.

**옵션 C — Radix Vue 버전 업그레이드 검토**:
1.9.17 → 최신 버전에서 타이밍 버그 패치 여부 확인. Context7 재확인 필요.

## 검수별 이슈 이력

- **1차**: 화살표 키 checked 상태 미변경 BLOCKER (controlled 모드 기본 구현)
- **2차**: `internalValue ref + watch` 패턴에서도 동일 증상
- **3차**: `:model-value + @update:model-value` 명시 분리 후에도 동일 증상
- **4차**: Radix 소스 분석으로 근본 원인 확정 — `onFocus+setTimeout+u.value` 타이밍 문제
- **5차**: `:default-value` uncontrolled 모드 전환 후에도 동일 증상 재현. 타이밍 버그가 controlled/uncontrolled 무관하게 발생함을 실증.

## 재발 방지 메모

- Radix Vue 1.9.17 RadioGroup은 화살표 키 선택을 `onFocus → setTimeout → click()` 체인으로 처리하며, keyup이 setTimeout보다 먼저 실행되어 클릭이 차단되는 구조적 타이밍 버그 존재.
- controlled 모드, uncontrolled 모드 모두 영향받음.
- 해결하려면 Radix 버전 업그레이드 또는 keydown 이벤트 직접 핸들링 등 우회 전략이 필요.
- Context7 할당량 초과로 5회 연속 API 팩트체크 미수행. 다음 세션에서 Context7로 RadioGroupRoot API + 버전별 타이밍 버그 패치 이력 확인 권장.
