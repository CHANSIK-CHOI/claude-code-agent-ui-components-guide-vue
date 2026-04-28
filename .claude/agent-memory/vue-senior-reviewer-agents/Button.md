# Button — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-04-28
- **리뷰 결과**: PASS
- **루프 횟수**: 1회
- **반복 발견 패턴**: co-located composable(`useButtonVariant.ts`)에서 `computed` 명시적 import — Nuxt auto-import 대상임에도 `import { computed } from 'vue'` 작성
- **rules 보강 제안**: `rules/architecture.md` "Composables 위치" 섹션에 "co-located `.ts` 파일도 Nuxt auto-import 대상이므로 `import { computed } from 'vue'` 불필요" 문구 추가 권고. `rules/style.md` "너비 원칙"에 `shape=text`처럼 인라인 보조 액션이 설계 의도인 경우 `inline-flex` + `fit-content` 예외 허용 여부를 명시 권고.
