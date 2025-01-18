<template>
  <div class="post-list">
    <h2>Posts</h2>
    <div v-if="loading">Loading posts...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <PostItem
          v-for="post in posts"
          :key="post.id"
          :post="post"
      />
    </div>
  </div>
</template>

<script>
import {fetchPosts} from "@/services/posts";
import PostItem from "@/components/PostItem.vue";

export default {
  components: {PostItem},
  data() {
    return {
      posts: [],
      loading: true,
      error: null,
    };
  },
  async mounted() {
    try {
      const {data} = await fetchPosts(); // Backend'den postları al
      this.posts = data;
    } catch (err) {
      this.error = "Failed to load posts.";
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.post-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
