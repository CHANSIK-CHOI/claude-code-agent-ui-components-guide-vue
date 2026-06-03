// 모듈 레벨 싱글톤 — Toast는 CSR 전용이므로 useState 대신 ref 사용
// (usePopupManager의 SSR 고려 useState와 다름)
import { ref, markRaw } from 'vue'
import type { Component } from 'vue'

export interface ToastItem {
  id: string
  open: boolean
  message: string
  duration?: number
  showClose?: boolean
  showIcon?: boolean
  type?: 'foreground' | 'background'
  forceMount?: boolean
  iconComponent?: Component | null
  onClosed?: () => void
}

const instances = ref<ToastItem[]>([])
// 타이머 맵: id → setTimeout 핸들
// Radix Vue ToastRoot는 pauseOnHover 비활성화 prop이 없으므로
// Radix duration 의존 대신 여기서 직접 setTimeout으로 타이머를 관리한다.
const timers = new Map<string, ReturnType<typeof setTimeout>>()

export function useToastPopup() {
  function open(options: Omit<ToastItem, 'id' | 'open'>): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
    instances.value.push({
      ...options,
      id,
      open: true,
      iconComponent: options.iconComponent ? markRaw(options.iconComponent) : options.iconComponent,
    })

    // duration이 0이면 수동 닫기 전용 — 타이머 미등록
    const ms = options.duration ?? 3000
    if (ms > 0) {
      const timer = setTimeout(() => close(id), ms)
      timers.set(id, timer)
    }

    return id
  }

  function remove(id: string): void {
    instances.value = instances.value.filter(t => t.id !== id)
    const timer = timers.get(id)
    if (timer !== undefined) clearTimeout(timer)
    timers.delete(id)
  }

  function close(id: string): void {
    const toast = instances.value.find(t => t.id === id)
    if (toast) toast.open = false
    const timer = timers.get(id)
    if (timer !== undefined) {
      clearTimeout(timer)
      timers.delete(id)
    }
  }

  return { instances, open, remove, close }
}
