<template>
  <!-- ── radio type ───────────────────────────────────────────────────── -->
  <RadioGroupRoot
    v-if="props.type === 'radio'"
    v-bind="$attrs"
    class="optionButtonGroup"
    :class="{ 'optionButtonGroup--rowColumns': useRowColumns }"
    :style="useRowColumns ? colorStyle : gridStyle"
    :model-value="radioValue"
    :disabled="props.disabled"
    :name="props.name"
    :required="props.required"
    @update:model-value="onRadioChange"
  >
    <!-- rowColumns 지정 시: 행 그룹별 래퍼 div로 분리 렌더 -->
    <template v-if="useRowColumns">
      <div
        v-for="(group, groupIndex) in rowGroups"
        :key="groupIndex"
        class="optionButtonGroup__row"
        :style="{ gridTemplateColumns: `repeat(${group.columns}, 1fr)` }"
      >
        <RadioGroupItem
          v-for="item in group.items"
          :key="item.value"
          class="optionButtonGroup__item"
          :class="{ 'optionButtonGroup__item--selected': isRadioSelected(item.value) }"
          :style="
            isRadioSelected(item.value) && item.activeColor
              ? { backgroundColor: item.activeColor, borderColor: item.activeColor }
              : {}
          "
          :value="item.value"
          :disabled="props.disabled || item.disabled"
          :aria-label="item.label"
        >
          <span v-if="item.badge" class="optionButtonGroup__badge" aria-hidden="true">{{ item.badge }}</span>
          <template v-if="isRadioSelected(item.value) && $slots['selected-content']">
            <slot name="selected-content" :item="item" />
          </template>
          <template v-else>
            <slot v-if="$slots.content" name="content" :item="item" :is-selected="isRadioSelected(item.value)" />
            <template v-else>
              <img
                v-if="item.icon"
                :src="item.icon"
                :alt="item.showLabel ? '' : (item.label ?? '')"
                class="optionButtonGroup__icon"
                :class="{ 'optionButtonGroup__icon--invert': isRadioSelected(item.value) && item.invertIconOnSelect }"
              />
              <span v-if="!item.icon || item.showLabel" class="optionButtonGroup__label">{{ item.label }}</span>
              <span v-if="item.subLabel" class="optionButtonGroup__subLabel">{{ item.subLabel }}</span>
            </template>
          </template>
        </RadioGroupItem>
      </div>
    </template>

    <!-- rowColumns 미지정 시: 기존 균등 그리드 -->
    <template v-else>
      <RadioGroupItem
        v-for="item in props.items"
        :key="item.value"
        class="optionButtonGroup__item"
        :class="{ 'optionButtonGroup__item--selected': isRadioSelected(item.value) }"
        :style="
          isRadioSelected(item.value) && item.activeColor
            ? { backgroundColor: item.activeColor, borderColor: item.activeColor }
            : {}
        "
        :value="item.value"
        :disabled="props.disabled || item.disabled"
        :aria-label="item.label"
      >
        <!-- badge 오버레이 -->
        <span v-if="item.badge" class="optionButtonGroup__badge" aria-hidden="true">{{ item.badge }}</span>

        <!-- selected-content 슬롯: 선택 시 + 슬롯 있을 때만 표시 -->
        <template v-if="isRadioSelected(item.value) && $slots['selected-content']">
          <slot name="selected-content" :item="item" />
        </template>
        <!-- content 슬롯 또는 기본 콘텐츠 -->
        <template v-else>
          <slot v-if="$slots.content" name="content" :item="item" :is-selected="isRadioSelected(item.value)" />
          <template v-else>
            <img
              v-if="item.icon"
              :src="item.icon"
              :alt="item.showLabel ? '' : (item.label ?? '')"
              class="optionButtonGroup__icon"
              :class="{ 'optionButtonGroup__icon--invert': isRadioSelected(item.value) && item.invertIconOnSelect }"
            />
            <span v-if="!item.icon || item.showLabel" class="optionButtonGroup__label">{{ item.label }}</span>
            <span v-if="item.subLabel" class="optionButtonGroup__subLabel">{{ item.subLabel }}</span>
          </template>
        </template>
      </RadioGroupItem>
    </template>
  </RadioGroupRoot>

  <!-- ── checkbox type ────────────────────────────────────────────────── -->
  <div
    v-else
    v-bind="$attrs"
    class="optionButtonGroup"
    :class="{ 'optionButtonGroup--rowColumns': useRowColumns }"
    :style="useRowColumns ? colorStyle : gridStyle"
    role="group"
  >
    <!-- rowColumns 지정 시: 행 그룹별 래퍼 div로 분리 렌더 -->
    <template v-if="useRowColumns">
      <div
        v-for="(group, groupIndex) in rowGroups"
        :key="groupIndex"
        class="optionButtonGroup__row"
        :style="{ gridTemplateColumns: `repeat(${group.columns}, 1fr)` }"
      >
        <CheckboxRoot
          v-for="item in group.items"
          :key="item.value"
          class="optionButtonGroup__item"
          :class="{ 'optionButtonGroup__item--selected': isCheckboxSelected(item.value) }"
          :style="
            isCheckboxSelected(item.value) && item.activeColor
              ? { backgroundColor: item.activeColor, borderColor: item.activeColor }
              : {}
          "
          :checked="isCheckboxSelected(item.value)"
          :disabled="props.disabled || item.disabled"
          :name="props.name"
          :value="item.value"
          :aria-label="item.label"
          @update:checked="(val) => onCheckboxChange(item.value, val)"
        >
          <span v-if="item.badge" class="optionButtonGroup__badge" aria-hidden="true">{{ item.badge }}</span>
          <template v-if="isCheckboxSelected(item.value) && $slots['selected-content']">
            <slot name="selected-content" :item="item" />
          </template>
          <template v-else>
            <slot v-if="$slots.content" name="content" :item="item" :is-selected="isCheckboxSelected(item.value)" />
            <template v-else>
              <img
                v-if="item.icon"
                :src="item.icon"
                :alt="item.showLabel ? '' : (item.label ?? '')"
                class="optionButtonGroup__icon"
                :class="{
                  'optionButtonGroup__icon--invert': isCheckboxSelected(item.value) && item.invertIconOnSelect,
                }"
              />
              <span v-if="!item.icon || item.showLabel" class="optionButtonGroup__label">{{ item.label }}</span>
              <span v-if="item.subLabel" class="optionButtonGroup__subLabel">{{ item.subLabel }}</span>
            </template>
          </template>
        </CheckboxRoot>
      </div>
    </template>

    <!-- rowColumns 미지정 시: 기존 균등 그리드 -->
    <template v-else>
      <CheckboxRoot
        v-for="item in props.items"
        :key="item.value"
        class="optionButtonGroup__item"
        :class="{ 'optionButtonGroup__item--selected': isCheckboxSelected(item.value) }"
        :style="
          isCheckboxSelected(item.value) && item.activeColor
            ? { backgroundColor: item.activeColor, borderColor: item.activeColor }
            : {}
        "
        :checked="isCheckboxSelected(item.value)"
        :disabled="props.disabled || item.disabled"
        :name="props.name"
        :value="item.value"
        :aria-label="item.label"
        @update:checked="(val) => onCheckboxChange(item.value, val)"
      >
        <!-- badge 오버레이 -->
        <span v-if="item.badge" class="optionButtonGroup__badge" aria-hidden="true">{{ item.badge }}</span>

        <!-- selected-content 슬롯: 선택 시 + 슬롯 있을 때만 표시 -->
        <template v-if="isCheckboxSelected(item.value) && $slots['selected-content']">
          <slot name="selected-content" :item="item" />
        </template>
        <!-- content 슬롯 또는 기본 콘텐츠 -->
        <template v-else>
          <slot v-if="$slots.content" name="content" :item="item" :is-selected="isCheckboxSelected(item.value)" />
          <template v-else>
            <img
              v-if="item.icon"
              :src="item.icon"
              :alt="item.showLabel ? '' : (item.label ?? '')"
              class="optionButtonGroup__icon"
              :class="{ 'optionButtonGroup__icon--invert': isCheckboxSelected(item.value) && item.invertIconOnSelect }"
            />
            <span v-if="!item.icon || item.showLabel" class="optionButtonGroup__label">{{ item.label }}</span>
            <span v-if="item.subLabel" class="optionButtonGroup__subLabel">{{ item.subLabel }}</span>
          </template>
        </template>
      </CheckboxRoot>
    </template>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ inheritAttrs: false });

  export interface OptionButtonItem {
    value: string;
    label?: string;
    /** label 아래에 caption 크기로 표시되는 보조 텍스트. 슬롯 미사용(기본 콘텐츠) 시에만 표시 */
    subLabel?: string;
    badge?: string;
    disabled?: boolean;
    /** 아이콘 이미지 src (SVG import 또는 URL) */
    icon?: string;
    /** icon과 함께 label 텍스트도 표시할지 여부. icon 없으면 항상 표시 */
    showLabel?: boolean;
    /** 선택 시 icon에 brightness(0) invert(1) 필터 적용 */
    invertIconOnSelect?: boolean;
    /** 아이템별 선택 배경·테두리 색상. 미지정 시 selectedColor prop 또는 기본 $text-900 사용 */
    activeColor?: string;
    /** 슬롯 커스텀 콘텐츠에서 사용하는 이모지 메타. 기본 렌더에는 미사용 */
    emoji?: string;
  }

  export type OptionButtonGroupType = 'radio' | 'checkbox';

  const props = withDefaults(
    defineProps<{
      // [퍼블리셔] radio: 단일 선택 / checkbox: 복수 선택
      type?: OptionButtonGroupType;
      // [연동] v-model 바인딩. radio: string, checkbox: string[]
      modelValue?: string | string[];
      // [연동] 버튼 목록 데이터
      items?: OptionButtonItem[];
      // [퍼블리셔] 그리드 열 수. rowColumns 미지정 시 균등 그리드로 동작
      columns?: 1 | 2 | 3;
      // [퍼블리셔] 행마다 열 수를 다르게 지정. 예: [3, 2, 1] → 1행 3열, 2행 2열, 3행 1열. 지정 시 columns 무시
      rowColumns?: number[];
      // [퍼블리셔] 최대 행 수. rowColumns 지정 시 maxRows번째 행 그룹까지만 노출
      maxRows?: number;
      // [퍼블리셔] 그룹 전체 선택 색상 커스터마이징. 아이템별 activeColor가 우선 적용됨
      selectedColor?: string;
      // [퍼블리셔] 그룹 전체 선택 불가
      disabled?: boolean;
      // [연동] 폼 name 속성
      name?: string;
      // [연동] 폼 필수 검증 여부
      required?: boolean;
    }>(),
    {
      type: 'radio',
      modelValue: undefined,
      items: () => [],
      columns: 2,
      rowColumns: undefined,
      maxRows: undefined,
      selectedColor: undefined,
      disabled: false,
      name: undefined,
      required: false,
    }
  );

  const emit = defineEmits<{
    // [퍼블리셔] v-model 갱신
    'update:modelValue': [value: string | string[]];
    // [연동] 개발자가 이 이벤트를 수신해 API 호출
    change: [value: string | string[]];
  }>();

  // ── 선택 상태 판별 ─────────────────────────────────────────────────────
  const radioValue = computed(() => (typeof props.modelValue === 'string' ? props.modelValue : undefined));

  function isRadioSelected(value: string): boolean {
    return radioValue.value === value;
  }

  function isCheckboxSelected(value: string): boolean {
    if (!Array.isArray(props.modelValue)) return false;
    return props.modelValue.includes(value);
  }

  // ── 이벤트 핸들러 ──────────────────────────────────────────────────────
  function onRadioChange(val: string) {
    emit('update:modelValue', val);
    emit('change', val);
  }

  function onCheckboxChange(value: string, checked: boolean | 'indeterminate') {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    const next = checked === true ? [...current, value] : current.filter((v) => v !== value);
    emit('update:modelValue', next);
    emit('change', next);
  }

  // ── 그리드 스타일 ──────────────────────────────────────────────────────
  // columns CSS custom property + selectedColor custom property를 인라인 스타일로 주입
  const gridStyle = computed(() => ({
    '--option-columns': props.columns,
    '--option-selected-color': props.selectedColor ?? undefined,
  }));

  // selectedColor만 전달 (rowColumns 사용 시 컨테이너는 grid 아님 — 행 그룹 래퍼가 각자 grid)
  const colorStyle = computed(() => ({
    '--option-selected-color': props.selectedColor ?? undefined,
  }));

  // ── rowColumns 행 그룹 분리 ────────────────────────────────────────────
  // rowColumns가 유효한 배열(1개 이상)인 경우만 활성화. 빈 배열이면 columns 기본 동작으로 폴백.
  const useRowColumns = computed(() => Array.isArray(props.rowColumns) && props.rowColumns.length > 0);

  interface RowGroup {
    columns: number;
    items: OptionButtonItem[];
  }

  // 아이템을 rowColumns 누적합 기준으로 행 그룹 배열로 분리
  const rowGroups = computed<RowGroup[]>(() => {
    if (!useRowColumns.value) return [];

    const allItems = props.items;
    const colDefs = props.rowColumns as number[];
    const groups: RowGroup[] = [];
    let cursor = 0;

    for (const colCount of colDefs) {
      if (cursor >= allItems.length) break;
      groups.push({
        columns: colCount,
        items: allItems.slice(cursor, cursor + colCount),
      });
      cursor += colCount;
    }

    // 누적합 < 전체 아이템 수 → 나머지는 1열로 이어 붙임
    if (cursor < allItems.length) {
      groups.push({
        columns: 1,
        items: allItems.slice(cursor),
      });
    }

    // maxRows 적용: rowGroups 슬라이싱
    if (props.maxRows !== undefined && props.maxRows > 0) {
      return groups.slice(0, props.maxRows);
    }

    return groups;
  });
