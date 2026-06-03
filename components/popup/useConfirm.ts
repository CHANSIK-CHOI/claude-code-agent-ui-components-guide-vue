import { usePopupManager } from './usePopupManager';

export interface ConfirmConfig {
  title: string;
  message?: string;
  okLabel?: string;
  okColor?: 'secondary' | 'primary' | 'black';
  cancelLabel?: string;
  cancelColor?: 'secondary' | 'gray';
}

interface ConfirmCallbackConfig extends ConfirmConfig {
  onOk: () => void;
  onCancel?: () => void;
}

export function useConfirm() {
  const { mount, unmount } = usePopupManager();

  // Overloads: put the more specific callback signature first.
  function open(config: ConfirmCallbackConfig): void;
  function open(config: ConfirmConfig): Promise<boolean>;
  function open(config: ConfirmConfig | ConfirmCallbackConfig): Promise<boolean> | void {
    if (import.meta.server) return;

    const id = crypto.randomUUID();

    if ('onOk' in config) {
      mount({
        id,
        component: 'confirm',
        props: {
          title: config.title,
          message: config.message,
          okLabel: config.okLabel ?? '확인',
          okColor: config.okColor,
          cancelLabel: config.cancelLabel ?? '취소',
          cancelColor: config.cancelColor,
          onOk: () => {
            unmount(id);
            config.onOk();
          },
          onCancel: () => {
            unmount(id);
            config.onCancel?.();
          },
        },
      });
      return;
    }

    return new Promise<boolean>((resolve) => {
      mount({
        id,
        component: 'confirm',
        props: {
          title: config.title,
          message: config.message,
          okLabel: config.okLabel ?? '확인',
          okColor: config.okColor,
          cancelLabel: config.cancelLabel ?? '취소',
          cancelColor: config.cancelColor,
          onOk: () => {
            unmount(id);
            resolve(true);
          },
          onCancel: () => {
            unmount(id);
            resolve(false);
          },
        },
      });
    });
  }

  return { open };
}
