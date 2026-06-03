<template>
  <div class="pinPickerGuidePage">
    <!-- 헤더 -->
    <header class="pinPickerGuidePage__header">
      <div class="pinPickerGuidePage__meta">
        <span class="pinPickerGuidePage__badge">popup</span>
      </div>
      <h1 class="pinPickerGuidePage__title">PinPicker</h1>
      <p class="pinPickerGuidePage__desc">
        일반 옵션(사이즈, 시간, 지역 등)을 드럼 롤 휠로 선택하는 바텀시트 팝업 컴포넌트.<br />
        내부적으로 <strong>BottomSheet</strong> + <strong>Vant Picker</strong>를 조합해 헤더·확인 버튼은 BottomSheet가,
        휠 UI는 Vant가 담당합니다.<br />
        단일 컬럼·다중 독립 컬럼·cascading(계층형) 컬럼 모두 지원하며,
        <code>v-model</code>로 선택값(<code>string[]</code>)을, <code>v-model:open</code>으로 열림 상태를 제어합니다.
        confirm 전까지 임시값을 보관하며, 확인 버튼 클릭 시에만 <code>update:modelValue</code>가 발생합니다.
      </p>
    </header>

    <!-- ① 기본 사용 (단일 컬럼) -->
    <section class="pinPickerGuidePage__section">
      <h2 class="pinPickerGuidePage__sectionTitle">① 기본 사용 (단일 컬럼)</h2>
      <p class="pinPickerGuidePage__note">
        <code>columns</code>에 <code>PickerOption[]</code> 배열을 전달하는 단일 컬럼 예시입니다. 사이즈(S / M / L / XL /
        XXL) 선택 후 확인 버튼 클릭 시 선택값이 아래에 표시됩니다.
      </p>
      <div class="pinPickerGuidePage__demo">
        <Button @click="sizeOpen = true">사이즈 선택 열기</Button>
        <p v-if="sizeResult" class="pinPickerGuidePage__result">
          선택된 사이즈: <strong>{{ sizeResult }}</strong>
        </p>
      </div>
      <PinPicker
        v-model="sizeValue"
        v-model:open="sizeOpen"
        title="사이즈 선택"
        :columns="sizeColumns"
        @confirm="handleSizeConfirm"
        body-note="정기 결제일이 곧 상품 출고 기준일이 됩니다.<br/>예: 매월 10일 자동 결제 → 결제 확인 후 순차 출고(매월 1회 정기 배송)"
      />
      <pre class="pinPickerGuidePage__code"><code>&lt;PinPicker
  v-model="selectedSize"
  v-model:open="isOpen"
  title="사이즈 선택"
  :columns="sizeColumns"
  @confirm="({ selectedValues }) =&gt; console.log(selectedValues)"
  body-note="정기 결제일이 곧 상품 출고 기준일이 됩니다.예: 매월 10일 자동 결제 → 결제 확인 후 순차 출고(매월 1회 정기 배송)"
/&gt;</code></pre>
    </section>

    <!-- ② 다중 독립 컬럼 -->
    <section class="pinPickerGuidePage__section">
      <h2 class="pinPickerGuidePage__sectionTitle">② 다중 독립 컬럼</h2>
      <p class="pinPickerGuidePage__note">
        <code>columns</code>에 <code>PickerOption[][]</code>(배열의 배열)을 전달하면 독립적인 다중 컬럼이 표시됩니다. 첫
        번째 컬럼(testColumns1)은 옵션이 1개뿐이므로 스크롤되지 않습니다. 두 번째 컬럼(testColumns2)만 스크롤됩니다.
        확인 후 "매월 N일" 형태로 표시됩니다.
      </p>
      <div class="pinPickerGuidePage__demo">
        <Button @click="timeOpen = true">날짜 선택 열기</Button>
        <p v-if="timeResult" class="pinPickerGuidePage__result">
          선택된 날짜: <strong>{{ timeResult }}</strong>
        </p>
      </div>
      <PinPicker
        v-model="timeValue"
        v-model:open="timeOpen"
        title="날짜 선택"
        :columns="[testColumns1, testColumns2]"
        @confirm="handleTestConfirm"
      />
      <pre class="pinPickerGuidePage__code"><code>&lt;PinPicker
  v-model="selectedDate"
  v-model:open="isOpen"
  title="날짜 선택"
  :columns="[testColumns1, testColumns2]"
  @confirm="handleConfirm"
/&gt;

