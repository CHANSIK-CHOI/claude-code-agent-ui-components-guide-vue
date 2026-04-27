<template>
  <div class="ButtonLinkGuidePage">
    <!-- 헤더 -->
    <header class="ButtonLinkGuidePage__header">
      <div class="ButtonLinkGuidePage__meta">
        <span class="ButtonLinkGuidePage__badge">atoms</span>
      </div>
      <h1 class="ButtonLinkGuidePage__title">ButtonLink</h1>
      <p class="ButtonLinkGuidePage__desc">
        링크(<code>&lt;a&gt;</code> / <code>&lt;NuxtLink&gt;</code>) 기반의 버튼 스타일 컴포넌트.<br />
        <code>to</code> prop으로 내부 라우팅, <code>href</code> prop으로 외부 URL 이동.
      </p>
    </header>

    <div class="ButtonLinkGuidePage__designRef">
      <strong>디자인 variant</strong>(color · shape · size · round) 및 icon slots 시각 예시는
      <code>Button</code>과 동일합니다.
      <NuxtLink to="/guide/button" class="ButtonLinkGuidePage__designRefLink">Button 가이드</NuxtLink>를
      참고해주세요.
    </div>

    <!-- ① Disabled -->
    <section class="ButtonLinkGuidePage__section">
      <h2 class="ButtonLinkGuidePage__sectionTitle">① Disabled</h2>
      <p class="ButtonLinkGuidePage__note">
        <code>&lt;a&gt;</code>에는 네이티브 <code>disabled</code>가 없으므로
        <code>aria-disabled="true"</code> + <code>tabindex="-1"</code> + <code>pointer-events: none</code>으로 처리합니다.
        Button의 네이티브 <code>disabled</code> 속성과 달리, 링크 탐색을 JavaScript 없이 CSS 레벨에서 차단합니다.
      </p>
    </section>

    <!-- ② NuxtLink vs href -->
    <section class="ButtonLinkGuidePage__section">
      <h2 class="ButtonLinkGuidePage__sectionTitle">② NuxtLink vs href</h2>
      <p class="ButtonLinkGuidePage__note">
        <code>to</code> prop → 내부 라우팅 (<code>&lt;NuxtLink&gt;</code> 렌더링).
        <code>href</code> prop → 외부 URL (<code>&lt;a&gt;</code> 렌더링).
        둘 다 지정 시 <code>to</code>가 우선합니다.
      </p>
      <div class="ButtonLinkGuidePage__row">
        <!-- NuxtLink (to) -->
        <div class="ButtonLinkGuidePage__item">
          <span class="ButtonLinkGuidePage__itemLabel">
            to prop — 내부 페이지 이동
          </span>
          <ButtonLink to="/guide/button">Button 가이드로 이동</ButtonLink>
          <pre class="ButtonLinkGuidePage__code"><code>&lt;!-- NuxtLink로 렌더링 — client-side navigation --&gt;
&lt;ButtonLink to="/guide/button"&gt;
  Button 가이드로 이동
&lt;/ButtonLink&gt;</code></pre>
        </div>

        <!-- href (외부) -->
        <div class="ButtonLinkGuidePage__item">
          <span class="ButtonLinkGuidePage__itemLabel">
            href prop — 외부 URL 이동
          </span>
          <ButtonLink href="https://example.com" shape="line">
            example.com 방문
          </ButtonLink>
          <pre class="ButtonLinkGuidePage__code"><code>&lt;!-- &lt;a&gt;로 렌더링 --&gt;
&lt;ButtonLink href="https://example.com" shape="line"&gt;
  example.com 방문
&lt;/ButtonLink&gt;</code></pre>
        </div>

        <!-- disabled (링크 없음) -->
        <div class="ButtonLinkGuidePage__item">
          <span class="ButtonLinkGuidePage__itemLabel">
            disabled — to/href 있어도 탐색 차단
          </span>
          <ButtonLink to="/guide/button" :disabled="true">
            이동 불가
          </ButtonLink>
          <pre class="ButtonLinkGuidePage__code"><code>&lt;!-- disabled 시 NuxtLink 미사용 → &lt;a aria-disabled="true" tabindex="-1"&gt; --&gt;
&lt;ButtonLink to="/guide/button" :disabled="true"&gt;
  이동 불가
&lt;/ButtonLink&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- ③ target="_blank" -->
    <section class="ButtonLinkGuidePage__section">
      <h2 class="ButtonLinkGuidePage__sectionTitle">③ target="_blank" 자동 보안 처리</h2>
      <p class="ButtonLinkGuidePage__note">
        <code>target="_blank"</code> 지정 시 <code>rel</code>에 <code>noopener noreferrer</code>가
        없으면 자동으로 추가됩니다. 탭나이핑(tabnabbing) 보안 취약점을 방어합니다.
      </p>
      <div class="ButtonLinkGuidePage__row">
        <!-- rel 미지정 → 자동 추가 -->
        <div class="ButtonLinkGuidePage__item">
          <span class="ButtonLinkGuidePage__itemLabel">
            rel 미지정 → noopener noreferrer 자동 추가
          </span>
          <ButtonLink
            href="https://example.com"
            target="_blank"
          >
            새 탭에서 열기
          </ButtonLink>
          <pre class="ButtonLinkGuidePage__code"><code>&lt;!-- 렌더링 결과: rel="noopener noreferrer" 자동 추가 --&gt;
