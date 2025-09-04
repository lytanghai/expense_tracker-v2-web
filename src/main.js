import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import { createPinia } from "pinia"
import { setLoadingStore } from "@/services/api"
import { useLoadingStore } from "@/stores/loading"

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

// ✅ Inject loading store for API
setLoadingStore(useLoadingStore())

app.mount("#app")
