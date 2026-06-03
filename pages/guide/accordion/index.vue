<template>
  <div class="accordionGuidePage">
    <!-- 헤더 -->
    <header class="accordionGuidePage__header">
      <div class="accordionGuidePage__meta">
        <span class="accordionGuidePage__badge">molecules</span>
      </div>
      <h1 class="accordionGuidePage__title">Accordion</h1>
      <p class="accordionGuidePage__desc">
        여러 개의 접힘/펼침 패널을 그룹으로 관리하는 아코디언 컴포넌트.<br />
        Radix Vue <code>AccordionRoot</code> 래핑. <code>type="single"</code>로 하나만 열리도록 강제하거나
        <code>type="multiple"</code>로 여러 패널을 동시에 열 수 있습니다.<br />
        <strong>4개 컴포넌트 직접 중첩 패턴</strong>: <code>Accordion</code>, <code>AccordionItem</code>,
        <code>AccordionTrigger</code>, <code>AccordionContent</code>를 개별 import해서 사용처에서 자유롭게 조합합니다.
        Radix Vue 원본 패턴과 동일한 사용 방식이며, 컴포넌트 내부는 슬라이드 애니메이션만 담당하고
        시각적 스타일(색상, border, 패딩 등)은 사용처에서 결정합니다.
      </p>
    </header>

    <!-- ① 기본 사용 (single) -->
    <section class="accordionGuidePage__section">
      <h2 class="accordionGuidePage__sectionTitle">① 기본 사용 (single)</h2>
      <p class="accordionGuidePage__note">
        <code>type="single"</code> + <code>collapsible</code> prop 조합. 한 번에 하나의 아이템만 열리며,
        열린 아이템을 재클릭하면 닫힙니다. <code>v-model:value</code>로 외부에서 열린 아이템을 controlled 모드로
        관리합니다.<br />
        <code>AccordionTrigger</code>의 슬롯을 비워두면 우측에 기본 아이콘(<code>SmallChevronDownSvg</code>)이
        자동 렌더되고, 열림/닫힘 시 아이콘이 회전합니다 (<code>headTrigger</code> 기본값 <code>false</code>).
      </p>

      <div class="accordionGuidePage__demo">
        <div class="accordionGuidePage__stateRow">
          <span class="accordionGuidePage__stateLabel">열린 아이템: <strong>{{ singleOpenItem || '(없음)' }}</strong></span>
        </div>
        <Accordion v-model:value="singleOpenItem" type="single" collapsible>
          <AccordionItem value="q1">
            <div class="accordionGuidePage__item">
              <div class="accordionGuidePage__triggerInner">
                <span class="accordionGuidePage__triggerLabel">반품 신청은 어떻게 하나요?</span>
                <AccordionTrigger />
              </div>
              <AccordionContent>
                <div class="accordionGuidePage__content">반품은 상품 수령일로부터 7일 이내에 신청 가능합니다. 마이페이지 > 주문/배송조회에서 반품 신청을 진행해 주세요.</div>
              </AccordionContent>
            </div>
          </AccordionItem>
          <AccordionItem value="q2">
            <div class="accordionGuidePage__item">
              <div class="accordionGuidePage__triggerInner">
                <span class="accordionGuidePage__triggerLabel">배송은 얼마나 걸리나요?</span>
                <AccordionTrigger />
              </div>
              <AccordionContent>
                <div class="accordionGuidePage__content">결제 완료 후 평균 1~3 영업일 내 출발합니다. 제주 및 도서 산간 지역은 추가 배송비가 발생할 수 있습니다.</div>
              </AccordionContent>
            </div>
          </AccordionItem>
          <AccordionItem value="q3">
            <div class="accordionGuidePage__item">
              <div class="accordionGuidePage__triggerInner">
                <span class="accordionGuidePage__triggerLabel">교환 신청 방법을 알려주세요.</span>
                <AccordionTrigger />
              </div>
              <AccordionContent>
                <div class="accordionGuidePage__content">교환은 상품 수령일로부터 7일 이내에 신청 가능합니다. 단순 변심에 의한 교환 시 왕복 배송비가 발생합니다.</div>
              </AccordionContent>
            </div>
          </AccordionItem>
        </Accordion>
      </div>

      <pre class="accordionGuidePage__code" v-pre><code>&lt;script setup lang="ts"&gt;
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@nd/components/molecules'

