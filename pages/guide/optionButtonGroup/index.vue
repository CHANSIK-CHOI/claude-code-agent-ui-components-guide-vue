<template>
  <div class="optionButtonGroupGuidePage">
    <!-- 헤더 -->
    <header class="optionButtonGroupGuidePage__header">
      <div class="optionButtonGroupGuidePage__meta">
        <span class="optionButtonGroupGuidePage__badge">molecules</span>
      </div>
      <h1 class="optionButtonGroupGuidePage__title">OptionButtonGroup</h1>
      <p class="optionButtonGroupGuidePage__desc">
        radio/checkbox 선택 타입과 그리드 레이아웃을 지원하는 버튼 선택 그룹 컴포넌트.<br />
        결제 수단 선택, 취소 사유 복수 선택 등 이미지·텍스트 혼합 콘텐츠가 들어가는 폼 선택 UI에 사용.
      </p>
    </header>

    <!-- ① radio type 기본 (2열, 텍스트만) -->
    <section class="optionButtonGroupGuidePage__section">
      <h2 class="optionButtonGroupGuidePage__sectionTitle">① radio type 기본 (2열, 텍스트만)</h2>
      <p class="optionButtonGroupGuidePage__note">기본 columns=2, type="radio". 단일 선택만 가능합니다.</p>
      <div class="optionButtonGroupGuidePage__demo">
        <OptionButtonGroup
          v-model="radioPayMethod"
          type="radio"
          :items="payMethodItems"
          :columns="2"
        />
        <p class="optionButtonGroupGuidePage__stateLabel">선택값: <code>{{ radioPayMethod || '없음' }}</code></p>
      </div>
      <pre class="optionButtonGroupGuidePage__code"><code>&lt;OptionButtonGroup
  v-model="payMethod"
  type="radio"
  :items="payMethodItems"
  :columns="2"
/&gt;

// items: [
//   { value: 'credit', label: '신용카드' },
//   { value: 'kakao', label: '카카오페이' },
//   ...
// ]</code></pre>
    </section>

    <!-- ② checkbox type (3열) -->
    <section class="optionButtonGroupGuidePage__section">
      <h2 class="optionButtonGroupGuidePage__sectionTitle">② checkbox type (3열)</h2>
      <p class="optionButtonGroupGuidePage__note">type="checkbox", columns=3. 복수 선택이 가능합니다.</p>
      <div class="optionButtonGroupGuidePage__demo">
        <OptionButtonGroup
          v-model="checkboxReasons"
          type="checkbox"
          :items="cancelReasonItems"
          :columns="3"
        />
        <p class="optionButtonGroupGuidePage__stateLabel">선택값: <code>{{ checkboxReasons.length ? checkboxReasons.join(', ') : '없음' }}</code></p>
      </div>
      <pre class="optionButtonGroupGuidePage__code"><code>&lt;OptionButtonGroup
  v-model="reasons"
  type="checkbox"
  :items="cancelReasonItems"
  :columns="3"
/&gt;

// items: [
//   { value: 'change_mind', label: '단순 변심' },
//   { value: 'delay', label: '배송 지연' },
//   ...
// ]</code></pre>
    </section>

    <!-- ③ 1열 레이아웃 -->
    <section class="optionButtonGroupGuidePage__section">
      <h2 class="optionButtonGroupGuidePage__sectionTitle">③ 1열 레이아웃</h2>
      <p class="optionButtonGroupGuidePage__note">columns=1. 텍스트가 길거나 단열 표시가 필요할 때 사용합니다.</p>
      <div class="optionButtonGroupGuidePage__demo">
        <OptionButtonGroup
          v-model="radioPayMethod1col"
          type="radio"
          :items="payMethodItems"
          :columns="1"
        />
        <p class="optionButtonGroupGuidePage__stateLabel">선택값: <code>{{ radioPayMethod1col || '없음' }}</code></p>
      </div>
      <pre class="optionButtonGroupGuidePage__code"><code>&lt;OptionButtonGroup
  v-model="payMethod"
  type="radio"
  :items="payMethodItems"
  :columns="1"
