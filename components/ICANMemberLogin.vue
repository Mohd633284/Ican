<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton @click="goBack" fill="clear">
            <IonIcon :icon="arrowBack" />
          </IonButton>
        </IonButtons>
        <IonTitle>Member Portal</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <!-- Header Section -->
      <div class="page-header">
        <div class="ican-logo">
          <IonIcon :icon="business" />
        </div>
        <h1>ICAN Member Portal</h1>
        <p>Institute of Chartered Accountants of Nigeria</p>
      </div>

      <!-- Login Form -->
      <div class="login-section" v-if="!isLoggedIn">
        <IonCard class="login-card">
          <IonCardHeader>
            <IonCardTitle>Member Login</IonCardTitle>
            <IonCardSubtitle>Access your member account</IonCardSubtitle>
          </IonCardHeader>
          
          <IonCardContent>
            <form @submit.prevent="handleLogin">
              <IonItem lines="full" class="form-item">
                <IonLabel position="stacked">Member ID</IonLabel>
                <IonInput
                  v-model="loginForm.memberId"
                  type="text"
                  placeholder="Enter your member ID"
                  required
                  :disabled="loading"
                />
              </IonItem>

              <IonItem lines="full" class="form-item">
                <IonLabel position="stacked">Password</IonLabel>
                <IonInput
                  v-model="loginForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  required
                  :disabled="loading"
                />
                <IonButton 
                  slot="end" 
                  fill="clear" 
                  @click="showPassword = !showPassword"
                  :disabled="loading"
                >
                  <IonIcon :icon="showPassword ? eyeOff : eye" />
                </IonButton>
              </IonItem>

              <div class="form-options">
                <IonCheckbox v-model="rememberMe" :disabled="loading" />
                <IonLabel class="remember-label">Remember me</IonLabel>
              </div>

              <IonButton 
                expand="block" 
                type="submit" 
                class="login-button"
                :disabled="loading || !isFormValid"
              >
                <IonIcon :icon="loading ? undefined : logIn" slot="start" v-if="!loading" />
                <IonSpinner name="circular" v-if="loading" />
                {{ loading ? 'Signing in...' : 'Sign In' }}
              </IonButton>

              <div class="form-links">
                <IonButton fill="clear" @click="handleForgotPassword" :disabled="loading">
                  Forgot Password?
                </IonButton>
                <IonButton fill="clear" @click="handleRegister" :disabled="loading">
                  New Member Registration
                </IonButton>
              </div>
            </form>
          </IonCardContent>
        </IonCard>

        <!-- Quick Actions for Non-Members -->
        <div class="guest-actions">
          <h2>Guest Services</h2>
          <div class="actions-grid">
            <IonCard class="action-card" @click="viewMemberDirectory" button>
              <IonCardContent>
                <div class="action-content">
                  <div class="action-icon directory-icon">
                    <IonIcon :icon="people" />
                  </div>
                  <div class="action-info">
                    <h3>Member Directory</h3>
                    <p>Search public member listings</p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard class="action-card" @click="viewEvents" button>
              <IonCardContent>
                <div class="action-content">
                  <div class="action-icon events-icon">
                    <IonIcon :icon="calendar" />
                  </div>
                  <div class="action-info">
                    <h3>Events & Training</h3>
                    <p>View upcoming events</p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard class="action-card" @click="viewResources" button>
              <IonCardContent>
                <div class="action-content">
                  <div class="action-icon resources-icon">
                    <IonIcon :icon="library" />
                  </div>
                  <div class="action-info">
                    <h3>Resources</h3>
                    <p>Access public resources</p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard class="action-card" @click="contactSupport" button>
              <IonCardContent>
                <div class="action-content">
                  <div class="action-icon support-icon">
                    <IonIcon :icon="headset" />
                  </div>
                  <div class="action-info">
                    <h3>Contact Support</h3>
                    <p>Get help and assistance</p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        </div>
      </div>

      <!-- Member Dashboard -->
      <div class="member-dashboard" v-else>
        <IonCard class="welcome-card">
          <IonCardContent>
            <div class="welcome-content">
              <div class="member-avatar">
                <IonIcon :icon="person" />
              </div>
              <div class="welcome-info">
                <h2>Welcome back, {{ memberInfo.name }}!</h2>
                <p>Member ID: {{ memberInfo.memberId }}</p>
                <p>Status: <IonBadge color="success">{{ memberInfo.status }}</IonBadge></p>
              </div>
              <IonButton @click="handleLogout" fill="outline" size="small">
                <IonIcon :icon="logOut" slot="start" />
                Logout
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        <!-- Member Services -->
        <div class="member-services">
          <h2>Member Services</h2>
          <div class="services-grid">
            <IonCard class="service-card" @click="viewProfile" button>
              <IonCardContent>
                <div class="service-content">
                  <div class="service-icon profile-icon">
                    <IonIcon :icon="person" />
                  </div>
                  <div class="service-info">
                    <h3>My Profile</h3>
                    <p>Update personal information</p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard class="service-card" @click="viewCertificates" button>
              <IonCardContent>
                <div class="service-content">
                  <div class="service-icon cert-icon">
                    <IonIcon :icon="ribbon" />
                  </div>
                  <div class="service-info">
                    <h3>Certificates</h3>
                    <p>View and download certificates</p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard class="service-card" @click="viewDues" button>
              <IonCardContent>
                <div class="service-content">
                  <div class="service-icon dues-icon">
                    <IonIcon :icon="card" />
                  </div>
                  <div class="service-info">
                    <h3>Dues & Payments</h3>
                    <p>Manage membership payments</p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard class="service-card" @click="viewCPD" button>
              <IonCardContent>
                <div class="service-content">
                  <div class="service-icon cpd-icon">
                    <IonIcon :icon="school" />
                  </div>
                  <div class="service-info">
                    <h3>CPD Activities</h3>
                    <p>Track professional development</p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="recent-activity">
          <h2>Recent Activity</h2>
          <IonCard>
            <IonCardContent>
              <div class="activity-list">
                <div 
                  v-for="activity in recentActivity" 
                  :key="activity.id" 
                  class="activity-item"
                >
                  <div class="activity-icon" :class="getActivityClass(activity.type)">
                    <IonIcon :icon="getActivityIcon(activity.type)" />
                  </div>
                  <div class="activity-info">
                    <p class="activity-title">{{ activity.title }}</p>
                    <p class="activity-date">{{ formatDate(activity.date) }}</p>
                  </div>
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
import { ref, computed, onMounted } from 'vue';
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
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonItem,
  IonLabel,
  IonInput,
  IonCheckbox,
  IonSpinner,
  IonBadge
} from '@ionic/vue';
import {
  arrowBack,
  business,
  logIn,
  logOut,
  eye,
  eyeOff,
  people,
  calendar,
  library,
  headset,
  person,
  ribbon,
  card,
  school,
  document,
  checkmarkCircle,
  timeOutline
} from 'ionicons/icons';

