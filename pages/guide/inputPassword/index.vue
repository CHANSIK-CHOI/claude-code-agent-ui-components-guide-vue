<template>
  <div class="inputPasswordGuidePage">
    <!-- 헤더 -->
    <header class="inputPasswordGuidePage__header">
      <div class="inputPasswordGuidePage__meta">
        <span class="inputPasswordGuidePage__badge">atoms</span>
      </div>
      <h1 class="inputPasswordGuidePage__title">InputPassword</h1>
      <p class="inputPasswordGuidePage__desc">
        비밀번호 입력 전용 Input Wrapper.<br />
        suffix 슬롯에 보기/숨기기 토글 버튼을 삽입해 비밀번호 가시성을 제어합니다.<br />
        <code>FormField</code>와 조합해 라벨·에러 메시지를 함께 사용합니다.
      </p>
    </header>

    <!-- ① 기본 상태 -->
    <section class="inputPasswordGuidePage__section">
      <h2 class="inputPasswordGuidePage__sectionTitle">① 기본 상태</h2>
      <p class="inputPasswordGuidePage__note">
        초기 상태는 항상 비밀번호 숨김(<code>type="password"</code>)입니다.<br />
        토글 버튼 클릭 시 숨김 ↔ 보임이 전환되고 <code>toggle</code> 이벤트가 발행됩니다.
      </p>
      <div class="inputPasswordGuidePage__group">
        <p class="inputPasswordGuidePage__groupTitle">v-model + 토글 데모</p>
        <div class="inputPasswordGuidePage__row">
          <div class="inputPasswordGuidePage__item">
            <InputPassword
              v-model="basicValue"
              placeholder="비밀번호를 입력하세요"
              aria-label="비밀번호"
              @toggle="onToggle"
            />
            <p class="inputPasswordGuidePage__eventLog">
              현재 값: {{ basicValue || '(없음)' }} / 가시성: {{ isVisible ? '보임' : '숨김' }}
            </p>
            <pre class="inputPasswordGuidePage__code"><code>&lt;InputPassword
  v-model="value"
  placeholder="비밀번호를 입력하세요"
  aria-label="비밀번호"
  @toggle="onToggle"
/&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ② 에러 상태 -->
    <section class="inputPasswordGuidePage__section">
      <h2 class="inputPasswordGuidePage__sectionTitle">② 에러 상태</h2>
      <p class="inputPasswordGuidePage__note">
        <code>error</code> prop에 문자열을 전달하면 에러 테두리가 표시되고
        컴포넌트 하단에 에러 메시지가 렌더됩니다.<br />
        내부적으로 <code>!!error</code>로 변환해 Input Base에 전달하며,
        에러 텍스트는 InputPassword가 직접 <code>&lt;p class="inputPassword__error"&gt;</code>로 렌더링합니다.
      </p>
      <div class="inputPasswordGuidePage__group">
        <p class="inputPasswordGuidePage__groupTitle">error prop 전달</p>
        <div class="inputPasswordGuidePage__row">
          <div class="inputPasswordGuidePage__item">
            <InputPassword
              v-model="errorValue"
              placeholder="비밀번호를 입력하세요"
              aria-label="비밀번호 (에러 상태)"
              error="비밀번호는 8자 이상 영문·숫자·특수문자를 포함해야 합니다."
            />
            <pre class="inputPasswordGuidePage__code"><code>&lt;InputPassword
  v-model="value"
  placeholder="비밀번호를 입력하세요"
  error="비밀번호는 8자 이상 영문·숫자·특수문자를 포함해야 합니다."
/&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ③ disabled 상태 -->
    <section class="inputPasswordGuidePage__section">
      <h2 class="inputPasswordGuidePage__sectionTitle">③ disabled 상태</h2>
      <p class="inputPasswordGuidePage__note">
        <code>:disabled="true"</code>를 전달하면 입력 필드와 토글 버튼이 모두 비활성됩니다.<br />
        토글 버튼에 <code>opacity: 0.4</code>가 적용되며, 클릭해도 가시성이 변경되지 않습니다.
      </p>
      <div class="inputPasswordGuidePage__group">
        <p class="inputPasswordGuidePage__groupTitle">disabled — 입력 불가 + 토글 버튼 비활성</p>
        <div class="inputPasswordGuidePage__row">
          <div class="inputPasswordGuidePage__item">
            <InputPassword
              v-model="disabledValue"
              :disabled="true"
              aria-label="비밀번호 (비활성)"
            />
            <pre class="inputPasswordGuidePage__code"><code>&lt;InputPassword
  v-model="value"
  :disabled="true"
  aria-label="비밀번호"
