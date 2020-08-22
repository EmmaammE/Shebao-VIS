<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
};
</script>>

/**为了修改Vuetify中slot的样式，这个组件不设置scoped */
<style lang="scss">
  @import "@/styles/markercluster.scss";

  header .v-input__slot {
    background: $she-bg!important;
  }

  .v-navigation-drawer__content {
    overflow: hidden!important;
  }

  .v-text-field.v-text-field--solo.v-input--dense > .v-input__control {
    min-height: 28px!important;
  }

  html {
    overflow: hidden!important;
  }

    // html::-webkit-scrollbar {
    //   width: 0px;
    // }
    .custom-active.v-list-item--active ,
  .v-list-group__header.v-list-item--active {
    background: linear-gradient(to right, #eaf1f9, #f5f7fb);
    border-left: 5px solid #94bfef;
  }

  .v-list-item--link:before {
    background: #fff!important;
  }

  .w-container {
    .v-data-table__wrapper {
      height: calc(90vh - 80px);
    }
  }

  .s-bar .v-toolbar__content {
    width: 100%;
  }

  .border .v-select__slot .v-select__selection ,
  .border .v-select__slot .v-label{
    color: $she-c!important;
  }

  .s-table {
    .v-data-table__wrapper {
      overflow: auto;
      flex: 1 0 80%;
      // height: 100%;

      td {
        font-size: 12px!important;
        color: $she-grey;
      }

      td:nth-child(2),
      td:nth-child(3) {
        color: black;
        font-size: 16px!important;
      }

    }
  }
</style>
