# Tooltip — 구현 메모

- **파일 경로**: components/atoms/Tooltip.vue
- **계층**: atoms
- **구현 완료일**: 2026-05-19
- **비표준 구현**:
  - Radix Vue TooltipRoot 래핑 (TooltipProvider 컴포넌트 내부 포함)
  - **alwaysOpen 분기 구조**:
    - `alwaysOpen=false` ([분기 A]): Radix Vue 방식 그대로 — TooltipTrigger + TooltipContent(portal=false) 또는 TooltipPortal(portal=true)
    - `alwaysOpen=true` ([분기 B]): 자체 absolute 마크업 — `tooltip__alwaysOpen`(position:relative; display:inline-flex) 안에 `tooltip__bubble`(position:absolute) 배치. Radix Vue 포지셔닝/floating-ui autoUpdate 완전 우회. 스크롤 시 트리거와 함께 자연 이동.
  - **[분기 B] 포지셔닝**: bubbleStyle computed로 인라인 style 적용
    - side="top" → bottom: calc(100% + {offsetY}px)
    - side="bottom" → top: calc(100% + {offsetY}px)
    - arrowAlign="left" → left: calc(-2rem + {offsetX}px)
    - arrowAlign="right" → right: calc(-2rem - {offsetX}px)
  - **[분기 B] 접근성 수동 처리**: tooltipId(Math.random 기반 고유값) → bubble div에 :id + role="tooltip", 트리거 wrapper `<div>`에 :aria-describedby 수동 연결 (TooltipTrigger 미사용 — Radix가 aria-describedby 자동 주입해 broken reference 유발하므로 완전 제거)
  - **[분기 B] side modifier class**: `tooltip__bubble--side-top` / `--side-bottom`으로 꼬리 방향 전환 (속성 선택자 대신 class 기반)
  - **[분기 B] SCSS**: 일반 scoped 선택자 (Vue scoped 해시 정상 전달 — :deep() 불필요)
  - **[분기 A] portal prop(기본 false)**: `TooltipPortal :disabled="!portal"` 단일 구조로 통합 — portal=false 시 disabled=true(인라인 렌더링), portal=true 시 body에 텔레포트. `TooltipPortal`은 `TeleportProps`를 상속하므로 `disabled` prop 지원 확인됨 (radix-vue 1.9.17 타입 정의 실제 확인).
  - portal=false: :deep() + :global() 이중 선언 + $z-tooltip(500) CSS 유지
  - portal=true: :global()로 portal 환경 스타일 커버
  - container prop(`string | HTMLElement`, 기본 undefined) — portal=true 시 TooltipPortal :to 전달
  - alwaysOpen=true 시 handleOpenChange에서 닫힘 차단. isOpen 초기값은 `ref(props.alwaysOpen)` (watch 제거 — 런타임 false→true 전환 시나리오 없음)
  - attrs 2단계 분리: TOOLTIP_ROOT_PROPS = ['defaultOpen', 'disableHoverableContent'] → Root, 나머지 → Trigger
  - arrow fill 색상: CSS 변수 → JS 불가 → computed arrowFill로 hex 직접 바인딩 (#333333 / #00addb). 분기 A/B 동일 computed 재사용
  - dark 배경: $text-800, primary 배경: $color-primary-hover
  - 모서리: $radius-full (pill 형태)
  - 패딩 0.6rem 1.2rem 직접 사용 (Figma 6px 12px — 토큰 근사 불가)
  - arrowAlign: 'left'|'right' → computed radixAlign('start'|'end')으로 Radix에 전달 ([분기 A]만 사용)
  - offsetX → alignOffset, offsetY → sideOffset prop으로 전달 ([분기 A]) / bubbleStyle calc 반영 ([분기 B])
  - **제거 항목**: MutationObserver, WrapperFix, contentWrapRef, startTransformFix, stopTransformFix 완전 제거
- **개발자 핸드오프**: 없음 (순수 UI 컴포넌트)

## 변경 이력

- 2026-05-11 신규 작성 (component-create 흐름)
- 2026-05-11 arrowAlign left/right 방향 구현 추가, arrowAlign 기본값 right
- 2026-05-13 TooltipPortal 제거 + :deep() 전면 제거 → 일반 scoped CSS 전환 (spec §3 반영)
- 2026-05-13 portal/container prop 추가 — portal=true 시 TooltipPortal 조건부 활성화
- 2026-05-13 :deep()/:global() 이중 선언 복원 (portal=false와 portal=true 양쪽 커버)
- 2026-05-19 alwaysOpen=true + portal=false 조합 시 MutationObserver transform 고정(WrapperFix) 추가 (구 구현)
- 2026-05-19 [분기 B] alwaysOpen=true를 자체 absolute 마크업으로 전면 교체. MutationObserver/WrapperFix 완전 제거. tooltip__alwaysOpen + tooltip__bubble 자체 구현. tooltipId + bubbleStyle computed 추가.
- 2026-05-19 BLOCKER 수정: [분기 B]에서 TooltipProvider/TooltipRoot/TooltipTrigger 완전 제거. template 구조를 `v-if="alwaysOpen"` / `<TooltipProvider v-else>` 로 분리. 트리거 wrapper를 `<div v-bind="triggerAttrs" :aria-describedby="tooltipId">`로 교체 — Radix aria-describedby 자동 주입에 의한 broken reference 해소.
- 2026-05-19 시니어 리뷰 WARN 3건 수정: (1) watch+immediate → ref(props.alwaysOpen) 초기값 단순화 + watch 제거 (2) portal 분기 v-if/v-else → TooltipPortal :disabled="!portal" 단일 구조로 통합 — 중복 마크업 제거 (3) tooltip__alwaysOpen display: inline-flex → flex 교체 (rules/style.md 준수)
- 2026-05-20 spec §4 반영: bgColor/textColor prop 추가. arrowFill = `bgColor ?? (primary ? '#00addb' : '#333333')`. customStyle computed 추가. 분기 A(TooltipContent): `:style="customStyle"`, 분기 B(tooltip__bubble): `:style="{ ...bubbleStyle, ...customStyle }"`. SCSS 변경 없음.
