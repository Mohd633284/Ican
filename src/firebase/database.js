// Firebase Firestore Database Service
import { 
  db, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from './config';
import { serverTimestamp } from 'firebase/firestore';

/**
 * Save member data to Firestore
 */
export const saveMember = async (branchId, memberId, memberData) => {
  try {
    const memberRef = doc(db, 'branches', branchId, 'members', memberId);
    await setDoc(memberRef, {
      ...memberData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error saving member:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get member by ID
 */
export const getMember = async (branchId, memberId) => {
  try {
    const memberRef = doc(db, 'branches', branchId, 'members', memberId);
    const memberSnap = await getDoc(memberRef);
    
    if (memberSnap.exists()) {
      return { success: true, data: { id: memberSnap.id, ...memberSnap.data() } };
    } else {
      return { success: false, error: 'Member not found' };
    }
  } catch (error) {
    console.error('Error getting member:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all members for a branch
 */
export const getAllMembers = async (branchId) => {
  try {
    const membersRef = collection(db, 'branches', branchId, 'members');
    const snapshot = await getDocs(membersRef);
    
    const members = [];
    snapshot.forEach((doc) => {
      members.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: members };
  } catch (error) {
    console.error('Error getting members:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update member data
 */
export const updateMember = async (branchId, memberId, updates) => {
  try {
    const memberRef = doc(db, 'branches', branchId, 'members', memberId);
    await updateDoc(memberRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating member:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete member
 */
export const deleteMember = async (branchId, memberId) => {
  try {
    const memberRef = doc(db, 'branches', branchId, 'members', memberId);
    await deleteDoc(memberRef);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting member:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Save invoice to Firestore
 */
export const saveInvoice = async (branchId, invoiceData) => {
  try {
    const invoiceId = `invoice_${Date.now()}`;
    const invoiceRef = doc(db, 'branches', branchId, 'invoices', invoiceId);
    
    await setDoc(invoiceRef, {
      ...invoiceData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { success: true, invoiceId };
  } catch (error) {
    console.error('Error saving invoice:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Save receipt to Firestore
 */
export const saveReceipt = async (branchId, receiptData) => {
  try {
    const receiptId = `receipt_${Date.now()}`;
    const receiptRef = doc(db, 'branches', branchId, 'receipts', receiptId);
    
    await setDoc(receiptRef, {
      ...receiptData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { success: true, receiptId };
  } catch (error) {
    console.error('Error saving receipt:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get recent invoices
 */
export const getRecentInvoices = async (branchId, limitCount = 10) => {
  try {
    const invoicesRef = collection(db, 'branches', branchId, 'invoices');
    const q = query(invoicesRef, orderBy('createdAt', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    
    const invoices = [];
    snapshot.forEach((doc) => {
      invoices.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: invoices };
  } catch (error) {
    console.error('Error getting invoices:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get recent receipts
 */
export const getRecentReceipts = async (branchId, limitCount = 10) => {
  try {
    const receiptsRef = collection(db, 'branches', branchId, 'receipts');
    const q = query(receiptsRef, orderBy('createdAt', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    
    const receipts = [];
    snapshot.forEach((doc) => {
      receipts.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: receipts };
  } catch (error) {
    console.error('Error getting receipts:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Backup localStorage data to Firestore
 */
export const backupLocalStorageToCloud = async (branchId) => {
  try {
    // Get all localStorage data
    const members = JSON.parse(localStorage.getItem('members') || '[]');
    const activities = JSON.parse(localStorage.getItem('memberActivities') || '[]');
    
    // Save backup document
    const backupRef = doc(db, 'branches', branchId, 'backups', `backup_${Date.now()}`);
    await setDoc(backupRef, {
      members,
      activities,
      createdAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error backing up data:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Restore data from cloud to localStorage
 */
export const restoreFromCloud = async (branchId) => {
  try {
    // Get latest backup
    const backupsRef = collection(db, 'branches', branchId, 'backups');
    const q = query(backupsRef, orderBy('createdAt', 'desc'), limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return { success: false, error: 'No backup found' };
    }
    
    const backupData = snapshot.docs[0].data();
    
    // Restore to localStorage
    if (backupData.members) {
      localStorage.setItem('members', JSON.stringify(backupData.members));
    }
    if (backupData.activities) {
      localStorage.setItem('memberActivities', JSON.stringify(backupData.activities));
    }
    
    return { success: true, data: backupData };
  } catch (error) {
    console.error('Error restoring data:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Save member activity log to Firestore
 */
export const saveMemberActivity = async (branchId, activityData) => {
  try {
    const activityId = `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const activityRef = doc(db, 'branches', branchId, 'activities', activityId);
    
    await setDoc(activityRef, {
      ...activityData,
      createdAt: serverTimestamp()
    });
    
    return { success: true, id: activityId };
  } catch (error) {
    console.error('Error saving member activity:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get member activities for a branch
 */
export const getMemberActivities = async (branchId, limitCount = 50) => {
  try {
    const activitiesRef = collection(db, 'branches', branchId, 'activities');
    const q = query(activitiesRef, orderBy('timestamp', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    
    const activities = [];
    snapshot.forEach((doc) => {
      activities.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: activities };
  } catch (error) {
    console.error('Error getting member activities:', error);
    return { success: false, error: error.message };
  }
};
