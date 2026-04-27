<template>
  <div class="CheckboxGuidePage">
    <!-- 헤더 -->
    <header class="CheckboxGuidePage__header">
      <div class="CheckboxGuidePage__meta">
        <span class="CheckboxGuidePage__badge">atoms</span>
      </div>
      <h1 class="CheckboxGuidePage__title">Checkbox</h1>
      <p class="CheckboxGuidePage__desc">
        단일 참/거짓(boolean) 선택을 위한 체크박스 컴포넌트입니다.<br />
        <code>box</code> 타입은 테두리가 있는 박스 형태,
        <code>check</code> 타입은 체크 아이콘만 표시하는 라인 없는
        형태입니다.<br />
        레이블 텍스트는 기본 슬롯으로 전달하며, 슬롯 미사용 시 체크박스 단독으로
        표시됩니다.<br />
        내부적으로 <strong>Radix Vue</strong>를 사용해 키보드 탐색, 포커스, ARIA
        처리를 자동으로 지원합니다.
      </p>
    </header>

    <!-- ① 개요 -->
    <section class="CheckboxGuidePage__section">
      <h2 class="CheckboxGuidePage__sectionTitle">① 개요</h2>
      <p class="CheckboxGuidePage__note">
        <code>v-model</code>로 체크 상태(boolean)를 바인딩합니다.<br />
        <code>type</code> prop으로 시각적 스타일을 선택합니다:
        <code>box</code>(기본) / <code>check</code>.<br />
        레이블은 슬롯으로 전달합니다. 레이블 없이 사용 시
        <code>aria-label</code>을 직접 전달하세요.
      </p>
      <div class="CheckboxGuidePage__group">
        <div class="CheckboxGuidePage__row">
          <div class="CheckboxGuidePage__item">
            <br />

            <Checkbox v-model="boxChecked">box 타입 체크박스</Checkbox>

            <br />

            <pre
              class="CheckboxGuidePage__code"
            ><code>&lt;Checkbox v-model="checked"&gt;box 타입 체크박스&lt;/Checkbox&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ② type Variant -->
    <section class="CheckboxGuidePage__section">
      <h2 class="CheckboxGuidePage__sectionTitle">② type Variant</h2>
      <p class="CheckboxGuidePage__note">
        <code>type="box"</code>는 테두리 박스 안에 체크 아이콘이 나타나는
        형태입니다.<br />
        <code>type="check"</code>는 박스 없이 체크 아이콘 색상만 바뀌는 형태로,
        항상 아이콘이 표시됩니다.
      </p>

      <div class="CheckboxGuidePage__group">
        <p class="CheckboxGuidePage__groupTitle">레이블 없는 버전</p>
        <div class="CheckboxGuidePage__variantRow">
          <div class="CheckboxGuidePage__item">
            <Checkbox v-model="boxChecked" aria-label="box 타입 미체크" />
            <span class="CheckboxGuidePage__stateLabel">box (미체크)</span>
          </div>
          <div class="CheckboxGuidePage__item">
            <Checkbox
              :model-value="true"
              type="box"
              aria-label="box 타입 체크됨"
            />
            <span class="CheckboxGuidePage__stateLabel">box (체크됨)</span>
          </div>
          <div class="CheckboxGuidePage__item">
            <Checkbox
              :model-value="false"
              type="check"
              aria-label="check 타입 미체크"
            />
            <span class="CheckboxGuidePage__stateLabel">check (미체크)</span>
          </div>
          <div class="CheckboxGuidePage__item">
            <Checkbox
              :model-value="true"
              type="check"
              aria-label="check 타입 체크됨"
            />
            <span class="CheckboxGuidePage__stateLabel">check (체크됨)</span>
          </div>
        </div>
        <br />
        <pre
          class="CheckboxGuidePage__code"
        ><code>&lt;!-- box 타입 (기본) --&gt;
&lt;Checkbox v-model="checked" aria-label="동의" /&gt;

