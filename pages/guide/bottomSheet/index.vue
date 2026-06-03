<template>
  <div class="bottomSheetGuidePage">
    <header class="bottomSheetGuidePage__header">
      <div class="bottomSheetGuidePage__meta">
        <span class="bottomSheetGuidePage__badge">organisms</span>
      </div>
      <h1 class="bottomSheetGuidePage__title">BottomSheet</h1>
      <p class="bottomSheetGuidePage__desc">
        화면 하단에서 슬라이드업으로 등장하는 팝업입니다. 최대 높이 <code>80vh</code>, body 스크롤을 지원합니다.<br />
        팝업 open 제어는 <code>v-model:open</code>(defineModel) 표준을 따릅니다. 상세: <code>rules/popups.md §3</code
        ><br />
        내부적으로 <strong>Radix Vue Dialog</strong>를 사용합니다.
      </p>
    </header>

    <!-- ① 기본 BottomSheet -->
    <section class="bottomSheetGuidePage__section">
      <h2 class="bottomSheetGuidePage__sectionTitle">① 기본 BottomSheet</h2>
      <div class="bottomSheetGuidePage__group">
        <div class="bottomSheetGuidePage__row">
          <button type="button" class="bottomSheetGuidePage__demoBtn" @click="isBasicOpen = true">
            기본 BottomSheet 열기
          </button>
        </div>
        <BottomSheetDemoBasic v-model:open="isBasicOpen" />
      </div>
    </section>

    <!-- ② 긴 콘텐츠 스크롤 -->
    <section class="bottomSheetGuidePage__section">
      <h2 class="bottomSheetGuidePage__sectionTitle">② 긴 콘텐츠 스크롤</h2>
      <div class="bottomSheetGuidePage__group">
        <p class="bottomSheetGuidePage__note">body 영역이 <code>80vh</code>를 초과하면 스크롤됩니다.</p>
        <div class="bottomSheetGuidePage__row">
          <button type="button" class="bottomSheetGuidePage__demoBtn" @click="isLongContentOpen = true">
            긴 콘텐츠 BottomSheet 열기
          </button>
        </div>
        <BottomSheetDemoLongContent v-model:open="isLongContentOpen" />
      </div>
    </section>

    <!-- ③ 필터 선택 시나리오 (#footer slot) -->
    <section class="bottomSheetGuidePage__section">
      <h2 class="bottomSheetGuidePage__sectionTitle">③ 필터 선택 시나리오</h2>
      <div class="bottomSheetGuidePage__group">
        <p class="bottomSheetGuidePage__note">라디오 그룹 + <code>#footer</code> slot의 [초기화] [적용] 패턴입니다.</p>
        <div class="bottomSheetGuidePage__row">
          <button type="button" class="bottomSheetGuidePage__demoBtn" @click="isFilterOpen = true">
            필터 BottomSheet 열기
          </button>
        </div>
        <BottomSheetDemoFilter v-model:open="isFilterOpen" />
      </div>
    </section>

    <!-- ④ footerLayout="wide" -->
    <section class="bottomSheetGuidePage__section">
      <h2 class="bottomSheetGuidePage__sectionTitle">④ footerLayout="wide"</h2>
      <div class="bottomSheetGuidePage__group">
        <p class="bottomSheetGuidePage__note">
          <code>footerLayout="wide"</code> 적용 시 cancel 버튼 max-width 12rem + flex 120 / ok 버튼 flex 200 비대칭
          레이아웃입니다.
        </p>
        <div class="bottomSheetGuidePage__row">
          <button type="button" class="bottomSheetGuidePage__demoBtn" @click="isWideOpen = true">
            wide 레이아웃 BottomSheet 열기
          </button>
        </div>
        <BottomSheetDemoWide v-model:open="isWideOpen" />
      </div>
    </section>

    <!-- ⑤ showClose=false -->
    <section class="bottomSheetGuidePage__section">
      <h2 class="bottomSheetGuidePage__sectionTitle">⑤ showClose=false</h2>
      <div class="bottomSheetGuidePage__group">
        <p class="bottomSheetGuidePage__note">
          <code>:show-close="false"</code> 적용 시 닫기(✕) 버튼이 렌더링되지 않습니다. ok / cancel 버튼 또는 ESC·dim
          클릭으로 닫을 수 있습니다.
        </p>
        <div class="bottomSheetGuidePage__row">
          <button type="button" class="bottomSheetGuidePage__demoBtn" @click="isNoCloseOpen = true">
            showClose=false 열기
          </button>
        </div>
        <BottomSheetDemoNoClose v-model:open="isNoCloseOpen" />
      </div>
    </section>

    <!-- ⑥ bodyLabel 사용 예시 -->
    <section class="bottomSheetGuidePage__section">
      <h2 class="bottomSheetGuidePage__sectionTitle">⑥ bodyLabel 사용 예시</h2>
      <div class="bottomSheetGuidePage__group">
        <p class="bottomSheetGuidePage__note">
          <code>body-label</code> prop을 전달하면 body 콘텐츠 상단, slot 위에 안내 레이블 텍스트가 렌더링됩니다.
        </p>
        <div class="bottomSheetGuidePage__row">
          <button type="button" class="bottomSheetGuidePage__demoBtn" @click="isBodyLabelOpen = true">
            bodyLabel BottomSheet 열기
          </button>
        </div>
        <BottomSheet v-model:open="isBodyLabelOpen" title="옵션 선택" body-label="구매할 옵션을 선택해주세요.">
          <p style="padding: 1.6rem">콘텐츠 영역</p>
        </BottomSheet>
      </div>
    </section>

    <!-- ⑦ bodyNote 사용 예시 -->
    <section class="bottomSheetGuidePage__section">
      <h2 class="bottomSheetGuidePage__sectionTitle">⑦ bodyNote 사용 예시</h2>
      <div class="bottomSheetGuidePage__group">
        <p class="bottomSheetGuidePage__note">
          <code>body-note</code> prop을 전달하면 body 콘텐츠 하단, slot 아래에
          <code>&lt;Icon size="sm"&gt;&lt;CircularNoteSvg /&gt;&lt;/Icon&gt;</code> + 텍스트 조합의 도움말 문구가
          렌더링됩니다.
        </p>
        <div class="bottomSheetGuidePage__row">
          <button type="button" class="bottomSheetGuidePage__demoBtn" @click="isBodyNoteOpen = true">
            bodyNote BottomSheet 열기
          </button>
        </div>
        <BottomSheet v-model:open="isBodyNoteOpen" title="배송지 선택" body-note="입력하신 정보는 안전하게 보호됩니다.">
          <p style="padding: 1.6rem">콘텐츠 영역</p>
        </BottomSheet>
      </div>
    </section>

    <!-- ⑧ Props / Slots / Events -->
    <section class="bottomSheetGuidePage__section">
      <h2 class="bottomSheetGuidePage__sectionTitle">⑧ Props / Slots / Events</h2>

      <h3 class="bottomSheetGuidePage__tableTitle">공통 Props</h3>
      <p class="bottomSheetGuidePage__commonNote">
        아래 Props는 BottomSheet / LayerPopup / FullPopup에서 공통으로 지원합니다.
      </p>
      <div class="bottomSheetGuidePage__propsTableWrap">
        <table class="bottomSheetGuidePage__propsTable">
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
              <td>닫기(✕) 버튼 표시</td>
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
              <td><code>true</code></td>
              <td>cancel 버튼 표시</td>
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
              <td>
                ok 버튼 색상. <code>'primary'</code>: 시안색, <code>'secondary'</code>: 보조 색상, <code>'black'</code>:
                검정
              </td>
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
                타입에서 주로 유용. 사용 예: <code>:defer-content="true"</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="bottomSheetGuidePage__tableTitle">BottomSheet 전용 Props</h3>
      <div class="bottomSheetGuidePage__propsTableWrap">
        <table class="bottomSheetGuidePage__propsTable">
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
              <td><code>closeOnOverlay</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>
                dim 클릭 시 닫기. <strong>좌클릭(마우스 버튼 0)에만 반응</strong>하며, 우클릭·중간 버튼 클릭은
                무시됩니다. 터치 이벤트는 <code>button === 0</code>으로 처리되므로 터치 닫힘에는 영향 없음.
              </td>
            </tr>
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

      <h3 class="bottomSheetGuidePage__tableTitle">Slots</h3>
      <div class="bottomSheetGuidePage__propsTableWrap">
        <table class="bottomSheetGuidePage__propsTable">
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
              <td>body 영역 콘텐츠 (최대 80vh 내 스크롤)</td>
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

      <h3 class="bottomSheetGuidePage__tableTitle">공통 Events</h3>
      <div class="bottomSheetGuidePage__propsTableWrap">
        <table class="bottomSheetGuidePage__propsTable">
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
                닫기(✕) 버튼 클릭. <code>closeOnCloseBtn=false</code>이면 이 이벤트만 emit되고 자동으로 닫히지 않음 —
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
              <td>dim 클릭</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="bottomSheetGuidePage__commonNote">
        팝업 open 제어는 <code>v-model:open</code>(defineModel) 표준을 따릅니다. 상세: <code>rules/popups.md §3</code>
      </p>

      <h3 class="bottomSheetGuidePage__tableTitle">closeOnCloseBtn 사용 패턴</h3>
      <p class="bottomSheetGuidePage__note">
        <code>closeOnCloseBtn=false</code> 시 X 버튼 클릭 → <code>close</code> 이벤트만 발생 → 부모가 비동기 처리 후
        직접 닫는 패턴입니다.
      </p>
      <pre class="bottomSheetGuidePage__code">
&lt;BottomSheet
  v-model:open="isOpen"
  title="필터 적용"
  :close-on-close-btn="false"
  @close="() =&gt; { doSomething(); isOpen = false }"
&gt;
  콘텐츠
&lt;/BottomSheet&gt;</pre
      >

      <h3 class="bottomSheetGuidePage__tableTitle">closeOnCancel 사용 패턴</h3>
      <p class="bottomSheetGuidePage__note">
        <code>closeOnCancel=false</code> 시 cancel 버튼 클릭 → <code>cancel</code> 이벤트만 발생 → 부모가 처리 후 직접
        닫는 패턴입니다.
      </p>
      <pre class="bottomSheetGuidePage__code">
&lt;BottomSheet
  v-model:open="isOpen"
  title="필터 적용"
  :close-on-cancel="false"
  @cancel="() =&gt; { resetFilter(); isOpen = false }"
  @ok="() =&gt; { applyFilter(); isOpen = false }"
&gt;
  콘텐츠
&lt;/BottomSheet&gt;</pre
      >

      <p class="bottomSheetGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: BottomSheet은 <code>Popup</code> Base를 내부에서 사용합니다. 추가 props가
        필요한 경우 BottomSheet의 props에 명시적으로 전달합니다.
      </p>

      <p class="bottomSheetGuidePage__radixNote">
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
    BottomSheetDemoBasic,
    BottomSheetDemoLongContent,
    BottomSheetDemoFilter,
    BottomSheetDemoWide,
    BottomSheetDemoNoClose,
  } from '@nd/popups/guide';
  import { BottomSheet } from '@nd/components/popup';

  const isBasicOpen = ref(false);
  const isLongContentOpen = ref(false);
  const isFilterOpen = ref(false);
  const isWideOpen = ref(false);
  const isNoCloseOpen = ref(false);
  const isBodyLabelOpen = ref(false);
  const isBodyNoteOpen = ref(false);
</script>

<style lang="scss" scoped src="./bottomSheet.scss"></style>
