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
  initDatabase,
} from './database.js';
import { addBranch } from './database.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

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

app.get('/transactions', (_req, res) => {
  try {
    const transactions = listTransactions();
    return res.json({ data: transactions });
  } catch (err) {
    console.error('Failed to fetch transactions', err);
    return res.status(500).json({ error: 'Failed to fetch transactions' });
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
