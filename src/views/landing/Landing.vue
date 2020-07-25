<template>
  <v-app>
    <v-img
      src="@/assets/landing/main.png"
    ></v-img>
  </v-app>
</template>

<script>
export default {
  name: 'Landing',
  created() {
    this.$emit('update:layout', 'div');
  },
};
</script>

<style scoped lang="scss">

</style>
