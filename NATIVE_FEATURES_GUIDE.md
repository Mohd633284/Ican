# 🎯 Native Features Integration Guide

## How to Use Capacitor Native Features in Your App

---

## 📸 1. Camera Access

### Install Plugin:
```powershell
npm install @capacitor/camera
```

### Usage in Vue Component:

```vue
<template>
  <div>
    <button @click="takePicture">Take Photo</button>
    <img v-if="photo" :src="photo" alt="Captured" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const photo = ref(null);

const takePicture = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera // or CameraSource.Photos for gallery
    });
    
    photo.value = image.dataUrl;
    console.log('Photo captured:', image);
  } catch (error) {
    console.error('Camera error:', error);
  }
};
</script>
```

### Use Cases in Your App:
- **Invoice/Receipt**: Capture document photos
- **Member Profile**: Upload profile pictures
- **Signature**: Capture customer signatures

---

## 🔔 2. Push Notifications

### Install Plugin:
```powershell
npm install @capacitor/push-notifications
```

### Setup in `main.js`:

```javascript
import { PushNotifications } from '@capacitor/push-notifications';

// Request permission
const requestPermissions = async () => {
  const result = await PushNotifications.requestPermissions();
  if (result.receive === 'granted') {
    await PushNotifications.register();
  }
};

// Listen for registration
PushNotifications.addListener('registration', (token) => {
  console.log('Push registration success, token: ' + token.value);
  // Send token to your Firebase backend
});

// Listen for notifications
PushNotifications.addListener('pushNotificationReceived', (notification) => {
  console.log('Push received: ', notification);
});

// Handle notification tap
PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
  console.log('Push action performed: ', notification);
});

requestPermissions();
```

### Use Cases:
- **Payment Reminders**: Notify branch when payment is due
- **New Invoice**: Alert admin when new invoice is created
- **Member Updates**: Notify when new member joins
- **Transaction Alerts**: Real-time transaction notifications

---

## 🔔 3. Local Notifications

### Install Plugin:
```powershell
npm install @capacitor/local-notifications
```

### Usage:

```javascript
import { LocalNotifications } from '@capacitor/local-notifications';

// Request permission
await LocalNotifications.requestPermissions();

// Schedule notification
const scheduleNotification = async () => {
  await LocalNotifications.schedule({
    notifications: [
      {
        title: 'Payment Reminder',
        body: 'Invoice #12345 is due today',
        id: 1,
        schedule: { at: new Date(Date.now() + 1000 * 60) }, // 1 minute from now
        sound: null,
        attachments: null,
        actionTypeId: '',
        extra: { invoiceId: '12345' }
      }
    ]
  });
};

// Listen for notification tap
LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
  console.log('Notification clicked:', notification);
  // Navigate to invoice page
  router.push(`/invoice/${notification.notification.extra.invoiceId}`);
});
```

---

## 📁 4. File System

### Install Plugin:
```powershell
npm install @capacitor/filesystem
```

### Usage - Save Invoice PDF:

```javascript
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

// Save file
const saveInvoicePDF = async (pdfData, fileName) => {
  try {
    const result = await Filesystem.writeFile({
      path: `invoices/${fileName}.pdf`,
      data: pdfData, // base64 string
      directory: Directory.Documents,
      encoding: Encoding.UTF8
    });
    
    console.log('File saved:', result.uri);
    return result.uri;
  } catch (error) {
    console.error('Save error:', error);
  }
};

// Read file
const readInvoice = async (fileName) => {
  try {
    const contents = await Filesystem.readFile({
      path: `invoices/${fileName}.pdf`,
      directory: Directory.Documents,
      encoding: Encoding.UTF8
    });
    
    return contents.data;
  } catch (error) {
    console.error('Read error:', error);
  }
};

// List files
const listInvoices = async () => {
  try {
    const result = await Filesystem.readdir({
      path: 'invoices',
      directory: Directory.Documents
    });
    
    console.log('Files:', result.files);
    return result.files;
  } catch (error) {
    console.error('List error:', error);
  }
};

// Delete file
const deleteInvoice = async (fileName) => {
  try {
    await Filesystem.deleteFile({
      path: `invoices/${fileName}.pdf`,
      directory: Directory.Documents
    });
    
    console.log('File deleted');
  } catch (error) {
    console.error('Delete error:', error);
  }
};
```