const openItem = ref('')
const faqItems = [
  { value: 'q1', label: '반품 신청은 어떻게 하나요?', body: '...' },
]
&lt;/script&gt;

&lt;template&gt;
  &lt;Accordion v-model:value="openItem" type="single" collapsible&gt;
    &lt;AccordionItem
      v-for="item in faqItems"
      :key="item.value"
      :value="item.value"
    &gt;
      &lt;!-- headTrigger 기본값(false): 슬롯 없이 사용하면 우측 아이콘 자동 렌더 --&gt;
      &lt;div class="faq__item"&gt;
        &lt;div class="faq__head"&gt;
          &lt;span class="faq__label"&gt;{{ item.label }}&lt;/span&gt;
          &lt;AccordionTrigger /&gt;
        &lt;/div&gt;
        &lt;AccordionContent&gt;{{ item.body }}&lt;/AccordionContent&gt;
      &lt;/div&gt;
    &lt;/AccordionItem&gt;
  &lt;/Accordion&gt;
&lt;/template&gt;</code></pre>
    </section>

    <!-- ② multiple 모드 -->
    <section class="accordionGuidePage__section">
      <h2 class="accordionGuidePage__sectionTitle">② multiple 모드</h2>
      <p class="accordionGuidePage__note">
        <code>type="multiple"</code> 모드에서는 여러 아이템을 동시에 열 수 있습니다.
        <code>v-model:value</code>는 <code>string[]</code> 배열 타입으로 바인딩합니다.
      </p>

      <div class="accordionGuidePage__demo">
        <div class="accordionGuidePage__stateRow">
          <span class="accordionGuidePage__stateLabel">열린 아이템: <strong>{{ multipleOpenItems.join(', ') || '(없음)' }}</strong></span>
        </div>
        <Accordion v-model:value="multipleOpenItems" type="multiple">
          <AccordionItem value="q1">
            <div class="accordionGuidePage__item">
              <div class="accordionGuidePage__triggerInner">
                <span class="accordionGuidePage__triggerLabel">반품 신청은 어떻게 하나요?</span>
                <AccordionTrigger />
              </div>
              <AccordionContent>
                <div class="accordionGuidePage__content">반품은 상품 수령일로부터 7일 이내에 신청 가능합니다. 마이페이지 > 주문/배송조회에서 반품 신청을 진행해 주세요.</div>
              </AccordionContent>
            </div>
          </AccordionItem>
          <AccordionItem value="q2">
            <div class="accordionGuidePage__item">
              <div class="accordionGuidePage__triggerInner">
                <span class="accordionGuidePage__triggerLabel">배송은 얼마나 걸리나요?</span>
                <AccordionTrigger />
              </div>
              <AccordionContent>
                <div class="accordionGuidePage__content">결제 완료 후 평균 1~3 영업일 내 출발합니다. 제주 및 도서 산간 지역은 추가 배송비가 발생할 수 있습니다.</div>
              </AccordionContent>
            </div>
          </AccordionItem>
          <AccordionItem value="q3">
            <div class="accordionGuidePage__item">
              <div class="accordionGuidePage__triggerInner">
                <span class="accordionGuidePage__triggerLabel">교환 신청 방법을 알려주세요.</span>
                <AccordionTrigger />
              </div>
              <AccordionContent>
                <div class="accordionGuidePage__content">교환은 상품 수령일로부터 7일 이내에 신청 가능합니다. 단순 변심에 의한 교환 시 왕복 배송비가 발생합니다.</div>
              </AccordionContent>
            </div>
          </AccordionItem>
        </Accordion>
      </div>

      <pre class="accordionGuidePage__code" v-pre><code>&lt;!-- type="multiple" → v-model:value는 string[] 배열 --&gt;
