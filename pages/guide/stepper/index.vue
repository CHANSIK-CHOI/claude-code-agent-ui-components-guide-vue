<template>
  <div class="StepperGuidePage">
    <!-- 헤더 -->
    <header class="StepperGuidePage__header">
      <div class="StepperGuidePage__meta">
        <span class="StepperGuidePage__badge">atoms</span>
      </div>
      <h1 class="StepperGuidePage__title">Stepper</h1>
      <p class="StepperGuidePage__desc">
        증가/감소 버튼과 숫자 표시 영역으로 이루어진 수량 입력 컴포넌트입니다.<br />
        Radix Vue NumberField가 Alpha 상태이므로 자체 구현했습니다.<br />
        <code>min</code> / <code>max</code>으로 범위를 지정하고,
        <code>readonly</code> prop으로 직접 타이핑 허용 여부를 제어합니다.<br />
        복합 컴포넌트(버튼 2개 + input)이므로 <code>$attrs</code>는 기본적으로
        <code>&lt;input&gt;</code>으로 위임됩니다. 각 버튼에 별도 attrs가 필요하면
        <code>decrementAttrs</code> / <code>incrementAttrs</code> prop을 사용합니다.
      </p>
    </header>

    <!-- ① 기본 사용 -->
    <section class="StepperGuidePage__section">
      <h2 class="StepperGuidePage__sectionTitle">① 기본 사용</h2>
      <p class="StepperGuidePage__note">
        <code>min=1</code>, <code>max</code> 미설정(무제한), <code>readonly=true</code>(기본값).<br />
        현재값: <strong>{{ demo1 }}</strong>
      </p>
      <div class="StepperGuidePage__group">
        <div class="StepperGuidePage__row">
          <div class="StepperGuidePage__item">
            <div class="StepperGuidePage__demoBox">
              <Stepper v-model="demo1" />
            </div>
            <pre class="StepperGuidePage__code"><code>&lt;Stepper v-model="qty" /&gt;

&lt;!-- 기본값 --&gt;
&lt;!-- min=1, step=1, max=없음, readonly=true --&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ② min / max 경계 처리 -->
    <section class="StepperGuidePage__section">
      <h2 class="StepperGuidePage__sectionTitle">② min / max 경계 처리</h2>
      <p class="StepperGuidePage__note">
        <code>min</code> 도달 시 제거 버튼 disabled, <code>max</code> 도달 시 추가 버튼 disabled.<br />
        버튼 disabled 시 내부 아이콘 컬러도 <code>$text-300</code>으로 변합니다.<br />
        현재값: <strong>{{ demo2 }}</strong>
      </p>
      <div class="StepperGuidePage__group">
        <p class="StepperGuidePage__groupTitle">min=1, max=5</p>
        <div class="StepperGuidePage__row">
          <div class="StepperGuidePage__item">
            <div class="StepperGuidePage__demoBox">
              <Stepper v-model="demo2" :min="1" :max="5" />
            </div>
            <pre class="StepperGuidePage__code"><code>&lt;Stepper v-model="qty" :min="1" :max="5" /&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="StepperGuidePage__group">
        <p class="StepperGuidePage__groupTitle">step=5, min=0, max=100</p>
        <p class="StepperGuidePage__note">
          현재값: <strong>{{ demo2b }}</strong>
        </p>
        <div class="StepperGuidePage__row">
          <div class="StepperGuidePage__item">
            <div class="StepperGuidePage__demoBox">
              <Stepper v-model="demo2b" :min="0" :max="100" :step="5" />
            </div>
            <pre class="StepperGuidePage__code"><code>&lt;Stepper v-model="qty" :min="0" :max="100" :step="5" /&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ③ 직접 입력 허용 (readonly=false) -->
    <section class="StepperGuidePage__section">
      <h2 class="StepperGuidePage__sectionTitle">③ 직접 입력 허용 (readonly=false)</h2>
      <p class="StepperGuidePage__note">
        <code>:readonly="false"</code> 전달 시 숫자 표시 영역에 직접 타이핑 가능.<br />
        입력 완료(blur 또는 Enter) 시 <code>min</code>~<code>max</code> 범위 내로 clamp 처리.<br />
        빈 값으로 blur 시 <code>min</code>으로 복원. 화살표 키(↑↓)로도 증감 가능.<br />
        현재값: <strong>{{ demo3 }}</strong>
      </p>
      <div class="StepperGuidePage__group">
        <div class="StepperGuidePage__row">
          <div class="StepperGuidePage__item">
            <div class="StepperGuidePage__demoBox">
              <Stepper v-model="demo3" :min="1" :max="99" :readonly="false" />
            </div>
            <pre class="StepperGuidePage__code"><code>&lt;Stepper v-model="qty" :min="1" :max="99" :readonly="false" /&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ④ 전체 비활성 (disabled) -->
    <section class="StepperGuidePage__section">
      <h2 class="StepperGuidePage__sectionTitle">④ 전체 비활성 (disabled)</h2>
      <p class="StepperGuidePage__note">
        <code>disabled=true</code> 시 버튼과 input 모두 클릭·포커스 불가.<br />
        min/max 경계에 의한 개별 버튼 비활성보다 우선합니다.
      </p>
      <div class="StepperGuidePage__group">
        <div class="StepperGuidePage__row">
          <div class="StepperGuidePage__item">
            <div class="StepperGuidePage__demoBox">
              <Stepper v-model="demo4" :min="1" :max="10" disabled />
            </div>
            <pre class="StepperGuidePage__code"><code>&lt;Stepper v-model="qty" :min="1" :max="10" disabled /&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑤ FormField와 조합 -->
    <section class="StepperGuidePage__section">
      <h2 class="StepperGuidePage__sectionTitle">⑤ FormField와 조합</h2>
      <p class="StepperGuidePage__note">
        <code>$attrs</code>는 기본적으로 내부 <code>&lt;input&gt;</code>으로 위임됩니다.<br />
        FormField의 <code>label for</code>과 연결하려면 <code>id</code>를 Stepper에 전달하면 됩니다.
      </p>
      <div class="StepperGuidePage__group">
        <div class="StepperGuidePage__row">
          <div class="StepperGuidePage__item">
            <div class="StepperGuidePage__demoBox">
              <FormField label-text="수량" input-id="demo-qty">
                <Stepper id="demo-qty" v-model="demo5" :min="1" :max="99" />
              </FormField>
            </div>
            <pre class="StepperGuidePage__code"><code>&lt;FormField label-text="수량" input-id="qty"&gt;
  &lt;Stepper id="qty" v-model="qty" :min="1" :max="99" /&gt;
