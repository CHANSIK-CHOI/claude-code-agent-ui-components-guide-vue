<template>
  <div class="SelectGuidePage">
    <!-- 헤더 -->
    <header class="SelectGuidePage__header">
      <div class="SelectGuidePage__meta">
        <span class="SelectGuidePage__badge">atoms</span>
      </div>
      <h1 class="SelectGuidePage__title">Select</h1>
      <p class="SelectGuidePage__desc">
        미리 정의된 옵션 목록에서 하나의 값을 선택하는 드롭다운 컴포넌트입니다.<br />
        Trigger 영역은 <code>Input</code>과 동일한 외형을 가지며, 클릭 시 드롭다운 패널이 열립니다.<br />
        라벨 · 도움말 · 에러 텍스트가 필요한 경우 <code>FormField</code> (molecules)와 조합해 사용합니다.<br />
        내부적으로 <strong>Radix Vue</strong>를 사용해 키보드 탐색, 포커스 트랩, ARIA 처리를 자동으로 지원합니다.
      </p>
    </header>

    <!-- ① 기본 사용 -->
    <section class="SelectGuidePage__section">
      <h2 class="SelectGuidePage__sectionTitle">① 기본 사용</h2>

      <div class="SelectGuidePage__group">
        <p class="SelectGuidePage__groupTitle">Select 단독 (라벨 없음)</p>
        <p class="SelectGuidePage__note">
          라벨이 외부에서 제공되거나 불필요한 경우. <code>aria-label</code>을 직접 전달하세요.
        </p>
        <div class="SelectGuidePage__row">
          <div class="SelectGuidePage__item SelectGuidePage__item--narrow">
            <Select
              v-model="demo1"
              :options="categoryOptions"
              placeholder="카테고리를 선택해주세요"
              aria-label="상품 카테고리"
            />
            <pre class="SelectGuidePage__code"><code>&lt;Select
  v-model="value"
  :options="categoryOptions"
  placeholder="카테고리를 선택해주세요"
  aria-label="상품 카테고리"
/&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="SelectGuidePage__group">
        <p class="SelectGuidePage__groupTitle">FormField + Select 조합 (라벨 있음)</p>
        <p class="SelectGuidePage__note">
          <code>FormField</code>의 <code>input-id</code>와 <code>Select</code>의 <code>id</code>를 반드시 동일하게 설정해야
          스크린 리더가 라벨과 컨트롤을 올바르게 연결합니다.
        </p>
        <div class="SelectGuidePage__row">
          <div class="SelectGuidePage__item SelectGuidePage__item--narrow">
            <FormField label-text="상품 카테고리" input-id="demo-category">
              <Select
                id="demo-category"
                v-model="demo2"
                :options="categoryOptions"
                placeholder="카테고리를 선택해주세요"
              />
            </FormField>
            <pre class="SelectGuidePage__code"><code>&lt;FormField label-text="상품 카테고리" input-id="demo-category"&gt;
  &lt;Select
    id="demo-category"
    v-model="value"
    :options="categoryOptions"
    placeholder="카테고리를 선택해주세요"
  /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="SelectGuidePage__group">
        <p class="SelectGuidePage__groupTitle">FormField + Select (도움말 있음)</p>
        <p class="SelectGuidePage__note">
          <code>aria-describedby</code>는 FormField가 생성하는 도움말 요소의 id와 연결합니다.
          패턴은 <code>helper-{inputId}</code>입니다.
        </p>
        <div class="SelectGuidePage__row">
          <div class="SelectGuidePage__item SelectGuidePage__item--narrow">
            <FormField
              label-text="배송 지역"
              input-id="demo-region-helper"
              helper-text="배송 가능한 지역을 선택해주세요."
            >
              <Select
                id="demo-region-helper"
                v-model="demo3"
                :options="categoryOptions"
                placeholder="지역을 선택해주세요"
                aria-describedby="helper-demo-region-helper"
              />
            </FormField>
            <pre class="SelectGuidePage__code"><code>&lt;FormField
  label-text="배송 지역"
  input-id="demo-region-helper"
  helper-text="배송 가능한 지역을 선택해주세요."
