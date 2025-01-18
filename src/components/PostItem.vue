<template>
  <div class="post-item">
    <h2>{{ post.title }}</h2>
    <p>{{ post.excerpt }}</p>
    <router-link :to="'/post/' + post.id">Read More</router-link>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.post-item {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 5px;
  background-color: #fff;
}
.post-item h2 {
  margin: 0 0 10px;
}
</style>
