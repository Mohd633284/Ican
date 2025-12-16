<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton @click="goBack" fill="clear">
            <IonIcon :icon="arrowBack" />
          </IonButton>
        </IonButtons>
        <IonTitle>Invoice Management</IonTitle>
        <IonButtons slot="end">
          <IonButton @click="createNewInvoice" fill="clear">
            <IonIcon :icon="add" />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <!-- Header Section -->
      <div class="page-header">
        <h1>Invoice Management</h1>
        <p>Create and manage professional invoices</p>
      </div>

      <!-- Action Cards -->
      <div class="actions-section">
        <IonCard class="action-card" @click="createNewInvoice" button>
          <IonCardContent>
            <div class="action-content">
              <div class="action-icon create-icon">
                <IonIcon :icon="addCircle" />
              </div>
              <div class="action-info">
                <h3>Create New Invoice</h3>
                <p>Generate a professional invoice</p>
              </div>
              <IonIcon :icon="chevronForward" class="nav-arrow" />
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard class="action-card" @click="viewTemplates" button>
          <IonCardContent>
            <div class="action-content">
              <div class="action-icon template-icon">
                <IonIcon :icon="document" />
              </div>
              <div class="action-info">
                <h3>Invoice Templates</h3>
                <p>Browse and select templates</p>
              </div>
              <IonIcon :icon="chevronForward" class="nav-arrow" />
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard class="action-card" @click="viewHistory" button>
          <IonCardContent>
            <div class="action-content">
              <div class="action-icon history-icon">
                <IonIcon :icon="timeOutline" />
              </div>
              <div class="action-info">
                <h3>Invoice History</h3>
                <p>View past invoices and records</p>
              </div>
              <IonIcon :icon="chevronForward" class="nav-arrow" />
            </div>
          </IonCardContent>
        </IonCard>
      </div>

      <!-- Recent Invoices -->
      <div class="recent-section">
        <h2>Recent Invoices</h2>
        <IonCard v-if="recentInvoices.length === 0">
          <IonCardContent>
            <div class="empty-state">
              <IonIcon :icon="documentOutline" />
              <h3>No invoices yet</h3>
              <p>Create your first invoice to get started</p>
              <IonButton @click="createNewInvoice" expand="block">
                Create Invoice
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        <div v-else class="invoice-list">
          <IonCard 
            v-for="invoice in recentInvoices" 
            :key="invoice.id" 
            class="invoice-card"
            @click="viewInvoice(invoice)"
            button
          >
            <IonCardContent>
              <div class="invoice-header">
                <div class="invoice-info">
                  <h3>{{ invoice.number }}</h3>
                  <p class="client-name">{{ invoice.clientName }}</p>
                </div>
                <div class="invoice-status">
                  <IonBadge :color="getStatusColor(invoice.status)">
                    {{ invoice.status }}
                  </IonBadge>
                </div>
              </div>
              <div class="invoice-details">
                <div class="detail-item">
                  <span class="label">Amount:</span>
                  <span class="value">₦{{ formatCurrency(invoice.amount) }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Date:</span>
                  <span class="value">{{ formatDate(invoice.date) }}</span>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </div>

      <!-- Statistics -->
      <div class="stats-section">
        <h2>Statistics</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-icon total-icon">
              <IonIcon :icon="document" />
            </div>
            <div class="stat-info">
              <p class="stat-value">{{ totalInvoices }}</p>
              <p class="stat-label">Total Invoices</p>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon pending-icon">
              <IonIcon :icon="timeOutline" />
            </div>
            <div class="stat-info">
              <p class="stat-value">{{ pendingInvoices }}</p>
              <p class="stat-label">Pending</p>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon paid-icon">
              <IonIcon :icon="checkmarkCircle" />
            </div>
            <div class="stat-info">
              <p class="stat-value">{{ paidInvoices }}</p>
              <p class="stat-label">Paid</p>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon revenue-icon">
              <span class="currency">₦</span>
            </div>
            <div class="stat-info">
              <p class="stat-value">{{ formatCurrency(totalRevenue) }}</p>
              <p class="stat-label">Total Revenue</p>
            </div>
          </div>
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
  IonCardContent,
  IonBadge
} from '@ionic/vue';
import {
  arrowBack,
  add,
  addCircle,
  document,
  documentOutline,
  timeOutline,
  chevronForward,
  checkmarkCircle
} from 'ionicons/icons';

