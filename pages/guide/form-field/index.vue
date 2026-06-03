<template>
  <div class="formFieldGuidePage">
    <!-- 헤더 -->
    <header class="formFieldGuidePage__header">
      <div class="formFieldGuidePage__meta">
        <span class="formFieldGuidePage__badge">molecules</span>
      </div>
      <h1 class="formFieldGuidePage__title">FormField</h1>
      <p class="formFieldGuidePage__desc">
        form 요소에 공통으로 필요한 <strong>라벨 · 툴팁 · 도움말 텍스트</strong> 레이아웃을 제공하는 래퍼 컴포넌트.<br />
        <code>Input</code>, <code>Select</code>, <code>Checkbox</code> 등 다양한 폼 컨트롤을
        <code>default slot</code>으로 주입해 사용합니다.<br />
        <code>errorText</code> · <code>successText</code> · <code>helperText</code> 세 메시지는 동시에 표시되며,
        순서는 <code>errorText</code>(맨 위) → <code>successText</code> → <code>helperText</code>(맨 아래)입니다.
      </p>
    </header>

    <!-- ① 기본 폼 구성 -->
    <section class="formFieldGuidePage__section">
      <h2 class="formFieldGuidePage__sectionTitle">① 기본 폼 구성</h2>
      <p class="formFieldGuidePage__note">
        <code>labelText</code> / <code>required</code> / <code>helperText</code> 조합 예시. <code>required</code>는 라벨
        옆 <code>*</code>만 시각 표시하며, <code>aria-required</code>는 슬롯 내 컴포넌트에 직접 전달합니다.
      </p>

      <div class="formFieldGuidePage__group">
        <p class="formFieldGuidePage__groupTitle">라벨 + 입력</p>
        <div class="formFieldGuidePage__row">
          <div class="formFieldGuidePage__item">
            <FormField label-text="이름" input-id="basic-name">
              <Input id="basic-name" v-model="basicName" placeholder="이름을 입력하세요" />
            </FormField>
            <pre class="formFieldGuidePage__code"><code>&lt;FormField label-text="이름" input-id="basic-name"&gt;
  &lt;Input id="basic-name" v-model="value" placeholder="이름을 입력하세요" /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="formFieldGuidePage__group">
        <p class="formFieldGuidePage__groupTitle">라벨 + 도움말 텍스트</p>
        <div class="formFieldGuidePage__row">
          <div class="formFieldGuidePage__item">
            <FormField label-text="비밀번호" input-id="basic-pw" helper-text="영문, 숫자, 특수문자 포함 8자 이상">
              <Input
                id="basic-pw"
                v-model="basicPw"
                type="password"
                placeholder="비밀번호를 입력하세요"
                aria-describedby="helper-basic-pw"
              />
            </FormField>
            <pre class="formFieldGuidePage__code"><code>&lt;FormField
  label-text="비밀번호"
  input-id="basic-pw"
  helper-text="영문, 숫자, 특수문자 포함 8자 이상"
&gt;
  &lt;Input
    id="basic-pw"
    v-model="value"
    type="password"
    aria-describedby="helper-basic-pw"
  /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="formFieldGuidePage__group">
        <p class="formFieldGuidePage__groupTitle">필수 항목 (required)</p>
        <div class="formFieldGuidePage__row">
          <div class="formFieldGuidePage__item">
            <FormField label-text="이메일" input-id="basic-email" :required="true">
              <Input id="basic-email" v-model="basicEmail" type="email" placeholder="example@email.com" required />
            </FormField>
            <pre
              class="formFieldGuidePage__code"
            ><code>&lt;FormField label-text="이메일" input-id="basic-email" :required="true"&gt;
  &lt;!-- aria-required는 Input에 직접 전달 --&gt;
  &lt;Input id="basic-email" v-model="value" type="email" required /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="formFieldGuidePage__group">
        <p class="formFieldGuidePage__groupTitle">도움말 아이콘 포함 (showHelperIcon: true)</p>
        <p class="formFieldGuidePage__note">
          <code>:show-helper-icon="true"</code>를 전달하면 <code>helperText</code> 앞에
          <code>CircularNote</code> 아이콘이 회색(<code>$text-helper</code>)으로 표시됩니다.<br />
          <code>errorText</code> · <code>successText</code> 표시 여부와 무관하게 동작합니다 — 세 메시지 동시 표시 시에도 <code>helperText</code>가 있으면 아이콘이 함께 렌더링됩니다.
        </p>
        <div class="formFieldGuidePage__row">
          <div class="formFieldGuidePage__item">
            <FormField
              label-text="쿠폰코드"
              input-id="basic-coupon-code"
              helper-text="쿠폰은 1회만 사용 가능합니다."
              :show-helper-icon="true"
            >
              <Input
                id="basic-coupon-code"
                v-model="helperIconValue"
                placeholder="쿠폰 코드를 입력하세요"
                aria-describedby="helper-basic-coupon-code"
              />
            </FormField>
            <pre class="formFieldGuidePage__code"><code>&lt;FormField
  label-text="쿠폰코드"
  input-id="basic-coupon-code"
  helper-text="쿠폰은 1회만 사용 가능합니다."
  :show-helper-icon="true"
&gt;
  &lt;!-- CircularNote 아이콘 + 회색 텍스트로 표시됨 --&gt;
  &lt;Input
    id="basic-coupon-code"
    v-model="value"
    aria-describedby="helper-basic-coupon-code"
  /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ② 에러 상태 -->
    <section class="formFieldGuidePage__section">
      <h2 class="formFieldGuidePage__sectionTitle">② 에러 상태</h2>
      <p class="formFieldGuidePage__note">
        <code>error-text</code>에 문자열을 전달하면 빨간색으로 표시됩니다. <code>role="alert"</code>가 자동 부여되어
        스크린 리더가 즉시 읽습니다.<br />
        Input에 <code>:error="true"</code>를 함께 전달해 테두리 색상도 변경합니다.
      </p>

      <div class="formFieldGuidePage__group">
        <p class="formFieldGuidePage__groupTitle">errorText 표시</p>
        <div class="formFieldGuidePage__row">
          <div class="formFieldGuidePage__item">
            <FormField label-text="이메일" input-id="error-email" error-text="올바른 이메일 형식이 아닙니다.">
              <Input
                id="error-email"
                v-model="errorEmail"
                :error="true"
                placeholder="example@email.com"
                aria-describedby="helper-error-email"
              />
            </FormField>
            <pre class="formFieldGuidePage__code"><code>&lt;FormField
  label-text="이메일"
  input-id="error-email"
  error-text="올바른 이메일 형식이 아닙니다."
