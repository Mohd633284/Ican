<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton @click="goBack" fill="clear">
            <IonIcon :icon="arrowBack" />
          </IonButton>
        </IonButtons>
        <IonTitle>ICAN Dashboard</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent class="dashboard-content">
      <!-- Header Section -->
      <div class="dashboard-header">
        <div class="header-content">
          <div class="branch-badge">
            <div class="status-dot"></div>
            {{ branchTitle }} Branch Dashboard
          </div>
          <h1>Welcome to ICAN</h1>
          <p>Institute of Chartered Accountants of Nigeria - {{ branchTitle }} Branch Management Portal</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <IonSpinner name="circular" color="primary" />
        <p>Loading {{ branchTitle }} branch data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <IonIcon :icon="warningOutline" color="danger" />
        <p>{{ error }}</p>
        <IonButton @click="fetchBranchStats" fill="outline">Retry</IonButton>
      </div>

      <!-- Stats Grid -->
      <div v-else class="stats-section">
        <div class="stats-grid">
          <!-- Active Invoices -->
          <IonCard class="stat-card invoices-card">
            <IonCardContent>
              <div class="stat-content">
                <div class="stat-info">
                  <p class="stat-label">Active Invoices</p>
                  <p class="stat-value">{{ activeInvoices }}</p>
                </div>
                <div class="stat-icon invoices-icon">
                  <IonIcon :icon="document" />
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <!-- Monthly Revenue -->
          <IonCard class="stat-card revenue-card">
            <IonCardContent>
              <div class="stat-content">
                <div class="stat-info">
                  <p class="stat-label">Monthly Revenue</p>
                  <p class="stat-value">₦{{ monthlyRevenue }}</p>
                </div>
                <div class="stat-icon revenue-icon">
                  <span class="currency">₦</span>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <!-- Pending Tasks -->
          <IonCard class="stat-card tasks-card">
            <IonCardContent>
              <div class="stat-content">
                <div class="stat-info">
                  <p class="stat-label">Pending Tasks</p>
                  <p class="stat-value">{{ pendingTasks }}</p>
                </div>
                <div class="stat-icon tasks-icon">
                  <IonIcon :icon="timeOutline" />
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </div>

      <!-- Action Cards -->
      <div class="actions-section">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <!-- Create Invoice -->
          <IonCard class="action-card invoice-action" @click="handleCreateInvoice" button>
            <IonCardContent>
              <div class="action-header">
                <div class="auth-badge">
                  <IonIcon :icon="lockClosed" />
                  <span>Login Required</span>
                </div>
              </div>
              <div class="action-content">
                <div class="action-icon invoice-gradient">
                  <IonIcon :icon="document" />
                </div>
                <div class="action-info">
                  <h3>Create Invoice</h3>
                  <p>Generate professional invoices</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <!-- Create Receipt -->
          <IonCard class="action-card receipt-action" @click="handleCreateReceipt" button>
            <IonCardContent>
              <div class="action-header">
                <div class="auth-badge">
                  <IonIcon :icon="lockClosed" />
                  <span>Login Required</span>
                </div>
              </div>
              <div class="action-content">
                <div class="action-icon receipt-gradient">
                  <IonIcon :icon="receipt" />
                </div>
                <div class="action-info">
                  <h3>Create Receipt</h3>
                  <p>Issue payment receipts</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <!-- View Statistics -->
          <IonCard class="action-card stats-action" @click="handleViewStats" button>
            <IonCardContent>
              <div class="action-content">
                <div class="action-icon stats-gradient">
                  <IonIcon :icon="statsChart" />
                </div>
                <div class="action-info">
                  <h3>View Statistics</h3>
                  <p>Analyze branch performance</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <!-- Member Management -->
          <IonCard class="action-card member-action" @click="handleMemberManagement" button>
            <IonCardContent>
              <div class="action-content">
                <div class="action-icon member-gradient">
                  <IonIcon :icon="people" />
                </div>
                <div class="action-info">
                  <h3>Member Directory</h3>
                  <p>Manage branch members</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="activities-section" v-if="recentActivities.length > 0">
        <h2>Recent Activities</h2>
        <IonCard>
          <IonCardContent>
            <div class="activity-list">
              <div 
                v-for="activity in displayedActivities" 
                :key="activity.id" 
                class="activity-item"
              >
                <div class="activity-icon" :class="getActivityIconClass(activity.action)">
                  <IonIcon :icon="getActivityIcon(activity.action)" />
                </div>
                <div class="activity-info">
                  <p class="activity-title">{{ activity.action }}</p>
                  <p class="activity-details">
                    <span class="member-name">{{ activity.memberName }}</span>
                    <span class="separator">•</span>
                    <span>{{ activity.branch }} branch</span>
                  </p>
                </div>
                <span class="activity-time">{{ formatTimeAgo(activity.timestamp) }}</span>
              </div>
            </div>
          </IonCardContent>
        </IonCard>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonSpinner
} from '@ionic/vue';
import {
  arrowBack,
  people,
  document,
  receipt,
  timeOutline,
  statsChart,
  lockClosed,
  warningOutline,
  personAdd,
  businessOutline
} from 'ionicons/icons';

const router = useRouter();
const route = useRoute();

