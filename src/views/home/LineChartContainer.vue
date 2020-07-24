<template>
  <div class="container">
    <line-chart
      v-bind="chart1Size"
      :datum="datumXY"
      :scale ="{xDomain: xFocusDomain, xType, yDomain, yType}"
      :xTickFormat="timeFormat"
      :gridLine = "true"
      @d3-mousemove = 'mousemoveAction'
    >
    <foreignObject x="0" y="0" width="100%" height="100%" class="mask">
      <Tooltip v-show="isShowing" v-bind="tipPos"
      >
        {{tipData.date?tipData.date.getHours()+':'+(tipData.value).toFixed(2):''}}
      </Tooltip>
    </foreignObject>
    </line-chart>
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
import toggle from '@/mixins/toggle';

const chart1Size = {
  width: 900,
  height: 350,
  margin: {
    bottom: 50, left: 80, top: 10, right: 20,
  },
};
const margin = {
  bottom: 50, left: 80, top: 10, right: 20,
};
const chart2Size = {
  width: 900,
  height: 120,
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
      tipData: {},
      tipPos: {},
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

    mousemoveAction(coord, kind, mouse) {
      // TODO hover事件效果
      if (this.datumXY.y[kind]) {
        const xValues = this.datumXY.x;
        const nearestDateIndex = d3.bisect(xValues.map((e) => e.toString()), coord[0].toString());
        // get the dates on either of the mouse cord
        const d0 = new Date(xValues[nearestDateIndex - 1]);
        const d1 = new Date(xValues[nearestDateIndex]);
        let closestDate;
        if (d0 <= this.xFocusDomain[0]) {
          closestDate = d1;
        } else if (d1 >= this.xFocusDomain[1]) {
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
