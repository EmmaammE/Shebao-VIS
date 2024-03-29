<template>
  <div class="w-container">
    <v-card>
      <v-data-table
        class="s-table max-height"
        :headers="headers"
        :items="pageData"
        item-key="index"
        :items-per-page="10"
        :options.sync="options"
        :server-items-length="total"
        @click:row="rowClick"
        v-model="pageIndex"
        single-select
        :loading="loading"
        disable-sort
      >
        <template v-slot:[`item.key`]="{ item }">
          <div class="s-col">{{item.key}}</div>
        </template>

        <template v-slot:[`item.yi_chang_fei_yong`]="{ item }">
          <div class="s-col">{{Number(item.yi_chang_fei_yong).toFixed(2)}}</div>
        </template>

        <template v-slot:[`item.type`]="{ item }">
          <!-- 多地开药次数 -->
          <div class="bar-container">
            <p>{{item.type}}</p>

            <bar
              :scale="scale"
              :datum="[Object.keys(item.five_min).length,
                Object.keys(item.ten_min).length,
                Object.keys(item.sixty_min).length]"
              :data="item.type"
              :type="0"
            />
          </div>
        </template>
      </v-data-table>
    </v-card>
    <v-card class="right-panel">
      <v-sheet class="header">
        <div class="avatar"><GirlIcon/></div>
        <v-card class="s-tab">
          <div v-for="(tab,i) in tabs" :key="tab"
            :class="activeIndex === i ? 'active':''"
            @click="changeTab(i)"
          >{{tab}}</div>
        </v-card>
      </v-sheet>
      <div class="wrapper">
        <v-simple-table dense
          height="70vh"
          fixed-header
        >
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center"
                  v-for="text in headers2"
                  :key="text"
                >{{text}}</th>
              </tr>
            </thead>
            <tbody v-if="pageData[pageIndex[0].index-1] &&
              Object.keys(pageData[pageIndex[0].index-1][tabsKey[activeIndex]]).length!== 0"
            >
              <tr v-for="(item, value) in pageData[pageIndex[0].index-1][tabsKey[activeIndex]]"
                :key="value">
                <td>{{ value }}</td>
                <td>{{item.ji_gou_dai_ma}}</td>
                <td>{{item.ji_gou_ming_cheng}}</td>
                <td>{{item.jie_suan_shi_jian}}</td>
                <td>{{item.jiu_zhen_ren}}</td>
                <td>{{item.jiu_zhen_liu_shui}}</td>
                <td>{{item.yi_liao_fei_zong_e}}</td>
                <td>{{item.bao_xiao_zong_e}}</td>
                <!-- <td>{{item.yi_shi}}</td> -->
              </tr>
            </tbody>
            <tbody v-else>
              <tr class="v-data-table__empty-wrapper"><td colspan="8">没有数据</td></tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
    </v-card>
  </div>
</template>

<script>
import { fetchDoctorViolationInfo } from '@/util/http';
import GirlIcon from '@/assets/search/icon_1.svg';
import Bar from '@/components/small/Bar.vue';
import * as d3 from 'd3';

export default {
  components: {
    Bar,
    GirlIcon,
  },

  data() {
    return {
      headers: [
        {
          text: '序号',
          value: 'index',
          align: 'center',
          sortable: false,
        },
        {
          text: '医师编号',
          align: 'center',
          value: 'key',
          sortable: false,
          width: 120,
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
          sortable: false,
        },
        {
          text: '异常费用（元）',
          value: 'yi_chang_fei_yong',
          align: 'center',
          sortable: false,
        },
        {
          text: '多地开药次数（次）',
          value: 'type',
          align: 'center',
          sortable: true,
        },
      ],

      headers2: [
        '序号', '机构代码', '医疗机构名称', '结算时间', '就诊人',
        '就诊流水号', '医疗费总额（元）', '报销金额（元）',
      ],

      pageData: [],
      scale: d3.scaleLinear().range([0, 100]),
      activeIndex: 0,
      tabs: ['5分钟', '10分钟', '60分钟', '半天'],
      tabsKey: ['five_min', 'ten_min', 'sixty_min', 'day'],

      // 分页
      pageNum: 1,
      loading: true,
      options: {},
      // 服务端总数量
      total: 0,

      // 另一半的数据
      pageIndex: [{ index: 1 }],
    };
  },

  mounted() {
    // this.getDoctorViolationInfo();
  },

  watch: {
    options: {
      handler() {
        this.getDoctorViolationInfo()
          .then((data) => {
            this.pageData = data.items;
            this.total = data.total;
            this.scale = this.scale.domain([0, data.maxValue]);
          });
      },
      deep: true,
    },
  },

  methods: {
    async getDoctorViolationInfo() {
      this.loading = true;
      const { page } = this.options;
      const data = await fetchDoctorViolationInfo({
        pageNum: page,
      });

      let maxValue = Number.MIN_VALUE;
      const items = Object.keys(data.doctor_page)
        .map((key) => {
          const size = Object.keys(data.doctor_page[key].day).length;
          maxValue = Math.max(maxValue, size);
          return {
            ...data.doctor_page[key], key, type: size,
          };
        }).sort((a, b) => b.type - a.type)
        .map((d, index) => ({ ...d, index: index + 1 }));

      // this.scale = this.scale.domain([0, maxValue]);

      return new Promise((resolve) => {
        setTimeout(() => {
          this.loading = false;
          resolve({
            total: data.total_num,
            items,
            maxValue,
          });
        }, 0);
      });
    },

    changeTab(e) {
      this.activeIndex = e;
    },

    rowClick(item, row) {
      // 修改选中的人的序号
      row.select(true);
      this.pageIndex = [{ index: item.index }];
    },
  },

};
</script>

<style scoped lang="scss">
  .w-container {
    display: grid;
    grid-template-columns: 45% auto;
    grid-gap: 10px;
    margin: 10px;
    height: calc(90vh - 20px);

    .s-col {
      max-width: 120px;
    }

    .bar-container {
      user-select: none;
    }

    th {
      padding: 2px!important;
    }

    .header {
      padding: 20px 10px;
      display: flex;
      align-items: center;
      justify-content: space-around;

      .avatar {
        height: 60px;
        width: 60px;
        display: flex;
        align-items: center;
      }
    }

    //右侧
    .s-tab {
      display: flex;
      justify-content: space-around;

      div {
        padding: 10px 45px;
        height: 52px;
        line-height: 32px;
        cursor: pointer;
        color:  $she-c;
        border-radius: 4px;
        transition: all 300ms ease-in-out;
      }

      $blues: #6690ff, #4d6bda, #3348b6, #0f2693;

      @each $c in $blues {
        $i: index($blues, $c);

        div:nth-child(#{$i}) {
          color:$c;
        }

        div:nth-child(#{$i}).active {
          background:$c;
          color: #fff;
        }
      }

    }

    td {
      text-align: center;
    }

  }
</style>
