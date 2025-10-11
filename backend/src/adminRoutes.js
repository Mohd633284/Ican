import express from 'express';
import {
  listAllUsers,
  listUsersByBranch,
  getBranchUserCounts,
  deleteUserByEmail,
  deleteUserById,
  setRegistrationStatus,
  setMaxUsers,
  getBranchSettings,
  getAllBranchSettings,
} from './database.js';

const router = express.Router();

// IMPORTANT: Add authentication middleware here in production!
// This is a simple password check - in production use proper JWT or session auth
const ADMIN_PASSWORD = 'ICANAdmin2024!'; // CHANGE THIS PASSWORD!

function checkAdminAuth(req, res, next) {
  const adminPassword = req.body?.adminPassword || req.query?.adminPassword;
  
  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Unauthorized: Invalid admin password' });
  }
  
  next();
}

// ============================================
// USER MANAGEMENT ENDPOINTS
// ============================================

/**
 * GET /admin/users
 * List all users in the system
 */
router.get('/users', checkAdminAuth, (req, res) => {
  try {
    const users = listAllUsers();
    res.json({ 
      success: true,
      count: users.length,
      users 
    });
  } catch (error) {
    console.error('Failed to list users', error);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

/**
 * GET /admin/users/:branch
 * List users for a specific branch
 */
router.get('/users/:branch', checkAdminAuth, (req, res) => {
  try {
    const { branch } = req.params;
    const users = listUsersByBranch(branch);
    res.json({ 
      success: true,
      branch,
      count: users.length,
      users 
    });
  } catch (error) {
    console.error('Failed to list users by branch', error);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

/**
 * GET /admin/branch-counts
 * Get user count for each branch
 */
router.get('/branch-counts', checkAdminAuth, (req, res) => {
  try {
    const counts = getBranchUserCounts();
    res.json({ 
      success: true,
      counts 
    });
  } catch (error) {
    console.error('Failed to get branch counts', error);
    res.status(500).json({ error: 'Failed to get branch counts' });
  }
});

/**
 * DELETE /admin/user/email
 * Delete user by email (to allow them to create new account)
 * Body: { adminPassword, email }
 */
router.delete('/user/email', checkAdminAuth, (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const deletedUser = deleteUserByEmail(email);
    res.json({ 
      success: true,
      message: `User account deleted successfully. ${deletedUser.name} can now create a new account.`,
      deletedUser 
    });
  } catch (error) {
    console.error('Failed to delete user', error);
    res.status(400).json({ error: error.message || 'Failed to delete user' });
  }
});

/**
 * DELETE /admin/user/id/:userId
 * Delete user by ID
 */
router.delete('/user/id/:userId', checkAdminAuth, (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const deletedUser = deleteUserById(userId);
    res.json({ 
      success: true,
      message: `User account deleted successfully. ${deletedUser.name} can now create a new account.`,
      deletedUser 
    });
  } catch (error) {
    console.error('Failed to delete user', error);
    res.status(400).json({ error: error.message || 'Failed to delete user' });
  }
});

// ============================================
// BRANCH SETTINGS ENDPOINTS
// ============================================

/**
 * GET /admin/branch-settings
 * Get all branch settings
 */
router.get('/branch-settings', checkAdminAuth, (req, res) => {
  try {
    const settings = getAllBranchSettings();
    res.json({ 
      success: true,
      settings 
    });
  } catch (error) {
    console.error('Failed to get branch settings', error);
    res.status(500).json({ error: 'Failed to get branch settings' });
  }
});

/**
 * GET /admin/branch-settings/:branch
 * Get settings for a specific branch
 */
router.get('/branch-settings/:branch', checkAdminAuth, (req, res) => {
  try {
    const { branch } = req.params;
    const settings = getBranchSettings(branch);
    res.json({ 
      success: true,
      settings 
    });
  } catch (error) {
    console.error('Failed to get branch settings', error);
    res.status(400).json({ error: error.message || 'Failed to get branch settings' });
  }
});

/**
 * POST /admin/registration-status
 * Enable or disable registration for a branch
 * Body: { adminPassword, branch, enabled: true/false }
 */
router.post('/registration-status', checkAdminAuth, (req, res) => {
  try {
    const { branch, enabled } = req.body;
    
    if (!branch || typeof enabled !== 'boolean') {
      return res.status(400).json({ error: 'Branch and enabled status are required' });
    }
    
    const result = setRegistrationStatus(branch, enabled);
    res.json({ 
      success: true,
      message: `Registration ${enabled ? 'enabled' : 'disabled'} for ${branch} branch`,
      result 
    });
  } catch (error) {
    console.error('Failed to set registration status', error);
    res.status(400).json({ error: error.message || 'Failed to set registration status' });
  }
});

/**
 * POST /admin/max-users
 * Set maximum users allowed for a branch
 * Body: { adminPassword, branch, maxUsers: number }
 */
router.post('/max-users', checkAdminAuth, (req, res) => {
  try {
    const { branch, maxUsers } = req.body;
    
    if (!branch || typeof maxUsers !== 'number') {
      return res.status(400).json({ error: 'Branch and maxUsers (number) are required' });
    }
    
    const result = setMaxUsers(branch, maxUsers);
    res.json({ 
      success: true,
      message: `Maximum users set to ${maxUsers} for ${branch} branch`,
      result 
    });
  } catch (error) {
    console.error('Failed to set max users', error);
    res.status(400).json({ error: error.message || 'Failed to set max users' });
  }
});

export default router;
