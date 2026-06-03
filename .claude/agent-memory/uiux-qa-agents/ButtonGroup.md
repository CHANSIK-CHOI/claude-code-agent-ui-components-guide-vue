# ButtonGroup — QA 검수 메모

- **검수일**: 2026-05-19
- **검수 결과**: PASS
- **루프 횟수**: 재검수 1회 (narrowFirst + Tooltip 래퍼 케이스 신규 추가 검수)
- **발견한 BLOCKER 요약**: 없음
- **재발 방지 메모**:
  - ButtonGroup은 외부 라이브러리(Radix Vue 등) 미사용 — Context7 검증 항목 없음
  - `:deep(> :nth-child(2):not(button, a) > *)` 신규 규칙 정상 동작 확인
    - tooltip__alwaysOpen(DIV) 직접 자식(trigger wrapper DIV)에 flex: 1 1 0%, minWidth: 0px 적용됨 (bounding box 실측: 759px)
    - "구매하기" 버튼이 tooltip__alwaysOpen 너비(759px) 전체를 채움
  - Button 직접 자식 케이스(narrowFirst ②④) 회귀 없음 확인
    - BUTTON 태그는 :not(button, a)에 해당하지 않아 내부 span 영향 없음
    - 기존 flex:120/max-width:12rem / flex:200 비율 유지됨 (132px / 759px)
  - 기본(균등) 케이스: 3개 그룹 모두 양쪽 버튼 445px 균등 분할 정상
  - 콘솔 에러(kakao SDK CSP)는 컴포넌트 무관 앱 전역 외부 마케팅 스크립트 오류
  - Playwright 브라우저 세션 잠금 해소: `Get-WmiObject Win32_Process | Where { CommandLine -like '*mcp-chrome-bd56e00*' }` 으로 PID 확인 후 Stop-Process
