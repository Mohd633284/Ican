// Firebase Storage Service for file uploads
import { 
  storage, 
  storageRef, 
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL, 
  deleteObject 
} from './config';

/**
 * Upload invoice PDF to Firebase Storage
 */
export const uploadInvoicePDF = async (branchId, invoiceNumber, file, onProgress) => {
  try {
    const fileName = `invoice_${invoiceNumber}_${Date.now()}.pdf`;
    const fileRef = storageRef(storage, `branches/${branchId}/invoices/${fileName}`);
    
    if (onProgress) {
      // Upload with progress tracking
      const uploadTask = uploadBytesResumable(fileRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            reject({ success: false, error: error.message });
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ success: true, url: downloadURL, fileName });
          }
        );
      });
    } else {
      // Simple upload without progress
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      return { success: true, url: downloadURL, fileName };
    }
  } catch (error) {
    console.error('Error uploading invoice:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Upload receipt PDF to Firebase Storage
 */
export const uploadReceiptPDF = async (branchId, receiptNumber, file, onProgress) => {
  try {
    const fileName = `receipt_${receiptNumber}_${Date.now()}.pdf`;
    const fileRef = storageRef(storage, `branches/${branchId}/receipts/${fileName}`);
    
    if (onProgress) {
      const uploadTask = uploadBytesResumable(fileRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            reject({ success: false, error: error.message });
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ success: true, url: downloadURL, fileName });
          }
        );
      });
    } else {
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      return { success: true, url: downloadURL, fileName };
    }
  } catch (error) {
    console.error('Error uploading receipt:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Upload invoice JPEG to Firebase Storage
 */
export const uploadInvoiceJPEG = async (branchId, invoiceNumber, file, onProgress) => {
  try {
    const fileName = `invoice_${invoiceNumber}_${Date.now()}.jpg`;
    const fileRef = storageRef(storage, `branches/${branchId}/invoices/${fileName}`);
    
    if (onProgress) {
      const uploadTask = uploadBytesResumable(fileRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            reject({ success: false, error: error.message });
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ success: true, url: downloadURL, fileName });
          }
        );
      });
    } else {
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      return { success: true, url: downloadURL, fileName };
    }
  } catch (error) {
    console.error('Error uploading invoice JPEG:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Upload receipt JPEG to Firebase Storage
 */
export const uploadReceiptJPEG = async (branchId, receiptNumber, file, onProgress) => {
  try {
    const fileName = `receipt_${receiptNumber}_${Date.now()}.jpg`;
    const fileRef = storageRef(storage, `branches/${branchId}/receipts/${fileName}`);
    
    if (onProgress) {
      const uploadTask = uploadBytesResumable(fileRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            reject({ success: false, error: error.message });
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ success: true, url: downloadURL, fileName });
          }
        );
      });
    } else {
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      return { success: true, url: downloadURL, fileName };
    }
  } catch (error) {
    console.error('Error uploading receipt JPEG:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Upload generic file (signature images, logos, etc.)
 */
export const uploadFile = async (branchId, folderPath, file, onProgress) => {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const fileRef = storageRef(storage, `branches/${branchId}/${folderPath}/${fileName}`);
    
    if (onProgress) {
      const uploadTask = uploadBytesResumable(fileRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            reject({ success: false, error: error.message });
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ success: true, url: downloadURL, fileName });
          }
        );
      });
    } else {
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      return { success: true, url: downloadURL, fileName };
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete file from Firebase Storage
 */
export const deleteFile = async (filePath) => {
  try {
    const fileRef = storageRef(storage, filePath);
    await deleteObject(fileRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Convert blob to file for upload
 */
export const blobToFile = (blob, fileName) => {
  return new File([blob], fileName, { type: blob.type });
};
