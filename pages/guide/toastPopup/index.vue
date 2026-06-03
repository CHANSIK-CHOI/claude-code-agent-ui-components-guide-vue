<template>
  <div class="toastPopupGuidePage">
    <header class="toastPopupGuidePage__header">
      <div class="toastPopupGuidePage__meta">
        <span class="toastPopupGuidePage__badge">popup</span>
      </div>
      <h1 class="toastPopupGuidePage__title">ToastPopup</h1>
      <p class="toastPopupGuidePage__desc">
        화면 하단 중앙에 pill 형태로 표시되는 비모달 알림 컴포넌트입니다.<br />
        오버레이 없이 잠깐 나타났다 사라지며, 사용자 흐름을 방해하지 않습니다.<br />
        <code>useToastPopup()</code> composable로 프로그래매틱하게 호출합니다. <code>ToastRenderer</code>는
        <code>app.vue</code>에 1회만 배치되며, <code>#toast-container</code> 전용 컨테이너에 텔레포트됩니다. 토스트는
        팝업(<code>$z-modal: 300</code>)보다 높은 레이어(<code>$z-toast: 400</code>)에 표시되며,
        <code>pointer-events: none</code>으로 토스트 뒤쪽 요소의 클릭이 차단되지 않습니다. 닫기 버튼만 인터랙션을
        허용합니다.
      </p>
    </header>

    <!-- ① 텍스트만 -->
    <section class="toastPopupGuidePage__section">
      <h2 class="toastPopupGuidePage__sectionTitle">① 텍스트만</h2>
      <div class="toastPopupGuidePage__group">
        <p class="toastPopupGuidePage__note">기본 토스트입니다. 3초 후 자동으로 사라집니다.</p>
        <div class="toastPopupGuidePage__row">
          <button type="button" class="toastPopupGuidePage__demoBtn" @click="showBasic">기본 토스트 표시</button>
        </div>
      </div>
    </section>

    <!-- ② 아이콘 포함 -->
    <section class="toastPopupGuidePage__section">
      <h2 class="toastPopupGuidePage__sectionTitle">② 아이콘 포함</h2>
      <div class="toastPopupGuidePage__group">
        <p class="toastPopupGuidePage__note">
          <code>showIcon: true</code> — 기본 벨 아이콘이 좌측에 표시됩니다. 폰트 크기가 13px으로 축소됩니다.
        </p>
        <div class="toastPopupGuidePage__row">
          <button type="button" class="toastPopupGuidePage__demoBtn" @click="showWithIcon">아이콘 토스트 표시</button>
        </div>
      </div>
    </section>

    <!-- ③ 아이콘 + 닫기 버튼 -->
    <section class="toastPopupGuidePage__section">
      <h2 class="toastPopupGuidePage__sectionTitle">③ 아이콘 + 닫기 버튼 & 아이콘 변경</h2>
      <div class="toastPopupGuidePage__group">
        <p class="toastPopupGuidePage__note">
          <code>showIcon: true</code>, <code>showClose: true</code>, <code>duration: 0</code> — 자동 닫힘 없이 사용자가
          직접 닫아야 합니다. Figma 디자인 "정기구독 플로팅 팝업" 패턴입니다.
        </p>
        <div class="toastPopupGuidePage__row">
          <button type="button" class="toastPopupGuidePage__demoBtn" @click="showWithIconAndClose">
            아이콘 + 닫기 토스트 표시
          </button>

          <button type="button" class="toastPopupGuidePage__demoBtn" @click="showTheOtherIcon">아이콘 변경</button>
        </div>
      </div>
    </section>

    <!-- ④ 다중 토스트 -->
    <section class="toastPopupGuidePage__section">
      <h2 class="toastPopupGuidePage__sectionTitle">④ 다중 토스트</h2>
      <div class="toastPopupGuidePage__group">
        <p class="toastPopupGuidePage__note">여러 번 연속 호출 시 토스트가 쌓입니다.</p>
        <div class="toastPopupGuidePage__row">
          <button type="button" class="toastPopupGuidePage__demoBtn" @click="showMultiple">3개 연속 표시</button>
        </div>
      </div>
    </section>

    <!-- ⑤ 커스텀 아이콘 (iconComponent) -->
    <section class="toastPopupGuidePage__section">
      <h2 class="toastPopupGuidePage__sectionTitle">⑤ 커스텀 아이콘 (iconComponent)</h2>
      <div class="toastPopupGuidePage__group">
        <p class="toastPopupGuidePage__note">
          <code>iconComponent</code> 옵션으로 Vue 컴포넌트를 직접 주입할 수 있습니다.<br />
          <code>showIcon: true</code>와 함께 전달하면 기본 벨 아이콘 대신 지정한 컴포넌트가 렌더링됩니다.<br />
          <code>?skipsvgo</code>로 import한 SVG도 호환됩니다.
        </p>
        <div class="toastPopupGuidePage__row">
          <button type="button" class="toastPopupGuidePage__demoBtn" @click="showWithCustomIcon">
            커스텀 아이콘 (notification)
          </button>
          <button type="button" class="toastPopupGuidePage__demoBtn" @click="showWithHeartIcon">
            커스텀 아이콘 (heart)
          </button>
        </div>
      </div>
    </section>

    <!-- ⑥ onClosed 콜백 -->
    <section class="toastPopupGuidePage__section">
      <h2 class="toastPopupGuidePage__sectionTitle">⑥ onClosed 콜백</h2>
      <div class="toastPopupGuidePage__group">
        <p class="toastPopupGuidePage__note">
          <code>onClosed</code> 옵션에 콜백을 전달하면 사라짐 애니메이션 완료 후 실행됩니다.<br />
          페이지 이동, 리스트 갱신 등 토스트가 완전히 사라진 뒤의 후속 처리에 활용할 수 있습니다.
        </p>
        <div class="toastPopupGuidePage__row">
          <button type="button" class="toastPopupGuidePage__demoBtn" @click="showWithOnClosed">
            onClosed 콜백 데모
          </button>
        </div>
        <p class="toastPopupGuidePage__callbackLog" :class="{ 'toastPopupGuidePage__callbackLog--visible': callbackLogVisible }">
          onClosed 콜백이 실행되었습니다.
        </p>
      </div>
    </section>

    <!-- ⑦ Props / Events / Composable -->
    <section class="toastPopupGuidePage__section">
      <h2 class="toastPopupGuidePage__sectionTitle">⑦ Props / Events / Composable</h2>

      <h3 class="toastPopupGuidePage__tableTitle">ToastPopup Props</h3>
      <div class="toastPopupGuidePage__propsTableWrap">
        <table class="toastPopupGuidePage__propsTable">
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
              <td><code>message</code></td>
              <td><code>string</code></td>
              <td>— (필수)</td>
              <td>표시할 텍스트</td>
            </tr>
            <tr>
              <td><code>showClose</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>닫기(×) 버튼 표시</td>
            </tr>
            <tr>
              <td><code>showIcon</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>아이콘 영역 표시. <code>#icon</code> 슬롯 없으면 기본 벨 아이콘</td>
            </tr>
            <tr>
              <td><code>type</code></td>
              <td><code>'foreground' | 'background'</code></td>
              <td><code>'foreground'</code></td>
              <td>보조기기 알림 방식. foreground = 즉시 알림</td>
            </tr>
            <tr>
              <td><code>forceMount</code></td>
              <td><code>boolean</code></td>
              <td>—</td>
              <td>닫힌 상태에서도 DOM 유지 (Radix 옵션)</td>
            </tr>
            <tr>
              <td><code>iconComponent</code></td>
              <td><code>Component | null</code></td>
              <td>—</td>
              <td>커스텀 아이콘 컴포넌트. <code>showIcon: true</code>일 때 기본 벨 아이콘 대신 렌더링. <code>ToastRenderer</code>에서 프로그래매틱 주입용. <code>#icon</code> 슬롯과 동일하게 동작</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="toastPopupGuidePage__tableTitle">Slots</h3>
      <div class="toastPopupGuidePage__propsTableWrap">
        <table class="toastPopupGuidePage__propsTable">
          <thead>
            <tr>
              <th>이름</th>
              <th>필수</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>#icon</code></td>
              <td>선택</td>
              <td>커스텀 아이콘. <code>showIcon: true</code>일 때 렌더링. 슬롯이 있으면 기본 벨 아이콘 대체</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="toastPopupGuidePage__tableTitle">Events</h3>
      <div class="toastPopupGuidePage__propsTableWrap">
        <table class="toastPopupGuidePage__propsTable">
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
              <td>열림/닫힘 상태 변경</td>
            </tr>
            <tr>
              <td><code>closed</code></td>
              <td>—</td>
              <td>사라짐 애니메이션 완료 후 (DOM 제거 직전)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="toastPopupGuidePage__tableTitle">useToastPopup() — 메서드</h3>
      <div class="toastPopupGuidePage__propsTableWrap">
        <table class="toastPopupGuidePage__propsTable">
          <thead>
            <tr>
              <th>메서드</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>open(options)</code></td>
              <td>
                토스트 표시. <code>id</code>, <code>open</code>을 제외한 ToastItem의 모든 필드를 옵션으로 전달 가능.
                생성된 토스트의 <code>id</code>(string)를 반환
              </td>
            </tr>
            <tr>
              <td><code>close(id)</code></td>
              <td>특정 토스트를 닫기 애니메이션과 함께 닫음 (타이머 취소 포함)</td>
            </tr>
            <tr>
              <td><code>remove(id)</code></td>
              <td><code>open()</code> 반환 id로 특정 토스트 즉시 제거</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="toastPopupGuidePage__tableTitle">ToastItem 인터페이스 (open() 옵션)</h3>
      <div class="toastPopupGuidePage__propsTableWrap">
        <table class="toastPopupGuidePage__propsTable">
          <thead>
            <tr>
              <th>필드</th>
              <th>타입</th>
              <th>필수</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>message</code></td>
              <td><code>string</code></td>
              <td>필수</td>
              <td>표시할 텍스트</td>
            </tr>
            <tr>
              <td><code>duration</code></td>
              <td><code>number</code></td>
              <td>선택</td>
              <td>자동 닫힘 시간(ms). 기본값 3000. <code>0</code>이면 수동 닫기 전용</td>
            </tr>
            <tr>
              <td><code>showClose</code></td>
              <td><code>boolean</code></td>
              <td>선택</td>
              <td>닫기(×) 버튼 표시</td>
            </tr>
            <tr>
              <td><code>showIcon</code></td>
              <td><code>boolean</code></td>
              <td>선택</td>
              <td>아이콘 영역 표시. <code>iconComponent</code>가 없으면 기본 벨 아이콘 렌더링</td>
            </tr>
            <tr>
              <td><code>type</code></td>
              <td><code>'foreground' | 'background'</code></td>
              <td>선택</td>
              <td>보조기기 알림 방식. 기본값 <code>'foreground'</code></td>
            </tr>
            <tr>
              <td><code>forceMount</code></td>
              <td><code>boolean</code></td>
              <td>선택</td>
              <td>닫힌 상태에서도 DOM 유지 (Radix 옵션)</td>
            </tr>
            <tr>
              <td><code>iconComponent</code></td>
              <td><code>Component | null</code></td>
              <td>선택</td>
              <td>커스텀 아이콘 컴포넌트. <code>showIcon: true</code>일 때 기본 벨 아이콘 대신 렌더링. <code>?skipsvgo</code> SVG import 호환</td>
            </tr>
            <tr>
              <td><code>onClosed</code></td>
              <td><code>() =&gt; void</code></td>
              <td>선택</td>
              <td>사라짐 애니메이션 완료 후(<code>closed</code> 이벤트 발생 시) 실행할 콜백</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="toastPopupGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: <code>ToastPopup</code>은 <code>v-bind="$attrs"</code>를 사용하므로 위
        Props 외에도 <code>aria-label</code>, <code>data-*</code> 등의 HTML 속성을 <code>ToastRoot</code>에 직접 전달할
        수 있습니다.<br />
        Toast는 Trigger가 없어 Select처럼 2단계 분리 없이 모든 attrs가
        <code>ToastRoot</code>로 위임됩니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>

      <p class="toastPopupGuidePage__radixNote">
        이 컴포넌트는 <strong>Radix Vue Toast</strong>를 기반으로 합니다. 위 Props 외에도 Radix Vue가 지원하는 추가
        props를 사용할 수 있습니다. 전체 API는
        <a href="https://www.radix-vue.com" target="_blank" rel="noopener noreferrer">radix-vue.com 공식 문서</a>
        또는 Context7 MCP(<code>mcp__context7__query-docs</code>)를 통해 확인하세요.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  import NotificationIcon from '@nd/assets/icons/notification.svg?skipsvgo';
  import HeartIcon from '@nd/assets/icons/heart.svg?skipsvgo';
  import LightingIcon from '@nd/assets/images/common/toastPopupIcon_lighting.svg?skipsvgo';
  import { useToastPopup } from '@nd/components/popup';

  definePageMeta({ layout: 'guide' });

  const toast = useToastPopup();

  const multipleTimers = ref<ReturnType<typeof setTimeout>[]>([]);
  const callbackLogVisible = ref(false);
  let callbackLogTimer: ReturnType<typeof setTimeout> | null = null;

  onUnmounted(() => {
    multipleTimers.value.forEach(clearTimeout);
    if (callbackLogTimer !== null) clearTimeout(callbackLogTimer);
  });

  function showBasic(): void {
    toast.open({ message: '제품을 선택해주세요.' });
  }

  function showWithIcon(): void {
    toast.open({
      message: '정기구독 시 추가 5% 할인 혜택이 있습니다.',
      showIcon: true,
      duration: 3000,
    });
  }

  function showWithIconAndClose(): void {
    toast.open({
      message: '정기구독 시 추가 5% 할인 + 매달 자동 배송으로 더 저렴하게 이용하세요',
      showIcon: true,
      showClose: true,
      duration: 0,
    });
  }

  function showMultiple(): void {
    toast.open({ message: '첫 번째 알림입니다.' });
    multipleTimers.value.push(setTimeout(() => toast.open({ message: '두 번째 알림입니다.', showIcon: true }), 300));
    multipleTimers.value.push(setTimeout(() => toast.open({ message: '세 번째 알림입니다.', showClose: true }), 600));
  }

  function showTheOtherIcon(): void {
    toast.open({
      message: 'Tip: 정기구독은 해지 전까지 회차가 계속 누적되어 등급 승급에 유리합니다.',
      showIcon: true,
      iconComponent: LightingIcon,
      showClose: true,
      duration: 0,
    });
  }

  function showWithCustomIcon(): void {
    toast.open({
      message: '알림이 등록되었습니다.',
      showIcon: true,
      iconComponent: NotificationIcon,
      duration: 3000,
    });
  }

  function showWithHeartIcon(): void {
    toast.open({
      message: '찜 목록에 추가되었습니다.',
      showIcon: true,
      iconComponent: HeartIcon,
      duration: 3000,
    });
  }

  function showWithOnClosed(): void {
    callbackLogVisible.value = false;
    if (callbackLogTimer !== null) clearTimeout(callbackLogTimer);

    toast.open({
      message: '삭제되었습니다.',
      duration: 2000,
      onClosed: () => {
        callbackLogVisible.value = true;
        callbackLogTimer = setTimeout(() => {
          callbackLogVisible.value = false;
        }, 3000);
      },
    });
  }
