<template>
  <!--
    SwitchRoot는 내부적으로 <button>을 렌더한다.
    Radix Vue는 inheritAttrs:false로 처리되어 Vue scoped의 scope attribute가
    내부 <button>에 자동 전달되지 않는다.
    Checkbox.vue와 동일하게 얇은 래퍼(<span>)를 두고 :deep()으로 내부를 선택한다.
  -->
  <span class="switch__root">
    <SwitchRoot
      v-bind="rootAttrs"
      class="switch"
      :checked="modelValue"
      :disabled="disabled"
      @update:checked="emit('update:modelValue', $event)"
    >
      <SwitchThumb class="switch__thumb" />
    </SwitchRoot>
  </span>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    // [퍼블리셔] v-model 토글 상태
    modelValue?: boolean
    // [퍼블리셔] 비활성 여부
    disabled?: boolean
    // [퍼블리셔] 외부 <label for> 연결용 id
    id?: string
    // [연동] HTML form 전송 시 필드 name
    name?: string
    // [연동] HTML form 필수 여부
    required?: boolean
    // [연동] HTML form 전송 시 켜짐 상태일 때의 값
    value?: string
  }>(),
  {
    modelValue: false,
    disabled: false,
    id: undefined,
    name: undefined,
    required: false,
    value: 'on',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// ── attrs 위임 전략 ────────────────────────────────────────────────────
// Switch는 Portal/Content가 없는 단일 인터랙티브 요소.
// SwitchRoot = Track = 유일한 인터랙티브 요소이므로
// 모든 attrs(Root 전용 + aria-* + tabindex + data-* + id)를 SwitchRoot에 위임한다.
//
// 단, checked / disabled는 명시적 prop 바인딩으로 처리하므로 attrs에서 제외.
const attrs = useAttrs()

// checked / disabled는 명시적 바인딩으로 처리 — attrs에서 제외
const EXCLUDED_KEYS = ['checked', 'disabled'] as const

const rootAttrs = computed(() => {
  const result: Record<string, unknown> = {}

  // id: props.id 우선, 없으면 attrs.id 사용
  if (props.id !== undefined) {
    result.id = props.id
  }

  // Root 전용 폼 props: props에서 직접 매핑
  if (props.name !== undefined) result.name = props.name
  if (props.required) result.required = props.required
  // value는 항상 전달 (SwitchRoot 폼 전송용)
  result.value = props.value

  // attrs에서 excluded 키 제외 후 나머지 전부 포함
  // (aria-*, tabindex, data-* 등 인터랙티브 attrs 포함)
  for (const [k, v] of Object.entries(attrs)) {
    if ((EXCLUDED_KEYS as readonly string[]).includes(k)) continue
    // id는 props.id가 있을 때 attrs.id 무시
    if (k === 'id' && props.id !== undefined) continue
    result[k] = v
  }

  return result
})
</script>

<style lang="scss" scoped>
$b: 'switch';

// ── 래퍼 (span) ────────────────────────────────────────────────────────
// SwitchRoot는 Radix Vue 내부에서 <button>을 렌더.
// Vue scoped attribute는 이 래퍼에 붙으므로 :deep()으로 내부를 선택한다.
// display: contents — 레이아웃에 영향 없이 scoped attribute 주입 전용
.#{$b}__root {
  display: contents;
}

// ── Track (SwitchRoot → <button>) ─────────────────────────────────────
:deep(.#{$b}) {
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: 4.6rem;   // 46px — 토큰 없음, 직접 사용
  height: 2.6rem;  // 26px — 토큰 없음, 직접 사용
  border-radius: $radius-full;
  border: none;
  padding: 0;
  background-color: $text-300;  // unchecked: #C0C0C0
  cursor: pointer;
  outline: none;
  transition: background-color $duration-fast ease-in-out;

  // checked 상태 — Radix Vue data-state 속성으로 표현
  &[data-state="checked"] {
    background-color: $color-primary-hover;  // #00ADDB
  }

  // hover — enabled 상태에서만
  &:not([data-disabled]):hover {
    background-color: $text-400;  // unchecked hover: 살짝 어둡게 (#838b92)

    &[data-state="checked"] {
      background-color: $color-primary;  // checked hover: #0CB5E2
    }
  }

  // focus-visible — 접근성 필수 (outline: none 단독 금지)
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 0.2rem $color-primary;
  }

  // disabled — Radix Vue가 data-disabled 속성 자동 추가
  &[data-disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

// ── Thumb (SwitchThumb) ────────────────────────────────────────────────
:deep(.#{$b}__thumb) {
  display: block;
  width: 2.2rem;   // 22px — 토큰 없음, 직접 사용
  height: 2.2rem;  // 22px — 토큰 없음, 직접 사용
  border-radius: $radius-full;
  background-color: $bg-primary;  // 흰색
  box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.25);
  transform: translateX(0.2rem);  // unchecked: 왼쪽 여백 2px
  transition: transform $duration-fast ease-in-out;

  // checked: 오른쪽 (트랙 너비 46 - thumb 22 - 여백 2 = 22px)
  &[data-state="checked"] {
    transform: translateX(2.2rem);
  }
}

// ── active (press) — Thumb 살짝 축소 ──────────────────────────────────
// :deep() 안에서 자식 선택자도 :deep() 범위 밖이므로 별도 :deep() 선언 필요
:deep(.#{$b}:not([data-disabled]):active .#{$b}__thumb) {
  transform: translateX(0.2rem) scale(0.95);
}

:deep(.#{$b}:not([data-disabled]):active .#{$b}__thumb[data-state="checked"]) {
  transform: translateX(2.2rem) scale(0.95);
}
</style>
