<template>
    <v-card outlined class="content-card">
      <template v-if="data">
        <div class="s-header">
          <div>
            <component :is="avatar(data.ji_ben_qing_kuang.xing_bie)" />
            <p>{{data.ji_ben_qing_kuang.name}}</p>
          </div>
          <div class="left-box">
            <!-- <div>
              <span class="number">{{amount}}</span>
              <span class="text">总费用</span>
            </div> -->
            <div class="info-box">
              <span v-for="d in info"
                :key="d.value"
              >{{d.text}}:{{data.ji_ben_qing_kuang[d.value]}}</span>
            </div>
          </div>
        </div>

        <div>
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
                :label="data.ji_ben_qing_kuang.name"
                solo
                flat
                hide-details
              ></v-select>
            </div>
          </div>

          <!-- 下方的内容 -->
          <div class="down-content">
            <div class="down-header">
              <p>费用构成及占比</p>

              <time-picker
                :dateEnd="dateEnd"
                :dateStart="dateStart"
                :menu1="menu1"
                :menu2="menu2"
              />
            </div>

            <div class="radio-group">
              <div
                v-for="(d,index) in Object.values(dataHandle).filter((d) => d.value !== null)"
                :key="index"
                class="radio"
              >
                <input type="radio" class="radio-btn" :name="d.text"/>
                <label class="label">
                  <span :style="{background: colorScale(index)}"></span>
                  {{d.text}}</label>
              </div>
              <div
                v-for="(d,index) in Object.values(dataHandle).filter((d) => d.value === null)"
                :key="index"
                class="radio"
              >
                <input type="radio" class="radio-btn" :name="d.text"/>
                <label class="label">
                  <span :style="{background: '#eee'}"></span>
                  {{d.text}}</label>
              </div>
            </div>

            <!-- 图 -->
            <svg viewBox="-375 -250 750 500">
              <defs>
                <marker id="circle" markerWidth="4" markerHeight="4" refX="2" refY="2">
                  <circle cx="2" cy="2" r="2" fill="#707176"></circle>
                </marker>
              </defs>

              <g
                v-for="(d,index) in dataReady"
                :key="index"
                :class="d.cx < d.ox?'':'svg-end'"
              >
                <path
                  :d="arc(d)"
                  :fill="colorScale(index)"
                ></path>
                <g class="tip">
                  <path
                    marker-end="url(#circle)"
                    :d="textPath(d)"
                    class="line"
                  />
                  <text
                    :x="d.x"
                    :y="d.y -10"
                  >
                     {{d.value.toLocaleString()}}
                  </text>
                </g>
              </g>

            </svg>
          </div>
        </div>
      </template>
    </v-card>
</template>

<script>
import GirlIcon from '@/assets/search/icon_3.svg';
import BoyIcon from '@/assets/search/icon_4.svg';
import TimePicker from '@/components/small/TimePicker.vue';
import Sunburst from '@/components/Sunburst.vue';
import * as d3 from 'd3';

const sunburstSetting = {
  width: 500,
};
sunburstSetting.radius = sunburstSetting.width / 7;
const partition = (data) => {
  const root = d3.hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  return d3.partition()
    .size([2 * Math.PI, root.height + 1])(root);
};

