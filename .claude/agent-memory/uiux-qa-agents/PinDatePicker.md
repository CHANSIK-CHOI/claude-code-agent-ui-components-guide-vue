# PinDatePicker — QA 검수 메모

- **검수일**: 2026-05-14
- **검수 결과**: PARTIAL — Playwright MCP 세션 점유로 미수행 (5차 검수)
- **루프 횟수**: 5회 (1차 BLOCKER: withDefaults 컴파일 에러 → 2차: WARN 2건 → 3차: PASS → 4차: box-shadow/scale-up 변경 재검수 PASS → 5차: formatter 기본값 추가 변경, Context7+정적분석 PASS, Playwright MCP 점유)
- **발견한 BLOCKER 요약**: 없음
- **5차 변경 사항**:
  - `formatter` prop에 기본값 추가: `(type, option) => ({ ...option, text: option.text + ({year:'년', month:'월', day:'일'}[type] ?? '') })`
  - `withDefaults`에서 `formatter: () => defaultFormatter` 팩토리 패턴으로 선언
  - Context7 확인: vant DatePicker `formatter` 시그니처 `(type: string, option: PickerOption) => PickerOption` — 문서와 100% 일치
  - spec vs 구현 정적분석: 전항목 BLOCKER 없음
  - Playwright "년/월/일" 접미사 실제 렌더링 미확인 (MCP 세션 점유)
- **재발 방지 메모**:
  1. `withDefaults` 팩토리 함수에서 `<script setup>` 스코프 상수 참조 금지 — `defineProps`/`withDefaults`는 컴파일 매크로로 setup() 밖으로 호이스팅되므로, Date 기반 기본값은 `() => new Date(new Date().getFullYear() - 10, 0, 1)` 처럼 팩토리 내 직접 계산식으로 작성해야 한다.
  2. 함수 타입 prop의 withDefaults 기본값: `() => defaultFormatter` 패턴(팩토리로 감싸기)이 올바름. 함수 참조도 컴포넌트 인스턴스 간 공유 방지를 위해 팩토리 감싸기 적용.
  3. 취소 시 cancelledValues 임시 저장 패턴: `pendingValue`를 복원하기 전에 먼저 임시 변수에 저장한 뒤 emit해야 올바른 페이로드 전달.
  4. CSS 우선순위 충돌 패턴: `.van-picker-column__item { transition: none !important }` 가 `.van-picker-column__item--selected { transition: ... }` 를 덮어씀. 선택 항목 transition 미적용 상태 (WARN 수준).
  5. `.van-picker-column__item--selected` / `.van-picker__frame` 클래스명 vant 4.x 실제 소스코드(picker/index.css) 기준 존재 확인. box-shadow: none 실측 완료.
