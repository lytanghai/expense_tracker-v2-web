<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">🔧 API Tester</h2>

    <!-- URL input -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">URL:</label>
      <input
        v-model="url"
        type="text"
        placeholder="https://example.com/api"
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>

    <!-- Method select -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Method:</label>
      <select
        v-model="method"
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <option>GET</option>
        <option>POST</option>
        <option>PUT</option>
        <option>DELETE</option>
        <option>PATCH</option>
      </select>
    </div>

    <!-- Headers input -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Headers (JSON):</label>
      <textarea
        v-model="headersInput"
        rows="4"
        placeholder='{"Authorization": "Bearer token"}'
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"
      ></textarea>
    </div>

    <!-- Payload input -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Payload (JSON):</label>
      <textarea
        v-model="payloadInput"
        rows="6"
        placeholder='{"key": "value"}'
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"
      ></textarea>
    </div>

    <!-- Send button -->
    <div class="mb-6">
      <button
        :disabled="loading"
        @click="sendRequest"
        class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        {{ loading ? 'Sending...' : 'Send Request' }}
      </button>
    </div>

    <!-- Result display -->
    <div class="bg-gray-100 p-4 rounded-md border border-gray-300">
      <h3 class="text-lg font-semibold mb-2 text-gray-800">Response:</h3>
      <p v-if="statusCode !== null" class="text-sm text-gray-600 mb-2">
        Status: <strong>{{ statusCode }}</strong>
      </p>
      <pre class="text-sm text-gray-800 whitespace-pre-wrap break-all font-mono">{{ response }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const url = ref('')
const method = ref('GET')
const headersInput = ref('{}')
const payloadInput = ref('{}')
const response = ref('')
const statusCode = ref(null)
const loading = ref(false)

const sendRequest = async () => {
  statusCode.value = null;
  response.value = '';
  loading.value = true;

  if (!url.value) {
    response.value = '❌ URL is required';
    loading.value = false;
    return;
  }

  let headers = {};
  let payload = {};

  try {
    headers = JSON.parse(headersInput.value || '{}');
  } catch (e) {
    response.value = '❌ Invalid headers JSON';
    loading.value = false;
    return;
  }

  try {
    payload = JSON.parse(payloadInput.value || '{}');
  } catch (e) {
    response.value = '❌ Invalid payload JSON';
    loading.value = false;
    return;
  }

  // Build the wrapper object matching ExpReq structure
  const requestBody = {
    url: url.value,
    method: method.value,
    headers,
    payload,
  };

  try {
    // Set Content-Type header to application/json (if not already set)
    const combinedHeaders = { 'Content-Type': 'application/json', ...headers };

    // Send wrapper object as request body
    const res = await axios.post(
      'https://expense-tracker-v2-etap.onrender.com/guard/public/auth/experimental',
      requestBody,
      { headers: combinedHeaders }
    );

    statusCode.value = res.status;
    response.value = JSON.stringify(res.data, null, 2);
  } catch (err) {
    if (err.response) {
      statusCode.value = err.response.status;
      response.value = JSON.stringify(err.response.data, null, 2);
    } else {
      response.value = `❌ Error: ${err.message}`;
    }
  } finally {
    loading.value = false;
  }
};


</script>

<style scoped>
textarea {
  font-family: monospace;
}
</style>
