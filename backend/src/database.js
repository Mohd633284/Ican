import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import initSqlJs from 'sql.js';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../data/app.db');

let db = null;
let SQL = null;

function saveDb() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

export async function initDatabase() {
  SQL = await initSqlJs();
  
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  let buffer;
  if (fs.existsSync(DB_PATH)) {
    buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
    
    db.run('CREATE TABLE IF NOT EXISTS counters (key TEXT PRIMARY KEY, value INTEGER NOT NULL)');
    db.run('CREATE TABLE IF NOT EXISTS invoices (id INTEGER PRIMARY KEY AUTOINCREMENT, number TEXT UNIQUE NOT NULL, date TEXT NOT NULL, total REAL NOT NULL, payload TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP)');
    db.run('CREATE TABLE IF NOT EXISTS receipts (id INTEGER PRIMARY KEY AUTOINCREMENT, number TEXT UNIQUE NOT NULL, date TEXT NOT NULL, amount REAL NOT NULL, payload TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP)');
    db.run('CREATE TABLE IF NOT EXISTS branches (name TEXT PRIMARY KEY, password_hash TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP)');
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, phone TEXT NOT NULL, membership_number TEXT, password_hash TEXT NOT NULL, branch TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (branch) REFERENCES branches(name))');
    
    const branches = ['Minna', 'Kaduna', 'Oyo', 'Kano', 'Sokoto'];
    const defaultPassword = 'ican2024';
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(defaultPassword, salt);
    
    for (const branch of branches) {
      db.run('INSERT INTO branches (name, password_hash) VALUES (?, ?)', [branch, hash]);
    }
    
    db.run('INSERT INTO counters (key, value) VALUES (?, ?)', ['invoice', 0]);
    db.run('INSERT INTO counters (key, value) VALUES (?, ?)', ['receipt', 0]);
    
    saveDb();
  }

  console.log('Database initialized at', DB_PATH);
}

function ensureCounter(key) {
  const result = db.exec('SELECT value FROM counters WHERE key = ?', [key]);
  if (!result || result.length === 0 || result[0].values.length === 0) {
    db.run('INSERT INTO counters (key, value) VALUES (?, ?)', [key, 0]);
    saveDb();
    return 0;
  }
  return result[0].values[0][0];
}

function getNextNumber(key) {
  const current = ensureCounter(key);
  const next = current + 1;
  db.run('UPDATE counters SET value = ? WHERE key = ?', [next, key]);
  saveDb();
  return next;
}

function coerceNumber(num) {
  if (typeof num === 'string') {
    const parsed = parseInt(num, 10);
    return isNaN(parsed) ? null : parsed;
  }
  return typeof num === 'number' ? num : null;
}

function maybeAdvanceCounter(key, num) {
  const coerced = coerceNumber(num);
  if (coerced !== null) {
    const current = ensureCounter(key);
    if (coerced > current) {
      db.run('UPDATE counters SET value = ? WHERE key = ?', [coerced, key]);
      saveDb();
    }
  }
}

export function saveInvoice(invoice) {
  const payload = JSON.stringify(invoice);
  const number = invoice.number || String(getNextNumber('invoice')).padStart(6, '0');
  
  maybeAdvanceCounter('invoice', number);
  
  db.run('INSERT INTO invoices (number, date, total, payload) VALUES (?, ?, ?, ?)', [
    number,
    invoice.date,
    invoice.total,
    payload
  ]);
  saveDb();
  
  const result = db.exec('SELECT * FROM invoices WHERE number = ?', [number]);
  if (result && result.length > 0 && result[0].values.length > 0) {
    const row = result[0].values[0];
    return {
      id: row[0],
      number: row[1],
      date: row[2],
      total: row[3],
      payload: row[4],
      created_at: row[5]
    };
  }
  return null;
}

