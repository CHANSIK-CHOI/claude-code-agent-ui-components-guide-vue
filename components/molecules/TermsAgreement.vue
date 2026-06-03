<template>
  <div v-bind="$attrs" class="termsAgreement">
    <!-- ① 전체 동의 영역 -->
    <div class="termsAgreement__allWrap">
      <Checkbox :model-value="allChecked" type="box" @update:model-value="onAllCheckedChange">
        {{ allCheckText }}</Checkbox
      >
    </div>

    <!-- ③ 항목 컨테이너 — hasAccordionItems 기준으로 컨테이너만 분기 (ul/li 구조 없음) -->
    <!--   accordion 있을 때: Accordion 컴포넌트가 컨테이너 역할                          -->
    <!--   accordion 없을 때: 순수 div 컨테이너 (Accordion 미마운트)                      -->
    <component :is="hasAccordionItems ? Accordion : 'div'" class="termsAgreement__items" v-bind="accordionProps">
      <template v-for="item in items" :key="item.value">
        <!-- ③-accordion: accordion 타입 → AccordionItem (hasAccordionItems === true 보장) -->
        <AccordionItem v-if="item.type === 'accordion'" :value="item.value" class="termsAgreement__item">
          <div class="termsAgreement__accordionHead">
            <!-- ③-a 체크 영역 -->
            <Checkbox
              class="termsAgreement__checkbox"
              :model-value="checkedMap[item.value] ?? false"
              type="box"
              @update:model-value="(val) => onItemCheckedChange(item.value, val)"
            >
              <em v-if="item.required" class="termsAgreement__required" aria-hidden="true">[필수] </em>{{ item.label }}
            </Checkbox>

            <!-- ③-c 아코디언 트리거 -->
            <AccordionTrigger
              :head-trigger="true"
              :aria-label="`${item.label} 펼치기`"
              class="termsAgreement__accordionTrigger"
            >
              <Icon size="sm" class="termsAgreement__accordionIcon">
                <SmallChevronDownSvg aria-hidden="true" />
              </Icon>
            </AccordionTrigger>
          </div>

          <AccordionContent :content-animation="true">
            <div class="termsAgreement__accordionContent" v-html="item.content" />
          </AccordionContent>
        </AccordionItem>

        <!-- ③-plain: checkbox / popup 타입 → 일반 div (단일 출처 — 두 컨테이너 브랜치 공유) -->
        <div v-else class="termsAgreement__item">
          <div class="termsAgreement__itemWrap">
            <!-- ③-a 체크 영역 -->
            <Checkbox
              class="termsAgreement__checkbox"
              :model-value="checkedMap[item.value] ?? false"
              type="box"
              @update:model-value="(val) => onItemCheckedChange(item.value, val)"
            >
              <em v-if="item.required" class="termsAgreement__required" aria-hidden="true">[필수] </em>{{ item.label }}
            </Checkbox>

            <!-- ③-b 팝업 버튼 -->
            <button
              v-if="item.type === 'popup'"
              type="button"
              class="termsAgreement__popupBtn"
              :aria-label="`${item.label} 내용 보기`"
              @click="emit('popup-click', item.value)"
            >
              <Icon size="sm">
                <SmallChevronRightSvg aria-hidden="true" />
              </Icon>
            </button>
          </div>
        </div>
      </template>
    </component>
  </div>
</template>

