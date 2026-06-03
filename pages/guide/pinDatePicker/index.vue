<template>
  <div class="pinDatePickerGuidePage">
    <!-- 헤더 -->
    <header class="pinDatePickerGuidePage__header">
      <div class="pinDatePickerGuidePage__meta">
        <span class="pinDatePickerGuidePage__badge">popup</span>
      </div>
      <h1 class="pinDatePickerGuidePage__title">PinDatePicker</h1>
      <p class="pinDatePickerGuidePage__desc">
        날짜(연·월·일)를 드럼 롤 휠로 선택하는 바텀시트 팝업 컴포넌트.<br />
        내부적으로 <strong>BottomSheet</strong> + <strong>Vant DatePicker</strong>를 조합해 헤더·확인 버튼은
        BottomSheet가, 휠 UI는 Vant가 담당합니다.<br />
        <code>v-model</code>로 선택값(<code>string[]</code>)을, <code>v-model:open</code>으로 열림 상태를 제어합니다.
        confirm 전까지 임시값을 보관하며, 확인 버튼 클릭 시에만 <code>update:modelValue</code>가 발생합니다.
      </p>
    </header>

    <!-- ① 기본 사용 (생년월일) -->
    <section class="pinDatePickerGuidePage__section">
      <h2 class="pinDatePickerGuidePage__sectionTitle">① 기본 사용 (생년월일)</h2>
      <p class="pinDatePickerGuidePage__note">
        <code>columnsType: ['year', 'month', 'day']</code> (기본값). 휠 스크롤 시 <code>@change</code>로 okLabel이
        동적으로 업데이트됩니다. 확인 버튼 클릭 시 선택값이 아래에 표시됩니다.
      </p>
      <div class="pinDatePickerGuidePage__demo">
        <Button @click="basicOpen = true">생년월일 선택 열기</Button>
        <p v-if="basicResult.length" class="pinDatePickerGuidePage__result">
          선택된 날짜: <strong>{{ basicResult.join(' / ') }}</strong>
        </p>
      </div>
      <PinDatePicker
        v-model="basicValue"
        v-model:open="basicOpen"
        title="생년월일 선택"
        :ok-label="basicOkLabel"
        @confirm="handleBasicConfirm"
        @change="handleBasicChange"
        body-note="정기 결제일이 곧 상품 출고 기준일이 됩니다.<br/>예: 매월 10일 자동 결제 → 결제 확인 후 순차 출고(매월 1회 정기 배송)"
      />
      <pre class="pinDatePickerGuidePage__code"><code>&lt;PinDatePicker
  v-model="birthDate"
  v-model:open="isOpen"
  title="생년월일 선택"
  :ok-label="dynamicLabel"
  @confirm="({ selectedValues }) =&gt; console.log(selectedValues)"
  @change="({ selectedValues }) =&gt; updateLabel(selectedValues)"
  body-note="정기 결제일이 곧 상품 출고 기준일이 됩니다.예: 매월 10일 자동 결제 → 결제 확인 후 순차 출고(매월 1회 정기 배송)"
/&gt;</code></pre>
    </section>

    <!-- ② 연·월만 선택 -->
    <section class="pinDatePickerGuidePage__section">
      <h2 class="pinDatePickerGuidePage__sectionTitle">② 연·월만 선택</h2>
      <p class="pinDatePickerGuidePage__note">
        <code>:columns-type="['year', 'month']"</code>으로 연·월 2단 휠만 표시합니다. <code>minDate</code> /
        <code>maxDate</code>로 선택 범위를 제한할 수 있습니다.
      </p>
      <div class="pinDatePickerGuidePage__demo">
        <Button @click="ymOpen = true">연·월 선택 열기</Button>
        <p v-if="ymResult.length" class="pinDatePickerGuidePage__result">
          선택된 연월: <strong>{{ ymResult.join(' / ') }}</strong>
        </p>
      </div>
      <PinDatePicker
        v-model="ymValue"
        v-model:open="ymOpen"
        title="적용 기간 선택"
        :columns-type="['year', 'month']"
        :min-date="ymMinDate"
        :max-date="ymMaxDate"
        @confirm="handleYmConfirm"
      />
      <pre class="pinDatePickerGuidePage__code"><code>&lt;PinDatePicker
  v-model="yearMonth"
  v-model:open="isOpen"
  title="적용 기간 선택"
  :columns-type="['year', 'month']"
  :min-date="new Date(2020, 0, 1)"
  :max-date="new Date(2030, 11, 31)"
  @confirm="handleConfirm"
