/**
 * ICAN Micro-App Main Export
 * Centralizes all exports for the ICAN micro-app
 */

// Components
export * from './components'

// Services  
export * from './services'

// Stores
export { useICANStore } from './stores'

// Types
export * from './types'

// Utils
export * from './utils'

// Version and metadata
export const ICAN_VERSION = '1.0.0'
export const ICAN_BUILD_DATE = new Date().toISOString()

// Micro-app configuration
export const ICAN_CONFIG = {
  name: 'ICAN',
  version: ICAN_VERSION,
  description: 'Integrated Corporate Administration Network',
  author: 'SmartDesignPro Team',
  buildDate: ICAN_BUILD_DATE,
  features: [
    'Dashboard Analytics',
    'Invoice Management', 
    'Receipt Tracking',
    'Member Authentication',
    'Settings Management',
    'Firebase Integration',
    'Mobile Responsive'
  ],
  routes: [
    '/ican',
    '/ican/dashboard',
    '/ican/invoice',
    '/ican/receipt',
    '/ican/login',
    '/ican/settings'
  ]
}

// Default export for easier importing
export default {
  ...ICAN_CONFIG,
  stores: {
    useICANStore: () => import('./stores').then(m => m.useICANStore)
  },
  components: {
    ICANHome: () => import('./components/ICANHome.vue'),
    ICANDashboard: () => import('./components/ICANDashboard.vue'),
    ICANInvoice: () => import('./components/ICANInvoice.vue'),
    ICANReceipt: () => import('./components/ICANReceipt.vue'),
    ICANMemberLogin: () => import('./components/ICANMemberLogin.vue'),
    ICANSettings: () => import('./components/ICANSettings.vue')
  }
}