</script>

<style lang="scss" scoped>
  $b: 'optionButtonGroup';

  // ── 그리드 컨테이너 ─────────────────────────────────────────────────────
  // RadioGroupRoot / div 모두 같은 클래스를 공유.
  // Radix Vue RadioGroupRoot는 <div>를 렌더하므로 scoped attr 정상 적용.
  .#{$b} {
    display: grid;
    grid-template-columns: repeat(var(--option-columns, 2), 1fr);
    gap: $spacing-xs;
    width: 100%;
  }

  // ── rowColumns 행 그룹 래퍼 ────────────────────────────────────────────
  // rowColumns 지정 시 컨테이너(.optionButtonGroup)는 단순 flex 컬럼으로 전환되고,
  // 각 행 그룹(__row)이 독립 grid를 가진다.
  // Radix Vue RadioGroupRoot 내부 렌더 구조상 :deep() 적용.
  :deep(.#{$b}__row) {
    display: grid;
    gap: $spacing-xs;
    // gridTemplateColumns는 인라인 스타일로 주입
  }

  // rowColumns 활성 시 컨테이너 grid → flex 전환
  // useRowColumns가 true이면 --rowColumns modifier 클래스가 붙고,
  // 컨테이너 자체는 flex column으로 행 그룹들을 세로 나열한다.
  .#{$b}--rowColumns {
    display: flex;
    flex-direction: column;
  }

  // ── 버튼 아이템 ────────────────────────────────────────────────────────
  // RadioGroupItem → <button role="radio">
  // CheckboxRoot   → <button role="checkbox">
  // 둘 다 Radix Vue 내부에서 <button>을 렌더하므로 :deep() 적용.
  //
  // Radix Vue가 inheritAttrs:false + 내부 button 렌더 구조이므로
  // 컴포넌트에 부여한 class(.optionButtonGroup__item)가
  // Radix Vue 내부 <button>에 scope attribute 없이 전달될 수 있음.
  // → :deep() 사용으로 scoped 경계 우회.
  :deep(.#{$b}__item) {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    width: 100%;
    height: 4.6rem;
    padding: 0 2rem;
    border: 1.5px solid $line-200;
    border-radius: $radius-md;
    background-color: $bg-primary;
    font-size: $font-size-body3;
    font-weight: $font-weight-medium;
    line-height: $line-height-snug;
    color: $text-800;
    text-align: center;
    cursor: pointer;
    outline: none;
    transition:
      background-color $duration-fast ease-in-out,
      border-color $duration-fast ease-in-out,
      color $duration-fast ease-in-out;

    // 선택 상태 — CSS custom property로 커스터마이징 가능. 아이템별 activeColor는 인라인 style로 덮어씀
    &.#{$b}__item--selected {
      background-color: var(--option-selected-color, #{$text-900});
      border-color: var(--option-selected-color, #{$text-900});
      color: $text-white;
    }

    // 포커스 표시 (접근성)
    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 0.2rem $color-primary;
    }

    // disabled — Radix Vue가 data-disabled 자동 부여
    &[data-disabled] {
      cursor: not-allowed;
    }
  }

  // ── 기본 라벨 텍스트 (슬롯 미사용 시) ──────────────────────────────────
  // RadioGroupItem / CheckboxRoot 내부에 있으므로 :deep() 적용
  :deep(.#{$b}__label) {
    display: block;
    font-size: $font-size-body3;
    font-weight: $font-weight-medium;
    line-height: $line-height-snug;
    color: inherit;
  }

  // ── 보조 텍스트 (subLabel, 슬롯 미사용 시) ──────────────────────────────
  :deep(.#{$b}__subLabel) {
    display: block;
    font-size: $font-size-caption1;
    font-weight: $font-weight-regular;
    color: $text-600;
  }

  // subLabel — 선택 시 흰색으로 전환
  :deep(.#{$b}__item--selected .#{$b}__subLabel) {
    color: $text-white;
  }

  // ── 아이콘 이미지 ───────────────────────────────────────────────────────
  // item.icon 지정 시 렌더되는 <img> 요소
  :deep(.#{$b}__icon) {
    max-height: 2rem;
    width: auto;
    object-fit: contain;
    flex-shrink: 0;
    transition: filter $duration-fast ease-in-out;
  }

  // 선택 + invertIconOnSelect=true 시 아이콘 반전 (어두운 배경 대응)
  :deep(.#{$b}__icon--invert) {
    filter: brightness(0) invert(1);
  }

  // ── 배지 오버레이 ───────────────────────────────────────────────────────
  // 버튼 우측 상단에 절대 위치
  :deep(.#{$b}__badge) {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 0.8rem 0.6rem 0.6rem 0.6rem;
    background: rgba(17, 17, 17, 0.7);
    color: $text-white;
    font-size: 1.1rem;
    font-weight: $font-weight-regular;
    line-height: 1;
    pointer-events: none;
    height: 2rem;
    display: inline-flex;
    align-items: center;
    padding: 0.4rem;
  }
</style>