</script>

<style lang="scss" scoped>
  $b: 'toastPopupGuidePage';

  .#{$b} {
    display: flex;
    flex-direction: column;
    gap: $spacing-2xl;
    padding: $spacing-xl;
  }

  .#{$b}__header {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    padding-bottom: $spacing-xl;
    border-bottom: 1px solid $line-200;
  }

  .#{$b}__meta {
    display: flex;
    gap: $spacing-sm;
  }

  .#{$b}__badge {
    display: inline-flex;
    align-items: center;
    padding: 0.2rem $spacing-sm;
    background-color: $bg-accent-light-blue;
    color: $color-primary;
    border-radius: $radius-sm;
    font-size: $font-size-caption1;
    font-weight: $font-weight-bold;
    text-transform: uppercase;
  }

  .#{$b}__title {
    font-size: $font-size-h3;
    font-weight: $font-weight-bold;
    color: $text-900;
    margin: 0;
  }

  .#{$b}__desc {
    font-size: $font-size-body3;
    color: $text-700;
    line-height: $line-height-base;
    margin: 0;

    code {
      background-color: $bg-tertiary;
      padding: 0.1rem 0.4rem;
      border-radius: $radius-sm;
      font-size: $font-size-caption1;
    }
  }

  .#{$b}__section {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  .#{$b}__sectionTitle {
    font-size: $font-size-body2;
    font-weight: $font-weight-bold;
    color: $text-900;
    margin: 0;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid $line-300;
  }

  .#{$b}__group {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    padding: $spacing-md;
    background-color: $bg-secondary;
    border-radius: $radius-md;
  }

  .#{$b}__note {
    font-size: $font-size-body3;
    color: $text-700;
    line-height: $line-height-base;
    margin: 0;

    code {
      background-color: $bg-tertiary;
      padding: 0.1rem 0.4rem;
      border-radius: $radius-sm;
      font-size: $font-size-caption1;
    }
  }

  .#{$b}__row {
    display: flex;
    gap: $spacing-sm;
    flex-wrap: wrap;
  }

  .#{$b}__demoBtn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-sm $spacing-md;
    background-color: $text-900;
    color: $text-white;
    border: none;
    border-radius: $radius-md;
    font-size: $font-size-body3;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: opacity $duration-fast ease;

    &:hover {
      opacity: 0.8;
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px $color-primary;
    }
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
    color: $text-700;
    line-height: $line-height-base;

    code {
      background-color: $bg-tertiary;
      padding: 0.1rem 0.4rem;
      border-radius: $radius-sm;
      font-size: $font-size-caption1;
    }
  }

  .#{$b}__callbackLog {
    font-size: $font-size-body3;
    color: $color-primary;
    font-weight: $font-weight-medium;
    padding: $spacing-sm $spacing-md;
    background-color: $bg-accent-light-blue;
    border-radius: $radius-sm;
    opacity: 0;
    transition: opacity $duration-base ease;

    &--visible {
      opacity: 1;
    }
  }

  .#{$b}__radixNote {
    margin-top: $spacing-md;
    padding: $spacing-sm $spacing-md;
    background-color: $bg-secondary;
    border-left: 3px solid $line-100;
    border-radius: $radius-sm;
    font-size: $font-size-body3;
    color: $text-700;
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
