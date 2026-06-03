<template>
  <div class="termsAgreementGuidePage">
    <!-- 헤더 -->
    <header class="termsAgreementGuidePage__header">
      <div class="termsAgreementGuidePage__meta">
        <span class="termsAgreementGuidePage__badge">molecules</span>
      </div>
      <h1 class="termsAgreementGuidePage__title">TermsAgreement</h1>
      <p class="termsAgreementGuidePage__desc">
        약관 동의 UI 컴포넌트. "전체 동의" 체크박스와 개별 약관 항목 목록을 하나의 단위로 제공한다.<br />
        각 항목은 <code>type</code> 필드로 <code>checkbox</code> / <code>popup</code> / <code>accordion</code> 세 가지
        렌더 방식을 지원한다.
      </p>
    </header>

    <!-- ① 기본 사용 — 3가지 type 항목 모두 포함 -->
    <section class="termsAgreementGuidePage__section">
      <h2 class="termsAgreementGuidePage__sectionTitle">① 기본 사용</h2>
      <p class="termsAgreementGuidePage__note">
        checkbox / popup / accordion 3가지 type 항목을 모두 포함한 예시. popup 타입 클릭 시
        <code>@popup-click</code> 이벤트가 발생한다.
      </p>

      <div class="termsAgreementGuidePage__demo">
        <TermsAgreement
          all-check-text="주문 내용을 확인했으며 모두 동의합니다."
          :items="allTypeItems"
          v-model:all-checked="basicAllChecked"
          @popup-click="onPopupClick"
          @accordion-open="onAccordionOpen"
        />
      </div>

      <pre class="termsAgreementGuidePage__code"><code>&lt;TermsAgreement
  :items="items"
  all-check-text="주문 내용을 확인했으며 모두 동의합니다."
  v-model:all-checked="isAllAgreed"
  @popup-click="onPopupClick"
/&gt;

// items 예시
const items = [
  { value: 'privacy', label: '개인정보 처리방침 동의', required: true, type: 'checkbox' },
  { value: 'terms', label: '이용약관 동의', required: true, type: 'popup' },
  {
    value: 'marketing',
    label: '마케팅 수신 동의',
    required: false,
    type: 'accordion',
    content: '마케팅 정보 수신에 동의합니다...',
  },
]</code></pre>
    </section>

    <!-- ② 전체 동의 연동 — allChecked v-model 데모 -->
    <section class="termsAgreementGuidePage__section">
      <h2 class="termsAgreementGuidePage__sectionTitle">② 전체 동의 연동</h2>
      <p class="termsAgreementGuidePage__note">
        <code>v-model:allChecked</code>로 외부에서 전체 동의 상태를 읽거나 제어할 수 있다.<br />
        개별 항목이 모두 체크되면 자동으로 <code>allChecked</code>가 <code>true</code>로 갱신된다.
      </p>

      <div class="termsAgreementGuidePage__statusBox">
        <span class="termsAgreementGuidePage__statusLabel">allChecked 상태:</span>
        <span
          class="termsAgreementGuidePage__statusValue"
          :class="{ 'termsAgreementGuidePage__statusValue--active': syncAllChecked }"
        >
          {{ syncAllChecked ? 'true (전체 동의)' : 'false (미동의)' }}
        </span>
      </div>

      <div class="termsAgreementGuidePage__controlBox">
        <button type="button" class="termsAgreementGuidePage__controlBtn" @click="syncAllChecked = true">
          전체 동의 설정
        </button>
        <button
          type="button"
          class="termsAgreementGuidePage__controlBtn termsAgreementGuidePage__controlBtn--line"
          @click="syncAllChecked = false"
        >
          전체 해제
        </button>
      </div>

      <div class="termsAgreementGuidePage__demo">
        <TermsAgreement :items="syncItems" v-model:all-checked="syncAllChecked" @update:checked="onCheckedChange" />
      </div>

      <pre class="termsAgreementGuidePage__code"><code>&lt;TermsAgreement
  :items="items"
  v-model:all-checked="isAllAgreed"
  @update:checked="onCheckedChange"