export function saveReceipt(receipt) {
  const payload = JSON.stringify(receipt);
  const number = receipt.number || String(getNextNumber('receipt')).padStart(6, '0');
  
  maybeAdvanceCounter('receipt', number);
  
  db.run('INSERT INTO receipts (number, date, amount, payload) VALUES (?, ?, ?, ?)', [
    number,
    receipt.date,
    receipt.amount,
    payload
  ]);
  saveDb();
  
  const result = db.exec('SELECT * FROM receipts WHERE number = ?', [number]);
  if (result && result.length > 0 && result[0].values.length > 0) {
    const row = result[0].values[0];
    return {
      id: row[0],
      number: row[1],
      date: row[2],
      amount: row[3],
      payload: row[4],
      created_at: row[5]
    };
  }
  return null;
}

export function listTransactions() {
  const sql = "SELECT 'invoice' as type, number, date, total as amount, created_at FROM invoices UNION ALL SELECT 'receipt' as type, number, date, amount, created_at FROM receipts ORDER BY created_at DESC";
  
  const result = db.exec(sql);
  if (!result || result.length === 0) {
    return [];
  }
  
  const rows = result[0].values;
  return rows.map(row => ({
    type: row[0],
    number: row[1],
    date: row[2],
    amount: row[3],
    created_at: row[4]
  }));
}

export function getCounters() {
  const result = db.exec('SELECT key, value FROM counters');
  if (!result || result.length === 0) {
    return {};
  }
  
  const counters = {};
  for (const row of result[0].values) {
    counters[row[0]] = row[1];
  }
  return counters;
}

export function listBranches() {
  const result = db.exec('SELECT name FROM branches');
  if (!result || result.length === 0) {
    return [];
  }
  
  return result[0].values.map(row => row[0]);
}

export function addBranch(name, password) {
  if (!name || !password) {
    throw new Error('Name and password are required');
  }
  // check existence using helper
  const existingBranches = listBranches();
  if (existingBranches.includes(name)) {
    throw new Error('Branch already exists');
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  db.run('INSERT INTO branches (name, password_hash) VALUES (?, ?)', [name, hash]);
  saveDb();
  return { name };
}

export function verifyBranchCredentials(branchName, password) {
  const result = db.exec('SELECT password_hash FROM branches WHERE name = ?', [branchName]);
  if (!result || result.length === 0 || result[0].values.length === 0) {
    return false;
  }
  
  const hash = result[0].values[0][0];
  return bcrypt.compareSync(password, hash);
}

export function createUser(userData) {
  const { name, email, phone, membershipNumber, password, branch } = userData;
  
  // Check if email already exists
  const existingUser = db.exec('SELECT id FROM users WHERE email = ?', [email]);
  if (existingUser && existingUser.length > 0 && existingUser[0].values.length > 0) {
    throw new Error('Email already registered');
  }
  
  // Check if branch exists
  const existingBranch = db.exec('SELECT name FROM branches WHERE name = ?', [branch]);
  if (!existingBranch || existingBranch.length === 0 || existingBranch[0].values.length === 0) {
    throw new Error('Invalid branch');
  }
  
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  
  const result = db.run(
    'INSERT INTO users (name, email, phone, membership_number, password_hash, branch) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, phone, membershipNumber || null, hash, branch]
  );
  
  saveDb();
  return { id: result.insertId, name, email, branch };
}

export function authenticateUser(email, password) {
  // Find user by email
  const result = db.exec(
    'SELECT id, name, email, phone, membership_number, password_hash, branch FROM users WHERE email = ?',
    [email]
  );
  
  if (!result || result.length === 0 || result[0].values.length === 0) {
    return null;
  }
  
  const user = result[0].values[0];
  const hash = user[5]; // password_hash
  
  if (!bcrypt.compareSync(password, hash)) {
    return null;
  }
  
  return {
    id: user[0],
    name: user[1],
    email: user[2],
    phone: user[3],
    membershipNumber: user[4],
    branch: user[6]
  };
}
