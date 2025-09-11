<template>
  <div>
    <h2>Live Gold Price</h2>
    <apexchart type="candlestick" height="400" :options="chartOptions" :series="series" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const series = ref([{ data: [{ x: new Date(), y: [0,0,0,0] }] }]);

const chartOptions = {
  chart: { type: "candlestick", height: 400, animations: { enabled: true } },
  xaxis: { type: "datetime" },
  yaxis: { tooltip: { enabled: true } }
};

let ws = null;

onMounted(() => {
  ws = new WebSocket("wss://stream.binance.com:9443/ws/xautusdt@kline_1m");

  ws.onmessage = (event) => {
    const k = JSON.parse(event.data).k;
    const candle = {
      x: new Date(k.t),
      y: [parseFloat(k.o), parseFloat(k.h), parseFloat(k.l), parseFloat(k.c)]
    };

    const chartData = series.value[0].data;
    if (chartData.length && chartData[chartData.length - 1].x.getTime() === candle.x.getTime()) {
      chartData[chartData.length - 1] = candle;
    } else {
      series.value = [{ data: [...chartData, candle] }];
      if (series.value[0].data.length > 100) series.value[0].data.shift();
    }
  };
});

onBeforeUnmount(() => { if (ws) ws.close(); });
</script>
