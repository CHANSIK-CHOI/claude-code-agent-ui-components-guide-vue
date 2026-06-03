<template>
  <div class="progressGuidePage">
    <!-- 헤더 -->
    <header class="progressGuidePage__header">
      <div class="progressGuidePage__meta">
        <span class="progressGuidePage__badge">atoms</span>
      </div>
      <h1 class="progressGuidePage__title">Progress</h1>
      <p class="progressGuidePage__desc">
        로딩, 업로드, 단계 완료 등 수치화된 진행률을 시각적으로 전달하는 가로형 진행 바 컴포넌트.<br />
        Radix Vue <code>ProgressRoot</code> + <code>ProgressIndicator</code>를 래핑하며 접근성(ARIA) 처리는 Radix Vue에
        위임합니다.
      </p>
    </header>

    <!-- ① 기본 사용 -->
    <section class="progressGuidePage__section">
      <h2 class="progressGuidePage__sectionTitle">① 기본 사용</h2>
      <p class="progressGuidePage__note">value=0, 25, 50, 75, 100 각각의 진행 상태를 데모합니다.</p>

      <div class="progressGuidePage__group">
        <div v-for="val in basicValues" :key="val" class="progressGuidePage__item">
          <span class="progressGuidePage__itemLabel">value={{ val }}</span>
          <Progress :value="val" />
          <pre class="progressGuidePage__code"><code>&lt;Progress :value="{{ val }}" /&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- ② 인터랙티브 데모 -->
    <section class="progressGuidePage__section">
      <h2 class="progressGuidePage__sectionTitle">② 인터랙티브 데모</h2>
      <p class="progressGuidePage__note">슬라이더를 조절해 진행률을 실시간으로 변경합니다.</p>

      <div class="progressGuidePage__interactive">
        <div class="progressGuidePage__interactivePreview">
          <Progress :value="interactiveValue" />
        </div>
        <div class="progressGuidePage__interactiveControls">
          <label class="progressGuidePage__sliderLabel" for="progress-slider">
            value: <strong>{{ interactiveValue }}</strong>
          </label>
          <input
            id="progress-slider"
            v-model.number="interactiveValue"
            type="range"
            min="0"
            max="100"
            step="1"
            class="progressGuidePage__slider"
          />
        </div>
      </div>
    </section>

    <!-- ③ indicator 슬롯 (커스텀 말풍선) -->
    <section class="progressGuidePage__section">
      <h2 class="progressGuidePage__sectionTitle">③ indicator 슬롯 (커스텀 말풍선)</h2>
      <p class="progressGuidePage__note">
        슬라이더를 조절하면 Progress 인디케이터 끝 지점에 커스텀 말풍선이 따라 이동합니다.
        <code>indicator</code> 슬롯에 커스텀 마크업을 직접 주입해 진행 위치를 실시간으로 표시할 수 있습니다.
      </p>

      <div class="progressGuidePage__interactive">
        <div class="progressGuidePage__indicatorSlotBox">
          <Progress :value="tooltipValue">
            <template #indicator>
              <div
                class="progressGuidePage__bubble"
                role="tooltip"
                :style="{ background: '#E4F5F5', color: '#13AFAB' }"
              >
                <span>{{ tooltipValue }}%</span>
                <svg
                  class="progressGuidePage__bubbleArrow"
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="10"
                  viewBox="0 0 11 10"
                  fill="none"
                  aria-hidden="true"
                ><path d="M3.73475 0.999999C4.50455 -0.333335 6.42905 -0.333333 7.19885 1L10.663 7C11.4328 8.33333 10.4705 10 8.9309 10L2.00269 10C0.463093 10 -0.499156 8.33333 0.270645 7L3.73475 0.999999Z" fill="#E4F5F5"/></svg>
              </div>
            </template>
          </Progress>
        </div>
        <div class="progressGuidePage__interactiveControls">
          <label class="progressGuidePage__sliderLabel" for="indicator-slot-slider">
            value: <strong>{{ tooltipValue }}</strong>
          </label>
          <input
            id="indicator-slot-slider"
            v-model.number="tooltipValue"
            type="range"
            min="0"
            max="100"
            step="1"
            class="progressGuidePage__slider"
          />
        </div>
      </div>

      <pre class="progressGuidePage__code"><code>&lt;Progress :value="60"&gt;
  &lt;template #indicator&gt;
    &lt;div class="myBubble" role="tooltip" :style="{ background: '#E4F5F5', color: '#13AFAB' }"&gt;
      &lt;span&gt;60%&lt;/span&gt;
      &lt;svg ...꼬리SVG... /&gt;
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/Progress&gt;</code></pre>
    </section>

    <!-- ⑤ Tooltip 통합 -->
    <section class="progressGuidePage__section">
      <h2 class="progressGuidePage__sectionTitle">⑤ Tooltip 통합</h2>
      <p class="progressGuidePage__note">
        <code>tooltipText</code> prop을 지정하면 Progress 내부에서 Tooltip을 <code>alwaysOpen=true</code>로 자동 마운트합니다.
        슬라이더를 조절하면 Tooltip이 인디케이터 끝 지점을 따라 이동합니다.
        <code>tooltipSide</code>, <code>tooltipColor</code>, <code>tooltipArrowAlign</code> 등 외관 props로 말풍선을 제어할 수 있습니다.
      </p>

      <!-- 기본 -->
      <div class="progressGuidePage__tooltipDemo">
        <div class="progressGuidePage__tooltipDemoBox">
          <Progress :value="tooltipDemoValue" :tooltip-text="`${tooltipDemoValue}%`" />
        </div>
        <div class="progressGuidePage__interactiveControls">
          <label class="progressGuidePage__sliderLabel" for="tooltip-demo-slider">
            value: <strong>{{ tooltipDemoValue }}</strong>
          </label>
          <input
            id="tooltip-demo-slider"
            v-model.number="tooltipDemoValue"
            type="range"
            min="0"
            max="100"
            step="1"
            class="progressGuidePage__slider"
          />
        </div>
      </div>
      <pre class="progressGuidePage__code"><code>&lt;!-- 기본 (side=top, color=dark) --&gt;
