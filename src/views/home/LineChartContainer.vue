<template>
  <div>
    <line-chart v-bind="chart1Size" :datum="datumXY"
      :scale ="{xDomain: xFocusDomain, xType, yDomain, yType}" :xTickFormat="timeFormat"
    >
    </line-chart>
    <line-chart v-bind="chart2Size" v-bind:datum="datumXY"
      :scale ="{xDomain: xOverviewDomain, xType, yDomain, yType}" :xTickFormat="timeFormat"
    >
      <g ref="brush" class="brush"></g>
    </line-chart>
  </div>
</template>

<script>
import * as d3 from 'd3';
import LineChart from '@/components/LineChart.vue';
import fakeData from '@/mixins/data';

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
  },
  data() {
    return {
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

      this.$set(this.datumXY, 'y', datum.y);
      this.$set(this.datumXY, 'x', datum.x);

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
  },
};
</script>

<style lang="scss" scoped>
  .handle-custom {
    stroke: #fff;
  }
</style>
