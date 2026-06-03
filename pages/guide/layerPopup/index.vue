<template>
  <div class="layerPopupGuidePage">
    <header class="layerPopupGuidePage__header">
      <div class="layerPopupGuidePage__meta">
        <span class="layerPopupGuidePage__badge">organisms</span>
      </div>
      <h1 class="layerPopupGuidePage__title">LayerPopup</h1>
      <p class="layerPopupGuidePage__desc">
        범용 레이어 팝업입니다. 헤더/바디/푸터 모두 slot으로 자유롭게 구성하며, 팝업 open 제어는
        <code>v-model:open</code>(defineModel) 표준을 따릅니다.<br />
        내부적으로 <strong>Radix Vue Dialog</strong>를 사용해 포커스 트랩, ESC 닫기, ARIA 처리를 자동으로 지원합니다.
      </p>
    </header>

    <!-- ① 기본 LayerPopup -->
    <section class="layerPopupGuidePage__section">
      <h2 class="layerPopupGuidePage__sectionTitle">① 기본 LayerPopup</h2>
      <div class="layerPopupGuidePage__group">
        <p class="layerPopupGuidePage__note">
          별도 컴포넌트로 래핑한 뒤 부모에서 <code>ref</code>를 통해 <code>.open()</code> /
          <code>.close()</code> 메서드로 제어합니다. 닫기(✕) 버튼은 콘텐츠 우상단에 <code>position: absolute</code>로
          배치됩니다.
        </p>
        <div class="layerPopupGuidePage__row">
          <button type="button" class="layerPopupGuidePage__demoBtn" @click="isBasicOpen = true">
            기본 LayerPopup 열기
          </button>
        </div>
        <LayerPopupDemoBasic v-model:open="isBasicOpen" />
      </div>
    </section>

    <!-- ② #footer slot 커스텀 -->
    <section class="layerPopupGuidePage__section">
      <h2 class="layerPopupGuidePage__sectionTitle">② #footer slot 커스텀</h2>
      <div class="layerPopupGuidePage__group">
        <p class="layerPopupGuidePage__note">
          <code>#footer</code> slot을 사용하면 ok/cancel 기본 버튼을 완전히 교체합니다.
        </p>
        <div class="layerPopupGuidePage__row">
          <button type="button" class="layerPopupGuidePage__demoBtn" @click="isFooterOpen = true">
            #footer 커스텀 열기
          </button>
        </div>
        <LayerPopupDemoFooter v-model:open="isFooterOpen" />
      </div>
    </section>

    <!-- ③ #header slot 커스텀 -->
    <section class="layerPopupGuidePage__section">
      <h2 class="layerPopupGuidePage__sectionTitle">③ #header slot 커스텀</h2>
      <div class="layerPopupGuidePage__group">
        <p class="layerPopupGuidePage__note">
          <code>#header</code> slot 사용 시 <code>title</code> prop을 비워두면 hidden DialogTitle이 자동 마운트됩니다.
          slot 안에서 별도 DialogTitle 래핑은 불필요합니다.
        </p>
        <div class="layerPopupGuidePage__row">
          <button type="button" class="layerPopupGuidePage__demoBtn" @click="isHeaderOpen = true">
            #header 커스텀 열기
          </button>
        </div>
        <LayerPopupDemoHeader v-model:open="isHeaderOpen" />
      </div>
    </section>

    <!-- ④ showCancel=false -->
    <section class="layerPopupGuidePage__section">
      <h2 class="layerPopupGuidePage__sectionTitle">④ showCancel=false</h2>
      <div class="layerPopupGuidePage__group">
        <div class="layerPopupGuidePage__row">
          <button type="button" class="layerPopupGuidePage__demoBtn" @click="isNoCancelOpen = true">
            ok 버튼만 열기
          </button>
        </div>
        <LayerPopupDemoNoCancel v-model:open="isNoCancelOpen" />
      </div>
    </section>

    <!-- ⑤ closeOnOverlay=false -->
    <section class="layerPopupGuidePage__section">
      <h2 class="layerPopupGuidePage__sectionTitle">⑤ closeOnOverlay=false</h2>
      <div class="layerPopupGuidePage__group">
        <p class="layerPopupGuidePage__note">
          dim 클릭으로 닫히지 않는 강제 응답 시나리오입니다. ✕ 버튼 또는 ok/cancel 버튼으로만 닫을 수 있습니다.<br />
          참고: <code>closeOnOverlay=true</code>(기본값)일 때 dim에서 우클릭·중간 버튼 클릭을 해도 팝업이 닫히지
          않습니다. 좌클릭만 닫힘을 트리거합니다.
        </p>
        <div class="layerPopupGuidePage__row">
          <button type="button" class="layerPopupGuidePage__demoBtn" @click="isNoOverlayOpen = true">
            강제 응답 팝업 열기
          </button>
        </div>
        <LayerPopupDemoNoOverlay v-model:open="isNoOverlayOpen" />
      </div>
    </section>

    <!-- ⑥ showClose=false -->
    <section class="layerPopupGuidePage__section">
      <h2 class="layerPopupGuidePage__sectionTitle">⑥ showClose=false</h2>
      <div class="layerPopupGuidePage__group">
        <p class="layerPopupGuidePage__note">
          <code>:show-close="false"</code> 적용 시 닫기(✕) 버튼이 렌더링되지 않습니다. ok / cancel 버튼 또는 ESC·dim
          클릭으로 닫을 수 있습니다.
        </p>
        <div class="layerPopupGuidePage__row">
          <button type="button" class="layerPopupGuidePage__demoBtn" @click="isNoCloseOpen = true">
            showClose=false 열기
          </button>
        </div>
        <LayerPopupDemoNoClose v-model:open="isNoCloseOpen" />
      </div>
    </section>

    <!-- ⑦ bodyLabel 사용 예시 -->
    <section class="layerPopupGuidePage__section">
      <h2 class="layerPopupGuidePage__sectionTitle">⑦ bodyLabel 사용 예시</h2>
      <div class="layerPopupGuidePage__group">
        <p class="layerPopupGuidePage__note">
          <code>body-label</code> prop을 전달하면 body 콘텐츠 상단, slot 위에 안내 레이블 텍스트가 렌더링됩니다.
        </p>
        <div class="layerPopupGuidePage__row">
          <button type="button" class="layerPopupGuidePage__demoBtn" @click="isBodyLabelOpen = true">
            bodyLabel LayerPopup 열기
          </button>
        </div>
        <LayerPopup
          v-model:open="isBodyLabelOpen"
          title="배송지 선택"
          body-label="배송지를 선택해주세요. 기본 배송지가 자동 적용됩니다."
        >
          <p style="padding: 1.6rem">콘텐츠 영역</p>
        </LayerPopup>
      </div>
    </section>

    <!-- ⑧ bodyNote 사용 예시 -->
    <section class="layerPopupGuidePage__section">
      <h2 class="layerPopupGuidePage__sectionTitle">⑧ bodyNote 사용 예시</h2>
      <div class="layerPopupGuidePage__group">
        <p class="layerPopupGuidePage__note">
          <code>body-note</code> prop을 전달하면 body 콘텐츠 하단, slot 아래에
          <code>&lt;Icon size="sm"&gt;&lt;CircularNoteSvg /&gt;&lt;/Icon&gt;</code> + 텍스트 조합의 도움말 문구가
          렌더링됩니다.
        </p>
        <div class="layerPopupGuidePage__row">
          <button type="button" class="layerPopupGuidePage__demoBtn" @click="isBodyNoteOpen = true">
            bodyNote LayerPopup 열기
          </button>
        </div>
        <LayerPopup
          v-model:open="isBodyNoteOpen"
          title="개인정보 입력"
          body-note="입력하신 정보는 안전하게 보호됩니다."
        >
          <p style="padding: 1.6rem">콘텐츠 영역</p>
        </LayerPopup>
      </div>
    </section>

    <!-- ⑨ Props / Slots / Events -->
    <section class="layerPopupGuidePage__section">
      <h2 class="layerPopupGuidePage__sectionTitle">⑨ Props / Slots / Events</h2>

      <h3 class="layerPopupGuidePage__tableTitle">공통 Props</h3>
      <p class="layerPopupGuidePage__commonNote">
        아래 Props는 BottomSheet / LayerPopup / FullPopup에서 공통으로 지원합니다.
      </p>
      <div class="layerPopupGuidePage__propsTableWrap">
        <table class="layerPopupGuidePage__propsTable">
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
                slot만 지연됨. 트레이드오프: 콘텐츠가 붙을 때 팝업 높이가 한 번 커짐. 베이스 <code>Popup</code>의
                prop이며 모든 팝업 래퍼가 <code>$attrs</code>로 전달. LayerPopup은 fade/scale 타입이라 slide
                타입(BottomSheet·FullPopup)보다 필요성이 낮지만, 무거운 콘텐츠가 있을 때 동일하게 사용 가능.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="layerPopupGuidePage__tableTitle">LayerPopup 전용 Props</h3>
      <div class="layerPopupGuidePage__propsTableWrap">
        <table class="layerPopupGuidePage__propsTable">
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

      <h3 class="layerPopupGuidePage__tableTitle">Slots</h3>
      <div class="layerPopupGuidePage__propsTableWrap">
        <table class="layerPopupGuidePage__propsTable">
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
              <td>body 영역 콘텐츠</td>
            </tr>
            <tr>
              <td><code>#header</code></td>
              <td>선택</td>
              <td>헤더 완전 교체. title/showClose prop 무시</td>
            </tr>
            <tr>
              <td><code>#footer</code></td>
              <td>선택</td>
              <td>푸터 완전 교체. ok/cancel 기본 버튼 미렌더링</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="layerPopupGuidePage__tableTitle">공통 Events</h3>
      <div class="layerPopupGuidePage__propsTableWrap">
        <table class="layerPopupGuidePage__propsTable">
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

      <p class="layerPopupGuidePage__commonNote">
        팝업 open 제어는 <code>v-model:open</code>(defineModel) 표준을 따릅니다. 상세: <code>rules/popups.md §3</code>
      </p>

      <h3 class="layerPopupGuidePage__tableTitle">usePopupNavigate() Composable</h3>
      <p class="layerPopupGuidePage__commonNote">
        페이지 전용 팝업(<code>popups/</code>) 내부에서 "다른 페이지로 이동"을 처리하는 제어 hook입니다.
        팝업 안에서는 <code>&lt;NuxtLink&gt;</code>·<code>&lt;ButtonLink to&gt;</code> 등 즉시 라우팅 마크업을 쓸 수
        없으므로(클릭 즉시 라우트가 전환되어 닫힘 애니메이션이 잘림 — <code>rules/pages.md §5-1</code>), 경로를 기억하고
        팝업을 닫은 뒤 닫힘 완료(<code>@closed</code>) 시점에 <code>navigateTo</code>합니다. 파라미터:
        <code>close: () =&gt; void</code> — 팝업을 닫는 콜백 (보통 <code>() =&gt; emit('update:open', false)</code>)
      </p>
      <div class="layerPopupGuidePage__propsTableWrap">
        <table class="layerPopupGuidePage__propsTable">
          <thead>
            <tr>
              <th>반환값</th>
              <th>타입</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>navigate(path)</code></td>
              <td><code>(path: string) =&gt; void</code></td>
              <td>경로를 기억하고 <code>close()</code> 실행. 즉시 이동하지 않음</td>
            </tr>
            <tr>
              <td><code>handleClosed()</code></td>
              <td><code>() =&gt; void</code></td>
              <td>base 팝업의 <code>@closed</code>(닫힘 완료)에 연결. 예약 경로가 있으면 <code>navigateTo</code></td>
            </tr>
            <tr>
              <td><code>pendingPath</code></td>
              <td><code>Ref&lt;string | null&gt;</code></td>
              <td>이동 예약 경로. X 버튼·ESC·dim 클릭 등 일반 닫기는 비어 있어 이동하지 않음</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="layerPopupGuidePage__tableTitle">usePopupNavigate 사용 패턴</h3>
      <p class="layerPopupGuidePage__note">
        단순 페이지 이동은 팝업 내부에서 <code>usePopupNavigate</code>(권장). 이동 전에 hub가 추가 작업(상태 저장·유효성
        검사·다른 팝업 연쇄)을 해야 하면 팝업이 <code>emit('navigate', path)</code>로 hub에 위임하고 hub의
        <code>onClosed</code>에서 처리합니다. (<code>rules/pages.md §5-1</code>)
      </p>
      <pre class="layerPopupGuidePage__code">