/&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ④ readonly 상태 -->
    <section class="inputPasswordGuidePage__section">
      <h2 class="inputPasswordGuidePage__sectionTitle">④ readonly 상태</h2>
      <p class="inputPasswordGuidePage__note">
        <code>:readonly="true"</code>를 전달하면 입력만 차단됩니다.<br />
        <code>disabled</code>와 달리 토글 버튼은 정상 동작해 가시성을 변경할 수 있습니다.
      </p>
      <div class="inputPasswordGuidePage__group">
        <p class="inputPasswordGuidePage__groupTitle">readonly — 입력만 차단, 토글 버튼 동작</p>
        <div class="inputPasswordGuidePage__row">
          <div class="inputPasswordGuidePage__item">
            <InputPassword
              v-model="readonlyValue"
              :readonly="true"
              aria-label="비밀번호 (읽기 전용)"
            />
            <pre class="inputPasswordGuidePage__code"><code>&lt;InputPassword
  v-model="value"
  :readonly="true"
  aria-label="비밀번호"
/&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑤ FormField 조합 -->
    <section class="inputPasswordGuidePage__section">
      <h2 class="inputPasswordGuidePage__sectionTitle">⑤ FormField 조합</h2>
      <p class="inputPasswordGuidePage__note">
        <code>FormField</code>와 조합하면 라벨·도움말·에러 메시지를 일관된 레이아웃으로 표시할 수 있습니다.<br />
        <code>id</code>를 InputPassword에 전달하면 <code>$attrs</code> 위임으로 내부 <code>&lt;input&gt;</code>까지 전달됩니다.
      </p>
      <div class="inputPasswordGuidePage__group">
        <p class="inputPasswordGuidePage__groupTitle">FormField + InputPassword (기본)</p>
        <div class="inputPasswordGuidePage__row">
          <div class="inputPasswordGuidePage__item">
            <FormField label-text="비밀번호" input-id="ff-pw-basic">
              <InputPassword id="ff-pw-basic" v-model="formBasicValue" placeholder="비밀번호를 입력하세요" />
            </FormField>
            <pre class="inputPasswordGuidePage__code"><code>&lt;FormField label-text="비밀번호" input-id="ff-pw-basic"&gt;
  &lt;InputPassword id="ff-pw-basic" v-model="value" placeholder="비밀번호를 입력하세요" /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="inputPasswordGuidePage__group">
        <p class="inputPasswordGuidePage__groupTitle">FormField + InputPassword (도움말 있음)</p>
        <div class="inputPasswordGuidePage__row">
          <div class="inputPasswordGuidePage__item">
            <FormField
              label-text="비밀번호"
              input-id="ff-pw-helper"
              helper-text="영문·숫자·특수문자 포함 8자 이상"
            >
              <InputPassword
                id="ff-pw-helper"
                v-model="formHelperValue"
                placeholder="비밀번호를 입력하세요"
                aria-describedby="helper-ff-pw-helper"
              />
            </FormField>
            <pre class="inputPasswordGuidePage__code"><code>&lt;FormField
  label-text="비밀번호"
  input-id="ff-pw-helper"
  helper-text="영문·숫자·특수문자 포함 8자 이상"
