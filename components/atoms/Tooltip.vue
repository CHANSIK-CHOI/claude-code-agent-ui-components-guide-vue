<template>
  <!-- [분기 B] alwaysOpen=true — Radix Vue 완전 제거, 순수 자체 마크업 -->
  <!-- Radix TooltipRoot(:open="true")가 TooltipTrigger에 자동 주입하는 aria-describedby가 -->
  <!-- 존재하지 않는 TooltipContent id를 참조하는 broken reference 문제를 방지 -->
  <template v-if="alwaysOpen">
    <div class="tooltip__alwaysOpen">
      <div
        v-bind="triggerAttrs"
        :aria-describedby="tooltipId"
        class="tooltip__trigger"
      >
        <slot name="trigger" />
      </div>
      <div
        :id="tooltipId"
        class="tooltip__bubble"
        :class="[
          `tooltip__bubble--${color}`,
          `tooltip__bubble--arrow-${arrowAlign}`,
          `tooltip__bubble--side-${side}`,
        ]"
        :style="{ ...bubbleStyle, ...customStyle }"
        role="tooltip"
      >
        <span class="tooltip__bubble-text" :style="textColorStyle">
          <slot>{{ text }}</slot>
        </span>
        <span class="tooltip__bubble-arrow" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="10"
            viewBox="0 0 11 10"
            fill="none"
          >
            <path
              d="M3.73475 0.999999C4.50455 -0.333335 6.42905 -0.333333 7.19885 1L10.663 7C11.4328 8.33333 10.4705 10 8.9309 10L2.00269 10C0.463093 10 -0.499156 8.33333 0.270645 7L3.73475 0.999999Z"
              :fill="arrowFill"
            />
          </svg>
        </span>
      </div>
    </div>
  </template>

  <!-- [분기 A] alwaysOpen=false — Radix Vue 방식 -->
  <TooltipProvider v-else :delay-duration="0">
    <TooltipRoot
      v-bind="rootAttrs"
      :open="isOpen"
      :delay-duration="delayDuration"
      @update:open="handleOpenChange"
    >
      <TooltipTrigger v-bind="triggerAttrs" as-child>
        <slot name="trigger" />
      </TooltipTrigger>

      <!-- portal=false(기본): disabled=true로 인라인 렌더링 / portal=true: body(또는 지정 container)에 렌더링 -->
      <TooltipPortal :disabled="!portal" :to="container">
        <TooltipContent
          class="tooltip__content"
          :class="[
            `tooltip__content--${color}`,
            `tooltip__content--arrow-${arrowAlign}`,
          ]"
          :style="customStyle"
          :side="side"
          :side-offset="offsetY"
          :align="radixAlign"
          :align-offset="offsetX"
          :avoid-collisions="true"
          :collision-padding="8"
        >
          <span class="tooltip__text" :style="textColorStyle">
            <slot>{{ text }}</slot>
          </span>
          <span class="tooltip__arrow" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="10"
              viewBox="0 0 11 10"
              fill="none"
            >
              <path
                d="M3.73475 0.999999C4.50455 -0.333335 6.42905 -0.333333 7.19885 1L10.663 7C11.4328 8.33333 10.4705 10 8.9309 10L2.00269 10C0.463093 10 -0.499156 8.33333 0.270645 7L3.73475 0.999999Z"
                :fill="arrowFill"
              />
            </svg>
          </span>
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

type TooltipColor = "dark" | "primary";
type TooltipSide = "top" | "bottom";

type TooltipArrowAlign = "left" | "right" | "center";

