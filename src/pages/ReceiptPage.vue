<template>
  <div>
    <!-- Password Verification Modal -->
    <PasswordVerificationModal
      :is-open="showPasswordModal"
      target-page="Receipt Page"
      @verified="onPasswordVerified"
      @cancel="onPasswordCancel"
    />

    <div class="h-screen overflow-y-auto flex flex-col gap-8 items-center justify-start bg-slate-100 dark:bg-slate-900 pt-[80px] pb-[150px] px-4">
      <!-- Member Info Banner -->
      <div v-if="authenticatedMember" class="w-full max-w-4xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-3 rounded-lg shadow-md flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <span class="text-lg">👤</span>
        </div>
        <div>
          <p class="text-sm font-medium">Logged in as: <span class="font-bold">{{ authenticatedMember?.name }}</span></p>
          <p class="text-xs opacity-90">Role: {{ authenticatedMember?.role || 'Member' }}</p>
        </div>
      </div>
      <button @click="handleLogout" class="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-md transition-colors text-sm font-medium">
        <span>Logout</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>

    <section class="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3">
      <div class="space-y-2">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Receipt Designer</h1>
        <p class="text-sm text-slate-600 dark:text-slate-300">
          Configure your receipt details then export as PDF or JPEG.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <!-- Auto Receipt Number Toggle -->
        <label class="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600">
          <input type="checkbox" v-model="autoReceiptNumber" class="rounded border-gray-300" />
          <span>Auto Receipt #</span>
        </label>

        <!-- Separator -->
        <div class="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

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
        <div class="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

        <!-- Navigation -->
        <BaseButton variant="ghost" @click="handleBack">
          ← Back to Dashboard
        </BaseButton>
      </div>
    </section>

    <!-- Flex Container for Form and Preview -->
    <div class="w-full max-w-7xl flex flex-col lg:flex-row gap-6 items-start">
      <!-- Quick Fill Form Section -->
      <section class="w-full lg:w-1/2">
        <div 
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

        <!-- Mobile Preview Button -->
        <div class="mt-4 md:hidden">
          <button
            @click="showPreview = !showPreview"
            class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg"
          >
            <svg v-if="!showPreview" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>{{ showPreview ? 'Hide Preview' : 'Preview Receipt' }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Receipt Preview Section - Hidden on mobile unless showPreview is true -->
    <section 
      class="w-full max-w-5xl flex items-center justify-center"
      :class="{ 'hidden lg:flex': !showPreview }"
    >
      <!-- Mobile wrapper with responsive width -->
      <div class="w-full flex items-center justify-center md:p-4">
      <div
      ref="receiptOuterRef"
      class="bg-white shadow-lg border border-gray-300 p-5 flex justify-center items-center mx-auto"
      :style="{ width: isMobile ? '100%' : '7.268in', height: '5.324in', backgroundColor: 'white', minWidth: isMobile ? '100%' : '7.268in' }"
      >
        <div
        id="receipt-canvas"
        ref="receiptRef"
        style="width: 6in; height: 4.5in; overflow: hidden; background-color: white;"
      >
        <!-- Header -->
        <div class="text-center">
          <div class="flex items-start">
            <!-- Logo (Fixed - Developer Only) -->
            <div v-if="logoDataUrl" class="">
              <img :src="logoDataUrl" alt="ICAN Logo" class="h-20 mt-[-25px] md:h-[150px] w-auto object-contain" />
            </div>
            
            <!-- Organization Name (Fixed - Developer Only) -->
            <div>
              <div>
                <h2 class="ml-4 text-blue-800 md:text-2xl text-md font-bold uppercase text-center" style="font-family: 'Arial Narrow', 'Roboto Condensed', 'Oswald', sans-serif; font-weight: 900; letter-spacing: -0.5px;">
              Institute of Chartered Accountants of Nigeria (ICAN) </h2>
              </div>
            
              <div>
                <!-- Address (Fixed - Developer Only) -->
              <p class="text-sm text-center ">
                {{ organizationAddress }}
              </p>
              
              <!-- Phone (Fixed - Developer Only) -->
              <p class="text-xs text-center font-bold">
                Tel: {{ organizationPhone }}
              </p>
              </div>
            
            </div>
          </div>


          <!-- Receipt Title -->
          <p class="text-lg font-bold uppercase  bg-red-500 text-white inline-block px-3  rounded">
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
            <div class="flex items-center gap-1">
              <span>No.:</span>
              <input
                v-model.number="receiptNumber"
                :disabled="autoReceiptNumber"
                type="number"
                min="1"
                class="w-16 bg-transparent border-none focus:outline-none text-center"
              />
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
            <div class="w-16 bg-transparent border-b border-dotted border-gray-400 flex items-center justify-center text-center">
              <span>Only</span>
            </div>
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
              <div class="border-2 border-yellow-400 p-2 py-2 bg-yellow-50 min-w-[100px] md:min-w-[250px]">
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
      </div>
    </section>
    </div>
    <!-- End Flex Container -->

    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import PasswordVerificationModal from '@/components/PasswordVerificationModal.vue';
import { storeToRefs } from 'pinia';
import html2pdf from 'html2pdf.js';
import * as htmlToImage from 'html-to-image';
import BaseButton from '@/components/BaseButton.vue';
import { useReceiptStore } from '@/stores/receiptStore';
import { useFinanceStore } from '@/stores/finance';
import { API_BASE } from '../api.js';

export default defineComponent({
  name: 'ReceiptPage',
  components: {
    BaseButton,
    PasswordVerificationModal
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const receiptStore = useReceiptStore();
    const financeStore = useFinanceStore();

    // Member authentication
    const authenticatedMember = ref(null);
    const showPasswordModal = ref(false);
    const passwordVerified = ref(false);

    // Load authenticated member info and check for password verification
    onMounted(() => {
      const storedMember = localStorage.getItem('authenticatedMember');
      if (storedMember) {
        authenticatedMember.value = JSON.parse(storedMember);
        
        // Check if password was recently verified (within last 5 minutes)
        const lastVerification = sessionStorage.getItem('receiptPasswordVerified');
        const now = Date.now();
        
        if (lastVerification && (now - parseInt(lastVerification)) < 5 * 60 * 1000) {
          // Password was recently verified, no need to ask again
          passwordVerified.value = true;
        } else {
          // Show password modal
          showPasswordModal.value = true;
        }
      }

      // Setup mobile detection
      calculateMobileScale();
      window.addEventListener('resize', calculateMobileScale);
    });

    // Cleanup on unmount
    onBeforeUnmount(() => {
      window.removeEventListener('resize', calculateMobileScale);
    });

    // Handle successful password verification
    const onPasswordVerified = (memberInfo) => {
      showPasswordModal.value = false;
      passwordVerified.value = true;
      
      // Store authenticated member info
      authenticatedMember.value = {
        id: memberInfo.memberId,
        name: memberInfo.memberName,
        role: 'Member'
      };
      
      // Store verification timestamp in sessionStorage (expires when tab closes)
      sessionStorage.setItem('receiptPasswordVerified', Date.now().toString());
      sessionStorage.setItem('authenticatedMember', JSON.stringify(authenticatedMember.value));
    };

    // Handle password verification cancel
    const onPasswordCancel = () => {
      showPasswordModal.value = false;
      // Redirect back to dashboard
      router.push({ name: 'Dashboard' });
    };

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
    const receiptOuterRef = ref(null);
    const sumOfInput1 = ref(null);
    const sumOfInput2 = ref(null);
    const paymentForInput1 = ref(null);
    const paymentForInput2 = ref(null);
    const showPreview = ref(false); // Mobile preview toggle

    // Mobile detection
    const isMobile = ref(false);
    const mobileScale = ref(1);

    const calculateMobileScale = () => {
      const screenWidth = window.innerWidth;
      isMobile.value = screenWidth < 768;
      if (isMobile.value) {
        // Calculate scale to fit 7.268in width in screen
        const receiptWidthInPixels = 7.268 * 96; // 7.268in * 96dpi
        mobileScale.value = Math.min(1, screenWidth / receiptWidthInPixels);
      } else {
        mobileScale.value = 1;
      }
    };

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

    // Handle logout
    const handleLogout = () => {
      if (confirm('Are you sure you want to logout? You will be returned to the Dashboard.')) {
        // Remove authentication
        localStorage.removeItem('authenticatedMember');
        
        // Log the logout activity
        const activities = JSON.parse(localStorage.getItem('memberActivities') || '[]');
        activities.push({
          memberName: authenticatedMember.value?.name || 'Unknown',
          action: 'Logged out',
          timestamp: new Date().toISOString(),
          branch: route.query.branch || 'Unknown'
        });
        localStorage.setItem('memberActivities', JSON.stringify(activities));
        
        // Navigate to Dashboard
        router.push({ name: 'Dashboard' });
      }
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
      if (!receiptOuterRef.value) return;
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
          await fetch(`${API_BASE}/receipt`, {
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
        jsPDF: { unit: 'in', format: [8.268, 5.824], orientation: 'landscape' },
      };

      try {
        // Add exporting class to temporarily restore original dimensions
        receiptOuterRef.value.classList.add('exporting');
        
        // Wait for styles to be applied
        await new Promise(resolve => setTimeout(resolve, 100));
        
        await html2pdf().set(options).from(receiptOuterRef.value).save();
        
        // Log activity
        logActivity(`Created Receipt #${receiptNumber.value || 'N/A'}`);
        
        incrementReceiptNumber();
      } finally {
        // Always remove exporting class
        receiptOuterRef.value?.classList.remove('exporting');
      }
    };

    const handleExportJPEG = async () => {
      if (!receiptOuterRef.value) return;
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
          await fetch(`${API_BASE}/receipt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(receiptData),
          });
        } catch (error) {
          console.error('Failed to save receipt:', error);
        }

      try {
        // Add exporting class to temporarily restore original dimensions
        receiptOuterRef.value.classList.add('exporting');
        
        // Wait for styles to be applied
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const dataUrl = await htmlToImage.toJpeg(receiptOuterRef.value, {
          quality: 0.95,
          pixelRatio: 3,
        });
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `receipt-${receiptNumber.value}.jpg`;
        link.click();
        
        // Log activity
        logActivity(`Created Receipt #${receiptNumber.value || 'N/A'}`);
        
        incrementReceiptNumber();
      } finally {
        // Always remove exporting class
        receiptOuterRef.value?.classList.remove('exporting');
      }
    };

    const logActivity = (action) => {
      const authMember = localStorage.getItem('authenticatedMember');
      if (!authMember) return;
      
      const member = JSON.parse(authMember);
      const activities = JSON.parse(localStorage.getItem('memberActivities') || '[]');
      
      activities.unshift({
        id: Date.now(),
        memberName: member.name,
        action,
        branch: member.branch,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 50 activities
      if (activities.length > 50) {
        activities.splice(50);
      }
      
      localStorage.setItem('memberActivities', JSON.stringify(activities));
    };

    return {
      receiptRef,
      receiptOuterRef,
      sumOfInput1,
      sumOfInput2,
      paymentForInput1,
      paymentForInput2,
      showPreview,
      isMobile,
      mobileScale,
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
      authenticatedMember,
      showPasswordModal,
      passwordVerified,
      onPasswordVerified,
      onPasswordCancel,
      handleBack,
      handleLogout,
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

<style scoped>
/* Stylish input fields with elegant fonts */
input.flex-1,
input.w-full {
  font-family: 'Playfair Display', serif;
  font-weight: 500;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
  color: #1e293b;
  transition: all 0.3s ease;
}

input.flex-1:focus,
input.w-full:focus {
  border-color: #3b82f6;
  color: #0f172a;
  font-weight: 600;
}

input::placeholder {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  opacity: 0.5;
}

/* Optional: Different font styles to choose from */
/* 
Option 1 - Elegant Serif (Current - Playfair Display)
font-family: 'Playfair Display', serif;

Option 2 - Handwritten Style
font-family: 'Dancing Script', cursive;

Option 3 - Classic Handwriting
font-family: 'Great Vibes', cursive;

Option 4 - Modern Cursive
font-family: 'Satisfy', cursive;
*/

/* Export mode - forces original dimensions */
.exporting {
  width: 7.268in !important;
  height: 5.324in !important;
  min-width: 7.268in !important;
  transform: none !important;
}

/* Mobile receipt preview styles - only apply when NOT exporting */
@media (max-width: 768px) {
  /* Base font size reduction for all text in receipt */
  div[ref="receiptOuterRef"]:not(.exporting),
  div[ref="receiptOuterRef"]:not(.exporting) * {
    font-size: 0.55rem !important;
  }

  /* Organization name - slightly bigger but still reduced */
  div[ref="receiptOuterRef"]:not(.exporting) .text-xl,
  div[ref="receiptOuterRef"]:not(.exporting) h2 {
    font-size: 0.7rem !important;
    line-height: 1.2 !important;
  }

  /* Receipt title "CASH RECEIPT" */
  div[ref="receiptOuterRef"]:not(.exporting) .text-2xl,
  div[ref="receiptOuterRef"]:not(.exporting) .text-md {
    font-size: 0.65rem !important;
  }

  /* Date, receipt number and all small text */
  div[ref="receiptOuterRef"]:not(.exporting) .text-sm,
  div[ref="receiptOuterRef"]:not(.exporting) .text-xs {
    font-size: 0.5rem !important;
  }

  /* All input fields */
  div[ref="receiptOuterRef"]:not(.exporting) input {
    font-size: 0.55rem !important;
  }

  /* All paragraphs and spans */
  div[ref="receiptOuterRef"]:not(.exporting) p,
  div[ref="receiptOuterRef"]:not(.exporting) span {
    font-size: 0.55rem !important;
  }

  /* Amount display (Naira/Kobo) - keep slightly bigger */
  div[ref="receiptOuterRef"]:not(.exporting) .text-lg {
    font-size: 0.75rem !important;
  }

  /* Logo sizing - make bigger on mobile */
  div[ref="receiptOuterRef"]:not(.exporting) img[alt*="Logo"] {
    height: 150px !important;
    width: auto !important;
  }

  /* Signature images */
  div[ref="receiptOuterRef"]:not(.exporting) img[alt*="Signature"] {
    height: 30px !important;
    max-width: 80px !important;
  }

  /* Italic signature label */
  div[ref="receiptOuterRef"]:not(.exporting) .italic {
    font-size: 0.5rem !important;
  }
}
</style>
