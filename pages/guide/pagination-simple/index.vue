<template>
  <div class="paginationSimpleGuidePage">
    <!-- 헤더 -->
    <header class="paginationSimpleGuidePage__header">
      <div class="paginationSimpleGuidePage__meta">
        <span class="paginationSimpleGuidePage__badge">molecules</span>
      </div>
      <h1 class="paginationSimpleGuidePage__title">PaginationSimple</h1>
      <p class="paginationSimpleGuidePage__desc">
        단순형 페이지네이션 컴포넌트.<br />
        페이지 번호 목록 대신 "<strong>현재 페이지</strong> / 전체 페이지" 텍스트와 이전/다음 버튼만 제공한다.<br />
        페이지 수가 매우 많거나 공간이 좁을 때 적합하다. Radix Vue 미사용 — 자체 마크업 구현.
      </p>
    </header>

    <!-- ① 기본 사용 -->
    <section class="paginationSimpleGuidePage__section">
      <h2 class="paginationSimpleGuidePage__sectionTitle">① 기본 사용</h2>
      <p class="paginationSimpleGuidePage__note">
        <code>:total-pages</code>는 전체 페이지 수 텍스트로 표시된다. 현재 페이지: <strong>{{ basicPage }}</strong>
      </p>
      <div class="paginationSimpleGuidePage__demo">
        <PaginationSimple v-model:page="basicPage" :total-pages="1234" />
      </div>
      <pre
        class="paginationSimpleGuidePage__code"
      ><code>&lt;PaginationSimple v-model:page="currentPage" :total-pages="1234" /&gt;</code></pre>
    </section>

    <!-- ② disabled 상태 -->
    <section class="paginationSimpleGuidePage__section">
      <h2 class="paginationSimpleGuidePage__sectionTitle">② disabled 상태</h2>
      <p class="paginationSimpleGuidePage__note">
        <code>:disabled="true"</code>로 전체 비활성화. 이전/다음 버튼 모두 클릭이 차단된다.
      </p>
      <div class="paginationSimpleGuidePage__demo">
        <PaginationSimple :page="5" :total-pages="100" :disabled="true" />
      </div>
      <pre
        class="paginationSimpleGuidePage__code"
      ><code>&lt;PaginationSimple :page="5" :total-pages="100" :disabled="true" /&gt;</code></pre>
    </section>

    <!-- ③ 경계 상태 -->
    <section class="paginationSimpleGuidePage__section">
      <h2 class="paginationSimpleGuidePage__sectionTitle">③ 첫 페이지 / 마지막 페이지 경계</h2>
      <p class="paginationSimpleGuidePage__note">
        첫 페이지에서 이전 버튼이, 마지막 페이지에서 다음 버튼이 <code>disabled</code> 처리된다.
      </p>
      <div class="paginationSimpleGuidePage__group">
        <div class="paginationSimpleGuidePage__item">
          <span class="paginationSimpleGuidePage__itemLabel">첫 페이지 (page=1) — 이전 버튼 비활성</span>
          <div class="paginationSimpleGuidePage__demo">
            <PaginationSimple :page="1" :total-pages="50" />
          </div>
        </div>
        <div class="paginationSimpleGuidePage__item">
          <span class="paginationSimpleGuidePage__itemLabel"
            >마지막 페이지 (page=50, totalPages=50) — 다음 버튼 비활성</span
          >
          <div class="paginationSimpleGuidePage__demo">
            <PaginationSimple :page="50" :total-pages="50" />
          </div>
        </div>
      </div>
    </section>

    <!-- ④ 변경 이력 -->
    <section class="paginationSimpleGuidePage__section">
      <h2 class="paginationSimpleGuidePage__sectionTitle">④ 변경 이력 (2026-05-11)</h2>
      <p class="paginationSimpleGuidePage__note">이번 업데이트에서 반영된 시각 변경 사항:</p>
      <ul class="paginationSimpleGuidePage__changeList">
        <li>버튼 외형: 테두리 없음 → <code>1px solid $line-200</code> 테두리 추가</li>
        <li>버튼 아이콘 색상: <code>$text-600</code> → <code>$text-500</code> (#808080 근사)</li>
        <li>컴포넌트 gap: 없음 → <code>0.6rem</code></li>
      </ul>
      <div class="paginationSimpleGuidePage__demo">
        <PaginationSimple v-model:page="changedPage" :total-pages="200" />
      </div>
    </section>

    <!-- ⑤ Props / Events 테이블 -->
    <section class="paginationSimpleGuidePage__section">
      <h2 class="paginationSimpleGuidePage__sectionTitle">⑤ Props / Events</h2>

      <h3 class="paginationSimpleGuidePage__tableTitle">Props</h3>
      <div class="paginationSimpleGuidePage__propsTableWrap">
        <table class="paginationSimpleGuidePage__propsTable">
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
              <td>현재 페이지 번호 (v-model:page). Bold 텍스트로 표시된다</td>
            </tr>
            <tr>
              <td><code>totalPages</code></td>
              <td><code>number</code></td>
              <td><code>1</code></td>
              <td>전체 페이지 수. Regular 텍스트로 표시된다</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>전체 비활성화. 이전/다음 버튼 모두 클릭 차단</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="paginationSimpleGuidePage__tableTitle">Events</h3>
      <div class="paginationSimpleGuidePage__propsTableWrap">
        <table class="paginationSimpleGuidePage__propsTable">
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
              <td>이전/다음 버튼 클릭 시 변경된 페이지 번호를 emit. <code>v-model:page</code>로 양방향 바인딩 가능</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="paginationSimpleGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는 <code>v-bind="$attrs"</code>를 사용하므로 위 Props 외에도
        <code>&lt;div&gt;</code> 루트 요소의 모든 네이티브 HTML 속성 (<code>aria-label</code>, <code>id</code>,
        <code>data-*</code> 등)을 그대로 전달할 수 있습니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>
    </section>

    <!-- ⑥ 디자인 토큰 -->
    <section class="paginationSimpleGuidePage__section">
      <h2 class="paginationSimpleGuidePage__sectionTitle">⑥ 디자인 토큰</h2>
      <p class="paginationSimpleGuidePage__note">
        컴포넌트 스타일에 적용된 디자인 토큰 목록. 모든 색상·간격은 <code>_variables.scss</code> 시맨틱 토큰만 참조한다.
      </p>
      <div class="paginationSimpleGuidePage__propsTableWrap">
        <table class="paginationSimpleGuidePage__propsTable">
          <thead>
            <tr>
              <th>영역</th>
              <th>토큰</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>텍스트 색상</td>
              <td><code>$text-600</code></td>
              <td>현재 페이지·구분자·전체 페이지 텍스트 색상 (#535E66 근사)</td>
            </tr>
            <tr>
              <td>현재 페이지 폰트</td>
              <td><code>$font-size-body2</code>, <code>$font-weight-bold</code></td>
              <td>현재 페이지 번호 — Bold 14px</td>
            </tr>
            <tr>
              <td>전체 페이지 폰트</td>
              <td><code>$font-size-body2</code>, <code>$font-weight-regular</code></td>
              <td>전체 페이지 수 — Regular 14px</td>
            </tr>
            <tr>
              <td>버튼 영역 크기</td>
              <td><code>3.0rem × 3.0rem</code></td>
              <td>이전/다음 버튼 고정 크기 (30×30px)</td>
            </tr>
            <tr>
              <td>텍스트 영역 너비</td>
              <td><code>5.6rem</code></td>
              <td>현재/전체 페이지 텍스트 고정 너비 (56px)</td>
            </tr>
            <tr class="paginationSimpleGuidePage__propsTable--highlight">
              <td>버튼 테두리 색상</td>
              <td><code>$line-200</code></td>
              <td><strong>[변경]</strong> 테두리 없음 → 1px solid $line-200 (#DDDDDD 근사) 추가</td>
            </tr>
            <tr class="paginationSimpleGuidePage__propsTable--highlight">
              <td>버튼 아이콘 색상</td>
              <td><code>$text-500</code></td>
              <td><strong>[변경]</strong> $text-600 → $text-500 (#808080 근사)으로 변경</td>
            </tr>
            <tr class="paginationSimpleGuidePage__propsTable--highlight">
              <td>버튼 간 gap</td>
              <td><code>0.6rem</code></td>
              <td><strong>[변경]</strong> gap 없음 → 0.6rem (6px) 추가</td>
            </tr>
            <tr>
              <td>애니메이션</td>
              <td><code>$duration-fast</code></td>
              <td>버튼 hover/disabled opacity 트랜지션</td>
            </tr>
            <tr>
              <td>포커스 링</td>
              <td><code>$color-primary</code>, <code>$radius-sm</code></td>
              <td>:focus-visible box-shadow</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ layout: 'guide' })

  const basicPage = ref(2)
  const changedPage = ref(5)
</script>

<style lang="scss" scoped>
  $b: 'paginationSimpleGuidePage';

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

  .#{$b}__changeList {
    margin: 0 0 $spacing-md;
    padding-left: $spacing-lg;
    font-size: $font-size-body3;
    color: $text-600;
    line-height: $line-height-base;

    li {
      margin-bottom: $spacing-xs;
    }

    code {
      background-color: $bg-tertiary;
      padding: 0.1rem 0.4rem;
      border-radius: $radius-sm;
      font-size: $font-size-caption1;
    }
  }

  .#{$b}__propsTable--highlight {
    background-color: $bg-accent-light-blue;

    td {
      color: $text-900;
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
</style>
