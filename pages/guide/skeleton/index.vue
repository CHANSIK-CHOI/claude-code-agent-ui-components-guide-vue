<template>
  <div class="skeletonGuidePage">
    <!-- 헤더 -->
    <header class="skeletonGuidePage__header">
      <div class="skeletonGuidePage__meta">
        <span class="skeletonGuidePage__badge">globals</span>
      </div>
      <h1 class="skeletonGuidePage__title">Skeleton</h1>
      <p class="skeletonGuidePage__desc">
        콘텐츠 로딩 전 shimmer 애니메이션을 표시하는 전역 CSS 유틸 클래스.<br />
        Vue 컴포넌트가 아닌 <code>.skeleton</code> 클래스 하나로, 모든 HTML 요소에 붙여 사용합니다.<br />
        <code>assets/scss/global.scss</code>에 정의되어 있으며 별도 import 없이 어디서나 사용 가능합니다.
      </p>
    </header>

    <!-- ① 소개 -->
    <section class="skeletonGuidePage__section">
      <h2 class="skeletonGuidePage__sectionTitle">① 소개</h2>
      <p class="skeletonGuidePage__note">
        <code>.skeleton</code>은 전역 CSS 유틸 클래스입니다. Vue 컴포넌트가 아니므로 import가 필요 없으며,
        <code>div</code>, <code>img</code>, <code>span</code> 등 모든 HTML 요소에 클래스만 추가하면 됩니다.<br />
        배경은 <code>$bg-secondary</code>(#F6F7F9, 밝은 회색) + <code>$bg-primary</code>(#FFFFFF, 흰색 하이라이트)
        그라디언트가 좌에서 우로 흐르는 shimmer 애니메이션을 1.5초 주기로 무한 반복합니다.
      </p>
      <pre class="skeletonGuidePage__code"><code>/* assets/scss/global.scss */
@keyframes skeletonShimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton {
  background: linear-gradient(90deg, $bg-secondary 25%, $bg-primary 50%, $bg-secondary 75%);
  background-size: 200% 100%;
  animation: skeletonShimmer 1.5s infinite;
}</code></pre>
    </section>

    <!-- ② 기본 데모 -->
    <section class="skeletonGuidePage__section">
      <h2 class="skeletonGuidePage__sectionTitle">② 기본 데모</h2>
      <p class="skeletonGuidePage__note">실제 shimmer 애니메이션이 적용된 다양한 형태의 skeleton 예시입니다.</p>

      <!-- 텍스트 줄 형태 -->
      <span class="skeletonGuidePage__demoLabel">텍스트 줄 형태</span>
      <div class="skeletonGuidePage__demoBox">
        <div class="skeletonGuidePage__textLine skeleton" />
        <div class="skeletonGuidePage__textLine skeletonGuidePage__textLine--short skeleton" />
        <div class="skeletonGuidePage__textLine skeletonGuidePage__textLine--shorter skeleton" />
      </div>
      <pre class="skeletonGuidePage__code"><code>&lt;div class="myBlock__line skeleton" /&gt;
&lt;!-- SCSS --&gt;
.myBlock__line {
  width: 100%;
  height: 1.6rem;
  border-radius: $radius-sm;
  margin-bottom: $spacing-sm;
}</code></pre>

      <!-- 이미지 카드 형태 -->
      <span class="skeletonGuidePage__demoLabel">이미지 카드 형태 (1:1 비율)</span>
      <div class="skeletonGuidePage__demoBox skeletonGuidePage__demoBox--card">
        <div class="skeletonGuidePage__card skeleton" />
      </div>
      <pre class="skeletonGuidePage__code"><code>&lt;div class="myBlock__imgPlaceholder skeleton" /&gt;
&lt;!-- SCSS --&gt;
.myBlock__imgPlaceholder {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: $radius-md;
}</code></pre>

      <!-- 히어로 배너 형태 -->
      <span class="skeletonGuidePage__demoLabel">히어로 배너 형태 (9:14 비율)</span>
      <div class="skeletonGuidePage__demoBox">
        <div class="skeletonGuidePage__hero skeleton" />
      </div>
      <pre class="skeletonGuidePage__code"><code>&lt;div class="myBlock__placeholder skeleton" /&gt;
&lt;!-- SCSS --&gt;
.myBlock__placeholder {
  width: 100%;
  aspect-ratio: 9 / 14;
}</code></pre>
    </section>

    <!-- ③ ClientOnly 패턴 -->
    <section class="skeletonGuidePage__section">
      <h2 class="skeletonGuidePage__sectionTitle">③ ClientOnly 패턴</h2>
      <p class="skeletonGuidePage__note">
        Swiper 등 SSR을 지원하지 않는 컴포넌트를 <code>&lt;ClientOnly&gt;</code>로 감쌀 때,
        <code>#fallback</code> 슬롯에 <code>.skeleton</code>을 사용해 SSR 중에도 레이아웃이 깨지지 않게 합니다.
      </p>
      <pre class="skeletonGuidePage__code"><code>&lt;!-- MainHero.vue --&gt;
&lt;ClientOnly&gt;
  &lt;Swiper ...&gt;...&lt;/Swiper&gt;
  &lt;template #fallback&gt;
    &lt;div class="mainHero__placeholder skeleton" /&gt;
  &lt;/template&gt;
&lt;/ClientOnly&gt;

&lt;!-- main-hero.scss --&gt;
.mainHero__placeholder {
  aspect-ratio: 9 / 14;
  width: 100%;
  /* .skeleton 클래스가 배경·애니메이션 처리 */
}</code></pre>
      <p class="skeletonGuidePage__infoNote">
        <strong>왜 ClientOnly + fallback 인가</strong>: Swiper는 브라우저 DOM API에 의존하므로 Nuxt SSR 중 렌더링할 수
        없습니다. <code>&lt;ClientOnly&gt;</code>는 서버에서 <code>#fallback</code>을, 클라이언트에서 실제 슬롯을
        렌더링합니다. <code>.skeleton</code>을 fallback으로 두면 서버 HTML에 레이아웃 자리가 잡혀 CLS(Cumulative Layout
        Shift)를 줄일 수 있습니다.
      </p>
    </section>

    <!-- ④ 사용 방법 -->
    <section class="skeletonGuidePage__section">
      <h2 class="skeletonGuidePage__sectionTitle">④ 사용 방법</h2>
      <p class="skeletonGuidePage__note">
        HTML에 <code>.skeleton</code> 클래스를 추가하고, SCSS에서 크기(<code>width</code> / <code>height</code> /
        <code>aspect-ratio</code>)와 <code>border-radius</code>만 지정하면 됩니다.
      </p>
      <pre class="skeletonGuidePage__code"><code>&lt;!-- HTML: skeleton 클래스만 추가 --&gt;
&lt;div class="mySection__imgPlaceholder skeleton" /&gt;

&lt;!-- SCSS: 크기·비율·반경만 설정 --&gt;
&amp;__imgPlaceholder {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: $radius-md;
}</code></pre>
      <p class="skeletonGuidePage__note">
        <code>background</code>, <code>background-size</code>, <code>animation</code> 속성은 <code>.skeleton</code>이
        제공하므로 SCSS에 중복 선언하지 않습니다.
      </p>
    </section>

    <!-- ⑤ API -->
    <section class="skeletonGuidePage__section">
      <h2 class="skeletonGuidePage__sectionTitle">⑤ API</h2>
      <p class="skeletonGuidePage__note">
        Skeleton은 Vue 컴포넌트가 아닌 CSS 클래스입니다. Props / Slots / Events 대신 클래스 API로 정의합니다.
      </p>

      <h3 class="skeletonGuidePage__tableTitle">클래스 API</h3>
      <div class="skeletonGuidePage__propsTableWrap">
        <table class="skeletonGuidePage__propsTable">
          <thead>
            <tr>
              <th>클래스명</th>
              <th>역할</th>
              <th>사용 위치</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>.skeleton</code></td>
              <td>shimmer 그라디언트 + skeletonShimmer 애니메이션 적용</td>
              <td>모든 HTML 요소 (<code>div</code>, <code>span</code>, <code>img</code> 등)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="skeletonGuidePage__tableTitle">SCSS에서 함께 지정해야 하는 속성</h3>
      <div class="skeletonGuidePage__propsTableWrap">
        <table class="skeletonGuidePage__propsTable">
          <thead>
            <tr>
              <th>속성</th>
              <th>필수 여부</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>width</code></td>
              <td>필수</td>
              <td>요소 너비. 보통 <code>100%</code> 또는 고정 값</td>
            </tr>
            <tr>
              <td><code>height</code> 또는 <code>aspect-ratio</code></td>
              <td>둘 중 하나 필수</td>
              <td>요소 높이. 텍스트 줄은 <code>height</code>, 이미지/배너는 <code>aspect-ratio</code> 권장</td>
            </tr>
            <tr>
              <td><code>border-radius</code></td>
              <td>선택</td>
              <td>모서리 둥글기. 이미지 카드는 <code>$radius-md</code>, 텍스트 줄은 <code>$radius-sm</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="skeletonGuidePage__infoNote">
        <strong>전역 적용 방식</strong>: <code>.skeleton</code>은 <code>assets/scss/global.scss</code>에
        정의되어 <code>nuxt.config.ts</code>의 <code>css: []</code> 배열로 전역 로드됩니다. 별도
        <code>import</code> 없이 모든 Vue SFC·페이지에서 바로 사용할 수 있습니다.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ layout: 'guide' });
</script>

<style lang="scss" scoped src="./skeleton.scss"></style>
