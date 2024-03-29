<template>
  <v-sheet class="sheet-container">
    <v-card class="card-container-1 card-divide">
      <h4>{{title}} {{id}}</h4>
      <div class="s-card-table">
        <div class="header">
          <span>均次指标</span>
          <span>交易次数</span>
          <span>发生金额</span>
        </div>
        <ul v-if="data">
          <li v-for="(d,index) in tableHeader"
            :key="index"
            @click="clickTab(index)"
            :class="tabIndex===index?'active':''"
          >
            <span>{{d.title}}</span>
            <span>{{data[d.key].num || 0}}</span>
            <span>{{data[d.key].money || 0}}</span>
          </li>
        </ul>
      </div>
    </v-card>
    <v-card class="card-divide card-margin" v-if="tabIndex!==-1 && tabIndex !== 2">
      <v-data-table
        dense
        :headers="modelHeader[tabIndex]"
        :items="datum"
        single-expand
        :expanded.sync="expanded"
        :hide-default-footer="true"
        item-key="index"
        :show-expand="tabIndex === 0"
        single-select
        @click:row="rowClick"
        :class="tabClass[tabIndex]"
        height="31vh"
        fixed-header
      >
        <template v-slot:[`item.jine`]="{ item }">
          <!-- 多地开药次数 -->
          <div class="bar-container" v-if="tabIndex === 1">
            <p>{{item.day}}</p>
            <bar
              :scale="scale"
              :datum="[item.five_min, item.ten_min, item.sixty_min]"
              :data="+item.day"
              :type="0"
            />
          </div>
          <!-- 刷小卡次数 -->
          <div class="bar-container" v-else-if="tabIndex === 3">
            <p>{{item.zong_jin_e}}</p>
            <bar
              :scale="scale"
              :datum="item.jine"
              :data="+item.zong_jin_e"
              :type="1"
            />
          </div>
        </template>
        <template v-slot:[`item.yao_zhan_bi`]="{ item }">
          {{(100 * (+item.yao_zhan_bi)).toFixed(2) + '%'}}
        </template>
        <template v-slot:expanded-item="{ headers, item }"
          v-if="tabIndex===0"
        >
          <td :colspan="headers.length" class="expand-content">
            <circle-progress
              :ratio="item.chu_fang_xiang_si_du"
              label="处方相似度"
            />
            <circle-progress
              :ratio="item.risk"
              label="风险度"
            />
          </td>
        </template>
      </v-data-table>
      <v-sheet v-if="tabIndex === 4 && datum.length > 0" class="chart">
        <div class="legends">
          <div class="img-wrapper">
            <img src="@/assets/warning/图例.png"/>
          </div>
        </div>

        <!-- 六个折线图 -->
        <div class="container">
          <div
            v-for="(d,index) in falseKeys"
            :key="d.value"
            class="bar-wrapper"
          >
            <span>{{d.text}}</span>
            <bar-line
              :data="falseData[index]"
              :standard="+standard[index]"
              :scale="widthScale[index]"
            />
          </div>
        </div>
      </v-sheet>
    </v-card>
  </v-sheet>
</template>

<script>
import CircleProgress from '@/components/small/CircleProgress.vue';
import {
  fetchOrgGroupHospital, fetchOrgMultiPlacePrescribe,
  fetchOrgSwipeLittleCard, fetchOrgFalseHospital,
} from '@/util/http';
import Bar from '@/components/small/Bar.vue';
import * as d3 from 'd3';
import BarLine from './BarLine.vue';

