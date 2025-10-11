import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
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

export default router;