/&gt;

// update:checked 페이로드
// { value: string, checked: boolean }
function onCheckedChange(payload) {
  console.log(payload.value, payload.checked)
}</code></pre>
    </section>

    <!-- ③ type별 데모 -->
    <section class="termsAgreementGuidePage__section">
      <h2 class="termsAgreementGuidePage__sectionTitle">③ type별 데모</h2>

      <div class="termsAgreementGuidePage__group">
        <p class="termsAgreementGuidePage__groupTitle">type="checkbox" — 체크박스 단독</p>
        <p class="termsAgreementGuidePage__note">
          <code>accordion</code> 타입 항목이 없으므로 <code>hasAccordionItems</code>가 <code>false</code>.
          내부적으로 Radix Vue <code>Accordion</code> 컴포넌트가 마운트되지 않고 순수 <code>&lt;div&gt;</code> 컨테이너로 렌더된다.
        </p>
        <div class="termsAgreementGuidePage__demo">
          <TermsAgreement :items="checkboxOnlyItems" />
        </div>
        <pre
          class="termsAgreementGuidePage__code"
        ><code>{ value: 'agree1', label: '서비스 이용약관 동의', required: true, type: 'checkbox' }
{ value: 'agree2', label: '광고성 정보 수신 동의', required: false, type: 'checkbox' }

// accordion 타입 항목이 없음 → hasAccordionItems: false
// → &lt;component :is&gt; 동적 컴포넌트 패턴으로 Accordion 대신 div 렌더
// → 불필요한 Radix Vue Accordion 컨텍스트·접근성 트리 노이즈 없음</code></pre>
      </div>

      <div class="termsAgreementGuidePage__group">
        <p class="termsAgreementGuidePage__groupTitle">type="popup" — 체크박스 + 팝업 버튼</p>
        <p class="termsAgreementGuidePage__note">
          <code>accordion</code> 타입 항목이 없으므로 <code>hasAccordionItems</code>가 <code>false</code>.
          <code>Accordion</code> 미마운트. 팝업 버튼 클릭 시 <code>popup-click</code> 이벤트가 발생한다.
        </p>
        <div class="termsAgreementGuidePage__demo">
          <TermsAgreement :items="popupOnlyItems" @popup-click="onPopupClick" />
        </div>
        <pre
          class="termsAgreementGuidePage__code"
        ><code>{ value: 'privacy', label: '개인정보 처리방침 동의', required: true, type: 'popup' }

// accordion 타입 항목이 없음 → hasAccordionItems: false
// → &lt;component :is&gt; 동적 컴포넌트 패턴으로 Accordion 대신 div 렌더
// 팝업 버튼 클릭 시 popup-click 이벤트 발생 — 실제 팝업 열기는 사용처에서 처리
@popup-click="(value) =&gt; openPopup(value)"</code></pre>
      </div>

      <div class="termsAgreementGuidePage__group">
        <p class="termsAgreementGuidePage__groupTitle">type="accordion" — 체크박스 + 인라인 콘텐츠 + accordion-open 이벤트</p>
        <p class="termsAgreementGuidePage__note">
          <code>accordion</code> 타입 항목이 하나라도 있으면 <code>hasAccordionItems</code>가 <code>true</code>.
          단일 Radix Vue <code>Accordion type="multiple"</code> 컴포넌트가 항목 목록 전체 컨테이너로 마운트된다.
          <code>accordion</code> 타입 항목은 <code>AccordionItem</code>으로, 나머지(<code>checkbox</code> / <code>popup</code>)는 일반
          <code>&lt;div&gt;</code>로 분기 렌더된다.
        </p>

        <div class="termsAgreementGuidePage__statusBox">
          <span class="termsAgreementGuidePage__statusLabel">마지막 accordion-open:</span>
          <span
            class="termsAgreementGuidePage__statusValue"
            :class="{ 'termsAgreementGuidePage__statusValue--active': lastOpenedAccordion !== null }"
          >
            {{ lastOpenedAccordion !== null ? `"${lastOpenedAccordion}"` : '(없음)' }}
          </span>
        </div>

        <div class="termsAgreementGuidePage__demo">
          <TermsAgreement :items="accordionOnlyItems" @accordion-open="onAccordionOpen" />
        </div>
        <pre class="termsAgreementGuidePage__code"><code>// accordion 타입 항목이 있음 → hasAccordionItems: true
