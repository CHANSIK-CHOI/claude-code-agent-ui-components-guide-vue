# Accordion — QA 검수 메모

- **검수일**: 2026-05-19
- **검수 결과**: FAIL (15차)
- **루프 횟수**: 15차
- **발견한 BLOCKER 요약**: aria-controls 초기 렌더링 빈 문자열 이슈 미해결 — `onMounted(() => instance?.parent?.update())` 보정 추가 후에도 headTrigger=false(accordion__trigger--icon) 패턴에서 여전히 closed 상태 트리거 `aria-controls=""` 유지. headTrigger=true(accordion__trigger--head) 패턴은 정상.
- **재발 방지 메모**: `parent.update()` 호출이 AccordionContent → AccordionItem 체인 내에서만 동작하고 sibling인 AccordionTrigger 렌더 함수 재실행을 트리거하지 못하는 것이 근본 원인. CollapsibleRoot가 contentId를 reactive하지 않게 provide하기 때문. 해결 방향: AccordionContent의 `onMounted`에서 `parent.update()`가 아니라, ContentId를 CollapsibleTrigger가 직접 읽을 수 있도록 CollapsibleRoot 레벨의 reactivity를 확보하는 방향이 필요. 또는 AccordionTrigger의 렌더 함수에서 nextTick 이후 직접 DOM에 setAttribute('aria-controls', contentId)를 패치하는 방식도 고려 가능.

---

## 15차 검수 결과 (onMounted parent.update() 보정 추가 후 재검수)

### Context7 검증

- 14차에서 전항목 완료 확인. 변경사항 없음 (onMounted 추가만 — Vue 3 내부 API 사용이므로 Context7 재확인 불필요).

### Playwright 검증 결과

- **콘솔 에러**: Kakao SDK CSP 에러(환경 이슈) — Accordion과 무관
- **Vue warn**: 총 20건 — `Slot "default" invoked outside of the render function` 경고 다수. plain object 컴포넌트의 슬롯 호출 타이밍 문제로 발생하는 구조적 경고. 기능 동작에 직접적 영향은 없으나 주목 필요.
- **섹션① single v-model:value**: 클릭/Enter 정상 동작
- **섹션② multiple**: 정상
- **섹션③ Root disabled**: 3개 버튼 모두 `disabled` 속성 정상
- **섹션④ 개별 Item disabled**: 정상
- **섹션⑤ headTrigger false**: accordion__trigger--icon 클래스, 아이콘 자동 렌더, 회전 애니메이션 정상
- **섹션⑤ headTrigger true**: accordion__trigger--head 클래스, 헤드 전체 트리거 정상, aria-controls 정상
- **Tab 키보드 탐색**: 정상
- **Enter 키 토글**: 정상

### BLOCKER

- [BLOCKER] aria-controls 초기 렌더링 빈 문자열 미해결: 페이지 최초 로드 시 `accordion__trigger--icon` 패턴(headTrigger=false) 14개 트리거 중 한 번도 클릭하지 않은 13개에서 `aria-controls=""`로 렌더링됨. `onMounted(() => instance?.parent?.update())` 추가 이후에도 현상 동일. headTrigger=true 패턴 2개는 초기부터 aria-controls 정상. WAI-ARIA Accordion 패턴 필수 속성 미충족.
- [BLOCKER] Vue warn 다수 발생: `[Vue warn]: Slot "default" invoked outside of the render function` — CollapsibleRoot의 Primitive 안에서 plain object 컴포넌트 슬롯이 렌더 함수 밖에서 호출되는 경고. 14차 검수 당시에는 기록되지 않았으나 이번 재검수에서 20건 확인. 기능 이상 아닌 경고지만 누적 시 성능 영향 가능.

### WARN

- [WARN] AccordionContent attrs 위임 미구현 (spec 미명시 범위 내 허용, 14차와 동일).
