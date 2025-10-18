<template>
  <div class="h-screen overflow-y-auto bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
    <!-- Background Pattern -->
    <div class="fixed inset-0 opacity-5 pointer-events-none">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(168,85,247,0.3),_transparent_50%)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(236,72,153,0.2),_transparent_50%)]"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/80 dark:bg-purple-900/30 text-sm font-semibold text-purple-700 dark:text-purple-300 mb-3">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Digital Signature Creator
            </div>
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Create Your Signature</h1>
            <p class="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl">
              Draw your signature using your mouse or touch screen, then save it to use in invoices and receipts.
            </p>
          </div>
          <BaseButton variant="ghost" @click="handleBack">
            ← Back to Dashboard
          </BaseButton>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Signature Creator (Left - 2 columns) -->
        <div class="lg:col-span-2">
          <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Draw Signature
              </h2>
              <div class="flex gap-2">
                <BaseButton 
                  variant="primary" 
                  @click="handleSave"
                  :disabled="!hasSignature || isSaving"
                >
                  <span v-if="isSaving">💾 Saving...</span>
                  <span v-else>💾 Save Signature</span>
                </BaseButton>
              </div>
            </div>

            <!-- Canvas -->
            <SignatureCanvas
              ref="signatureCanvas"
              width="100%"
              height="400px"
              @update="handleSignatureUpdate"
              @clear="handleSignatureClear"
            />

            <!-- Tips -->
            <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-blue-900 dark:text-blue-200">Tips for best results:</p>
                  <ul class="mt-1 text-xs text-blue-800 dark:text-blue-300 space-y-1">
                    <li>• Use a stylus or your finger on touch screens for smoother signatures</li>
                    <li>• Keep your signature within the canvas area</li>
                    <li>• You can adjust pen size and color before drawing</li>
                    <li>• Use "Undo" to remove the last stroke or "Clear" to start over</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Saved Signatures (Right - 1 column) -->
        <div class="lg:col-span-1">
          <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Saved Signatures</h2>
              <button
                @click="loadSignatures"
                class="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            <!-- Loading State -->
            <div v-if="loadingSignatures" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">Loading signatures...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="savedSignatures.length === 0" class="text-center py-8">
              <svg class="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <p class="text-sm text-slate-600 dark:text-slate-400">No signatures saved yet</p>
              <p class="text-xs text-slate-500 dark:text-slate-500 mt-1">Create and save your first signature!</p>
            </div>

            <!-- Signatures List -->
            <div v-else class="space-y-3 max-h-[600px] overflow-y-auto">
              <div
                v-for="signature in savedSignatures"
                :key="signature.id"
                class="group bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 p-3 hover:shadow-md transition-all"
              >
                <!-- Signature Preview -->
                <div class="bg-white dark:bg-slate-800 rounded-lg p-3 mb-2 border border-slate-200 dark:border-slate-600">
                  <img 
                    :src="signature.dataURL" 
                    alt="Signature" 
                    class="w-full h-20 object-contain"
                  />
                </div>

                <!-- Signature Info -->
                <div class="flex items-center justify-between mb-2">
                  <div>
                    <p class="text-xs font-medium text-slate-600 dark:text-slate-400">
                      {{ formatDate(signature.createdAt) }}
                    </p>
                    <p v-if="signature.name" class="text-sm font-semibold text-slate-900 dark:text-white">
                      {{ signature.name }}
                    </p>
                  </div>
                  <span 
                    v-if="signature.isPrimary"
                    class="px-2 py-1 text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full"
                  >
                    Primary
                  </span>
                </div>

                <!-- Actions -->
                <div class="flex gap-2">
                  <button
                    @click="setAsPrimary(signature)"
                    :disabled="signature.isPrimary"
                    class="flex-1 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ signature.isPrimary ? '✓ Primary' : 'Set as Primary' }}
                  </button>
                  <button
                    @click="downloadSignature(signature)"
                    class="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button
                    @click="deleteSignature(signature)"
                    class="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="mt-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 p-6">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">Quick Actions</h3>
            <div class="space-y-2">
              <button
                @click="router.push({ name: 'Invoice', query: { branch: branchName } })"
                class="w-full px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors text-left flex items-center gap-3"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Use in Invoice
              </button>
              <button
                @click="router.push({ name: 'Receipt', query: { branch: branchName } })"
                class="w-full px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left flex items-center gap-3"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Use in Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseButton from '@/components/BaseButton.vue';
