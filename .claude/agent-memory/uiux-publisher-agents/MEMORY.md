# Publisher 구현 메모리 인덱스

- [ButtonLink](ButtonLink.md) — atoms 계층, NuxtLink/a 동적 태그, rel 자동 보완, Button mixin/composable/타입 공유
- [Checkbox](Checkbox.md) — atoms 계층, Radix Vue CheckboxRoot 래핑, :deep() 필수(Radix inheritAttrs:false로 scope attr 미전달), :checked+@update:checked 명시 분리, $slots.default?.().length 체크
- [Input](Input.md) — atoms 계층, Base만, defineOptions inheritAttrs:false, 자동 id 생성 패턴
- [Select](Select.md) — atoms 계층, Radix Vue 래핑, useAttrs() 3단계 분리, SelectItemIndicator 미사용
- [TextArea](TextArea.md) — atoms 계층, Base만, maxLength 카운터 조건부, focus/error/disabled Input 토큰 동일 적용
- [TextAreaGuidePage](TextAreaGuidePage.md) — TextArea 가이드 페이지 구현 메모
- [Tab](Tab.md) — organisms 계층, Radix Vue TabsRoot 래핑, Navigation only, 3 variants, overflow indicator, pill+viewToggle
- [TabGuidePage](TabGuidePage.md) — Tab 가이드 페이지, 6섹션, GuideSidebar ORGANISMS 그룹 추가
- [Stepper](Stepper.md) — atoms 계층, 자체 구현(Radix Vue NumberField Alpha), attrs 3방향 분산 위임, inputBuffer 직접 입력 패턴
- [CheckboxGuidePage](CheckboxGuidePage.md) — Checkbox 가이드 페이지, 6섹션, inline-flex 예외 팀 확정, GuideSidebar ATOMS 그룹 추가
- [Button](Button.md) — ButtonColor gray 추가(2026-04-27): secondary=sky-blue($bg-accent-sky-blue+$color-primary-hover), gray=구 secondary 회색
- [Switch](Switch.md) — atoms 계층, Radix Vue SwitchRoot/SwitchThumb 래핑, display:contents 래퍼+:deep() 패턴, data-state/data-disabled 속성 선택자로 상태 처리
- [SwitchGuidePage](SwitchGuidePage.md) — Switch 가이드 페이지, 6섹션, $border-default 미존재로 $line-200 대체, GuideSidebar ATOMS 그룹 추가
- [Icon](Icon.md) — icons 전용 폴더(Atomic 외부), makeIcon 헬퍼+CartIcon 배지, inline-flex 예외, CartIcon CSS는 global.scss raw hex, 모든 export에 Icon suffix(CloseIcon 등), Tooltip/CircularNote는 ?skipsvgo(배경 버그)
- [Popup](Popup.md) — popup/ 전용 폴더, Radix Vue DialogRoot/DialogContent 래핑, 6개 파일 전체 inheritAttrs:false+v-bind="$attrs" 위임, Alert/Confirm은 프로그래매틱(onClose/onOk/onCancel 콜백 패턴)
- [ToastPopup](ToastPopup.md) — popup/ 전용 폴더, Radix Vue ToastRoot 단일 위임(Trigger 없어 3단계 분리 불필요), 모듈 레벨 ref 싱글톤(CSR 전용), Teleport to="#popup-container"
