<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton @click="goBack" fill="clear">
            <IonIcon :icon="arrowBack" />
          </IonButton>
        </IonButtons>
        <IonTitle>Receipt Management</IonTitle>
        <IonButtons slot="end">
          <IonButton @click="createNewReceipt" fill="clear">
            <IonIcon :icon="add" />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <!-- Header Section -->
      <div class="page-header">
        <h1>Receipt Management</h1>
        <p>Issue and manage payment receipts</p>
      </div>

      <!-- Action Cards -->
      <div class="actions-section">
        <IonCard class="action-card" @click="createNewReceipt" button>
          <IonCardContent>
            <div class="action-content">
              <div class="action-icon create-icon">
                <IonIcon :icon="addCircle" />
              </div>
              <div class="action-info">
                <h3>Create New Receipt</h3>
                <p>Generate a payment receipt</p>
              </div>
              <IonIcon :icon="chevronForward" class="nav-arrow" />
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard class="action-card" @click="viewTemplates" button>
          <IonCardContent>
            <div class="action-content">
              <div class="action-icon template-icon">
                <IonIcon :icon="receipt" />
              </div>
              <div class="action-info">
                <h3>Receipt Templates</h3>
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
                <h3>Receipt History</h3>
                <p>View past receipts and records</p>
              </div>
              <IonIcon :icon="chevronForward" class="nav-arrow" />
            </div>
          </IonCardContent>
        </IonCard>
      </div>

      <!-- Recent Receipts -->
      <div class="recent-section">
        <h2>Recent Receipts</h2>
        <IonCard v-if="recentReceipts.length === 0">
          <IonCardContent>
            <div class="empty-state">
              <IonIcon :icon="receiptOutline" />
              <h3>No receipts yet</h3>
              <p>Create your first receipt to get started</p>
              <IonButton @click="createNewReceipt" expand="block">
                Create Receipt
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        <div v-else class="receipt-list">
          <IonCard 
            v-for="receiptItem in recentReceipts" 
            :key="receiptItem.id" 
            class="receipt-card"
            @click="viewReceipt(receiptItem)"
            button
          >
            <IonCardContent>
              <div class="receipt-header">
                <div class="receipt-info">
                  <h3>{{ receiptItem.number }}</h3>
                  <p class="payer-name">{{ receiptItem.payerName }}</p>
                </div>
                <div class="receipt-status">
                  <IonBadge :color="getStatusColor(receiptItem.status)">
                    {{ receiptItem.status }}
                  </IonBadge>
                </div>
              </div>
              <div class="receipt-details">
                <div class="detail-item">
                  <span class="label">Amount:</span>
                  <span class="value">₦{{ formatCurrency(receiptItem.amount) }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Date:</span>
                  <span class="value">{{ formatDate(receiptItem.date) }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Method:</span>
                  <span class="value">{{ receiptItem.paymentMethod }}</span>
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
              <IonIcon :icon="receipt" />
            </div>
            <div class="stat-info">
              <p class="stat-value">{{ totalReceipts }}</p>
              <p class="stat-label">Total Receipts</p>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon today-icon">
              <IonIcon :icon="today" />
            </div>
            <div class="stat-info">
              <p class="stat-value">{{ todayReceipts }}</p>
              <p class="stat-label">Today</p>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon month-icon">
              <IonIcon :icon="calendar" />
            </div>
            <div class="stat-info">
              <p class="stat-value">{{ monthReceipts }}</p>
              <p class="stat-label">This Month</p>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon revenue-icon">
              <span class="currency">₦</span>
            </div>
            <div class="stat-info">
              <p class="stat-value">{{ formatCurrency(totalCollected) }}</p>
              <p class="stat-label">Total Collected</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="payment-methods-section">
        <h2>Payment Methods</h2>
        <div class="methods-grid">
          <IonCard class="method-card" @click="filterByMethod('cash')" button>
            <IonCardContent>
              <div class="method-content">
                <div class="method-icon cash-icon">
                  <IonIcon :icon="cash" />
                </div>
                <div class="method-info">
                  <h4>Cash</h4>
                  <p>{{ cashCount }} receipts</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard class="method-card" @click="filterByMethod('bank')" button>
            <IonCardContent>
              <div class="method-content">
                <div class="method-icon bank-icon">
                  <IonIcon :icon="card" />
                </div>
                <div class="method-info">
                  <h4>Bank Transfer</h4>
                  <p>{{ bankCount }} receipts</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard class="method-card" @click="filterByMethod('card')" button>
            <IonCardContent>
              <div class="method-content">
                <div class="method-icon card-icon">
                  <IonIcon :icon="card" />
                </div>
                <div class="method-info">
                  <h4>Card</h4>
                  <p>{{ cardCount }} receipts</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard class="method-card" @click="filterByMethod('online')" button>
            <IonCardContent>
              <div class="method-content">
                <div class="method-icon online-icon">
                  <IonIcon :icon="phonePortrait" />
                </div>
                <div class="method-info">
                  <h4>Online</h4>
                  <p>{{ onlineCount }} receipts</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
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
  receipt,
  receiptOutline,
  timeOutline,
  chevronForward,
  today,
  calendar,
  cash,
  card,
  phonePortrait
} from 'ionicons/icons';

const router = useRouter();

// State
const recentReceipts = ref([
  {
    id: 1,
    number: 'REC-2024-001',
    payerName: 'John Doe',
    amount: 25000,
    date: '2024-01-22',
    status: 'Issued',
    paymentMethod: 'Cash'
  },
  {
    id: 2,
    number: 'REC-2024-002',
    payerName: 'Jane Smith',
    amount: 50000,
    date: '2024-01-22',
    status: 'Issued',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 3,
    number: 'REC-2024-003',
    payerName: 'Mike Johnson',
    amount: 35000,
    date: '2024-01-21',
    status: 'Issued',
    paymentMethod: 'Card'
  }
]);

const totalReceipts = ref(156);
const todayReceipts = ref(8);
const monthReceipts = ref(42);
const totalCollected = ref(1850000);

const cashCount = ref(45);
const bankCount = ref(67);
const cardCount = ref(32);
const onlineCount = ref(12);

// Methods
const goBack = () => {
  router.push('/ican/dashboard');
};

const createNewReceipt = () => {
  console.log('Create new receipt');
  // Here you would navigate to receipt creation form
};

const viewTemplates = () => {
  console.log('View receipt templates');
};

const viewHistory = () => {
  console.log('View receipt history');
};

const viewReceipt = (receiptItem: any) => {
  console.log('View receipt:', receiptItem);
};

const filterByMethod = (method: string) => {
  console.log('Filter by method:', method);
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'issued':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
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
  // Load receipt data
});
</script>

