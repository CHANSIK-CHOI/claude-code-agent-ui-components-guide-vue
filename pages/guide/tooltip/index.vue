<template>
  <div class="tooltipGuidePage">
    <!-- 헤더 -->
    <header class="tooltipGuidePage__header">
      <div class="tooltipGuidePage__meta">
        <span class="tooltipGuidePage__badge">atoms</span>
      </div>
      <h1 class="tooltipGuidePage__title">Tooltip</h1>
      <p class="tooltipGuidePage__desc">
        트리거 요소 주변에 말풍선 형태의 보조 정보를 표시하는 컴포넌트.<br />
        <code>color</code> (dark / primary) × <code>side</code> (top / bottom) × <code>arrowAlign</code> (left / right) × <code>alwaysOpen</code> 모드 지원.<br />
        <strong>분기 A</strong> (<code>alwaysOpen=false</code>): Radix Vue <code>TooltipRoot</code> 기반, hover/focus 시 자동 열림.<br />
        <strong>분기 B</strong> (<code>alwaysOpen=true</code>): 자체 <code>position: absolute</code> 구현 — 스크롤 시 트리거와 함께 자연 이동.
      </p>
    </header>

    <!-- ① 기본 Variant (color × side) -->
    <section class="tooltipGuidePage__section">
      <h2 class="tooltipGuidePage__sectionTitle">① 기본 Variant</h2>
      <p class="tooltipGuidePage__note">color × side 조합 4가지. hover 또는 포커스 시 말풍선이 열립니다.</p>

      <div class="tooltipGuidePage__row">
        <!-- dark / top -->
        <div class="tooltipGuidePage__item">
          <span class="tooltipGuidePage__itemLabel">color="dark" side="top" (기본값)</span>
          <div class="tooltipGuidePage__demoArea">
            <Tooltip color="dark" side="top" text="구독 할인 적용">
              <template #trigger>
                <button type="button" class="tooltipGuidePage__demoTrigger">hover me</button>
              </template>
            </Tooltip>
          </div>
          <pre class="tooltipGuidePage__code"><code>&lt;Tooltip color="dark" side="top" text="구독 할인 적용"&gt;
  &lt;template #trigger&gt;
    &lt;button type="button"&gt;hover me&lt;/button&gt;
  &lt;/template&gt;
&lt;/Tooltip&gt;</code></pre>
        </div>

        <!-- dark / bottom -->
        <div class="tooltipGuidePage__item">
          <span class="tooltipGuidePage__itemLabel">color="dark" side="bottom"</span>
          <div class="tooltipGuidePage__demoArea">
            <Tooltip color="dark" side="bottom" text="구독 할인 적용">
              <template #trigger>
                <button type="button" class="tooltipGuidePage__demoTrigger">hover me</button>
              </template>
            </Tooltip>
          </div>
          <pre class="tooltipGuidePage__code"><code>&lt;Tooltip color="dark" side="bottom" text="구독 할인 적용"&gt;
  &lt;template #trigger&gt;
    &lt;button type="button"&gt;hover me&lt;/button&gt;
  &lt;/template&gt;
&lt;/Tooltip&gt;</code></pre>
        </div>

        <!-- primary / top -->
        <div class="tooltipGuidePage__item">
          <span class="tooltipGuidePage__itemLabel">color="primary" side="top"</span>
          <div class="tooltipGuidePage__demoArea">
            <Tooltip color="primary" side="top" text="구독 할인 적용">
              <template #trigger>
                <button type="button" class="tooltipGuidePage__demoTrigger">hover me</button>
              </template>
            </Tooltip>
          </div>
          <pre class="tooltipGuidePage__code"><code>&lt;Tooltip color="primary" side="top" text="구독 할인 적용"&gt;
  &lt;template #trigger&gt;
    &lt;button type="button"&gt;hover me&lt;/button&gt;
  &lt;/template&gt;
