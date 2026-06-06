## 외부 라이브러리 정책

엔터프라이즈 프로젝트 안정성을 우선으로, 외부 UI 라이브러리 컴포넌트의 stability(안정성)에 따라 사용 가능 여부를 정의한다.

> **확인일자**: 2026-05-13 / Radix Vue 1.x 기준
> **재확인 필요 시점**: 분기 1회, 또는 신규 컴포넌트 도입 검토 시.
> Radix Vue는 Alpha → Stable 전환이 활발하므로 **Context7 MCP로 최신 stability 재확인 후** 본 문서를 갱신한다.

---

### 1. 핵심 원칙

- **엔터프라이즈 프로덕션 환경**에서는 Radix Vue **Stable 컴포넌트만** 사용한다.
- **Alpha 컴포넌트는 사용 금지** — 기능별 대체안(아래 표)을 따른다.
- 신규 외부 라이브러리 도입 전 본 문서에 stability·대체안 정책을 추가한다.

---

### 2. Radix Vue Stability 매트릭스

#### ✅ Stable — 적극 사용

다음 컴포넌트는 React Radix UI에서 포팅된 검증된 컴포넌트이며 본 프로젝트에서 자유롭게 사용한다.

| 분류 | 컴포넌트 |
|------|---------|
| 오버레이 | Dialog, AlertDialog, Popover, HoverCard, Tooltip, Toast |
| 메뉴/네비게이션 | DropdownMenu, ContextMenu, Menubar, NavigationMenu, Tabs, Toolbar |
| 폼 | Checkbox, RadioGroup, Switch, Select, Slider, Label, Toggle, ToggleGroup |
| 레이아웃/표시 | Accordion, Collapsible, AspectRatio, Avatar, Progress, ScrollArea, Separator |

#### ⚠️ Alpha — 사용 금지 + 대체안 필수

| Radix Vue Alpha 컴포넌트 | 대체 전략 | 비고 |
|-------------------------|---------|------|
| **Calendar** / **DatePicker** / **DateField** / **RangeCalendar** / **DateRangePicker** / **DateRangeField** | `vant DatePicker / Picker / PickerGroup` 래핑 | 온디맨드 import — `plugins/vant.ts`. 3개 컴포넌트만 허용 |
| **Combobox** (검색형 Select) | (1) Stable `Select` + 검색 필터 자체 추가 (2) `@vueform/multiselect` 검토 | 도입 시점에 사용자와 협의 |
| **Listbox** | Stable `Select`로 대체 | 다중선택 필요 시 자체 구현 |
| **NumberField** | 네이티브 `<input type="number">` + 자체 step 컨트롤 | 단순 마크업 |
| **PinInput** | 자체 구현 (input 분할 조합) | 단순 마크업 |
| **Splitter** | 자체 구현 또는 별도 라이브러리 검토 | 도입 시점에 협의 |
| **Stepper** | 자체 구현 (마크업 단순) | 단순 마크업 |
| **TagsInput** | 자체 구현 | 단순 마크업 |
| **Tree** | 자체 구현 또는 별도 라이브러리 검토 | 도입 시점에 협의 |
| **Editable** (인라인 편집) | 자체 구현 (display ↔ input 토글) | 단순 마크업 |
| **Pagination** | 자체 구현 (마크업 단순) | 단순 마크업 |

> **대체안이 "자체 구현"인 항목**: 구현 시점에 컴포넌트 명세를 `uiux-planner-agents`로 먼저 작성한 뒤 `uiux-publisher-agents`가 구현한다. Radix Vue Alpha 코드를 임시로라도 끌어 쓰지 않는다.
>
> **대체안이 "도입 시점에 협의"인 항목**: 사용자와 라이브러리 선택을 협의 후 본 문서에 결정 사항을 추가한다.

---

### 3. 비-Radix 외부 라이브러리

| 라이브러리 | 버전 | 용도 | 정책 |
|----------|------|------|------|
| `vant` | ^4.9.24 | DatePicker, Picker, PickerGroup | 온디맨드 import (`plugins/vant.ts`) — 이 3개 컴포넌트만 허용. 전체 CSS(`vant/lib/index.css`) 사용 금지, 컴포넌트별 `vant/es/*/style/index` 로드 |
| `radix-vue` | 1.9.17 | 헤드리스 UI | Stable 컴포넌트만 사용 |

> **(2026-06-06) `swiper`·`gsap` 제거됨**: `swiper`는 `Marquee` 컴포넌트 전용이었으나 v12 호환 이슈로 `Marquee`를 삭제하면서 함께 제거했다. `gsap`은 실사용 컴포넌트가 없는 예비 의존성이라 제거했다. 슬라이드/캐러셀이 다시 필요하면 도입 시점에 본 §4 절차를 따라 재검토한다.

---

### 4. 신규 라이브러리 도입 절차

새 외부 라이브러리(또는 기존 라이브러리의 신규 컴포넌트) 도입 검토 시 다음 순서로 진행한다.

1. **Context7 MCP로 stability 확인** — Alpha/Beta/Deprecated 여부 점검
2. **본 문서의 매트릭스에 추가** — 라이브러리명, 버전, 용도, stability, 대체안
3. **CLAUDE.md "개발 환경" 섹션 갱신** — 도입 확정 시 라이브러리명 추가
4. **사용자 승인** — 자동 도입 금지. 정책 변경은 반드시 사용자 확인

---

### 5. Stability 정보가 stale 하다는 신호

다음 상황에서는 본 문서를 신뢰하지 말고 즉시 Context7 MCP로 재확인한다.

- 본 문서의 **확인일자**가 3개월 이상 지난 경우
- Radix Vue 메이저 버전(2.x 등) 업데이트가 있었던 경우
- 사용자가 "Alpha 였는데 Stable 됐다는 얘기를 들었다" 등으로 변경 가능성을 언급한 경우
- 명세/구현 진행 중 본 문서와 라이브러리 실제 동작이 어긋나는 경우

재확인 결과 변경이 있으면 본 문서의 매트릭스와 **확인일자**를 함께 갱신한다.
