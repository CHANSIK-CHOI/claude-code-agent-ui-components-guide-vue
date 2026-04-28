<template>
  <div class="inputGuidePage">
    <!-- 헤더 -->
    <header class="inputGuidePage__header">
      <div class="inputGuidePage__meta">
        <span class="inputGuidePage__badge">atoms</span>
      </div>
      <h1 class="inputGuidePage__title">Input</h1>
      <p class="inputGuidePage__desc">
        사용자가 텍스트를 직접 입력하는 기본 폼 요소.<br />
        라벨 · 툴팁 · 도움말 텍스트는 <code>FormField</code> (molecules)와
        조합해 사용합니다.<br />
        <code>disabled</code> / <code>readonly</code> /
        <code>error</code> 상태를 지원합니다.
      </p>
    </header>

    <!-- ① 기본 조합 -->
    <section class="inputGuidePage__section">
      <h2 class="inputGuidePage__sectionTitle">① 기본 조합</h2>

      <div class="inputGuidePage__group">
        <p class="inputGuidePage__groupTitle">Input 단독 (라벨 없음)</p>
        <p class="inputGuidePage__note">
          라벨이 외부에서 제공되거나 불필요한 경우. <code>aria-label</code>을
          직접 전달.
        </p>
        <div class="inputGuidePage__row">
          <div class="inputGuidePage__item">
            <Input
              v-model="demo1"
              placeholder="이름을 입력하세요"
              aria-label="이름"
            />
            <pre
              class="inputGuidePage__code"
            ><code>&lt;Input v-model="value" placeholder="이름을 입력하세요" aria-label="이름" /&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="inputGuidePage__group">
        <p class="inputGuidePage__groupTitle">FormField + Input (라벨 있음)</p>
        <div class="inputGuidePage__row">
          <div class="inputGuidePage__item">
            <FormField label-text="이메일" input-id="demo-email">
              <Input
                id="demo-email"
                v-model="demo2"
                placeholder="example@email.com"
              />
            </FormField>
            <pre
              class="inputGuidePage__code"
            ><code>&lt;FormField label-text="이메일" input-id="demo-email"&gt;
  &lt;Input id="demo-email" v-model="value" placeholder="example@email.com" /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="inputGuidePage__group">
        <p class="inputGuidePage__groupTitle">
          FormField + Input (도움말 있음)
        </p>
        <div class="inputGuidePage__row">
          <div class="inputGuidePage__item">
            <FormField
              label-text="비밀번호"
              input-id="demo-pw"
              helper-text="영문, 숫자, 특수문자 포함 8자 이상"
            >
              <Input
                id="demo-pw"
                v-model="demo3"
                type="password"
                placeholder="비밀번호를 입력하세요"
                aria-describedby="helper-demo-pw"
              />
            </FormField>
            <pre class="inputGuidePage__code"><code>&lt;FormField
  label-text="비밀번호"
  input-id="demo-pw"
  helper-text="영문, 숫자, 특수문자 포함 8자 이상"
&gt;
  &lt;Input
    id="demo-pw"
    v-model="value"
    type="password"
    placeholder="비밀번호를 입력하세요"
    aria-describedby="helper-demo-pw"
  /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="inputGuidePage__group">
        <p class="inputGuidePage__groupTitle">FormField + Input (툴팁 있음)</p>
        <div class="inputGuidePage__row">
          <div class="inputGuidePage__item">
            <FormField label-text="포인트" input-id="demo-point">
              <template #tooltip>
                <button
                  type="button"
                  class="inputGuidePage__tooltipBtn"
                  aria-label="포인트 안내"
                >
                  <TooltipIcon />
                </button>
              </template>
              <Input
                id="demo-point"
                v-model="demo4"
                placeholder="사용할 포인트"
              />
            </FormField>
            <pre
              class="inputGuidePage__code"
            ><code>&lt;FormField label-text="포인트" input-id="demo-point"&gt;
  &lt;template #tooltip&gt;
    &lt;!-- Tooltip 컴포넌트 삽입 --&gt;
    &lt;button type="button" aria-label="포인트 안내"&gt;...&lt;/button&gt;
  &lt;/template&gt;
  &lt;Input id="demo-point" v-model="value" placeholder="사용할 포인트" /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="inputGuidePage__group">
        <p class="inputGuidePage__groupTitle">FormField + Input (필수 항목)</p>
        <div class="inputGuidePage__row">
          <div class="inputGuidePage__item">
            <FormField label-text="이름" input-id="demo-name" :required="true">
              <Input
                id="demo-name"
                v-model="demo5"
                placeholder="이름을 입력하세요"
                required
              />
            </FormField>
            <pre
              class="inputGuidePage__code"
            ><code>&lt;FormField label-text="이름" input-id="demo-name" :required="true"&gt;
  &lt;Input id="demo-name" v-model="value" placeholder="이름을 입력하세요" required /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="inputGuidePage__group">
        <p class="inputGuidePage__groupTitle">
          FormField + Input (에러 메시지)
        </p>
        <p class="inputGuidePage__note">
          <code>error-text</code>에 문자열을 전달하면 빨간색으로 표시됩니다.
          <code>helper-text</code>와 동시에 지정하면 <code>error-text</code>가
          우선합니다.<br />
          <code>role="alert"</code>가 자동 부여되어 스크린 리더가 즉시 읽습니다.
        </p>
        <div class="inputGuidePage__row">
          <div class="inputGuidePage__item">
            <FormField
              label-text="이메일"
              input-id="demo-error"
              error-text="올바른 이메일 형식이 아닙니다."
            >
              <Input
                id="demo-error"
                v-model="demo6"
                :error="true"
                placeholder="example@email.com"
                aria-describedby="helper-demo-error"
              />
            </FormField>
            <pre class="inputGuidePage__code"><code>&lt;FormField
  label-text="이메일"
  input-id="demo-error"
  error-text="올바른 이메일 형식이 아닙니다."