&lt;Progress :value="60" tooltip-text="60%" /&gt;</code></pre>

      <!-- 외관 변형 1: primary + bottom -->
      <div class="progressGuidePage__tooltipVariantList">
        <div class="progressGuidePage__tooltipVariantItem">
          <span class="progressGuidePage__itemLabel">color="primary" / side="bottom"</span>
          <div class="progressGuidePage__tooltipDemoBox progressGuidePage__tooltipDemoBox--bottom">
            <Progress :value="65" tooltip-text="65%" tooltip-color="primary" tooltip-side="bottom" />
          </div>
          <pre class="progressGuidePage__code"><code>&lt;Progress
  :value="65"
  tooltip-text="65%"
  tooltip-color="primary"
  tooltip-side="bottom"
/&gt;</code></pre>
        </div>

        <!-- 외관 변형 2: arrowAlign=left + offsetX 조정 -->
        <div class="progressGuidePage__tooltipVariantItem">
          <span class="progressGuidePage__itemLabel">arrow-align="left" / tooltip-offset-x="-8"</span>
          <div class="progressGuidePage__tooltipDemoBox">
            <Progress :value="75" tooltip-text="75%" tooltip-arrow-align="left" :tooltip-offset-x="-8" />
          </div>
          <pre class="progressGuidePage__code"><code>&lt;Progress
  :value="75"
  tooltip-text="75%"
  tooltip-arrow-align="left"
  :tooltip-offset-x="-8"