&lt;!-- testColumns1 = [{ text: '매월(한 달에 한 번)', value: '1' }] --&gt;
&lt;!-- testColumns2 = [1,2,3,4,5].map(d =&gt; ({ text: d + '일', value: String(d) })) --&gt;
&lt;!-- 옵션이 1개인 컬럼은 스크롤되지 않습니다 (readonly 불필요) --&gt;</code></pre>
    </section>

    <!-- ③ cascading 컬럼 -->
    <section class="pinPickerGuidePage__section">
      <h2 class="pinPickerGuidePage__sectionTitle">③ cascading 컬럼</h2>
      <p class="pinPickerGuidePage__note">
        <code>columns</code>에 <code>children</code> 필드를 포함한 <code>PickerOption[]</code>를 전달하면 계층형 선택이
        활성화됩니다. 상위 컬럼(시/도) 선택 시 하위 컬럼(구)이 자동으로 변경됩니다. 확인 후 "시 구" 형태로 표시됩니다.
      </p>
      <div class="pinPickerGuidePage__demo">
        <Button @click="regionOpen = true">지역 선택 열기</Button>
        <p v-if="regionResult" class="pinPickerGuidePage__result">
          선택된 지역: <strong>{{ regionResult }}</strong>
        </p>
      </div>
      <PinPicker
        v-model="regionValue"
        v-model:open="regionOpen"
        title="지역 선택"
        :columns="regionColumns"
        @confirm="handleRegionConfirm"
      />
      <pre class="pinPickerGuidePage__code"><code>&lt;PinPicker
  v-model="selectedRegion"
  v-model:open="isOpen"
  title="지역 선택"
  :columns="regionCascadeOptions"
  @confirm="({ selectedValues }) =&gt; console.log(selectedValues)"
/&gt;</code></pre>
    </section>

    <!-- ④ 상태 (State) -->
    <section class="pinPickerGuidePage__section">
      <h2 class="pinPickerGuidePage__sectionTitle">④ 상태 (State)</h2>

      <!-- loading -->
      <div class="pinPickerGuidePage__group">
        <p class="pinPickerGuidePage__groupTitle">loading: true</p>
        <p class="pinPickerGuidePage__note">
          <code>:loading="true"</code> 적용 시 휠 영역에 로딩 인디케이터가 오버레이되고 조작이 불가합니다. 토글 버튼으로
          loading 상태를 전환할 수 있습니다.
        </p>
        <div class="pinPickerGuidePage__demo">
          <Button @click="stateLoadingOpen = true">로딩 상태 확인 열기</Button>
        </div>
        <PinPicker
          v-model="stateValue"
          v-model:open="stateLoadingOpen"
          title="사이즈 선택"
          :columns="sizeColumns"
          :loading="stateLoading"
        >
        </PinPicker>
        <div class="pinPickerGuidePage__toggleRow">
          <Button :variant="stateLoading ? 'primary' : 'secondary'" size="sm" @click="stateLoading = !stateLoading">
            loading: {{ stateLoading }}
          </Button>
        </div>
        <pre class="pinPickerGuidePage__code"><code>&lt;PinPicker
  v-model="selectedSize"
  v-model:open="isOpen"
  title="사이즈 선택"
  :columns="sizeColumns"
  :loading="true"
/&gt;</code></pre>
      </div>

      <!-- readonly -->
      <div class="pinPickerGuidePage__group">
        <p class="pinPickerGuidePage__groupTitle">readonly: true</p>
        <p class="pinPickerGuidePage__note">
          <code>:readonly="true"</code> 적용 시 휠 스크롤이 불가하며 현재 선택값만 표시합니다. 확인 버튼은 동작합니다.
          토글 버튼으로 readonly 상태를 전환할 수 있습니다.
        </p>
        <div class="pinPickerGuidePage__demo">
          <Button @click="stateReadonlyOpen = true">읽기 전용 확인 열기</Button>
        </div>
        <PinPicker
          v-model="stateReadonlyValue"
          v-model:open="stateReadonlyOpen"
          title="사이즈 선택"
          :columns="sizeColumns"
          :readonly="stateReadonly"
        />
        <div class="pinPickerGuidePage__toggleRow">
          <Button :variant="stateReadonly ? 'primary' : 'secondary'" size="sm" @click="stateReadonly = !stateReadonly">
            readonly: {{ stateReadonly }}
          </Button>
        </div>
        <pre class="pinPickerGuidePage__code"><code>&lt;PinPicker
  v-model="selectedSize"
  v-model:open="isOpen"
  title="사이즈 선택"
  :columns="sizeColumns"
  :readonly="true"
