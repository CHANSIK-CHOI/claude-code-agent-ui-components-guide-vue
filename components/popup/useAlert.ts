import { usePopupManager } from './usePopupManager'

export interface AlertConfig {
  title?: string
  message: string
  okLabel?: string
  onClose?: () => void
}

export function useAlert() {
  const { mount, unmount } = usePopupManager()

  function open(config: AlertConfig): void {
    if (import.meta.server) return

    const id = crypto.randomUUID()

    mount({
      id,
      component: 'alert',
      props: {
        id,
        title: config.title,
        message: config.message,
        okLabel: config.okLabel ?? '확인',
        onClose: () => {
          unmount(id)
          config.onClose?.()
        },
      },
    })
  }

  return { open }
}
