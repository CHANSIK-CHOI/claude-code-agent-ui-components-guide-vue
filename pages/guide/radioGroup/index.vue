<template>
  <div class="radioGroupGuidePage">
    <!-- 헤더 -->
    <header class="radioGroupGuidePage__header">
      <div class="radioGroupGuidePage__meta">
        <span class="radioGroupGuidePage__badge">atoms</span>
      </div>
      <h1 class="radioGroupGuidePage__title">RadioGroup</h1>
      <p class="radioGroupGuidePage__desc">
        단일 선택(single choice) 입력을 위한 라디오 버튼 그룹 컴포넌트입니다.<br />
        배송지 선택, 성별 선택, 결제수단 선택 등 "하나만 고를 수 있는" 폼 필드 전반에 사용합니다.<br />
        내부적으로 <strong>Radix Vue</strong>를 사용해 키보드 탐색(화살표 키), 포커스, ARIA 처리를 자동으로 지원합니다.
      </p>
    </header>

    <!-- ① 기본 (horizontal) -->
    <section class="radioGroupGuidePage__section">
      <h2 class="radioGroupGuidePage__sectionTitle">① 기본 (horizontal)</h2>
      <p class="radioGroupGuidePage__note">
        기본 <code>orientation="horizontal"</code>으로 아이템이 가로로 나열됩니다.<br />
        <code>v-model</code>로 선택 값을 바인딩하며, 현재 선택된 값이 아래에 표시됩니다.
      </p>

      <div class="radioGroupGuidePage__group">
        <p class="radioGroupGuidePage__groupTitle">2개 아이템 선택 데모</p>
        <div class="radioGroupGuidePage__demo">
          <RadioGroup
            v-model="selectedBasic"
            :items="basicItems"
            aria-label="배송지 선택"
          />
          <p class="radioGroupGuidePage__stateLabel">선택된 값: <code>{{ selectedBasic || '(없음)' }}</code></p>
        </div>
        <pre class="radioGroupGuidePage__code"><code>&lt;RadioGroup
  v-model="selected"
  :items="[
    { value: 'default', label: '기본 배송지' },
    { value: 'new', label: '새 배송지' },
  ]"
  aria-label="배송지 선택"
/&gt;</code></pre>
      </div>
    </section>

    <!-- ② orientation: vertical -->
    <section class="radioGroupGuidePage__section">
      <h2 class="radioGroupGuidePage__sectionTitle">② orientation: vertical</h2>
      <p class="radioGroupGuidePage__note">
        <code>orientation="vertical"</code>으로 아이템을 세로로 나열합니다.<br />
        선택지가 길거나 많을 때, 또는 폼 세로 레이아웃에서 사용합니다.
      </p>

      <div class="radioGroupGuidePage__group">
        <div class="radioGroupGuidePage__demo">
          <RadioGroup
            v-model="selectedVertical"
            :items="paymentItems"
            orientation="vertical"
            aria-label="결제 수단 선택"
          />
          <p class="radioGroupGuidePage__stateLabel">선택된 값: <code>{{ selectedVertical || '(없음)' }}</code></p>
        </div>
        <pre class="radioGroupGuidePage__code"><code>&lt;RadioGroup
  v-model="selected"
  :items="[
    { value: 'card', label: '신용카드' },
    { value: 'bank', label: '무통장입금' },
    { value: 'kakao', label: '카카오페이' },
  ]"
  orientation="vertical"
  aria-label="결제 수단 선택"
/&gt;</code></pre>
      </div>
    </section>

    <!-- ③ 상태별 -->
    <section class="radioGroupGuidePage__section">
      <h2 class="radioGroupGuidePage__sectionTitle">③ 상태별</h2>
      <p class="radioGroupGuidePage__note">
        checked / unchecked / 아이템 disabled / 그룹 disabled / error 상태를 지원합니다.
      </p>

      <div class="radioGroupGuidePage__group">
        <p class="radioGroupGuidePage__groupTitle">unchecked (기본)</p>
        <div class="radioGroupGuidePage__demo">
          <RadioGroup
            :items="stateItems"
            aria-label="미선택 상태 예시"
          />
        </div>
      </div>

      <div class="radioGroupGuidePage__group">
        <p class="radioGroupGuidePage__groupTitle">checked</p>
        <div class="radioGroupGuidePage__demo">
          <RadioGroup
            model-value="option1"
            :items="stateItems"
            aria-label="선택됨 상태 예시"
          />
        </div>
      </div>

      <div class="radioGroupGuidePage__group">
        <p class="radioGroupGuidePage__groupTitle">아이템 일부 disabled</p>
        <div class="radioGroupGuidePage__demo">
          <RadioGroup
            v-model="selectedItemDisabled"
            :items="itemDisabledItems"
            aria-label="일부 아이템 비활성 예시"
          />
        </div>
        <pre class="radioGroupGuidePage__code"><code>&lt;!-- items 배열에서 개별 아이템의 disabled 지정 --&gt;
