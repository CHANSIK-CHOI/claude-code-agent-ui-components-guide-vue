<template>
  <div class="marqueeGuidePage">
    <!-- 헤더 -->
    <header class="marqueeGuidePage__header">
      <div class="marqueeGuidePage__meta">
        <span class="marqueeGuidePage__badge">molecules</span>
      </div>
      <h1 class="marqueeGuidePage__title">Marquee</h1>
      <p class="marqueeGuidePage__desc">
        default slot에 넣은 자식 요소들이 Swiper FreeMode +
        requestAnimationFrame 기반으로 왼쪽 방향 무한 스크롤되는 컴포넌트.<br />
        각 자식 VNode는 자동으로 <code>SwiperSlide</code>로 래핑됩니다. 자동
        래핑 경로에서는 <code>SwiperSlide</code>에
        <code>width: fit-content</code>가 부여되므로 안쪽 div의 width가 슬라이드
        폭으로 그대로 반영됩니다. 또는 사용처가 <code>SwiperSlide</code>를 직접
        넘기면 재래핑 없이 그대로 사용됩니다(하이브리드).<br />
        드래그(FreeMode 스와이프) 후 관성 이동이 끝나면 자동 스크롤이
        재개됩니다.
      </p>
    </header>

    <!-- ① 기본 자동 마퀴 -->
    <section class="marqueeGuidePage__section">
      <h2 class="marqueeGuidePage__sectionTitle">① 기본 자동 마퀴</h2>
      <p class="marqueeGuidePage__note">
        <code>&lt;Marquee&gt;</code> 안에 자식을 넣기만 하면 각 자식이 자동으로
        슬라이드가 됩니다. 드래그로 스크롤할 수도 있습니다.<br />
        자동 래핑 경로는 <code>SwiperSlide</code>에
        <code>width: fit-content</code>를 자동 부여합니다. 안쪽 div에
        <code>width</code>(예: 아래 데모 카드의 12rem)를 주면 슬라이드 폭이 그
        div 폭을 그대로 따릅니다.
      </p>

      <div class="marqueeGuidePage__demoBox">
        <Marquee>
          <div
            v-for="card in demoCards"
            :key="card.id"
            :class="['marqueeGuidePage__card', card.colorClass]"
          >
            <span class="marqueeGuidePage__cardLabel">{{ card.label }}</span>
          </div>
        </Marquee>
      </div>

      <pre class="marqueeGuidePage__code"><code>&lt;Marquee&gt;
  &lt;div class="card"&gt;카드 A&lt;/div&gt;
  &lt;div class="card"&gt;카드 B&lt;/div&gt;
  &lt;div class="card"&gt;카드 C&lt;/div&gt;
  &lt;!-- 각 자식이 자동으로 SwiperSlide로 래핑됨 --&gt;
  &lt;!-- SwiperSlide에 width: fit-content 자동 부여 → .card 의 width가 슬라이드 폭이 됨 --&gt;
&lt;/Marquee&gt;

