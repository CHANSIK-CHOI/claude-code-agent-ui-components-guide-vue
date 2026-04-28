<template>
  <div class="switchGuidePage">
    <!-- 헤더 -->
    <header class="switchGuidePage__header">
      <div class="switchGuidePage__meta">
        <span class="switchGuidePage__badge">atoms</span>
      </div>
      <h1 class="switchGuidePage__title">Switch</h1>
      <p class="switchGuidePage__desc">
        켜짐/꺼짐 두 상태를 즉시 전환하는 토글 스위치 컴포넌트입니다.<br />
        설정 옵션 활성화, 알림 수신 동의 등 즉각적인 상태 전환이 필요한 폼 입력
        맥락에서 사용합니다.<br />
        Checkbox와 달리 폼 제출을 기다리지 않고 선택 즉시 동작이 반영됩니다.<br />
        내부적으로 <strong>Radix Vue</strong>를 사용해 키보드 탐색, 포커스, ARIA
        처리를 자동으로 지원합니다.
      </p>
    </header>

    <!-- ① 기본 사용법 -->
    <section class="switchGuidePage__section">
      <h2 class="switchGuidePage__sectionTitle">① 기본 사용법</h2>
      <p class="switchGuidePage__note">
        <code>v-model</code>로 토글 상태(boolean)를 바인딩합니다.<br />
        <code>true</code> = 켜짐(checked), <code>false</code> = 꺼짐(unchecked).
      </p>

      <div class="switchGuidePage__group">
        <div class="switchGuidePage__stateRow">
          <div class="switchGuidePage__item">
            <Switch aria-label="꺼짐 상태" />
            <span class="switchGuidePage__stateLabel">unchecked (꺼짐)</span>
          </div>
          <div class="switchGuidePage__item">
            <Switch :model-value="true" aria-label="켜짐 상태" />
            <span class="switchGuidePage__stateLabel">checked (켜짐)</span>
          </div>
        </div>
      </div>

      <pre class="switchGuidePage__code"><code>&lt;!-- 꺼짐 (기본) --&gt;
&lt;Switch aria-label="알림 수신" /&gt;

&lt;!-- 켜짐 --&gt;
&lt;Switch :model-value="true" aria-label="알림 수신" /&gt;</code></pre>
    </section>

    <!-- ② 비활성 상태 -->
    <section class="switchGuidePage__section">
      <h2 class="switchGuidePage__sectionTitle">② 비활성 상태</h2>
      <p class="switchGuidePage__note">
        <code>disabled</code> prop을 전달하면 클릭이 차단되고 시각적으로 흐리게
        표시됩니다.<br />
        unchecked / checked 두 상태 모두 disabled 적용 가능합니다.
      </p>

      <div class="switchGuidePage__group">
        <div class="switchGuidePage__stateRow">
          <div class="switchGuidePage__item">
            <Switch disabled aria-label="비활성 꺼짐" />
            <span class="switchGuidePage__stateLabel">disabled unchecked</span>
          </div>
          <div class="switchGuidePage__item">
            <Switch :model-value="true" disabled aria-label="비활성 켜짐" />
            <span class="switchGuidePage__stateLabel">disabled checked</span>
          </div>
        </div>
      </div>

      <pre class="switchGuidePage__code"><code>&lt;!-- 비활성 꺼짐 --&gt;
&lt;Switch disabled aria-label="비활성 토글" /&gt;

