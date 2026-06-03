# Tab — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-05-26
- **리뷰 결과**: PASS
- **루프 횟수**: 5회차 (누적)
- **반복 발견 패턴**: 없음
- **rules 보강 제안**: 없음

## 변경 이력

| 회차 | 변경 내용 | 결과 |
|------|---------|------|
| 1회 | (구) 뷰 토글 prop 동작 범위 확장 (pill 전용 → 모든 variant) | PASS |
| 2회 | 뷰 토글 prop 제거 → #actions 슬롯으로 교체 | FAIL — 슬롯 연동 컴포넌트 withDefaults 반환값 미할당 (BLOCKER, 해당 컴포넌트는 이후 프로젝트에서 제거됨) |
| 3회 | grow prop 추가 (boolean, 기본값 false) — 클래스 바인딩 + SCSS modifier만 관여 | PASS |
| 4회 | grow 클래스 조건 강화: `grow` → `grow && variant === 'underline-dark'` | PASS |
| 5회 | pill-vertical variant 추가 — orientation computed + effectiveGrow computed 추출 + actions 슬롯 pill-vertical 제외 조건 | PASS |

## 5회차 검토 요약 (2026-05-26)

- `orientation` computed — props 파생값을 computed로 처리, Vue 관용구 정합
- `effectiveGrow` computed — 4회차 인라인 조건을 computed로 추출, 캐싱 이점 + 재사용성 확보
- `v-bind="$attrs"` 순서 — TabsRoot에서 $attrs 먼저, :orientation 나중으로 내부값 우선권 확보. rules/components.md 준수
- `defineOptions({ inheritAttrs: false })` 정상
- `$slots.actions && variant !== 'pill-vertical'` 복합 조건 — computed 추출 권고(INFO)
- effectiveGrow 주석과 실제 동작 범위 불일치 — 주석 보강 권고(INFO)
- BLOCKER / WARN 0건, INFO 2건
