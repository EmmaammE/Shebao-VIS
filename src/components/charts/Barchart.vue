<template>
  <svg :viewBox="`0 0 ${width} ${height}`" class="s-barchart">
    <g class="s-axis" :transform='`translate(${margin.left}, ${margin.top})`'>
      <g v-axis:top= "{scale: xScale[0], ticks:2, padding:0}" />
      <g v-axis:y= "{scale: yScale}" />
      <g v-if="type === 1"
        :transform='`translate(${chartWidth/2+margin.right},0)`'
        v-axis:top= "{scale: xScale[1], ticks:2, padding:0}" />

     <template v-if="type === 1">
      <path id="rect" :d="`M0.5,0V0.5H ${chartWidth/2+0.5}
        V${chartHeight} h${-chartWidth/2} v${-chartHeight}` "></path>

      <use xlink:href="#rect"
        fill="none"
        :transform='`translate(${chartWidth/2+margin.padding},0)`'/>
     </template>
     <template v-else>
       <path id="rect" :d="`M0.5,0V0.5H ${chartWidth+0.5}
        V${chartHeight} h${-chartWidth} v${-chartHeight}` "></path>
     </template>
    </g>

    <!-- bars -->
   <template v-if="type === 1">
      <g v-for="(data,index) in datum"
        :transform='`translate(${margin.left +
          index*(chartWidth/2+margin.padding)}, ${margin.top})`'
        :key="'rect'+index">

        <g v-for="catagory in yDomain"
          :key="catagory"
        >
          <template v-if="data[catagory.key]!==undefined">
            <template v-if="data[catagory.key].shi_ji > data[catagory.key].yu_suan">
              <!-- 如果超过了预算 -->
              <rect
                :x="0.5"
                :y="yScale(catagory.title)+5"
                :width="xScale[index](data[catagory.key].yu_suan)"
                :height="10"
              />
              <rect
                class="warning"
                :x="xScale[index](data[catagory.key].yu_suan) + 0.5"
                :y="yScale(catagory.title)+5"
                :width="xScale[index](data[catagory.key].shi_ji)
                  - xScale[index](data[catagory.key].yu_suan)"
                :height="10"
              />
            </template>
            <template v-else>
              <rect
                :x="0.5"
                :y="yScale(catagory.title)+5"
                :width="xScale[index](data[catagory.key].shi_ji)"
                :height="10"
              />
            </template>

            <line
              :y1="yScale(catagory.title)+3"
              :x1="xScale[index](data[catagory.key].yu_suan)"
              :x2="xScale[index](data[catagory.key].yu_suan)"
              :y2="yScale(catagory.title)+17"
            />
          </template>
        </g>
      </g>
   </template>

   <template v-else>
      <g v-for="catagory in yDomain"
        :transform='`translate(${margin.left}, ${margin.top-5})`'
        :key="catagory"
      >
        <g v-if="datum[0][catagory.key]!==undefined">
          <rect
            :x="0.5"
            :y="yScale(catagory.title)+5"
            :width="xScale[0](datum[0][catagory.key].shi_ji)"
            :height="10"
            stroke="none"
          />

          <line
            :y1="yScale(catagory.title)+3"
            :x1="xScale[0](datum[0][catagory.key].yu_suan)"
            :x2="xScale[0](datum[0][catagory.key].yu_suan)"
            :y2="yScale(catagory.title)+17"
          />
        </g>
      </g>
   </template>
  </svg>
</template>

<script>
import { axisDirective } from '@/directives/axis';
import * as d3 from 'd3';

export default {
  props: {
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 50,
    },
    datum: Array,
    yDomain: Array,
    type: Number,
    margin: {
      type: Object,
      default: () => ({
        top: 20,
        right: 10,
        bottom: 10,
        left: 40,
        padding: 5,
      }),
    },
  },

  directives: {
    axis: axisDirective,
  },

  data() {
    return {

    };
  },

  computed: {
    chartWidth() {
      return this.width - this.margin.left - this.margin.right;
    },
    chartHeight() {
      return this.height - this.margin.top - this.margin.bottom;
    },
    xScale() {
      let xScales = [];

      if (this.type === 1) {
        const size = this.datum.length;
        xScales = Array.from({ length: size },
          () => d3.scaleLinear().range([0, this.chartWidth / size]));
        let minV = Number.MAX_VALUE;
        let maxV = Number.MIN_VALUE;
        this.datum.forEach((data, index) => {
          Object.keys(data).forEach((key) => {
            const yusuan = data[key].yu_suan;
            const shiji = data[key].shi_ji;

            minV = Math.min(minV, yusuan, shiji);
            maxV = Math.max(maxV, yusuan, shiji);
          });

          xScales[index].domain([minV, maxV]).nice();
        });
      } else {
        xScales = [d3.scaleLinear().range([0, this.chartWidth])];
        let minV = Number.MAX_VALUE;
        let maxV = Number.MIN_VALUE;
        Object.keys(this.datum[0]).forEach((key) => {
          const yusuan = +this.datum[0][key].yu_suan;
          const shiji = +this.datum[0][key].shi_ji;

          minV = Math.min(minV, yusuan, shiji);
          maxV = Math.max(maxV, yusuan, shiji);
        });

        xScales[0].domain([minV, maxV]).nice();
      }
      return xScales;
    },
    yScale() {
      return d3.scaleBand()
        .domain(this.yDomain.map((d) => d.title))
        .range([this.chartHeight, 0]);
    },
  },
};

</script>

<style  lang="scss">
  .s-axis text{
    font-size: 8px;
  }

  .s-axis {
    line {
      display: none;
    }

    path, line{
      stroke: #d0d6dd;
      stroke-dasharray: 1 1;
      fill: none;
    }

    path.domain{
      display: none;
    };
  }

  .s-barchart {
    rect {
      fill: #769edc;
      stroke: #2462c6;
    }

    rect.warning {
      fill: #b90000
    }

    line {
      stroke: #064dc1;
    }
  }

</style>
