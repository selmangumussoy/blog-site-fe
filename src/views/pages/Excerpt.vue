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
    tagId: [],  // Tag ID'leri burada saklanacak
    userId: "",
    content: "",
    sourceTitle: "",
    bookLanguage: "",
    bookPageNumber: "",
    photo: ""
});
const selectedExcerpts = ref();
const submitted = ref(false);

// Tag'ler için değişken
const availableTags = ref([]);

// Fotoğrafı base64 formatına dönüştürme işlemi
const fileInput = ref(null);
const base64String = ref("");

// Yeni excerpt ekleme veya düzenleme fonksiyonu
function openNew() {
    tags.value = {name: '', description: ''};
    excerpt.value = {
        tagId: [],
        userId: "",
        content: "",
        sourceTitle: "",
        bookLanguage: "",
        bookPageNumber: "",
        photo: "" // Fotoğrafı sıfırlıyoruz
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
    submitted.value = true;
    // Content alanını kontrol et
    if (excerpt.value.content.trim() && excerpt.value.sourceTitle.trim() && excerpt.value.bookLanguage.trim() && excerpt.value.bookPageNumber.trim()) {
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
            userId: "",
            content: "",
            sourceTitle: "",
            bookLanguage: "",
            bookPageNumber: "",
            photo: ""
        };
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields.', life: 3000 });
    }
}


// Excerpt'ı düzenleme
function editExcerpt(selectedExcerpt) {
    excerpt.value = { ...selectedExcerpt };
    excerptDialog.value = true;
}

// Excerpt silme işlemi
function confirmDeleteExcerpt(selectedExcerpt) {
    excerpt.value = selectedExcerpt;
    deleteExcerptDialog.value = true;
}

// Delete excerpt fonksiyonu
function deleteExcerpt() {
    ExcerptService.deleteExcerpt(excerpt.value.id).then(() => {
        excerpts.value = excerpts.value.filter(t => t.id !== excerpt.value.id);
        deleteExcerptDialog.value = false;
        excerpt.value = {
            tagId: [],
            userId: "",
            content: "",
            sourceTitle: "",
            bookLanguage: "",
            bookPageNumber: "",
            photo: ""
        };
        toast.add({ severity: 'success', summary: 'Success', detail: 'Excerpt Deleted', life: 3000 });
    }).catch(error => {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to Delete Excerpt', life: 3000 });
    });
}

// Tag'leri backend'den çekme
onMounted(() => {
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
                    <Button label="New Excerpt" icon="pi pi-plus" class="mr-2" @click="openNew"/>
                </template>
            </Toolbar>

            <DataTable :value="excerpts" dataKey="id">
                <Column field="content" header="Content" sortable></Column>
                <Column field="sourceTitle" header="Source Title" sortable></Column>
                <Column field="bookLanguage" header="Book Language" sortable></Column>
                <Column field="bookPageNumber" header="Page Number" sortable></Column>
                <Column header="Tags">
                    <template #body="slotProps">
                        <span>
                            <!-- tagId boş değilse ve bir dizi ise, map fonksiyonunu çağırıyoruz -->
                            {{ slotProps.data.tagId && Array.isArray(slotProps.data.tagId) ? slotProps.data.tagId.map(tag => tag.name).join(', ') : 'No tags' }}
                        </span>
                    </template>
                </Column>

                <Column>
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" class="mr-2" @click="editExcerpt(slotProps.data)"/>
                        <Button icon="pi pi-trash" severity="danger" @click="confirmDeleteExcerpt(slotProps.data)"/>
                    </template>
                </Column>
            </DataTable>
        </div>
        <Dialog v-model:visible="excerptDialog" header="Excerpt Details" :modal="true" :style="{ width: '70vw' }">
            <Fluid>
                <div class="flex mt-8">
                    <div class="card flex flex-col gap-4 w-full">
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="bookLanguage">Book Language</label>
                                <small v-if="submitted && !excerpt.bookLanguage" class="text-red-500">Book Language is required.</small>
                                <InputText id="bookLanguage" v-model="excerpt.bookLanguage" type="text" />
                            </div>
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="sourceTitle">Source Title</label>
                                <InputText id="sourceTitle" v-model="excerpt.sourceTitle" required type="text" />
                                <small v-if="submitted && !excerpt.sourceTitle" class="text-red-500">Source Title is required.</small>
                            </div>
                        </div>

                        <div class="flex flex-wrap">
                            <label for="content">Content</label>
                            <Textarea id="content" v-model="excerpt.content" rows="4" />
                            <small v-if="submitted && !excerpt.content" class="text-red-500">Content is required.</small>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="tagName">Tag</label>
                                <Select id="tagName" v-model="tags.name" :options="availableTags" optionLabel="name" class="w-full" multiple />
                            </div>
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="bookPageNumber">Page Number</label>
                                <InputText id="bookPageNumber" v-model="excerpt.bookPageNumber" required type="text" />
                                <small v-if="submitted && !excerpt.bookPageNumber" class="text-red-500">Page Number is required.</small>
                        </div>

<!--                        <div class="flex flex-wrap">-->
<!--                            <label for="photo">Photo</label>-->
<!--                            <InputText type="file" @change="handleFileChange" id="photo" />-->
<!--                        </div>-->

                        <div class="flex justify-content-end gap-2">
                            <Button label="Cancel" icon="pi pi-times" @click="hideDialog" class="p-button-text" />
                            <Button label="Save" icon="pi pi-check" @click="saveExcerpt" :disabled="!excerpt.content || !excerpt.tagId.length" />
                        </div>
                    </div>
                    </div>
                </div>
            </Fluid>
        </Dialog>
    </div>
</template>
