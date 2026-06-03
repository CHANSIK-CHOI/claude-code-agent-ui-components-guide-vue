<!--
  [예외 사유] <script setup> 사용 불가
  Vue 3의 <script setup>에서는 useSlots().default()로 수집한 VNode를 렌더 트리에서
  직접 조작(래핑·타입 판별)할 수 없다. Marquee는 default slot의 각 VNode를 검사해
  이미 SwiperSlide인 경우 그대로 전달하고, 아닌 경우 SwiperSlide로 감싸야 하므로
  defineComponent + render function 패턴이 필수다.
  이는 rules/components.md의 "<script setup lang="ts"> 사용" 원칙의 정당한 예외이며,
  Marquee 컴포넌트에 한해 Options API-style defineComponent를 사용한다.
-->
<style lang="scss" scoped>
$b: "marquee";
</style>

<script lang="ts">
import {
  defineComponent,
  h,
  cloneVNode,
  isVNode,
  onBeforeUnmount,
  useAttrs,
  useSlots,
  resolveComponent,
  Fragment,
  Comment,
  Text,
} from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
// swiper v10+ 부터 모듈은 'swiper/modules'에서 export (구 'swiper' 경로는 v12에서 미제공)
import { FreeMode } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import type { VNode, Component } from "vue";

/**
 * BLOCKER 1 수정: v-for로 생성된 자식은 slots.default() 호출 시 Fragment VNode 1개로 들어옴.
 * 재귀적으로 평탄화해 각 실제 VNode를 SwiperSlide로 개별 래핑할 수 있도록 함.
 */
function flattenVNodes(vnodes: VNode[]): VNode[] {
  return vnodes.flatMap((vnode) =>
    vnode.type === Fragment && Array.isArray(vnode.children)
      ? flattenVNodes(vnode.children as VNode[])
      : [vnode],
  );
}

/**
 * VNode를 재귀적으로 deep clone한다.
 *
 * cloneVNode(Vue 내장)는 shallow copy라서 children 배열이 동일 참조로 공유된다.
 * Swiper loop: true + loopAdditionalSlides는 슬라이드를 양쪽에 loop copy로 복제하는데,
 * 동일 VNode 참조를 SwiperSlide slot에 전달하면 <Tooltip> 등 Vue 컴포넌트 VNode는
 * 싱글톤이라 두 포지션에서 동시 마운트 불가 → loop copy 포지션에서 빈 DOM 출력.
 * deepCloneVNode로 각 슬라이드가 독립 VNode 트리를 갖도록 하여 해결한다. (spec §5)
 */
/**
 * children 배열의 단일 항목을 재귀 clone하는 헬퍼.
 * - VNode          → deepCloneVNode 재귀
 * - 중첩 배열      → 배열의 각 항목에 동일 매핑(재귀) 적용
 * - primitive 외   → 그대로 유지 (spec §5 동작 의미 동일)
 *
 * TypeScript any 금지 — 항목 타입은 unknown으로 받고 isVNode/Array.isArray로 좁힌다.
 */
function cloneChild(child: unknown): unknown {
  if (isVNode(child)) return deepCloneVNode(child);
  if (Array.isArray(child)) return child.map(cloneChild);
  return child;
}

function deepCloneVNode(node: VNode): VNode {
  const cloned = cloneVNode(node);
  if (Array.isArray(node.children)) {
    // children 배열에는 VNode뿐 아니라 string·number 등 primitive가 섞일 수 있다.
    // (예: <div>안녕 <b>{{x}}</b></div> → children = ['안녕 ', vnode])
    // cloneChild로 VNode·중첩 배열·primitive를 모두 처리한다. (spec §5)
    (cloned as VNode & { children: unknown[] }).children = (
      node.children as unknown[]
    ).map(cloneChild);
  }
  return cloned;
}

type SwiperInstance = SwiperClass & {
  setTransition: (duration: number) => void;
  updateActiveIndex: () => void;
  loopFix: () => void;
};

