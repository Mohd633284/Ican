import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import SignUp from '../pages/SignUp.vue';
import SettingsPage from '../pages/SettingsPage.vue';
import DashboardPage from '../pages/DashboardPage.vue';
import InvoicePage from '../pages/InvoicePage.vue';
import StatsPage from '../pages/StatsPage.vue';

import SplashScreen from '../pages/SplashScreen.vue';
import MemberManagementPage from '../pages/MemberManagementPage.vue';
import ReportsAnalyticsPage from '../pages/ReportsAnalyticsPage.vue';
import SignaturePage from '../pages/SignaturePage.vue';

// Import saved pages with correct paths - updated paths for InvoiceIcan and ReceiptIcan subdirectories
// Use lazy loading for saved pages to avoid module resolution issues
// import SavedIcanInvoicesPage from '../pages/InvoiceIcan/SavedIcanInvoicesPage.vue';
// import SavedIcanReceiptsPage from '../pages/ReceiptIcan/SavedIcanReceiptsPage.vue';
import IcanReceipt from '../pages/ReceiptIcan/IcanReceipt.vue';

const routes = [
  {
    path: '/',
    name: 'Splash',
    component: SplashScreen,
  },
  {
    path: '/home',
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
    props: (route) => ({ branch: route.query.branch || '' }),
  },
  {
    path: '/ican-app/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    props: (route) => ({ branch: route.query.branch || '' }),
  },
  {
    path: '/invoice',
    name: 'Invoice',
    component: InvoicePage,
    meta: { requiresMemberAuth: true }
  },
  {
    path: '/receipt',
    name: 'Receipt',
    component: IcanReceipt,
    meta: { requiresMemberAuth: true }
  },
  {
    path: '/stats',
    name: 'Stats',
    component: StatsPage,
  },
  {
    path: '/ican-app/saved-invoices',
    name: 'SavedInvoices',
    component: () => import(/* webpackChunkName: "saved-invoices" */ '../pages/InvoiceIcan/SavedIcanInvoicesPage.vue'),
    props: (route) => ({ branch: route.query.branch || '' }),
  },
  {
    path: '/ican-app/saved-receipts',
    name: 'SavedReceipts', 
    component: () => import(/* webpackChunkName: "saved-receipts" */ '../pages/ReceiptIcan/SavedIcanReceiptsPage.vue'),
    props: (route) => ({ branch: route.query.branch || '' }),
  },
  {
    path: '/member-management',
    name: 'MemberManagement',
    component: MemberManagementPage,
  },
  {
    path: '/reports',
    name: 'Reports',
    component: ReportsAnalyticsPage,
    props: (route) => ({ branch: route.query.branch || '' }),
  },
  {
    path: '/signature',
    name: 'Signature',
    component: SignaturePage,
    meta: { requiresMemberAuth: true },
    props: (route) => ({ branch: route.query.branch || '' }),
  },
  // Catch-all route for handling 404s and unknown routes
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: { name: 'Home' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const protectedRoutes = ['Dashboard', 'Invoice', 'Receipt', 'Stats', 'MemberManagement', 'Reports', 'Signature', 'SavedInvoices', 'SavedReceipts'];

router.beforeEach((to, from, next) => {
  // Check if route requires basic branch access
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

export default router;
