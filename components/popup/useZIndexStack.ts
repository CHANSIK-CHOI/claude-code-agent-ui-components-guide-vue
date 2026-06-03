// 팝업 z-index 스택 관리 — 여러 팝업이 동시에 열릴 때 "띄워진 순서"로 쌓이게 한다.
//
// 배경: 모든 콘텐츠 팝업(layer/bottomSheet/full)과 alert/confirm 은 #popup-container 안에
// teleport 되며 SCSS 상 동일한 z-index($z-modal)를 가졌다. 그래서 겹쳐 열리면 z-index 가 아니라
// DOM append 순서(마운트 타이밍)로만 위아래가 결정돼, "나중에 연 팝업이 위"가 보장되지 않았다.
//
// 해결: 팝업이 열릴 때 이 스택에 등록하고, 같은 그룹 안에서 자기 위치(index)만큼 z-index 를 올린다.
// #popup-container 는 transform 으로 독립 stacking context 를 형성하므로, 여기서 매기는 z-index 는
// 그 컨테이너 내부에서만 경쟁한다 → 값을 키워도 별도 컨테이너인 #toast-container($z-toast) 를 넘지 못한다.
// 따라서 토큰을 건드리지 않고 컨테이너 내부 상대값(작은 정수)만으로 안전하게 계층을 만든다.
//
// 그룹 계층 (낮을수록 아래):
//   content (layer/bottomSheet/full) < system (alert/confirm)   < [toast — 별도 컨테이너로 항상 최상단]

export type ZIndexGroup = 'content' | 'system';

// 그룹별 base offset — system 은 content 보다 항상 위에 오도록 큰 간격을 둔다.
// (실제 적용 z-index = BASE + 그룹 내 열린 순서 index. #popup-container 내부 상대값이라 작은 수로 충분)
const Z_GROUP_BASE: Record<ZIndexGroup, number> = {
  content: 0,
  system: 1000,
};

interface ZStackEntry {
  id: string;
  group: ZIndexGroup;
}

// 인스턴스 식별용 카운터. id 는 유니크성만 필요하고 팝업 열림은 클라이언트 인터랙션이므로
// (서버 렌더 시 open=false 가 기본) cross-request 증가는 실질 문제가 없다. Symbol 대신 string 을 써
// useState 직렬화 문제도 피한다.
let _idCounter = 0;

export function useZIndexStack(group: ZIndexGroup) {
  // useState: SSR request-scoped — 모듈 최상위 reactive 대신 사용해 cross-request 메모리 공유 방지.
  const stack = useState<ZStackEntry[]>('popup-zindex-stack', () => []);
  const id = `z-${(_idCounter += 1)}`;

  // 같은 그룹 안에서 자기 위치 index 만큼 base 에 더한다. 스택에 없으면(닫힘) undefined →
  // inline style 미적용 → SCSS 의 z-index 가 fallback 으로 동작.
  const zIndex = computed<number | undefined>(() => {
    const pos = stack.value.filter((e) => e.group === group).findIndex((e) => e.id === id);
    if (pos === -1) return undefined;
    return Z_GROUP_BASE[group] + pos;
  });

  function activate(): void {
    if (stack.value.some((e) => e.id === id)) return;
    stack.value.push({ id, group });
  }

  function deactivate(): void {
    const idx = stack.value.findIndex((e) => e.id === id);
    if (idx !== -1) stack.value.splice(idx, 1);
  }

  // 닫힘 애니메이션 도중 언마운트되는 경우를 대비한 백업 정리.
  onUnmounted(deactivate);

  return { zIndex, activate, deactivate };
}
