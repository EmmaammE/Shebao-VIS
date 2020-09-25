<template>
  <div class="bar-wrapper">
    <svg :viewBox="`0 0 ${type*50+150} 20`" ref="svg">
      <template v-if="type===1">
        <!-- 刷小卡 -->
        <rect
          x="2"
          y="3"
          :width="scale(data)"
          height="14"
          class="rect"
        />

        <line v-for="(d,index) in datum"
          :key="index"
          :y1="3"
          :x1="scale(d*index+d)"
          :x2="scale(d*index+d)"
          :y2="17"
          class="line"
        >
        </line>
      </template>
      <template v-else>
        <!-- 多地开药次数 -->
        <g v-for="(d,index) in res"
          :key="index"
        >
          <rect
            :x="index===0?0:scale(datum[index-1])"
            y="3"
            :width="scale(d)"
            :fill="color[index]"
            height="14"
            :index="index"
          />
        </g>

        <line v-for="(d,index) in datum"
          :key="index+'l'"
          :y1="3"
          :x1="scale(d)"
          :x2="scale(d)"
          :y2="17"
        >
        </line>
      </template>
    </svg>

    <Tooltip v-bind="tipPos">
      <div class="s-tip" v-show="isShowing">
        <div class="inner" v-if="tipData!==null">
          <p>
            <span v-if="tipData.unit">{{tipData.unit}}: </span>
            {{Number(tipData.data).toLocaleString()}}</p>
        </div>
      </div>
    </Tooltip>
  </div>
</template>

<script>
import Tooltip from '@/components/Tooltip.vue';
import * as d3 from 'd3';

const units = [
  '五分钟', '十分钟', '六十分钟', '半天',
];

export default {
  props: {
    scale: Function,
    datum: Array,
    data: Number,
    type: Number,
  },

  data() {
    return {
      color: ['#6690ff', '#4d6bda', '#3348b6', '#0f2693'],
      isShowing: false,
      tipData: null,
      tipPos: {
        left: 0,
        right: 0,
      },
    };
  },

  components: {
    Tooltip,
  },

  mounted() {
    const that = this;
    const svg = d3.select(this.$refs.svg);

    if (this.type === 0) {
      // 如果是多地开药
      svg.selectAll('g').selectAll('rect')
        .on('mousemove', function act() {
          const index = +d3.select(this).attr('index');
          if (index === 3) {
            that.tipData = {
              unit: units[index],
              data: that.data,
            };
          } else {
            that.tipData = {
              unit: units[index],
              data: that.datum[index],
            };
          }

          that.tipPos = {
            left: d3.event.layerX,
            top: -35,
          };
          that.isShowing = true;
        });
    } else {
      // 刷小卡
      svg.select('rect')
      // eslint-disable-next-line
        .on('mousemove', function act() {
          that.tipData = {
            unit: null,
            data: that.datum[0],
          };

          that.tipPos = {
            left: d3.event.layerX,
            top: -35,
          };
          that.isShowing = true;
        });
    }

    // svg.on('mouseout', () => {
    //   this.isShowing = false;
    // });
  },

  computed: {
    res() {
      if (this.type === 1) {
        return [];
      }

      const arr = [0, ...this.datum, this.data];
      const res = [];
      arr.forEach((d, index) => {
        if (index) {
          res.push(arr[index] - arr[index - 1]);
        }
      });
      return res;
    },
  },
};
</script>

<style scoped>
  .rect {
    fill: #769edc;
    stroke: #2965c8;
  }

  line {
    stroke: #ffffff;
    stroke-width: 1;
  }

  .bar-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  svg {
    flex:1;
  }

  .inner {
    overflow: hidden;
    white-space: nowrap;
  }
</style>
