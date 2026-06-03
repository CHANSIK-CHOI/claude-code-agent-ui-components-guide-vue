# Progress — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-05-29
- **리뷰 결과**: PASS
- **루프 횟수**: 3회차 (tooltipText 통합 후 재검토, PASS)
- **반복 발견 패턴**: 없음
- **수정 확인 항목**:
  - `ProgressRoot`에 `v-model` → `:model-value` 단방향 교체 (이전 2차 PASS 유지)
  - `isMounted` 플래그(비반응형 `let`) + `clearTimeout` — 경쟁 조건 주석 충분, WARN 1건
  - `v-bind="$attrs"` 명시 바인딩보다 앞에 선언 — 순서 정합 유지
  - `Tooltip` 상대경로 import — 같은 카테고리 내 Base/Wrapper 패턴 정합
- **잘된 점**:
  - `indicatorLeft` computed — CSS `max()` 문자열 우회 패턴, SCSS 충돌 없음
  - tooltipText 7개 Tooltip prop 위임: alwaysOpen=true 전용 범위만 노출 (의도적 제한)
  - tooltipArrowAlign default 'center' — spec §3 명시값으로 Tooltip 자체 default('right') 의도적 override
  - indicatorLeft NaN 방어 없음(props.max=0 엣지케이스) — INFO 수준, 브라우저 graceful 처리
- **rules 보강 제안**: 없음
