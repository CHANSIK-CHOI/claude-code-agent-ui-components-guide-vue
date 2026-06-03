# Button — QA 검수 메모

- **검수일**: 2026-05-11
- **검수 결과**: PARTIAL (Playwright 미수행 — 호출자 허용)
- **루프 횟수**: 1회
- **변경 내용**: ButtonSize 타입에 'md-s' 추가, _button-base.scss .button--md-s 클래스 추가 (height:4.2rem, padding:0 1.4rem, font-size:$font-size-body3), 가이드 페이지 sizes 배열·Props 테이블 업데이트
- **발견한 BLOCKER 요약**: 없음
- **발견한 WARN**: 가이드 페이지 script 블록에 ButtonShape/ButtonColor 타입이 @nd/components/types에서 import 없이 로컬 재선언됨. 현재 내용은 동일하나 타입 변경 시 diverge 위험.
- **재발 방지 메모**:
  - md-s 추가 정적 분석 결론: types.ts / SCSS / 가이드 페이지 3개 파일 정합 확인.
  - 가이드 페이지 타입은 로컬 재선언 대신 @nd/components/types에서 import하는 패턴 권장.
  - 외부 라이브러리 미사용 컴포넌트이므로 Context7 호출 불필요. v-bind=$attrs 순서 올바름, disabled 이중 차단 유지.