// State
const totalMembers = ref(0);
const activeInvoices = ref(0);
const monthlyRevenue = ref('0');
const pendingTasks = ref(0);
const loading = ref(true);
const error = ref<string | null>(null);
const recentActivities = ref<any[]>([]);
const showAllActivities = ref(false);

// Computed properties
const branchTitle = computed(() => {
  const branch = route.query.branch;
  return branch ? `${branch}` : 'Main';
});

const displayedActivities = computed(() => {
  return showAllActivities.value ? recentActivities.value : recentActivities.value.slice(0, 3);
});

// Methods
const goBack = () => {
  router.push('/ican/home');
};

const fetchBranchStats = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Simulate API call with mock data for now
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    totalMembers.value = 156;
    activeInvoices.value = 24;
    monthlyRevenue.value = '450,000';
    pendingTasks.value = 8;

    // Mock recent activities
    recentActivities.value = [
      {
        id: 1,
        action: 'Member Login',
        memberName: 'John Doe',
        branch: 'Lagos',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 min ago
      },
      {
        id: 2,
        action: 'Invoice Created',
        memberName: 'Jane Smith',
        branch: 'Abuja',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
      },
      {
        id: 3,
        action: 'Receipt Generated',
        memberName: 'Mike Johnson',
        branch: 'Port Harcourt',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
      }
    ];

  } catch (err) {
    console.error('Error fetching branch statistics:', err);
    error.value = 'Failed to load dashboard data';
  } finally {
    loading.value = false;
  }
};

const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffMs = now.getTime() - activityTime.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

const getActivityIconClass = (action: string) => {
  if (action.includes('Login')) return 'login-activity';
  if (action.includes('Invoice')) return 'invoice-activity';
  if (action.includes('Receipt')) return 'receipt-activity';
  return 'general-activity';
};

const getActivityIcon = (action: string) => {
  if (action.includes('Login')) return personAdd;
  if (action.includes('Invoice')) return document;
  if (action.includes('Receipt')) return receipt;
  return businessOutline;
};

// Navigation methods
const handleCreateInvoice = () => {
  router.push('/ican/invoice');
};

const handleCreateReceipt = () => {
  router.push('/ican/receipt');
};

const handleViewStats = () => {
  console.log('Navigate to stats');
};

const handleMemberManagement = () => {
  console.log('Navigate to member management');
};

// Lifecycle
onMounted(() => {
  fetchBranchStats();
});
</script>

<style scoped>
.dashboard-content {
  --background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.dashboard-header {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
}

.dashboard-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 20%, rgba(16,185,129,0.3) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(6,182,212,0.2) 0%, transparent 50%);
  pointer-events: none;
}

.header-content {
  text-align: center;
  position: relative;
}

.branch-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 16px;
  backdrop-filter: blur(10px);
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.header-content h1 {
  margin: 0 0 8px 0;
  font-size: 2rem;
  font-weight: bold;
}

.header-content p {
  margin: 0;
  opacity: 0.9;
  font-size: 1rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.loading-container p {
  color: var(--ion-color-medium);
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.error-container ion-icon {
  font-size: 3rem;
}

.stats-section {
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.stat-card {
  margin: 0;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.stat-info {
  flex: 1;
}

.stat-label {
  margin: 0 0 4px 0;
  font-size: 0.875rem;
  color: var(--ion-color-medium);
  font-weight: 500;
}

.stat-value {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
  color: var(--ion-color-dark);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.members-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.invoices-icon {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.revenue-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.tasks-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.currency {
  font-weight: bold;
  font-size: 1.5rem;
}

.stat-action {
  padding-top: 12px;
  border-top: 1px solid var(--ion-color-light);
}

.stat-action p {
  margin: 0;
  font-size: 0.75rem;
  color: #10b981;
  font-weight: 600;
}

.actions-section {
  padding: 0 20px 20px;
}

.actions-section h2 {
  margin-bottom: 16px;
  color: var(--ion-color-dark);
  font-size: 1.25rem;
  font-weight: 600;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.action-card {
  margin: 0;
  border-radius: 16px;
  transition: transform 0.2s ease;
}

.action-card:hover {
  transform: translateY(-2px);
}

.action-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

.auth-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
}

.action-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  transition: transform 0.2s ease;
}

.action-card:hover .action-icon {
  transform: scale(1.1);
}

.invoice-gradient {
  background: linear-gradient(135deg, #10b981, #059669);
}

.receipt-gradient {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.stats-gradient {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.member-gradient {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
}

.action-info h3 {
  margin: 0 0 4px 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.action-info p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--ion-color-medium);
}

.activities-section {
  padding: 0 20px 20px;
}

.activities-section h2 {
  margin-bottom: 16px;
  color: var(--ion-color-dark);
  font-size: 1.25rem;
  font-weight: 600;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--ion-color-light);
}

.activity-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.login-activity {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.invoice-activity {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.receipt-activity {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.general-activity {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.activity-info {
  flex: 1;
}

.activity-title {
  margin: 0 0 4px 0;
  font-weight: 600;
  color: var(--ion-color-dark);
  font-size: 0.875rem;
}

.activity-details {
  margin: 0;
  font-size: 0.75rem;
  color: var(--ion-color-medium);
}

.member-name {
  font-weight: 600;
  color: #10b981;
}

.separator {
  margin: 0 4px;
}

.activity-time {
  font-size: 0.75rem;
  color: var(--ion-color-medium);
  white-space: nowrap;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .stats-grid,
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>