<template>
  <div class="buttonGuidePage">
    <!-- 헤더 -->
    <header class="buttonGuidePage__header">
      <div class="buttonGuidePage__meta">
        <span class="buttonGuidePage__badge">atoms</span>
      </div>
      <h1 class="buttonGuidePage__title">Button</h1>
      <p class="buttonGuidePage__desc">
        사용자의 주요/보조 액션을 유도하는 클릭 가능한 인터랙티브 요소.<br />
        <code>shape</code> × <code>color</code> × <code>size</code> 조합으로
        24가지 variant 지원.
      </p>
    </header>

    <!-- ① Shape × Color 조합 -->
    <section class="buttonGuidePage__section">
      <h2 class="buttonGuidePage__sectionTitle">① Shape × Color</h2>

      <div v-for="shape in shapes" :key="shape" class="buttonGuidePage__group">
        <p class="buttonGuidePage__groupTitle">shape="{{ shape }}"</p>
        <div class="buttonGuidePage__row">
          <div
            v-for="color in getColors(shape)"
            :key="color"
            class="buttonGuidePage__item"
          >
            <span class="buttonGuidePage__itemLabel">{{ color }}</span>
            <Button :shape="shape" :color="color">{{ color }}</Button>
            <pre
              class="buttonGuidePage__code"
            ><code>&lt;Button :shape="{{ shape }}" color="{{ color }}"&gt;
  {{ color }}
&lt;/Button&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ② Size matrix -->
    <section class="buttonGuidePage__section">
      <h2 class="buttonGuidePage__sectionTitle">② Size</h2>
      <div class="buttonGuidePage__row">
        <div v-for="size in sizes" :key="size" class="buttonGuidePage__item">
          <span class="buttonGuidePage__itemLabel">{{ size }}</span>
          <Button :size="size">버튼 ({{ size }})</Button>
          <pre
            class="buttonGuidePage__code"
          ><code>&lt;Button size="{{ size }}"&gt;버튼&lt;/Button&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- ③ Round variant -->
    <section class="buttonGuidePage__section">
      <h2 class="buttonGuidePage__sectionTitle">③ Round (pill)</h2>
      <p class="buttonGuidePage__note">
        shape="text"에서는 round가 무시됩니다.
      </p>
      <div class="buttonGuidePage__row">
        <div
          v-for="shape in roundableShapes"
          :key="shape"
          class="buttonGuidePage__item"
        >
          <span class="buttonGuidePage__itemLabel"
            >shape="{{ shape }}" + round</span
          >
          <Button :shape="shape" :round="true">round ({{ shape }})</Button>
          <pre
            class="buttonGuidePage__code"
          ><code>&lt;Button :shape="{{ shape }}" :round="true"&gt;
  round
&lt;/Button&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- ④ Disabled -->
    <section class="buttonGuidePage__section">
      <h2 class="buttonGuidePage__sectionTitle">④ Disabled</h2>
      <div class="buttonGuidePage__row">
        <div v-for="shape in shapes" :key="shape" class="buttonGuidePage__item">
          <span class="buttonGuidePage__itemLabel"
            >shape="{{ shape }}" + disabled</span
          >
          <Button :shape="shape" :disabled="true">비활성 ({{ shape }})</Button>
          <pre
            class="buttonGuidePage__code"
          ><code>&lt;Button :shape="{{ shape }}" :disabled="true"&gt;
  비활성
&lt;/Button&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- ⑤ Icon 슬롯 -->
    <section class="buttonGuidePage__section">
      <h2 class="buttonGuidePage__sectionTitle">⑤ Icon Slots</h2>
      <div class="buttonGuidePage__row">
        <!-- leading-icon -->
        <div class="buttonGuidePage__item">
          <span class="buttonGuidePage__itemLabel">leading-icon</span>
          <Button>
            <template #leading-icon>
              <svg
                class="buttonGuidePage__svgIcon"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="7.5"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M7 10l2 2 4-4"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </template>
            확인
          </Button>
          <pre class="buttonGuidePage__code"><code>&lt;Button&gt;
  &lt;template #leading-icon&gt;
    &lt;IconCheck /&gt;
  &lt;/template&gt;
  확인
