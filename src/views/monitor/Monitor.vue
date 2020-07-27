<template>
  <v-sheet class="m-container">
    <v-card class="s-tab-lists">
      <badge v-for="(item, index) in tabTitle" :key="item"
        :active="index === tabActive"
        :data="tabNumber[index]"
        :type="item"
      />
    </v-card>

    <v-card class="s-charts">
      <!-- menu -->
      <div class="text-lg-h6 text-md-h6">
        <span>{{menuTitle}}</span> |
        <span>{{menuSubtitle[tabActive]}}</span>
      </div>

      <div class="s-charts-list">
        <!-- 折线图-->
        <div class="chart-legends text-lg-body-2">
          <span class="legend"> <i></i> 2019</span>
          <span class="legend"> <i></i>2020</span>
          <v-select
            :items="items"
            v-model="itemSelect"
            height= "5"
            solo
            dense
            hide-details
            flat
          ></v-select>
        </div>

        <v-divider></v-divider>

        <!-- 日历图-->
        <div class="chart-legends text-lg-body-2">
          <span class="legend">同比</span>
          <span class="legend">环比</span>
          <v-select
            :items="items"
            v-model="itemSelect2"
            height= "5"
            solo
            dense
            hide-details
            flat
          ></v-select>
        </div>
      </div>
    </v-card>
  </v-sheet>
</template>

<script>
import LineChart from '@/components/LineChart.vue';
import layout from '@/mixins/layout';
import Badge from '@/views/monitor/badge.vue';

const chart1Size = {
  width: 800,
  height: 350,
  margin: {
    bottom: 50, left: 80, top: 10, right: 20,
  },
};

export default {
  name: 'Monitor',

  components: {
    Badge,
    // LineChart,
  },

  data: () => ({
    tabActive: 0,
    tabTitle: ['总医疗（元）', '医保列支（元）', '基金支出（元）', '门诊均次（元）', '人次人头（次）'],
    tabNumber: [32678903, 0, 0, 0, 0],

    menuTitle: '公立医院',
    menuSubtitle: ['总医疗费用', '医保列支费用', '基金支出费用', '门诊均次费用', '人次人头'],

    chart1Size,
    items: ['年', '月', '日'],
    itemSelect: '年',

    // chart2
    itemSelect2: '月',
  }),

  mixins: [layout],

  mounted() {
    // fetch 总医疗的四个值
  },

};
</script>

<style scoped lang="scss">
  .m-container {
    display: grid;
    grid-template-columns: 20% auto;
    grid-gap: 0.8rem;
    height: 100%;
    padding: 0.8rem;
    background: $she-bg;

    .s-tab-lists {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
    }

    .s-charts {
      display: flex;
      flex-direction: column;
      padding: 1rem 2rem;

      .s-charts-list {
        display: grid;
        grid-template-rows: 50% 5% 45%;
        width: 100%;
      }

      .chart-legends {
        display: flex;
        width: 20%;
        align-items: center;
        margin: 20px 0;

        .v-input {
          border: 1px solid #cfcfcf;
        }

        .legend {
          flex: 0 0 30%;
          display: flex;
          align-items: center;
          position: relative;
          padding: 4px 10px;
          border: 1px solid #cfcfcf;
          border-radius: 4px;
          margin-right: 15px;

          i {
            width: 1rem;
            height: 1rem;
            background: coral;
            border-radius: 50%;
            margin: 0 0.5rem 0 0;
          }
        }
      }
    }
  }
</style>
