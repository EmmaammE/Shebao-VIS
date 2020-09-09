<template>
    <v-card outlined class="content-card">
      <template v-if="data">
        <div class="s-header">
          <div>
            <component :is="avatar(data.ji_ben_qing_kuang.xing_bie)" />
            <p>{{data.ji_ben_qing_kuang.name}}</p>
          </div>
          <div class="left-box">
            <div class="left-header">
              <div v-for="d in header"
                :key="d.value"
              >
                <span class="number">{{headerData[d.value]}}</span>
                <span class="text">{{d.text}}</span>
              </div>
            </div>
            <div class="info-box">
              <span v-for="d in info"
                :key="d.value"
              >{{d.text}}:{{data.ji_ben_qing_kuang[d.value]}}</span>
            </div>
          </div>
        </div>

        <div :style="{height:'100%'}">
          <div class="c-header">
            <div class="btn-container border">
              <v-btn
                v-for="(d,index) in menu"
                :key="index"
                @click="changeMenu(index)"
                :class="menuIndex === index ? 'active':''"
                color="#fff"
                depressed
              >{{d.text}}</v-btn>
            </div>
            <div class="border">
              <v-select
                :items="people"
                item-text="text"
                item-value="value"
                :label="data.ji_ben_qing_kuang.name || data.ji_ben_qing_kuang.xing_ming"
                solo
                flat
                hide-details
                @change="changeKey"
              ></v-select>
            </div>
          </div>

          <!-- 下方的内容 -->
          <div class="down-content">
            <div class="down-header">
              <p>{{menu[menuIndex].text}}</p>
            </div>

            <template v-if="dataHasValue[0].length === 0">
              暂无数据
            </template>

            <template v-else>
              <div class="radio-group">
              <!-- 有值的label -->
              <div
                v-for="(d,index) in dataHasValue[0]"
                :key="index"
                class="radio"
              >
                <input type="radio" class="radio-btn" :name="d.text"/>
                <label class="label">
                  <span :style="{background: colorScale(index)}"></span>
                  {{d.text}}</label>
              </div>
              <!-- 没值的label -->
              <div
                v-for="(d,index) in Object.values(dataHandle[0])
                  .filter((d) => d.value === null || d.value === 0)"
                :key="index+'n'"
                class="radio"
              >
                <input type="radio" class="radio-btn" :name="d.text"/>
                <label class="label">
                  <span :style="{background: '#eee'}"></span>
                  {{d.text}}</label>
              </div>
            </div>

            <!-- 图 -->
            <div :class="[dataHandle.length > 1?'small':'', 'pie-wrapper'].join(' ')">

              <template v-for="(d,i) in dataHasValue" >
                <pie-chart
                  :key="i"
                  :colorScale="colorScale"
                  :data="d"
                  :type="type"
                  :activePie="activePie"
                  @hoverPie="hoverPie"
                  :title="dataHandle.length>1?title[i]:''"
                  :unit="i===1?'次':'元'"
                />
              </template>
            </div>
            </template>

          </div>
        </div>

      </template>
    </v-card>
</template>

<script>
import GirlIcon from '@/assets/search/icon_3.svg';
import BoyIcon from '@/assets/search/icon_4.svg';
import TimePicker from '@/components/small/TimePicker.vue';
import * as d3 from 'd3';
import PieChart from './PieChart.vue';
// 医疗费用
const YiLiaoFeiYong = {
  gui_ding_bing_zhong_qing_kuang: {
    text: '规定病种',
    subItem: ['lei_ji_lie_zhi_fei_yong', 'lei_ji_jiu_zhen_ci_shu'],
  },
  jia_ting_bing_chuang_qing_kuang: {
    text: '家庭病床',
    subItem: ['lie_ji_lie_zhi_fei_yong', 'lei_ji_ci_shu'],
  },
  men_zhen_qing_kuang: {
    text: '门诊',
    subItem: ['lei_ji_lie_zhi_fei_yong', 'lei_ji_men_zhen_ci_shu'],
    children: [
      {
        text: '零售药店',
        subItem: ['ling_shou_yao_dian_lei_ji_lie_zhi_fei_yong',
          'ling_shou_yao_dian_lei_ji_men_zhen_ci_shu'],
      },
      {
        text: '医疗机构',
        subItem: [
          'yi_liao_ji_gou_lei_ji_lie_zhi_fei_yong',
          'yi_liao_ji_gou_lei_ji_men_zhen_ci_shu',
        ],
      },
    ],
  },
  qi_ta: {
    text: '其他',
    subItem: [
      'lei_ji_lie_zhi_fei_yong', 'lie_ji_ci_shu',
    ],
  },
  zhu_yuan_qing_kuang: {
    text: '住院',
    subItem: [
      'lei_ji_lie_zhi_fei_yong', 'lei_ji_zhu_yuan_ci_shu',
    ],
  },
};

