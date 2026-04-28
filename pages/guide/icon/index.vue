<template>
  <div class="iconGuidePage">
    <!-- 헤더 -->
    <header class="iconGuidePage__header">
      <div class="iconGuidePage__meta">
        <span class="iconGuidePage__badge">icons</span>
      </div>
      <h1 class="iconGuidePage__title">Icon</h1>
      <p class="iconGuidePage__desc">
        SVG 기반 아이콘 시스템. <code>Icon.vue</code> Base 컴포넌트 위에 개별
        아이콘을 render function으로 정의합니다.<br />
        <code>size</code> / <code>color</code> / <code>label</code> prop으로
        크기·색상·접근성을 제어합니다.
      </p>
    </header>

    <!-- ① 사이즈별 아이콘 목록 -->
    <section class="iconGuidePage__section">
      <h2 class="iconGuidePage__sectionTitle">① 사이즈별 아이콘</h2>
      <p class="iconGuidePage__note">
        현재 등록된 아이콘 목록입니다. 아이콘 추가는
        <code>components/icons/index.ts</code>에서
        <code>makeIcon()</code> 패턴으로 추가하세요.
      </p>

      <!-- lg 그룹 (40px) -->
      <div class="iconGuidePage__group">
        <p class="iconGuidePage__groupTitle">size="lg" — 40px</p>

        <p class="iconGuidePage__subGroupTitle">색상 고정 (skipsvgo)</p>
        <div class="iconGuidePage__iconGrid">
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <DocumentIcon />
            </div>
            <span class="iconGuidePage__iconName">DocumentIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <BigCircularNoteIcon />
            </div>
            <span class="iconGuidePage__iconName">BigCircularNoteIcon</span>
          </div>
        </div>
      </div>

      <!-- md 그룹 (24px) -->
      <div class="iconGuidePage__group">
        <p class="iconGuidePage__groupTitle">size="md" — 24px</p>

        <p class="iconGuidePage__subGroupTitle">일반 (currentColor)</p>
        <div class="iconGuidePage__iconGrid">
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <CloseIcon />
            </div>
            <span class="iconGuidePage__iconName">CloseIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <SearchIcon />
            </div>
            <span class="iconGuidePage__iconName">SearchIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <UserIcon />
            </div>
            <span class="iconGuidePage__iconName">UserIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <ChevronLeftIcon />
            </div>
            <span class="iconGuidePage__iconName">ChevronLeftIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <ChevronRightIcon />
            </div>
            <span class="iconGuidePage__iconName">ChevronRightIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <CategoryIcon />
            </div>
            <span class="iconGuidePage__iconName">CategoryIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <HomeIcon />
            </div>
            <span class="iconGuidePage__iconName">HomeIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <LogoutIcon />
            </div>
            <span class="iconGuidePage__iconName">LogoutIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <CalenderIcon />
            </div>
            <span class="iconGuidePage__iconName">CalenderIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <PlusIcon />
            </div>
            <span class="iconGuidePage__iconName">PlusIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <DeleteIcon />
            </div>
            <span class="iconGuidePage__iconName">DeleteIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <TimeIcon />
            </div>
            <span class="iconGuidePage__iconName">TimeIcon</span>
          </div>
        </div>

        <p class="iconGuidePage__subGroupTitle">색상 고정 (skipsvgo)</p>
        <div class="iconGuidePage__iconGrid">
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <LeftIcon />
            </div>
            <span class="iconGuidePage__iconName">LeftIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <RightIcon />
            </div>
            <span class="iconGuidePage__iconName">RightIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <PlayIcon />
            </div>
            <span class="iconGuidePage__iconName">PlayIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <GridIcon />
            </div>
            <span class="iconGuidePage__iconName">GridIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <ListIcon />
            </div>
            <span class="iconGuidePage__iconName">ListIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <HeartFullIcon />
            </div>
            <span class="iconGuidePage__iconName">HeartFullIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <HeartIcon />
            </div>
            <span class="iconGuidePage__iconName">HeartIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <CartIcon />
            </div>
            <span class="iconGuidePage__iconName">CartIcon</span>
          </div>
        </div>
      </div>

      <!-- sm 그룹 (16px) -->
      <div class="iconGuidePage__group">
        <p class="iconGuidePage__groupTitle">size="sm" — 16px</p>

        <p class="iconGuidePage__subGroupTitle">일반 (currentColor)</p>
        <div class="iconGuidePage__iconGrid">
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <SmallChevronDownIcon />
            </div>
            <span class="iconGuidePage__iconName">SmallChevronDownIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <SmallChevronUpIcon />
            </div>
            <span class="iconGuidePage__iconName">SmallChevronUpIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <SmallChevronLeftIcon />
            </div>
            <span class="iconGuidePage__iconName">SmallChevronLeftIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <SmallChevronRightIcon />
            </div>
            <span class="iconGuidePage__iconName">SmallChevronRightIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <SmallPlusIcon />
            </div>
            <span class="iconGuidePage__iconName">SmallPlusIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <SmallCloseIcon />
            </div>
            <span class="iconGuidePage__iconName">SmallCloseIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <SmallBagIcon />
            </div>
            <span class="iconGuidePage__iconName">SmallBagIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <SmallGreatIcon />
            </div>
            <span class="iconGuidePage__iconName">SmallGreatIcon</span>
          </div>
        </div>

        <p class="iconGuidePage__subGroupTitle">색상 고정 (skipsvgo)</p>
        <div class="iconGuidePage__iconGrid">
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <TooltipIcon />
            </div>
            <span class="iconGuidePage__iconName">TooltipIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <CircularNoteIcon />
            </div>
            <span class="iconGuidePage__iconName">CircularNoteIcon</span>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <CircularArrowIcon />
            </div>
            <span class="iconGuidePage__iconName">CircularArrowIcon</span>
          </div>
        </div>
      </div>

      <!-- xs 그룹 (8px) -->
      <div class="iconGuidePage__group">
        <p class="iconGuidePage__groupTitle">size="xs" — 8px</p>

        <p class="iconGuidePage__subGroupTitle">색상 고정 (skipsvgo)</p>
        <div class="iconGuidePage__iconGrid">
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <StarIcon />
            </div>
            <span class="iconGuidePage__iconName">StarIcon</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ② 색상 제어 -->
    <section class="iconGuidePage__section">
      <h2 class="iconGuidePage__sectionTitle">② 색상 제어</h2>
      <p class="iconGuidePage__note">
        <code>color</code> prop 미전달 시 부모의 CSS <code>color</code> 값을
        <code>currentColor</code>로 상속합니다.
      </p>

      <div class="iconGuidePage__row">
        <div class="iconGuidePage__item">
          <span class="iconGuidePage__itemLabel">color prop 직접 지정</span>
          <div class="iconGuidePage__iconPreview">
            <HomeIcon color="#0CB5E2" />
          </div>
          <pre
            class="iconGuidePage__code"
          ><code>&lt;HomeIcon color="#0CB5E2" /&gt;</code></pre>
        </div>

        <div class="iconGuidePage__item">
          <span class="iconGuidePage__itemLabel"
            >부모 color 상속 (currentColor)</span
          >
          <div
            class="iconGuidePage__iconPreview iconGuidePage__iconPreview--colored"
          >
            <HomeIcon />
          </div>
          <pre
            class="iconGuidePage__code"
          ><code>&lt;span style="color: #0CB5E2;"&gt;
  &lt;HomeIcon /&gt;
