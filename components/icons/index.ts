import type { Component } from 'vue'
import { defineComponent, h } from 'vue'
import Icon from './Icon.vue'
import type { IconSize } from '~/components/types'

// --- SVG imports (일반 — currentColor 자동 변환) ---
// @ts-ignore — vite-svg-loader ?component 모듈은 런타임에 정상 동작
import CloseSvg from '~/assets/icons/close.svg?component'
// @ts-ignore
import SearchSvg from '~/assets/icons/search.svg?component'
// @ts-ignore
import UserSvg from '~/assets/icons/user.svg?component'
// @ts-ignore
import ChevronLeftSvg from '~/assets/icons/chevronLeft.svg?component'
// @ts-ignore
import ChevronRightSvg from '~/assets/icons/chevronRight.svg?component'
// @ts-ignore
import CategorySvg from '~/assets/icons/category.svg?component'
// @ts-ignore
import HomeSvg from '~/assets/icons/home.svg?component'
// @ts-ignore
import LogoutSvg from '~/assets/icons/logout.svg?component'
// @ts-ignore
import CalenderSvg from '~/assets/icons/calender.svg?component'
// @ts-ignore
import PlusSvg from '~/assets/icons/plus.svg?component'
// @ts-ignore
import DeleteSvg from '~/assets/icons/delete.svg?component'
// @ts-ignore
import TimeSvg from '~/assets/icons/time.svg?component'
// --- SVG imports (skipsvgo — 색상 고정) ---
// nuxt-svgo defaultImport:'component'가 적용되므로 ?skipsvgo 만으로 충분
// @ts-ignore
import LeftSvg from '~/assets/icons/left.svg?skipsvgo'
// @ts-ignore
import RightSvg from '~/assets/icons/right.svg?skipsvgo'
// @ts-ignore
import PlaySvg from '~/assets/icons/play.svg?skipsvgo'
// @ts-ignore
import GridSvg from '~/assets/icons/grid.svg?skipsvgo'
// @ts-ignore
import ListSvg from '~/assets/icons/list.svg?skipsvgo'
// @ts-ignore
import HeartFullSvg from '~/assets/icons/heartFull.svg?skipsvgo'
// @ts-ignore
import HeartSvg from '~/assets/icons/heart.svg?skipsvgo'
// @ts-ignore
import CartSvg from '~/assets/icons/cart.svg?skipsvgo'
// @ts-ignore
import TooltipSvg from '~/assets/icons/tooltip.svg?skipsvgo'
// @ts-ignore
import CircularNoteSvg from '~/assets/icons/circularNote.svg?skipsvgo'
// @ts-ignore
import DocumentSvg from '~/assets/icons/document.svg?skipsvgo'
// @ts-ignore
import BigCircularNoteIconSvg from '~/assets/icons/bigCircularNoteIcon.svg?skipsvgo'

// --- SVG imports (sm — 16px / 일반 — currentColor 자동 변환) ---
// @ts-ignore
import SmallChevronDownSvg from '~/assets/icons/smallChevronDown.svg?component'
// @ts-ignore
import SmallChevronUpSvg from '~/assets/icons/smallChevronUp.svg?component'
// @ts-ignore
import SmallChevronLeftSvg from '~/assets/icons/smallChevronLeft.svg?component'
// @ts-ignore
import SmallChevronRightSvg from '~/assets/icons/smallChevronRight.svg?component'
// @ts-ignore
import SmallPlusSvg from '~/assets/icons/smallPlus.svg?component'
// @ts-ignore
import SmallCloseSvg from '~/assets/icons/smallClose.svg?component'
// @ts-ignore
import SmallBagSvg from '~/assets/icons/smallBag.svg?component'
// @ts-ignore
import SmallGreatSvg from '~/assets/icons/smallGreat.svg?component'

// --- SVG imports (sm — 16px / skipsvgo — 색상 고정) ---
// @ts-ignore
import CircularArrowSvg from '~/assets/icons/circularArrow.svg?skipsvgo'

// ---------------------------------------------------------------------------
// makeIcon — SVG 파일 컴포넌트 방식
// vite-svg-loader로 import한 SVG 컴포넌트를 받아 Icon 래퍼에 slot으로 렌더한다.
// ---------------------------------------------------------------------------
function makeIcon(name: string, defaultSize: IconSize, SvgComponent: Component) {
  return defineComponent({
    name,
    props: {
      size: { type: String as () => IconSize, default: defaultSize },
      color: { type: String, default: undefined },
      label: { type: String, default: undefined },
    },
    setup(props) {
      return () =>
        h(
          Icon,
          { size: props.size, color: props.color, label: props.label },
          () => h(SvgComponent),
        )
    },
  })
}

