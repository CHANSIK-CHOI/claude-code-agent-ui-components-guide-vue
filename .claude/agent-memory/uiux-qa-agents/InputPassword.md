# InputPassword — QA 검수 메모

- **검수일**: 2026-05-29
- **검수 결과**: PASS
- **루프 횟수**: 1회
- **발견한 BLOCKER 요약**: 없음
- **재발 방지 메모**:
  - `v-bind="$attrs"` 이중 위임 체인(InputPassword → Input Base → `<input>`) 정상 동작 확인. `defineOptions({ inheritAttrs: false })`가 양쪽 모두 선언되어야 함을 검증.
  - `?skipsvgo` SVG import 패턴 정상 — ShowIcon/HideIcon 모두 아이콘 파일 존재 확인.
  - readonly 상태에서 토글 버튼 정상 동작(입력 차단, 토글 허용) 검증 완료.
  - 콘솔 에러(Kakao SDK CSP)는 프레임워크 공통 이슈로 이 컴포넌트와 무관.
  - WARN 1건: `<p class="inputPassword__error">` 에 `aria-live="polite"` 속성이 구현에 포함되어 있으나 spec §8 접근성 요구사항에 미기재. spec 보강 권고.
