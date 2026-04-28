<template>
  <div class="textAreaGuidePage">
    <!-- 헤더 -->
    <header class="textAreaGuidePage__header">
      <div class="textAreaGuidePage__meta">
        <span class="textAreaGuidePage__badge">atoms</span>
      </div>
      <h1 class="textAreaGuidePage__title">TextArea</h1>
      <p class="textAreaGuidePage__desc">
        사용자가 여러 줄의 텍스트를 입력하는 폼 요소. 최대 글자 수 카운터를 내장합니다.<br />
        라벨 · 도움말 텍스트는 <code>FormField</code> (molecules)와 조합해 사용합니다.<br />
        <code>disabled</code> / <code>readonly</code> / <code>error</code> 상태와
        <code>resize</code> 방향을 지원합니다.
      </p>
    </header>

    <!-- ① 기본 조합 -->
    <section class="textAreaGuidePage__section">
      <h2 class="textAreaGuidePage__sectionTitle">① 기본 조합</h2>

      <div class="textAreaGuidePage__group">
        <p class="textAreaGuidePage__groupTitle">TextArea 단독 (라벨 없음)</p>
        <p class="textAreaGuidePage__note">
          라벨이 외부에서 제공되거나 불필요한 경우. <code>aria-label</code>을 직접 전달.
        </p>
        <div class="textAreaGuidePage__row">
          <div class="textAreaGuidePage__item">
            <TextArea
              v-model="demo1"
              placeholder="내용을 입력해주세요"
              aria-label="내용"
            />
            <pre
              class="textAreaGuidePage__code"
            ><code>&lt;TextArea v-model="value" placeholder="내용을 입력해주세요" aria-label="내용" /&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="textAreaGuidePage__group">
        <p class="textAreaGuidePage__groupTitle">FormField + TextArea (라벨 있음)</p>
        <div class="textAreaGuidePage__row">
          <div class="textAreaGuidePage__item">
            <FormField label-text="상품 문의" input-id="demo-inquiry">
              <TextArea
                id="demo-inquiry"
                v-model="demo2"
                placeholder="문의 내용을 입력해주세요"
              />
            </FormField>
            <pre
              class="textAreaGuidePage__code"
            ><code>&lt;FormField label-text="상품 문의" input-id="demo-inquiry"&gt;
  &lt;TextArea id="demo-inquiry" v-model="value" placeholder="문의 내용을 입력해주세요" /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="textAreaGuidePage__group">
        <p class="textAreaGuidePage__groupTitle">FormField + TextArea (도움말 있음)</p>
        <div class="textAreaGuidePage__row">
          <div class="textAreaGuidePage__item">
            <FormField
              label-text="리뷰 작성"
              input-id="demo-review"
              helper-text="최대 500자까지 입력 가능합니다."
            >
              <TextArea
                id="demo-review"
                v-model="demo3"
                placeholder="리뷰를 작성해주세요"
                aria-describedby="helper-demo-review"
              />
            </FormField>
            <pre class="textAreaGuidePage__code"><code>&lt;FormField
  label-text="리뷰 작성"
  input-id="demo-review"
  helper-text="최대 500자까지 입력 가능합니다."
