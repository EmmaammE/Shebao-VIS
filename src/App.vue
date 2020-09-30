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
    border-left: 5px solid #94bfef!important;

    svg {
      path:nth-child(1) {
        stroke: #024Ec2;
      }

      path {
        fill: #024Ec2;
      }
    }
  }

  .v-list-item--link:before {
    background: #fff!important;
  }

  .w-container .max-height {
    .v-data-table__wrapper {
      height: calc(90vh - 80px);
    }
  }

  .s-bar .v-toolbar__content {
    width: 100%;
  }

// 下拉框蓝色
  .v-select__slot .v-select__selection ,
  .v-select__slot .v-label{
    color: $she-c!important;
  }

  .s-table {
    .v-data-table__wrapper {

      td {
        font-size: 0.5rem;
        color: $she-grey;
      }

      td:nth-child(2),
      td:nth-child(3) {
        color: black;
        font-size: 0.875rem;
      }

    }
  }

  // .w-container .s-table {
  //   th {
  //     font-size: 0.875rem;
  //   }
  //   td {
  //     font-size: 0.7rem!important;
  //   }
  // }

  // .w-container .right-panel {
  //   td {
  //     font-size: 12px;
  //   }
  // }

  .s-lists {
    .v-list-item__content {
      // 修改layout左侧侧边
      padding: 1rem 0 !important;
    }
  }

  #map-id {
    .leaflet-marker-icon {
      outline: none;
    }

    .leaflet-popup-content-wrapper {
      border-radius: 4%;
    }

    .leaflet-popup-content {
      margin: 2px 8px 2px 8px;
    }

    .leaflet-popup-tip {
      box-shadow: initial;
    }

  }

  .hide-popup {
    .leaflet-popup{
      opacity: 0!important;
    }
  }

  .search-map {
    // 修改style
    .leaflet-popup-content-wrapper {
      border-radius: 3px;
    }
    .leaflet-popup-content-wrapper,
    .leaflet-popup-tip {
      background: #636363;
      color: #ffffff;
      box-shadow: 0 1px 1px 1px rgba(#636363, 0.5);
      opacity: 0.7;
    }

    .leaflet-popup-tip-container {
      top: -17px;
      transform: rotate(180deg) scale(0.7);
    }

    // .leaflet-container a.leaflet-popup-close-button {
    //   color: #fff;
    //   right: -2px;
    //   font-size: 10px;
    // }
  }

  // 参保人预警的popup样式
  .map-container {
    .leaflet-popup-content-wrapper,
    .leaflet-popup-tip {
      background: #fff;
      color: #000;
      opacity: 0.9;
      box-shadow: 0 1px 1px 1px rgba(#636363, 0.5);
    }

    .leaflet-popup-tip-container {
      top: -16px;
      transform: rotate(180deg) scale(0.7);
    }

  }

  .map-charts-container {
    td {
      font-size:12px!important;
      text-align: center;
    }
  }

  .search-container,
  .w-container,
  .inner,
  .treatment {
    th, td {
      font-size: 12px!important;
    }

    .v-data-table > .v-data-table__wrapper > table > tbody > tr > td,
    .v-data-table > .v-data-table__wrapper > table > tbody > tr > th,
    .v-data-table > .v-data-table__wrapper > table > thead > tr > td,
    .v-data-table > .v-data-table__wrapper > table > thead > tr > th,
    .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td,
    .v-data-table > .v-data-table__wrapper > table > tfoot > tr > th {
      padding: 0 5px;
    }

    .v-icon.v-icon {
      font-size: 0.92rem;
    }

    .v-data-table__expanded v-data-table__expanded__content {
      display: flex;
    }

    .s-table .v-data-table__wrapper {
      overflow-y: auto;
      overflow-x: hidden;
    }

    .table-wrapper table{
      width: 200%!important;

    }

    .table-wrapper .v-data-table__wrapper {
      overflow-x: auto;
    }

    // 添加max-height拉高表格
    .max-height .v-data-table__wrapper > table {
      height: 100%;
    }
  }

  .m-container .select-area {
    .v-text-field.v-text-field--solo.v-input--dense > .v-input__control {
      min-height: 20px!important;
      line-height: 20px;
      height: 20px;
    }
  }

  .min-height {
    .v-input__slot {
      min-height: 28px!important;
    }

    .v-label {
      font-size: 0.7rem;
      top: 5px!important;
    }
  }

  .chart-table {
     tr {
      td:nth-child(4) ,
      td:nth-child(5) ,
      td:nth-child(6) ,
      td:nth-child(7) {
        opacity: 0;
      }
    }

    tr:nth-child(1) {
      td {
        opacity: 1;
      }
    }

  }

  .warning-people {
    .leaflet-popup-content {
      min-width: 160px;
    }
  }

  .layout-insert .v-list-item__content {
    margin-left: 26px;
  }
</style>
