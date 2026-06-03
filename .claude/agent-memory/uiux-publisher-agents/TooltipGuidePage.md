# TooltipGuidePage — 구현 메모

- **파일 경로**: pages/guide/tooltip/index.vue
- **계층**: guide
- **구현 완료일**: 2026-05-11
- **비표준 구현**: 인라인 `<style lang="scss" scoped>` 사용 (가이드 페이지 허용 방식). `__demoArea--spacious` modifier로 alwaysOpen 데모 상하 여백 추가 확보. ③ 인터랙션 섹션에 `@open`/`@close` 이벤트 로그 표시(`lastEvent` ref). `__demoTrigger`는 BEM 엘리먼트로 버튼 스타일 직접 정의.
- **개발자 핸드오프**: 없음 (가이드 페이지 — API 연동 없음)
- **GuideSidebar 추가**: ATOMS 그룹 Popover 다음에 Tooltip 링크 추가 (`/guide/tooltip`)
- **섹션 구성**: ① 기본 Variant (dark/top, dark/bottom, primary/top, primary/bottom) / ② alwaysOpen 모드 (primary/bottom, dark/top) / ③ hover/focus 인터랙션 (dark/primary 각각, 이벤트 로그 포함) / ④ 텍스트 변형 (짧은 text prop / 긴 텍스트 default 슬롯) / ⑤ Props/Slots/Events 테이블 + delegationNote(2단계 위임 Trigger 중심) + radixNote