&gt;
  &lt;TextArea
    id="demo-review"
    v-model="value"
    placeholder="리뷰를 작성해주세요"
    aria-describedby="helper-demo-review"
  /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="textAreaGuidePage__group">
        <p class="textAreaGuidePage__groupTitle">FormField + TextArea (maxLength 카운터)</p>
        <p class="textAreaGuidePage__note">
          <!-- maxLength 설정 시 카운터 자동 노출 -->
          <code>:max-length="300"</code> prop 설정 시 하단에 글자 수 카운터가 자동으로 노출됩니다.
        </p>
        <div class="textAreaGuidePage__row">
          <div class="textAreaGuidePage__item">
            <FormField label-text="문의 내용" input-id="demo-maxlength">
              <TextArea
                id="demo-maxlength"
                v-model="demo4"
                :max-length="300"
                placeholder="문의 내용을 입력해주세요 (최대 300자)"
              />
            </FormField>
            <pre class="textAreaGuidePage__code"><code>&lt;FormField label-text="문의 내용" input-id="demo-maxlength"&gt;
  &lt;!-- maxLength 설정 시 카운터 자동 노출 --&gt;
  &lt;TextArea id="demo-maxlength" v-model="value" :max-length="300" placeholder="문의 내용을 입력해주세요 (최대 300자)" /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="textAreaGuidePage__group">
        <p class="textAreaGuidePage__groupTitle">FormField + TextArea (에러 메시지)</p>
        <p class="textAreaGuidePage__note">
          <code>error-text</code>에 문자열을 전달하면 빨간색으로 표시됩니다.
          <code>role="alert"</code>가 자동 부여되어 스크린 리더가 즉시 읽습니다.
        </p>
        <div class="textAreaGuidePage__row">
          <div class="textAreaGuidePage__item">
            <FormField
              label-text="문의 내용"
              input-id="demo-error"
              error-text="내용을 입력해주세요."
            >
              <TextArea
                id="demo-error"
                v-model="demo5"
                :error="true"
                placeholder="내용을 입력해주세요"
                aria-describedby="helper-demo-error"
              />
            </FormField>
            <pre class="textAreaGuidePage__code"><code>&lt;FormField
  label-text="문의 내용"
  input-id="demo-error"
  error-text="내용을 입력해주세요."
