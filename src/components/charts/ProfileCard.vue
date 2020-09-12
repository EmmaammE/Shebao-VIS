<template>
   <div class="box">
      <p class="profile-title">{{title}}</p>

      <v-card class="wrapper">
        <!-- 只有数值的数据 -->
        <div class="num-container" v-if="tabs.length>1">
          <div v-for="(d,index) in tabs"
            class="tab"
            :key="index"
            color="#fff"
          >
            <div>{{d.text}}</div>

            <div>
              <div>
                2019:
                {{index===0||index===3
                ? Number(datum[HASH[d.text]]['2019']).toFixed(2)
                : Number(datum[HASH[d.text]]['2019'])}}
                {{d.unit}}
              </div>
              <div>
                2020:
                {{index===0||index===3
                ? Number(datum[HASH[d.text]]['2020']).toFixed(2)
                : Number(datum[HASH[d.text]]['2020'])}}
                {{d.unit}}
                <!-- <span>{{d.unit}}</span> -->
              </div>
            </div>
          </div>
        </div>
        <!-- 个人现金支付 -->
        <div class="num-container" v-else-if="tabs.length === 1">
          <div class="tab a-line">
            <div>{{tabs[0].text}}</div>
            <div>
              <div>
                2019:
                {{Number(datum.ge_ren_xian_jin_zhi_fu.xian_jin_zhi_fu_zong_e['2019']).toFixed(2)}}
                {{tabs[0].unit}}
              </div>
              <div>
                2020:
                {{Number(datum.ge_ren_xian_jin_zhi_fu.xian_jin_zhi_fu_zong_e['2020']).toFixed(2)}}
                {{tabs[0].unit}}
                <!-- <span>{{d.unit}}</span> -->
              </div>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-box">
            <div>
              <v-btn v-for="(d,index) in menu"
                :key="index"
                :class="activeIndex===index?'active':''"
                @click="changeIndex(index)"
                color="#fff"
              >{{d}}</v-btn>
            </div>

            <div class="chart-header">
              <div class="legends-wrapper">
                <div class="legends" v-if="curDatum">
                  <div
                    v-for="(label ,i) in Object.keys(curDatum)"
                    :key="label"
                  >
                    <span :style="{background: colorScale(i)}"/>
                    {{HASH[label]}}
                  </div>
                </div>

                <div class="legends">
                  <div>
                    <svg width="14" height="14" viewBox="-5 -5 10 10">
                      <defs>
                        <pattern id="line" width="3" height="3"
                          patternTransform="rotate(-45)" patternUnits="userSpaceOnUse">
                          <rect x="0" y="0" width="10" height="10" fill="#5d77ff" opacity="0.9"/>
                          <line x1="0" y1="0" x2="0" y2="3" stroke="#3454fe"/>
                        </pattern>
                      </defs>
                      <circle r="5" fill="url(#line)" />
                    </svg>

                    2019年数据

                  </div>
                </div>
              </div>

              <div class="tick-text">
                单位：元
              </div>

            </div>

            <!-- svg -->
            <div class="chart-wrapper">
              <svg viewBox="-325 -250 650 500">
                <defs>
                  <marker id="circle" markerWidth="4" markerHeight="4" refX="2" refY="2">
                    <circle cx="2" cy="2" r="2" fill="#707176"></circle>
                  </marker>

                  <!-- 斜线 -->
                  <pattern id="line3" width="5" height="5"
                    patternTransform="rotate(-30)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="5" stroke="#3454fe"/>
                  </pattern>

                  <!-- 阴影 -->
                  <filter id="dropshadow" height="130%" width="130%">
                    <!-- stdDeviation is how much to blur -->
                    <feGaussianBlur in="SourceAlpha" stdDeviation="5"/>
                    <feOffset dx="0" dy="2" result="offsetblur"/>
                    <feComponentTransfer>
                      <!-- slope is the opacity of the shadow -->
                      <feFuncA type="linear" slope="0.5"/>
                    </feComponentTransfer>
                    <feMerge>
                      <!-- this contains the offset blurred image -->
                      <feMergeNode/>
                      <!-- this contains the element that the filter is applied to -->
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                <!-- 2019年数据 -->

                <path
                  v-for="(d,index) in dataBack"
                  :key="'19'+index"
                  :d="arc2019(d)"
                  :fill="colorScale(index)"
                  :class="index !== activePie?'active':''"
                  @mousemove="hoverPie(index)"
                ></path>
                <path
                  v-for="(d,index) in dataBack"
                  :key="index+'19'"
                  :d="arc2019(d)"
                  fill="url(#line3)"
                  :class="index !== activePie?'active':''"
                ></path>

                <g
                  v-for="(d,index) in dataReady"
                  :key="index"
                  :class="[d.cx < d.ox?'':'svg-end', activePie===index?'active':'']"
                >
                  <path
                    :d="arc(d)"
                    :fill="colorScale(index)"
                    @mousemove="hoverPie(index)"
                  ></path>
                  <g class="tip" v-if="d.value > 0 || d.data['2019'] > 0"
                    v-show="d.ratio[0] > 7 || d.ratio[1] > 7 || activePie === index"
                  >
                    <path
                      marker-end="url(#circle)"
                      :d="textPath(d)"
                      class="line"
                    />
                    <text
                      :x="d.x"
                      :y="d.y -10"
                    >
                      2020: {{d.value.toLocaleString()}}
                      {{  d.ratio[0]}}%
                    </text>

                    <text
                      :x="d.x"
                      :y="d.y"
                    >
                      2019: {{d.data['2019'].toLocaleString()}}
                      {{  d.ratio[1]}}%
                    </text>
                  </g>
                </g>

              </svg>
            </div>

          </div>

          <div class="panel-box">
            <div class="header-btn">
              <v-btn class="active">{{header}}</v-btn>
            </div>
            <div class="legends">

              <div>
                <svg width="14" height="14" viewBox="-5 -5 10 10">
                  <defs>
                    <pattern id="line" width="3" height="3"
                      patternTransform="rotate(-45)" patternUnits="userSpaceOnUse">
                      <rect x="0" y="0" width="10" height="10" fill="#5d77ff"></rect>
                      <line x1="0" y1="0" x2="0" y2="3" stroke="#3454fe"/>
                    </pattern>
                  </defs>
                  <circle r="5" fill="url(#line)" />
                </svg>
                2019年数据
              </div>

              <div>
                <span :style="{background:'#5d77ff'}"></span>
                  2020年数据
                </div>
            </div>

            <!-- barchart -->
            <svg :viewBox="`0 0 ${width} ${height}`" class="barchart">
              <defs>
                <pattern id="line2" width="8" height="8"
                  patternTransform="rotate(-45)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#3454fe"/>
                </pattern>
              </defs>
              <g class="barchart-axis"
                :transform='`translate(${margin.left}, ${margin.top})`'
              >
                <g v-axis:x="{scale:xScale, tickFormat: d => HASH[d]}"
                  :transform='`translate(0, ${chartHeight})`'
                  class="xaxis"
                />

                <g v-axis:y="{scale: yScale }"
                  class="yaxis"
                />

                <g v-axis:y="{
                  scale: yScale,
                  inner: -chartWidth,
                  tickFormat: ''}"
                  class="gridline"
                />
              </g>

              <g :transform='`translate(${margin.left}, ${margin.top})`'>
                <g v-for="(entry,index) in Object.entries(curDatum)"
                  :key="entry[0]"
                >
                  <rect
                    :x="xScaleDomain('2019')+ xScale(entry[0])"
                    :y="yScale(entry[1]['2019'])"
                    :width="xScaleDomain.bandwidth()"
                    :height="chartHeight - yScale(entry[1]['2019'])"
                    :fill="colorScale(index)"
                  />
                  <rect
                    :x="xScaleDomain('2019')+ xScale(entry[0])"
                    :y="yScale(entry[1]['2019'])"
                    :width="xScaleDomain.bandwidth()"
                    :height="chartHeight - yScale(entry[1]['2019'])"
                    fill="url(#line2)"
                  />
                  <rect
                    :x="xScaleDomain('2020')+ xScale(entry[0])"
                    :y="yScale(entry[1]['2020'])"
                    :width="xScaleDomain.bandwidth()"
                    :height="chartHeight - yScale(entry[1]['2020'])"
                    :fill="colorScale(index)"
                  />
                </g>
              </g>
            </svg>

            <Tooltip v-bind="tipPos">
              <div class="s-tip" v-show="isShowing">
                <div class="inner">
                  <!-- <p v-if="tipData['2019']">2019：{{tipData['2019']}}{{unit}}</p>
                  <p v-if="tipData['2020']">2020：{{tipData['2020']}}{{unit}}</p> -->
                </div>
              </div>
            </Tooltip>
          </div>
        </div>
      </v-card>
    </div>