&lt;Accordion v-model:value="openItems" type="multiple"&gt;
  &lt;AccordionItem v-for="item in items" :key="item.value" :value="item.value"&gt;
    &lt;AccordionTrigger&gt;{{ item.label }}&lt;/AccordionTrigger&gt;
    &lt;AccordionContent&gt;{{ item.body }}&lt;/AccordionContent&gt;
  &lt;/AccordionItem&gt;
&lt;/Accordion&gt;</code></pre>
    </section>

    <!-- ③ disabled — Root 전체 비활성 -->
    <section class="accordionGuidePage__section">
      <h2 class="accordionGuidePage__sectionTitle">③ disabled (Root 전체 비활성)</h2>
      <p class="accordionGuidePage__note">
        <code>Accordion</code>에 <code>disabled</code> prop을 전달하면 모든 아이템의 Trigger 클릭이 차단됩니다.
        Radix Vue가 내부적으로 <code>aria-disabled</code>를 자동 처리합니다.
      </p>

      <div class="accordionGuidePage__demo">
        <Accordion type="single" disabled>
          <AccordionItem value="d1">
            <div class="accordionGuidePage__item">
              <div class="accordionGuidePage__triggerInner">
                <span class="accordionGuidePage__triggerLabel">활성 아이템</span>
                <AccordionTrigger />
              </div>
              <AccordionContent>
                <div class="accordionGuidePage__content">이 아이템은 클릭할 수 있습니다.</div>
              </AccordionContent>
            </div>
          </AccordionItem>
          <AccordionItem value="d2">
            <div class="accordionGuidePage__item">
              <div class="accordionGuidePage__triggerInner">
                <span class="accordionGuidePage__triggerLabel">비활성 아이템 (disabled)</span>
                <AccordionTrigger />
              </div>
              <AccordionContent>
                <div class="accordionGuidePage__content">이 아이템은 비활성 처리되어 있습니다.</div>
              </AccordionContent>
            </div>
          </AccordionItem>
          <AccordionItem value="d3">
            <div class="accordionGuidePage__item">
              <div class="accordionGuidePage__triggerInner">
                <span class="accordionGuidePage__triggerLabel">활성 아이템 2</span>
                <AccordionTrigger />
              </div>
              <AccordionContent>
                <div class="accordionGuidePage__content">이 아이템도 클릭할 수 있습니다.</div>
              </AccordionContent>
            </div>
          </AccordionItem>
        </Accordion>
      </div>

      <pre class="accordionGuidePage__code" v-pre><code>&lt;!-- Root disabled: 전체 아코디언 비활성 --&gt;
&lt;Accordion disabled type="single"&gt;
  &lt;AccordionItem value="item-1"&gt;
    &lt;AccordionTrigger&gt;항목&lt;/AccordionTrigger&gt;
    &lt;AccordionContent&gt;내용&lt;/AccordionContent&gt;
  &lt;/AccordionItem&gt;
&lt;/Accordion&gt;</code></pre>
    </section>

    <!-- ④ disabled — 개별 Item 비활성 -->
    <section class="accordionGuidePage__section">
      <h2 class="accordionGuidePage__sectionTitle">④ 개별 Item disabled</h2>
      <p class="accordionGuidePage__note">
        <code>AccordionItem</code>에 <code>disabled</code> prop을 전달하면 해당 아이템만 비활성 처리됩니다.
        Root의 <code>disabled</code>와 독립적으로 동작합니다.
      </p>

      <div class="accordionGuidePage__demo">
        <Accordion type="single" collapsible>
          <AccordionItem value="d1">
            <div class="accordionGuidePage__item">
              <div class="accordionGuidePage__triggerInner">
                <span class="accordionGuidePage__triggerLabel">활성 아이템</span>
                <AccordionTrigger />
              </div>
              <AccordionContent>
                <div class="accordionGuidePage__content">이 아이템은 클릭할 수 있습니다.</div>
              </AccordionContent>
            </div>
          </AccordionItem>
          <AccordionItem value="d2" :disabled="true">
            <div class="accordionGuidePage__item">
              <div class="accordionGuidePage__triggerInner">
                <span class="accordionGuidePage__triggerLabel">비활성 아이템 (disabled)</span>
                <AccordionTrigger />
              </div>
              <AccordionContent>
                <div class="accordionGuidePage__content">이 아이템은 비활성 처리되어 있습니다.</div>
              </AccordionContent>
            </div>
          </AccordionItem>
          <AccordionItem value="d3">
            <div class="accordionGuidePage__item">
              <div class="accordionGuidePage__triggerInner">
                <span class="accordionGuidePage__triggerLabel">활성 아이템 2</span>
                <AccordionTrigger />
              </div>
              <AccordionContent>
                <div class="accordionGuidePage__content">이 아이템도 클릭할 수 있습니다.</div>
              </AccordionContent>
            </div>
          </AccordionItem>
        </Accordion>
      </div>

      <pre class="accordionGuidePage__code" v-pre><code>&lt;!-- AccordionItem disabled: 해당 아이템만 비활성 --&gt;
