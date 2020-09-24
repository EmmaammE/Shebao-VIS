<template>
  <v-card class="s-rank-container">
    <v-overlay v-if="loading" :value="loading" color="#fff" absolute>
      <v-progress-circular indeterminate size="64" color="#98cbfa"></v-progress-circular>
    </v-overlay>

    <div>
      <p class="she-title">筛选条件</p>
      <div class="s-box text-lg-body-2">时间区间
        <time-picker
          :dateEnd="dateEnd"
          :dateStart="dateStart"
          :menu1="menu1"
          :menu2="menu2"
          @updateMenu1="updateMenu1"
          @updateMenu2="updateMenu2"
          @updateDateStart="updateDateStart"
          @updateDateEnd="updateDateEnd"
          :type="true"
        />
      </div>

      <div class="s-divider" />

      <div class="s-box type-container">
        <p class="text-lg-body-2">机构类型</p>
        <v-list dense>
          <v-list-item-group
            v-model="model"
            multiple
          >
            <template v-for="(item, i) in items">
              <v-divider
                v-if="!item"
                :key="`divider-${i}`"
              ></v-divider>

              <v-list-item
                v-else
                dense
                :key="`item-${i}`"
                :value="item"
                active-class="primary--text text--accent-4"
              >
                <template v-slot:default="{ active, toggle }">
                  <v-list-item-content>
                    <v-list-item-title v-text="item"></v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-checkbox
                      dense
                      :input-value="active"
                      :true-value="item"
                      color="primary accent-4"
                      @click="toggle"
                    ></v-checkbox>
                  </v-list-item-action>
                </template>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
      </div>

      <div class="s-divider" />

      <div class="type-container look-container s-box">
        <div class="inputs">
          <!-- 查询条件 -->
        <v-select
          v-model="selected"
          :items="selectItems"
          item-text="value"
          item-value="key"
          solo
          dense
          flat
          hide-details
        ></v-select>

        <v-text-field
          dense
          solo
          flat
          v-model.trim="number"
          label="排名显示数量"
          hide-details
        ></v-text-field>

        <v-text-field
          dense
          solo
          flat
          hide-details
          v-model.trim="lookup"
          label="可输入药品或服务名"
          :rules="selected!=='drug'?['Required']:[]"
        >
          <template #label v-if="selected!=='drug'">
            可输入药品或服务名
            <span class="red--text"><strong>* </strong></span>
          </template>
        </v-text-field>
        </div>

        <div class="s-btn-container">
          <button @click="reset">重置</button>
          <button @click="getData">查询</button>
        </div>
      </div>

      <div class="s-divider" />

    </div>

    <p class="she-title text-margin">数据结果</p>

    <div class="s-chart-container text-lg-body-2" ref="chart">

      <div class="charts" v-if="singleChart && datum!==null">
        <dura-chart
          v-bind="chart1Size"
          :datum="datum"
          @tooltip="updateTooltip"
        />

        <Tooltip v-show="isShowing" v-bind="tipPos">
          <div class="s-tip">
            <div>
              <p v-if="tipData.money">金额：{{tipData.money}}万元</p>
              <p v-if="tipData.num">数量：{{tipData.num}}例</p>
            </div>
          </div>
        </Tooltip>
      </div>

      <div class="charts" v-else>
        <div v-for="(value, name) in datum"
          :key="name"
          class="wrapper"
        >
          <div class="header">
            <HosIcon />
            <p>{{TITLE[name]}} </p>
          </div>

          <!-- 折线图 -->
          <dura-chart
            :datum="value"
            v-bind="chart1Size"
            @tooltip="updateTooltip"
          />

          <Tooltip v-show="isShowing" v-bind="tipPos">
            <div class="s-tip">
              <div>
                <p v-if="tipData.money">金额：{{tipData.money}}万元</p>
                <p v-if="tipData.num">数量：{{tipData.num}}例</p>
              </div>
            </div>
          </Tooltip>
        </div>

      </div>
      <!-- legends -->
      <div class="legends">
        <span>金额 <MIcon /></span>
        <span>数量 <AmountIcon /></span>
      </div>
    </div>
  </v-card>
</template>

<script>
import HosIcon from '@/assets/search/hospital.svg';
import AmountIcon from '@/assets/search/数量.svg';
import MIcon from '@/assets/search/金额.svg';
import { fetchRank } from '@/util/http';
import { FUND_TYPE } from '@/util/type';
import DuraChart from '@/components/charts/DualChart.vue';
import TimePicker from '@/components/small/TimePicker.vue';
import Tooltip from '@/components/Tooltip.vue';
import timePicker from '@/mixins/date';

const chart1Size = {
  width: 900,
  height: 300,
  margin: {
    bottom: 40, left: 200, top: 20, right: 80,
  },
};

