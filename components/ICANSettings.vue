<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton @click="goBack" fill="clear">
            <IonIcon :icon="arrowBack" />
          </IonButton>
        </IonButtons>
        <IonTitle>Settings</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <!-- Header Section -->
      <div class="page-header">
        <h1>ICAN Settings</h1>
        <p>Manage your preferences and configurations</p>
      </div>

      <!-- User Profile Section -->
      <div class="settings-section">
        <h2>User Profile</h2>
        <IonCard>
          <IonCardContent>
            <IonItem lines="none" class="profile-item">
              <div class="profile-avatar" slot="start">
                <IonIcon :icon="person" />
              </div>
              <IonLabel>
                <h3>{{ userProfile.name }}</h3>
                <p>{{ userProfile.email }}</p>
                <p>Role: {{ userProfile.role }}</p>
              </IonLabel>
              <IonButton fill="outline" slot="end" @click="editProfile">
                <IonIcon :icon="create" slot="start" />
                Edit
              </IonButton>
            </IonItem>
          </IonCardContent>
        </IonCard>
      </div>

      <!-- General Settings -->
      <div class="settings-section">
        <h2>General</h2>
        <IonCard>
          <IonCardContent>
            <!-- Theme Settings -->
            <IonItem>
              <IonIcon :icon="moon" slot="start" />
              <IonLabel>
                <h3>Dark Mode</h3>
                <p>Switch between light and dark theme</p>
              </IonLabel>
              <IonToggle v-model="settings.darkMode" @ionChange="handleDarkModeChange" slot="end" />
            </IonItem>

            <!-- Language Settings -->
            <IonItem button @click="changeLanguage">
              <IonIcon :icon="language" slot="start" />
              <IonLabel>
                <h3>Language</h3>
                <p>{{ settings.language }}</p>
              </IonLabel>
              <IonIcon :icon="chevronForward" slot="end" />
            </IonItem>

            <!-- Notifications -->
            <IonItem>
              <IonIcon :icon="notifications" slot="start" />
              <IonLabel>
                <h3>Push Notifications</h3>
                <p>Receive app notifications</p>
              </IonLabel>
              <IonToggle v-model="settings.notifications" @ionChange="handleNotificationChange" slot="end" />
            </IonItem>

            <!-- Auto Sync -->
            <IonItem>
              <IonIcon :icon="sync" slot="start" />
              <IonLabel>
                <h3>Auto Sync</h3>
                <p>Automatically sync data</p>
              </IonLabel>
              <IonToggle v-model="settings.autoSync" @ionChange="handleAutoSyncChange" slot="end" />
            </IonItem>
          </IonCardContent>
        </IonCard>
      </div>

      <!-- Branch Settings -->
      <div class="settings-section">
        <h2>Branch Settings</h2>
        <IonCard>
          <IonCardContent>
            <!-- Default Branch -->
            <IonItem button @click="selectBranch">
              <IonIcon :icon="business" slot="start" />
              <IonLabel>
                <h3>Default Branch</h3>
                <p>{{ settings.defaultBranch }}</p>
              </IonLabel>
              <IonIcon :icon="chevronForward" slot="end" />
            </IonItem>

            <!-- Branch Access -->
            <IonItem button @click="manageBranchAccess">
              <IonIcon :icon="key" slot="start" />
              <IonLabel>
                <h3>Branch Access</h3>
                <p>Manage branch permissions</p>
              </IonLabel>
              <IonIcon :icon="chevronForward" slot="end" />
            </IonItem>
          </IonCardContent>
        </IonCard>
      </div>

      <!-- Data Management -->
      <div class="settings-section">
        <h2>Data Management</h2>
        <IonCard>
          <IonCardContent>
            <!-- Backup -->
            <IonItem button @click="createBackup">
              <IonIcon :icon="cloudDownload" slot="start" />
              <IonLabel>
                <h3>Backup Data</h3>
                <p>Create backup of your data</p>
              </IonLabel>
              <IonIcon :icon="chevronForward" slot="end" />
            </IonItem>

            <!-- Export -->
            <IonItem button @click="exportData">
              <IonIcon :icon="download" slot="start" />
              <IonLabel>
                <h3>Export Data</h3>
                <p>Export data to file</p>
              </IonLabel>
              <IonIcon :icon="chevronForward" slot="end" />
            </IonItem>

            <!-- Clear Cache -->
            <IonItem button @click="clearCache">
              <IonIcon :icon="refresh" slot="start" />
              <IonLabel>
                <h3>Clear Cache</h3>
                <p>Clear app cache and temporary files</p>
              </IonLabel>
              <IonIcon :icon="chevronForward" slot="end" />
            </IonItem>
          </IonCardContent>
        </IonCard>
      </div>

      <!-- Security -->
      <div class="settings-section">
        <h2>Security</h2>
        <IonCard>
          <IonCardContent>
            <!-- Change Password -->
            <IonItem button @click="changePassword">
              <IonIcon :icon="lockClosed" slot="start" />
              <IonLabel>
                <h3>Change Password</h3>
                <p>Update your account password</p>
              </IonLabel>
              <IonIcon :icon="chevronForward" slot="end" />
            </IonItem>

            <!-- Two Factor Authentication -->
            <IonItem>
              <IonIcon :icon="shield" slot="start" />
              <IonLabel>
                <h3>Two-Factor Authentication</h3>
                <p>Enable 2FA for enhanced security</p>
              </IonLabel>
              <IonToggle v-model="settings.twoFactorAuth" @ionChange="handleTwoFactorChange" slot="end" />
            </IonItem>

            <!-- Session Management -->
            <IonItem button @click="manageSessions">
              <IonIcon :icon="time" slot="start" />
              <IonLabel>
                <h3>Active Sessions</h3>
                <p>Manage your logged-in devices</p>
              </IonLabel>
              <IonIcon :icon="chevronForward" slot="end" />
            </IonItem>
          </IonCardContent>
        </IonCard>
      </div>

      <!-- Help & Support -->
      <div class="settings-section">
        <h2>Help & Support</h2>
        <IonCard>
          <IonCardContent>
            <!-- Help Center -->
            <IonItem button @click="openHelpCenter">
              <IonIcon :icon="helpCircle" slot="start" />
              <IonLabel>
                <h3>Help Center</h3>
                <p>Browse help articles and guides</p>
              </IonLabel>
              <IonIcon :icon="chevronForward" slot="end" />
            </IonItem>

            <!-- Contact Support -->
            <IonItem button @click="contactSupport">
              <IonIcon :icon="headset" slot="start" />
              <IonLabel>
                <h3>Contact Support</h3>
                <p>Get help from our support team</p>
              </IonLabel>
              <IonIcon :icon="chevronForward" slot="end" />
            </IonItem>

            <!-- Report Bug -->
            <IonItem button @click="reportBug">
              <IonIcon :icon="bug" slot="start" />
              <IonLabel>
                <h3>Report a Bug</h3>
                <p>Help us improve the app</p>
              </IonLabel>
              <IonIcon :icon="chevronForward" slot="end" />
            </IonItem>
          </IonCardContent>
        </IonCard>
      </div>

      <!-- About -->
      <div class="settings-section">
        <h2>About</h2>
        <IonCard>
          <IonCardContent>
            <!-- App Version -->
            <IonItem>
              <IonIcon :icon="information" slot="start" />
              <IonLabel>
                <h3>App Version</h3>
                <p>{{ appInfo.version }}</p>
              </IonLabel>
            </IonItem>

            <!-- Build Number -->
            <IonItem>
              <IonIcon :icon="code" slot="start" />
              <IonLabel>
                <h3>Build Number</h3>
                <p>{{ appInfo.buildNumber }}</p>
              </IonLabel>
            </IonItem>

            <!-- Privacy Policy -->
            <IonItem button @click="viewPrivacyPolicy">
              <IonIcon :icon="document" slot="start" />
              <IonLabel>
                <h3>Privacy Policy</h3>
                <p>View our privacy policy</p>
              </IonLabel>
              <IonIcon :icon="chevronForward" slot="end" />
            </IonItem>

            <!-- Terms of Service -->
            <IonItem button @click="viewTermsOfService">
              <IonIcon :icon="documentText" slot="start" />
              <IonLabel>
                <h3>Terms of Service</h3>
                <p>View terms and conditions</p>
              </IonLabel>
              <IonIcon :icon="chevronForward" slot="end" />
            </IonItem>
          </IonCardContent>
        </IonCard>
      </div>

      <!-- Danger Zone -->
      <div class="settings-section danger-section">
        <h2>Danger Zone</h2>
        <IonCard class="danger-card">
          <IonCardContent>
            <IonItem button @click="signOut" class="danger-item">
              <IonIcon :icon="logOut" slot="start" />
              <IonLabel>
                <h3>Sign Out</h3>
                <p>Sign out from all devices</p>
              </IonLabel>
              <IonIcon :icon="chevronForward" slot="end" />
            </IonItem>
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
  IonCardContent,
  IonItem,
  IonLabel,
  IonToggle
} from '@ionic/vue';
import {
  arrowBack,
  person,
  create,
  moon,
  language,
  notifications,
  sync,
  business,
  key,
  cloudDownload,
  download,
  refresh,
  lockClosed,
  shield,
  time,
  helpCircle,
  headset,
  bug,
  information,
  code,
  document,
  documentText,
  logOut,
  chevronForward
} from 'ionicons/icons';