&lt;Accordion type="single" collapsible&gt;
  &lt;AccordionItem value="item-1"&gt;
    &lt;AccordionTrigger&gt;열 수 있는 항목&lt;/AccordionTrigger&gt;
    &lt;AccordionContent&gt;내용&lt;/AccordionContent&gt;
  &lt;/AccordionItem&gt;
  &lt;AccordionItem value="item-2" :disabled="true"&gt;
    &lt;AccordionTrigger&gt;비활성 항목&lt;/AccordionTrigger&gt;
    &lt;AccordionContent&gt;내용&lt;/AccordionContent&gt;
  &lt;/AccordionItem&gt;
&lt;/Accordion&gt;</code></pre>
    </section>

    <!-- ⑤ 트리거 패턴 & 애니메이션 off -->
    <section class="accordionGuidePage__section">
      <h2 class="accordionGuidePage__sectionTitle">⑤ 트리거 패턴 & 애니메이션 off</h2>
      <p class="accordionGuidePage__note">
        <code>AccordionTrigger</code>의 <code>headTrigger</code> prop으로 두 가지 트리거 패턴을 선택합니다.<br />
        <code>headTrigger="false"</code>(기본): 우측 아이콘 버튼 자동 렌더 + 열림/닫힘 회전 애니메이션.<br />
        <code>headTrigger="true"</code>: 헤드 전체가 트리거. 슬롯에 커스텀 헤드 콘텐츠를 넣고, 아이콘 없음, 회전 애니메이션 적용 안 함.<br />
        <code>AccordionContent</code>의 <code>contentAnimation</code> prop으로 슬라이드 애니메이션을 독립 제어합니다.
      </p>

      <div class="accordionGuidePage__demoRow">
        <!-- headTrigger: false (기본) — 우측 아이콘 버튼 자동 렌더 -->
        <div class="accordionGuidePage__demoHalf">
          <p class="accordionGuidePage__demoLabel"><code>headTrigger</code> 기본(<code>false</code>) — 슬롯 없이 우측 아이콘 자동 렌더, 회전 애니메이션</p>
          <div class="accordionGuidePage__demo">
            <Accordion type="single" collapsible>
              <AccordionItem value="a1">
                <div class="accordionGuidePage__item">
                  <div class="accordionGuidePage__triggerInner">
                    <span class="accordionGuidePage__triggerLabel">첫 번째 항목</span>
                    <AccordionTrigger />
                  </div>
                  <AccordionContent>
                    <div class="accordionGuidePage__content">첫 번째 콘텐츠입니다.</div>
                  </AccordionContent>
                </div>
              </AccordionItem>
              <AccordionItem value="a2">
                <div class="accordionGuidePage__item">
                  <div class="accordionGuidePage__triggerInner">
                    <span class="accordionGuidePage__triggerLabel">두 번째 항목</span>
                    <AccordionTrigger />
                  </div>
                  <AccordionContent>
                    <div class="accordionGuidePage__content">두 번째 콘텐츠입니다.</div>
                  </AccordionContent>
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <!-- headTrigger: true — 헤드 전체 트리거 -->
        <div class="accordionGuidePage__demoHalf">
          <p class="accordionGuidePage__demoLabel"><code>:head-trigger="true"</code> — 헤드 전체 트리거, 아이콘 없음, 회전 없음</p>
          <div class="accordionGuidePage__demo">
            <Accordion type="single" collapsible>
              <AccordionItem value="b1">
                <div class="accordionGuidePage__item">
                  <AccordionTrigger :head-trigger="true">
                    <div class="accordionGuidePage__triggerInner">
                      <span class="accordionGuidePage__triggerLabel">첫 번째 항목</span>
                      <span class="accordionGuidePage__triggerSub">클릭으로 열기</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div class="accordionGuidePage__content">첫 번째 콘텐츠입니다.</div>
                  </AccordionContent>
                </div>
              </AccordionItem>
              <AccordionItem value="b2">
                <div class="accordionGuidePage__item">
                  <AccordionTrigger :head-trigger="true">
                    <div class="accordionGuidePage__triggerInner">
                      <span class="accordionGuidePage__triggerLabel">두 번째 항목</span>
                      <span class="accordionGuidePage__triggerSub">클릭으로 열기</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div class="accordionGuidePage__content">두 번째 콘텐츠입니다.</div>
                  </AccordionContent>
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      <pre class="accordionGuidePage__code" v-pre><code>&lt;!-- 기본 패턴: headTrigger="false"(기본값) — 슬롯 없이 사용 시 우측 아이콘 자동 렌더 --&gt;
&lt;AccordionItem value="item-1"&gt;
  &lt;div class="faq__head"&gt;
    &lt;span class="faq__label"&gt;항목 텍스트&lt;/span&gt;
    &lt;AccordionTrigger /&gt;  &lt;!-- 슬롯 비워두면 기본 아이콘 자동 렌더 + 회전 애니메이션 --&gt;
  &lt;/div&gt;
  &lt;AccordionContent&gt;내용&lt;/AccordionContent&gt;