/&gt;</code></pre>
      </div>

      <!-- okDisabled -->
      <div class="pinPickerGuidePage__group">
        <p class="pinPickerGuidePage__groupTitle">okDisabled: true</p>
        <p class="pinPickerGuidePage__note">
          <code>:ok-disabled="true"</code> 적용 시 확인 버튼이 비활성 처리됩니다. BottomSheet가 내장 처리합니다. 토글
          버튼으로 okDisabled 상태를 전환할 수 있습니다.
        </p>
        <div class="pinPickerGuidePage__demo">
          <Button @click="stateOkDisabledOpen = true">확인 비활성 확인 열기</Button>
        </div>
        <PinPicker
          v-model="stateOkDisabledValue"
          v-model:open="stateOkDisabledOpen"
          title="사이즈 선택"
          :columns="sizeColumns"
          :ok-disabled="stateOkDisabled"
        />
        <div class="pinPickerGuidePage__toggleRow">
          <Button
            :variant="stateOkDisabled ? 'primary' : 'secondary'"
            size="sm"
            @click="stateOkDisabled = !stateOkDisabled"
          >
            okDisabled: {{ stateOkDisabled }}
          </Button>
        </div>
        <pre class="pinPickerGuidePage__code"><code>&lt;PinPicker
  v-model="selectedSize"
  v-model:open="isOpen"
  title="사이즈 선택"
  :columns="sizeColumns"
  :ok-disabled="true"