&lt;!-- 비활성 켜짐 --&gt;
&lt;Switch :model-value="true" disabled aria-label="비활성 토글" /&gt;</code></pre>
    </section>

    <!-- ③ v-model 연동 -->
    <section class="switchGuidePage__section">
      <h2 class="switchGuidePage__sectionTitle">③ v-model 연동</h2>
      <p class="switchGuidePage__note">
        <code>v-model</code>로 상태를 바인딩하면 토글 시 상태가 실시간으로
        반영됩니다.
      </p>

      <div class="switchGuidePage__group">
        <div class="switchGuidePage__demo">
          <Switch
            v-model="isEnabled"
            aria-label="알림 수신 동의"
          />
          <span class="switchGuidePage__stateText">
            현재 상태: <strong>{{ isEnabled ? '켜짐' : '꺼짐' }}</strong>
          </span>
        </div>
      </div>

      <pre class="switchGuidePage__code"><code>&lt;script setup lang="ts"&gt;
const isEnabled = ref(false)
&lt;/script&gt;

&lt;template&gt;
  &lt;Switch v-model="isEnabled" aria-label="알림 수신 동의" /&gt;
  &lt;span&gt;현재 상태: {{ isEnabled ? '켜짐' : '꺼짐' }}&lt;/span&gt;
&lt;/template&gt;</code></pre>
    </section>

    <!-- ④ 폼 연동 -->
    <section class="switchGuidePage__section">
      <h2 class="switchGuidePage__sectionTitle">④ 폼 연동</h2>
      <p class="switchGuidePage__note">
        <code>name</code>, <code>value</code>, <code>required</code> prop을
        사용하면 HTML 네이티브 폼 전송에 포함됩니다.<br />
        켜짐 상태일 때 <code>value</code> 값이 전송됩니다 (기본값:
        <code>'on'</code>).<br />
        Radix Vue <code>SwitchRoot</code>가 숨김
        <code>&lt;input&gt;</code>을 자동으로 렌더합니다.
      </p>

      <div class="switchGuidePage__group">
        <form
          class="switchGuidePage__form"
          @submit.prevent="handleFormSubmit"
        >
          <div class="switchGuidePage__formRow">
            <label for="notification-switch" class="switchGuidePage__formLabel"
              >알림 수신 동의</label
            >
            <Switch
              id="notification-switch"
              v-model="formEnabled"
              name="notification"
              value="agree"
              required
            />
          </div>
          <button type="submit" class="switchGuidePage__submitBtn">
            폼 제출 (콘솔 확인)
          </button>
        </form>
        <p v-if="formResult" class="switchGuidePage__formResult">
          전송값: <strong>{{ formResult }}</strong>
        </p>
      </div>

      <pre class="switchGuidePage__code"><code>&lt;form @submit.prevent="handleSubmit"&gt;
  &lt;label for="noti-switch"&gt;알림 수신 동의&lt;/label&gt;
  &lt;Switch
    id="noti-switch"
    v-model="isEnabled"
    name="notification"
    value="agree"
    required
  /&gt;
&lt;/form&gt;</code></pre>
    </section>

    <!-- ⑤ 접근성 패턴 -->
    <section class="switchGuidePage__section">
      <h2 class="switchGuidePage__sectionTitle">⑤ 접근성 패턴</h2>
      <p class="switchGuidePage__note">
        Switch는 <code>role="switch"</code>와 <code>aria-checked</code>를 Radix
        Vue가 자동으로 처리합니다.<br />
        레이블이 없는 단독 사용 시에는 반드시
        <code>aria-label</code>을 전달해야 합니다.<br />
        외부 <code>&lt;label&gt;</code>을 사용하려면
        <code>id</code> prop으로 연결합니다.
      </p>

      <div class="switchGuidePage__group">
        <p class="switchGuidePage__groupTitle">
          패턴 1: aria-label 단독 사용
        </p>
        <div class="switchGuidePage__demo">
          <Switch v-model="a11yAlone" aria-label="이메일 수신 동의" />
        </div>
        <pre class="switchGuidePage__code"><code>&lt;!-- 레이블 텍스트 없이 단독 사용 시 aria-label 필수 --&gt;
