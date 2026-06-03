# ButtonGroup — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-05-19
- **리뷰 결과**: PASS
- **루프 횟수**: 1회 (변경 리뷰)
- **반복 발견 패턴**: 없음 (이전 WARN이었던 withDefaults 반환값 미할당 이미 수정됨)
- **rules 보강 제안**: 없음

## 특이사항

- `:deep(> :nth-child(2):not(button, a) > *)` 패턴: Vue 3 scoped CSS 메커니즘 관점에서 합법. slot 자식 flex 제어 목적 `:deep()` 사용 정당. `:not(button, a)` CSS Level 4 부정 선택자 모바일 단일 타깃 환경 호환 문제 없음.
- `v-bind="$attrs"` 위치: 인터랙티브 요소 없는 순수 레이아웃 컨테이너 루트 `<div>` 위임 — 적절.
- Composition API 남용 없음: watch/computed/ref 전혀 없음, 레이아웃 전용 설계 준수.
- `const props = withDefaults(...)` 반환값 할당 정상.