/&gt;</code></pre>
      </div>
    </section>

    <!-- ⑤ Props / Events 테이블 -->
    <section class="pinPickerGuidePage__section">
      <h2 class="pinPickerGuidePage__sectionTitle">⑤ Props / Events</h2>

      <h3 class="pinPickerGuidePage__tableTitle">컴포넌트 자체 Props</h3>
      <div class="pinPickerGuidePage__propsTableWrap">
        <table class="pinPickerGuidePage__propsTable">
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
              <td><code>string[]</code></td>
              <td><code>[]</code></td>
              <td>선택된 value 배열. <code>v-model</code>로 양방향 바인딩</td>
            </tr>
            <tr>
              <td><code>open</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>바텀시트 열림 여부. <code>v-model:open</code>으로 양방향 바인딩</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="pinPickerGuidePage__tableTitle">Vant Picker Passthrough Props</h3>
      <div class="pinPickerGuidePage__propsTableWrap">
        <table class="pinPickerGuidePage__propsTable">
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
              <td><code>columns</code></td>
              <td><code>PickerOption[] | PickerOption[][]</code></td>
              <td><code>[]</code></td>
              <td>
                옵션 데이터. 단일 컬럼은 <code>PickerOption[]</code>, 다중 독립 컬럼은 <code>PickerOption[][]</code>,
                cascading은 <code>children</code> 필드 포함 <code>PickerOption[]</code>
              </td>
            </tr>
            <tr>
              <td><code>columnsFieldNames</code></td>
              <td><code>&#123; text?: string; value?: string; children?: string &#125;</code></td>
              <td><code>&#123; text: 'text', value: 'value', children: 'children' &#125;</code></td>
              <td><code>text</code>·<code>value</code>·<code>children</code> 필드명 커스터마이징</td>
            </tr>
            <tr>
              <td><code>loading</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>로딩 인디케이터 표시, 휠 조작 불가</td>
            </tr>
            <tr>
              <td><code>readonly</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>휠 스크롤 불가, 현재 선택값 표시만</td>
            </tr>
            <tr>
              <td><code>optionHeight</code></td>
              <td><code>number | string</code></td>
              <td><code>44</code></td>
              <td>각 옵션 행의 높이 (px 기본)</td>
            </tr>
            <tr>
              <td><code>visibleOptionNum</code></td>
              <td><code>number</code></td>
              <td><code>6</code></td>
              <td>한 번에 보이는 옵션 개수</td>
            </tr>
            <tr>
              <td><code>swipeDuration</code></td>
              <td><code>number</code></td>
              <td><code>1000</code></td>
              <td>빠른 스와이프 후 관성 스크롤 지속 시간 (ms)</td>
            </tr>
            <tr>
              <td><code>allowHtml</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>옵션 텍스트에 HTML 허용 (보안상 기본 비활성)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="pinPickerGuidePage__tableTitle">Events</h3>
      <div class="pinPickerGuidePage__propsTableWrap">
        <table class="pinPickerGuidePage__propsTable">
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
              <td><code>string[]</code></td>
              <td>confirm 시점에 선택값 확정. 선택된 value 배열 반환</td>
            </tr>
            <tr>
              <td><code>update:open</code></td>
              <td><code>boolean</code></td>
              <td>BottomSheet 닫힘 처리 시 <code>false</code> 발생</td>
            </tr>
            <tr>
              <td><code>confirm</code></td>
              <td><code>&#123; selectedValues, selectedOptions, selectedIndexes &#125;</code></td>
              <td>확인 버튼 클릭 시 발생. 이 시점에 <code>update:modelValue</code>도 함께 발생</td>
            </tr>
            <tr>
              <td><code>cancel</code></td>
              <td><code>&#123; selectedValues, selectedOptions, selectedIndexes &#125;</code></td>
              <td>취소 버튼 또는 ✕ 버튼 클릭 시 발생. modelValue는 변경되지 않음</td>
            </tr>
            <tr>
              <td><code>change</code></td>
              <td><code>&#123; selectedValues, selectedOptions, selectedIndexes, columnIndex &#125;</code></td>
              <td>휠 스크롤로 선택 항목이 변경될 때마다 발생 (confirm 전 임시 상태)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="pinPickerGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는 <code>v-bind="$attrs"</code>를 사용하므로 위 Props 외에도
        <code>BottomSheet</code>가 지원하는 추가 props (<code>description</code>, <code>showClose</code>,
        <code>cancelLabel</code>, <code>closeOnEscape</code>, <code>showFooter</code> 등)를 그대로 전달할 수
        있습니다.<br />
        React의 <code>&#123;...rest&#125;</code> props spreading과 동일한 동작입니다.
      </p>

      <p class="pinPickerGuidePage__vantNote">
        이 컴포넌트는 <strong>Vant Picker</strong>를 기반으로 합니다. 위 Props 외에도 Vant Picker가 지원하는 추가
        props를 사용할 수 있습니다. 전체 API는
        <a href="https://vant-ui.github.io/vant/#/en-US/picker" target="_blank" rel="noopener noreferrer"
          >Vant 공식 문서</a
        >를 확인하세요.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  import type { PickerConfirmEventParams } from 'vant';
  import { PinPicker } from '@nd/components/popup';

  definePageMeta({ layout: 'guide' });

  // ── 공용 데이터 ────────────────────────────────────

  // [연동] 개발자가 API 응답으로 교체
  const sizeColumns = [
    { text: 'S', value: 'S' },
    { text: 'M', value: 'M' },
    { text: 'L', value: 'L' },
    { text: 'XL', value: 'XL' },
    { text: 'XXL', value: 'XXL' },
  ];

  const testColumns1 = [
    {
      text: "'매월(한 달에 한 번)'",
      value: '1',
    },
  ];

  const testColumns2 = [1, 2, 3, 4, 5].map((m) => ({
    text: `${m}일`,
    value: String(m),
  }));

  const regionColumns = [
    {
      text: '서울',
      value: 'seoul',
      children: [
        { text: '강남구', value: 'gangnam' },
        { text: '서초구', value: 'seocho' },
        { text: '마포구', value: 'mapo' },
      ],
    },
    {
      text: '부산',
      value: 'busan',
      children: [
        { text: '해운대구', value: 'haeundae' },
        { text: '사하구', value: 'saha' },
      ],
    },
  ];

  // ① 기본 사용 (단일 컬럼 — 사이즈)
  const sizeOpen = ref(false);
  const sizeValue = ref<string[]>(['M']);
  const sizeResult = ref('');

  function handleSizeConfirm({
    selectedValues,
  }: Pick<PickerConfirmEventParams, 'selectedValues' | 'selectedOptions' | 'selectedIndexes'>) {
    sizeResult.value = selectedValues.map(String).join(', ');
    sizeOpen.value = false;
  }

  // ② 다중 독립 컬럼 (시·분)
  const timeOpen = ref(false);
  const timeValue = ref<string[]>(['9', '0']);
  const timeResult = ref('');

  function handleTestConfirm({
    selectedValues,
  }: Pick<PickerConfirmEventParams, 'selectedValues' | 'selectedOptions' | 'selectedIndexes'>) {
    const [, day] = selectedValues.map(String);
    timeResult.value = `매월 ${day}일`;
    timeOpen.value = false;
  }

  // ③ cascading 컬럼 (지역)
  const regionOpen = ref(false);
  const regionValue = ref<string[]>(['seoul', 'gangnam']);
  const regionResult = ref('');

  function handleRegionConfirm({
    selectedValues,
  }: Pick<PickerConfirmEventParams, 'selectedValues' | 'selectedOptions' | 'selectedIndexes'>) {
    // 지역명 매핑
    const cityMap: Record<string, string> = { seoul: '서울', busan: '부산' };
    const districtMap: Record<string, string> = {
      gangnam: '강남구',
      seocho: '서초구',
      mapo: '마포구',
      haeundae: '해운대구',
      saha: '사하구',
    };
    const [city, district] = selectedValues.map(String);
    regionResult.value = [cityMap[city] ?? city, districtMap[district] ?? district].filter(Boolean).join(' ');
    regionOpen.value = false;
  }

  // ④ 상태 데모
  const stateValue = ref<string[]>(['M']);
  const stateLoadingOpen = ref(false);
  const stateLoading = ref(true);

  const stateReadonlyValue = ref<string[]>(['L']);
  const stateReadonlyOpen = ref(false);
  const stateReadonly = ref(true);

  const stateOkDisabledValue = ref<string[]>(['M']);
  const stateOkDisabledOpen = ref(false);
  const stateOkDisabled = ref(true);
</script>

<style lang="scss" scoped src="./pinPicker.scss"></style>
