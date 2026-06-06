<template>
  <PopoverRoot :open="proxyOpen" @update:open="handleOpenChange">
    <PopoverTrigger
      v-bind="triggerAttrs"
      as-child
      :aria-controls="panelId"
      :aria-expanded="proxyOpen"
    >
      <slot name="trigger" />
    </PopoverTrigger>

    <!-- portal=false(기본): PopoverContent를 트리거 DOM 인접 위치에 직접 렌더링 -->
    <!-- forceMount: true → DOM에 항상 마운트(v-show처럼), 닫힘 애니메이션 보장 -->
    <!-- Radix는 여전히 transform을 주입하므로 MutationObserver + !important override 유지 -->
    <PopoverContent
      v-if="!portal"
      :id="panelId"
      class="popover__panel"
      :force-mount="true"
      side="bottom"
      :side-offset="0"
      :avoid-collisions="false"
      :align-offset="0"
      align="start"
      role="dialog"
      aria-modal="false"
    >
      <div ref="panelInnerRef" class="popover__inner">
        <div v-if="title" class="popover__header">
          <span class="popover__title">{{ title }}</span>
          <button
            type="button"
            class="popover__close"
            aria-label="닫기"
            @click="handleClose"
          >
            <Icon :size="16"><CloseSvg /></Icon>
          </button>
        </div>
        <button
          type="button"
          class="popover__close"
          aria-label="닫기"
          @click="handleClose"
        >
          <Icon :size="16"><CloseSvg /></Icon>
        </button>
        <div class="popover__body">
          <slot />
        </div>
      </div>
    </PopoverContent>

    <!-- portal=true: body(또는 지정 container)에 렌더링 — 부모 overflow:hidden 탈출 -->
    <PopoverPortal v-else :to="container">
      <PopoverContent
        :id="panelId"
        class="popover__panel"
        :force-mount="true"
        side="bottom"
        :side-offset="0"
        :avoid-collisions="false"
        :align-offset="0"
        align="start"
        role="dialog"
        aria-modal="false"
      >
        <div ref="panelInnerRef" class="popover__inner">
          <div v-if="title" class="popover__header">
            <span class="popover__title">{{ title }}</span>
            <button
              type="button"
              class="popover__close"
              aria-label="닫기"
              @click="handleClose"
            >
              <Icon :size="16"><CloseSvg /></Icon>
            </button>
          </div>
          <button
            v-else
            type="button"
            class="popover__close popover__close--alone"
            aria-label="닫기"
            @click="handleClose"
          >
            <Icon :size="16"><CloseSvg /></Icon>
          </button>
          <div class="popover__body">
            <slot />
          </div>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<script setup lang="ts">
import Icon from "@nd/components/icons/Icon.vue";
import CloseSvg from "@nd/assets/icons/close.svg?component";

// 모듈 스코프 카운터 — SSR/Vue 버전에 무관하게 안정적인 유니크 ID 생성
// React의 useId() 대체 패턴 (Vue 3.5의 useId()로 대체 가능하나 기존 패턴 유지)
let _popoverCount = 0;

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    title?: string;
    open?: boolean;
    defaultOpen?: boolean;
    /** true이면 PopoverPortal을 활성화해 body에 렌더링 — 부모 overflow:hidden 탈출 가능. popup 안에서는 false 유지 */
    portal?: boolean;
    /** portal=true 시 렌더링 대상 컨테이너. 미지정 시 <body> */
    container?: string | HTMLElement;
  }>(),
  {
    title: undefined,
    open: undefined,
    defaultOpen: false,
    portal: false,
    container: undefined,
  },
);

const emit = defineEmits<{
  open: [];
  close: [];
  "update:open": [value: boolean];
}>();

// ── attrs 2단계 분리 ──────────────────────────────────────────────────
// triggerAttrs: aria-*, tabindex, data-* 등 인터랙티브 HTML 속성 전체
// (modal은 Root 전용이지만 open은 직접 prop으로 처리하므로 Root 바인딩 불필요)
const attrs = useAttrs();

// Popover Root 전용 props (open/defaultOpen은 이미 직접 prop으로 처리)
const POPOVER_ROOT_PROPS = ["modal"] as const;
// 컴포넌트 내부에서 직접 바인딩하는 aria 속성 — 외부 전달값과 충돌 방지
const INTERNAL_A11Y_ATTRS = ["aria-controls", "aria-expanded"] as const;

const triggerAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([k]) =>
        !(POPOVER_ROOT_PROPS as readonly string[]).includes(k) &&
        !(INTERNAL_A11Y_ATTRS as readonly string[]).includes(k),
    ),
  ),
);

// ── 유니크 패널 ID — aria-controls / aria-expanded 연결용 ────────────
// 모듈 스코프 카운터로 생성 (Vue 3.5의 useId()로 대체 가능하나 기존 패턴 유지)
// React의 useId()와 동일한 용도
const panelId = `popover-panel-${++_popoverCount}`;

