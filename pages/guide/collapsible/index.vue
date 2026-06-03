<template>
  <div class="collapsibleGuidePage">
    <!-- 헤더 -->
    <header class="collapsibleGuidePage__header">
      <div class="collapsibleGuidePage__meta">
        <span class="collapsibleGuidePage__badge">molecules</span>
      </div>
      <h1 class="collapsibleGuidePage__title">Collapsible</h1>
      <p class="collapsibleGuidePage__desc">
        트리거 버튼을 누르면 연결된 박스 영역이 열리고 닫히는 토글 컨테이너 컴포넌트.<br />
        Radix Vue <code>CollapsibleRoot</code> 래핑. content height 슬라이드 애니메이션과 트리거 아이콘 회전
        애니메이션은 <strong>컴포넌트 내부 SCSS</strong>에서 처리합니다. 사용처는 레이아웃·색상·간격만 담당합니다.<br />
        <strong>Provider 패턴</strong>: <code>v-slot="{ Trigger, Content }"</code>으로 받은 컴포넌트를
        <code>&lt;component :is="Trigger" /&gt;</code> 형태로 원하는 위치에 자유롭게 배치합니다.
      </p>
    </header>

    <!-- ① 패턴 A — 아이콘 버튼만 트리거 (Figma 소비기한 행 패턴) -->
    <section class="collapsibleGuidePage__section">
      <h2 class="collapsibleGuidePage__sectionTitle">① 패턴 A — 아이콘 버튼만 트리거 (Figma 기준)</h2>
      <p class="collapsibleGuidePage__note">
        소비기한 행 디자인 패턴. <code>v-slot="{ Trigger, Content }"</code>으로 받은 컴포넌트를 헤더 행 안 원하는 위치에
        배치합니다.<br />
        <code>&lt;component :is="Trigger" /&gt;</code>에 슬롯 콘텐츠를 넣지 않으면 기본
        <code>circularArrow</code> 아이콘이 자동 렌더됩니다. 기본값인 <code>triggerAnimation</code>,
        <code>contentAnimation</code> prop이 <code>true</code>이므로 아이콘 회전과 height 슬라이드 애니메이션이 컴포넌트
        내부에서 자동으로 적용됩니다.
      </p>

      <div class="collapsibleGuidePage__demo">
        <div class="collapsibleGuidePage__expiryWrap">
          <Collapsible v-slot="{ Trigger, Content }">
            <div class="collapsibleGuidePage__expiryHeader">
              <span class="collapsibleGuidePage__expiryLabel">소비기한</span>
              <span class="collapsibleGuidePage__expiryDate">2027년 05월 13일</span>
              <!-- Trigger를 헤더 행 안 원하는 위치에 배치 -->
              <!-- aria-label: 아이콘만 있는 버튼은 보조기기에 목적을 전달해야 합니다 -->
              <div class="collapsibleGuidePage__collapsibleA">
                <component :is="Trigger" aria-label="소비기한 상세 보기" />
              </div>
            </div>
            <component :is="Content">
              <ul class="collapsibleGuidePage__expiryList">
                <li class="collapsibleGuidePage__expiryItem">
                  <span>수분크림 50ml</span>
                  <span>2027년 05월 13일</span>
                </li>
                <li class="collapsibleGuidePage__expiryItem">
                  <span>오투부스터 미스트 100ml</span>
                  <span>2026년 12월 31일</span>
                </li>
              </ul>
            </component>
          </Collapsible>
        </div>
      </div>

      <pre
        v-pre
        class="collapsibleGuidePage__code"
      ><code>&lt;!-- v-slot으로 Trigger·Content 컴포넌트를 받아 원하는 위치에 배치 --&gt;
&lt;!-- 슬롯 변수는 component :is 패턴으로 렌더합니다 --&gt;
&lt;!-- triggerAnimation, contentAnimation 기본값 true — 애니메이션은 컴포넌트 내부 처리 --&gt;
&lt;Collapsible v-slot="{ Trigger, Content }"&gt;
  &lt;div class="expiryHeader"&gt;
    &lt;span class="label"&gt;소비기한&lt;/span&gt;
    &lt;span class="date"&gt;2027년 05월 13일&lt;/span&gt;

    &lt;!-- component :is 패턴 — 슬롯 콘텐츠 없이 쓰면 기본 아이콘 자동 렌더 --&gt;
    &lt;!-- 아이콘만 있는 버튼: aria-label로 목적을 명시합니다 (a11y 필수) --&gt;
    &lt;div class="collapsibleArea"&gt;
      &lt;component :is="Trigger" aria-label="소비기한 상세 보기" /&gt;
    &lt;/div&gt;
  &lt;/div&gt;

  &lt;component :is="Content"&gt;
    &lt;ul&gt;
      &lt;li v-for="item in items" :key="item.id"&gt;
        &lt;span&gt;{{ item.name }}&lt;/span&gt;
        &lt;span&gt;{{ item.date }}&lt;/span&gt;
      &lt;/li&gt;
    &lt;/ul&gt;
  &lt;/component&gt;
