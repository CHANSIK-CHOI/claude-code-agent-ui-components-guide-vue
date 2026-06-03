# Marquee — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-06-01
- **리뷰 결과**: PASS
- **루프 횟수**: 5회 (2차 리뷰 WARN 2건 해소 확인)
- **반복 발견 패턴**: 없음

## 최신 리뷰 (2차 — touchEnd 대칭화 + cloneChild 추출 반영 후)

- **BLOCKER**: 없음
- **WARN**: 없음 (1차 WARN 2건 완전 해소)
- **INFO**: 없음

## 해소 확인 사항

1. **touchEnd 이중 경로 대칭화**: onTransitionEnd 내 `sw.off('transitionEnd', onTransitionEnd)` 추가. 타이머/transitionEnd 양쪽 경로 모두 `sw.off + clearTimeout/resumeTimer=0 + resume()` 패턴으로 대칭화 완료.
2. **cloneChild 추출 + any 제거**: `unknown + isVNode + Array.isArray` 타입가드로 VNode/중첩 배열/primitive 3케이스 완전 커버. `any` 없음. `(cloned as VNode & { children: unknown[] })` 최소 단언은 Vue 내부 타입 제약 우회로 불가피 — 허용.

## 핵심 패턴 메모

- `deepCloneVNode` + `cloneChild`: cloneVNode(shallow) 후 children 재귀. isVNode 타입가드 + Array.isArray 중첩 배열 커버 + primitive pass-through. Vue 관용구 부합.
- `resolveComponent('ClientOnly')`: setup 1회 조회 — render 내 매 호출 방지.
- `vnode.type === SwiperSlide` 동일성 비교: ESM 싱글턴 보장으로 안정적.
- 비반응 변수(`let`), onBeforeUnmount 정리(rAF + timer + mql 리스너 3종), `$attrs` 위임(swiperProps 앞 스프레드) 모두 정합.
- defineComponent + render function 예외: `<script setup>` 불가 사유 코드 상단 주석 명시.
- touchEnd 이중 경로(transitionEnd/타이머) — 먼저 실행된 쪽이 나머지 취소, resume() 1회 보장.

## rules 보강 제안

rules/components.md에 defineComponent + render function 예외 패턴 예시 추가 권고 (금지 사항에 예외 케이스 설명 없음)