&lt;!-- 사용처 SCSS — 안쪽 div 에 width 만 주면 슬라이드 폭이 자동으로 따라옴 --&gt;
.card {
  width: 12rem;
  height: 8rem;
}</code></pre>
    </section>

    <!-- ② speed 조절 비교 -->
    <section class="marqueeGuidePage__section">
      <h2 class="marqueeGuidePage__sectionTitle">② speed 조절</h2>
      <p class="marqueeGuidePage__note">
        <code>speed</code> prop으로 자동 스크롤 속도를 조정합니다. 단위는
        px/ms이며 값이 클수록 빠릅니다.
      </p>

      <div class="marqueeGuidePage__item">
        <span class="marqueeGuidePage__itemLabel">:speed="0.03" (느림)</span>
        <div class="marqueeGuidePage__demoBox">
          <Marquee :speed="0.03">
            <div
              v-for="card in speedCards"
              :key="card.id"
              class="marqueeGuidePage__card marqueeGuidePage__card--blue"
            >
              <span class="marqueeGuidePage__cardLabel">{{ card.label }}</span>
            </div>
          </Marquee>
        </div>
        <pre
          class="marqueeGuidePage__code"
        ><code>&lt;Marquee :speed="0.03"&gt;...&lt;/Marquee&gt;</code></pre>
      </div>

      <div class="marqueeGuidePage__item">
        <span class="marqueeGuidePage__itemLabel">:speed="0.15" (빠름)</span>
        <div class="marqueeGuidePage__demoBox">
          <Marquee :speed="0.15">
            <div
              v-for="card in speedCards"
              :key="card.id"
              class="marqueeGuidePage__card marqueeGuidePage__card--orange"
            >
              <span class="marqueeGuidePage__cardLabel">{{ card.label }}</span>
            </div>
          </Marquee>
        </div>
        <pre
          class="marqueeGuidePage__code"
        ><code>&lt;Marquee :speed="0.15"&gt;...&lt;/Marquee&gt;</code></pre>
      </div>
    </section>

    <!-- ③ spaceBetween 조절 비교 -->
    <section class="marqueeGuidePage__section">
      <h2 class="marqueeGuidePage__sectionTitle">③ spaceBetween 조절</h2>
      <p class="marqueeGuidePage__note">
        <code>spaceBetween</code> prop으로 슬라이드 간격을 조정합니다. 단위는
        px입니다.
      </p>

      <div class="marqueeGuidePage__item">
        <span class="marqueeGuidePage__itemLabel"
          >:space-between="4" (좁은 간격)</span
        >
        <div class="marqueeGuidePage__demoBox">
          <Marquee :space-between="4">
            <div
              v-for="card in spaceCards"
              :key="card.id"
              class="marqueeGuidePage__card marqueeGuidePage__card--green"
            >
              <span class="marqueeGuidePage__cardLabel">{{ card.label }}</span>
            </div>
          </Marquee>
        </div>
        <pre
          class="marqueeGuidePage__code"
        ><code>&lt;Marquee :space-between="4"&gt;...&lt;/Marquee&gt;</code></pre>
      </div>

      <div class="marqueeGuidePage__item">
        <span class="marqueeGuidePage__itemLabel"
          >:space-between="24" (넓은 간격)</span
        >
        <div class="marqueeGuidePage__demoBox">
          <Marquee :space-between="24">
            <div
              v-for="card in spaceCards"
              :key="card.id"
              class="marqueeGuidePage__card marqueeGuidePage__card--purple"
            >
              <span class="marqueeGuidePage__cardLabel">{{ card.label }}</span>
            </div>
          </Marquee>
        </div>
        <pre
          class="marqueeGuidePage__code"
        ><code>&lt;Marquee :space-between="24"&gt;...&lt;/Marquee&gt;</code></pre>
      </div>
    </section>

    <!-- ④ full-bleed (wideScreen) -->
    <section class="marqueeGuidePage__section">
      <h2 class="marqueeGuidePage__sectionTitle">④ full-bleed (wideScreen)</h2>
      <p class="marqueeGuidePage__note">
        <code>class="wideScreen"</code>을 전달하면 전역 유틸 클래스가 적용되어
        화면 가장자리까지 확장됩니다. <code>$attrs</code> 위임으로
        <code>class</code>가 Swiper 컴포넌트에 직접 전달됩니다.
      </p>

      <div class="marqueeGuidePage__wideScreenDemo">
        <Marquee class="wideScreen">
          <div
            v-for="card in wideCards"
            :key="card.id"
            class="marqueeGuidePage__card marqueeGuidePage__card--pink"
          >
            <span class="marqueeGuidePage__cardLabel">{{ card.label }}</span>
          </div>
        </Marquee>
      </div>

      <pre
        class="marqueeGuidePage__code"
      ><code>&lt;!-- wideScreen은 전역 유틸 클래스 -- assets/scss/global.scss 정의 --&gt;
&lt;Marquee class="wideScreen"&gt;
  &lt;div class="card"&gt;카드&lt;/div&gt;
