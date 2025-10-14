<template>
  <div class="h-screen overflow-y-auto flex flex-col gap-6 items-center bg-slate-100 dark:bg-slate-900 py-8 px-4">
    <section class="w-full max-w-4xl bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 mb-6 border border-slate-200 dark:border-slate-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Invoice</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">Create and manage your invoices</p>
          </div>
        </div>
        <div class="flex gap-3 flex-wrap">
          <BaseButton variant="secondary" @click="handleSaveInvoice" :disabled="isExporting || isSaving">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
            </svg>
            {{ isSaving ? 'Saving...' : 'Save Invoice' }}
          </BaseButton>
          <BaseButton variant="secondary" @click="handleExportJPEG" :disabled="isExporting">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            {{ isExporting && exportType === 'jpeg' ? 'Exporting...' : 'Export JPEG' }}
          </BaseButton>
          <BaseButton @click="handleExportPDF" :disabled="isExporting">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            {{ isExporting && exportType === 'pdf' ? 'Exporting...' : 'Export PDF' }}
          </BaseButton>
          <BaseButton variant="secondary" @click="handleBack">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Dashboard
          </BaseButton>
        </div>
      </div>
    </section>

    <section class="w-full max-w-4xl flex items-center justify-center">
      <div
        ref="invoiceRef"
        id="meblink-invoice"
        class="relative bg-white shadow-2xl border border-slate-200 dark:border-slate-700 rounded-2xl p-6"
        :style="{ width: a5Width, minHeight: a5Height }"
      >
         <!-- Header -->
        <div class="text-center border-b pb-2 mb-2">
          <div class="flex items-center ">
            <!-- Logo (Fixed - Developer Only) -->
            <div v-if="logoDataUrl" class="flex justify-center ">
              <img :src="logoDataUrl" alt="ICAN Logo" class="h-[120px]  object-contain" @error="logoDataUrl = null" />
            </div>
            
          
                            <!-- Organization Name (Fixed - Developer Only) -->
            <div class="w-auto">
              <h2 class="text-blue-800 text-xl  font-bold uppercase text-left" style="font-family: 'Arial Narrow', 'Roboto Condensed', 'Oswald', sans-serif; font-weight: 900; letter-spacing: -0.5px;">
              Institute of Chartered Accountants  of Nigeria (ICAN)
              </h2>
              <p class="text-[12px] text-left">Established by Act of Parliament No. 15 of (1965) Minna and District Society</p>
          </div>
          

        <div class="pl-5 border-solid border-l-[2px]">
            <!-- Address (Fixed - Developer Only) -->
          <p class="text-xs text-left ">
            {{ organizationAddress }}
          </p>
          
          <!-- Phone (Fixed - Developer Only) -->
          <p class="text-xs text-left mt-2 font-bold">
            Tel: {{ organizationPhone }}
          </p>
        </div>

              </div>
          <!-- Receipt Title -->
          <div class="flex justify-end items-center">
            <p class="text-sm font-semibold mr-40 bg-red-500 text-white inline-block px-3 py-1 rounded">
              CASH/CREDIT INVOICE
            </p>
            
            <div></div>
            <div class="flex items-center gap-1">
                 <span>No.:</span>
              <input
                v-model.number="receiptNumber"
                :disabled="autoReceiptNumber"
                type="number"
                min="1"
                class="w-16 bg-transparent border-none focus:outline-none text-right"
              />
              </div>
          </div>
          </div>

        <!-- Customer details -->
        <div class="mt-4 grid grid-cols-3 gap-4">
          <div class="border-[2px] col-span-2 rounded-xl p-2">
            <div class="flex items-center gap-1">
            <span class="text-xs text-slate-400 font-medium">Name:</span>
            <input
              v-model="customerName"
              placeholder=" "
              class="flex-1 bg-transparent border-b border-dotted border-gray-400 focus:outline-none"
            />
          </div>

          <div class="flex items-center gap-1">
            <span class="text-xs text-slate-400 font-medium">Address:</span>
            <input
              v-model="customerAddress"
              placeholder=" "
              class="flex-1 bg-transparent border-b border-dotted border-gray-400 focus:outline-none"
            />
          </div>
          </div>

          <div class="border-[2px] rounded-xl p-2">
            <div class="flex items-center gap-1">
           <span class="text-xs text-slate-400 font-medium">Date:</span>
                <input
                  v-model="date"
                  type="date"
                  :disabled="autoDate"
                  class="bg-transparent border-none focus:outline-none text-sm"
                />
          </div>

          <div class="flex items-center gap-1">
            <span class="text-xs text-slate-400 font-medium whitespace-nowrap">L.P.O No.:</span>
            <input
              v-model="lpo"
              placeholder=" "
              class="flex-1 bg-transparent border-b border-dotted border-gray-400 focus:outline-none"
            />
          </div>
          </div>


         
        </div>

        <!-- Table -->
        <div class="mt-4 overflow-visible rounded">
          <table class="w-full text-sm table-fixed border-collapse overflow-visible">
            <thead class="bg-blue-800 text-white uppercase text-xs">
              <tr>
                <th class="w-1/12 px-2 py-1.5 border text-center">QTY</th>
                <th class="w-6/12 px-2 py-1.5 border text-left">DESCRIPTION OF GOODS</th>
                <th class="w-2/12 px-2 py-1.5 border text-center">RATE</th>
                <th class="w-3/12 px-2 py-1.5 border text-center">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="item.id" class="border-t hover:bg-slate-50 transition-colors group">
                <td class="px-2 py-1 text-center align-top">
                  <span class="font-medium text-slate-700">{{ index + 1 }}</span>
                </td>
                <td class="px-2 py-1 align-top">
                  <textarea 
                    v-model="item.description" 
                    placeholder="Description" 
                    rows="1"
                    class="w-full bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1 py-0.5 resize-none overflow-hidden leading-tight" 
                    @input="autoResize($event)"
                  ></textarea>
                </td>
                <td class="px-2 py-1 text-right align-top">
                  <input 
                    v-model.number="item.price" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    class="w-full text-right bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1 py-0.5" 
                  />
                </td>
                <td class="px-2 py-1 text-right font-semibold align-top relative overflow-visible">
                  {{ toCurrency(item.quantity * item.price) }}
                  <!-- Delete button absolutely positioned on right edge -->
                  <button 
                    v-if="items.length > 1"
                    @click="removeItem(item.id)" 
                    class="absolute right-[-13px] top-1/2 -translate-y-1/2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-200 w-5 h-5 flex items-center justify-center text-lg font-bold hover:scale-110 z-50"
                    title="Remove item"
                  >
                    ×
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-3 flex justify-between items-center text-xs text-slate-600">
          <button 
            class="text-emerald-600 hover:text-emerald-700 font-medium transition-colors flex items-center gap-1" 
            @click="addItem"
          >
            <span class="text-lg">+</span> Add Line
          </button>
          <div class="w-56 space-y-1">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span class="font-medium">{{ toCurrency(subtotal) }}</span>
            </div>
            <div class="flex justify-between mt-1">
              <label class="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="taxEnabled" 
                  class="cursor-pointer accent-emerald-600" 
                /> 
                Apply Tax ({{ taxRate }}%)
              </label>
              <span class="font-medium">{{ toCurrency(taxAmount) }}</span>
            </div>
            <div class="flex justify-between mt-2 font-bold text-slate-900 text-base border-t pt-2">
              <span>TOTAL ₦</span>
              <span>{{ toCurrency(grandTotal) }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-6 grid grid-cols-3 gap-4 text-xs">
          <div>
            <div class="mb-1 text-slate-500 font-medium">Amount in Words</div>
            <div class="p-2 border border-slate-200 rounded bg-slate-50 text-slate-700 min-h-[3rem] flex items-center">
              {{ amountInWords.words }}
            </div>
          </div>

          <div class="col-span-2 flex flex-col justify-end">
            <div class="flex justify-between items-center gap-4">
              <div class="text-xs flex-1">
                <div class="font-medium text-slate-600 mb-1">Customer's Signature</div>
                <input 
                  v-model="customerSign" 
                  placeholder="Sign here" 
                  class="w-full p-2 border-b border-slate-300 bg-transparent focus:outline-none focus:border-emerald-500 transition-colors" 
                />
              </div>
              <div class="text-xs flex-1">
                <div class="font-medium text-slate-600 mb-1">For: Meblink Pharmaceuticals Ltd.</div>
                <input 
                  v-model="managerSign" 
                  placeholder="Manager's Sign" 
                  class="w-full p-2 border-b border-slate-300 bg-transparent focus:outline-none focus:border-emerald-500 transition-colors" 
                />
              </div>
            </div>
            <div class="mt-3 text-emerald-600 text-center font-medium">Thanks for your patronage</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import BaseButton from '@/components/BaseButton.vue';
import html2pdf from 'html2pdf.js';
import * as htmlToImage from 'html-to-image';
import { API_BASE } from '../api.js';

export default defineComponent({
  name: 'MeblinkInvoice',
  components: { BaseButton },
  setup() {
    const invoiceRef = ref(null);
    const isExporting = ref(false);
    const exportType = ref('');
    const isSaving = ref(false);

    // A5 landscape dimensions in inches (width x height)
    const a5Width = '8.27in';
    const a5Height = '5.83in';

    // reactive fields
    const organizationName = ref('Meblink Pharmaceuticals Ltd.');
    const address = ref('Pharmaceuticals, Hospital and Surgical Equipment...');
    const date = ref(new Date().toISOString().split('T')[0]);
    const autoDate = ref(true);
    const lpo = ref('');
    const receivedFrom = ref('');
    const customerName = ref('');
    const customerAddress = ref('');
    const customerSign = ref('');
    const managerSign = ref('');
    const taxEnabled = ref(false);
    const taxRate = ref(7.5);
    const receiptNumber = ref(1);
    const autoReceiptNumber = ref(true);

    // Fixed organization details (Developer only - users cannot change these)
    const organizationAddress = ref('Federal University of Technology, Bosso Campus, Minna');
    const organizationPhone = ref('+234 1 234 5678');

    // Logo data (Developer can set default logos here)
    const logoDataUrl = ref('/images/ican-logo.png'); // Main org logo

    const items = ref([
      { id: 1, description: '', quantity: 1, price: 0.0 },
      { id: 2, description: '', quantity: 1, price: 0.0 },
      { id: 3, description: '', quantity: 1, price: 0.0 },
    ]);

    const addItem = () => {
      items.value.push({ id: Date.now(), description: '', quantity: 1, price: 0 });
    };

    const removeItem = (id) => {
      if (items.value.length > 1) {
        items.value = items.value.filter(item => item.id !== id);
      }
    };

    const subtotal = computed(() =>
      items.value.reduce((sum, it) => sum + (Number(it.quantity) || 1) * (Number(it.price) || 0), 0)
    );

    const taxAmount = computed(() => (taxEnabled.value ? (subtotal.value * (Number(taxRate.value) || 0)) / 100 : 0));

    const grandTotal = computed(() => subtotal.value + taxAmount.value);

    function toCurrency(value) {
      return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value || 0);
    }

    // amount in words helper (simple)
    function numberToWords(n) {
      if (n === 0) return 'zero';
      const a = [
        '',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
        'ten',
        'eleven',
        'twelve',
        'thirteen',
        'fourteen',
        'fifteen',
        'sixteen',
        'seventeen',
        'eighteen',
        'nineteen',
      ];
      const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

      function inWords(num) {
        if (num < 20) return a[num];
        if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? '-' + a[num % 10] : '');
        if (num < 1000) return a[Math.floor(num / 100)] + ' hundred' + (num % 100 ? ' and ' + inWords(num % 100) : '');
        if (num < 1000000) return inWords(Math.floor(num / 1000)) + ' thousand' + (num % 1000 ? ' ' + inWords(num % 1000) : '');
        return inWords(Math.floor(num / 1000000)) + ' million' + (num % 1000000 ? ' ' + inWords(num % 1000000) : '');
      }
      return inWords(n);
    }

    const amountInWords = computed(() => {
      const total = Math.round((grandTotal.value + Number.EPSILON) * 100) / 100;
      const naira = Math.floor(total);
      const kobo = Math.round((total - naira) * 100);
      const words = `${numberToWords(naira)} naira${kobo ? ' and ' + numberToWords(kobo) + ' kobo' : ''}`;
      return { words: words.replace(/\b\w/g, (s) => s.toUpperCase()), formatted: `${naira} Naira ${kobo} Kobo` };
    });

    // Save invoice to backend
    const saveInvoiceToBackend = async () => {
      try {
        const invoiceData = {
          organizationName: organizationName.value,
          address: address.value,
          date: date.value,
          lpo: lpo.value,
          customerName: customerName.value,
          customerAddress: customerAddress.value,
          items: items.value.map(item => ({
            description: item.description,
            quantity: item.quantity,
            price: item.price
          })),
          subtotal: subtotal.value,
          taxEnabled: taxEnabled.value,
          taxRate: taxRate.value,
          taxAmount: taxAmount.value,
          grandTotal: grandTotal.value,
          customerSign: customerSign.value,
          managerSign: managerSign.value,
        };

        const response = await fetch(`${API_BASE}/invoice`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(invoiceData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to save invoice');
        }

        const result = await response.json();
        console.log('Invoice saved successfully:', result);
        return result.data;
      } catch (error) {
        console.error('Error saving invoice:', error);
        throw error;
      }
    };

    // Auto-resize textarea as user types
    const autoResize = (event) => {
      const textarea = event.target;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    };

    // Export handlers
    const handleExportPDF = async () => {
      if (!invoiceRef.value || isExporting.value) return;
      
      try {
        isExporting.value = true;
        exportType.value = 'pdf';
        
        // Save to backend first
        await saveInvoiceToBackend();
        
        const element = invoiceRef.value;
        const filename = `meblink-invoice-${Date.now()}.pdf`;
        const options = {
          margin: 0,
          filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 3, useCORS: true },
          jsPDF: { unit: 'in', format: [8.27, 5.83], orientation: 'landscape' },
        };
        
        await html2pdf().set(options).from(element).save();
        alert('Invoice saved and exported successfully!');
      } catch (error) {
        console.error('Error exporting PDF:', error);
        alert('Failed to export PDF: ' + error.message);
      } finally {
        isExporting.value = false;
        exportType.value = '';
      }
    };

    const handleExportJPEG = async () => {
      if (!invoiceRef.value || isExporting.value) return;
      
      try {
        isExporting.value = true;
        exportType.value = 'jpeg';
        
        // Save to backend first
        await saveInvoiceToBackend();
        
        const dataUrl = await htmlToImage.toJpeg(invoiceRef.value, { quality: 0.95, pixelRatio: 3 });
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `meblink-invoice-${Date.now()}.jpg`;
        link.click();
        alert('Invoice saved and exported successfully!');
      } catch (error) {
        console.error('Error exporting JPEG:', error);
        alert('Failed to export JPEG: ' + error.message);
      } finally {
        isExporting.value = false;
        exportType.value = '';
      }
    };

    const handleBack = () => {
      history.back();
    };

    const handleSaveInvoice = async () => {
      if (isSaving.value) return;
      
      try {
        isSaving.value = true;
        await saveInvoiceToBackend();
        alert('Invoice saved successfully to the backend!');
      } catch (error) {
        console.error('Error saving invoice:', error);
        alert('Failed to save invoice: ' + error.message);
      } finally {
        isSaving.value = false;
      }
    };

    return {
      invoiceRef,
      isExporting,
      exportType,
      isSaving,
      a5Width,
      a5Height,
      organizationName,
      organizationAddress,
      organizationPhone,
      logoDataUrl,
      address,
      date,
      autoDate,
      lpo,
      receivedFrom,
      customerName,
      customerAddress,
      customerSign,
      managerSign,
      receiptNumber,
      autoReceiptNumber,
      items,
      addItem,
      removeItem,
      autoResize,
      subtotal,
      taxEnabled,
      taxRate,
      taxAmount,
      grandTotal,
      toCurrency,
      amountInWords,
      handleExportPDF,
      handleExportJPEG,
      handleSaveInvoice,
      handleBack,
    };
  },
});
</script>

