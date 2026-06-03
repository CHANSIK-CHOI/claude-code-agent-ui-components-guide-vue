# Button — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-05-11
- **리뷰 결과**: PASS
- **루프 횟수**: 2회 (1차: xs size 추가 / 2차: md-s size 추가)
- **반복 발견 패턴**: 없음
- **주요 관찰**:
  - `useButtonVariant.ts`의 `computed`는 명시적 import 없이 사용 중. `components/atoms/` 는 Nuxt auto-import 스캔 범위 밖이나, 이전 리뷰(xs 추가 시)에서도 동일 패턴 PASS — 런타임 문제 없는 것으로 판단. 변경 없으면 재지적 불필요.
  - `text` shape height(2.6rem)과 `xs` size height(2.6rem) 우연 일치는 이전 리뷰에서 INFO 기록. `md-s`(4.2rem)는 충돌 없음.
  - size 블록 소스 순서: `lg → md → md-s → sm → xs` 내림차순 유지 — 일관성 있음.
  - `md-s`의 `font-size`가 `md`와 동일(`$font-size-body3`). 의도적이면 주석으로 명시 권고(INFO).
- **rules 보강 제안**: size modifier 추가 시 `text` shape height 충돌 여부 체크포인트 spec/가이드 명시 (이전 회차 동일 제안 유지)