const props = withDefaults(
  defineProps<{
    color?: TooltipColor;
    /** 말풍선 배경 커스텀 색상 (CSS 색상값). 지정 시 color prop 배경색보다 우선. SVG 꼬리 fill에도 동일하게 반영 */
    bgColor?: string;
    /** 말풍선 텍스트 커스텀 색상 (CSS 색상값). 지정 시 기본 $text-white보다 우선 */
    textColor?: string;
    side?: TooltipSide;
    arrowAlign?: TooltipArrowAlign;
    offsetX?: number;
    offsetY?: number;
    alwaysOpen?: boolean;
    text?: string;
    delayDuration?: number;
    /** true이면 TooltipPortal을 활성화해 body에 렌더링 — 부모 overflow:hidden 탈출 가능. popup 안에서는 false 유지 */
    portal?: boolean;
    /** portal=true 시 렌더링 대상 컨테이너. 미지정 시 <body> */
    container?: string | HTMLElement;
  }>(),
  {
    color: "dark",
    bgColor: undefined,
    textColor: undefined,
    side: "top",
    arrowAlign: "right",
    offsetX: 0,
    offsetY: 8,
    alwaysOpen: false,
    text: undefined,
    delayDuration: 0,
    portal: false,
    container: undefined,
  },
);

const emit = defineEmits<{
  open: [];
  close: [];
}>();

// ── attrs 2단계 분리 ──────────────────────────────────────────────────
// TooltipRoot 전용 props — 나머지는 TooltipTrigger로 위임
// (open, delayDuration은 이미 직접 prop으로 처리하므로 제외)
const TOOLTIP_ROOT_PROPS = ["defaultOpen", "disableHoverableContent"] as const;

const attrs = useAttrs();

// 1단계: Root 전용 attrs 분리
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([k]) =>
      (TOOLTIP_ROOT_PROPS as readonly string[]).includes(k),
    ),
  ),
);

// 2단계: 나머지 전부 Trigger에 위임 (aria-*, tabindex, data-* 등)
const triggerAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([k]) => !(TOOLTIP_ROOT_PROPS as readonly string[]).includes(k),
    ),
  ),
);

// ── 열림/닫힘 상태 ────────────────────────────────────────────────────
// React의 useState(props.alwaysOpen)에 해당
// alwaysOpen이 런타임에 false→true로 동적 변경되는 시나리오가 없으므로 watch 불필요
const isOpen = ref(props.alwaysOpen);

function handleOpenChange(value: boolean) {
  // alwaysOpen이면 닫힘 차단 (ESC 포함)
  if (props.alwaysOpen) return;
  isOpen.value = value;
  value ? emit("open") : emit("close");
}

// ── arrowAlign → Radix align 매핑 ────────────────────────────────────
// left → start (Radix Vue align 값), right → end, center → center
const radixAlign = computed(() => {
  if (props.arrowAlign === "left") return "start";
  if (props.arrowAlign === "right") return "end";
  return "center";
});

// ── arrow fill 색상 computed ──────────────────────────────────────────
// inline SVG :fill 바인딩 — 토큰 변수를 CSS 변수로 사용 불가하므로 hex 직접 사용
// bgColor 지정 시 → bgColor 우선 / 미지정: dark=#333333 / primary=#00addb
const arrowFill = computed(
  () => props.bgColor ?? (props.color === "primary" ? "#00addb" : "#333333"),
);

// ── customStyle computed ──────────────────────────────────────────────
// bgColor prop을 color variant 배경보다 우선 적용하는 인라인 style 객체
// textColor는 scoped/global 클래스 선택자(color: $text-white)가 상속을 차단하므로
// 텍스트 span에 직접 바인딩 — customStyle에서는 제외
const customStyle = computed(() => ({
  ...(props.bgColor ? { backgroundColor: props.bgColor } : {}),
}));

// textColor를 텍스트 span에 직접 바인딩하기 위한 style 객체
const textColorStyle = computed(() =>
  props.textColor ? { color: props.textColor } : {},
);

// ── [분기 B] alwaysOpen=true 전용 ────────────────────────────────────

// tooltipId — Math.random 기반 고유값 (Vue 3.5의 useId()로 대체 가능하나 기존 패턴 유지)
const tooltipId = `tooltip-${Math.random().toString(36).slice(2, 9)}`;

