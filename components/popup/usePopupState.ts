import type { Ref } from 'vue'

interface PopupStateController {
  isOpen: Ref<boolean>
  open: () => void
  close: () => void
}

export function usePopupState(): PopupStateController {
  const isOpen = ref(false)
  return {
    isOpen,
    open: () => { isOpen.value = true },
    close: () => { isOpen.value = false },
  }
}