### Use Cases:
- **Offline Storage**: Save invoices/receipts locally
- **Backup**: Export/import data as JSON
- **Cache**: Store frequently accessed data
- **Documents**: Save generated PDFs

---

## 👥 5. Contacts Access

### Install Plugin:
```powershell
npm install @capacitor/contacts
```

### Usage:

```javascript
import { Contacts } from '@capacitor/contacts';

// Request permission
const requestContactsPermission = async () => {
  const permission = await Contacts.requestPermissions();
  return permission.contacts === 'granted';
};

// Get all contacts
const getContacts = async () => {
  try {
    const result = await Contacts.getContacts({
      projection: {
        name: true,
        phones: true,
        emails: true,
        organization: true
      }
    });
    
    console.log('Contacts:', result.contacts);
    return result.contacts;
  } catch (error) {
    console.error('Contacts error:', error);
  }
};

// Pick a contact
const pickContact = async () => {
  try {
    const result = await Contacts.pickContact({
      projection: {
        name: true,
        phones: true,
        emails: true
      }
    });
    
    console.log('Selected contact:', result.contact);
    return result.contact;
  } catch (error) {
    console.error('Pick error:', error);
  }
};
```

### Integration Example - Invoice Page:

```vue
<template>
  <div>
    <input v-model="customerName" placeholder="Customer Name" />
    <button @click="selectFromContacts">Select from Contacts</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Contacts } from '@capacitor/contacts';

const customerName = ref('');

const selectFromContacts = async () => {
  try {
    const result = await Contacts.pickContact({
      projection: { name: true, phones: true }
    });
    
    if (result.contact) {
      customerName.value = result.contact.name.display;
      console.log('Phone:', result.contact.phones?.[0]?.number);
    }
  } catch (error) {
    console.error('Contact selection error:', error);
  }
};
</script>
```

---

## 📳 6. Haptics (Vibration)

### Install Plugin:
```powershell
npm install @capacitor/haptics
```

### Usage:

```javascript
import { Haptics, ImpactStyle } from '@capacitor/haptics';

// Light impact (for button press)
const lightHaptic = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
};

// Medium impact (for success)
const mediumHaptic = async () => {
  await Haptics.impact({ style: ImpactStyle.Medium });
};

// Heavy impact (for errors)
const heavyHaptic = async () => {
  await Haptics.impact({ style: ImpactStyle.Heavy });
};

// Notification feedback
const notificationHaptic = async () => {
  await Haptics.notification({ type: 'SUCCESS' }); // or 'WARNING', 'ERROR'
};

// Vibrate pattern
const vibratePattern = async () => {
  await Haptics.vibrate({ duration: 300 });
};
```

### Integration in BaseButton Component:

```vue
<template>
  <button @click="handleClick" class="...">
    <slot></slot>
  </button>
</template>

<script setup>
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const handleClick = async () => {
  // Provide haptic feedback
  await Haptics.impact({ style: ImpactStyle.Light });
  
  // Then emit the actual click
  emit('click');
};
</script>
```

### Use Cases:
- **Button Press**: Light haptic on every button tap
- **Success**: Medium/Heavy haptic when invoice saved
- **Error**: Heavy haptic for validation errors
- **Delete**: Warning haptic before deletion

---

## 🌐 7. Network Monitoring

### Install Plugin:
```powershell
npm install @capacitor/network
```

### Usage:

