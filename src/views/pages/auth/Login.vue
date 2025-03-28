<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref } from 'vue';
import { AuthService } from '@/service/AuthService.js';

const email = ref('');
const password = ref('');
const checked = ref(false);
const loginRequest = ref({
    username:"",
    password:""
}
)
const handleLogin = async () => {
    console.log(email.value)
    // loginRequest nesnesini form verileri ile dolduruyoruz
    loginRequest.value.username = email.value;
    loginRequest.value.password = password.value;

    try {
        const token = await AuthService.login(loginRequest.value);
        localStorage.setItem('auth_token', token);
        window.location.href = '/uikit/panel';
    } catch (error) {
        console.error('Giriş yapılırken bir hata oluştu:', error);
        alert(error.message); // Hata mesajını kullanıcıya gösteriyoruz
    }
};
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="mb-8 w-16 shrink-0 mx-auto">
                            <!-- Your SVG content here -->
                        </svg>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Asım'ın Nesline Hoşgeldiniz</div>
                        <span class="text-muted-color font-medium">Lütfen giriş yapınız.</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" v-model="email" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Şifre</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Beni Hatırla</label>
                            </div>
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Şifremi Unuttum?</span>
                        </div>
                        <Button label="Sign In" class="w-full" @click="handleLogin"></Button>

                        <div class="flex items-center ">
                            <div class="flex items-center">
                                <span class="font-medium no-underline ml-2 mr-1.5 text-right cursor-pointer text-primary">Hesabınız Yok Mu?</span>
                                <label for="Sign Up">Kaydol</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