&lt;/Tooltip&gt;</code></pre>
        </div>

        <!-- primary / bottom -->
        <div class="tooltipGuidePage__item">
          <span class="tooltipGuidePage__itemLabel">color="primary" side="bottom"</span>
          <div class="tooltipGuidePage__demoArea">
            <Tooltip color="primary" side="bottom" text="구독 할인 적용">
              <template #trigger>
                <button type="button" class="tooltipGuidePage__demoTrigger">hover me</button>
              </template>
            </Tooltip>
          </div>
          <pre class="tooltipGuidePage__code"><code>&lt;Tooltip color="primary" side="bottom" text="구독 할인 적용"&gt;
  &lt;template #trigger&gt;
    &lt;button type="button"&gt;hover me&lt;/button&gt;
  &lt;/template&gt;
&lt;/Tooltip&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- ② arrowAlign — 4방향 조합 -->
    <section class="tooltipGuidePage__section">
      <h2 class="tooltipGuidePage__sectionTitle">② arrowAlign — 화살표 위치 4방향</h2>
      <p class="tooltipGuidePage__note">
        <code>side</code> + <code>arrow-align</code> 조합으로 상좌 / 상우 / 하좌 / 하우 4방향을 표현합니다.<br />
        <code>arrow-align="left"</code>이면 화살표가 말풍선 좌측, <code>arrow-align="right"</code>(기본값)이면 말풍선 우측에 위치합니다.
      </p>

      <div class="tooltipGuidePage__row">
        <!-- top + right (상우 — 기본값) -->
        <div class="tooltipGuidePage__item">
          <span class="tooltipGuidePage__itemLabel">side="top" arrow-align="right" — 상우 (기본값)</span>
          <div class="tooltipGuidePage__demoArea">
            <Tooltip :always-open="true" color="primary" side="top" arrow-align="right" text="상우 — 기본값">
              <template #trigger>
                <button type="button" class="tooltipGuidePage__demoTrigger">상우</button>
              </template>
            </Tooltip>
          </div>
          <pre class="tooltipGuidePage__code"><code>&lt;Tooltip color="primary" side="top" arrow-align="right" text="상우"&gt;
  &lt;template #trigger&gt;...&lt;/template&gt;
&lt;/Tooltip&gt;</code></pre>
        </div>

        <!-- top + left (상좌) -->
        <div class="tooltipGuidePage__item">
          <span class="tooltipGuidePage__itemLabel">side="top" arrow-align="left" — 상좌</span>
          <div class="tooltipGuidePage__demoArea">
            <Tooltip :always-open="true" color="primary" side="top" arrow-align="left" text="상좌 — arrow-align left">
              <template #trigger>
                <button type="button" class="tooltipGuidePage__demoTrigger">상좌</button>
              </template>
            </Tooltip>
          </div>
          <pre class="tooltipGuidePage__code"><code>&lt;Tooltip color="primary" side="top" arrow-align="left" text="상좌"&gt;
  &lt;template #trigger&gt;...&lt;/template&gt;
&lt;/Tooltip&gt;</code></pre>
        </div>

        <!-- bottom + right (하우) -->
        <div class="tooltipGuidePage__item">
          <span class="tooltipGuidePage__itemLabel">side="bottom" arrow-align="right" — 하우</span>
          <div class="tooltipGuidePage__demoArea tooltipGuidePage__demoArea--spacious">
            <Tooltip :always-open="true" color="primary" side="bottom" arrow-align="right" text="하우 — Figma 기본 케이스">
              <template #trigger>
                <button type="button" class="tooltipGuidePage__demoTrigger">하우</button>
              </template>
            </Tooltip>
          </div>
          <pre class="tooltipGuidePage__code"><code>&lt;Tooltip color="primary" side="bottom" arrow-align="right" text="하우"&gt;
  &lt;template #trigger&gt;...&lt;/template&gt;
&lt;/Tooltip&gt;</code></pre>
        </div>

        <!-- bottom + left (하좌) -->
        <div class="tooltipGuidePage__item">
          <span class="tooltipGuidePage__itemLabel">side="bottom" arrow-align="left" — 하좌</span>
          <div class="tooltipGuidePage__demoArea tooltipGuidePage__demoArea--spacious">
            <Tooltip :always-open="true" color="primary" side="bottom" arrow-align="left" text="하좌 — arrow-align left">
              <template #trigger>
                <button type="button" class="tooltipGuidePage__demoTrigger">하좌</button>
              </template>
            </Tooltip>
          </div>
          <pre class="tooltipGuidePage__code"><code>&lt;Tooltip color="primary" side="bottom" arrow-align="left" text="하좌"&gt;
  &lt;template #trigger&gt;...&lt;/template&gt;
