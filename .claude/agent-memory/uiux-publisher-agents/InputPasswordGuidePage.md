# InputPasswordGuidePage — 구현 메모

- **파일 경로**: pages/guide/inputPassword/index.vue
- **계층**: guide
- **구현 완료일**: 2026-05-29
- **비표준 구현**: 없음
- **개발자 핸드오프**: 없음 (가이드 페이지 — 정적 데모만)

## 구현 특이사항

- ⑤ FormField 조합 섹션의 에러 예시는 InputPassword `error` prop을 직접 사용함 (spec §3: error는 Wrapper가 직접 `<p class="inputPassword__error">` 렌더링)
- FormField Props/Slots 상세 설명은 Input 가이드 페이지 참조 안내문으로 대체 (guide-page.md 규칙)
- GuideSidebar ATOMS 그룹 InputAuth 다음에 InputPassword 추가
- `disabled` 데모에서 초기값으로 '비활성 상태 입력값' 문자열을 넣어 토글 버튼 opacity 상태 시각 확인 용이
- `readonly` 데모에서 초기값으로 '읽기 전용 입력값' 문자열을 넣어 읽기 전용 상태 + 토글 동작 가능 확인 용이