// bubbleStyle computed — absolute 포지셔닝 좌표 계산
// side: top → bottom: calc(100% + {offsetY}px) / bottom → top: calc(100% + {offsetY}px)
// arrowAlign: left → left: calc(-2rem + {offsetX}px) / right → right: calc(-2rem - {offsetX}px)
const bubbleStyle = computed(() => {
  const vertical =
    props.side === "top"
      ? { bottom: `calc(100% + ${props.offsetY}px)` }
      : { top: `calc(100% + ${props.offsetY}px)` };

  const horizontal =
    props.arrowAlign === "left"
      ? { left: `calc(-2rem + ${props.offsetX}px)` }
      : props.arrowAlign === "right"
        ? { right: `calc(-2rem - ${props.offsetX}px)` }
        : { left: "50%", transform: "translateX(-50%)" };

  return { ...vertical, ...horizontal };
});
</script>

<style lang="scss" scoped>
$b: "tooltip";

// TooltipPortal 제거 → TooltipContent가 트리거 DOM 인접 위치에 직접 렌더링
// 단, Radix Vue는 TooltipContent를 런타임에 동적 DOM 생성하므로
// scoped 속성(data-v-*)이 전달되지 않음 → :deep() 필수
// portal=true 시 TooltipContent가 <body>에 렌더링 → scoped 외부라 :deep() 미도달
// → :global()로 이중 선언해 portal=false(:deep())와 portal=true(:global()) 양쪽 커버
:deep(.#{$b}__content) {
  position: relative; // arrow absolute 배치의 기준점
  overflow: visible; // 꼬리가 content 박스 밖으로 나오므로 필수
  max-width: calc(100vw - $screen-padding-x * 2); // 말풍선 최대 너비
  border-radius: $radius-full; // 99px → 말풍선 pill 형태
  z-index: $z-tooltip;
  // Radix Vue가 outline 기본 적용하는 경우 대비
  outline: none;

  // open 애니메이션 — data-state 기반
  &[data-state="delayed-open"],
  &[data-state="instant-open"] {
    animation: tooltipFadeIn $duration-fast ease-out;
  }

  &[data-state="closed"] {
    animation: tooltipFadeOut $duration-fast ease-in;
    pointer-events: none;
  }
}

// ── 컬러 variant ─────────────────────────────────────────────────────
:deep(.#{$b}__content--dark) {
  background-color: $text-800; // #333333 정확 일치
}

:deep(.#{$b}__content--primary) {
  background-color: $color-primary-hover; // #00addb
}

// ── 텍스트 영역 ──────────────────────────────────────────────────────
:deep(.#{$b}__text) {
  display: block;
  padding: 0.6rem 1.2rem; // 6px 12px — Figma 명세 (토큰 근사값 없어 rem 직접 사용)
  font-size: $font-size-caption1; // 12px
  font-weight: $font-weight-bold; // 700
  color: $text-white;
  white-space: normal;
  word-break: keep-all;
  line-height: $line-height-snug;
}

// ── 꼬리(Arrow) — position: absolute 배치 ────────────────────────────
// Radix Vue의 TooltipArrow 대신 직접 span+SVG로 구현
// SVG 크기: 11×10px = 1.1rem×1.0rem
// x축 위치는 arrow-left / arrow-right modifier class로 제어
:deep(.#{$b}__arrow) {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0; // SVG 하단 여백 제거
}

// arrowAlign='left' → 화살표 말풍선 좌측 고정
:deep(.#{$b}__content--arrow-left .#{$b}__arrow) {
  left: 2rem;
}

// arrowAlign='right' → 화살표 말풍선 우측 고정
:deep(.#{$b}__content--arrow-right .#{$b}__arrow) {
  right: 2rem;
}

// data-side="top": avoidCollisions로 실제 위에 렌더 → 꼬리는 말풍선 아래 → SVG 180도 회전
// prop side가 아닌 TooltipContent[data-side]로 판단 → avoidCollisions 뒤집힘에 안전
:deep([data-side="top"] .#{$b}__arrow) {
  bottom: -0.6rem; // SVG height 10px = 1rem
}

:deep([data-side="top"] .#{$b}__arrow svg) {
  transform: rotate(180deg);
}

// data-side="bottom": avoidCollisions로 실제 아래에 렌더 → 꼬리는 말풍선 위 → SVG 그대로
:deep([data-side="bottom"] .#{$b}__arrow) {
  top: -0.6rem; // SVG height 10px = 1rem
}