import SignatureCanvas from '@/components/SignatureCanvas.vue';
import { 
  saveSignature, 
  getAllSignatures, 
  deleteSignature as deleteSignatureFromDB,
  updateSignature 
} from '@/firebase/database';

export default defineComponent({
  name: 'SignaturePage',
  components: {
    BaseButton,
    SignatureCanvas
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const signatureCanvas = ref(null);
    
    const branchName = computed(() => route.query.branch || '');
    const hasSignature = ref(false);
    const currentSignatureData = ref(null);
    const isSaving = ref(false);
    const savedSignatures = ref([]);
    const loadingSignatures = ref(false);

    onMounted(() => {
      if (branchName.value) {
        loadSignatures();
      }
    });

    const handleSignatureUpdate = (dataURL) => {
      currentSignatureData.value = dataURL;
      hasSignature.value = !!dataURL;
    };

    const handleSignatureClear = () => {
      hasSignature.value = false;
      currentSignatureData.value = null;
    };

    const handleSave = async () => {
      if (!currentSignatureData.value || !branchName.value) {
        alert('Please draw a signature first and ensure branch is selected.');
        return;
      }

      const name = prompt('Enter a name for this signature (optional):');
      
      isSaving.value = true;
      try {
        const signatureData = {
          dataURL: currentSignatureData.value,
          name: name || 'Untitled Signature',
          isPrimary: savedSignatures.value.length === 0, // First signature is primary
          createdAt: new Date().toISOString()
        };

        const result = await saveSignature(branchName.value, signatureData);
        
        if (result.success) {
          alert('✅ Signature saved successfully!');
          signatureCanvas.value.clear();
          loadSignatures();
        } else {
          alert('❌ Failed to save signature: ' + result.error);
        }
      } catch (error) {
        console.error('Error saving signature:', error);
        alert('❌ Error saving signature. Please try again.');
      } finally {
        isSaving.value = false;
      }
    };

    const loadSignatures = async () => {
      if (!branchName.value) return;

      loadingSignatures.value = true;
      try {
        const result = await getAllSignatures(branchName.value);
        if (result.success) {
          savedSignatures.value = result.data;
        } else {
          console.error('Failed to load signatures:', result.error);
        }
      } catch (error) {
        console.error('Error loading signatures:', error);
      } finally {
        loadingSignatures.value = false;
      }
    };

    const setAsPrimary = async (signature) => {
      if (!branchName.value) return;

      try {
        // Remove primary status from all signatures
        for (const sig of savedSignatures.value) {
          if (sig.isPrimary && sig.id !== signature.id) {
            await updateSignature(branchName.value, sig.id, { isPrimary: false });
          }
        }

        // Set new primary
        await updateSignature(branchName.value, signature.id, { isPrimary: true });
        
        loadSignatures();
        alert('✅ Primary signature updated!');
      } catch (error) {
        console.error('Error setting primary signature:', error);
        alert('❌ Error updating primary signature.');
      }
    };

    const deleteSignature = async (signature) => {
      if (!confirm(`Delete this signature? This action cannot be undone.`)) {
        return;
      }

      if (!branchName.value) return;

      try {
        const result = await deleteSignatureFromDB(branchName.value, signature.id);
        if (result.success) {
          loadSignatures();
          alert('✅ Signature deleted successfully!');
        } else {
          alert('❌ Failed to delete signature: ' + result.error);
        }
      } catch (error) {
        console.error('Error deleting signature:', error);
        alert('❌ Error deleting signature.');
      }
    };

    const downloadSignature = (signature) => {
      const link = document.createElement('a');
      link.href = signature.dataURL;
      link.download = `signature-${signature.name || 'untitled'}.png`;
      link.click();
    };

    const formatDate = (timestamp) => {
      if (!timestamp) return 'N/A';
      try {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return 'N/A';
      }
    };

    const handleBack = () => {
      router.push({ name: 'Dashboard', query: { branch: branchName.value } });
    };

    return {
      signatureCanvas,
      branchName,
      hasSignature,
      currentSignatureData,
      isSaving,
      savedSignatures,
      loadingSignatures,
      handleSignatureUpdate,
      handleSignatureClear,
      handleSave,
      loadSignatures,
      setAsPrimary,
      deleteSignature,
      downloadSignature,
      formatDate,
      handleBack,
      router
    };
  }
});
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(168, 85, 247, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(168, 85, 247, 0.7);
}
</style>
