# Marquee 컴포넌트 명세

---

### 0. Atomic 계층 & 파일 배치

- **계층**: molecules — atoms(SwiperSlide)를 조합하고 rAF 기반 자동 스크롤 로직을 추가한 복합 UI 블록이므로 molecules로 분류
- **배치 경로**: `components/molecules/Marquee.vue`
- **Base/Wrapper 분리**: 해당 없음 — 단일 컴포넌트로 구성

> **`<script setup>` 사용 불가 예외 사유 (구현 시 반드시 명시)**
> Vue 3의 `<script setup>`에서는 `useSlots().default()` 로 수집한 VNode를 렌더 트리에서 직접 조작(래핑·판별)할 수 없다. Marquee는 default slot의 각 VNode를 검사해 `SwiperSlide`가 아닌 경우에만 `SwiperSlide`로 감싸야 하므로 `defineComponent` + render function 패턴이 필수다. 이는 `rules/components.md`의 "`<script setup lang="ts">` 사용" 원칙의 **정당한 예외**이며, 예외 사유를 컴포넌트 코드 상단 주석으로 명시해야 한다.

---

### 1. 컴포넌트 개요

HTML `<marquee>` 대체 컴포넌트. default slot에 넣은 자식 요소들이 Swiper FreeMode + requestAnimationFrame 기반으로 왼쪽 방향 무한 스크롤된다. 사용자 드래그(FreeMode 스와이프) 시 관성 이동 후 자동 스크롤이 재개된다. 메인 페이지 Story 섹션처럼 상품·인물·카드 목록을 수평 흘림으로 노출하는 경우에 사용한다.

---

### 2. 영역 구성 (Area Map)

- ① **스크롤 트랙** — Swiper 인스턴스 전체 영역. 슬라이드들이 무한 루프로 좌측 이동. / 필수
- ② **슬라이드 아이템** — default slot으로 주입된 각 자식 VNode를 처리한 단위. **하이브리드 래핑 + deep clone 방식**: slot 자식이 이미 `SwiperSlide`(`swiper/vue`)이면 key 보강만 하고, 아니면 `SwiperSlide`로 자동 래핑한다. 래핑 시 동일 VNode 참조 재사용을 방지하기 위해 deep clone을 적용한다 (Swiper loop copy 대응 — §5 "slot VNode 하이브리드 래핑" 참조). 시각 외관은 slot 내용이 결정 / 필수 (slot 자식 없으면 컴포넌트가 의미 없음)
  - **SwiperSlide 직접 경로**: 사용처에서 `import { SwiperSlide } from 'swiper/vue'` 후 slot에 직접 주입. `slidesPerView: 'auto'` 환경에서 슬라이드 너비는 `.swiper-slide` 요소 자체가 결정해야 하므로 사용처가 `:deep(.swiper-slide){ width: 25rem }` 로 직접 제어할 수 있다.
  - **자동 래핑 경로**: slot 자식이 일반 VNode(div 등)이면 `h(SwiperSlide, ...)` 로 감싼다. 이때 SwiperSlide에 `width: fit-content`를 부여하여 안쪽 콘텐츠(div)의 폭이 `.swiper-slide` 요소 폭으로 그대로 반영되도록 한다. 기존 사용처 호환 유지.
- ③ **클론 슬라이드** — Swiper loop 옵션이 자동 생성하는 복사본. loopFix()로 translate를 교정하여 시각적 끊김 없는 루프 유지 / 내부 자동 생성
- ④ **attrs 수신 영역** — 외부에서 전달된 class·data-* 등 $attrs가 Swiper 컴포넌트에 병합되는 지점. `<Marquee class="wideScreen">` 시 full-bleed 레이아웃 적용 / 조건부(사용처 선택)

---

### 2-1. Props 목록

| 항목 | 설명 | 기본값 |
|------|------|--------|
| 자동 스크롤 속도 (`speed`) | 프레임당 이동 속도. 단위: px/ms. 값이 클수록 빠르게 이동 | `0.07` |
| 슬라이드 간격 (`spaceBetween`) | 각 슬라이드 아이템 사이의 간격. 단위: px | `12` |
| 드래그 후 재개 지연 (`resumeDelay`) | touchEnd 후 관성 전환이 없을 때 자동 스크롤 재개까지 대기 시간. 단위: ms | `700` |