&lt;RadioGroup
  v-model="selected"
  :items="[
    { value: 'card', label: '신용카드' },
    { value: 'bank', label: '무통장입금' },
    { value: 'kakao', label: '카카오페이', disabled: true },
  ]"
  aria-label="결제 수단"
/&gt;</code></pre>
      </div>

      <div class="radioGroupGuidePage__group">
        <p class="radioGroupGuidePage__groupTitle">그룹 전체 disabled</p>
        <div class="radioGroupGuidePage__demo">
          <RadioGroup
            model-value="option1"
            :items="stateItems"
            :disabled="true"
            aria-label="그룹 비활성 예시"
          />
        </div>
        <pre class="radioGroupGuidePage__code"><code>&lt;!-- disabled prop으로 그룹 전체 비활성 --&gt;
&lt;RadioGroup
  v-model="selected"
  :items="items"
  :disabled="true"
  aria-label="그룹 비활성"
/&gt;</code></pre>
      </div>

      <div class="radioGroupGuidePage__group">
        <p class="radioGroupGuidePage__groupTitle">error 상태</p>
        <div class="radioGroupGuidePage__demo">
          <RadioGroup
            :items="stateItems"
            :error="true"
            aria-label="에러 상태 예시"
          />
        </div>
        <pre class="radioGroupGuidePage__code"><code>&lt;!-- error prop으로 에러 상태 표시 (라디오 원 테두리가 danger 색상으로 변경) --&gt;
&lt;RadioGroup
  v-model="selected"
  :items="items"
  :error="true"
  aria-label="배송지 선택"
/&gt;</code></pre>
      </div>
    </section>

    <!-- ④ FormField 연동 예시 -->
    <section class="radioGroupGuidePage__section">
      <h2 class="radioGroupGuidePage__sectionTitle">④ FormField 연동 예시</h2>
      <p class="radioGroupGuidePage__note">
        <code>FormField</code>로 감싸면 라벨·에러 메시지를 함께 표시할 수 있습니다.<br />
        <code>name</code>, <code>required</code>, <code>error</code> prop 조합으로 폼 유효성 상태를 전달합니다.
      </p>
      <p class="radioGroupGuidePage__note">
        FormField Props/Slots 상세 설명은 <NuxtLink to="/guide/input">Input 가이드 페이지</NuxtLink>를 참조하세요.
      </p>

      <div class="radioGroupGuidePage__group">
        <p class="radioGroupGuidePage__groupTitle">기본 FormField 연동</p>
        <div class="radioGroupGuidePage__demo">
          <FormField
            input-id="delivery-radio"
            label-text="배송지 선택"
            :required="true"
          >
            <RadioGroup
              v-model="selectedFormField"
              id="delivery-radio"
              :items="basicItems"
              name="address"
              :required="true"
              aria-label="배송지 선택"
            />
          </FormField>
        </div>
        <pre class="radioGroupGuidePage__code"><code>&lt;FormField
  input-id="delivery-radio"
  label-text="배송지 선택"
  :required="true"
&gt;
  &lt;RadioGroup
    v-model="selected"
    id="delivery-radio"
    :items="addressItems"
    name="address"
    :required="true"
    aria-label="배송지 선택"
  /&gt;
&lt;/FormField&gt;</code></pre>
      </div>

      <div class="radioGroupGuidePage__group">
        <p class="radioGroupGuidePage__groupTitle">에러 상태 + FormField</p>
        <div class="radioGroupGuidePage__demo">
          <FormField
            input-id="payment-radio"
            label-text="결제 수단"
            :required="true"
            error-text="결제 수단을 선택해주세요."
          >
            <RadioGroup
              id="payment-radio"
              :items="paymentItems"
              name="payment"
              :required="true"
              :error="true"
              aria-describedby="helper-payment-radio"
            />
          </FormField>
        </div>
        <pre class="radioGroupGuidePage__code"><code>&lt;FormField
  input-id="payment-radio"
  label-text="결제 수단"
  :required="true"
  error-text="결제 수단을 선택해주세요."
&gt;
  &lt;RadioGroup
    id="payment-radio"
    :items="paymentItems"
    name="payment"
    :required="true"
    :error="true"
    aria-describedby="helper-payment-radio"
  /&gt;