</template>

<script>
import * as d3 from 'd3';
import { axisDirective } from '@/directives/axis';

const HASH = {
  // 只有数值的几个的映射
  人均列支费用: 'ren_jun_lie_zhi_fei_yong',
  就诊人次: 'jiu_zhen_ren_ci',
  就诊人数: 'jiu_zhen_ren_shu',
  人头人次比: 'ren_tou_ren_ci_bi',

  列支费用: 'lie_zhi_fei_yong',
  列支费用分布: 'lie_zhi_fei_yong_fen_bu',
  报销支出费用: 'bao_xiao_zhi_chu_fei_yong',
  药品费用分布: 'yao_pin_fei_yong_fen_bu',
  个人现金支付费用: 'ge_ren_xian_jin_zhi_fu_fei_yong',

  gui_ding_bing_zhong: '规定病种',
  jia_ting_bing_chuang: '家庭病床',
  men_zhen: '门诊',
  zhu_yuan: '住院',

  // 费用结构分析
  cai_liao: '材料费',
  hua_yan: '化验费',
  jian_cha: '检查费',
  qi_ta: '其他',
  shou_shu: '手术费',
  wu_li_zhi_liao: '物理治疗',
  yao_pin: '药品',
  zhong_yi_zhi_liao: '中医治疗',
  yao_pin_fei_yong_fen_bu: '药品费用分布',

  zhong_cheng_yao: '中成药',
  xi_yao: '西药',
  zhong_cao_yao: '中草药',

  // 总医药费用
  // bao_xiao_zhi_chu_fei_yong:
  ben_nian_zhang_hu: '本年账户',
  da_bing_bao_xian: '大病保险',
  jiu_zhu_ji_jin: '救助基金',
  li_nian_zhang_hu: '历年账户',
  tong_chou_zhang_hu: '统筹账户',
  ge_ren_xian_jin_zhi_fu: '个人现金支付',
  xian_jin_zhi_fu_zong_e: '现金支付总额',
};

