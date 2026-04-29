<template>
  <div class="alertGuidePage">
    <header class="alertGuidePage__header">
      <div class="alertGuidePage__meta">
        <span class="alertGuidePage__badge">organisms</span>
      </div>
      <h1 class="alertGuidePage__title">Alert</h1>
      <p class="alertGuidePage__desc">
        단순 안내 메시지를 표시하는 팝업입니다.<br />
        ok 버튼(확인) 하나만 있으며, <code>useAlert().open()</code>으로
        <strong>프로그래매틱하게만</strong> 사용합니다.<br />
        템플릿에 <code>&lt;Alert /&gt;</code>를 직접 마크업하지 않습니다.<br />
        내부적으로 <strong>Radix Vue Dialog</strong>를 사용해 포커스 트랩, ESC
        닫기, ARIA 처리를 자동으로 지원합니다.
      </p>
    </header>

    <!-- ① 기본 호출 -->
    <section class="alertGuidePage__section">
      <h2 class="alertGuidePage__sectionTitle">① 기본 호출</h2>
      <div class="alertGuidePage__group">
        <p class="alertGuidePage__groupTitle">fire-and-forget</p>
        <p class="alertGuidePage__note">
          가장 일반적인 사용 패턴. ok 버튼 / ESC / dim 클릭으로 팝업이
          닫힙니다.
        </p>
        <div class="alertGuidePage__row">
          <button
            type="button"
            class="alertGuidePage__demoBtn"
            @click="showBasic"
          >
            기본 Alert 열기
          </button>
        </div>
        <pre class="alertGuidePage__code"><code>const { open } = useAlert()