&lt;/FormField&gt;

&lt;!-- id="qty"가 내부 &lt;input id="qty"&gt;로 위임됨 --&gt;
&lt;!-- FormField의 &lt;label for="qty"&gt;와 자동 연결 --&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑥ decrementAttrs / incrementAttrs -->
    <section class="StepperGuidePage__section">
      <h2 class="StepperGuidePage__sectionTitle">⑥ 버튼 attrs 개별 위임</h2>
      <p class="StepperGuidePage__note">
        기본 <code>$attrs</code>는 input으로 가므로, 각 버튼에 <code>data-*</code>나 추가 이벤트 핸들러를 붙이려면
        <code>decrementAttrs</code> / <code>incrementAttrs</code> prop을 사용합니다.<br />
        아래 예시는 각 버튼에 <code>data-ga</code> 속성이 적용됩니다. 브라우저 개발자 도구에서 확인할 수 있습니다.
      </p>
      <div class="StepperGuidePage__group">
        <div class="StepperGuidePage__row">
          <div class="StepperGuidePage__item">
            <div class="StepperGuidePage__demoBox">
              <Stepper
                v-model="demo6"
                :decrement-attrs="{ 'data-ga': 'qty-minus' }"
                :increment-attrs="{ 'data-ga': 'qty-plus' }"
              />
            </div>
            <pre class="StepperGuidePage__code"><code>&lt;Stepper
  v-model="qty"
  :decrement-attrs="{ 'data-ga': 'qty-minus' }"
  :increment-attrs="{ 'data-ga': 'qty-plus' }"
/&gt;

