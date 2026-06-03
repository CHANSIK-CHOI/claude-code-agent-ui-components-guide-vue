# TermsAgreement — QA 검수 메모

- **검수일**: 2026-05-28 (최종 검수 — WARN-A/B 수정 후 중점 확인: accordionProps computed + v-bind 통합, items watch 책임 분리 주석)
- **검수 결과**: PASS
- **루프 횟수**: 총 4회 (1차 FAIL: named import SyntaxError → 2차 PASS → 구조 변경 재검수 3차 PASS → WARN 수정 후 최종 4차 PASS)
- **발견한 BLOCKER 요약**: 없음
- **재발 방지 메모**:
  - Accordion.vue는 default + named export 혼합 구조. `import Accordion, { AccordionItem, AccordionTrigger, AccordionContent } from './Accordion.vue'` 패턴 필수. `import { Accordion }` 단독 named import는 SyntaxError.
  - accordionProps computed: `{ type: 'multiple', 'onUpdate:modelValue': onAccordionChange }` 객체를 v-bind로 Accordion에 전달. Accordion.vue의 rootAttrs computed가 'type'(ACCORDION_ROOT_PROPS)과 'onUpdate:modelValue'(ROOT_EVENT_PROPS) 두 키 모두 포함하므로 AccordionRoot로 올바르게 위임됨. 실측 확인(accordion-open "acc1" 정상 수신).
  - items watch 책임 분리 주석: isHandlingChange 가드를 items watch에 적용하지 않는 이유 명시. 두 watch의 관심사 차이(항목 구조 재구성 vs 전체 동의 인터랙션) 명확히 분리.
  - allChecked=true 외부 주입: checkedMap 전체 true 동기화. allChecked=false 외부 주입: checkedMap 변경 없음(spec §7 계약). Playwright "전체 동의 설정" / "전체 해제" 버튼으로 양쪽 경로 모두 실측 확인.
  - accordion-open: prevOpenValues let 변수 비교로 열릴 때만 emit. 닫힘 시 비발생 확인.
  - popup-click emit, aria-label("[항목명] 내용 보기"), accordion aria-expanded 자동 처리 모두 정상.
  - 콘솔 에러(Kakao SDK CSP) / warning(네이버페이, Amplitude): TermsAgreement 무관, 전역 마케팅 스크립트 이슈.
