<template>
  <div class="inputAuthGuidePage">
    <!-- 헤더 -->
    <header class="inputAuthGuidePage__header">
      <div class="inputAuthGuidePage__meta">
        <span class="inputAuthGuidePage__badge">atoms</span>
        <span class="inputAuthGuidePage__badge inputAuthGuidePage__badge--wrapper">Wrapper</span>
      </div>
      <h1 class="inputAuthGuidePage__title">InputAuth</h1>
      <p class="inputAuthGuidePage__desc">
        본인인증 코드 입력 시 유효 시간을 시각적으로 표시하는 타이머 내장 Input Wrapper.<br />
        Input Base의 <code>#suffix</code> 슬롯에 <code>MM:SS</code> 카운트다운 텍스트를 삽입해 구성하며,<br />
        <code>autoStart</code> 또는 <code>active</code> prop으로 타이머를 제어합니다.<br />
        <code>FormField</code>와 조합해 라벨·에러 메시지를 연결하세요.
      </p>
    </header>

    <!-- ① autoStart 기본 데모 -->
    <section class="inputAuthGuidePage__section">
      <h2 class="inputAuthGuidePage__sectionTitle">① autoStart 기본 데모</h2>
      <p class="inputAuthGuidePage__note">
        <code>:auto-start="true"</code>를 전달하면 컴포넌트 마운트 직후 타이머가 자동으로 시작됩니다.<br />
        페이지 진입 시 인증 타이머를 즉시 보여줘야 하는 경우에 사용합니다.
      </p>

      <div class="inputAuthGuidePage__group">
        <p class="inputAuthGuidePage__groupTitle">3분 타이머 (마운트 즉시 시작)</p>
        <div class="inputAuthGuidePage__row">
          <div class="inputAuthGuidePage__item">
            <FormField label-text="인증번호" input-id="auto-start-demo">
              <InputAuth
                id="auto-start-demo"
                v-model="autoStartValue"
                :duration="180"
                :auto-start="true"
                placeholder="인증번호 6자리를 입력하세요"
                maxlength="6"
                inputmode="numeric"
                aria-describedby="helper-auto-start-demo"
                @timer-start="autoStartLog = '타이머 시작됨'"
                @timer-end="autoStartLog = '타이머 만료됨 (timer-end 이벤트 발생)'"
              />
            </FormField>
            <p v-if="autoStartLog" class="inputAuthGuidePage__eventLog">{{ autoStartLog }}</p>
            <pre class="inputAuthGuidePage__code"><code>&lt;FormField label-text="인증번호" input-id="auth-input"&gt;
  &lt;InputAuth
    id="auth-input"
    v-model="code"
    :duration="180"
    :auto-start="true"
    placeholder="인증번호 6자리를 입력하세요"
    maxlength="6"
    inputmode="numeric"
    @timer-end="handleExpired"
  /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ② active prop 제어 데모 -->
    <section class="inputAuthGuidePage__section">
      <h2 class="inputAuthGuidePage__sectionTitle">② active prop 제어 데모</h2>
      <p class="inputAuthGuidePage__note">
        <code>:active</code> prop으로 타이머를 외부에서 제어합니다.<br />
        <code>false → true</code> 전환 시 타이머를 <code>duration</code> 값으로 리셋하고 즉시 재시작합니다.<br />
        <code>true → false</code> 전환 시 타이머를 정지하고 잔여 시간을 초기화합니다 (만료 상태로 전환하지 않음).<br />
        인증번호 재발송 후 타이머를 재시작하는 시나리오에 사용합니다.
      </p>

      <div class="inputAuthGuidePage__group">
        <p class="inputAuthGuidePage__groupTitle">버튼으로 타이머 시작 / 정지 / 재시작</p>
        <div class="inputAuthGuidePage__row">
          <div class="inputAuthGuidePage__item">
            <div class="inputAuthGuidePage__controlBox">
              <Button variant="primary" size="sm" @click="activateTimer">
                {{ isTimerActive ? '재발송 (타이머 재시작)' : '인증번호 발송 (타이머 시작)' }}
              </Button>
              <Button variant="secondary" size="sm" :disabled="!isTimerActive" @click="deactivateTimer">
                타이머 정지
              </Button>
            </div>
            <FormField label-text="인증번호" input-id="active-demo">
              <InputAuth
                id="active-demo"
                v-model="activeValue"
                :duration="180"
                :active="isTimerActive"
                placeholder="인증번호 6자리를 입력하세요"
                maxlength="6"
                inputmode="numeric"
                aria-describedby="helper-active-demo"
                @timer-start="activeLog = '타이머 시작됨'"
                @timer-end="onActiveTimerEnd"
              />
            </FormField>
            <p v-if="activeLog" class="inputAuthGuidePage__eventLog">{{ activeLog }}</p>
            <pre class="inputAuthGuidePage__code"><code>&lt;InputAuth
  v-model="code"
  :duration="180"
  :active="isActive"
  @timer-start="onTimerStart"
  @timer-end="onTimerEnd"