// → &lt;component :is&gt; 동적 컴포넌트 패턴으로 div 대신 Accordion 렌더 (내부 항목 마크업은 단일 출처)
// → accordion 타입 → AccordionItem, checkbox/popup 타입 → 일반 &lt;div&gt;로 분기 렌더
// → type="multiple"이므로 여러 항목을 동시에 열 수 있음
{
  value: 'marketing',
  label: '마케팅 수신 동의',
  required: false,
  type: 'accordion',
  content: '광고성 정보를 수신하는 것에 동의합니다...',
}

// accordion 항목이 펼쳐질 때(열릴 때만) accordion-open 이벤트 발생
// 이전 열림 배열 대비 새로 추가된 value에 대해서만 emit — 닫힐 때는 발생하지 않음
@accordion-open="(value) =&gt; console.log('열린 항목:', value)"</code></pre>
      </div>

      <!-- accordion 타입 없는 경우 — checkbox + popup만으로 구성해 Accordion 미마운트 동작 시각화 -->
      <div class="termsAgreementGuidePage__group">
        <p class="termsAgreementGuidePage__groupTitle">혼합 (checkbox + popup, accordion 없음) — Accordion 미마운트</p>
        <p class="termsAgreementGuidePage__note">
          <code>checkbox</code>와 <code>popup</code> 타입만 섞인 경우. <code>accordion</code> 타입 항목이 없어
          <code>hasAccordionItems</code>가 <code>false</code>이므로 Radix Vue <code>Accordion</code>은 마운트되지 않는다.
          접근성 트리에 불필요한 <code>role="region"</code> 노이즈가 생기지 않는다.
        </p>
        <div class="termsAgreementGuidePage__demo">
          <TermsAgreement :items="noAccordionItems" @popup-click="onPopupClick" />
        </div>
        <pre class="termsAgreementGuidePage__code"><code>// checkbox + popup 혼합 — accordion 타입 없음
const items = [
  { value: 'service', label: '서비스 이용약관 동의', required: true, type: 'checkbox' },
  { value: 'privacy', label: '개인정보 처리방침 동의', required: true, type: 'popup' },
  { value: 'marketing', label: '마케팅 수신 동의', required: false, type: 'checkbox' },
]