&lt;!-- check 타입 --&gt;
&lt;Checkbox v-model="checked" type="check" aria-label="동의" /&gt;</code></pre>
      </div>

      <div class="CheckboxGuidePage__group">
        <p class="CheckboxGuidePage__groupTitle">레이블 있는 버전</p>
        <div class="CheckboxGuidePage__variantRow">
          <div class="CheckboxGuidePage__item">
            <Checkbox :model-value="false" type="box">box 미체크</Checkbox>
          </div>
          <div class="CheckboxGuidePage__item">
            <Checkbox :model-value="true" type="box">box 체크됨</Checkbox>
          </div>
          <div class="CheckboxGuidePage__item">
            <Checkbox :model-value="false" type="check">check 미체크</Checkbox>
          </div>
          <div class="CheckboxGuidePage__item">
            <Checkbox :model-value="true" type="check">check 체크됨</Checkbox>
          </div>
        </div>
        <br />
        <pre
          class="CheckboxGuidePage__code"
        ><code>&lt;!-- box 타입 (기본) --&gt;
&lt;Checkbox v-model="checked"&gt;레이블 텍스트&lt;/Checkbox&gt;

&lt;!-- check 타입 --&gt;
&lt;Checkbox v-model="checked" type="check"&gt;레이블 텍스트&lt;/Checkbox&gt;</code></pre>
      </div>
    </section>

    <!-- ③ 상태(State) -->
    <section class="CheckboxGuidePage__section">
      <h2 class="CheckboxGuidePage__sectionTitle">③ 상태(State)</h2>
      <p class="CheckboxGuidePage__note">
        미체크 / 체크됨 / disabled(비활성) 세 가지 상태를 지원합니다.<br />
        <code>disabled</code> 상태에서는 클릭이 차단되고, 시각적으로 흐리게
        표시됩니다.
      </p>

      <div class="CheckboxGuidePage__group">
        <p class="CheckboxGuidePage__groupTitle">box 타입</p>
        <div class="CheckboxGuidePage__stateRow">
          <div class="CheckboxGuidePage__item">
            <Checkbox :model-value="false" type="box">미체크</Checkbox>
            <span class="CheckboxGuidePage__stateLabel">unchecked</span>
          </div>
          <div class="CheckboxGuidePage__item">
            <Checkbox :model-value="true" type="box">체크됨</Checkbox>
            <span class="CheckboxGuidePage__stateLabel">checked</span>
          </div>
          <div class="CheckboxGuidePage__item">
            <Checkbox :model-value="false" type="box" :disabled="true"
              >미체크 비활성</Checkbox
            >
            <span class="CheckboxGuidePage__stateLabel"
              >disabled unchecked</span
            >
          </div>
          <div class="CheckboxGuidePage__item">
            <Checkbox :model-value="true" type="box" :disabled="true"
              >체크됨 비활성</Checkbox
            >
            <span class="CheckboxGuidePage__stateLabel">disabled checked</span>
          </div>
        </div>
      </div>

      <div class="CheckboxGuidePage__group">
        <p class="CheckboxGuidePage__groupTitle">check 타입</p>
        <div class="CheckboxGuidePage__stateRow">
          <div class="CheckboxGuidePage__item">
            <Checkbox :model-value="false" type="check">미체크</Checkbox>
            <span class="CheckboxGuidePage__stateLabel">unchecked</span>
          </div>
          <div class="CheckboxGuidePage__item">
            <Checkbox :model-value="true" type="check">체크됨</Checkbox>
            <span class="CheckboxGuidePage__stateLabel">checked</span>
          </div>
          <div class="CheckboxGuidePage__item">
            <Checkbox :model-value="false" type="check" :disabled="true"
              >미체크 비활성</Checkbox
            >
            <span class="CheckboxGuidePage__stateLabel"
              >disabled unchecked</span
            >
          </div>
          <div class="CheckboxGuidePage__item">
            <Checkbox :model-value="true" type="check" :disabled="true"
              >체크됨 비활성</Checkbox
            >
            <span class="CheckboxGuidePage__stateLabel">disabled checked</span>
          </div>
        </div>
      </div>

      <pre class="CheckboxGuidePage__code"><code>&lt;!-- disabled --&gt;
