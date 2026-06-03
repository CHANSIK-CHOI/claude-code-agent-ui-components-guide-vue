# Marquee — QA 검수 메모

- **검수일**: 2026-06-01
- **검수 결과**: PASS
- **루프 횟수**: 3차 (2차 PASS 후 시니어 리뷰 WARN 2건 수정 재검수)
- **발견한 BLOCKER 요약**: 없음

## 수정 이력 (1차 → 2차)

| 수정 항목 | 1차 등급 | 2차 결과 |
|---|---|---|
| deepCloneVNode children 배열 항목 isVNode 판별 미적용 | WARN | PASS — `isVNode(child)` 분기로 VNode만 재귀, primitive 통과 |
| ⑤-1 데모가 실제 Vue 컴포넌트를 사용하지 않음 | WARN | PASS — 컴포넌트 자식 원본+loop copy 18개 전원 정상 렌더 (당시 Badge 데모 — 2026-06-03 컴포넌트 제거로 Icon 교체) |
| resolveComponent를 render function 안에서 매 렌더마다 호출 | WARN | PASS — setup 본체 1회 조회로 수정 |
| 가이드 ⑤-1 코드 예시 머스태시 컴파일 에러 | BLOCKER | PASS — v-pre 적용 해결 |

## 3차 수정 검증 (2026-06-01)

| 수정 항목 | 시니어 리뷰 등급 | 3차 결과 |
|---|---|---|
| touchEnd 이중 경로: `onTransitionEnd` 내부에 `sw.off('transitionEnd', onTransitionEnd)` 대칭 추가 | WARN | PASS — once 자동 해제 후 off 재호출 무해. resume() 1회 보장 확인 |
| deepCloneVNode: `cloneChild(child: unknown): unknown` named 함수 추출 | WARN | PASS — VNode/Array/primitive 3분기 타입가드 정상. any 미사용. 중첩 배열 재귀 처리 포함 |

## 재발 방지 메모

- `isVNode`는 Vue 3 공식 export(`vue` 패키지). `defineComponent` + render function 패턴에서 children 배열에 primitive(string/number/boolean/null)가 섞일 수 있으므로, deepCloneVNode 내 `isVNode(child)` 판별로 VNode만 재귀하고 primitive는 그대로 통과 필수.
- Swiper loop copy 환경에서 Vue 컴포넌트를 자식으로 포함한 슬라이드는 동일 VNode 참조 재사용 시 빈 DOM 출력. `deepCloneVNode`(재귀 cloneVNode) 필수 — 네이티브 요소(`<img>` 등)는 해당 없음.
- `resolveComponent`는 setup 컨텍스트에서만 유효. render function 안 반복 호출 금지 — setup 본체 1회 조회 후 클로저 참조.
- 가이드 페이지 `<pre>` 안에 Vue 머스태시(`{{ }}`) 코드 예시 노출 시 `v-pre` 필수. 이스케이프 엔티티 방식은 가독성 저하.
- 자동 래핑 경로: `h(SwiperSlide, { key, style: 'width: fit-content' }, ...)` 패턴 확정. DOM 실측 완전 일치.
- Swiper Vue 내부 "[Vue warn]: Slot invoked outside of the render function" 경고는 라이브러리 알려진 동작. spec 수용, 컴포넌트 주석 명시.
- 콘솔 Error 1건(카카오 SDK CSP): Marquee 무관 전역 인프라 이슈.