export default {
  data() {
    return {
      items: [
        '公立医院',
        '民营医院',
        '其他社会办医',
        '社区卫生服务中心',
        '零售药店',
      ],
      //  当前选中的机构类型
      model: [
        '公立医院',
        '民营医院',
        '其他社会办医',
        '社区卫生服务中心',
        '零售药店',
      ],

      selectItems: [
        { value: '按机构排序', key: 'organization' },
        { value: '按药品排序', key: 'drug' },
        { value: '按医师排序', key: 'doctor' },
      ],

      number: '',
      lookup: '',

      // 排序类型
      selected: 'organization',

      datum: null,
      chart1Size,

      TITLE: {
        public: '公立医院',
        community: '社区卫生服务中心',
        private: '民营医院',
        social: '其他社会办医',
        drugstore: '零售药店',
      },

      // 是否显示tooltip
      isShowing: false,
      tipData: {
        money: 0,
        num: 0,
      },
      tipPos: {
        left: 0,
        top: 0,
      },
      bbox: {},

      loading: false,
    };
  },

  components: {
    HosIcon,
    AmountIcon,
    MIcon,
    DuraChart,
    TimePicker,
    Tooltip,
  },

  mixins: [
    timePicker,
  ],

  mounted() {
    this.bbox = this.$refs.chart.getBoundingClientRect();
  },

  computed: {
    // 如果是按药品排序，且输入了一个药品/服务名，则只显示一个图表
    singleChart() {
      if (this.selected === 'drug' && this.lookup.length !== 0) {
        return true;
      }
      return false;
    },
  },

  watch: {
    singleChart() {
      this.datum = null;
    },
  },

  methods: {
    async getRankData() {
      // console.log(this.selected);
      const lookup = this.lookup.length === 0 ? null : this.lookup;
      const number = this.number.length === 0 ? null : (+this.number);
      const data = await fetchRank({
        startDay: this.dateStart,
        endDay: this.dateEnd,
        orgType: this.model.map((d) => FUND_TYPE[d]),
        searchType: this.selected,
        drugItem: lookup,
        displayNum: number || 15,
      });

      const d = {};

      if (this.singleChart) {
        Object.keys(data).forEach((key) => {
          if (Object.keys(data[key]).length !== 0) {
            // eslint-disable-next-line prefer-destructuring
            d[this.TITLE[key]] = Object.values(data[key])[0];
          }
        });
      } else {
        Object.keys(data).forEach((key) => {
          if (Object.keys(data[key]).length !== 0) {
            d[key] = data[key];
          }
        });
      }

      this.datum = d;
      this.loading = false;
    },

    getData() {
      this.loading = true;
      this.getRankData();
    },

    reset() {
      this.model = [
        '公立医院',
        '民营医院',
        '其他社会办医',
        '社区卫生服务中心',
        '零售药店',
      ];
      this.number = '';
      this.lookup = '';
      this.selected = 'organization';
    },

    updateTooltip(isShowing, tipPos, tipData) {
      this.isShowing = isShowing;
      this.tipPos = {
        left: tipPos.left - this.bbox.x,
        top: tipPos.top - this.bbox.y,
      };
      this.tipData = tipData;
    },
  },
};
</script>

<style scoped lang="scss">
  .s-rank-container {
    p {
      margin: 0;
    }

    margin: 1rem;
    height: 95%;
    padding: 0.5rem 1rem;

    .s-box {
      display: flex;
      align-items: center;
      margin: 5px 0;

      .time-container {
        margin: 0 18px;
      }
    }

    .s-divider{
      background: #dcdff8;
      height: 2px;
      width: 100%;
    }

    .type-container {
      display: flex;
      align-items: center;

      .v-list {
        padding: 0;
      }
      .v-list-item-group {
        display: flex;
      }

      .v-list-item__content {
        padding: 3px 0!important;
      }
      .v-list-item__action {
        margin: 3px 0!important;
      }
      .v-list-item--link:before {
        background: #fff;
      }
      .v-list-item--dense, .v-list--dense .v-list-item {
        min-height: 0px;
      }
    }

    .look-container {
      display: flex;
      justify-content: space-between;

      .inputs {
        display: grid;
        grid-gap: 20px;
        grid-template-columns: 150px 150px 200px;

        .v-input {
          border: 1px solid #dadef8;
          border-radius: 0;
          margin: 2px 0;
        }
      }
    }

    .s-chart-container {
      position: relative;

      .charts {
        overflow: auto;
        height: 60vh;

        .wrapper {
          .header {
            display: flex;
            align-items: center;

            p {
              margin: 0 10px;
            }
          }
        }
      }

      .legends {
        position: absolute;
        right: 20px;
        top: 40px;
        font-size: $f-small;

        svg {
          transform: scale(0.7);
        }

        span {
          padding: 2px 10px;
          border: 1px solid #ccc;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          margin: 10px 0;
          height: 35px;
          background: #fff;
        }
      }
    }

    .s-tip {
      width: 170px;
      height: 50px;
      padding: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      // background: rgba(#777,0.75);
    }
  }
</style>
