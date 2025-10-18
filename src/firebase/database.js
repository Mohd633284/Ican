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
export const saveInvoice = async (branchId, invoiceData, invoiceId = null) => {
  try {
    const id = invoiceId || `invoice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const invoiceRef = doc(db, 'branches', branchId, 'invoices', id);
    
    const isUpdate = invoiceId !== null;
    
    if (isUpdate) {
      await updateDoc(invoiceRef, {
        ...invoiceData,
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(invoiceRef, {
        ...invoiceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    return { success: true, invoiceId: id, isUpdate };
  } catch (error) {
    console.error('Error saving invoice:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get invoice by ID
 */
export const getInvoiceById = async (branchId, invoiceId) => {
  try {
    const invoiceRef = doc(db, 'branches', branchId, 'invoices', invoiceId);
    const invoiceSnap = await getDoc(invoiceRef);
    
    if (invoiceSnap.exists()) {
      return { success: true, data: { id: invoiceSnap.id, ...invoiceSnap.data() } };
    } else {
      return { success: false, error: 'Invoice not found' };
    }
  } catch (error) {
    console.error('Error getting invoice:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update invoice
 */
export const updateInvoice = async (branchId, invoiceId, updates) => {
  try {
    const invoiceRef = doc(db, 'branches', branchId, 'invoices', invoiceId);
    await updateDoc(invoiceRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating invoice:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete invoice
 */
export const deleteInvoice = async (branchId, invoiceId) => {
  try {
    const invoiceRef = doc(db, 'branches', branchId, 'invoices', invoiceId);
    await deleteDoc(invoiceRef);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all invoices for a branch
 */
export const getAllInvoices = async (branchId) => {
  try {
    const invoicesRef = collection(db, 'branches', branchId, 'invoices');
    const q = query(invoicesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const invoices = [];
    snapshot.forEach((doc) => {
      invoices.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: invoices };
  } catch (error) {
    console.error('Error getting all invoices:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Save receipt to Firestore
 */
export const saveReceipt = async (branchId, receiptData, receiptId = null) => {
  try {
    const id = receiptId || `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const receiptRef = doc(db, 'branches', branchId, 'receipts', id);
    
    const isUpdate = receiptId !== null;
    
    if (isUpdate) {
      await updateDoc(receiptRef, {
        ...receiptData,
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(receiptRef, {
        ...receiptData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    return { success: true, receiptId: id, isUpdate };
  } catch (error) {
    console.error('Error saving receipt:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get receipt by ID
 */
export const getReceiptById = async (branchId, receiptId) => {
  try {
    const receiptRef = doc(db, 'branches', branchId, 'receipts', receiptId);
    const receiptSnap = await getDoc(receiptRef);
    
    if (receiptSnap.exists()) {
      return { success: true, data: { id: receiptSnap.id, ...receiptSnap.data() } };
    } else {
      return { success: false, error: 'Receipt not found' };
    }
  } catch (error) {
    console.error('Error getting receipt:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update receipt
 */
export const updateReceipt = async (branchId, receiptId, updates) => {
  try {
    const receiptRef = doc(db, 'branches', branchId, 'receipts', receiptId);
    await updateDoc(receiptRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating receipt:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete receipt
 */
export const deleteReceipt = async (branchId, receiptId) => {
  try {
    const receiptRef = doc(db, 'branches', branchId, 'receipts', receiptId);
    await deleteDoc(receiptRef);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting receipt:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all receipts for a branch
 */
export const getAllReceipts = async (branchId) => {
  try {
    const receiptsRef = collection(db, 'branches', branchId, 'receipts');
    const q = query(receiptsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const receipts = [];
    snapshot.forEach((doc) => {
      receipts.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: receipts };
  } catch (error) {
    console.error('Error getting all receipts:', error);
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

// ========================================
// SIGNATURE MANAGEMENT FUNCTIONS
// ========================================

/**
 * Save a signature to Firestore
 */
export const saveSignature = async (branchId, signatureData) => {
  try {
    const signatureRef = doc(collection(db, 'branches', branchId, 'signatures'));
    await setDoc(signatureRef, {
      ...signatureData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Log activity
    await logActivity(branchId, 'signature_created', {
      signatureId: signatureRef.id,
      signatureName: signatureData.name
    });
    
    return { success: true, id: signatureRef.id };
  } catch (error) {
    console.error('Error saving signature:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all signatures for a branch
 */
export const getAllSignatures = async (branchId) => {
  try {
    const signaturesRef = collection(db, 'branches', branchId, 'signatures');
    const q = query(signaturesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const signatures = [];
    snapshot.forEach((doc) => {
      signatures.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: signatures };
  } catch (error) {
    console.error('Error getting signatures:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get a specific signature by ID
 */
export const getSignatureById = async (branchId, signatureId) => {
  try {
    const signatureRef = doc(db, 'branches', branchId, 'signatures', signatureId);
    const signatureSnap = await getDoc(signatureRef);
    
    if (signatureSnap.exists()) {
      return { success: true, data: { id: signatureSnap.id, ...signatureSnap.data() } };
    } else {
      return { success: false, error: 'Signature not found' };
    }
  } catch (error) {
    console.error('Error getting signature:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get primary signature for a branch
 */
export const getPrimarySignature = async (branchId) => {
  try {
    const signaturesRef = collection(db, 'branches', branchId, 'signatures');
    const q = query(signaturesRef, where('isPrimary', '==', true), limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { success: true, data: { id: doc.id, ...doc.data() } };
    } else {
      return { success: false, error: 'No primary signature found' };
    }
  } catch (error) {
    console.error('Error getting primary signature:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update a signature
 */
export const updateSignature = async (branchId, signatureId, updates) => {
  try {
    const signatureRef = doc(db, 'branches', branchId, 'signatures', signatureId);
    await updateDoc(signatureRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating signature:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a signature
 */
export const deleteSignature = async (branchId, signatureId) => {
  try {
    const signatureRef = doc(db, 'branches', branchId, 'signatures', signatureId);
    await deleteDoc(signatureRef);
    
    // Log activity
    await logActivity(branchId, 'signature_deleted', {
      signatureId: signatureId
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting signature:', error);
    return { success: false, error: error.message };
  }
};
