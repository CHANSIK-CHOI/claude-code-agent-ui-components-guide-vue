# TermsAgreementGuidePage — 구현 메모

- **파일 경로**: pages/guide/termsAgreement/index.vue
- **SCSS 경로**: pages/guide/termsAgreement/termsAgreement.scss
- **계층**: guide
- **구현 완료일**: 2026-05-28
- **비표준 구현**: 없음
- **개발자 핸드오프**: 없음 (가이드 페이지 — 더미 데이터 및 alert/console.log로 popup-click 대체)

## 섹션 구성

1. ① 기본 사용 — checkbox / popup / accordion 3가지 type 항목 모두 포함한 예시
2. ② 전체 동의 연동 — allChecked v-model 바인딩 데모 (외부 버튼으로 강제 설정/해제 포함)
3. ③ type별 데모 — 4개 그룹:
   - checkbox 단독 (hasAccordionItems: false → Accordion 미마운트 설명 포함)
   - popup 단독 (hasAccordionItems: false → Accordion 미마운트 설명 포함)
   - accordion 단독 (hasAccordionItems: true → 단일 Accordion 컨테이너 마운트 설명 포함)
   - 혼합(checkbox + popup, accordion 없음) — Accordion 미마운트 동작 시각화 데모 (noAccordionItems)
4. ④ Props / Types / Events 테이블 — TermsItem 타입 필드 + Props + Emit 목록

## 특이사항

- `popup-click` 이벤트는 `alert()`로 대체 (실제 팝업 미연결)
- `TermsItem` 타입은 `@nd/components/molecules` barrel에서 re-export됨 — `import type { TermsItem } from '@nd/components/molecules'`로 사용
- GuideSidebar MOLECULES 그룹에 `{ label: 'TermsAgreement', to: '/guide/termsAgreement' }` 추가 완료
- badge 색상: `$bg-accent-beige` + `$text-700` (molecules 계층 구분용)
- ③ 섹션 코드 블록에 `hasAccordionItems` 분기 동작(Accordion 마운트/미마운트) 설명 주석 추가됨 (2026-05-28 업데이트)
- `noAccordionItems` 데이터 추가 — checkbox + popup 혼합으로 Accordion 미마운트 케이스 시각화