// ── panelInnerRef — data-has-been-opened 설정 + MutationObserver 용도 ─
// flash 방지: forceMount="true" 사용 시 초기 로드에서 닫힘 애니메이션 from{opacity:1} flash 발생
// 최초 열림 시점에 data-has-been-opened를 추가해 이후에만 닫힘 애니메이션 적용
const panelInnerRef = ref<HTMLElement | null>(null);

// ── MutationObserver — Radix x축 transform override ──────────────────
// Radix Vue는 PopoverContent wrapper에 transform: translate(X, Y)를 인라인으로 주입
// position:fixed + left:0 !important 설정 후에도 X축 값이 남아 패널이 우측으로 밀리는 현상 방지
// Y축(translateY)은 유지해 수직 위치는 Radix 계산에 위임
let _wrapperObserver: MutationObserver | null = null;

function startWrapperFix() {
  if (_wrapperObserver) {
    _wrapperObserver.disconnect();
    _wrapperObserver = null;
  }
  const wrapper = panelInnerRef.value?.closest(
    "[data-radix-popper-content-wrapper]",
  ) as HTMLElement | null;
  if (!wrapper) return;
  let _fixInProgress = false;
  const fixPosition = () => {
    if (_fixInProgress) return;
    const t = wrapper.style.transform;
    if (!t || t === "none") return;
    try {
      const m = new DOMMatrix(t);
      const yOffset = m.m42;
      _fixInProgress = true;
      Object.assign(wrapper.style, {
        left: "50%",
        width: "min(600px, 100%)",
        transform: `translateX(-50%) translateY(${yOffset}px)`,
      });
      _fixInProgress = false;
    } catch {
      _fixInProgress = false;
      /* ignore — DOMMatrix 파싱 오류 시 무시 */
    }
  };
  fixPosition();
  _wrapperObserver = new MutationObserver(fixPosition);
  _wrapperObserver.observe(wrapper, {
    attributes: true,
    attributeFilter: ["style"],
  });
}

function stopWrapperFix() {
  _wrapperObserver?.disconnect();
  _wrapperObserver = null;
}

// ── v-model:open (제어/비제어 모드) ──────────────────────────────────
// React의 controlled/uncontrolled pattern과 동일
const internalOpen = ref(props.defaultOpen);

const proxyOpen = computed(() =>
  props.open !== undefined ? props.open : internalOpen.value,
);

function handleOpenChange(value: boolean) {
  if (props.open === undefined) {
    internalOpen.value = value;
  }
  emit("update:open", value);
  if (value) {
    emit("open");
  } else {
    emit("close");
  }
}

function handleClose() {
  // 외부 제어 닫기 버그 수정:
  // handleOpenChange(false) 경유만으로는 외부 제어 모드에서 internalOpen이 갱신되지 않을 수 있으므로
  // internalOpen 직접 세팅 + emit 양쪽 모두 실행해 제어/비제어 양 모드에서 닫힘 보장
  internalOpen.value = false;
  emit("update:open", false);
  emit("close");
}

// ── Escape 키 닫기 — document 레벨 리스너 ────────────────────────────
// 클릭 후 포커스가 트리거 버튼에 남아 PopoverContent의 keydown이 발화되지 않으므로
// document 레벨에서 직접 감지한다
const handleDocumentEscape = (e: KeyboardEvent) => {
  if (e.key === "Escape" && proxyOpen.value) {
    e.preventDefault();
    e.stopImmediatePropagation();
    handleClose();
  }
};

// ── Escape 리스너 등록 — SSR 안전 패턴 ──────────────────────────────
// immediate: true는 SSR에서 document 접근 시 ReferenceError 위험 → onMounted + watch 분리
// React 비교: useEffect(() => { if (open) document.addEventListener(...) }, [open]) 패턴

// 초기 상태 처리 — onMounted (client-side 보장)
onMounted(() => {
  if (proxyOpen.value) {
    document.addEventListener("keydown", handleDocumentEscape);
  }
});

// 이후 상태 변경 처리 (Escape 리스너 + data-has-been-opened 마킹 + MutationObserver)
watch(proxyOpen, async (val) => {
  if (val) {
    document.addEventListener("keydown", handleDocumentEscape);
    await nextTick();
    // 최초 열림 시 data-has-been-opened 마킹 — 초기 로드 flash 방지용
    // closed 상태에서 data-has-been-opened 없으면 애니메이션 없이 즉시 숨김
    // data-has-been-opened 있으면 닫힘 애니메이션 정상 작동
    if (panelInnerRef.value) {
      panelInnerRef.value.dataset.hasBeenOpened = "true";
    }
    // Radix x축 transform 제거 — portal 없이도 wrapper에 transform 주입되는 경우 대비
    startWrapperFix();
  } else {
    document.removeEventListener("keydown", handleDocumentEscape);
    setTimeout(stopWrapperFix, 250); // 닫힘 애니메이션 완료 후 observer 해제 ($duration-base: 250ms)
  }
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleDocumentEscape);
  stopWrapperFix();
});
</script>

