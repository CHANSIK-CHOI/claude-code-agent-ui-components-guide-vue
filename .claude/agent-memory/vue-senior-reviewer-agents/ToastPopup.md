# ToastPopup — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-05-29
- **리뷰 결과**: PASS
- **루프 횟수**: 7차 누적 / 이번 차: 이전 WARN 3건 수정 확인 리뷰
- **반복 발견 패턴**: 모듈 레벨 싱글톤 타이머 맵 언마운트 정리 누락 (이번 차 해소 확인)
- **rules 보강 제안**: rules/architecture.md "Composables 위치"에 "모듈 레벨 Map/Set 싱글톤은 렌더러 onUnmounted에서 clearAll 처리 필수" 예시 추가 권고

## 이전 WARN 수정 확인 (7차 → 최종)

1. ToastRenderer.vue — onUnmounted 타이머 정리: ✅ `instances.value.slice().forEach(toast => remove(toast.id))` 정상 반영
2. ToastPopup.vue — hasIconSlot computed 제거 → `!!$slots.icon` 직접 참조: ✅ template 8번·13번째 줄 모두 직접 참조로 변경
3. useToastPopup.ts — remove() splice → filter immutable + clearTimeout 보완: ✅ `instances.value.filter(...)` 패턴 + `clearTimeout` + `timers.delete(id)` 순서 모두 정상

## 잔여 이슈

### WARN 1: useToastPopup.ts — close()의 mutable 직접 변이
- `toast.open = false` (mutable) vs remove()의 `filter` (immutable) 혼용
- 동작 오류 없음 — Vue reactive 객체 내부 변이는 추적됨
- 코드 스타일 일관성 권고 (map+spread 패턴 대안 제시)

### INFO 1: useToastPopup.ts — Math.random() id 충돌 가능성
- 동일 밀리초 내 다수 open() 시 Date.now() 중복 가능성
- 실용 범위에서 충분 — crypto.randomUUID() 선택적 개선 안 제시

### INFO 2: ToastRenderer.vue SCSS — flex-direction:column + gap 조합
- rules/style.md BLOCKING 규칙 위반 형태
- Radix ToastViewport <ol>/<li> 구조 제약으로 margin 직접 적용 불가 → 예외 주석 처리 권고

## 전체 구조 정합 사항
- defineOptions({ inheritAttrs: false }) + v-bind="$attrs" 순서: 올바름
- ?skipsvgo SVG import: 올바름 (markRaw 래핑 포함)
- duration:0 타이머 미등록 케이스: onUnmounted remove() 경유 안전 처리
- close() 내 clearTimeout 처리: 정상
- auto-import 정합: ToastPopup.vue에 명시 import 없음 (Nuxt auto-import)
- useToastPopup.ts ref/markRaw 명시 import: co-located composable이라 auto-import 대상 아님 — 올바름
