# Backend API

Node.js + Express backend that persists invoices and receipts using a SQLite database.

## Prerequisites

- Node.js 18 or newer (tested with Node 24)
- npm 9+
- Build tools required by [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3).
  - On Windows install the **Python 3** runtime and the **MSVC Build Tools** (or run `npm install --global --production windows-build-tools`).

## Setup

```powershell
cd backend
npm install
```

> **Note:** If `npm install` fails with a Python-related error, point npm to your Python executable, e.g.
>
> ```powershell
> npm config set python "C:\\Path\\To\\python.exe"
> npm install
> ```

## Running the API

```powershell
npm run dev
```

The server starts on port `4000` by default. Override with the `PORT` environment variable.

## API Endpoints

### `POST /invoice`

Persist an invoice. If the request omits `number`, the backend issues the next available number and advances the counter.

**Body (example)**

```json
{
  "organizationName": "Golden Printer",
  "address": "123 Example Street",
  "phone": "+234-800-000-0000",
  "date": "2025-10-09",
  "items": [
    { "description": "Printer paper", "quantity": 10, "price": 500 }
  ],
  "subtotal": 5000,
  "taxAmount": 375,
  "grandTotal": 5375
}
```

**Response**

```json
{
  "data": {
    "id": 1,
    "number": 1,
    "date": "2025-10-09",
    "total": 5375,
    "payload": { "...": "original request body" },
    "created_at": "2025-10-09T19:25:00.000Z",
    "type": "invoice"
  }
}
```

### `POST /receipt`

Persist a receipt. Auto-numbering works the same way as invoices.

```json
{
  "receivedFrom": "Amina Yusuf",
  "date": "2025-10-09",
  "amount": 48000,
  "paymentFor": "Membership renewal",
  "naira": 48000,
  "kobo": 0
}
```

### `GET /transactions`

Returns all saved invoices and receipts (sorted newest first). Useful for powering the statistics view.

```json
{
  "data": [
    {
      "id": 2,
      "type": "receipt",
      "number": 1,
      "date": "2025-10-09",
      "amount": 48000,
      "payload": { "...": "receipt body" },
      "created_at": "2025-10-09T19:27:00.000Z"
    }
  ]
}
```

### `GET /health`

Returns service status plus the current invoice/receipt counters.

### `GET /branches`

Lists the available branch names users can select during login.

### `POST /auth/branch`

Verifies a branch password. Provide `{ "branch": "Minna Branch", "password": "minna@ican" }` and the API responds with the branch on success (HTTP 200) or `401` if the password is incorrect.

Passwords are stored as salted bcrypt hashes in the SQLite database. Default branch records are seeded automatically the first time the server runs; update them by replacing the seed list or inserting new rows in the `branches` table.

## Database Location

SQLite data is stored in `backend/data/app.db`. Auto-number counters live in the `counters` table and survive restarts.
