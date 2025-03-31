<script setup>
import { onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { ExcerptService } from '@/service/ExcerptService.js';
import { TagService } from '@/service/TagService.js';
import tag from '@/views/pages/Tag.vue';

const tags = ref({name: '', description: ''});
const toast = useToast();
const excerpts = ref([]);
const excerptDialog = ref(false);
const deleteExcerptDialog = ref(false);
const excerpt = ref({
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
});
const isAuthenticated = ref(false);

const selectedExcerpts = ref();
const submitted = ref(false);

// Tag'ler için değişken
const availableTags = ref([]);

// Fotoğrafı base64 formatına dönüştürme işlemi
const fileInput = ref(null);
const base64String = ref("");

// Yeni excerpt ekleme veya düzenleme fonksiyonu
function openNew() {
    if (!isAuthenticated.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'You must be logged in to create an excerpt.', life: 3000 });
        return;
    }
    tags.value = {name: '', description: ''};
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
    submitted.value = false;
    excerptDialog.value = true;
}

// Dialog kapama
function hideDialog() {
    excerptDialog.value = false;
    submitted.value = false;
}

// Fotoğrafı base64 formatına dönüştürme
function handleFileChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        base64String.value = reader.result.split(",")[1]; // Base64 string olarak alıyoruz
        excerpt.value.photo = base64String.value; // Fotoğrafı excerpt objesine ekliyoruz
    };
}

// Yeni excerpt kaydetme
function saveExcerpt() {
    if (!isAuthenticated.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'You must be logged in to save an excerpt.', life: 3000 });
        return;
    }
    submitted.value = true;
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


// Excerpt'ı düzenleme
function editExcerpt(selectedExcerpt) {
    if (!isAuthenticated.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'You must be logged in to edit an excerpt.', life: 3000 });
        return;
    }
    excerpt.value = { ...selectedExcerpt };
    excerptDialog.value = true;
}

// Excerpt silme işlemi
function confirmDeleteExcerpt(selectedExcerpt) {
    if (!isAuthenticated.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'You must be logged in to delete an excerpt.', life: 3000 });
        return;
    }
    excerpt.value = selectedExcerpt;
    deleteExcerptDialog.value = true;
}

// Delete excerpt fonksiyonu
function deleteExcerpt() {
    if (!isAuthenticated.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'You must be logged in to delete an excerpt.', life: 3000 });
        return;
    }
    ExcerptService.deleteExcerpt(excerpt.value.id).then(() => {
        excerpts.value = excerpts.value.filter(t => t.id !== excerpt.value.id);
        deleteExcerptDialog.value = false;
        excerpt.value = {
            tagId: [],
            content: "",            // İçerik (Content)
            userId: "",             // Kullanıcı ID (User ID)
            sourceTitle: "",        // Kaynak Başlık (Source Title)
            publisher: "",          // Yayıncı (Publisher)
            publishDate: "",        // Yayınlanma Tarihi (Publish Date)
            page: "",               // Sayfa Numarası (Page Number)
            description: "",        // Açıklama (Description)
            optional: "",           // Opsiyonel alan (Optional)
            image: ""               // Fotoğraf (Photo), Base64 formatında bir değer olabilir
        };
        toast.add({ severity: 'success', summary: 'Success', detail: 'Excerpt Deleted', life: 3000 });
    }).catch(error => {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to Delete Excerpt', life: 3000 });
    });
}

// Tag'leri backend'den çekme
onMounted(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        isAuthenticated.value = true;
    }
    ExcerptService.getExcerpts().then((data) => {
        if (Array.isArray(data)) {
            excerpts.value = data;
        } else {
            console.log("Cırt");
        }
    }).catch(error => {
        console.error("Failed to fetch Excerpt:", error);
    });

    TagService.getTags().then((data) => {
        if (data?.data?.items) {
            availableTags.value = data.data.items;  // availableTags dizisini alıyoruz
        }
    }).catch(error => {
        console.error("Failed to fetch tags:", error);
    });
});

