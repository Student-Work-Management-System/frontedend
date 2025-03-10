import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Vue3Spline from 'vue3-spline'
// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { pl, zhHans } from 'vuetify/locale'
import * as components from 'vuetify/components'
import * as labComponents from "vuetify/labs/components";
import * as directives from 'vuetify/directives'
// element-plus
import ElementPlus from 'element-plus'
import zhLocale from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
// notification
import Notifications from '@kyvg/vue3-notification'
import VueExcelEditor from 'vue3-excel-editor'

const vuetify = createVuetify({
  components: {
    ...components,
    ...labComponents
  },
  directives,
  locale: {
    locale: 'zhHans',
    fallback: 'sv',
    messages: { zhHans, pl }
  },
  icons: {
    defaultSet: 'mdi' // This is already the default value - only for display purposes
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(Vue3Spline)
app.use(Notifications)
app.use(ElementPlus, {
  locale: zhLocale
})
app.use(VueExcelEditor)

app.mount('#app')
