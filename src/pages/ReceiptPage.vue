<template>
  <div class="h-screen overflow-y-auto flex flex-col gap-8 items-center justify-start bg-slate-100 dark:bg-slate-900 py-12 px-4">
    <section class="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3">
      <div class="space-y-2">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Receipt Designer</h1>
        <p class="text-sm text-slate-600 dark:text-slate-300">
          Configure your receipt details then export as PDF or JPEG.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-3 justify-end">
        <BaseButton variant="secondary" @click="triggerLogoUpload">Upload Logo</BaseButton>
        <BaseButton
          v-if="logoDataUrl"
          variant="secondary"
          @click="handleClearLogo"
        >
          Remove Logo
        </BaseButton>
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
      <input
        ref="logoInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleLogoChange"
      />
    </section>

    <section class="w-full max-w-4xl">
      <div
        id="receipt-canvas"
        ref="receiptRef"
        class="bg-white shadow-lg border border-gray-300 p-4"
        style="width: 6in; height: 4in"
      >
        <!-- Header -->
        <div class="text-center border-b pb-2 mb-2">
          <!-- Organization Name -->
          <input
            v-model="organizationName"
            placeholder="Organization Name"
            class="text-lg font-bold uppercase text-center w-full bg-transparent border-none focus:outline-none focus:border-b focus:border-gray-300"
          />

          <!-- Address -->
          <textarea
            v-model="address"
            rows="1"
            placeholder="Address"
            class="text-xs text-center w-full bg-transparent border-none focus:outline-none resize-none"
          ></textarea>
          
          <div class="flex justify-center items-center gap-1">
            <span class="text-xs">Tel:</span>
            <input
              v-model="phone"
              placeholder="Phone Number"
              class="text-xs text-center bg-transparent border-none focus:outline-none w-32"
            />
          </div>

          <!-- Receipt Title -->
          <p class="text-sm font-semibold mt-1 bg-red-500 text-white inline-block px-3 py-1 rounded">
            CASH RECEIPT
          </p>
        </div>

        <!-- Body -->
        <div class="text-sm space-y-2">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-1">
              <span>Date:</span>
              <input
                v-model="date"
                type="date"
                :disabled="autoDate"
                class="bg-transparent border-none focus:outline-none text-sm"
              />
            </div>
            <div class="flex items-center gap-2">
              <label class="flex items-center gap-1 text-xs">
                <input type="checkbox" v-model="autoReceiptNumber" class="rounded border-gray-300" />
                Auto
              </label>
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

          <div class="flex items-center gap-1">
            <span>Received From:</span>
            <input
              v-model="receivedFrom"
              placeholder="_______________________"
              class="flex-1 bg-transparent border-b border-dotted border-gray-400 focus:outline-none"
            />
          </div>

          <div class="flex items-center gap-1">
            <span>The Sum of:</span>
            <input
              v-model="sumOf"
              :placeholder="amountInWords.words || '__________________________'"
              class="flex-1 bg-transparent border-b border-dotted border-gray-400 focus:outline-none"
            />
          </div>

          <div class="flex items-center gap-2">
            <span>₦</span>
            <input
              v-model.number="naira"
              type="number"
              min="0"
              placeholder="__________"
              class="w-24 bg-transparent border-b border-dotted border-gray-400 focus:outline-none text-right"
            />
            <span>Naira</span>
            <input
              v-model.number="kobo"
              type="number"
              min="0"
              max="99"
              placeholder="__________"
              class="w-16 bg-transparent border-b border-dotted border-gray-400 focus:outline-none text-right"
            />
            <span>Kobo</span>
          </div>

          <div class="flex items-start gap-1">
            <span>Being Payment for:</span>
            <textarea
              v-model="paymentFor"
              rows="2"
              placeholder="____________________"
              class="flex-1 bg-transparent border-b border-dotted border-gray-400 focus:outline-none resize-none"
            ></textarea>
          </div>

          <!-- Amount in figures -->
          <div class="flex justify-end mt-2">
            <div class="border-2 border-yellow-400 p-2 bg-yellow-50">
              ₦ <span class="font-bold">{{ amountInWords.formatted }}</span>
            </div>
          </div>

          <!-- Signature -->
          <div class="flex justify-end mt-4 items-center gap-2">
            <input
              v-model="signatureName"
              placeholder="________________________"
              class="bg-transparent border-b border-gray-400 focus:outline-none text-center w-48"
            />
            <p class="italic">Signature</p>
          </div>
        </div>

        <!-- Hidden checkboxes for auto date -->
        <div class="hidden">
          <input type="checkbox" v-model="autoDate" @change="syncDate" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import html2pdf from 'html2pdf.js';
