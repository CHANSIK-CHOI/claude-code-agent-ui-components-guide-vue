<template>
  <div class="tabGuidePage">
    <!-- 헤더 -->
    <header class="tabGuidePage__header">
      <div class="tabGuidePage__meta">
        <span class="tabGuidePage__badge">organisms</span>
      </div>
      <h1 class="tabGuidePage__title">Tab</h1>
      <p class="tabGuidePage__desc">
        콘텐츠 영역을 전환하는 탭 네비게이션 컴포넌트입니다.<br />
        <strong>Navigation only</strong> 설계로, Tab 자체는 탭 목록만 렌더링하고 콘텐츠 패널은 부모 컴포넌트가
        <code>v-model</code>로 받은 선택값에 따라 직접 전환합니다.<br />
        내부적으로 <strong>Radix Vue Tabs</strong>를 사용해 키보드 탐색(좌우 방향키), ARIA
        처리(<code>role="tablist"</code>, <code>aria-selected</code>)를 자동으로 지원합니다.<br />
        4가지 variant(<code>underline-dark</code>, <code>underline-primary</code>, <code>pill</code>, <code>pill-vertical</code>)를 제공하며,
        <code>#actions</code> 슬롯으로 <code>Button</code> 등 외부 컨텐츠를 탭 우측에 배치할 수 있습니다.
      </p>
    </header>

    <!-- ① underline-dark -->
    <section class="tabGuidePage__section">
      <h2 class="tabGuidePage__sectionTitle">① underline-dark variant</h2>
      <p class="tabGuidePage__note">
        상품 상세 페이지 탭에 사용하는 variant입니다. 높이 52px, 하단
        <code>$text-800</code> 색상의 2px 인디케이터. badge 표시 지원.
      </p>

      <div class="tabGuidePage__group">
        <p class="tabGuidePage__groupTitle">badge 포함 — 리뷰 수 표시</p>
        <p class="tabGuidePage__note">
          <code>badge</code>는 포맷이 포함된 문자열을 그대로 전달합니다. 라벨과 이어서 렌더링됩니다 (예:
          <code>리뷰(9,999)</code>).<br />
          선택된 탭: <strong>{{ demo1 }}</strong>
        </p>
        <div class="tabGuidePage__row">
          <div class="tabGuidePage__item">
            <Tab v-model="demo1" :items="detailTabs" variant="underline-dark" />
            <pre class="tabGuidePage__code"><code>&lt;Tab
  v-model="activeTab"
  :items="tabs"
  variant="underline-dark"
/&gt;

&lt;!-- tabs 데이터 --&gt;
const tabs = [
  { value: 'desc',     label: '상품설명' },
  { value: 'review',   label: '리뷰', badge: '(9,999)' },
  { value: 'shipping', label: '배송 안내' },
  { value: 'inquiry',  label: '문의' },
]</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ② underline-primary -->
    <section class="tabGuidePage__section">
      <h2 class="tabGuidePage__sectionTitle">② underline-primary variant</h2>
      <p class="tabGuidePage__note">
        카테고리 메뉴 탭에 사용하는 variant입니다. 높이 48px, 하단
        <code>$color-primary</code> 색상의 2px 인디케이터. 탭이 많아지면 가로 스크롤이 발생합니다.<br />
        선택된 탭: <strong>{{ demo2 }}</strong>
      </p>

      <div class="tabGuidePage__group">
        <p class="tabGuidePage__groupTitle">카테고리 탭 — 가로 스크롤 발생</p>
        <div class="tabGuidePage__row">
          <div class="tabGuidePage__item">
            <Tab v-model="demo2" :items="categoryTabs" variant="underline-primary" />
            <pre class="tabGuidePage__code"><code>&lt;Tab
  v-model="activeTab"
  :items="tabs"
  variant="underline-primary"
/&gt;