```javascript
import { Network } from '@capacitor/network';
import { ref } from 'vue';

const isOnline = ref(true);
const connectionType = ref('');

// Get current status
const checkNetworkStatus = async () => {
  const status = await Network.getStatus();
  console.log('Network status:', status);
  isOnline.value = status.connected;
  connectionType.value = status.connectionType;
};

// Listen for network changes
Network.addListener('networkStatusChange', (status) => {
  console.log('Network status changed:', status);
  isOnline.value = status.connected;
  connectionType.value = status.connectionType;
  
  if (!status.connected) {
    alert('You are offline. Some features may not work.');
  } else {
    alert('Back online!');
  }
});

// Initialize
checkNetworkStatus();
```

### Create Composable `useNetwork.js`:

```javascript
import { ref, onMounted, onUnmounted } from 'vue';
import { Network } from '@capacitor/network';

export const useNetwork = () => {
  const isOnline = ref(true);
  const connectionType = ref('unknown');
  
  let listener;
  
  const checkStatus = async () => {
    const status = await Network.getStatus();
    isOnline.value = status.connected;
    connectionType.value = status.connectionType;
  };
  
  onMounted(async () => {
    await checkStatus();
    
    listener = await Network.addListener('networkStatusChange', (status) => {
      isOnline.value = status.connected;
      connectionType.value = status.connectionType;
    });
  });
  
  onUnmounted(() => {
    if (listener) listener.remove();
  });
  
  return {
    isOnline,
    connectionType
  };
};
```

### Use in Components:

```vue
<template>
  <div>
    <div v-if="!isOnline" class="offline-banner">
      ⚠️ You are offline. Changes will sync when connected.
    </div>
    
    <button @click="saveData" :disabled="!isOnline">
      Save to Cloud
    </button>
  </div>
</template>

<script setup>
import { useNetwork } from '@/composables/useNetwork';

const { isOnline, connectionType } = useNetwork();

const saveData = () => {
  if (!isOnline.value) {
    alert('Cannot save while offline');
    return;
  }
  
  // Save to Firebase
};
</script>
```

---

## 📱 8. App State & Deep Links

### Install Plugin:
```powershell
npm install @capacitor/app
```

### Usage:

```javascript
import { App } from '@capacitor/app';

// Listen for app state changes
App.addListener('appStateChange', ({ isActive }) => {
  console.log('App state changed. Is active?', isActive);
  
  if (isActive) {
    // App came to foreground - refresh data
    refreshDashboard();
  } else {
    // App went to background - save state
    saveLocalState();
  }
});

// Handle deep links
App.addListener('appUrlOpen', (data) => {
  console.log('App opened with URL:', data.url);
  
  // Example: ican://invoice/12345
  const slug = data.url.split('.app').pop();
  if (slug) {
    router.push(slug);
  }
});

// Get app info
const getAppInfo = async () => {
  const info = await App.getInfo();
  console.log('App info:', info);
  // { name: "ICAN Manager", id: "com.goldenprinter.ican", build: "1", version: "1.0.0" }
};
```

---

## 🎨 9. Status Bar Customization

### Install Plugin:
```powershell
npm install @capacitor/status-bar
```

### Usage:

```javascript
import { StatusBar, Style } from '@capacitor/status-bar';

// Set status bar style
const setDarkMode = async () => {
  await StatusBar.setStyle({ style: Style.Dark });
};

const setLightMode = async () => {
  await StatusBar.setStyle({ style: Style.Light });
};

// Set background color
const setStatusBarColor = async () => {
  await StatusBar.setBackgroundColor({ color: '#10b981' }); // Emerald green
};

// Hide status bar
const hideStatusBar = async () => {
  await StatusBar.hide();
};

// Show status bar
const showStatusBar = async () => {
  await StatusBar.show();
};
```

---

## 🚀 10. Splash Screen

### Install Plugin:
```powershell
npm install @capacitor/splash-screen
```