import * as htmlToImage from 'html-to-image';
import BaseButton from '@/components/BaseButton.vue';
import { useReceiptStore } from '@/stores/receiptStore';
import { useFinanceStore } from '@/stores/finance';

export default defineComponent({
  name: 'ReceiptPage',
  components: {
    BaseButton,
  },
  setup() {
    const router = useRouter();
    const receiptStore = useReceiptStore();
    const financeStore = useFinanceStore();

    const {
      logoDataUrl,
      organizationName,
      address,
      phone,
      date,
      autoDate,
      receivedFrom,
      sumOf,
      naira,
      kobo,
      paymentFor,
      signatureName,
      amountInWords,
    } = storeToRefs(receiptStore);

    const { receiptNumber, autoReceiptNumber } = storeToRefs(financeStore);

    const { incrementReceiptNumber, ensureRanges, setLogoFromFile, clearLogo } = receiptStore;

    const receiptRef = ref(null);
    const logoInputRef = ref(null);

    const syncDate = () => {
      if (autoDate.value) {
        date.value = new Date().toISOString().split('T')[0];
      }
    };

    watch([naira, kobo], () => {
      ensureRanges();
    });

    watch(
      () => autoDate.value,
      (value) => {
        if (value) {
          syncDate();
        }
      }
    );

    watch(
      () => autoReceiptNumber.value,
      (value) => {
        if (value) {
          receiptNumber.value = Math.max(1, receiptNumber.value || 1);
        }
      }
    );

    watch(
      () => receiptNumber.value,
      (value) => {
        financeStore.setReceiptNumber(Math.max(1, Number(value) || 1));
      }
    );

    const handleBack = () => {
      router.push({ name: 'Dashboard' });
    };

    const handleExportPDF = async () => {
      if (!receiptRef.value) return;
      ensureRanges();
      const filename = `receipt-${receiptNumber.value}.pdf`;
      const options = {
        margin: 0,
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: 'in', format: [6, 4], orientation: 'landscape' },
      };
      await html2pdf().set(options).from(receiptRef.value).save();
      incrementReceiptNumber();
    };

    const handleExportJPEG = async () => {
      if (!receiptRef.value) return;
      ensureRanges();
      const dataUrl = await htmlToImage.toJpeg(receiptRef.value, {
        quality: 0.95,
        pixelRatio: 3,
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `receipt-${receiptNumber.value}.jpg`;
      link.click();
      incrementReceiptNumber();
    };

    const triggerLogoUpload = () => {
      logoInputRef.value?.click();
    };

    const handleLogoChange = async (event) => {
      const file = event.target?.files?.[0];
      if (file) {
        await setLogoFromFile(file);
      }
    };

    const handleClearLogo = () => {
      clearLogo();
      if (logoInputRef.value) {
        logoInputRef.value.value = '';
      }
    };

    return {
      receiptRef,
      logoInputRef,
      logoDataUrl,
      organizationName,
      address,
      phone,
      receiptNumber,
      autoReceiptNumber,
      date,
      autoDate,
      receivedFrom,
      sumOf,
      naira,
      kobo,
      paymentFor,
      signatureName,
      amountInWords,
      handleBack,
      handleExportPDF,
      handleExportJPEG,
      triggerLogoUpload,
      handleLogoChange,
      handleClearLogo,
      syncDate,
    };
  },
});
</script>
