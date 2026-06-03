---
name: Tab
description: organisms 계층 탭 네비게이션 컴포넌트 구현 메모 — Radix Vue TabsRoot/TabsList/TabsTrigger 래핑, Navigation only, 4 variants (pill-vertical 추가)
type: project
---

# Tab — 구현 메모

- **파일 경로**: `components/organisms/Tab.vue`
- **계층**: organisms
- **구현 완료일**: 2026-05-26 (pill-vertical variant 추가)

## 비표준 구현

- **TabsContent 미사용**: Navigation only 설계. 콘텐츠 전환은 부모가 `v-if`로 처리.
- **attrs 단순 위임**: Select와 달리 3단계 분리 없이 `v-bind="$attrs"`를 `TabsRoot`에 그대로 전달. TabsRoot가 받는 props(`modelValue`, `defaultValue`, `dir`, `activationMode`)와 일반 HTML attrs 모두 TabsRoot 수준에서 처리.
- **modelValue 기본값**: `withDefaults`의 `undefined`로 두고, `computed`로 `items[0].value` fallback 처리.
- **pill active 배경**: `$color-primary-hover` (#00addb) 사용 — `$color-primary` (#0cb5e2) 아님. 명세에서 명시된 토큰.
- **grow prop + .tab--grow modifier**: `grow: true && variant === 'underline-dark'`이면 `.tab--grow` 클래스 추가. `effectiveGrow` computed로 pill-vertical 시 자동 무효화.
- **orientation computed**: `pill-vertical`이면 `"vertical"`, 아니면 `"horizontal"`. `v-bind="$attrs"` 뒤에 `:orientation="orientation"` 명시적 prop으로 TabsRoot에 전달 — attrs보다 나중에 와서 내부값이 우선.
- **actions 슬롯**: `$slots.actions && variant !== 'pill-vertical'` 조건으로 pill-vertical에서 완전 미렌더링.
- **pill-vertical SCSS**: modifier block 안에서 `flex-direction: column; align-items: flex-start; overflow-x: visible; gap: $spacing-sm`. 트리거는 `width: auto; border: 1px solid $line-200; border-radius: $radius-full`. Active는 `background-color: $color-primary-hover; border-color: transparent; font-weight: bold`.

## 개발자 핸드오프

| 항목 | 종류 | 설명 |
|---|---|---|
| `items` prop | 퍼블리셔 | 탭 목록 배열. badge는 포맷 포함 문자열로 전달 |
| `modelValue` / `update:modelValue` | 퍼블리셔 | 선택된 탭 value v-model |
| `grow` prop | 퍼블리셔 | true이면 탭 버튼 균등 분배 + 스크롤 비활성화 (underline-dark 전용) |
| `variant="pill-vertical"` | 퍼블리셔 | 세로 정렬 탭. orientation="vertical" 자동 주입으로 위/아래 방향키로 탭 이동 |
