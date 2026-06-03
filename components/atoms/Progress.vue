<template>
  <div class="progress__wrap">
    <ProgressRoot class="progress" v-bind="$attrs" :model-value="displayValue" :max="max" :get-value-label="getValueLabel">
      <ProgressIndicator
        class="progress__indicator"
        :style="`transform: translateX(-${100 - (displayValue / max) * 100}%)`"
      />
    </ProgressRoot>
    <div
      v-if="tooltipText || $slots.indicator"
      class="progress__indicatorSlot"
      :style="{ left: indicatorLeft }"
    >
      <Tooltip
        v-if="tooltipText"
        :always-open="true"
        :text="tooltipText"
        :side="tooltipSide"
        :color="tooltipColor"
        :arrow-align="tooltipArrowAlign"
        :offset-x="tooltipOffsetX"
        :offset-y="tooltipOffsetY"
        :bg-color="tooltipBgColor"
        :text-color="tooltipTextColor"
      >
        <template #trigger>
          <span class="progress__tooltipAnchor" />
        </template>
      </Tooltip>
      <slot v-else-if="$slots.indicator" name="indicator" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import Tooltip from './Tooltip.vue';

  defineOptions({ inheritAttrs: false });

  const props = withDefaults(
    defineProps<{
      // [퍼블리셔] 현재 진행값 (0~max 범위)
      value?: number;
      // [퍼블리셔] 진행 바의 최대값
      max?: number;
      // [퍼블리셔] 보조기기에 전달할 레이블 커스텀 함수 (예: "50% 완료")
      getValueLabel?: (value: number, max: number) => string;
      // ── Tooltip 통합 props ────────────────────────────────────────────
      // [퍼블리셔] 지정 시 Progress 내부에서 Tooltip을 alwaysOpen=true로 자동 마운트
      tooltipText?: string;
      // [퍼블리셔] Tooltip 말풍선 방향 (Tooltip의 side prop과 동일)
      tooltipSide?: 'top' | 'bottom';
      // [퍼블리셔] Tooltip 말풍선 색상 variant (Tooltip의 color prop과 동일)
      tooltipColor?: 'dark' | 'primary';
      // [퍼블리셔] Tooltip 화살표 정렬 (Tooltip의 arrowAlign prop과 동일)
      tooltipArrowAlign?: 'left' | 'center' | 'right';
      // [퍼블리셔] Tooltip x축 오프셋(px)
      tooltipOffsetX?: number;
      // [퍼블리셔] Tooltip y축 오프셋(px)
      tooltipOffsetY?: number;
      // [퍼블리셔] Tooltip 배경 커스텀 색상. 지정 시 tooltipColor보다 우선
      tooltipBgColor?: string;
      // [퍼블리셔] Tooltip 텍스트 커스텀 색상. 미지정 시 기본 $text-white
      tooltipTextColor?: string;
    }>(),
    {
      value: 0,
      max: 100,
      getValueLabel: undefined,
      tooltipText: undefined,
      tooltipSide: 'top',
      tooltipColor: 'dark',
      tooltipArrowAlign: 'center',
      tooltipOffsetX: 0,
      tooltipOffsetY: 8,
      tooltipBgColor: undefined,
      tooltipTextColor: undefined,
    }
  );

  // 마운트 시 0→실제값 애니메이션 (Radix Vue 공식 예시 패턴)
  // React의 useEffect(() => { setTimeout(...) }, []) 과 동일
  const displayValue = ref(0);
  let isMounted = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  onMounted(() => {
    timer = setTimeout(() => {
      displayValue.value = props.value;
      isMounted = true;
    }, 300);
  });

  onUnmounted(() => {
    clearTimeout(timer);
  });

  // 외부 value 변경 시 displayValue 동기화
  // isMounted 플래그로 타이머 완료 전 watch 개입 차단
  watch(
    () => props.value,
    (val) => {
      if (!isMounted) return;
      displayValue.value = val;
    }
  );

  // indicator 슬롯 left 계산 — CSS max()가 SCSS 내장 함수와 충돌하므로 script에서 처리
  // max(0%, pct%) 클램핑: value=0 시 슬롯이 트랙 왼쪽 바깥으로 이탈하지 않도록
  const indicatorLeft = computed(() => {
    const pct = (displayValue.value / props.max) * 100;
    return `max(0%, ${pct}%)`;
  });
</script>

<style lang="scss" scoped>
  $b: 'progress';

  // ── 래퍼(Wrap) — 트랙과 인디케이터 슬롯의 공통 기준 컨테이너 ──────────
  .#{$b}__wrap {
    position: relative;
    width: 100%;
  }

  // ── 트랙(Track) ─────────────────────────────────────────────────────────
  .#{$b} {
    position: relative;
    width: 100%;
    height: 0.6rem;
    border-radius: 99px;
    background-color: $bg-tertiary;
    overflow: hidden;
  }

  // ── 인디케이터(Indicator) ────────────────────────────────────────────────
  .#{$b}__indicator {
    width: 100%;
    height: 100%;
    border-radius: 99px;
    // 토큰 없음 — spec §6에 인라인 선언 명시
    // stylelint-disable-next-line color-no-invalid-hex
    background: linear-gradient(90deg, #19c2ef 0%, #a2efd0 100%);
    transition: transform 0.3s ease-in-out;
    transform-origin: left center;
  }

  // ── 인디케이터 슬롯(Indicator Slot) ────────────────────────────────────
  // left는 script의 indicatorLeft computed로 바인딩 (CSS max()가 SCSS 내장 함수와 충돌)
  .#{$b}__indicatorSlot {
    position: absolute;
    top: 50%;
    // left: script :style 바인딩으로 제어
    transform: translateX(-50%) translateY(-50%);
    transition: left 0.3s ease-in-out; // 인디케이터 transition과 동기화
    z-index: $z-tooltip;
  }

  // ── Tooltip anchor — 크기 0의 포지셔닝 기준점 ──────────────────────────
  // Tooltip #trigger 슬롯에 주입해 말풍선 위치 계산 기준점 역할만 수행
  .#{$b}__tooltipAnchor {
    display: block;
    width: 0;
    height: 0;
  }
</style>
