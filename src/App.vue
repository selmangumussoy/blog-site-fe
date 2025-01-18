<template>
  <div id="app">
    <router-view /> <!-- Vue Router bileşenlerini göstermek için -->
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
/* İsteğe bağlı global stiller */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
}
</style>
