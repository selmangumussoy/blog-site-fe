<template>
  <div class="app-container">
    <!-- Navbar -->
    <Navbar />

    <!-- Main Content -->
    <div class="content">
      <PostList :posts="posts" />
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import PostList from "@/components/PostList.vue";
import { fetchPosts } from "@/services/posts"; // Backend'den veri almak için kullanılan fonksiyon

export default {
  components: {
    Navbar,
    PostList,
  },
  data() {
    return {
      posts: [], // Backend'den alınan postlar burada tutulacak
    };
  },
  async mounted() {
    try {
      const { data } = await fetchPosts(); // Backend'den postları al
      this.posts = data;
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  },
};
</script>

<style scoped>
/* İçerik */
.content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 20px;
}
</style>