&gt;
  &lt;Input
    id="error-email"
    v-model="value"
    :error="true"
    aria-describedby="helper-error-email"
  /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="formFieldGuidePage__group">
        <p class="formFieldGuidePage__groupTitle">errorText + helperText 동시 표시</p>
        <p class="formFieldGuidePage__note">
          <code>errorText</code>와 <code>helperText</code>를 동시에 전달하면 두 메시지가 함께 표시됩니다.<br />
          <code>errorText</code>가 위(빨간색), <code>helperText</code>가 아래(회색)에 위치합니다.
        </p>
        <div class="formFieldGuidePage__row">
          <div class="formFieldGuidePage__item">
            <FormField
              label-text="휴대폰 번호"
              input-id="error-phone"
              helper-text="010-0000-0000 형식으로 입력해주세요"
              error-text="이미 등록된 번호입니다."
            >
              <Input
                id="error-phone"
                v-model="errorPhone"
                :error="true"
                placeholder="010-0000-0000"
                aria-describedby="helper-error-phone"
              />
            </FormField>
            <pre class="formFieldGuidePage__code"><code>&lt;FormField
  label-text="휴대폰 번호"
  input-id="error-phone"
  helper-text="010-0000-0000 형식으로 입력해주세요"
  error-text="이미 등록된 번호입니다."
&gt;
  &lt;!-- errorText(빨간색, 위) + helperText(회색, 아래) 동시 표시 --&gt;
  &lt;Input id="error-phone" v-model="value" :error="true"
    aria-describedby="helper-error-phone" /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ③ 성공/확인 상태 + 동시 표시 -->
    <section class="formFieldGuidePage__section">
      <h2 class="formFieldGuidePage__sectionTitle">③ 성공/확인 상태 & 동시 표시</h2>
      <p class="formFieldGuidePage__note">
        <code>success-text</code>에 문자열을 전달하면 체크마크 아이콘 + 파란색(<code>$color-primary-hover</code>)으로
        표시됩니다.<br />
        <code>role="status"</code>가 자동 부여되어 스크린 리더가 비침습적으로 읽습니다.<br />
        <code>errorText</code> · <code>successText</code> · <code>helperText</code>는 값이 있으면 <strong>동시에 모두 표시</strong>되며,
        순서는 <code>errorText</code>(맨 위) → <code>successText</code> → <code>helperText</code>(맨 아래)입니다.
      </p>

      <div class="formFieldGuidePage__group">
        <p class="formFieldGuidePage__groupTitle">successText 표시 — Select 조합</p>
        <div class="formFieldGuidePage__row">
          <div class="formFieldGuidePage__item">
            <FormField
              label-text="쿠폰 코드"
              input-id="success-coupon"
              success-text="쿠폰이 성공적으로 적용되었습니다."
            >
              <Select
                id="success-coupon"
                v-model="successCoupon"
                :options="couponOptions"
                aria-describedby="helper-success-coupon"
              />
            </FormField>
            <pre class="formFieldGuidePage__code"><code>&lt;FormField
  label-text="쿠폰 코드"
  input-id="success-coupon"
  success-text="쿠폰이 성공적으로 적용되었습니다."
&gt;
  &lt;Select
    id="success-coupon"
    v-model="value"
    :options="couponOptions"
    aria-describedby="helper-success-coupon"
  /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="formFieldGuidePage__group">
        <p class="formFieldGuidePage__groupTitle">동시 표시 — errorText + helperText</p>
        <p class="formFieldGuidePage__note">
          에러가 발생하더라도 입력 형식 안내(<code>helperText</code>)가 함께 필요한 경우에 사용합니다.
        </p>
        <div class="formFieldGuidePage__row">
          <div class="formFieldGuidePage__item">
            <FormField
              label-text="인증 코드"
              input-id="simultaneous-error-helper"
              error-text="인증 코드가 일치하지 않습니다."
              helper-text="이메일로 발송된 6자리 코드를 입력해주세요."
            >
              <Input
                id="simultaneous-error-helper"
                v-model="simultaneousErrorHelper"
                :error="true"
                placeholder="000000"
                aria-describedby="helper-simultaneous-error-helper"
              />
            </FormField>
            <pre class="formFieldGuidePage__code"><code>&lt;FormField
  label-text="인증 코드"
  input-id="simultaneous-error-helper"
  error-text="인증 코드가 일치하지 않습니다."
  helper-text="이메일로 발송된 6자리 코드를 입력해주세요."
&gt;
  &lt;!-- errorText(빨간색)와 helperText(회색)가 동시에 표시됨 --&gt;
  &lt;Input id="simultaneous-error-helper" v-model="value" :error="true"
    aria-describedby="helper-simultaneous-error-helper" /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="formFieldGuidePage__group">
        <p class="formFieldGuidePage__groupTitle">동시 표시 — successText + helperText</p>
        <p class="formFieldGuidePage__note">
          선택/입력이 완료된 상태에서도 추가 안내가 필요한 경우에 사용합니다.
        </p>
        <div class="formFieldGuidePage__row">
          <div class="formFieldGuidePage__item">
            <FormField
              label-text="지역"
              input-id="simultaneous-success-helper"
              success-text="선택 완료!"
              helper-text="거주 지역을 선택해주세요"
            >
              <Select
                id="simultaneous-success-helper"
                v-model="simultaneousSuccessHelper"
                :options="regionOptions"
                aria-describedby="helper-simultaneous-success-helper"
              />
            </FormField>
            <pre class="formFieldGuidePage__code"><code>&lt;FormField
  label-text="지역"
  input-id="simultaneous-success-helper"
  success-text="선택 완료!"
  helper-text="거주 지역을 선택해주세요"
