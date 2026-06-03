# Alert — QA 검수 메모

- **검수일**: 2026-05-04
- **검수 결과**: PASS (WARN 1건 포함)
- **루프 횟수**: 1회 (이번 수정 범위 재검수)
- **발견한 BLOCKER 요약**: 없음
- **재발 방지 메모**: title 표시 위치를 body → popup__header로 변경한 이후, 가이드 페이지(pages/guide/alert/index.vue) 설명 문구와 Props 표 `title` 설명이 "body에 표시"로 남아 있음(WARN). 구현·접근성·동작은 모두 정상. 다음 수정 시 가이드 페이지 문구도 함께 갱신할 것. DialogTitle 마운트 경로: title 없으면 VisuallyHidden("안내"), title 있으면 popup__header > DialogTitle — 두 경로 모두 정상 확인.
