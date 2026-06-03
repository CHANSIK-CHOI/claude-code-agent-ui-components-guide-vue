<template>
  <div class="fullPopupGuidePage">
    <header class="fullPopupGuidePage__header">
      <div class="fullPopupGuidePage__meta">
        <span class="fullPopupGuidePage__badge">organisms</span>
      </div>
      <h1 class="fullPopupGuidePage__title">FullPopup</h1>
      <p class="fullPopupGuidePage__desc">
        화면 전체를 덮는 팝업입니다. 오른쪽에서 슬라이드 인 하는 애니메이션으로 네이티브 앱의 화면 전환 느낌을
        줍니다.<br />
        헤더 우측 X 버튼으로 닫습니다. (<code>aria-label="닫기"</code>)<br />
        팝업 open 제어는 <code>v-model:open</code>(defineModel) 표준을 따릅니다. 상세: <code>rules/popups.md §3</code>
      </p>
    </header>

    <!-- ① 기본 FullPopup -->
    <section class="fullPopupGuidePage__section">
      <h2 class="fullPopupGuidePage__sectionTitle">① 기본 FullPopup</h2>
      <div class="fullPopupGuidePage__group">
        <p class="fullPopupGuidePage__note">
          헤더 X 버튼(cancel/close 의미)과 footer ok 버튼의 역할 분리를 확인하세요. X 버튼 클릭 → 닫힘, ok 버튼 클릭 →
          적용(부모가 닫기 책임).
        </p>
        <div class="fullPopupGuidePage__row">
          <button type="button" class="fullPopupGuidePage__demoBtn" @click="isBasicOpen = true">
            기본 FullPopup 열기
          </button>
        </div>
        <FullPopupDemoBasic v-model:open="isBasicOpen" />
      </div>
    </section>

    <!-- ② 폼 입력 시나리오 -->
    <section class="fullPopupGuidePage__section">
      <h2 class="fullPopupGuidePage__sectionTitle">② 폼 입력 시나리오</h2>
      <div class="fullPopupGuidePage__group">
        <p class="fullPopupGuidePage__note">
          상세 필터 form + <code>#footer</code> slot의 [초기화] [적용] 패턴입니다. 헤더 X 버튼은 cancel(닫기), footer
          버튼은 적용 의미입니다.
        </p>
        <div class="fullPopupGuidePage__row">
          <button type="button" class="fullPopupGuidePage__demoBtn" @click="isFilterOpen = true">상세 필터 열기</button>
        </div>
        <FullPopupDemoFilter v-model:open="isFilterOpen" @apply="onFilterApply" />
      </div>
      <div v-if="appliedFilter" class="fullPopupGuidePage__result">
        <p>
          적용된 필터: <strong>{{ appliedFilter }}</strong>
        </p>
      </div>
    </section>

    <!-- ③ footer 없는 FullPopup -->
    <section class="fullPopupGuidePage__section">
      <h2 class="fullPopupGuidePage__sectionTitle">③ footer 없는 FullPopup</h2>
      <div class="fullPopupGuidePage__group">
        <p class="fullPopupGuidePage__note">
          <code>:show-footer="false"</code>를 전달하면 footer 영역 전체가 렌더링되지 않습니다. 이미지 뷰어, 약관 전문
          보기 등 확인/취소 액션이 불필요한 전체화면 팝업에 사용합니다.
        </p>
        <div class="fullPopupGuidePage__row">
          <button type="button" class="fullPopupGuidePage__demoBtn" @click="isNoFooterOpen = true">
            footer 없는 FullPopup 열기
          </button>
        </div>
        <FullPopupDemoNoFooter v-model:open="isNoFooterOpen" />
      </div>
    </section>

    <!-- ④ showClose=false -->
    <section class="fullPopupGuidePage__section">
      <h2 class="fullPopupGuidePage__sectionTitle">④ showClose=false</h2>
      <div class="fullPopupGuidePage__group">
        <p class="fullPopupGuidePage__note">
          <code>:show-close="false"</code> 적용 시 헤더 닫기(✕) 버튼이 렌더링되지 않습니다. footer ok 버튼 또는 ESC 키로
          닫을 수 있습니다. FullPopup은 <code>closeOnOverlay</code>가 항상 <code>false</code>이므로 dim 클릭으로는
          닫히지 않습니다.
        </p>
        <div class="fullPopupGuidePage__row">
          <button type="button" class="fullPopupGuidePage__demoBtn" @click="isNoCloseOpen = true">
            showClose=false 열기
          </button>
        </div>
        <FullPopupDemoNoClose v-model:open="isNoCloseOpen" />
      </div>
    </section>

    <!-- ⑤ bodyLabel 사용 예시 -->
    <section class="fullPopupGuidePage__section">
      <h2 class="fullPopupGuidePage__sectionTitle">⑤ bodyLabel 사용 예시</h2>
      <div class="fullPopupGuidePage__group">
        <p class="fullPopupGuidePage__note">
          <code>body-label</code> prop을 전달하면 body 콘텐츠 상단, slot 위에 안내 레이블 텍스트가 렌더링됩니다.
        </p>
        <div class="fullPopupGuidePage__row">
          <button type="button" class="fullPopupGuidePage__demoBtn" @click="isBodyLabelOpen = true">
            bodyLabel FullPopup 열기
          </button>
        </div>
        <FullPopup v-model:open="isBodyLabelOpen" title="주문 정보" body-label="주문 내역을 확인해주세요.">
          <p style="padding: 1.6rem">콘텐츠 영역</p>
        </FullPopup>
      </div>
    </section>

    <!-- ⑥ bodyNote 사용 예시 -->
    <section class="fullPopupGuidePage__section">
      <h2 class="fullPopupGuidePage__sectionTitle">⑥ bodyNote 사용 예시</h2>
      <div class="fullPopupGuidePage__group">
        <p class="fullPopupGuidePage__note">
          <code>body-note</code> prop을 전달하면 body 콘텐츠 하단, slot 아래에
          <code>&lt;Icon size="sm"&gt;&lt;CircularNoteSvg /&gt;&lt;/Icon&gt;</code> + 텍스트 조합의 도움말 문구가
          렌더링됩니다.
        </p>
        <div class="fullPopupGuidePage__row">
          <button type="button" class="fullPopupGuidePage__demoBtn" @click="isBodyNoteOpen = true">
            bodyNote FullPopup 열기
          </button>
        </div>
        <FullPopup
          v-model:open="isBodyNoteOpen"
          title="주문 정보 입력"
          body-note="입력하신 정보는 안전하게 보호됩니다."
        >
          <p style="padding: 1.6rem">콘텐츠 영역</p>
        </FullPopup>
      </div>
    </section>

    <!-- ⑦ Props / Slots / Events -->
    <section class="fullPopupGuidePage__section">
      <h2 class="fullPopupGuidePage__sectionTitle">⑦ Props / Slots / Events</h2>

      <h3 class="fullPopupGuidePage__tableTitle">공통 Props</h3>
      <p class="fullPopupGuidePage__commonNote">
        아래 Props는 BottomSheet / LayerPopup / FullPopup에서 공통으로 지원합니다.<br />
        단, <code>showCancel</code>의 기본값은 이 컴포넌트에서 <code>false</code>입니다. (다른 팝업은 <code>true</code>)
      </p>
      <div class="fullPopupGuidePage__propsTableWrap">
        <table class="fullPopupGuidePage__propsTable">
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
              <td><code>open</code></td>
              <td><code>boolean</code></td>
              <td>— (필수)</td>
              <td>v-model:open 바인딩</td>
            </tr>
            <tr>
              <td><code>title</code></td>
              <td><code>string</code></td>
              <td>—</td>
              <td>헤더 타이틀 텍스트</td>
            </tr>
            <tr>
              <td><code>description</code></td>
              <td><code>string</code></td>
              <td>—</td>
              <td>a11y용 설명 텍스트</td>
            </tr>
            <tr>
              <td><code>showClose</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>헤더 닫기(×) 버튼 표시</td>
            </tr>
            <tr>
              <td><code>okLabel</code></td>
              <td><code>string</code></td>
              <td><code>'확인'</code></td>
              <td>ok 버튼 텍스트</td>
            </tr>
            <tr>
              <td><code>cancelLabel</code></td>
              <td><code>string</code></td>
              <td><code>'취소'</code></td>
              <td>cancel 버튼 텍스트</td>
            </tr>
            <tr>
              <td><code>showCancel</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code> ※ 이 컴포넌트 기본값</td>
              <td>cancel 버튼 표시. 전체화면 팝업은 헤더 X 버튼이 cancel 역할을 겸하므로 기본 숨김</td>
            </tr>
            <tr>
              <td><code>cancelColor</code></td>
              <td><code>'secondary' | 'gray'</code></td>
              <td><code>'gray'</code></td>
              <td>cancel 버튼 색상. <code>'secondary'</code>: 시안색(primary 계열), <code>'gray'</code>: 회색</td>
            </tr>
            <tr>
              <td><code>okColor</code></td>
              <td><code>'secondary' | 'primary' | 'black'</code></td>
              <td><code>'primary'</code></td>
              <td>ok 버튼 Button color prop</td>
            </tr>
            <tr>
              <td><code>okDisabled</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>ok 버튼 비활성</td>
            </tr>
            <tr>
              <td><code>closeOnEscape</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>ESC 키 입력 시 닫기</td>
            </tr>
            <tr>
              <td><code>closeOnCloseBtn</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>
                닫기(✕) 버튼 클릭 시 내부 자동 닫기 여부. <code>false</code>이면 <code>close</code> 이벤트만 emit되고
                자동으로 닫히지 않음 — 부모가 <code>@close</code>를 수신해 직접 닫아야 함. 비동기 처리 후 닫기 패턴에
                사용
              </td>
            </tr>
            <tr>
              <td><code>closeOnCancel</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>
                cancel 버튼 클릭 시 내부 자동 닫기 여부. <code>false</code>이면 <code>cancel</code> 이벤트만 emit되고
                자동으로 닫히지 않음 — 부모가 <code>@cancel</code>을 수신해 직접 닫아야 함
              </td>
            </tr>
            <tr>
              <td><code>showFooter</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>footer 영역 표시 여부. <code>false</code>면 footer 태그 자체가 렌더링되지 않음</td>
            </tr>
            <tr>
              <td><code>bodyLabel</code></td>
              <td><code>string</code></td>
              <td>—</td>
              <td>body 콘텐츠 상단에 표시할 안내 레이블 텍스트. slot 위에 렌더링되며 없으면 미표시.</td>
            </tr>
            <tr>
              <td><code>bodyNote</code></td>
              <td><code>string</code></td>
              <td>—</td>
              <td>body 콘텐츠 하단 도움말 문구. 아이콘+텍스트 조합. 없으면 미표시.</td>
            </tr>
            <tr>
              <td><code>deferContent</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>
                <code>true</code>이면 default slot(본문 콘텐츠)을 <strong>열림 애니메이션 완료 후에만 렌더</strong>한다.
                Tab·이미지 등 무거운 콘텐츠가 열림 슬라이드와 동시에 렌더될 때 transform 애니메이션이 최종
                위치로 스냅되는 문제를 회피하기 위함. 헤더/<code>body-label</code>/footer 셸은 즉시 렌더되고 default
                slot만 지연됨. 트레이드오프: 콘텐츠가 붙을 때 팝업 높이가 한 번 커짐. BottomSheet·FullPopup 등 slide
                타입에서 주로 유용. 베이스 <code>Popup</code>의 prop이며 모든 팝업 래퍼가 <code>$attrs</code>로 전달.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="fullPopupGuidePage__tableTitle">FullPopup 특이사항</h3>
      <p class="fullPopupGuidePage__commonNote">
        <code>closeOnOverlay</code> prop이 없습니다. FullPopup은 dim 클릭으로 닫히지 않도록 내부적으로 고정되어
        있습니다. 헤더 X 버튼(또는 ok/cancel 버튼)으로만 닫을 수 있습니다.
      </p>

      <h3 class="fullPopupGuidePage__tableTitle">FullPopup 전용 Props</h3>
      <div class="fullPopupGuidePage__propsTableWrap">
        <table class="fullPopupGuidePage__propsTable">
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
              <td><code>footerLayout</code></td>
              <td><code>'equal' | 'wide'</code></td>
              <td><code>'equal'</code></td>
              <td>
                footer 버튼 비율. <code>equal</code>: 50%/50% 균등, <code>wide</code>: cancel max-width 12rem + flex 120
                / ok flex 200. 내부적으로 footer 컨테이너에 CSS 변수(<code>--footer-cancel-flex</code>,
                <code>--footer-cancel-max</code>, <code>--footer-ok-flex</code>)를 주입하며,
                <code>> :first-child / > :last-child</code> 선택자로 <code>#footer</code> slot 커스텀 자식에도 동일하게
                적용됩니다.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="fullPopupGuidePage__tableTitle">Slots</h3>
      <div class="fullPopupGuidePage__propsTableWrap">
        <table class="fullPopupGuidePage__propsTable">
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
              <td>권장</td>
              <td>body 영역 콘텐츠 (전체화면 기준 스크롤)</td>
            </tr>
            <tr>
              <td><code>#header</code></td>
              <td>선택</td>
              <td>헤더 완전 교체</td>
            </tr>
            <tr>
              <td><code>#footer</code></td>
              <td>선택</td>
              <td>푸터 완전 교체</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="fullPopupGuidePage__tableTitle">공통 Events</h3>
      <div class="fullPopupGuidePage__propsTableWrap">
        <table class="fullPopupGuidePage__propsTable">
          <thead>
            <tr>
              <th>이름</th>
              <th>페이로드</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>update:open</code></td>
              <td><code>boolean</code></td>
              <td>open 상태 변경 (v-model)</td>
            </tr>
            <tr>
              <td><code>opened</code></td>
              <td>—</td>
              <td>열림 애니메이션 완료 후</td>
            </tr>
            <tr>
              <td><code>closed</code></td>
              <td>—</td>
              <td>닫힘 애니메이션 완료 후</td>
            </tr>
            <tr>
              <td><code>close</code></td>
              <td>—</td>
              <td>
                닫기(×) 버튼 클릭. <code>closeOnCloseBtn=false</code>이면 이 이벤트만 emit되고 자동으로 닫히지 않음 —
                부모가 직접 닫아야 함
              </td>
            </tr>
            <tr>
              <td><code>ok</code></td>
              <td>—</td>
              <td>ok 버튼 클릭 (부모가 닫기 책임)</td>
            </tr>
            <tr>
              <td><code>cancel</code></td>
              <td>—</td>
              <td>cancel 버튼 클릭</td>
            </tr>
            <tr>
              <td><code>overlayClick</code></td>
              <td>—</td>
              <td>dim이 있으나 <code>closeOnOverlay: false</code> 기본값이므로 기본적으로 발생하지 않음</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="fullPopupGuidePage__commonNote">
        팝업 open 제어는 <code>v-model:open</code>(defineModel) 표준을 따릅니다. 상세: <code>rules/popups.md §3</code>
      </p>

      <h3 class="fullPopupGuidePage__tableTitle">closeOnCloseBtn 사용 패턴</h3>
      <p class="fullPopupGuidePage__note">
        <code>closeOnCloseBtn=false</code> 시 X 버튼 클릭 → <code>close</code> 이벤트만 발생 → 부모가 비동기 처리 후
        직접 닫는 패턴입니다.
      </p>
      <pre class="fullPopupGuidePage__code">
