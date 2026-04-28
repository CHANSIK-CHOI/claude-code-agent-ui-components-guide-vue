# Checkbox — 구현 메모

- **파일 경로**: components/atoms/Checkbox.vue
- **계층**: atoms
- **구현 완료일**: 2026-04-27
- **비표준 구현**:
  - Radix Vue CheckboxRoot + CheckboxIndicator 래핑
  - check type은 CheckboxIndicator 미사용 — 미체크 상태에도 아이콘을 항상 표시해야 하므로 Indicator 밖에 `v-if="type === 'check'"` SVG를 별도 배치. CSS 클래스 `checkbox__icon--always`로 구분.
  - box type만 CheckboxIndicator 사용 (`v-if="type === 'box'"`)
  - `:checked` + `@update:checked` 명시적 분리 패턴 사용 — `v-model:checked`(writable computed) 대신 단방향 바인딩으로 controlled mode 안정성 확보. `onCheckedChange(val)`에서 `val === true`로 boolean 정제.
  - `id` prop: props.id → attrs.id → 자동 생성 순으로 우선순위 적용 (Input.vue 패턴과 동일)
  - `rootAttrs`: attrs에서 id 제외한 나머지 전부 CheckboxRoot에 위임 (Select의 3단계 분리와 달리, Checkbox는 Root = Trigger이므로 단순 위임)
  - wrapper(`<label>`) BEM modifier `--checked`를 `proxyValue`로 동기화 → check type의 CSS 상태 제어에 활용
  - **:deep() 필수**: Radix Vue CheckboxRoot는 `inheritAttrs: false`로 내부에서 attrs를 직접 처리하므로, Vue scoped의 scope attribute(`data-v-xxxx`)가 내부 `<button>`에 전달되지 않음. 따라서 `.checkbox__control`, `.checkbox__indicator`, `.checkbox__icon` 등 Radix 내부 요소는 반드시 `:deep()` selector로 스타일링해야 함. wrapper(`<label>`)에는 scope attribute가 있으므로 `.wrapper--box { :deep(.control) { ... } }` 패턴 사용.
  - **`$slots.default?.().length` 체크**: 슬롯 콘텐츠 유무는 `$slots.default` truthy 체크 대신 `$slots.default?.().length`로 확인. 빈 슬롯에서도 `$slots.default`가 함수로 존재할 수 있음.
- **개발자 핸드오프**: 없음 (순수 UI 상태 컴포넌트)
