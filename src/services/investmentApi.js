import api from "@/services/api.js";

/**
 * Fetch Forex calendar events with filters
 * @param {Object} payload - { date, country, impact, size, title }
 */
export async function fetchCalendarEvents(payload = {}) {
  try {
    const res = await api.post("/forex/calendar-event", payload);
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Failed to fetch calendar events");
    }
    return res.data.data; // expected array of events
  } catch (err) {
    console.error("Error fetching calendar events:", err);
    throw err;
  }
}

/**
 * Fetch EMA-RSI Trend analysis
 * @param {Object} params - { pair: "XAU/USD", interval: "5" }
 */
export async function fetchEmaRsiAnalysis(params = {}) {
  try {
    const res = await api.get("/forex/ema-rsi-trend", { params });
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Failed to fetch EMA-RSI analysis");
    }
    return res.data.data; // analysis object
  } catch (err) {
    console.error("Error fetching EMA-RSI analysis:", err);
    throw err;
  }
}

/**
 * Fetch Breakout Scalper analysis
 * @param {Object} params - { pair, interval, outputSize }
 * @returns {Promise<Object>} analysis data
 */
export async function fetchBreakoutScalper(params = {}) {

    try {
    const res = await api.get("/forex/breakout-scalper", { params });
    console.log(res.data)
    if (res.data.status !== "success") {
      throw new Error(res.data.message || "Failed to fetch EMA-RSI analysis");
    }
    return res.data.data;
  } catch (err) {
    console.error("Error fetching EMA-RSI analysis:", err);
    throw err;
  }

}