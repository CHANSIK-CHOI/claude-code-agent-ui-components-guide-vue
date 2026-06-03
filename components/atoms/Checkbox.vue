<template>
  <label
    :for="checkboxId"
    class="checkbox__wrapper"
    :class="[
      $attrs.class,
      `checkbox__wrapper--${type}`,
      { 'checkbox__wrapper--disabled': disabled },
      { 'checkbox__wrapper--checked': proxyValue },
    ]"
  >
    <CheckboxRoot
      v-bind="rootAttrs"
      :id="checkboxId"
      class="checkbox__control"
      :checked="proxyValue"
      :disabled="disabled"
      :name="name"
      :required="required"
      :value="value"
      @update:checked="onCheckedChange"
    >
      <!--
        box/check 두 타입 모두 아이콘이 항상 표시됨.
        미체크 상태의 색상은 SCSS에서 타입별로 분기 처리.
        (box 미체크: $text-300 회색, check 미체크: $text-300 회색)
      -->
      <svg
        class="checkbox__icon checkbox__icon--always"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 14 10"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M1.1001 3.59998L5.43494 8.09998L12.6001 1.09998"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </CheckboxRoot>

    <span v-if="$slots.default?.().length" class="checkbox__label">
      <slot />
    </span>
  </label>
</template>

<script setup lang="ts">
  defineOptions({ inheritAttrs: false });

  type CheckboxType = 'box' | 'check';

  const props = withDefaults(
    defineProps<{
      modelValue?: boolean;
      type?: CheckboxType;
      disabled?: boolean;
      id?: string;
      name?: string;
      required?: boolean;
      value?: string;
    }>(),
    {
      modelValue: false,
      type: 'box',
      disabled: false,
      id: undefined,
      name: undefined,
      required: false,
      value: 'on',
    }
  );

  const emit = defineEmits<{
    'update:modelValue': [value: boolean];
  }>();

  // id 자동 생성 — Input.vue 패턴과 동일
  const attrs = useAttrs();
  const _nuxtId = useId();
  const checkboxId = computed(() => props.id ?? (attrs.id as string | undefined) ?? `checkbox-${_nuxtId}`);

  // $attrs에서 id·class 제외한 나머지를 CheckboxRoot에 위임
  // class는 래퍼 <label>에 명시적으로 바인딩하므로 CheckboxRoot에 넘기지 않음
  const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([k]) => k !== 'id' && k !== 'class'))
  );

  // :checked 단방향 바인딩 + @update:checked 핸들러로 명시적 분리
  // v-model:checked(writable computed)보다 controlled mode에서 더 안정적
  const proxyValue = computed(() => props.modelValue);

  function onCheckedChange(val: boolean | 'indeterminate') {
    emit('update:modelValue', val === true);
  }
</script>

<style lang="scss" scoped>
  $b: 'checkbox';

  // ── wrapper (label) ────────────────────────────────────────────────
  .#{$b}__wrapper {
    display: inline-flex; // Checkbox/Radio 예외 — 콘텐츠 너비만큼만 차지\
    gap: 1rem; // 10px — 토큰 없음, 직접 사용
    cursor: pointer;
  }

  .#{$b}__wrapper--disabled {
    cursor: not-allowed;

    .#{$b}__label {
      color: $text-300;
    }
  }

  // ── control (CheckboxRoot 버튼) ────────────────────────────────────
  // Radix Vue CheckboxRoot는 inheritAttrs:false로 내부에서 attrs를 처리하므로
  // Vue scoped의 scope attribute(data-v-xxxx)가 내부 <button>에 전달되지 않음.
  // wrapper(<label>)에는 scope attribute가 있으므로 :deep()으로 하위 요소를 선택.
  :deep(.#{$b}__control) {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 2.2rem; // 22px — 토큰 없음, 직접 사용
    height: 2.2rem; // 22px — 토큰 없음, 직접 사용
    outline: none;
    cursor: pointer;

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px $color-primary;
      border-radius: $radius-sm;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

  // ── icon (SVG) ─────────────────────────────────────────────────────
  // SVG는 CheckboxRoot 내부에 있으므로 :deep() 적용
  :deep(.#{$b}__icon--always) {
    width: 1.4rem; // 14px — viewBox 기준
    height: 1rem; // 10px — viewBox 기준
  }

  // ── label (span) ───────────────────────────────────────────────────
  .#{$b}__label {
    font-size: $font-size-body3;
    font-weight: $font-weight-medium;
    line-height: $line-height-snug;
    margin-top: 0.2rem;
    color: $text-800; // box type 기본 — check type에서 override
  }

  // ── box type ───────────────────────────────────────────────────────
  // .#{$b}__control / .#{$b}__icon--always 은 Radix 내부 요소 → :deep() 필수
  .#{$b}__wrapper--box {
    :deep(.#{$b}__control) {
      background-color: $bg-primary;
      border: 1px solid $line-200;
      border-radius: $radius-sm;
    }

    // box 미체크: 회색 아이콘 (#C0C0C0 = $text-300)
    :deep(.#{$b}__icon--always) {
      color: $text-300;
    }

    // box 체크됨: 파란 배경 + 흰 아이콘
    &.#{$b}__wrapper--checked {
      :deep(.#{$b}__control) {
        background-color: $color-primary-hover;
        border-color: $color-primary-hover;
      }

      :deep(.#{$b}__icon--always) {
        color: $text-white;
      }
    }

    // box disabled 미체크
    &.#{$b}__wrapper--disabled {
      :deep(.#{$b}__control) {
        background-color: $bg-disabled;
        border-color: $border-disabled;
      }
    }

    // box disabled 체크됨
    &.#{$b}__wrapper--disabled.#{$b}__wrapper--checked {
      :deep(.#{$b}__control) {
        background-color: $bg-disabled;
        border-color: $border-disabled;
      }

      :deep(.#{$b}__icon--always) {
        color: $text-300;
      }
    }
  }

  // ── check type ─────────────────────────────────────────────────────
  // check type은 박스/테두리 없음. 아이콘(--always)으로만 상태 표현.
  // CheckboxIndicator를 사용하지 않으므로 --always 아이콘이 모든 상태 처리.
  .#{$b}__wrapper--check {
    :deep(.#{$b}__control) {
      background-color: transparent;
      border: none;
    }

    .#{$b}__label {
      color: $text-700; // check type은 $text-700
    }

    // check 미체크: 회색 아이콘
    :deep(.#{$b}__icon--always) {
      color: $text-300;
    }

    // check 체크됨: 파란 아이콘
    &.#{$b}__wrapper--checked {
      :deep(.#{$b}__icon--always) {
        color: $color-primary-hover;
      }
    }

    // check disabled 미체크: 더 흐린 아이콘
    &.#{$b}__wrapper--disabled {
      :deep(.#{$b}__icon--always) {
        color: $border-disabled;
      }
    }

    // check disabled 체크됨: 회색 아이콘 (파란색 대신)
    &.#{$b}__wrapper--disabled.#{$b}__wrapper--checked {
      :deep(.#{$b}__icon--always) {
        color: $text-300;
      }
    }
  }
</style>
