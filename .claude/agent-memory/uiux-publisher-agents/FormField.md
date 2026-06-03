# FormField — 구현 메모

- **파일 경로**: components/molecules/FormField.vue
- **계층**: molecules
- **구현 완료일**: 2026-05-13
- **비표준 구현**:
  - `IcCheckCircle.svg?skipsvgo` — stroke 색상 내부 고정(#00ADDB)이므로 SVGO 최적화 건너뜀 (`?component` 아님)
  - 도움말 `<p>` 태그에 `display: flex` 적용 (successText 아이콘+텍스트 가로 배열 전용, `--success` modifier 안에서만)
  - 우선순위 처리: `errorText > successText > helperText` — `<template v-if>` 분기로 구현 (errorText가 있으면 successText 아이콘 렌더링 안 함)
- **개발자 핸드오프**: 없음 (UI 제어용 props만)

## 가이드 페이지 수정 이력 (2026-05-13)

**BLOCKER 수정:**
- `couponOptions`, `regionOptions`의 placeholder 항목 `value: ''` → `value: 'placeholder'` 변경
- 해당 항목에 `disabled: true` 추가 (Radix Vue SelectItem이 빈 문자열 value 허용 안 함)
- `priorityHelper`, `priorityError` 초기값 → `ref<string | undefined>(undefined)` (SelectValue placeholder 표시 의도)
- `successCoupon` 초기값 → `'coupon10'` (성공 상태 시연용)

**사용자 추가 요청 — ⑤ 툴팁 포함 섹션 신규 추가:**
- 기존 ⑤ 복합 폼 레이아웃 → ⑥, 기존 ⑥ Props → ⑦ 번호 조정
- Tooltip 컴포넌트(`atoms`)를 `FormField`의 `#tooltip` slot에 삽입하는 패턴 시연
- Tooltip `#trigger` slot에 `<button type="button" aria-label="이메일 도움말">?</button>` 삽입
- `.formFieldGuidePage__tooltipTrigger` 스타일 추가 (원형 물음표 버튼)
- `tooltipEmail = ref('')` 추가