<style lang="scss" scoped>
$b: "popover";

// PopoverPortal 제거 → PopoverContent가 트리거 DOM 인접 위치에 직접 렌더링
// 단, Radix Vue는 PopoverContent를 런타임에 동적 DOM 생성하므로
// scoped 속성(data-v-*)이 전달되지 않음 → :deep() 필수
// Radix가 인라인 transform을 주입하므로 !important + MutationObserver 필요

:deep(.#{$b}__panel) {
  // position: fixed — viewport 기준 절대 배치 (containing block 문제 우회)
  // PopoverPortal 제거 후 PopoverRoot가 renderless라 containing block 생성 불가
  // wrapper가 left:50%+translateX(-50%)+width:min(600px,100%)로 중앙 배치되므로
  // panel은 left:0+width:100%로 wrapper를 채우기만 하면 됨
  // !important — Radix Vue가 인라인 스타일로 popper 포지셔닝을 주입하므로 override 필요
  position: fixed !important;
  left: $screen-padding-x !important;
  width: calc(
    100% - ($screen-padding-x * 2)
  ) !important; // wrapper 너비 채움 (= min(600px, viewport-scrollbar))
  z-index: $z-dropdown; // 100 — Popup($z-modal: 300)보다 낮음
  // panel 자체는 투명 컨테이너 — 시각 스타일은 __inner로 이동
  background: transparent;
  border: none;
  padding: 0;
  box-sizing: border-box;
  will-change: unset; // panel은 애니메이션 없음
}

// 시각 스타일 + 애니메이션 → __inner
// keyframe에서 transform을 자유롭게 사용 가능 (panel에 transform 없음)
// opacity: 0 기본값 — forceMount 사용 시 data-state 미설정 순간 flash 방지
// max-width/margin 제거 — wrapper가 이미 min(600px,100%)로 너비 제한 + 중앙 배치
:deep(.#{$b}__inner) {
  background-color: $bg-primary;
  border: 1px solid $border-disabled; // $border-default 미존재 → Figma #BECCD2 = $border-disabled
  border-radius: $radius-md; // Figma: 4면 모두 동일 라운드
  padding: $spacing-sm; // 상하·좌우 8px
  box-sizing: border-box;
  will-change: transform, opacity;
  opacity: 0; // flash 방지 기본값 — open 애니메이션(from:0→to:1)으로 덮어씀
  position: relative;
}

// data-state 속성이 없는 순간(렌더 직후 gap + SSR hydration 전) 명시적 차단
:deep(.#{$b}__panel:not([data-state]) .#{$b}__inner) {
  opacity: 0;
  pointer-events: none;
}

// open 상태: fadeIn + slideUpAndFade — panel[data-state] 조건 + __inner 대상
:deep(.#{$b}__panel[data-state="open"] .#{$b}__inner) {
  animation: popoverSlideUpAndFade $duration-base ease-out forwards;
}

// closed 상태 (초기 로드 — 한 번도 열리지 않음): 즉시 숨김, 애니메이션 없음
// data-has-been-opened 속성이 없으면 이 룰이 매칭됨 → flash 없음
:deep(
  .#{$b}__panel[data-state="closed"] .#{$b}__inner:not([data-has-been-opened])
) {
  opacity: 0;
}

// closed 상태 (한 번 이상 열린 후 닫힐 때): 닫힘 애니메이션 적용
// data-has-been-opened 속성이 있으면 이 룰이 매칭됨 → 애니메이션 정상 작동
:deep(.#{$b}__panel[data-state="closed"] .#{$b}__inner[data-has-been-opened]) {
  animation: popoverSlideDownAndFade $duration-base ease-in forwards;
}

// closed 상태 클릭 차단 — panel 레벨에서 적용
:deep(.#{$b}__panel[data-state="closed"]) {
  pointer-events: none;
}

.#{$b}__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-sm;
  padding-right: 3rem;
}

.#{$b}__title {
  font-size: $font-size-body3;
  font-weight: $font-weight-medium;
  color: $text-600; // $text-secondary 미존재 → Figma #666666 = $text-600
  line-height: $line-height-snug;
}

.#{$b}__close {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.4rem;
  height: 2.4rem;
  border: none;
  background: transparent;
  color: $text-600;
  cursor: pointer;
  border-radius: $radius-md;
  padding: 0;
  position: absolute;
  right: 1rem;
  top: 0.8rem;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px $border-focus;
  }

  &:hover {
    color: $text-900;
  }
}

.#{$b}__body {
  font-size: $font-size-body3;
  font-weight: $font-weight-medium;
  color: $text-600; // $text-secondary 미존재 → $text-600
  line-height: $line-height-base;
  padding-right: 3rem;
}

// ── keyframes — scoped style 안에서도 Vite/Vue가 정상 처리 ───────────
@keyframes popoverSlideUpAndFade {
  from {
    opacity: 0;
    transform: translateY(0.4rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes popoverSlideDownAndFade {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(0.4rem);
  }
}
</style>
