# InputAuthGuidePage — 구현 메모

- **파일 경로**: pages/guide/input-auth/index.vue, pages/guide/input-auth/input-auth.scss
- **계층**: guide (atoms 컴포넌트 가이드)
- **구현 완료일**: 2026-05-29
- **비표준 구현**:
  - `active` prop 재시작 데모: `false → true` 사이클링 시 `nextTick()`으로 한 틱 지연 후 true 전환 — watch가 두 전환을 모두 감지하도록 처리
  - `__badge--wrapper` 모디파이어 추가 (Wrapper 컴포넌트임을 표시, atoms 배지와 구분)
  - `__controlBox`: flex 가로 배치 (버튼 그룹, gap 적용)
  - `__formFieldNote`: FormField 가이드 페이지 참조 안내 단락 (guide-page.md §"FormField 사용 컴포넌트" 규칙 준수)
- **개발자 핸드오프**: 없음 (순수 UI 데모 페이지)
- **GuideSidebar 추가**: ATOMS 그룹 Input 다음에 `{ label: 'InputAuth', to: '/guide/input-auth' }` 추가
- **섹션 구성**: ① autoStart(180초) / ② active prop 제어(시작·정지·재시작) / ③ 짧은 타이머(10초, timer-end 확인) / ④ disabled+타이머 독립 진행 / ⑤ error 상태(진행중+만료) / ⑥ Props·타이머상태·Events 테이블