&lt;/Tooltip&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- ③ offsetX / offsetY 조정 -->
    <section class="tooltipGuidePage__section">
      <h2 class="tooltipGuidePage__sectionTitle">③ offsetX / offsetY 조정</h2>
      <p class="tooltipGuidePage__note">
        <code>:offset-x</code>는 말풍선을 x축으로 이동합니다 (px 단위, 양수 = 오른쪽, 음수 = 왼쪽).<br />
        <code>:offset-y</code>는 말풍선과 트리거 사이의 세로 간격입니다 (기본값 <code>8</code>).
      </p>

      <div class="tooltipGuidePage__row">
        <!-- offsetX=0 (기본) -->
        <div class="tooltipGuidePage__item">
          <span class="tooltipGuidePage__itemLabel">:offset-x="0" (기본값) — x축 이동 없음</span>
          <div class="tooltipGuidePage__demoArea tooltipGuidePage__demoArea--spacious">
            <Tooltip :always-open="true" color="primary" side="bottom" arrow-align="right" :offset-x="0" text="offsetX=0 기본값">
              <template #trigger>
                <button type="button" class="tooltipGuidePage__demoTrigger">offsetX=0</button>
              </template>
            </Tooltip>
          </div>
          <pre class="tooltipGuidePage__code"><code>&lt;Tooltip color="primary" side="bottom" :offset-x="0" text="..."&gt;
  &lt;template #trigger&gt;...&lt;/template&gt;
&lt;/Tooltip&gt;</code></pre>
        </div>

        <!-- offsetX=20 (오른쪽 이동) -->
        <div class="tooltipGuidePage__item">
          <span class="tooltipGuidePage__itemLabel">:offset-x="20" — 오른쪽으로 20px 이동</span>
          <div class="tooltipGuidePage__demoArea tooltipGuidePage__demoArea--spacious">
            <Tooltip :always-open="true" color="primary" side="bottom" arrow-align="right" :offset-x="20" text="offsetX=20 오른쪽 20px">
              <template #trigger>
                <button type="button" class="tooltipGuidePage__demoTrigger">offsetX=20</button>
              </template>
            </Tooltip>
          </div>
          <pre class="tooltipGuidePage__code"><code>&lt;Tooltip color="primary" side="bottom" :offset-x="20" text="..."&gt;
  &lt;template #trigger&gt;...&lt;/template&gt;
&lt;/Tooltip&gt;</code></pre>
        </div>

        <!-- offsetX=-20 (왼쪽 이동) -->
        <div class="tooltipGuidePage__item">
          <span class="tooltipGuidePage__itemLabel">:offset-x="-20" — 왼쪽으로 20px 이동</span>
          <div class="tooltipGuidePage__demoArea tooltipGuidePage__demoArea--spacious">
            <Tooltip :always-open="true" color="primary" side="bottom" arrow-align="left" :offset-x="-20" text="offsetX=-20 왼쪽 20px">
              <template #trigger>
                <button type="button" class="tooltipGuidePage__demoTrigger">offsetX=-20</button>
              </template>
            </Tooltip>
          </div>
          <pre class="tooltipGuidePage__code"><code>&lt;Tooltip color="primary" side="bottom" :offset-x="-20" text="..."&gt;
  &lt;template #trigger&gt;...&lt;/template&gt;
&lt;/Tooltip&gt;</code></pre>
        </div>

        <!-- offsetY=8 (기본) -->
        <div class="tooltipGuidePage__item">
          <span class="tooltipGuidePage__itemLabel">:offset-y="8" (기본값) — 트리거와 8px 간격</span>
          <div class="tooltipGuidePage__demoArea tooltipGuidePage__demoArea--spacious">
            <Tooltip :always-open="true" color="dark" side="top" :offset-y="8" text="offsetY=8 기본값">
              <template #trigger>
                <button type="button" class="tooltipGuidePage__demoTrigger">offsetY=8</button>
              </template>
            </Tooltip>
          </div>
          <pre class="tooltipGuidePage__code"><code>&lt;Tooltip color="dark" side="top" :offset-y="8" text="..."&gt;
  &lt;template #trigger&gt;...&lt;/template&gt;
