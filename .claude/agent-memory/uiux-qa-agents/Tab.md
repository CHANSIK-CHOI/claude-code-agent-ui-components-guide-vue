# Tab — QA 검수 메모

- **검수일**: 2026-04-29
- **검수 결과**: PASS
- **루프 횟수**: 2회 (component-revise showViewToggle 범위 확장 후 재검수)
- **발견한 BLOCKER 요약**: 없음
- **재발 방지 메모**:
  - Nuxt dev server HMR이 가이드 페이지 변경을 즉시 반영하지 않는 경우 있음. Playwright 검증 시 page.goto 재호출로 최신 렌더링 강제 확인 필요. 초기 스냅샷이 구버전을 보여주더라도 re-navigate 후 재확인할 것.
  - showViewToggle 동작 범위가 pill 전용에서 모든 variant로 확장(component-revise) — 컴포넌트 구현(`v-if="showViewToggle"`), spec, 가이드 페이지 3곳 모두 일치 확인됨.
  - TabsRoot: `model-value` prop + `@update:model-value` 이벤트 패턴 사용 — Radix Vue Tabs API와 일치.
  - TabsTrigger: `value` prop 필수 + `data-state="active"` CSS 훅 자동 적용 — 구현 코드와 일치.
  - 콘솔 에러(카카오 SDK CSP 차단)는 Tab 컴포넌트 무관한 전역 에러이며 가이드 페이지 전체에서 공통 발생함 — 검수 대상 외.
  - 뷰 토글 버튼 클릭 시 아이콘 전환(목록↔격자) + aria-label 전환 정상 동작 확인. 3개 variant(pill/underline-primary/underline-dark) 모두 showViewToggle 렌더링 확인됨.
