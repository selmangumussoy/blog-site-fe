import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // Router'ı bağlayın


const app = createApp(App);

app.use(router); // Router'ı kullan
app.mount("#app"); // Uygulamayı bağla
