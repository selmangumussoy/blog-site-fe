<template>
  <div class="pagination">
    <button @click="goToPage(page - 1)" :disabled="page === 1">Previous</button>
    <span>Page {{ page }}</span>
    <button @click="goToPage(page + 1)" :disabled="page === totalPages">Next</button>
  </div>
</template>

<script>
export default {
  props: {
    page: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  methods: {
    goToPage(newPage) {
      this.$emit("changePage", newPage);
    },
  },
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.pagination button {
  padding: 5px 10px;
}
</style>