&lt;/Collapsible&gt;</code></pre>
    </section>

    <!-- ② 패턴 B — 텍스트+아이콘 전체가 트리거 -->
    <section class="collapsibleGuidePage__section">
      <h2 class="collapsibleGuidePage__sectionTitle">② 패턴 B — 텍스트+아이콘 전체가 트리거</h2>
      <p class="collapsibleGuidePage__note">
        <code>&lt;component :is="Trigger"&gt;</code>에 텍스트와 아이콘을 함께 넣어 트리거 버튼 전체가 클릭 가능한 패턴.
        FAQ 항목, 상품 상세 토글 등에 적합합니다.<br />
        <code>&lt;component :is="Trigger"&gt;</code> 슬롯에 콘텐츠를 넣으면 기본 아이콘 대신 해당 콘텐츠가 렌더됩니다.
      </p>

      <div class="collapsibleGuidePage__demo">
        <div class="collapsibleGuidePage__collapsibleB">
          <Collapsible v-slot="{ Trigger, Content }" :trigger-animation="false">
            <component :is="Trigger">
              <span class="collapsibleGuidePage__triggerLabel">FAQ — 반품 안내</span>
              <!-- component :is="Trigger" 슬롯에 콘텐츠를 넣으면 기본 아이콘은 함께 렌더되지 않음 -->
              <!-- 아이콘이 필요하면 Icon 컴포넌트를 직접 추가 -->
            </component>
            <component :is="Content">
              <div class="collapsibleGuidePage__faqContent">
                <p>반품은 상품 수령일로부터 7일 이내에 신청 가능합니다.</p>
                <p>단, 개봉된 화장품은 반품이 불가합니다.</p>
                <p>반품 신청은 마이페이지 &gt; 주문/배송조회에서 진행해 주세요.</p>
              </div>
            </component>
          </Collapsible>
        </div>
      </div>

      <pre class="collapsibleGuidePage__code"><code>&lt;Collapsible v-slot="{ Trigger, Content }"&gt;
  &lt;component :is="Trigger"&gt;
    &lt;span&gt;FAQ — 반품 안내&lt;/span&gt;
    &lt;!-- 슬롯에 콘텐츠를 제공하면 기본 아이콘 렌더 안 됨 --&gt;
  &lt;/component&gt;
  &lt;component :is="Content"&gt;
    &lt;p&gt;반품은 상품 수령일로부터 7일 이내에 신청 가능합니다.&lt;/p&gt;
  &lt;/component&gt;
&lt;/Collapsible&gt;</code></pre>
    </section>

    <!-- ③ 초기 열림 상태 (defaultOpen) -->
    <section class="collapsibleGuidePage__section">
      <h2 class="collapsibleGuidePage__sectionTitle">③ 초기 열림 상태 (defaultOpen)</h2>
      <p class="collapsibleGuidePage__note">
        <code>defaultOpen</code> attr을 전달하면 처음부터 열린 상태로 렌더됩니다. 이후 열림/닫힘은 내부적으로 관리됩니다
        (uncontrolled). Radix Vue CollapsibleRoot에 attrs 위임으로 자동 전달됩니다.
      </p>

      <div class="collapsibleGuidePage__demo">
        <div class="collapsibleGuidePage__collapsibleB">
          <Collapsible :default-open="true" v-slot="{ Trigger, Content }" :trigger-animation="false">
            <component :is="Trigger">
              <span class="collapsibleGuidePage__triggerLabel">배송 안내 (기본 열림)</span>
            </component>
            <component :is="Content">
              <div class="collapsibleGuidePage__faqContent">
                <p>배송은 결제 완료 후 평균 1~3 영업일 내 출발합니다.</p>
                <p>제주 및 도서 산간 지역은 추가 배송비가 발생할 수 있습니다.</p>
              </div>
            </component>
          </Collapsible>
        </div>
      </div>

      <pre
        class="collapsibleGuidePage__code"
      ><code>&lt;!-- defaultOpen → CollapsibleRoot에 attrs 위임으로 자동 전달 --&gt;