&lt;/Tooltip&gt;</code></pre>
        </div>

        <!-- offsetY=20 (넓은 간격) -->
        <div class="tooltipGuidePage__item">
          <span class="tooltipGuidePage__itemLabel">:offset-y="20" — 트리거와 20px 간격</span>
          <div class="tooltipGuidePage__demoArea tooltipGuidePage__demoArea--spacious">
            <Tooltip :always-open="true" color="dark" side="top" :offset-y="20" text="offsetY=20 넓은 간격">
              <template #trigger>
                <button type="button" class="tooltipGuidePage__demoTrigger">offsetY=20</button>
              </template>
            </Tooltip>
          </div>
          <pre class="tooltipGuidePage__code"><code>&lt;Tooltip color="dark" side="top" :offset-y="20" text="..."&gt;
  &lt;template #trigger&gt;...&lt;/template&gt;
&lt;/Tooltip&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- ④ alwaysOpen 모드 -->
    <section class="tooltipGuidePage__section">
      <h2 class="tooltipGuidePage__sectionTitle">④ alwaysOpen 모드</h2>
      <p class="tooltipGuidePage__note">
        <code>:always-open="true"</code>이면 페이지 로드부터 항상 열려 있고 닫히지 않습니다.<br />
        Radix Vue 포지셔닝을 우회해 <strong>자체 <code>position: absolute</code> 구현으로 분기</strong>됩니다.
        DOM 흐름을 따르므로 <strong>스크롤 시 트리거와 함께 자연 이동</strong>하며, 재계산이 없습니다.<br />
        단, <code>avoidCollisions</code>가 동작하지 않아 뷰포트 경계에서 자동 반전되지 않습니다.
        <code>portal</code> prop은 <code>alwaysOpen=true</code> 시 무시됩니다 (항상 인라인 렌더링).
      </p>

      <div class="tooltipGuidePage__row">
        <!-- primary / bottom / alwaysOpen -->
        <div class="tooltipGuidePage__item">
          <span class="tooltipGuidePage__itemLabel">color="primary" side="bottom" :always-open="true"</span>
          <div class="tooltipGuidePage__demoArea tooltipGuidePage__demoArea--spacious">
            <Tooltip :always-open="true" color="primary" side="bottom" arrow-align="right" text="매월 67,200원 혜택을 받을 수 있어요!">
              <template #trigger>
                <button type="button" class="tooltipGuidePage__demoTrigger">구독 신청</button>
              </template>
            </Tooltip>
          </div>
          <pre class="tooltipGuidePage__code"><code>&lt;Tooltip :always-open="true" color="primary" side="bottom" arrow-align="right" text="매월 67,200원 혜택을 받을 수 있어요!"&gt;
  &lt;template #trigger&gt;
    &lt;button type="button"&gt;구독 신청&lt;/button&gt;
  &lt;/template&gt;
&lt;/Tooltip&gt;</code></pre>
        </div>

        <!-- dark / top / alwaysOpen -->
        <div class="tooltipGuidePage__item">
          <span class="tooltipGuidePage__itemLabel">color="dark" side="top" :always-open="true"</span>
          <div class="tooltipGuidePage__demoArea tooltipGuidePage__demoArea--spacious">
            <Tooltip :always-open="true" color="dark" side="top" arrow-align="right" text="구독 할인 적용">
              <template #trigger>
                <button type="button" class="tooltipGuidePage__demoTrigger">할인 안내</button>
              </template>
            </Tooltip>
          </div>
          <pre class="tooltipGuidePage__code"><code>&lt;Tooltip :always-open="true" color="dark" side="top" arrow-align="right" text="구독 할인 적용"&gt;
  &lt;template #trigger&gt;
    &lt;button type="button"&gt;할인 안내&lt;/button&gt;
  &lt;/template&gt;
