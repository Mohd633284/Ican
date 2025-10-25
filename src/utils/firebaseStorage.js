import { storage } from '../config/firebase';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

class FirebaseStorage {
  constructor() {
    this.pendingUploads = [];
    this.isOnline = navigator.onLine;
    this.setupNetworkListeners();
  }

  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processPendingUploads();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async uploadFile(path, file) {
    try {
      if (!this.isOnline) {
        // Store in IndexedDB for offline access
        await this.storeFileLocally(path, file);
        this.pendingUploads.push({ path, file });
        return null;
      }

      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async deleteFile(path) {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  async storeFileLocally(path, file) {
    try {
      // Using IndexedDB to store files locally
      const db = await this.getIndexedDB();
      const transaction = db.transaction(['files'], 'readwrite');
      const store = transaction.objectStore('files');
      await store.put({ path, file, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Error storing file locally:', error);
      throw error;
    }
  }

  async getIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('offlineStorage', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files', { keyPath: 'path' });
        }
      };
    });
  }

  async processPendingUploads() {
    if (!this.isOnline) return;

    while (this.pendingUploads.length > 0) {
      const { path, file } = this.pendingUploads[0];
      try {
        await this.uploadFile(path, file);
        this.pendingUploads.shift(); // Remove processed upload
      } catch (error) {
        console.error('Error processing pending upload:', error);
        break;
      }
    }
  }
}

export const firebaseStorage = new FirebaseStorage();