&lt;Collapsible default-open v-slot="{ Trigger, Content }"&gt;
  &lt;component :is="Trigger"&gt;배송 안내&lt;/component&gt;
  &lt;component :is="Content"&gt;...&lt;/component&gt;
&lt;/Collapsible&gt;</code></pre>
    </section>

    <!-- ④ Controlled 모드 (v-model:open) -->
    <section class="collapsibleGuidePage__section">
      <h2 class="collapsibleGuidePage__sectionTitle">④ Controlled 모드 (v-model:open)</h2>
      <p class="collapsibleGuidePage__note">
        <code>v-model:open</code>으로 외부 상태와 양방향 바인딩합니다. React의 <code>useState</code>로 controlled
        input을 관리하는 것과 동일한 패턴입니다.
      </p>

      <div class="collapsibleGuidePage__demo">
        <div class="collapsibleGuidePage__controlRow">
          <button type="button" class="collapsibleGuidePage__ctrlBtn" @click="controlledOpen = !controlledOpen">
            {{ controlledOpen ? '닫기' : '열기' }} (외부 버튼)
          </button>
          <span class="collapsibleGuidePage__stateLabel">
            현재 상태: <strong>{{ controlledOpen ? 'open' : 'closed' }}</strong>
          </span>
        </div>

        <div class="collapsibleGuidePage__collapsibleB">
          <Collapsible v-model:open="controlledOpen" v-slot="{ Trigger, Content }" :trigger-animation="false">
            <component :is="Trigger">
              <span class="collapsibleGuidePage__triggerLabel">주문 배송 안내</span>
            </component>
            <component :is="Content">
              <div class="collapsibleGuidePage__faqContent">
                <p>배송은 결제 완료 후 평균 1~3 영업일 내 출발합니다.</p>
                <p>제주 및 도서 산간 지역은 추가 배송비가 발생할 수 있습니다.</p>
              </div>
            </component>
          </Collapsible>
        </div>
      </div>

      <pre class="collapsibleGuidePage__code"><code>&lt;script setup&gt;
const isOpen = ref(false)
&lt;/script&gt;

&lt;template&gt;
  &lt;button @click="isOpen = !isOpen"&gt;외부에서 제어&lt;/button&gt;

  &lt;Collapsible v-model:open="isOpen" v-slot="{ Trigger, Content }"&gt;
    &lt;component :is="Trigger"&gt;주문 배송 안내&lt;/component&gt;
    &lt;component :is="Content"&gt;...&lt;/component&gt;
  &lt;/Collapsible&gt;
&lt;/template&gt;</code></pre>
    </section>

    <!-- ⑤ triggerAnimation=false — 커스텀 트리거 형태 -->
    <section class="collapsibleGuidePage__section">
      <h2 class="collapsibleGuidePage__sectionTitle">⑤ triggerAnimation=false — 커스텀 트리거 형태</h2>
      <p class="collapsibleGuidePage__note">
        트리거가 아이콘이 아닌 텍스트·복합 버튼 형태일 때 <code>:trigger-animation="false"</code>를 전달합니다.<br />
        컴포넌트 내부 아이콘 회전 CSS가 적용되지 않으며, 사용처에서 원하는 상태 스타일을 직접 구현합니다.<br />
        <code>:content-animation="false"</code>를 함께 전달하면 height 슬라이드도 즉시 표시/숨김으로 전환됩니다.
      </p>

      <div class="collapsibleGuidePage__demo">
        <div class="collapsibleGuidePage__collapsibleC">
          <Collapsible :trigger-animation="false" v-slot="{ Trigger, Content }">
            <component :is="Trigger">
              <span class="collapsibleGuidePage__triggerLabel">교환·환불 안내 (triggerAnimation=false)</span>
            </component>
            <component :is="Content">
              <div class="collapsibleGuidePage__faqContent">
                <p>교환은 상품 수령일로부터 7일 이내에 신청 가능합니다.</p>
                <p>단순 변심에 의한 교환·반품 시 왕복 배송비가 발생합니다.</p>
              </div>
            </component>
          </Collapsible>
        </div>
      </div>

      <pre class="collapsibleGuidePage__code"><code>&lt;!-- triggerAnimation=false: 아이콘 회전 CSS 미적용 --&gt;