&lt;/AccordionItem&gt;

&lt;!-- headTrigger 패턴: 헤드 전체가 트리거, 아이콘 없음, 회전 없음 --&gt;
&lt;AccordionItem value="item-2"&gt;
  &lt;AccordionTrigger :head-trigger="true"&gt;
    &lt;div class="myItem__head"&gt;
      &lt;span class="myItem__label"&gt;항목 타이틀&lt;/span&gt;
      &lt;span class="myItem__price"&gt;10,000원&lt;/span&gt;
    &lt;/div&gt;
  &lt;/AccordionTrigger&gt;
  &lt;AccordionContent&gt;내용&lt;/AccordionContent&gt;
&lt;/AccordionItem&gt;

&lt;!-- content 슬라이드 애니메이션 끄기 --&gt;
&lt;AccordionContent :content-animation="false"&gt;내용&lt;/AccordionContent&gt;</code></pre>
    </section>

    <!-- ⑥ Props -->
    <section class="accordionGuidePage__section">
      <h2 class="accordionGuidePage__sectionTitle">⑥ Props</h2>

      <!-- Accordion (Root) Props -->
      <h3 class="accordionGuidePage__tableTitle">Accordion (Root) Props</h3>
      <table class="accordionGuidePage__propsTable">
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
            <td><code>'single' | 'multiple'</code></td>
            <td><code>'single'</code></td>
            <td>단일/다중 열림 모드. <code>AccordionRoot</code>에 위임됩니다.</td>
          </tr>
          <tr>
            <td><code>v-model:value</code></td>
            <td><code>string | string[]</code></td>
            <td>—</td>
            <td>현재 열린 아이템 값. <code>type="multiple"</code>이면 <code>string[]</code> 배열로 바인딩합니다.</td>
          </tr>
          <tr>
            <td><code>defaultValue</code></td>
            <td><code>string | string[]</code></td>
            <td>—</td>
            <td>초기 열린 아이템 (비제어 모드). <code>v-model:value</code> 없이 초기값만 설정할 때 사용합니다.</td>
          </tr>
          <tr>
            <td><code>collapsible</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td><code>type="single"</code>에서 재클릭으로 닫기 허용. <code>type="multiple"</code>에서는 무시됩니다.</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>전체 아코디언 비활성. 모든 Trigger 클릭을 차단합니다.</td>
          </tr>
          <tr>
            <td><code>dir</code></td>
            <td><code>'ltr' | 'rtl'</code></td>
            <td><code>'ltr'</code></td>
            <td>텍스트 방향.</td>
          </tr>
          <tr>
            <td><code>orientation</code></td>
            <td><code>'vertical' | 'horizontal'</code></td>
            <td><code>'vertical'</code></td>
            <td>아코디언 방향. 화살표 키 탐색 방향에 영향을 줍니다.</td>
          </tr>
        </tbody>
      </table>

      <!-- AccordionItem Props -->
      <h3 class="accordionGuidePage__tableTitle">AccordionItem Props</h3>
      <table class="accordionGuidePage__propsTable">
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
            <td><code>value</code></td>
            <td><code>string</code></td>
            <td>필수</td>
            <td>이 아이템의 식별값. Root의 <code>v-model:value</code>와 대응됩니다.</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>이 아이템만 비활성 처리. Root의 <code>disabled</code>와 독립적으로 동작합니다.</td>
          </tr>
        </tbody>
      </table>

      <!-- AccordionTrigger Props -->
      <h3 class="accordionGuidePage__tableTitle">AccordionTrigger Props</h3>
      <table class="accordionGuidePage__propsTable">
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
            <td><code>headTrigger</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>
              트리거 패턴 선택.<br />
              <code>false</code>(기본): 우측 아이콘 버튼 자동 렌더. 슬롯이 비어있으면 기본 아이콘(<code>SmallChevronDownSvg</code>)이 렌더되고, 슬롯에 커스텀 내용을 넣으면 대체됩니다. 열림/닫힘 시 아이콘 회전 애니메이션 적용.<br />
              <code>true</code>: 헤드 전체 트리거 패턴. 슬롯에 헤드 콘텐츠 전체를 배치. 아이콘 없음, 회전 애니메이션 적용 안 함.
            </td>
          </tr>
        </tbody>
      </table>

      <!-- AccordionContent Props -->
      <h3 class="accordionGuidePage__tableTitle">AccordionContent Props</h3>
      <table class="accordionGuidePage__propsTable">
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
            <td><code>contentAnimation</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Content 슬라이드 애니메이션 on/off. <code>false</code>이면 즉시 표시/숨김으로 전환됩니다.</td>
          </tr>
        </tbody>
      </table>

      <!-- Slots -->
      <h3 class="accordionGuidePage__tableTitle">Slots</h3>
      <table class="accordionGuidePage__propsTable">
        <thead>
          <tr>
            <th>컴포넌트</th>
            <th>이름</th>
            <th>필수</th>
            <th>설명</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Accordion</code></td>
            <td><code>default</code></td>
            <td>필수</td>
            <td><code>AccordionItem</code> 컴포넌트를 직접 중첩합니다.</td>
          </tr>
          <tr>
            <td><code>AccordionItem</code></td>
            <td><code>default</code></td>
            <td>필수</td>
            <td><code>AccordionTrigger</code>와 <code>AccordionContent</code>를 배치합니다. 래퍼 div 추가 가능.</td>
          </tr>
          <tr>
            <td><code>AccordionTrigger</code></td>
            <td><code>default</code></td>
            <td>선택</td>
            <td>
              트리거 내부 콘텐츠.<br />
              <code>headTrigger="false"</code>(기본): 슬롯을 비워두면 기본 아이콘 자동 렌더. 슬롯에 커스텀 내용을 넣으면 아이콘 대신 커스텀 내용이 렌더됩니다.<br />
              <code>headTrigger="true"</code>: 슬롯에 헤드 전체 콘텐츠(텍스트, 가격, 이미지 등)를 자유롭게 구성합니다.
            </td>
          </tr>
          <tr>
            <td><code>AccordionContent</code></td>
            <td><code>default</code></td>
            <td>필수</td>
            <td>펼침 시 노출될 콘텐츠. 텍스트·이미지·다른 컴포넌트 등 제한 없음.</td>
          </tr>
        </tbody>
      </table>

      <!-- Events -->
      <h3 class="accordionGuidePage__tableTitle">Events</h3>
      <table class="accordionGuidePage__propsTable">
        <thead>
          <tr>
            <th>컴포넌트</th>
            <th>이름</th>
            <th>페이로드</th>
            <th>설명</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Accordion</code></td>
            <td><code>update:modelValue</code></td>
            <td><code>string | string[]</code></td>
            <td>
              열린 아이템 변경 시 발생. <code>v-model:value</code>로 바인딩하거나
              <code>@update:modelValue</code>로 직접 수신 가능. <code>type="multiple"</code>이면 배열로 전달됩니다.
            </td>
          </tr>
        </tbody>
      </table>

      <p class="accordionGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는 <code>v-bind="$attrs"</code>를 사용하며 attrs를 두 곳으로
        분배합니다.<br />
        <strong>1단계 (AccordionRoot)</strong>: <code>type</code>, <code>value</code>, <code>defaultValue</code>,
        <code>collapsible</code>, <code>disabled</code>, <code>dir</code>, <code>orientation</code> 등 Root 전용 props가
        자동 위임됩니다.<br />
        <strong>2단계 (AccordionTrigger)</strong>: <code>AccordionTrigger</code> 컴포넌트 자체가
        <code>defineOptions({ inheritAttrs: false })</code> + <code>v-bind="$attrs"</code>를 적용하므로,
        <code>aria-label</code>, <code>aria-describedby</code>, <code>tabindex</code>, <code>data-*</code> 등
        인터랙티브 attrs를 <code>AccordionTrigger</code>에 직접 전달할 수 있습니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>

      <p class="accordionGuidePage__radixNote">
        이 컴포넌트는 <strong>Radix Vue</strong>를 기반으로 합니다. 위 Props 외에도 Radix Vue가 지원하는 추가 props를
        사용할 수 있습니다. 전체 API는
        <a href="https://www.radix-vue.com/components/accordion" target="_blank" rel="noopener noreferrer"
          >radix-vue.com 공식 문서 (Accordion)</a
        >
        또는 Context7 MCP(<code>mcp__context7__query-docs</code>)를 통해 확인하세요.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@nd/components/molecules'

  definePageMeta({ layout: 'guide' })

  // ── ① single controlled
  const singleOpenItem = ref('')

  // ── ② multiple controlled
  const multipleOpenItems = ref<string[]>([])