&lt;!-- popups/{route}/SomeBottomSheet.vue (팝업 내부 처리, 권장) --&gt;
&lt;BottomSheet :open="open" @close="emit('update:open', false)" @closed="handleClosed"&gt;
  &lt;button type="button" @click="navigate('/cart')"&gt;장바구니 보기&lt;/button&gt;
&lt;/BottomSheet&gt;

&lt;script setup lang="ts"&gt;
import { BottomSheet, usePopupNavigate } from '@nd/components/popup'

defineProps&lt;{ open: boolean }&gt;()
const emit = defineEmits&lt;{ 'update:open': [value: boolean] }&gt;()

const { navigate, handleClosed } = usePopupNavigate(() =&gt; emit('update:open', false))
&lt;/script&gt;

&lt;!-- hub는 v-model:open만 — @navigate/@closed 핸들러 불필요 --&gt;
&lt;SomeBottomSheet v-model:open="isOpen" /&gt;</pre
      >

      <h3 class="layerPopupGuidePage__tableTitle">closeOnCloseBtn 사용 패턴</h3>
      <p class="layerPopupGuidePage__note">
        <code>closeOnCloseBtn=false</code> 시 X 버튼 클릭 → <code>close</code> 이벤트만 발생 → 부모가 비동기 처리 후
        직접 닫는 패턴입니다.
      </p>
      <pre class="layerPopupGuidePage__code">