/&gt;</code></pre>
    </section>

    <!-- ④ badge 표시 -->
    <section class="optionButtonGroupGuidePage__section">
      <h2 class="optionButtonGroupGuidePage__sectionTitle">④ badge 표시</h2>
      <p class="optionButtonGroupGuidePage__note"><code>item.badge</code> 값이 있으면 버튼 우측 상단에 배지가 자동 표시됩니다. <code>aria-hidden="true"</code>로 보조기기에서 숨김 처리됩니다.</p>
      <div class="optionButtonGroupGuidePage__demo">
        <OptionButtonGroup
          v-model="radioBadge"
          type="radio"
          :items="payMethodItemsWithBadge"
          :columns="2"
        />
        <p class="optionButtonGroupGuidePage__stateLabel">선택값: <code>{{ radioBadge || '없음' }}</code></p>
      </div>
      <pre class="optionButtonGroupGuidePage__code"><code>&lt;OptionButtonGroup
  v-model="payMethod"
  type="radio"
  :items="payMethodItemsWithBadge"
  :columns="2"
/&gt;

// items: [
//   { value: 'credit', label: '신용카드', badge: '최근 결제' },
//   { value: 'kakao', label: '카카오페이' },
//   ...
// ]</code></pre>
    </section>

    <!-- ⑤ content slot 사용 -->
    <section class="optionButtonGroupGuidePage__section">
      <h2 class="optionButtonGroupGuidePage__sectionTitle">⑤ content slot 사용</h2>
      <p class="optionButtonGroupGuidePage__note"><code>#content</code> scoped slot으로 이모지 + 텍스트 조합 등 커스텀 콘텐츠를 구성합니다. <code>{ item, isSelected }</code>가 전달됩니다.</p>
      <div class="optionButtonGroupGuidePage__demo">
        <OptionButtonGroup
          v-model="radioContentSlot"
          type="radio"
          :items="emojiItems"
          :columns="2"
        >
          <template #content="{ item, isSelected }">
            <span class="optionButtonGroupGuidePage__slotContent">
              <span class="optionButtonGroupGuidePage__slotEmoji">{{ item.emoji }}</span>
              <span class="optionButtonGroupGuidePage__slotText" :class="{ 'optionButtonGroupGuidePage__slotText--selected': isSelected }">{{ item.label }}</span>
            </span>
          </template>
        </OptionButtonGroup>
        <p class="optionButtonGroupGuidePage__stateLabel">선택값: <code>{{ radioContentSlot || '없음' }}</code></p>
      </div>
      <pre class="optionButtonGroupGuidePage__code"><code>&lt;OptionButtonGroup v-model="selected" type="radio" :items="emojiItems"&gt;
  &lt;template #content="{ item, isSelected }"&gt;
    &lt;span&gt;
      &lt;span&gt;&#123;&#123; item.emoji &#125;&#125;&lt;/span&gt;
      &lt;span&gt;&#123;&#123; item.label &#125;&#125;&lt;/span&gt;
    &lt;/span&gt;
  &lt;/template&gt;
&lt;/OptionButtonGroup&gt;</code></pre>
    </section>

    <!-- ⑥ selected-content slot 사용 -->
    <section class="optionButtonGroupGuidePage__section">
      <h2 class="optionButtonGroupGuidePage__sectionTitle">⑥ selected-content slot 사용</h2>
      <p class="optionButtonGroupGuidePage__note"><code>#selected-content</code> slot이 전달되면 선택 시 기본 콘텐츠 대신 교체하여 표시합니다. <code>{ item }</code>이 전달됩니다.</p>
      <div class="optionButtonGroupGuidePage__demo">
        <OptionButtonGroup
          v-model="radioSelectedContent"
          type="radio"
          :items="payMethodItems"
          :columns="2"
        >
          <template #selected-content="{ item }">
            <span class="optionButtonGroupGuidePage__selectedContent">
              <span>✓</span>
              <span>{{ item.label }} 선택됨</span>
            </span>
          </template>
        </OptionButtonGroup>
        <p class="optionButtonGroupGuidePage__stateLabel">선택값: <code>{{ radioSelectedContent || '없음' }}</code></p>
      </div>
      <pre class="optionButtonGroupGuidePage__code"><code>&lt;OptionButtonGroup v-model="selected" type="radio" :items="items"&gt;
  &lt;template #selected-content="{ item }"&gt;
    &lt;span&gt;✓ &#123;&#123; item.label &#125;&#125; 선택됨&lt;/span&gt;
  &lt;/template&gt;
