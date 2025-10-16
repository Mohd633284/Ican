import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import SignUp from '../pages/SignUp.vue';
import SettingsPage from '../pages/SettingsPage.vue';
import DashboardPage from '../pages/DashboardPage.vue';
import InvoicePage from '../pages/InvoicePage.vue';
import ReceiptPage from '../pages/ReceiptPage.vue';
import StatsPage from '../pages/StatsPage.vue';
import MemberLoginPage from '../pages/MemberLoginPage.vue';
import SplashScreen from '../pages/SplashScreen.vue';
import MemberManagementPage from '../pages/MemberManagementPage.vue';
import ReportsAnalyticsPage from '../pages/ReportsAnalyticsPage.vue';

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
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    props: (route) => ({ branch: route.query.branch || '' }),
  },
  {
    path: '/member-login',
    name: 'MemberLogin',
    component: MemberLoginPage,
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
    component: ReceiptPage,
    meta: { requiresMemberAuth: true }
  },
  {
    path: '/stats',
    name: 'Stats',
    component: StatsPage,
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
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const protectedRoutes = ['Dashboard', 'Invoice', 'Receipt', 'Stats', 'MemberManagement', 'Reports'];

router.beforeEach((to, from, next) => {
  // Check if route requires member authentication (for Invoice and Receipt)
  if (to.meta.requiresMemberAuth) {
    const authenticatedMember = localStorage.getItem('authenticatedMember');
    if (!authenticatedMember) {
      // Redirect to member login with target page info
      next({ 
        name: 'MemberLogin', 
        query: { 
          branch: to.query.branch || from.query.branch || '',
          page: to.name,
          returnUrl: to.fullPath
        } 
      });
      return;
    }
    // Verify member is authenticated before allowing access
    try {
      const memberData = JSON.parse(authenticatedMember);
      if (!memberData || !memberData.id || !memberData.name) {
        // Invalid member data, clear and redirect
        localStorage.removeItem('authenticatedMember');
        next({ 
          name: 'MemberLogin', 
          query: { 
            branch: to.query.branch || from.query.branch || '',
            page: to.name,
            returnUrl: to.fullPath
          } 
        });
        return;
      }
    } catch (error) {
      // Invalid JSON, clear and redirect
      localStorage.removeItem('authenticatedMember');
      next({ 
        name: 'MemberLogin', 
        query: { 
          branch: to.query.branch || from.query.branch || '',
          page: to.name,
          returnUrl: to.fullPath
        } 
      });
      return;
    }
  }

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
});

export default router;