</script>

<style lang="scss" scoped>
  $b: 'accordionGuidePage';

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
      padding: $spacing-lg;
      background-color: $bg-secondary;
      border-radius: $radius-md;
      border: 1px solid $line-200;
    }

    &__demoRow {
      display: flex;
      gap: $spacing-lg;
    }

    &__demoHalf {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
      flex: 1;
      min-width: 0;
    }

    &__demoLabel {
      margin: 0;
      font-size: $font-size-body3;
      color: $text-600;
    }

    &__stateRow {
      display: flex;
      align-items: center;
      padding-bottom: $spacing-sm;
      margin-bottom: $spacing-sm;
      border-bottom: 1px solid $line-200;
    }

    &__stateLabel {
      font-size: $font-size-body3;
      color: $text-600;
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

    // ── 아코디언 아이템 스타일 (데모용) ─────────────────────

    &__item {
      border-bottom: 1px solid $line-200;
    }

    &__triggerInner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: $spacing-md $spacing-lg;
    }

    &__triggerLabel {
      font-size: $font-size-body2;
      font-weight: $font-weight-medium;
      color: $text-900;
    }

    &__triggerSub {
      font-size: $font-size-body3;
      color: $text-400;
    }

    &__arrow {
      display: flex;
      font-size: $font-size-caption1;
      color: $text-600;
      transition: transform $duration-fast ease;
    }

    &__content {
      padding: $spacing-md $spacing-lg;
      font-size: $font-size-body3;
      color: $text-700;
      line-height: $line-height-base;
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
      border-left: 3px solid $line-200;
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
