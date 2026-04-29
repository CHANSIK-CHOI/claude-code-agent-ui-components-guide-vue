<template>
  <div class="bottomSheetGuidePage">
    <header class="bottomSheetGuidePage__header">
      <div class="bottomSheetGuidePage__meta">
        <span class="bottomSheetGuidePage__badge">organisms</span>
      </div>
      <h1 class="bottomSheetGuidePage__title">BottomSheet</h1>
      <p class="bottomSheetGuidePage__desc">
        화면 하단에서 슬라이드업으로 등장하는 팝업입니다.<br />
        <code>useBottomSheet()</code> 훅으로 열기/닫기를 제어합니다.
        최대 높이 <code>80vh</code>, body 스크롤을 지원합니다.<br />
        내부적으로 <strong>Radix Vue Dialog</strong>를 사용합니다.
      </p>
    </header>

    <!-- ① 기본 BottomSheet -->
    <section class="bottomSheetGuidePage__section">
      <h2 class="bottomSheetGuidePage__sectionTitle">① 기본 BottomSheet</h2>
      <div class="bottomSheetGuidePage__group">
        <div class="bottomSheetGuidePage__phoneFrame">
          <button type="button" class="bottomSheetGuidePage__demoBtn" @click="basic.open()">
            기본 BottomSheet 열기
          </button>
        </div>
        <BottomSheet v-model:open="basic.isOpen.value" title="정렬 선택" @ok="basic.close()">
          <ul class="bottomSheetGuidePage__optionList">
            <li v-for="opt in sortOptions" :key="opt.value" class="bottomSheetGuidePage__optionItem">
              <button type="button" @click="selectedSort = opt.value; basic.close()">
                {{ opt.label }}
                <span v-if="selectedSort === opt.value" class="bottomSheetGuidePage__check">✓</span>
              </button>
            </li>
          </ul>
        </BottomSheet>
      </div>
      <div v-if="selectedSort" class="bottomSheetGuidePage__result">
        선택된 정렬: <strong>{{ sortOptions.find(o => o.value === selectedSort)?.label }}</strong>
      </div>
    </section>

    <!-- ② 긴 콘텐츠 스크롤 -->
    <section class="bottomSheetGuidePage__section">
      <h2 class="bottomSheetGuidePage__sectionTitle">② 긴 콘텐츠 스크롤</h2>
      <div class="bottomSheetGuidePage__group">
        <p class="bottomSheetGuidePage__note">
          body 영역이 <code>80vh</code>를 초과하면 스크롤됩니다.
        </p>
        <div class="bottomSheetGuidePage__phoneFrame">
          <button type="button" class="bottomSheetGuidePage__demoBtn" @click="longContent.open()">
            긴 콘텐츠 BottomSheet 열기
          </button>
        </div>
        <BottomSheet v-model:open="longContent.isOpen.value" title="긴 목록" @ok="longContent.close()">
          <ul class="bottomSheetGuidePage__longList">
            <li v-for="i in 30" :key="i" class="bottomSheetGuidePage__longListItem">항목 {{ i }}</li>
          </ul>
        </BottomSheet>
      </div>
    </section>

    <!-- ③ 필터 선택 시나리오 (#footer slot) -->
    <section class="bottomSheetGuidePage__section">
      <h2 class="bottomSheetGuidePage__sectionTitle">③ 필터 선택 시나리오</h2>
      <div class="bottomSheetGuidePage__group">
        <p class="bottomSheetGuidePage__note">
          라디오 그룹 + <code>#footer</code> slot의 [초기화] [적용] 패턴입니다.
        </p>
        <div class="bottomSheetGuidePage__phoneFrame">
          <button type="button" class="bottomSheetGuidePage__demoBtn" @click="filter.open()">
            필터 BottomSheet 열기
          </button>
        </div>
        <BottomSheet v-model:open="filter.isOpen.value" title="필터">
          <div class="bottomSheetGuidePage__filterGroup">
            <p class="bottomSheetGuidePage__filterLabel">카테고리</p>
            <label v-for="opt in filterOptions" :key="opt.value" class="bottomSheetGuidePage__radio">
              <input type="radio" v-model="filterValue" :value="opt.value" />
              {{ opt.label }}
            </label>
          </div>
          <template #footer>
            <button type="button" class="bottomSheetGuidePage__footerBtn bottomSheetGuidePage__footerBtn--reset" @click="filterValue = ''">초기화</button>
            <button type="button" class="bottomSheetGuidePage__footerBtn bottomSheetGuidePage__footerBtn--apply" @click="applyFilter">적용</button>
          </template>
        </BottomSheet>
      </div>
      <div v-if="appliedFilter" class="bottomSheetGuidePage__result">
        적용된 필터: <strong>{{ filterOptions.find(o => o.value === appliedFilter)?.label }}</strong>
      </div>
    </section>

    <!-- ④ Props / Slots / Events -->
    <section class="bottomSheetGuidePage__section">
      <h2 class="bottomSheetGuidePage__sectionTitle">④ Props / Slots / Events</h2>

      <h3 class="bottomSheetGuidePage__tableTitle">Props</h3>
      <table class="bottomSheetGuidePage__propsTable">
        <thead>
          <tr><th>이름</th><th>타입</th><th>기본값</th><th>설명</th></tr>
        </thead>
        <tbody>
          <tr><td><code>open</code></td><td><code>boolean</code></td><td>— (필수)</td><td>v-model:open 바인딩</td></tr>
          <tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>헤더 타이틀 텍스트</td></tr>
          <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>a11y용 설명 텍스트</td></tr>
          <tr><td><code>showClose</code></td><td><code>boolean</code></td><td><code>true</code></td><td>헤더 닫기(✕) 버튼 표시</td></tr>
          <tr><td><code>okLabel</code></td><td><code>string</code></td><td><code>'확인'</code></td><td>ok 버튼 텍스트</td></tr>
          <tr><td><code>cancelLabel</code></td><td><code>string</code></td><td><code>'취소'</code></td><td>cancel 버튼 텍스트</td></tr>
          <tr><td><code>showCancel</code></td><td><code>boolean</code></td><td><code>true</code></td><td>cancel 버튼 표시</td></tr>
          <tr><td><code>okDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>ok 버튼 비활성</td></tr>
          <tr><td><code>closeOnOverlay</code></td><td><code>boolean</code></td><td><code>true</code></td><td>dim 클릭 시 닫기</td></tr>
          <tr><td><code>closeOnEscape</code></td><td><code>boolean</code></td><td><code>true</code></td><td>ESC 키 입력 시 닫기</td></tr>
        </tbody>
      </table>

      <h3 class="bottomSheetGuidePage__tableTitle">Slots</h3>
      <table class="bottomSheetGuidePage__propsTable">
        <thead>
          <tr><th>이름</th><th>필수</th><th>설명</th></tr>
        </thead>
        <tbody>
          <tr><td><code>default</code></td><td>권장</td><td>body 영역 콘텐츠 (최대 80vh 내 스크롤)</td></tr>
          <tr><td><code>#header</code></td><td>선택</td><td>헤더 완전 교체</td></tr>
          <tr><td><code>#footer</code></td><td>선택</td><td>푸터 완전 교체</td></tr>
        </tbody>
      </table>

      <h3 class="bottomSheetGuidePage__tableTitle">Events</h3>
      <table class="bottomSheetGuidePage__propsTable">
        <thead>
          <tr><th>이름</th><th>페이로드</th><th>설명</th></tr>
        </thead>
        <tbody>
          <tr><td><code>update:open</code></td><td><code>boolean</code></td><td>open 상태 변경 (v-model)</td></tr>
          <tr><td><code>opened</code></td><td>—</td><td>열림 애니메이션 완료 후</td></tr>
          <tr><td><code>closed</code></td><td>—</td><td>닫힘 애니메이션 완료 후</td></tr>
          <tr><td><code>close</code></td><td>—</td><td>닫기(✕) 버튼 클릭</td></tr>
          <tr><td><code>ok</code></td><td>—</td><td>ok 버튼 클릭 (부모가 닫기 책임)</td></tr>
          <tr><td><code>cancel</code></td><td>—</td><td>cancel 버튼 클릭</td></tr>
          <tr><td><code>overlayClick</code></td><td>—</td><td>dim 클릭</td></tr>
        </tbody>
      </table>

      <p class="bottomSheetGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: BottomSheet은 <code>Popup</code> Base를 내부에서 사용합니다.
        추가 props가 필요한 경우 BottomSheet의 props에 명시적으로 전달합니다.
      </p>

      <p class="bottomSheetGuidePage__radixNote">
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
import { BottomSheet, useBottomSheet } from '~/components/popup'

const basic = useBottomSheet()
const longContent = useBottomSheet()
const filter = useBottomSheet()

const selectedSort = ref('')
const filterValue = ref('')
const appliedFilter = ref('')

const sortOptions = [
  { value: 'popular', label: '인기순' },
  { value: 'newest', label: '최신순' },
  { value: 'price_asc', label: '낮은 가격순' },
  { value: 'price_desc', label: '높은 가격순' },
]

const filterOptions = [
  { value: 'all', label: '전체' },
  { value: 'skincare', label: '스킨케어' },
  { value: 'makeup', label: '메이크업' },
  { value: 'haircare', label: '헤어케어' },
]

function applyFilter() {
  appliedFilter.value = filterValue.value
  filter.close()
}
</script>

<style lang="scss" scoped src="./bottomSheet.scss"></style>
