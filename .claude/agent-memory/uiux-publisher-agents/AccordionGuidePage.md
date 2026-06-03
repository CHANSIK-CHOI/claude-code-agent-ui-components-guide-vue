# AccordionGuidePage — 구현 메모

- **파일 경로**: pages/guide/accordion/index.vue
- **계층**: guide
- **구현 완료일**: 2026-05-19
- **비표준 구현**:
  - 4개 컴포넌트 직접 중첩 패턴으로 전면 재작성 (기존 Provider/scoped-slot 패턴 제거)
  - `v-slot="{ Item }"` + `<Component :is="Item">` 패턴 완전 삭제
  - `v-slot="{ Trigger, Content }"` + `<Component :is>` 패턴 완전 삭제
  - `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent }` 4개 직접 import
  - 섹션 구성: ①기본(single) ②multiple ③disabled Root ④disabled Item ⑤애니메이션off ⑥Props
  - 기존 ⑤ 인터랙티브 데모 섹션 제거 (Provider 패턴 의존도 높아 삭제)
  - ⑥ Props 테이블 4개로 분리: AccordionRoot / AccordionItem / AccordionTrigger / AccordionContent
  - Slots·Events 테이블에 '컴포넌트' 열 추가하여 각 컴포넌트 소속 명시
  - `__triggerInner` div 래퍼 패턴: AccordionTrigger가 이미 button 역할이므로 내부에 button 중첩 금지.
    기존 `<button class="accordionGuidePage__trigger">` → `<div class="accordionGuidePage__triggerInner">`로 교체.
  - `demoRow` 레이아웃(flex 2컬럼)은 ⑤ 애니메이션 섹션의 나란히 비교 데모용
- **개발자 핸드오프**: 없음 (정적 가이드 페이지)
- **GuideSidebar 등록**: MOLECULES 그룹에 Accordion 항목 이미 존재 (변경 없음)
