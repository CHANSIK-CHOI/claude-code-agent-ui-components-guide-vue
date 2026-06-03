# Collapsible — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-05-11
- **리뷰 결과**: PASS (BLOCKER 없음, WARN 3건, INFO 2건)
- **루프 횟수**: 3회 (contentAnimation/triggerAnimation props 추가 변경 후 재검토)
- **반복 발견 패턴**: triggerAttrs 이벤트 핸들러 누출 — `!k.startsWith('on')` 일괄 필터가 사용자 @click/@keydown 등도 차단. 3회 연속 지적. defineComponent 오버스펙 — plain render function으로 충분한 곳에 defineComponent + computed 이중 래핑 사용. auto-import 대상 computed 명시적 import.
- **신규 확인 패턴**: contentAnimation/triggerAnimation 조건부 클래스 바인딩 패턴 자체는 올바름. `:deep()` 사용은 Radix Vue 래핑 구조의 필연적 결과로 불가피한 사용 인정. COLLAPSIBLE_ROOT_PROPS kebab-case 'default-open' 항목은 dead code 가능성(방어 코드로는 허용).
- **rules 보강 제안**: rules/components.md Radix Vue attrs 분리 섹션에 "triggerAttrs에서 Root 레벨 이벤트 핸들러(onUpdate:xxx) 명시적 목록으로 제외 — startsWith('on') 일괄 필터 금지" 예시 추가 권고. scoped slot용 render unit은 defineComponent 없이 plain render function(함수형 컴포넌트 객체)으로 충분함 명시 권고.
