# Select — QA 검수 메모

- **검수일**: 2026-05-20
- **검수 결과**: PASS
- **루프 횟수**: 이전 4회 루프 + 시니어리뷰 1회 + 재검수 3회(filter variant 오버플로우 수정 + 모듈스코프 UID 이동)
- **발견한 BLOCKER 요약**: 없음

- **이번 재검수(2026-05-20, 모듈스코프 UID 이동) 검증 내용**:
  - id 고유성: 총 15개 SelectTrigger 중 자동생성 ID(`select-1`, `select-10`~`select-14`) 모두 고유, 중복 없음 ✅
  - 외부 id prop 우선 적용: `demo-category`, `demo-region-helper` 등 외부 전달 id가 정확히 반영됨 ✅
  - filter variant 드롭다운 오버플로우: min-width=100.469px, max-width=1212px, 뷰포트 미이탈 ✅
  - filter 아이템 말줄임: overflow:hidden / white-space:nowrap / text-overflow:ellipsis 실측 확인 ✅
  - Escape 닫힘: data-state="closed", aria-expanded="false" 정상 ✅
  - 콘솔 에러: Kakao SDK CSP 1건 — 컴포넌트 무관 전역 이슈 ✅

- **Context7 API 검증 결과**:
  - SelectContent `bodyLock` prop: 실제 존재 (기본값 true). `:body-lock="false"` 사용 정상 ✅ (node_modules 직접 타입 확인)
  - SelectRoot props: `open`, `defaultOpen`, `defaultValue`, `modelValue`, `dir`, `name`, `autocomplete`, `disabled`, `required` — 모두 실제 존재 ✅
  - SelectIcon `as-child`: PrimitiveProps 계열, `as-child` 사용 정상 ✅
  - SelectRoot 이벤트: `@update:open="emit('open-change', $event)"` 올바름 ✅

- **WARN (이전 이월)**:
  - spec §9 토큰 표에 존재하지 않는 토큰 기재: `$border-default`(→ `$line-200`), `$text-strong`(→ `$text-900`), `$text-disabled`(→ `$text-400`), `$text-secondary`(→ `$text-600`) — 구현에서는 올바른 토큰 사용 중, spec 표 오기재만의 문제

- **재발 방지 메모**:
  - **Vue 3.4 호환 UID 패턴**: `useId()` 사용 금지(3.5+ API). 모듈 스코프 `<script lang="ts">` 블록에 카운터 선언 후 `<script setup>`에서 `ref(\`select-\${++_selectUid}\`)` 패턴. SSR 환경에서는 hydration 불일치 가능성 있으나 가이드 페이지 범위에서는 정상 동작 확인.
  - **Radix Vue SelectValue 내부 span에 scoped CSS 적용 불가** — SelectValue 사용 금지, `v-if/v-else`로 직접 span 렌더링할 것.
  - 말줄임 처리는 `flex: 1; min-width: 0 + @include truncate` 조합 필수.
  - filter variant 드롭다운 CSS 변수: Context7보다 Playwright 실측이 신뢰성 높음.
  - 콘솔 에러(Kakao SDK CSP): Select 컴포넌트와 무관한 전역 인프라 에러, 무시 가능.
