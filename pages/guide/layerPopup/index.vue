<template>
  <div class="layerPopupGuidePage">
    <header class="layerPopupGuidePage__header">
      <div class="layerPopupGuidePage__meta">
        <span class="layerPopupGuidePage__badge">organisms</span>
      </div>
      <h1 class="layerPopupGuidePage__title">LayerPopup</h1>
      <p class="layerPopupGuidePage__desc">
        범용 레이어 팝업입니다. 헤더/바디/푸터 모두 slot으로 자유롭게 구성하며,
        <code>useLayerPopup()</code> 훅으로 열기/닫기를 외부에서 제어합니다.<br />
        내부적으로 <strong>Radix Vue Dialog</strong>를 사용해 포커스 트랩, ESC 닫기,
        ARIA 처리를 자동으로 지원합니다.
      </p>
    </header>

    <!-- ① 기본 LayerPopup -->
    <section class="layerPopupGuidePage__section">
      <h2 class="layerPopupGuidePage__sectionTitle">① 기본 LayerPopup</h2>
      <div class="layerPopupGuidePage__group">
        <p class="layerPopupGuidePage__note">
          <code>useLayerPopup()</code> 훅 + <code>v-model:open</code> 패턴. ok 버튼은 부모가 직접 닫습니다.
        </p>
        <div class="layerPopupGuidePage__row">
          <button type="button" class="layerPopupGuidePage__demoBtn" @click="basic.open()">
            기본 LayerPopup 열기
          </button>
        </div>
        <LayerPopup v-model:open="basic.isOpen" title="배송지 변경" @ok="basic.close()">
          <p>팝업 바디 영역입니다. 기본 ok/cancel 버튼이 푸터에 표시됩니다.</p>
        </LayerPopup>
      </div>
    </section>

    <!-- ② #footer slot 커스텀 -->
    <section class="layerPopupGuidePage__section">
      <h2 class="layerPopupGuidePage__sectionTitle">② #footer slot 커스텀</h2>
      <div class="layerPopupGuidePage__group">
        <p class="layerPopupGuidePage__note">
          <code>#footer</code> slot을 사용하면 ok/cancel 기본 버튼을 완전히 교체합니다.
        </p>
        <div class="layerPopupGuidePage__row">
          <button type="button" class="layerPopupGuidePage__demoBtn" @click="customFooter.open()">
            #footer 커스텀 열기
          </button>
        </div>
        <LayerPopup v-model:open="customFooter.isOpen" title="저장 확인">
          <p>커스텀 푸터를 사용합니다.</p>
          <template #footer>
            <button type="button" class="layerPopupGuidePage__footerBtn layerPopupGuidePage__footerBtn--cancel" @click="customFooter.close()">취소</button>
            <button type="button" class="layerPopupGuidePage__footerBtn layerPopupGuidePage__footerBtn--ok" @click="handleSave">저장</button>
          </template>
        </LayerPopup>
      </div>
    </section>

    <!-- ③ #header slot 커스텀 -->
    <section class="layerPopupGuidePage__section">
      <h2 class="layerPopupGuidePage__sectionTitle">③ #header slot 커스텀</h2>
      <div class="layerPopupGuidePage__group">
        <p class="layerPopupGuidePage__note">
          <code>#header</code> slot 사용 시 <code>title</code> prop을 비워두면 hidden DialogTitle이 자동 마운트됩니다.
          slot 안에서 별도 DialogTitle 래핑은 불필요합니다.
        </p>
        <div class="layerPopupGuidePage__row">
          <button type="button" class="layerPopupGuidePage__demoBtn" @click="customHeader.open()">
            #header 커스텀 열기
          </button>
        </div>
        <LayerPopup v-model:open="customHeader.isOpen" @ok="customHeader.close()">
          <template #header>
            <div class="layerPopupGuidePage__customHeader">
              <span class="layerPopupGuidePage__customHeaderTitle">커스텀 헤더</span>
              <button type="button" class="layerPopupGuidePage__customClose" aria-label="닫기" @click="customHeader.close()">✕</button>
            </div>
          </template>
          <p>헤더를 완전히 교체했습니다.</p>
        </LayerPopup>
      </div>
    </section>

    <!-- ④ showCancel=false -->
    <section class="layerPopupGuidePage__section">
      <h2 class="layerPopupGuidePage__sectionTitle">④ showCancel=false</h2>
      <div class="layerPopupGuidePage__group">
        <div class="layerPopupGuidePage__row">
          <button type="button" class="layerPopupGuidePage__demoBtn" @click="noCancel.open()">
            ok 버튼만 열기
          </button>
        </div>
        <LayerPopup v-model:open="noCancel.isOpen" title="안내" :show-cancel="false" @ok="noCancel.close()">
          <p>취소 버튼 없이 ok 버튼만 표시됩니다.</p>
        </LayerPopup>
      </div>
    </section>

    <!-- ⑤ closeOnOverlay=false -->
    <section class="layerPopupGuidePage__section">
      <h2 class="layerPopupGuidePage__sectionTitle">⑤ closeOnOverlay=false</h2>
      <div class="layerPopupGuidePage__group">
        <p class="layerPopupGuidePage__note">
          dim 클릭으로 닫히지 않는 강제 응답 시나리오입니다.
          ✕ 버튼 또는 ok/cancel 버튼으로만 닫을 수 있습니다.
        </p>
        <div class="layerPopupGuidePage__row">
          <button type="button" class="layerPopupGuidePage__demoBtn" @click="noOverlay.open()">
            강제 응답 팝업 열기
          </button>
        </div>
        <LayerPopup v-model:open="noOverlay.isOpen" title="필수 응답" :close-on-overlay="false" @ok="noOverlay.close()">
          <p>dim을 클릭해도 닫히지 않습니다. 버튼으로만 닫을 수 있습니다.</p>
        </LayerPopup>
      </div>
    </section>

    <!-- ⑥ Props / Slots / Events -->
    <section class="layerPopupGuidePage__section">
      <h2 class="layerPopupGuidePage__sectionTitle">⑥ Props / Slots / Events</h2>

      <h3 class="layerPopupGuidePage__tableTitle">Props</h3>
      <table class="layerPopupGuidePage__propsTable">
        <thead>
          <tr><th>이름</th><th>타입</th><th>기본값</th><th>설명</th></tr>
        </thead>
        <tbody>
          <tr><td><code>open</code></td><td><code>boolean</code></td><td>— (필수)</td><td>v-model:open 바인딩</td></tr>
          <tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>헤더 타이틀 텍스트</td></tr>
          <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>a11y용 설명 텍스트 (DialogDescription)</td></tr>
          <tr><td><code>showClose</code></td><td><code>boolean</code></td><td><code>true</code></td><td>헤더 닫기(✕) 버튼 표시</td></tr>
          <tr><td><code>okLabel</code></td><td><code>string</code></td><td><code>'확인'</code></td><td>ok 버튼 텍스트</td></tr>
          <tr><td><code>cancelLabel</code></td><td><code>string</code></td><td><code>'취소'</code></td><td>cancel 버튼 텍스트</td></tr>
          <tr><td><code>showCancel</code></td><td><code>boolean</code></td><td><code>true</code></td><td>cancel 버튼 표시</td></tr>
          <tr><td><code>okDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>ok 버튼 비활성</td></tr>
          <tr><td><code>closeOnOverlay</code></td><td><code>boolean</code></td><td><code>true</code></td><td>dim 클릭 시 닫기</td></tr>
          <tr><td><code>closeOnEscape</code></td><td><code>boolean</code></td><td><code>true</code></td><td>ESC 키 입력 시 닫기</td></tr>
        </tbody>
      </table>

      <h3 class="layerPopupGuidePage__tableTitle">Slots</h3>
      <table class="layerPopupGuidePage__propsTable">
        <thead>
          <tr><th>이름</th><th>필수</th><th>설명</th></tr>
        </thead>
        <tbody>
          <tr><td><code>default</code></td><td>권장</td><td>body 영역 콘텐츠</td></tr>
          <tr><td><code>#header</code></td><td>선택</td><td>헤더 완전 교체. title/showClose prop 무시</td></tr>
          <tr><td><code>#footer</code></td><td>선택</td><td>푸터 완전 교체. ok/cancel 기본 버튼 미렌더링</td></tr>
        </tbody>
      </table>

      <h3 class="layerPopupGuidePage__tableTitle">Events</h3>
      <table class="layerPopupGuidePage__propsTable">
        <thead>
          <tr><th>이름</th><th>페이로드</th><th>설명</th></tr>
        </thead>
        <tbody>
          <tr><td><code>update:open</code></td><td><code>boolean</code></td><td>open 상태 변경 (v-model)</td></tr>
          <tr><td><code>opened</code></td><td>—</td><td>열림 애니메이션 완료 후</td></tr>
          <tr><td><code>closed</code></td><td>—</td><td>닫힘 애니메이션 완료 후</td></tr>
          <tr><td><code>close</code></td><td>—</td><td>닫기(✕) 버튼 클릭</td></tr>
          <tr><td><code>ok</code></td><td>—</td><td>ok 버튼 클릭 (부모가 닫기 책임)</td></tr>
          <tr><td><code>cancel</code></td><td>—</td><td>cancel 버튼 클릭</td></tr>
          <tr><td><code>overlayClick</code></td><td>—</td><td>dim 클릭</td></tr>
        </tbody>
      </table>

      <p class="layerPopupGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: LayerPopup은 <code>Popup</code> Base를 내부에서 사용합니다.
        추가 props가 필요한 경우 LayerPopup의 props에 명시적으로 전달합니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>

      <p class="layerPopupGuidePage__radixNote">
        이 컴포넌트는 <strong>Radix Vue Dialog</strong>를 기반으로 합니다.
        전체 API는
        <a href="https://www.radix-vue.com" target="_blank" rel="noopener noreferrer">radix-vue.com 공식 문서</a>
        또는 Context7 MCP(<code>mcp__context7__query-docs</code>)를 통해 확인하세요.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'guide' })
import { LayerPopup, useLayerPopup } from '~/components/popup'

const basic = useLayerPopup()
const customFooter = useLayerPopup()
const customHeader = useLayerPopup()
const noCancel = useLayerPopup()
const noOverlay = useLayerPopup()

function handleSave() {
  customFooter.close()
}
</script>

<style lang="scss" scoped src="./layerPopup.scss"></style>
