import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/trades', name: 'trades', component: () => import('../views/Trades.vue') },
    { path: '/positions', name: 'positions', component: () => import('../views/Positions.vue') },
  ],
})

export default router
