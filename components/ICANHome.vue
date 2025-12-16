<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton @click="goBack" fill="clear">
            <IonIcon :icon="arrowBack" />
          </IonButton>
        </IonButtons>
        <IonTitle>ICAN Portal</IonTitle>
        <IonButtons slot="end">
          <IonButton @click="openSettings" fill="clear">
            <IonIcon :icon="settings" />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <!-- Welcome Header -->
      <div class="welcome-section">
        <div class="welcome-header">
          <h1>Welcome to ICAN</h1>
          <p>Institute of Chartered Accountants Management System</p>
        </div>
      </div>

      <!-- Quick Actions Grid -->
      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <IonCard 
            v-for="action in quickActions" 
            :key="action.id"
            @click="navigateTo(action.route)"
            class="action-card"
            button
          >
            <IonCardContent>
              <div class="action-icon">
                <IonIcon :icon="action.icon" />
              </div>
              <div class="action-info">
                <h3>{{ action.title }}</h3>
                <p>{{ action.description }}</p>
              </div>
              <IonIcon :icon="chevronForward" class="nav-arrow" />
            </IonCardContent>
          </IonCard>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="recent-section">
        <h2>Recent Activities</h2>
        <IonCard>
          <IonCardContent>
            <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
              <div class="activity-icon">
                <IonIcon :icon="activity.icon" />
              </div>
              <div class="activity-info">
                <h4>{{ activity.title }}</h4>
                <p>{{ activity.description }}</p>
                <small>{{ activity.time }}</small>
              </div>
            </div>
          </IonCardContent>
        </IonCard>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
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
  IonCardContent
} from '@ionic/vue';
import {
  arrowBack,
  settings,
  chevronForward,
  document,
  receipt,
  people,
  statsChart,
  person,
  notifications
} from 'ionicons/icons';

const router = useRouter();

const quickActions = ref([
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'View overview and statistics',
    route: '/ican/dashboard',
    icon: statsChart
  },
  {
    id: 'invoice',
    title: 'Invoice Management',
    description: 'Create and manage invoices',
    route: '/ican/invoice',
    icon: document
  },
  {
    id: 'receipt',
    title: 'Receipt Management',
    description: 'Handle receipts and payments',
    route: '/ican/receipt',
    icon: receipt
  }
]);

const recentActivities = ref([
  {
    id: 1,
    title: 'New Invoice Created',
    description: 'Invoice #INV-2024-001 created for Client ABC',
    time: '2 hours ago',
    icon: document
  },
  {
    id: 2,
    title: 'Payment Received',
    description: 'Payment received for Invoice #INV-2024-001',
    time: '1 day ago',
    icon: receipt
  },
  {
    id: 3,
    title: 'New Member Registration',
    description: 'John Doe registered as new member',
    time: '2 days ago',
    icon: person
  }
]);

const goBack = () => {
  router.push('/home');
};

const openSettings = () => {
  router.push('/ican/settings');
};

const navigateTo = (route: string) => {
  router.push(route);
};
</script>

<style scoped>
.welcome-section {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.welcome-header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
}

.welcome-header p {
  margin: 8px 0 0 0;
  opacity: 0.9;
}

.quick-actions {
  padding: 20px;
}

.quick-actions h2 {
  margin-bottom: 16px;
  color: #333;
}

.actions-grid {
  display: grid;
  gap: 16px;
}

.action-card {
  margin: 0;
  transition: transform 0.2s ease;
}

.action-card:hover {
  transform: translateY(-2px);
}

.action-card ion-card-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
}

.action-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon ion-icon {
  font-size: 24px;
  color: white;
}

.action-info {
  flex: 1;
}

.action-info h3 {
  margin: 0 0 4px 0;
  font-weight: 600;
  color: #333;
}

.action-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.nav-arrow {
  color: #999;
  font-size: 20px;
}

.recent-section {
  padding: 0 20px 20px;
}

.recent-section h2 {
  margin-bottom: 16px;
  color: #333;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon ion-icon {
  font-size: 20px;
  color: #667eea;
}

.activity-info h4 {
  margin: 0 0 4px 0;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.activity-info p {
  margin: 0 0 4px 0;
  color: #666;
  font-size: 0.8rem;
}

.activity-info small {
  color: #999;
  font-size: 0.75rem;
}
</style>