&lt;!-- 사용처에서 원하는 트리거 상태 스타일 직접 구현 --&gt;
&lt;Collapsible :trigger-animation="false" v-slot="{ Trigger, Content }"&gt;
  &lt;component :is="Trigger"&gt;
    &lt;span&gt;교환·환불 안내&lt;/span&gt;
  &lt;/component&gt;
  &lt;component :is="Content"&gt;
    &lt;p&gt;교환은 상품 수령일로부터 7일 이내에 신청 가능합니다.&lt;/p&gt;
  &lt;/component&gt;
&lt;/Collapsible&gt;

&lt;!-- contentAnimation도 끄려면 --&gt;
&lt;Collapsible :trigger-animation="false" :content-animation="false" v-slot="{ Trigger, Content }"&gt;
  ...
&lt;/Collapsible&gt;</code></pre>
    </section>

    <!-- ⑥ Props / Slots / Events -->
    <section class="collapsibleGuidePage__section">
      <h2 class="collapsibleGuidePage__sectionTitle">⑥ Props / Slots / Events</h2>

      <h3 class="collapsibleGuidePage__tableTitle">Props</h3>
      <table class="collapsibleGuidePage__propsTable">
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
            <td><code>open</code></td>
            <td><code>boolean</code></td>
            <td><code>undefined</code></td>
            <td>
              <code>v-model:open</code>용 controlled 상태. 미전달 시 내부 상태로 동작 (uncontrolled). Radix Vue
              CollapsibleRoot에 위임됩니다.
            </td>
          </tr>
          <tr>
            <td><code>contentAnimation</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>
              content 영역 height 슬라이드 애니메이션 적용 여부. <code>true</code>이면 컴포넌트 내부 SCSS에서
              open/closed 전환 시 height가 부드럽게 변합니다. <code>false</code>이면 Radix Vue 기본 동작(즉시
              표시/숨김)을 그대로 사용합니다.
            </td>
          </tr>
          <tr>
            <td><code>triggerAnimation</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>
              트리거 내부 콘텐츠에 아이콘 회전 애니메이션 적용 여부. <code>true</code>이면 closed 상태에서
              <code>rotate(90deg)</code>, open 상태에서 <code>rotate(0deg)</code>가 컴포넌트 내부에서 자동 적용됩니다.
              트리거가 텍스트·복합 버튼 형태일 때 <code>false</code>로 끄고 사용처에서 별도 제어합니다.
            </td>
          </tr>
        </tbody>
      </table>

      <p class="collapsibleGuidePage__note">
        <code>defaultOpen</code>, <code>disabled</code>, <code>dir</code> 등 Radix Vue CollapsibleRoot props는 attrs를
        통해 1단계(Root)로 자동 위임됩니다 (아래 위임 안내 참고).
      </p>

      <h3 class="collapsibleGuidePage__tableTitle">Scoped Slot</h3>
      <table class="collapsibleGuidePage__propsTable">
        <thead>
          <tr>
            <th>이름</th>
            <th>필수</th>
            <th>설명</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>default</code> (<code>v-slot="{ Trigger, Content }"</code>)</td>
            <td>필수</td>
            <td>
              <code>Trigger</code>, <code>Content</code> 컴포넌트를 scoped slot으로 제공합니다. 슬롯 변수는 컴포넌트가
              아닌 값이므로 반드시 <code>&lt;component :is="Trigger" /&gt;</code> 패턴으로 사용해야 합니다.<br />
              <code>&lt;component :is="Trigger" /&gt;</code>: <code>CollapsibleTrigger</code> 래퍼. 슬롯 콘텐츠 없이
              쓰면 기본 아이콘(<code>&lt;Icon size="sm"&gt;&lt;CircularArrowSvg /&gt;&lt;/Icon&gt;</code>) 자동 렌더.
              콘텐츠를 넣으면 해당 콘텐츠로 대체됩니다.<br />
              <code>&lt;component :is="Content"&gt;</code>: <code>CollapsibleContent</code> 래퍼. 열림 상태에서만
              표시됩니다.
            </td>
          </tr>
        </tbody>
      </table>

      <h3 class="collapsibleGuidePage__tableTitle">Events</h3>
      <table class="collapsibleGuidePage__propsTable">
        <thead>
          <tr>
            <th>이름</th>
            <th>페이로드</th>
            <th>설명</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>update:open</code></td>
            <td><code>boolean</code></td>
            <td>
              열림/닫힘 상태 변경 시 발생. <code>v-model:open</code>으로 바인딩하거나 <code>@update:open</code>으로 직접
              수신 가능.
            </td>
          </tr>
        </tbody>
      </table>

      <p class="collapsibleGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는 <code>v-bind="$attrs"</code>를 사용하며 attrs를 두 곳으로
        분배합니다.<br />
        <strong>1단계 (CollapsibleRoot)</strong>: <code>open</code>, <code>defaultOpen</code>, <code>disabled</code> 등
        Root 전용 props가 자동 위임됩니다.<br />
        <strong>2단계 (Trigger 컴포넌트)</strong>: <code>aria-label</code>, <code>aria-describedby</code>,
        <code>tabindex</code>, <code>data-*</code> 등 나머지 attrs가 트리거 버튼에 전달됩니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>

      <p class="collapsibleGuidePage__radixNote">
        이 컴포넌트는 <strong>Radix Vue</strong>를 기반으로 합니다. 위 Props 외에도 Radix Vue가 지원하는 추가 props를
        사용할 수 있습니다. 전체 API는
        <a href="https://www.radix-vue.com/components/collapsible" target="_blank" rel="noopener noreferrer"
          >radix-vue.com 공식 문서 (Collapsible)</a
        >
        또는 Context7 MCP(<code>mcp__context7__query-docs</code>)를 통해 확인하세요.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ layout: 'guide' })

  const controlledOpen = ref(false)
