<template>
  <RadioGroupRoot
    v-bind="rootAttrs"
    class="radioGroup"
    :class="`radioGroup--${orientation}`"
    :model-value="props.modelValue"
    :disabled="disabled"
    :required="required"
    :orientation="orientation"
    :aria-invalid="error ? 'true' : undefined"
    @update:model-value="handleModelValueUpdate"
  >
    <label
      v-for="item in items"
      :key="item.value"
      :for="`${groupId}-${item.value}`"
      class="radioGroup__item"
      :class="{
        'radioGroup__item--disabled': disabled || item.disabled,
        'radioGroup__item--error': error,
      }"
    >
      <RadioGroupItem
        :id="`${groupId}-${item.value}`"
        class="radioGroup__control"
        :class="{
          'radioGroup__control--error': error,
        }"
        :value="item.value"
        :disabled="disabled || item.disabled"
      >
        <RadioGroupIndicator class="radioGroup__indicator" />
      </RadioGroupItem>
      <span class="radioGroup__label">{{ item.label }}</span>
    </label>
  </RadioGroupRoot>
</template>

<script setup lang="ts">
  defineOptions({ inheritAttrs: false })

  export interface RadioGroupItem {
    value: string
    label: string
    disabled?: boolean
  }

  const props = withDefaults(
    defineProps<{
      // [퍼블리셔] v-model 선택 값
      modelValue?: string
      // [연동] 라디오 아이템 배열
      items?: RadioGroupItem[]
      // [퍼블리셔] 아이템 나열 방향
      orientation?: 'horizontal' | 'vertical'
      // [퍼블리셔] 그룹 전체 비활성
      disabled?: boolean
      // [연동] 폼 필수 여부
      required?: boolean
      // [퍼블리셔] 에러 상태
      error?: boolean
    }>(),
    {
      modelValue: undefined,
      items: () => [],
      orientation: 'horizontal',
      disabled: false,
      required: false,
      error: false,
    }
  )

  const emit = defineEmits<{
    // [퍼블리셔] v-model 갱신
    'update:modelValue': [value: string]
    // [연동] 개발자가 이 이벤트를 수신해 폼 처리
    change: [value: string]
  }>()

  // ── attrs 위임 전략 ────────────────────────────────────────────────────
  // RadioGroup은 Portal/Content가 없는 단순 그룹 컴포넌트.
  // 1단계 Root 전용 props + 2단계 인터랙티브 attrs 모두 RadioGroupRoot에 위임.
  // spec §4 attrs 위임 설계: 1단계(name, dir, loop, defaultValue) + 2단계(aria-*, tabindex 등)
  // 모두 같은 목적지(RadioGroupRoot)이므로 단일 rootAttrs로 통합.
  //
  // disabled / required / orientation / modelValue 는 명시적 prop 바인딩으로 처리 — attrs 제외.
  const attrs = useAttrs()

  const EXCLUDED_KEYS = [
    'disabled',
    'required',
    'orientation',
    'modelValue',
    'defaultValue',
    'onUpdate:modelValue',
  ] as const

  const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([k]) => !(EXCLUDED_KEYS as readonly string[]).includes(k)))
  )

  // ── 그룹 고유 id prefix ────────────────────────────────────────────────
  // label for + item id 연결용. 외부에서 id attr 전달 시 그것을 prefix로 사용.
  const _nuxtId = useId()
  const groupId = computed(() => (attrs.id as string | undefined) ?? `radioGroup-${_nuxtId}`)

  // Radix Vue가 화살표 키/클릭으로 선택 변경 시 emit하는 이벤트를 직접 핸들링
  function handleModelValueUpdate(val: string) {
    emit('update:modelValue', val) // 외부 v-model 동기화
    emit('change', val) // [연동] 개발자 수신용
  }
</script>

