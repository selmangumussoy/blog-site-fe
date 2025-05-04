<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLayout } from '@/layout/composables/layout';
import AppConfigurator from './AppConfigurator.vue';

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
const router = useRouter();
const isAuthenticated = ref(localStorage.getItem('jwtToken') !== null);


const logout = () => {
    localStorage.removeItem('jwtToken');
    isAuthenticated.value = false;
    router.push('/');
};


const goToProfile = () => {
    router.push('/profile');
};

</script>

<template>
    <div class="layout-topbar">
        <!-- Logo ve Menü Butonu -->
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <!-- Logo SVG -->
                <span>ASIM'IN NESLİ</span>
            </router-link>
        </div>

        <!-- Sağdaki Ayar Butonları -->
        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
                <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button"
                        class="layout-topbar-action layout-topbar-action-highlight"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <AppConfigurator />
                </div>
            </div>

            <!-- Menü Butonları -->
            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <!-- Kullanıcı Durumuna Göre Butonlar -->
            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button>

                    <Button v-if=" isAuthenticated" label="Log Out" class="w-full" @click="logout"></Button>

                    <!-- Eğer giriş yapılmamışsa giriş butonunu göster -->
                    <Button v-if=" !isAuthenticated" label="Sign In" class="w-full" as="router-link" to="/auth/login"></Button>

                    <!-- Giriş yapılmışsa profil ikonunu göster -->
                    <button
                        v-if="isAuthenticated"
                        class="layout-topbar-action"
                        @click="goToProfile"
                    >
                        <i class="pi pi-user"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
