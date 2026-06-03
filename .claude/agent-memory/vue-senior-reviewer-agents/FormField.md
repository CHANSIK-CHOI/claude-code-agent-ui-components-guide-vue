# FormField — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-05-28
- **리뷰 결과**: PASS
- **루프 횟수**: 2회 (2026-05-22 1차 PASS → 2026-05-28 변경사항 재검토 PASS)
- **반복 발견 패턴**: 없음
- **이번 변경사항 중점 검토 결과**:
  - `helperRole` computed 제거 + v-if 독립 3분기 구조: Vue 관용구 완전 정합. 세 메시지 동시 표시 요구사항에서 computed를 제거하고 각 `<p>`에 독립 v-if를 두는 패턴이 가장 단순하고 명확함.
  - 래퍼 div v-if 조건(`errorText || successText || helperText`): 정합. 세 값 모두 빈 문자열일 때 `div#helper-xxx` 자체가 DOM에서 제거되어 aria-describedby 빈 연결 부작용 방지.
  - watch/computed 미사용: 올바른 판단. 파생값 없는 순수 표시용 컴포넌트.
- **잔존 INFO**:
  - INFO: `handleLabelMousedown` ①번 early return — v-if="props.inputId" 안에서 바인딩되므로 dead code. 방어코드로 무해.
  - INFO: 루트 `<div>` v-bind="$attrs" 위임 — 레이아웃 래퍼 컴포넌트 예외(PaginationSimple 선례 동일). 변경 없음.
- **rules 보강 제안**: 없음
