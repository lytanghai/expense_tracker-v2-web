// utils/keepAlive.js
export function keepAlive() {
  setInterval(async () => {
    try {
      await fetch("https://expense-tracker-v2-web.onrender.com/");
      console.log("Server kept alive");
    } catch (err) {
      console.error("Keep-alive failed:", err);
    }
  }, 10 * 60 * 1000); // every 10 minutes
}
