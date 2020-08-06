<template>
  <div class="container">
    <line-chart
      v-bind="chartSize"
      :datum="datumXY"
      :scale ="{xDomain, xType, yDomain, yType}"
      :xTickFormat="timeFormat"
      @d3-mousemove = "mousemoveAction"
      :gridLine = "true"
    >
    <foreignObject x="0" y="0" width="100%" height="100%" class="mask">
      <Tooltip v-show="isShowing" v-bind="tipPos"
      >
        {{tipData.date?tipData.date.getHours()+':'+(tipData.value).toFixed(2):''}}
      </Tooltip>
    </foreignObject>
    </line-chart>
  </div>
</template>

<script>
import * as d3 from 'd3';
import LineChart from '@/components/LineChart.vue';
import Tooltip from '@/components/Tooltip.vue';
import fakeData from '@/mixins/data';
import toggle from '@/mixins/toggle';

const chartSize = {
  width: 900,
  height: 350,
  margin: {
    bottom: 50, left: 80, top: 10, right: 20,
  },
};
export default {
  name: 'Zhexian',
  components: {
    LineChart,
    Tooltip,
  },
  data() {
    return {
      chartSize,
      datumXY: { x: [], y: {} },
      xDomain: [],
      yDomain: [],
      xType: 'scaleTime',
      yType: 'scaleLinear',
      timeFormat: d3.timeFormat('%H:%M'),
      tipData: {},
      tipPos: {},
    };
  },

  mounted() {
    this.updateScales();
  },

  mixins: [toggle],

  methods: {
    updateScales() {
      // eslint-disable-next-line
      const datum = { x: [], y: {} };
      let minV = Number.MAX_VALUE;
      let maxV = Number.MIN_VALUE;
      Object.keys(fakeData).forEach((kind) => {
        // 每种类型的数据
        datum.y[kind] = fakeData[kind].map((d) => {
          const v = +d.conversion;
          if (v < minV) {
            minV = v;
          }
          if (v > maxV) {
            maxV = v;
          }
          return v;
        });
      });

      datum.x = Array.from({ length: 24 }, (e, i) => d3.timeParse('%H:%M')(`${i}:00`));

      this.datumXY = { ...datum };

      this.xDomain = [datum.x[0], datum.x[23]];
      this.yDomain = [minV, maxV];
    },
    mousemoveAction(coord, kind, mouse) {
      // TODO hover事件效果
      if (this.datumXY.y[kind]) {
        const xValues = this.datumXY.x;
        const nearestDateIndex = d3.bisect(xValues.map((e) => e.toString()), coord[0].toString());
        // get the dates on either of the mouse cord
        const d0 = new Date(xValues[nearestDateIndex - 1]);
        const d1 = new Date(xValues[nearestDateIndex]);
        let closestDate;
        if (d0 <= this.xDomain[0]) {
          closestDate = d1;
        } else if (d1 >= this.xDomain[1]) {
          closestDate = d0;
        } else {
          // decide which date is closest to the mouse
          closestDate = coord[0] - d0 > d1 - coord[0] ? d1 : d0;
        }

        const yValue = this.datumXY.y[kind][nearestDateIndex];
        // console.log(closestDate, yValue);
        this.tipData = {
          date: closestDate,
          value: yValue,
        };
        // this.tipData = {
        //   date: coord[0],
        //   value: coord[1],
        // };
        this.tipPos = {
          left: mouse[0],
          top: mouse[1],
        };
        this.toShow();
      }
    },
  },
};

</script>

<style lang="scss" scoped>
    .container svg{
    position: relative;

    .mask {
      pointer-events: none;
    }
  }
</style>
