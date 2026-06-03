# InputAuth — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-05-29
- **리뷰 결과**: PASS
- **루프 횟수**: 2회 (1차 WARN 2건 → 2차 PASS)
- **반복 발견 패턴**: 없음 (2차에서 이전 WARN 모두 해소)
- **해소 확인 항목**:
  - `active` watch `{ immediate: true }` 추가 — 마운트 직후 active=true 초기값 처리 완비
  - `stopAndReset()` 내 `timerState = 'idle'` 교체 — `idle | running | expired` 3-상태 모델 명확화
- **긍정 패턴**:
  - `defineOptions + v-bind="$attrs"` 순서 정합 (명시 바인딩 뒤에 위치)
  - `onUnmounted clearTimer()` 메모리 누수 방지 정상
  - `timerDisplay` computed로 파생값 처리 (watch+ref 이중 관리 없음)
  - Wrapper 책임 분리 정확 (Base 로직 재구현 없음)
  - immediate watch + `oldVal === undefined` 케이스 주석으로 명시 — 유지보수 가독성 충분
- **rules 보강 제안**: 없음
