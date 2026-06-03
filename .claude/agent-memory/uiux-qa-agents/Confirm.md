# Confirm — QA 검수 메모

- **검수일**: 2026-05-04
- **검수 결과**: PASS (WARN 1건 포함)
- **루프 횟수**: 1회 (이번 수정 범위 재검수)
- **발견한 BLOCKER 요약**: 없음
- **재발 방지 메모**: title 표시 위치를 body → popup__header로 변경한 이후, 가이드 페이지(pages/guide/confirm/index.vue) 설명 문구와 Props 표 `title` 설명이 "body에 표시"/"body 영역에 배치"로 남아 있음(WARN). 구현·접근성·동작은 모두 정상. ESC → Promise resolve false 동작 확인. DialogTitle 마운트 경로는 Alert와 동일 패턴 — 정상 확인.
