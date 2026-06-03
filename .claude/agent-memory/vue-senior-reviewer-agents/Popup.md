# Popup — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-06-01
- **리뷰 결과**: PASS
- **루프 횟수**: 누적 24회
- **반복 발견 패턴**: `.popup__footer` SCSS 블록 2개 분리 (INFO) — 매 차 권고하나 미반영 중
- **rules 보강 제안**:
  - rules/style.md에 "keyframe 내 transform 체계는 기본 스타일과 반드시 일치시킬 것" 항목 추가 권고 (유지)
  - rules/components.md에 "컴포넌트 간 통신은 emit 우선 — 함수를 prop으로 전달하는 패턴(React 관용구)은 Vue에서 WARN" 명시 권고 (유지)
  - rules/components.md 또는 architecture.md에 "외부 컴포넌트의 prop 타입을 인라인 리터럴로 재선언 금지 — 반드시 types.ts 단일 출처 참조" 추가 권고 (유지)
  - rules/style.md에 "scoped 내 :deep(> :first-child / > :last-child) 선택자 사용 시 자체 마크업과 slot 자식 양쪽을 커버한다는 의도를 주석으로 명시" 추가 권고 (유지)
  - rules/style.md에 "동일 선택자를 2개 블록으로 분리하지 않고 하나의 블록으로 병합" 원칙 추가 권고 (유지)

## 24차 리뷰 (2026-06-01)

### 변경 범위 (집중 검토)

1. `bodyNote?: string` prop 추가 (Popup.vue + Wrapper 3종)
2. `<div v-if="bodyNote" class="popup__bodyNote"><Icon size="sm" aria-hidden="true"><CircularNoteSvg /></Icon><span class="popup__bodyNoteText" v-html="bodyNote" /></div>` 를 `.popup__body` 내부 slot 아래에 삽입

### 검토 결과

- BLOCKER: 없음
- WARN: 없음
- INFO: 없음

### 검토 포인트 상세

**bodyNote spec §8 트리 구조 일치 여부**
- `v-if="bodyNote"` 조건 + slot 아래 배치 + `Icon(size="sm", aria-hidden="true")` + `span.popup__bodyNoteText` — spec 정의와 완전 일치

**bodyLabel 패턴과의 일관성**
- optional string → withDefaults 기본값 미명시(Vue 관용구에 부합) → `v-if` 조건 → `v-html` 바인딩 패턴이 bodyLabel과 동일

**CircularNoteSvg import**
- `?skipsvgo` 패턴 — 색상 고정 SVG 처리를 위한 프로젝트 표준 패턴 준수

**Wrapper 3종 위임 정합성**
- LayerPopup / BottomSheet / FullPopup 모두 `:body-note="bodyNote"` 위치·기본값 일관

**기존 항목 재확인**
- `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` 위치(DialogContent): 정상 유지
- `v-bind="$attrs"` → 명시 바인딩 순서: 정상 유지
- props mutation, 반응성 누수: 없음
- emit 시그니처 타입: 모두 정의됨
- auto-import 준수: 정상
- watch 없음, computed 4개 모두 적절

## 23차 리뷰 (2026-06-01)

### 변경 범위 (집중 검토)

1. `bodyLabel?: string` prop 추가 (Popup.vue + Wrapper 3종)
2. `<div v-if="bodyLabel" class="popup__bodyLabel">{{ bodyLabel }}</div>` 를 `.popup__body` 내부 slot 위에 삽입

### 검토 결과

- BLOCKER: 없음
- WARN: 없음
- INFO: 없음

### 검토 포인트 상세

**optional string prop 기본값 미명시**
- `withDefaults` 기본값 목록에 `bodyLabel` 없음 — optional string에 기본값 생략은 Vue 관용구에 부합
- `undefined`가 곧 "없음"이며 `v-if="bodyLabel"` 조건이 정확히 처리

**`v-if="bodyLabel"` 조건**
- 빈 문자열(`""`) 시 falsy로 div 미렌더링 — 의도된 동작, 타입(`string?`)과 일관
- spec §8 트리 구조 `div.popup__bodyLabel (v-if="bodyLabel") — slot 위` 정의와 정확히 일치

**Wrapper 3종 위임 정합성**
- LayerPopup / BottomSheet / FullPopup 모두 `:body-label="bodyLabel"` 위치·기본값 일관

**기존 항목 재확인**
- `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` 위치(DialogContent): 정상 유지
- `v-bind="$attrs"` → class 순서: 정상 유지
- props mutation, 반응성 누수: 없음
- emit 시그니처 타입: 모두 정의됨
- auto-import 준수: 정상
- watch 없음, computed 4개 모두 적절

## 이전 리뷰 이력 (요약)

- 1차: `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` 누락 → BLOCKER → 수정 완료
- 2차: `translate: -50% 0` 개별 속성 + `transform` 키프레임 혼재 → BLOCKER → 수정 완료
- 3차 (FullPopup 변경분): DialogOverlay v-if 제거 + slideInRight 시작점 수정 → PASS
- 4차 (alert/confirm 타입 추가): WARN 3건 → PASS
- 5차 (layer 타입 close 버튼 absolute 분리): WARN 2건 → PASS
- 6차 (Footer Button 교체 + cancelColor/cancelFlex/okFlex): BLOCKER 1건 → FAIL
- 7차 (6차 BLOCKER 수정 검증): BLOCKER 해소 → PASS
- 8차~14차: PASS (각 prop 추가/구조 개선)
- 15차 (@click → @pointerdown 변경 — phantom click 버그 수정): PASS
- 16차 (함수명 handleOverlayPointerDown 변경 검토 + 전체 재검토): PASS
- 17차 (footerStyle computed 통합 + header/footer→div 변경 + scoped 선택자 검토): PASS
- 18차 (동일 변경 재확인 + .popup__footer 블록 분리 병합 권고): PASS
- 19차 (closeOnCloseBtn prop 추가 검토): PASS
- 20차 (okColor prop 추가 — cancelColor 패턴 일관성 확인): PASS
- 21차 (closeOnCancel prop 추가 — closeOnCloseBtn과 대칭성 확인): PASS
- 22차 (handleOverlayPointerDown 시그니처 변경 + event.button !== 0 early return): PASS
- 23차 (bodyLabel prop 추가 + .popup__body 내 slot 위 렌더링 + Wrapper 3종 위임): PASS
