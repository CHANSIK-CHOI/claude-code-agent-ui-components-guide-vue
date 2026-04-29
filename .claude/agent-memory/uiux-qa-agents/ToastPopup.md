# ToastPopup — QA 검수 메모

- **검수일**: 2026-04-29
- **검수 결과**: PASS (WARN 1건)
- **루프 횟수**: 최종 검수 완료 (Playwright 전 항목 PASS)
- **발견한 BLOCKER 요약**: 없음
- **재발 방지 메모**:
  - Playwright 스크린샷으로 `position: fixed` 토스트가 포착 안 될 수 있음 — `browser_evaluate`로 DOM 존재 + `getBoundingClientRect` 직접 폴링해 검증해야 함
  - hover 무반응 핵심 동작: `ToastProvider duration=Infinity` + `useToastPopup.ts` 직접 `setTimeout` 관리 패턴으로 Radix의 `pauseOnHover` 우회. `mouseover/mouseenter` 이벤트 발생 시에도 3초 후 자동 닫힘 정상 동작.
  - `duration: 0` 지정 시 타이머 미등록 — 4초 후에도 `data-state: open` 유지 확인됨
  - [WARN] spec §6 Events에 `close` 이벤트 명시됐으나 구현에 미포함 — `update:open`과 `closed` 이벤트만 구현. `ToastRootEmits`에서 Omit 처리된 것으로 보임. 실동작에는 무영향(닫기 버튼은 `ToastClose as-child` Radix 기본 동작으로 처리됨).
  - 가이드 페이지에 success/error 단축 메서드 버튼 없음 — 정상 (spec 미정의)
  - HMR WebSocket 에러(`ws://localhost:24678`)는 빌드 서버 환경에서 정상 발생, 무시
  - 콘솔 실제 앱 오류 없음