const router = useRouter();

// State
const isLoggedIn = ref(false);
const loading = ref(false);
const showPassword = ref(false);
const rememberMe = ref(false);

const loginForm = ref({
  memberId: '',
  password: ''
});

const memberInfo = ref({
  name: 'John Doe',
  memberId: 'ICAN/ACA/001234',
  status: 'Active',
  email: 'john.doe@email.com'
});

const recentActivity = ref([
  {
    id: 1,
    type: 'payment',
    title: 'Annual dues payment successful',
    date: '2024-01-20T10:30:00Z'
  },
  {
    id: 2,
    type: 'certificate',
    title: 'Certificate downloaded',
    date: '2024-01-18T14:20:00Z'
  },
  {
    id: 3,
    type: 'cpd',
    title: 'CPD activity recorded',
    date: '2024-01-15T09:15:00Z'
  }
]);

// Computed
const isFormValid = computed(() => {
  return loginForm.value.memberId.length > 0 && loginForm.value.password.length > 0;
});

// Methods
const goBack = () => {
  router.push('/ican/dashboard');
};

const handleLogin = async () => {
  try {
    loading.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock successful login
    isLoggedIn.value = true;
    
    // You would typically store auth tokens here
    if (rememberMe.value) {
      localStorage.setItem('icanMemberRemember', 'true');
    }
    
  } catch (error) {
    console.error('Login error:', error);
    // Handle error - show toast/alert
  } finally {
    loading.value = false;
  }
};

