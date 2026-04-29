# ToastPopup — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-04-29
- **리뷰 결과**: PASS
- **루프 횟수**: 4회 누적 (1차 FAIL → publisher 수정 → 2차 PASS → 재리뷰 PASS → hover pause 우회 수정 후 재리뷰 PASS)
- **반복 발견 패턴**: 없음 (이전 WARN이었던 ToastClose as-child + @click 중복 호출은 이번 수정에서 해소됨)
- **rules 보강 제안**:
  - rules/components.md에 "Radix Toast를 `:duration='Infinity'`로 비활성화할 때 ToastRoot 개별 duration이 Provider를 오버라이드하므로, 타이머 전략을 composable로 완전히 위임하려면 ToastRoot의 :duration 바인딩도 Infinity 또는 제거해야 한다" 항목 추가 권고
  - rules/architecture.md "Composables 위치" 섹션에 "composable이 소유하는 상태는 composable이 노출한 메서드를 통해서만 변경한다" 문구 추가 권고 (이전 리뷰에서 유지)

## 이슈 상세 (4차 리뷰 — hover pause 우회 수정)

### WARN 1: ToastRoot :duration 바인딩이 ToastProvider :duration="Infinity" 전략을 부분 우회
- `ToastProvider :duration="Infinity"` 설정에도 불구하고 `ToastPopup`의 `ToastRoot :duration="duration"` 바인딩이 Radix 내장 타이머를 개별적으로 복원
- `ToastRenderer`가 `duration`을 ToastPopup에 전달하지 않아 기본값 3000ms가 사용됨 → Radix 타이머와 composable 타이머 동시 작동
- 즉각 버그 없음 (두 번 close해도 멱등) — WARN 수준
- 권고: `ToastRoot :duration="Infinity"` 고정 또는 `:duration` 바인딩 제거

### timers 설계 검토 결과 (모두 적절)
- 모듈 레벨 싱글톤 위치: instances와 동일 스코프 — 의도된 캡슐화 (외부 미노출)
- setTimeout 콜백 내 close(id) 참조: function 선언식 호이스팅으로 문제 없음
- 이미 실행된 타이머에 clearTimeout: spec상 no-op, 안전
- remove()의 timers.delete 중복: Map.delete 멱등 연산, 의미 있는 방어적 코딩
