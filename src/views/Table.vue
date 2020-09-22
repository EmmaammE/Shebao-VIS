<template>
 <v-card class="table-container">
    <v-data-table
      class="s-table expand-table"
      :headers="headers"
      :items="tableData"
      item-key="index"
      disable-sort
      single-select
      :options.sync="options"
      :loading="loading"
      dense
      hide-default-header
      :items-per-page="10"
      calculate-widths
    >
      <template v-slot:header="{}">
        <thead>
            <tr
              v-for="(header, row) in tableHeader.trees"
              :key="row"
            >
              <th
                v-for="(node,j) in header"
                :key="j"
                :colspan="node.colspan"
                :rowspan="node.rowspan"
              >
                <div class="cell-span">
                  {{node.text}}
                </div>
              </th>
            </tr>
        </thead>
      </template>
    </v-data-table>
 </v-card>
</template>

<script>
import getSpan from '@/util/tableHeader';
import { searchRankHeader, leaves, handleData } from '@/util/table/rank';
import { mapState } from 'vuex';

const tableHeader = getSpan(searchRankHeader);

export default {
  data() {
    return {
      // tableData: [],
      // totalItems: 100,

      options: {},
      loading: false,
      headers: leaves,
      tableHeader,
    };
  },

  computed: mapState({
    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    // countPlusLocalState(state) {
    //   return state.count + this.localCount;
    // },
    totalItems(state) {
      return state.tableData.total;
    },

    tableData(state) {
      return handleData(state.tableData.page);
    },

  }),

  mounted() {
    // console.log(tableHeader.trees);
  },
};
</script>

<style lang="scss">
  .expand-table {
    .v-data-table__wrapper {
      height: calc(100vh - 150px);
      overflow: auto;
    }

    th {
      border: 1px solid rgba(0,0,0,0.12);
    }

    .v-data-table__wrapper > table > tbody > tr > td,
    .v-data-table__wrapper > table > tbody > tr > th,
    .v-data-table__wrapper > table > thead > tr > td,
    .v-data-table__wrapper > table > thead > tr > th,
    .v-data-table__wrapper > table > tfoot > tr > td,
    .v-data-table__wrapper > table > tfoot > tr > th {
      padding: 0 5px;
      height: 40px;
      min-width: 100px;
      text-align: center!important;
    }

    .v-data-table__wrapper > table > tfoot > tr > td:nth-child(2) {
      min-width: 300px;
    }
  }

  .table-container {
    overflow: auto;
    padding: 10px;
    width: 81vw;

    div.cell-span {
      width: 100%;
      height: 100%;
      overflow: visible;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
