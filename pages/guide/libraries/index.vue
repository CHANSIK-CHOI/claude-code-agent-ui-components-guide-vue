<template>
  <div class="LibrariesGuidePage">
    <!-- 헤더 -->
    <header class="LibrariesGuidePage__header">
      <div class="LibrariesGuidePage__meta">
        <span class="LibrariesGuidePage__badge">policy</span>
      </div>
      <h1 class="LibrariesGuidePage__title">외부 라이브러리 정책</h1>
      <p class="LibrariesGuidePage__desc">
        엔터프라이즈 프로덕션 환경 안정성을 위해 외부 UI 라이브러리 컴포넌트의
        <strong>stability</strong>에 따라 사용 가능 여부를 정의합니다.<br />
        상세 규칙은 <code>.claude/rules/libraries.md</code>를 참조하세요.
      </p>
    </header>

    <div class="LibrariesGuidePage__notice">
      <strong>확인일자:</strong> 2026-06-01 / Radix Vue 1.x 기준 ·
      <strong>재확인 시점:</strong> 분기 1회, 또는 신규 컴포넌트 도입 검토 시
    </div>

    <!-- ① 핵심 원칙 -->
    <section class="LibrariesGuidePage__section">
      <h2 class="LibrariesGuidePage__sectionTitle">① 핵심 원칙</h2>
      <ul class="LibrariesGuidePage__list">
        <li>엔터프라이즈 프로덕션 환경에서는 Radix Vue <strong>Stable 컴포넌트만</strong> 사용한다.</li>
        <li><strong>Alpha 컴포넌트는 사용 금지</strong> — 기능별 대체안(아래 ③)을 따른다.</li>
        <li>신규 외부 라이브러리 도입 전 <code>rules/libraries.md</code>에 stability·대체안 정책을 추가한다.</li>
      </ul>
    </section>

    <!-- ② Stable 그룹 -->
    <section class="LibrariesGuidePage__section">
      <h2 class="LibrariesGuidePage__sectionTitle">② Radix Vue Stable — 적극 사용</h2>
      <p class="LibrariesGuidePage__note">
        React Radix UI에서 포팅된 검증된 컴포넌트. 본 프로젝트에서 자유롭게 사용합니다.
      </p>

      <div class="LibrariesGuidePage__tableWrap">
      <table class="LibrariesGuidePage__table">
        <thead>
          <tr>
            <th>분류</th>
            <th>컴포넌트</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>오버레이</td>
            <td>
              <code>Dialog</code>, <code>AlertDialog</code>, <code>Popover</code>,
              <code>HoverCard</code>, <code>Tooltip</code>, <code>Toast</code>
            </td>
          </tr>
          <tr>
            <td>메뉴 / 네비게이션</td>
            <td>
              <code>DropdownMenu</code>, <code>ContextMenu</code>, <code>Menubar</code>,
              <code>NavigationMenu</code>, <code>Tabs</code>, <code>Toolbar</code>
            </td>
          </tr>
          <tr>
            <td>폼</td>
            <td>
              <code>Checkbox</code>, <code>RadioGroup</code>, <code>Switch</code>,
              <code>Select</code>, <code>Slider</code>, <code>Label</code>,
              <code>Toggle</code>, <code>ToggleGroup</code>
            </td>
          </tr>
          <tr>
            <td>레이아웃 / 표시</td>
            <td>
              <code>Accordion</code>, <code>Collapsible</code>, <code>AspectRatio</code>,
              <code>Avatar</code>, <code>Progress</code>, <code>ScrollArea</code>,
              <code>Separator</code>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </section>

    <!-- ③ Alpha 그룹 -->
    <section class="LibrariesGuidePage__section">
      <h2 class="LibrariesGuidePage__sectionTitle">③ Radix Vue Alpha — 사용 금지 + 대체안</h2>
      <p class="LibrariesGuidePage__note">
        Alpha 컴포넌트는 API 변경 가능성이 높아 프로덕션 사용에 부적합합니다.
        아래 대체 전략을 따르세요.
      </p>

      <div class="LibrariesGuidePage__tableWrap">
      <table class="LibrariesGuidePage__table">
        <thead>
          <tr>
            <th>Radix Vue Alpha 컴포넌트</th>
            <th>대체 전략</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>Calendar</code>, <code>DatePicker</code>, <code>DateField</code>,<br />
              <code>RangeCalendar</code>, <code>DateRangePicker</code>, <code>DateRangeField</code>
            </td>
            <td><code>vant DatePicker / Picker / PickerGroup</code> 래핑</td>
            <td>온디맨드 import — <code>plugins/vant.ts</code>. 3개 컴포넌트만 허용</td>
          </tr>
          <tr>
            <td><code>Combobox</code> (검색형 Select)</td>
            <td>Stable <code>Select</code> + 검색 필터 자체 추가, 또는 라이브러리 협의</td>
            <td>도입 시점에 사용자와 협의</td>
          </tr>
          <tr>
            <td><code>Listbox</code></td>
            <td>Stable <code>Select</code>로 대체</td>
            <td>다중선택 필요 시 자체 구현</td>
          </tr>
          <tr>
            <td><code>NumberField</code></td>
            <td>네이티브 <code>&lt;input type="number"&gt;</code> + 자체 step 컨트롤</td>
            <td>단순 마크업</td>
          </tr>
          <tr>
            <td><code>PinInput</code></td>
            <td>자체 구현 (input 분할 조합)</td>
            <td>단순 마크업</td>
          </tr>
          <tr>
            <td><code>Splitter</code></td>
            <td>자체 구현 또는 별도 라이브러리 검토</td>
            <td>도입 시점에 협의</td>
          </tr>
          <tr>
            <td><code>Stepper</code></td>
            <td>자체 구현</td>
            <td>단순 마크업</td>
          </tr>
          <tr>
            <td><code>TagsInput</code></td>
            <td>자체 구현</td>
            <td>단순 마크업</td>
          </tr>
          <tr>
            <td><code>Tree</code></td>
            <td>자체 구현 또는 별도 라이브러리 검토</td>
            <td>도입 시점에 협의</td>
          </tr>
          <tr>
            <td><code>Editable</code> (인라인 편집)</td>
            <td>자체 구현 (display ↔ input 토글)</td>
            <td>단순 마크업</td>
          </tr>
          <tr>
            <td><code>Pagination</code></td>
            <td>자체 구현</td>
            <td>단순 마크업</td>
          </tr>
        </tbody>
      </table>
      </div>

      <p class="LibrariesGuidePage__sub">
        <strong>대체안이 "자체 구현"인 항목:</strong> 컴포넌트 명세를
        <code>uiux-planner-agents</code>로 먼저 작성한 뒤
        <code>uiux-publisher-agents</code>가 구현합니다.
        Radix Vue Alpha 코드를 임시로라도 끌어 쓰지 않습니다.
      </p>
    </section>

    <!-- ④ 비-Radix 외부 라이브러리 -->
    <section class="LibrariesGuidePage__section">
      <h2 class="LibrariesGuidePage__sectionTitle">④ 비-Radix 외부 라이브러리</h2>

      <div class="LibrariesGuidePage__tableWrap">
      <table class="LibrariesGuidePage__table">
        <thead>
          <tr>
            <th>라이브러리</th>
            <th>버전</th>
            <th>용도</th>
            <th>정책</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>vant</code></td>
            <td><code>^4.9.24</code></td>
            <td>DatePicker, Picker, PickerGroup</td>
            <td>온디맨드 import (<code>plugins/vant.ts</code>) — 이 3개 컴포넌트만 허용. 전체 CSS 사용 금지, 컴포넌트별 스타일 로드</td>
          </tr>
          <tr>
            <td><code>radix-vue</code></td>
            <td>(Stable 한정)</td>
            <td>헤드리스 UI</td>
            <td>Stable 컴포넌트만 사용</td>
          </tr>
        </tbody>
      </table>
      </div>
    </section>

    <!-- ⑤ 신규 도입 절차 -->
    <section class="LibrariesGuidePage__section">
      <h2 class="LibrariesGuidePage__sectionTitle">⑤ 신규 라이브러리 도입 절차</h2>
      <ol class="LibrariesGuidePage__orderedList">
        <li>Context7 MCP로 stability 확인 — Alpha / Beta / Deprecated 여부 점검</li>
        <li>
          <code>rules/libraries.md</code>의 매트릭스에 추가 — 라이브러리명, 버전, 용도,
          stability, 대체안
        </li>
        <li><code>CLAUDE.md</code> "개발 환경" 섹션 갱신 — 도입 확정 시 라이브러리명 추가</li>
        <li>사용자 승인 — 자동 도입 금지. 정책 변경은 반드시 사용자 확인</li>
      </ol>
    </section>

    <!-- ⑥ Stale 신호 -->
    <section class="LibrariesGuidePage__section">
      <h2 class="LibrariesGuidePage__sectionTitle">⑥ Stability 정보가 stale 하다는 신호</h2>
      <p class="LibrariesGuidePage__note">
        다음 상황에서는 본 정책 페이지 / <code>rules/libraries.md</code>를 신뢰하지 말고
        Context7 MCP로 즉시 재확인하세요.
      </p>
      <ul class="LibrariesGuidePage__list">
        <li>본 문서의 <strong>확인일자</strong>가 3개월 이상 지난 경우</li>
        <li>Radix Vue 메이저 버전(2.x 등) 업데이트가 있었던 경우</li>
        <li>"Alpha 였는데 Stable 됐다" 등 변경 가능성이 언급된 경우</li>
        <li>명세 / 구현 진행 중 본 문서와 라이브러리 실제 동작이 어긋나는 경우</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "guide" });
</script>

<style lang="scss" scoped src="./libraries.scss"></style>