&gt;
  &lt;InputPassword
    id="ff-pw-helper"
    v-model="value"
    placeholder="비밀번호를 입력하세요"
    aria-describedby="helper-ff-pw-helper"
  /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="inputPasswordGuidePage__group">
        <p class="inputPasswordGuidePage__groupTitle">FormField + InputPassword (에러 메시지)</p>
        <p class="inputPasswordGuidePage__note">
          InputPassword의 <code>error</code> prop이 에러 메시지를 직접 렌더링합니다.<br />
          FormField의 <code>error-text</code>와 중복 사용하지 않도록 주의합니다.
        </p>
        <div class="inputPasswordGuidePage__row">
          <div class="inputPasswordGuidePage__item">
            <FormField label-text="비밀번호" input-id="ff-pw-error" :required="true">
              <InputPassword
                id="ff-pw-error"
                v-model="formErrorValue"
                placeholder="비밀번호를 입력하세요"
                error="비밀번호는 8자 이상이어야 합니다."
              />
            </FormField>
            <pre class="inputPasswordGuidePage__code"><code>&lt;FormField label-text="비밀번호" input-id="ff-pw-error" :required="true"&gt;
  &lt;InputPassword
    id="ff-pw-error"
    v-model="value"
    placeholder="비밀번호를 입력하세요"
    error="비밀번호는 8자 이상이어야 합니다."
  /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <p class="inputPasswordGuidePage__note">
        FormField Props/Slots 상세 설명은 <a href="/guide/input">Input 가이드 페이지</a>를 참조하세요.
      </p>
    </section>

    <!-- ⑥ Props / Events -->
    <section class="inputPasswordGuidePage__section">
      <h2 class="inputPasswordGuidePage__sectionTitle">⑥ Props / Events</h2>

      <h3 class="inputPasswordGuidePage__tableTitle">Props</h3>
      <div class="inputPasswordGuidePage__propsTableWrap">
        <table class="inputPasswordGuidePage__propsTable">
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
              <td>입력값 (v-model 연동)</td>
            </tr>
            <tr>
              <td><code>error</code></td>
              <td><code>string | undefined</code></td>
              <td><code>undefined</code></td>
              <td>
                에러 메시지 문자열. 전달 시 에러 테두리 + 하단 에러 텍스트 표시.<br />
                내부에서 <code>!!error</code>로 변환해 Input Base에 전달
              </td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>입력 불가 + 토글 버튼 비활성. 토글 클릭 이벤트 차단</td>
            </tr>
            <tr>
              <td><code>readonly</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>입력만 차단. 토글 버튼은 정상 동작</td>
            </tr>
            <tr>
              <td><code>placeholder</code></td>
              <td><code>string</code></td>
              <td><code>''</code></td>
              <td>값이 없을 때 표시할 안내 텍스트</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="inputPasswordGuidePage__tableTitle">Events</h3>
      <div class="inputPasswordGuidePage__propsTableWrap">
        <table class="inputPasswordGuidePage__propsTable">
          <thead>
            <tr>
              <th>이름</th>
              <th>페이로드</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>update:modelValue</code></td>
              <td><code>string</code></td>
              <td>입력값 변경 시 (Input Base relay)</td>
            </tr>
            <tr>
              <td><code>toggle</code></td>
              <td><code>boolean</code></td>
              <td>
                토글 버튼 클릭 시. payload = 변경 후 가시성 상태 (<code>true</code> = 보임 / <code>false</code> = 숨김).<br />
                <code>disabled</code> 상태에서는 발생하지 않음
              </td>
            </tr>
            <tr>
              <td><code>focus</code></td>
              <td>—</td>
              <td>입력 필드 포커스 진입 시 (Input Base relay)</td>
            </tr>
            <tr>
              <td><code>blur</code></td>
              <td><code>string</code></td>
              <td>입력 필드 포커스 이탈 시, 현재 값 전달 (Input Base relay)</td>
            </tr>
            <tr>
              <td><code>change</code></td>
              <td><code>string</code></td>
              <td>포커스 이탈 + 값 변경 시 (Input Base relay)</td>
            </tr>
            <tr>
              <td><code>clear</code></td>
              <td>—</td>
              <td>clear 버튼 클릭 시 (Input Base relay)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="inputPasswordGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는 <code>v-bind="$attrs"</code>를 사용하므로
        위 Props 외에도 <code>&lt;input&gt;</code> 요소의 모든 네이티브 HTML 속성
        (<code>id</code>, <code>name</code>, <code>maxlength</code>, <code>autocomplete</code>,
        <code>aria-label</code>, <code>aria-describedby</code>, <code>data-*</code> 등)을
        그대로 전달할 수 있습니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ layout: 'guide' })

  // ① 기본 상태
  const basicValue = ref('')
  const isVisible = ref(false)

  function onToggle(visible: boolean): void {
    isVisible.value = visible
  }

  // ② 에러 상태
  const errorValue = ref('')

  // ③ disabled 상태
  const disabledValue = ref('비활성 상태 입력값')

  // ④ readonly 상태
  const readonlyValue = ref('읽기 전용 입력값')

  // ⑤ FormField 조합
  const formBasicValue = ref('')
  const formHelperValue = ref('')
  const formErrorValue = ref('')
</script>

<style lang="scss" scoped src="./inputPassword.scss"></style>
