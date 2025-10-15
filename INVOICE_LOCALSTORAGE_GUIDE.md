# Invoice Local Storage Guide

## 🎯 Overview
The Invoice Page now saves data to your **device's browser storage** (localStorage) automatically. This means your invoices are saved locally on your computer or phone, not on a remote server.

## ✨ Features

### 1. **Auto-Save to Device Storage**
- Every time you click "Save Invoice", "Export PDF", or "Export JPEG", the invoice data is automatically saved to your browser's localStorage
- Data persists even after closing the browser
- No internet connection required
- No backend server needed

### 2. **Auto-Load Previous Invoice**
- When you open the Invoice Page, it automatically loads the last saved invoice
- All fields are restored: customer info, items, dates, amounts, etc.
- You can continue editing where you left off

### 3. **Multiple Invoice Storage**
- Each invoice is saved with its receipt number
- You can store multiple invoices
- Updating an existing receipt number will update that invoice

## 📱 How It Works

### Saving an Invoice

**Option 1: Click "Save Invoice" button**
```
✅ Invoice saved successfully to your device storage!
You can retrieve it anytime from your browser.
```

**Option 2: Export as PDF or JPEG**
- Invoice is automatically saved before exporting
- Both the file and data are saved to your device

### What Gets Saved?

```javascript
{
  receiptNumber: 1,
  organizationName: "ICAN Minna",
  date: "2025-10-14",
  customerName: "John Doe",
  customerAddress: "123 Main St",
  items: [
    { description: "Item 1", quantity: 1, price: 1000 },
    { description: "Item 2", quantity: 2, price: 500 }
  ],
  subtotal: 2000,
  grandTotal: 2000,
  savedAt: "2025-10-14T10:30:00Z"
}
```

## 🔍 Storage Locations

### Browser localStorage
- **Location**: `localStorage.ican_invoices` (all invoices)
- **Location**: `localStorage.ican_current_invoice` (last edited invoice)

### Downloaded Files
When you export:
- **PDF**: Downloads to your device's Downloads folder
- **JPEG**: Downloads to your device's Downloads folder

## 📊 Storage Limits

- **Browser localStorage**: Typically 5-10 MB per domain
- **Approximate capacity**: 50-100 invoices (depending on item count)
- **Files**: Limited only by your device storage

## 🛠️ Developer Notes

### Accessing Saved Invoices (Browser Console)

```javascript
// Get all saved invoices
const invoices = JSON.parse(localStorage.getItem('ican_invoices'));
console.log(invoices);

// Get current invoice
const currentInvoice = JSON.parse(localStorage.getItem('ican_current_invoice'));
console.log(currentInvoice);

// Clear all invoices
localStorage.removeItem('ican_invoices');
localStorage.removeItem('ican_current_invoice');
```

### Data Structure

```typescript
interface Invoice {
  receiptNumber: number;
  organizationName: string;
  address: string;
  date: string; // ISO date format
  lpo: string;
  customerName: string;
  customerAddress: string;
  items: Array<{
    id: number;
    description: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  taxEnabled: boolean;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
  sumOf: string; // Amount in words (line 1)
  sumOf2: string; // Amount in words (line 2)
  savedAt: string; // ISO timestamp
}
```

## 🔒 Privacy & Security

### ✅ Advantages
- **Privacy**: Data stays on your device, never sent to external servers
- **Offline**: Works without internet connection
- **Fast**: Instant save and load
- **Free**: No server costs

### ⚠️ Considerations
- **Browser-specific**: Data is tied to the browser you use
- **Device-specific**: Data doesn't sync across devices
- **Clear data**: Clearing browser data will delete saved invoices
- **No backup**: Make sure to export important invoices as PDF/JPEG

## 💡 Best Practices

### 1. **Regular Exports**
- Export important invoices as PDF or JPEG
- Store exported files in a safe location
- Use cloud storage (Google Drive, OneDrive) for backups

### 2. **Receipt Numbering**
- Use the "Auto Receipt #" toggle for sequential numbering
- Each receipt number creates or updates that invoice

### 3. **Browser Compatibility**
- Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Android Chrome) fully supported

### 4. **Storage Management**
- If you notice performance issues, export old invoices and clear localStorage
- Keep only active invoices in browser storage

## 🔧 Troubleshooting

### Issue: "Failed to save invoice"
**Solution**: 
- Check browser settings - localStorage must be enabled
- Clear browser cache if storage is full
- Try using a different browser

### Issue: Invoice doesn't load on refresh
**Solution**:
- Check if localStorage is enabled in browser settings
- Look for private/incognito mode (localStorage is limited)
- Check browser console for errors (F12 → Console)

### Issue: Cannot export PDF/JPEG
**Solution**:
- Check browser permissions for downloads
- Ensure popup blockers aren't interfering
- Try a different browser

## 📈 Future Enhancements

Potential features for future versions:
- Export all invoices as JSON backup
- Import invoices from JSON file
- Search and filter saved invoices
- Print invoice history report
- Cloud sync option (optional)

## 🎓 User Guide

### For Regular Users

**To Create and Save an Invoice:**
1. Fill in customer details
2. Add items with descriptions and prices
3. Click "Save Invoice" button
4. Data is saved to your device automatically

**To Export an Invoice:**
1. Fill in the invoice
2. Click "Export PDF" or "Export JPEG"
3. File downloads to your Downloads folder
4. Invoice data is also saved to your device

**To Continue Previous Invoice:**
1. Open the Invoice Page
2. Previous invoice loads automatically
3. Edit and save changes

**To Clear an Invoice:**
1. Refresh the page (F5)
2. Fill in new details
3. Previous data remains saved in background

---

## 📞 Support

For issues or questions:
- Check browser console (F12) for error messages
- Ensure localStorage is enabled in browser settings
- Try exporting invoices before clearing browser data

**Remember**: Always export important invoices as PDF or JPEG files for permanent records!
