---
name: Button 구현 변경 이력
description: ButtonColor gray 추가 — secondary sky-blue 재정의, gray = 구 secondary 회색 계열
type: project
---

## 변경 내용 (2026-04-27)

### 영향 파일
- `components/types.ts` — `ButtonColor`에 `'gray'` 추가
- `assets/scss/components/_button-base.scss` — gray 셀렉터 3개 추가, secondary 셀렉터 교체
- `pages/guide/button/index.vue` — getColors()에 `'gray'` 추가

### SCSS 토큰 매핑

**solid.secondary (신규)**
- bg: `$bg-accent-sky-blue` (#DFF6FF)
- color: `$color-primary-hover` (#00ADDB)
- hover: `filter: brightness(0.96)`

**solid.gray (= 구 secondary)**
- bg: `$bg-secondary`
- color: `$text-800`

**line/text secondary**: primary-family 도출 (cyan 계열)
**line/text gray**: 구 secondary 동일 (회색 계열)

**Why:** Figma node `40004010:2438` 기준 secondary 디자인 변경.
**How to apply:** Button 컴포넌트 사용 시 gray variant 존재 인식. ButtonLink도 button-base 믹스인 공유로 자동 반영됨.
