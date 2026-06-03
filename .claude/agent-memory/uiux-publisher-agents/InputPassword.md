# InputPassword — 구현 메모

- **파일 경로**: components/atoms/InputPassword.vue
- **계층**: atoms
- **구현 완료일**: 2026-05-29
- **비표준 구현**:
  - Input Base의 `error` prop이 `boolean` 타입이라 Wrapper에서 `!!error`로 변환해서 전달 (spec에서 InputPassword의 error는 `string | undefined`)
  - error 메시지 렌더링(`<p>`)은 InputPassword Wrapper가 직접 담당 — Input Base는 error 시각 처리(테두리 색상)만, 텍스트 출력은 없음
  - `flex-direction: column` 사용: `inputPassword` 루트는 Input과 error 텍스트를 세로로 쌓는 구조라 불가피. style.md의 "column + gap 조합 금지" 준수(gap 미사용, margin 사용)
- **개발자 핸드오프**: 없음 (퍼블리셔 영역만)
