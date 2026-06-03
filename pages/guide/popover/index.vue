<template>
  <div class="popoverGuidePage">
    <!-- 헤더 -->
    <header class="popoverGuidePage__header">
      <div class="popoverGuidePage__meta">
        <span class="popoverGuidePage__badge">atoms</span>
      </div>
      <h1 class="popoverGuidePage__title">Popover</h1>
      <p class="popoverGuidePage__desc">
        정보 보충이 필요한 UI 요소 옆에 배치하는 <strong>클릭형 팝오버 패널</strong> 컴포넌트입니다.<br />
        트리거 버튼 클릭 시 버튼 바로 아래에 패널이 열리며, 패널은 항상 화면 좌측 끝에서 시작해 전체 너비를 채웁니다.<br />
        내부적으로 <strong>Radix Vue Popover</strong>를 사용하며, 기본적으로 Portal 없이 트리거 DOM 인접 위치에 인라인 렌더링합니다. <code>:portal="true"</code>를 지정하면 PopoverPortal이 활성화됩니다.<br />
        키보드 탐색, 포커스 복귀, Escape 닫기, ARIA 처리를 자동으로 지원합니다.
      </p>
    </header>

    <!-- ① 기본 사용법 (title + 본문) -->
    <section class="popoverGuidePage__section">
      <h2 class="popoverGuidePage__sectionTitle">① 기본 사용법 (title + 본문)</h2>
      <p class="popoverGuidePage__note">
        <code>title</code> prop을 전달하면 패널 상단에 제목 행이 렌더됩니다.<br />
        <code>#trigger</code> 슬롯에 트리거 버튼을, 기본 슬롯에 본문 콘텐츠를 삽입합니다.
      </p>

      <div class="popoverGuidePage__group">
        <div class="popoverGuidePage__demo">
          <Popover title="구독회원 혜택가 안내">
            <template #trigger>
              <button type="button" aria-label="구독 혜택 안내">
                <Icon size="sm"><TooltipSvg /></Icon>
              </button>
            </template>
            상품 정기구독을 결제완료한 회원님에게 단품 50% 혜택 쿠폰을 제공합니다.
          </Popover>
        </div>
      </div>

      <pre class="popoverGuidePage__code"><code>&lt;Popover title="구독회원 혜택가 안내"&gt;
  &lt;template #trigger&gt;
    &lt;button type="button" aria-label="구독 혜택 안내"&gt;
      &lt;Icon size="sm"&gt;&lt;TooltipSvg /&gt;&lt;/Icon&gt;
    &lt;/button&gt;
  &lt;/template&gt;
  상품 정기구독을 결제완료한 회원님에게 단품 50% 혜택 쿠폰을 제공합니다.
&lt;/Popover&gt;</code></pre>
    </section>

    <!-- ② title 없는 경우 (닫기 버튼만) -->
    <section class="popoverGuidePage__section">
      <h2 class="popoverGuidePage__sectionTitle">② title 없는 경우</h2>
      <p class="popoverGuidePage__note">
        <code>title</code> prop을 생략하면 패널 헤더 행이 렌더되지 않습니다.<br />
        닫기(X) 버튼은 패널 우측 상단에 독립 배치됩니다.
      </p>

      <div class="popoverGuidePage__group">
        <div class="popoverGuidePage__demo">
          <Popover>
            <template #trigger>
              <button type="button" aria-label="배송 안내">
                <Icon size="sm"><TooltipSvg /></Icon>
              </button>
            </template>
            단건 배송: 자사 브랜드 7%, 제휴 브랜드 15% 할인 적용
          </Popover>
        </div>
      </div>

      <pre class="popoverGuidePage__code"><code>&lt;Popover&gt;
  &lt;template #trigger&gt;
    &lt;button type="button" aria-label="배송 안내"&gt;
      &lt;Icon size="sm"&gt;&lt;TooltipSvg /&gt;&lt;/Icon&gt;
    &lt;/button&gt;
  &lt;/template&gt;
  단건 배송: 자사 브랜드 7%, 제휴 브랜드 15% 할인 적용
