# Planner 명세 메모리 인덱스

- [Input](Input.md) — atoms 계층, Base만, FormField 연동 전제, error/disabled/readonly 상태 정의
- [Select](Select.md) — atoms 계층, Radix Vue 래핑, attrs 3단계 위임, SelectItemIndicator 미사용 확정
- [TextArea](TextArea.md) — atoms 계층, Base만, maxLength 조건부 카운터, focus/error/disabled는 Input 토큰 동일 적용
- [Tab](Tab.md) — organisms 계층, Radix Vue 래핑, Navigation only, overflowIndicator 제거, #actions 슬롯으로 외부 컨텐츠 배치
- [Checkbox](Checkbox.md) — atoms 계층, Radix Vue CheckboxRoot 래핑(CheckboxIndicator 미사용), 아이콘 항상 렌더+CSS 색상 제어, box 미체크도 회색 아이콘 표시
- [Button](Button.md) — ButtonColor gray 추가(2026-04-27): secondary=sky-blue 계열 재정의, gray=구 secondary 회색 보조 액션
- [Switch](Switch.md) — atoms 계층, Radix Vue SwitchRoot+SwitchThumb 래핑, 내부 레이블 없음, checked=#00ADDB/$color-primary-hover / unchecked=#C0C0C0/$text-300
- [Icon](Icon.md) — 독립 폴더(components/icons/), vite-svg-loader SVG import 방식, makeIcon(name, size, SvgComponent), PlayIcon은 skipsvgo 예외
- [InputAuth](InputAuth.md) — atoms 계층, Input Wrapper, suffix 슬롯에 MM:SS 타이머 삽입, active(false→true 리셋+재시작)/autoStart props, timer-start/timer-end 이벤트만(tick 없음), running/expired 2상태