&lt;FullPopup
  v-model:open="isOpen"
  title="상세 필터"
  :close-on-close-btn="false"
  @close="() =&gt; { doSomething(); isOpen = false }"
&gt;
  콘텐츠
&lt;/FullPopup&gt;</pre
      >

      <h3 class="fullPopupGuidePage__tableTitle">closeOnCancel 사용 패턴</h3>
      <p class="fullPopupGuidePage__note">
        <code>closeOnCancel=false</code> 시 cancel 버튼 클릭 → <code>cancel</code> 이벤트만 발생 → 부모가 처리 후 직접
        닫는 패턴입니다. FullPopup에서 cancel 버튼을 <code>showCancel=true</code>로 표시하는 경우에 해당합니다.
      </p>
      <pre class="fullPopupGuidePage__code">
&lt;FullPopup
  v-model:open="isOpen"
  title="상세 필터"
  :show-cancel="true"
  :close-on-cancel="false"
  @cancel="() =&gt; { resetFilter(); isOpen = false }"
  @ok="() =&gt; { applyFilter(); isOpen = false }"
&gt;
  콘텐츠
&lt;/FullPopup&gt;</pre
      >

      <p class="fullPopupGuidePage__delegationNote">
        <strong>접근성 참고</strong>: 닫기 버튼의 <code>aria-label</code>은 <code>"닫기"</code>로 설정됩니다.
        LayerPopup·BottomSheet와 동일한 공통 패턴입니다.<br />
        dim(overlay)이 렌더링되지만 <code>closeOnOverlay</code>가 <code>false</code>로 고정되므로, dim 클릭 시 닫히지
        않습니다. 헤더 X 버튼으로 닫는 패턴을 사용하세요.
      </p>

      <p class="fullPopupGuidePage__radixNote">
        이 컴포넌트는 <strong>Radix Vue Dialog</strong>를 기반으로 합니다. 전체 API는
        <a href="https://www.radix-vue.com" target="_blank" rel="noopener noreferrer">radix-vue.com 공식 문서</a>
        또는 Context7 MCP(<code>mcp__context7__query-docs</code>)를 통해 확인하세요.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ layout: 'guide' });
  import {
    FullPopupDemoBasic,
    FullPopupDemoFilter,
    FullPopupDemoNoFooter,
    FullPopupDemoNoClose,
  } from '@nd/popups/guide';
  import { FullPopup } from '@nd/components/popup';

  const isBasicOpen = ref(false);
  const isFilterOpen = ref(false);
  const isNoFooterOpen = ref(false);
  const isNoCloseOpen = ref(false);

  const appliedFilter = ref('');
  const isBodyLabelOpen = ref(false);
  const isBodyNoteOpen = ref(false);

  function onFilterApply(result: string) {
    appliedFilter.value = result;
  }
</script>

<style lang="scss" scoped src="./fullPopup.scss"></style>
