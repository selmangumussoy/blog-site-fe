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
import { ExcerptService } from '@/service/ExcerptService.js';
import { TagService } from '@/service/TagService.js';
import { useToast } from 'primevue/usetoast';
import SelectButton from 'primevue/selectbutton';
import { nextTick } from 'vue';

const excerptDialog = ref(false);
const submitted = ref(false);
const toast = useToast();
const profileImageInput = ref(null);

const excerpt = ref({
    tagId: [],
    content: '',
    userId: '',
    sourceTitle: '',
    publisher: '',
    publishDate: '',
    page: '',
    description: '',
    optional: '',
    image: ''
});

async function openNewExcerpt() {
    submitted.value = false;
    excerpt.value = {
        tagId: [],
        content: '',
        userId: '',
        sourceTitle: '',
        publisher: '',
        publishDate: '',
        page: '',
        description: '',
        optional: '',
        image: ''
    };

    try {
        const user = await UserService.getMe();
        excerpt.value.userId = user.data.profileId; // veya user.data.userId backend'e bağlı
    } catch (err) {
        toast.add({ severity: 'error', summary: 'Hata', detail: 'Kullanıcı bilgisi alınamadı.', life: 3000 });
        return;
    }

    excerptDialog.value = true;
}


function handleFileChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        // Base64 formatını al
        const base64Data = reader.result.split(',')[1];
        excerpt.value.image = base64Data;

        console.log("✅ Fotoğraf base64:", base64Data.slice(0, 50) + "...");
    };

    reader.readAsDataURL(file);
}
// Dialog kapama
function hideDialog() {
    excerptDialog.value = false;
    submitted.value = false;
}

function saveExcerpt() {
    submitted.value = true;

    // Eğer tag nesneleri varsa, sadece id'lerini al
    if (excerpt.value.tagId.length > 0 && typeof excerpt.value.tagId[0] === 'object') {
        excerpt.value.tagId = excerpt.value.tagId.map(tag => tag.id);
    }
    // Content alanını kontrol et
    if (excerpt.value.content.trim() && excerpt.value.page.trim() && excerpt.value.publisher.trim() && excerpt.value.optional.trim()) {
        if (excerpt.value.id) {
            ExcerptService.updateExcerpt(excerpt.value).then(() => {
                excerpts.value = excerpts.value.map(t => (t.id === excerpt.value.id ? excerpt.value : t));
                toast.add({ severity: 'success', summary: 'Success', detail: 'Excerpt Updated', life: 3000 });
            });
        } else {
            ExcerptService.createExcerpt(excerpt.value).then((newExcerpt) => {
                excerpts.value.push(newExcerpt);
                toast.add({ severity: 'success', summary: 'Success', detail: 'Excerpt Created', life: 3000 });
            });
        }
        excerptDialog.value = false;
        excerpt.value = {
            tagId: [],
            content: "",
            userId: "",
            sourceTitle: "",
            publisher: "",
            publishDate: "",
            page: "",
            description: "",
            optional: "",
            image: ""
        };
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields.', life: 3000 });
    }
}


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
    image: ''
});

const showEdit = ref(false);
const excerpts = ref([]);
const availableTags = ref([]);
const selectedExcerpt = ref(null);
const dialogVisible = ref(false);

function onProfileImageChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        profile.value.image = base64;

        toast.add({
            severity: 'info',
            summary: 'Fotoğraf Yüklendi',
            detail: 'Profil fotoğrafı başarıyla yüklendi.',
            life: 3000
        });
    };
    reader.readAsDataURL(file);
}

