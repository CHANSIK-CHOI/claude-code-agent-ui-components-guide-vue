<template>
  <SelectRoot
    v-bind="rootAttrs"
    :disabled="disabled"
    v-model="proxyValue"
    @update:open="emit('open-change', $event)"
  >
    <SelectTrigger
      v-bind="triggerAttrs"
      :id="selectId"
      class="select__trigger"
      :class="{
        'select__trigger--disabled': disabled,
        'select__trigger--error': error,
        'select__trigger--filter': isFilter,
      }"
      :aria-invalid="error ? 'true' : undefined"
    >
      <!-- placeholder 상태: proxyValue 없음 -->
      <span v-if="!proxyValue" class="select__placeholder">{{
        placeholder
      }}</span>
      <!-- filled 상태: proxyValue 있음 -->
      <span v-else class="select__value">{{ selectedLabel }}</span>
      <SelectIcon as-child>
        <span class="select__icon">
          <!-- filter variant — 기본 아래(↓) 방향, 열린 상태에서 rotate(180deg)로 위(↑) -->
          <Icon v-if="isFilter" size="sm"><SmallChevronDownSvg /></Icon>
          <!-- default variant — 기본 위(↑) 방향, rotate(180deg)로 아래(↓) -->
          <Icon v-else size="sm"><SmallChevronUpSvg /></Icon>
        </span>
      </SelectIcon>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        :class="['select__content', { 'select__content--filter': isFilter }]"
        position="popper"
        :side-offset="4"
        :body-lock="false"
      >
        <SelectScrollUpButton class="select__scrollBtn select__scrollBtn--up">
          <Icon size="sm"><SmallChevronUpSvg /></Icon>
        </SelectScrollUpButton>

        <SelectViewport class="select__viewport">
          <SelectItem
            v-for="option in options"
            :key="option.value"
            :class="['select__item', { 'select__item--filter': isFilter }]"
            :value="option.value"
            :disabled="option.disabled"
          >
            <SelectItemText class="select__itemText">
              {{ option.label }}
            </SelectItemText>
          </SelectItem>
        </SelectViewport>

        <SelectScrollDownButton
          class="select__scrollBtn select__scrollBtn--down"
        >
          <Icon size="sm"><SmallChevronDownSvg /></Icon>
        </SelectScrollDownButton>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<script lang="ts">
// Vue 3.4 호환 ID 생성 — useId()는 Vue 3.5+ API이므로 모듈 스코프 카운터로 대체
// 모듈 스코프: 파일이 한 번 로드될 때 초기화, 인스턴스 간 공유
let _selectUid = 0;
</script>

<script setup lang="ts">
import Icon from "@nd/components/icons/Icon.vue";
import SmallChevronUpSvg from "@nd/assets/icons/smallChevronUp.svg?component";
import SmallChevronDownSvg from "@nd/assets/icons/smallChevronDown.svg?component";

defineOptions({ inheritAttrs: false });

type SelectVariant = "default" | "filter";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    variant?: SelectVariant;
  }>(),
  {
    modelValue: undefined,
    placeholder: "",
    disabled: false,
    error: false,
    variant: "default",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
  "open-change": [open: boolean];
  change: [value: string];
}>();

// SelectRoot가 받는 Radix Vue 전용 props — 나머지는 SelectTrigger(button)로 위임
const SELECT_ROOT_PROPS = [
  "defaultValue",
  "open",
  "defaultOpen",
  "required",
  "name",
  "autocomplete",
  "dir",
] as const;

const attrs = useAttrs();

const _internalId = ref(`select-${++_selectUid}`);
const selectId = computed(
  () => (attrs.id as string | undefined) ?? _internalId.value,
);

const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([k]) =>
      (SELECT_ROOT_PROPS as readonly string[]).includes(k),
    ),
  ),
);

const triggerAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([k]) =>
        !(SELECT_ROOT_PROPS as readonly string[]).includes(k) && k !== "id",
    ),
  ),
);

