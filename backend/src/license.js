import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LICENSE_PATH = path.join(__dirname, '../data/license.json');

/**
 * Read license data from file
 */
export function readLicense() {
  try {
    if (!fs.existsSync(LICENSE_PATH)) {
      // Create default license with 90 days from now
      const now = new Date();
      const expiration = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
      
      const defaultLicense = {
        installDate: now.toISOString(),
        expirationDate: expiration.toISOString(),
        durationDays: 90,
        isActive: true,
        renewalHistory: [
          {
            date: now.toISOString(),
            action: 'initial_installation',
            extendedDays: 90
          }
        ],
        contact: {
          name: 'Developer',
          email: 'your-email@example.com',
          phone: '+234-XXX-XXX-XXXX'
        },
        version: '1.0.0'
      };
      
      saveLicense(defaultLicense);
      return defaultLicense;
    }
    
    const data = fs.readFileSync(LICENSE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading license:', error);
    throw error;
  }
}

/**
 * Save license data to file
 */
export function saveLicense(licenseData) {
  try {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(LICENSE_PATH, JSON.stringify(licenseData, null, 2));
  } catch (error) {
    console.error('Error saving license:', error);
    throw error;
  }
}

/**
 * Check if license is valid (not expired)
 */
export function isLicenseValid() {
  try {
    const license = readLicense();
    const now = new Date();
    const expiration = new Date(license.expirationDate);
    
    return license.isActive && now < expiration;
  } catch (error) {
    console.error('Error checking license validity:', error);
    return false;
  }
}

/**
 * Get license status with detailed information
 */
export function getLicenseStatus() {
  try {
    const license = readLicense();
    const now = new Date();
    const expiration = new Date(license.expirationDate);
    const install = new Date(license.installDate);
    
    const daysRemaining = Math.ceil((expiration - now) / (1000 * 60 * 60 * 24));
    const daysUsed = Math.floor((now - install) / (1000 * 60 * 60 * 24));
    const isExpired = now >= expiration;
    const isValid = license.isActive && !isExpired;
    const warningThreshold = 7; // Show warning 7 days before expiration
    const showWarning = daysRemaining <= warningThreshold && daysRemaining > 0;
    
    return {
      isValid,
      isExpired,
      isActive: license.isActive,
      showWarning,
      installDate: license.installDate,
      expirationDate: license.expirationDate,
      daysRemaining: Math.max(0, daysRemaining),
      daysUsed,
      totalDays: license.durationDays,
      contact: license.contact,
      renewalHistory: license.renewalHistory,
      version: license.version
    };
  } catch (error) {
    console.error('Error getting license status:', error);
    return {
      isValid: false,
      isExpired: true,
      isActive: false,
      error: 'Failed to read license'
    };
  }
}

/**
 * Renew license for additional days (developer only)
 */
export function renewLicense(additionalDays = 90, secretKey = null) {
  try {
    // Verify secret key (developer only)
    const RENEWAL_SECRET = process.env.LICENSE_SECRET || 'ican-renewal-secret-2025';
    
    if (secretKey !== RENEWAL_SECRET) {
      throw new Error('Invalid renewal key');
    }
    
    const license = readLicense();
    const now = new Date();
    const currentExpiration = new Date(license.expirationDate);
    
    // If expired, extend from now. Otherwise, extend from current expiration
    const baseDate = now > currentExpiration ? now : currentExpiration;
    const newExpiration = new Date(baseDate.getTime() + additionalDays * 24 * 60 * 60 * 1000);
    
    license.expirationDate = newExpiration.toISOString();
    license.isActive = true;
    license.renewalHistory.push({
      date: now.toISOString(),
      action: 'manual_renewal',
      extendedDays: additionalDays,
      previousExpiration: currentExpiration.toISOString(),
      newExpiration: newExpiration.toISOString()
    });
    
    saveLicense(license);
    
    return {
      success: true,
      message: `License renewed for ${additionalDays} days`,
      newExpirationDate: newExpiration.toISOString(),
      daysRemaining: Math.ceil((newExpiration - now) / (1000 * 60 * 60 * 24))
    };
  } catch (error) {
    console.error('Error renewing license:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Deactivate license (for testing or manual control)
 */
export function deactivateLicense(secretKey = null) {
  try {
    const RENEWAL_SECRET = process.env.LICENSE_SECRET || 'ican-renewal-secret-2025';
    
    if (secretKey !== RENEWAL_SECRET) {
      throw new Error('Invalid secret key');
    }
    
    const license = readLicense();
    license.isActive = false;
    
    license.renewalHistory.push({
      date: new Date().toISOString(),
      action: 'deactivated',
      reason: 'manual_deactivation'
    });
    
    saveLicense(license);
    
    return {
      success: true,
      message: 'License deactivated'
    };
  } catch (error) {
    console.error('Error deactivating license:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Middleware to check license on every request
 */
export function licenseMiddleware(req, res, next) {
  // Skip license check for license-related endpoints
  if (req.path.startsWith('/license/')) {
    return next();
  }
  
  // Skip for health check
  if (req.path === '/health') {
    return next();
  }
  
  const status = getLicenseStatus();
  
  if (!status.isValid) {
    return res.status(403).json({
      error: 'License expired',
      message: 'This application license has expired. Please contact the administrator to renew.',
      expirationDate: status.expirationDate,
      contact: status.contact
    });
  }
  
  // Add license status to request for logging
  req.licenseStatus = status;
  
  next();
}