const RANGE = [0, 190];
export default {
  props: {
    title: String,
    id: String,
    data: Object,
  },

  components: {
    CircleProgress,
    Bar,
    BarLine,
  },

  data() {
    return {
      tabClass: ['', '', '', 'hide-cursor', 'chart-table'],
      tableHeader: [
        { key: 'qun_ti_jiu_yi', title: '群体就医' },
        { key: 'duo_di_kai_yao', title: '多地开药' },
        { key: 'shua_kong_ka', title: '刷空卡' },
        { key: 'shua_xiao_ka', title: '刷小卡' },
        { key: 'xu_jia_zhu_yuan', title: '虚假住院' },
      ],
      expanded: [],
      modelHeader: [
        // NOTE群体就医
        [
          { align: 'center', value: 'index', text: '序号' },
          { align: 'center', value: 'zu_nei_ren_shu', text: '组内人数' },
          { align: 'center', value: 'qun_ti_jiu_yi_ci_shu', text: '群体就医次数' },
          { align: 'center', value: 'chu_fang_shu_liang', text: '处方数量' },
          { align: 'center', value: 'chu_fang_bing_zhen_duan_shu', text: '处方病诊断数' },
          { align: 'center', value: 'chu_fang_yao_pin_zhong_lei_shu', text: '处方药品类数' },
          { align: 'center', value: 'yi_chang_lie_zhi_fei_yong', text: '报销费用' },
          { align: 'center', text: '', value: 'data-table-expand' },
          // { value: '', text: '处方相似度' },
          // { value: 'risk', text: '风险' },
        ],
        // NOTE多地开药
        [
          { align: 'center', value: 'index', text: '序号' },
          // 键值
          { align: 'center', value: 'key', text: '医师编号' },
          { align: 'center', value: 'yi_shi_xing_ming', text: '医师姓名' },
          { align: 'center', value: 'yi_chang_ji_gou', text: '异常机构' },
          { align: 'center', value: 'yi_chang_fei_yong', text: '异常费用（元）' },
          {
            align: 'center', value: 'jine', text: '多地开药次数', width: 200,
          },

        ],
        // NOTE刷空卡
        [
        ],
        // NOTE刷小卡
        [
          { align: 'center', value: 'index', text: '序号' },
          { align: 'center', value: 'key', text: '参保人编号' },
          { align: 'center', value: 'can_bao_ren_xing_ming', text: '参保人姓名' },
          { align: 'center', value: 'zong_ju_li', text: '总距离' },
          {
            align: 'center', value: 'jine', text: '刷卡总金额（元）', width: 200,
          },
        ],
        // NOTE虚假住院
        [
          { align: 'center', value: 'index', text: '序号' },
          { align: 'center', value: 'key', text: '编码' },
          { align: 'center', value: 'patient_name', text: '姓名' },
          { align: 'center', value: 'hospital_interval', text: '住院间隔' },
          {
            align: 'center', value: 'zhu_yuan_zong_fei_yong', text: '住院总费用（元）', zongjwidth: 100,
          },
          // 额外处理
          {
            align: 'center', value: 'zhu_yuan_ci_shu', text: '住院次数',
          },
          {
            align: 'center', value: 'yao_zhan_bi', text: '药占比', width: 120,
          },
        ],
      ],
      tabIndex: -1,
      datum: [],
      active: 0,

      // bar的比例尺
      scale: d3.scaleLinear(),

      // 虚假住院的三个比例尺
      scales: Array.from({ length: 3 }, () => d3.scaleLinear().range([0, 90])),
      activeIndex: 0,
      standard: [],

      // 虚假住院的六个指标
      falseKeys: [
        { text: '住院天数（天）', value: 'zhu_yuan_tian_shu' },
        { text: '总住院次数（次）', value: 'zhu_yuan_ci_shu' },
        { text: '药占比（百分比）', value: 'yao_zhan_bi' },
        { text: '检查比率（百分比）', value: 'jian_cha_bi_lv' },
        { text: '住院总列支费用（元）', value: 'zhu_yuan_zong_fei_yong:' },
        { text: '住院日均次费用（元）', value: 'zhu_yuan_ri_jun_ci_fei_yong' },
      ],
    };
  },

  watch: {
    tabIndex() {
      this.getData();
    },
    data: {
      deep: true,
      handler() {
        this.getData();
      },
    },
  },

  computed: {
    falseData() {
      // 虚假住院的数据
      return this.falseKeys.map((key) => +this.datum[this.activeIndex][key.value]);
    },
    widthScale() {
      const values = Object.values(this.datum);
      // 虚假住院的宽度比例尺
      return Array.from({ length: 6 }, (_, index) => d3.scaleLinear()
        // 求指标和value的最大值
        .domain([0, d3.max(values,
          (d) => (d[this.falseKeys[index].value] ? d[this.falseKeys[index].value] : 0))])
        .range([0, 100]));
    },
  },

  methods: {
    clickTab(index) {
      if (this.tabIndex === 4) {
        const el = document.querySelector('tbody tr');

        if (el) {
          el.classList.remove('v-data-table__selected');
        }
      }
      if (index === 2) {
        return;
      }
      this.tabIndex = index;
    },

    getData() {
      switch (this.tabIndex) {
        case 0:
          this.getOrgGroupHospital();
          break;
        case 1:
          this.getOrgMultiPlacePrescribe();
          break;
        case 3:
          this.getOrgSwipeLittleCard();
          break;
        case 4:
          this.getOrgFalseHosipital();
          break;
        default:
          console.log('tabIndex: ', this.tabIndex);
      }
    },

    async getOrgGroupHospital() {
      const data = await fetchOrgGroupHospital({
        hospitalId: this.id,
      });

      this.datum = Object.values(data).map((d, index) => ({ ...d, ...{ index: index + 1 } }));
    },

    async getOrgMultiPlacePrescribe() {
      const data = await fetchOrgMultiPlacePrescribe({
        hospitalId: this.id,
      });

      let maxValue = Number.MIN_VALUE;
      this.datum = Object.keys(data).map((key, index) => {
        maxValue = Math.max(maxValue, data[key].day);
        return {
          ...data[key],
          ...{
            index: index + 1, key, jine: '', yi_chang_fei_yong: Number(data[key].yi_chang_fei_yong).toFixed(2),
          },
        };
      });
      this.scale.range(RANGE).domain([0, maxValue]);
    },

    async getOrgSwipeLittleCard() {
      const data = await fetchOrgSwipeLittleCard({
        hospitalId: this.id,
      });

      let maxValue = Number.MIN_VALUE;
      this.datum = Object.keys(data).map((key, index) => {
        const item = data[key];
        maxValue = Math.max(maxValue, item.zong_jin_e);
        return {
          ...item,
          ...{
            index: index + 1,
            key,
            jine: Array.from({ length: item.zong_ci_shu },
              () => item.jun_ci_fei_yong),
          },
        };
      });
      this.scale.range(RANGE).domain([0, maxValue]);
    },

    async getOrgFalseHosipital() {
      const data = await fetchOrgFalseHospital({
        hospitalId: this.id,
      });

      // 获得住院次数、住院总费用、药占比的最大值
      const maxArr = [Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE];
      const keys = ['zhu_yuan_ci_shu', 'yao_zhan_bi', 'zhu_yuan_zong_fei_yong'];
      this.datum = Object.keys(data.xu_jia_zhu_yuan).map((key, index) => {
        keys.forEach((d, i) => {
          maxArr[i] = Math.max(maxArr[i], data.xu_jia_zhu_yuan[key][d]);
        });
        return {
          ...data.xu_jia_zhu_yuan[key],
          ...{ index: index + 1, key },
        };
      });

      this.scales = this.scales.map((scale, index) => scale.domain([0, maxArr[index]]));
      this.standard = this.falseKeys.map((key) => {
        if (data.standard) {
          return data.standard[key.value];
        }
        return 0;
      });

      setTimeout(() => {
        document.querySelector('tbody tr')
          .classList.add('v-data-table__selected');
      });
      // const e = document.querySelector('tbody tr');
      // .classList.add('v-data-table__selected');
    },

    rowClick(item, row) {
      if (this.tabIndex === 4) {
        document.querySelector('tbody tr')
          .classList.remove('v-data-table__selected');
        row.select(true);
        this.activeIndex = item.index - 1;
      }
    },
  },
};
</script>
<style lang="scss">
  .cmp {
    svg {
      height: 80%;
    }
  }
  .sheet-container {
    display: flex;
    background: transparent!important;
    margin-left: -1vw;
  }
  .card-divide {
    height: 55%;
  }
  .card-container-1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px;
    width: 15vw;

    h4 {
      text-align: center;
    }

    .s-card-table {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin: 10px 0;
      pointer-events: initial;
      overflow-x: hidden;
      overflow-y: auto;

      span {
        width: 5vw;
        text-align: center;
      }

      .header {
        display: flex;
        justify-content: space-between;
        // width: 100%;
        font-size: $f-small;
        margin-right: 4px;
      }

      ul {
        list-style: none;
        display: block;
        padding: 0;

        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
          color: #aeaeae;
          border-bottom: 1px solid #aeaeae;
          border-left: 2px solid #fff;
          transition: all ease-in-out 300ms;
          cursor: pointer;
          font-size: $f-small;

          &::after {
            // 小箭头
            display: inline-block;
            content: '';
            padding: 0;
            margin: 0;
            padding: 4px; /* Arrow size */
            box-shadow: 1px -1px 0 1px $she-primary inset;
            -webkit-box-shadow: 1px -1px $she-primary inset;
            border: solid transparent;
            border-width: 0 0 3px 3px;
            transform: rotate(225deg);
            opacity: 0;
          }
        }

        li.active {
          background: linear-gradient(to right, #cee6ff, #f5f7fb);
          border-left: 2px solid #87bcf4!important;
          color: $she-primary;

          &::after {
            opacity: 1;
          }
        }
      }
    }
  }

  .card-margin {
    margin: 0 5px;
    padding: 10px;
    overflow: auto;
    // max-height: 55*0.53vh;
    pointer-events: initial;
    position: relative;

    &::-webkit-scrollbar {
      width:  2px;
    }
    &::-webkit-scrollbar-track {
      background: #eee;
      border: 1px solid #ccc;
    }

    .v-data-table__wrapper {
      overflow-x: hidden;
    }
    th, td {
      padding: 0 5px!important;
    }

    .expand-content {
      width: 150px;
      height: 150px!important;

      svg {
        width: 50%;
      }
    }
  }

  .chart {
    position: absolute;
    right: 16px;
    width: 57%;
    height: calc(100% - 84px);
    display: flex;
    top: 84px;
    bottom: 0;
    padding: 0;
    flex-direction: column;
    background-color: transparent!important;

    .img-wrapper {
      img {
        object-fit: contain;
        width: 170px;
        float: right;
        margin: 10px 40px 0 0;
      }
    }

    .container {
      width: 100%;
    }

    .bar-wrapper {
      display: flex;

      span {
        font-size: 0.75rem;
        text-align: right;
        font-weight: bold;
        display: inline-block;
        flex: 1 0 50%;
      }

      svg {
        flex: 0 0 50%;
      }
    }
  }

  tr {
    cursor: pointer;
  }

  .hide-cursor tr{
    user-select: none;
  }
</style>