&lt;/OptionButtonGroup&gt;</code></pre>
    </section>

    <!-- ⑦ rowColumns 비대칭 레이아웃 -->
    <section class="optionButtonGroupGuidePage__section">
      <h2 class="optionButtonGroupGuidePage__sectionTitle">⑦ rowColumns 비대칭 레이아웃</h2>
      <p class="optionButtonGroupGuidePage__note"><code>rowColumns</code> prop으로 행마다 열 수를 다르게 지정합니다. 지정 시 <code>columns</code>는 무시됩니다. 누적합보다 아이템이 많으면 나머지는 1열로 자동 추가됩니다.</p>
      <div class="optionButtonGroupGuidePage__demo">
        <OptionButtonGroup
          v-model="radioRowColumns"
          type="radio"
          :items="rowColumnsItems"
          :row-columns="[3, 2, 1]"
        />
        <p class="optionButtonGroupGuidePage__stateLabel">선택값: <code>{{ radioRowColumns || '없음' }}</code></p>
      </div>
      <pre class="optionButtonGroupGuidePage__code"><code>&lt;!-- 6개 아이템: 1행 3열 / 2행 2열 / 3행 1열 --&gt;
&lt;OptionButtonGroup
  v-model="selected"
  type="radio"
  :items="items"
  :row-columns="[3, 2, 1]"
/&gt;</code></pre>

      <h3 class="optionButtonGroupGuidePage__tableTitle">rowColumns + maxRows 조합</h3>
      <p class="optionButtonGroupGuidePage__note"><code>maxRows</code> prop을 함께 지정하면 지정한 행 수까지만 노출합니다. 예: <code>rowColumns=[3, 2]</code> + <code>maxRows=1</code> → 1행(3개)만 표시. "더보기" 패턴 구현에 활용합니다.</p>
      <div class="optionButtonGroupGuidePage__demo">
        <OptionButtonGroup
          v-model="radioRowColumnsMaxRows"
          type="radio"
          :items="rowColumnsItems"
          :row-columns="[3, 2]"
          :max-rows="maxRowsValue"
        />
        <div class="optionButtonGroupGuidePage__controls">
          <button
            type="button"
            class="optionButtonGroupGuidePage__controlBtn"
            @click="maxRowsValue = maxRowsValue === 1 ? 2 : 1"
          >
            {{ maxRowsValue === 1 ? '2행 펼치기' : '1행으로 접기' }}
          </button>
        </div>
        <p class="optionButtonGroupGuidePage__stateLabel">선택값: <code>{{ radioRowColumnsMaxRows || '없음' }}</code> / 현재 maxRows: <code>{{ maxRowsValue }}</code></p>
      </div>
      <pre class="optionButtonGroupGuidePage__code"><code>&lt;!-- rowColumns=[3,2], maxRows=1 → 첫 번째 행(3개)만 노출 --&gt;
&lt;OptionButtonGroup
  v-model="selected"
  type="radio"
  :items="items"
  :row-columns="[3, 2]"
  :max-rows="1"
/&gt;

&lt;!-- maxRows를 ref로 바인딩하면 런타임에 행 수를 변경할 수 있습니다 --&gt;
&lt;OptionButtonGroup
  v-model="selected"
  type="radio"
  :items="items"
  :row-columns="[3, 2]"
  :max-rows="maxRows"
/&gt;</code></pre>
    </section>

    <!-- ⑧ selectedColor 커스터마이징 -->
    <section class="optionButtonGroupGuidePage__section">
      <h2 class="optionButtonGroupGuidePage__sectionTitle">⑧ selectedColor 커스터마이징</h2>
      <p class="optionButtonGroupGuidePage__note"><code>selectedColor</code> prop으로 선택 시 배경·테두리 색상을 커스터마이징합니다. CSS custom property(<code>--option-selected-color</code>)로 주입됩니다.</p>
      <div class="optionButtonGroupGuidePage__demo">
        <OptionButtonGroup
          v-model="radioCustomColor"
          type="radio"
          :items="payMethodItems"
          :columns="2"
          selected-color="#00A1CE"
        />
        <p class="optionButtonGroupGuidePage__stateLabel">선택값: <code>{{ radioCustomColor || '없음' }}</code></p>
      </div>
      <pre class="optionButtonGroupGuidePage__code"><code>&lt;OptionButtonGroup
  v-model="payMethod"
  type="radio"
  :items="payMethodItems"
  :columns="2"
  selected-color="#00A1CE"