open({ message: '저장됐습니다.' })</code></pre>
      </div>

      <div class="alertGuidePage__group">
        <p class="alertGuidePage__groupTitle">타이틀 포함</p>
        <p class="alertGuidePage__note">
          <code>title</code>을 전달하면 body 영역에 제목과 메시지가 함께 표시됩니다.
        </p>
        <div class="alertGuidePage__row">
          <button
            type="button"
            class="alertGuidePage__demoBtn"
            @click="showWithTitle"
          >
            타이틀 있는 Alert 열기
          </button>
        </div>
        <pre
          class="alertGuidePage__code"
        ><code>open({ title: '안내', message: '처리가 완료됐습니다.' })</code></pre>
      </div>
    </section>

    <!-- ② onClose 콜백 -->
    <section class="alertGuidePage__section">
      <h2 class="alertGuidePage__sectionTitle">② onClose 콜백</h2>
      <div class="alertGuidePage__group">
        <p class="alertGuidePage__note">
          ok/닫기/ESC/dim 클릭으로 팝업이 닫힌 후 <code>onClose</code>가
          호출됩니다. 아래 결과 영역에서 콜백 호출 시점을 확인하세요.
        </p>
        <div class="alertGuidePage__row">
          <button
            type="button"
            class="alertGuidePage__demoBtn"
            @click="showWithCallback"
          >
            onClose 콜백 Alert 열기
          </button>
        </div>
        <div class="alertGuidePage__result">
          <span class="alertGuidePage__resultLabel">onClose 호출 횟수:</span>
          <strong class="alertGuidePage__resultValue">{{
            callbackCount
          }}</strong>
        </div>
        <pre class="alertGuidePage__code"><code>open({
  title: '안내',
  message: '닫으면 콜백이 호출됩니다.',
  onClose: () => { callbackCount++ },
})</code></pre>
      </div>
    </section>

    <!-- ③ ok 버튼 라벨 변경 -->
    <section class="alertGuidePage__section">
      <h2 class="alertGuidePage__sectionTitle">③ ok 버튼 라벨 변경</h2>
      <div class="alertGuidePage__group">
        <div class="alertGuidePage__row">
          <button
            type="button"
            class="alertGuidePage__demoBtn"
            @click="showCustomLabel"
          >
            커스텀 okLabel Alert 열기
          </button>
        </div>
        <pre
          class="alertGuidePage__code"
        ><code>open({ message: '로그인이 필요합니다.', okLabel: '로그인' })</code></pre>
      </div>
    </section>

    <!-- ④ 다중 표시 -->
    <section class="alertGuidePage__section">
      <h2 class="alertGuidePage__sectionTitle">④ 다중 표시</h2>
      <div class="alertGuidePage__group">
        <p class="alertGuidePage__note">
          버튼을 연속 클릭하면 여러 Alert이 z-index 순으로 쌓입니다. 각각
          독립적으로 닫힙니다.
        </p>
        <div class="alertGuidePage__row">
          <button
            type="button"
            class="alertGuidePage__demoBtn"
            @click="showMultiple"
          >
            Alert 연속 3개 열기
          </button>
        </div>
      </div>
    </section>

    <!-- ⑤ Props (useAlert config 인터페이스) -->
    <section class="alertGuidePage__section">
      <h2 class="alertGuidePage__sectionTitle">⑤ Props</h2>

      <h3 class="alertGuidePage__tableTitle">useAlert config</h3>
      <table class="alertGuidePage__propsTable">
        <thead>
          <tr>
            <th>이름</th>
            <th>타입</th>
            <th>기본값</th>
            <th>설명</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>message</code></td>
            <td><code>string</code></td>
            <td>— (필수)</td>
            <td>body 안내 메시지 텍스트</td>
          </tr>
          <tr>
            <td><code>title</code></td>
            <td><code>string</code></td>
            <td>—</td>
            <td>body에 표시되는 제목. 생략 가능</td>
          </tr>
          <tr>
            <td><code>okLabel</code></td>
            <td><code>string</code></td>
            <td><code>'확인'</code></td>
            <td>ok 버튼 텍스트</td>
          </tr>
          <tr>
            <td><code>onClose</code></td>
            <td><code>() =&gt; void</code></td>
            <td>—</td>
            <td>팝업 닫힘 후 호출되는 콜백 (ok/닫기/ESC/dim 공통)</td>
          </tr>
        </tbody>
      </table>

      <p class="alertGuidePage__delegationNote">
        <strong>사용 방법</strong>: <code>&lt;Alert /&gt;</code>를 템플릿에 직접
        마크업하지 않습니다. <code>useAlert().open(config)</code>만 호출하면
        <code>PopupRenderer</code>가 자동으로 렌더링합니다.<br />
        <code>PopupRenderer</code>는 <code>app.vue</code>에 한 번만 삽입됩니다.
      </p>

      <p class="alertGuidePage__radixNote">
        이 컴포넌트는 <strong>Radix Vue Dialog</strong>를 기반으로 합니다. 전체
        API는
        <a
          href="https://www.radix-vue.com"
          target="_blank"
          rel="noopener noreferrer"
          >radix-vue.com 공식 문서</a
        >
        또는 Context7 MCP(<code>mcp__context7__query-docs</code>)를 통해
        확인하세요.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "guide" });
import { useAlert } from "@nd/components/popup";

const { open } = useAlert();
const callbackCount = ref(0);

function showBasic() {
  open({ message: "저장됐습니다." });
}

function showWithTitle() {
  open({ title: "안내", message: "처리가 완료됐습니다." });
}

function showWithCallback() {
  open({
    title: "안내",
    message: "닫으면 콜백이 호출됩니다.",
    onClose: () => {
      callbackCount.value++;
    },
  });
}

function showCustomLabel() {
  open({ message: "로그인이 필요합니다.", okLabel: "로그인" });
}

function showMultiple() {
  open({ title: "첫 번째", message: "Alert 1" });
  open({ title: "두 번째", message: "Alert 2" });
  open({ title: "세 번째", message: "Alert 3" });
}
</script>

<style lang="scss" scoped src="./alert.scss"></style>
