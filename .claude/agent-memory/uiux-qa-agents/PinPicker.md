# PinPicker — QA 검수 메모

- **검수일**: 2026-05-14
- **검수 결과**: PASS
- **루프 횟수**: 1회
- **발견한 BLOCKER 요약**: 없음
- **재발 방지 메모**:
  - vant Picker는 `plugins/vant.ts`에 이미 `Picker`가 등록되어 있으므로 신규 추가 불필요 (spec §10의 "추가 필요" 안내는 이미 반영 완료 상태)
  - 콘솔 에러(kakao SDK CSP, Header 하이드레이션 불일치, GoodsView Collapsible) 는 PinPicker 무관 전역 이슈 — Header definePageMeta 전환 이후에도 하이드레이션 불일치가 잔존함, Header 검수 시 추적 필요
  - `handleOk`에서 `selectedOptions: [], selectedIndexes: []`를 항상 빈 배열로 반환하는 것은 spec §6의 "BottomSheet @ok 시점에서 vant confirm 파라미터에 접근 불가" 설계 결정으로 WARN 대상 아님(spec 명시)
