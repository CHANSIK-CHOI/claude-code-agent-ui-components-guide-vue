# Collapsible — QA 검수 메모

- **검수일**: 2026-05-11
- **검수 결과**: PASS
- **루프 횟수**: 2회 (1차 BLOCKER 2건 → publisher 수정 → 2차 WARN 3건 수정 → 3차 PASS)
- **발견한 BLOCKER 요약**: 없음 (모두 해결됨)
- **재발 방지 메모**:
  - plain 함수형 컴포넌트 객체 (`setup` + 렌더 함수만 있는 객체)는 `defineComponent` 불필요. scoped 해시 미전달 특성은 동일하므로 `:deep()` 선택자는 여전히 필수.
  - ROOT_EVENT_PROPS = ['onUpdate:open'] 명시적 목록 방식이 안전 — Vue 3 내부 이벤트 prop은 `on` + camelCase 형식으로 정규화됨.
  - CollapsibleContent의 `--radix-collapsible-content-height` CSS 변수는 Radix Vue가 자동 주입 (Tooltip BLOCKER의 `--radix-popover-trigger-bottom`과 달리 정상 동작).
  - 아이콘만 있는 트리거는 반드시 `aria-label` 필수 (`rules/a11y.md` 준수).

## 3차 검수 실증 데이터 (2026-05-11 — plain 함수형 컴포넌트 교체 후 최종)

### :deep() 선택자 적용 여부 확인 (plain 함수형 컴포넌트에서도 정상)
- contentCount: 5 (collapsible__content--animated 클래스 부여)
- triggerCount: 4 (collapsible__trigger--animated 클래스 부여)
- 모든 content overflow: hidden 적용 확인
- open 상태 child transform: `matrix(1, 0, 0, 1, 0, 0)` (rotate(0deg) = transition 정상)
- closed 상태 child transition: `transform 0.15s` 정상 적용

### triggerAnimation=false
- collapsible__trigger--animated 클래스 미부여 확인 (1개 — 교환·환불 안내 버튼)
- contentAnimation은 여전히 적용 (triggerAnimation만 off)

### 접근성
- 패턴 A 아이콘 버튼 aria-label="소비기한 상세 보기" 정상 전달
- 모든 트리거 type="button" 정상
- aria-expanded Radix Vue 자동 관리 확인 (open→"true", closed→"false")
- Tab 키 포커스 이동 정상 (BUTTON 요소 탐색 가능)
- Space 키 토글 정상 (closed ↔ open)

### 시나리오 전체 이상 없음
- 패턴 A (아이콘 트리거): 클릭 → content 열림 정상
- 패턴 B (텍스트+아이콘 트리거): 클릭 → content 열림 정상
- defaultOpen: 페이지 진입 시 이미 열린 상태 확인
- Controlled(v-model:open): 외부 버튼 클릭 → 상태 라벨 "open" 전환 정상
- triggerAnimation=false: animated 클래스 미부여, content 애니메이션은 정상 유지