/&gt;</code></pre>
    </section>

    <!-- ③ 취소 버튼 숨김 -->
    <section class="pinDatePickerGuidePage__section">
      <h2 class="pinDatePickerGuidePage__sectionTitle">③ 취소 버튼 숨김</h2>
      <p class="pinDatePickerGuidePage__note">
        <code>:show-cancel="false"</code> 적용 시 하단 취소 버튼이 렌더링되지 않습니다. 닫기(✕) 버튼만으로 닫을 수
        있습니다.
      </p>
      <div class="pinDatePickerGuidePage__demo">
        <Button @click="noCancelOpen = true">취소 없는 날짜 선택 열기</Button>
        <p v-if="noCancelResult.length" class="pinDatePickerGuidePage__result">
          선택된 날짜: <strong>{{ noCancelResult.join(' / ') }}</strong>
        </p>
      </div>
      <PinDatePicker
        v-model="noCancelValue"
        v-model:open="noCancelOpen"
        title="날짜 선택"
        :show-cancel="false"
        @confirm="handleNoCancelConfirm"
      />
      <pre class="pinDatePickerGuidePage__code"><code>&lt;PinDatePicker
  v-model="date"
  v-model:open="isOpen"
  title="날짜 선택"
  :show-cancel="false"
  @confirm="handleConfirm"
/&gt;</code></pre>
    </section>

    <!-- ④ 상태 (State) -->
    <section class="pinDatePickerGuidePage__section">
      <h2 class="pinDatePickerGuidePage__sectionTitle">④ 상태 (State)</h2>

      <!-- selected — 선택 강조 (bold) -->
      <div class="pinDatePickerGuidePage__group">
        <p class="pinDatePickerGuidePage__groupTitle">selected — 선택 항목 강조</p>
        <p class="pinDatePickerGuidePage__note">
          선택된 항목(<code>.van-picker-column__item--selected</code>)에 <code>font-weight: bold</code>가 적용되어
          시각적으로 강조됩니다. <code>.van-picker__frame</code>의 <code>box-shadow</code>는 제거되어
          border-top/bottom만 표시됩니다.
        </p>
        <div class="pinDatePickerGuidePage__demo">
          <Button @click="selectedOpen = true">선택 강조 확인 열기</Button>
          <p v-if="selectedResult.length" class="pinDatePickerGuidePage__result">
            선택된 날짜: <strong>{{ selectedResult.join(' / ') }}</strong>
          </p>
        </div>
        <PinDatePicker
          v-model="selectedValue"
          v-model:open="selectedOpen"
          title="날짜 선택"
          @confirm="handleSelectedConfirm"
        />
        <pre
          class="pinDatePickerGuidePage__code"
        ><code>&lt;!-- .van-picker-column__item--selected: font-weight bold 강조 --&gt;
&lt;!-- .van-picker__frame box-shadow 제거, border-top/bottom만 유지 --&gt;
&lt;PinDatePicker
  v-model="date"
  v-model:open="isOpen"
  title="날짜 선택"
  @confirm="handleConfirm"
/&gt;</code></pre>
      </div>

      <div class="pinDatePickerGuidePage__group">
        <p class="pinDatePickerGuidePage__groupTitle">loading: true</p>
        <p class="pinDatePickerGuidePage__note">
          <code>:loading="true"</code> 적용 시 휠 영역에 로딩 인디케이터가 오버레이되고 조작이 불가합니다.
        </p>
        <div class="pinDatePickerGuidePage__demo">
          <Button @click="loadingOpen = true">로딩 상태로 열기</Button>
        </div>
        <PinDatePicker v-model="loadingValue" v-model:open="loadingOpen" title="날짜 선택" :loading="true" />
        <pre class="pinDatePickerGuidePage__code"><code>&lt;PinDatePicker
  v-model="date"
  v-model:open="isOpen"
  title="날짜 선택"
  :loading="true"
