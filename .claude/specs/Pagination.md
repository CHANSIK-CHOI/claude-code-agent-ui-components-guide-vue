---
name: Pagination
description: 번호형 페이지네이션 컴포넌트 — Radix Vue PaginationRoot 래핑, 페이지 번호 목록 + 이전/다음 버튼 (molecules)
type: molecules
---

## 컴포넌트 개요

목록 페이지에서 전체 데이터를 페이지 단위로 탐색하는 번호형 네비게이션 컴포넌트.
페이지 번호 버튼 목록과 이전/다음 버튼으로 구성된다.
Radix Vue PaginationRoot를 래핑한다 (사용자 명시 요청 — Alpha 상태 허용).

> ⚠️ Radix Vue Pagination은 Alpha 상태 (rules/libraries.md §2). 사용자 명시 요청으로 Alpha override 적용.

---

## 1. Atomic 계층

- **계층**: molecules
- **파일 경로**: `components/molecules/Pagination.vue`
- **barrel export**: `components/molecules/index.ts`

---

## 2. 영역 구성

| 영역 | 설명 | 필수 여부 |
|------|------|---------|
| 이전 버튼 | 현재 페이지 -1 이동, `<` 아이콘 버튼 | 필수 |
| 페이지 번호 목록 | 활성/비활성 번호 버튼 목록 (siblingCount 기반) | 필수 |
| 말줄임(…) | 생략 구간 표시 (PaginationEllipsis) | 조건부 |
| 다음 버튼 | 현재 페이지 +1 이동, `>` 아이콘 버튼 | 필수 |

---

## 3. Props 정의

| Props | 타입 | 기본값 | 설명 |
|-------|------|--------|------|
| `page` (v-model) | `number` | `1` | 현재 페이지 번호 |
| `total` | `number` | `0` | 전체 항목 수 (페이지 계산에 사용) |
| `itemsPerPage` | `number` | `10` | 페이지당 항목 수 |
| `siblingCount` | `number` | `2` | 현재 페이지 양옆에 표시할 번호 수 |
| `disabled` | `boolean` | `false` | 전체 비활성화 |

---

## 4. 이벤트

| 이벤트 | 발생 시점 | 전달 정보 |
|--------|---------|---------|
| `update:page` | 페이지 버튼 또는 이전/다음 버튼 클릭 시 | 변경된 페이지 번호 `number` |

---

## 5. 상태(State)

| 상태 | 시각적 변화 | 기능 |
|------|-----------|------|
| default (비활성 번호) | 텍스트 `$text-900`, 배경 투명 | 클릭 가능 |
| active (현재 페이지) | 배경 `$bg-accent-light-blue`, 텍스트 `$color-primary-hover`, bold | 클릭 불가 |
| hover (비활성 번호) | 배경 살짝 어두워짐 | — |
| disabled (전체) | opacity 낮춤 | 모든 버튼 클릭 차단 |
| 이전 첫 페이지 | 이전 버튼 disabled | 클릭 차단 |
| 다음 마지막 페이지 | 다음 버튼 disabled | 클릭 차단 |

---

## 6. 디자인 토큰 매핑 (Figma 타입 2 — node-id: 40004021:2876)

| 영역 | Figma 값 | 토큰 |
|------|---------|------|
| 활성 번호 배경 | `#E9F9FF` | `$bg-accent-light-blue` |
| 활성 번호 텍스트 | `#00ADDB` | `$color-primary-hover` |
| 활성 border-radius | `8px` | `$radius-md` |
| 비활성 번호 텍스트 | `#333333` | `$text-900` |
| 버튼 크기 | `30×30px` | `3.0rem × 3.0rem` |
| 활성 폰트 | Bold 16px | `$font-size-body1`, `$font-weight-bold` |
| 비활성 폰트 | Regular 16px | `$font-size-body1`, `$font-weight-regular` |

---

## 7. Radix Vue 래핑 구조

```
PaginationRoot (v-model:page)
├── PaginationPrev (이전 버튼)
├── PaginationList
│   └── template #default="{ items }"
│       └── v-for item in items
│           ├── PaginationListItem (type === 'page') → 번호 버튼
│           └── PaginationEllipsis (type === 'ellipsis') → 말줄임
└── PaginationNext (다음 버튼)
```

### attrs 위임 전략 (3단계)

| 단계 | 대상 | 위임 위치 |
|------|------|---------|
| 1단계 Root props | `total`, `itemsPerPage`, `siblingCount`, `disabled`, `defaultPage`, `showEdges` | `PaginationRoot` |
| 2단계 인터랙티브 attrs | `aria-*`, `tabindex`, `data-*` | `PaginationRoot` (전체 컴포넌트) |
| 3단계 콘텐츠 | `siblingCount` | `PaginationRoot` prop |

---

## 8. 접근성

- `PaginationRoot` → `<nav aria-label="페이지 네비게이션">` 렌더링
- 이전 버튼: `aria-label="이전 페이지"`
- 다음 버튼: `aria-label="다음 페이지"`
- 현재 페이지 버튼: `aria-current="page"` (Radix `data-selected` 연동)
- 이전/다음 버튼 경계 도달 시: `disabled` 속성 적용
- 키보드: Tab/Enter/Space (Radix 기본 제공)
- 포커스 outline 시각적 표시 필수

---

## 9. 금지 사항

- `showEdges`, First/Last 전용 버튼 노출 금지 (디자인 없음)
- raw hex 컬러 직접 사용 금지 (토큰만)
- `inline-flex`, `inline-block` 사용 금지 (text shape 예외 없음)
