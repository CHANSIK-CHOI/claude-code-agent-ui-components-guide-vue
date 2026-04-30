export interface PopupInstance {
  id: string
  component: 'alert' | 'confirm'
  props: Record<string, unknown>
}

const instances = ref<PopupInstance[]>([])

export function usePopupManager() {
  function mount(instance: PopupInstance): void {
    instances.value.push(instance)
  }

  function unmount(id: string): void {
    const idx = instances.value.findIndex(i => i.id === id)
    if (idx !== -1) instances.value.splice(idx, 1)
  }

  return { instances: readonly(instances), mount, unmount }
}
