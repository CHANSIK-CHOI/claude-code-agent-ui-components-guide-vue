export interface AlertPopupProps {
  title: string;
  message?: string;
  okLabel?: string;
  okColor?: "secondary" | "primary" | "black";
  onClose: () => void;
}

export interface ConfirmPopupProps {
  title: string;
  message?: string;
  okLabel?: string;
  okColor?: "secondary" | "primary" | "black";
  cancelLabel?: string;
  cancelColor?: "secondary" | "gray";
  onOk: () => void;
  onCancel: () => void;
}

export interface AlertPopupInstance {
  id: string;
  component: "alert";
  props: AlertPopupProps;
}

export interface ConfirmPopupInstance {
  id: string;
  component: "confirm";
  props: ConfirmPopupProps;
}

export type PopupInstance = AlertPopupInstance | ConfirmPopupInstance;

export function usePopupManager() {
  // useState: SSR request-scoped — 모듈 최상위 reactive() 대신 사용하여 cross-request 메모리 공유 방지
  const instances = useState<PopupInstance[]>("popup-instances", () => []);

  function mount(instance: PopupInstance): void {
    instances.value.push(instance);
  }

  function unmount(id: string): void {
    const idx = instances.value.findIndex((i) => i.id === id);
    if (idx !== -1) instances.value.splice(idx, 1);
  }

  // readonly(ref)는 vue-tsc가 DeepReadonly 추론에 실패해 `.value`가 `true | PopupInstance[]` 유니온으로
  // 잘못 좁혀진다(소비처 PopupRenderer에서 프로퍼티 접근 불가). computed로 노출하면 읽기 전용(외부 변경 방지)을
  // 유지하면서 ComputedRef<PopupInstance[]> 타입이 정확히 추론된다.
  const instancesReadonly = computed(() => instances.value);

  return { instances: instancesReadonly, mount, unmount };
}