// getter(string | undefined)와 setter 타입을 일치시켜야 writable computed 오버로드가 성립한다.
// SelectRoot는 modelValue?: string(undefined=미선택)이므로 동일하게 string | undefined로 둔다.
const proxyValue = computed<string | undefined>({
  get: () => props.modelValue,
  set: (val) => {
    // SelectRoot의 update:modelValue는 string만 emit하지만 setter 시그니처상 undefined도 들어올 수 있어 가드
    if (val === undefined) return;
    emit("update:modelValue", val);
    emit("change", val);
  },
});

const isFilter = computed(() => props.variant === "filter");

// 선택된 옵션의 label 텍스트 — SelectValue 대신 직접 렌더링하기 위해 필요
const selectedLabel = computed(
  () => props.options.find((o) => o.value === props.modelValue)?.label ?? "",
);
</script>

<!-- ──────────────────────────────────────────────────────────────────
  scoped 한 블록으로 통합:
  - Trigger 등 SFC 직접 요소 → 일반 scoped 선택자
  - SelectPortal(<body> 마운트) 내부 요소 → :deep() pseudo-class 사용
    :deep(.Foo)는 컴파일 시 [data-v-xxxxx] .Foo 로 변환됨
    Portal이 body에 마운트되어도 조상 중 data-v 속성이 있으면 매칭
  - position="popper" 시 --radix-select-trigger-width CSS 변수가
    SelectContent에 자동 주입됨 → width에 직접 참조
──────────────────────────────────────────────────────────────────── -->
<style lang="scss" scoped>
$b: "select";

.#{$b} {
  &__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 4.6rem; // 46px — Figma 명세 고정 높이
    padding: 0 $spacing-input-x;
    border: 1px solid $line-200;
    border-radius: $radius-md;
    background-color: $bg-primary;
    font-size: $font-size-body1;
    font-weight: $font-weight-regular;
    color: $text-900;
    cursor: pointer;

    &:focus-visible {
      outline: none;
      border-color: $border-input-focus;
      // box-shadow: 0 0 0 3px rgba(17, 17, 17, 0.12);
    }
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.6rem;
    height: 1.6rem;
    flex-shrink: 0;
    color: $text-600;
    transform: rotate(180deg); // 기본(닫힌 상태) → 아래(↓) 방향
    transition: transform $duration-fast ease;
  }
}

// Trigger 열린 상태 — Radix Vue가 data-state="open" 적용
.#{$b}__trigger[data-state="open"] {
  border-color: $border-input-focus;

  .#{$b}__icon {
    transform: rotate(0deg); // 열린 상태 → 위(↑) 방향
  }
}

// Trigger disabled modifier
.#{$b}__trigger--disabled {
  background-color: $bg-disabled;
  color: $text-300;
  cursor: not-allowed;

  .#{$b}__icon {
    color: $text-300;
  }
}

// Trigger error modifier
.#{$b}__trigger--error {
  border-color: $color-danger;
}

// placeholder 상태 — SelectValue 제거 후 v-if/v-else 직접 span 렌더링으로 교체.
// :deep() 없이 일반 scoped 선택자로 동작 (SFC 직접 렌더링 요소)
// flex: 1 + min-width: 0 — 아이콘 영역 침범 방지 (flex item 기본 min-width: auto override 필수)
.#{$b}__placeholder {
  flex: 1;
  min-width: 0;
  text-align: left;
  @include truncate;
  color: $text-600;
}

.#{$b}__value {
  flex: 1;
  min-width: 0;
  text-align: left;
  @include truncate;
  color: $text-900;
}

