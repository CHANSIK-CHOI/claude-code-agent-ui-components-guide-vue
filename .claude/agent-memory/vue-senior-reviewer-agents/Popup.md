# Popup — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-04-29
- **리뷰 결과**: PASS
- **루프 횟수**: 누적 2회 (1차 BLOCKER: inheritAttrs 누락, 2차 BLOCKER: translate 개별 속성 혼재) + 이번 FullPopup 변경분 추가 리뷰 PASS
- **반복 발견 패턴**: 없음
- **rules 보강 제안**: rules/style.md에 "keyframe 내 transform 체계는 기본 스타일과 반드시 일치시킬 것 — CSS `translate`/`rotate`/`scale` 개별 속성과 `transform`을 혼용하지 않는다" 항목 추가 권고 (이전 리뷰에서 기록, 유지)

## 최종 리뷰 확인 사항 (FullPopup 변경분 PASS)

- `DialogOverlay` v-if 조건 제거 — 렌더링을 항상 하고, 동작(닫기 여부)을 `closeOnOverlay` prop으로 제어하는 구조. Vue 관용구에 더 부합하는 단순화. 반응성 이슈 없음.
- `slideInRight` 시작점 `translate(50%, 0)` 수정 — 이전 리뷰 WARN 해소됨. `left: 50%` 합산 시 콘텐츠 영역 오른쪽 끝에서 시작해 넓은 뷰포트에서도 화면 밖에서 슬라이드 인. spec `FullPopup.md §5` 명세와 일치.
- `handleOverlayClick` → `closeOnOverlay` prop 체크 → emit 흐름: `FullPopup`에서 `closeOnOverlay=false` 고정이므로 overlay 클릭 시 팝업 유지 동작 정합성 확인됨.
- transform 단일 속성 일관성 (이전 BLOCKER 해소 상태) 유지 확인 — base 스타일과 keyframe 모두 `transform` 단일 속성 사용, CSS `translate` 개별 속성 혼용 없음.
- INFO: `handleOpenChange`가 단순 패스스루 함수로 인라인 처리 가능하나, 같은 파일 내 핸들러 패턴 일관성 유지 관점에서 현행 유지도 무방.

## 이전 리뷰 이력

- 1차: `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` 전면 누락 → BLOCKER → publisher 수정 완료 → PASS
- 2차: `translate: -50% 0` 개별 속성 + `transform: translateY/X(...)` 키프레임 혼재 → BLOCKER → publisher 수정 완료 → PASS
- 3차 (FullPopup 변경분): `DialogOverlay v-if` 제거 + `slideInRight` 시작점 `translate(50%, 0)` 수정 → PASS (이전 WARN 해소 포함)