> Swiper 하드코딩 기본값 (변경 금지): `modules=[FreeMode]`, `freeMode={ enabled:true, momentum:true, momentumRatio:0.4, momentumVelocityRatio:0.6 }`, `grabCursor=true`, `slidesPerView='auto'`, `loop=true`. `loopAdditionalSlides`는 slot 자식 VNode 수를 자동 계산(별도 prop 없음).

> **`$attrs` 위임**: `defineOptions({ inheritAttrs: false })`를 선언하고, render function에서 `$attrs`(class 포함)를 Swiper 컴포넌트에 전달한다. 사용처에서 `<Marquee class="wideScreen">` 로 부여하면 Swiper에 병합되어 full-bleed 레이아웃이 자연스럽게 적용된다. class·data-* 등 모든 fallthrough attrs가 스크롤 트랙 최상위 요소로 위임된다.

---

### 2-2. Props 설계 원칙 — 중복 제어 제거

| 안티패턴 | 원칙 | 적용 결과 |
|---------|------|-----------|
| `itemCount: number` prop 추가 | slot VNode 수로 파생 가능 | `itemCount` 제거 — render function에서 `useSlots().default()` VNode 수 자동 계산 |
| `isPlaying: boolean` prop 추가 | `prefers-reduced-motion` 감지로 자동 결정 | 별도 제어 prop 없음 — 접근성 미디어쿼리 결과로 내부 제어 |
| `wrapSlide: boolean` prop 추가 | slot VNode 타입으로 파생 가능 | `wrapSlide` 제거 — `vnode.type === SwiperSlide` 비교로 자동 판별 (하이브리드 방식) |

---

### 3. Variant 목록

Variant 없음 — 시각 외관은 slot 자식 요소가 결정한다. speed/spaceBetween prop으로 동작 특성만 조정한다.

---

### 4. 상태(State) 정의

| 상태 | 시각적 변화 | 기능적 변화 |
|------|-----------|-----------|
| 자동 스크롤 중 (default) | 슬라이드가 일정 속도로 좌측 이동 | rAF 루프 실행 중 |
| 드래그 중 (interacting) | 손가락/커서 위치에 따라 이동 | isInteracting=true, rAF tick이 translate 갱신 건너뜀 |
| 관성 이동 중 (momentum) | 릴리즈 후 Swiper FreeMode 관성으로 이동 | transitionEnd 또는 resumeDelay 타이머 대기 |
| 자동 스크롤 정지 (reduced-motion) | 슬라이드 정지 (시각 변화 없음, 드래그는 가능) | `prefers-reduced-motion: reduce` 감지 시 rAF 시작 안 함 |
| 언마운트 | — | rAF 취소, 타이머 정리, swiperInstance null |

---

### 5. 동작 규칙

**자동 스크롤 (rAF 루프)**

- 컴포넌트 마운트(onSwiper 콜백) 시점에 `requestAnimationFrame(tick)`으로 루프 시작
- `tick(now)`: `dt = Math.min(now - lastTime, 50)` 으로 탭 비활성 후 복귀 시 translate 점프를 방지. `sw.setTransition(0)` → `sw.setTranslate(sw.getTranslate() - speed * dt)` → `sw.updateActiveIndex()` → `sw.updateSlidesClasses()` → `sw.loopFix()` 순서로 실행
- `loopFix()`: 클론 슬라이드 영역 진입 시 translate를 원본 슬라이드 위치로 교정하여 끊김 없는 무한 루프 유지
- Swiper autoplay(delay:0) 대신 rAF를 사용하는 이유: Swiper autoplay는 transitionEnd 이벤트에 의존하므로 FreeMode 스와이프가 `setTransition(0)`으로 트랜지션을 끊으면 영구 정지됨. rAF는 매 프레임 직접 translate를 갱신하므로 드래그 후에도 자동 스크롤이 유지됨

**드래그 상호작용**

