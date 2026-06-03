# Popover — 구현 메모

- **파일 경로**: components/atoms/Popover.vue
- **계층**: atoms
- **구현 완료일**: 2026-05-13
- **비표준 구현**:
  - Radix Vue `PopoverRoot > PopoverTrigger + PopoverContent` 구조
  - **portal prop(기본 false)** — false이면 PopoverContent 직접(인라인) 렌더링, true이면 PopoverPortal로 감싸 body(또는 container prop 지정 대상)에 렌더링
  - portal=false: 기존 position:fixed !important + left:0 !important + width:100vw !important + MutationObserver 전부 유지
  - portal=true: PopoverPortal auto-import(radix-vue/nuxt), :container 전달. MutationObserver는 portal 여부 무관하게 동일 유지(QA 검증 대상)
  - container prop(`string | HTMLElement`, 기본 undefined) — portal=true 시 PopoverPortal :container 전달
  - z-index: $z-dropdown(100) — portal 분기 무관하게 동일 (이미 popup보다 낮음)
  - `.popover__panel`: `position: fixed !important; left: 0 !important; width: 100vw !important` — PopoverRoot가 renderless라 containing block 생성 불가, viewport 기준 배치
  - `PopoverContent`에 `:force-mount="true"` 적용 → 닫힘 애니메이션 보장
  - **forceMount flash 방지 패턴**: `__inner`에 `opacity: 0` 기본값. `data-has-been-opened` 속성이 없을 때 즉시 숨김(애니메이션 없음), 있을 때 닫힘 애니메이션 적용
  - MutationObserver(`startWrapperFix/stopWrapperFix`) — Radix가 주입하는 x축 transform을 0으로 override
  - `data-state=open` / `data-state=closed` 속성 선택자 + CSS keyframe 애니메이션 (popoverSlideUpAndFade / popoverSlideDownAndFade)
  - `data-state=closed` 상태에서 `pointer-events: none`
  - z-index: `$z-dropdown (100)` — Popup($z-modal: 300)보다 낮음
  - 모듈 스코프 카운터 `_popoverCount`로 패널 ID 생성 (Vue 3.4 useId 미지원 대응)
  - attrs 2단계 분리: `POPOVER_ROOT_PROPS = ['modal']` → Root 분리 필터, `INTERNAL_A11Y_ATTRS = ['aria-controls', 'aria-expanded']` → triggerAttrs 필터에서 제외
  - 제어/비제어 모드: `open` prop 존재 시 외부 제어, 없으면 `internalOpen` ref 비제어
  - `handleClose()`: `internalOpen` 직접 세팅 + emit 양쪽 실행 — 제어/비제어 양 모드 닫힘 보장
  - Escape 닫기: SSR 안전 패턴 — `onMounted`(초기 상태) + `watch(proxyOpen)`(이후 변경) 분리
  - 토큰 대체: `$border-default` 미존재 → `$border-disabled`, `$text-secondary` 미존재 → `$text-600`
- **개발자 핸드오프**: 없음 (UI 전용)

## 변경 이력

- 2026-05-11 신규 작성 (PopoverPortal + MutationObserver 방식)
- 2026-05-11 MutationObserver 해제 딜레이 패턴 추가 (닫힘 애니메이션 중 x축 밀림 방지)
- 2026-05-13 PopoverPortal 제거 + MutationObserver 완전 제거: 인라인 렌더링으로 전환. :deep()·!important 제거. position: fixed로 viewport 기준 배치 (spec §6 반영)
- 2026-05-13 portal/container prop 추가 — portal=true 시 PopoverPortal 조건부 활성화. MutationObserver는 portal 여부 무관하게 유지.
