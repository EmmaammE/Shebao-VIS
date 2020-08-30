<template>
  <v-card class="s-rank-container">
    <div>
      <p class="text-lg-h6">筛选条件</p>
      <div class="s-box text-lg-body-2">时间区间
        <time-picker
          :dateEnd="endDay"
          :dateStart="startDay"
          :menu1="menu1"
          :menu2="menu2"
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
          v-model="number"
          label="排名显示数量"
          hide-details
        ></v-text-field>

        <v-text-field
          dense
          solo
          flat
          hide-details
          v-model="lookup"
          label="可输入药品或服务名"
        ></v-text-field>
        </div>

        <div class="btn-container">
          <button @click="reset">重置</button>
          <button @click="getData">查询</button>
        </div>
      </div>

      <div class="s-divider" />

    </div>

    <p class="text-lg-h6">数据结果</p>
    <div class="s-chart-container text-lg-body-2" ref="chart">
      <div class="charts">
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
                <p>金额：{{tipData.money}}万元</p>
                <p>数量：{{tipData.num}}例</p>
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
        { value: '按结构排序', key: 'organization' },
        { value: '按药品排序', key: 'drug' },
        { value: '按医师排序', key: 'doctor' },
      ],

      number: null,
      lookup: null,

      // 查询时间
      startDay: new Date('2020-01-01').toISOString().substr(0, 10),
      endDay: new Date().toISOString().substr(0, 10),
      menu1: false,
      menu2: false,

      // 排序类型
      selected: { value: '按结构排序', key: 'organization' },

      datum: {},
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

  mounted() {
    this.bbox = this.$refs.chart.getBoundingClientRect();
  },

  methods: {
    async getRankData() {
      const data = await fetchRank({
        startDay: this.startDay,
        endDay: this.endDay,
        orgType: this.model.map((d) => FUND_TYPE[d]),
        searchType: this.selected.key,
        drugItem: this.lookup,
        displayNum: this.number || 15,
      });

      const d = {};
      // 类型
      Object.keys(data).forEach((key) => {
        if (Object.keys(data[key]).length !== 0) {
          d[key] = data[key];
        }
      });
      this.datum = d;
    },

    getData() {
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
      this.number = null;
      this.lookup = null;
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
    padding: 1rem;

    .s-box {
      display: flex;
      align-items: center;
      margin: 2px 0;

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
      margin: 2px 0;

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

    .btn-container {
      margin: 0 20px;
      display: flex;

      button {
        padding: 3px 20px;
        border: 1px solid #3365ba;
        letter-spacing: 4px;
        margin: 5px;
        outline:none;
        height: 30px;
        width: 90px;
        text-align: center;
        color: #3365ba;
      }
      button:nth-child(2) {
        background: #3365ba;
        color: #fff;
      }
    }

    .s-tip {
      width: 170px;
      height: 50px;
      padding: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