&lt;/Marquee&gt;</code></pre>
    </section>

    <!-- ⑤-1 Vue 컴포넌트 자식 + deepCloneVNode -->
    <section class="marqueeGuidePage__section">
      <h2 class="marqueeGuidePage__sectionTitle">
        ⑤-1 Vue 컴포넌트 자식 (deepCloneVNode)
      </h2>
      <p class="marqueeGuidePage__note">
        slot에 <strong>실제 Vue 컴포넌트</strong>(아래 데모에서는 icons의
        <code>&lt;Icon&gt;</code>)를 포함한 자식을 넣어도 Swiper loop copy
        포지션에서 정상 렌더됩니다.<br />
        자동 래핑 경로에서는 각 슬라이드 VNode를 <code>deepCloneVNode</code>로
        재귀 deep clone하여 loop copy마다 독립된 컴포넌트 인스턴스를 갖도록
        처리합니다. 동일 VNode 참조를 여러 포지션에 재사용하면 Vue 컴포넌트는
        싱글톤 구조라 loop copy 위치에서 빈 DOM이 출력됩니다 — deepCloneVNode가
        이 문제를 해결합니다.
      </p>

      <p class="marqueeGuidePage__deepCloneNote">
        <strong>내부 동작</strong>: <code>cloneVNode</code>(Vue 내장)는 shallow
        copy이므로 자식 트리에 Vue 컴포넌트가 있으면 동일 참조가 재사용됩니다.
        <code>deepCloneVNode</code>는 <code>cloneVNode(node)</code>로 자신을
        복제하고 <code>node.children</code>이 배열이면 각 항목이 VNode인
        경우에만 재귀 적용하며, string·number 등 primitive는 그대로 유지합니다.
        이 처리는 <strong>자동 래핑 경로에서만</strong> 적용됩니다 — SwiperSlide
        직접 경로는 사용처 VNode를 그대로 사용합니다.
      </p>

      <div class="marqueeGuidePage__demoBox">
        <Marquee :space-between="12">
          <div
            v-for="item in cloneCards"
            :key="item.id"
            class="marqueeGuidePage__cloneCard"
          >
            <span class="marqueeGuidePage__cloneCardTitle">{{
              item.title
            }}</span>
            <!-- 실제 Vue 컴포넌트(Icon)를 slot 자식으로 사용 — deepCloneVNode 동작을 실제로 검증 -->
            <Icon size="sm" color="#0CB5E2"><HeartFullSvg /></Icon>
          </div>
        </Marquee>
      </div>

      <pre
        v-pre
        class="marqueeGuidePage__code"
      ><code>&lt;!-- slot 자식에 실제 Vue 컴포넌트(Icon 등)가 포함된 경우에도 loop copy 정상 렌더 --&gt;
&lt;script setup lang="ts"&gt;
import Icon from '@nd/components/icons/Icon.vue'
import HeartFullSvg from '@nd/assets/icons/heartFull.svg?component'
&lt;/script&gt;

&lt;Marquee :space-between="12"&gt;
  &lt;div v-for="item in items" :key="item.id" class="card"&gt;
    &lt;span&gt;{{ item.title }}&lt;/span&gt;
    &lt;Icon size="sm"&gt;&lt;HeartFullSvg /&gt;&lt;/Icon&gt;
  &lt;/div&gt;
&lt;/Marquee&gt;

&lt;!-- Marquee 내부에서 자동으로 deepCloneVNode 적용 → loop copy도 독립 인스턴스 --&gt;</code></pre>
    </section>

    <!-- ⑤ SwiperSlide 직접 경로 -->
    <section class="marqueeGuidePage__section">
      <h2 class="marqueeGuidePage__sectionTitle">⑤ SwiperSlide 직접 경로</h2>
      <p class="marqueeGuidePage__note">
        사용처에서 <code>SwiperSlide</code>를 직접 slot에 넘기면 Marquee가
        재래핑하지 않고 그대로 사용합니다.
        <code>slidesPerView: 'auto'</code> 환경에서 슬라이드 너비는
        <code>.swiper-slide</code> DOM 요소 자체가 결정하므로, 사용처가
        <code>:deep(.swiper-slide){ width: X }</code>로 직접 제어할 수 있습니다.
      </p>

      <div class="marqueeGuidePage__slideDirectDemo">
        <Marquee :space-between="8">
          <SwiperSlide v-for="card in directSlideCards" :key="card.id">
            <div class="marqueeGuidePage__directCard">
              <span class="marqueeGuidePage__cardLabel">{{ card.label }}</span>
            </div>
          </SwiperSlide>
        </Marquee>
      </div>

      <pre class="marqueeGuidePage__code"><code>&lt;!-- 사용처 script --&gt;
