<template>
  <div class="buttonGroupGuidePage">
    <!-- 헤더 -->
    <header class="buttonGroupGuidePage__header">
      <div class="buttonGroupGuidePage__meta">
        <span class="buttonGroupGuidePage__badge">molecules</span>
      </div>
      <h1 class="buttonGroupGuidePage__title">ButtonGroup</h1>
      <p class="buttonGroupGuidePage__desc">
        Button(또는 ButtonLink)을 여러 개 받아 수평 정렬하는 레이아웃 전용 컴포넌트.<br />
        균등 분할(50/50)이 기본이며, <code>narrowFirst</code> prop으로 첫 번째 버튼을 좁게 배치하는 비대칭 레이아웃으로 전환.
      </p>
    </header>

    <!-- ① 기본 (균등 50/50) -->
    <section class="buttonGroupGuidePage__section">
      <h2 class="buttonGroupGuidePage__sectionTitle">① 기본 (균등 50/50)</h2>
      <p class="buttonGroupGuidePage__note">버튼 2개가 균등하게 너비를 나눕니다. narrowFirst 미적용 상태.</p>

      <div class="buttonGroupGuidePage__demo">
        <ButtonGroup>
          <Button shape="solid" color="gray" size="lg" @click="() => {}">닫기</Button>
          <Button shape="solid" color="primary" size="lg" @click="() => {}">확인</Button>
        </ButtonGroup>
      </div>
      <pre class="buttonGroupGuidePage__code"><code>&lt;ButtonGroup&gt;
  &lt;Button shape="solid" color="gray" size="lg"&gt;닫기&lt;/Button&gt;
  &lt;Button shape="solid" color="primary" size="lg"&gt;확인&lt;/Button&gt;
&lt;/ButtonGroup&gt;</code></pre>
    </section>

    <!-- ② narrowFirst (취소 좁게 + 확인 넓게) -->
    <section class="buttonGroupGuidePage__section">
      <h2 class="buttonGroupGuidePage__sectionTitle">② narrowFirst (취소 좁게 + 확인 넓게)</h2>
      <p class="buttonGroupGuidePage__note">
        <code>:narrow-first="true"</code> 적용 시 첫 번째 버튼이 좁아집니다 (max-width: 12rem).
        팝업 하단 "취소 / 확인" 패턴에 사용합니다.
      </p>

      <div class="buttonGroupGuidePage__demo">
        <ButtonGroup :narrow-first="true">
          <Button shape="solid" color="gray" size="lg" @click="() => {}">취소</Button>
          <Button shape="solid" color="primary" size="lg" @click="() => {}">확인</Button>
        </ButtonGroup>
      </div>
      <pre class="buttonGroupGuidePage__code"><code>&lt;ButtonGroup :narrow-first="true"&gt;
  &lt;Button shape="solid" color="gray" size="lg"&gt;취소&lt;/Button&gt;
  &lt;Button shape="solid" color="primary" size="lg"&gt;확인&lt;/Button&gt;
&lt;/ButtonGroup&gt;</code></pre>
    </section>

    <!-- ③ narrowFirst + 래퍼 컴포넌트 (Tooltip) -->
    <section class="buttonGroupGuidePage__section">
      <h2 class="buttonGroupGuidePage__sectionTitle">③ narrowFirst + 래퍼 컴포넌트 (Tooltip)</h2>
      <p class="buttonGroupGuidePage__note">
        <code>narrowFirst</code> 활성 시 2번째 슬롯에 Button/ButtonLink가 아닌 <code>Tooltip</code> 같은 래퍼 컴포넌트가 오더라도
        버튼이 올바르게 너비를 채웁니다.<br />
        내부적으로 <code>:nth-child(2):not(button, a)</code>의 직접 자식에 <code>flex: 1; min-width: 0</code>을 적용해
        래퍼 div가 수축하지 않도록 처리합니다.
      </p>

      <div class="buttonGroupGuidePage__demo">
        <ButtonGroup :narrow-first="true">
          <Button shape="solid" color="secondary" size="lg" @click="() => {}">선물하기</Button>
          <Tooltip
            text="구독 시 최대 N% 할인된 가격으로 구매가능해요"
            color="dark"
            side="top"
            arrow-align="right"
            :always-open="true"
          >
            <template #trigger>
              <Button shape="solid" color="primary" size="lg" @click="() => {}">구매하기</Button>
            </template>
          </Tooltip>
        </ButtonGroup>
      </div>
      <pre class="buttonGroupGuidePage__code"><code>&lt;ButtonGroup :narrow-first="true"&gt;
  &lt;Button shape="solid" color="secondary" size="lg"&gt;선물하기&lt;/Button&gt;
  &lt;Tooltip
    text="구독 시 최대 N% 할인된 가격으로 구매가능해요"
    color="dark"
    side="top"
    arrow-align="right"
    :always-open="true"
  &gt;
    &lt;template #trigger&gt;
      &lt;Button shape="solid" color="primary" size="lg"&gt;구매하기&lt;/Button&gt;
    &lt;/template&gt;
  &lt;/Tooltip&gt;
