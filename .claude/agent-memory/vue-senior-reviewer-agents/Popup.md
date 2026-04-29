# Popup — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-04-29
- **리뷰 결과**: PASS
- **루프 횟수**: 누적 7회 (6차 FAIL → 7차 PASS)
- **반복 발견 패턴**: 컴포넌트 간 타입 단일 출처 미준수 (cancelColor 인라인 리터럴 선언 → ButtonColor 참조 미사용) — 7차에서 최종 수정 완료
- **rules 보강 제안**:
  - rules/style.md에 "keyframe 내 transform 체계는 기본 스타일과 반드시 일치시킬 것" 항목 추가 권고 (이전 리뷰에서 기록, 유지)
  - rules/components.md에 "컴포넌트 간 통신은 emit 우선 — 함수를 prop으로 전달하는 패턴(React 관용구)은 Vue에서 WARN" 명시 권고
  - rules/components.md 또는 architecture.md에 "외부 컴포넌트의 prop 타입을 인라인 리터럴로 재선언 금지 — 반드시 types.ts 단일 출처 참조" 추가 권고

## 7차 리뷰 확인 사항 (6차 BLOCKER 수정 검증)

- **BLOCKER 해소 확인**: `cancelColor?: Extract<ButtonColor, 'secondary' | 'gray'>` 정상 적용 (129번 라인)
- **import 확인**: `import type { ButtonColor } from '@nd/components/types'` 정상 (113번 라인)
- **useSlots auto-import 확인**: `import { useSlots } from 'vue'` 제거, 150번 라인에서 `useSlots()` 직접 호출 — Nuxt auto-import 방식 정상
- 잔존 BLOCKER 없음

## 이전 리뷰 이력 (요약)

- 1차: `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` 누락 → BLOCKER → 수정 완료
- 2차: `translate: -50% 0` 개별 속성 + `transform` 키프레임 혼재 → BLOCKER → 수정 완료
- 3차 (FullPopup 변경분): `DialogOverlay v-if` 제거 + `slideInRight` 시작점 수정 → PASS
- 4차 (alert/confirm 타입 추가): WARN 3건 (emit 패턴, required prop, isOkClicked 리스크) → PASS
- 5차 (layer 타입 close 버튼 absolute 분리): WARN 2건 ($slots.header 분산, v-else-if 의미 불일치) → PASS
- 6차 (Footer Button 교체 + cancelColor/cancelFlex/okFlex): BLOCKER 1건 (cancelColor 타입 단일 출처 위반), WARN 3건 → FAIL
- 7차 (6차 BLOCKER 수정 검증): BLOCKER 해소 확인 → PASS
