<template>
  <v-card class="line-card">
    <h4>{{title}}</h4>
    <p>￥{{amount}}</p>
    <h1>{{rank}}</h1>
    <!-- line -->
  </v-card>
</template>

<script>
export default {
  props: {
    title: String,
    amount: Number,
    rank: Number,
  },

};
</script>

<style scoped lang="scss">
  .line-card {
    border-radius: 5px;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 10px 20px;

    h1, h4, p {
      margin: 0;
      font-weight: 500;
    }

    h1 {
      position: absolute;
      top: 20px;
      right: 10px;
      color: #c60001;
    }
  }
</style>