&lt;/Tooltip&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- ⑤ hover/focus 인터랙션 모드 -->
    <section class="tooltipGuidePage__section">
      <h2 class="tooltipGuidePage__sectionTitle">⑤ hover / focus 인터랙션 모드</h2>
      <p class="tooltipGuidePage__note">
        <code>:always-open="false"</code> (기본값) — 트리거에 hover 또는 키보드 포커스 시 열립니다. ESC로 닫힘.
      </p>

      <div class="tooltipGuidePage__row">
        <!-- dark, hover -->
        <div class="tooltipGuidePage__item">
          <span class="tooltipGuidePage__itemLabel">color="dark" — hover / focus 인터랙션</span>
          <div class="tooltipGuidePage__demoArea">
            <Tooltip color="dark" side="top" text="구독 할인 적용" @open="onOpen" @close="onClose">
              <template #trigger>
                <button type="button" class="tooltipGuidePage__demoTrigger">hover me (dark)</button>
              </template>
            </Tooltip>
          </div>
          <p v-if="lastEvent" class="tooltipGuidePage__eventLog">마지막 이벤트: {{ lastEvent }}</p>
          <pre class="tooltipGuidePage__code"><code>&lt;Tooltip color="dark" side="top" text="..." @open="onOpen" @close="onClose"&gt;
  &lt;template #trigger&gt;
    &lt;button type="button"&gt;hover me&lt;/button&gt;
  &lt;/template&gt;
&lt;/Tooltip&gt;</code></pre>
        </div>

        <!-- primary, hover -->
        <div class="tooltipGuidePage__item">
          <span class="tooltipGuidePage__itemLabel">color="primary" — hover / focus 인터랙션</span>
          <div class="tooltipGuidePage__demoArea">
            <Tooltip color="primary" side="bottom" text="구독 할인 적용">
              <template #trigger>
                <button type="button" class="tooltipGuidePage__demoTrigger">hover me (primary)</button>
              </template>
            </Tooltip>
          </div>
          <pre class="tooltipGuidePage__code"><code>&lt;Tooltip color="primary" side="bottom" text="구독 할인 적용"&gt;
  &lt;template #trigger&gt;
    &lt;button type="button"&gt;hover me&lt;/button&gt;
  &lt;/template&gt;
&lt;/Tooltip&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- ⑥ 텍스트 내용 변형 -->
    <section class="tooltipGuidePage__section">
      <h2 class="tooltipGuidePage__sectionTitle">⑥ 텍스트 내용 변형</h2>
      <p class="tooltipGuidePage__note">짧은 텍스트와 긴 텍스트(줄바꿈) 두 가지 케이스.</p>

      <div class="tooltipGuidePage__row">
        <!-- 짧은 텍스트 -->
        <div class="tooltipGuidePage__item">
          <span class="tooltipGuidePage__itemLabel">짧은 텍스트 — text prop 사용</span>
          <div class="tooltipGuidePage__demoArea">
            <Tooltip color="primary" side="bottom" text="구독 할인 적용">
              <template #trigger>
                <button type="button" class="tooltipGuidePage__demoTrigger">hover me</button>
              </template>
            </Tooltip>
          </div>
          <pre class="tooltipGuidePage__code"><code>&lt;Tooltip color="primary" side="bottom" text="구독 할인 적용"&gt;
  &lt;template #trigger&gt;
    &lt;button type="button"&gt;hover me&lt;/button&gt;
  &lt;/template&gt;
&lt;/Tooltip&gt;</code></pre>
        </div>

        <!-- 긴 텍스트 (default 슬롯) -->
        <div class="tooltipGuidePage__item">
          <span class="tooltipGuidePage__itemLabel">긴 텍스트 (줄바꿈) — default 슬롯 사용</span>
          <div class="tooltipGuidePage__demoArea">
            <Tooltip color="dark" side="top">
              <template #trigger>
                <button type="button" class="tooltipGuidePage__demoTrigger">hover me</button>
              </template>
              구독 시 최대 N% 할인된 가격으로<br />구매 가능해요
            </Tooltip>
          </div>
          <pre class="tooltipGuidePage__code"><code>&lt;Tooltip color="dark" side="top"&gt;
  &lt;template #trigger&gt;
    &lt;button type="button"&gt;hover me&lt;/button&gt;
  &lt;/template&gt;
  구독 시 최대 N% 할인된 가격으로&lt;br /&gt;구매 가능해요
