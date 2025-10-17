import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import {
  saveInvoice,
  saveReceipt,
  listTransactions,
  getCounters,
  listBranches,
  verifyBranchCredentials,
  createUser,
  authenticateUser,
  initDatabase,
  getBranchStatistics,
  getUsersByBranch,
  deleteUserById,
} from './database.js';
import { addBranch } from './database.js';
import adminRoutes from './adminRoutes.js';
import {
  getLicenseStatus,
  renewLicense,
  deactivateLicense,
  licenseMiddleware
} from './license.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

// Mount admin routes
app.use('/admin', adminRoutes);

// Apply license middleware to all routes except license routes and health
app.use(licenseMiddleware);

function validatePayload(body, requiredFields = []) {
  if (!body || typeof body !== 'object') {
    return 'Request body must be a JSON object';
  }
  const missing = requiredFields.filter((field) => !body[field]);
  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(', ')}`;
  }
  return null;
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', counters: getCounters() });
});

// License management endpoints
app.get('/license/status', (_req, res) => {
  try {
    const status = getLicenseStatus();
    res.json({ data: status });
  } catch (error) {
    console.error('Failed to get license status', error);
    res.status(500).json({ error: 'Failed to retrieve license status' });
  }
});

app.post('/license/renew', (req, res) => {
  const { days, secretKey } = req.body || {};
  
  if (!secretKey) {
    return res.status(401).json({ error: 'Secret key required for license renewal' });
  }
  
  const additionalDays = days || 90;
  
  try {
    const result = renewLicense(additionalDays, secretKey);
    
    if (result.success) {
      res.json({ data: result });
    } else {
      res.status(403).json({ error: result.error });
    }
  } catch (error) {
    console.error('License renewal failed', error);
    res.status(500).json({ error: 'Failed to renew license' });
  }
});

app.post('/license/deactivate', (req, res) => {
  const { secretKey } = req.body || {};
  
  if (!secretKey) {
    return res.status(401).json({ error: 'Secret key required' });
  }
  
  try {
    const result = deactivateLicense(secretKey);
    
    if (result.success) {
      res.json({ data: result });
    } else {
      res.status(403).json({ error: result.error });
    }
  } catch (error) {
    console.error('License deactivation failed', error);
    res.status(500).json({ error: 'Failed to deactivate license' });
  }
});

app.get('/branches', (_req, res) => {
  try {
    const branches = listBranches();
    res.json({ data: branches });
  } catch (error) {
    console.error('Failed to list branches', error);
    res.status(500).json({ error: 'Failed to load branches' });
  }
});

app.post('/auth/branch', (req, res) => {
  const { branch, password } = req.body || {};
  if (!branch || typeof branch !== 'string' || !password) {
    return res.status(400).json({ error: 'Branch and password are required' });
  }

  try {
    const valid = verifyBranchCredentials(branch, password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ data: { branch } });
  } catch (error) {
    console.error('Branch authentication failed', error);
    res.status(500).json({ error: 'Authentication error' });
  }
});

app.post('/auth/signup', (req, res) => {
  const { name, email, phone, membershipNumber, password, branch } = req.body || {};

  if (!name || !email || !phone || !password || !branch) {
    return res.status(400).json({ error: 'Name, email, phone, password, and branch are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    const user = createUser({ name, email, phone, membershipNumber, password, branch });
    res.status(201).json({
      message: 'User created successfully',
      user: { id: user.id, name: user.name, email: user.email, branch: user.branch }
    });
  } catch (error) {
    console.error('User signup failed', error);
    res.status(400).json({ error: error.message || 'Failed to create user' });
  }
});

app.post('/auth/user', (req, res) => {
  const { email, password, branch } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Optional: Verify branch if provided
    if (branch && user.branch !== branch) {
      return res.status(403).json({ 
        error: `This account is registered to ${user.branch} branch, not ${branch}` 
      });
    }

    res.json({
      message: 'Login successful',
      userId: user.id,
      name: user.name,
      email: user.email,
      branch: user.branch
    });
  } catch (error) {
    console.error('User authentication failed', error);
    res.status(500).json({ error: 'Authentication error' });
  }
});

app.post('/invoice', (req, res) => {
  const error = validatePayload(req.body, ['organizationName', 'items']);
  if (error) {
    return res.status(400).json({ error });
  }

  try {
    const invoice = saveInvoice(req.body);
    return res.status(201).json({ data: invoice });
  } catch (err) {
    console.error('Failed to save invoice', err);
    return res.status(500).json({ error: 'Failed to save invoice' });
  }
});

// Get next invoice number
app.get('/invoice/next-number', (_req, res) => {
  try {
    const counters = getCounters();
    const nextNumber = (counters.invoices || 0) + 1;
    return res.json({ nextNumber });
  } catch (err) {
    console.error('Failed to get next invoice number', err);
    return res.status(500).json({ error: 'Failed to get next invoice number' });
  }
});

app.post('/receipt', (req, res) => {
  const error = validatePayload(req.body, ['receivedFrom']);
  if (error) {
    return res.status(400).json({ error });
  }

  try {
    const receipt = saveReceipt(req.body);
    return res.status(201).json({ data: receipt });
  } catch (err) {
    console.error('Failed to save receipt', err);
    return res.status(500).json({ error: 'Failed to save receipt' });
  }
});

// Get next receipt number
app.get('/receipt/next-number', (_req, res) => {
  try {
    const counters = getCounters();
    const nextNumber = (counters.receipts || 0) + 1;
    return res.json({ nextNumber });
  } catch (err) {
    console.error('Failed to get next receipt number', err);
    return res.status(500).json({ error: 'Failed to get next receipt number' });
  }
});

app.get('/transactions', (_req, res) => {
  try {
    const transactions = listTransactions();
    return res.json({ data: transactions });
  } catch (err) {
    console.error('Failed to fetch transactions', err);
    return res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.get('/dashboard/:branch', (req, res) => {
  const { branch } = req.params;
  
  if (!branch) {
    return res.status(400).json({ error: 'Branch name is required' });
  }

  try {
    const statistics = getBranchStatistics(branch);
    return res.json({ data: statistics });
  } catch (err) {
    console.error('Failed to fetch branch statistics', err);
    return res.status(500).json({ error: 'Failed to fetch branch statistics' });
  }
});

// Get all members/users for a specific branch
app.get('/members/:branch', (req, res) => {
  const { branch } = req.params;
  
  if (!branch) {
    return res.status(400).json({ error: 'Branch name is required' });
  }

  try {
    const members = getUsersByBranch(branch);
    return res.json({ 
      data: members,
      count: members.length 
    });
  } catch (err) {
    console.error('Failed to fetch members', err);
    return res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Delete a member (Admin/Branch access only - requires branch password verification)
app.delete('/members/:branch/:userId', (req, res) => {
  const { branch, userId } = req.params;
  const { password } = req.body || {};
  
  if (!branch || !userId) {
    return res.status(400).json({ error: 'Branch name and user ID are required' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Branch password is required for this action' });
  }

  try {
    // Verify branch credentials first (security check)
    const isValid = verifyBranchCredentials(branch, password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid branch credentials' });
    }

    // Delete the user
    deleteUserById(parseInt(userId), branch);
    return res.json({ 
      success: true,
      message: 'Member deleted successfully' 
    });
  } catch (err) {
    console.error('Failed to delete member', err);
    return res.status(500).json({ error: err.message || 'Failed to delete member' });
  }
});

app.post('/branches', (req, res) => {
  const { name, password } = req.body || {};
  console.log('/branches POST body:', req.body);
  if (!name || !password) {
    return res.status(400).json({ error: 'Name and password are required' });
  }
  try {
    const branch = addBranch(name, password);
    return res.status(201).json({ data: branch });
  } catch (err) {
    console.error('Failed to add branch', err && err.stack ? err.stack : err);
    // Include stack for local debugging
    return res.status(500).json({ error: err.message || 'Failed to add branch', stack: err.stack });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled error', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
