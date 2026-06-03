# PinDatePicker — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-05-14
- **리뷰 결과**: PASS (3차)
- **루프 횟수**: 3회 (1차 WARN 7건, 2차 WARN 2건 적용 후 재검토)
- **반복 발견 패턴**: 없음
- **rules 보강 제안**: 없음

## 3차 리뷰 집중 포인트 (PASS)

1. `defaultFormatter` 위치 — `defineOptions` 바로 아래, `withDefaults` 이전 선언. `<script setup>` 단일 setup 함수 본문 규칙상 완전히 유효. 문제 없음.
2. `formatter: () => defaultFormatter` 팩토리 패턴 — Vue `withDefaults`에서 함수 타입 prop의 기본값을 팩토리로 감싸는 것은 관용구. `() => []`, `() => new Date(...)` 등 기존 참조 타입 기본값과 동일한 패턴. 정합.

## 2차 리뷰 WARN 적용 확인 (2건 → 전부 적용)

| 2차 WARN | 적용 여부 |
|---|---|
| `handleChange` 타입 단언 → `.map(String)` | 적용 |
| `watch(open)` `async+nextTick` → `flush: 'post'` 단일 옵션 | 적용 |

## 1차 리뷰 WARN 적용 확인 (7건 → 전부 적용)

| 1차 WARN | 적용 여부 |
|---|---|
| W1: `drum3dObservers` const → let + `= []` 재할당 | 적용 |
| W2: setTimeout 50ms 저사양 주석 보완 | 적용 |
| W4: watch immediate → ref 직접 초기화 | 적용 |
| W5: handlePickerUpdate+handleChange 단일화 | 적용 |
| W6: swipeDuration 단언·fallback 제거 | 적용 |
| W7: resetPending() 헬퍼 추출 | 적용 |

## 주요 패턴 확인

- staged state(pendingValue) 패턴: 올바름
- inheritAttrs: false + $attrs 순서: 올바름 (BottomSheet에 위임, 명시 바인딩 뒤에 없음)
- MutationObserver/RAF teardown(onUnmounted): 올바름 (BLOCKER 없음)
- defineOptions/withDefaults/defineEmits 타입 시그니처: 올바름
- auto-import(ref, watch, onUnmounted): 명시적 import 없음, 정합
- props mutation: 없음
- watch 2개(modelValue, open): 각각 staged state 동기화, 부수효과 발동 — computed 불가한 정당한 watch 사용
