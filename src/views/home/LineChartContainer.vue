<template>
  <div>
    <line-chart
      v-bind="chart1Size"
      :datum="datumXY"
      :scale ="{xDomain: xFocusDomain, xType, yDomain, yType}"
      :xTickFormat="timeFormat"
      :gridLine = "true"
      @d3-mousemove = 'mousemoveAction'
    >
    </line-chart>

    <!-- <line-chart
      v-bind="chart1Size"
      :datum="dataTest"
      :scale ="{xDomain: [1, 12] , xType: yType, yDomain: [180, 340], yType}"
      :gridLine = "true"
      @d3-mousemove = 'mousemoveAction'
    > -->
    <!-- </line-chart> -->
    <Tooltip/>
    <line-chart v-bind="chart2Size"
      :datum="datumXY"
      :scale ="{xDomain: xOverviewDomain, xType, yDomain, yType}"
      :xTickFormat="timeFormat"
    >
      <g ref="brush" class="brush"></g>
    </line-chart>
  </div>
</template>

<script>
import * as d3 from 'd3';
import LineChart from '@/components/LineChart.vue';
import Tooltip from '@/components/Tooltip.vue';
import fakeData from '@/mixins/data';

const dataTest = {
  x: Array(12).fill(null).map((x, i) => i + 1),
  y: [[
    205.47000000000003,
    195.87678571428572,
    230.40612903225812,
    237.06833333333327,
    238.63419354838712,
    237.45900000000003,
    245.80129032258063,
    236.86806451612907,
    231.502,
    314.59032258064514,
    303.49499999999995,
    330.1364516129033,
  ], [
    245.44709677419354,
    184.2441379310345,
    263.3754838709678,
    288.9456666666667,
    285.5558064516129,
    234.4423333333334,
  ]],
};

const chart1Size = {
  width: 900,
  height: 500,
  margin: {
    bottom: 50, left: 80, top: 10, right: 20,
  },
};
const margin = {
  bottom: 50, left: 80, top: 10, right: 20,
};
const chart2Size = {
  width: 900,
  height: 200,
  margin,
};

// build brush
let brush = d3
  .brushX()
  .extent([
    [margin.left, margin.top],
    [chart2Size.width - margin.right,
      chart2Size.height - margin.bottom],
  ]);

export default {
  name: 'LineChartContainer',
  components: {
    LineChart,
    Tooltip,
  },
  data() {
    return {
      dataTest,
      chart1Size,
      chart2Size,
      // 处理后的数据
      // datumXY = { x: [x轴的数据], y: {key: []} };
      datumXY: { x: [], y: {} },
      xFocusDomain: [],
      xOverviewDomain: [],
      yDomain: [],
      xType: 'scaleTime',
      yType: 'scaleLinear',
      xContext: d3.scaleTime(),

      timeFormat: d3.timeFormat('%H:%M'),

      brush,
    };
  },

  mounted() {
    // fetch data

    // hanlde data
    this.updateScales();

    // init brush
    brush = brush
      .on('brush end', this.brushed);

    const $brush = d3.select(this.$refs.brush);
    $brush.call(brush);
    $brush.call(brush.move, [margin.left, 300]);
  },

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

      // this.$set(this.datumXY, 'y', datum.y);
      // this.$set(this.datumXY, 'x', datum.x);
      this.datumXY = { ...datum };

      this.xOverviewDomain = [datum.x[0], datum.x[23]];
      this.xFocusDomain = [datum.x[0], datum.x[23]];
      this.yDomain = [minV, maxV];
      this.xContext.domain(this.xFocusDomain)
        .range([margin.left, chart2Size.width - margin.right]);
      // console.log(minV, maxV);
    },

    brushed() {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return; // ignore brush-by-zoom
      const s = d3.event.selection || this.xContext.range();
      this.xFocusDomain = s.map(this.xContext.invert, this.xContext);
    },

    mousemoveAction(coord) {
      const xValues = this.datumXY.x;
      const nearestDateIndex = d3.bisect(xValues.map((e) => e.toString()), coord[0].toString());
      // get the dates on either of the mouse cord
      const d0 = new Date(xValues[nearestDateIndex - 1]);
      const d1 = new Date(xValues[nearestDateIndex]);
      let closestDate;
      if (d0 < this.xFocusDomain[0]) {
        closestDate = d1;
      } else if (d1 > this.xFocusDomain[1]) {
        closestDate = d0;
      } else {
      // decide which date is closest to the mouse
        closestDate = coord[0] - d0 > d1 - coord[0] ? d1 : d0;
      }

      // NOTE 坐标轴的ticks，默认10，懒得设置了
      const ticks = 10;
      const factor = (this.yDomain[1] - this.yDomain[0]) / ticks;
      const yValues = Array.from(new Array(ticks), (x, i) => i + factor)[Math.round(coord[1])];

      console.log(closestDate, yValues);
    },
  },
};
</script>

<style lang="scss" scoped>
  .handle-custom {
    stroke: #fff;
  }
</style>
