# ButtonLink 컴포넌트 명세

## 1. 개요

| 항목 | 내용 |
|------|------|
| 계층 | atoms |
| 위치 | `components/atoms/ButtonLink.vue` |
| 카테고리 barrel | `components/atoms/index.ts` |
| 목적 | 링크(`<a>` / `<NuxtLink>`) 기반의 버튼 스타일 컴포넌트 |

### Button vs ButtonLink 사용 기준

| 사용 상황 | 컴포넌트 |
|---------|--------|
| 폼 제출 (`type="submit"`) | Button |
| 자바스크립트 액션 (모달 열기, 삭제, 이벤트 발행) | Button |
| Nuxt 내부 페이지 이동 (`/products`, `/cart`) | ButtonLink (`to`) |
| 외부 URL 이동 (`https://...`) | ButtonLink (`href`) |

---

## 2. 공유 레이어

Button과 ButtonLink는 다음 세 가지를 공유한다. 디자인 변경 시 한 곳만 수정하면 양쪽에 반영된다.

| 레이어 | 파일 | 내용 |
|--------|------|------|
| 타입 | `components/types.ts` | `ButtonShape`, `ButtonColor`, `ButtonSize` |
| SCSS mixin | `assets/scss/components/_button-base.scss` | 공통 시각 스타일 (`button-base` mixin) |
| 클래스 로직 | `components/atoms/useButtonVariant.ts` | `:class` 배열 계산 (`useButtonVariant`) |

---

## 3. 영역 구성

```
┌──────────────────────────────────────────────┐
│  [leading-icon?]  [label]  [trailing-icon?]  │
└──────────────────────────────────────────────┘
```

**루트 태그 결정 로직**

| 조건 | 렌더링 태그 |
|------|-----------|
| `to` prop 있음 + disabled 아님 | `<NuxtLink :to="to">` |
| `href` prop 있음 + disabled 아님 | `<a :href="href">` |
| disabled 이거나 둘 다 없음 | `<a>` (aria-disabled 처리) |

`to`와 `href` 동시 지정 시 `to` 우선.

---

## 4. Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `shape` | `ButtonShape` | `'solid'` | 버튼 외형 — `solid` \| `line` \| `text` |
| `color` | `ButtonColor` | `'primary'` | 버튼 색상 — `primary` \| `secondary` \| `black` |
| `size` | `ButtonSize` | `'md'` | 버튼 크기 — `sm` \| `md` \| `lg` |
| `round` | `boolean` | `false` | pill 형태 (shape=text 제외) |
| `disabled` | `boolean` | `false` | 비활성 상태 |
| `to` | `string \| object \| undefined` | `undefined` | 내부 라우트 → NuxtLink 렌더링 |
| `href` | `string \| undefined` | `undefined` | 외부 URL → `<a>` 렌더링 |
| `target` | `'_self' \| '_blank' \| '_parent' \| '_top'` | `'_self'` | 링크 열기 방식 |
| `rel` | `string \| undefined` | `undefined` | rel 속성 (target=\_blank 시 자동 보완) |

---

## 5. Slots

| 이름 | 필수 여부 | 설명 |
|------|---------|------|
| `default` | 필수 | 라벨 텍스트 |
| `leading-icon` | 선택 | 라벨 앞 아이콘 |
| `trailing-icon` | 선택 | 라벨 뒤 아이콘 |

---

## 6. 자동 보안 처리 (target="_blank")

`target="_blank"` 지정 시 `rel`에 `noopener noreferrer`가 없으면 자동 추가.

```
<ButtonLink href="https://example.com" target="_blank">외부 링크</ButtonLink>
→ <a href="https://example.com" target="_blank" rel="noopener noreferrer">
```

---

## 7. 접근성 요구사항

### 시맨틱
- `<a>` / `<NuxtLink>` 태그 → 보조기기에 링크로 자동 인식, `role` 불필요
- 아이콘 전용 버튼 링크는 `aria-label` 전달 필수 (`v-bind="$attrs"`로 관통)

### disabled 상태
`<a>`에는 네이티브 `disabled` 속성이 없음 → `rules/a11y.md` "클릭 차단 처리 — 네이티브 `disabled` 속성이 없는 요소" 정책에 따라 다음 조합으로 처리 (이중 차단으로 안정성 확보):

| 처리 | 방법 |
|------|------|
| 보조기기 비활성 알림 | `aria-disabled="true"` |
| 키보드 탐색 제외 | `tabindex="-1"` |
| 마우스 클릭 차단 | `pointer-events: none` (mixin 내 CSS, 예외 허용) |
| 핸들러 차단 (안정성) | click 핸들러에서 disabled 시 early return |
| 시각적 표현 | shape별 disabled 스타일 (mixin 내 CSS) |

### target="_blank"
새 탭 링크는 `aria-label`에 "(새 탭에서 열림)" 포함 권고 (사용자가 직접 지정).

---

## 8. 가이드 페이지

위치: `pages/guide/button-link/index.vue` + `button-link.scss`

| 섹션 | 내용 |
|------|------|
| ① Shape × Color | 9가지 기본 variant |
| ② Size | sm / md / lg 비교 |
| ③ Round | shape별 round 적용 |
| ④ Disabled | shape별 비활성 상태 |
| ⑤ Icon Slots | leading-icon, trailing-icon 조합 |
| ⑥ NuxtLink vs href | to prop vs href prop 사용 예시 |
| ⑦ target="_blank" | 외부 링크 + 자동 보안 처리 확인 |
| ⑧ API 문서 | Props / Slots 테이블 |
