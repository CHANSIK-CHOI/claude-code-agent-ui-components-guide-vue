---
name: TabGuidePage
description: Tab 컴포넌트 가이드 페이지 구현 메모
type: project
---

# TabGuidePage — 구현 메모

- **파일 경로**: pages/guide/tab/
- **계층**: pages/guide (가이드 전용)
- **구현 완료일**: 2026-05-18
- **비표준 구현**: 없음
- **개발자 핸드오프**: detailTabs, categoryTabs, sortTabs 더미 데이터 — API 연동 필요

## 파일 목록

- `pages/guide/tab/index.vue` — 가이드 페이지 (7개 섹션)
- `pages/guide/tab/tabGuidePage.scss` — 외부 SCSS (selectGuidePage.scss 동일 구조)
- `components/guide/GuideSidebar.vue` — ORGANISMS 그룹 + Tab 링크 추가

## 섹션 구성

1. underline-dark — badge(리뷰 수) 포함 데모
2. underline-primary — 카테고리 탭, 가로 스크롤 시연
3. pill — 정렬 탭, overflow indicator 시연
4. #actions 슬롯 — text shape Button 조합 (구 ViewToggle 데모는 컴포넌트 제거로 교체 — 2026-06-03)
5. Navigation only 패턴 — 코드 스니펫 중심
6. grow prop — 3개 variant × grow:true 데모 (2026-05-18 추가)
7. Props 테이블 — Tab Props / TabItem 타입 / Events

## 특이사항

- Tab 컴포넌트에서 `TabItem` 타입을 named import (컴포넌트 파일에서 export)
- organisms 배지 색상은 selectGuidePage와 동일한 `$bg-accent-sky-blue` / `$color-primary` 사용
- GuideSidebar ATOMS - ORGANISMS - POLICY 순서로 배치
- grow 섹션: growTabs(4개, underline-primary + underline-dark 공용), growShortTabs(3개, pill 전용) 별도 데이터 사용
- Props 테이블 `grow` 행 추가 (boolean, 기본값 false, flex:1 균등 분배 + 스크롤 비활성화 설명)