const router = useRouter();

// State
const userProfile = ref({
  name: 'John Doe',
  email: 'john.doe@smartdesignpro.com',
  role: 'Administrator'
});

const settings = ref({
  darkMode: false,
  language: 'English (US)',
  notifications: true,
  autoSync: true,
  defaultBranch: 'Lagos Branch',
  twoFactorAuth: false
});

const appInfo = ref({
  version: '1.0.0',
  buildNumber: '100'
});

// Methods
const goBack = () => {
  router.push('/ican/dashboard');
};

const editProfile = () => {
  console.log('Edit profile');
  // Navigate to profile edit page
};

const handleDarkModeChange = (event: any) => {
  const enabled = event.detail.checked;
  // Apply dark mode theme
  document.body.classList.toggle('dark', enabled);
  console.log('Dark mode:', enabled);
};

const handleNotificationChange = (event: any) => {
  const enabled = event.detail.checked;
  console.log('Notifications:', enabled);
  // Handle notification settings
};

const handleAutoSyncChange = (event: any) => {
  const enabled = event.detail.checked;
  console.log('Auto sync:', enabled);
  // Handle auto sync settings
};

const handleTwoFactorChange = (event: any) => {
  const enabled = event.detail.checked;
  console.log('Two factor auth:', enabled);
  // Handle 2FA settings
};

