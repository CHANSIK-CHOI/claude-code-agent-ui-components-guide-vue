---
name: PopupGuidePageRevise
description: 팝업 5종 가이드 페이지 Props/Events 공통/전용 분리 + LayerPopup/FullPopup footerLayout prop 추가 현행화 메모
type: project
---

# Popup 가이드 페이지 일괄 현행화 — 구현 메모

- **최종 작업일**: 2026-05-04
- **대상 파일**: 5개 가이드 페이지 vue + 5개 scss + LayerPopup.vue + FullPopup.vue

## 변경 내용 요약

### 공통 패턴 (BottomSheet / LayerPopup / FullPopup)
- Props 단일 테이블 → "공통 Props" + "[컴포넌트] 전용 Props" 두 테이블로 분리
- Events 제목 → "공통 Events"로 변경
- 공통 Props 테이블 위에 `__commonNote` 안내 문구 추가
- 공통 Props 10개: open, title, description, showClose, okLabel, cancelLabel, showCancel, okDisabled, closeOnEscape, showFooter

### BottomSheet 전용
- 전용 Props: `closeOnOverlay`, `footerLayout` (2개)
- `footerLayout` 설명에 "(내부적으로 `narrowCancel=true`로 변환됨)" 명시 (2026-05-04 추가)

### LayerPopup 전용 (2026-05-04 추가)
- LayerPopup.vue에 `FooterLayout = 'equal' | 'wide'` 타입 + `footerLayout` prop(기본값 `'equal'`) 추가
- Popup에 `:narrow-cancel="footerLayout === 'wide'"` 바인딩 추가
- 가이드 페이지 "LayerPopup 전용 Props" 테이블에 `footerLayout` 행 추가 (narrowCancel 내부 변환 명시)
- 기존 전용 Props: `closeOnOverlay` (1개) → 이번 추가로 2개

### FullPopup 전용 (2026-05-04 추가)
- FullPopup.vue에 `FooterLayout = 'equal' | 'wide'` 타입 + `footerLayout` prop(기본값 `'equal'`) 추가
- Popup에 `:narrow-cancel="footerLayout === 'wide'"` 바인딩 추가
- 가이드 페이지에 "FullPopup 전용 Props" 테이블 신규 삽입 (footerLayout 1행, "FullPopup 특이사항" 단락 뒤에 위치)
- `showCancel` 기본값이 `false` (다른 팝업은 `true`) → 테이블 기본값 셀에 "false ※ 이 컴포넌트 기본값" 명시
- `closeOnOverlay` prop 없음 → "FullPopup 특이사항" 단락으로 안내

### Alert / Confirm
- "useAlert config" / "useConfirm config" 단일 테이블 → "공통 config" + "[컴포넌트] 전용 config" 분리
- 공통 config: Alert+Confirm 모두 — title, okLabel (Alert), + cancelLabel (Confirm도 공통)
- Alert 전용: message(필수), onClose
- Confirm 전용: message(필수), onOk, onCancel
- 오버로드 시그니처 테이블은 Confirm 전용이므로 그대로 유지

## SCSS 추가 클래스
- 5개 scss 파일 전부에 `__commonNote` 추가 (code 중첩 포함)
- 기존 `__tableTitle`, `__propsTable`, `__propsTableWrap` 재사용, 중복 추가 없음
