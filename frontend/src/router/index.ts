import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProgramsView from '../views/ProgramsView.vue'
import ProvidersView from '../views/ProvidersView.vue'
import ProgramDetailsView from '../views/ProgramDetailsView.vue'
import ProviderDetailsView from '../views/ProviderDetailsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/programs',
      name: 'programs',
      component: ProgramsView,
    },
    {
      path: '/providers',
      name: 'providers',
      component: ProvidersView,
    },
    {
      path: '/programs/:id',
      name: 'program-details',
      component: ProgramDetailsView,
    },
    {
      path: '/providers/:id',
      name: 'provider-details',
      component: ProviderDetailsView,
    },
  ],
})

export default router