&gt;
  &lt;Select
    id="demo-region-helper"
    v-model="value"
    :options="categoryOptions"
    placeholder="지역을 선택해주세요"
    aria-describedby="helper-demo-region-helper"
  /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ② 선택된 상태 (filled) -->
    <section class="SelectGuidePage__section">
      <h2 class="SelectGuidePage__sectionTitle">② 선택된 상태 (filled)</h2>

      <div class="SelectGuidePage__group">
        <p class="SelectGuidePage__groupTitle">값이 이미 선택된 상태</p>
        <p class="SelectGuidePage__note">
          <code>v-model</code>에 초기값이 설정되면 Trigger에 선택된 옵션의 라벨이 표시됩니다.
          placeholder는 숨겨집니다.
        </p>
        <div class="SelectGuidePage__row">
          <div class="SelectGuidePage__item SelectGuidePage__item--narrow">
            <FormField label-text="상품 카테고리" input-id="demo-filled">
              <Select
                id="demo-filled"
                v-model="demoFilled"
                :options="categoryOptions"
                placeholder="카테고리를 선택해주세요"
              />
            </FormField>
            <pre class="SelectGuidePage__code"><code>&lt;!-- v-model 초기값: 'outer' (아우터) --&gt;
&lt;FormField label-text="상품 카테고리" input-id="demo-filled"&gt;
  &lt;Select
    id="demo-filled"
    v-model="value"
    :options="categoryOptions"
    placeholder="카테고리를 선택해주세요"
  /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ③ Disabled -->
    <section class="SelectGuidePage__section">
      <h2 class="SelectGuidePage__sectionTitle">③ Disabled</h2>

      <div class="SelectGuidePage__group">
        <p class="SelectGuidePage__groupTitle">전체 비활성 상태</p>
        <p class="SelectGuidePage__note">
          <code>:disabled="true"</code>를 전달하면 Trigger 클릭이 차단되고 드롭다운이 열리지 않습니다.<br />
          Radix Vue가 <code>aria-disabled</code>를 자동으로 처리해 보조기기에 비활성 상태를 전달합니다.
        </p>
        <div class="SelectGuidePage__row">
          <div class="SelectGuidePage__item SelectGuidePage__item--narrow">
            <FormField label-text="상품 카테고리" input-id="demo-disabled">
              <Select
                id="demo-disabled"
                v-model="demoDisabled"
                :options="categoryOptions"
                placeholder="카테고리를 선택해주세요"
                :disabled="true"
              />
            </FormField>
            <pre class="SelectGuidePage__code"><code>&lt;FormField label-text="상품 카테고리" input-id="demo-disabled"&gt;
  &lt;Select
    id="demo-disabled"
    v-model="value"
    :options="categoryOptions"
    placeholder="카테고리를 선택해주세요"
    :disabled="true"
  /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="SelectGuidePage__group">
        <p class="SelectGuidePage__groupTitle">개별 아이템 비활성</p>
        <p class="SelectGuidePage__note">
          <code>options</code> 배열의 개별 항목에 <code>disabled: true</code>를 설정하면
          해당 아이템만 선택 불가 상태가 됩니다. 드롭다운은 정상적으로 열립니다.
        </p>
        <div class="SelectGuidePage__row">
          <div class="SelectGuidePage__item SelectGuidePage__item--narrow">
            <FormField label-text="상품 카테고리" input-id="demo-item-disabled">
              <Select
                id="demo-item-disabled"
                v-model="demoItemDisabled"
                :options="categoryOptionsWithDisabled"
                placeholder="카테고리를 선택해주세요"
              />
            </FormField>
            <pre class="SelectGuidePage__code"><code>&lt;!-- options 배열에서 특정 항목에 disabled: true 설정 --&gt;
