# ToastPopup 컴포넌트 명세

## 0. Atomic 계층 & 파일 배치

- **계층**: organisms (복합 인터랙션 + 전역 상태 관리 포함)
- **배치 경로**: `components/popup/` (기존 Popup 계열 관례 동일)

```
components/popup/
├── ToastPopup.vue      ← 개별 토스트 아이템 (ToastRoot 래핑, 내부 컴포넌트)
├── ToastRenderer.vue   ← 전역 렌더러 (PopupRenderer.vue 패턴 — app.vue에 1회 배치)
├── useToastPopup.ts    ← 프로그래매틱 composable
└── index.ts            ← barrel export 추가
```

---

## 1. 컴포넌트 개요

사용자에게 짧은 피드백 메시지를 화면 하단 중앙에 pill 형태로 표시하는 비모달 알림 컴포넌트.

- Radix Vue **Toast (Stable)** 기반
- `ToastViewport`가 `position: fixed`로 뷰포트 하단 중앙에 고정 (Teleport 미사용)
- `ToastRenderer`는 `app.vue`에 1회 배치 — `<div id="popup-container" />` 옆 나란히
- 레이아웃 60rem 기준, `position: fixed` + `left: 50%` + `translateX(-50%)` 뷰포트 중앙 정렬
- 주 사용 API: 프로그래매틱 (`useToastPopup()`) — `useAlert`, `useConfirm` 패턴 동일

---

## 2. 디자인 스펙 (Figma 확인값)

| 항목 | 값 | 디자인 토큰 |
|------|-----|------------|
| 배경 | `rgba(#111111, 0.8)` | `rgba($text-900, 0.8)` |
| 형태 | pill (border-radius: 99px) | `9.9rem` |
| 너비 | 328px → 반응형 | `calc(100% - 3.2rem)`, `max-width: 36rem` |
| 안쪽 여백 | 14px | `1.4rem` |
| 드롭섀도 | `0 2px 4px rgba(0,0,0,0.3)` | 하드코딩 허용 |
| 텍스트 색 | white | `$text-white` |
| 폰트 (텍스트만) | 14px Medium | `$font-size-body3`, `$font-weight-medium` |
| 폰트 (아이콘 포함) | 13px Medium | `1.3rem`, `$font-weight-medium` |
| 아이콘 크기 | 30×30px | `3rem` |
| 닫기 버튼 | 24×24px | `2.4rem` |
| 항목 간 간격 | 10px | `1rem` |
| 하단 여백 | 화면 하단으로부터 | `$spacing-lg` (약 2rem) |

---

## 3. 영역 구성

**[ToastPopup.vue — 개별 토스트 아이템]**

- ① **아이콘 영역** — `showIcon: true`일 때 렌더링. `#icon` 슬롯 우선, 없으면 기본 아이콘 / 선택
- ② **텍스트 영역** — `message` prop 텍스트 / 필수
- ③ **닫기 버튼** — `showClose: true`일 때 렌더링. 아이콘 버튼 / 조건부

**[ToastRenderer.vue — 전역 렌더러]**

- ① ToastProvider (컨텍스트 공급자)
- ② ToastPopup × N (instances 루프)
- ③ ToastViewport (`position: fixed`, 뷰포트 하단 중앙 고정 — Teleport 미사용)

---

## 4. Props

### ToastPopup.vue (내부 컴포넌트 — 직접 template에서 사용 가능하나 주 API는 composable)

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `message` | `string` | — (필수) | 표시할 텍스트 |
| `showClose` | `boolean` | `false` | 닫기(×) 버튼 표시 |
| `showIcon` | `boolean` | `false` | 아이콘 영역 표시 |
| `type` | `'foreground' \| 'background'` | `'foreground'` | 보조기기 알림 방식 (Radix ToastRoot) |
| `forceMount` | `boolean` | `undefined` | 닫힌 상태에서도 DOM 유지 (Radix ToastRoot) |

**Attrs 위임**: `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` → `ToastRoot`  
(Toast는 Trigger 없음 → Select 같은 2단계 분리 불필요. `type`, `forceMount`만 명시적 prop으로 분리)

### ToastRenderer.vue

Props 없음. `position`(bottom-center 고정) 내부 하드코딩. Teleport 미사용 — `ToastViewport`가 `position: fixed`로 직접 고정.

---

## 5. Slots

| 슬롯명 | 설명 |
|--------|------|
| `#icon` | 커스텀 아이콘. `showIcon: true`이고 슬롯 없으면 기본 아이콘 렌더링 |

---

## 6. Events

### ToastPopup.vue

| 이벤트 | 페이로드 | 발생 시점 |
|--------|---------|---------|
| `update:open` | `boolean` | 열림/닫힘 상태 변경 |
| `closed` | — | 사라짐 애니메이션 완료 후 |

---

## 7. useToastPopup composable

```ts
const toast = useToastPopup()

// 기본 사용
toast.show({ message: '저장되었습니다.' })

// 아이콘 + 닫기 버튼
toast.show({
  message: '정기구독 시 추가 5% 할인 + 매달 자동 배송으로 더 저렴하게 이용하세요',
  showIcon: true,
  showClose: true,
  duration: 0,
})
```

**내부 상태**: 모듈 레벨 `ref<ToastItem[]>` 배열로 토스트 인스턴스 관리.  
`show()` 호출 시 고유 id 생성 → 배열 추가. 닫힘 시 해당 id 제거.  
반환: `{ instances, show, remove, close }`

---

## 8. 애니메이션

| 상태 | 동작 |
|------|------|
| `data-state="open"` | 아래→위 슬라이드 + 페이드 인 (`$duration-base`) |
| `data-state="closed"` | 위→아래 슬라이드 + 페이드 아웃 (`$duration-base`) |
| hover / focus | 타이머 정지 없음 — 항상 설정된 duration 후 자동 닫힘 |
| 스와이프 | 오른쪽 스와이프 닫기 (Radix 기본 동작) |

---

## 9. 접근성

| 항목 | 요구사항 |
|------|---------|
| live region | `ToastRoot` → `role="status"` (Radix 자동 처리) |
| Viewport 레이블 | `ToastViewport` label="알림" |
| 닫기 버튼 | `aria-label="닫기"` 필수 |
| 포커스 표시 | `focus-visible` 시 외곽선 |

---

## 10. app.vue 변경

```vue
<!-- app.vue에 추가 -->
<ToastRenderer />
```

`<PopupRenderer />`, `<div id="popup-container" />` 옆에 나란히 배치.
