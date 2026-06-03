<template>
  <Input
    v-bind="$attrs"
    :model-value="modelValue"
    :disabled="disabled"
    :error="!!error"
    :hide-clear="hideClear"
    @update:model-value="emit('update:modelValue', $event)"
    @focus="emit('focus')"
    @blur="emit('blur', $event)"
    @change="emit('change', $event)"
    @clear="emit('clear')"
  >
    <template v-if="timerState === 'running'" #suffix>
      <span class="inputAuth__timer" aria-live="off">{{ timerDisplay }}</span>
    </template>
  </Input>
</template>

<script setup lang="ts">
  import Input from './Input.vue';

  defineOptions({ inheritAttrs: false });

  const props = withDefaults(
    defineProps<{
      // [연동] 개발자가 v-model로 연결
      modelValue?: string;
      duration?: number;
      // [연동] 개발자가 false→true 전환으로 타이머 재시작, true→false 전환으로 정지
      active?: boolean;
      autoStart?: boolean;
      // [퍼블리셔] UI 제어용
      disabled?: boolean;
      error?: string | boolean;
      hideClear?: boolean;
    }>(),
    {
      modelValue: '',
      duration: 180,
      active: false,
      autoStart: false,
      disabled: false,
      error: false,
      hideClear: false,
    }
  );

  const emit = defineEmits<{
    'update:modelValue': [value: string];
    focus: [];
    blur: [value: string];
    change: [value: string];
    clear: [];
    // [연동] 타이머 시작/종료 이벤트 — 개발자가 수신해 재발송 UI 제어 등에 활용
    'timer-start': [];
    'timer-end': [];
  }>();

  type TimerState = 'idle' | 'running' | 'expired';

  const timerState = ref<TimerState>('idle');
  const remaining = ref<number>(props.duration);
  let intervalId: ReturnType<typeof setInterval> | null = null;

  // MM:SS 2자리 0-패딩 포맷
  const timerDisplay = computed(() => {
    const m = Math.floor(remaining.value / 60);
    const s = remaining.value % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  });

  function clearTimer(): void {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function resetRemaining(): void {
    remaining.value = props.duration;
  }

  function startTimer(): void {
    clearTimer();
    resetRemaining();
    timerState.value = 'running';
    emit('timer-start');

    intervalId = setInterval(() => {
      remaining.value -= 1;

      if (remaining.value <= 0) {
        remaining.value = 0;
        clearTimer();
        timerState.value = 'expired';
        emit('timer-end');
      }
    }, 1000);
  }

  function stopAndReset(): void {
    clearTimer();
    resetRemaining();
    timerState.value = 'idle';
  }

  // active prop 변화 감지
  // React의 useEffect([active]) 와 동일
  // immediate: true — 마운트 직후 active=true 초기값도 처리 (oldVal=undefined, newVal=true → startTimer)
  watch(
    () => props.active,
    (newVal, oldVal) => {
      if (newVal && !oldVal) {
        // false → true (또는 초기 immediate 실행 시 undefined → true): 리셋 + 재시작
        startTimer();
      } else if (!newVal && oldVal) {
        // true → false: 정지 + 리셋 (expired 상태로 전환하지 않음)
        stopAndReset();
      }
    },
    { immediate: true }
  );

  // autoStart: 마운트 직후 자동 시작 (active와 독립)
  onMounted(() => {
    if (props.autoStart) {
      startTimer();
    }
  });

  // 언마운트 시 인터벌 반드시 정리 (메모리 누수 방지)
  onUnmounted(() => {
    clearTimer();
  });
</script>

<style lang="scss" scoped>
  $b: 'inputAuth';

  .#{$b}__timer {
    font-size: $font-size-body1;
    color: $text-600;
    white-space: nowrap;
  }
</style>