&gt;
  &lt;!-- successText(파란색, 체크마크)와 helperText(회색)가 동시에 표시됨 --&gt;
  &lt;Select id="simultaneous-success-helper" v-model="value"
    :options="regionOptions" aria-describedby="helper-simultaneous-success-helper" /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="formFieldGuidePage__group">
        <p class="formFieldGuidePage__groupTitle">동시 표시 비교 — 각 메시지 조합</p>
        <div class="formFieldGuidePage__row">
          <div class="formFieldGuidePage__item formFieldGuidePage__item--priority">
            <div class="formFieldGuidePage__priorityCase">
              <span class="formFieldGuidePage__priorityLabel">helperText만</span>
              <FormField label-text="지역" input-id="priority-helper" helper-text="거주 지역을 선택해주세요">
                <Select id="priority-helper" v-model="priorityHelper" :options="regionOptions" />
              </FormField>
            </div>
            <div class="formFieldGuidePage__priorityCase">
              <span class="formFieldGuidePage__priorityLabel">success + helper 동시</span>
              <FormField
                label-text="지역"
                input-id="priority-success"
                helper-text="거주 지역을 선택해주세요"
                success-text="선택 완료!"
              >
                <Select id="priority-success" v-model="prioritySuccess" :options="regionOptions" />
              </FormField>
            </div>
            <div class="formFieldGuidePage__priorityCase">
              <span class="formFieldGuidePage__priorityLabel">error + helper 동시</span>
              <FormField
                label-text="지역"
                input-id="priority-error"
                helper-text="거주 지역을 선택해주세요"
                error-text="필수 항목입니다."
              >
                <Select id="priority-error" v-model="priorityError" :options="regionOptions" :error="true" />
              </FormField>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ④ 라벨 없음 -->
    <section class="formFieldGuidePage__section">
      <h2 class="formFieldGuidePage__sectionTitle">④ 라벨 없음</h2>
      <p class="formFieldGuidePage__note">
        <code>:show-label="false"</code>를 전달하면 라벨 영역 전체(텍스트 + 툴팁 slot)가 렌더링되지 않습니다.<br />
        라벨이 외부에서 제공되거나 UI 상 불필요한 경우 사용합니다.
        <code>aria-label</code>은 슬롯 내 컴포넌트에 직접 전달합니다.
      </p>

      <div class="formFieldGuidePage__group">
        <p class="formFieldGuidePage__groupTitle">showLabel: false</p>
        <div class="formFieldGuidePage__row">
          <div class="formFieldGuidePage__item">
            <FormField input-id="no-label" :show-label="false" helper-text="검색어를 입력해주세요">
              <Input
                id="no-label"
                v-model="noLabelValue"
                placeholder="검색어를 입력하세요"
                aria-label="검색어 입력"
                aria-describedby="helper-no-label"
              />
            </FormField>
            <pre
              class="formFieldGuidePage__code"
            ><code>&lt;FormField input-id="no-label" :show-label="false" helper-text="검색어를 입력해주세요"&gt;
  &lt;!-- 라벨이 없으므로 aria-label을 Input에 직접 전달 --&gt;
  &lt;Input
    id="no-label"
    v-model="value"
    aria-label="검색어 입력"
    aria-describedby="helper-no-label"
  /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="formFieldGuidePage__group">
        <p class="formFieldGuidePage__groupTitle">inputId 없음 — 라벨이 &lt;span&gt;으로 출력</p>
        <p class="formFieldGuidePage__note">
          <code>inputId</code>를 전달하지 않으면 라벨이 <code>&lt;label for&gt;</code> 대신
          <code>&lt;span&gt;</code> 태그로 렌더링됩니다.<br />
          label for 연결이 불필요한 커스텀 컨트롤 또는 그룹 UI에 사용합니다.<br />
          이 경우 도움말 id(<code>helper-{inputId}</code>)도 생성되지 않으므로, 슬롯 내 컨트롤의
          <code>aria-describedby</code> 연결은 사용처에서 직접 처리해야 합니다.
        </p>
        <div class="formFieldGuidePage__row">
          <div class="formFieldGuidePage__item">
            <FormField label-text="선택 정보">
              <Input v-model="noInputIdValue" placeholder="inputId 없는 컨트롤 예시" aria-label="선택 정보 입력" />
            </FormField>
            <pre class="formFieldGuidePage__code"><code>&lt;!-- inputId 없음 → 라벨이 &lt;span&gt;으로 출력 --&gt;