&lt;Checkbox v-model="checked" :disabled="true"&gt;비활성 체크박스&lt;/Checkbox&gt;</code></pre>
    </section>

    <!-- ④ 레이블 조합 -->
    <section class="CheckboxGuidePage__section">
      <h2 class="CheckboxGuidePage__sectionTitle">④ 레이블 조합</h2>
      <p class="CheckboxGuidePage__note">
        기본 슬롯에 텍스트를 넣으면 체크박스 오른쪽에 레이블이 표시됩니다.<br />
        슬롯을 사용하지 않으면 체크박스 단독으로 표시됩니다. 이 경우
        <code>aria-label</code>을 반드시 전달하세요.
      </p>

      <div class="CheckboxGuidePage__group">
        <p class="CheckboxGuidePage__groupTitle">레이블 텍스트 슬롯 사용</p>
        <div class="CheckboxGuidePage__row">
          <div class="CheckboxGuidePage__item">
            <Checkbox v-model="agreeChecked">이용약관에 동의합니다.</Checkbox>
          </div>
          <div class="CheckboxGuidePage__item">
            <Checkbox v-model="smsChecked" type="check"
              >SMS 광고 수신에 동의합니다.</Checkbox
            >
          </div>
        </div>
        <br />
        <pre
          class="CheckboxGuidePage__code"
        ><code>&lt;!-- 기본 슬롯으로 레이블 전달 --&gt;
&lt;Checkbox v-model="checked"&gt;이용약관에 동의합니다.&lt;/Checkbox&gt;

&lt;!-- check 타입 + 슬롯 --&gt;
&lt;Checkbox v-model="checked" type="check"&gt;SMS 광고 수신에 동의합니다.&lt;/Checkbox&gt;</code></pre>
      </div>

      <div class="CheckboxGuidePage__group">
        <p class="CheckboxGuidePage__groupTitle">
          레이블 없는 단독 사용 — aria-label 필수
        </p>
        <div class="CheckboxGuidePage__row">
          <div class="CheckboxGuidePage__item">
            <Checkbox v-model="boxChecked" aria-label="전체 선택" />
          </div>
        </div>
        <br />
        <pre
          class="CheckboxGuidePage__code"
        ><code>&lt;!-- 슬롯 없이 단독 사용 시 aria-label 필수 --&gt;
&lt;Checkbox v-model="checked" aria-label="전체 선택" /&gt;</code></pre>
      </div>
    </section>

    <!-- ⑤ 실사용 예시 (v-model 연동) -->
    <section class="CheckboxGuidePage__section">
      <h2 class="CheckboxGuidePage__sectionTitle">⑤ 실사용 예시</h2>
      <p class="CheckboxGuidePage__note">
        폼에서 <code>v-model</code>로 체크 여부를 토글하는 예시입니다.<br />
        체크박스를 클릭하면 상태가 즉시 반영됩니다.
      </p>

      <div class="CheckboxGuidePage__group">
        <p class="CheckboxGuidePage__groupTitle">동의 항목 폼 예시</p>
        <div class="CheckboxGuidePage__row">
          <div class="CheckboxGuidePage__item">
            <Checkbox v-model="agreeChecked"
              >이용약관 동의 (필수) —
              {{ agreeChecked ? "동의함" : "미동의" }}</Checkbox
            >
            <Checkbox v-model="smsChecked" type="check"
              >SMS 광고 수신 동의 (선택) —
              {{ smsChecked ? "동의함" : "미동의" }}</Checkbox
            >
          </div>
        </div>
        <br />
        <pre
          class="CheckboxGuidePage__code"
        ><code>&lt;script setup lang="ts"&gt;