const FEI_YONG = {
  fei_yong_gou_cheng_qing_kuang: {
    cai_liao_fei: '材料费',
    qi_ta: '其他',
    yao_pin_fei: {
      xi_yao_fei: '西药费',
      zhong_cao_yao_fei: '中草药费',
      zhong_cheng_yao_fei: '中成药费',
    },
    zhen_liao_xiang_mu: {
      hua_yan_fei: '化验费',
      jian_cha_fei: '检查费',
      shou_shu_fei: '手术费',
      wu_li_zhi_liao_fei: '物理治疗费',
      zhong_yi_zhi_liao_fei: '中医治疗费',
    },
  },
  yi_liao_fei_yong: YiLiaoFeiYong,
  ji_jin_lie_zhi_qing_kuang: {
    da_bing_bao_xian: '大病保险',
    ge_ren_zhuang_hu_shi_yong_qing_kuang: {
      dang_nian_zhang_hu: '当年账户',
      li_nian_zhang_hu: '历年账户',
    },
    jiu_zhu_ji_jin: '救助基金',
    tong_chou_zhi_fu: '统筹支付',
    xian_jin_zhi_fu: '现金支付',
    xian_jin_zhi_fu_zhan_bi: '现金支付占比',
  },

  yi_bao_fen_lei_fu_wu_qing_kuang: {
    gui_ding_bing_zhong: {
      zong_lie_zhi_fei_yong: '规定病种',
    },
    jia_ting_bing_chuang: {
      zong_lie_zhi_fei_yong: '家庭病床',
    },
    men_zhen: {
      zong_lie_zhi_fei_yong: '门诊',
    },
    qi_ta: {
      zong_lie_zhi_fei_yong: '其他',
    },
    zhu_yuan: {
      zong_lie_zhi_fei_yong: '住院',
    },
  },

};

