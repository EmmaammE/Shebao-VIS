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
      :server-items-length="totalItems"
      :loading="loading"
      dense
    >
      <template v-slot:header="{props:headers}">
        <thead :key="headers">
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
                {{node.text}}
              </th>
            </tr>
        </thead>
      </template>
    </v-data-table>
 </v-card>
</template>

<script>
import { getSpan, searchRankHeader } from '@/util/tableHeader';

const tableHeader = getSpan(searchRankHeader);

export default {
  data() {
    return {
      tableData: [],
      options: {},
      totalItems: 100,
      loading: false,
      headers: [
        {
          align: 'center', text: '性别', value: 'xing_bie', width: 45,
        }, {
          align: 'center', text: '序号', value: 'index',
        }, {
          align: 'center', text: '姓名', value: 'name',
        }, {
          align: 'center', text: '社保编号', value: 'she_bao_bian_hao',
        }, {
          align: 'center', text: '身份证号', value: 'shen_fen_zheng_hao',
        }, {
          align: 'center', text: '参保类别', value: 'can_bao_lei_xing',
        }, {
          align: 'center', text: '就诊状态', value: 'jiu_zhi_zhuang_tai',
        },
      ],

      tableHeader,
    };
  },

  computed: {

    // headersMenuWithSpan() {
    //   const depth = 4;
    //   return this.headersMenu.map((header) => {
    //     header.colspan.
    //   });
    // },
  },

  mounted() {
    console.log(tableHeader.trees);
  },
};
</script>

<style lang="scss">
  .expand-table {
    .v-data-table__wrapper > table {
      height: calc(100vh - 150px);
      width: 400%;
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
      height: 10px;
      text-align: center!important;
    }

  }

  .table-container {
    overflow: auto;
    padding: 10px;
    width: 81vw;
  }
</style>