<style scoped>
/* Custom Scrollbar Styling */
:deep(*) {
  scrollbar-width: thin;
  scrollbar-color: #10b981 #e2e8f0;
}

:deep(*::-webkit-scrollbar) {
  width: 12px;
  height: 12px;
}

:deep(*::-webkit-scrollbar-track) {
  background: #f1f5f9;
  border-radius: 6px;
}

:deep(*::-webkit-scrollbar-thumb) {
  background: linear-gradient(180deg, #10b981, #059669);
  border-radius: 6px;
  border: 2px solid #f1f5f9;
}

:deep(*::-webkit-scrollbar-thumb:hover) {
  background: linear-gradient(180deg, #059669, #047857);
}

:deep(*::-webkit-scrollbar-corner) {
  background: #f1f5f9;
}

/* Enhanced styling for invoice page */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Smooth transitions for all inputs */
input, textarea {
  transition: all 0.2s ease-in-out;
}

/* Textarea auto-sizing and wrapping */
textarea {
  min-height: 1.5rem;
  max-height: 8rem;
  line-height: 1.3;
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  padding: 2px 4px;
}

/* Calendar indicator appears only on hover/focus */
input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  transition: opacity 0.2s ease;
}

input[type="date"]:hover::-webkit-calendar-picker-indicator,
input[type="date"]:focus::-webkit-calendar-picker-indicator {
  opacity: 1;
}

/* Compact table rows */
table tbody tr {
  height: auto;
}

table tbody td {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

/* Group hover effect for delete button */
.group:hover {
  position: relative;
}

/* Delete button styling */
.group button {
  transform: translateY(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.group:hover button {
  transform: translateY(2px);
}

/* Print-friendly styles for when exporting */
@media print {
  body {
    background: white !important;
  }
  
  #meblink-invoice {
    box-shadow: none !important;
    border: none !important;
  }
}

/* Table styling enhancement */
table {
  border-collapse: separate;
  border-spacing: 0;
}

table td,
table th {
  border: 1px solid #e2e8f0;
}

/* Animation for adding items */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

tbody tr {
  animation: slideIn 0.3s ease-out;
}
</style>
