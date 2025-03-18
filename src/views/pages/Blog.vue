<script setup>
import {onMounted, ref} from "vue";
import {useToast} from "primevue/usetoast";
import {FilterMatchMode} from "@primevue/core/api";
import {BlogService} from "@/service/BlogService.js";

const submitted = ref(false);
const blog = ref({});
const blogDialog = ref(false);
const deleteBlogDialog = ref(false);
const deleteBlogsDialog = ref(false);
const dt = ref();
const selectedBlogs = ref();
const toast = useToast();
const blogs = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

onMounted(() => {
  BlogService.getBlogs().then((data) => (blogs.value = data));
});

function hideDialog() {
  blogDialog.value = false;
  submitted.value = false;
}
function openNew() {
  blog.value = {};
  submitted.value = false;
  blogDialog.value = true;
}

function exportCSV() {
  dt.value.exportCSV();
}

function confirmDeleteSelected() {
  deleteBlogDialog.value = true;
}

function deleteSelectedBlogs() {
  blogs.value = blogs.value.filter((val) => !selectedBlogs.value.includes(val));
  deleteBlogsDialog.value = false;
  selectedBlogs.value = null;
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
}

function editBlog(prod) {
  blog.value = { ...prod };
  blogDialog.value = true;
}
function deleteBlog() {
  blog.value = blog.value.filter((val) => val.id !== blog.value.id);
  deleteBlogDialog.value = false;
  blog.value = {};
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Blog Deleted', life: 3000 });
}
function saveBlog() {
  submitted.value = true;

  if (blog?.value.name?.trim()) {
    if (blog.value.id) {
      blog.value.inventoryStatus = blog.value.inventoryStatus.value ? blog.value.inventoryStatus.value : blog.value.inventoryStatus;
      blogs.value[findIndexById(blog.value.id)] = blog.value;
      toast.add({ severity: 'success', summary: 'Successful', detail: 'BLog Updated', life: 3000 });
    } else {
      blog.value.id = createId();
      blog.value.code = createId();
      blog.value.image = 'product-placeholder.svg';
      blog.value.inventoryStatus = blog.value.inventoryStatus ? blog.value.inventoryStatus.value : 'INSTOCK';
      blogs.value.push(blog.value);
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Blog Created', life: 3000 });
    }

    blogDialog.value = false;
    blog.value = {};
  }
}
function findIndexById(id) {
  let index = -1;
  for (let i = 0; i < blogs.value.length; i++) {
    if (blogs.value[i].id === id) {
      index = i;
      break;
    }
  }

  return index;
}
function createId() {
  let id = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

function getStatusLabel(status) {
  switch (status) {
    case 'INSTOCK':
      return 'success';

    case 'LOWSTOCK':
      return 'warn';

    case 'OUTOFSTOCK':
      return 'danger';

    default:
      return null;
  }
}
</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
        </template>

        <template #end>
          <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
        </template>
      </Toolbar>

      <DataTable
          ref="dt"
          v-model:selection="selectedBlogs"
          :value="blogs"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Manage Blog</h4>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Search..." />
            </IconField>
          </div>
        </template>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column field="code" header="Code" sortable style="min-width: 12rem"></Column>
        <Column field="name" header="Name" sortable style="min-width: 16rem"></Column>
        <Column header="Image">
          <template #body="slotProps">
            <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`" :alt="slotProps.data.image" class="rounded" style="width: 64px" />
          </template>
        </Column>
        <Column field="category" header="Category" sortable style="min-width: 10rem"></Column>
        <Column field="rating" header="Reviews" sortable style="min-width: 12rem">
          <template #body="slotProps">
            <Rating :modelValue="slotProps.data.rating" :readonly="true" />
          </template>
        </Column>
        <Column field="inventoryStatus" header="Status" sortable style="min-width: 12rem">
          <template #body="slotProps">
            <Tag :value="slotProps.data.inventoryStatus" :severity="getStatusLabel(slotProps.data.inventoryStatus)" />
          </template>
        </Column>
        <Column :exportable="false" style="min-width: 12rem">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editBlog(slotProps.data)" />
            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteSelected(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog v-model:visible="blogDialog" :style="{ width: '450px' }" header="Product Details" :modal="true">
      <div class="flex flex-col gap-6">
        <img v-if="blog.image" :src="`https://primefaces.org/cdn/primevue/images/product/${blog.image}`" :alt="blog.image" class="block m-auto pb-4" />
        <div>
          <label for="name" class="block font-bold mb-3">Name</label>
          <InputText id="name" v-model.trim="blog.name" required="true" autofocus :invalid="submitted && !blog.name" fluid />
          <small v-if="submitted && !blog.name" class="text-red-500">Name is required.</small>
        </div>
        <div>
          <label for="description" class="block font-bold mb-3">Description</label>
          <Textarea id="description" v-model="blog.description" required="true" rows="3" cols="20" fluid />
        </div>
        <div>
          <label for="inventoryStatus" class="block font-bold mb-3">Inventory Status</label>
          <Select id="inventoryStatus" v-model="blog.inventoryStatus" :options="statuses" optionLabel="label" placeholder="Select a Status" fluid></Select>
        </div>

        <div>
          <span class="block font-bold mb-4">Category</span>
          <div class="grid grid-cols-12 gap-4">
            <div class="flex items-center gap-2 col-span-6">
              <RadioButton id="category1" v-model="blog.category" name="category" value="Accessories" />
              <label for="category1">Accessories</label>
            </div>
            <div class="flex items-center gap-2 col-span-6">
              <RadioButton id="category2" v-model="blog.category" name="category" value="Clothing" />
              <label for="category2">Clothing</label>
            </div>
            <div class="flex items-center gap-2 col-span-6">
              <RadioButton id="category3" v-model="blog.category" name="category" value="Electronics" />
              <label for="category3">Electronics</label>
            </div>
            <div class="flex items-center gap-2 col-span-6">
              <RadioButton id="category4" v-model="blog.category" name="category" value="Fitness" />
              <label for="category4">Fitness</label>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-6">
            <label for="price" class="block font-bold mb-3">Price</label>
            <InputNumber id="price" v-model="blog.price" mode="currency" currency="USD" locale="en-US" fluid />
          </div>
          <div class="col-span-6">
            <label for="quantity" class="block font-bold mb-3">Quantity</label>
            <InputNumber id="quantity" v-model="blog.quantity" integeronly fluid />
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" @click="saveBlog" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteBlogDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="blog"
        >Are you sure you want to delete <b>{{ blog.name }}</b
        >?</span
        >
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteBlogDialog = false" />
        <Button label="Yes" icon="pi pi-check" @click="deleteBlog" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteBlogsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="blog">Are you sure you want to delete the selected products?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteBlogsDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedBlogs" />
      </template>
    </Dialog>
  </div>
</template>