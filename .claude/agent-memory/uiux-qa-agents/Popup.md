# Popup — QA 검수 메모

- **검수일**: 2026-06-01
- **검수 결과**: PASS
- **루프 횟수**: bodyNote Base 이동 재검수 (정적 분석 + Playwright 3개 가이드 페이지)
- **발견한 BLOCKER 요약**: 없음
- **이번 변경 포인트**: `bodyNote?: string` prop을 각 Wrapper(LayerPopup/BottomSheet/FullPopup) 분산 구현에서 Popup.vue(Base)로 통합 이동. Wrapper 3종은 `:body-note="bodyNote"` pass-through만 남김.

## Playwright 검증 결과 (2026-06-01)

### LayerPopup 가이드 (`/guide/layerPopup`)

- ⑧ bodyNote 사용 예시 섹션 존재 확인
- "bodyNote LayerPopup 열기" 클릭 → dialog "개인정보 입력" 열림
- slot 콘텐츠("콘텐츠 영역") 아래에 CircularNote 아이콘 + "입력하신 정보는 안전하게 보호됩니다." 텍스트 정상 렌더링
- 접근성 트리: `img` (아이콘, aria-hidden) + `generic` (텍스트) 구조 확인

### BottomSheet 가이드 (`/guide/bottomSheet`)

- ⑦ bodyNote 사용 예시 섹션 존재 확인
- "bodyNote BottomSheet 열기" 클릭 → dialog "배송지 선택" 열림
- slot 아래 아이콘 + "입력하신 정보는 안전하게 보호됩니다." 정상 렌더링

### FullPopup 가이드 (`/guide/fullPopup`)

- ⑥ bodyNote 사용 예시 섹션 존재 확인
- "bodyNote FullPopup 열기" 클릭 → dialog "주문 정보 입력" 열림
- slot 아래 아이콘 + "입력하신 정보는 안전하게 보호됩니다." 정상 렌더링
- 접근성 트리: `img` + `generic` 구조 확인

### 콘솔 에러

- Kakao SDK CSP 에러 1건 (전사 공통 이슈, bodyNote 변경과 무관)
- bodyNote 관련 Vue warn 0건

## 재발 방지 메모

- bodyNote는 Popup Base에서 관리 (§11 "Wrapper별 추가 Props" 주석 기준 — Base 직접 구현 + Wrapper pass-through 패턴 확정)
- Icon에 `aria-hidden="true"` 적용 — 텍스트가 이미 의미를 전달하므로 장식 아이콘 처리 정상
- bodyNote 아이콘 import: `CircularNoteSvg from '@nd/assets/icons/circularNote.svg?skipsvgo'` — ?skipsvgo 패턴 사용 (SVGO stroke 제거 방지)
- Popup Base에 신규 prop 추가 시 Wrapper 3종(LayerPopup/BottomSheet/FullPopup) pass-through + 가이드 페이지 3개 데모 섹션 동시 업데이트 필수