export default {
  props: {
    data: Object,
    // 上方的一排数字
    header: Array,
    menu: Array,
    info: Array,
    people: Array,
    compType: Number,
  },

  components: {
    TimePicker,
    PieChart,
  },
  data() {
    return {
      menuIndex: 0,

      dateStart: new Date('2020-01-01').toISOString().substr(0, 10),
      dateEnd: new Date().toISOString().substr(0, 10),
      menu1: false,
      menu2: false,

      // 被选中的Pie
      activePie: 0,

      title: ['累计列支费用', '累计列支次数'],

    };
  },

  computed: {

    colorScale() {
      if (this.type === 1) {
        return d3.scaleLinear()
          .range(['#5d77ff', '#889aff', '#a7b5ff', '#c8d0ff', '#d1d7f9'])
          .domain(d3.ticks(0, this.dataHasValue[0].length + 2, 5));
      }
      return d3.scaleLinear()
        .range(['#5d77ff', '#889aff', '#a7b5ff', '#c8d0ff', '#d1d7f9'])
        .domain(d3.ticks(0, this.dataHasValue[0].length, 5));
    },

    dataHandle() {
      const dKey = this.menu[this.menuIndex].value;
      const data = this.data[dKey];
      const hash = FEI_YONG[dKey];

      if (dKey === 'yi_liao_fei_yong') {
        // 列支费用和列支次数
        const tmp = [{}, {}];
        Object.keys(hash).forEach((key) => {
          for (let i = 0; i < 2; i += 1) {
            tmp[i][key] = {
              text: hash[key].text,
              value: data[key][hash[key].subItem[i]],
            };
          }

          if (hash[key].children) {
            tmp[0][key].child = [];
            tmp[1][key].child = [];

            // 有子项目
            hash[key].children.forEach((child) => {
              for (let i = 0; i < 2; i += 1) {
                tmp[i][key].child.push({
                  text: child.text,
                  value: data[key][child.subItem[i]],
                });
              }
            });
          }
        });

        return tmp;
      }

      const tmp = {};
      Object.keys(hash).forEach((key) => {
        if (typeof hash[key] === 'string') {
          // 有的是返回的一个{}对象，包含值和比率， 有的是返回的一个值
          if (typeof data[key] === 'object') {
            tmp[key] = { text: hash[key], value: data[key].value };
          } else {
            tmp[key] = { text: hash[key], value: data[key] };
          }
        } else {
          Object.keys(hash[key]).forEach((inner) => {
            if (inner === 'zong_lie_zhi_fei_yong') {
              // 药师医师汇总的医保服务
              tmp[key] = {
                text: hash[key][inner],
                value: data[key][inner],
              };
            } else {
              tmp[inner] = {
                text: hash[key][inner],
                value: data[key][inner].value,
              };
            }
          });
        }
      });

      return [tmp];
    },

    dataHasValue() {
      // 返回确实有值的数据
      return this.dataHandle
        .map((data) => Object.values(data)
          .filter((d) => d.value && d.value > 0));
    },

    type() {
      if (this.menu[this.menuIndex].value === 'yi_liao_fei_yong') {
        return 1;
      }
      return 0;
    },

    headerData() {
      // 和header匹配的信息， 每个页面不一样
      switch (this.compType) {
        case 1:
          // 药师医师汇总
          return this.data.yi_bao_fu_wu_zong_ti_qing_kuang;
        case 2:
          return this.data.yi_liao_fei_yong;
        default:
          // 3
          return {};
      }
    },
  },

  methods: {
    avatar(d) {
      return d === '女' ? GirlIcon : BoyIcon;
    },

    changeMenu(index) {
      this.menuIndex = index;
    },

    hoverPie(index) {
      this.activePie = index;
    },

    changeKey(e) {
      this.$emit('changeKey', e);
    },

  },
};
</script>

<style scoped lang="scss">
  .content-card {
    display: flex;
    flex-direction: column;
    padding: 30px 15px;
    height:90vh;

    .s-header {
      display: flex;
      align-items: center;
      width: 100%;

      .left-header {
        display: flex;
        justify-content: space-between;
      }

      p {
        margin: 0;
        text-align: center;
      }

      svg {
        margin: 0 auto ;
      }

      .left-box {
        margin: 0 30px;
      }

      .number {
        font-family:Avenir-Heavy;
        font-size:22px;
        color:$she-c;
        letter-spacing:0;
        text-align:left;
      }

      .text {
        opacity:0.6;
        font-family:PingFangSC-Regular;
        font-size:12px;
        color:$she-c;
        letter-spacing:0;
        text-align:left;
        margin: 0 2px;
      }

      .info-box {
        display: flex;
        flex-wrap: wrap;
        // width: 50%;
        font-family:PingFangSC-Regular;
        font-size: $f-small;
        color:#5c5b5b;
        margin: 7px 0;

        span {
          flex: 1 0 55%;
        }
      }
    }

    .c-header {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;

      .border {
        box-shadow: 0px 2px 3px darken($black, 5%), 2px 4px 6px darken($black, 2%);

        &:nth-child(2) {
          flex: 0 0 20%;
        }

        .v-input {
          color: $she-c!important;
        }
      }
      .btn-container {
        display: flex;
        align-items: center;

        .v-btn {
          color: $she-c;
          font-family:PingFangSC-Semibold;
          font-size: 0.85rem;
          letter-spacing:0;
        }

        .v-btn.active {
          background: $she-c!important;
          color: #fff;
        }
      }
    }

    .down-content {
      // height: 100%;
      // max-height: 49vh;

      .down-header {
        display: flex;
        justify-content: space-between;

        p {
          font-family:PingFangSC-Semibold;
          color:#282d32;
          font-size: 1rem;
          line-height:19.2px;
        }
      }

      .pie-wrapper {
        display: grid;
        grid-template-rows: 100%;
        align-items: center;
        justify-items: center;
        height: 50vh;

        &.small {
          grid-template-rows: 50% 50%;

          .pie-container {
            svg {
              width:  50%;
            }
          }
        }
      }
    }
  }
</style>