<script setup lang="ts">
  import { Checkbox } from '@nd/components/atoms';
  import Icon from '@nd/components/icons/Icon.vue';
  import SmallChevronRightSvg from '@nd/assets/icons/smallChevronRight.svg?skipsvgo';
  import SmallChevronDownSvg from '@nd/assets/icons/smallChevronDown.svg?skipsvgo';
  import Accordion, { AccordionItem, AccordionTrigger, AccordionContent } from './Accordion.vue';

  defineOptions({ inheritAttrs: false });

  export interface TermsItem {
    value: string;
    label: string;
    required: boolean;
    type: 'checkbox' | 'popup' | 'accordion';
    content?: string;
  }

  export interface CheckedChangePayload {
    value: string;
    checked: boolean;
  }

  const props = withDefaults(
    defineProps<{
      // [연동] 개발자가 약관 항목 데이터로 채울 항목
      items?: TermsItem[];
      // [퍼블리셔] 전체 동의 상태 (v-model:allChecked 연동)
      allChecked?: boolean;
      allCheckText?: string;
    }>(),
    {
      items: () => [],
      allChecked: false,
      allCheckText: '전체 동의',
    }
  );

  const emit = defineEmits<{
    // [퍼블리셔] 전체 동의 상태 변경
    'update:allChecked': [value: boolean];
    // [연동] 개발자가 이 이벤트를 수신해 개별 체크 상태 처리
    'update:checked': [payload: CheckedChangePayload];
    // [연동] 개발자가 이 이벤트를 수신해 팝업 열기 처리
    'popup-click': [value: string];
    // [연동] accordion 타입 항목이 펼쳐질 때 (열릴 때만 emit)
    'accordion-open': [value: string];
    // [퍼블리셔] accordion 열림/닫힘 상태 변경 시 (swiper height 갱신 등 레이아웃 처리용)
    'accordion-change': [];
  }>();

  // accordion 타입 항목이 하나라도 있는지 여부 — 컨테이너 분기에 사용
  // React의 useMemo(() => items.some(...), [items])와 동일
  const hasAccordionItems = computed(() => props.items.some((item) => item.type === 'accordion'));

  // 개별 항목 체크 상태 내부 맵 (value → boolean)
  // React의 useState<Record<string, boolean>>과 동일
  const checkedMap = ref<Record<string, boolean>>({});

  // 단일 Accordion의 이전 열림 상태 추적 — 새로 추가된 value만 accordion-open emit하기 위함
  // 템플릿 바인딩 없는 비교용 캐시이므로 ref 불필요 — let으로 선언
  let prevOpenValues: string[] = [];

  // items 변경 시 checkedMap 동기화
  // - 기존 항목: 기존 체크 상태 유지
  // - 신규 항목: allChecked 값으로 초기화 (false 고정 아님)
  // - 제거된 항목: 자동 정리
  // React의 useEffect([items]) 패턴과 동일. emit 없음 — 마운트 초기화는 여기서만 담당.
  //
  // 주의: isHandlingChange guard를 여기에 적용하지 않는다.
  // isHandlingChange는 "사용자 전체 동의 인터랙션(onAllCheckedChange) 흐름" 가드이며,
  // items watch는 "항목 구조 변경에 따른 checkedMap 재구성" 책임으로 두 관심사가 다르다.
  // items prop이 외부에서 바뀌면 (allChecked와 같은 tick이더라도) 항상 checkedMap을 재구성해야 한다.
  watch(
    () => props.items,
    (newItems) => {
      const newMap: Record<string, boolean> = {};
      for (const item of newItems) {
        newMap[item.value] = checkedMap.value[item.value] ?? props.allChecked;
      }
      checkedMap.value = newMap;
    },
    { immediate: true }
  );

  // WARN-3 guard 플래그: onAllCheckedChange handler 실행 중 발생하는 prop 변경을
  // watch가 재진입 처리하지 않도록 차단 — handler → emit → 부모 prop 업데이트 → watch 재진입
  // 흐름에서 checkedMap 동일 값 2차 갱신(불필요한 반응성 트리거)을 방지한다.
  // React의 useRef(false)로 중복 업데이트를 막는 패턴과 동일.
  let isHandlingChange = false;

  // allChecked prop 외부 변경 시 checkedMap 내부 상태 동기화
  // immediate: true 제거 — 마운트 초기화는 items watch(immediate:true)가 담당
  // emit 없음 — update:checked / update:allChecked emit은 onAllCheckedChange에서만 수행
  //
  // ⚠️ 설계 계약 (spec §7 내부 상태 관리 참조):
  //   allChecked=true 외부 주입: checkedMap 전체를 true로 동기화 (전체 선택 강제)
  //   allChecked=false 외부 주입: checkedMap 변경하지 않음 (개별 상태 유지)
  //   "전체 해제"는 사용자 인터랙션(onAllCheckedChange(false)) 흐름으로만 가능
  watch(
    () => props.allChecked,
    (newVal) => {
      if (isHandlingChange) return; // handler 흐름에서 온 prop 변경은 무시 (WARN-3)
      if (!newVal) return; // false 외부 주입은 개별 상태 유지 (WARN-2 계약)
      const newMap: Record<string, boolean> = {};
      for (const item of props.items) {
        newMap[item.value] = true;
      }
      checkedMap.value = newMap;
    }
  );

  // 전체 동의 클릭 핸들러 — checkedMap 갱신 + update:checked + update:allChecked emit 모두 담당
  function onAllCheckedChange(val: boolean): void {
    isHandlingChange = true;

    const newMap: Record<string, boolean> = {};
    for (const item of props.items) {
      newMap[item.value] = val;
    }
    checkedMap.value = newMap;

    for (const item of props.items) {
      emit('update:checked', { value: item.value, checked: val });
    }

    emit('update:allChecked', val);

    nextTick(() => {
      isHandlingChange = false;
    });
  }

  // 개별 항목 체크 핸들러
  function onItemCheckedChange(value: string, checked: boolean): void {
    checkedMap.value = { ...checkedMap.value, [value]: checked };

    emit('update:checked', { value, checked });

    // 모든 항목이 체크된 경우 allChecked true emit
    const isAllChecked = props.items.every((item) => checkedMap.value[item.value] === true);
    emit('update:allChecked', isAllChecked);
  }

  // 단일 Accordion의 열림/닫힘 핸들러
  // nextOpenValues: Accordion이 전달한 현재 열린 AccordionItem value 배열 전체
  // prev 대비 새로 추가된 value에 대해서만 accordion-open emit
  function onAccordionChange(nextOpenValues: string | string[]): void {
    const next = Array.isArray(nextOpenValues) ? nextOpenValues : [nextOpenValues];

    for (const v of next) {
      if (!prevOpenValues.includes(v)) {
        emit('accordion-open', v);
      }
    }

    prevOpenValues = [...next];
    emit('accordion-change');
  }

  // Accordion 전용 props + 이벤트 리스너를 하나의 객체로 묶어 v-bind로 일괄 전달
  // v-bind 객체 안에 'onUpdate:modelValue' 키를 포함하면 Vue가 이벤트 리스너로 등록
  // (template의 @update:model-value 와 동일한 동작)
  const accordionProps = computed(() =>
    hasAccordionItems.value
      ? ({ type: 'multiple' as const, 'onUpdate:modelValue': onAccordionChange } as Record<string, unknown>)
      : {}
  );
