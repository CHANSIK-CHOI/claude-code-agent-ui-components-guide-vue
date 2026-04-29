<template>
  <div class="fullPopupGuidePage">
    <header class="fullPopupGuidePage__header">
      <div class="fullPopupGuidePage__meta">
        <span class="fullPopupGuidePage__badge">organisms</span>
      </div>
      <h1 class="fullPopupGuidePage__title">FullPopup</h1>
      <p class="fullPopupGuidePage__desc">
        화면 전체를 덮는 팝업입니다. 오른쪽에서 슬라이드 인 하는 애니메이션으로
        네이티브 앱의 화면 전환 느낌을 줍니다.<br />
        헤더의 ← 닫기 버튼이 <strong>뒤로가기</strong> 역할을 합니다.
        (<code>aria-label="뒤로가기"</code>)<br />
        <code>useFullPopup()</code> 훅으로 열기/닫기를 제어합니다.
      </p>
    </header>

    <!-- ① 기본 FullPopup -->
    <section class="fullPopupGuidePage__section">
      <h2 class="fullPopupGuidePage__sectionTitle">① 기본 FullPopup</h2>
      <div class="fullPopupGuidePage__group">
        <p class="fullPopupGuidePage__note">
          헤더 ← 버튼(cancel/close 의미)과 footer ok 버튼의 역할 분리를 확인하세요.
          ← 버튼 클릭 → 뒤로가기(닫힘), ok 버튼 클릭 → 적용(부모가 닫기 책임).
        </p>
        <div class="fullPopupGuidePage__row">
          <button type="button" class="fullPopupGuidePage__demoBtn" @click="basic.open()">
            기본 FullPopup 열기
          </button>
        </div>
        <FullPopup v-model:open="basic.isOpen.value" title="상세 정보" @ok="basic.close()">
          <p>전체화면 팝업의 바디 영역입니다.<br />오른쪽에서 슬라이드 인 하는 애니메이션을 확인하세요.</p>
        </FullPopup>
      </div>
    </section>

    <!-- ② 폼 입력 시나리오 -->
    <section class="fullPopupGuidePage__section">
      <h2 class="fullPopupGuidePage__sectionTitle">② 폼 입력 시나리오</h2>
      <div class="fullPopupGuidePage__group">
        <p class="fullPopupGuidePage__note">
          상세 필터 form + <code>#footer</code> slot의 [초기화] [적용] 패턴입니다.
          헤더 ← 버튼은 cancel(뒤로가기), footer 버튼은 적용 의미입니다.
        </p>
        <div class="fullPopupGuidePage__row">
          <button type="button" class="fullPopupGuidePage__demoBtn" @click="filterPopup.open()">
            상세 필터 열기
          </button>
        </div>
        <FullPopup v-model:open="filterPopup.isOpen.value" title="상세 필터">
          <div class="fullPopupGuidePage__filterForm">
            <div class="fullPopupGuidePage__filterSection">
              <p class="fullPopupGuidePage__filterLabel">카테고리</p>
              <label v-for="opt in categoryOptions" :key="opt.value" class="fullPopupGuidePage__radio">
                <input type="radio" v-model="tempCategory" :value="opt.value" />
                {{ opt.label }}
              </label>
            </div>
            <div class="fullPopupGuidePage__filterSection">
              <p class="fullPopupGuidePage__filterLabel">가격대</p>
              <label v-for="opt in priceOptions" :key="opt.value" class="fullPopupGuidePage__radio">
                <input type="radio" v-model="tempPrice" :value="opt.value" />
                {{ opt.label }}
              </label>
            </div>
          </div>
          <template #footer>
            <button type="button" class="fullPopupGuidePage__footerBtn fullPopupGuidePage__footerBtn--reset" @click="resetFilter">
              초기화
            </button>
            <button type="button" class="fullPopupGuidePage__footerBtn fullPopupGuidePage__footerBtn--apply" @click="applyFilter">
              적용
            </button>
          </template>
        </FullPopup>
      </div>
      <div v-if="appliedFilter" class="fullPopupGuidePage__result">
        <p>적용된 필터: <strong>{{ appliedFilter }}</strong></p>
      </div>
    </section>

    <!-- ③ Props / Slots / Events -->
    <section class="fullPopupGuidePage__section">
      <h2 class="fullPopupGuidePage__sectionTitle">③ Props / Slots / Events</h2>

      <h3 class="fullPopupGuidePage__tableTitle">Props</h3>
      <table class="fullPopupGuidePage__propsTable">
        <thead>
          <tr><th>이름</th><th>타입</th><th>기본값</th><th>설명</th></tr>
        </thead>
        <tbody>
          <tr><td><code>open</code></td><td><code>boolean</code></td><td>— (필수)</td><td>v-model:open 바인딩</td></tr>
          <tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>헤더 타이틀 텍스트</td></tr>
          <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>a11y용 설명 텍스트</td></tr>
          <tr><td><code>showClose</code></td><td><code>boolean</code></td><td><code>true</code></td><td>헤더 닫기(←) 버튼 표시</td></tr>
          <tr><td><code>okLabel</code></td><td><code>string</code></td><td><code>'확인'</code></td><td>ok 버튼 텍스트</td></tr>
          <tr><td><code>cancelLabel</code></td><td><code>string</code></td><td><code>'취소'</code></td><td>cancel 버튼 텍스트</td></tr>
          <tr><td><code>showCancel</code></td><td><code>boolean</code></td><td><code>false</code></td><td>cancel 버튼 표시 (전체화면은 기본 숨김)</td></tr>
          <tr><td><code>okDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>ok 버튼 비활성</td></tr>
          <tr><td><code>closeOnEscape</code></td><td><code>boolean</code></td><td><code>true</code></td><td>ESC 키 입력 시 닫기</td></tr>
        </tbody>
      </table>

      <h3 class="fullPopupGuidePage__tableTitle">Slots</h3>
      <table class="fullPopupGuidePage__propsTable">
        <thead>
          <tr><th>이름</th><th>필수</th><th>설명</th></tr>
        </thead>
        <tbody>
          <tr><td><code>default</code></td><td>권장</td><td>body 영역 콘텐츠 (전체화면 기준 스크롤)</td></tr>
          <tr><td><code>#header</code></td><td>선택</td><td>헤더 완전 교체</td></tr>
          <tr><td><code>#footer</code></td><td>선택</td><td>푸터 완전 교체</td></tr>
        </tbody>
      </table>

      <h3 class="fullPopupGuidePage__tableTitle">Events</h3>
      <table class="fullPopupGuidePage__propsTable">
        <thead>
          <tr><th>이름</th><th>페이로드</th><th>설명</th></tr>
        </thead>
        <tbody>
          <tr><td><code>update:open</code></td><td><code>boolean</code></td><td>open 상태 변경 (v-model)</td></tr>
          <tr><td><code>opened</code></td><td>—</td><td>열림 애니메이션 완료 후</td></tr>
          <tr><td><code>closed</code></td><td>—</td><td>닫힘 애니메이션 완료 후</td></tr>
          <tr><td><code>close</code></td><td>—</td><td>닫기(←) 버튼 클릭</td></tr>
          <tr><td><code>ok</code></td><td>—</td><td>ok 버튼 클릭 (부모가 닫기 책임)</td></tr>
          <tr><td><code>cancel</code></td><td>—</td><td>cancel 버튼 클릭</td></tr>
          <tr><td><code>overlayClick</code></td><td>—</td><td>전체화면은 dim 없음 — 발생하지 않음</td></tr>
        </tbody>
      </table>

      <p class="fullPopupGuidePage__delegationNote">
        <strong>접근성 참고</strong>: 닫기 버튼의 <code>aria-label</code>은 일반 팝업의 "닫기" 대신
        <code>"뒤로가기"</code>로 설정됩니다. 전체화면 팝업이 새 화면처럼 동작하기 때문입니다.<br />
        <code>closeOnOverlay</code>는 항상 <code>false</code>로 고정됩니다 (dim 없음).
      </p>

      <p class="fullPopupGuidePage__radixNote">
        이 컴포넌트는 <strong>Radix Vue Dialog</strong>를 기반으로 합니다.
        전체 API는
        <a href="https://www.radix-vue.com" target="_blank" rel="noopener noreferrer">radix-vue.com 공식 문서</a>
        또는 Context7 MCP(<code>mcp__context7__query-docs</code>)를 통해 확인하세요.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'guide' })
import { FullPopup, useFullPopup } from '~/components/popup'

const basic = useFullPopup()
const filterPopup = useFullPopup()

const tempCategory = ref('')
const tempPrice = ref('')
const appliedFilter = ref('')

const categoryOptions = [
  { value: 'all', label: '전체' },
  { value: 'skincare', label: '스킨케어' },
  { value: 'makeup', label: '메이크업' },
]

const priceOptions = [
  { value: 'all', label: '전체' },
  { value: 'under10k', label: '1만원 미만' },
  { value: 'under50k', label: '5만원 미만' },
  { value: 'over50k', label: '5만원 이상' },
]

function resetFilter() {
  tempCategory.value = ''
  tempPrice.value = ''
}

function applyFilter() {
  const parts: string[] = []
  if (tempCategory.value) parts.push(categoryOptions.find(o => o.value === tempCategory.value)?.label ?? '')
  if (tempPrice.value) parts.push(priceOptions.find(o => o.value === tempPrice.value)?.label ?? '')
  appliedFilter.value = parts.join(', ') || '없음'
  filterPopup.close()
}
</script>

<style lang="scss" scoped src="./fullPopup.scss"></style>