### Usage in `main.js`:

```javascript
import { SplashScreen } from '@capacitor/splash-screen';

// Show splash screen
SplashScreen.show({
  showDuration: 2000,
  autoHide: true
});

// Hide manually when app is ready
setTimeout(() => {
  SplashScreen.hide();
}, 3000);
```

---

## 📋 Complete Integration Example - Invoice Page

```vue
<template>
  <div>
    <!-- Network Status -->
    <div v-if="!isOnline" class="offline-warning">
      ⚠️ Offline Mode
    </div>
    
    <!-- Customer Selection -->
    <div>
      <input v-model="customerName" placeholder="Customer Name" />
      <button @click="selectContact">
        Select from Contacts
      </button>
    </div>
    
    <!-- Document Photo -->
    <div>
      <button @click="captureDocument">
        📸 Capture Document
      </button>
      <img v-if="documentPhoto" :src="documentPhoto" />
    </div>
    
    <!-- Save Button -->
    <button @click="saveInvoice" :disabled="!isOnline">
      Save Invoice
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Contacts } from '@capacitor/contacts';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { useNetwork } from '@/composables/useNetwork';

const { isOnline } = useNetwork();
const customerName = ref('');
const documentPhoto = ref(null);

// Select contact
const selectContact = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
  
  try {
    const result = await Contacts.pickContact({
      projection: { name: true, phones: true, emails: true }
    });
    
    if (result.contact) {
      customerName.value = result.contact.name.display;
      await Haptics.notification({ type: 'SUCCESS' });
    }
  } catch (error) {
    console.error('Contact error:', error);
    await Haptics.notification({ type: 'ERROR' });
  }
};

// Capture document
const captureDocument = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
  
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.DataUrl
    });
    
    documentPhoto.value = image.dataUrl;
    await Haptics.notification({ type: 'SUCCESS' });
  } catch (error) {
    console.error('Camera error:', error);
    await Haptics.notification({ type: 'ERROR' });
  }
};

// Save invoice
const saveInvoice = async () => {
  await Haptics.impact({ style: ImpactStyle.Medium });
  
  try {
    // Save to Firebase
    // ... your existing save logic ...
    
    // Save document locally
    if (documentPhoto.value) {
      await Filesystem.writeFile({
        path: `invoices/invoice_${Date.now()}.jpg`,
        data: documentPhoto.value,
        directory: Directory.Documents
      });
    }
    
    // Schedule reminder
    await LocalNotifications.schedule({
      notifications: [{
        title: 'Invoice Created',
        body: `Invoice for ${customerName.value} saved successfully`,
        id: Date.now()
      }]
    });
    
    await Haptics.notification({ type: 'SUCCESS' });
    alert('Invoice saved successfully!');
  } catch (error) {
    console.error('Save error:', error);
    await Haptics.notification({ type: 'ERROR' });
    alert('Failed to save invoice');
  }
};
</script>
```

---

## ✅ Quick Reference

| Feature | Plugin | Use Case |
|---------|--------|----------|
| Camera | `@capacitor/camera` | Capture receipts, documents, signatures |
| Push Notifications | `@capacitor/push-notifications` | Real-time alerts, reminders |
| Local Notifications | `@capacitor/local-notifications` | Payment reminders, scheduled alerts |
| File System | `@capacitor/filesystem` | Save PDFs, offline storage |
| Contacts | `@capacitor/contacts` | Auto-fill customer info |
| Haptics | `@capacitor/haptics` | Button feedback, confirmations |
| Network | `@capacitor/network` | Offline detection, sync status |
| App | `@capacitor/app` | Deep links, state management |
| Status Bar | `@capacitor/status-bar` | UI customization |
| Splash Screen | `@capacitor/splash-screen` | Launch experience |

---

**Next Step**: See `FIREBASE_NATIVE_INTEGRATION.md` for Firebase + Capacitor setup
