<template>
  <v-card class="s-rank-container">
    <div>
      <p class="text-lg-h6">筛选条件</p>
      <div class="s-box text-lg-body-2">时间区间</div>

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

      <div class="s-divider" />

    </div>

    <p class="text-lg-h6">数据结果</p>
    <div class="s-chart-container text-lg-body-2">
      <div>
        <HosIcon />
        公立医院
      </div>

      <!-- 折线图 -->

      <dura-chart
        :datum="datum"
        v-bind="chart1Size"
      />

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

      number: 0,
      lookup: 1,

      // 查询时间
      startDay: new Date('2020-01-01').toISOString().substr(0, 10),
      endDay: new Date().toISOString().substr(0, 10),

      // 排序类型
      selected: { value: '按结构排序', key: 'organization' },

      datum: {},
      chart1Size,
    };
  },

  components: {
    HosIcon,
    AmountIcon,
    MIcon,
    DuraChart,
  },

  mounted() {
    this.getRankData();
  },

  methods: {
    async getRankData() {
      const data = await fetchRank({
        startDay: this.startDay,
        endDay: this.endDay,
        orgType: this.model.map((d) => FUND_TYPE[d]),
        searchType: this.selected.key,
        // TODO 查询的药品
        drugItem: '阿司匹林',
        displayNum: 15,
      });

      // 类型
      this.datum = data.public;
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
      padding-right: 50%;
      display: grid;
      grid-template-columns: 33% 33% 33%;
      grid-gap: 20px;

      .v-input {
        border: 1px solid #dadef8;
        border-radius: 0;
        margin: 2px 0;
      }
    }

    .s-chart-container {
      position: relative;

      .legends {
        position: absolute;
        right: 0;
        top: 0;

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
        }
      }
    }
  }
</style>
