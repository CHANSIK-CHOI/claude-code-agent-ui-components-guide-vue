<template>
  <BottomSheet
    v-model:open="open"
    title="배송지 선택"
    footer-layout="wide"
    ok-label="이 주소로 배송"
    cancel-label="취소"
    @ok="handleOk"
    @cancel="open = false"
  >
    <ul class="bottomSheetDemoWide__addrList">
      <li
        v-for="addr in addresses"
        :key="addr.id"
        class="bottomSheetDemoWide__addrItem"
        :class="{ 'bottomSheetDemoWide__addrItem--selected': selectedId === addr.id }"
      >
        <button
          type="button"
          class="bottomSheetDemoWide__addrBtn"
          @click="selectedId = addr.id"
        >
          <span class="bottomSheetDemoWide__addrName">{{ addr.name }}</span>
          <span class="bottomSheetDemoWide__addrText">{{ addr.address }}</span>
        </button>
      </li>
    </ul>
    <div v-if="appliedAddr" class="bottomSheetDemoWide__result">
      선택된 주소: <strong>{{ appliedAddr }}</strong>
    </div>
  </BottomSheet>
</template>

<script setup lang="ts">
import { BottomSheet } from "@nd/components/popup";

const open = defineModel<boolean>("open", { required: true });

const selectedId = ref<number | null>(null);
const appliedAddr = ref("");

const addresses = [
  { id: 1, name: "집", address: "서울시 강남구 테헤란로 123" },
  { id: 2, name: "회사", address: "서울시 마포구 상암동 456" },
  { id: 3, name: "부모님댁", address: "경기도 성남시 분당구 789" },
];

function handleOk() {
  const found = addresses.find((a) => a.id === selectedId.value);
  if (found) {
    appliedAddr.value = found.address;
  }
  open.value = false;
}
</script>

<style lang="scss" scoped>
$b: "bottomSheetDemoWide";

.#{$b}__addrList {
  list-style: none;
  padding: 0;
  margin: 0;
}

.#{$b}__addrItem {
  border-bottom: 1px solid $line-300;

  &:last-child {
    border-bottom: none;
  }
}

.#{$b}__addrItem--selected {
  .#{$b}__addrName {
    color: $color-primary;
    font-weight: $font-weight-bold;
  }
}

.#{$b}__addrBtn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  width: 100%;
  padding: $spacing-md 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;

  &:hover {
    .#{$b}__addrName {
      color: $color-primary;
    }
  }
}

.#{$b}__addrName {
  font-size: $font-size-body3;
  font-weight: $font-weight-medium;
  color: $text-900;
}

.#{$b}__addrText {
  font-size: $font-size-caption1;
  color: $text-600;
}

.#{$b}__result {
  margin-top: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  background-color: $bg-secondary;
  border-radius: $radius-md;
  font-size: $font-size-body3;
  color: $text-700;
}
</style>