/&gt;</code></pre>
    </section>

    <!-- ⑨ 아이콘 + 아이템별 선택 색상 (결제 수단 패턴) -->
    <section class="optionButtonGroupGuidePage__section">
      <h2 class="optionButtonGroupGuidePage__sectionTitle">⑨ 아이콘 + 아이템별 선택 색상</h2>
      <p class="optionButtonGroupGuidePage__note">
        <code>item.icon</code>에 이미지 src를 지정하면 버튼 내에 로고 이미지를 표시합니다.
        <code>item.showLabel</code>로 아이콘과 텍스트를 함께 표시할 수 있습니다.
        <code>item.activeColor</code>로 아이템마다 다른 선택 색상을 적용하며,
        <code>item.invertIconOnSelect</code>로 선택 시 아이콘을 반전합니다.
        결제 수단 선택 UI에 적합한 패턴입니다.
      </p>
      <div class="optionButtonGroupGuidePage__demo">
        <OptionButtonGroup
          v-model="radioPaymentMethod"
          type="radio"
          :items="paymentMethodItems"
          :columns="2"
          aria-label="결제 수단"
        />
        <p class="optionButtonGroupGuidePage__stateLabel">선택값: <code>{{ radioPaymentMethod || '없음' }}</code></p>
      </div>
      <pre class="optionButtonGroupGuidePage__code"><code>&lt;OptionButtonGroup
  v-model="paymentMethod"
  type="radio"
  :items="paymentMethodItems"
  :columns="2"
  aria-label="결제 수단"
/&gt;