&lt;/Popover&gt;</code></pre>
    </section>

    <!-- ③ v-model:open 외부 제어 모드 -->
    <section class="popoverGuidePage__section">
      <h2 class="popoverGuidePage__sectionTitle">③ v-model:open 외부 제어 모드</h2>
      <p class="popoverGuidePage__note">
        <code>v-model:open</code>을 사용하면 부모 컴포넌트에서 패널 열림 상태를 직접 제어할 수 있습니다.<br />
        React의 <code>controlled component</code> 패턴과 동일합니다.<br />
        <code>open</code> prop이 있으면 제어 모드, 없으면 내부 상태로 비제어 모드로 동작합니다.<br />
        <strong>중요:</strong> 외부 닫기 버튼은 반드시 <code>PopoverTrigger</code> DOM 외부에 배치해야
        열고 닫기가 정상 작동합니다. Trigger 내부에 배치하면 Radix가 트리거 클릭으로 인식해
        닫히자마자 즉시 다시 열리는 버그가 발생합니다.
      </p>

      <div class="popoverGuidePage__group">
        <!-- Popover와 외부 버튼을 분리 배치 — 닫기 버튼은 PopoverTrigger DOM 외부에 있어야 함 -->
        <div class="popoverGuidePage__controlRow">
          <Popover v-model:open="isPopoverOpen" title="외부 제어 모드">
            <template #trigger>
              <button type="button" aria-label="안내 열기">
                <Icon size="sm"><TooltipSvg /></Icon>
              </button>
            </template>
            외부에서 상태를 제어합니다. 아래 버튼으로도 열고 닫을 수 있습니다.
          </Popover>
          <!-- 열기/닫기 버튼 분리 — 토글 방식에서 DismissableLayer outside click과 경합 발생하므로 분리 -->
          <button type="button" class="popoverGuidePage__controlBtn" @click="isPopoverOpen = true">
            열기 (외부 버튼)
          </button>
          <button type="button" class="popoverGuidePage__controlBtn" @click="isPopoverOpen = false">
            닫기 (외부 버튼)
          </button>
          <span class="popoverGuidePage__stateText">
            현재 상태: <strong>{{ isPopoverOpen ? '열림' : '닫힘' }}</strong>
          </span>
        </div>
      </div>

      <pre class="popoverGuidePage__code"><code>&lt;script setup lang="ts"&gt;
const isOpen = ref(false)
&lt;/script&gt;

&lt;template&gt;
  &lt;!-- Popover와 외부 버튼을 형제(sibling) 관계로 배치 --&gt;
  &lt;Popover v-model:open="isOpen" title="외부 제어 모드"&gt;
    &lt;template #trigger&gt;
      &lt;button type="button" aria-label="안내"&gt;
        &lt;Icon size="sm"&gt;&lt;TooltipSvg /&gt;&lt;/Icon&gt;
      &lt;/button&gt;
    &lt;/template&gt;
    외부에서 상태를 제어합니다.
  &lt;/Popover&gt;
  &lt;!-- 열기/닫기를 분리 — 토글 방식은 DismissableLayer outside click과 경합 발생 --&gt;
  &lt;button type="button" @click="isOpen = true"&gt;열기 (외부 버튼)&lt;/button&gt;
  &lt;button type="button" @click="isOpen = false"&gt;닫기 (외부 버튼)&lt;/button&gt;
&lt;/template&gt;</code></pre>
    </section>

    <!-- ④ 구현 방식 -->
    <section class="popoverGuidePage__section">
      <h2 class="popoverGuidePage__sectionTitle">④ 구현 방식</h2>

      <h3 class="popoverGuidePage__tableTitle">Portal 없이 트리거 인접 인라인 렌더링</h3>
      <p class="popoverGuidePage__note">
        이 컴포넌트는 <code>PopoverPortal</code>을 사용하지 않습니다. <code>PopoverContent</code>가 트리거 DOM 바로 인접한 위치에 인라인으로 렌더링됩니다.<br />
        <code>PopoverRoot &gt; PopoverTrigger + PopoverContent</code> 구조로 배치하며,
        닫힘 애니메이션 보장을 위해 <code>:force-mount="true"</code>를 적용하고 <code>data-state</code> 속성으로
        표시/숨김을 처리합니다.<br />
        <strong>초기 렌더 flash 방지:</strong> <code>forceMount="true"</code> 사용 시 Radix Vue가 <code>data-state</code> 속성을 DOM에 쓰는 시점이 Vue 렌더 직후보다 약간 늦어, 그 gap 동안 <code>__inner</code>가 스타일 없이 순간 노출되는 flash가 발생합니다.
        이를 막기 위해 <code>data-has-been-opened</code> 속성을 열림 시점에 추가하고, 이 속성이 없는 동안은 콘텐츠를 숨깁니다.
      </p>
      <pre class="popoverGuidePage__code"><code>&lt;PopoverRoot :open="proxyOpen" @update:open="handleOpenChange"&gt;
  &lt;PopoverTrigger as-child&gt;
    &lt;slot name="trigger" /&gt;
  &lt;/PopoverTrigger&gt;

  &lt;!-- Portal 없이 트리거 인접 인라인 렌더링 --&gt;
  &lt;PopoverContent :force-mount="true" side="bottom"&gt;
    ...
  &lt;/PopoverContent&gt;