&lt;script setup lang="ts"&gt;
import { SwiperSlide } from 'swiper/vue'
// Marquee는 Nuxt auto-import 또는 @nd/components/molecules에서 import
&lt;/script&gt;

&lt;!-- 사용처 template --&gt;
&lt;Marquee :space-between="8"&gt;
  &lt;SwiperSlide v-for="item in items" :key="item.id"&gt;
    &lt;div class="storyCard"&gt;...&lt;/div&gt;
  &lt;/SwiperSlide&gt;
&lt;/Marquee&gt;

&lt;!-- 사용처 SCSS — .swiper-slide 너비를 데모 래퍼 하위로 스코프 한정 --&gt;
&lt;style lang="scss" scoped&gt;
.mySection__marqueeWrap {
  :deep(.swiper-slide) {
    width: 16rem;
  }
}
&lt;/style&gt;</code></pre>

      <p class="marqueeGuidePage__note">
        두 경로의 너비 제어 책임이 다릅니다.<br />
        <strong>자동 래핑 경로</strong>: Marquee가 <code>SwiperSlide</code>에
        <code>width: fit-content</code>를 자동 부여하므로, 사용처는 안쪽
        <code>div</code>에 <code>width</code>만 주면 슬라이드 폭이 자동으로
        따라옵니다. <code>:deep(.swiper-slide)</code>로 너비를 재정의하는 방식도
        여전히 동작합니다.<br />
        <strong>SwiperSlide 직접 경로(본 섹션)</strong>: Marquee가 너비에
        개입하지 않으므로 사용처가
        <code>:deep(.swiper-slide){ width: X }</code> 또는
        <code>SwiperSlide</code>의 <code>style</code> /
        <code>class</code> prop으로 직접 제어해야 합니다. 슬라이드 단위 세밀
        제어가 필요할 때 이 경로를 선택하세요.
      </p>
    </section>

    <!-- ⑥ Props -->
    <section class="marqueeGuidePage__section">
      <h2 class="marqueeGuidePage__sectionTitle">⑥ Props</h2>

      <h3 class="marqueeGuidePage__tableTitle">Props</h3>
      <div class="marqueeGuidePage__propsTableWrap">
        <table class="marqueeGuidePage__propsTable">
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
              <td><code>speed</code></td>
              <td><code>number</code></td>
              <td><code>0.07</code></td>
              <td>자동 스크롤 속도 (px/ms). 값이 클수록 빠름</td>
            </tr>
            <tr>
              <td><code>spaceBetween</code></td>
              <td><code>number</code></td>
              <td><code>12</code></td>
              <td>슬라이드 간격 (px)</td>
            </tr>
            <tr>
              <td><code>resumeDelay</code></td>
              <td><code>number</code></td>
              <td><code>700</code></td>
              <td>
                드래그 종료 후 자동 스크롤 재개 대기 시간 (ms). 관성 이동이 없을
                때 타이머로 재개
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="marqueeGuidePage__tableTitle">Slots</h3>
      <div class="marqueeGuidePage__propsTableWrap">
        <table class="marqueeGuidePage__propsTable">
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
              <td>
                하이브리드 래핑 + deep clone을 지원합니다.<br />
                <strong>자동 래핑</strong>: 일반 VNode(div 등)를 넣으면 자동으로
                <code>SwiperSlide</code>로 감쌉니다. 이때
                <code>SwiperSlide</code>에 <code>width: fit-content</code>가
                부여되므로 슬라이드는 안쪽 콘텐츠(div)의 폭을 따릅니다. Swiper
                loop copy 대응을 위해 각 자식 VNode를
                <code>deepCloneVNode</code>로 재귀 deep clone하여 loop copy
                포지션에서도 Vue 컴포넌트 자식이 독립 인스턴스로 정상 렌더됩니다
                (§ ⑤-1 참조).<br />
                <strong>직접 경로</strong>: 사용처가
                <code>import { SwiperSlide } from 'swiper/vue'</code> 후
                <code>SwiperSlide</code>를 직접 넘기면 재래핑·deep clone 없이
                그대로 사용됩니다. 슬라이드의 시각 외관과 너비는 전달된 자식
                요소 및 사용처 SCSS가 결정합니다.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="marqueeGuidePage__tableTitle">Events</h3>
      <div class="marqueeGuidePage__propsTableWrap">
        <table class="marqueeGuidePage__propsTable">
          <thead>
            <tr>
              <th>이름</th>
              <th>페이로드</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="3" class="marqueeGuidePage__emptyCell">
                이 컴포넌트는 emit 하는 이벤트가 없습니다. 자동 스크롤과
                드래그는 컴포넌트 내부에서 완결됩니다. 외부 제어가 필요한 경우
                slot 자식 요소에서 이벤트를 처리하세요.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="marqueeGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는 render function에서
        <code>$attrs</code>를 Swiper 컴포넌트에 직접 위임하므로, 위 Props 외에도
        <code>class</code>(<code>wideScreen</code> 등), <code>data-*</code>,
        이벤트 핸들러 등 모든 fallthrough attrs가 스크롤 트랙 최상위 요소로
        전달됩니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>

      <p class="marqueeGuidePage__swiperNote">
        이 컴포넌트는 <strong>Swiper(FreeMode)</strong>를 기반으로 하며, 자동
        스크롤은 <code>requestAnimationFrame</code>으로 구동됩니다.<br />
        <code>prefers-reduced-motion: reduce</code> 환경에서는 자동 스크롤이
        정지되고 드래그만 가능합니다 (WCAG 2.2.2 — 움직임, 깜박임, 스크롤 제어
        준수).
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { SwiperSlide } from "swiper/vue";
import Icon from "@nd/components/icons/Icon.vue";
import HeartFullSvg from "@nd/assets/icons/heartFull.svg?component";

