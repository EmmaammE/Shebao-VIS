<template>
  <v-sheet class="m-container">
    <v-card class="s-charts">
      <div class="s-tab-lists">
        <badge v-for="(item, index) in tabTitle" :key="item"
          :active="index === tabActive"
          :data="tabNumber[index]"
          :type="item"
          @click.native="changeTab(index)"
        />
      </div>
      <!-- menu -->
      <div class="s-header">
        <div class="text-lg-h6 text-md-h6">
          <span>{{menuTitle}}</span> |
          <span>{{menuSubtitle[tabActive]}}</span>
        </div>

        <div class="select-area">
          <!-- 时间选择 -->
          <time-picker
            :dateEnd="dateEnd"
            :dateStart="dateStart"
            :menu1="menu1"
            :menu2="menu2"
            @updateMenu1="updateMenu1"
            @updateMenu2="updateMenu2"
            @updateDateStart="updateDateStart"
            @updateDateEnd="updateDateEndAction"
          />
          <!-- 时间选择 end-->

          <v-select
            :items="items"
            v-model="itemSelect"
            item-text="title"
            item-value="value"
            solo
            dense
            hide-details
            flat
          ></v-select>
        </div>
      </div>

      <div class="charts-container">
        <v-overlay v-if="loading" :value="loading" color="#fff" absolute z-index="600">
          <v-progress-circular indeterminate size="64" color="#98cbfa"></v-progress-circular>
        </v-overlay>

        <react-chart />

        <monitor-charts
          v-for="(data, index) in datafetch"
          :key="index"
          :itemSelect="itemSelect"
          :dataFetch="data"
          :subTitle="subTitles.length !==0 ? subTitles[index] : ''"
          :unit="menuSubtitle[tabActive] === '人次人头（次）'?'次':'元'"
        />
      </div>

    </v-card>
  </v-sheet>
</template>

<script>
import Badge from '@/views/monitor/badge.vue';
import {
  fetchFeeStatistics, fetchFeeTimeSeries, fetchFundDetailStatistics, fetchFundDetailTimeSeries,
} from '@/util/http';
import { ROUTE_PARAM } from '@/util/type';
import TimePicker from '@/components/small/TimePicker.vue';
import timePicker from '@/mixins/date';
import ReactChart from '@/react-components/chart';
import MonitorCharts from './MonitorCharts.vue';

const FEE_TYPE = {
  总医疗费用: 'total',
  医保列支费用: 'liezhi',
  基金支出费用: 'fund',
  门诊均次费用: 'outpatient_average',
  住院均次费用: 'inpatient_average',
  人次人头: 'person_time_head_count',
};

const FEE_STRUCTURE = {
  // fee_structure
  药品费用: 'drug_fee',
  检查检验: 'check_fee',
  手术治疗: 'surgical_fee',
  物理治疗: 'physical_fee',
  中医治疗: 'tcm_fee',
  口腔诊疗: 'oral_fee',
};

const LIE_ZHI_TYPE = {
  // liezhi
  统筹金额: 'overall_fund',
  当年账户: 'current_year',
  历年账户: 'past_year',
  大病保险: 'serious_illness',
  医疗救助: 'medical_assistance',
};

const funds = {
  liezhi: LIE_ZHI_TYPE,
  fee_structure: FEE_STRUCTURE,
};

// 按费用结构有多个子类目
const FEE_SUBITEM = {
  drug_fee: {
    药品费总额: 'yao_pin_zong_e',
    中成药: 'zhong_cheng_yao',
    中草药: 'zhong_cao_yao',
    西药: 'xi_yao',
  },
  check_fee: {
    检查检验总额: 'jian_cha_jian_yan_zong_e',
    检查费用: 'jian_cha_fei_yong',
    化验费用: 'hua_yan_fei_yong',
  },
  tcm_fee: {
    中医治疗费用: 'zhong_yi_zhi_liao_zong_e',
    针灸费用: 'zhen_jiu_fei_yong',
    推拿费用: 'tui_na_fei_yong',
  },
};

