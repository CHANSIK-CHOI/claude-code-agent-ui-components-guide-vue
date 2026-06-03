# PinPicker — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-05-14
- **리뷰 결과**: PASS
- **루프 횟수**: 1회
- **반복 발견 패턴**: 없음 (PinDatePicker 3차 PASS 패턴 그대로 이식)
- **rules 보강 제안**: 없음

## 주요 패턴 확인

- staged state(pendingValue) 패턴: 올바름
- inheritAttrs: false + v-bind="$attrs" 위치: BottomSheet에 위임, 명시 바인딩 앞 배치. 정합
- MutationObserver/RAF teardown(onUnmounted): 정합 (BLOCKER 없음)
- defineOptions/withDefaults/defineEmits 타입 시그니처: 정합
- auto-import(ref, watch, onUnmounted): 명시적 import 없음. 정합
- props mutation: 없음
- watch 2개(modelValue, open): 각각 staged state 동기화, 부수효과 발동 — computed 불가한 정당한 watch 사용
- 3D 드럼롤(setup3D/teardown3D): PinDatePicker와 완전 동일 패턴. flush:'post' + setTimeout 50ms + onUnmounted 정리 모두 정합

## PinDatePicker 대비 변경점

- van-date-picker → van-picker (vant Picker 컴포넌트로 교체)
- columns 관련 props: columnsType/minDate/maxDate/formatter/filter → columns/columnsFieldNames (각 컴포넌트 API에 맞게 교체)
- defaultFormatter 상수 제거 (van-picker는 formatter prop 없음)

## WARN/INFO 발견 항목

- WARN(실질 INFO): handleCancel emit/reset 순서 — 스냅샷 방어로 동작 문제 없음. PinDatePicker와 동일 패턴으로 통과.
- INFO: columns prop에 JSDoc 주석 권고 (단일/다중 컬럼 구분)
- INFO: columnsFieldNames 기본값 미설정 — 의도적 undefined 허용이라면 문제 없음