&lt;Switch v-model="isEnabled" aria-label="이메일 수신 동의" /&gt;</code></pre>
      </div>

      <div class="switchGuidePage__group">
        <p class="switchGuidePage__groupTitle">
          패턴 2: 외부 label for 연결 (권장)
        </p>
        <div class="switchGuidePage__demo">
          <label
            for="a11y-switch"
            class="switchGuidePage__externalLabel"
          >SMS 광고 수신</label>
          <Switch id="a11y-switch" v-model="a11yLabeled" />
        </div>
        <pre class="switchGuidePage__code"><code>&lt;!-- 외부 label + id 연결 — 레이블 클릭 시 토글 동작 --&gt;
&lt;label for="sms-switch"&gt;SMS 광고 수신&lt;/label&gt;
&lt;Switch id="sms-switch" v-model="isEnabled" /&gt;</code></pre>
      </div>
    </section>

    <!-- ⑥ Props / Slots / Events -->
    <section class="switchGuidePage__section">
      <h2 class="switchGuidePage__sectionTitle">⑥ Props / Events</h2>

      <h3 class="switchGuidePage__tableTitle">Props</h3>
      <table class="switchGuidePage__propsTable">
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
            <td><code>modelValue</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>v-model 토글 상태. <code>true</code> = 켜짐(checked)</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>비활성 여부. 클릭 차단, 시각적으로 흐리게 표시</td>
          </tr>
          <tr>
            <td><code>id</code></td>
            <td><code>string</code></td>
            <td>—</td>
            <td>외부 <code>&lt;label for&gt;</code> 연결용 고유 식별자</td>
          </tr>
          <tr>
            <td><code>name</code></td>
            <td><code>string</code></td>
            <td>—</td>
            <td>HTML form 전송 시 필드 name</td>
          </tr>
          <tr>
            <td><code>required</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>HTML form 필수 여부</td>
          </tr>
          <tr>
            <td><code>value</code></td>
            <td><code>string</code></td>
            <td><code>'on'</code></td>
            <td>
              HTML form 전송 시 켜짐 상태일 때 전송되는 값.<br />
              Radix Vue <code>SwitchRoot</code>가 숨김
              <code>&lt;input&gt;</code>을 자동 렌더해 폼에 포함
            </td>
          </tr>
        </tbody>
      </table>

      <h3 class="switchGuidePage__tableTitle">Events</h3>
      <table class="switchGuidePage__propsTable">
        <thead>
          <tr>
            <th>이름</th>
            <th>페이로드</th>
            <th>설명</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>update:modelValue</code></td>
            <td><code>boolean</code></td>
            <td>
              토글 전환 시 발생. v-model이 이 이벤트를 수신해 상태 업데이트.
              <code>disabled</code> 상태에서는 발생하지 않음
            </td>
          </tr>
        </tbody>
      </table>

      <p class="switchGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는
        <code>v-bind="$attrs"</code>를 사용하므로 위 Props 외에도
        <code>&lt;button&gt;</code> 요소의 모든 네이티브 HTML 속성
        (<code>aria-label</code>, <code>autofocus</code>,
        <code>tabindex</code>, <code>data-*</code> 등)을 그대로 전달할 수
        있습니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>

      <p class="switchGuidePage__radixNote">
        이 컴포넌트는 <strong>Radix Vue</strong>를 기반으로 합니다. 위 Props
        외에도 Radix Vue가 지원하는 추가 props를 사용할 수 있습니다. 전체 API는
        <a
          href="https://www.radix-vue.com/components/switch.html"
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

// ③ v-model 연동
const isEnabled = ref(false);

// ④ 폼 연동
const formEnabled = ref(false);
const formResult = ref('');

function handleFormSubmit() {
  formResult.value = formEnabled.value ? 'notification=agree' : '(켜짐 상태가 아니므로 전송 안 됨)';
}

// ⑤ 접근성 패턴
const a11yAlone = ref(false);
const a11yLabeled = ref(true);
</script>

<style lang="scss" scoped src="./switchGuidePage.scss"></style>
