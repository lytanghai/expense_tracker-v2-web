<template>
  <div>
    <h2>Live Gold Price (XAUt/USDT)</h2>
    <apexchart type="candlestick" height="400" :options="chartOptions" :series="series" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import ApexCharts from "vue3-apexcharts";

const series = ref([
  {
    data: [], // { x: timestamp, y: [open, high, low, close] }
  },
]);

const chartOptions = {
  chart: {
    type: "candlestick",
    height: 400,
    animations: {
      enabled: true,
      dynamicAnimation: { speed: 500 },
    },
  },
  title: {
    text: "XAUt/USDT Live Chart",
    align: "left",
  },
  xaxis: {
    type: "datetime",
  },
  yaxis: {
    tooltip: { enabled: true },
  },
};

let ws = null;

onMounted(() => {
  // Connect to Binance WebSocket for 1-minute candlestick
  ws = new WebSocket("wss://stream.binance.com:9443/ws/xautusdt@kline_1m");

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const kline = data.k;

    const candle = {
      x: new Date(kline.t), // start time
      y: [
        parseFloat(kline.o),
        parseFloat(kline.h),
        parseFloat(kline.l),
        parseFloat(kline.c),
      ],
    };

    // Update last candle or add new
    const chartData = series.value[0].data;
    if (chartData.length && chartData[chartData.length - 1].x.getTime() === candle.x.getTime()) {
      chartData[chartData.length - 1] = candle; // update current candle
    } else {
      chartData.push(candle); // add new candle
      if (chartData.length > 100) chartData.shift(); // keep last 100 candles
    }
  };
});

onBeforeUnmount(() => {
  if (ws) ws.close();
});
</script>

<style scoped>
h2 {
  text-align: center;
  margin-bottom: 10px;
}
</style>
