<template>
  <div class="h-screen overflow-y-auto flex flex-col gap-8 items-center justify-start bg-slate-100 dark:bg-slate-900 py-12 px-4">
    <section class="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3">
      <div class="space-y-2">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Receipt Designer</h1>
        <p class="text-sm text-slate-600 dark:text-slate-300">
          Configure your receipt details then export as PDF or JPEG.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <!-- Primary Actions -->
        <div class="flex items-center gap-2">
          <BaseButton variant="primary" @click="handleExportPDF">
            📄 Export PDF
          </BaseButton>
          <BaseButton variant="secondary" @click="handleExportJPEG">
            🖼️ Export JPEG
          </BaseButton>
        </div>

        <!-- Separator -->
        <div class="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>

        <!-- Navigation -->
        <BaseButton variant="ghost" @click="handleBack">
          ← Back to Dashboard
        </BaseButton>
      </div>
    </section>

    <!-- Quick Fill Form Section -->
    <section class="w-full max-w-4xl">
      <div 
      style="width: 8.268in; height: 5.824in; "
      class="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          📝 Quick Fill Form
        </h2>
        <p class="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Fill out this form to automatically populate the receipt below
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Received From -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Received From
            </label>
            <input
              v-model="receivedFrom"
              type="text"
              placeholder="Enter payer name"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>

          <!-- Amount (Naira) -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Amount (Naira)
            </label>
            <input
              v-model.number="naira"
              type="number"
              min="0"
              placeholder="0"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>

          <!-- The Sum of (Amount in Words) -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Amount in Words
            </label>
            <input
              v-model="sumOf"
              type="text"
              :placeholder="amountInWords.words || 'Amount in words'"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>

          <!-- Being Payment For -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Payment Description 
            </label>
            <input
              v-model="paymentFor"
              type="text"
              placeholder="Enter payment description"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>
        </div>
        <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-blue-900 dark:text-blue-300">
              Total Amount:
            </span>
            <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ₦{{ naira || 0 }}.{{ String(kobo || 0).padStart(2, '0') }}
            </span>
          </div>
          <div v-if="amountInWords.words" class="mt-2 text-xs text-blue-700 dark:text-blue-300 italic">
            {{ amountInWords.words }}
          </div>
        </div>
      </div>
    </section>

    <section class="w-full max-w-4xl">
      <div
      class="bg-white shadow-lg border border-gray-300 p-5 flex justify-center items-center"
      style="width: 8.268in; height: 5.824in"
      >
        <div
        id="receipt-canvas"
        ref="receiptRef"
        style="width: 6in; height: 4.5in; overflow: hidden"
      >
        <!-- Header -->
        <div class="text-center border-b pb-2 mb-2">
          <div class="flex items-start">
            <!-- Logo (Fixed - Developer Only) -->
            <div v-if="logoDataUrl" class="flex justify-center mb-2">
              <img :src="logoDataUrl" alt="ICAN Logo" class="h-20 w-auto object-contain" />
            </div>
            
            <!-- Organization Name (Fixed - Developer Only) -->
            <div class="text-blue-800">
              <h2 class="ml-4 text-xl font-bold uppercase text-left" style="font-family: 'Arial Narrow', 'Roboto Condensed', 'Oswald', sans-serif; font-weight: 900; letter-spacing: -0.5px;">
              Institute of Chartered Accountants 
              
            </h2>
            <h2 class="ml-4 mt-[-5px] text-xl font-bold uppercase text-left" style="font-family: 'Arial Narrow', 'Roboto Condensed', 'Oswald', sans-serif; font-weight: 900; letter-spacing: -0.5px;">
              of Nigeria (ICAN)
            </h2>
            </div>
          </div>

          <!-- Address (Fixed - Developer Only) -->
          <p class="text-xs text-left mt-[-35px] ml-[98px]">
            {{ organizationAddress }}
          </p>
          
          <!-- Phone (Fixed - Developer Only) -->
          <p class="text-xs text-center font-bold">
            Tel: {{ organizationPhone }}
          </p>

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
              placeholder=" "
              class="flex-1 bg-transparent border-b border-dotted border-gray-400 focus:outline-none"
            />
          </div>

          <div class="flex items-center gap-1">
            <span>The Sum of:</span>
            <input
              ref="sumOfInput1"
              v-model="sumOf"
              @input="handleSumOfOverflow"
              class="flex-1 bg-transparent border-b border-dotted border-gray-400 focus:outline-none"
            />
          </div>

          <div class="flex items-center gap-2">
            <input
              ref="sumOfInput2"
              v-model="sumOf2"
              type="text"
              @input="handleSumOf2Input"
              class="flex-1 bg-transparent border-b border-dotted border-gray-400 focus:outline-none"
            />
            <span>Naira</span>
            <input
              v-model.number="kobo"
              type="number"
              min="0"
              max="99"
              class="w-16 bg-transparent border-b border-dotted border-gray-400 focus:outline-none text-right"
            />
            <span>Kobo</span>
          </div>

          <div class="flex items-start gap-1">
            <span>Being Payment for:</span>
            <input
              ref="paymentForInput1"
              v-model="paymentFor"
              @input="handlePaymentForOverflow"
              class="flex-1 bg-transparent border-b border-dotted border-gray-400 focus:outline-none"
            />
          </div>

          <!-- Additional line for payment description -->
          <div class="flex">
            <input
              ref="paymentForInput2"
              v-model="paymentFor2"
              @input="handlePaymentFor2Input"
              class="w-full bg-transparent border-b border-dotted border-gray-400 focus:outline-none"
            />
          </div>
          
          <div class="flex justify-between items-start mt-4">
           
            <!-- Signature 1 -->
            <div class="flex flex-col items-center gap-2">
              <!-- Signature 1 Image -->
                <div v-if="signatureImage1">
                <img :src="signatureImage1" alt="Signature 1" class="h-9 w-auto object-contain max-w-[120px] " />
              </div>

              <div v-else class="mb-2 h-16 w-32 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
                No signature
              </div>

             <div class="w-full border-t border-gray-400 text-center mt-[-2px]">
               <p class="italic text-xs">Signature</p>
             </div> 
            </div>

            <!-- Amount in figures -->
            <div class="flex flex-col items-center mt-3">
              <div class="border-2 border-yellow-400 p-2 py-2 bg-yellow-50 min-w-[200px]">
                <div class="flex justify-between gap-2">
                  <span class="font-bold text-lg">₦{{ naira || 0 }}</span>
                  <span class="font-bold text-lg">.{{ String(kobo || 0).padStart(2, '0') }}</span>
                </div>
              </div>
            </div>

          <!-- Signature 2 -->
            <div class="flex flex-col items-center gap-2">
              <!-- Signature 2 Image -->
                <div v-if="signatureImage2">
                <img :src="signatureImage2" alt="Signature 1" class="h-9 w-auto object-contain max-w-[120px] " />
              </div>

              <div v-else class="mb-2 h-16 w-32 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
                No signature
              </div>

             <div class="w-full border-t border-gray-400 text-center mt-[-2px]">
               <p class="italic text-xs">Signature</p>
             </div> 
            </div>
          </div>
        </div>

        <!-- Hidden checkboxes for auto date -->
        <div class="hidden">
          <input type="checkbox" v-model="autoDate" @change="syncDate" />
        </div>
      </div>
      </div>
    </section>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
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
    const route = useRoute();
    const receiptStore = useReceiptStore();
    const financeStore = useFinanceStore();

    // Fixed organization details (Developer only - users cannot change these)
    const organizationName = 'Institute of Chartered Accountants of Nigeria (ICAN)';
    const organizationAddress = ref('Established by Act of Parliament No. 15 of (1965) Minna and District Society');
    const organizationPhone = ref('+234 1 234 5678');
    
    // Logo data (Developer can set default logos here)
    const logoDataUrl = ref('/images/ican-logo.png'); // Main org logo
    
    // Signature images (Developer can set signature images here - PNG/JPEG)
    const signatureImage1 = ref('/images/signature1.png'); // Signature 1 image: ref('/images/signature1.png')
    const signatureImage2 = ref('/images/signature2.png'); // Signature 2 image: ref('/images/signature2.png')

    // Additional fields for signatures and payment description
    const paymentFor2 = ref('');
    const sumOf2 = ref('');
    const signature1 = ref('');
    const signature2 = ref('');

    const {
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

    const { incrementReceiptNumber, ensureRanges } = receiptStore;

    const receiptRef = ref(null);
    const sumOfInput1 = ref(null);
    const sumOfInput2 = ref(null);
    const paymentForInput1 = ref(null);
    const paymentForInput2 = ref(null);

    const syncDate = () => {
      if (autoDate.value) {
        date.value = new Date().toISOString().split('T')[0];
      }
    };

    watch([naira, kobo], () => {
      ensureRanges();
    });

    // Auto-fill "The Sum of" field when amount in words changes
    watch(
      () => amountInWords.value.words,
      (newWords) => {
        if (newWords) {
          sumOf.value = newWords;
        }
      }
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

    // Auto-overflow handlers for Sum of fields
    const handleSumOfOverflow = () => {
      const maxLength = 65; // Extended character limit to fill the entire first line
      if (sumOf.value.length > maxLength) {
        const overflow = sumOf.value.substring(maxLength);
        sumOf.value = sumOf.value.substring(0, maxLength);
        sumOf2.value = overflow + sumOf2.value;
        // Focus on second input
        setTimeout(() => {
          if (sumOfInput2.value) {
            sumOfInput2.value.focus();
            sumOfInput2.value.setSelectionRange(overflow.length, overflow.length);
          }
        }, 0);
      }
    };

    const handleSumOf2Input = () => {
      // If user deletes everything in second line and there's content in first, merge
      if (sumOf2.value === '' && sumOf.value.length > 0) {
        // Allow clearing without merging
      }
    };

    // Auto-overflow handlers for Payment For fields
    const handlePaymentForOverflow = () => {
      const maxLength = 60; // Extended character limit to fill the entire first line (slightly less due to label)
      if (paymentFor.value.length > maxLength) {
        const overflow = paymentFor.value.substring(maxLength);
        paymentFor.value = paymentFor.value.substring(0, maxLength);
        paymentFor2.value = overflow + paymentFor2.value;
        // Focus on second input
        setTimeout(() => {
          if (paymentForInput2.value) {
            paymentForInput2.value.focus();
            paymentForInput2.value.setSelectionRange(overflow.length, overflow.length);
          }
        }, 0);
      }
    };

    const handlePaymentFor2Input = () => {
      // If user deletes everything in second line, allow it
      if (paymentFor2.value === '' && paymentFor.value.length > 0) {
        // Allow clearing without merging
      }
    };

    const handleExportPDF = async () => {
      if (!receiptRef.value) return;
      ensureRanges();
      
      // Save receipt to backend with branch information
      const branch = route.query.branch || '';
      const receiptData = {
        organizationName: organizationName,
        address: organizationAddress.value,
        phone: organizationPhone.value,
        date: date.value,
        receivedFrom: receivedFrom.value,
        sumOf: sumOf.value,
        sumOf2: sumOf2.value,
        naira: naira.value,
        kobo: kobo.value,
        paymentFor: paymentFor.value,
        paymentFor2: paymentFor2.value,
        signature1: signature1.value,
        signature2: signature2.value,
        signatureName: signatureName.value,
        amount: naira.value + (kobo.value / 100),
        number: receiptNumber.value,
        branch: branch, // Include branch info
      };

      try {
        await fetch('http://localhost:4000/receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(receiptData),
        });
      } catch (error) {
        console.error('Failed to save receipt:', error);
      }

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
      
      // Save receipt to backend with branch information
      const branch = route.query.branch || '';
      const receiptData = {
        organizationName: organizationName,
        address: organizationAddress.value,
        phone: organizationPhone.value,
        date: date.value,
        receivedFrom: receivedFrom.value,
        sumOf: sumOf.value,
        sumOf2: sumOf2.value,
        naira: naira.value,
        kobo: kobo.value,
        paymentFor: paymentFor.value,
        paymentFor2: paymentFor2.value,
        signature1: signature1.value,
        signature2: signature2.value,
        signatureName: signatureName.value,
        amount: naira.value + (kobo.value / 100),
        number: receiptNumber.value,
        branch: branch, // Include branch info
      };

      try {
        await fetch('http://localhost:4000/receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(receiptData),
        });
      } catch (error) {
        console.error('Failed to save receipt:', error);
      }

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

    return {
      receiptRef,
      sumOfInput1,
      sumOfInput2,
      paymentForInput1,
      paymentForInput2,
      logoDataUrl,
      signatureImage1,
      signatureImage2,
      organizationName,
      organizationAddress,
      organizationPhone,
      receiptNumber,
      autoReceiptNumber,
      date,
      autoDate,
      receivedFrom,
      sumOf,
      sumOf2,
      naira,
      kobo,
      paymentFor,
      paymentFor2,
      signature1,
      signature2,
      signatureName,
      amountInWords,
      handleBack,
      handleSumOfOverflow,
      handleSumOf2Input,
      handlePaymentForOverflow,
      handlePaymentFor2Input,
      handleExportPDF,
      handleExportJPEG,
      syncDate,
    };
  },
});
</script>