&lt;!-- tabs 데이터 --&gt;
const tabs = [
  { value: 'all',       label: '전체' },
  { value: 'promo',     label: '프로모션' },
  { value: 'premium',   label: '프리미엄' },
  { value: 'basic',     label: '베이직' },
]</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ③ pill (기본) -->
    <section class="tabGuidePage__section">
      <h2 class="tabGuidePage__sectionTitle">③ pill variant</h2>
      <p class="tabGuidePage__note">
        정렬/필터 탭에 사용하는 variant입니다. 높이 36px, pill 형태(border-radius: full). active 배경색은
        <code>$color-primary-hover</code> (#00addb). 탭이 많아지면 가로 스크롤이 발생합니다.<br />
        선택된 탭: <strong>{{ demo3 }}</strong>
      </p>

      <div class="tabGuidePage__group">
        <p class="tabGuidePage__groupTitle">정렬 탭 — 가로 스크롤 발생</p>
        <div class="tabGuidePage__row">
          <div class="tabGuidePage__item">
            <Tab v-model="demo3" :items="sortTabs" variant="pill" />
            <pre class="tabGuidePage__code"><code>&lt;Tab
  v-model="activeTab"
  :items="tabs"
  variant="pill"
/&gt;

&lt;!-- tabs 데이터 --&gt;
const tabs = [
  { value: 'latest',   label: '최신순' },
  { value: 'sales',    label: '판매순' },
  { value: 'price-asc', label: '낮은가격순' },
  { value: 'price-desc', label: '높은가격순' },
  { value: 'review',   label: '리뷰순' },
]</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ④ pill-vertical -->
    <section class="tabGuidePage__section">
      <h2 class="tabGuidePage__sectionTitle">④ pill-vertical variant</h2>
      <p class="tabGuidePage__note">
        세로 정렬 탭에 사용하는 variant입니다. 탭 항목이 세로로 쌓이며 가로 스크롤이 없습니다.<br />
        Active 배경색은 <code>$color-primary-hover</code>, Inactive는 <code>$bg-primary</code> + <code>1px solid $line-200</code> 테두리.<br />
        내부적으로 <code>orientation="vertical"</code>이 자동 주입되어 키보드 위/아래 방향키로 탭 이동이 가능합니다.<br />
        <code>grow</code> prop과 <code>#actions</code> 슬롯은 이 variant에서 무시됩니다.<br />
        선택된 탭: <strong>{{ demoPillVertical }}</strong>
      </p>

      <div class="tabGuidePage__group">
        <p class="tabGuidePage__groupTitle">세로 질문형 탭 — 가로 스크롤 없음</p>
        <div class="tabGuidePage__row">
          <div class="tabGuidePage__item">
            <Tab v-model="demoPillVertical" :items="pillVerticalTabs" variant="pill-vertical" />
            <pre class="tabGuidePage__code"><code>&lt;Tab
  v-model="activeTab"
  :items="tabs"
  variant="pill-vertical"
/&gt;

&lt;!-- tabs 데이터 --&gt;
const tabs = [
  { value: 'q1', label: '피부 타입은 무엇인가요?' },
  { value: 'q2', label: '주요 피부 고민은 무엇인가요?' },
  { value: 'q3', label: '선호하는 제형은 무엇인가요?' },
]</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑤ #actions 슬롯 + Button 조합 -->
    <section class="tabGuidePage__section">
      <h2 class="tabGuidePage__sectionTitle">⑤ #actions 슬롯 — Button 조합</h2>
      <p class="tabGuidePage__note">
        <code>#actions</code> 슬롯으로 탭 목록 우측에 외부 컨텐츠를 배치할 수 있습니다.<br />
        <code>text</code> shape <code>Button</code>을 <code>#actions</code>에 넣으면 보조 액션 버튼이 탭 우측에 고정됩니다.
        <strong>모든 variant</strong>에서 사용 가능합니다.
      </p>

      <div class="tabGuidePage__group">
        <p class="tabGuidePage__groupTitle">
          pill + Button — 선택된 탭: <strong>{{ demo4Tab }}</strong>
        </p>
        <div class="tabGuidePage__row">
          <div class="tabGuidePage__item">
            <Tab v-model="demo4Tab" :items="sortTabs" variant="pill">
              <template #actions>
                <Button shape="text" size="xs" @click="demo4Tab = sortTabs[0].value">초기화</Button>
              </template>
            </Tab>
            <pre class="tabGuidePage__code"><code>&lt;Tab v-model="activeTab" :items="tabs" variant="pill"&gt;
  &lt;template #actions&gt;
    &lt;Button shape="text" size="xs" @click="reset"&gt;초기화&lt;/Button&gt;
  &lt;/template&gt;
&lt;/Tab&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="tabGuidePage__group">
        <p class="tabGuidePage__groupTitle">
          underline-primary + Button — 선택된 탭: <strong>{{ demo5Tab }}</strong>
        </p>
        <div class="tabGuidePage__row">
          <div class="tabGuidePage__item">
            <Tab v-model="demo5Tab" :items="categoryTabs" variant="underline-primary">
              <template #actions>
                <Button shape="text" size="xs" @click="demo5Tab = categoryTabs[0].value">초기화</Button>
              </template>
            </Tab>
            <pre class="tabGuidePage__code"><code>&lt;Tab v-model="activeTab" :items="tabs" variant="underline-primary"&gt;
  &lt;template #actions&gt;
    &lt;Button shape="text" size="xs" @click="reset"&gt;초기화&lt;/Button&gt;
  &lt;/template&gt;
&lt;/Tab&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="tabGuidePage__group">
        <p class="tabGuidePage__groupTitle">
          underline-dark + Button — 선택된 탭: <strong>{{ demo6Tab }}</strong>
        </p>
        <div class="tabGuidePage__row">
          <div class="tabGuidePage__item">
            <Tab v-model="demo6Tab" :items="detailTabs" variant="underline-dark">
              <template #actions>
                <Button shape="text" size="xs" @click="demo6Tab = detailTabs[0].value">초기화</Button>
              </template>
            </Tab>
            <pre class="tabGuidePage__code"><code>&lt;Tab v-model="activeTab" :items="tabs" variant="underline-dark"&gt;
  &lt;template #actions&gt;
    &lt;Button shape="text" size="xs" @click="reset"&gt;초기화&lt;/Button&gt;
  &lt;/template&gt;
&lt;/Tab&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑥ Navigation only 패턴 -->
    <section class="tabGuidePage__section">
      <h2 class="tabGuidePage__sectionTitle">⑥ Navigation only 패턴</h2>
      <p class="tabGuidePage__note">
        Tab 컴포넌트는 <code>TabsContent</code>를 사용하지 않는 Navigation only 설계입니다.<br />
        콘텐츠 패널 전환은 부모 컴포넌트가 <code>v-model</code>로 받은 선택값을 기준으로 <code>v-if</code> /
        <code>v-else-if</code>로 직접 제어합니다.<br />
        Radix Vue가 <code>aria-selected</code>와 키보드 탐색(좌우 방향키, Home, End)을 자동 처리합니다.
      </p>

      <div class="tabGuidePage__group">
        <p class="tabGuidePage__groupTitle">부모 컴포넌트에서 콘텐츠 패널 전환</p>
        <pre class="tabGuidePage__code"><code>&lt;!-- 부모 컴포넌트 --&gt;
&lt;template&gt;
  &lt;Tab v-model="activeTab" :items="tabs" variant="underline-dark" /&gt;

  &lt;ProductDescription v-if="activeTab === 'desc'" /&gt;
  &lt;ReviewList         v-else-if="activeTab === 'review'" /&gt;
  &lt;ShippingInfo       v-else-if="activeTab === 'shipping'" /&gt;
  &lt;InquiryList        v-else-if="activeTab === 'inquiry'" /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
const activeTab = ref('desc')

const tabs = [
  { value: 'desc',     label: '상품설명' },
  { value: 'review',   label: '리뷰', badge: '(9,999)' },
  { value: 'shipping', label: '배송 안내' },
  { value: 'inquiry',  label: '문의' },
]
&lt;/script&gt;</code></pre>
      </div>

      <div class="tabGuidePage__group">
        <p class="tabGuidePage__groupTitle">가로 스크롤 동작 규칙</p>
        <p class="tabGuidePage__note">
          3가지 variant 모두 탭 목록이 컨테이너 너비를 초과하면 가로 스크롤이 자동 활성화됩니다.<br />
          PC (hover 가능 환경): 하단 네이티브 스크롤바 표시.<br />
          모바일 (터치 환경): 스크롤바 숨김, 손가락 스와이프로 이동 (<code>@media (hover: none)</code>
          적용).
        </p>
        <pre class="tabGuidePage__code"><code>&lt;!-- aria-label로 TabsRoot에 레이블 전달 가능 --&gt;
&lt;Tab
  v-model="activeTab"
  :items="tabs"
  variant="underline-primary"
  aria-label="상품 카테고리 탭"
/&gt;</code></pre>
      </div>
    </section>

    <!-- ⑦ grow prop -->
    <section class="tabGuidePage__section">
      <h2 class="tabGuidePage__sectionTitle">⑦ grow — 균등 너비 채우기 (underline-dark 전용)</h2>
      <p class="tabGuidePage__note">
        <code>grow</code>는 <strong><code>underline-dark</code> variant에서만 유효합니다.</strong> 다른 variant(<code>underline-primary</code>, <code>pill</code>)에서 <code>grow: true</code>를 전달하면 무시됩니다.<br />
        <code>grow: true</code>이면 각 탭 버튼이 <code>flex: 1</code>로 리스트 너비를 균등하게 나눠 채웁니다.<br />
        탭이 컨테이너를 초과할 수 없으므로 가로 스크롤은 비활성화됩니다. <code>grow</code>와 가로 스크롤은 상호 배타입니다.<br />
        탭 수가 적을 때 탭 목록이 화면 전체를 꽉 채워야 하는 경우에 사용합니다.
      </p>

      <div class="tabGuidePage__group">
        <p class="tabGuidePage__groupTitle">underline-dark + grow — 선택된 탭: <strong>{{ demoGrow3 }}</strong></p>
        <div class="tabGuidePage__row">
          <div class="tabGuidePage__item">
            <Tab v-model="demoGrow3" :items="growTabs" variant="underline-dark" :grow="true" />
            <pre class="tabGuidePage__code"><code>&lt;Tab
  v-model="activeTab"
  :items="tabs"
  variant="underline-dark"
  :grow="true"
/&gt;

&lt;!-- tabs 데이터 --&gt;
const tabs = [
  { value: 'all',      label: '전체' },
  { value: 'promo',    label: '프로모션' },
  { value: 'premium',  label: '프리미엄' },
  { value: 'basic',    label: '베이직' },
]</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑧ Props 테이블 -->
    <section class="tabGuidePage__section">
      <h2 class="tabGuidePage__sectionTitle">⑧ Props</h2>

      <h3 class="tabGuidePage__tableTitle">Tab Props</h3>
      <table class="tabGuidePage__propsTable">
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
            <td><code>variant</code></td>
            <td>
              <code>'underline-dark' | 'underline-primary' | 'pill' | 'pill-vertical'</code>
            </td>
            <td><code>'underline-primary'</code></td>
            <td>
              탭의 디자인 스타일. 4가지 variant 제공.<br />
              <code>pill-vertical</code>: 세로 정렬 탭. 가로 스크롤 없음. <code>grow</code> prop과 <code>#actions</code> 슬롯 무시됨.
            </td>
          </tr>
          <tr>
            <td><code>items</code></td>
            <td><code>TabItem[]</code></td>
            <td>— (필수)</td>
            <td>탭 항목 배열. <code>TabItem</code> 타입 참조.</td>
          </tr>
          <tr>
            <td><code>modelValue</code></td>
            <td><code>string</code></td>
            <td><code>items[0].value</code></td>
            <td>현재 선택된 탭의 value (v-model 연동). 미전달 시 첫 번째 탭이 선택됨.</td>
          </tr>
          <tr>
            <td><code>grow</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>
              <strong><code>underline-dark</code> variant에서만 사용 가능.</strong> 다른 variant에서 전달 시 무시됨.<br />
              <code>true</code>이면 각 탭 버튼이 <code>flex: 1</code>로 리스트 너비를 균등하게 나눠 채움.
              <code>true</code>일 때 가로 스크롤은 비활성화됨. <code>grow</code>와 가로 스크롤은 상호 배타.
            </td>
          </tr>
        </tbody>
      </table>

      <h3 class="tabGuidePage__tableTitle">Slots</h3>
      <table class="tabGuidePage__propsTable">
        <thead>
          <tr>
            <th>이름</th>
            <th>필수</th>
            <th>설명</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>actions</code></td>
            <td>선택</td>
            <td>탭 목록 우측에 고정 배치되는 액션 슬롯. <code>Button</code> 등 외부 컨텐츠 삽입에 사용.</td>
          </tr>
        </tbody>
      </table>

      <h3 class="tabGuidePage__tableTitle">TabItem 타입</h3>
      <table class="tabGuidePage__propsTable">
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
            <td>탭 고유 식별자. v-model 연동에 사용됨.</td>
          </tr>
          <tr>
            <td><code>label</code></td>
            <td><code>string</code></td>
            <td>필수</td>
            <td>탭에 표시할 텍스트.</td>
          </tr>
          <tr>
            <td><code>badge</code></td>
            <td><code>string</code></td>
            <td>선택</td>
            <td>
              라벨 뒤에 이어서 표시할 배지 텍스트. 포맷(괄호 포함 여부 등)은 호출자가 결정. 예: <code>"(9,999)"</code>
            </td>
          </tr>
        </tbody>
      </table>

      <h3 class="tabGuidePage__tableTitle">Events</h3>
      <table class="tabGuidePage__propsTable">
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
            <td>탭 클릭 시 선택된 탭의 <code>value</code> 전달 (v-model 업데이트)</td>
          </tr>
        </tbody>
      </table>

      <p class="tabGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는 <code>v-bind="$attrs"</code>를 사용하므로
        위 Props 외에도 <code>TabsRoot</code> 요소의 모든 네이티브 HTML 속성
        (<code>aria-label</code>, <code>aria-labelledby</code>, <code>data-*</code> 등)을
        그대로 전달할 수 있습니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>

      <p class="tabGuidePage__radixNote">
        이 컴포넌트는 <strong>Radix Vue</strong>를 기반으로 합니다. 위 Props 외에도 Radix Vue가 지원하는 추가 props를
        사용할 수 있습니다. 전체 API는
        <a href="https://www.radix-vue.com/components/tabs.html" target="_blank" rel="noopener noreferrer"
          >radix-vue.com 공식 문서</a
        >
        또는 Context7 MCP(<code>mcp__context7__query-docs</code>)를 통해 확인하세요.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  import type { TabItem } from '@nd/components/organisms'

  definePageMeta({ layout: 'guide' })

  // [연동] 개발자가 API 응답으로 교체
  const detailTabs: TabItem[] = [
    { value: 'desc', label: '상품설명' },
    { value: 'review', label: '리뷰', badge: '(9,999)' },
    { value: 'shipping', label: '배송 안내' },
    { value: 'inquiry', label: '문의' },
  ]

  // [연동] 개발자가 API 응답으로 교체
  const categoryTabs: TabItem[] = [
    { value: 'all', label: '전체' },
    { value: 'promo', label: '프로모션' },
    { value: 'premium', label: '프리미엄' },
    { value: 'basic', label: '베이직' },
  ]

  // [연동] 개발자가 API 응답으로 교체
  const sortTabs: TabItem[] = [
    { value: 'latest', label: '최신순' },
    { value: 'sales', label: '판매순' },
    { value: 'price-asc', label: '낮은가격순' },
    { value: 'price-desc', label: '높은가격순' },
    { value: 'review', label: '리뷰순' },
  ]

  // pill-vertical 데모용 탭 데이터
  const pillVerticalTabs: TabItem[] = [
    { value: 'q1', label: '피부 타입은 무엇인가요?' },
    { value: 'q2', label: '주요 피부 고민은 무엇인가요?' },
    { value: 'q3', label: '선호하는 제형은 무엇인가요?' },
  ]

  // grow 데모용 탭 데이터 (underline-dark 전용)
  const growTabs: TabItem[] = [
    { value: 'all', label: '전체' },
    { value: 'promo', label: '프로모션' },
    { value: 'premium', label: '프리미엄' },
    { value: 'basic', label: '베이직' },
  ]

  // 데모 상태값
  const demo1 = ref<string>(detailTabs[0].value)
  const demo2 = ref<string>(categoryTabs[0].value)
  const demo3 = ref<string>(sortTabs[0].value)
  const demo4Tab = ref<string>(sortTabs[0].value)
  const demo5Tab = ref<string>(categoryTabs[0].value)
  const demo6Tab = ref<string>(detailTabs[0].value)
  const demoPillVertical = ref<string>(pillVerticalTabs[0].value)
  const demoGrow3 = ref<string>(growTabs[0].value)
</script>

<style lang="scss" scoped src="./tabGuidePage.scss"></style>