&lt;FormField label-text="선택 정보"&gt;
  &lt;!-- label for 연결 없음 → 슬롯 컨트롤에 aria-label 직접 전달 권장 --&gt;
  &lt;Input v-model="value" aria-label="선택 정보 입력" /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑤ 툴팁 포함 -->
    <section class="formFieldGuidePage__section">
      <h2 class="formFieldGuidePage__sectionTitle">⑤ 툴팁 포함</h2>
      <p class="formFieldGuidePage__note">
        <code>#tooltip</code> slot에 내용이 있으면 라벨 우측에 자동으로 렌더링됩니다.<br />
        <code>Tooltip</code> 컴포넌트의 <code>#trigger</code> slot에 물음표 버튼을 삽입해 툴팁을 연결합니다. 삽입된
        버튼/컴포넌트가 <code>aria-label</code> 제공 책임을 집니다.
      </p>

      <div class="formFieldGuidePage__group">
        <p class="formFieldGuidePage__groupTitle">Tooltip 컴포넌트 연결</p>
        <div class="formFieldGuidePage__row">
          <div class="formFieldGuidePage__item">
            <FormField label-text="이메일" input-id="tooltip-email">
              <template #tooltip>
                <Tooltip
                  text="이메일 주소는 로그인 및 알림 수신에 사용됩니다."
                  side="bottom"
                  arrow-align="left"
                  :offset-x="-18"
                >
                  <template #trigger>
                    <button type="button" class="formFieldGuidePage__tooltipTrigger" aria-label="이메일 도움말">
                      ?
                    </button>
                  </template>
                </Tooltip>
              </template>
              <Input id="tooltip-email" v-model="tooltipEmail" placeholder="example@email.com" />
            </FormField>
            <pre class="formFieldGuidePage__code"><code>&lt;FormField label-text="이메일" input-id="tooltip-email"&gt;
  &lt;template #tooltip&gt;
    &lt;Tooltip text="이메일 주소는 로그인 및 알림 수신에 사용됩니다." side="bottom" arrow-align="left"&gt;
      &lt;template #trigger&gt;
        &lt;button type="button" aria-label="이메일 도움말"&gt;?&lt;/button&gt;
      &lt;/template&gt;
    &lt;/Tooltip&gt;
  &lt;/template&gt;
  &lt;Input id="tooltip-email" v-model="value" placeholder="example@email.com" /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="formFieldGuidePage__group">
        <p class="formFieldGuidePage__groupTitle">showLabel: false 시 #tooltip slot 미렌더링</p>
        <div class="formFieldGuidePage__row">
          <div class="formFieldGuidePage__item">
            <p class="formFieldGuidePage__note">
              <code>:show-label="false"</code>이면 라벨 영역 전체(라벨 텍스트 + <code>#tooltip</code> slot)가 DOM에서
              제거됩니다.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑥ 다중 폼 요소 케이스 -->
    <section class="formFieldGuidePage__section">
      <h2 class="formFieldGuidePage__sectionTitle">⑥ 다중 폼 요소 케이스</h2>
      <p class="formFieldGuidePage__note">
        <code>default slot</code>에 복수의 폼 컨트롤을 wrapper div로 감싸 삽입할 수 있습니다.<br />
        <code>label for</code>은 대표(첫 번째) 컨트롤 id 하나만 가리키며, 나머지 컨트롤에는 <code>aria-label</code>로
        개별 레이블을 직접 전달합니다.<br />
        wrapper div(<code>inputGroup</code>, <code>addrGroup</code> 등)의 레이아웃 스타일은
        <strong>FormField 내부가 아닌 사용처</strong>에서 정의합니다.
      </p>

      <!-- 연락처 케이스 -->
      <div class="formFieldGuidePage__group">
        <p class="formFieldGuidePage__groupTitle">연락처 — Input 3개 가로 배열</p>
        <div class="formFieldGuidePage__row">
          <div class="formFieldGuidePage__item">
            <FormField label-text="연락처" input-id="phone-1" helper-text="숫자만 입력해주세요">
              <div class="formFieldGuidePage__inputGroup">
                <Input
                  id="phone-1"
                  v-model="phone1"
                  aria-label="연락처 앞자리"
                  aria-describedby="helper-phone-1"
                  maxlength="3"
                  placeholder="010"
                />
                <Input id="phone-2" v-model="phone2" aria-label="연락처 중간자리" maxlength="4" placeholder="0000" />
                <Input id="phone-3" v-model="phone3" aria-label="연락처 뒷자리" maxlength="4" placeholder="0000" />
              </div>
            </FormField>
            <pre
              class="formFieldGuidePage__code"
            ><code>&lt;FormField label-text="연락처" input-id="phone-1" helper-text="숫자만 입력해주세요"&gt;
  &lt;!-- label for="phone-1" — 대표 첫 번째 Input만 가리킴 --&gt;
  &lt;!-- 나머지 Input에 aria-label로 개별 레이블 전달 --&gt;
  &lt;div class="inputGroup"&gt;
    &lt;Input id="phone-1" v-model="phone1"
      aria-label="연락처 앞자리" aria-describedby="helper-phone-1" maxlength="3" /&gt;
    &lt;Input id="phone-2" v-model="phone2"
      aria-label="연락처 중간자리" maxlength="4" /&gt;
    &lt;Input id="phone-3" v-model="phone3"
      aria-label="연락처 뒷자리" maxlength="4" /&gt;
  &lt;/div&gt;
&lt;/FormField&gt;

&lt;!-- 사용처 SCSS --&gt;
&lt;style&gt;
.inputGroup {
  display: flex;
  gap: 0.4rem;
}
&lt;/style&gt;</code></pre>
          </div>
        </div>
      </div>

      <!-- 주소 케이스 -->
      <div class="formFieldGuidePage__group">
        <p class="formFieldGuidePage__groupTitle">주소 — 우편번호 + 도로명 + 상세주소 세로 배열</p>
        <div class="formFieldGuidePage__row">
          <div class="formFieldGuidePage__item">
            <FormField label-text="주소" input-id="addr-zip">
              <div class="formFieldGuidePage__addrGroup">
                <div class="formFieldGuidePage__addrRow">
                  <Input id="addr-zip" v-model="zip" aria-label="우편번호" readonly placeholder="우편번호" />
                  <Button type="button" shape="line" color="primary" size="md" @click="handlePostcodeSearch">
                    우편번호 검색
                  </Button>
                </div>
                <Input id="addr-road" v-model="addrRoad" aria-label="도로명 주소" readonly placeholder="도로명 주소" />
                <Input
                  id="addr-detail"
                  v-model="addrDetail"
                  aria-label="상세주소"
                  placeholder="상세 주소를 입력해 주세요."
                />
              </div>
            </FormField>
            <pre class="formFieldGuidePage__code"><code>&lt;FormField label-text="주소" input-id="addr-zip"&gt;
  &lt;!-- label for="addr-zip" — 대표 첫 번째 Input(우편번호)만 가리킴 --&gt;
  &lt;div class="addrGroup"&gt;
    &lt;div class="addrGroup__row"&gt;
      &lt;!-- 우편번호 Input + 검색 버튼 가로 배열 --&gt;
      &lt;Input id="addr-zip" v-model="zip" aria-label="우편번호" readonly /&gt;
      &lt;!-- [연동] 클릭 시 Daum 우편번호 API 호출 --&gt;
      &lt;Button type="button" shape="line" color="primary" @click="openPostcode"&gt;
        우편번호 검색
      &lt;/Button&gt;
    &lt;/div&gt;
    &lt;Input id="addr-road" v-model="addrRoad" aria-label="도로명 주소" readonly /&gt;
    &lt;Input id="addr-detail" v-model="addrDetail"
      aria-label="상세주소" placeholder="상세 주소를 입력해 주세요." /&gt;
  &lt;/div&gt;
&lt;/FormField&gt;

&lt;!-- 사용처 SCSS --&gt;
&lt;style&gt;
.addrGroup {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.addrGroup__row {
  display: flex;
  gap: 0.8rem;
}
&lt;/style&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑦ 기타 폼 컴포넌트 조합 -->
    <section class="formFieldGuidePage__section">
      <h2 class="formFieldGuidePage__sectionTitle">⑦ 기타 폼 컴포넌트 조합</h2>
      <p class="formFieldGuidePage__note">
        <code>default slot</code>에는 <code>Input</code>, <code>Select</code>, <code>Checkbox</code> 외에도 아래
        컴포넌트들을 자유롭게 주입할 수 있습니다. 각 컴포넌트가 <code>FormField</code>와 어떻게 조합되는지
        확인하세요.
      </p>

      <!-- 그룹 1: InputAuth -->
      <div class="formFieldGuidePage__group">
        <p class="formFieldGuidePage__groupTitle">InputAuth — 인증번호 입력</p>
        <div class="formFieldGuidePage__row">
          <div class="formFieldGuidePage__item">
            <FormField label-text="인증번호" input-id="auth-code" helper-text="이메일로 발송된 인증번호를 입력해주세요">
              <InputAuth
                id="auth-code"
                v-model="authCode"
                :duration="180"
                :active="isAuthActive"
                aria-describedby="helper-auth-code"
                @timer-end="handleAuthExpired"
              />
            </FormField>
            <pre class="formFieldGuidePage__code"><code>&lt;FormField
  label-text="인증번호"
  input-id="auth-code"
  helper-text="이메일로 발송된 인증번호를 입력해주세요"
&gt;
  &lt;InputAuth
    id="auth-code"
    v-model="authCode"
    :duration="180"
    :active="isAuthActive"
    aria-describedby="helper-auth-code"
    @timer-end="handleAuthExpired"
  /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <!-- 그룹 2: TextArea -->
      <div class="formFieldGuidePage__group">
        <p class="formFieldGuidePage__groupTitle">TextArea — 여러 줄 텍스트 입력</p>
        <div class="formFieldGuidePage__row">
          <div class="formFieldGuidePage__item">
            <FormField label-text="리뷰" input-id="review-text" helper-text="최대 300자까지 입력 가능합니다">
              <TextArea
                id="review-text"
                v-model="reviewText"
                :max-length="300"
                placeholder="상품 후기를 작성해 주세요."
                :rows="4"
                aria-describedby="helper-review-text"
              />
            </FormField>
            <pre class="formFieldGuidePage__code"><code>&lt;FormField
  label-text="리뷰"
  input-id="review-text"
  helper-text="최대 300자까지 입력 가능합니다"
&gt;
  &lt;TextArea
    id="review-text"
    v-model="reviewText"
    :max-length="300"
    placeholder="상품 후기를 작성해 주세요."
    :rows="4"
    aria-describedby="helper-review-text"
  /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <!-- 그룹 3: RadioGroup -->
      <div class="formFieldGuidePage__group">
        <p class="formFieldGuidePage__groupTitle">RadioGroup — 단일 선택 그룹</p>
        <p class="formFieldGuidePage__note">
          <code>RadioGroup</code>은 <code>id</code>를 직접 받지 않으므로 <code>FormField</code>의
          <code>input-id</code>는 생략합니다. 라벨은 <code>&lt;span&gt;</code>으로 출력되어 그룹 제목 역할을 합니다.
        </p>
        <div class="formFieldGuidePage__row">
          <div class="formFieldGuidePage__item">
            <FormField label-text="배송 방법">
              <RadioGroup v-model="deliveryMethod" :items="deliveryItems" orientation="vertical" />
            </FormField>
            <pre class="formFieldGuidePage__code"><code>&lt;!-- RadioGroup은 id 연결이 없으므로 input-id 생략 --&gt;
&lt;!-- 라벨이 &lt;span&gt;으로 출력되어 그룹 제목 역할 --&gt;
&lt;FormField label-text="배송 방법"&gt;
  &lt;RadioGroup
    v-model="deliveryMethod"
    :items="deliveryItems"
    orientation="vertical"
  /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <!-- 그룹 4: Switch -->
      <div class="formFieldGuidePage__group">
        <p class="formFieldGuidePage__groupTitle">Switch — 토글 스위치</p>
        <p class="formFieldGuidePage__note">
          <code>Switch</code>는 자체 레이블이 없으므로 <code>FormField</code>와 조합해 레이블을 제공합니다.
          <code>Switch</code>의 <code>id</code> prop에 값을 넣어 <code>FormField</code>의 <code>input-id</code>와
          연결합니다.
        </p>
        <div class="formFieldGuidePage__row">
          <div class="formFieldGuidePage__item">
            <FormField label-text="마케팅 알림 수신" input-id="marketing-switch">
              <Switch id="marketing-switch" v-model="marketingEnabled" />
            </FormField>
            <pre class="formFieldGuidePage__code"><code>&lt;FormField label-text="마케팅 알림 수신" input-id="marketing-switch"&gt;
  &lt;!-- Switch의 id prop과 FormField의 input-id를 일치시켜 label for 연결 --&gt;
  &lt;Switch id="marketing-switch" v-model="marketingEnabled" /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>

      <!-- 그룹 5: Stepper -->
      <div class="formFieldGuidePage__group">
        <p class="formFieldGuidePage__groupTitle">Stepper — 수량 증감 입력</p>
        <p class="formFieldGuidePage__note">
          기본 <code>$attrs</code>는 내부 <code>&lt;input&gt;</code>에 전달됩니다. <code>id</code>를 전달하면
          <code>FormField</code>의 <code>label for</code>와 연결됩니다.
        </p>
        <div class="formFieldGuidePage__row">
          <div class="formFieldGuidePage__item">
            <FormField label-text="구매 수량" input-id="qty">
              <Stepper id="qty" v-model="qty" :min="1" :max="10" />
            </FormField>
            <pre class="formFieldGuidePage__code"><code>&lt;FormField label-text="구매 수량" input-id="qty"&gt;
  &lt;!-- $attrs → 내부 &lt;input&gt;에 위임. id="qty"로 label for 연결됨 --&gt;
  &lt;Stepper id="qty" v-model="qty" :min="1" :max="10" /&gt;
&lt;/FormField&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑧ 복합 폼 레이아웃 -->
    <section class="formFieldGuidePage__section">
      <h2 class="formFieldGuidePage__sectionTitle">⑧ 복합 폼 레이아웃</h2>
      <p class="formFieldGuidePage__note">
        실제 폼처럼 여러 <code>FormField</code>를 세로로 쌓은 예시입니다. 각 필드의 <code>aria-describedby</code>와
        <code>id</code> 연결에 주의하세요.
      </p>

      <div class="formFieldGuidePage__formDemo">
        <FormField label-text="이름" input-id="form-name" :required="true">
          <Input id="form-name" v-model="formData.name" placeholder="이름을 입력하세요" required />
        </FormField>

        <FormField
          label-text="이메일"
          input-id="form-email"
          :required="true"
          error-text="올바른 이메일 형식이 아닙니다."
        >
          <Input
            id="form-email"
            v-model="formData.email"
            type="email"
            :error="true"
            placeholder="example@email.com"
            required
            aria-describedby="helper-form-email"
          />
        </FormField>

        <FormField label-text="쿠폰 코드" input-id="form-coupon" success-text="할인 쿠폰이 적용되었습니다.">
          <Input
            id="form-coupon"
            v-model="formData.coupon"
            placeholder="쿠폰 코드를 입력하세요"
            aria-describedby="helper-form-coupon"
          />
        </FormField>

        <FormField label-text="약관 동의" input-id="form-agree">
          <Checkbox id="form-agree" v-model="formData.agree" value="agree">
            (필수) 이용약관 및 개인정보 처리방침에 동의합니다.
          </Checkbox>
        </FormField>

        <div class="formFieldGuidePage__formActions">
          <Button type="submit" shape="solid" color="primary" size="lg" @click="handleSubmit"> 제출하기 </Button>
        </div>
      </div>

      <pre class="formFieldGuidePage__code"><code>&lt;!-- 이름 --&gt;
&lt;FormField label-text="이름" input-id="form-name" :required="true"&gt;
  &lt;Input id="form-name" v-model="formData.name" placeholder="이름을 입력하세요" required /&gt;
&lt;/FormField&gt;

&lt;!-- 이메일 (에러 상태) --&gt;
&lt;FormField label-text="이메일" input-id="form-email" :required="true"
  error-text="올바른 이메일 형식이 아닙니다."&gt;
  &lt;Input id="form-email" v-model="formData.email" type="email"
    :error="true" required aria-describedby="helper-form-email" /&gt;
&lt;/FormField&gt;

&lt;!-- 쿠폰 코드 (성공 상태) --&gt;
&lt;FormField label-text="쿠폰 코드" input-id="form-coupon"
  success-text="할인 쿠폰이 적용되었습니다."&gt;
  &lt;Input id="form-coupon" v-model="formData.coupon"
    aria-describedby="helper-form-coupon" /&gt;
&lt;/FormField&gt;

&lt;!-- 약관 동의 (Checkbox) --&gt;
&lt;FormField label-text="약관 동의" input-id="form-agree"&gt;
  &lt;Checkbox id="form-agree" v-model="formData.agree" value="agree"&gt;
    (필수) 이용약관 및 개인정보 처리방침에 동의합니다.
  &lt;/Checkbox&gt;
&lt;/FormField&gt;

&lt;Button type="submit" shape="solid" color="primary" size="lg"&gt;제출하기&lt;/Button&gt;</code></pre>
    </section>

    <!-- ⑨ Props / Slots 표 -->
    <section class="formFieldGuidePage__section">
      <h2 class="formFieldGuidePage__sectionTitle">⑨ Props</h2>

      <h3 class="formFieldGuidePage__tableTitle">Props</h3>
      <table class="formFieldGuidePage__propsTable">
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
            <td>—</td>
            <td>
              label for 연결용 id (선택). 값이 있으면 라벨을 <code>&lt;label for="{inputId}"&gt;</code> 태그로
              출력해 폼 컨트롤과 명시적 연결. 값이 없으면 라벨을 <code>&lt;span&gt;</code> 태그로 출력.<br />
              도움말 요소 id는 <code>helper-{inputId}</code>로 자동 생성.
              <code>inputId</code> 없을 때 도움말 id는 생성되지 않음
            </td>
          </tr>
          <tr>
            <td><code>labelText</code></td>
            <td><code>string</code></td>
            <td><code>''</code></td>
            <td>라벨 영역에 표시할 텍스트</td>
          </tr>
          <tr>
            <td><code>showLabel</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>라벨 영역 표시 여부. false 시 라벨 텍스트 + tooltip slot 모두 미렌더링</td>
          </tr>
          <tr>
            <td><code>required</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>
              라벨 옆 <code>*</code> 시각 표시 (<code>aria-hidden="true"</code>). <code>aria-required</code>는 슬롯 내
              컴포넌트에 직접 전달
            </td>
          </tr>
          <tr>
            <td><code>helperText</code></td>
            <td><code>string</code></td>
            <td><code>''</code></td>
            <td>
              일반 도움말 메시지. 값이 있으면 자동 표시.<br />
              <code>errorText</code> · <code>successText</code>와 동시에 표시 가능하며, 세 메시지 중 맨 아래에 위치
            </td>
          </tr>
          <tr>
            <td><code>errorText</code></td>
            <td><code>string</code></td>
            <td><code>''</code></td>
            <td>
              에러 메시지. 값이 있으면 빨간색(<code>$color-danger</code>)으로 표시.<br />
              세 메시지 중 맨 위에 위치. <code>successText</code> · <code>helperText</code>와 동시 표시 가능.<br />
              <code>role="alert"</code> 자동 부여
            </td>
          </tr>
          <tr>
            <td><code>successText</code></td>
            <td><code>string</code></td>
            <td><code>''</code></td>
            <td>
              성공/확인 안내 메시지. 체크마크 아이콘 + <code>$color-primary-hover</code>(#00ADDB) 색상으로 표시.<br />
              <code>errorText</code> 유무와 무관하게 값이 있으면 항상 표시 (동시 표시 가능).<br />
              표시 순서: <code>errorText</code>(위) → <code>successText</code>(중간) → <code>helperText</code>(아래).<br />
              <code>role="status"</code> 자동 부여
            </td>
          </tr>
          <tr>
            <td><code>showHelperIcon</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>
              <code>helperText</code> 앞에 <code>CircularNote</code> 아이콘 표시 여부. <code>true</code>이고
              <code>helperText</code> 값이 있을 때만 아이콘 렌더링.<br />
              <code>errorText</code> · <code>successText</code> 표시 여부와 무관하게 동작
            </td>
          </tr>
        </tbody>
      </table>

      <h3 class="formFieldGuidePage__tableTitle">Slots</h3>
      <table class="formFieldGuidePage__propsTable">
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
            <td>필수</td>
            <td>Input, Select, Checkbox, DatePicker 등 임의 폼 컨트롤 삽입</td>
          </tr>
          <tr>
            <td><code>tooltip</code></td>
            <td>선택</td>
            <td>
              라벨 우측 툴팁 영역. 슬롯에 내용이 있으면 자동 렌더링.<br />
              삽입되는 버튼/컴포넌트가 <code>aria-label</code> 또는 <code>title</code> 제공 책임
            </td>
          </tr>
        </tbody>
      </table>

      <p class="formFieldGuidePage__delegationNote">
        <strong>aria-describedby 연결 규칙</strong>: <code>FormField</code>의 도움말 요소 id는
        <code>helper-{inputId}</code> 형식으로 자동 생성됩니다.<br />
        슬롯 내 폼 컨트롤에 <code>aria-describedby="helper-{inputId}"</code>를 직접 전달하면 스크린 리더가 도움말
        텍스트를 읽습니다.<br />
        <code>inputId</code>를 전달하지 않으면 도움말 id도 생성되지 않습니다. 이 경우
        <code>aria-describedby</code> 연결은 사용처에서 직접 처리해야 합니다.<br /><br />
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는 <code>v-bind="$attrs"</code>를 사용하므로
        위 Props 외에도 루트 <code>&lt;div class="formField"&gt;</code> 컨테이너에 모든 네이티브 HTML 속성
        (<code>class</code>, <code>style</code>, <code>data-*</code> 등)을 그대로 전달할 수 있습니다.<br />
        <code>class</code>는 항상 병합(merge)되므로 <code>formField</code> 내부 클래스가 덮어씌워지지 않습니다.<br />
        단, 폼 컨트롤 관련 속성(<code>aria-describedby</code>, <code>id</code>, <code>disabled</code>,
        <code>aria-label</code>, <code>aria-required</code> 등)은
        루트 <code>&lt;div&gt;</code>가 아닌 <strong>슬롯 내 Input / Select 등 폼 컨트롤에 직접 전달</strong>해야 합니다.<br />
        또한 <code>@click</code> 등 이벤트 핸들러는 루트 <code>&lt;div&gt;</code>에 위임되며,
        슬롯 내 입력 컨트롤(Input, Select 등)에는 전달되지 않습니다. 이벤트 핸들러는 슬롯 내 컨트롤에 직접 바인딩하세요.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ layout: 'guide' })

  // ① 기본 폼 구성
  const basicName = ref('')
  const basicPw = ref('')
  const basicEmail = ref('')
  const helperIconValue = ref('')

  // ② 에러 상태
  const errorEmail = ref('')
  const errorPhone = ref('')

  // ③ 성공/확인 상태 + 동시 표시
  const successCoupon = ref('coupon10')

  // ③ 동시 표시 데모
  const simultaneousErrorHelper = ref('')
  const simultaneousSuccessHelper = ref('seoul')
  const couponOptions = [
    { label: '쿠폰을 선택하세요', value: 'placeholder', disabled: true },
    { label: '10% 할인 쿠폰', value: 'coupon10' },
    { label: '20% 할인 쿠폰', value: 'coupon20' },
    { label: '무료 배송 쿠폰', value: 'freeShipping' },
  ]

  const priorityHelper = ref<string | undefined>(undefined)
  const prioritySuccess = ref('seoul')
  const priorityError = ref<string | undefined>(undefined)
  const regionOptions = [
    { label: '지역을 선택하세요', value: 'placeholder', disabled: true },
    { label: '서울', value: 'seoul' },
    { label: '경기', value: 'gyeonggi' },
    { label: '부산', value: 'busan' },
  ]

  // ④ 라벨 없음
  const noLabelValue = ref('')
  const noInputIdValue = ref('')

  // ⑤ 툴팁 포함
  const tooltipEmail = ref('')

  // ⑥ 다중 폼 요소 케이스 — 연락처
  const phone1 = ref('')
  const phone2 = ref('')
  const phone3 = ref('')

  // ⑥ 다중 폼 요소 케이스 — 주소
  const zip = ref('')
  const addrRoad = ref('')
  const addrDetail = ref('')

  function handlePostcodeSearch() {
    // [연동] 개발자가 Daum 우편번호 API로 교체
    zip.value = '06235'
    addrRoad.value = '서울 강남구 테헤란로 123'
  }

  // ⑦ 기타 폼 컴포넌트 조합 — InputAuth
  const authCode = ref('')
  const isAuthActive = ref(true)
  function handleAuthExpired() {
    isAuthActive.value = false
  }

  // ⑦ 기타 폼 컴포넌트 조합 — TextArea
  const reviewText = ref('')

  // ⑦ 기타 폼 컴포넌트 조합 — RadioGroup
  const deliveryMethod = ref('standard')
  const deliveryItems = [
    { value: 'standard', label: '일반 배송 (2~3일)' },
    { value: 'express', label: '빠른 배송 (당일~익일)' },
    { value: 'pickup', label: '직접 수령' },
  ]

  // ⑦ 기타 폼 컴포넌트 조합 — Switch
  const marketingEnabled = ref(false)

  // ⑦ 기타 폼 컴포넌트 조합 — Stepper
  const qty = ref(1)

  // ⑧ 복합 폼 레이아웃
  const formData = reactive({
    name: '',
    email: 'invalid-email',
    coupon: 'SUMMER2024',
    agree: false,
  })

  function handleSubmit() {
    // [연동] 개발자가 이 핸들러에서 API 호출
    alert('제출 버튼 클릭 (가이드 데모)')
  }
</script>

<style lang="scss" scoped>
  $b: 'formFieldGuidePage';

  .#{$b} {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: $spacing-xl;
    padding: $spacing-xl;
  }

  .#{$b}__header {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    padding-bottom: $spacing-lg;
    border-bottom: 1px solid $line-200;
  }

  .#{$b}__meta {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  .#{$b}__badge {
    display: flex;
    align-items: center;
    padding: 0.2rem $spacing-sm;
    background-color: $bg-accent-light-blue;
    border-radius: $radius-sm;
    font-size: $font-size-caption1;
    font-weight: $font-weight-bold;
    color: $color-primary;
  }

  .#{$b}__title {
    font-size: $font-size-h2;
    font-weight: $font-weight-bold;
    color: $text-900;
    margin: 0;
  }

  .#{$b}__desc {
    font-size: $font-size-body2;
    color: $text-600;
    line-height: $line-height-base;
    margin: 0;

    code {
      background-color: $bg-tertiary;
      padding: 0.1rem 0.4rem;
      border-radius: $radius-sm;
      font-size: $font-size-caption1;
      color: $color-primary;
    }
  }

  .#{$b}__section {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: $spacing-lg;
    padding: $spacing-xl;
    background-color: $bg-primary;
    border: 1px solid $line-200;
    border-radius: $radius-md;
  }

  .#{$b}__sectionTitle {
    font-size: $font-size-h4;
    font-weight: $font-weight-bold;
    color: $text-900;
    margin: 0;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid $line-200;
  }

  .#{$b}__group {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }

  .#{$b}__groupTitle {
    font-size: $font-size-body2;
    font-weight: $font-weight-bold;
    color: $text-700;
    margin: 0;
  }

  .#{$b}__row {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: $spacing-md;
  }

  .#{$b}__item {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: $spacing-sm;
  }

  .#{$b}__item--priority {
    display: flex;
    flex-direction: row;
    gap: $spacing-lg;
    align-items: flex-start;
  }

  .#{$b}__priorityCase {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: $spacing-xs;
  }

  .#{$b}__priorityLabel {
    font-size: $font-size-caption1;
    font-weight: $font-weight-bold;
    color: $text-400;
    padding: 0.2rem $spacing-xs;
    background-color: $bg-secondary;
    border-radius: $radius-sm;
    align-self: flex-start;
  }

  .#{$b}__note {
    font-size: $font-size-body3;
    color: $text-600;
    line-height: $line-height-base;
    margin: 0;
    padding: $spacing-sm $spacing-md;
    background-color: $bg-secondary;
    border-radius: $radius-sm;

    code {
      background-color: $bg-tertiary;
      padding: 0.1rem 0.4rem;
      border-radius: $radius-sm;
      font-size: $font-size-caption1;
      color: $color-primary;
    }
  }

  .#{$b}__code {
    margin: 0;
    padding: $spacing-md;
    background-color: $bg-tertiary;
    border: 1px solid $line-200;
    border-radius: $radius-sm;
    overflow-x: auto;

    code {
      font-size: $font-size-caption1;
      color: $text-900;
      white-space: pre;
      font-family: 'Courier New', Courier, monospace;
    }
  }

  .#{$b}__formDemo {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: $spacing-lg;
    padding: $spacing-xl;
    background-color: $bg-secondary;
    border-radius: $radius-md;
    border: 1px solid $line-200;
  }

  .#{$b}__formActions {
    display: flex;
    width: 100%;
    padding-top: $spacing-sm;
  }

  .#{$b}__tableTitle {
    font-size: $font-size-body2;
    font-weight: $font-weight-bold;
    color: $text-900;
    margin-top: $spacing-lg;
    margin-bottom: $spacing-sm;
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

  .#{$b}__tooltipTrigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.6rem;
    height: 1.6rem;
    border: 1px solid $line-200;
    border-radius: $radius-full;
    background-color: $bg-secondary;
    font-size: $font-size-caption1;
    font-weight: $font-weight-bold;
    color: $text-600;
    cursor: pointer;
    line-height: 1;

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px $color-primary;
    }

    &:hover {
      background-color: $bg-tertiary;
    }
  }

  // ⑥ 다중 폼 요소 케이스 — 가이드 전용 wrapper 레이아웃
  .#{$b}__inputGroup {
    display: flex;
    width: 100%;
    gap: 0.4rem;
  }

  .#{$b}__addrGroup {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0.8rem;
  }

  .#{$b}__addrRow {
    display: flex;
    width: 100%;
    gap: 0.8rem;
  }

  .#{$b}__delegationNote {
    margin-top: $spacing-lg;
    padding: $spacing-sm $spacing-md;
    background-color: $bg-accent-light-blue;
    border-left: 3px solid $color-primary;
    border-radius: $radius-sm;
    font-size: $font-size-body3;
    color: $text-600;
    line-height: $line-height-base;

    code {
      background-color: $bg-tertiary;
      padding: 0.1rem 0.4rem;
      border-radius: $radius-sm;
      font-size: $font-size-caption1;
    }
  }
</style>
