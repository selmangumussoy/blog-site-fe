<template>
  <button :class="'btn ' + variant" @click="onClick">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      default: "primary",
    },
  },
  methods: {
    onClick() {
      this.$emit("click");
    },
  },
};
</script>

<style scoped>
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn.primary {
  background-color: blue;
  color: white;
}
.btn.secondary {
  background-color: gray;
  color: white;
}
</style>
