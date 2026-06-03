---
name: MarqueeGuidePage
description: Marquee 가이드 페이지 구현 메모 — 6섹션(하이브리드 슬라이드 래핑 데모 추가), GuideSidebar MOLECULES 그룹 TermsAgreement 다음에 추가
metadata:
  type: project
---

# MarqueeGuidePage — 구현 메모

- **파일 경로**: pages/guide/marquee/index.vue
- **계층**: guide
- **구현 완료일**: 2026-06-01 (2026-06-01 갱신: QA WARN 3건 수정)
- **비표준 구현**: 없음
  - Marquee 자체가 defineComponent + render function 패턴(script setup 예외)이지만 가이드 페이지는 일반 script setup 사용
  - wideScreen 데모를 위해 `__wideScreenDemo`에 `margin-right/left: -$spacing-lg` 네거티브 마진 적용(가이드 페이지 패딩 상쇄)
  - 데모 카드 배경색은 raw hex 미사용 — 전부 토큰(`$bg-accent-*`)으로 처리
  - molecules badge 색상: `$bg-accent-beige` + `$text-700` (atoms의 sky-blue와 구분)
  - ① 기본 데모의 `demoCards`는 `color?: string` 인라인 스타일 제거 → `colorClass?: string` BEM 클래스로 교체
- **개발자 핸드오프**: 없음 (가이드 페이지 전용, API 연동 없음)

## 섹션 구성
1. ① 기본 자동 마퀴 — default slot에 카드 자식 6개, 자동 래핑 시연
2. ② speed 조절 — 0.03(느림) vs 0.15(빠름) 나란히 비교
3. ③ spaceBetween 조절 — 4px vs 24px 비교
4. ④ full-bleed (wideScreen) — class="wideScreen" $attrs 위임 시연
5. ⑤-1 Vue 컴포넌트 자식(deepCloneVNode) — 실제 Icon 컴포넌트(icons) 사용. deepCloneVNode 동작을 실제 Vue 컴포넌트로 시연 (구 Badge 데모는 2026-06-03 컴포넌트 제거로 Icon 교체)
6. ⑤ SwiperSlide 직접 경로 — SwiperSlide v-for + `__slideDirectDemo :deep(.swiper-slide){ width: 16rem }` 스코프 한정 시연
7. ⑥ Props — HTML table (Props/Slots/Events), delegationNote, swiperNote

## 주요 결정
- `__radixNote` 미작성(Radix Vue 미사용 — swiper 기반)
- `__swiperNote` 별도 단락 추가: swiper FreeMode + rAF 기반, prefers-reduced-motion WCAG 2.2.2 안내
- Events 표: 이벤트 없음을 colspan=3 셀로 명시
- GuideSidebar MOLECULES 그룹 TermsAgreement 다음에 Marquee 추가
- ⑤ 신규 데모: `.marqueeGuidePage__slideDirectDemo :deep(.swiper-slide)` 패턴으로 다른 데모의 `.swiper-slide` 스타일에 영향 없음
- Slots 표 default slot 설명: "자동 래핑 / 직접 경로 하이브리드" 두 경로 모두 안내
- 헤더 desc: "하이브리드" 문구 한 줄 추가
- Icon 사용 시 주의: SVG는 `?component` import, `size`/`color` prop으로 제어

## QA WARN 수정 (2026-06-01)
- WARN-1: deepCloneVNode children 배열에서 `isVNode` 판별 추가 → primitive(string/number/boolean/null)는 그대로 유지
- WARN-2: ⑤-1 데모를 실제 Vue 컴포넌트로 교체. `__cloneChip` CSS 스타일 제거됨
- WARN-3: `resolveComponent('ClientOnly')` setup 클로저 최상단에서 1회 조회, render에서 재사용
