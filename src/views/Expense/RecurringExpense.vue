<template>
  <div class="flex h-screen">
    <Sidebar />

    <main class="flex-1 p-6 bg-gray-100">
      <div class="bg-white shadow-lg rounded-xl p-6 max-w-5xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">Recurring Expense (Batch Create)</h1>

        <!-- Table of expenses -->
        <table class="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left">Item</th>
              <th class="px-4 py-2 text-left">Category</th>
              <th class="px-4 py-2 text-left">Price</th>
              <th class="px-4 py-2 text-left">Currency</th>
              <th class="px-4 py-2 text-left">Note</th>
              <th class="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(expense, index) in expenses" :key="index" class="border-t hover:bg-gray-50">
              <td class="px-4 py-2">
                <input v-model="expense.item" placeholder="Item" class="border rounded px-2 py-1 w-full" />
              </td>
              <td class="px-4 py-2">
                <input v-model="expense.category" placeholder="Category" class="border rounded px-2 py-1 w-full" />
              </td>
              <td class="px-4 py-2">
                <input type="number" v-model="expense.price" placeholder="Price"
                  class="border rounded px-2 py-1 w-full" />
              </td>
              <td class="px-4 py-2">
                <select v-model="expense.currency" class="border rounded px-2 py-1 w-full">
                  <option value="USD">USD</option>
                  <option value="KHR">KHR</option>
                </select>
              </td>
              <td class="px-4 py-2">
                <input v-model="expense.note" placeholder="Note" class="border rounded px-2 py-1 w-full" />
              </td>
              <td class="px-4 py-2 text-center">
                <button class="text-red-500 hover:text-red-700" @click="removeExpense(index)"
                  v-if="expenses.length > 1">
                  ❌
                </button>
              </td>
            </tr>
          </tbody>

        </table>

        <!-- Controls -->
        <div class="mt-4 flex justify-end space-x-4">
          <button class="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600" @click="addExpense">
            ➕ Add Row
          </button>
          <button class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600" @click="submitBatch">
            🚀 Submit Batch
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import { createBatchExpense } from "@/services/api";

// Reactive list of expenses
const expenses = ref([
  { item: "", category: "", price: null, currency: "", note: "" },
]);

// Add row
const addExpense = () => {
  expenses.value.push({ item: "", category: "", price: null, currency: "", note: "" });
};

// Remove row
const removeExpense = (index) => {
  expenses.value.splice(index, 1);
};

const submitBatch = async () => {
  try {
    // Convert keys to snake_case
    const payload = expenses.value.map(exp => ({
      item: exp.item,
      category: exp.category,
      price: exp.price,
      currency: exp.currency,
      note: exp.note
    }));

    // Rename the root property to match backend
    const res = await createBatchExpense(payload.map(e => ({
      item: e.item,
      category: e.category,
      price: e.price,
      currency: e.currency,
      note: e.note
    })));

    console.log("Batch create response:", res);
    alert("Batch expenses created successfully!");
    // Reset form
    expenses.value = [{ item: "", category: "", price: null, currency: "", note: "" }];
  } catch (err) {
    console.error("Batch create failed:", err);
    alert("Failed to create batch expenses.");
  }
};

</script>
