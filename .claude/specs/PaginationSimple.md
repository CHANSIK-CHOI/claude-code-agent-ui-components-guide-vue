---
name: PaginationSimple
description: 단순형 페이지네이션 컴포넌트 — 현재 페이지/전체 페이지 텍스트 표시 + 이전/다음 버튼 (molecules)
type: molecules
---

## 컴포넌트 개요

목록 페이지에서 전체 데이터를 페이지 단위로 탐색하는 단순형 네비게이션 컴포넌트.
페이지 번호를 나열하는 대신 "현재 페이지 / 전체 페이지" 텍스트로 표시하며, 이전/다음 버튼만 제공.
페이지 수가 매우 많거나 공간이 좁을 때 사용한다.

---

## 1. Atomic 계층

- **계층**: molecules
- **파일 경로**: `components/molecules/PaginationSimple.vue`
- **barrel export**: `components/molecules/index.ts`

---

## 2. 영역 구성

| 영역 | 설명 | 필수 여부 |
|------|------|---------|
| 이전 버튼 | `<` 아이콘 버튼, `1px solid` 테두리 있음, 첫 페이지에서 비활성 | 필수 |
| 페이지 텍스트 | `[현재 Bold] / [전체 Regular]` 형식 (예: **2**/1234) | 필수 |
| 다음 버튼 | `>` 아이콘 버튼, `1px solid` 테두리 있음, 마지막 페이지에서 비활성 | 필수 |

---

## 3. Props 정의

| Props | 타입 | 기본값 | 설명 |
|-------|------|--------|------|
| `page` (v-model) | `number` | `1` | 현재 페이지 번호 |
| `totalPages` | `number` | `1` | 전체 페이지 수 (텍스트로 표시) |
| `disabled` | `boolean` | `false` | 전체 비활성화 |

---

## 4. 이벤트

| 이벤트 | 발생 시점 | 전달 정보 |
|--------|---------|---------|
| `update:page` | 이전/다음 버튼 클릭 시 | 변경된 페이지 번호 `number` |

---

## 5. 상태(State)

| 상태 | 시각적 변화 | 기능 |
|------|-----------|------|
| default | 텍스트 `$text-600`, 버튼 `1px solid` 테두리 + 아이콘 | — |
| 이전 — 첫 페이지 | 이전 버튼 opacity 낮춤, cursor:not-allowed | 클릭 차단 |
| 다음 — 마지막 페이지 | 다음 버튼 opacity 낮춤, cursor:not-allowed | 클릭 차단 |
| disabled (전체) | 전체 opacity 낮춤 | 모든 버튼 클릭 차단 |

---

## 6. 디자인 토큰 매핑 (Figma 타입 1 — node-id: 40004322:5930)

| 영역 | Figma 값 | 토큰 |
|------|---------|------|
| 텍스트 색상 | `#535E66` | `$text-600` |
| 현재 페이지 폰트 | Bold 14px | `$font-size-body2`, `$font-weight-bold` |
| 전체 페이지 폰트 | Regular 14px | `$font-size-body2`, `$font-weight-regular` |
| 버튼 영역 크기 | `30×30px` | `3.0rem × 3.0rem` |
| 텍스트 영역 너비 | `56px` | `5.6rem` |
| 버튼 테두리 색상 | `#DDDDDD` (Gray_Line2) | `$line-200` (없으면 `$border-default` 근사) |
| 버튼 아이콘 색상 | `#808080` (Gray_5) | `$text-500` (#777777 — 가장 근사한 토큰 적용) |
| 버튼 간 gap | `6px` | `0.6rem` |

---

## 7. 마크업 구조

```
div.paginationSimple
├── button.paginationSimple__prev (type="button", aria-label="이전 페이지")
│   └── 아이콘 <
├── span.paginationSimple__text
│   ├── strong.paginationSimple__current (현재 페이지)
│   ├── span.paginationSimple__divider ( / )
│   └── span.paginationSimple__total (전체 페이지)
└── button.paginationSimple__next (type="button", aria-label="다음 페이지")
    └── 아이콘 >
```

> 단순형은 Radix Vue를 사용하지 않고 자체 마크업으로 구현. (Radix Vue Pagination의 번호 렌더링 기능이 불필요하므로 Alpha 의존 없이 순수 마크업으로 처리)

---

## 8. 접근성

- 이전 버튼: `type="button"`, `aria-label="이전 페이지"`, 첫 페이지에서 `disabled`
- 다음 버튼: `type="button"`, `aria-label="다음 페이지"`, 마지막 페이지에서 `disabled`
- 페이지 텍스트: `aria-live="polite"` 또는 페이지 변경 시 스크린리더 알림 고려
- `disabled` 전체 상태: 버튼 `disabled` 속성 적용
- 키보드: Tab/Enter/Space 네이티브 button 기본 제공

---

## 9. 금지 사항

- raw hex 컬러 직접 사용 금지
- `inline-flex`, `inline-block` 사용 금지
- Radix Vue 의존 금지 (단순형은 자체 마크업)