&gt;
  &lt;!-- TextArea의 :error="true" → aria-invalid 전달 --&gt;
  &lt;TextArea
    id="demo-error"
    v-model="value"
    :error="true"
    placeholder="내용을 입력해주세요"
    aria-describedby="helper-demo-error"
  /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ② 상태별 -->
    <section class="textAreaGuidePage__section">
      <h2 class="textAreaGuidePage__sectionTitle">② 상태별</h2>

      <div class="textAreaGuidePage__group">
        <p class="textAreaGuidePage__groupTitle">default</p>
        <div class="textAreaGuidePage__row">
          <div class="textAreaGuidePage__item">
            <TextArea
              v-model="stateDemos.default"
              placeholder="내용을 입력해주세요"
              aria-label="기본 입력"
            />
          </div>
        </div>
      </div>

      <div class="textAreaGuidePage__group">
        <p class="textAreaGuidePage__groupTitle">filled</p>
        <div class="textAreaGuidePage__row">
          <div class="textAreaGuidePage__item">
            <TextArea
              v-model="stateDemos.filled"
              aria-label="입력된 텍스트에어리어"
            />
          </div>
        </div>
      </div>

      <div class="textAreaGuidePage__group">
        <p class="textAreaGuidePage__groupTitle">focus</p>
        <p class="textAreaGuidePage__note">클릭하면 focus 상태로 전환됩니다.</p>
        <div class="textAreaGuidePage__row">
          <div class="textAreaGuidePage__item">
            <TextArea
              v-model="stateDemos.focus"
              placeholder="클릭해서 포커스 확인"
              aria-label="포커스 테스트"
            />
          </div>
        </div>
      </div>

      <div class="textAreaGuidePage__group">
        <p class="textAreaGuidePage__groupTitle">disabled</p>
        <div class="textAreaGuidePage__row">
          <div class="textAreaGuidePage__item">
            <TextArea
              v-model="stateDemos.disabled"
              :disabled="true"
              aria-label="비활성 텍스트에어리어"
            />
          </div>
        </div>
      </div>

      <div class="textAreaGuidePage__group">
        <p class="textAreaGuidePage__groupTitle">readonly</p>
        <div class="textAreaGuidePage__row">
          <div class="textAreaGuidePage__item">
            <TextArea
              v-model="stateDemos.readonly"
              :readonly="true"
              aria-label="읽기 전용 텍스트에어리어"
            />
          </div>
        </div>
      </div>

      <div class="textAreaGuidePage__group">
        <p class="textAreaGuidePage__groupTitle">error</p>
        <div class="textAreaGuidePage__row">
          <div class="textAreaGuidePage__item">
            <FormField
              label-text="문의 내용"
              input-id="state-error"
              error-text="내용을 입력해주세요."
            >
              <TextArea
                id="state-error"
                v-model="stateDemos.error"
                :error="true"
                placeholder="내용을 입력해주세요"
                aria-describedby="helper-state-error"
              />
            </FormField>
          </div>
        </div>
      </div>

      <div class="textAreaGuidePage__group">
        <p class="textAreaGuidePage__groupTitle">resize (vertical)</p>
        <p class="textAreaGuidePage__note">하단 핸들로 세로 크기 조절 가능</p>
        <div class="textAreaGuidePage__row">
          <div class="textAreaGuidePage__item">
            <TextArea
              v-model="stateDemos.resize"
              :resize="'vertical'"
              placeholder="세로 방향으로 크기를 조절할 수 있습니다"
              aria-label="세로 리사이즈 텍스트에어리어"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ③ Props 참조 -->
    <section class="textAreaGuidePage__section">
      <h2 class="textAreaGuidePage__sectionTitle">③ Props</h2>

      <h3 class="textAreaGuidePage__tableTitle">TextArea Props</h3>
      <table class="textAreaGuidePage__propsTable">
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
            <td><code>maxLength</code></td>
            <td><code>number</code></td>
            <td>—</td>
            <td>최대 글자 수. 설정 시 카운터 자동 노출. 미설정 시 카운터 숨김</td>
          </tr>
          <tr>
            <td><code>placeholder</code></td>
            <td><code>string</code></td>
            <td><code>''</code></td>
            <td>placeholder 텍스트</td>
          </tr>
          <tr>
            <td><code>rows</code></td>
            <td><code>number</code></td>
            <td>—</td>
            <td>초기 높이(행 수). 미설정 시 CSS <code>min-height</code>(120px)로 제어</td>
          </tr>
          <tr>
            <td><code>resize</code></td>
            <td><code>'none' | 'vertical' | 'horizontal' | 'both'</code></td>
            <td><code>'none'</code></td>
            <td>크기 조절 방향. 기본값은 리사이즈 불가</td>
          </tr>
          <tr>
            <td><code>error</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>
              <code>aria-invalid="true"</code> 전달. 시각적 에러 표시는 FormField 담당
            </td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>비활성. 입력/포커스/클릭 모두 차단</td>
          </tr>
          <tr>
            <td><code>readonly</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>읽기 전용. 입력만 차단, 포커스·선택·복사 가능</td>
          </tr>
        </tbody>
      </table>

      <h3 class="textAreaGuidePage__tableTitle">TextArea Events</h3>
      <table class="textAreaGuidePage__propsTable">
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

      <p class="textAreaGuidePage__delegationNote">
        <strong>카운터 접근성</strong>: 카운터 요소에 <code>aria-live="polite"</code>가 적용되어
        스크린 리더가 글자 수 변경을 실시간으로 읽습니다.<br />
        <code>aria-describedby</code>로 <code>&lt;textarea&gt;</code>와 카운터가 연결됩니다.<br />
        <code>maxLength</code> 미설정 시 카운터 요소 자체가 렌더링되지 않습니다.
      </p>

      <p class="textAreaGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: <code>TextArea</code>는
        <code>v-bind="$attrs"</code>를 사용하므로
        <code>&lt;textarea&gt;</code> 요소의 모든 네이티브 HTML 속성
        (<code>autocomplete</code>, <code>aria-label</code>,
        <code>aria-describedby</code> 등)을 그대로 전달할 수 있습니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'guide' })

const demo1 = ref('')
const demo2 = ref('')
const demo3 = ref('')
const demo4 = ref('')
const demo5 = ref('')

const stateDemos = reactive({
  default: '',
  filled: '긴 내용이 입력된 상태입니다. 여러 줄에 걸쳐 텍스트가 표시될 수 있습니다.',
  focus: '',
  disabled: '비활성 상태의 텍스트',
  readonly: '읽기 전용 텍스트입니다. 클릭해도 수정할 수 없습니다.',
  error: '',
  resize: '',
})
</script>

<style lang="scss" scoped src="./textarea.scss"></style>