</script>

<style lang="scss" scoped>
  $b: 'collapsibleGuidePage';

  .#{$b} {
    display: flex;
    flex-direction: column;
    gap: $spacing-xl;
    padding: $spacing-xl;
    max-width: 80rem;

    // ── 헤더 ──────────────────────────────────────────────

    &__header {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
      padding-bottom: $spacing-lg;
      border-bottom: 1px solid $line-200;
    }

    &__meta {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
    }

    &__badge {
      display: flex;
      align-items: center;
      padding: 0.2rem $spacing-sm;
      background-color: $bg-accent-sky-blue;
      border-radius: $radius-sm;
      font-size: $font-size-caption1;
      font-weight: $font-weight-medium;
      color: $color-primary;
    }

    &__title {
      margin: 0;
      font-size: $font-size-h2;
      font-weight: $font-weight-bold;
      color: $text-900;
    }

    &__desc {
      margin: 0;
      font-size: $font-size-body2;
      color: $text-600;
      line-height: $line-height-base;
    }

    // ── 섹션 공통 ──────────────────────────────────────────

    &__section {
      display: flex;
      flex-direction: column;
      gap: $spacing-md;
      padding: $spacing-lg;
      background-color: $bg-primary;
      border: 1px solid $line-200;
      border-radius: $radius-md;
    }

    &__sectionTitle {
      margin: 0;
      font-size: $font-size-h4;
      font-weight: $font-weight-bold;
      color: $text-900;
      padding-bottom: $spacing-sm;
      border-bottom: 1px solid $line-200;
    }

    &__note {
      margin: 0;
      font-size: $font-size-body3;
      color: $text-600;
      line-height: $line-height-base;
    }

    &__demo {
      display: flex;
      flex-direction: column;
      gap: $spacing-md;
      padding: $spacing-lg;
      background-color: $bg-secondary;
      border-radius: $radius-md;
      border: 1px solid $line-200;
    }

    &__code {
      margin: 0;
      padding: $spacing-md;
      background-color: $bg-tertiary;
      border-radius: $radius-sm;
      font-size: $font-size-caption1;
      color: $text-900;
      overflow-x: auto;
      line-height: $line-height-loose;

      code {
        font-family: 'Courier New', Courier, monospace;
      }
    }

    // ── ① 패턴 A: 아이콘 버튼만 트리거 (소비기한 행) ──────────

    &__expiryWrap {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    &__expiryHeader {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-sm 0;
    }

    &__expiryLabel {
      font-size: $font-size-body3;
      font-weight: $font-weight-medium;
      color: $text-600;
    }

    &__expiryDate {
      flex: 1;
      font-size: $font-size-body3;
      color: $text-900;
    }

    // 패턴 A: Trigger가 헤더 안 아이콘 버튼 영역에 위치
    // 아이콘 회전·height 애니메이션은 컴포넌트 내부 SCSS 처리 (triggerAnimation·contentAnimation prop)
    &__collapsibleA {
      // CollapsibleTrigger 버튼 초기화 — 아이콘 버튼 전용
      :deep(button) {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.4rem;
        height: 2.4rem;
        padding: 0;
        background: none;
        border: none;
        border-radius: $radius-sm;
        cursor: pointer;
        color: $text-900;

        &:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px $color-primary;
        }
      }
    }

    &__expiryList {
      list-style: none;
      margin: 0;
      padding: $spacing-xs 0;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    &__expiryItem {
      display: flex;
      justify-content: space-between;
      padding: $spacing-xs $spacing-sm;
      font-size: $font-size-body3;
      color: $text-900;

      &:not(:last-child) {
        border-bottom: 1px solid $line-300;
      }
    }

    // ── ② 패턴 B: 텍스트+아이콘 전체가 트리거 ─────────────────

    // 패턴 B: 텍스트+아이콘 전체가 트리거
    // 아이콘 회전·height 애니메이션은 컴포넌트 내부 SCSS 처리
    &__collapsibleB {
      width: 100%;

      :deep(button) {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: $spacing-sm $spacing-md;
        background: none;
        border: none;
        border-radius: $radius-sm;
        cursor: pointer;
        color: $text-900;

        &:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px $color-primary;
        }
      }
    }

    // ── ⑤ triggerAnimation=false 데모 ────────────────────────

    &__collapsibleC {
      width: 100%;

      :deep(button) {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: $spacing-sm $spacing-md;
        background: none;
        border: none;
        border-radius: $radius-sm;
        cursor: pointer;
        color: $text-900;

        &:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px $color-primary;
        }
      }
    }

    &__triggerLabel {
      font-size: $font-size-body3;
      font-weight: $font-weight-medium;
      color: $text-900;
    }

    // ── ④ Controlled 모드 예시 ────────────────────────────

    &__controlRow {
      display: flex;
      align-items: center;
      gap: $spacing-md;
      padding-bottom: $spacing-md;
      border-bottom: 1px solid $line-200;
    }

    &__ctrlBtn {
      display: flex;
      align-items: center;
      padding: $spacing-xs $spacing-md;
      background-color: $color-primary;
      color: $text-white;
      border: none;
      border-radius: $radius-sm;
      font-size: $font-size-body3;
      font-weight: $font-weight-medium;
      cursor: pointer;

      &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px $color-primary-hover;
      }
    }

    &__stateLabel {
      font-size: $font-size-body3;
      color: $text-600;
    }

    // ── 콘텐츠 공통 ──────────────────────────────────────────

    &__faqContent {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
      padding: $spacing-sm $spacing-md;

      p {
        margin: 0;
        font-size: $font-size-body3;
        color: $text-600;
        line-height: $line-height-base;
      }
    }

    // ── ⑥ Props 테이블 ───────────────────────────────────────

    &__tableTitle {
      margin: $spacing-lg 0 $spacing-sm;
      font-size: $font-size-body2;
      font-weight: $font-weight-bold;
      color: $text-900;
    }

    &__propsTable {
      width: 100%;
      border-collapse: collapse;
      font-size: $font-size-body3;

      th,
      td {
        border: 1px solid $line-200;
        padding: $spacing-sm $spacing-md;
        text-align: left;
        vertical-align: top;
      }

      th {
        background-color: $bg-secondary;
        font-weight: $font-weight-medium;
        color: $text-600;
        white-space: nowrap;
      }

      td {
        color: $text-900;
      }

      code {
        background-color: $bg-tertiary;
        padding: 0.1rem 0.4rem;
        border-radius: $radius-sm;
        font-size: $font-size-caption1;
        white-space: nowrap;
      }
    }

    &__delegationNote {
      margin-top: $spacing-lg;
      padding: $spacing-sm $spacing-md;
      background-color: $bg-accent-light-blue;
      border-left: 3px solid $color-primary;
      border-radius: $radius-sm;
      font-size: $font-size-body3;
      color: $text-600;
      line-height: $line-height-base;

      code {
        background-color: $bg-tertiary;
        padding: 0.1rem 0.4rem;
        border-radius: $radius-sm;
        font-size: $font-size-caption1;
      }
    }

    &__radixNote {
      margin-top: $spacing-md;
      padding: $spacing-sm $spacing-md;
      background-color: $bg-secondary;
      border-left: 3px solid $line-200; // $border-default 토큰 미존재 → $line-200 대체
      border-radius: $radius-sm;
      font-size: $font-size-body3;
      color: $text-600;
      line-height: $line-height-base;

      a {
        color: $color-primary;
      }

      code {
        background-color: $bg-tertiary;
        padding: 0.1rem 0.4rem;
        border-radius: $radius-sm;
        font-size: $font-size-caption1;
      }
    }
  }
</style>
