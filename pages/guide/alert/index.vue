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
        내부적으로 <strong>Radix Vue Dialog</strong>를 사용해 포커스 트랩, ESC 닫기, ARIA 처리를 자동으로 지원합니다.
      </p>
    </header>

    <!-- ① 기본 호출 -->
    <section class="alertGuidePage__section">
      <h2 class="alertGuidePage__sectionTitle">① 기본 호출</h2>
      <div class="alertGuidePage__group">
        <p class="alertGuidePage__groupTitle">fire-and-forget</p>
        <p class="alertGuidePage__note">가장 일반적인 사용 패턴. ok 버튼 / ESC / dim 클릭으로 팝업이 닫힙니다.</p>
        <div class="alertGuidePage__row">
          <button type="button" class="alertGuidePage__demoBtn" @click="showBasic">기본 Alert 열기</button>
        </div>
        <pre class="alertGuidePage__code"><code>const alert = useAlert()
alert.open({ title: '저장됐습니다.' })</code></pre>
      </div>

      <div class="alertGuidePage__group">
        <p class="alertGuidePage__groupTitle">타이틀 포함</p>
        <p class="alertGuidePage__note">
          <code>title</code>을 전달하면 헤더 영역(<code>popup__header</code>)에 타이틀이, body에 메시지가 표시됩니다.
        </p>
        <div class="alertGuidePage__row">
          <button type="button" class="alertGuidePage__demoBtn" @click="showWithTitle">타이틀 있는 Alert 열기</button>
        </div>
        <pre
          class="alertGuidePage__code"
        ><code>alert.open({ title: '안내', message: '처리가 완료됐습니다.' })</code></pre>
      </div>
    </section>

    <!-- ② onClose 콜백 -->
    <section class="alertGuidePage__section">
      <h2 class="alertGuidePage__sectionTitle">② onClose 콜백</h2>
      <div class="alertGuidePage__group">
        <p class="alertGuidePage__note">
          ok/닫기/ESC/dim 클릭으로 팝업이 닫힌 후 <code>onClose</code>가 호출됩니다. 아래 결과 영역에서 콜백 호출 시점을
          확인하세요.
        </p>
        <div class="alertGuidePage__row">
          <button type="button" class="alertGuidePage__demoBtn" @click="showWithCallback">
            onClose 콜백 Alert 열기
          </button>
        </div>
        <div class="alertGuidePage__result">
          <span class="alertGuidePage__resultLabel">onClose 호출 횟수:</span>
          <strong class="alertGuidePage__resultValue">{{ callbackCount }}</strong>
        </div>
        <pre class="alertGuidePage__code"><code>alert.open({
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
          <button type="button" class="alertGuidePage__demoBtn" @click="showCustomLabel">
            커스텀 okLabel Alert 열기
          </button>
        </div>
        <pre
          class="alertGuidePage__code"
        ><code>alert.open({ title: '로그인이 필요합니다.', okLabel: '로그인' })</code></pre>
      </div>
    </section>

    <!-- ④ okColor -->
    <section class="alertGuidePage__section">
      <h2 class="alertGuidePage__sectionTitle">④ okColor</h2>
      <div class="alertGuidePage__group">
        <p class="alertGuidePage__note">
          <code>okColor: 'black'</code>을 전달하면 ok 버튼이 검정 외형으로 표시됩니다.
          기본값은 <code>'primary'</code>(시안색)입니다.
        </p>
        <div class="alertGuidePage__row">
          <button type="button" class="alertGuidePage__demoBtn" @click="showOkColorBlack">
            okColor='black' Alert 열기
          </button>
        </div>
        <pre class="alertGuidePage__code"><code>alert.open({
  title: '주의',
  message: '이 작업은 되돌릴 수 없습니다.',
  okLabel: '확인',
  okColor: 'black',
})</code></pre>
      </div>
    </section>

    <!-- ⑤ 다중 표시 -->
    <section class="alertGuidePage__section">
      <h2 class="alertGuidePage__sectionTitle">⑤ 다중 표시</h2>
      <div class="alertGuidePage__group">
        <p class="alertGuidePage__note">
          버튼을 연속 클릭하면 여러 Alert이 z-index 순으로 쌓입니다. 각각 독립적으로 닫힙니다.
        </p>
        <div class="alertGuidePage__row">
          <button type="button" class="alertGuidePage__demoBtn" @click="showMultiple">Alert 연속 3개 열기</button>
        </div>
      </div>
    </section>

    <!-- ⑥ Props (useAlert config 인터페이스) -->
    <section class="alertGuidePage__section">
      <h2 class="alertGuidePage__sectionTitle">⑥ Props</h2>

      <h3 class="alertGuidePage__tableTitle">공통 config</h3>
      <p class="alertGuidePage__commonNote">아래 항목은 Alert / Confirm에서 공통으로 지원하는 config입니다.</p>
      <div class="alertGuidePage__propsTableWrap">
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
              <td><code>title</code></td>
              <td><code>string</code></td>
              <td>— (필수)</td>
              <td>헤더에 표시되는 타이틀</td>
            </tr>
            <tr>
              <td><code>okLabel</code></td>
              <td><code>string</code></td>
              <td><code>'확인'</code></td>
              <td>ok 버튼 텍스트</td>
            </tr>
            <tr>
              <td><code>okColor</code></td>
              <td><code>'secondary' | 'primary' | 'black'</code></td>
              <td><code>'primary'</code></td>
              <td>ok 버튼 색상. <code>'primary'</code>: 시안색, <code>'secondary'</code>: 보조 색상, <code>'black'</code>: 검정</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="alertGuidePage__tableTitle">Alert 전용 config</h3>
      <div class="alertGuidePage__propsTableWrap">
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
              <td>— (선택)</td>
              <td>body 안내 메시지 텍스트. 없으면 메시지 문단을 렌더링하지 않음</td>
            </tr>
            <tr>
              <td><code>onClose</code></td>
              <td><code>() =&gt; void</code></td>
              <td>—</td>
              <td>팝업 닫힘 후 호출되는 콜백 (ok/닫기/ESC/dim 공통)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="alertGuidePage__delegationNote">
        <strong>사용 방법</strong>: <code>&lt;Alert /&gt;</code>를 템플릿에 직접 마크업하지 않습니다.
        <code>useAlert().open(config)</code>만 호출하면 <code>PopupRenderer</code>가 자동으로 렌더링합니다.<br />
        <code>PopupRenderer</code>는 <code>app.vue</code>에 한 번만 삽입됩니다.
      </p>

      <p class="alertGuidePage__radixNote">
        이 컴포넌트는 <strong>Radix Vue Dialog</strong>를 기반으로 합니다. 전체 API는
        <a href="https://www.radix-vue.com" target="_blank" rel="noopener noreferrer">radix-vue.com 공식 문서</a>
        또는 Context7 MCP(<code>mcp__context7__query-docs</code>)를 통해 확인하세요.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ layout: 'guide' });
  import { useAlert } from '@nd/components/popup';

  const alert = useAlert();
  const callbackCount = ref(0);

  function showBasic() {
    alert.open({ title: '저장됐습니다.' });
  }

  function showWithTitle() {
    alert.open({ title: '안내', message: '처리가 완료됐습니다.' });
  }

  function showWithCallback() {
    alert.open({
      title: '안내',
      message: '닫으면 콜백이 호출됩니다.',
      onClose: () => {
        callbackCount.value++;
      },
    });
  }

  function showCustomLabel() {
    alert.open({ title: '로그인이 필요합니다.', okLabel: '로그인' });
  }

  function showOkColorBlack() {
    alert.open({ title: '주의', message: '이 작업은 되돌릴 수 없습니다.', okLabel: '확인', okColor: 'black' });
  }

  function showMultiple() {
    alert.open({ title: '첫 번째', message: 'Alert 1' });
    alert.open({ title: '두 번째', message: 'Alert 2' });
    alert.open({ title: '세 번째', message: 'Alert 3' });
  }
</script>

<style lang="scss" scoped src="./alert.scss"></style>
