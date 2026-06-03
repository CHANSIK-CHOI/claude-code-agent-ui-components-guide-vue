<template>
  <div class="paginationGuidePage">
    <!-- 헤더 -->
    <header class="paginationGuidePage__header">
      <div class="paginationGuidePage__meta">
        <span class="paginationGuidePage__badge">molecules</span>
      </div>
      <h1 class="paginationGuidePage__title">Pagination</h1>
      <p class="paginationGuidePage__desc">
        번호형 페이지네이션 컴포넌트.<br />
        페이지 번호 목록과 이전/다음 버튼으로 구성되며, Radix Vue <code>PaginationRoot</code>를 래핑한다.<br />
        <code>siblingCount</code>로 현재 페이지 양옆에 표시할 번호 수를 조정할 수 있다.
      </p>
    </header>

    <!-- ① 기본 사용 -->
    <section class="paginationGuidePage__section">
      <h2 class="paginationGuidePage__sectionTitle">① 기본 사용</h2>
      <p class="paginationGuidePage__note">
        <code>:total</code>은 전체 항목 수, <code>:items-per-page</code>는 페이지당 항목 수.
        현재 페이지: <strong>{{ basicPage }}</strong>
      </p>
      <div class="paginationGuidePage__demo">
        <Pagination v-model:page="basicPage" :total="100" :items-per-page="10" />
      </div>
      <pre class="paginationGuidePage__code"><code>&lt;Pagination v-model:page="currentPage" :total="100" :items-per-page="10" /&gt;</code></pre>
    </section>

    <!-- ② siblingCount 변형 -->
    <section class="paginationGuidePage__section">
      <h2 class="paginationGuidePage__sectionTitle">② siblingCount 변형</h2>
      <p class="paginationGuidePage__note">
        현재 페이지 양옆에 표시할 번호 수. 기본값 <code>2</code>.
      </p>
      <div class="paginationGuidePage__group">
        <div v-for="sc in siblingCounts" :key="sc" class="paginationGuidePage__item">
          <span class="paginationGuidePage__itemLabel">siblingCount={{ sc }}</span>
          <Pagination
            v-model:page="siblingPages[sc]"
            :total="200"
            :items-per-page="10"
            :sibling-count="sc"
          />
          <pre class="paginationGuidePage__code"><code>&lt;Pagination :total="200" :items-per-page="10" :sibling-count="{{ sc }}" /&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- ③ disabled 상태 -->
    <section class="paginationGuidePage__section">
      <h2 class="paginationGuidePage__sectionTitle">③ disabled 상태</h2>
      <p class="paginationGuidePage__note">
        <code>:disabled="true"</code>로 전체 비활성화. 모든 버튼 클릭이 차단된다.
      </p>
      <div class="paginationGuidePage__demo">
        <Pagination :page="3" :total="100" :items-per-page="10" :disabled="true" />
      </div>
      <pre class="paginationGuidePage__code"><code>&lt;Pagination :page="3" :total="100" :items-per-page="10" :disabled="true" /&gt;</code></pre>
    </section>

    <!-- ④ 첫 페이지 / 마지막 페이지 경계 상태 -->
    <section class="paginationGuidePage__section">
      <h2 class="paginationGuidePage__sectionTitle">④ 첫 페이지 / 마지막 페이지 경계</h2>
      <p class="paginationGuidePage__note">
        첫 페이지에서 이전 버튼이, 마지막 페이지에서 다음 버튼이 비활성화된다 (Radix Vue 자동 처리).
      </p>
      <div class="paginationGuidePage__group">
        <div class="paginationGuidePage__item">
          <span class="paginationGuidePage__itemLabel">첫 페이지 (page=1) — 이전 버튼 비활성</span>
          <Pagination :page="1" :total="50" :items-per-page="10" />
        </div>
        <div class="paginationGuidePage__item">
          <span class="paginationGuidePage__itemLabel">마지막 페이지 (page=5, total=50) — 다음 버튼 비활성</span>
          <Pagination :page="5" :total="50" :items-per-page="10" />
        </div>
      </div>
    </section>

    <!-- ⑤ 말줄임(...) 표시 -->
    <section class="paginationGuidePage__section">
      <h2 class="paginationGuidePage__sectionTitle">⑤ 말줄임(…) 표시</h2>
      <p class="paginationGuidePage__note">
        총 페이지 수가 많고 현재 페이지가 가운데에 있을 때, 생략 구간이 <code>…</code>으로 표시된다 (Radix Vue PaginationEllipsis).
        현재 페이지: <strong>{{ ellipsisPage }}</strong>
      </p>
      <div class="paginationGuidePage__demo">
        <Pagination v-model:page="ellipsisPage" :total="500" :items-per-page="10" :sibling-count="2" />
      </div>
      <pre class="paginationGuidePage__code"><code>&lt;Pagination v-model:page="currentPage" :total="500" :items-per-page="10" :sibling-count="2" /&gt;</code></pre>
    </section>

    <!-- ⑥ Props / Events 테이블 -->
    <section class="paginationGuidePage__section">
      <h2 class="paginationGuidePage__sectionTitle">⑥ Props / Events</h2>

      <h3 class="paginationGuidePage__tableTitle">Props</h3>
      <div class="paginationGuidePage__propsTableWrap">
        <table class="paginationGuidePage__propsTable">
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
              <td><code>page</code></td>
              <td><code>number</code></td>
              <td><code>1</code></td>
              <td>현재 페이지 번호 (v-model:page)</td>
            </tr>
            <tr>
              <td><code>total</code></td>
              <td><code>number</code></td>
              <td><code>0</code></td>
              <td>전체 항목 수. 내부적으로 total ÷ itemsPerPage로 총 페이지 수를 계산한다</td>
            </tr>
            <tr>
              <td><code>itemsPerPage</code></td>
              <td><code>number</code></td>
              <td><code>10</code></td>
              <td>페이지당 항목 수</td>
            </tr>
            <tr>
              <td><code>siblingCount</code></td>
              <td><code>number</code></td>
              <td><code>2</code></td>
              <td>현재 페이지 양옆에 표시할 번호 수. 값이 클수록 더 많은 번호 버튼이 노출된다</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>전체 비활성화. 모든 버튼 클릭 차단</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="paginationGuidePage__tableTitle">Events</h3>
      <div class="paginationGuidePage__propsTableWrap">
        <table class="paginationGuidePage__propsTable">
          <thead>
            <tr>
              <th>이름</th>
              <th>페이로드</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>update:page</code></td>
              <td><code>number</code></td>
              <td>페이지 번호 버튼 또는 이전/다음 버튼 클릭 시 변경된 페이지 번호를 emit. <code>v-model:page</code>로 양방향 바인딩 가능</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="paginationGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는 <code>v-bind="$attrs"</code>를 사용하므로
        위 Props 외에도 <code>aria-*</code>, <code>data-*</code>, <code>tabindex</code> 등의 HTML 속성을
        <code>PaginationRoot</code>(네비게이션 루트 요소)에 그대로 전달할 수 있습니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>

      <p class="paginationGuidePage__radixNote">
        이 컴포넌트는 <strong>Radix Vue</strong>를 기반으로 합니다.
        위 Props 외에도 Radix Vue가 지원하는 추가 props를 사용할 수 있습니다.
        전체 API는
        <a href="https://www.radix-vue.com" target="_blank" rel="noopener noreferrer">radix-vue.com 공식 문서</a>
        또는 Context7 MCP(<code>mcp__context7__query-docs</code>)를 통해 확인하세요.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ layout: 'guide' })

  const basicPage = ref(1)
  const ellipsisPage = ref(6)

  const siblingCounts = [1, 2, 3] as const
  const siblingPages = reactive<Record<number, number>>({
    1: 5,
    2: 5,
    3: 5,
  })
