---
name: Switch 구현 메모
description: atoms 계층, Radix Vue SwitchRoot/SwitchThumb 래핑, :deep() + display:contents 래퍼 패턴
type: project
---

# Switch — 구현 메모

- **파일 경로**: components/atoms/Switch.vue
- **계층**: atoms
- **구현 완료일**: 2026-04-28

## 비표준 구현

- **`display: contents` 래퍼 패턴**: Radix Vue SwitchRoot는 내부에서 `<button>`을 렌더하며 `inheritAttrs: false`로 처리되어 Vue scoped attribute가 내부 요소에 전달되지 않음. Checkbox.vue와 동일 문제. 래퍼 `<span class="switch__root">`를 두고 `display: contents`로 레이아웃 영향 없이 scoped attribute 주입 전용으로 사용. 이후 `:deep()` 으로 내부 `.switch` / `.switch__thumb` 선택.
- **상태 처리 — `data-state` / `data-disabled` 속성 선택자**: BEM modifier(`--`) 방식 대신 Radix Vue가 자동 추가하는 `data-state="checked|unchecked"` / `data-disabled` 속성 선택자로 상태 스타일 처리.
- **attrs 위임**: Switch는 Portal/Content 없는 단일 인터랙티브 요소(SwitchRoot = Trigger = 인터랙티브). 3단계 분리 불필요 — `rootAttrs` computed로 `checked`/`disabled` 제외 후 모든 attrs를 SwitchRoot에 위임.
- **Thumb 이동 공식**: unchecked `translateX(0.2rem)`, checked `translateX(2.2rem)` (트랙 46px - Thumb 22px - 여백 2px = 22px = 2.2rem)
- **hover 색상**: unchecked hover → `$text-400` (#838b92 — 살짝 어둡게), checked hover → `$color-primary` (#0CB5E2 — 원색보다 살짝 밝게)
- **active 처리**: `:deep(.switch:not([data-disabled]):active) .switch__thumb` 로 active 시 Thumb `scale(0.95)` 축소, 위치는 unchecked/checked 각각 유지

## 개발자 핸드오프

- `name` prop — HTML form 전송 시 필드 name (연동 필요)
- `required` prop — HTML form 필수 여부 (연동 필요)
- `value` prop — HTML form 켜짐 상태 값 (기본 `'on'`, 연동 필요)