export default {
  props: {
    title: String,
    menu: Array,
    radioLabels: Array,
    header: String,
    datum: Object,
    tabs: Array,
  },

  data() {
    return {
      activeIndex: 0,
      activePie: 0,
      HASH,

      // barchart基本设置
      margin: {
        top: 20,
        right: 10,
        bottom: 20,
        left: 70,
      },
      width: 600,
      height: 400,
    };
  },

  computed: {
    curDatum() {
      return this.datum[HASH[this.menu[this.activeIndex]]] || {};
    },
    colorScale() {
      return d3.scaleLinear()
        .range(['#5d77ff', '#889aff', '#a7b5ff', '#c8d0ff', '#d1d7f9'])
        .domain(d3.ticks(0, this.radioLabels.length, 5));
    },

    dataReady() {
      const radius = 170;
      let sum2019 = 0;
      let sum2020 = 0;
      Object.values(this.curDatum).forEach((d) => {
        sum2019 += (+d['2019']);
        sum2020 += (+d['2020']);
      });
      // 处理后的piechart数据
      return d3.pie()
        .padAngle(0.005)
        .sort(null)
        .value((d) => d['2020'])(Object.values(this.curDatum))
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

          tmp.ratio = [
            Number(100 * (+tmp.data['2020'] / sum2020)).toFixed(2),
            Number(100 * (+tmp.data['2019'] / sum2019)).toFixed(2),
          ];
          return tmp;
        });
    },

    dataBack() {
      return d3.pie()
        // .padAngle(-1)
        .sort(null)
        .value((d) => d['2019'])(Object.values(this.curDatum));
    },

    arc() {
      return d3.arc().innerRadius(0)
        .outerRadius(125)
        .cornerRadius(2);
    },

    arc2019() {
      return d3.arc().innerRadius(135)
        .outerRadius(150);
      // .cornerRadius(5);
    },

    chartWidth() {
      return this.width - this.margin.left - this.margin.right;
    },
    chartHeight() {
      return this.height - this.margin.top - this.margin.bottom;
    },
    xScale() {
      return d3.scaleBand()
        .domain(Object.keys(this.curDatum))
        .rangeRound([0, this.chartWidth])
        .padding(0.25);
    },
    xScaleDomain() {
      // 类型的比例尺

      return d3.scaleBand().domain(['2019', '2020']).rangeRound([0, this.xScale.bandwidth()])
        .padding(0.15);
    },
    yScale() {
      return d3.scaleLinear()
        .domain([0, d3.max(Object.values(this.curDatum), (d) => Math.max(d['2019'], d['2020']))]).nice()
        .range([this.chartHeight, 0]);
    },

  },

  directives: {
    axis: axisDirective,
  },

  methods: {
    changeIndex(index) {
      this.activeIndex = index;
    },

    hoverPie(index) {
      // hover2020的数据，显示2019圆弧
      this.activePie = index;
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

<style lang="scss">
  .wrapper {
    .num-container {
      display: flex;
      width: 100%;
      justify-content: space-around;
      background: #fff;
      padding: 0 50px;

      .tab {
        flex: 1 0 25%;
        margin: 10px;
        box-shadow: 0 0 8px 3px rgba(172, 170, 170, 0.3);
        padding: 10px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }

      .a-line {
        margin: 10px -30px;
      }
    }

  }
  .panel {
    display: grid;
    grid-template-columns: 50% 50%;
    padding: 20px;

    .panel-box {
      display: flex;
      flex-direction: column;

      .v-btn {
        margin: 0 5px;

        &.active {
          background: $she-c!important;
          color: #fff;
        }
      }

      .header-btn {
        pointer-events: none;
      }

      .chart-header {
        display: flex;
        justify-content: space-between;
        padding-right: 20px;

        .tick-text {
          line-height: 40px;
          text-align: right;
          flex: 0 0 30%;
        }
      }
      .legends {
        display: flex;
        font-size: 0.8rem;
        flex-wrap: wrap;

        div {
          display: flex;
          align-items: center;
          margin: 10px;
          line-height: 10px;
        }

        svg {
          margin-right: 8px;
        }
        span {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 8px;

        }
      }
    }

    // piechart
    .chart-wrapper {
      padding: 0 10% 0 0;
      margin: -10%;

      path {
        cursor: pointer;
        transition: fill ease-in-out 300ms;
        stroke-linejoin: round;
      }

      text {
        font-size: 10px;
      }

      .svg-end {
        text-anchor: end;
      }

      path.active {
        fill: #e9edf0!important;
      }

      .line {
        fill: none;
        stroke: #707176;
      }

      g.tip path{
        opacity: .5;
      }

      g.active {
        path {
          filter: url(#dropshadow);
        }

        .tip path{
          opacity: 1;
        }
      }
    }

    .barchart {
      .yaxis,.xaxis {
        line,
        path {
          display: none;
        }
      }

      .gridline {
        line {
          stroke: #c3c3c3;
        }
        path {
          display: none;
        }
      }
    }
  }
</style>
