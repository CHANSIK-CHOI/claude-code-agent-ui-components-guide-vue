import type { Ref } from 'vue';

interface PopupNavigateController {
  /** 이동 예약 경로. navigate() 호출 시 채워지고, 이동 완료 후 비워진다. */
  pendingPath: Ref<string | null>;
  /** 경로를 기억하고 팝업을 닫는다 (close 콜백 실행). 즉시 이동하지 않는다. */
  navigate: (path: string) => void;
  /** base 팝업의 @closed(닫힘 애니메이션 완료)에 연결. 예약 경로가 있으면 navigateTo 한다. */
  handleClosed: () => void;
}

/**
 * 팝업 컴포넌트 내부에서 "닫고 → 닫힘 완료 후 이동"을 처리하는 제어 hook.
 *
 * 팝업 내부에서는 `<NuxtLink>` 등 즉시 라우팅을 쓸 수 없다 (닫힘 애니메이션이 잘림 —
 * `rules/pages.md` §5-1). 이 hook 은 navigate(path) 로 경로를 기억하고 팝업을 닫은 뒤,
 * base 팝업의 `@closed`(애니메이션 완료) 시점에 handleClosed 가 navigateTo 를 호출한다.
 * hub(부모)는 `@navigate`/`@closed` 핸들러 없이 `v-model:open` 만 연결하면 된다.
 *
 * @param close 팝업을 닫는 콜백 — 보통 `() => emit('update:open', false)`
 *
 * @example
 * const { navigate, handleClosed } = usePopupNavigate(() => emit('update:open', false))
 * // <BottomSheet :open="open" @close="emit('update:open', false)" @closed="handleClosed">
 * //   <button @click="navigate('/cart')">장바구니 보기</button>
 *
 * @remarks
 * React 비교: 닫힘 애니메이션 완료를 감지하는 onTransitionEnd 안에서 router.push 를
 * 호출하되, 호출 여부를 ref(pendingPath)로 기억해 "X 버튼 단순 닫기"와 구분하는 패턴과 같다.
 */
export function usePopupNavigate(close: () => void): PopupNavigateController {
  const pendingPath = ref<string | null>(null);

  function navigate(path: string): void {
    pendingPath.value = path;
    close();
  }

  function handleClosed(): void {
    if (!pendingPath.value) return;
    const path = pendingPath.value;
    pendingPath.value = null;
    navigateTo(path);
  }

  return { pendingPath, navigate, handleClosed };
}
