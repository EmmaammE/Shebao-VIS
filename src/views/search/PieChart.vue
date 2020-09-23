<template>
  <div class="pie-container">
    <p>单位：{{unit}}</p>
    <p class="pie-title" v-if="title">{{title}}</p>
    <svg viewBox="-320 -200 640 400">
      <defs>
        <marker id="circle" markerWidth="4" markerHeight="4" refX="2" refY="2">
          <circle cx="2" cy="2" r="2" fill="#707176"></circle>
        </marker>

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

      <g
        v-for="(d,index) in dataReady"
        :key="index"
      >
        <g v-if="d.child">
          <g v-for="(cd,j) in d.child" :key="j+'c'">
            <template v-if="cd.value > 0">
              <!-- NOTE 因为这里我知道只有一个分类有child, 所以直接用数据长度+child的index作为index的标记了 -->
              <path
                :d="arcOut(cd)"
                :fill="colorScale(dataReady.length + j)"
                :class="dataReady.length+j === activePie?'active':''"
                @mousemove="hoverPie(dataReady.length+j)"
              ></path>
            </template>
          </g>
        </g>

        <path
          :d="arc(d)"
          :fill="colorScale(index)"
          :class="index === activePie && type === 1?'active':''"
          @mousemove="hoverPie(index)"
        ></path>
      </g>

      <!-- 绘制tooltip -->
      <g
        v-for="(d,index) in dataReady"
        :key="index+'t'"
        :class="d.cx < d.ox?'':'svg-end'"
      >
        <g v-if="d.child">
          <g v-for="(cd,j) in d.child" :key="j+'c'">
            <template v-if="cd.ratio > 1 || dataReady.length + j === activePie">
              <g class="tip">
                <path
                  marker-end="url(#circle)"
                  :d="textPath(cd)"
                  class="line"
                />
                <text :font-size="12 * (type + 1)"
                  :class="cd.cx > cd.ox ? 'she-left':'she-right'"
                >
                <!-- 名称 -->
                  <tspan
                    :x="cd.x"
                    :y="cd.y+10"
                  >{{cd.text}}</tspan>
                <!-- 值 -->
                  <tspan
                    :x="cd.x"
                    :y="cd.y+40"
                  >{{cd.value.toLocaleString()}}</tspan>
                <!-- 比例 -->
                  <tspan
                    :x="cd.x"
                    :y="cd.y+70"
                  >{{cd.ratio}}%</tspan>
                </text>
              </g>
            </template>
          </g>
        </g>

        <g class="tip" v-if="d.ratio>1 || index === activePie">
          <path
            marker-end="url(#circle)"
            :d="textPath(d)"
            class="line"
          />
          <text
            :font-size="12 * (type + 1)"
            :class="d.cx > d.ox ? 'she-left':'she-right'"
          >
           <tspan
              :x="d.x"
              :y="d.y+5*(type+1)"
            >{{d.ratio}}%</tspan>
            <tspan
              :x="d.x"
              :y="d.y+20*(type+1)"
            >{{d.value.toLocaleString()}}</tspan>
          </text>
        </g>
      </g>

    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  props: {
    colorScale: Function,
    data: Array,
    activePie: Number,
    type: Number,
    unit: {
      type: String,
      default: '元',
    },
    // piechart的标题
    title: String,
  },
  computed: {
    dataReady() {
      const radius = 130;
      // 所有一级数据的和
      let dataSum = 0;
      this.data.forEach((e) => {
        dataSum += (+e.value);
      });

      // 处理后的piechart数据
      return d3.pie()
        .padAngle(0.005)
        .sort(null)
        .value((d) => d.value)(this.data)
        .map((d) => {
          const tmp = { ...d };

          const a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
          tmp.cx = Math.cos(a) * (radius - 85) * 1.6;
          tmp.x = Math.cos(a) * (radius + 5) * 1.6;

          tmp.cy = Math.sin(a) * (radius - 85);
          tmp.y = Math.sin(a) * (radius + 5);

          // var bbox = this.getBBox();
          // TODO 为了方便暂时假设文字宽度为40
          const bbox = { width: 40 };
          tmp.sx = tmp.x - bbox.width / 2 - 2;
          tmp.ox = tmp.x + bbox.width / 2 + 2;
          tmp.oy = tmp.y + 5;
          tmp.sy = tmp.oy;
          tmp.ratio = Number(100 * (+d.value / dataSum)).toFixed(2);

          // console.log(tmp);

          if (tmp.cx > tmp.ox) {
            tmp.x -= 30;
          } else {
            tmp.x += 30;
          }

          if (d.data.child) {
            // 如果有子类型
            const sum = Object.values(d.data.child).map((t) => t.value)
              .reduce((ia, ib) => (+ia) + (+ib), 0);

            const sumAngle = d.endAngle - d.startAngle;

            tmp.child = [];

            for (let i = 0; i < d.data.child.length; i += 1) {
              const child = d.data.child[i];
              let startAngle; let
                endAngle;

              if (i === 0) {
                startAngle = d.startAngle;
                endAngle = startAngle + (child.value / sum) * sumAngle;
              } else {
                startAngle = tmp.child[i - 1].endAngle;
                endAngle = tmp.child[i - 1].endAngle + (child.value / sum) * sumAngle;
              }

              // 懒得提取函数了，复制粘贴吧
              const _a = startAngle + (endAngle - startAngle) / 2 - Math.PI / 1.5;
              const cx = Math.cos(_a) * (radius - 75) * 1.6;
              let x = Math.cos(_a) * (radius + 25) * 1.6;

              const cy = Math.sin(_a) * (radius - 75);
              const y = Math.sin(_a) * (radius + 25);

              const sx = x - 50 - 2;
              const ox = x + 50 + 2;
              const oy = y + 5;
              const sy = oy;

              if (cx > ox) {
                // 朝向左边
                x -= 60;
              } else {
                x += 60;
              }

              tmp.child.push({
                startAngle,
                endAngle,
                cx,
                cy,
                x,
                y,
                sx,
                sy,
                ox,
                oy,
                value: child.value,
                text: child.text,
                ratio: Number(100 * (+child.value / sum)).toFixed(2),
              });
            }
          }

          return tmp;
        });
    },

    arc() {
      return d3.arc().innerRadius(0)
        .outerRadius(100)
        .cornerRadius(2);
    },

    arcOut() {
      return d3.arc().innerRadius(110)
        .outerRadius(170)
        .cornerRadius(2);
    },

  },

  methods: {
    // 求文字路径
    textPath(d) {
      if (d.cx > d.ox) {
        return `M${d.sx},${d.sy}L${d.ox},${d.oy} ${d.cx},${d.cy}`;
      }
      return `M${d.ox},${d.oy}L${d.sx},${d.sy} ${d.cx},${d.cy}`;
    },

    hoverPie(index) {
      this.$emit('hoverPie', index);
    },

  },
};
</script>

<style scoped lang="scss">
  .line {
    fill: none;
    stroke: #707176;
  }

  path {
    cursor: pointer;
  }

  path.active {
    filter: url(#dropshadow);
  }

  .expand-content text {
    font-size: 1rem;
  }

  .pie-container {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    padding: 0 10px;

    svg {
      flex: 1;

      .she-left {
        tspan {
          text-anchor: end;
        }
      }

      .she-right {
        tspan {
          text-anchor: start;
        }
      }
    }

    p {
      position: absolute;
      font-size: 1rem;
      font-weight: 400;
      right: 10px;
      top: 20px;
    }

    p.pie-title {
      left: 18px;
    }
  }
</style>