/&gt;

&lt;!-- 재발송 버튼: isActive = true (이미 true면 false → true 사이클링) --&gt;
&lt;Button @click="isActive = true"&gt;인증번호 재발송&lt;/Button&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ③ 짧은 타이머 데모 (10초) -->
    <section class="inputAuthGuidePage__section">
      <h2 class="inputAuthGuidePage__sectionTitle">③ 짧은 타이머 데모 (10초)</h2>
      <p class="inputAuthGuidePage__note">
        <code>:duration="10"</code>으로 10초 타이머를 설정합니다.<br />
        타이머가 만료되면 suffix 텍스트가 사라지고 <code>timer-end</code> 이벤트가 발행됩니다.<br />
        만료 후에는 suffix 슬롯이 완전히 비어있는 상태로 전환됩니다.
      </p>

      <div class="inputAuthGuidePage__group">
        <p class="inputAuthGuidePage__groupTitle">10초 후 만료 확인</p>
        <div class="inputAuthGuidePage__row">
          <div class="inputAuthGuidePage__item">
            <Button variant="primary" size="sm" @click="restartShortTimer">
              {{ shortTimerStarted ? '타이머 재시작' : '10초 타이머 시작' }}
            </Button>
            <FormField label-text="인증번호" input-id="short-timer-demo">
              <InputAuth
                id="short-timer-demo"
                v-model="shortTimerValue"
                :duration="10"
                :active="isShortTimerActive"
                placeholder="10초 안에 입력하세요"
                aria-describedby="helper-short-timer-demo"
                @timer-end="onShortTimerEnd"
              />
            </FormField>
            <p v-if="shortTimerLog" class="inputAuthGuidePage__eventLog">{{ shortTimerLog }}</p>
            <pre class="inputAuthGuidePage__code"><code>&lt;InputAuth
  v-model="code"
  :duration="10"
  :active="isActive"
  @timer-end="handleExpired"
/&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ④ disabled 상태 + 타이머 독립 진행 -->
    <section class="inputAuthGuidePage__section">
      <h2 class="inputAuthGuidePage__sectionTitle">④ disabled 상태 + 타이머 독립 진행</h2>
      <p class="inputAuthGuidePage__note">
        <code>:disabled="true"</code>이면 입력 필드가 비활성화되어 입력·포커스·클릭이 모두 차단됩니다.<br />
        그러나 <strong>타이머는 disabled 상태와 독립적으로 계속 카운트다운</strong>됩니다.<br />
        입력을 막으면서도 유효 시간을 표시해야 하는 시나리오에 사용합니다.
      </p>

      <div class="inputAuthGuidePage__group">
        <p class="inputAuthGuidePage__groupTitle">disabled + 타이머 진행 중</p>
        <div class="inputAuthGuidePage__row">
          <div class="inputAuthGuidePage__item">
            <FormField label-text="인증번호 (비활성)" input-id="disabled-demo">
              <InputAuth
                id="disabled-demo"
                v-model="disabledValue"
                :duration="180"
                :auto-start="true"
                :disabled="true"
                placeholder="입력 비활성 상태"
                aria-describedby="helper-disabled-demo"
              />
            </FormField>
            <pre class="inputAuthGuidePage__code"><code>&lt;!-- disabled=true여도 타이머는 독립 진행 --&gt;
&lt;InputAuth
  v-model="code"
  :duration="180"
  :auto-start="true"
  :disabled="true"
/&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑤ error 상태 -->
    <section class="inputAuthGuidePage__section">
      <h2 class="inputAuthGuidePage__sectionTitle">⑤ error 상태</h2>
      <p class="inputAuthGuidePage__note">
        <code>:error="true"</code> 또는 <code>:error="'에러 문자열'"</code>을 전달하면 Input Base에 에러 상태가 위임됩니다.<br />
        에러 메시지 표시는 <code>FormField</code>의 <code>error-text</code> prop이 담당합니다.<br />
        에러 상태에서도 타이머는 계속 진행됩니다.
      </p>

      <div class="inputAuthGuidePage__group">
        <p class="inputAuthGuidePage__groupTitle">error + 타이머 진행 중</p>
        <div class="inputAuthGuidePage__row">
          <div class="inputAuthGuidePage__item">
            <FormField
              label-text="인증번호"
              input-id="error-demo"
              error-text="인증번호가 올바르지 않습니다."
            >
              <InputAuth
                id="error-demo"
                v-model="errorValue"
                :duration="180"
                :auto-start="true"
                :error="true"
                placeholder="인증번호 6자리를 입력하세요"
                maxlength="6"
                inputmode="numeric"
                aria-describedby="helper-error-demo"
              />
            </FormField>
            <pre class="inputAuthGuidePage__code"><code>&lt;FormField
  label-text="인증번호"
  input-id="auth-error"
  error-text="인증번호가 올바르지 않습니다."