&lt;/Tooltip&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- ⑦ 커스텀 컬러 (bgColor / textColor) -->
    <section class="tooltipGuidePage__section">
      <h2 class="tooltipGuidePage__sectionTitle">⑦ 커스텀 컬러 (bgColor / textColor)</h2>
      <p class="tooltipGuidePage__note">
        <code>bg-color</code>와 <code>text-color</code>로 말풍선 배경색·텍스트색을 CSS 색상값으로 직접 지정할 수 있습니다.<br />
        <code>color</code> variant의 기본색보다 우선 적용됩니다. SVG 꼬리 fill도 <code>bgColor</code>를 따릅니다.
      </p>

      <div class="tooltipGuidePage__row">
        <!-- bgColor #E4F5F5 + textColor #13AFAB (alwaysOpen) -->
        <div class="tooltipGuidePage__item">
          <span class="tooltipGuidePage__itemLabel">bg-color="#E4F5F5" text-color="#13AFAB" — 커스텀 민트 계열</span>
          <div class="tooltipGuidePage__demoArea tooltipGuidePage__demoArea--spacious">
            <Tooltip
              :always-open="true"
              bg-color="#E4F5F5"
              text-color="#13AFAB"
              side="bottom"
              arrow-align="right"
              text="구독 혜택 안내"
            >
              <template #trigger>
                <button type="button" class="tooltipGuidePage__demoTrigger">혜택 안내</button>
              </template>
            </Tooltip>
          </div>
          <pre class="tooltipGuidePage__code"><code>&lt;Tooltip
  :always-open="true"
  bg-color="#E4F5F5"
  text-color="#13AFAB"
  side="bottom"
  arrow-align="right"
  text="구독 혜택 안내"
&gt;
  &lt;template #trigger&gt;
    &lt;button type="button" aria-label="혜택 안내"&gt;혜택 안내&lt;/button&gt;
  &lt;/template&gt;
&lt;/Tooltip&gt;</code></pre>
        </div>

        <!-- bgColor / textColor + hover/focus 모드 -->
        <div class="tooltipGuidePage__item">
          <span class="tooltipGuidePage__itemLabel">bg-color / text-color + hover/focus 인터랙션 모드</span>
          <div class="tooltipGuidePage__demoArea">
            <Tooltip
              bg-color="#E4F5F5"
              text-color="#13AFAB"
              side="top"
              arrow-align="right"
              text="커스텀 컬러 hover 예시"
            >
              <template #trigger>
                <button type="button" class="tooltipGuidePage__demoTrigger">hover me</button>
              </template>
            </Tooltip>
          </div>
          <pre class="tooltipGuidePage__code"><code>&lt;Tooltip
  bg-color="#E4F5F5"
  text-color="#13AFAB"
  side="top"
  arrow-align="right"
  text="커스텀 컬러 hover 예시"
&gt;
  &lt;template #trigger&gt;
    &lt;button type="button"&gt;hover me&lt;/button&gt;
  &lt;/template&gt;
&lt;/Tooltip&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- ⑧ portal 모드 (overflow 탈출) -->
    <section class="tooltipGuidePage__section">
      <h2 class="tooltipGuidePage__sectionTitle">⑧ portal 모드 (overflow 탈출)</h2>
      <p class="tooltipGuidePage__desc">
        <code>:portal="true"</code>를 추가하면 <code>TooltipPortal</code>이 활성화되어
        부모의 <code>overflow: hidden</code> 컨테이너를 탈출해 <code>body</code>에 렌더링됩니다.<br />
        <strong>주의: popup(LayerPopup/ToastPopup) 안에서는 false 유지.</strong>
      </p>
      <div class="tooltipGuidePage__demoArea">
        <div style="overflow: hidden; height: 5rem; border: 1px dashed #ccc; padding: 1rem; position: relative;">
          <span style="font-size: 1.2rem; color: #666;">overflow:hidden 컨테이너 (portal=false이면 잘림)</span>
          <Tooltip color="primary" side="bottom" arrow-align="right" text="portal=true라 잘리지 않아요!" :portal="true">
            <template #trigger>
              <button type="button" class="tooltipGuidePage__demoTrigger">트리거</button>
            </template>
          </Tooltip>
        </div>
      </div>
      <pre class="tooltipGuidePage__code"><code>&lt;Tooltip color="primary" side="bottom" arrow-align="right" text="portal=true라 잘리지 않아요!" :portal="true"&gt;
  &lt;template #trigger&gt;
    &lt;button type="button"&gt;트리거&lt;/button&gt;
  &lt;/template&gt;