- `touchStart`: `isInteracting = true`, 진행 중인 resumeTimer 취소
- `touchEnd`: `sw.once('transitionEnd', resume)` 등록 + `setTimeout(resume, resumeDelay)` 동시 설정. 관성 transition이 있으면 transitionEnd로, 없으면(거의 정지 릴리즈) 타이머로 재개
- `resume()`: `isInteracting = false`, `lastTime = 0`(dt 재계산으로 점프 방지), `swiperInstance?.setTransition(0)`

**`prefers-reduced-motion` 자동 정지 (구현 필수 — WCAG 2.2.2)**

- `prefers-reduced-motion: reduce` 감지 시 rAF 자동 스크롤을 시작하지 않는다
- 드래그(FreeMode 스와이프) 동작은 그대로 유지
- 구현 방식은 publisher 자율 (예: `window.matchMedia('(prefers-reduced-motion: reduce)')` 초기 체크 후 rAF 시작 여부 결정, 또는 change 리스너로 동적 대응)
- spec이 규정하는 결과: "감지 시 rAF tick을 실행하지 않음"

**`$attrs` 위임 (full-bleed 지원)**

- `defineOptions({ inheritAttrs: false })` 선언 필수
- render function에서 `$attrs`를 Swiper 컴포넌트에 전달. class(wideScreen 등), data-*, event handler 모두 포함
- Marquee 자체는 `wideScreen` 클래스를 기본 적용하지 않음 — 사용처 레이아웃 결정에 위임

**loopAdditionalSlides 자동 계산**

- render function에서 `useSlots().default()` 호출 결과를 평탄화·필터링한 유효 슬라이드 수를 loopAdditionalSlides 값으로 사용 (하이브리드 래핑 후의 최종 slides 배열 길이)
- Fragment/주석 노드 등 실제 슬라이드가 아닌 VNode 정규화는 publisher 자율 처리

**slot VNode 하이브리드 래핑 + deep clone**

- render function에서 Fragment 평탄화 및 주석/공백 텍스트 필터링 후, 각 VNode에 대해 `vnode.type === SwiperSlide` 판별 수행
- `true`이면 → key 없는 경우에만 `cloneVNode(vnode, { key: idx })`로 key를 보강해 slides 배열에 추가 (재래핑 금지). 사용처가 SwiperSlide에 직접 `class`, `style` 등 props를 부여하거나, `:deep(.swiper-slide){ width: X }` 로 너비를 제어할 수 있다.
- `false`이면 → `h(SwiperSlide, { key, style: 'width: fit-content' }, { default: () => [deepCloneVNode(vnode)] })` 로 래핑. **자식을 동일 참조 그대로 전달하지 않고 `deepCloneVNode`로 복제한 독립 VNode를 전달한다.** `width: fit-content` 부여 방식(인라인 style vs class)은 publisher 자율이며, spec이 규정하는 동작 결과는 "자동 래핑 SwiperSlide가 안쪽 콘텐츠(div)의 폭을 따른다"는 것이다.
- 판별에 사용하는 `SwiperSlide`는 `import { SwiperSlide } from 'swiper/vue'` 로 가져온 동일한 컴포넌트 참조임. render function 내부에서 이미 import된 참조와의 동일성(`===`) 비교로 판별한다.

**deep clone 적용 배경 및 규칙 (BLOCKER — 생략 시 Vue 컴포넌트 자식이 빈 DOM으로 출력됨)**

- Swiper `loop: true` + `loopAdditionalSlides`는 슬라이드를 양쪽에 **loop copy**로 복제한다. Swiper는 실제 화면에 보이는 위치에 loop copy를 사용하고 원본을 뷰 밖으로 밀어낸다.
- `{ default: () => [vnode] }` 형태로 동일 VNode 객체 참조를 SwiperSlide slot에 그대로 전달하면, `<img>` 같은 네이티브 HTML 요소는 DOM 복제가 가능해 정상 렌더되지만, `<Tooltip>` 같은 Vue 컴포넌트 VNode는 싱글톤 구조라 동일 객체가 두 포지션에서 동시에 마운트될 수 없다 → loop copy 포지션에서 빈 DOM이 출력된다.
- `cloneVNode`는 shallow copy이므로 자식 트리에 Vue 컴포넌트가 포함된 경우에도 동일 참조가 재사용된다. 자식 트리를 재귀적으로 deep clone하는 `deepCloneVNode` 유틸을 적용해야 각 loop copy가 독립된 컴포넌트 인스턴스를 가질 수 있다.
- `deepCloneVNode` 구현 원칙: `cloneVNode(node)`로 자신을 복제하고, `node.children`이 배열이면 각 자식에 재귀 적용한다. 문자열·숫자 등 primitive children은 그대로 유지한다.