<style lang="scss" scoped>
  $b: 'radioGroup';

  // ── Root (RadioGroupRoot → <div role="radiogroup">) ────────────────────
  // Radix Vue RadioGroupRoot는 <div>를 렌더하므로 scope attribute 정상 적용됨.
  // :deep() 불필요 — scoped 선택자 직접 사용 가능.
  .#{$b} {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
  }

  .#{$b}--horizontal {
    flex-direction: row;
    gap: 2rem; // 20px — spec §6 horizontal gap
  }

  .#{$b}--vertical {
    flex-direction: column;
    gap: $spacing-sm; // 8px — spec §6 vertical gap
  }

  // ── Item (label 래퍼) ──────────────────────────────────────────────────
  .#{$b}__item {
    display: inline-flex; // Checkbox 예외와 동일 — 콘텐츠 너비만큼만 차지
    align-items: center;
    gap: 0.5rem; // 5px — spec §8 라디오↔라벨 gap
    cursor: pointer;
  }

  .#{$b}__item--disabled {
    cursor: not-allowed;
    opacity: 0.4; // spec §5 disabled opacity
  }

  // ── Control (RadioGroupItem → <button role="radio">) ──────────────────
  // Radix Vue RadioGroupItem은 <button>을 렌더.
  // 래퍼(.radioGroup__item = <label>)에 scope attribute가 있으므로 :deep()으로 선택.
  :deep(.#{$b}__control) {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 2.2rem; // 22px — spec §8 라디오 아이콘 크기
    height: 2.2rem; // 22px — spec §8 라디오 아이콘 크기
    border-radius: $radius-full;
    border: 1.5px solid $text-300; // 미선택 기본: #C0C0C0
    background-color: $bg-primary;
    padding: 0;
    cursor: pointer;
    outline: none; // :focus-visible 블록에서 box-shadow로 대체 포커스 스타일 제공
    transition:
      border-color $duration-fast ease-in-out,
      background-color $duration-fast ease-in-out;

    // checked 상태 — Radix Vue data-state 속성
    &[data-state='checked'] {
      border-color: $color-primary-hover; // #00ADDB
      background-color: $color-primary-hover; // #00ADDB
    }

    // hover — enabled 상태에서만
    &:not([data-disabled]):hover {
      border-color: $color-primary; // #0CB5E2 — opacity 대신 더 밝은 브랜드색
    }

    &:not([data-disabled]):hover[data-state='checked'] {
      border-color: $color-primary;
      background-color: $color-primary;
    }

    // focus-visible — 접근성 필수
    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 0.2rem $color-primary;
    }

    // disabled — Radix Vue data-disabled 자동 추가
    &[data-disabled] {
      cursor: not-allowed;
      // opacity는 부모 .radioGroup__item--disabled에서 처리
    }
  }

  // error 상태 — .radioGroup__item--error 하위의 control에 적용
  .#{$b}__item--error {
    :deep(.#{$b}__control) {
      border-color: $color-danger;

      &[data-state='checked'] {
        border-color: $color-danger;
        background-color: $color-danger;
      }

      &:not([data-disabled]):hover {
        border-color: $color-danger;
      }

      &:not([data-disabled]):hover[data-state='checked'] {
        border-color: $color-danger;
        background-color: $color-danger;
      }
    }
  }

  // ── Indicator (RadioGroupIndicator — checked 시에만 렌더됨) ────────────
  // RadioGroupIndicator는 checked 상태에서만 DOM에 나타남 (Radix Vue 제어).
  // 내부 원을 CSS로 구현: 8×8px 흰 원
  :deep(.#{$b}__indicator) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    border-radius: $radius-full;
    background-color: $bg-primary; // 흰 원 — checked 배경(primary)과 대비
  }

  // ── Label (span) ───────────────────────────────────────────────────────
  .#{$b}__label {
    font-size: $font-size-body2; // 15px — spec §8
    font-weight: $font-weight-regular; // 400 — spec §8
    line-height: $line-height-base;
    color: $text-600; // #666666 — spec §8 라벨 텍스트 색상
  }
</style>