definePageMeta({ layout: "guide" });

interface DemoCard {
  id: number;
  label: string;
  colorClass?: string;
}

const demoCards: DemoCard[] = [
  { id: 1, label: "카드 A", colorClass: "marqueeGuidePage__card--lightBlue" },
  { id: 2, label: "카드 B", colorClass: "marqueeGuidePage__card--orange" },
  { id: 3, label: "카드 C", colorClass: "marqueeGuidePage__card--green" },
  { id: 4, label: "카드 D", colorClass: "marqueeGuidePage__card--pink" },
  { id: 5, label: "카드 E", colorClass: "marqueeGuidePage__card--purple" },
  { id: 6, label: "카드 F", colorClass: "marqueeGuidePage__card--beige" },
];

const speedCards: DemoCard[] = [
  { id: 1, label: "Slow 1" },
  { id: 2, label: "Slow 2" },
  { id: 3, label: "Slow 3" },
  { id: 4, label: "Slow 4" },
  { id: 5, label: "Slow 5" },
];

const spaceCards: DemoCard[] = [
  { id: 1, label: "Space 1" },
  { id: 2, label: "Space 2" },
  { id: 3, label: "Space 3" },
  { id: 4, label: "Space 4" },
  { id: 5, label: "Space 5" },
];

const wideCards: DemoCard[] = [
  { id: 1, label: "Wide A" },
  { id: 2, label: "Wide B" },
  { id: 3, label: "Wide C" },
  { id: 4, label: "Wide D" },
  { id: 5, label: "Wide E" },
  { id: 6, label: "Wide F" },
];

const directSlideCards: DemoCard[] = [
  { id: 1, label: "Slide 1" },
  { id: 2, label: "Slide 2" },
  { id: 3, label: "Slide 3" },
  { id: 4, label: "Slide 4" },
  { id: 5, label: "Slide 5" },
  { id: 6, label: "Slide 6" },
];

interface CloneCard {
  id: number;
  title: string;
}

const cloneCards: CloneCard[] = [
  { id: 1, title: "수분크림 50ml" },
  { id: 2, title: "오투부스터 미스트" },
  { id: 3, title: "콜라겐 앰플" },
  { id: 4, title: "선크림 SPF50+" },
  { id: 5, title: "클렌징 폼" },
  { id: 6, title: "토너 패드" },
];
</script>