const changeLanguage = () => {
  console.log('Change language');
  // Show language picker
};

const selectBranch = () => {
  console.log('Select branch');
  // Show branch selector
};

const manageBranchAccess = () => {
  console.log('Manage branch access');
  // Navigate to branch access management
};

const createBackup = () => {
  console.log('Create backup');
  // Handle backup creation
};

const exportData = () => {
  console.log('Export data');
  // Handle data export
};

const clearCache = () => {
  console.log('Clear cache');
  // Handle cache clearing
};

const changePassword = () => {
  console.log('Change password');
  // Navigate to password change
};

const manageSessions = () => {
  console.log('Manage sessions');
  // Navigate to session management
};

const openHelpCenter = () => {
  console.log('Open help center');
  // Open help center
};

const contactSupport = () => {
  console.log('Contact support');
  // Open support contact
};

const reportBug = () => {
  console.log('Report bug');
  // Open bug report
};

const viewPrivacyPolicy = () => {
  console.log('View privacy policy');
  // Open privacy policy
};

const viewTermsOfService = () => {
  console.log('View terms of service');
  // Open terms of service
};

const signOut = () => {
  console.log('Sign out');
  // Handle sign out
  router.push('/ican/home');
};
</script>

<style scoped>
.page-header {
  padding: 20px;
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
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

.settings-section {
  padding: 0 20px 20px;
}

.settings-section h2 {
  margin: 20px 0 16px 0;
  color: var(--ion-color-dark);
  font-weight: 600;
  font-size: 1.1rem;
}

.settings-section:first-child h2 {
  margin-top: 20px;
}

ion-card {
  margin: 0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --inner-padding-end: 0px;
}

ion-item h3 {
  font-weight: 600;
  color: var(--ion-color-dark);
  margin: 0 0 4px 0;
}

ion-item p {
  color: var(--ion-color-medium);
  margin: 0;
  font-size: 0.9rem;
}

.profile-item {
  --padding-start: 0px;
  padding: 16px;
}

.profile-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6b7280, #4b5563);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  margin-right: 16px;
}

.danger-section h2 {
  color: var(--ion-color-danger);
}

.danger-card {
  border: 1px solid rgba(var(--ion-color-danger-rgb), 0.2);
}

.danger-item {
  --color: var(--ion-color-danger);
}

.danger-item h3 {
  color: var(--ion-color-danger);
}

.danger-item p {
  color: rgba(var(--ion-color-danger-rgb), 0.7);
}

.danger-item ion-icon {
  color: var(--ion-color-danger);
}

@media (max-width: 768px) {
  .profile-item {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-avatar {
    margin-right: 0;
    margin-bottom: 16px;
  }
}
</style>