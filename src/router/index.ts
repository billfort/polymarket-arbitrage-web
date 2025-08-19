import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/trades', name: 'trades', component: () => import('../views/Trades.vue') },
    { path: '/prices', name: 'prices', component: () => import('../views/Prices.vue') },
    { path: '/positions', name: 'positions', component: () => import('../views/Positions.vue') },
    { path: '/policy-param', name: 'policy-param', component: () => import('../views/PolicyParam.vue') },
    { path: '/asset-values', name: 'asset-values', component: () => import('../views/AssetValues.vue') },
  ],
})

export default router
