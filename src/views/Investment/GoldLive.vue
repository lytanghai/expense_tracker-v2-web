<template>
  <div>
    <h2>Live Gold Price (XAUt/USDT)</h2>
    <apexchart type="candlestick" height="400" :options="chartOptions" :series="series" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";

const series = ref([{ data: [] }]);

const chartOptions = {
  chart: {
    type: "candlestick",
    height: 400,
    animations: { enabled: true, dynamicAnimation: { speed: 500 } },
  },
  title: { text: "XAUt/USDT Live Chart", align: "left" },
  xaxis: { type: "datetime" },
  yaxis: { tooltip: { enabled: true } },
};

let ws = null;

// Helper: fetch historical candles from Yahoo Finance
async function fetchHistoricalCandles() {
  try {
    console.log("Fetching historical candles...");
    const url = "https://query1.finance.yahoo.com/v8/finance/chart/XAUUSD=X?interval=1m&range=1d";
    const res = await axios.get(url);
    const result = res.data.chart.result[0];
    const timestamps = result.timestamp;
    const ohlc = result.indicators.quote[0];

    const candles = timestamps.map((t, i) => ({
      x: new Date(t * 1000),
      y: [ohlc.open[i], ohlc.high[i], ohlc.low[i], ohlc.close[i]],
    }));

    series.value = [{ data: candles }];
    console.log("Historical candles loaded:", candles.length);
  } catch (error) {
    console.error("Error fetching historical candles:", error);
  }
}

// WebSocket for live 1-minute candles
function initWebSocket() {
  console.log("Connecting to Binance WebSocket...");
  ws = new WebSocket("wss://stream.binance.com:9443/ws/xautusdt@kline_1m");

  ws.onopen = () => console.log("WebSocket connected.");
  ws.onclose = () => console.log("WebSocket disconnected.");
  ws.onerror = (err) => console.error("WebSocket error:", err);

  ws.onmessage = (event) => {
    const k = JSON.parse(event.data).k;
    const candle = {
      x: new Date(k.t),
      y: [parseFloat(k.o), parseFloat(k.h), parseFloat(k.l), parseFloat(k.c)],
    };

    const chartData = series.value[0].data;

    if (chartData.length && chartData[chartData.length - 1].x.getTime() === candle.x.getTime()) {
      chartData[chartData.length - 1] = candle; // update current candle
    } else {
      series.value = [{ data: [...chartData, candle] }]; // add new candle
      if (series.value[0].data.length > 100) series.value[0].data.shift(); // keep last 100
    }

    console.log("New candle received:", candle);
  };
}

onMounted(async () => {
  await fetchHistoricalCandles(); // load historical first
  initWebSocket(); // then start live updates
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
