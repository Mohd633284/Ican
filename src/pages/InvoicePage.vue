<template>
  <div>
    <!-- Password Verification Modal -->
    <PasswordVerificationModal
      :is-open="showPasswordModal"
      target-page="Invoice Page"
      @verified="onPasswordVerified"
      @cancel="onPasswordCancel"
    />

    <div class="h-screen overflow-y-auto flex flex-col gap-6 items-center bg-slate-100 dark:bg-slate-900 pt-8 pb-24 px-4">
      <!-- Member Info Banner -->
      <div class="w-full max-w-4xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-3 rounded-lg shadow-md flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-semibold">Logged in as: {{ authenticatedMember?.name || 'Unknown' }}</p>
          <p class="text-xs opacity-90">{{ authenticatedMember?.role || 'Member' }}</p>
        </div>
      </div>
      <button
        @click="handleLogout"
        class="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
    </div>

    <!-- Control Panel Section -->
    <section class="w-full max-w-4xl bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <!-- Title -->
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

        <!-- Action Buttons -->
        <div class="flex gap-3 flex-wrap items-center">
          <BaseButton variant="primary" @click="handleExportPDF" :disabled="isExporting">
            📄 Export PDF
          </BaseButton>
          
          <BaseButton variant="secondary" @click="handleExportJPEG" :disabled="isExporting">
            🖼️ Export JPEG
          </BaseButton>

          <div class="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>

          <BaseButton variant="ghost" @click="handleBack">
            ← Back to Dashboard
          </BaseButton>
        </div>
      </div>

      <!-- Settings Row -->
      <div class="mt-4 flex justify-between items-center flex-wrap gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex gap-4 flex-wrap">
          <!-- Auto Receipt Toggle -->
          <label class="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
            <input type="checkbox" v-model="autoReceiptNumber" class="rounded border-gray-300 cursor-pointer accent-emerald-600" />
            <span>Auto Receipt #</span>
          </label>

          <!-- Auto Date Toggle -->
          <label class="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
            <input type="checkbox" v-model="autoDate" class="rounded border-gray-300 cursor-pointer accent-emerald-600" />
            <span>Auto Date</span>
          </label>
        </div>

        <!-- Summary Display -->
        <div class="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg border border-emerald-200 dark:border-emerald-700">
          <div class="flex items-center gap-4 text-sm">
            <div>
              <span class="text-slate-600 dark:text-slate-400">Subtotal:</span>
              <span class="font-bold text-slate-900 dark:text-white ml-2">{{ toCurrency(subtotal) }}</span>
            </div>
            <div v-if="taxEnabled">
              <span class="text-slate-600 dark:text-slate-400">Tax:</span>
              <span class="font-bold text-emerald-600 ml-2">{{ toCurrency(taxAmount) }}</span>
            </div>
            <div class="pl-4 border-l border-emerald-300 dark:border-emerald-700">
              <span class="text-slate-600 dark:text-slate-400">Total:</span>
              <span class="font-bold text-lg text-emerald-700 dark:text-emerald-400 ml-2">{{ toCurrency(grandTotal) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

        <!-- Flex Container for Form and Preview -->
    <div class="w-full max-w-7xl flex flex-col lg:flex-row gap-6 items-start">

      <!-- Quick Fill Form Section -->
      <section class="w-full max-w-4xl">
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            📝 Quick Fill Form
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-300 mb-4">
            Fill out this form to automatically populate the invoice below
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
  
            <!-- Customer Name -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Customer Name
              </label>
              <input
                v-model="customerName"
                type="text"
                placeholder="Enter customer name"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
  
            <!-- LPO Number -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                LPO Number (Optional)
              </label>
              <input
                v-model="lpo"
                type="text"
                placeholder="Enter LPO number"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
  
            <!-- Customer Address -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Customer Address
              </label>
              <textarea
                v-model="customerAddress"
                rows="2"
                placeholder="Enter customer address"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none"
              ></textarea>
            </div>

            <!-- Invoice Items -->
            <div class="md:col-span-2">
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Invoice Items
                </label>
                
              </div>

              <!-- Items List -->
              <div class="space-y-4 max-h-[400px] overflow-y-auto p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-slate-700">
                <div 
                  v-for="(item, index) in items" 
                  :key="item.id"
                  class="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 relative"
                >
                  <!-- Delete Button -->
                  <button
                    v-if="items.length > 1"
                    @click="removeItem(item.id)"
                    class="absolute top-2 right-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    title="Remove item"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <div class="grid grid-cols-1 md:grid-cols-4 gap-3 pr-8">
                    <!-- Quantity -->
                    <div>
                      <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Quantity
                      </label>
                      <input
                        v-model.number="item.quantity"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <!-- Rate -->
                    <div>
                      <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Rate (₦)
                      </label>
                      <input
                        v-model.number="item.price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <!-- Tax -->
                    <div>
                      <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Tax (%)
                      </label>
                      <input
                        v-model.number="item.tax"
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="0.0"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <!-- Calculated Amount (Read-only) -->
                    <div>
                      <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Amount
                      </label>
                      <div class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-slate-600 text-slate-900 dark:text-white font-semibold">
                        {{ toCurrency(getItemAmount(item)) }}
                      </div>
                    </div>

                    <!-- Description -->
                    <div class="md:col-span-4">
                      <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Description
                      </label>
                      <textarea
                        v-model="item.description"
                        placeholder="Enter item description"
                        @keydown.enter.prevent="addItemAfter(index)"
                        rows="2"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none"
                        @input="autoResize"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

               <div class=" mt-2">
                <button
                     @click="addItem"
                     :disabled="items.length >= MAX_ITEMS"
                     class="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors"
                     :title="items.length >= MAX_ITEMS ? `Maximum ${MAX_ITEMS} items allowed` : 'Add new item'"
                   >
                     <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                     </svg>
                     Add Item
                </button>
              </div>

              <!-- Subtotal Display -->
              <div class="mt-3 bg-gray-50 dark:bg-slate-800 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Subtotal:</span>
                  <span class="text-lg font-bold text-slate-900 dark:text-white">{{ toCurrency(subtotal) }}</span>
                </div>
              </div>

              <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Press Enter in description field to quickly add a new item. Maximum {{ MAX_ITEMS }} items allowed.
              </p>
            </div>
  
            <!-- Tax Settings -->
            <div class="md:col-span-2 flex items-center gap-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <label class="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="taxEnabled" 
                  class="rounded border-gray-300 cursor-pointer accent-emerald-600"
                />
                <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Enable Tax</span>
              </label>
              
              <div v-if="taxEnabled" class="flex items-center gap-2 flex-1">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tax Rate (%):
                </label>
                <input
                  v-model.number="taxRate"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  class="w-24 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
                <span class="text-sm text-slate-600 dark:text-slate-400">
                  (Tax: {{ toCurrency(taxAmount) }})
                </span>
              </div>
            </div>
  
            <!-- Amount in Words -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Amount in Words (Auto-generated)
              </label>
              <div class="grid grid-cols-1 gap-2">
                <input
                  ref="sumOfInput1"
                  v-model="sumOf"
                  type="text"
                  placeholder="Line 1"
                  @input="handleSumOfOverflow"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white"
                />
                <input
                  ref="sumOfInput2"
                  v-model="sumOf2"
                  type="text"
                  placeholder="Line 2 (overflow)"
                  @input="handleSumOf2Input"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white"
                />
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Automatically filled based on total amount
              </p>
            </div>
          </div>
  
          <!-- Summary -->
          <div class="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-emerald-900 dark:text-emerald-300">
                Total Amount:
              </span>
              <span class="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                {{ toCurrency(grandTotal) }}
              </span>
            </div>
          </div>
  
          <!-- Mobile Preview Button -->
          <div class="mt-4 md:hidden">
            <button
              @click="showPreview = !showPreview"
              class="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              <svg v-if="!showPreview" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{{ showPreview ? 'Hide Preview' : 'Preview Invoice' }}</span>
            </button>
          </div>
        </div>
      </section>
  
      <!-- Invoice Preview Section - Hidden on mobile unless showPreview is true -->
      <section 
        class="w-full max-w-5xl flex items-center justify-center"
        :class="{ 'hidden md:flex': !showPreview }"
      >
        <!-- Mobile wrapper - scales down on mobile, full size on desktop -->
        <div class="w-full flex items-center justify-center md:p-4">
          <div
            ref="invoiceRef"
            id="meblink-invoice"
            class="relative bg-white shadow-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col w-full md:w-auto"
            style="height: 8.268in;"
            :style="{ 
              width: isMobile ? '100%' : '5.827in',
              transform: isMobile ? 'scale(1)' : 'scale(1)', 
              transformOrigin: 'top center' 
            }"
          >
           <!-- Header -->
          <div class="text-center border-b ">
            <div class="flex items-center ">
              <!-- Logo (Fixed - Developer Only) -->
              <div v-if="logoDataUrl" class="flex justify-center ">
                <img :src="logoDataUrl" alt="ICAN Logo" class="h-[120px]  object-contain" @error="logoDataUrl = null" />
              </div>
              
            
               <!-- Organization Name (Fixed - Developer Only) -->
              <div class="w-auto">
                <h2 class="text-blue-800 text-[14px]  font-bold uppercase text-left" style="font-family: 'Arial Narrow', 'Roboto Condensed', 'Oswald', sans-serif; font-weight: 900; letter-spacing: -0.5px;">
                Institute of Chartered Accountants  of Nigeria (ICAN)
                </h2>
                <p class="text-[12px] text-left">Established by Act of Parliament No. 15 of (1965) Minna and District Society</p>
            </div>
            
  
          <div class="pl-3 ml-2 border-solid border-l-[2px]">
              <!-- Address (Fixed - Developer Only) -->
            <p class="text-[10px] text-left ">
              {{ organizationAddress }}
            </p>
            
            <!-- Phone (Fixed - Developer Only) -->
            <p class="text-[10px] text-left mt-1 font-bold">
              Tel: {{ organizationPhone }}
            </p>
          </div>
  
            </div>
  
            <!-- Receipt Title -->
            <div class="flex justify-end items-center mt-[-20px] mb-2">
              <p class="text-sm font-semibold mr-[60px] bg-red-500 text-white inline-block px-3 py-1 rounded">
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
                  class="w-16 bg-transparent border-none focus:outline-none text-center"
                />
                </div>
            </div>
            </div>
  
          <!-- Customer details -->
          <div class="mt-2 grid grid-cols-3 gap-3">
            <div class="border-[1.5px] col-span-2 rounded-xl p-1.5">
              <div class="flex items-center gap-1">
              <span class="text-[10px] text-slate-400 font-medium">Name:</span>
              <input
                v-model="customerName"
                placeholder=" "
                class="flex-1 bg-transparent border-b border-dotted border-gray-400 focus:outline-none text-[11px]"
              />
            </div>
  
            <div class="flex items-center gap-1">
              <span class="text-[10px] text-slate-400 font-medium">Address:</span>
              <input
                v-model="customerAddress"
                placeholder=" "
                class="flex-1 bg-transparent border-b border-dotted border-gray-400 focus:outline-none text-[11px]"
              />
            </div>
            </div>
  
            <div class="border-[1.5px] rounded-xl p-1.5">
              <div class="flex items-center gap-1">
             <span class="text-[10px] text-slate-400 font-medium">Date:</span>
                  <input
                    v-model="date"
                    type="date"
                    :disabled="autoDate"
                    class="bg-transparent border-none focus:outline-none text-[11px]"
                  />
            </div>
  
            <div class="flex items-center gap-1">
              <span class="text-[10px] text-slate-400 font-medium whitespace-nowrap">L.P.O No.:</span>
              <input
                v-model="lpo"
                placeholder=" "
                class="w-full bg-transparent border-b border-dotted border-gray-400 focus:outline-none text-[11px]"
              />
            </div>
            </div>
  
  
           
          </div>
  
          <!-- Table -->
          <div class="mt-3 overflow-visible rounded relative">
            <table class="w-full text-xs table-fixed border-collapse overflow-visible">
              <thead class="bg-blue-800 text-white uppercase text-[10px]">
                <tr>
                  <th class="w-[7%] px-1.5 py-1 border text-center">QTY</th>
                  <th class="w-[56%] px-1.5 py-1 border text-left">DESCRIPTION OF GOODS</th>
                  <th class="w-[9%] px-1.5 py-1 border text-center">RATE</th>
                  <th class="w-[8%] px-1.5 py-1 border text-center">TAX%</th>
                  <th class="w-[16%] px-1.5 py-1 border text-center">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="item.id" class="border-t hover:bg-slate-50 transition-colors group">
                  <td class="px-1.5 py-0.5 text-center align-top">
                    <textarea 
                      v-model.number="item.quantity" 
                      rows="1"
                      placeholder=""
                      class="w-full text-center bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1 py-0.5 text-[11px] resize-none leading-tight" 
                      style="overflow: hidden; min-height: 20px;"
                      @input="autoResize"
                    ></textarea>
                  </td>
                  <td class="px-1.5 py-0.5 align-top">
                    <div class="w-full">
                      <textarea 
                        v-model="item.description" 
                        placeholder="Description" 
                        rows="1"
                        class="w-full bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1 py-0.5 text-[11px] resize-none leading-tight" 
                        style="overflow: hidden; min-height: 20px;"
                        @keydown.enter.prevent="addItemAfter(index)"
                        @input="autoResize"
                      ></textarea>
                    </div>
                  </td>
                  <td class="px-1.5 py-0.5 text-right align-top">
                    <textarea 
                      v-model.number="item.price" 
                      rows="1"
                      placeholder=""
                      class="w-full text-right bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1 py-0.5 text-[11px] resize-none leading-tight" 
                      style="overflow: hidden; min-height: 20px;"
                      @input="autoResize"
                    ></textarea>
                  </td>
                  <td class="px-1.5 py-0.5 text-center align-top">
                    <textarea 
                      v-model.number="item.tax" 
                      rows="1"
                      placeholder="0"
                      class="w-full text-center bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1 py-0.5 text-[11px] resize-none leading-tight" 
                      style="overflow: hidden; min-height: 20px;"
                      @input="autoResize"
                    ></textarea>
                  </td>
                  <td class="px-1.5 py-0.5 text-right font-semibold align-top relative overflow-visible text-[11px]">
                    {{ toCurrency(getItemAmount(item)) }}
                    <!-- Delete button absolutely positioned on right edge -->
                    <button 
                      v-if="items.length > 1"
                      @click="removeItem(item.id)" 
                      class="absolute right-[-13px] top-0 -translate-y-1/2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-200 w-5 h-5 flex items-center justify-center text-lg font-bold hover:scale-110 z-50"
                      title="Remove item"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <!-- Add button absolutely positioned at bottom left -->
            <button 
              @click="addItem"
              :disabled="items.length >= MAX_ITEMS"
              class="absolute left-[-13px] bottom-0 translate-y-1/2 text-emerald-400 hover:text-emerald-600 disabled:text-gray-300 disabled:cursor-not-allowed opacity-0 hover:opacity-100 transition-all duration-200 w-6 h-6 flex items-center justify-center text-2xl font-bold hover:scale-110 z-50 bg-white rounded-full shadow-md border border-emerald-300 disabled:border-gray-300"
              :title="items.length >= MAX_ITEMS ? `Maximum ${MAX_ITEMS} items allowed` : 'Add new item'"
            >
              +
            </button>
          </div>
  
          <!-- Total -->
          <div class="flex justify-end font-bold text-slate-900 text-base">
                <span class="mr-5">TOTAL</span>
                <span>{{ toCurrency(grandTotal) }}</span>
          </div>
  
          <!-- Footer -->
          <div class="mt-auto text-[12px]">
  
            <div>
              <div class="flex items-center gap-1">
              <span class="flex whitespace-nowrap">Amount in words:</span>
              <input
                ref="sumOfInput1"
                v-model="sumOf"
                @input="handleSumOfOverflow"
                class="flex-1 bg-transparent border-b border-dotted border-gray-400 focus:outline-none text-[10px]"
              />
            </div>
  
            <div class="flex items-center h-7 gap-2">
              <input
                ref="sumOfInput2"
                v-model="sumOf2"
                type="text"
                @input="handleSumOf2Input"
                class="flex-1 bg-transparent border-b border-dotted border-gray-400 focus:outline-none text-[10px]"
              />
              <span>Naira</span>
              <div class="w-14 bg-transparent border-b border-dotted border-gray-400 flex items-center justify-center text-center">
                <span>Only</span>
              </div>
              <span>Kobo</span>
            </div>
  
            </div>
  
             <div class="flex justify-between items-start mt-1">
             
              <!-- Signature 1 -->
              <div class="flex flex-col items-center gap-1">
                <!-- Signature 1 Image -->
                  <div v-if="signatureImage1">
                  <img :src="signatureImage1" alt="Signature 1" class="h-5 w-auto object-contain max-w-[80px] " />
                </div>
  
                <div v-else class="mb-1 h-7 w-28 border border-dashed border-gray-300 flex items-center justify-center text-[9px] text-gray-400">
                  No signature
                </div>
  
               <div class="w-full border-t border-gray-400 text-center mt-[-2px]">
                 <p class="italic">Signature</p>
               </div> 
              </div>
  
              <!-- Thanks for your patronage -->
               <div class="mt-2 text-emerald-600 text-center font-medium text-[10px]">Thanks for your patronage</div>
  
            <!-- Signature 2 -->
              <div class="flex flex-col items-center gap-1">
                <!-- Signature 2 Image -->
                  <div v-if="signatureImage2">
                  <img :src="signatureImage2" alt="Signature 1" class="h-7 w-auto object-contain max-w-[100px] " />
                </div>
  
                <div v-else class="mb-1 h-7 w-28 border border-dashed border-gray-300 flex items-center justify-center text-[9px] text-gray-400">
                  No signature
                </div>
  
               <div class="w-full border-t border-gray-400 text-center mt-[-2px]">
                 <p class="italic">Signature</p>
               </div> 
              </div>
            </div>
            
  
          </div>
        </div>
        <!-- End of invoice wrapper -->
        </div>
      </section>

    </div>
  </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import BaseButton from '@/components/BaseButton.vue';
import PasswordVerificationModal from '@/components/PasswordVerificationModal.vue';
import html2pdf from 'html2pdf.js';
import * as htmlToImage from 'html-to-image';
import { API_BASE } from '../api.js';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'MeblinkInvoice',
  components: { 
    BaseButton,
    PasswordVerificationModal 
  },
  setup() {
    const router = useRouter();
    const invoiceRef = ref(null);
    const isExporting = ref(false);
    const exportType = ref('');
    const authenticatedMember = ref(null);
    const showPasswordModal = ref(false);
    const passwordVerified = ref(false);

    // Load authenticated member info and check for password verification
    onMounted(() => {
      const memberData = localStorage.getItem('authenticatedMember');
      if (memberData) {
        authenticatedMember.value = JSON.parse(memberData);
        
        // Check if password was recently verified (within last 5 minutes)
        const lastVerification = sessionStorage.getItem('invoicePasswordVerified');
        const now = Date.now();
        
        if (lastVerification && (now - parseInt(lastVerification)) < 5 * 60 * 1000) {
          // Password was recently verified, no need to ask again
          passwordVerified.value = true;
        } else {
          // Show password modal
          showPasswordModal.value = true;
        }
      }

      // Calculate mobile scale
      calculateMobileScale();
      
      // Add resize listener for responsive scaling
      window.addEventListener('resize', calculateMobileScale);

      // Initialize all textareas to auto-resize
      setTimeout(() => {
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + 'px';
        });
      }, 100);
    });

    // Cleanup resize listener on component unmount
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
      sessionStorage.setItem('invoicePasswordVerified', Date.now().toString());
      sessionStorage.setItem('authenticatedMember', JSON.stringify(authenticatedMember.value));
    };

    // Handle password verification cancel
    const onPasswordCancel = () => {
      showPasswordModal.value = false;
      // Redirect back to dashboard
      router.push({ name: 'Dashboard' });
    };

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
    const showPreview = ref(false); // Mobile preview toggle

    // Mobile scaling for invoice preview
    const isMobile = ref(false);
    const mobileScale = ref(1);

    // Calculate scale for mobile devices
    const calculateMobileScale = () => {
      if (typeof window !== 'undefined') {
        const screenWidth = window.innerWidth;
        isMobile.value = screenWidth < 768; // md breakpoint
        
        if (isMobile.value) {
          // Invoice width is 5.827 inches = ~559px at 96dpi
          const invoiceWidthPx = 5.827 * 96;
          // Account for padding (4 * 16px on each side = 32px total)
          const availableWidth = screenWidth - 32;
          mobileScale.value = Math.min(availableWidth / invoiceWidthPx, 1);
        } else {
          mobileScale.value = 1;
        }
      }
    };

    // Fixed organization details (Developer only - users cannot change these)
    const organizationAddress = ref('Federal University of Technology, Bosso Campus, Minna');
    const organizationPhone = ref('+234 1 234 5678');

    // Logo data (Developer can set default logos here)
    const logoDataUrl = ref('/images/ican-logo.png'); // Main org logo
    
    // Signature images (Developer can set signature images here - PNG/JPEG)
    const signatureImage1 = ref('/images/signature1.png'); // Signature 1 image path
    const signatureImage2 = ref('/images/signature2.png'); // Signature 2 image path
    
    // Amount in words input refs
    const sumOfInput1 = ref(null);
    const sumOfInput2 = ref(null);
    const sumOf = ref('');
    const sumOf2 = ref('');

    const items = ref([
      { id: 1, description: '', quantity: '', price: 0.0, tax: 0.0 },
      { id: 2, description: '', quantity: '', price: 0.0, tax: 0.0 },
      { id: 3, description: '', quantity: '', price: 0.0, tax: 0.0 },
    ]);

    const MAX_ITEMS = 12; // Maximum number of rows allowed

    const addItem = () => {
      if (items.value.length >= MAX_ITEMS) {
        alert(`Maximum ${MAX_ITEMS} items allowed`);
        return;
      }
      items.value.push({ id: Date.now(), description: '', quantity: '', price: 0, tax: 0 });
    };

    const addItemAfter = (index) => {
      if (items.value.length >= MAX_ITEMS) {
        alert(`Maximum ${MAX_ITEMS} items allowed`);
        return;
      }
      const newItem = { id: Date.now(), description: '', quantity: '', price: 0, tax: 0 };
      items.value.splice(index + 1, 0, newItem);
      // Focus on the new item's description field after a short delay
      setTimeout(() => {
        const inputs = document.querySelectorAll('input[type="text"]');
        if (inputs[index + 1]) {
          inputs[index + 1].focus();
        }
      }, 50);
    };

    const removeItem = (id) => {
      if (items.value.length > 1) {
        items.value = items.value.filter(item => item.id !== id);
      }
    };

    const subtotal = computed(() =>
      items.value.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.price) || 0), 0)
    );

    const taxAmount = computed(() => {
      if (!taxEnabled.value) return 0;
      
      // Calculate tax from individual item tax percentages
      return items.value.reduce((sum, it) => {
        const itemTotal = (Number(it.quantity) || 0) * (Number(it.price) || 0);
        const itemTax = itemTotal * ((Number(it.tax) || 0) / 100);
        return sum + itemTax;
      }, 0);
    });

    const grandTotal = computed(() => subtotal.value + taxAmount.value);

    // Calculate individual item amount (including tax if enabled)
    const getItemAmount = (item) => {
      const baseAmount = (Number(item.quantity) || 0) * (Number(item.price) || 0);
      if (taxEnabled.value && item.tax) {
        const itemTax = baseAmount * ((Number(item.tax) || 0) / 100);
        return baseAmount + itemTax;
      }
      return baseAmount;
    };

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

    // Auto-resize textarea as user types
    const autoResize = (event) => {
      const textarea = event.target;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    };

    // Handle text overflow from first input to second input
    const handleSumOfOverflow = () => {
      if (sumOfInput1.value) {
        const maxLength = 60; // Approximate character limit for first line
        if (sumOf.value.length > maxLength) {
          const overflow = sumOf.value.substring(maxLength);
          sumOf.value = sumOf.value.substring(0, maxLength);
          sumOf2.value = overflow + sumOf2.value;
        }
      }
    };

    // Handle input for second sum field
    const handleSumOf2Input = () => {
      // Keep it within reasonable bounds
      const maxLength = 80;
      if (sumOf2.value.length > maxLength) {
        sumOf2.value = sumOf2.value.substring(0, maxLength);
      }
    };

    // Watch grandTotal and auto-fill amount in words
    watch(grandTotal, (newTotal) => {
      const words = amountInWords.value.words;
      // Auto-populate the sum fields
      sumOf.value = words.substring(0, 60);
      if (words.length > 60) {
        sumOf2.value = words.substring(60);
      } else {
        sumOf2.value = '';
      }
    });

    // Watch items to ensure textareas resize properly
    watch(items, () => {
      setTimeout(() => {
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
          if (textarea.value) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
          }
        });
      }, 50);
    }, { deep: true });

    // Auto-generate receipt number when needed
    watch(autoReceiptNumber, async (enabled) => {
      if (enabled) {
        try {
          const response = await fetch(`${API_BASE}/invoice/next-number`);
          if (response.ok) {
            const data = await response.json();
            receiptNumber.value = data.nextNumber || 1;
          }
        } catch (error) {
          console.error('Error fetching next receipt number:', error);
        }
      }
    });

    // Export handlers
    const handleExportPDF = async () => {
      if (!invoiceRef.value || isExporting.value) return;
      
      try {
        isExporting.value = true;
        exportType.value = 'pdf';
        
        // Add exporting class to restore original dimensions
        invoiceRef.value.classList.add('exporting');
        
        // Wait a moment for styles to apply
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Export the invoice
        console.log('Starting PDF export...');
        const element = invoiceRef.value;
        const filename = `ICAN-Invoice-${receiptNumber.value || Date.now()}.pdf`;
        const options = {
          margin: 0,
          filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 3, useCORS: true, logging: false },
          jsPDF: { unit: 'in', format: [5.827, 8.268], orientation: 'portrait' },
        };
        
        await html2pdf().set(options).from(element).save();
        
        // Log activity
        logActivity(`Created Invoice #${receiptNumber.value || 'N/A'}`);
        
        alert('✅ Invoice exported as PDF successfully!');
      } catch (error) {
        console.error('Error exporting PDF:', error);
        alert(`❌ Failed to export PDF: ${error.message}`);
      } finally {
        // Remove exporting class to restore mobile styles
        if (invoiceRef.value) {
          invoiceRef.value.classList.remove('exporting');
        }
        isExporting.value = false;
        exportType.value = '';
      }
    };

    const handleExportJPEG = async () => {
      if (!invoiceRef.value || isExporting.value) return;
      
      try {
        isExporting.value = true;
        exportType.value = 'jpeg';
        
        // Add exporting class to restore original dimensions
        invoiceRef.value.classList.add('exporting');
        
        // Wait a moment for styles to apply
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Export the invoice
        console.log('Starting JPEG export...');
        const dataUrl = await htmlToImage.toJpeg(invoiceRef.value, { 
          quality: 0.95, 
          pixelRatio: 3,
          cacheBust: true
        });
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `ICAN-Invoice-${receiptNumber.value || Date.now()}.jpg`;
        link.click();
        
        // Log activity
        logActivity(`Created Invoice #${receiptNumber.value || 'N/A'}`);
        
        alert('✅ Invoice exported as JPEG successfully!');
      } catch (error) {
        console.error('Error exporting JPEG:', error);
        alert(`❌ Failed to export JPEG: ${error.message}`);
      } finally {
        // Remove exporting class to restore mobile styles
        if (invoiceRef.value) {
          invoiceRef.value.classList.remove('exporting');
        }
        isExporting.value = false;
        exportType.value = '';
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

    const handleBack = () => {
      history.back();
    };

    const handleLogout = () => {
      if (confirm('Are you sure you want to logout? You will need to login again to access Invoice and Receipt pages.')) {
        localStorage.removeItem('authenticatedMember');
        
        // Log activity
        if (authenticatedMember.value) {
          const activities = JSON.parse(localStorage.getItem('memberActivities') || '[]');
          activities.unshift({
            id: Date.now(),
            memberName: authenticatedMember.value.name,
            action: 'Logged out',
            branch: authenticatedMember.value.branch,
            timestamp: new Date().toISOString(),
            details: 'Logged out from Invoice page'
          });
          localStorage.setItem('memberActivities', JSON.stringify(activities));
        }
        
        router.push({ name: 'Dashboard', query: { branch: authenticatedMember.value?.branch || '' } });
      }
    };

    return {
      invoiceRef,
      isExporting,
      exportType,
      authenticatedMember,
      showPasswordModal,
      passwordVerified,
      showPreview,
      isMobile,
      mobileScale,
      onPasswordVerified,
      onPasswordCancel,
      a5Width,
      a5Height,
      organizationName,
      organizationAddress,
      organizationPhone,
      logoDataUrl,
      signatureImage1,
      signatureImage2,
      sumOfInput1,
      sumOfInput2,
      sumOf,
      sumOf2,
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
      MAX_ITEMS,
      addItem,
      addItemAfter,
      removeItem,
      autoResize,
      handleSumOfOverflow,
      handleSumOf2Input,
      subtotal,
      taxEnabled,
      taxRate,
      taxAmount,
      grandTotal,
      getItemAmount,
      toCurrency,
      amountInWords,
      handleExportPDF,
      handleExportJPEG,
      handleBack,
      handleLogout,
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
  line-height: 1.2;
}

table tbody td {
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
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

/* Mobile invoice preview styles - Only apply when NOT exporting */
@media (max-width: 768px) {
  /* Smooth horizontal scroll for invoice preview on mobile */
  section > div.overflow-x-auto {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }

  /* Add padding to prevent content from touching edges */
  section > div.overflow-x-auto {
    padding: 1rem 0;
  }

  /* Ensure invoice maintains its size on mobile */
  #meblink-invoice:not(.exporting) {
    transform-origin: top left;
  }

  /* Show scroll hint shadow */
  section > div.overflow-x-auto {
    background: 
      linear-gradient(90deg, #fff 0%, transparent 5%),
      linear-gradient(-90deg, #fff 0%, transparent 5%),
      linear-gradient(90deg, rgba(0,0,0,0.1) 0%, transparent 2%),
      linear-gradient(-90deg, rgba(0,0,0,0.1) 0%, transparent 2%);
    background-repeat: no-repeat;
    background-size: 40px 100%, 40px 100%, 10px 100%, 10px 100%;
    background-position: 0 0, 100% 0, 0 0, 100% 0;
    background-attachment: local, local, scroll, scroll;
  }

  /* Reduce all font sizes inside invoice preview on mobile - EXCEPT when exporting */
  #meblink-invoice:not(.exporting) {
    font-size: 0.7rem !important;
  }

  #meblink-invoice:not(.exporting) h2 {
    font-size: 0.65rem !important;
  }

  #meblink-invoice:not(.exporting) p,
  #meblink-invoice:not(.exporting) span,
  #meblink-invoice:not(.exporting) input,
  #meblink-invoice:not(.exporting) textarea {
    font-size: 0.6rem !important;
  }

  #meblink-invoice:not(.exporting) .text-\[14px\] {
    font-size: 0.65rem !important;
  }

  #meblink-invoice:not(.exporting) .text-\[12px\] {
    font-size: 0.6rem !important;
  }

  #meblink-invoice:not(.exporting) .text-\[11px\] {
    font-size: 0.55rem !important;
  }

  #meblink-invoice:not(.exporting) .text-\[10px\] {
    font-size: 0.5rem !important;
  }

  #meblink-invoice:not(.exporting) .text-\[9px\] {
    font-size: 0.45rem !important;
  }

  #meblink-invoice:not(.exporting) .text-xs {
    font-size: 0.55rem !important;
  }

  #meblink-invoice:not(.exporting) .text-sm {
    font-size: 0.65rem !important;
  }

  #meblink-invoice:not(.exporting) .text-base {
    font-size: 0.75rem !important;
  }

  #meblink-invoice:not(.exporting) .text-lg {
    font-size: 0.8rem !important;
  }

  #meblink-invoice:not(.exporting) .text-2xl {
    font-size: 0.9rem !important;
  }

  /* Make logo bigger on mobile - EXCEPT when exporting */
  #meblink-invoice:not(.exporting) img[alt="ICAN Logo"] {
    height: 150px !important;
    max-height: 150px !important;
  }

  /* Adjust table font sizes - EXCEPT when exporting */
  #meblink-invoice:not(.exporting) table thead {
    font-size: 0.5rem !important;
  }

  #meblink-invoice:not(.exporting) table tbody td {
    font-size: 0.55rem !important;
  }

  /* Adjust padding/spacing for mobile - EXCEPT when exporting */
  #meblink-invoice:not(.exporting) {
    padding: 1rem !important;
  }
}

/* Ensure original dimensions are restored when exporting */
#meblink-invoice.exporting {
  width: 5.827in !important;
  height: 8.268in !important;
  padding: 1.5rem !important;
  font-size: 1rem !important;
  transform: none !important;
}

#meblink-invoice.exporting img[alt="ICAN Logo"] {
  height: 120px !important;
  max-height: 120px !important;
}
</style>