// ---------------------------------------------------------------------------
// 일반 아이콘 (currentColor 자동 변환)
// ---------------------------------------------------------------------------
export const CloseIcon = makeIcon('CloseIcon', 'md', CloseSvg as Component)
export const SearchIcon = makeIcon('SearchIcon', 'md', SearchSvg as Component)
export const UserIcon = makeIcon('UserIcon', 'md', UserSvg as Component)
export const ChevronLeftIcon = makeIcon('ChevronLeftIcon', 'md', ChevronLeftSvg as Component)
export const ChevronRightIcon = makeIcon('ChevronRightIcon', 'md', ChevronRightSvg as Component)
export const CategoryIcon = makeIcon('CategoryIcon', 'md', CategorySvg as Component)
export const HomeIcon = makeIcon('HomeIcon', 'md', HomeSvg as Component)
export const LogoutIcon = makeIcon('LogoutIcon', 'md', LogoutSvg as Component)
export const CalenderIcon = makeIcon('CalenderIcon', 'md', CalenderSvg as Component)
export const PlusIcon = makeIcon('PlusIcon', 'md', PlusSvg as Component)
export const DeleteIcon = makeIcon('DeleteIcon', 'md', DeleteSvg as Component)
export const TimeIcon = makeIcon('TimeIcon', 'md', TimeSvg as Component)
// ---------------------------------------------------------------------------
// 색상 고정 아이콘 (skipsvgo — SVGO 색상 변환 건너뜀)
// ---------------------------------------------------------------------------
export const LeftIcon = makeIcon('LeftIcon', 'md', LeftSvg as Component)
export const RightIcon = makeIcon('RightIcon', 'md', RightSvg as Component)
export const PlayIcon = makeIcon('PlayIcon', 'md', PlaySvg as Component)
export const GridIcon = makeIcon('GridIcon', 'md', GridSvg as Component)
export const ListIcon = makeIcon('ListIcon', 'md', ListSvg as Component)
export const HeartFullIcon = makeIcon('HeartFullIcon', 'md', HeartFullSvg as Component)
export const HeartIcon = makeIcon('HeartIcon', 'md', HeartSvg as Component)
export const TooltipIcon = makeIcon('TooltipIcon', 'sm', TooltipSvg as Component)
export const CircularNoteIcon = makeIcon('CircularNoteIcon', 'sm', CircularNoteSvg as Component)

// ---------------------------------------------------------------------------
// 색상 고정 아이콘 — lg (40px, skipsvgo)
// ---------------------------------------------------------------------------
export const DocumentIcon = makeIcon('DocumentIcon', 'lg', DocumentSvg as Component)
export const BigCircularNoteIcon = makeIcon('BigCircularNoteIcon', 'lg', BigCircularNoteIconSvg as Component)

// ---------------------------------------------------------------------------
// 일반 아이콘 — sm (16px, currentColor 자동 변환)
// ---------------------------------------------------------------------------
export const SmallChevronDownIcon = makeIcon('SmallChevronDownIcon', 'sm', SmallChevronDownSvg as Component)
export const SmallChevronUpIcon = makeIcon('SmallChevronUpIcon', 'sm', SmallChevronUpSvg as Component)
export const SmallChevronLeftIcon = makeIcon('SmallChevronLeftIcon', 'sm', SmallChevronLeftSvg as Component)
export const SmallChevronRightIcon = makeIcon('SmallChevronRightIcon', 'sm', SmallChevronRightSvg as Component)
export const SmallPlusIcon = makeIcon('SmallPlusIcon', 'sm', SmallPlusSvg as Component)
export const SmallCloseIcon = makeIcon('SmallCloseIcon', 'sm', SmallCloseSvg as Component)
export const SmallBagIcon = makeIcon('SmallBagIcon', 'sm', SmallBagSvg as Component)
export const SmallGreatIcon = makeIcon('SmallGreatIcon', 'sm', SmallGreatSvg as Component)
// ---------------------------------------------------------------------------
// 색상 고정 아이콘 — sm (16px, skipsvgo)
// ---------------------------------------------------------------------------
export const CircularArrowIcon = makeIcon('CircularArrowIcon', 'sm', CircularArrowSvg as Component)

// ---------------------------------------------------------------------------
// CartIcon — 배지(count) 처리를 위해 별도 defineComponent로 정의
// ---------------------------------------------------------------------------
export const CartIcon = defineComponent({
  name: 'CartIcon',
  props: {
    size: { type: String as () => IconSize, default: 'md' as IconSize },
    color: { type: String, default: undefined },
    label: { type: String, default: undefined },
    count: { type: Number, default: undefined },
  },
  setup(props) {
    return () => {
      const hasCount = typeof props.count === 'number' && props.count > 0
      const ariaLabel = hasCount ? `장바구니 ${props.count}개` : props.label
      const role = hasCount || props.label ? 'img' : undefined
      const ariaHidden = ariaLabel ? undefined : ('true' as const)

      return h(
        'span',
        {
          class: 'cartIcon',
          'aria-label': ariaLabel,
          'aria-hidden': ariaHidden,
          role,
        },
        [
          h(Icon, { size: props.size, color: props.color }, () =>
            h(CartSvg as Component),
          ),
          hasCount
            ? h(
                'span',
                { class: 'cartIcon__badge' },
                props.count! > 99 ? '99+' : String(props.count),
              )
            : null,
        ],
      )
    }
  },
})
