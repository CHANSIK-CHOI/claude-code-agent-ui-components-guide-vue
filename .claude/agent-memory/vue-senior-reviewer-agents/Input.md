# Input — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-04-28
- **리뷰 결과**: FAIL
- **루프 횟수**: 1회차
- **반복 발견 패턴**: `v-bind="$attrs"` 순서 위반 (명시적 바인딩보다 먼저 선언) — ButtonLink에서도 동일 패턴 발견된 바 있음. publisher 에이전트 전반의 $attrs 순서 이해 재점검 필요.
- **rules 보강 제안**: `rules/components.md` §"v-bind=\"$attrs\" 순서 규칙"에 "현재 코드처럼 $attrs가 먼저 오면 외부 type이 내부 type에 덮힌다"는 반례 예시 추가 권고 — 텍스트 설명만 있고 잘못된 코드 예시가 없어 publisher가 혼동하는 것으로 추정.

## BLOCKER 상세
- `v-bind="$attrs"` 가 `<input>` 첫 번째 속성으로 선언됨 → 외부 `type`, `disabled`, `placeholder` 등이 내부 명시 바인딩에 덮여 pass-through 불가

## WARN 상세
1. `<template>` 안에서 `props.xxx` 접두사 과잉 사용 — template은 props를 자동 노출
2. `withDefaults`에 `error: false`, `disabled: false`, `readonly: false`, `placeholder: ''` 불필요 명시 — Vue boolean prop 기본값은 false
3. `placeholder` prop 별도 선언 — $attrs 위임으로 충분

## INFO 상세
1. 가이드 페이지 `demo1`~`demo6` 개별 ref → `reactive` 묶기 제안 (stateDemos 패턴과 통일)
2. 가이드 페이지 `delegationNote` React 비교 문구 (`{...rest}` 언급) 누락
