# Switch — 기획 메모

- **계층**: atoms
- **작성일**: 2026-04-28
- **주요 결정**:
  - Radix Vue `SwitchRoot` + `SwitchThumb` 래핑 (Stable 컴포넌트)
  - Base만. 레이블은 외부 `<label>` 또는 `aria-label`로 연결 (내부 레이블 영역 없음)
  - Track 크기: 46px × 26px / Thumb: 22px × 22px (Figma 노드 `40004010:2329`)
  - checked Track: `#00ADDB` → `$color-primary-hover` / unchecked Track: `#C0C0C0` → `$text-300`
  - Thumb은 CSS 단독 구현 (`$bg-primary` + `$radius-full` + `box-shadow`)
  - Checkbox와 다르게 내부 레이블 슬롯 없음 — 단순 토글 컨트롤
- **미확정 항목**:
  - hover / active 상태 시각 처리 여부 (Figma 미명시)
  - disabled 상태 opacity 수치 (Figma 별도 프레임 없음)
  - Thumb 드롭 섀도우 CSS 수치 (Figma 에셋으로만 표현)
  - Thumb 전환 애니메이션 여부 및 duration (Figma 정적)