</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button v-if="isAuthenticated" label="New Excerpt" icon="pi pi-plus" class="mr-2" @click="openNew"/>
                </template>
            </Toolbar>

            <DataTable :value="excerpts" dataKey="id">
                <Column field="photo" header="Photo" sortable>
                    <template #body="slotProps">
                        <!-- Fotoğrafın base64 verisi olduğu varsayılır -->
                        <img :src="'data:image/jpeg;base64,' + slotProps.data.photo" alt="Excerpt Photo" width="100" height="100"/>
                    </template>
                </Column>

                <Column field="content" header="Content" sortable></Column>
                <Column field="sourceTitle" header="Source Title" sortable></Column>
                <Column field="publishDate" header="Publisher Date" sortable></Column>
                <Column field="publisher" header="Publisher" sortable></Column>
                <Column field="page" header="Page" sortable></Column>
                <Column field="description" header="Description" sortable></Column>
                <Column field="optional" header="Optional" sortable></Column>
                <Column header="tags">
                    <template #body="slotProps">
                        <span>
                            <!-- tagId boş değilse ve bir dizi ise, map fonksiyonunu çağırıyoruz -->
                            {{ slotProps.data.tagId && Array.isArray(slotProps.data.tagId) ? slotProps.data.tagId.map(tag => tag.name).join(', ') : 'No tags' }}
                        </span>
                    </template>
                </Column>

                <Column>
                    <template #body="slotProps">
                        <Button v-if="isAuthenticated" icon="pi pi-pencil" class="mr-2" @click="editExcerpt(slotProps.data)"/>
                        <Button v-if="isAuthenticated" icon="pi pi-trash" severity="danger" @click="confirmDeleteExcerpt(slotProps.data)"/>
                    </template>
                </Column>
            </DataTable>
        </div>
            <Fluid>
                <div>
                    <Dialog v-model:visible="excerptDialog" header="Excerpt Details" :modal="true" :style="{ width: '70vw' }">
                        <div class="flex mt-8">
                            <div class="card flex flex-col gap-4 w-full">
                                <div class="flex flex-col md:flex-row gap-4">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="page">Kaçıncı Sayfa</label>
                                        <small v-if="submitted && !excerpt.page" class="text-red-500">Book Language is required.</small>
                                        <InputText id="page" v-model="excerpt.page" type="text" />
                                    </div>

                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="sourceTitle">Kitap İsmi</label>
                                        <InputText id="sourceTitle" v-model="excerpt.sourceTitle" required type="text" />
                                        <small v-if="submitted && !excerpt.sourceTitle" class="text-red-500">Source Title is required.</small>
                                    </div>

                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="publishDate">Yayınlanma Tarihi</label>
                                        <InputText id="publishDate" v-model="excerpt.publishDate" required type="text" />
                                    </div>
                                </div>

                                <div class="flex flex-wrap">
                                    <label for="content">Alıntı</label>
                                    <Textarea id="content" v-model="excerpt.content" rows="4" />
                                    <small v-if="submitted && !excerpt.content" class="text-red-500">Content is required.</small>
                                </div>

                                <div class="flex flex-wrap">
                                    <label for="description">Açıklama</label>
                                    <Textarea id="description" v-model="excerpt.description" rows="4" />
                                    <small v-if="submitted && !excerpt.description" class="text-red-500">description is required.</small>
                                </div>

                                <div class="flex flex-wrap">
                                    <label for="optional">Opsiyonel</label>
                                    <Textarea id="optional" v-model="excerpt.optional" rows="4" />
                                </div>

                                <div class="flex flex-col md:flex-row gap-4">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="tagName">Etiketler</label>
                                        <MultiSelect id="tagName" v-model="tags.name" :options="availableTags" optionLabel="name" class="w-full" />
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="publisher">Yayınevi</label>
                                        <InputText id="publisher" v-model="excerpt.publisher" required type="text" />
                                        <small v-if="submitted && !excerpt.publisher" class="text-red-500">Page Number is required.</small>
                                    </div>
                                </div>

                                <div class="flex flex-wrap gap-2 w-full">
                                    <label for="photo">Fotoğraf</label>
                                    <InputText type="file" id="photo" @change="handleFileChange" accept="image/*" />
                                    <small v-if="submitted && !excerpt.photo" class="text-red-500">Photo is required.</small>
                                </div>

                                <div class="flex justify-end gap-2">
                                    <Button label="Cancel" icon="pi pi-times" @click="hideDialog" class="p-button-text" />
                                    <Button label="Save" icon="pi pi-check" @click="saveExcerpt" :disabled="!excerpt.content || excerpt.tags.length === 0" />
                                </div>
                            </div>
                        </div>
                    </Dialog>
                </div>
            </Fluid>
    </div>
</template>
