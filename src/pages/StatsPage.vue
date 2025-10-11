<template>
  <div class="h-screen overflow-y-auto bg-slate-50 dark:bg-slate-900 py-12 px-4">
    <div class="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <header class="flex flex-col gap-2">
        <p class="text-sm font-semibold uppercase tracking-widest text-emerald-500">Branch Analytics</p>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Transaction Statistics</h1>
            <p class="max-w-xl text-sm text-slate-600 dark:text-slate-300">
              Review historic activity by filtering or searching through recorded transactions.
            </p>
          </div>
          <BaseButton variant="secondary" @click="handleBack">Back to Dashboard</BaseButton>
        </div>
      </header>

      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800">
        <div class="flex flex-wrap items-center gap-4 border-b border-slate-200 pb-4 dark:border-slate-700">
          <div class="relative flex-1 min-w-[220px]">
            <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z" />
              </svg>
            </span>
            <input
              v-model="searchTerm"
              type="search"
              placeholder="Search by name or description"
              class="w-full rounded-2xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-emerald-500"
            />
          </div>
          <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
            <label class="font-medium">Date:</label>
            <input
              v-model="filters.start"
              type="date"
              class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
            <span>—</span>
            <input
              v-model="filters.end"
              type="date"
              class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
            <label class="font-medium">Type:</label>
            <select
              v-model="filters.type"
              class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="all">All</option>
              <option value="invoice">Invoice</option>
              <option value="receipt">Receipt</option>
              <option value="other">Other</option>
            </select>
          </div>
          <BaseButton variant="secondary" @click="resetFilters">Clear</BaseButton>
        </div>

        <div class="mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
          <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead class="bg-slate-100 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-700 dark:text-slate-300">
              <tr>
                <th scope="col" class="px-4 py-3 text-left">Date</th>
                <th scope="col" class="px-4 py-3 text-left">Name</th>
                <th scope="col" class="px-4 py-3 text-left">Description</th>
                <th scope="col" class="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white text-sm dark:divide-slate-800 dark:bg-slate-900">
              <tr v-for="transaction in filteredTransactions" :key="transaction.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <td class="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {{ formatDate(transaction.date) }}
                </td>
                <td class="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                  {{ transaction.name }}
                </td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {{ transaction.description }}
                </td>
                <td class="px-4 py-3 text-right font-semibold text-slate-800 dark:text-slate-100">
                  {{ formatCurrency(transaction.amount) }}
                </td>
              </tr>
              <tr v-if="filteredTransactions.length === 0">
                <td colspan="4" class="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-300">
                  No transactions found for the selected filters.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <footer class="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="rounded-xl bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
              {{ filteredTransactions.length }} results
            </span>
            <span class="text-sm text-slate-600 dark:text-slate-300">
              Total Amount: <strong class="text-slate-900 dark:text-white">{{ formatCurrency(totalAmount) }}</strong>
            </span>
          </div>
          <div class="text-xs text-slate-400 dark:text-slate-500">
            Data is illustrative. Integrate with backend analytics when ready.
          </div>
        </footer>
      </section>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseButton from '@/components/BaseButton.vue';
import { useFinanceStore } from '@/stores/finance';

const makeTransaction = (date, name, amount, description, type) => ({
  id: `${date}-${name}-${amount}-${type}`,
  date,
  name,
  amount,
  description,
  type,
});

export default defineComponent({
  name: 'StatsPage',
  components: {
    BaseButton,
  },
  setup() {
    const router = useRouter();
    const financeStore = useFinanceStore();

    const fallbackTransactions = ref([
      makeTransaction('2025-09-28', 'Amina Yusuf', 75000, 'CPD workshop facilitation fee', 'invoice'),
      makeTransaction('2025-09-30', 'Emeka Okoye', 48000, 'Membership renewal payment', 'receipt'),
      makeTransaction('2025-10-02', 'Kaduna Branch Hall', 31000, 'Venue booking for seminar', 'invoice'),
      makeTransaction('2025-10-03', 'Seyi Adeboye', 22000, 'Student conference registration', 'receipt'),
      makeTransaction('2025-10-04', 'Logistics Express', 12000, 'Courier services for study packs', 'invoice'),
      makeTransaction('2025-10-05', 'Maryam Musa', 15000, 'Annual dues settlement', 'receipt'),
      makeTransaction('2025-10-06', 'ICT Outsource Ltd', 54000, 'Software maintenance retainer', 'invoice'),
      makeTransaction('2025-10-07', 'Training Support Fund', 190000, 'Grant disbursement', 'other'),
    ]);

    const transactions = computed(() => {
      if (financeStore.allTransactions.length === 0) {
        return fallbackTransactions.value;
      }
      return financeStore.allTransactions.map((transaction) => ({
        id: transaction.id,
        date: transaction.date,
        name: transaction.name,
        amount: transaction.amount,
        description: transaction.description || transaction.summary || `${transaction.type} entry`,
        type: transaction.type,
      }));
    });

    const searchTerm = ref('');
    const filters = reactive({ start: '', end: '', type: 'all' });

    const matchesSearch = (transaction, query) => {
      if (!query) return true;
      const haystack = `${transaction.name} ${transaction.description}`.toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    };

    const matchesDate = (transaction, { start, end }) => {
      if (!start && !end) return true;
      const txDate = new Date(transaction.date);
      if (start) {
        const from = new Date(start);
        if (txDate < from) return false;
      }
      if (end) {
        const to = new Date(end);
        if (txDate > to) return false;
      }
      return true;
    };

    const matchesType = (transaction, type) => type === 'all' || transaction.type === type;

    const filteredTransactions = computed(() =>
      transactions.value.filter((transaction) =>
        matchesSearch(transaction, searchTerm.value) &&
        matchesDate(transaction, filters) &&
        matchesType(transaction, filters.type)
      )
    );

    const totalAmount = computed(() =>
      filteredTransactions.value.reduce((sum, tx) => sum + tx.amount, 0)
    );

    const resetFilters = () => {
      searchTerm.value = '';
      filters.start = '';
      filters.end = '';
      filters.type = 'all';
    };

    const formatCurrency = (value) =>
      new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value || 0);

    const formatDate = (value) =>
      new Intl.DateTimeFormat('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(value));

    const handleBack = () => {
      router.push({ name: 'Dashboard' });
    };

    return {
      transactions,
      searchTerm,
      filters,
      filteredTransactions,
      totalAmount,
      resetFilters,
      formatCurrency,
      formatDate,
      handleBack,
    };
  },
});
</script>
