<template>
  <div class="w-container">
    <v-card>
      <v-data-table
        :headers="headers"
        :items-per-page="5"
        :items="pageData">
      </v-data-table>
    </v-card>
    <v-card></v-card>
  </div>
</template>

<script>
import { fetchDoctorViolationInfo } from '@/util/http';

export default {

  data() {
    return {
      headers: [
        // { text: '序号', sortable: false },
        {
          text: '医师编号',
          align: 'center',
          sortable: false,
          value: 'key',
        },
        {
          text: '医师姓名',
          value: 'name',
          align: 'center',
          sortable: false,
        },
        {
          text: '异常机构',
          value: 'yi_chang_ji_gou_shu_liang',
          align: 'center',

        },
        {
          text: '异常费用',
          value: 'yi_chang_fei_yong',
          align: 'center',
        },
        {
          text: '多地开药次数',
          value: 'type',
          align: 'center',
          sortable: false,
        },
      ],

      pageData: [],
    };
  },

  mounted() {
    this.getDoctorViolationInfo();
  },

  methods: {
    async getDoctorViolationInfo() {
      const data = await fetchDoctorViolationInfo();
      console.log(data);

      this.pageData = Object.keys(data.doctor_page)
        .map((key) => ({ ...data.doctor_page[key], key }));
    },
  },

};
</script>

<style scoped lang="scss">
  .w-container {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-gap: 10px;
    margin: 10px;
  }
</style>
