// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'


// PrimeVue core + services
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'


// PrimeVue base styles
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'


// Theme switching via Vite ?url asset imports (light/dark)
import lightThemeUrl from 'primevue/resources/themes/lara-light-blue/theme.css?url'
import darkThemeUrl from 'primevue/resources/themes/lara-dark-blue/theme.css?url'
import 'primevue/resources/primevue.min.css'


// Simple theme manager (no extra deps)
export const theme = (() => {
const THEME_KEY = 'pv-theme'
const getPref = () => localStorage.getItem(THEME_KEY) || 'light'
const setPref = (v) => localStorage.setItem(THEME_KEY, v)
const ensureLink = () => {
let link = document.getElementById('theme-css')
if (!link) {
link = document.createElement('link')
link.id = 'theme-css'
link.rel = 'stylesheet'
document.head.appendChild(link)
}
return link
}
const apply = (mode) => {
const href = mode === 'dark' ? darkThemeUrl : lightThemeUrl
const link = ensureLink()
if (link.getAttribute('href') !== href) link.setAttribute('href', href)
document.documentElement.dataset.theme = mode
}
const init = () => apply(getPref())
const toggle = () => {
const next = getPref() === 'dark' ? 'light' : 'dark'
setPref(next); apply(next)
return next
}
const set = (v) => { setPref(v); apply(v) }
init()
return { get: getPref, set, toggle }
})()


createApp(App)
.use(createPinia())
.use(router)
.use(PrimeVue, { ripple: true })
.use(ToastService)
.use(ConfirmationService)
.mount('#app')