&lt;Select
  id="demo-item-disabled"
  v-model="value"
  :options="[
    { value: 'top', label: '상의' },
    { value: 'bottom', label: '하의', disabled: true },
    { value: 'outer', label: '아우터' },
  ]"
  placeholder="카테고리를 선택해주세요"
/&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ④ Error -->
    <section class="SelectGuidePage__section">
      <h2 class="SelectGuidePage__sectionTitle">④ Error</h2>

      <div class="SelectGuidePage__group">
        <p class="SelectGuidePage__groupTitle">에러 상태 + FormField 조합</p>
        <p class="SelectGuidePage__note">
          <code>:error="true"</code>는 Trigger에 <code>aria-invalid="true"</code>를 자동 적용합니다.<br />
          에러 메시지 텍스트는 <code>FormField</code>의 <code>error-text</code>가 담당합니다.<br />
          <code>aria-describedby</code>로 에러 메시지 요소와 연결하세요. 패턴은 <code>helper-{inputId}</code>입니다.
        </p>
        <div class="SelectGuidePage__row">
          <div class="SelectGuidePage__item SelectGuidePage__item--narrow">
            <FormField
              label-text="상품 카테고리"
              input-id="demo-error"
              error-text="카테고리를 선택해주세요."
            >
              <Select
                id="demo-error"
                v-model="demoError"
                :options="categoryOptions"
                placeholder="카테고리를 선택해주세요"
                :error="true"
                aria-describedby="helper-demo-error"
              />
            </FormField>
            <pre class="SelectGuidePage__code"><code>&lt;FormField
  label-text="상품 카테고리"
  input-id="demo-error"
  error-text="카테고리를 선택해주세요."
&gt;
  &lt;!-- :error="true" → aria-invalid="true" 자동 적용 --&gt;
  &lt;Select
    id="demo-error"
    v-model="value"
    :options="categoryOptions"
    placeholder="카테고리를 선택해주세요"
    :error="true"
    aria-describedby="helper-demo-error"
  /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑤ 긴 목록 (스크롤) -->
    <section class="SelectGuidePage__section">
      <h2 class="SelectGuidePage__sectionTitle">⑤ 긴 목록 (스크롤)</h2>

      <div class="SelectGuidePage__group">
        <p class="SelectGuidePage__groupTitle">아이템이 많아 스크롤이 발생하는 경우</p>
        <p class="SelectGuidePage__note">
          드롭다운 패널의 최대 높이는 <code>50rem</code>으로 제한됩니다.<br />
          아이템이 이를 초과하면 내부 스크롤이 활성화되고, 패널 상하단에
          스크롤 버튼(<code>SelectScrollUpButton</code> / <code>SelectScrollDownButton</code>)이 자동으로 표시됩니다.<br />
          키보드 방향키 또는 스크롤 버튼으로 목록을 탐색할 수 있습니다.
        </p>
        <div class="SelectGuidePage__row">
          <div class="SelectGuidePage__item SelectGuidePage__item--narrow">
            <FormField label-text="배송 지역" input-id="demo-scroll">
              <!-- [연동] 개발자가 API 응답으로 교체 -->
              <Select
                id="demo-scroll"
                v-model="demoScroll"
                :options="regionOptions"
                placeholder="지역을 선택해주세요"
              />
            </FormField>
            <pre class="SelectGuidePage__code"><code>&lt;!-- 옵션이 많으면 드롭다운 상하단에 스크롤 버튼이 자동 표시됩니다 --&gt;