function triggerProfileImageUpload() {
    profileImageInput.value?.click();
}
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
    fetchProfile();
    UserService.getMe().then(user => {
        const userId = user.data.profileId;
        ExcerptService.getExcerptsByUserId(userId).then((data) => {
            if (Array.isArray(data)) {
                excerpts.value = data;
            } else {
                console.log("Cırt");
            }
        }).catch(error => {
            console.error("Failed to fetch Excerpt:", error);
        });
    });

    TagService.getTags().then((data) => {
        if (data?.data?.items) {
            availableTags.value = data.data.items;
        }
    }).catch(error => {
        console.error("Failed to fetch tags:", error);
    });
});

import Menu from 'primevue/menu';

const menuRefs = ref([]);

function setMenuRef(el, index) {
    if (el) menuRefs.value[index] = el;
}



function toggleMenu(event, index) {
    nextTick(() => {
        const menu = menuRefs.value[index];
        if (menu?.toggle) {
            menu.toggle(event);
        }
    });
}



function menuItems(item) {
    return [
        { label: 'Kaydet', icon: 'pi pi-save', command: () => saveItem(item) },
        { label: 'Güncelle', icon: 'pi pi-pencil', command: () => editItem(item) },
        { label: 'Sil', icon: 'pi pi-trash', command: () => deleteItem(item) },
    ];
}

// örnek handlerlar
function saveItem(item) {
    console.log('💾 Kaydedildi:', item);
}
function editItem(item) {
    console.log('✏️ Güncellenecek:', item);
}
function deleteItem(item) {
    console.log('🗑️ Silinecek:', item);
}


