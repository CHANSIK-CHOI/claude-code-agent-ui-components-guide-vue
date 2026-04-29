import { usePopupManager } from './usePopupManager'

export interface ConfirmConfig {
  title?: string
  message: string
  okLabel?: string
  cancelLabel?: string
}

interface ConfirmCallbackConfig extends ConfirmConfig {
  onOk: () => void
  onCancel?: () => void
}

export function useConfirm() {
  const { mount, unmount } = usePopupManager()

  // 오버로드: 구체적인 시그니처 먼저 (TypeScript 위에서 아래로 매칭)
  function open(config: ConfirmCallbackConfig): void
  function open(config: ConfirmConfig): Promise<boolean>
  function open(config: ConfirmConfig | ConfirmCallbackConfig): Promise<boolean> | void {
    if (import.meta.server) return

    const id = crypto.randomUUID()

    if ('onOk' in config) {
      mount({
        id,
        component: 'confirm',
        props: {
          id,
          title: config.title,
          message: config.message,
          okLabel: config.okLabel ?? '확인',
          cancelLabel: config.cancelLabel ?? '취소',
          onOk: () => {
            unmount(id)
            config.onOk()
          },
          onCancel: () => {
            unmount(id)
            config.onCancel?.()
          },
        },
      })
      return
    }

    return new Promise<boolean>((resolve) => {
      mount({
        id,
        component: 'confirm',
        props: {
          id,
          title: config.title,
          message: config.message,
          okLabel: config.okLabel ?? '확인',
          cancelLabel: config.cancelLabel ?? '취소',
          onOk: () => {
            unmount(id)
            resolve(true)
          },
          onCancel: () => {
            unmount(id)
            resolve(false)
          },
        },
      })
    })
  }

  return { open }
}
