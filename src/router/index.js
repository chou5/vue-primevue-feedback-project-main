// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

import Ideas from '../pages/Ideas.vue'
import Submit from '../pages/Submit.vue'
import Dashboard from '../pages/Dashboard.vue'
import StyleGuide from '../pages/StyleGuide.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },               // home => dashboard
    { path: '/ideas',      name: 'ideas',      component: Ideas,      meta: { title: 'Ideas' } },
    { path: '/submit',     name: 'submit',     component: Submit,     meta: { title: 'Submit' } },
    { path: '/dashboard',  name: 'dashboard',  component: Dashboard,  meta: { title: 'Dashboard' } },
    { path: '/style',      name: 'style',      component: StyleGuide, meta: { title: 'Style' } },
  ],
})

export default router