const agreeChecked = ref(false)
const smsChecked = ref(true)
&lt;/script&gt;

&lt;template&gt;
  &lt;Checkbox v-model="agreeChecked"&gt;이용약관 동의 (필수)&lt;/Checkbox&gt;
  &lt;Checkbox v-model="smsChecked" type="check"&gt;SMS 광고 수신 동의 (선택)&lt;/Checkbox&gt;
&lt;/template&gt;</code></pre>
      </div>
    </section>

    <!-- ⑥ Props -->
    <section class="CheckboxGuidePage__section">
      <h2 class="CheckboxGuidePage__sectionTitle">⑥ Props</h2>

      <h3 class="CheckboxGuidePage__tableTitle">Props</h3>
      <table class="CheckboxGuidePage__propsTable">
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
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>체크 여부 (v-model 연동)</td>
          </tr>
          <tr>
            <td><code>type</code></td>
            <td><code>'box' | 'check'</code></td>
            <td><code>'box'</code></td>
            <td>
              시각적 타입.<br />
              <code>box</code> — 테두리 박스 + 체크 아이콘.<br />
              <code>check</code> — 박스 없이 아이콘 색상으로만 상태 표현
            </td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>비활성 상태. 클릭 차단, 시각적으로 흐리게 표시</td>
          </tr>
          <tr>
            <td><code>id</code></td>
            <td><code>string</code></td>
            <td>자동생성</td>
            <td>label 연결용 고유 식별자. 미전달 시 내부에서 자동 생성</td>
          </tr>
          <tr>
            <td><code>name</code></td>
            <td><code>string</code></td>
            <td>—</td>
            <td>HTML form 전송 시 필드명</td>
          </tr>
          <tr>
            <td><code>required</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>HTML form 필수 여부</td>
          </tr>
          <tr>
            <td><code>value</code></td>
            <td><code>string</code></td>
            <td><code>'on'</code></td>
            <td>HTML form 전송 시 체크됐을 때 전송되는 값</td>
          </tr>
        </tbody>
      </table>

      <h3 class="CheckboxGuidePage__tableTitle">Slots</h3>
      <table class="CheckboxGuidePage__propsTable">
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
            <td>아니오</td>
            <td>
              레이블 텍스트. 미사용 시 체크박스만 표시. 미사용 시
              <code>aria-label</code> 필수
            </td>
          </tr>
        </tbody>
      </table>

      <h3 class="CheckboxGuidePage__tableTitle">Events</h3>
      <table class="CheckboxGuidePage__propsTable">
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
            <td><code>boolean</code></td>
            <td>
              체크/언체크 토글 시 발생. v-model이 이 이벤트를 수신해 상태
              업데이트
            </td>
          </tr>
        </tbody>
      </table>

      <p class="CheckboxGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는
        <code>v-bind="$attrs"</code>를 사용하므로 위 Props 외에도
        <code>&lt;CheckboxRoot&gt;</code> (Radix Vue 버튼 요소)의 모든 네이티브
        HTML 속성 (<code>aria-label</code>, <code>aria-describedby</code>,
        <code>tabindex</code>, <code>data-*</code> 등)을 그대로 전달할 수
        있습니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>

      <p class="CheckboxGuidePage__radixNote">
        이 컴포넌트는 <strong>Radix Vue</strong>를 기반으로 합니다. 위 Props
        외에도 Radix Vue가 지원하는 추가 props를 사용할 수 있습니다. 전체 API는
        <a
          href="https://www.radix-vue.com/components/checkbox.html"
          target="_blank"
          rel="noopener noreferrer"
          >radix-vue.com 공식 문서</a
        >
        또는 Context7 MCP(<code>mcp__context7__query-docs</code>)를 통해
        확인하세요.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "guide" });

const boxChecked = ref(false);
const checkChecked = ref(true);
const agreeChecked = ref(false);
const smsChecked = ref(true);
</script>

<style lang="scss" scoped src="./checkboxGuidePage.scss"></style>
