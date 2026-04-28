import type { ButtonShape, ButtonColor, ButtonSize } from '@nd/components/types'

interface ButtonVariantProps {
  shape: ButtonShape
  color: ButtonColor
  size: ButtonSize
  round: boolean
  disabled: boolean
}

export function useButtonVariant(block: string, props: ButtonVariantProps) {
  return computed(() => [
    `${block}--${props.shape}`,
    `${block}--${props.color}`,
    `${block}--${props.size}`,
    { [`${block}--round`]: props.round && props.shape !== 'text' },
    { [`${block}--disabled`]: props.disabled },
  ])
}