// const DATA_TYPE = ['chain_ratio', 'year_ratio'];
export default {
  name: 'Monitor',

  components: {
    Badge,
    TimePicker,
    MonitorCharts,
    ReactChart,
  },

  props: {
    routeType: String,
  },

  data: () => ({
    loading: true,

    tabActive: 0,
    tabTitle: ['总医疗费用（元）', '医保列支费用（元）', '基金支出费用（元）', '门诊均次费用（元）', '住院均次费用（元）', '人次人头（次）'],
    tabNumber: [32678903, 0, 0, 0, 0],

    menuSubtitle: ['总医疗费用', '医保列支费用', '基金支出费用', '门诊均次费用', '住院均次费用', '人次人头'],

    items: [
      { value: 0, title: '月', key: 'month' },
      { value: 1, title: '周', key: 'week' },
      { value: 2, title: '日', key: 'day' },
    ],
    itemSelect: 1,
    lineDatum: [],

    // 0就是默认的， 1是liezhi, 2fee_structure
    param_type: '',
    lidu: ['month', 'week', 'day'],

    datafetch: [],
    subTitles: [],
  }),

  mixins: [
    timePicker,
  ],

  mounted() {
    // fetch 总医疗的四个值
    this.getData(this.routeType);
  },

  computed: {
    menuTitle() {
      return ROUTE_PARAM[this.routeType];
    },
  },

  watch: {
    routeType(newValue) {
      this.tabActive = 0;
      this.subTitles = [];
      this.param_type = '';
      this.getData(newValue);
    },
    tabActive() {
      this.subTitles = [];

      if (this.$route.params.routeType === 'liezhi'
        || this.$route.params.routeType === 'feiyong') {
        this.getFeeTimeSeries(0);
      } else {
        this.getFeeTimeSeries(1);
      }
    },
    itemSelect() {
      if (this.$route.params.routeType === 'liezhi'
        || this.$route.params.routeType === 'feiyong') {
        this.getFeeTimeSeries(0);
      } else {
        this.getFeeTimeSeries(1);
      }
    },
  },

  methods: {
    getData(value) {
      this.loading = true;

      let type = 0;
      if (value === 'liezhi') {
        this.param_type = 'liezhi';
        this.getFund();
      } else if (value === 'feiyong') {
        this.param_type = 'fee_structure';
        this.getFund();
      } else {
        type = 1;
        this.menuSubtitle = ['总医疗费用', '医保列支费用', '基金支出费用', '门诊均次费用', '住院均次费用', '人次人头'];
        this.tabTitle = ['总医疗费用（元）', '医保列支费用（元）', '基金支出费用（元）', '门诊均次费用（元）', '住院均次费用（元）', '人次人头（次）'];

        this.getFeeStatistics();
      }

      this.getFeeTimeSeries(type);
    },

    updateDateEndAction(value) {
      this.updateDateEnd(value);
      this.$nextTick(() => {
        this.getData(this.routeType);
      });
    },

    changeTab(index) {
      this.tabActive = index;
    },

    async getFeeStatistics() {
      const data = await fetchFeeStatistics({
        startDay: this.dateStart,
        endDay: this.dateEnd,
        fundType: this.routeType,
      });

      this.tabNumber = [
        data.total,
        data.liezhi,
        data.fund,
        data.outpatient_average,
        data.inpatient_average,
        data.person_time_head_count,
      ];

      this.loading = false;
    },

    async getFund() {
      const data = await fetchFundDetailStatistics({
        startDay: this.dateStart,
        endDay: this.dateEnd,
        type: this.param_type,
      });

      this.tabNumber = Object.values(funds[this.param_type]).map((value) => data[value]);

      this.tabTitle = Object.keys(funds[this.param_type]).map((d) => `${d}（元)`);

      this.menuSubtitle = Object.keys(funds[this.param_type]);
    },

    async getFeeTimeSeries(type) {
      const granularity = this.lidu[this.itemSelect];
      let datafetch;
      if (type === 1) {
        datafetch = [await fetchFeeTimeSeries({
          fundType: this.routeType,
          feeType: FEE_TYPE[this.menuSubtitle[this.tabActive]],
          granularity,
          startDay: this.dateStart,
          endDay: this.dateEnd,
        })];
      } else {
        const secondType = Object.values(funds[this.param_type])[this.tabActive];
        if (FEE_SUBITEM[secondType]) {
          // 如果有第三个类型
          datafetch = await Promise.all(
            Object.values(FEE_SUBITEM[secondType])
              .map((v) => fetchFundDetailTimeSeries({
                mainType: this.param_type,
                secondType,
                granularity,
                startDay: this.dateStart,
                endDay: this.dateEnd,
                thirdType: v,
              })),
          );

          this.subTitles = Object.keys(FEE_SUBITEM[secondType]);
        } else {
          datafetch = [await fetchFundDetailTimeSeries({
            mainType: this.param_type,
            secondType,
            granularity,
            startDay: this.dateStart,
            endDay: this.dateEnd,
            thirdType: null,
          })];
        }
      }

      this.datafetch = datafetch;
      this.loading = false;
    },
  },

};
</script>

<style scoped lang="scss">
  .m-container {
    display: flex;
    height: 100%;
    padding: 0.8rem;
    background: $she-bg;

    .s-tab-lists {
      display: flex;
      justify-content: space-between;
      // padding: 0 20px;
    }

    .s-header {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
    }

    .s-charts {
      display: flex;
      flex-direction: column;
      padding: 2rem;
      width: 100%;

      .select-area {
        display: flex;

        .v-input {
          border: 2px solid #efefef;
          width: 80px;
          border-radius: 15px;
          font-size: 12px;
          border: 2px solid #efefef;
          margin: 2px 4px;

          // 这个的高度在app.vue
        }
      }

      .charts-container {
        height: 63vh;
        overflow: auto;
      }
    }
  }
</style>
