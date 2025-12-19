/**
 * ICAN Service - Standalone Implementation
 * Provides offline-capable services using LocalStorage
 * Replaces the dependency on the parent project for standalone builds
 */

const STORAGE_KEYS = {
  BRANCHES: 'ican_branches',
  USERS: 'ican_users',
  INVOICES: 'ican_invoices',
  RECEIPTS: 'ican_receipts',
  COUNTERS: 'ican_counters',
  SIGNATURES: 'ican_signatures'
};

// --- Helper Functions ---
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getStorage = (key, defaultVal = []) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// --- ICAN Seed Service ---
export const ICANSeedService = {
  async forceReseedAllNigerianStates() {
    await delay(1000); // Simulate network
    const nigerianStates = [
      "Abia State", "Adamawa State", "Akwa Ibom State", "Anambra State", 
      "Bauchi State", "Bayelsa State", "Benue State", "Borno State", 
      "Cross River State", "Delta State", "Ebonyi State", "Edo State", 
      "Ekiti State", "Enugu State", "FCT Abuja State", "Gombe State", 
      "Imo State", "Jigawa State", "Kaduna State", "Kano State", 
      "Katsina State", "Kebbi State", "Kogi State", "Kwara State", 
      "Lagos State", "Nasarawa State", "Niger State", "Ogun State", 
      "Ondo State", "Osun State", "Oyo State", "Plateau State", 
      "Rivers State", "Sokoto State", "Taraba State", "Yobe State", 
      "Zamfara State"
    ];

    const branches = nigerianStates.map((state, index) => ({
      id: `branch_${index + 1}`,
      name: state,
      location: state,
      createdAt: new Date().toISOString()
    }));

    setStorage(STORAGE_KEYS.BRANCHES, branches);
    console.log('✅ Seeded branches to LocalStorage');
    return branches;
  },

  async seedDefaultBranches() {
    const branches = getStorage(STORAGE_KEYS.BRANCHES);
    if (branches.length === 0) {
      return await this.forceReseedAllNigerianStates();
    }
  }
};

// --- ICAN Branch Service ---
export const ICANBranchService = {
  async getAllBranches() {
    await delay(800);
    let branches = getStorage(STORAGE_KEYS.BRANCHES);
    
    // Auto-seed if empty
    if (branches.length === 0) {
      return await ICANSeedService.forceReseedAllNigerianStates();
    }
    return branches;
  },

  async testFirebaseConnection() {
    // For the standalone LocalStorage version, simulate a connection test
    await delay(500);
    try {
      const branches = getStorage(STORAGE_KEYS.BRANCHES);
      const branchNames = branches.map(b => b.name).sort();
      
      console.log('🔍 Testing Firebase connection (LocalStorage mode)...');
      console.log('🔍 Connection test successful!', { 
        branchCount: branches.length, 
        branches: branchNames.slice(0, 5)
      });
      
      return {
        connected: true,
        branches: branchNames
      };
    } catch (error) {
      console.error('🔍 Connection test failed:', error);
      return {
        connected: false,
        branches: [],
        error: error.message
      };
    }
  },

  async verifyBranchCredentials(branchName, password) {
    await delay(1000);
    // Simulation: Any password longer than 3 chars works for now
    if (password && password.length >= 3) {
      const branches = await this.getAllBranches();
      const branch = branches.find(b => b.name === branchName);
      if (branch) return branch;
    }
    return null;
  },

  async createBranch(branchData) {
    await delay(800);
    const branches = getStorage(STORAGE_KEYS.BRANCHES);
    const newBranch = {
        id: `branch_${Date.now()}`,
        ...branchData,
        createdAt: new Date().toISOString()
    };
    branches.push(newBranch);
    setStorage(STORAGE_KEYS.BRANCHES, branches);
    return newBranch.id;
  }
};

