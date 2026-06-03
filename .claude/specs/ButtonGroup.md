---
name: ButtonGroup
description: Button(또는 ButtonLink)을 여러 개 받아 수평 정렬하는 레이아웃 전용 molecules 컴포넌트
type: spec
---

## 0. Atomic 계층 & 파일 배치

- **계층**: molecules
- **경로**: `components/molecules/ButtonGroup.vue`
- **Base/Wrapper 분리**: 해당 없음 — 단일 컴포넌트로 충분함

---

## 1. 컴포넌트 개요

Button(또는 ButtonLink)을 여러 개 받아 수평 정렬하는 레이아웃 전용 컴포넌트.
균등 분할(50/50)이 기본이며, `narrowFirst` prop으로 첫 번째 버튼을 좁게 배치하는 비대칭 레이아웃으로 전환.
팝업 하단 버튼 영역, 폼 제출 영역 등 버튼 묶음이 필요한 모든 곳에서 사용.

---

## 2. 영역 구성 (Area Map)

- ① **컨테이너(wrapper)** — `display: flex; gap` 을 담당하는 루트 요소 / 필수
- ② **첫 번째 버튼 슬롯 영역** — default slot 의 첫 번째 자식 / `narrowFirst` 시 좁아짐
- ③ **두 번째 이후 버튼 슬롯 영역** — 나머지 자식

**슬롯 방식**: default slot 단일 방식. 내부에서 CSS `:first-child` / `:nth-child` 선택자로 비율을 제어.

---

## 3. Props

| prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `narrowFirst` | `boolean` | `false` | true 시 첫 번째 자식이 좁아짐 (flex: 120, max-width: 12rem), 두 번째 자식이 넓어짐 (flex: 200) |

**제외 결정**:
- `gap` prop — `$spacing-sm` 하드코딩 (Popup과 동일 값으로 고정)
- `firstWidth` prop — Popup 기준값 고정 사용

---

## 4. Slot

| 이름 | 필수 | 설명 |
|------|------|------|
| `default` | 권장 | Button 또는 ButtonLink 요소들을 그대로 전달 |

---

## 5. 스타일 동작

- 컨테이너: `display: flex; gap: $spacing-sm`
- **기본 (균등)**: 모든 자식 `flex: 1`
- **`narrowFirst` 활성 시** (Popup narrowCancel 동일 값):
  - `:first-child` → `flex: 120; max-width: 12rem`
  - `:nth-child(2)` → `flex: 200`
  - `:nth-child(n+3)` → `flex: 1` (3개 이상 안전 처리)

- **래퍼 컴포넌트 지원** — `narrowFirst` 활성 시 2번째 슬롯에 Button/ButtonLink 대신 Tooltip 등 래퍼 컴포넌트가 올 경우:
  - `:nth-child(2):not(button, a)` 요소(래퍼 div)의 직접 자식에도 `flex: 1; min-width: 0` 적용
  - Button/ButtonLink 가 직접 2번째 자식이면 `:not(button, a)` 에 해당하지 않아 버튼 내부 span 에 영향 없음
  - 적용 대상 예: `<Tooltip :always-open="true">` 가 2번째 슬롯일 때, `div.tooltip__alwaysOpen`(display:flex) 내부 trigger wrapper div 가 `flex: 0 1 auto`(기본값)으로 수축하는 문제 방지

### 참조 (Popup.vue 원본 구현)

```typescript
// Popup.vue
const cancelStyle = computed(() => (props.narrowCancel ? { flex: 120, maxWidth: '12rem' } : undefined))
const okStyle = computed(() => (props.narrowCancel ? { flex: 200 } : undefined))
```

ButtonGroup은 이를 CSS 선택자로 처리 — JS computed 불필요.

---

## 6. 상태(State)

ButtonGroup 자체는 상태를 갖지 않는 레이아웃 전용 컴포넌트.
개별 Button의 `disabled`, `loading` 상태는 ButtonGroup이 관여하지 않음.

---

## 7. 이벤트

없음. 클릭 이벤트는 슬롯으로 전달된 Button이 직접 처리.

---

## 8. 접근성 요구사항

| 항목 | 요구사항 |
|------|---------|
| 시맨틱 마크업 | 컨테이너는 `<div>` — 버튼 그룹 자체에 `role` 추가 불필요 |
| 레이아웃 순서 | DOM 순서와 시각 순서 일치 (CSS로 시각 순서 역전 금지) |
| 키보드 탐색 | ButtonGroup 컨테이너 자체는 포커스 불가 (`tabindex` 없음) |

---

## 9. 디자인 토큰 매핑

| 속성 | 토큰 |
|------|------|
| 버튼 간 gap | `$spacing-sm` |
| narrowFirst 첫 번째 최대 너비 | `12rem` (Popup 하드코딩 값과 동일 — 토큰 없음, 수치 직접 사용 허용) |

---

## 10. 사용 예시

```vue
<!-- 기본: 균등 배치 -->
<ButtonGroup>
  <Button shape="solid" color="gray" size="lg" @click="handleClose">닫기</Button>
  <Button shape="solid" color="primary" size="lg" @click="handleConfirm">확인</Button>
</ButtonGroup>

<!-- narrowFirst: 취소 좁게 + 확인 넓게 -->
<ButtonGroup :narrow-first="true">
  <Button shape="solid" color="gray" size="lg" @click="handleCancel">취소</Button>
  <Button shape="solid" color="primary" size="lg" @click="handleOk">확인</Button>
</ButtonGroup>

<!-- narrowFirst + Tooltip 래퍼: 2번째 슬롯이 래퍼 컴포넌트일 때도 넓이 정상 적용 -->
<ButtonGroup :narrow-first="true">
  <Button size="lg" color="secondary" @click="handleGift">선물하기</Button>
  <Tooltip text="구독 시 최대 N% 할인" color="dark" side="top" :always-open="true">
    <template #trigger>
      <Button size="lg" color="primary" @click="handleBuy">구매하기</Button>
    </template>
  </Tooltip>
</ButtonGroup>

<!-- 버튼 3개: 첫 번째만 좁고 나머지 균등 -->
<ButtonGroup :narrow-first="true">
  <Button @click="handleA">A</Button>
  <Button @click="handleB">B</Button>
  <Button @click="handleC">C</Button>
</ButtonGroup>
```