/&gt;</code></pre>
      </div>

      <div class="pinDatePickerGuidePage__group">
        <p class="pinDatePickerGuidePage__groupTitle">readonly: true</p>
        <p class="pinDatePickerGuidePage__note">
          <code>:readonly="true"</code> 적용 시 휠 스크롤이 불가하며 현재 선택값만 표시합니다. 확인 버튼은 동작합니다.
        </p>
        <div class="pinDatePickerGuidePage__demo">
          <Button @click="readonlyOpen = true">읽기 전용으로 열기</Button>
        </div>
        <PinDatePicker v-model="readonlyValue" v-model:open="readonlyOpen" title="날짜 확인" :readonly="true" />
        <pre class="pinDatePickerGuidePage__code"><code>&lt;PinDatePicker
  v-model="date"
  v-model:open="isOpen"
  title="날짜 확인"
  :readonly="true"
/&gt;</code></pre>
      </div>
    </section>

    <!-- ⑤ Props / Events 테이블 -->
    <section class="pinDatePickerGuidePage__section">
      <h2 class="pinDatePickerGuidePage__sectionTitle">⑤ Props / Events</h2>

      <h3 class="pinDatePickerGuidePage__tableTitle">컴포넌트 자체 Props</h3>
      <div class="pinDatePickerGuidePage__propsTableWrap">
        <table class="pinDatePickerGuidePage__propsTable">
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
              <td>선택된 날짜. <code>['YYYY', 'MM', 'DD']</code> 형식. <code>v-model</code>로 양방향 바인딩</td>
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

      <h3 class="pinDatePickerGuidePage__tableTitle">Vant DatePicker Passthrough Props</h3>
      <div class="pinDatePickerGuidePage__propsTableWrap">
        <table class="pinDatePickerGuidePage__propsTable">
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
              <td><code>columnsType</code></td>
              <td><code>string[]</code></td>
              <td><code>['year', 'month', 'day']</code></td>
              <td>표시할 날짜 단위 배열. <code>'year'</code> / <code>'month'</code> / <code>'day'</code> 조합 가능</td>
            </tr>
            <tr>
              <td><code>minDate</code></td>
              <td><code>Date</code></td>
              <td>10년 전</td>
              <td>선택 가능한 최솟값 날짜</td>
            </tr>
            <tr>
              <td><code>maxDate</code></td>
              <td><code>Date</code></td>
              <td>10년 후</td>
              <td>선택 가능한 최댓값 날짜</td>
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
              <td><code>formatter</code></td>
              <td><code>(type: string, option: PickerOption) =&gt; PickerOption</code></td>
              <td>연·월·일 접미사 자동 부가</td>
              <td>
                옵션 표시 텍스트 가공 함수. 기본값으로 <code>year→년</code>, <code>month→월</code>,
                <code>day→일</code> 접미사를 각 컬럼 텍스트 뒤에 붙인다.<br />
                기본 함수:
                <code
                  >(type, option) =&gt; ({ ...option, text: option.text + ({year:'년', month:'월', day:'일'}[type] ??
                  '') })</code
                ><br />
                외부에서 직접 전달하면 기본 접미사 동작이 완전히 교체된다.
              </td>
            </tr>
            <tr>
              <td><code>filter</code></td>
              <td><code>(type: string, options: PickerOption[], values: string[]) =&gt; PickerOption[]</code></td>
              <td>—</td>
              <td>특정 조건의 옵션만 표시하는 필터 함수</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="pinDatePickerGuidePage__tableTitle">Events</h3>
      <div class="pinDatePickerGuidePage__propsTableWrap">
        <table class="pinDatePickerGuidePage__propsTable">
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
              <td>confirm 시점에 선택값 확정. <code>['YYYY', 'MM', 'DD']</code> 형식</td>
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

      <p class="pinDatePickerGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는 <code>v-bind="$attrs"</code>를 사용하므로 위 Props 외에도
        <code>BottomSheet</code>가 지원하는 추가 props (<code>description</code>, <code>showClose</code>,
        <code>cancelLabel</code>, <code>closeOnEscape</code>, <code>showFooter</code> 등)를 그대로 전달할 수
        있습니다.<br />
        Vant DatePicker의 추가 passthrough props (formatter, filter 등)도 명시적 props로 지원합니다.
      </p>

      <p class="pinDatePickerGuidePage__vantNote">
        이 컴포넌트는 <strong>Vant DatePicker</strong>를 기반으로 합니다. 위 Props 외에도 Vant DatePicker가 지원하는
        추가 props를 사용할 수 있습니다. 전체 API는
        <a href="https://vant-ui.github.io/vant/#/en-US/date-picker" target="_blank" rel="noopener noreferrer"
          >Vant 공식 문서</a
        >를 확인하세요.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  import type { PickerConfirmEventParams, PickerChangeEventParams } from 'vant';
  import { PinDatePicker } from '@nd/components/popup';

  definePageMeta({ layout: 'guide' });

  function toDateParts(d = new Date()): string[] {
    return [String(d.getFullYear()), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')];
  }

  // ① 기본 사용 (생년월일)
  const basicOpen = ref(false);
  const basicValue = ref<string[]>(toDateParts());
  const basicResult = ref<string[]>([]);
  const basicOkLabel = ref('확인');

  function handleBasicChange({ selectedValues }: PickerChangeEventParams) {
    const [y, m, d] = selectedValues.map(String);
    if (y && m && d) {
      basicOkLabel.value = `${y}년 ${m}월 ${d}일 선택 완료`;
    } else if (y && m) {
      basicOkLabel.value = `${y}년 ${m}월 선택 완료`;
    }
  }

  function handleBasicConfirm({
    selectedValues,
  }: Pick<PickerConfirmEventParams, 'selectedValues' | 'selectedOptions' | 'selectedIndexes'>) {
    basicResult.value = selectedValues.map(String);
    basicOpen.value = false;
  }

  // ② 연·월만 선택
  const ymOpen = ref(false);
  const ymValue = ref<string[]>(toDateParts().slice(0, 2));
  const ymResult = ref<string[]>([]);
  const ymMinDate = new Date(2020, 0, 1);
  const ymMaxDate = new Date(2030, 11, 31);

  function handleYmConfirm({
    selectedValues,
  }: Pick<PickerConfirmEventParams, 'selectedValues' | 'selectedOptions' | 'selectedIndexes'>) {
    ymResult.value = selectedValues.map(String);
    ymOpen.value = false;
  }

  // ③ 취소 버튼 숨김
  const noCancelOpen = ref(false);
  const noCancelValue = ref<string[]>(toDateParts());
  const noCancelResult = ref<string[]>([]);

  function handleNoCancelConfirm({
    selectedValues,
  }: Pick<PickerConfirmEventParams, 'selectedValues' | 'selectedOptions' | 'selectedIndexes'>) {
    noCancelResult.value = selectedValues.map(String);
    noCancelOpen.value = false;
  }

  // ④ selected 상태 (선택 강조 확인)
  const selectedOpen = ref(false);
  const selectedValue = ref<string[]>(toDateParts());
  const selectedResult = ref<string[]>([]);

  function handleSelectedConfirm({
    selectedValues,
  }: Pick<PickerConfirmEventParams, 'selectedValues' | 'selectedOptions' | 'selectedIndexes'>) {
    selectedResult.value = selectedValues.map(String);
    selectedOpen.value = false;
  }

  // ④ 로딩 상태
  const loadingOpen = ref(false);
  const loadingValue = ref<string[]>(toDateParts());

  // ④ 읽기 전용 상태
  const readonlyOpen = ref(false);
  const readonlyValue = ref<string[]>(['2024', '06', '15']);
</script>

<style lang="scss" scoped src="./pinDatePicker.scss"></style>