// ── SelectPortal 내부 요소 (:deep) ──────────────────────────────────
// SelectContent 등은 Radix Vue 컴포넌트가 내부에서 렌더링하므로
// 부모 scoped 속성(data-v-xxxxx)이 직접 붙지 않음.
// :deep()을 쓰면 [data-v-xxxxx] .select__content 로 컴파일되어
// Portal이 <body>에 마운트되어도 DOM 트리상 조상에 data-v가 있으면 매칭됨.
// $z-dropdown(100): 드롭다운 의미상 올바른 레이어 — 가이드 페이지에 stacking context 없음 확인 완료
:deep(.#{$b}__content) {
  pointer-events: auto; // Radix Vue Dialog가 body에 pointer-events:none을 주입할 때 SelectContent가 투과되지 않도록 명시
  background-color: $bg-primary;
  border: 1px solid $line-200;
  border-radius: $radius-md;
  overflow: hidden;
  width: var(--radix-select-trigger-width);
  max-height: var(--radix-select-content-available-height);
  z-index: $z-modal + 1; // SelectPortal은 <body>에 마운트 — modal($z-modal=300) 위에 표시되어야 함
}

:deep(.#{$b}__viewport) {
  padding: 0;
}

:deep(.#{$b}__item) {
  display: flex;
  align-items: center;
  height: 4.4rem; // 44px — Figma 명세 고정 높이
  padding: 0 $spacing-input-x;
  font-size: $font-size-body1;
  font-weight: $font-weight-regular;
  color: $text-600;
  cursor: pointer;
  outline: none;
  user-select: none;

  &[data-highlighted] {
    background-color: $bg-secondary;
    color: $text-900;
    outline: none;
  }

  &[data-state="checked"] {
    background-color: $bg-disabled;
    color: $text-900;
  }

  &[data-disabled] {
    background-color: $bg-disabled;
    color: $text-300;
    cursor: not-allowed;
    pointer-events: none;
  }
}

:deep(.#{$b}__itemText) {
  flex: 1;
}

:deep(.#{$b}__scrollBtn) {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.4rem;
  color: $text-600;
  cursor: default;
}

// ── filter variant ─────────────────────────────────────────────────
// filter variant 전용 예외 — Figma 40004271:6839
// 인라인 필터 컨트롤로 content 너비 기준이 디자인 의도 (style.md 일반 너비 규칙 예외)
.#{$b}__trigger--filter {
  width: fit-content; // style.md 일반 너비 규칙 예외 — filter variant 디자인 의도 (Figma 40004271:6839)
  height: 3rem;
  padding: 0.6rem $spacing-sm 0.6rem 1rem; // 상하 6px / 우 8px($spacing-sm) / 좌 10px
  border-radius: 0.6rem; // 6px — $radius-sm(4px) 토큰 불일치, 직접 사용
  font-size: $font-size-body4; // 14px — Figma 40004271:6839
  gap: 0.4rem; // 4px — 텍스트·아이콘 사이 간격
  justify-content: flex-start; // space-between override — fit-content 너비에서 gap으로 제어
  color: $text-400;

  .#{$b}__icon {
    transform: rotate(0deg); // filter SVG는 기본 아래(↓) 방향
  }
  &:disabled {
    color: $text-300;
  }
}

.#{$b}__trigger--filter[data-state="open"] {
  .#{$b}__icon {
    transform: rotate(180deg); // 열린 상태 → 위(↑) 방향
  }
}

:deep(.#{$b}__content--filter) {
  border-radius: 0.6rem; // 6px — Figma 40004271:6839 기준, spec §9 명시. $radius-sm(4px) 토큰 불일치로 직접 사용
  min-width: var(
    --radix-select-trigger-width
  ); // Trigger 너비 최소 보장 (position="popper" 시 자동 주입)
  max-width: var(
    --radix-select-content-available-width
  ); // 화면 가용 너비 초과 방지
}

:deep(.#{$b}__item--filter) {
  height: 3.6rem; // 36px — filter variant 아이템 높이
  padding: 0 1rem; // 좌우 10px
  font-size: $font-size-body4;

  .#{$b}__itemText {
    @include truncate; // max-width 초과 시 말줄임 처리
  }
}
</style>