const handleLogout = () => {
  isLoggedIn.value = false;
  loginForm.value = { memberId: '', password: '' };
  rememberMe.value = false;
  localStorage.removeItem('icanMemberRemember');
};

const handleForgotPassword = () => {
  console.log('Handle forgot password');
  // Navigate to forgot password flow
};

const handleRegister = () => {
  console.log('Handle new member registration');
  // Navigate to registration flow
};

// Guest Actions
const viewMemberDirectory = () => {
  console.log('View member directory');
};

const viewEvents = () => {
  console.log('View events');
};

const viewResources = () => {
  console.log('View resources');
};

const contactSupport = () => {
  console.log('Contact support');
};

// Member Services
const viewProfile = () => {
  console.log('View profile');
};

const viewCertificates = () => {
  console.log('View certificates');
};

const viewDues = () => {
  console.log('View dues');
};

const viewCPD = () => {
  console.log('View CPD');
};

const getActivityClass = (type: string) => {
  switch (type) {
    case 'payment':
      return 'payment-activity';
    case 'certificate':
      return 'certificate-activity';
    case 'cpd':
      return 'cpd-activity';
    default:
      return 'general-activity';
  }
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'payment':
      return card;
    case 'certificate':
      return ribbon;
    case 'cpd':
      return school;
    default:
      return document;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

onMounted(() => {
  // Check if user was remembered
  if (localStorage.getItem('icanMemberRemember')) {
    rememberMe.value = true;
    // You might auto-login here if token is still valid
  }
});
</script>

<style scoped>
.page-header {
  padding: 30px 20px;
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  color: white;
  text-align: center;
}

.ican-logo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  backdrop-filter: blur(10px);
}

.ican-logo ion-icon {
  font-size: 30px;
}

.page-header h1 {
  margin: 0 0 8px 0;
  font-size: 1.75rem;
  font-weight: bold;
}

.page-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.login-section {
  padding: 20px;
}

.login-card {
  margin-bottom: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.form-item {
  margin-bottom: 16px;
}

.form-options {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0;
}

.remember-label {
  font-size: 0.9rem;
  color: var(--ion-color-medium);
}

.login-button {
  margin: 20px 0 16px 0;
  height: 48px;
  font-weight: 600;
}

.form-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-links ion-button {
  font-size: 0.9rem;
}

.guest-actions {
  margin-top: 20px;
}

.guest-actions h2 {
  margin-bottom: 16px;
  color: var(--ion-color-dark);
  font-weight: 600;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.action-card {
  margin: 0;
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

.directory-icon {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.events-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.resources-icon {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.support-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
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

.member-dashboard {
  padding: 20px;
}

.welcome-card {
  margin-bottom: 30px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.welcome-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.member-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e40af, #1e3a8a);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  flex-shrink: 0;
}

.welcome-info {
  flex: 1;
}

.welcome-info h2 {
  margin: 0 0 8px 0;
  color: var(--ion-color-dark);
  font-weight: 600;
}

.welcome-info p {
  margin: 0 0 4px 0;
  color: var(--ion-color-medium);
  font-size: 0.9rem;
}

.member-services {
  margin-bottom: 30px;
}

.member-services h2 {
  margin-bottom: 16px;
  color: var(--ion-color-dark);
  font-weight: 600;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.service-card {
  margin: 0;
  transition: transform 0.2s ease;
}

.service-card:hover {
  transform: translateY(-2px);
}

.service-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.service-icon {
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

.profile-icon {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.cert-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.dues-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.cpd-icon {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.service-info h3 {
  margin: 0 0 4px 0;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.service-info p {
  margin: 0;
  color: var(--ion-color-medium);
  font-size: 0.9rem;
}

.recent-activity h2 {
  margin-bottom: 16px;
  color: var(--ion-color-dark);
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

.payment-activity {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.certificate-activity {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.cpd-activity {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.general-activity {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.activity-info {
  flex: 1;
}

.activity-title {
  margin: 0 0 4px 0;
  font-weight: 600;
  color: var(--ion-color-dark);
  font-size: 0.9rem;
}

.activity-date {
  margin: 0;
  color: var(--ion-color-medium);
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .welcome-content {
    flex-direction: column;
    text-align: center;
  }
  
  .actions-grid,
  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>