&lt;FormField label-text="배송 지역" input-id="demo-scroll"&gt;
  &lt;Select
    id="demo-scroll"
    v-model="value"
    :options="regionOptions"
    placeholder="지역을 선택해주세요"
  /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑥ Radix Vue attrs 위임 -->
    <section class="SelectGuidePage__section">
      <h2 class="SelectGuidePage__sectionTitle">⑥ Radix Vue 추가 옵션 (attrs 분리 위임)</h2>
      <p class="SelectGuidePage__note">
        <code>defineProps</code>에 선언되지 않은 속성은 <code>useAttrs()</code>로 분리되어 목적지에 맞게 위임됩니다.<br />
        React의 <code>{...rest}</code> 패턴과 동일하며, 별도 prop 선언 없이 Radix Vue 옵션을 바로 사용할 수 있습니다.
      </p>

      <div class="SelectGuidePage__group">
        <p class="SelectGuidePage__groupTitle">form 연동 — <code>name</code> / <code>required</code></p>
        <p class="SelectGuidePage__note">
          <code>name</code>과 <code>required</code>는 <code>SelectRoot</code>에 위임됩니다.<br />
          Radix Vue가 숨겨진 <code>&lt;input type="hidden"&gt;</code>을 내부 렌더링하여 form submit 시 선택값이 전송됩니다.
        </p>
        <div class="SelectGuidePage__row">
          <div class="SelectGuidePage__item SelectGuidePage__item--narrow">
            <FormField label-text="상품 카테고리" input-id="demo-form">
              <Select
                id="demo-form"
                v-model="demoForm"
                :options="categoryOptions"
                placeholder="카테고리를 선택해주세요"
                name="category"
                required
              />
            </FormField>
            <pre class="SelectGuidePage__code"><code>&lt;!-- name/required → SelectRoot에 위임 (Radix Vue hidden input 생성) --&gt;
&lt;Select
  v-model="value"
  :options="categoryOptions"
  name="category"
  required
/&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="SelectGuidePage__group">
        <p class="SelectGuidePage__groupTitle">aria 속성 — <code>aria-label</code> / <code>aria-describedby</code></p>
        <p class="SelectGuidePage__note">
          <code>aria-*</code>, <code>class</code>, <code>style</code>, <code>tabindex</code> 등 나머지 속성은 <code>SelectTrigger</code>에 위임됩니다.<br />
          스크린 리더가 트리거 버튼을 읽을 때 올바르게 전달됩니다.
        </p>
        <div class="SelectGuidePage__row">
          <div class="SelectGuidePage__item SelectGuidePage__item--narrow">
            <Select
              v-model="demoAria"
              :options="categoryOptions"
              placeholder="카테고리를 선택해주세요"
              aria-label="상품 카테고리 선택"
            />
            <pre class="SelectGuidePage__code"><code>&lt;!-- aria-* → SelectTrigger(button)에 위임 --&gt;
&lt;Select
  v-model="value"
  :options="categoryOptions"
  aria-label="상품 카테고리 선택"
/&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑦ Props 테이블 -->
    <section class="SelectGuidePage__section">
      <h2 class="SelectGuidePage__sectionTitle">⑦ Props</h2>

      <div class="SelectGuidePage__group">
        <p class="SelectGuidePage__groupTitle">통합 사용 예시 — Root attrs + Trigger attrs 동시 전달</p>
        <p class="SelectGuidePage__note">
          <code>name</code>, <code>required</code>는 <strong>SelectRoot</strong>로,
          <code>aria-describedby</code>는 <strong>SelectTrigger(button)</strong>으로 자동 분류됩니다.
          사용하는 쪽에서 구분 없이 한 줄에 전달하면 내부에서 자동으로 올바른 위치에 배분됩니다.
        </p>
        <div class="SelectGuidePage__row">
          <div class="SelectGuidePage__item SelectGuidePage__item--narrow">
            <FormField label-text="배송 지역" input-id="demo-delegation" helper-text="배송 가능한 지역을 선택해주세요.">
              <Select
                id="demo-delegation"
                v-model="delegationValue"
                :options="regionOptions"
                placeholder="지역 선택"
                name="region"
                required
                aria-describedby="helper-demo-delegation"
              />
            </FormField>
            <pre class="SelectGuidePage__code"><code>&lt;Select
  v-model="value"
  :options="options"
  name="region"                       &lt;!-- → SelectRoot --&gt;
  required                            &lt;!-- → SelectRoot --&gt;
  aria-describedby="helper-region"    &lt;!-- → SelectTrigger(button) --&gt;
