import { Picker, DatePicker, PickerGroup } from 'vant'
import 'vant/es/picker/style/index'
import 'vant/es/date-picker/style/index'
import 'vant/es/picker-group/style/index'
import '@vant/touch-emulator'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VanPicker', Picker)
  nuxtApp.vueApp.component('VanDatePicker', DatePicker)
  nuxtApp.vueApp.component('VanPickerGroup', PickerGroup)
})
