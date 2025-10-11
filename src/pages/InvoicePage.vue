<template>
  <div class="min-h-screen flex flex-col gap-8 items-center justify-start bg-slate-100 dark:bg-slate-900 py-12 px-4">
    <section class="w-full max-w-4xl flex items-center justify-between">
      <div class="space-y-2">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
          Invoice Designer
        </h1>
        <p class="text-sm text-slate-600 dark:text-slate-300">
          Configure your invoice details then export as PDF or JPEG.
        </p>
      </div>
      <div class="flex gap-3">
        <BaseButton variant="secondary" @click="handleExportJPEG">
          Export JPEG
        </BaseButton>
        <BaseButton @click="handleExportPDF">
          Export PDF
        </BaseButton>
        <BaseButton variant="secondary" @click="handleBack">
          Back to Dashboard
        </BaseButton>
      </div>
    </section>

    <section class="w-full max-w-4xl">
      <div
        id="invoice-canvas"
        ref="invoiceRef"
        class="bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 rounded-2xl p-8 grid gap-4"
        style="width: 6in; height: 4in"
      >
        <header class="flex justify-between items-start">
          <div class="space-y-2">
            <input
              v-model="organizationName"
              placeholder="Organization Name"
              class="w-64 text-xl font-semibold text-slate-900 dark:text-white bg-transparent border-b border-slate-300 dark:border-slate-600 focus:outline-none"
            />
            <textarea
              v-model="address"
              rows="2"
              placeholder="Address"
              class="resize-none w-64 text-sm text-slate-600 dark:text-slate-300 bg-transparent border border-slate-300 dark:border-slate-600 rounded-lg p-2"
            ></textarea>
            <input
              v-model="phone"
              placeholder="Phone"
              class="w-40 text-sm text-slate-600 dark:text-slate-300 bg-transparent border border-slate-300 dark:border-slate-600 rounded-lg p-2"
            />
          </div>
          <div class="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <div class="flex items-center gap-2">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="autoInvoiceNumber" class="rounded border-slate-300" />
                Auto Invoice #
              </label>
              <input
                v-model.number="invoiceNumber"
                :disabled="autoInvoiceNumber"
                type="number"
                class="w-24 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-1"
              />
            </div>
            <div class="flex items-center gap-2">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="autoDate" class="rounded border-slate-300" @change="syncDate" />
                Auto Date
              </label>
              <input
                v-model="date"
                type="date"
                :disabled="autoDate"
                class="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-1"
              />
            </div>
          </div>
        </header>

        <section class="overflow-hidden border border-slate-200 dark:border-slate-600 rounded-xl">
          <table class="w-full text-sm">
            <thead class="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 uppercase text-xs tracking-wider">
              <tr>
                <th class="text-left px-3 py-2">Description</th>
                <th class="text-right px-3 py-2 w-16">Qty</th>
                <th class="text-right px-3 py-2 w-24">Price</th>
                <th class="text-right px-3 py-2 w-28">Total</th>
                <th class="w-12"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id" class="border-t border-slate-200 dark:border-slate-700">
                <td class="px-3 py-2">
                  <input
                    v-model="item.description"
                    placeholder="Item description"
                    class="w-full bg-transparent border-b border-dashed border-slate-300 focus:outline-none"
                  />
                </td>
                <td class="px-3 py-2 text-right">
                  <input
                    v-model.number="item.quantity"
                    type="number"
                    min="1"
                    class="w-full text-right bg-transparent border-b border-dashed border-slate-300 focus:outline-none"
                  />
                </td>
                <td class="px-3 py-2 text-right">
                  <input
                    v-model.number="item.price"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full text-right bg-transparent border-b border-dashed border-slate-300 focus:outline-none"
                  />
                </td>
                <td class="px-3 py-2 text-right text-slate-700 dark:text-slate-200">
                  {{ toCurrency(item.quantity * item.price) }}
                </td>
                <td class="px-3 py-2 text-center">
                  <button
                    type="button"
                    class="text-xs text-red-500 hover:text-red-600"
                    @click="removeItem(item.id)"
                    :disabled="items.length === 1"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <div class="flex justify-between text-xs text-slate-500">
          <button type="button" class="flex items-center gap-1 text-emerald-500" @click="addItem">+ Add Line Item</button>
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="taxEnabled" class="rounded border-slate-300" />
            Apply Tax ({{ taxRate }}%)
          </label>
        </div>

        <section class="grid gap-2 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-500">Subtotal</span>
            <span class="text-slate-900 dark:text-slate-100">{{ toCurrency(subtotal) }}</span>
          </div>
          <div class="flex justify-between" v-if="taxEnabled">
            <span class="text-slate-500">Tax ({{ taxRate }}%)</span>
            <span class="text-slate-900 dark:text-slate-100">{{ toCurrency(taxAmount) }}</span>
          </div>
          <div class="flex justify-between text-lg font-semibold text-slate-900 dark:text-white">
            <span>Grand Total</span>
            <span>{{ toCurrency(grandTotal) }}</span>
          </div>
          <div class="text-xs text-slate-500">
            Amount in words: <strong>{{ amountInWords.words }}</strong> ({{ amountInWords.formatted }})
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useInvoiceStore } from '@/stores/invoiceStore';
import { useFinanceStore } from '@/stores/finance';
import BaseButton from '@/components/BaseButton.vue';
import html2pdf from 'html2pdf.js';
import * as htmlToImage from 'html-to-image';