const router = useRouter();

// State
const recentInvoices = ref([
  {
    id: 1,
    number: 'INV-2024-001',
    clientName: 'ABC Company Ltd',
    amount: 150000,
    date: '2024-01-15',
    status: 'Paid'
  },
  {
    id: 2,
    number: 'INV-2024-002',
    clientName: 'XYZ Corporation',
    amount: 280000,
    date: '2024-01-18',
    status: 'Pending'
  },
  {
    id: 3,
    number: 'INV-2024-003',
    clientName: 'DEF Industries',
    amount: 95000,
    date: '2024-01-20',
    status: 'Overdue'
  }
]);

const totalInvoices = ref(24);
const pendingInvoices = ref(8);
const paidInvoices = ref(14);
const totalRevenue = ref(2450000);

// Methods
const goBack = () => {
  router.push('/ican/dashboard');
};

const createNewInvoice = () => {
  console.log('Create new invoice');
  // Here you would navigate to invoice creation form
};

const viewTemplates = () => {
  console.log('View invoice templates');
};

const viewHistory = () => {
  console.log('View invoice history');
};

const viewInvoice = (invoice: any) => {
  console.log('View invoice:', invoice);
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'success';
    case 'pending':
      return 'warning';
    case 'overdue':
      return 'danger';
    default:
      return 'medium';
  }
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-NG');
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-GB');
};

onMounted(() => {
  // Load invoice data
});
</script>

<style scoped>
.page-header {
  padding: 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  text-align: center;
}

.page-header h1 {
  margin: 0 0 8px 0;
  font-size: 1.75rem;
  font-weight: bold;
}

.page-header p {
  margin: 0;
  opacity: 0.9;
}

.actions-section {
  padding: 20px;
}

.action-card {
  margin: 0 0 16px 0;
  transition: transform 0.2s ease;
}

.action-card:hover {
  transform: translateY(-2px);
}

.action-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
}

.create-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.template-icon {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.history-icon {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.action-info {
  flex: 1;
}

.action-info h3 {
  margin: 0 0 4px 0;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.action-info p {
  margin: 0;
  color: var(--ion-color-medium);
  font-size: 0.9rem;
}

.nav-arrow {
  color: var(--ion-color-medium);
  font-size: 20px;
}

.recent-section {
  padding: 0 20px 20px;
}

.recent-section h2 {
  margin-bottom: 16px;
  color: var(--ion-color-dark);
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-state ion-icon {
  font-size: 4rem;
  color: var(--ion-color-medium);
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: var(--ion-color-dark);
}

.empty-state p {
  margin: 0 0 24px 0;
  color: var(--ion-color-medium);
}

.invoice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.invoice-card {
  margin: 0;
  transition: transform 0.2s ease;
}

.invoice-card:hover {
  transform: translateY(-1px);
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.invoice-info h3 {
  margin: 0 0 4px 0;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.client-name {
  margin: 0;
  color: var(--ion-color-medium);
  font-size: 0.9rem;
}

.invoice-details {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.detail-item {
  flex: 1;
}

.detail-item .label {
  font-size: 0.8rem;
  color: var(--ion-color-medium);
  display: block;
}

.detail-item .value {
  font-weight: 600;
  color: var(--ion-color-dark);
}

.stats-section {
  padding: 0 20px 20px;
}

.stats-section h2 {
  margin-bottom: 16px;
  color: var(--ion-color-dark);
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  flex-shrink: 0;
}

.total-icon {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.pending-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.paid-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.revenue-icon {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.currency {
  font-weight: bold;
  font-size: 1.2rem;
}

.stat-info {
  flex: 1;
}

.stat-value {
  margin: 0 0 4px 0;
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--ion-color-dark);
}

.stat-label {
  margin: 0;
  font-size: 0.8rem;
  color: var(--ion-color-medium);
}
</style>