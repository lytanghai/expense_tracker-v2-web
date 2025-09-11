<template>
  <div>
    <h2>Live Gold Price (XAU/USD)</h2>
    <p>{{ price }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const price = ref(0);
let ws = null;

onMounted(() => {
  const apiKey = "fa4558aef2b5486ca4894bd76dbea032";
  ws = new WebSocket(`wss://ws.twelvedata.com/v1/quotes/price?apikey=${apiKey}`);

  ws.onopen = () => {
    console.log("WebSocket connected");

    ws.send(JSON.stringify({
      action: "subscribe",
      params: { symbols: ["XAU/USD"] }
    }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    price.value = parseFloat(data["XAU/USD"]?.price || 0);
    console.log("Live Gold Price:", price.value);
  };

  ws.onerror = (err) => console.error("WebSocket error:", err);
});

onBeforeUnmount(() => {
  if (ws) ws.close();
});
</script>