/&gt;</code></pre>
          </div>
        </div>
      </div>

      <h3 class="SelectGuidePage__tableTitle">Select Props</h3>
      <table class="SelectGuidePage__propsTable">
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
            <td>현재 선택된 값 (v-model 연동). 미선택 시 undefined</td>
          </tr>
          <tr>
            <td><code>options</code></td>
            <td><code>SelectOption[]</code></td>
            <td>— (필수)</td>
            <td>
              드롭다운에 표시할 옵션 목록.<br />
              <code>SelectOption: { value: string; label: string; disabled?: boolean }</code>
            </td>
          </tr>
          <tr>
            <td><code>placeholder</code></td>
            <td><code>string</code></td>
            <td><code>''</code></td>
            <td>미선택 상태일 때 Trigger에 표시할 안내 텍스트</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>전체 비활성. Trigger 클릭 차단, 드롭다운 열리지 않음</td>
          </tr>
          <tr>
            <td><code>error</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>에러 상태. <code>aria-invalid="true"</code> 자동 적용. 에러 메시지 텍스트는 FormField 담당</td>
          </tr>
        </tbody>
      </table>

      <h3 class="SelectGuidePage__tableTitle">Select Events</h3>
      <table class="SelectGuidePage__propsTable">
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
            <td>옵션 선택 시 선택된 값 전달 (v-model 업데이트)</td>
          </tr>
          <tr>
            <td><code>open-change</code></td>
            <td><code>boolean</code></td>
            <td>드롭다운이 열리거나 닫힐 때 열림 여부 전달</td>
          </tr>
        </tbody>
      </table>

      <p class="SelectGuidePage__note SelectGuidePage__note--formfield">
        FormField Props/Slots 상세 설명은 <a href="/guide/input">Input 가이드 페이지</a>를 참조하세요.
      </p>

      <div class="SelectGuidePage__delegationNote">
        <p><strong>attrs 분리 위임 — 2단계 자동 분류</strong></p>
        <p>
          선언된 Props 외 속성은 <code>useAttrs()</code>로 분리되어 두 그룹으로 자동 배분됩니다.
          React의 <code>{...rest}</code> spreading과 동일한 동작이지만, Select는 Root / Trigger 두 위치로 나뉩니다.
        </p>

        <p class="SelectGuidePage__delegationSubtitle">1단계 — SelectRoot 전달 attrs</p>
        <table class="SelectGuidePage__delegationTable">
          <thead>
            <tr><th>속성</th><th>설명</th></tr>
          </thead>
          <tbody>
            <tr><td><code>name</code></td><td>폼 제출 시 필드명. Radix Vue가 hidden input을 자동 생성해 전송</td></tr>
            <tr><td><code>required</code></td><td>필수 입력 여부</td></tr>
            <tr><td><code>dir</code></td><td>텍스트 방향 (<code>ltr</code> / <code>rtl</code>)</td></tr>
            <tr><td><code>open</code></td><td>드롭다운 열림 상태 제어 (<code>v-model:open</code>)</td></tr>
            <tr><td><code>defaultOpen</code></td><td>초기 열림 상태 (비제어 모드)</td></tr>
            <tr><td><code>defaultValue</code></td><td>초기 선택값 (비제어 모드, v-model 없이 사용 시)</td></tr>
            <tr><td><code>autocomplete</code></td><td>자동완성 힌트</td></tr>
          </tbody>
        </table>

        <p class="SelectGuidePage__delegationSubtitle">2단계 — SelectTrigger(button) 전달 attrs</p>
        <table class="SelectGuidePage__delegationTable">
          <thead>
            <tr><th>속성</th><th>예시</th></tr>
          </thead>
          <tbody>
            <tr><td><code>aria-label</code></td><td>라벨 없는 단독 사용 시 버튼 대체 텍스트</td></tr>
            <tr><td><code>aria-describedby</code></td><td>도움말 / 에러 메시지 연결</td></tr>
            <tr><td><code>tabindex</code></td><td>포커스 순서 제어</td></tr>
            <tr><td><code>data-*</code></td><td>커스텀 데이터 속성 (테스트 셀렉터 등)</td></tr>
          </tbody>
        </table>

        <pre class="SelectGuidePage__code"><code>&lt;!-- 두 그룹을 구분 없이 한 줄에 전달 → 내부에서 자동 분류 --&gt;
