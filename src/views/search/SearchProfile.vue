<template>
 <v-card flat class="profile-container">
   <v-card class="header"></v-card>
 </v-card>
</template>

<script>
export default {

};
</script>

<style scoped lang="scss">
  .profile-container {
    display: flex;
    flex-direction: column;
    padding: 20px;
    height: calc(90vh - 10px);
    margin: 5px 15px;

    .header {
      display: flex;
      height: 20vh;
    }
  }
</style>
