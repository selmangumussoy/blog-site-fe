<script setup>
import { onMounted, ref } from 'vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import { ProfileService } from '@/service/ProfileService.js';
import { UserService } from '@/service/UserService.js';


const profile = ref({
    profileId: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    birth_day: '',
    gender: '',
    website: '',
    social_links: '',
});

const showEdit = ref(false);

const fetchProfile = async () => {
    try {
        const user = await UserService.getMe();
        const profileId = user.data.profileId;

        const response = await ProfileService.getProfileById(profileId);
        const data = response.data;

        Object.assign(profile.value, {
            profileId: user.data.profileId,
            first_name: user.data.name,
            last_name: user.data.surname,
            email: data.email,
            phone: data.phone,
            bio: data.bio,
            birth_day: data.birth_day,
            gender: data.gender,
            website: data.website,
            social_links: data.social_links
        });
    } catch (error) {
        console.error(error);
    }
};

function saveProfile() {
    showEdit.value = false;
    ProfileService.updateProfile(profile.value)
        .then(() => console.log('Profil güncellendi'))
        .catch((err) => console.error(err));
}

onMounted(() => {
    fetchProfile()
});
</script>

<template>
    <div class="flex flex-col md:flex-row gap-6">
        <!-- Sol içerik (yazılar vs) -->
        <div class="flex-1">
            <!-- Tek bir beyaz kutu -->
            <div class="card p-6 space-y-4">

                <!-- ✅ Kullanıcı Adı - üstte -->
                <div class="text-3xl font-bold text-black">
                    {{ profile.first_name }} {{ profile.last_name }}
                </div>

                <!-- ✅ Sekmeler -->
                <TabView>
                    <TabPanel header="Blog">
                        <div class="space-y-4">
                            <!-- Blog içerikleri -->
                            <div>
                                <h2 class="text-xl font-semibold">S.O.L.I.D.</h2>
                                <p class="text-sm text-gray-500">Aug 6, 2024</p>
                                <p>Giriş</p>
                            </div>
                            <div>
                                <h2 class="text-xl font-semibold">Spring IoC Container</h2>
                                <p class="text-sm text-gray-500">Jul 28, 2024</p>
                                <p>1. Giriş</p>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel header="Alıntılar">
                        <p>Reading list burada</p>
                    </TabPanel>
                    <TabPanel header="Makaleler">
                        <p>Reading list burada</p>
                    </TabPanel>
                    <TabPanel header="Notlar">
                        <p>Reading list burada</p>
                    </TabPanel>
                    <TabPanel header="Kaydedilenler">
                        <p>{{ profile.bio }}</p>
                    </TabPanel>
                </TabView>

            </div>
        </div>

        <!-- Sağ Profil Paneli -->
        <div class="w-full md:w-1/3">
            <div class="card">
                <!-- Profil Fotoğrafı -->
                <div class="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>

                <!-- Bilgiler -->
                <div class="text-center">
                    <div class="font-bold text-lg">{{ profile.first_name+ " "+ profile.last_name }}</div>
                    <div class="text-sm text-gray-600">{{ profile.bio }}</div>
                    <div class="text-blue-600 mt-2">
                        <a :href="profile.social_links" target="_blank">{{ profile.social_links }}</a>
                    </div>
                </div>

                <!-- Edit Butonu -->
                <div class="text-center mt-4">
                    <Button label="Edit Profile" icon="pi pi-user-edit" @click="showEdit = true" />
                </div>
            </div>
        </div>

        <!-- Edit Profile Dialog -->
        <Dialog v-model:visible="showEdit" modal header="Edit Profile" class="w-[90vw] md:w-[50vw]">
            <div class="flex flex-col gap-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label>First Name</label>
                        <InputText v-model="profile.first_name" class="w-full" />
                    </div>
                    <div>
                        <label>Last Name</label>
                        <InputText v-model="profile.last_name" class="w-full" />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label>Email</label>
                        <InputText v-model="profile.email" class="w-full" />
                    </div>
                    <div>
                        <label>Phone</label>
                        <InputText v-model="profile.phone" class="w-full" />
                    </div>
                </div>

                <div>
                    <label>Bio</label>
                    <Textarea v-model="profile.bio" class="w-full" rows="3" />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label>Birth Day</label>
                        <InputText v-model="profile.birth_day" class="w-full" type="date" />
                    </div>
                    <div>
                        <label>Gender</label>
                        <InputText v-model="profile.gender" class="w-full" />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label>Website</label>
                        <InputText v-model="profile.website" class="w-full" />
                    </div>
                    <div>
                        <label>Social Links</label>
                        <InputText v-model="profile.social_links" class="w-full" />
                    </div>
                </div>

                <div class="text-right">
                    <Button label="Save" icon="pi pi-check" @click="saveProfile" />
                </div>
            </div>
        </Dialog>
    </div>
</template>

<style scoped lang="scss">
.profile-container {
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;

    h1 {
        text-align: center;
        margin-bottom: 2rem;
    }

    .profile-card {
        background-color: #f4f4f4;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        p {
            margin: 0.5rem 0;
            font-size: 1.1rem;
        }
    }
}
</style>
