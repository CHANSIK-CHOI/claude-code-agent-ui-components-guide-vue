# LayerPopup — QA 검수 메모

- **검수일**: 2026-05-20
- **검수 결과**: PASS
- **루프 횟수**: 2회 (루프 1: WARN 수정 후 재검수)
- **발견한 BLOCKER 요약**: 없음
- **발견한 WARN 요약**: 없음 (이전 루프에서 closeOnCloseBtn prop 명시 추가로 해결)
- **이번 루프 수정 내용**:
  - `closeOnCloseBtn?: boolean` prop 선언 + `withDefaults`에 `closeOnCloseBtn: true` 기본값 추가
  - `<Popup>`에 `:close-on-close-btn="closeOnCloseBtn"` 바인딩 추가
  - `closeOnEscape` 바로 다음 위치에 일관성 있게 배치 확인
- **Playwright 검증 결과 (2026-05-20)**:
  - 콘솔 에러: Kakao SDK CSP 에러 1건 (전역 외부 스크립트 — QA 대상과 무관)
  - 가이드 페이지 정상 로드: 확인
  - 공통 Props 테이블에 `closeOnCloseBtn` 행 정상 표시: 확인
  - 팝업 열기/닫기 기본 동작 회귀 없음: 확인 (BottomSheet 가이드로 교차 검증)
- **재발 방지 메모**:
  - Wrapper 컴포넌트(LayerPopup/BottomSheet/FullPopup)에 Base prop을 신규 추가할 때는 반드시 props 선언 + withDefaults + template 바인딩 3곳 모두 수정 필요
  - `closeOnCloseBtn` 설명에 "Popup Base prop을 직접 전달(명시적 prop 추가 필요)"이라는 이전 WARN 문구가 가이드 테이블에 남아 있으나, 이번 수정으로 명시적 prop이 추가되었으므로 해당 설명은 향후 가이드 페이지 업데이트 시 수정 권장
