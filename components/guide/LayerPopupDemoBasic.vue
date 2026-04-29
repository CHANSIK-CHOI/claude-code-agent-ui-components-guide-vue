<template>
  <LayerPopup
    v-model:open="popup.isOpen.value"
    title="혜택 알림 받고 추가 10% 할인 혜택을 받아가세요!"
    cancel-label="혜택없이 구매하기"
    cancel-color="secondary"
    ok-label="동의하고 혜택받기"
    @ok="handleAgree"
  >
    <div class="layerPopupDemoBasic__body">
      <!-- 개인정보 수집 동의 섹션 -->
      <div class="layerPopupDemoBasic__section">
        <div class="layerPopupDemoBasic__checkRow">
          <Checkbox type="box" v-model="agreePersonal">
            마케팅 목적의 개인정보 수집 및 이용 동의
          </Checkbox>
        </div>
        <div class="layerPopupDemoBasic__scrollBox">
          <p class="layerPopupDemoBasic__scrollText">
            개인(신용)정보 수집·이용·제공 동의서(상품서비스 안내)개인(신용)정보
            수집·이용·제공 동의서(상품서비스 안내)개인(신용)정보 수집·이용·제공
            동의서(상품서비스 안내)개인(신용)정보 수집·이용·제공
            동의서(상품서비스 안내)개인(신용)정보 수집·이용·제공
            동의서(상품서비스 안내)개인(신용)정보 수집·이용·제공
            동의서(상품서비스 안내)개인(신용)정보 수집·이용·제공
            동의서(상품서비스 안내)개인(신용)정보 수집·이용·제공
            동의서(상품서비스 안내)
          </p>
        </div>
      </div>

      <!-- 마케팅 수신 동의 섹션 -->
      <div class="layerPopupDemoBasic__section">
        <div class="layerPopupDemoBasic__checkRow">
          <Checkbox type="box" v-model="agreeMarketing">
            마케팅 수신 동의
          </Checkbox>
        </div>
        <div class="layerPopupDemoBasic__subChecks">
          <div class="layerPopupDemoBasic__checkRow">
            <Checkbox type="check" v-model="agreeSms">문자/SMS</Checkbox>
          </div>
          <div class="layerPopupDemoBasic__checkRow">
            <Checkbox type="check" v-model="agreeKakao">카카오톡</Checkbox>
          </div>
        </div>
        <ul class="layerPopupDemoBasic__noteList">
          <li>본 혜택은 1회에 한해 제공됩니다.</li>
        </ul>
      </div>
    </div>

    <!-- <template #footer>
      <Button size="lg" shape="solid" color="secondary" @click="popup.close()"
        >혜택없이 구매하기</Button
      >
      <Button size="lg" shape="solid" color="primary" @click="handleAgree"
        >동의하고 혜택받기</Button
      >
    </template> -->
  </LayerPopup>
</template>

<script setup lang="ts">
import { LayerPopup, useLayerPopup } from "@nd/components/popup";
import { Button, Checkbox } from "@nd/components/atoms";

const popup = useLayerPopup();

const agreePersonal = ref(true);
const agreeMarketing = ref(true);
const agreeSms = ref(true);
const agreeKakao = ref(true);

function handleAgree() {
  popup.close();
}

defineExpose({ open: popup.open, close: popup.close });
</script>

<style lang="scss" scoped>
$b: "layerPopupDemoBasic";

.#{$b}__body {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.#{$b}__section {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.#{$b}__checkRow {
  display: flex;
  align-items: center;
  padding: 0.6rem 0; // 6px — $spacing 토큰 없음, Figma 수치 직접 사용
}

.#{$b}__scrollBox {
  background-color: $bg-secondary;
  border-radius: $radius-md;
  padding: $spacing-sm $spacing-md;
  max-height: 11.2rem; // 112px — Figma height 기준
  overflow-y: auto;
}

.#{$b}__scrollText {
  font-size: $font-size-caption2;
  color: $text-700;
  line-height: $line-height-snug;
}

.#{$b}__subChecks {
  display: flex;
  flex-direction: column;
  padding-left: $spacing-md;
}

.#{$b}__noteList {
  list-style: disc;
  padding-left: $spacing-md;

  li {
    font-size: $font-size-caption2;
    color: $text-400;
    line-height: $line-height-snug;
  }
}
</style>