- **`slidesPerView: 'auto'` 동작 원칙**: 슬라이드 너비는 `.swiper-slide` DOM 요소 자체가 결정한다. 두 경로의 너비 제어 책임이 다르다:
  - **자동 래핑 경로**: 컴포넌트가 SwiperSlide에 `width: fit-content`를 부여하므로 사용처는 안쪽 div에 width만 지정하면 슬라이드 폭이 자동으로 따라온다. `:deep(.swiper-slide)` 로 너비를 재정의할 수도 있다.
  - **SwiperSlide 직접 경로**: 사용처가 SwiperSlide의 `style`/`class` prop 또는 `:deep(.swiper-slide){ width: X }` 로 슬라이드 너비를 직접 제어해야 한다. 컴포넌트는 너비에 개입하지 않는다.

**비반응 내부 변수 (ref 사용 금지)**

- `swiperInstance`, `rafId`, `lastTime`, `isInteracting`, `resumeTimer` — 전부 module-scope 또는 setup 클로저 변수로 선언. Vue 반응형 시스템 개입 불필요, ref 사용 시 불필요한 리렌더링 유발

**언마운트 정리 (필수)**

- `onBeforeUnmount`: `cancelAnimationFrame(rafId)`, `clearTimeout(resumeTimer)`, `swiperInstance = null`

**Swiper 하드코딩 설정 (변경 금지)**

- `modules=[FreeMode]`, `freeMode={ enabled:true, momentum:true, momentumRatio:0.4, momentumVelocityRatio:0.6 }`, `grabCursor=true`, `slidesPerView='auto'`, `loop=true`
- `spaceBetween`은 prop, `loopAdditionalSlides`는 VNode 수 자동 계산

**SSR 대응**

- `<ClientOnly>`로 Swiper 전체를 감싸 서버사이드 렌더링에서 Swiper가 실행되지 않도록 한다

---

### 6. 이벤트 목록

emit 없음 — 자동 스크롤/드래그는 컴포넌트 내부에서 완결. 외부 제어가 필요한 경우 slot 자식 요소에서 이벤트를 처리한다.

---

### 7. 접근성 요구사항

| 항목 | 조건 | 요구사항 |
|------|------|---------|
| 자동 움직임 정지 | `prefers-reduced-motion: reduce` 감지 시 | rAF 자동 스크롤 실행 안 함 (구현 필수 — WCAG 2.2.2) |
| 드래그 가능성 유지 | reduced-motion 환경 포함 항상 | 자동 스크롤 정지 시에도 사용자 드래그는 그대로 허용 |
| 키보드 탐색 | Swiper grabCursor 환경 | slot 자식에 포커스 가능 요소가 있으면 Tab 키로 접근 가능해야 함 — slot 자식 담당. SwiperSlide 직접 경로를 사용하는 경우에도 책임은 동일하게 slot 자식에 있음 |
| 대체 텍스트 | slot 자식에 이미지/아이콘 있을 때 | slot 자식 담당 (Marquee 자체 책임 아님) |
| 포커스 시 스크롤 방해 없음 | 항상 | rAF tick 중에도 slot 자식 요소의 포커스·클릭 이벤트를 차단하지 않음 |

---

### 8. 디자인 토큰 매핑

(Figma 인증 필요 — 추후 보강)

Marquee 자체의 시각 요소는 overflow:hidden과 width:100% 수준의 레이아웃 SCSS만 존재한다. 색상·타이포그래피·spacing 토큰 매핑 대상 없음. slot 자식 요소의 시각 토큰은 각 자식 컴포넌트(예: StoryCard) 명세에서 정의한다.