// ── portal=true 전역 대응 (:global()) ────────────────────────────────
// portal=true 시 TooltipContent가 <body>에 텔레포트 → 이 컴포넌트의 scoped DOM 외부
// :deep()는 scoped 범위에만 도달하므로 :global()로 이중 선언 필요
// tooltip__content는 Tooltip 컴포넌트 전용 클래스 → 전역 충돌 위험 없음
:global(.tooltip__content) {
  position: relative;
  overflow: visible;
  max-width: calc(100vw - $screen-padding-x * 2);
  border-radius: $radius-full;
  z-index: $z-tooltip;
  outline: none;
}

:global(.tooltip__content[data-state="delayed-open"]),
:global(.tooltip__content[data-state="instant-open"]) {
  animation: tooltipFadeIn $duration-fast ease-out;
}

:global(.tooltip__content[data-state="closed"]) {
  animation: tooltipFadeOut $duration-fast ease-in;
  pointer-events: none;
}

:global(.tooltip__content--dark) {
  background-color: $text-800;
}

:global(.tooltip__content--primary) {
  background-color: $color-primary-hover;
}

:global(.tooltip__text) {
  display: block;
  padding: 0.6rem 1.2rem;
  font-size: $font-size-caption1;
  font-weight: $font-weight-bold;
  color: $text-white;
  white-space: normal;
  word-break: keep-all;
  line-height: $line-height-snug;
}

:global(.tooltip__arrow) {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}

:global(.tooltip__content--arrow-left .tooltip__arrow) {
  left: 2rem;
}

:global(.tooltip__content--arrow-right .tooltip__arrow) {
  right: 2rem;
}

:global([data-side="top"] .tooltip__arrow) {
  bottom: -0.6rem;
}

:global([data-side="top"] .tooltip__arrow svg) {
  transform: rotate(180deg);
}

:global([data-side="bottom"] .tooltip__arrow) {
  top: -0.6rem;
}

// ── [분기 B] alwaysOpen=true 자체 마크업 스타일 ──────────────────────
// Vue scoped 해시 정상 전달 → :deep() 불필요, 일반 scoped 선택자로 작성

.#{$b}__alwaysOpen {
  position: relative;
  display: flex;
}

.#{$b}__trigger {
  width: 100%;
}

.#{$b}__bubble {
  position: absolute;
  z-index: $z-tooltip;
  overflow: visible;
  width: max-content;
  max-width: 80vw;
  border-radius: $radius-full;
}

.#{$b}__bubble--dark {
  background-color: $text-800;
}

.#{$b}__bubble--primary {
  background-color: $color-primary-hover;
}

.#{$b}__bubble-text {
  display: block;
  padding: 0.6rem 1.2rem;
  font-size: $font-size-caption1;
  font-weight: $font-weight-bold;
  color: $text-white;
  white-space: normal;
  word-break: keep-all;
  line-height: $line-height-snug;
}

.#{$b}__bubble-arrow {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}

// arrowAlign='left': 화살표 말풍선 좌측 고정
.#{$b}__bubble--arrow-left .#{$b}__bubble-arrow {
  left: 2rem;
}

// arrowAlign='right': 화살표 말풍선 우측 고정
.#{$b}__bubble--arrow-right .#{$b}__bubble-arrow {
  right: 2rem;
}

// arrowAlign='center': 화살표 말풍선 중앙
.#{$b}__bubble--arrow-center .#{$b}__bubble-arrow {
  left: 50%;
  transform: translateX(-50%);
}

// side="top": 말풍선이 트리거 위 → 꼬리는 말풍선 아래 + SVG 180도 회전
.#{$b}__bubble--side-top .#{$b}__bubble-arrow {
  bottom: -0.6rem;
}

.#{$b}__bubble--side-top .#{$b}__bubble-arrow svg {
  transform: rotate(180deg);
}

// side="bottom": 말풍선이 트리거 아래 → 꼬리는 말풍선 위 + SVG 그대로
.#{$b}__bubble--side-bottom .#{$b}__bubble-arrow {
  top: -0.6rem;
}

// ── keyframes ────────────────────────────────────────────────────────
@keyframes tooltipFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes tooltipFadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