&lt;/Tooltip&gt;</code></pre>
    </section>

    <!-- ⑨ Props / Slots / Events -->
    <section class="tooltipGuidePage__section">
      <h2 class="tooltipGuidePage__sectionTitle">⑨ Props / Slots / Events</h2>

      <h3 class="tooltipGuidePage__tableTitle">Props</h3>
      <div class="tooltipGuidePage__propsTableWrap">
        <table class="tooltipGuidePage__propsTable">
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
              <td><code>color</code></td>
              <td><code>'dark' | 'primary'</code></td>
              <td><code>'dark'</code></td>
              <td>말풍선 컬러 타입. dark = #333333, primary = #00ADDB</td>
            </tr>
            <tr>
              <td><code>bgColor</code></td>
              <td><code>string</code></td>
              <td>—</td>
              <td>말풍선 배경 커스텀 색상 (CSS 색상값, 예: <code>#E4F5F5</code>). 지정 시 <code>color</code> prop의 배경색보다 우선 적용됨. SVG 꼬리 fill에도 동일하게 반영됨</td>
            </tr>
            <tr>
              <td><code>textColor</code></td>
              <td><code>string</code></td>
              <td>—</td>
              <td>말풍선 텍스트 커스텀 색상 (CSS 색상값, 예: <code>#13AFAB</code>). 지정 시 기본 흰색(<code>$text-white</code>)보다 우선 적용됨</td>
            </tr>
            <tr>
              <td><code>side</code></td>
              <td><code>'top' | 'bottom'</code></td>
              <td><code>'top'</code></td>
              <td>툴팁 표시 위치. top = 트리거 위(꼬리 아래), bottom = 트리거 아래(꼬리 위)</td>
            </tr>
            <tr>
              <td><code>arrowAlign</code></td>
              <td><code>'left' | 'right'</code></td>
              <td><code>'right'</code></td>
              <td>화살표 x축 정렬. left = 말풍선 좌측, right = 말풍선 우측 (Figma 기본값). 내부에서 Radix Vue <code>align</code>(<code>start</code>/<code>end</code>)으로 변환됨</td>
            </tr>
            <tr>
              <td><code>offsetX</code></td>
              <td><code>number</code></td>
              <td><code>0</code></td>
              <td>말풍선 전체를 x축으로 이동하는 추가 오프셋(px). 양수 = 오른쪽, 음수 = 왼쪽. Radix Vue <code>alignOffset</code>으로 전달됨</td>
            </tr>
            <tr>
              <td><code>offsetY</code></td>
              <td><code>number</code></td>
              <td><code>8</code></td>
              <td>말풍선과 트리거 간 세로 간격(px). Radix Vue <code>sideOffset</code>으로 전달됨</td>
            </tr>
            <tr>
              <td><code>alwaysOpen</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>true이면 페이지 로드 시부터 항상 열려 있고 닫히지 않음. <strong>자체 <code>position: absolute</code> 구현으로 분기</strong>되어 스크롤 시 트리거와 함께 자연 이동. false이면 Radix Vue 기반 hover/focus 인터랙션 동작</td>
            </tr>
            <tr>
              <td><code>text</code></td>
              <td><code>string</code></td>
              <td>—</td>
              <td>말풍선 텍스트. default 슬롯이 없을 때 사용되는 fallback</td>
            </tr>
            <tr>
              <td><code>delayDuration</code></td>
              <td><code>number</code></td>
              <td><code>0</code></td>
              <td>hover 후 열리기까지 지연 시간(ms). alwaysOpen=true이면 무시됨</td>
            </tr>
            <tr>
              <td><code>portal</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>true이면 TooltipPortal을 활성화해 body에 렌더링. 부모의 <code>overflow: hidden</code> 탈출 가능. popup 안에서는 false 유지. <strong><code>alwaysOpen=true</code> 시 무시됨</strong> (자체 구현 분기는 항상 인라인 렌더링)</td>
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

      <h3 class="tooltipGuidePage__tableTitle">Slots</h3>
      <div class="tooltipGuidePage__propsTableWrap">
        <table class="tooltipGuidePage__propsTable">
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
              <td>툴팁을 발동시키는 트리거 요소. [분기 A] as-child로 직접 요소에 hover/focus 이벤트 바인딩 / [분기 B] <code>alwaysOpen=true</code> 시 wrapper 안에 배치되고 <code>aria-describedby</code>가 수동 연결됨</td>
            </tr>
            <tr>
              <td><code>default</code></td>
              <td>선택</td>
              <td>말풍선 텍스트 콘텐츠. 제공 시 text prop보다 우선 렌더링. HTML 마크업 삽입 가능</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="tooltipGuidePage__tableTitle">Events</h3>
      <div class="tooltipGuidePage__propsTableWrap">
        <table class="tooltipGuidePage__propsTable">
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
              <td>툴팁이 열릴 때 발생</td>
            </tr>
            <tr>
              <td><code>@close</code></td>
              <td>—</td>
              <td>툴팁이 닫힐 때 발생. alwaysOpen=true이면 발생하지 않음</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="tooltipGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는 <code>v-bind="$attrs"</code>를 사용하므로
        위 Props 외에도 <code>TooltipTrigger</code> 요소의 모든 네이티브 HTML 속성
        (<code>aria-label</code>, <code>aria-describedby</code>, <code>tabindex</code>, <code>data-*</code> 등)을
        그대로 전달할 수 있습니다.<br />
        Radix Vue의 Root 전용 props(<code>defaultOpen</code>, <code>disableHoverableContent</code>)는 TooltipRoot로
        분리 위임됩니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>

      <p class="tooltipGuidePage__radixNote">
        이 컴포넌트는 <strong>Radix Vue</strong>를 기반으로 합니다.
        위 Props 외에도 Radix Vue가 지원하는 추가 props를 사용할 수 있습니다.
        전체 API는
        <a href="https://www.radix-vue.com/components/tooltip" target="_blank" rel="noopener noreferrer">radix-vue.com 공식 문서</a>
        또는 Context7 MCP(<code>mcp__context7__query-docs</code>)를 통해 확인하세요.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ layout: 'guide' })

  const lastEvent = ref<string>('')

  function onOpen() {
    lastEvent.value = 'open'
  }

  function onClose() {
    lastEvent.value = 'close'
  }
