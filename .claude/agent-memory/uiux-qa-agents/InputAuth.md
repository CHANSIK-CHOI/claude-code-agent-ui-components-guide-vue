# InputAuth — QA 검수 메모

- **검수일**: 2026-05-29
- **검수 결과**: PASS
- **루프 횟수**: 2회 (1차 PASS with WARN 1건 → publisher 수정 → 2차 재검수 PASS)
- **발견한 BLOCKER 요약**: 없음
- **재발 방지 메모**:
  - InputAuth는 Radix Vue 미사용, 자체 setInterval + watch + onMounted + onUnmounted 구현. Vue 3 자체 API이므로 Context7 호출 불필요 — 정적 분석으로 처리.
  - 콘솔 에러/경고(Kakao CSP, Naver Pay write(), Amplitude timeout)는 전역 인프라 레벨 — 컴포넌트와 무관, BLOCKER 아님.
  - `watch({ immediate: true })` 패턴 — active=true 초기값 마운트 처리에 필수. oldVal=undefined 시 `!oldVal`이 truthy이므로 조건 만족 → startTimer() 정상 호출됨.
  - `stopAndReset()` 시 timerState를 'expired'가 아닌 'idle'로 전환 — spec §5 "expired 상태로 전환하지 않음" 준수. 1차 검수 WARN 항목 해결 완료.
  - `TimerState` 타입에 'idle' 포함 필수 — `'idle' | 'running' | 'expired'`. suffix 렌더링은 'running'일 때만 (idle/expired 모두 미표시).
  - disabled 상태여도 타이머는 독립 진행 — setInterval은 disabled prop과 무관하게 동작.
  - 2차 검수 전 시나리오 전항목 정상: autoStart 즉시 시작, active false→true/true→false 전환(idle 상태), 10초 timer-end 이벤트 + suffix 소멸, disabled 독립 타이머.