// items: [
//   {
//     value: 'kakao',
//     label: '카카오페이',
//     icon: PayKakaoSrc,       // import한 이미지 src
//     badge: '최근결제',
//     activeColor: '#FFEB00',  // 아이템별 선택 색상
//   },
//   {
//     value: 'toss',
//     label: '토스페이',
//     icon: PayTossSrc,
//     activeColor: '#0064FF',
//     invertIconOnSelect: true, // 선택 시 icon 반전 (어두운 배경 대응)
//   },
//   { value: 'card', label: '신용카드', activeColor: '#00ADDB' },
//   { value: 'mobile', label: '휴대폰결제', activeColor: '#00ADDB' },
// ]</code></pre>
    </section>

    <!-- ⑩ subLabel 보조 텍스트 -->
    <section class="optionButtonGroupGuidePage__section">
      <h2 class="optionButtonGroupGuidePage__sectionTitle">⑩ subLabel 보조 텍스트</h2>
      <p class="optionButtonGroupGuidePage__note">
        <code>item.subLabel</code>을 지정하면 <code>item.label</code> 아래에 caption 크기 보조 텍스트가 표시됩니다.
        슬롯(<code>#content</code> · <code>#selected-content</code>) 미사용 시에만 렌더링됩니다.
        취소 사유처럼 선택지에 부연 설명이 필요할 때 유용합니다.
      </p>
      <div class="optionButtonGroupGuidePage__demo">
        <OptionButtonGroup
          v-model="radioSubLabel"
          type="radio"
          :items="subLabelItems"
          :columns="2"
        />
        <p class="optionButtonGroupGuidePage__stateLabel">선택값: <code>{{ radioSubLabel || '없음' }}</code></p>
      </div>
      <pre class="optionButtonGroupGuidePage__code"><code>&lt;OptionButtonGroup
  v-model="selected"
  type="radio"
  :items="subLabelItems"
  :columns="2"
/&gt;

// items: [
//   { value: 'product_change', label: '상품 변경', subLabel: '(자사몰 상품 기준)' },
//   { value: 'service_pause', label: '서비스 일시중지', subLabel: '최대 3개월' },
//   { value: 'cancel', label: '구독 취소', subLabel: '즉시 적용됩니다' },
//   { value: 'etc', label: '기타' },
// ]</code></pre>
    </section>

    <!-- ⑪ Props / Slots / Events -->
    <section class="optionButtonGroupGuidePage__section">
      <h2 class="optionButtonGroupGuidePage__sectionTitle">⑪ Props / Slots / Events</h2>

      <h3 class="optionButtonGroupGuidePage__tableTitle">Props</h3>
      <div class="optionButtonGroupGuidePage__propsTableWrap">
        <table class="optionButtonGroupGuidePage__propsTable">
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
              <td><code>type</code></td>
              <td><code>'radio' | 'checkbox'</code></td>
              <td><code>'radio'</code></td>
              <td>단일 선택(radio) 또는 복수 선택(checkbox)</td>
            </tr>
            <tr>
              <td><code>modelValue</code></td>
              <td><code>string | string[] | undefined</code></td>
              <td><code>undefined</code></td>
              <td>v-model 바인딩. radio는 string, checkbox는 string[]</td>
            </tr>
            <tr>
              <td><code>items</code></td>
              <td><code>OptionButtonItem[]</code></td>
              <td><code>[]</code></td>
              <td>버튼 목록 데이터 배열. 아래 OptionButtonItem 구조 참조</td>
            </tr>
            <tr>
              <td><code>columns</code></td>
              <td><code>1 | 2 | 3</code></td>
              <td><code>2</code></td>
              <td>그리드 열 수. <code>rowColumns</code> 미지정 시 균등 그리드로 동작</td>
            </tr>
            <tr>
              <td><code>rowColumns</code></td>
              <td><code>number[] | undefined</code></td>
              <td><code>undefined</code></td>
              <td>행마다 열 수를 다르게 지정. 예: <code>[3, 2, 1]</code> → 1행 3열, 2행 2열, 3행 1열. 지정 시 <code>columns</code> 무시. 빈 배열이면 <code>columns</code> 기본 동작으로 폴백</td>
            </tr>
            <tr>
              <td><code>maxRows</code></td>
              <td><code>number | undefined</code></td>
              <td><code>undefined</code></td>
              <td>최대 행 수. <code>rowColumns</code> 지정 시 <code>maxRows</code>번째 행 그룹까지만 노출. 미지정 시 전체 노출</td>
            </tr>
            <tr>
              <td><code>selectedColor</code></td>
              <td><code>string | undefined</code></td>
              <td><code>undefined</code></td>
              <td>선택 시 배경·테두리 색상 커스터마이징. 미지정 시 기본 <code>$text-900</code></td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>그룹 전체 선택 불가</td>
            </tr>
            <tr>
              <td><code>name</code></td>
              <td><code>string | undefined</code></td>
              <td><code>undefined</code></td>
              <td>폼 name 속성</td>
            </tr>
            <tr>
              <td><code>required</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>폼 필수 검증 여부</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="optionButtonGroupGuidePage__tableTitle">OptionButtonItem 구조</h3>
      <div class="optionButtonGroupGuidePage__propsTableWrap">
        <table class="optionButtonGroupGuidePage__propsTable">
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
              <td>선택 값 (고유 식별자)</td>
            </tr>
            <tr>
              <td><code>label</code></td>
              <td><code>string</code></td>
              <td>조건부</td>
              <td>버튼 텍스트. slot 미사용 시 필수. <code>#content</code> 슬롯 미사용 시 표시</td>
            </tr>
            <tr>
              <td><code>subLabel</code></td>
              <td><code>string</code></td>
              <td>선택</td>
              <td><code>label</code> 아래에 caption 크기(<code>$font-size-caption1</code>)로 표시되는 보조 텍스트. <code>#content</code> · <code>#selected-content</code> 슬롯 사용 시에는 렌더링되지 않음</td>
            </tr>
            <tr>
              <td><code>badge</code></td>
              <td><code>string</code></td>
              <td>선택</td>
              <td>버튼 우측 상단 배지 텍스트 (예: "최근 결제"). 값 유무로 자동 표시</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td>선택</td>
              <td>해당 아이템만 비활성. Radix Vue가 <code>data-disabled</code> 자동 부여</td>
            </tr>
            <tr>
              <td><code>icon</code></td>
              <td><code>string</code></td>
              <td>선택</td>
              <td>버튼 내 이미지 src. SVG import 또는 URL. 지정 시 <code>&lt;img&gt;</code> 렌더</td>
            </tr>
            <tr>
              <td><code>showLabel</code></td>
              <td><code>boolean</code></td>
              <td>선택</td>
              <td>icon과 함께 label 텍스트도 표시. icon 없으면 항상 표시. 기본 <code>false</code></td>
            </tr>
            <tr>
              <td><code>invertIconOnSelect</code></td>
              <td><code>boolean</code></td>
              <td>선택</td>
              <td>선택 시 icon에 <code>brightness(0) invert(1)</code> 필터 적용. 어두운 선택 배경 대응</td>
            </tr>
            <tr>
              <td><code>activeColor</code></td>
              <td><code>string</code></td>
              <td>선택</td>
              <td>아이템별 선택 배경·테두리 색상. 미지정 시 <code>selectedColor</code> prop 또는 <code>$text-900</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="optionButtonGroupGuidePage__tableTitle">Slots</h3>
      <div class="optionButtonGroupGuidePage__propsTableWrap">
        <table class="optionButtonGroupGuidePage__propsTable">
          <thead>
            <tr>
              <th>이름</th>
              <th>필수</th>
              <th>scoped data</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>content</code></td>
              <td>선택</td>
              <td><code>{ item: OptionButtonItem, isSelected: boolean }</code></td>
              <td>버튼 기본 콘텐츠. 미전달 시 <code>item.label</code> 텍스트 표시</td>
            </tr>
            <tr>
              <td><code>selected-content</code></td>
              <td>선택</td>
              <td><code>{ item: OptionButtonItem }</code></td>
              <td>선택 시 교체 콘텐츠. 미전달 시 <code>#content</code> 유지</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="optionButtonGroupGuidePage__tableTitle">Events</h3>
      <div class="optionButtonGroupGuidePage__propsTableWrap">
        <table class="optionButtonGroupGuidePage__propsTable">
          <thead>
            <tr>
              <th>이름</th>
              <th>페이로드</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>@update:modelValue</code></td>
              <td><code>string | string[]</code></td>
              <td>버튼 선택/해제 시. radio: string, checkbox: string[]</td>
            </tr>
            <tr>
              <td><code>@change</code></td>
              <td><code>string | string[]</code></td>
              <td>선택 값 변경 시 (API 연동용)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="optionButtonGroupGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는 <code>v-bind="$attrs"</code>를 사용하므로
        위 Props 외에도 루트 요소(<code>RadioGroupRoot</code> 또는 <code>&lt;div role="group"&gt;</code>)의
        네이티브 HTML 속성 (<code>aria-label</code>, <code>aria-labelledby</code>, <code>data-*</code> 등)을
        그대로 전달할 수 있습니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>

      <p class="optionButtonGroupGuidePage__radixNote">
        이 컴포넌트는 <strong>Radix Vue</strong>를 기반으로 합니다.
        <code>type="radio"</code>는 <code>RadioGroupRoot</code> + <code>RadioGroupItem</code>,
        <code>type="checkbox"</code>는 <code>CheckboxRoot</code>를 래핑합니다.
        위 Props 외에도 Radix Vue가 지원하는 추가 props를 사용할 수 있습니다.
        전체 API는
        <a href="https://www.radix-vue.com" target="_blank" rel="noopener noreferrer">radix-vue.com 공식 문서</a>
        또는 Context7 MCP(<code>mcp__context7__query-docs</code>)를 통해 확인하세요.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { OptionButtonGroup } from '@nd/components/molecules'
  import type { OptionButtonItem } from '@nd/components/molecules'
  import PayKakao from '@nd/assets/images/order/checkout/pay-kakao.svg'
  import PayNaver from '@nd/assets/images/order/checkout/pay-naver.svg'
  import PayToss from '@nd/assets/images/order/checkout/pay-toss.svg'
  import Pay010 from '@nd/assets/images/order/checkout/pay-010.svg'

  definePageMeta({ layout: 'guide' })

  // ── ① radio type 기본 ─────────────────────────────────────────────────
  const radioPayMethod = ref<string>('')

  const payMethodItems: OptionButtonItem[] = [
    { value: 'credit', label: '신용카드' },
    { value: 'kakao', label: '카카오페이' },
    { value: 'naver', label: '네이버페이' },
    { value: 'toss', label: '토스페이' },
  ]

  // ── ② checkbox type ────────────────────────────────────────────────────
  const checkboxReasons = ref<string[]>([])

  const cancelReasonItems: OptionButtonItem[] = [
    { value: 'change_mind', label: '단순 변심' },
    { value: 'delay', label: '배송 지연' },
    { value: 'damage', label: '파손/불량' },
    { value: 'wrong_order', label: '다른 상품 주문' },
    { value: 'price', label: '가격 문제' },
    { value: 'etc', label: '기타' },
  ]

  // ── ③ 1열 레이아웃 ─────────────────────────────────────────────────────
  const radioPayMethod1col = ref<string>('')

  // ── ④ badge 표시 ──────────────────────────────────────────────────────
  const radioBadge = ref<string>('')

  const payMethodItemsWithBadge: OptionButtonItem[] = [
    { value: 'credit', label: '신용카드', badge: '최근 결제' },
    { value: 'kakao', label: '카카오페이' },
    { value: 'naver', label: '네이버페이' },
    { value: 'toss', label: '토스페이' },
  ]

  // ── ⑤ content slot ────────────────────────────────────────────────────
  const radioContentSlot = ref<string>('')

  interface EmojiOptionItem extends OptionButtonItem {
    emoji: string
  }

  const emojiItems: EmojiOptionItem[] = [
    { value: 'credit', label: '신용카드', emoji: '💳' },
    { value: 'kakao', label: '카카오페이', emoji: '🟡' },
    { value: 'naver', label: '네이버페이', emoji: '🟢' },
    { value: 'toss', label: '토스페이', emoji: '🔵' },
  ]

  // ── ⑥ selected-content slot ───────────────────────────────────────────
  const radioSelectedContent = ref<string>('')

  // ── ⑦ rowColumns 비대칭 레이아웃 ─────────────────────────────────────
  const radioRowColumns = ref<string>('')
  const radioRowColumnsMaxRows = ref<string>('')
  const maxRowsValue = ref<number>(1)

  const rowColumnsItems: OptionButtonItem[] = [
    { value: 'opt1', label: '옵션 1' },
    { value: 'opt2', label: '옵션 2' },
    { value: 'opt3', label: '옵션 3' },
    { value: 'opt4', label: '옵션 4' },
    { value: 'opt5', label: '옵션 5' },
    { value: 'opt6', label: '옵션 6' },
  ]

  // ── ⑧ selectedColor ───────────────────────────────────────────────────
  const radioCustomColor = ref<string>('')

  // ── ⑩ subLabel 보조 텍스트 ──────────────────────────────────────────
  const radioSubLabel = ref<string>('')

  const subLabelItems: OptionButtonItem[] = [
    { value: 'product_change', label: '상품 변경', subLabel: '(자사몰 상품 기준)' },
    { value: 'service_pause', label: '서비스 일시중지', subLabel: '최대 3개월' },
    { value: 'cancel', label: '구독 취소', subLabel: '즉시 적용됩니다' },
    { value: 'etc', label: '기타' },
  ]

  // ── ⑨ 아이콘 + 아이템별 선택 색상 ──────────────────────────────────────
  const radioPaymentMethod = ref<string>('')

  const paymentMethodItems: OptionButtonItem[] = [
    { value: 'kakao', label: '카카오페이', icon: PayKakao, badge: '최근결제', activeColor: '#FFEB00' },
    { value: 'naver', label: '네이버페이', icon: PayNaver, activeColor: '#00DE5A' },
    { value: 'toss', label: '토스페이', icon: PayToss, activeColor: '#0064FF', invertIconOnSelect: true },
    { value: 'vbank', label: '가상계좌', icon: Pay010, showLabel: true, activeColor: '#00ADDB', invertIconOnSelect: true },
    { value: 'card', label: '신용카드', activeColor: '#00ADDB' },
    { value: 'mobile', label: '휴대폰결제', activeColor: '#00ADDB' },
  ]
</script>

<style lang="scss" scoped src="./option-button-group.scss"></style>
