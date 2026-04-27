---
name: Select 구현 메모
description: atoms/Select 컴포넌트 구현 완료 기록 — Radix Vue 래핑, v-bind="$attrs" SelectTrigger 위임
type: project
---

# Select — 구현 메모

- **파일 경로**: components/atoms/Select.vue
- **계층**: atoms
- **구현 완료일**: 2026-04-26
- **비표준 구현**:
  - Radix Vue SelectRoot/SelectTrigger/SelectValue/SelectIcon/SelectPortal/SelectContent/SelectViewport/SelectScrollUpButton/SelectScrollDownButton/SelectItem/SelectItemText 래핑
  - `v-bind="$attrs"`는 SelectTrigger에 배치 (SelectRoot는 DOM 요소를 렌더링하지 않으므로)
  - SelectItemIndicator 미사용 (Figma에 체크마크 없음, 배경색 강조만 사용)
  - Chevron 아이콘: `$text-strong` 색상 사용 (Figma 명세 기준 #111111). 닫힌 상태 `rotate(180deg)` → 열린 상태 `rotate(0deg)`
  - SelectValue placeholder: `[data-placeholder]` 속성 선택자 사용 (::placeholder 대신)
  - Trigger 열린 상태: `[data-state="open"]` 속성 선택자로 감지
  - 아이템 상태: `[data-highlighted]`, `[data-state="checked"]`, `[data-disabled]` 속성 선택자 활용
  - `proxyValue` computed를 통한 v-model 연동 (modelValue 기본값 undefined → get에서 '' 폴백)
  - `selectId` 자동 생성 패턴 (Input.vue와 동일)
- **개발자 핸드오프**: 없음 (options prop은 정적 배열로 전달, API 연동 필요 시 options를 동적 데이터로 교체)
- **filter variant 추가 (2026-04-27 업데이트)**:
  - `variant?: 'default' | 'filter'` prop 신규 도입 (기본값 `'default'`)
  - `SelectTrigger`: `SelectRoot__trigger--filter` modifier 추가
  - `SelectContent`: `:class` 동적 바인딩으로 `SelectRoot__content--filter` 조건부 적용
  - `SelectItem`: `:class` 동적 바인딩으로 `SelectRoot__item--filter` 조건부 적용
  - filter SCSS 예외 처리: `width: fit-content` (style.md 일반 규칙 예외 — Figma `40004271:6839`), `height: auto`, padding `0.6rem $spacing-sm 0.6rem 1.0rem`, `border-radius: $radius-sm`
  - filter content: `border-radius: $radius-sm`, `min-width: max-content`
  - filter item: `height: 3.6rem`, `padding: 0 1.0rem`, `font-size: $font-size-body4`
- **가이드 페이지**: pages/guide/select/index.vue + selectGuidePage.scss (2026-04-26 신규 제작 / 2026-04-27 filter variant 섹션 추가, ⑦→⑧ 번호 변경, Props 테이블 variant 행 추가, filterRow SCSS 추가)
- **스타일 통합 (2026-04-26 업데이트)**: non-scoped 블록 제거, `<style lang="scss" scoped>` 단일 블록으로 통합.
  - **원인 분석**: Portal(Teleport)이 body에 마운트되어도 `data-v-xxxxx`는 Vue 런타임이 slotScopeIds로 전달하므로 붙음. 실제 원인은 Radix Vue 컴포넌트(SelectContent 등)가 **자기 자신의 template** 에서 루트 DOM을 렌더링하므로 부모 scoped 선택자가 매칭되지 않는 것.
  - **해결**: Portal 내부 요소에 `:deep(.SelectRoot__xxx)` 사용. 컴파일 시 `[data-v-xxxxx] .SelectRoot__xxx` 로 변환되어 동작.
  - SFC 직접 요소(Trigger/Icon/Value): 일반 scoped 선택자 그대로 사용
  - Portal 내부 요소(Content/Viewport/Item/ScrollBtn): `:deep()` pseudo-class 적용
  - `--radix-select-trigger-width`, `--radix-select-content-available-height` CSS 변수는 `position="popper"` 설정 시 Radix Vue가 SelectContent에 자동 주입
