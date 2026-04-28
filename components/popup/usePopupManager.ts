export interface PopupInstance {
  id: string
  component: 'alert' | 'confirm'
  props: Record<string, unknown>
}

export function usePopupManager() {
  // useState: SSR request-scoped — 모듈 최상위 reactive() 대신 사용하여 cross-request 메모리 공유 방지
  const instances = useState<PopupInstance[]>('popup-instances', () => [])

  function mount(instance: PopupInstance): void {
    instances.value.push(instance)
  }

  function unmount(id: string): void {
    const idx = instances.value.findIndex(i => i.id === id)
    if (idx !== -1) instances.value.splice(idx, 1)
  }

  return { instances: readonly(instances), mount, unmount }
}