export default defineComponent({
  name: "Marquee",

  inheritAttrs: false,

  props: {
    /** 프레임당 이동 속도 (px/ms). 클수록 빠름 */
    speed: {
      type: Number,
      default: 0.07,
    },
    /** 각 슬라이드 아이템 사이 간격 (px) */
    spaceBetween: {
      type: Number,
      default: 12,
    },
    /** touchEnd 후 자동 스크롤 재개까지 대기 시간 (ms) */
    resumeDelay: {
      type: Number,
      default: 700,
    },
  },

  setup(props) {
    const attrs = useAttrs();
    const slots = useSlots();

    // WARN-3: resolveComponent는 setup 컨텍스트에서 1회만 조회한다.
    // render function 안에서 매 렌더마다 호출하면 불필요한 조회가 반복된다.
    const ClientOnly = resolveComponent("ClientOnly");

    // 비반응 내부 변수 — ref 사용 금지 (spec §5)
    let swiperInstance: SwiperInstance | null = null;
    let rafId = 0;
    let lastTime = 0;
    let isInteracting = false;
    let resumeTimer = 0;

    // prefers-reduced-motion 감지 (WCAG 2.2.2 — spec §5, §7)
    // change 리스너로 런타임 OS 설정 변경도 반영
    const mql =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    let reducedMotion = mql?.matches ?? false;

    const onReducedMotionChange = (e: MediaQueryListEvent): void => {
      reducedMotion = e.matches;
      if (reducedMotion) {
        // reduce 전환 → 진행 중인 rAF 정지
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      } else {
        // reduce 해제 → swiperInstance 있고 rAF 미실행 상태면 재시작
        if (swiperInstance && !rafId) {
          lastTime = 0;
          rafId = requestAnimationFrame(tick);
        }
      }
    };

    mql?.addEventListener("change", onReducedMotionChange);

    function tick(now: number): void {
      rafId = requestAnimationFrame(tick);

      const sw = swiperInstance;
      if (!sw || sw.destroyed || isInteracting) {
        lastTime = now;
        return;
      }
      if (!lastTime) {
        lastTime = now;
        return;
      }

      // 탭 비활성 후 복귀 시 translate 점프 방지 (spec §5)
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;

      sw.setTransition(0);
      sw.setTranslate(sw.getTranslate() - props.speed * dt);
      sw.updateActiveIndex();
      sw.updateSlidesClasses();
      sw.loopFix();
    }

    function resume(): void {
      if (resumeTimer) {
        clearTimeout(resumeTimer);
        resumeTimer = 0;
      }
      isInteracting = false;
      lastTime = 0; // dt 재계산으로 점프 방지
      swiperInstance?.setTransition(0);
    }

    function onSwiper(sw: SwiperInstance): void {
      swiperInstance = sw;

      // 드래그 시작 → 자동 스크롤 정지 (Swiper가 translate 제어권을 가짐)
      sw.on("touchStart", () => {
        isInteracting = true;
        if (resumeTimer) {
          clearTimeout(resumeTimer);
          resumeTimer = 0;
        }
      });

      // 드래그 종료 → 관성 전환이 끝나면 자동 스크롤 재개
      // 관성 transition이 있으면 transitionEnd로, 없으면 타이머로 재개 (spec §5)
      // transitionEnd / 타이머 중 먼저 실행된 쪽이 나머지를 취소해 resume() 1회 보장
      sw.on("touchEnd", () => {
        const onTransitionEnd = () => {
          // sw.once가 자동 해제하므로 기능상 누수는 없으나,
          // 타이머 경로의 sw.off 호출과 대칭을 맞춰 정리 의도를 명확히 한다.
          sw.off("transitionEnd", onTransitionEnd);
          clearTimeout(resumeTimer);
          resumeTimer = 0;
          resume();
        };
        sw.once("transitionEnd", onTransitionEnd);
        resumeTimer = window.setTimeout(() => {
          sw.off("transitionEnd", onTransitionEnd);
          resume();
        }, props.resumeDelay);
      });

      // prefers-reduced-motion: reduce 감지 시 rAF 시작 안 함 (spec §5, §7)
      if (!mql?.matches) {
        rafId = requestAnimationFrame(tick);
      }
    }

    // 언마운트 정리 (spec §5)
    onBeforeUnmount(() => {
      if (rafId) cancelAnimationFrame(rafId);
      if (resumeTimer) clearTimeout(resumeTimer);
      mql?.removeEventListener("change", onReducedMotionChange);
      swiperInstance = null;
    });

    // render function
    return () => {
      // slots.default()를 render 최상위에서 1회 평가.
      // [주의] Swiper Vue 라이브러리(swiper/vue/swiper.js:516)는 setup() 안에서
      // getChildren(originalSlots)를 호출해 슬롯을 즉시 평가한다.
      // 이 동작은 라이브러리 내부 구조이므로 Marquee 코드에서 제거할 수 없으며,
      // "[Vue warn]: Slot invoked outside of the render function" 경고는
      // Swiper Vue 라이브러리의 알려진 동작이다.
      const rawChildren = slots.default?.() ?? [];

      // Fragment 재귀 평탄화 → 주석/공백 텍스트 제외 → 하이브리드 래핑
      // 이미 SwiperSlide이면 그대로 전달(재래핑 금지), 아니면 SwiperSlide로 자동 래핑 (spec §2)
      const slides = flattenVNodes(rawChildren)
        .filter((vnode) => {
          if (vnode.type === Comment) return false;
          if (vnode.type === Text && (vnode.children as string)?.trim() === "")
            return false;
          return true;
        })
        .map((vnode, idx) => {
          if (vnode.type === SwiperSlide) {
            // 이미 SwiperSlide — 재래핑 금지. key 없을 때만 idx로 보강
            return vnode.key != null ? vnode : cloneVNode(vnode, { key: idx });
          }
          // 일반 VNode — SwiperSlide로 자동 래핑 (width: fit-content로 안쪽 콘텐츠 폭이 슬라이드 폭으로 반영)
          // deepCloneVNode로 독립 VNode 트리를 생성해야 Swiper loop copy 포지션에서도
          // <Tooltip> 등 Vue 컴포넌트 자식이 빈 DOM 없이 정상 마운트된다. (spec §5)
          return h(
            SwiperSlide,
            {
              key: vnode.key != null ? vnode.key : idx,
              style: "width: fit-content",
            },
            { default: () => [deepCloneVNode(vnode)] },
          );
        });

      const swiperProps = {
        modules: [FreeMode],
        freeMode: {
          enabled: true,
          momentum: true,
          momentumRatio: 0.4,
          momentumVelocityRatio: 0.6,
        },
        grabCursor: true,
        slidesPerView: "auto",
        spaceBetween: props.spaceBetween,
        loop: true,
        loopAdditionalSlides: slides.length,
        onSwiper,
      };

      return h(ClientOnly, null, {
        default: () =>
          h(
            Swiper as Component,
            {
              ...attrs,
              ...swiperProps,
              // Vue h()는 class 배열을 normalizeClass로 자동 합침
              class: ["marquee", attrs.class as string | undefined],
            },
            // slides는 render 최상위에서 이미 평가 완료된 배열.
            // 슬롯 함수 형태로 전달해 "Non-function value for default slot" 경고 방지.
            { default: () => slides },
          ),
      });
    };
  },
});
</script>
