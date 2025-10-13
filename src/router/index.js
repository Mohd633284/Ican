import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import SignUp from '../pages/SignUp.vue';
import SettingsPage from '../pages/SettingsPage.vue';
import DashboardPage from '../pages/DashboardPage.vue';
import InvoicePage from '../pages/InvoicePage.vue';
import ReceiptPage from '../pages/ReceiptPage.vue';
import StatsPage from '../pages/StatsPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsPage,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    props: (route) => ({ branch: route.query.branch || '' }),
  },
  {
    path: '/invoice',
    name: 'Invoice',
    component: InvoicePage,
  },
  {
    path: '/receipt',
    name: 'Receipt',
    component: ReceiptPage,
  },
  {
    path: '/stats',
    name: 'Stats',
    component: StatsPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const protectedRoutes = ['Dashboard', 'Invoice', 'Receipt', 'Settings', 'Stats'];

router.beforeEach((to, from, next) => {
  if (protectedRoutes.includes(to.name)) {
    const user = localStorage.getItem('user');
    if (!user) {
      next({ name: 'Home' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