&lt;/PopoverRoot&gt;</code></pre>

      <h3 class="popoverGuidePage__tableTitle">x축 포지셔닝 — position: fixed + CSS 직접 제어</h3>
      <p class="popoverGuidePage__note">
        <code>__panel</code>은 <code>position: fixed; left: 0; width: 100vw</code>로 viewport 전체를 차지하는 투명 컨테이너입니다.<br />
        <code>__inner</code>는 <code>max-width: 60rem; margin: 0 auto</code>로 화면 중앙에 정렬됩니다 (최대 600px).<br />
        Portal 없이 인라인 렌더링하더라도 Radix Vue가 여전히 wrapper에 <code>transform</code>을 주입하므로,
        <code>position: fixed !important; left: 0 !important; width: 100vw !important;</code> CSS와 함께
        MutationObserver로 x축 0 보정을 유지합니다.<br />
        <code>:avoid-collisions="false"</code>를 함께 적용해 x축 자동 반전을 차단합니다.
      </p>
      <pre class="popoverGuidePage__code"><code>/* x축 포지셔닝 — !important + MutationObserver 보정 유지 */
.popover__panel {
  position: fixed !important;
  left: 0 !important;
  width: 100vw !important;
}

/* 패널 내용 최대 너비 + 중앙 정렬 */
.popover__inner {
  max-width: 60rem; /* 600px */
  margin: 0 auto;
}</code></pre>

      <h3 class="popoverGuidePage__tableTitle">애니메이션 — data-state 기반 keyframe</h3>
      <p class="popoverGuidePage__note">
        Radix Vue가 열림/닫힘 상태를 <code>data-state="open"</code> / <code>data-state="closed"</code> 속성으로
        관리합니다.<br />
        이 속성을 CSS 선택자로 참조해 keyframe 애니메이션을 제어합니다.<br />
        <code>data-state=closed</code> 일 때 <code>pointer-events: none</code>을 함께 적용해 닫히는 중 클릭을
        차단합니다.
      </p>
      <pre class="popoverGuidePage__code"><code>.popover__panel {
  will-change: transform, opacity;

  /* open: 아래→위 슬라이드 + 페이드인 */
  &amp;[data-state='open'] {
    animation: popoverSlideUpAndFade $duration-base ease-out forwards;
  }

  /* closed: 위→아래 슬라이드 + 페이드아웃 + 클릭 차단 */
  &amp;[data-state='closed'] {
    animation: popoverSlideDownAndFade $duration-base ease-in forwards;
    pointer-events: none;
  }
}