&lt;/Button&gt;</code></pre>
        </div>

        <!-- trailing-icon -->
        <div class="buttonGuidePage__item">
          <span class="buttonGuidePage__itemLabel">trailing-icon</span>
          <Button shape="line">
            전체보기
            <template #trailing-icon>
              <svg
                class="buttonGuidePage__svgIcon"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M8 5l5 5-5 5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </template>
          </Button>
          <pre class="buttonGuidePage__code"><code>&lt;Button :shape="line"&gt;
  전체보기
  &lt;template #trailing-icon&gt;
    &lt;IconArrow /&gt;
  &lt;/template&gt;
&lt;/Button&gt;</code></pre>
        </div>

        <!-- leading + trailing -->
        <div class="buttonGuidePage__item">
          <span class="buttonGuidePage__itemLabel">leading + trailing</span>
          <Button :color="'black'">
            <template #leading-icon>
              <svg
                class="buttonGuidePage__svgIcon"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="10"
                  cy="7"
                  r="3.5"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </template>
            나만의 드시모네
            <template #trailing-icon>
              <svg
                class="buttonGuidePage__svgIcon"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 8l5 5 5-5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </template>
          </Button>
          <pre class="buttonGuidePage__code"><code>&lt;Button color="black"&gt;
  &lt;template #leading-icon&gt;&lt;IconUser /&gt;&lt;/template&gt;
  나만의 드시모네
  &lt;template #trailing-icon&gt;&lt;IconChevron /&gt;&lt;/template&gt;
&lt;/Button&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- ⑥ Props 참조 -->
    <section class="buttonGuidePage__section">
      <h2 class="buttonGuidePage__sectionTitle">⑥ Props</h2>

      <h3 class="buttonGuidePage__tableTitle">Props</h3>
      <table class="buttonGuidePage__propsTable">
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
            <td><code>'primary' | 'secondary' | 'black' | 'gray'</code></td>
            <td><code>'primary'</code></td>
            <td>버튼 색상. secondary = sky-blue 계열, gray = 중성 회색 계열</td>
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
            <td>pill 형태 모서리. :shape="text"에서는 무시됨</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>비활성 상태. 클릭 이벤트 차단</td>
          </tr>
          <tr>
            <td><code>type</code></td>
            <td><code>'button' | 'submit'</code></td>
            <td><code>'button'</code></td>
            <td>HTML button type 속성</td>
          </tr>
        </tbody>
      </table>

      <h3 class="buttonGuidePage__tableTitle">Slots</h3>
      <table class="buttonGuidePage__propsTable">
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

      <h3 class="buttonGuidePage__tableTitle">Events</h3>
      <table class="buttonGuidePage__propsTable">
        <thead>
          <tr>
            <th>이름</th>
            <th>페이로드</th>
            <th>설명</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>@click</code></td>
            <td><code>MouseEvent</code></td>
            <td>disabled 상태에서는 발생하지 않음</td>
          </tr>
        </tbody>
      </table>

      <p class="buttonGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는
        <code>v-bind="$attrs"</code>를 사용하므로 위 Props 외에도
        <code>&lt;button&gt;</code> 요소의 모든 네이티브 HTML 속성
        (<code>aria-label</code>, <code>autofocus</code>, <code>tabindex</code>,
        <code>data-*</code> 등)을 그대로 전달할 수 있습니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "guide" });

type ButtonShape = "solid" | "line" | "text";
type ButtonColor = "primary" | "secondary" | "black" | "gray";

const shapes: ButtonShape[] = ["solid", "line", "text"];
const roundableShapes: ButtonShape[] = ["solid", "line"];
const sizes = ["lg", "md", "sm"] as const;

function getColors(shape: ButtonShape): ButtonColor[] {
  return ["primary", "secondary", "gray", "black"];
}
</script>

<style lang="scss" scoped src="./button.scss"></style>
