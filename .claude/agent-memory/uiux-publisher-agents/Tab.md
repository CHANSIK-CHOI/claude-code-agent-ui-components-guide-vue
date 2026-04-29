---
name: Tab
description: organisms 계층 탭 네비게이션 컴포넌트 구현 메모 — Radix Vue TabsRoot/TabsList/TabsTrigger 래핑, Navigation only
type: project
---

# Tab — 구현 메모

- **파일 경로**: `components/organisms/Tab.vue`
- **계층**: organisms
- **구현 완료일**: 2026-04-29 (재구현)

## 비표준 구현

- **TabsContent 미사용**: Navigation only 설계. 콘텐츠 전환은 부모가 `v-if`로 처리.
- **attrs 단순 위임**: Select와 달리 3단계 분리 없이 `v-bind="$attrs"`를 `TabsRoot`에 그대로 전달. TabsRoot가 받는 props(`modelValue`, `defaultValue`, `dir`, `activationMode`)와 일반 HTML attrs 모두 TabsRoot 수준에서 처리.
- **modelValue 기본값**: `withDefaults`의 `undefined`로 두고, `computed`로 `items[0].value` fallback 처리.
- **pill active 배경**: `$color-primary-hover` (#00addb) 사용 — `$color-primary` (#0cb5e2) 아님. 명세에서 명시된 토큰.
- **viewToggle v-if/v-else**: 두 버튼을 동시에 렌더링하지 않고 `v-if="viewType === 'grid'"` / `v-else`로 다음 상태 버튼 하나만 렌더링.
- **showViewToggle 동작 범위**: 모든 variant에서 동작. `v-if="showViewToggle"`로 조건 단순화 (이전: `v-if="showViewToggle && variant === 'pill'"`에서 variant 조건 제거됨).
- **overflowIndicator 제거**: 초기 구현에 있던 overflow indicator(그라디언트 + 아이콘) 블록 삭제. has-view-toggle modifier class도 제거.

## 개발자 핸드오프

| 항목 | 종류 | 설명 |
|---|---|---|
| `items` prop | 퍼블리셔 | 탭 목록 배열. badge는 포맷 포함 문자열로 전달 |
| `modelValue` / `update:modelValue` | 퍼블리셔 | 선택된 탭 value v-model |
| `viewType` / `update:viewType` | 퍼블리셔 | 격자/목록 뷰 타입 v-model (모든 variant 사용 가능) |