&lt;/span&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- ③ Cart 배지 -->
    <section class="iconGuidePage__section">
      <h2 class="iconGuidePage__sectionTitle">③ Cart 배지</h2>
      <p class="iconGuidePage__note">
        <code>count</code> prop으로 배지를 제어합니다. 99 초과 시
        <code>99+</code>로 표시됩니다.
      </p>

      <div class="iconGuidePage__row iconGuidePage__row--horizontal">
        <div class="iconGuidePage__item">
          <span class="iconGuidePage__itemLabel">배지 없음 (기본)</span>
          <div class="iconGuidePage__iconPreview">
            <CartIcon />
          </div>
          <pre class="iconGuidePage__code"><code>&lt;CartIcon /&gt;</code></pre>
        </div>

        <div class="iconGuidePage__item">
          <span class="iconGuidePage__itemLabel">count=3</span>
          <div class="iconGuidePage__iconPreview">
            <CartIcon :count="3" />
          </div>
          <pre
            class="iconGuidePage__code"
          ><code>&lt;CartIcon :count="3" /&gt;</code></pre>
        </div>

        <div class="iconGuidePage__item">
          <span class="iconGuidePage__itemLabel">count=99</span>
          <div class="iconGuidePage__iconPreview">
            <CartIcon :count="99" />
          </div>
          <pre
            class="iconGuidePage__code"
          ><code>&lt;CartIcon :count="99" /&gt;</code></pre>
        </div>

        <div class="iconGuidePage__item">
          <span class="iconGuidePage__itemLabel">count=100 (99+ 표시)</span>
          <div class="iconGuidePage__iconPreview">
            <CartIcon :count="100" />
          </div>
          <pre
            class="iconGuidePage__code"
          ><code>&lt;CartIcon :count="100" /&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- ④ 접근성 -->
    <section class="iconGuidePage__section">
      <h2 class="iconGuidePage__sectionTitle">④ 접근성</h2>

      <div class="iconGuidePage__row">
        <div class="iconGuidePage__item">
          <span class="iconGuidePage__itemLabel"
            >장식 아이콘 (기본) — aria-hidden="true"</span
          >
          <div class="iconGuidePage__iconPreview">
            <HomeIcon />
          </div>
          <pre
            class="iconGuidePage__code"
          ><code>&lt;!-- aria-hidden="true" 자동 적용 --&gt;
