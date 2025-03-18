<script setup>
import { onMounted, ref } from 'vue';
import { TagService } from '@/service/TagService.js';
import { useToast } from 'primevue/usetoast';


const toast = useToast();
const tags = ref([]);
const tagDialog = ref(false);
const deleteTagDialog = ref(false);
const tag = ref({name: '', description: ''});
const selectedTags = ref();
const submitted = ref(false);

function openNew() {
  tag.value = {name: '', description: ''};
  submitted.value = false;
  tagDialog.value = true;
}

function hideDialog() {
  tagDialog.value = false;
  submitted.value = false;
}

function saveTag() {
  submitted.value = true;
  if (tag.value.name.trim()) {
    if (tag.value.id) {
      TagService.updateTag(tag.value).then(() => {
        tags.value = tags.value.map(t => (t.id === tag.value.id ? tag.value : t));
        toast.add({severity: 'success', summary: 'Success', detail: 'Tag Updated', life: 3000});
      });
    } else {
      TagService.createTag(tag.value).then((newTag) => {
        tags.value.push(newTag);
        toast.add({severity: 'success', summary: 'Success', detail: 'Tag Created', life: 3000});
      });
    }
    tagDialog.value = false;
    tag.value = {name: '', description: ''};
  }
}

function editTag(selectedTag) {
  tag.value = {...selectedTag};
  tagDialog.value = true;
}

function confirmDeleteTag(selectedTag) {
    console.log("Selected tag:", selectedTag); // Seçilen tag'ı konsola yazdır
    if (!selectedTag || !selectedTag.id) {
        console.error("Error: Selected tag has no ID!");
        return;
    }

    tag.value = selectedTag;
    deleteTagDialog.value = true;
}

function deleteTag() {
  TagService.deleteTag(tag.value.id).then(() => {
    tags.value = tags.value.filter(t => t.id !== tag.value.id);
    deleteTagDialog.value = false;
    tag.value = {name: '', description: ''};
    toast.add({severity: 'success', summary: 'Success', detail: 'Tag Deleted', life: 3000});
  });
}

onMounted(() => {
    TagService.getTags().then((data) => {
        if (data?.data?.items) {
            tags.value = data.data.items;
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
          <Button label="New Tag" icon="pi pi-plus" class="mr-2" @click="openNew"/>
        </template>
      </Toolbar>

        <DataTable :value="tags" dataKey="id">
            <Column field="name" header="Name" sortable></Column>
            <Column field="description" header="Description" sortable></Column>
            <Column>
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="mr-2" @click="editTag(slotProps.data)"/>
                    <Button icon="pi pi-trash" severity="danger" @click="confirmDeleteTag(slotProps.data)"/>
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="tagDialog" header="Tag Details" :modal="true">
      <div>
        <label for="name">Name</label>
        <InputText id="name" v-model="tag.name" required autofocus/>
        <small v-if="submitted && !tag.name" class="text-red-500">Name is required.</small>
      </div>
      <div>
        <label for="description">Description</label>
        <Textarea id="description" v-model="tag.description" required rows="3"/>
      </div>

      <template #footer>
        <Button label="Cancel" @click="hideDialog"/>
        <Button label="Save" @click="saveTag"/>
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteTagDialog" header="Confirm" :modal="true">
      <div>
        <i class="pi pi-exclamation-triangle"></i>
        <span v-if="tag">Are you sure you want to delete <b>{{ tag.name }}</b>?</span>
      </div>
      <template #footer>
        <Button label="No" @click="deleteTagDialog = false"/>
        <Button label="Yes" @click="deleteTag"/>
      </template>
    </Dialog>
  </div>
</template>
