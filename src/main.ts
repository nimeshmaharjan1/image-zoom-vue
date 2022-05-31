import { createApp } from "vue";
import { createPinia } from "pinia";
import "viewerjs/dist/viewer.css";
import App from "./App.vue";
import VueViewer from "v-viewer";
const app = createApp(App);
app.use(VueViewer);
app.use(createPinia());

app.mount("#app");