&lt;HomeIcon /&gt;</code></pre>
        </div>

        <div class="iconGuidePage__item">
          <span class="iconGuidePage__itemLabel"
            >의미 있는 아이콘 — label prop 전달</span
          >
          <div class="iconGuidePage__iconPreview">
            <HomeIcon label="홈으로 이동" />
          </div>
          <pre
            class="iconGuidePage__code"
          ><code>&lt;!-- aria-label="홈으로 이동" + role="img" 자동 적용 --&gt;
&lt;HomeIcon label="홈으로 이동" /&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- ⑤ 아이콘 추가 방법 -->
    <section class="iconGuidePage__section">
      <h2 class="iconGuidePage__sectionTitle">⑤ 아이콘 추가 방법</h2>
      <p class="iconGuidePage__note">
        Figma에서 SVG 내보내기 후 <code>components/icons/index.ts</code>에 아래
        패턴으로 추가하세요.
      </p>
      <pre class="iconGuidePage__code"><code>// 1. assets/icons/ 에 SVG 파일 추가 (예: newIcon.svg)

// 2. components/icons/index.ts 에 import 추가
import NewIconSvg from '~/assets/icons/newIcon.svg'
//   색상 고정이 필요한 경우: ?skipsvgo

// 3. makeIcon으로 export 추가
export const NewIcon = makeIcon('NewIcon', 'md', NewIconSvg as Component)</code></pre>
    </section>

    <!-- ⑥ Props -->
    <section class="iconGuidePage__section">
      <h2 class="iconGuidePage__sectionTitle">⑥ Props</h2>

      <h3 class="iconGuidePage__tableTitle">Icon.vue (Base)</h3>
      <table class="iconGuidePage__propsTable">
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
            <td><code>size</code></td>
            <td><code>'xs' | 'sm' | 'md' | 'lg'</code></td>
            <td><code>'md'</code></td>
            <td>아이콘 크기 (8 / 16 / 24 / 40px)</td>
          </tr>
          <tr>
            <td><code>color</code></td>
            <td><code>string | undefined</code></td>
            <td><code>undefined</code></td>
            <td>CSS color 값. 미전달 시 부모 color 상속</td>
          </tr>
          <tr>
            <td><code>label</code></td>
            <td><code>string | undefined</code></td>
            <td><code>undefined</code></td>
            <td>접근성 라벨. 전달 시 aria-label + role="img" 적용</td>
          </tr>
        </tbody>
      </table>

      <h3 class="iconGuidePage__tableTitle">Cart 추가 Props</h3>
      <table class="iconGuidePage__propsTable">
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
            <td><code>count</code></td>
            <td><code>number | undefined</code></td>
            <td><code>undefined</code></td>
            <td>
              배지 숫자. undefined 또는 0이면 배지 미표시. 99 초과 시 '99+' 표시
            </td>
          </tr>
        </tbody>
      </table>

      <h3 class="iconGuidePage__tableTitle">Slots (Icon.vue)</h3>
      <table class="iconGuidePage__propsTable">
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
            <td>SVG 엘리먼트를 삽입하는 슬롯</td>
          </tr>
        </tbody>
      </table>

      <p class="iconGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는
        <code>v-bind="$attrs"</code>를 사용하므로 위 Props 외에도
        <code>&lt;span&gt;</code> 요소의 모든 네이티브 HTML 속성
        (<code>aria-label</code>, <code>tabindex</code>,
        <code>data-*</code> 등)을 그대로 전달할 수 있습니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  CloseIcon,
  SearchIcon,
  UserIcon,
  CartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  CategoryIcon,
  HomeIcon,
  LogoutIcon,
  CalenderIcon,
  PlusIcon,
  DeleteIcon,
  TimeIcon,
  LeftIcon,
  RightIcon,
  GridIcon,
  ListIcon,
  HeartFullIcon,
  HeartIcon,
  SmallChevronDownIcon,
  SmallChevronUpIcon,
  SmallChevronLeftIcon,
  SmallChevronRightIcon,
  SmallPlusIcon,
  TooltipIcon,
  CircularNoteIcon,
  SmallCloseIcon,
  SmallBagIcon,
  SmallGreatIcon,
  CircularArrowIcon,
  DocumentIcon,
  BigCircularNoteIcon,
  StarIcon,
} from "~/components/icons";

definePageMeta({ layout: "guide" });
</script>

<style lang="scss" scoped src="./icon.scss"></style>
