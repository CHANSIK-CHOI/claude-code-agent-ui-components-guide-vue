# TextArea — 구현 메모

- **파일 경로**: components/atoms/TextArea.vue
- **계층**: atoms
- **구현 완료일**: 2026-04-25
- **비표준 구현**:
  - `resize` prop 값을 `:style="{ resize: props.resize }"`로 인라인 바인딩 (CSS 변수로 제어 불가)
  - 스크롤바 thumb 색상: 명세의 `#c0c6cc`는 토큰 미존재 → `$border-strong`(`$_line-100: #c4cdd7`)으로 대체
  - 필드 내부 패딩: 명세의 `$spacing-textarea`(12px) 토큰 미존재 → `1.2rem` 직접 사용 (주석 명시)
  - 입력 텍스트 색상: 명세의 `$text-body` 토큰 미존재 → `$text-strong`으로 대체
  - 카운터 텍스트 색상: `$text-tertiary`(`#838b92`) — Figma 명세 `#838b92` 정확히 일치
- **개발자 핸드오프**: 없음 (순수 퍼블리셔 영역)
