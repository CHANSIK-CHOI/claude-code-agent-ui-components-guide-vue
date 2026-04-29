<template>
  <div class="confirmGuidePage">
    <header class="confirmGuidePage__header">
      <div class="confirmGuidePage__meta">
        <span class="confirmGuidePage__badge">organisms</span>
      </div>
      <h1 class="confirmGuidePage__title">Confirm</h1>
      <p class="confirmGuidePage__desc">
        사용자에게 선택을 요구하는 확인 팝업입니다.<br />
        ok(확인) + cancel(취소) 버튼 두 개를 제공하며,
        <code>useConfirm().open()</code>으로
        <strong>프로그래매틱하게만</strong> 사용합니다.<br />
        <strong>Promise 방식</strong>과 <strong>Callback 방식</strong> 두 가지
        모두 지원합니다.
      </p>
    </header>

    <!-- ① Promise 방식 -->
    <section class="confirmGuidePage__section">
      <h2 class="confirmGuidePage__sectionTitle">① Promise 방식</h2>
      <div class="confirmGuidePage__group">
        <p class="confirmGuidePage__note">
          <code>await open(config)</code>로 결과를 받습니다. ok →
          <code>true</code>, cancel/ESC/dim → <code>false</code>. body 영역에
          <code>title</code>(선택)과 <code>message</code>가 배치됩니다. 아래
          결과 영역에서 resolve 값을 확인하세요.
        </p>
        <div class="confirmGuidePage__row">
          <button
            type="button"
            class="confirmGuidePage__demoBtn"
            @click="handlePromise"
          >
            Promise 방식 열기
          </button>
        </div>
        <div class="confirmGuidePage__result">
          <span class="confirmGuidePage__resultLabel">마지막 결과:</span>
          <strong
            class="confirmGuidePage__resultValue"
            :class="
              lastResult === null
                ? ''
                : lastResult
                  ? 'confirmGuidePage__resultValue--ok'
                  : 'confirmGuidePage__resultValue--cancel'
            "
          >
            {{
              lastResult === null
                ? "(미실행)"
                : lastResult
                  ? "true (확인)"
                  : "false (취소)"
            }}
          </strong>
        </div>
        <pre class="confirmGuidePage__code"><code>const { open } = useConfirm()

const result = await open({
  title: '삭제 확인',
  message: '정말 삭제하시겠습니까?',
})
if (result) { /* ok */ }
else { /* cancel */ }</code></pre>
      </div>
    </section>

    <!-- ② Callback 방식 -->
    <section class="confirmGuidePage__section">
      <h2 class="confirmGuidePage__sectionTitle">② Callback 방식</h2>
      <div class="confirmGuidePage__group">
        <p class="confirmGuidePage__note">
          <code>onOk</code> prop이 있으면 Callback 방식으로 동작합니다. 반환값은
          <code>void</code>입니다.
        </p>
        <div class="confirmGuidePage__row">
          <button
            type="button"
            class="confirmGuidePage__demoBtn"
            @click="handleCallback"
          >
            Callback 방식 열기
          </button>
        </div>
        <div class="confirmGuidePage__result">
          <span class="confirmGuidePage__resultLabel">콜백 결과:</span>
          <strong class="confirmGuidePage__resultValue">{{
            callbackResult
          }}</strong>
        </div>
        <pre class="confirmGuidePage__code"><code>open({
  title: '주문 취소',
  message: '주문을 취소하시겠습니까?',
  onOk: () => { /* ok 처리 */ },
  onCancel: () => { /* cancel 처리 */ },
})</code></pre>
      </div>
    </section>

    <!-- ③ 버튼 라벨 변경 -->
    <section class="confirmGuidePage__section">
      <h2 class="confirmGuidePage__sectionTitle">③ 버튼 라벨 변경</h2>
      <div class="confirmGuidePage__group">
        <div class="confirmGuidePage__row">
          <button
            type="button"
            class="confirmGuidePage__demoBtn"
            @click="handleCustomLabel"
          >
            라벨 변경 열기
          </button>
        </div>
        <pre class="confirmGuidePage__code"><code>open({
  title: '이용약관 동의',
  message: '서비스 이용을 위해 동의가 필요합니다.',
  okLabel: '동의',
  cancelLabel: '거부',
})</code></pre>
      </div>
    </section>

    <!-- ④ Props (useConfirm config 인터페이스) -->
    <section class="confirmGuidePage__section">
      <h2 class="confirmGuidePage__sectionTitle">④ Props</h2>

      <h3 class="confirmGuidePage__tableTitle">useConfirm config</h3>
      <table class="confirmGuidePage__propsTable">
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
            <td>body 확인 메시지 텍스트</td>
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
            <td><code>cancelLabel</code></td>
            <td><code>string</code></td>
            <td><code>'취소'</code></td>
            <td>cancel 버튼 텍스트</td>
          </tr>
          <tr>
            <td><code>onOk</code></td>
            <td><code>() =&gt; void</code></td>
            <td>—</td>
            <td>
              Callback 방식 전용. 있으면 Callback 방식, 없으면 Promise 방식
            </td>
          </tr>
          <tr>
            <td><code>onCancel</code></td>
            <td><code>() =&gt; void</code></td>
            <td>—</td>
            <td>Callback 방식 전용. cancel/ESC/dim 시 호출</td>
          </tr>
        </tbody>
      </table>

      <h3 class="confirmGuidePage__tableTitle">오버로드 시그니처</h3>
      <table class="confirmGuidePage__propsTable">
        <thead>
          <tr>
            <th>방식</th>
            <th>시그니처</th>
            <th>반환값</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Callback</td>
            <td>
              <code
                >open(config: ConfirmConfig &amp; &#123; onOk: () =&gt; void
                &#125;): void</code
              >
            </td>
            <td><code>void</code></td>
          </tr>
          <tr>
            <td>Promise</td>
            <td>
              <code>open(config: ConfirmConfig): Promise&lt;boolean&gt;</code>
            </td>
            <td><code>Promise&lt;boolean&gt;</code></td>
          </tr>
        </tbody>
      </table>

      <p class="confirmGuidePage__delegationNote">
        <strong>사용 방법</strong>: <code>&lt;Confirm /&gt;</code>를 템플릿에
        직접 마크업하지 않습니다. <code>useConfirm().open(config)</code>만
        호출하면 <code>PopupRenderer</code>가 자동으로 렌더링합니다.
      </p>

      <p class="confirmGuidePage__radixNote">
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
import { useConfirm } from "@nd/components/popup";

const { open } = useConfirm();
const lastResult = ref<boolean | null>(null);
const callbackResult = ref("(미실행)");

async function handlePromise() {
  const result = await open({
    title: "삭제 확인",
    message: "정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.",
    okLabel: "삭제",
  });
  lastResult.value = result;
}

function handleCallback() {
  open({
    title: "주문 취소",
    message: "주문을 취소하시겠습니까?",
    onOk: () => {
      callbackResult.value = "확인 클릭";
    },
    onCancel: () => {
      callbackResult.value = "취소 클릭";
    },
  });
}

async function handleCustomLabel() {
  await open({
    title: "이용약관 동의",
    message: "서비스 이용을 위해 동의가 필요합니다.",
    okLabel: "동의",
    cancelLabel: "거부",
  });
}
</script>

<style lang="scss" scoped src="./confirm.scss"></style>
