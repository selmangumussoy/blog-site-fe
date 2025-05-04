<script setup>
import { ExcerptService } from '@/service/ExcerptService.js';
import { TagService } from '@/service/TagService.js';
import { onMounted, ref } from 'vue';

const excerpts = ref([]);
const availableTags = ref([]);
const options = ref(['list', 'grid']);
const layout = ref('list');
const selectedExcerpt = ref(null);
const dialogVisible = ref(false);


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
            availableTags.value = data.data.items;
        }
    }).catch(error => {
        console.error("Failed to fetch tags:", error);
    });
});


function openDialog(excerpt) {
    selectedExcerpt.value = excerpt;
    dialogVisible.value = true;
}


</script>

<template>
    <div class="flex flex-col">
        <div class="card">
            <div class="font-semibold text-xl">TÜMCE DURAĞI</div>
            <DataView :value="excerpts" :layout="layout">
                <template #header>
                    <div class="flex justify-end">
                        <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                            <template #option="{ option }">
                                <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
                            </template>
                        </SelectButton>
                    </div>
                </template>

                <template #list="slotProps">
                    <div class="flex flex-col">
                        <div v-for="(item, index) in slotProps.items" :key="index " @click="openDialog(item)" >
                            <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" :class="{ 'border-t border-surface': index !== 0 }">
                                <div class="md:w-40 relative">
                                    <img class="block xl:block mx-auto rounded w-full" :src="'data:image/jpeg;base64,' + item.image" alt="Excerpt Photo" />
                                    <!--                                    <Tag :value="item.sourceTitle" :severity="getSeverity(item)" class="absolute dark:!bg-surface-900" style="left: 4px; top: 4px"></Tag>-->
                                </div>
                                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                                    <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                        <div>
                                            <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.tagId.map(tag => tag.name).join(', ') }}</span>
                                            <div class="text-lg font-medium mt-2">{{ item.sourceTitle }}</div>
                                        </div>
                                        <div class="bg-surface-100 p-1" style="border-radius: 30px">
                                            <div class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2" style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06);">
                                                <span class="text-surface-900 font-medium text-sm">{{ item.description }}</span>
                                                <i class="pi pi-star-fill text-yellow-500"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col md:items-end gap-8">
                                        <div class="flex flex-row-reverse md:flex-row gap-2">
                                            <Button icon="pi pi-heart" outlined></Button>
                                            <Button label="Save" icon="pi pi-save" class="flex-auto md:flex-initial whitespace-nowrap" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <template #grid="slotProps">
                    <div class="grid grid-cols-12 gap-4">
                        <div v-for="(item, index) in slotProps.items" :key="index" class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
                            <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
                                <div class="bg-surface-50 flex justify-center rounded p-4">
                                    <div class="relative mx-auto">
                                        <img class="rounded w-full" :src="'data:image/jpeg;base64,' + item.image" alt="Excerpt Photo" style="max-width: 300px" />
                                        <!--                                        <Tag :value="item.publishDate" :severity="getSeverity(item)" class="absolute dark:!bg-surface-900" style="left: 4px; top: 4px"></Tag>-->
                                    </div>
                                </div>
                                <div class="pt-6">
                                    <div class="flex flex-row justify-between items-start gap-2">
                                        <div>
                                            <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.tagId.map(tag => tag.name).join(', ') }}</span>
                                            <div class="text-lg font-medium mt-1">{{ item.description }}</div>
                                        </div>
                                        <div class="bg-surface-100 p-1" style="border-radius: 30px">
                                            <div class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2" style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06);">
                                                <span class="text-surface-900 font-medium text-sm">{{ item.optional }}</span>
                                                <i class="pi pi-star-fill text-yellow-500"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col gap-6 mt-6">
                                        <div class="flex gap-2">
                                            <Button icon="pi pi-save" label="Save" class="flex-auto whitespace-nowrap" />
                                            <Button icon="pi pi-heart" outlined></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>

        <!-- Excerpt Dialog -->
        <Dialog v-model:visible="dialogVisible" :modal="true" :style="{ width: '50vw' }">
            <template #header>
                <h2 class="text-2xl font-semibold text-center">{{ selectedExcerpt?.sourceTitle || 'Alıntı' }}</h2>
            </template>

            <div v-if="selectedExcerpt">
                <!-- Resim ve İçerik Aynı Çerçevede -->
                <div class="border rounded-lg shadow-md p-4 bg-white">
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="w-full md:w-1/3 flex justify-center">
                            <!-- <img class="block xl:block mx-auto rounded w-full" :src="'data:image/jpeg;base64,' + item.image" alt="Excerpt Photo" /> -->
                            <img class="block xl:block mx-auto rounded w-full" src="/demo/images/logo.svg" alt="Placeholder Image" />
                        </div>
                        <div class="w-full md:w-2/3">
                            <p class="text-gray-600 whitespace-pre-line">{{ selectedExcerpt.content || 'İçerik yok' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Diğer Bilgiler -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div class="border rounded-lg p-3 bg-gray-50">
                        <span class="font-semibold">📖 Kaçıncı Sayfa:</span>
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
        </Dialog>
    </div>
</template>
