import { usePopupManager } from './usePopupManager';

export interface AlertConfig {
  title: string;
  message?: string;
  okLabel?: string;
  okColor?: 'secondary' | 'primary' | 'black';
  onClose?: () => void;
}

export function useAlert() {
  const { mount, unmount } = usePopupManager();

  function open(config: AlertConfig): void {
    if (import.meta.server) return;

    const id = crypto.randomUUID();

    mount({
      id,
      component: 'alert',
      props: {
        title: config.title,
        message: config.message,
        okLabel: config.okLabel ?? '확인',
        okColor: config.okColor,
        onClose: () => {
          unmount(id);
          config.onClose?.();
        },
      },
    });
  }

  return { open };
}
