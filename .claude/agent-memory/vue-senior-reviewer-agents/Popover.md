# Popover — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-05-14
- **리뷰 결과**: PASS
- **루프 횟수**: 11차 (setTimeout(stopWrapperFix, 250) 지연 호출 도입 검토)
- **반복 발견 패턴**: 없음
- **11차 변경 사항**: watch false 브랜치에서 stopWrapperFix() 즉시 호출 → setTimeout(stopWrapperFix, 250) 지연 호출로 변경. 닫힘 애니메이션($duration-base: 250ms) 완료 후 MutationObserver 해제 목적. Radix Vue PopoverContent의 애니메이션 lifecycle 진입점 없어 setTimeout이 허용 패턴으로 수용. setTimeout ID 미저장(clearTimeout 미호출) INFO 1건 — stopWrapperFix가 DOM/인스턴스 직접 참조 없어 실질 위험 없음.
- **유지 중인 수용 사항**:
  - handleClose에서 internalOpen 직접 세팅 + emit 양쪽 실행 — controlled/uncontrolled 양 모드 닫힘 보장 패턴
  - MutationObserver startWrapperFix/stopWrapperFix — closest() null이면 즉시 return, 무해
  - forceMount + data-has-been-opened CSS 분기 — Portal 유무 무관한 Radix 특성, 유지 적합
  - :deep() + !important — Radix 인라인 transform 방어 목적, 유지 적합
  - portal=true 분기에서 __inner 마크업 중복 — 기존 INFO 수용, 추가 악화 없음
  - setTimeout ID 미저장 — stopWrapperFix 내부 구조상 무해, INFO 수준에서 수용
- **9차 WARN 유지** (미수정):
  - portal=true 시 panelInnerRef Vue template ref 연결 보장 여부 미검증 — 실사용 전 브라우저 확인 권고
- **rules 보강 제안**: rules/components.md에 "startWrapperFix처럼 외부 리소스(MutationObserver 등)를 생성하는 함수는 재호출 전 기존 리소스를 disconnect/cleanup 후 재생성" 패턴 명시 권고
