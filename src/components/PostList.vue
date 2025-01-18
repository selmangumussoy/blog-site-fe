<template>
  <div class="post-list">
    <PostItem
        v-for="post in posts"
        :key="post.id"
        :post="post"
    />
  </div>
</template>

<script>
import PostItem from "./PostItem.vue";

export default {
  props: {
    posts: {
      type: Array,
      required: true,
    },
  },
  components: {
    PostItem,
  },
};
</script>

<style scoped>
.post-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
</style>