const FEI_YONG = {
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

};
export default {
  props: {
    data: Object,
    // 上方的一排数字
    header: Array,
    menu: Array,
    info: Array,
    people: Array,
  },

  components: {
    TimePicker,
    Sunburst,
  },
  data() {
    return {
      menuIndex: 1,

      dateStart: new Date('2019-01-01').toISOString().substr(0, 10),
      dateEnd: new Date().toISOString().substr(0, 10),
      menu1: false,
      menu2: false,

      sunburstSetting,
    };
  },

  computed: {
    // data2() {
    //   const data = this.data[this.menu[this.menuIndex].value];
    //   const sundata = {};
    //   Object.keys(data).forEach((key) => {
    //     if (typeof data[key] === 'number') {
    //       sundata.name = key;
    //       sundata.value = data[key];
    //     } else {
    //       sundata.name = key;
    //       sundata.children = Object.keys(data[key]).map((ikey) => ({
    //         name: ikey,
    //         value: data[key][ikey],
    //       }));
    //     }
    //   });
    //   // eslint-disable-next-line
    //   return partition(sundata).each((d) => d.current = d);
    // },

    colorScale() {
      return d3.scaleLinear()
        .range(['#5d77ff', '#889aff', '#a7b5ff', '#c8d0ff', '#d1d7f9'])
        .domain(d3.ticks(0,
          Object.values(this.dataHandle).filter((d) => d.value !== null).length, 5));
    },

    dataReady() {
      const radius = 170;
      // 处理后的piechart数据
      return d3.pie()
        .padAngle(0.005)
        .sort(null)
        .value((d) => d.value)(Object.values(this.dataHandle).filter((d) => d.value !== null))
        .map((d) => {
          const tmp = { ...d };

          const a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
          tmp.cx = Math.cos(a) * (radius - 85);
          tmp.x = Math.cos(a) * (radius + 5);

          tmp.cy = Math.sin(a) * (radius - 85);
          tmp.y = Math.sin(a) * (radius + 5);

          // var bbox = this.getBBox();
          // TODO 为了方便暂时假设文字宽度为40
          const bbox = { width: 10 };
          tmp.sx = tmp.x - bbox.width / 2 - 2;
          tmp.ox = tmp.x + bbox.width / 2 + 2;
          tmp.oy = tmp.y + 5;
          tmp.sy = tmp.oy;

          // console.log(tmp);
          return tmp;
        });
    },

    arc() {
      return d3.arc().innerRadius(0)
        .outerRadius(125)
        .cornerRadius(2);
    },

    dataHandle() {
      const data = this.data[this.menu[this.menuIndex].value];
      const tmp = {};
      Object.keys(FEI_YONG).forEach((key) => {
        if (typeof FEI_YONG[key] === 'string') {
          tmp[key] = { text: FEI_YONG[key], value: data[key].value };
        } else {
          Object.keys(FEI_YONG[key]).forEach((inner) => {
            tmp[inner] = { text: FEI_YONG[key][inner], value: data[key][inner].value };
          });
        }
      });

      return tmp;
    },

    amount() {
      return Object.values(this.dataHandle).filter((d) => d.value !== null)
        .reduce((a, b) => a.value + (b.value), 0);
    },
  },

  methods: {
    avatar(d) {
      return d === '女' ? GirlIcon : BoyIcon;
    },

    changeMenu(index) {
      this.menuIndex = index;
    },

    // 求文字路径
    textPath(d) {
      if (d.cx > d.ox) {
        return `M${d.sx},${d.sy}L${d.ox},${d.oy} ${d.cx},${d.cy}`;
      }
      return `M${d.ox},${d.oy}L${d.sx},${d.sy} ${d.cx},${d.cy}`;
    },
  },
};
</script>

<style scoped lang="scss">
  .content-card {
    .line {
      fill: none;
      stroke: #707176;
    }

    display: flex;
    flex-direction: column;
    padding: 30px 15px;

    .s-header {
      display: flex;
      align-items: center;

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
          flex: 1 0 35%;
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
        }

        .v-btn.active {
          background: $she-c!important;
          color: #fff;
        }
      }
    }

    .down-content {
      .down-header {
        display: flex;
        justify-content: space-between;

        p {
          font-family:PingFangSC-Semibold;
          color:#282d32;
          font-size: 20px;
          line-height:19.2px;
        }
      }

      .radio-group {
        display: flex;
        flex-wrap: wrap;
        $accent-color:#5d77ff;
        $primary-color: #fff;

        .radio {
          flex: 0 0 33%;
        }

        .radio-btn {
            position: absolute;
            opacity: 0;
            visibility: hidden;
        }

        .label {
            display: flex;
            align-items: center;
            padding: 0.15rem 0;
            font-size: $f-small;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.25s linear;
        }

        .label span {
            display: inline-block;
            content: "";
            height: 1.125rem;
            width: 1.125rem;
            margin-right: 0.625rem;
            border: 0.25rem solid $primary-color;
            border-radius: 50%;
            transition: all 0.25s linear;
            background: $accent-color;
            box-shadow: 0 0 5px 3px lighten($color: #d7ddff, $amount: 0.7);
        }
      }
    }
  }
</style>