&lt;ButtonLink href="https://example.com" target="_blank"&gt;
  새 탭에서 열기
&lt;/ButtonLink&gt;
&lt;!-- → &lt;a href="https://example.com" target="_blank" rel="noopener noreferrer"&gt; --&gt;</code></pre>
        </div>

        <!-- rel 일부 지정 → 나머지 보완 -->
        <div class="ButtonLinkGuidePage__item">
          <span class="ButtonLinkGuidePage__itemLabel">
            rel 일부 지정 → 누락분만 보완
          </span>
          <ButtonLink
            href="https://example.com"
            target="_blank"
            rel="noopener"
          >
            새 탭 (noopener만 지정)
          </ButtonLink>
          <pre class="ButtonLinkGuidePage__code"><code>&lt;!-- rel="noopener"만 있으면 "noreferrer" 추가 --&gt;
&lt;ButtonLink
  href="https://example.com"
  target="_blank"
  rel="noopener"
&gt;
  새 탭 (noopener만 지정)
&lt;/ButtonLink&gt;
&lt;!-- → rel="noopener noreferrer" --&gt;</code></pre>
        </div>

        <!-- target="_self" → rel 변경 없음 -->
        <div class="ButtonLinkGuidePage__item">
          <span class="ButtonLinkGuidePage__itemLabel">
            target="_self" (기본값) → rel 변경 없음
          </span>
          <ButtonLink href="https://example.com" shape="line">
            같은 탭에서 열기 (기본값)
          </ButtonLink>
          <pre class="ButtonLinkGuidePage__code"><code>&lt;!-- target="_self"(기본)이면 rel 자동 추가 없음 --&gt;
&lt;ButtonLink href="https://example.com"&gt;
  같은 탭에서 열기 (기본값)
&lt;/ButtonLink&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- ④ API 문서 -->
    <section class="ButtonLinkGuidePage__section">
      <h2 class="ButtonLinkGuidePage__sectionTitle">④ API 문서</h2>

      <h3 class="ButtonLinkGuidePage__tableTitle">Props</h3>
      <table class="ButtonLinkGuidePage__propsTable">
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
            <td><code>shape</code></td>
            <td><code>'solid' | 'line' | 'text'</code></td>
            <td><code>'solid'</code></td>
            <td>버튼 외형 스타일</td>
          </tr>
          <tr>
            <td><code>color</code></td>
            <td><code>'primary' | 'secondary' | 'black'</code></td>
            <td><code>'primary'</code></td>
            <td>버튼 색상</td>
          </tr>
          <tr>
            <td><code>size</code></td>
            <td><code>'sm' | 'md' | 'lg'</code></td>
            <td><code>'md'</code></td>
            <td>버튼 크기</td>
          </tr>
          <tr>
            <td><code>round</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>pill 형태 모서리. shape="text"에서는 무시됨</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>비활성 상태. aria-disabled + tabindex=-1 + pointer-events: none 적용</td>
          </tr>
          <tr>
            <td><code>to</code></td>
            <td><code>string | object | undefined</code></td>
            <td><code>undefined</code></td>
            <td>내부 라우트. NuxtLink로 렌더링. href보다 우선</td>
          </tr>
          <tr>
            <td><code>href</code></td>
            <td><code>string | undefined</code></td>
            <td><code>undefined</code></td>
            <td>외부 URL. &lt;a&gt;로 렌더링</td>
          </tr>
          <tr>
            <td><code>target</code></td>
            <td><code>'_self' | '_blank' | '_parent' | '_top'</code></td>
            <td><code>'_self'</code></td>
            <td>링크 열기 방식</td>
          </tr>
          <tr>
            <td><code>rel</code></td>
            <td><code>string | undefined</code></td>
            <td><code>undefined</code></td>
            <td>rel 속성. target="_blank" 시 noopener noreferrer 자동 보완</td>
          </tr>
        </tbody>
      </table>

      <h3 class="ButtonLinkGuidePage__tableTitle">Slots</h3>
      <table class="ButtonLinkGuidePage__propsTable">
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
            <td>필수</td>
            <td>라벨 텍스트</td>
          </tr>
          <tr>
            <td><code>leading-icon</code></td>
            <td>선택</td>
            <td>라벨 앞에 위치하는 아이콘</td>
          </tr>
          <tr>
            <td><code>trailing-icon</code></td>
            <td>선택</td>
            <td>라벨 뒤에 위치하는 아이콘</td>
          </tr>
        </tbody>
      </table>

      <p class="ButtonLinkGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는 <code>v-bind="$attrs"</code>를 사용하므로
        위 Props 외에도 <code>&lt;a&gt;</code> / <code>&lt;NuxtLink&gt;</code> 요소의 모든 네이티브 HTML 속성
        (<code>aria-label</code>, <code>data-*</code> 등)을 그대로 전달할 수 있습니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "guide" });
</script>

<style lang="scss" scoped src="./button-link.scss"></style>
