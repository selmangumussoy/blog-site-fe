import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue"; // Yeni yolu kullanıyoruz

const routes = [
    { path: "/", component: Home },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