&lt;!-- LayerPopupDemoCloseBtnControl.vue --&gt;
&lt;LayerPopup
  v-model:open="isOpen"
  title="저장 확인"
  :close-on-close-btn="false"
  @close="handleClose"
  @ok="handleOk"
&gt;
  저장하시겠습니까?
&lt;/LayerPopup&gt;

&lt;script setup lang="ts"&gt;
const isOpen = ref(false)

async function handleClose() {
  // X 버튼 클릭 시 — 비동기 처리 후 직접 닫기
  await doSomethingAsync()
  isOpen.value = false
}

function handleOk() {
  isOpen.value = false
}
&lt;/script&gt;</pre
      >

      <h3 class="layerPopupGuidePage__tableTitle">closeOnCancel 사용 패턴</h3>
      <p class="layerPopupGuidePage__note">
        <code>closeOnCancel=false</code> 시 cancel 버튼 클릭 → <code>cancel</code> 이벤트만 발생 → 부모가 처리 후 직접
        닫는 패턴입니다. 취소 전 유효성 확인이나 비동기 처리가 필요한 시나리오에 사용합니다.
      </p>
      <pre class="layerPopupGuidePage__code">
&lt;LayerPopup
  v-model:open="isOpen"
  title="폼 작성"
  :close-on-cancel="false"
  @cancel="handleCancel"
  @ok="handleOk"