&gt;
  &lt;InputAuth
    id="auth-error"
    v-model="code"
    :duration="180"
    :auto-start="true"
    :error="true"
    aria-describedby="helper-auth-error"
  /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="inputAuthGuidePage__group">
        <p class="inputAuthGuidePage__groupTitle">error + 만료 상태 (suffix 없음)</p>
        <p class="inputAuthGuidePage__note">
          타이머가 만료되면 suffix 영역이 비어있고, 에러 상태만 유지됩니다.
        </p>
        <div class="inputAuthGuidePage__row">
          <div class="inputAuthGuidePage__item">
            <FormField
              label-text="인증번호"
              input-id="error-expired-demo"
              error-text="인증 시간이 만료되었습니다. 재발송해주세요."
            >
              <!-- autoStart=false, active=false → 만료(expired) 상태 재현 -->
              <InputAuth
                id="error-expired-demo"
                v-model="errorExpiredValue"
                :duration="180"
                :error="true"
                placeholder="인증번호 6자리를 입력하세요"
                maxlength="6"
                inputmode="numeric"
                aria-describedby="helper-error-expired-demo"
              />
            </FormField>
            <pre class="inputAuthGuidePage__code"><code>&lt;!-- active=false (초기값) → expired 상태 (타이머 없음) --&gt;
&lt;InputAuth
  v-model="code"
  :duration="180"
  :error="true"
