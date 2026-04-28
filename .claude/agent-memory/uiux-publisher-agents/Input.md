# Input — 구현 메모

- **파일 경로**: components/atoms/Input.vue
- **계층**: atoms
- **구현 완료일**: 2026-04-25
- **비표준 구현**: 없음
- **개발자 핸드오프**: 없음 (UI 제어 prop만 존재)

## 신규 토큰 추가 내역 (assets/scss/abstracts/_variables.scss)

| 토큰 | 값 | 위치 |
|------|-----|------|
| `$text-label` | `$_neutral-500` (#777) | text 카테고리 끝 |
| `$text-helper` | `$_neutral-500` (#777) | text 카테고리 끝 |
| `$line-height-snug` | `1.3` | line-height 카테고리 (tight와 base 사이) |
| `$spacing-input-x` | `1.3rem` (13px) | spacing 카테고리 끝 |

## 구조 요약

- 라벨 영역(`showLabel`), 툴팁 버튼(`showTooltip`), 도움말 텍스트(`showHelperText`) 모두 조건부 렌더링
- `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` → `<input>` 요소에 배치
- 고유 ID(`uid`)로 `<label for>` + `<input id>` 연결, `aria-describedby` 연결
- `aria-invalid="true"` — error 상태에서만 적용
- 툴팁 버튼에 SVG 정보 아이콘(원 + i) 인라인 삽입
- `input__helper--error` modifier로 도움말 색상 분기