#### 8-1. Spacing / Layout 매핑

| Figma 시각값 | 사용 위치 | 매핑 토큰 / 처리 | 비고 |
|------------|---------|---------|------|
| 슬라이드 간격 (기본 12px) | spaceBetween prop 기본값 | `1.2rem` 직접 사용 (prop 기본값이므로 SCSS 대상 아님) | `$spacing-*` 토큰에 대응값 없음 |

#### 8-2. SCSS 최소 구조

```scss
$b: 'marquee';

.#{$b} {
  width: 100%;
  overflow: hidden;
}
```

> Swiper 내부 스타일은 Swiper CSS가 처리. Marquee 컴포넌트 SCSS는 레이아웃 래퍼 수준으로 최소화.

---

### 구현 복잡도 신호

- **Swiper 직접 사용** — `swiper/vue`의 `Swiper`, `SwiperSlide` 컴포넌트를 render function에서 `h()`로 호출. `rules/pages.md §3-1` swiper 예외에 따라 직접 import 허용. 사용처가 SwiperSlide 직접 경로를 사용할 때도 `import { SwiperSlide } from 'swiper/vue'` 가 필요하다.
- **`defineComponent` + render function 패턴** — `<script setup>` 불가 사유(slot VNode 직접 조작·타입 판별)를 코드 상단 주석으로 반드시 명시
- **비반응 변수 패턴** — rAF/타이머 관련 변수를 setup 클로저 내 일반 변수로 선언. `ref()` 사용 금지
- **`deepCloneVNode` 유틸 필수** — `cloneVNode`(Vue 내장)는 shallow copy이므로 Vue 컴포넌트를 자식으로 포함한 slot에는 충분하지 않다. render function 내 또는 동일 파일 module scope에 재귀 deep clone 유틸을 선언하고, 자동 래핑 경로의 slot 전달 시 반드시 적용한다.

---

### 사용 예시

#### 예시 1 — 자동 래핑 (기존 방식)

slot 자식이 일반 VNode이면 자동으로 SwiperSlide로 감싼다. 기존 사용처 그대로 동작한다.

```vue
<Marquee :speed="0.07" :space-between="12">
  <div v-for="item in items" :key="item.id" class="storyCard">
    ...
  </div>
</Marquee>
```

```scss
/* 사용처 섹션 SCSS — 안쪽 div에 width만 지정하면 슬라이드 폭이 자동으로 따라옴 */
.storyCard {
  width: 25rem;
  height: 25rem;
}
```

> **자동 래핑 경로의 너비 처리**: Marquee가 SwiperSlide에 `width: fit-content`를 부여하므로, 사용처는 안쪽 div(`.storyCard` 등)에 width를 주면 된다. `:deep(.swiper-slide)`로 너비를 재정의하는 방식도 여전히 동작한다.

#### 예시 2 — SwiperSlide 직접 경로 (신규 방식)

사용처가 SwiperSlide에 props(class, style 등)를 직접 부여하거나, 슬라이드 너비를 세밀하게 제어해야 할 때 사용한다.

```vue
<script setup lang="ts">
import { SwiperSlide } from 'swiper/vue'
// Marquee는 @nd/components/molecules에서 import
</script>

<template>
  <Marquee :speed="0.07" :space-between="12">
    <SwiperSlide v-for="item in items" :key="item.id">
      <div class="storyCard">...</div>
    </SwiperSlide>
  </Marquee>
</template>
```

```scss
/* 사용처 섹션 SCSS — .swiper-slide를 직접 타깃팅 */
:deep(.swiper-slide) {
  width: 25rem;
  height: 25rem;
}
```

> **주의**: SwiperSlide 직접 경로 사용 시 `import { SwiperSlide } from 'swiper/vue'` 를 사용처에서 별도로 import해야 한다. 직접 경로는 Marquee가 슬라이드 너비에 개입하지 않으므로 `.swiper-slide` 너비 지정은 사용처 `:deep` 또는 SwiperSlide `style`/`class` prop 책임이다. (자동 래핑 경로는 Marquee가 `fit-content`를 부여하므로 안쪽 div width만 주면 됨.)