&gt;
  &lt;!-- Input의 :error="true" → aria-invalid 전달 --&gt;
  &lt;!-- FormField가 role="alert" 자동 부여 --&gt;
  &lt;Input
    id="demo-error"
    v-model="value"
    :error="true"
    placeholder="example@email.com"
    aria-describedby="helper-demo-error"
  /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ② 상태별 -->
    <section class="inputGuidePage__section">
      <h2 class="inputGuidePage__sectionTitle">② 상태별</h2>

      <div class="inputGuidePage__group">
        <p class="inputGuidePage__groupTitle">default</p>
        <div class="inputGuidePage__row">
          <div class="inputGuidePage__item">
            <Input
              v-model="stateDemos.default"
              placeholder="입력해주세요"
              aria-label="기본 입력"
            />
          </div>
        </div>
      </div>

      <div class="inputGuidePage__group">
        <p class="inputGuidePage__groupTitle">filled</p>
        <div class="inputGuidePage__row">
          <div class="inputGuidePage__item">
            <Input
              v-model="stateDemos.filled"
              placeholder="입력해주세요"
              aria-label="채워진 입력"
            />
          </div>
        </div>
      </div>

      <div class="inputGuidePage__group">
        <p class="inputGuidePage__groupTitle">focus</p>
        <p class="inputGuidePage__note">클릭하면 focus 상태로 전환됩니다.</p>
        <div class="inputGuidePage__row">
          <div class="inputGuidePage__item">
            <Input
              v-model="stateDemos.focus"
              placeholder="클릭해서 포커스 확인"
              aria-label="포커스 테스트"
            />
          </div>
        </div>
      </div>

      <div class="inputGuidePage__group">
        <p class="inputGuidePage__groupTitle">disabled</p>
        <div class="inputGuidePage__row">
          <div class="inputGuidePage__item">
            <Input
              v-model="stateDemos.disabled"
              :disabled="true"
              placeholder="비활성 상태"
              aria-label="비활성 입력"
            />
          </div>
        </div>
      </div>

      <div class="inputGuidePage__group">
        <p class="inputGuidePage__groupTitle">readonly</p>
        <div class="inputGuidePage__row">
          <div class="inputGuidePage__item">
            <Input
              v-model="stateDemos.readonly"
              :readonly="true"
              aria-label="읽기 전용 입력"
            />
          </div>
        </div>
      </div>

      <div class="inputGuidePage__group">
        <p class="inputGuidePage__groupTitle">error</p>
        <div class="inputGuidePage__row">
          <div class="inputGuidePage__item">
            <FormField
              label-text="이메일"
              input-id="state-error"
              error-text="올바른 이메일 형식이 아닙니다."
            >
              <Input
                id="state-error"
                v-model="stateDemos.error"
                :error="true"
                placeholder="example@email.com"
                aria-describedby="helper-state-error"
              />
            </FormField>
          </div>
        </div>
      </div>
    </section>

    <!-- ③ Props 참조 -->
    <section class="inputGuidePage__section">
      <h2 class="inputGuidePage__sectionTitle">③ Props</h2>

      <h3 class="inputGuidePage__tableTitle">Input Props</h3>
      <table class="inputGuidePage__propsTable">
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
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>
              <code>aria-invalid="true"</code> 전달. 시각적 에러 표시는
              FormField 담당
            </td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>비활성 여부. 입력/포커스/클릭 모두 차단</td>
          </tr>
          <tr>
            <td><code>readonly</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>읽기 전용. 입력만 차단, 포커스·선택·복사 가능</td>
          </tr>
          <tr>
            <td><code>placeholder</code></td>
            <td><code>string</code></td>
            <td><code>''</code></td>
            <td>placeholder 텍스트</td>
          </tr>
          <tr>
            <td><code>type</code></td>
            <td><code>string</code></td>
            <td><code>'text'</code></td>
            <td>HTML input type (text/email/password/tel/number)</td>
          </tr>
        </tbody>
      </table>

      <h3 class="inputGuidePage__tableTitle">FormField Props</h3>
      <table class="inputGuidePage__propsTable">
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
            <td><code>inputId</code></td>
            <td><code>string</code></td>
            <td>필수</td>
            <td>
              label for 연결용 id. 내부 Input의 id와 일치해야 함.<br />
              도움말 id는 <code>helper-{inputId}</code>로 자동 생성
            </td>
          </tr>
          <tr>
            <td><code>labelText</code></td>
            <td><code>string</code></td>
            <td><code>''</code></td>
            <td>라벨 텍스트</td>
          </tr>
          <tr>
            <td><code>showLabel</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>라벨 영역 표시 여부</td>
          </tr>
          <tr>
            <td><code>required</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>
              라벨 옆 <code>*</code> 시각 표시. <code>aria-required</code>는
              Input에 직접 전달
            </td>
          </tr>
          <tr>
            <td><code>helperText</code></td>
            <td><code>string</code></td>
            <td><code>''</code></td>
            <td>
              일반 도움말. 값이 있으면 자동 표시. <code>errorText</code>도
              있으면 <code>errorText</code>가 우선 표시됨
            </td>
          </tr>
          <tr>
            <td><code>errorText</code></td>
            <td><code>string</code></td>
            <td><code>''</code></td>
            <td>
              에러 메시지. 값이 있으면 빨간색으로 표시되며
              <code>helperText</code>보다 우선함. <code>role="alert"</code> 자동
              부여
            </td>
          </tr>
        </tbody>
      </table>

      <h3 class="inputGuidePage__tableTitle">Input Events</h3>
      <table class="inputGuidePage__propsTable">
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
            <td>입력값 변경 시 (입력마다 발생)</td>
          </tr>
          <tr>
            <td><code>focus</code></td>
            <td>—</td>
            <td>포커스 진입 시</td>
          </tr>
          <tr>
            <td><code>blur</code></td>
            <td><code>string</code></td>
            <td>포커스 이탈 시, 현재 값 전달</td>
          </tr>
          <tr>
            <td><code>change</code></td>
            <td><code>string</code></td>
            <td>포커스 이탈 + 값 변경 시</td>
          </tr>
        </tbody>
      </table>

      <h3 class="inputGuidePage__tableTitle">FormField Slots</h3>
      <table class="inputGuidePage__propsTable">
        <thead>
          <tr>
            <th>이름</th>
            <th>설명</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>default</code></td>
            <td>Input, Select, DatePicker 등 임의 폼 컨트롤 삽입</td>
          </tr>
          <tr>
            <td><code>tooltip</code></td>
            <td>라벨 우측 툴팁 영역. 슬롯에 내용이 있으면 자동으로 렌더링됨</td>
          </tr>
        </tbody>
      </table>

      <p class="inputGuidePage__delegationNote">
        <strong>aria-describedby 연결 규칙</strong>: <code>FormField</code>의
        도움말 요소 id는 <code>helper-{inputId}</code> 형식으로 자동
        생성됩니다.<br />
        내부 Input에 <code>aria-describedby="helper-{inputId}"</code>를 직접
        전달하면 스크린 리더가 도움말 텍스트를 읽습니다.
      </p>

      <p class="inputGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: <code>Input</code>은
        <code>v-bind="$attrs"</code>를 사용하므로
        <code>&lt;input&gt;</code> 요소의 모든 네이티브 HTML 속성
        (<code>maxlength</code>, <code>pattern</code>,
        <code>autocomplete</code>, <code>aria-label</code>,
        <code>aria-describedby</code> 등)을 그대로 전달할 수 있습니다.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { TooltipIcon } from '~/components/icons'

definePageMeta({ layout: "guide" });

const demo1 = ref("");
const demo2 = ref("");
const demo3 = ref("");
const demo4 = ref("");
const demo5 = ref("");
const demo6 = ref("");

const stateDemos = reactive({
  default: "",
  filled: "입력된 텍스트",
  disabled: "비활성 입력값",
  focus: "포커싱 텍스트",
  readonly: "읽기 전용 텍스트",
  error: "",
});
</script>

<style lang="scss" scoped src="./input.scss"></style>