&lt;Select
  v-model="value"
  :options="options"
  name="category"              &lt;!-- → SelectRoot --&gt;
  required                     &lt;!-- → SelectRoot --&gt;
  aria-describedby="helper"    &lt;!-- → SelectTrigger(button) --&gt;
  tabindex="2"                 &lt;!-- → SelectTrigger(button) --&gt;
/&gt;</code></pre>
        <p>※ <code>id</code>는 양쪽 제외 — 내부 <code>selectId</code>가 단독 처리 (<code>&lt;label for&gt;</code> 연동)</p>
      </div>

      <p class="SelectGuidePage__radixNote">
        이 컴포넌트는 <strong>Radix Vue</strong>를 기반으로 합니다.
        위 Props 외에도 Radix Vue가 지원하는 추가 props를 사용할 수 있습니다.
        전체 API는
        <a href="https://www.radix-vue.com/components/select.html" target="_blank" rel="noopener noreferrer">radix-vue.com 공식 문서</a>
        또는 Context7 MCP(<code>mcp__context7__query-docs</code>)를 통해 확인하세요.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
// [연동] 개발자가 API 응답으로 교체
const categoryOptions = [
  { value: 'top', label: '상의' },
  { value: 'bottom', label: '하의' },
  { value: 'outer', label: '아우터' },
  { value: 'dress', label: '원피스' },
  { value: 'shoes', label: '신발' },
]

// [연동] disabled 아이템 케이스용
const categoryOptionsWithDisabled = [
  { value: 'top', label: '상의' },
  { value: 'bottom', label: '하의', disabled: true },
  { value: 'outer', label: '아우터' },
  { value: 'dress', label: '원피스', disabled: true },
  { value: 'shoes', label: '신발' },
]

// [연동] 긴 목록 케이스용 — 개발자가 API 응답으로 교체
const regionOptions = [
  { value: 'seoul', label: '서울특별시' },
  { value: 'busan', label: '부산광역시' },
  { value: 'daegu', label: '대구광역시' },
  { value: 'incheon', label: '인천광역시' },
  { value: 'gwangju', label: '광주광역시' },
  { value: 'daejeon', label: '대전광역시' },
  { value: 'ulsan', label: '울산광역시' },
  { value: 'sejong', label: '세종특별자치시' },
  { value: 'gyeonggi', label: '경기도' },
  { value: 'gangwon', label: '강원특별자치도' },
  { value: 'chungbuk', label: '충청북도' },
  { value: 'chungnam', label: '충청남도' },
  { value: 'jeonbuk', label: '전북특별자치도' },
  { value: 'jeonnam', label: '전라남도' },
  { value: 'gyeongbuk', label: '경상북도' },
  { value: 'gyeongnam', label: '경상남도' },
  { value: 'jeju', label: '제주특별자치도' },
]

// 데모 상태값
const demo1 = ref<string | undefined>(undefined)
const demo2 = ref<string | undefined>(undefined)
const demo3 = ref<string | undefined>(undefined)
const demoFilled = ref<string>('outer') // 선택된 상태 시연용 초기값
const demoDisabled = ref<string | undefined>(undefined)
const demoItemDisabled = ref<string | undefined>(undefined)
const demoError = ref<string | undefined>(undefined)
const demoScroll = ref<string | undefined>(undefined)
const demoForm = ref<string | undefined>(undefined)
const demoAria = ref<string | undefined>(undefined)
const delegationValue = ref<string | undefined>(undefined)
</script>

<style lang="scss" scoped src="./selectGuidePage.scss"></style>
