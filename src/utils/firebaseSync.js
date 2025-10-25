import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  where,
  getDocs
} from 'firebase/firestore';

class FirebaseSync {
  constructor() {
    this.pendingOperations = [];
    this.isOnline = navigator.onLine;
    this.setupNetworkListeners();
  }

  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processPendingOperations();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async addDocument(collectionName, docId, data) {
    try {
      const docRef = doc(collection(db, collectionName), docId);
      await setDoc(docRef, {
        ...data,
        timestamp: new Date().toISOString(),
        syncStatus: this.isOnline ? 'synced' : 'pending'
      });

      if (!this.isOnline) {
        this.pendingOperations.push({
          type: 'add',
          collectionName,
          docId,
          data
        });
      }
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  async updateDocument(collectionName, docId, data) {
    try {
      const docRef = doc(collection(db, collectionName), docId);
      await updateDoc(docRef, {
        ...data,
        lastModified: new Date().toISOString(),
        syncStatus: this.isOnline ? 'synced' : 'pending'
      });

      if (!this.isOnline) {
        this.pendingOperations.push({
          type: 'update',
          collectionName,
          docId,
          data
        });
      }
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  async deleteDocument(collectionName, docId) {
    try {
      const docRef = doc(collection(db, collectionName), docId);
      await deleteDoc(docRef);

      if (!this.isOnline) {
        this.pendingOperations.push({
          type: 'delete',
          collectionName,
          docId
        });
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  async processPendingOperations() {
    if (!this.isOnline) return;

    while (this.pendingOperations.length > 0) {
      const operation = this.pendingOperations[0];
      try {
        switch (operation.type) {
          case 'add':
            await this.addDocument(operation.collectionName, operation.docId, operation.data);
            break;
          case 'update':
            await this.updateDocument(operation.collectionName, operation.docId, operation.data);
            break;
          case 'delete':
            await this.deleteDocument(operation.collectionName, operation.docId);
            break;
        }
        this.pendingOperations.shift(); // Remove processed operation
      } catch (error) {
        console.error('Error processing pending operation:', error);
        break;
      }
    }
  }

  // Subscribe to real-time updates
  subscribeToCollection(collectionName, callback) {
    const q = collection(db, collectionName);
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    });
  }

  // Get pending documents that need sync
  async getPendingDocs(collectionName) {
    const q = query(
      collection(db, collectionName),
      where('syncStatus', '==', 'pending')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
}

export const firebaseSync = new FirebaseSync();