/&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑥ Props / Events -->
    <section class="inputAuthGuidePage__section">
      <h2 class="inputAuthGuidePage__sectionTitle">⑥ Props / Events</h2>

      <h3 class="inputAuthGuidePage__tableTitle">InputAuth Props</h3>
      <div class="inputAuthGuidePage__propsTableWrap">
        <table class="inputAuthGuidePage__propsTable">
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
              <td><code>modelValue</code></td>
              <td><code>string</code></td>
              <td><code>''</code></td>
              <td>입력값 (v-model). Input Base로 위임됨</td>
            </tr>
            <tr>
              <td><code>duration</code></td>
              <td><code>number</code></td>
              <td><code>180</code></td>
              <td>타이머 총 시간(초 단위). 예: <code>180</code> → <code>03:00</code>부터 카운트다운</td>
            </tr>
            <tr>
              <td><code>active</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>
                <code>false → true</code> 전환 시 타이머 리셋 후 재시작.<br />
                <code>true → false</code> 전환 시 정지 + 잔여 시간 초기화 (만료 상태 전환 없음)
              </td>
            </tr>
            <tr>
              <td><code>autoStart</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>마운트 직후 자동 시작. <code>active</code> prop과 독립 동작</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>입력 비활성. 타이머는 독립적으로 계속 진행됨</td>
            </tr>
            <tr>
              <td><code>error</code></td>
              <td><code>string | boolean</code></td>
              <td><code>false</code></td>
              <td>
                에러 상태. <code>!!error</code>로 boolean 캐스팅 후 Input Base에 위임.<br />
                에러 메시지 표시는 <code>FormField</code>의 <code>error-text</code> prop이 담당
              </td>
            </tr>
            <tr>
              <td><code>hideClear</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>clear 버튼 숨김 여부. Input Base로 위임됨</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="inputAuthGuidePage__note">
        <code>id</code>, <code>aria-describedby</code>, <code>aria-label</code>, <code>placeholder</code>,
        <code>maxlength</code>, <code>inputmode</code> 등 네이티브 속성은 <code>v-bind="$attrs"</code>를 통해
        Input Base의 <code>&lt;input&gt;</code> 요소로 자동 위임됩니다.
      </p>

      <h3 class="inputAuthGuidePage__tableTitle">타이머 상태</h3>
      <div class="inputAuthGuidePage__propsTableWrap">
        <table class="inputAuthGuidePage__propsTable">
          <thead>
            <tr>
              <th>상태</th>
              <th>시각적 변화</th>
              <th>기능적 변화</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>running</code></td>
              <td>suffix 영역에 <code>MM:SS</code> 카운트다운 텍스트 표시</td>
              <td>1초마다 카운트다운 진행</td>
            </tr>
            <tr>
              <td><code>expired</code></td>
              <td>suffix 타이머 텍스트 미표시 (suffix 영역 비어있음)</td>
              <td>타이머 정지, <code>timer-end</code> 이벤트 발행</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="inputAuthGuidePage__tableTitle">Events</h3>
      <div class="inputAuthGuidePage__propsTableWrap">
        <table class="inputAuthGuidePage__propsTable">
          <thead>
            <tr>
              <th>이름</th>
              <th>페이로드</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>timer-start</code></td>
              <td>—</td>
              <td>타이머가 시작(또는 재시작)될 때</td>
            </tr>
            <tr>
              <td><code>timer-end</code></td>
              <td>—</td>
              <td>카운트다운이 0에 도달해 타이머가 만료될 때</td>
            </tr>
            <tr>
              <td><code>update:modelValue</code></td>
              <td><code>string</code></td>
              <td>입력값 변경 시</td>
            </tr>
            <tr>
              <td><code>focus</code></td>
              <td>—</td>
              <td>입력 필드에 포커스가 진입할 때</td>
            </tr>
            <tr>
              <td><code>blur</code></td>
              <td><code>string</code></td>
              <td>입력 필드에서 포커스가 이탈할 때, 현재 값 전달</td>
            </tr>
            <tr>
              <td><code>change</code></td>
              <td><code>string</code></td>
              <td>포커스 이탈 + 값 변경 시</td>
            </tr>
            <tr>
              <td><code>clear</code></td>
              <td>—</td>
              <td>clear 버튼 클릭 시</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="inputAuthGuidePage__delegationNote">
        <strong>네이티브 속성 위임 (이중 위임 구조)</strong>:
        <code>InputAuth</code>는 <code>defineOptions({ inheritAttrs: false })</code>를 선언하고
        <code>v-bind="$attrs"</code>로 모든 네이티브 attrs를 Input Base에 위임합니다.
        Input Base가 다시 <code>&lt;input&gt;</code> 요소에 위임하는 이중 위임 구조로 동작합니다.<br />
        <code>id</code>, <code>aria-label</code>, <code>aria-describedby</code>, <code>maxlength</code>,
        <code>inputmode</code>, <code>autocomplete</code>, <code>data-*</code> 등을 컴포넌트에 직접 전달할 수 있습니다.<br />
        React의 <code>&#123;...rest&#125;</code> props spreading과 동일한 동작입니다.
      </p>

      <p class="inputAuthGuidePage__formFieldNote">
        FormField Props/Slots 상세 설명은 <a href="/guide/input">Input 가이드 페이지</a>를 참조하세요.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { InputAuth } from '@nd/components/atoms';

  definePageMeta({ layout: 'guide' });

  // ① autoStart 데모
  const autoStartValue = ref('');
  const autoStartLog = ref('');

  // ② active prop 제어 데모
  const activeValue = ref('');
  const activeLog = ref('');
  const isTimerActive = ref(false);

  function activateTimer(): void {
    if (isTimerActive.value) {
      // 이미 active=true인 상태에서 재시작: false → true 사이클링
      isTimerActive.value = false;
      nextTick(() => {
        isTimerActive.value = true;
      });
    } else {
      isTimerActive.value = true;
    }
  }

  function deactivateTimer(): void {
    isTimerActive.value = false;
    activeLog.value = '타이머 정지됨 (active=false)';
  }

  function onActiveTimerEnd(): void {
    isTimerActive.value = false;
    activeLog.value = '타이머 만료됨 (timer-end 이벤트 발생)';
  }

  // ③ 짧은 타이머 데모 (10초)
  const shortTimerValue = ref('');
  const shortTimerLog = ref('');
  const isShortTimerActive = ref(false);
  const shortTimerStarted = ref(false);

  function restartShortTimer(): void {
    shortTimerLog.value = '';
    shortTimerStarted.value = true;

    if (isShortTimerActive.value) {
      // 재시작: false → true 사이클링
      isShortTimerActive.value = false;
      nextTick(() => {
        isShortTimerActive.value = true;
      });
    } else {
      isShortTimerActive.value = true;
    }
  }

  function onShortTimerEnd(): void {
    isShortTimerActive.value = false;
    shortTimerLog.value = 'timer-end 이벤트 발생! suffix 텍스트가 사라집니다.';
  }

  // ④ disabled + 타이머 독립 진행
  const disabledValue = ref('');

  // ⑤ error 상태
  const errorValue = ref('');
  const errorExpiredValue = ref('');
</script>

<style lang="scss" scoped src="./input-auth.scss"></style>