&lt;!-- 제거 버튼: &lt;button data-ga="qty-minus" ...&gt; --&gt;
&lt;!-- 추가 버튼: &lt;button data-ga="qty-plus" ...&gt; --&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑦ Props 테이블 -->
    <section class="StepperGuidePage__section">
      <h2 class="StepperGuidePage__sectionTitle">⑦ Props</h2>

      <h3 class="StepperGuidePage__tableTitle">Stepper Props</h3>
      <table class="StepperGuidePage__propsTable">
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
            <td><code>number</code></td>
            <td><code>1</code></td>
            <td>현재 숫자 값 (v-model 연동)</td>
          </tr>
          <tr>
            <td><code>min</code></td>
            <td><code>number</code></td>
            <td><code>1</code></td>
            <td>감소 가능한 하한선. 이 값 이하로 내려가지 않음.</td>
          </tr>
          <tr>
            <td><code>max</code></td>
            <td><code>number | undefined</code></td>
            <td><code>undefined</code></td>
            <td>증가 가능한 상한선. 미설정 시 무제한.</td>
          </tr>
          <tr>
            <td><code>step</code></td>
            <td><code>number</code></td>
            <td><code>1</code></td>
            <td>버튼 클릭 한 번에 변화하는 증감 단위.</td>
          </tr>
          <tr>
            <td><code>readonly</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td><code>true</code>면 버튼으로만 조작. <code>false</code>면 숫자 영역 직접 타이핑 가능.</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>전체 비활성. 버튼과 input 모두 클릭·포커스 불가.</td>
          </tr>
          <tr>
            <td><code>decrementAttrs</code></td>
            <td><code>Record&lt;string, unknown&gt;</code></td>
            <td><code>{}</code></td>
            <td>제거 버튼(<code>&lt;button&gt;</code>)에 그대로 위임. <code>data-*</code>, 추가 이벤트 등.</td>
          </tr>
          <tr>
            <td><code>incrementAttrs</code></td>
            <td><code>Record&lt;string, unknown&gt;</code></td>
            <td><code>{}</code></td>
            <td>추가 버튼(<code>&lt;button&gt;</code>)에 그대로 위임. <code>data-*</code>, 추가 이벤트 등.</td>
          </tr>
        </tbody>
      </table>

      <h3 class="StepperGuidePage__tableTitle">Events</h3>
      <table class="StepperGuidePage__propsTable">
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
            <td><code>number</code></td>
            <td>버튼 클릭 또는 직접 입력 완료 시 변경된 값 전달 (v-model 업데이트)</td>
          </tr>
          <tr>
            <td><code>change</code></td>
            <td><code>number</code></td>
            <td>값이 최종 확정될 때 발생. 버튼 클릭이면 즉시, 직접 입력이면 blur/Enter 시.</td>
          </tr>
        </tbody>
      </table>

      <h3 class="StepperGuidePage__tableTitle">$attrs 위임 전략</h3>
      <table class="StepperGuidePage__propsTable">
        <thead>
          <tr>
            <th>전달 방법</th>
            <th>도달 위치</th>
            <th>주요 사용 사례</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>컴포넌트에 직접 전달</td>
            <td><code>&lt;input&gt;</code></td>
            <td><code>id</code>, <code>name</code>, <code>aria-label</code>, <code>aria-describedby</code></td>
          </tr>
          <tr>
            <td><code>decrementAttrs</code> prop</td>
            <td>제거 버튼 <code>&lt;button&gt;</code></td>
            <td><code>data-*</code>, 커스텀 이벤트 핸들러</td>
          </tr>
          <tr>
            <td><code>incrementAttrs</code> prop</td>
            <td>추가 버튼 <code>&lt;button&gt;</code></td>
            <td><code>data-*</code>, 커스텀 이벤트 핸들러</td>
          </tr>
        </tbody>
      </table>
      <p class="StepperGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는
        <code>v-bind="$attrs"</code>를 사용하므로 위 Props 외에도
        <code>&lt;input&gt;</code> 요소의 모든 네이티브 HTML 속성
        (<code>id</code>, <code>name</code>, <code>aria-label</code>,
        <code>aria-describedby</code>, <code>tabindex</code>, <code>data-*</code> 등)을
        그대로 전달할 수 있습니다.<br />
        각 버튼에 attrs를 전달하려면 <code>decrementAttrs</code> /
        <code>incrementAttrs</code> prop을 사용합니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'guide' })

const demo1 = ref<number>(1)
const demo2 = ref<number>(1)
const demo2b = ref<number>(0)
const demo3 = ref<number>(1)
const demo4 = ref<number>(3)
const demo5 = ref<number>(1)
const demo6 = ref<number>(1)
</script>

<style lang="scss" scoped src="./stepperGuidePage.scss"></style>