&gt;
  콘텐츠
&lt;/LayerPopup&gt;

&lt;script setup lang="ts"&gt;
const isOpen = ref(false)

function handleCancel() {
  // cancel 버튼 클릭 시 — 처리 후 직접 닫기
  if (hasUnsavedChanges) {
    // 이탈 경고 등 처리
    return
  }
  isOpen.value = false
}

function handleOk() {
  isOpen.value = false
}
&lt;/script&gt;</pre
      >

      <p class="layerPopupGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: LayerPopup은 <code>Popup</code> Base를 내부에서 사용합니다.
        <code>v-bind="$attrs"</code>가 <code>DialogContent</code>에 위임되어 <code>aria-label</code>,
        <code>data-*</code> 등 네이티브 HTML 속성을 그대로 전달할 수 있습니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>

      <p class="layerPopupGuidePage__radixNote">
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
    LayerPopupDemoBasic,
    LayerPopupDemoFooter,
    LayerPopupDemoHeader,
    LayerPopupDemoNoCancel,
    LayerPopupDemoNoOverlay,
    LayerPopupDemoNoClose,
  } from '@nd/popups/guide';
  import { LayerPopup } from '@nd/components/popup';

  const isBasicOpen = ref(false);
  const isFooterOpen = ref(false);
  const isHeaderOpen = ref(false);
  const isNoCancelOpen = ref(false);
  const isNoOverlayOpen = ref(false);
  const isNoCloseOpen = ref(false);
  const isBodyLabelOpen = ref(false);
  const isBodyNoteOpen = ref(false);
</script>

<style lang="scss" scoped src="./layerPopup.scss"></style>