// hasAccordionItems: false → &lt;component :is&gt; 동적 컴포넌트 패턴으로 Accordion 대신 div 렌더</code></pre>
      </div>
    </section>

    <!-- ④ Props / Types / Events -->
    <section class="termsAgreementGuidePage__section">
      <h2 class="termsAgreementGuidePage__sectionTitle">④ Props / Types / Events</h2>

      <h3 class="termsAgreementGuidePage__tableTitle">TermsItem 타입</h3>
      <div class="termsAgreementGuidePage__propsTableWrap">
        <table class="termsAgreementGuidePage__propsTable">
          <thead>
            <tr>
              <th>필드명</th>
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
              <td>항목 고유 식별값. <code>v-for</code> key 및 체크 상태 맵의 key로 사용</td>
            </tr>
            <tr>
              <td><code>label</code></td>
              <td><code>string</code></td>
              <td>필수</td>
              <td>항목에 표시할 레이블 텍스트</td>
            </tr>
            <tr>
              <td><code>required</code></td>
              <td><code>boolean</code></td>
              <td>필수</td>
              <td>
                필수 동의 여부. <code>true</code>이면 레이블 앞에 필수 표시 추가.<br />
                포맷은 타입별로 다름 — <code>checkbox</code> / <code>popup</code>: <code>[필수]</code>,
                <code>accordion</code>: <code>(필수)</code> (<code>&lt;em aria-hidden="true"&gt;</code> 태그로 삽입)
              </td>
            </tr>
            <tr>
              <td><code>type</code></td>
              <td><code>'checkbox' | 'popup' | 'accordion'</code></td>
              <td>필수</td>
              <td>항목 렌더 방식 결정</td>
            </tr>
            <tr>
              <td><code>content</code></td>
              <td><code>string</code></td>
              <td>조건부</td>
              <td><code>type='accordion'</code>일 때만 사용하는 인라인 텍스트</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="termsAgreementGuidePage__tableTitle">Props</h3>
      <div class="termsAgreementGuidePage__propsTableWrap">
        <table class="termsAgreementGuidePage__propsTable">
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
              <td><code>items</code></td>
              <td><code>TermsItem[]</code></td>
              <td><code>[]</code></td>
              <td>약관 항목 배열. 각 항목은 TermsItem 타입을 따름</td>
            </tr>
            <tr>
              <td><code>allChecked</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>전체 동의 체크 상태. <code>v-model:allChecked</code>로 양방향 바인딩 가능</td>
            </tr>
            <tr>
              <td><code>allCheckText</code></td>
              <td><code>string</code></td>
              <td><code>'전체 동의'</code></td>
              <td>전체 동의 체크박스에 표시할 레이블 텍스트. 생략 시 "전체 동의" 사용</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="termsAgreementGuidePage__tableTitle">Events</h3>
      <div class="termsAgreementGuidePage__propsTableWrap">
        <table class="termsAgreementGuidePage__propsTable">
          <thead>
            <tr>
              <th>이름</th>
              <th>페이로드</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>update:allChecked</code></td>
              <td><code>boolean</code></td>
              <td>전체 동의 상태가 변경될 때. <code>v-model:allChecked</code>의 내부 이벤트</td>
            </tr>
            <tr>
              <td><code>update:checked</code></td>
              <td><code>{ value: string, checked: boolean }</code></td>
              <td>개별 항목의 체크 상태가 변경될 때. 전체 동의 일괄 변경 시에도 항목마다 발생</td>
            </tr>
            <tr>
              <td><code>popup-click</code></td>
              <td><code>string</code> (value)</td>
              <td><code>type="popup"</code> 항목의 팝업 버튼 클릭 시. 실제 팝업 열기는 사용처에서 처리</td>
            </tr>
            <tr>
              <td><code>accordion-open</code></td>
              <td><code>string</code> (value)</td>
              <td>
                <code>type="accordion"</code> 항목이 펼쳐질 때(열릴 때만). 닫힐 때는 발생하지 않음.<br />
                이전 상태 대비 새로 추가된 value에 대해서만 emit
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="termsAgreementGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는 <code>v-bind="$attrs"</code>를 사용하므로 위 Props 외에도
        루트 <code>&lt;div&gt;</code> 요소의 모든 네이티브 HTML 속성 (<code>aria-label</code>, <code>id</code>,
        <code>data-*</code> 등)을 그대로 전달할 수 있습니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { TermsAgreement } from '@nd/components/molecules';
  import type { TermsItem } from '@nd/components/molecules';

  definePageMeta({ layout: 'guide' });

  // ① 기본 사용 — 3가지 type 항목 모두 포함
  const basicAllChecked = ref(false);

  const allTypeItems: TermsItem[] = [
    {
      value: 'service',
      label: '서비스 이용약관 동의',
      required: true,
      type: 'checkbox',
    },
    {
      value: 'privacy',
      label: '개인정보 처리방침 동의',
      required: true,
      type: 'popup',
    },
    {
      value: 'marketing',
      label: '마케팅 수신 동의 (이메일/SMS)',
      required: false,
      type: 'accordion',
      content:
        '광고성 정보를 수신하는 것에 동의합니다.\n수신 동의 이후에도 언제든지 수신 거부가 가능하며, 수신 거부 시 관련 이벤트 및 할인 혜택 정보를 받으실 수 없습니다.',
    },
  ];

  function onPopupClick(value: string): void {
    // [연동] 개발자가 이 이벤트를 수신해 실제 팝업 열기 처리
    // 가이드 페이지에서는 console.log로 대체
    console.log('[popup-click] value:', value);
    alert(`팝업 열기 요청: ${value}`);
  }

  // ③ accordion-open 이벤트 데모
  const lastOpenedAccordion = ref<string | null>(null);

  function onAccordionOpen(value: string): void {
    // [연동] accordion 항목이 열릴 때 발생 — 분석·로깅 등에 활용
    console.log('[accordion-open] value:', value);
    lastOpenedAccordion.value = value;
  }

  // ② 전체 동의 연동 데모
  const syncAllChecked = ref(false);

  const syncItems: TermsItem[] = [
    {
      value: 'terms1',
      label: '서비스 이용약관 동의',
      required: true,
      type: 'checkbox',
    },
    {
      value: 'terms2',
      label: '개인정보 처리방침 동의',
      required: true,
      type: 'checkbox',
    },
    {
      value: 'terms3',
      label: '마케팅 수신 동의',
      required: false,
      type: 'checkbox',
    },
  ];

  function onCheckedChange(payload: { value: string; checked: boolean }): void {
    // [연동] 개발자가 이 이벤트를 수신해 개별 체크 상태 처리
    console.log('[update:checked]', payload);
  }

  // ③ type별 데모 — checkbox 단독
  const checkboxOnlyItems: TermsItem[] = [
    {
      value: 'agree1',
      label: '서비스 이용약관 동의',
      required: true,
      type: 'checkbox',
    },
    {
      value: 'agree2',
      label: '광고성 정보 수신 동의',
      required: false,
      type: 'checkbox',
    },
  ];

  // ③ type별 데모 — popup 단독
  const popupOnlyItems: TermsItem[] = [
    {
      value: 'popup1',
      label: '개인정보 처리방침 동의',
      required: true,
      type: 'popup',
    },
    {
      value: 'popup2',
      label: '제3자 정보 제공 동의',
      required: false,
      type: 'popup',
    },
  ];

  // ③ type별 데모 — accordion 없는 혼합 (checkbox + popup) → Accordion 미마운트 동작 시각화
  const noAccordionItems: TermsItem[] = [
    {
      value: 'noAcc-service',
      label: '서비스 이용약관 동의',
      required: true,
      type: 'checkbox',
    },
    {
      value: 'noAcc-privacy',
      label: '개인정보 처리방침 동의',
      required: true,
      type: 'popup',
    },
    {
      value: 'noAcc-marketing',
      label: '마케팅 수신 동의',
      required: false,
      type: 'checkbox',
    },
  ];

  // ③ type별 데모 — accordion 단독
  const accordionOnlyItems: TermsItem[] = [
    {
      value: 'acc1',
      label: '마케팅 수신 동의',
      required: false,
      type: 'accordion',
      content:
        '광고성 정보를 수신하는 것에 동의합니다.\n수신 동의 이후에도 언제든지 수신 거부가 가능하며, 수신 거부 시 관련 이벤트 및 할인 혜택 정보를 받으실 수 없습니다.',
    },
    {
      value: 'acc2',
      label: '위치정보 수집 동의',
      required: false,
      type: 'accordion',
      content: '위치정보를 수집·이용하는 것에 동의합니다.\n수집된 위치정보는 맞춤형 서비스 제공 목적으로만 사용됩니다.',
    },
  ];
</script>

<style lang="scss" scoped src="./termsAgreement.scss"></style>