export default defineComponent({
  name: 'InvoicePage',
  components: {
    BaseButton,
  },
  setup() {
    const router = useRouter();
    const invoiceStore = useInvoiceStore();
    const financeStore = useFinanceStore();
    const invoiceRef = ref(null);

    const {
      organizationName,
      address,
      phone,
      date,
      autoDate,
      items,
      subtotal,
      taxAmount,
      grandTotal,
      amountInWords,
    } = storeToRefs(invoiceStore);

    const { invoiceNumber, autoInvoiceNumber, taxEnabled, taxRate } = storeToRefs(financeStore);

    const { addItem, removeItem, incrementInvoiceNumber } = invoiceStore;

    const syncDate = () => {
      if (autoDate.value) {
        date.value = new Date().toISOString().split('T')[0];
      }
    };

    watch(
      () => items.value,
      (lineItems) => {
        lineItems.forEach((item) => {
          if (item.quantity < 1) item.quantity = 1;
          if (item.price < 0) item.price = 0;
        });
      },
      { deep: true }
    );

    watch(
      () => autoDate.value,
      (value) => {
        if (value) {
          syncDate();
        }
      }
    );

    watch(
      () => autoInvoiceNumber.value,
      (value) => {
        if (!value) return;
        invoiceNumber.value = Math.max(1, invoiceNumber.value || 1);
      }
    );

    watch(
      () => invoiceNumber.value,
      (value) => {
        financeStore.setInvoiceNumber(Math.max(1, Number(value) || 1));
      }
    );

    const toCurrency = (value) =>
      new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value || 0);

    const handleBack = () => {
      router.push({ name: 'Dashboard' });
    };

    const handleExportPDF = async () => {
      if (!invoiceRef.value) return;
      const filename = `invoice-${invoiceNumber.value}.pdf`;
      const options = {
        margin: 0,
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: 'in', format: [6, 4], orientation: 'landscape' },
      };
      await html2pdf().set(options).from(invoiceRef.value).save();
      incrementInvoiceNumber();
    };

    const handleExportJPEG = async () => {
      if (!invoiceRef.value) return;
      const dataUrl = await htmlToImage.toJpeg(invoiceRef.value, {
        quality: 0.95,
        pixelRatio: 3,
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `invoice-${invoiceNumber.value}.jpg`;
      link.click();
      incrementInvoiceNumber();
    };

    return {
      invoiceRef,
      organizationName,
      address,
      phone,
      invoiceNumber,
      autoInvoiceNumber,
      date,
      autoDate,
      items,
      taxEnabled,
      taxRate,
      subtotal,
      taxAmount,
      grandTotal,
      amountInWords,
      addItem,
      removeItem,
      toCurrency,
      syncDate,
      handleBack,
      handleExportPDF,
      handleExportJPEG,
    };
  },
});
</script>