&lt;/ButtonGroup&gt;</code></pre>
    </section>

    <!-- ④ 다양한 Button variant 조합 -->
    <section class="buttonGroupGuidePage__section">
      <h2 class="buttonGroupGuidePage__sectionTitle">④ 다양한 Button variant 조합</h2>
      <p class="buttonGroupGuidePage__note">
        solid/gray + solid/primary 조합이 팝업에서 가장 일반적으로 사용되는 패턴입니다.
      </p>

      <div class="buttonGroupGuidePage__item">
        <span class="buttonGroupGuidePage__itemLabel">solid/gray + solid/primary (기본 팝업 패턴)</span>
        <div class="buttonGroupGuidePage__demo">
          <ButtonGroup>
            <Button shape="solid" color="gray" size="lg" @click="() => {}">취소</Button>
            <Button shape="solid" color="primary" size="lg" @click="() => {}">확인</Button>
          </ButtonGroup>
        </div>
      </div>

      <div class="buttonGroupGuidePage__item">
        <span class="buttonGroupGuidePage__itemLabel">line/primary + solid/primary</span>
        <div class="buttonGroupGuidePage__demo">
          <ButtonGroup>
            <Button shape="line" color="primary" size="lg" @click="() => {}">장바구니 담기</Button>
            <Button shape="solid" color="primary" size="lg" @click="() => {}">바로 구매</Button>
          </ButtonGroup>
        </div>
      </div>

      <div class="buttonGroupGuidePage__item">
        <span class="buttonGroupGuidePage__itemLabel">solid/gray + solid/primary (narrowFirst)</span>
        <div class="buttonGroupGuidePage__demo">
          <ButtonGroup :narrow-first="true">
            <Button shape="solid" color="gray" size="lg" @click="() => {}">취소</Button>
            <Button shape="solid" color="primary" size="lg" @click="() => {}">확인</Button>
          </ButtonGroup>
        </div>
      </div>
    </section>

    <!-- ⑤ Props 참조 -->
    <section class="buttonGroupGuidePage__section">
      <h2 class="buttonGroupGuidePage__sectionTitle">⑤ Props</h2>

      <h3 class="buttonGroupGuidePage__tableTitle">Props</h3>
      <div class="buttonGroupGuidePage__propsTableWrap">
        <table class="buttonGroupGuidePage__propsTable">
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
              <td><code>narrowFirst</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>
                true 시 첫 번째 자식이 좁아짐 (flex: 120, max-width: 12rem),
                두 번째 자식이 넓어짐 (flex: 200). 3개 이상 시 세 번째부터는 flex: 1 균등 배분.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="buttonGroupGuidePage__tableTitle">Slots</h3>
      <div class="buttonGroupGuidePage__propsTableWrap">
        <table class="buttonGroupGuidePage__propsTable">
          <thead>
            <tr>
              <th>이름</th>
              <th>필수</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>default</code></td>
              <td>권장</td>
              <td>Button 또는 ButtonLink 요소들을 직접, 또는 Tooltip 같은 래퍼 컴포넌트에 감싸서 전달. CSS :first-child / :nth-child 선택자로 비율을 제어하므로 직접 자식 요소여야 합니다.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="buttonGroupGuidePage__tableTitle">Events</h3>
      <div class="buttonGroupGuidePage__propsTableWrap">
        <table class="buttonGroupGuidePage__propsTable">
          <thead>
            <tr>
              <th>이름</th>
              <th>페이로드</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="3" class="buttonGroupGuidePage__emptyCell">
                ButtonGroup은 레이아웃 전용 컴포넌트입니다. 이벤트를 발생시키지 않으며,
                클릭 이벤트는 슬롯으로 전달된 Button이 직접 처리합니다.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="buttonGroupGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는 <code>v-bind="$attrs"</code>를 사용하므로
        위 Props 외에도 컨테이너 <code>&lt;div&gt;</code> 요소에
        <code>class</code>, <code>id</code>, <code>data-*</code> 등의 속성을 그대로 전달할 수 있습니다.
        필요 시 <code>aria-label</code>도 추가 가능합니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ layout: 'guide' })
</script>

<style lang="scss" scoped src="./buttonGroup.scss"></style>