<style scoped>
.page-header {
  padding: 20px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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

.receipt-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.receipt-card {
  margin: 0;
  transition: transform 0.2s ease;
}

.receipt-card:hover {
  transform: translateY(-1px);
}

.receipt-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.receipt-info h3 {
  margin: 0 0 4px 0;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.payer-name {
  margin: 0;
  color: var(--ion-color-medium);
  font-size: 0.9rem;
}

.receipt-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
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
  background: linear-gradient(135deg, #10b981, #059669);
}

.today-icon {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.month-icon {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.revenue-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
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

.payment-methods-section {
  padding: 0 20px 20px;
}

.payment-methods-section h2 {
  margin-bottom: 16px;
  color: var(--ion-color-dark);
  font-weight: 600;
}

.methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.method-card {
  margin: 0;
  transition: transform 0.2s ease;
}

.method-card:hover {
  transform: translateY(-2px);
}

.method-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.method-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  flex-shrink: 0;
}

.cash-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.bank-icon {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.card-icon {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.online-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.method-info {
  flex: 1;
}

.method-info h4 {
  margin: 0 0 2px 0;
  font-weight: 600;
  color: var(--ion-color-dark);
  font-size: 0.9rem;
}

.method-info p {
  margin: 0;
  color: var(--ion-color-medium);
  font-size: 0.8rem;
}
</style>