</script>

<style lang="scss" scoped>
  $b: 'paginationGuidePage';

  .#{$b} {
    padding: $spacing-lg;
    max-width: 100%;
  }

  .#{$b}__header {
    margin-bottom: $spacing-xl;
  }

  .#{$b}__meta {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-sm;
  }

  .#{$b}__badge {
    display: flex;
    align-items: center;
    padding: 0.2rem 0.8rem;
    border-radius: $radius-sm;
    font-size: $font-size-caption1;
    font-weight: $font-weight-medium;
    background-color: $bg-accent-sky-blue;
    color: $color-primary;
  }

  .#{$b}__title {
    font-size: $font-size-h2;
    font-weight: $font-weight-bold;
    color: $text-900;
    margin-bottom: $spacing-sm;
  }

  .#{$b}__desc {
    font-size: $font-size-body3;
    color: $text-600;
    line-height: $line-height-base;
  }

  .#{$b}__section {
    margin-bottom: $spacing-2xl;
  }

  .#{$b}__sectionTitle {
    font-size: $font-size-h4;
    font-weight: $font-weight-bold;
    color: $text-900;
    margin-bottom: $spacing-md;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid $line-200;
  }

  .#{$b}__group {
    display: flex;
    flex-direction: column;
    gap: $spacing-xl;
  }

  .#{$b}__item {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    width: 100%;
  }

  .#{$b}__itemLabel {
    font-size: $font-size-caption1;
    color: $text-400;
    font-weight: $font-weight-medium;
  }

  .#{$b}__demo {
    padding: $spacing-lg;
    background-color: $bg-secondary;
    border: 1px solid $line-200;
    border-radius: $radius-md;
    margin-bottom: $spacing-sm;
  }

  .#{$b}__note {
    margin-bottom: $spacing-sm;
    font-size: $font-size-body3;
    color: $text-600;
    line-height: $line-height-base;
  }

  .#{$b}__code {
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

  .#{$b}__tableTitle {
    font-size: $font-size-body2;
    font-weight: $font-weight-bold;
    color: $text-900;
    margin-top: $spacing-lg;
    margin-bottom: $spacing-sm;
  }

  .#{$b}__propsTableWrap {
    overflow-x: auto;
  }

  .#{$b}__propsTable {
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

  .#{$b}__delegationNote {
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

  .#{$b}__radixNote {
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
</style>