/&gt;</code></pre>
        </div>

        <!-- 외관 변형 3: bgColor 커스텀 -->
        <div class="progressGuidePage__tooltipVariantItem">
          <span class="progressGuidePage__itemLabel">tooltip-bg-color 커스텀 (#13AFAB)</span>
          <div class="progressGuidePage__tooltipDemoBox">
            <Progress :value="80" tooltip-text="80%" tooltip-bg-color="#13AFAB" />
          </div>
          <pre class="progressGuidePage__code"><code>&lt;Progress
  :value="80"
  tooltip-text="80%"
  tooltip-bg-color="#13AFAB"
/&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- ⑥ Props 테이블 -->
    <section class="progressGuidePage__section">
      <h2 class="progressGuidePage__sectionTitle">⑥ Props</h2>

      <h3 class="progressGuidePage__tableTitle">Props</h3>
      <div class="progressGuidePage__propsTableWrap">
        <table class="progressGuidePage__propsTable">
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
              <td><code>number</code></td>
              <td><code>0</code></td>
              <td>현재 진행값 (0~max 범위)</td>
            </tr>
            <tr>
              <td><code>max</code></td>
              <td><code>number</code></td>
              <td><code>100</code></td>
              <td>진행 바의 최대값</td>
            </tr>
            <tr>
              <td><code>getValueLabel</code></td>
              <td><code>(value: number, max: number) =&gt; string</code></td>
              <td>—</td>
              <td>보조기기에 전달할 레이블 커스텀 함수 (예: "50% 완료")</td>
            </tr>
            <tr>
              <td><code>tooltipText</code></td>
              <td><code>string</code></td>
              <td>—</td>
              <td>지정 시 Progress 내부에서 Tooltip을 <code>alwaysOpen=true</code>로 자동 마운트. 미지정 시 Tooltip 없음</td>
            </tr>
            <tr>
              <td><code>tooltipSide</code></td>
              <td><code>'top' | 'bottom'</code></td>
              <td><code>'top'</code></td>
              <td>Tooltip 말풍선 방향. Tooltip의 <code>side</code> prop과 동일. <code>tooltipText</code>가 있을 때만 유효</td>
            </tr>
            <tr>
              <td><code>tooltipColor</code></td>
              <td><code>'dark' | 'primary'</code></td>
              <td><code>'dark'</code></td>
              <td>Tooltip 말풍선 색상 variant. Tooltip의 <code>color</code> prop과 동일. <code>tooltipText</code>가 있을 때만 유효</td>
            </tr>
            <tr>
              <td><code>tooltipArrowAlign</code></td>
              <td><code>'left' | 'center' | 'right'</code></td>
              <td><code>'center'</code></td>
              <td>Tooltip 화살표 정렬. Tooltip의 <code>arrowAlign</code> prop과 동일. <code>tooltipText</code>가 있을 때만 유효</td>
            </tr>
            <tr>
              <td><code>tooltipOffsetX</code></td>
              <td><code>number</code></td>
              <td><code>0</code></td>
              <td>Tooltip x축 오프셋(px). Tooltip의 <code>offsetX</code> prop과 동일. <code>tooltipText</code>가 있을 때만 유효</td>
            </tr>
            <tr>
              <td><code>tooltipOffsetY</code></td>
              <td><code>number</code></td>
              <td><code>8</code></td>
              <td>Tooltip y축 오프셋(px). Tooltip의 <code>offsetY</code> prop과 동일. <code>tooltipText</code>가 있을 때만 유효</td>
            </tr>
            <tr>
              <td><code>tooltipBgColor</code></td>
              <td><code>string</code></td>
              <td>—</td>
              <td>Tooltip 배경 커스텀 색상(CSS 색상값). Tooltip의 <code>bgColor</code> prop과 동일. 지정 시 <code>tooltipColor</code>보다 우선. <code>tooltipText</code>가 있을 때만 유효</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="progressGuidePage__tableTitle">Slots</h3>
      <div class="progressGuidePage__propsTableWrap">
        <table class="progressGuidePage__propsTable">
          <thead>
            <tr>
              <th>이름</th>
              <th>필수</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>indicator</code></td>
              <td>—</td>
              <td>
                진행 위치(<code>value%</code>)에 절대 포지셔닝으로 이동하는 레이어.
                커스텀 말풍선 등 임의 HTML 주입 가능. 미주입 시 렌더링되지 않음.<br />
                <strong>주의</strong>: <code>tooltipText</code> prop이 지정된 경우 이 슬롯은 무시됩니다 (<code>tooltipText</code> 우선).
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="progressGuidePage__tableTitle">Events</h3>
      <div class="progressGuidePage__propsTableWrap">
        <table class="progressGuidePage__propsTable">
          <thead>
            <tr>
              <th>이름</th>
              <th>페이로드</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="3" class="progressGuidePage__emptyCell">이벤트 없음 — 읽기 전용 표시 컴포넌트</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="progressGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는 <code>v-bind="$attrs"</code>를 사용하므로 위 Props 외에도
        <code>ProgressRoot</code> 요소의 모든 네이티브 HTML 속성 (<code>aria-label</code>,
        <code>aria-describedby</code>, <code>data-*</code> 등)을 그대로 전달할 수 있습니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>

      <p class="progressGuidePage__radixNote">
        이 컴포넌트는 <strong>Radix Vue</strong>를 기반으로 합니다. 위 Props 외에도 Radix Vue가 지원하는 추가 props를
        사용할 수 있습니다. 전체 API는
        <a href="https://www.radix-vue.com/components/progress" target="_blank" rel="noopener noreferrer"
          >radix-vue.com 공식 문서</a
        >
        또는 Context7 MCP(<code>mcp__context7__query-docs</code>)를 통해 확인하세요.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { Progress } from '@nd/components/atoms';

  definePageMeta({ layout: 'guide' });

  const basicValues = [0, 25, 50, 75, 100] as const;

  const interactiveValue = ref<number>(40);
  const tooltipValue = ref<number>(60);
  const tooltipDemoValue = ref<number>(60);
</script>

<style lang="scss" scoped src="./progress.scss"></style>
