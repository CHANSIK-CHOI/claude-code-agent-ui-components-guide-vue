# ButtonLink — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-04-28
- **리뷰 결과**: PASS
- **루프 횟수**: 4회 (1차: auto-import 위반 + handleClick 누락 WARN → 2차: PASS → 3차: resolveComponent computed 내부 호출 BLOCKER 발견 → 4차: BLOCKER 해결 확인 PASS)
- **반복 발견 패턴**: resolveComponent를 computed 콜백 내부에서 호출 — Vue 3 setup() 최상위 컨텍스트 규칙 위반. 4차에서 setup 최상위로 이동 확인, 해결됨.
- **rules 보강 제안**: rules/components.md에 dynamic component 패턴 사용 시 `resolveComponent` 유효 호출 위치(setup 최상위만) 예시 명시 권고. computed/watch/onMounted 등 effect 콜백 내부 호출 금지 명시 필요.