@keyframes popoverSlideUpAndFade {
  from { opacity: 0; transform: translateY(0.4rem); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes popoverSlideDownAndFade {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(0.4rem); }
}</code></pre>
    </section>

    <!-- ⑤ portal 모드 (overflow 탈출) -->
    <section class="popoverGuidePage__section">
      <h2 class="popoverGuidePage__sectionTitle">⑤ portal 모드 (overflow 탈출)</h2>
      <p class="popoverGuidePage__note">
        <code>:portal="true"</code>를 추가하면 <code>PopoverPortal</code>이 활성화되어
        부모의 <code>overflow: hidden</code> 컨테이너를 탈출해 <code>body</code>에 렌더링됩니다.<br />
        <strong>주의: popup(LayerPopup/ToastPopup) 안에서는 false 유지.</strong>
      </p>
      <div class="popoverGuidePage__demo">
        <div style="overflow: hidden; height: 5rem; border: 1px dashed #ccc; padding: 1rem; position: relative;">
          <span style="font-size: 1.2rem; color: #666;">overflow:hidden 컨테이너</span>
          <Popover title="portal 모드 안내" :portal="true">
            <template #trigger>
              <button type="button" aria-label="portal 테스트">
                <Icon size="sm"><TooltipSvg /></Icon>
              </button>
            </template>
            portal=true 시 overflow:hidden 컨테이너 밖에 패널이 표시됩니다.
          </Popover>
        </div>
      </div>
      <pre class="popoverGuidePage__code"><code>&lt;Popover title="portal 모드 안내" :portal="true"&gt;
  &lt;template #trigger&gt;
    &lt;button type="button" aria-label="portal 테스트"&gt;
      &lt;Icon size="sm"&gt;&lt;TooltipSvg /&gt;&lt;/Icon&gt;
    &lt;/button&gt;
  &lt;/template&gt;
  portal=true 시 overflow:hidden 컨테이너 밖에 패널이 표시됩니다.
&lt;/Popover&gt;</code></pre>
    </section>

    <!-- ⑥ Props / Slots / Events -->
    <section class="popoverGuidePage__section">
      <h2 class="popoverGuidePage__sectionTitle">⑥ Props / Slots / Events</h2>

      <h3 class="popoverGuidePage__tableTitle">Props</h3>
      <div class="popoverGuidePage__propsTableWrap">
        <table class="popoverGuidePage__propsTable">
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
              <td><code>title</code></td>
              <td><code>string</code></td>
              <td>—</td>
              <td>패널 상단 제목 텍스트. 미제공 시 헤더 행 미렌더, 닫기 버튼이 우측 상단 독립 배치됨</td>
            </tr>
            <tr>
              <td><code>open</code></td>
              <td><code>boolean</code></td>
              <td>—</td>
              <td>외부 제어 모드. <code>v-model:open</code>으로 연동</td>
            </tr>
            <tr>
              <td><code>defaultOpen</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>초기 열림 상태 (비제어 모드 전용)</td>
            </tr>
            <tr>
              <td><code>portal</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>true이면 PopoverPortal을 활성화해 body에 렌더링. 부모의 <code>overflow: hidden</code> 탈출 가능. popup 안에서는 false 유지</td>
            </tr>
            <tr>
              <td><code>container</code></td>
              <td><code>string | HTMLElement</code></td>
              <td>—</td>
              <td>portal=true 시 렌더링 대상 컨테이너. 미지정 시 <code>&lt;body&gt;</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="popoverGuidePage__tableTitle">Slots</h3>
      <div class="popoverGuidePage__propsTableWrap">
        <table class="popoverGuidePage__propsTable">
          <thead>
            <tr>
              <th>이름</th>
              <th>필수</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>trigger</code></td>
              <td>필수</td>
              <td>팝오버를 여는 트리거 요소. 아이콘 버튼·텍스트 버튼 등 자유롭게 삽입</td>
            </tr>
            <tr>
              <td><code>default</code></td>
              <td>필수</td>
              <td>패널 본문 콘텐츠. 텍스트 또는 커스텀 HTML 삽입 가능</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="popoverGuidePage__tableTitle">Events</h3>
      <div class="popoverGuidePage__propsTableWrap">
        <table class="popoverGuidePage__propsTable">
          <thead>
            <tr>
              <th>이름</th>
              <th>페이로드</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>@open</code></td>
              <td>—</td>
              <td>패널이 열린 직후 발생</td>
            </tr>
            <tr>
              <td><code>@close</code></td>
              <td>—</td>
              <td>패널이 닫힌 직후 발생</td>
            </tr>
            <tr>
              <td><code>@update:open</code></td>
              <td><code>boolean</code></td>
              <td>open 상태 변경 시 발생. <code>v-model:open</code>이 이 이벤트를 수신해 상태 업데이트</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="popoverGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는 <code>v-bind="$attrs"</code>를 사용하므로 위 Props 외에도
        <code>PopoverTrigger</code> 요소로 네이티브 HTML 속성 (<code>aria-label</code>, <code>aria-describedby</code>,
        <code>tabindex</code>, <code>data-*</code> 등)을 그대로 전달할 수 있습니다.<br />
        단, <code>modal</code> 같은 Radix Vue <code>PopoverRoot</code> 전용 props는 Root로 분리 위임됩니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>

      <p class="popoverGuidePage__radixNote">
        이 컴포넌트는 <strong>Radix Vue Popover</strong>를 기반으로 합니다. 위 Props 외에도 Radix Vue가 지원하는 추가
        props를 사용할 수 있습니다. 전체 API는
        <a href="https://www.radix-vue.com/components/popover.html" target="_blank" rel="noopener noreferrer"
          >radix-vue.com 공식 문서 (Popover)</a
        >
        또는 Context7 MCP(<code>mcp__context7__query-docs</code>)를 통해 확인하세요.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  import Icon from '@nd/components/icons/Icon.vue'
  import TooltipSvg from '@nd/assets/icons/tooltip.svg?skipsvgo'

  definePageMeta({ layout: 'guide' })

  // ③ v-model:open 외부 제어 모드
  const isPopoverOpen = ref(false)
</script>

<style lang="scss" scoped>
  $b: 'popoverGuidePage';

  .#{$b} {
    padding: $spacing-lg;
    max-width: 100%;

    &__header {
      margin-bottom: $spacing-xl;
    }

    &__title {
      font-size: $font-size-h2;
      font-weight: $font-weight-bold;
      color: $text-900;
      margin-bottom: $spacing-sm;
    }

    &__meta {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      margin-bottom: $spacing-sm;
    }

    &__badge {
      display: flex;
      align-items: center;
      padding: 0.2rem 0.8rem;
      border-radius: $radius-sm;
      font-size: $font-size-caption1;
      font-weight: $font-weight-medium;
      background-color: $bg-accent-sky-blue;
      color: $color-primary;
    }

    &__desc {
      font-size: $font-size-body3;
      color: $text-600;
      line-height: $line-height-base;
    }

    &__section {
      margin-bottom: $spacing-2xl;
    }

    &__sectionTitle {
      font-size: $font-size-h4;
      font-weight: $font-weight-bold;
      color: $text-900;
      margin-bottom: $spacing-md;
      padding-bottom: $spacing-sm;
      border-bottom: 1px solid $line-200;
    }

    &__group {
      margin-bottom: $spacing-lg;
    }

    &__note {
      margin-top: $spacing-sm;
      margin-bottom: $spacing-md;
      font-size: $font-size-caption1;
      color: $text-400;
      line-height: $line-height-base;
    }

    &__demo {
      display: flex;
      align-items: flex-start;
      padding: $spacing-md;
      background-color: $bg-secondary;
      border: 1px solid $line-200;
      border-radius: $radius-sm;
      margin-bottom: $spacing-md;
      min-height: 6rem;
    }

    &__controlRow {
      display: flex;
      align-items: center;
      gap: $spacing-md;
      flex-wrap: wrap;
      padding: $spacing-md;
      background-color: $bg-secondary;
      border: 1px solid $line-200;
      border-radius: $radius-sm;
      margin-bottom: $spacing-md;
      min-height: 6rem;
    }

    &__controlBtn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: $spacing-xs $spacing-md;
      border: 1px solid $line-200;
      border-radius: $radius-sm;
      background-color: $bg-primary;
      font-size: $font-size-body3;
      color: $text-700;
      cursor: pointer;
      transition: background-color $duration-fast ease;

      &:hover {
        background-color: $bg-tertiary;
      }

      &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 0.2rem $color-primary;
      }
    }

    &__stateText {
      font-size: $font-size-body3;
      color: $text-600;
    }

    &__code {
      background-color: $bg-tertiary;
      border: 1px solid $line-200;
      border-radius: $radius-sm;
      padding: $spacing-sm $spacing-md;
      font-size: $font-size-caption3;
      color: $text-600;
      overflow-x: auto;
      white-space: pre;
      line-height: $line-height-base;
    }

    &__tableTitle {
      font-size: $font-size-body2;
      font-weight: $font-weight-bold;
      color: $text-900;
      margin-top: $spacing-lg;
      margin-bottom: $spacing-sm;
    }

    &__propsTableWrap {
      overflow-x: auto;
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
        min-width: 8rem;
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

        &:hover {
          color: $color-primary-hover;
        }
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
