<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref } from 'vue';
import { AuthService } from '@/service/AuthService.js';

const name = ref('');
const surname = ref('');
const email = ref('');
const password = ref('');
const phoneNumber = ref('');
const checked = ref(false);

const signUpRequest = ref({
    email: "",
    password: "",
    name: "",
    surname: "",
    phoneNumber: ""
});

const handleSignUp = async () => {
    console.log(signUpRequest.value);
    // signUpRequest nesnesini form verileri ile dolduruyoruz
    signUpRequest.value.email = email.value;
    signUpRequest.value.password = password.value;
    signUpRequest.value.name = name.value;
    signUpRequest.value.surname = surname.value;
    signUpRequest.value.phoneNumber = phoneNumber.value;

    try {
        await AuthService.signUp(signUpRequest.value);
        window.location.href = '/auth/login'; // Giriş sayfasına yönlendirme
    } catch (error) {
        console.error('Kayıt işlemi sırasında bir hata oluştu:', error);
        alert(error.message); // Hata mesajını kullanıcıya gösteriyoruz
    }
};
</script>

<template>
    <FloatingConfigurator />
    <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg"
                             class="mb-8 w-16 shrink-0 mx-auto">
                            <!-- Your SVG content here -->
                        </svg>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Asım'ın Nesline
                            Hoşgeldiniz
                        </div>
                        <span class="text-muted-color font-medium">Lütfen kaydolunuz.</span>
                    </div>

                    <div>
                        <label for="name"
                               class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Ad</label>
                        <InputText id="name" type="text" placeholder="Adınız" class="w-full md:w-[30rem] mb-8"
                                   v-model="name" />

                        <label for="surname"
                               class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Soyad</label>
                        <InputText id="surname" type="text" placeholder="Soyadınız" class="w-full md:w-[30rem] mb-8"
                                   v-model="surname" />

                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email adresiniz"
                                   class="w-full md:w-[30rem] mb-8" v-model="email" />

                        <label for="password1"
                               class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Şifre</label>
                        <Password id="password1" v-model="password" placeholder="Şifre" :toggleMask="true" class="mb-4"
                                  fluid :feedback="false"></Password>

                        <label for="phoneNumber"
                               class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Telefon
                            Numarası</label>
                        <InputText id="phoneNumber" type="text" placeholder="Telefon numaranız"
                                   class="w-full md:w-[30rem] mb-8" v-model="phoneNumber" />

                        <Button label="Kaydol" class="w-full" @click="handleSignUp"></Button>

                        <div class="flex items-center">
                            <div class="flex items-center">
                                <span class="font-medium no-underline ml-2 mr-1.5 text-right cursor-pointer ">Hesabınız Zaten Var Mı?</span>
                                <router-link to="/auth/login" class="text-primary">Giriş Yap</router-link>
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