// --- ICAN User Service ---
export const ICANUserService = {
  async findUser(email, branchId) {
    await delay(600);
    const users = getStorage(STORAGE_KEYS.USERS);
    return users.find(u => u.email === email && u.branchId === branchId) || null;
  },

  async authenticateUser(email, branchId) {
      return this.findUser(email, branchId);
  },
  
  async getUserByEmailAndBranch(email, branchId) {
      return this.findUser(email, branchId);
  },

  async getUsersByBranch(branchId) {
      const users = getStorage(STORAGE_KEYS.USERS);
      return users.filter(u => u.branchId === branchId);
  },

  async createUser(userData) {
    await delay(800);
    const users = getStorage(STORAGE_KEYS.USERS);
    const newUser = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    setStorage(STORAGE_KEYS.USERS, users);
    return newUser.id;
  },

  async updateUser(userId, updates) {
    await delay(500);
    const users = getStorage(STORAGE_KEYS.USERS);
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      setStorage(STORAGE_KEYS.USERS, users);
      return true;
    }
    return false;
  },

  async isEmailUsedForBranchLogin(email) {
      const users = getStorage(STORAGE_KEYS.USERS);
      return users.some(u => u.email === email && u.isBranchUser);
  },

  async resetUserPassword(userId, newPassword, adminEmail) {
      return this.updateUser(userId, { password: newPassword });
  }
};

// --- ICAN Counter Service ---
export const ICANCounterService = {
  async getNextCounter(type, branchId) {
      await delay(200);
      const counters = getStorage(STORAGE_KEYS.COUNTERS, {});
      const key = `${branchId}_${type}`;
      const current = counters[key] || 0;
      const next = current + 1;
      
      counters[key] = next;
      setStorage(STORAGE_KEYS.COUNTERS, counters);
      return next;
  },

  async getMemberCount(branchId) {
      await delay(200);
      const users = getStorage(STORAGE_KEYS.USERS);
      // Count members in this branch
      return users.filter(u => u.branchId === branchId && u.isMember).length;
  },
  
  async incrementMemberCount(branchId) {
      // Logic handled by getting real count
      return true;
  }
};

// --- ICAN Invoice Service ---
export const ICANInvoiceService = {
  async createInvoice(invoiceData) {
    await delay(800);
    const invoices = getStorage(STORAGE_KEYS.INVOICES);
    
    // Auto-generate ID if not present
    const id = invoiceData.id || `INV-${Date.now()}`;
    
    const newInvoice = {
      ...invoiceData,
      id,
      createdAt: new Date().toISOString()
    };
    invoices.push(newInvoice);
    setStorage(STORAGE_KEYS.INVOICES, invoices);
    return newInvoice.id;
  },

  async getInvoicesByBranch(branchId, limit = 50) {
    await delay(600);
    const invoices = getStorage(STORAGE_KEYS.INVOICES);
    return invoices
        .filter(inv => inv.branchId === branchId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
  }
};

// --- ICAN Receipt Service ---
export const ICANReceiptService = {
  async createReceipt(receiptData) {
    await delay(800);
    const receipts = getStorage(STORAGE_KEYS.RECEIPTS);
    const newReceipt = {
      ...receiptData,
      id: receiptData.id || `REC-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    receipts.push(newReceipt);
    setStorage(STORAGE_KEYS.RECEIPTS, receipts);
    return newReceipt.id;
  },

  async getReceiptsByBranch(branchId, limit = 50) {
    await delay(600);
    const receipts = getStorage(STORAGE_KEYS.RECEIPTS);
    return receipts
        .filter(r => r.branchId === branchId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
  }
};

// --- ICAN Stats Service (for legacy compatibility) ---
export const ICANStatsService = {
    async getBranchStatistics(branchId) {
        const invoices = await ICANInvoiceService.getInvoicesByBranch(branchId, 10);
        const receipts = await ICANReceiptService.getReceiptsByBranch(branchId, 10);
        return {
            recentInvoices: invoices,
            recentReceipts: receipts
        };
    }
};


export const ICANFirebaseService = {
    // Placeholder for direct firebase access if needed
    db: null,
    auth: null
};

// Export a default object for convenience
export default {
  ICANBranchService,
  ICANUserService,
  ICANSeedService,
  ICANCounterService,
  ICANInvoiceService,
  ICANReceiptService,
  ICANStatsService
};