</script>

<style lang="scss" scoped>
  $b: 'tooltipGuidePage';

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

    &__row {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-md;
      align-items: flex-start;
      flex-direction: column;
    }

    &__item {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
      width: 100%;
    }

    &__itemLabel {
      font-size: $font-size-caption1;
      color: $text-400;
      font-weight: $font-weight-medium;
    }

    // 데모 영역 — 말풍선이 잘리지 않도록 충분한 여백 확보
    &__demoArea {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: $spacing-xl $spacing-lg;
      background-color: $bg-secondary;
      border: 1px solid $line-200;
      border-radius: $radius-sm;
      width: 100%;
    }

    // alwaysOpen / offset 데모는 더 넉넉한 여백 (말풍선 + 꼬리 공간 확보)
    &__demoArea--spacious {
      padding: $spacing-2xl $spacing-lg;
    }

    &__demoTrigger {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: $spacing-sm $spacing-md;
      border: 1px solid $line-200;
      border-radius: $radius-sm;
      background-color: $bg-primary;
      font-size: $font-size-body3;
      font-weight: $font-weight-medium;
      color: $text-900;
      cursor: pointer;
      transition: background-color $duration-fast ease;

      &:hover {
        background-color: $bg-tertiary;
      }

      &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px $color-primary;
      }
    }

    &__eventLog {
      font-size: $font-size-caption1;
      color: $color-primary;
      font-weight: $font-weight-medium;
    }

    &__code {
      background-color: $bg-tertiary;
      border: 1px solid $line-200;
      border-radius: $radius-sm;
      padding: $spacing-sm $spacing-md;
      font-size: 1.1rem;
      color: $text-600;
      overflow-x: auto;
      white-space: pre;
      line-height: $line-height-base;
    }

    &__note {
      margin-top: $spacing-sm;
      margin-bottom: $spacing-md;
      font-size: $font-size-caption1;
      color: $text-400;
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