function openDialog(excerpt) {
    selectedExcerpt.value = excerpt;
    dialogVisible.value = true;
}
defineExpose({ openNewExcerpt, hideDialog, saveExcerpt, openDialog });

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
                        <div class="flex justify-between items-center mb-4">
                            <div class="text-xl font-semibold">Alıntılar</div>
                            <Button label="Yeni Alıntı" icon="pi pi-plus" class="p-button-sm" @click="openNewExcerpt" />
                        </div>
                        <div class="space-y-4">

                            <!-- Görünüm seçici -->
                            <div class="flex justify-end mb-4">
                                <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                                    <template #option="{ option }">
                                        <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
                                    </template>
                                </SelectButton>
                            </div>

                            <!-- Alıntı Görüntüleme -->
                            <DataView :value="excerpts" :layout="layout">
                                <template #list="slotProps">
                                    <div class="flex flex-col items-center gap-6">
                                        <div
                                            v-for="(item, index) in slotProps.items"
                                            :key="index"
                                            class="w-full md:w-[600px] bg-white shadow-xxl rounded-xl overflow-hidden relative transition duration-300"
                                        >
                                            <!-- Üst Kısım: Üç Nokta ve Menü -->
                                            <div class="absolute top-4 right-4 z-10 flex items-center gap-2">
                                                <!-- Üç Nokta Butonu -->
                                                <Button
                                                    icon="pi pi-ellipsis-v"
                                                    class="p-button-text p-button-rounded p-0"
                                                    @click="toggleMenu($event, index)"
                                                />

                                                <!-- Açılan Menü -->
                                                <Menu
                                                    :model="menuItems(item)"
                                                    :popup="true"
                                                    :ref="el => setMenuRef(el, index)"
                                                />


                                            </div>

                                            <!-- Kare Görsel -->
                                            <img
                                                :src="'data:image/jpeg;base64,' + item.image"
                                                class="w-full aspect-square object-cover"
                                                alt="Excerpt"
                                                @click="openDialog(item)"
                                            />

                                            <!-- Başlık ve Açıklama -->
                                            <div class="p-6">
                                                <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ item.sourceTitle }}</h2>
                                                <p class="text-gray-700 mb-2">{{ item.description }}</p>
                                                <div class="text-sm text-blue-500">{{ item.tagId.map(tag => tag.name).join(', ') }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </template>



                                <!-- GRID görünüm -->
                                <template #grid="slotProps">
                                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div
                                            v-for="(item, index) in slotProps.items"
                                            :key="index"
                                            class="border rounded-lg shadow-sm hover:shadow-md transition bg-white p-4 flex flex-col gap-2"
                                            @click="openDialog(item)"
                                        >
                                            <img
                                                :src="'data:image/jpeg;base64,' + item.image"
                                                class="rounded h-40 object-cover w-full"
                                                alt="Excerpt"
                                            />

                                            <div class="text-lg font-semibold">{{ item.sourceTitle }}</div>
                                            <p class="text-sm text-gray-500">{{ item.description }}</p>
                                            <div class="text-sm text-blue-500">{{ item.tagId.map(tag => tag.name).join(', ') }}</div>

                                            <div class="flex gap-2 mt-auto">
                                                <Button icon="pi pi-save" label="Kaydet" class="p-button-sm w-full" />
                                                <Button icon="pi pi-heart" class="p-button-outlined p-button-sm" />
                                            </div>
                                        </div>
                                    </div>
                                </template>

                                <!-- Boş içerik -->
                                <template #empty>
                                    <div class="text-center text-gray-500 p-6">Henüz hiç alıntı eklenmemiş.</div>
                                </template>
                            </DataView>
                        </div>

                        <!-- Excerpt detay dialog -->
                        <Dialog v-model:visible="dialogVisible" modal header="Alıntı Detayı" class="w-[90vw] md:w-[50vw]">
                            <div v-if="selectedExcerpt">
                                <div class="border rounded-lg shadow-md p-4 bg-white">
                                    <div class="flex flex-col md:flex-row gap-6">
                                        <div class="w-full md:w-1/3 flex justify-center">
                                            <img :src="'data:image/jpeg;base64,' + selectedExcerpt.image" class="rounded w-full" />
                                        </div>
                                        <div class="w-full md:w-2/3">
                                            <p class="text-gray-600 whitespace-pre-line">{{ selectedExcerpt.content || 'İçerik yok' }}</p>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                        <div class="border rounded-lg p-3 bg-gray-50">
                                            <span class="font-semibold">📖 Sayfa:</span>
                                            <p class="text-gray-700">{{ selectedExcerpt.page || 'Bilinmiyor' }}</p>
                                        </div>
                                        <div class="border rounded-lg p-3 bg-gray-50">
                                            <span class="font-semibold">📅 Yayınlanma Tarihi:</span>
                                            <p class="text-gray-700">{{ selectedExcerpt.publishDate || 'Bilinmiyor' }}</p>
                                        </div>
                                        <div class="border rounded-lg p-3 bg-gray-50 col-span-2">
                                            <span class="font-semibold">ℹ️ Açıklama:</span>
                                            <p class="text-gray-700">{{ selectedExcerpt.description || 'Açıklama yok' }}</p>
                                        </div>
                                        <div class="border rounded-lg p-3 bg-gray-50">
                                            <span class="font-semibold">🏢 Yayınevi:</span>
                                            <p class="text-gray-700">{{ selectedExcerpt.publisher || 'Bilinmiyor' }}</p>
                                        </div>
                                        <div class="border rounded-lg p-3 bg-gray-50">
                                            <span class="font-semibold">🏷️ Etiketler:</span>
                                            <p class="text-gray-700">
                            <span v-if="selectedExcerpt.tagId.length > 0">
                                {{ selectedExcerpt.tagId.map(tag => tag.name).join(', ') }}
                            </span>
                                                <span v-else>Etiket yok</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Dialog>

                        <Dialog v-model:visible="excerptDialog" header="Excerpt Oluştur" :modal="true" :style="{ width: '70vw' }">
                            <div class="flex mt-6">
                                <div class="card flex flex-col gap-5 w-full">

                                    <!-- Üçlü Satır: Sayfa, Kitap Adı, Yayın Tarihi -->
                                    <div class="flex flex-col md:flex-row gap-4">
                                        <div class="flex flex-col gap-1 w-full">
                                            <label for="page">Kaçıncı Sayfa</label>
                                            <InputText id="page" v-model="excerpt.page" class="w-full" />
                                            <small v-if="submitted && !excerpt.page" class="text-red-500">Sayfa numarası zorunludur.</small>
                                        </div>

                                        <div class="flex flex-col gap-1 w-full">
                                            <label for="sourceTitle">Kitap İsmi</label>
                                            <InputText id="sourceTitle" v-model="excerpt.sourceTitle" class="w-full" />
                                            <small v-if="submitted && !excerpt.sourceTitle" class="text-red-500">Kitap adı zorunludur.</small>
                                        </div>

                                        <div class="flex flex-col gap-1 w-full">
                                            <label for="publishDate">Yayınlanma Tarihi</label>
                                            <InputText id="publishDate" v-model="excerpt.publishDate" class="w-full" />
                                        </div>
                                    </div>

                                    <!-- Alıntı -->
                                    <div class="flex flex-col gap-1">
                                        <label for="content">Alıntı</label>
                                        <Textarea id="content" v-model="excerpt.content" rows="4" class="w-full" />
                                        <small v-if="submitted && !excerpt.content" class="text-red-500">Alıntı içeriği zorunludur.</small>
                                    </div>

                                    <!-- Açıklama -->
                                    <div class="flex flex-col gap-1">
                                        <label for="description">Açıklama</label>
                                        <Textarea id="description" v-model="excerpt.description" rows="3" class="w-full" />
                                        <small v-if="submitted && !excerpt.description" class="text-red-500">Açıklama zorunludur.</small>
                                    </div>

                                    <!-- Opsiyonel -->
                                    <div class="flex flex-col gap-1">
                                        <label for="optional">Ek Not</label>
                                        <Textarea id="optional" v-model="excerpt.optional" rows="2" class="w-full" />
                                    </div>

                                    <!-- Etiketler ve Yayınevi -->
                                    <div class="flex flex-col md:flex-row gap-4">
                                        <div class="flex flex-col gap-1 w-full">
                                            <label for="tagId">Etiketler</label>
                                            <MultiSelect id="tagId" v-model="excerpt.tagId" :options="availableTags" optionLabel="name" class="w-full" />
                                        </div>

                                        <div class="flex flex-col gap-1 w-full">
                                            <label for="publisher">Yayınevi</label>
                                            <InputText id="publisher" v-model="excerpt.publisher" class="w-full" />
                                            <small v-if="submitted && !excerpt.publisher" class="text-red-500">Yayınevi zorunludur.</small>
                                        </div>
                                    </div>

                                    <!-- Fotoğraf -->
                                    <div class="flex flex-col gap-1">
                                        <label for="photo">Fotoğraf</label>
                                        <input type="file" id="photo" @change="handleFileChange" accept="image/*" class="w-full border px-2 py-1 rounded" />

                                        <!--  <small v-if="submitted && !excerpt.image" class="text-red-500">Fotoğraf eklenmelidir.</small>-->
                                     </div>

                                     <!-- Butonlar -->
                                    <div class="flex justify-end gap-2 mt-2">
                                        <Button label="Kaydet" icon="pi pi-check" @click="saveExcerpt"
                                                :disabled="!excerpt.content || excerpt.tagId.length === 0 || !excerpt.page || !excerpt.publisher" />
                                    </div>

                                </div>
                            </div>
                        </Dialog>
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
                <div class="relative w-24 h-24 rounded-full overflow-hidden bg-gray-300 mx-auto mb-4 cursor-pointer group" @click="triggerProfileImageUpload">
                    <img v-if="profile.image" :src="'data:image/jpeg;base64,' + profile.image" alt="Profil Fotoğrafı" class="object-cover w-full h-full" />
                    <span v-else class="w-full h-full flex items-center justify-center text-white text-xl font-bold">+</span>
                    <input ref="profileImageInput" type="file" accept="image/*" class="hidden" @change="onProfileImageChange" />
                </div>

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