<style lang="scss" scoped>
$b: "marqueeGuidePage";

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
    background-color: $bg-accent-beige;
    color: $text-700;
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

  &__note {
    margin-bottom: $spacing-md;
    font-size: $font-size-body3;
    color: $text-600;
    line-height: $line-height-base;
  }

  &__item {
    margin-bottom: $spacing-lg;
  }

  &__itemLabel {
    display: block;
    font-size: $font-size-caption1;
    color: $text-400;
    font-weight: $font-weight-medium;
    margin-bottom: $spacing-sm;
  }

  &__demoBox {
    overflow: hidden;
    background-color: $bg-secondary;
    border-radius: $radius-md;
    padding: $spacing-md 0;
    margin-bottom: $spacing-sm;
  }

  /* wideScreen 데모: 가이드 페이지 패딩을 상쇄해 가장자리까지 노출 */
  &__wideScreenDemo {
    overflow: hidden;
    background-color: $bg-secondary;
    border-radius: $radius-md;
    padding: $spacing-md 0;
    margin-right: -$spacing-lg;
    margin-left: -$spacing-lg;
    margin-bottom: $spacing-sm;
  }

  /* 데모 카드 — Marquee 자체는 외관이 없으므로 가이드에서 직접 정의 */
  &__card {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 12rem;
    height: 8rem;
    border-radius: $radius-md;
    background-color: $bg-accent-light-blue;
    flex-shrink: 0;
  }

  /* ① 기본 데모 카드 컬러 변형 */
  &__card--lightBlue {
    background-color: $bg-accent-light-blue;
  }

  &__card--orange {
    background-color: $bg-accent-orange;
  }

  &__card--green {
    background-color: $bg-accent-beige;
  }

  &__card--beige {
    background-color: $bg-accent-beige;
  }

  &__card--purple {
    background-color: $bg-accent-purple;
  }

  &__card--pink {
    background-color: $bg-accent-pink;
  }

  /* ② speed/space/wide 데모 — 기존 단색 클래스 유지 */
  &__card--blue {
    background-color: $bg-accent-sky-blue;
  }

  /* ⑤ SwiperSlide 직접 경로 데모 */
  &__slideDirectDemo {
    overflow: hidden;
    background-color: $bg-secondary;
    border-radius: $radius-md;
    padding: $spacing-md 0;
    margin-bottom: $spacing-sm;

    // 이 데모 전용: .swiper-slide 너비를 slideDirectDemo 하위로 스코프 한정
    // 다른 데모 섹션의 .swiper-slide에 영향 없음
    :deep(.swiper-slide) {
      width: 16rem;
    }
  }

  &__directCard {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 8rem;
    border-radius: $radius-md;
    background-color: $bg-accent-sky-blue;
  }

  &__cardLabel {
    display: block;
    font-size: $font-size-body3;
    font-weight: $font-weight-medium;
    color: $text-700;
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

  &__emptyCell {
    color: $text-600;
    font-size: $font-size-body3;
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

  &__swiperNote {
    margin-top: $spacing-md;
    padding: $spacing-sm $spacing-md;
    background-color: $bg-secondary;
    border-left: 3px solid $line-200;
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

  /* ⑤-1 deepCloneVNode 설명 노트 */
  &__deepCloneNote {
    margin-bottom: $spacing-md;
    padding: $spacing-sm $spacing-md;
    background-color: $bg-accent-beige;
    border-left: 3px solid $line-300;
    border-radius: $radius-sm;
    font-size: $font-size-body3;
    color: $text-700;
    line-height: $line-height-base;

    code {
      background-color: $bg-tertiary;
      padding: 0.1rem 0.4rem;
      border-radius: $radius-sm;
      font-size: $font-size-caption1;
    }
  }

  /* ⑤-1 deepCloneVNode 데모 카드 */
  &__cloneCard {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    width: 14rem;
    height: 9rem;
    padding: $spacing-sm $spacing-md;
    border-radius: $radius-md;
    background-color: $bg-primary;
    border: 1px solid $line-200;
    flex-shrink: 0;
  }

  &__cloneCardTitle {
    display: block;
    font-size: $font-size-body3;
    font-weight: $font-weight-medium;
    color: $text-900;
    @include truncate;
    width: 100%;
  }
}
</style>