&lt;/FormField&gt;</code></pre>
      </div>
    </section>

    <!-- ⑤ Props / Events -->
    <section class="radioGroupGuidePage__section">
      <h2 class="radioGroupGuidePage__sectionTitle">⑤ Props / Events</h2>

      <h3 class="radioGroupGuidePage__tableTitle">Props</h3>
      <div class="radioGroupGuidePage__propsTableWrap">
        <table class="radioGroupGuidePage__propsTable">
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
              <td><code>string</code></td>
              <td><code>undefined</code></td>
              <td>현재 선택된 value (v-model 연동)</td>
            </tr>
            <tr>
              <td><code>items</code></td>
              <td><code>RadioGroupItem[]</code></td>
              <td><code>[]</code></td>
              <td>라디오 아이템 배열. 각 아이템의 타입은 아래 RadioGroupItem 참조</td>
            </tr>
            <tr>
              <td><code>orientation</code></td>
              <td><code>'horizontal' | 'vertical'</code></td>
              <td><code>'horizontal'</code></td>
              <td>아이템 나열 방향. horizontal — 가로(기본), vertical — 세로</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>그룹 전체 비활성. 모든 아이템 클릭이 차단됨</td>
            </tr>
            <tr>
              <td><code>required</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>폼 필수 여부. Radix Vue가 aria-required를 자동으로 처리함</td>
            </tr>
            <tr>
              <td><code>error</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>에러 상태. 라디오 원 테두리가 danger 색상으로 변경됨. FormField 연동 시 사용</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="radioGroupGuidePage__tableTitle">RadioGroupItem 타입</h3>
      <div class="radioGroupGuidePage__propsTableWrap">
        <table class="radioGroupGuidePage__propsTable">
          <thead>
            <tr>
              <th>필드</th>
              <th>타입</th>
              <th>필수</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>value</code></td>
              <td><code>string</code></td>
              <td>필수</td>
              <td>아이템의 고유 식별 값. 선택 시 이 값이 modelValue로 전달됨</td>
            </tr>
            <tr>
              <td><code>label</code></td>
              <td><code>string</code></td>
              <td>필수</td>
              <td>아이템 표시 텍스트</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td>선택</td>
              <td>개별 아이템 비활성. 해당 아이템만 클릭이 차단됨</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="radioGroupGuidePage__tableTitle">Events</h3>
      <div class="radioGroupGuidePage__propsTableWrap">
        <table class="radioGroupGuidePage__propsTable">
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
              <td><code>string</code></td>
              <td>아이템 선택 시 발생. v-model이 이 이벤트를 수신해 상태 업데이트</td>
            </tr>
            <tr>
              <td><code>change</code></td>
              <td><code>string</code></td>
              <td>선택값 변경 시 발생. 개발자가 이 이벤트를 수신해 폼 처리</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="radioGroupGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는 <code>v-bind="$attrs"</code>를 사용하므로
        위 Props 외에도 <code>RadioGroupRoot</code> 요소의 모든 네이티브 HTML 속성
        (<code>aria-label</code>, <code>aria-labelledby</code>, <code>aria-describedby</code>,
        <code>tabindex</code>, <code>name</code>, <code>dir</code>, <code>data-*</code> 등)을
        그대로 전달할 수 있습니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>

      <p class="radioGroupGuidePage__radixNote">
        이 컴포넌트는 <strong>Radix Vue</strong>를 기반으로 합니다.
        위 Props 외에도 Radix Vue가 지원하는 추가 props를 사용할 수 있습니다.
        전체 API는
        <a href="https://www.radix-vue.com/components/radio-group.html" target="_blank" rel="noopener noreferrer">radix-vue.com 공식 문서</a>
        또는 Context7 MCP(<code>mcp__context7__query-docs</code>)를 통해 확인하세요.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { type RadioGroupItem } from '@nd/components/atoms'

  definePageMeta({ layout: 'guide' })

  // ① 기본 데모
  const selectedBasic = ref('default')
  const basicItems: RadioGroupItem[] = [
    { value: 'default', label: '기본 배송지' },
    { value: 'new', label: '새 배송지' },
  ]

  // ② 세로 배열 데모
  const selectedVertical = ref('card')
  const paymentItems: RadioGroupItem[] = [
    { value: 'card', label: '신용카드' },
    { value: 'bank', label: '무통장입금' },
    { value: 'kakao', label: '카카오페이' },
  ]

  // ③ 상태 데모 공용
  const stateItems: RadioGroupItem[] = [
    { value: 'option1', label: '선택지 1' },
    { value: 'option2', label: '선택지 2' },
  ]

  const selectedItemDisabled = ref('card')
  const itemDisabledItems: RadioGroupItem[] = [
    { value: 'card', label: '신용카드' },
    { value: 'bank', label: '무통장입금' },
    { value: 'kakao', label: '카카오페이', disabled: true },
  ]

  // ④ FormField 연동 데모
  const selectedFormField = ref('default')
</script>

<style lang="scss" scoped src="./radioGroupGuidePage.scss"></style>