</script>

<style lang="scss" scoped>
  $b: 'termsAgreement';

  .#{$b} {
    display: block;
    width: 100%;
  }

  .#{$b}__allWrap {
    margin-bottom: 1.6rem;
    :deep(.checkbox__label) {
      font-weight: $font-weight-bold;
    }
  }

  .#{$b}__items {
    display: block;
    width: 100%;
  }

  .#{$b}__item {
    display: block;
    width: 100%;
    padding-bottom: 0.8rem;
    border-bottom: 1px solid $line-300;

    & + & {
      margin-top: 1.6rem;
    }
  }

  .#{$b}__itemWrap {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .#{$b}__checkbox {
    flex: 1;
    min-width: 0;
  }

  .#{$b}__required {
    font-style: normal;
    color: $color-danger;
    font-weight: $font-weight-medium;
  }

  .#{$b}__popupBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: $text-600;
    padding: 0.4rem;
    margin-left: $spacing-xs;
  }

  // accordion 타입 항목
  .#{$b}__accordionHead {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .#{$b}__accordionTrigger {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 0.4rem;
    margin-left: $spacing-xs;
    color: $text-600;
    background: none;
    border: none;
    cursor: pointer;
  }

  .#{$b}__accordionIcon {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform $duration-fast ease;
  }

  .#{$b}__accordionContent {
    padding: 0.8rem 1.2rem;
    font-size: $font-size-caption1;
    color: $text-700;
    background-color: $bg-secondary;
    border-radius: 1.2rem;
    white-space: pre-line;
    margin-top: 1.6rem;
    max-height: 30rem;
    overflow-y: auto;
  }

  // AccordionTrigger 아이콘 회전 (accordion__trigger--head 는 Accordion.vue에서 부여)
  // accordion 컴포넌트 내부의 아이콘 회전은 :deep()으로 처리
  :deep(.accordion__trigger--head[data-state='open']) {
    .#{$b}__accordionIcon {
      transform: rotate(180deg);
    }
  }

  :deep(.accordion__trigger--head[data-state='closed']) {
    .#{$b}__accordionIcon {
      transform: rotate(0deg);
    }
  }
</style>
