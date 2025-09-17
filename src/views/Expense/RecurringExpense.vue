<template>
  <div class="flex h-screen">
    <Sidebar />

    <main class="flex-1 p-4 bg-gray-100">
      <div class="bg-white shadow-lg rounded-xl p-4 mx-auto max-w-md">
        <br><br>
        <h1 class="text-xl font-bold mb-4 text-center">Recurring Expense (Batch Create)</h1>

        <div v-for="(expense, index) in expenses" :key="index" class="bg-gray-50 p-4 rounded-lg mb-3 shadow-sm">
          <div class="flex flex-col space-y-2">
            <label class="font-medium">Item</label>
            <input v-model="expense.item" placeholder="Item" class="border rounded px-2 py-1 w-full" />

            <label class="font-medium">Category</label>
            <input v-model="expense.category" placeholder="Category" class="border rounded px-2 py-1 w-full" />

            <label class="font-medium">Price</label>
            <input type="number" v-model="expense.price" placeholder="Price" class="border rounded px-2 py-1 w-full" />

            <label class="font-medium">Currency</label>
            <select v-model="expense.currency" class="border rounded px-2 py-1 w-full">
              <option value="USD">USD</option>
              <option value="KHR">KHR</option>
            </select>

            <label class="font-medium">Note</label>
            <input v-model="expense.note" placeholder="Note" class="border rounded px-2 py-1 w-full" />

            <div class="flex justify-end mt-2">
              <button v-if="expenses.length > 1" @click="removeExpense(index)"
                class="text-red-500 hover:text-red-700 font-bold">
                ❌ Remove
              </button>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="mt-4 flex flex-col space-y-2">
          <button @click="addExpense"
            class="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 w-full">
            ➕ Add Row
          </button>
          <button @click="submitBatch"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 w-full">
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

const expenses = ref([
  { item: "", category: "", price: null, currency: "", note: "" },
]);

const addExpense = () => {
  expenses.value.push({ item: "", category: "", price: null, currency: "", note: "" });
};

const removeExpense = (index) => {
  expenses.value.splice(index, 1);
};

const submitBatch = async () => {
  try {
    const payload = expenses.value.map(exp => ({
      item: exp.item,
      category: exp.category,
      price: exp.price,
      currency: exp.currency,
      note: exp.note
    }));

    const res = await createBatchExpense(payload);
    console.log("Batch create response:", res);
    alert("Batch expenses created successfully!");
    expenses.value = [{ item: "", category: "", price: null, currency: "", note: "" }];
  } catch (err) {
    console.error("Batch create failed:", err);
    alert("Failed to create batch expenses.");
  }
};
</script>

<style scoped>
/* Mobile-specific styling for 414px devices */
@media screen and (max-width: 414px) {
  main {
    padding: 4px;
  }

  h1 {
    font-size: 18px;
  }

  .bg-white {
    padding: 12px;
  }

  input, select, button {
    font-size: 14px;
  }
}
</style>
