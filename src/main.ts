import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Vue3Spline from 'vue3-spline'
import VueCookies from 'vue3-cookies'
// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { pl, zhHans } from 'vuetify/locale'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// notification
import Notifications from '@kyvg/vue3-notification'
const vuetify = createVuetify({
  components,
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
app.use(VueCookies)

app.mount('#app')
