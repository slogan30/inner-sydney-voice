import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import ProgramsView from '../views/ProgramsView.vue'
import ProvidersView from '../views/ProvidersView.vue'
import ProgramDetailsView from '../views/ProgramDetailsView.vue'
import ProviderDetailsView from '../views/ProviderDetailsView.vue'
import ProgramsMapView from '../views/ProgramsMapView.vue'
import CalendarView from '../views/CalendarView.vue'
import ProgramApprovalDashboard from '../views/ProgramApprovalDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/programs',
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
      path: '/programs-map',
      name: 'programs-map',
      component: ProgramsMapView,
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView,
    },
    {
      path: '/approval',
      name: 'program-approval',
      component: ProgramApprovalDashboard,
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

// navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  await authStore.initializeAuth()

  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
