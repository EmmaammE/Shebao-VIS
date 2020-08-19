<template>
  <svg :viewBox="`-200 -200 400 400`">
    <circle fill="#eff0f0" cx="0" :cy="0" r="60" />
    <text font-size="30px" text-anchor="middle" dominant-baseline="middle">{{sum}}次</text>
    <g v-for="(d,index) in arcs"
      :key="index">
      <path
        :fill="color[parseInt(index/2)]"
        :d="arcRadius(d)"
      />

      <g v-if="index%2===0 && d.data !== 0"
        class="hover"
        :transform="`translate(${arc.centroid(d)})`"
      >
        <circle cx="0" cy="0"
          fill="#fff"
          opacity="0.5"
          r="16"/>
        <circle
          cx="0" cy="0"
          fill="#fff"
          :num="d.data"
          r="8"/>
        <path d="M5,-5 L40,-40 h40"
          :stroke="color[parseInt(index/2)]"
          stroke-width="5"
        />
        <polygon points="70,-50 90,-40 70,-30" :fill="color[parseInt(index/2)]"/>
        <text x="90" y="-38"
          text-anchor="right" dominant-baseline="middle"
        >{{d.data}}次</text>
        <!-- <text x="100" y="-20">
          {{arcs[index+1].data}}
        </text> -->
      </g>
    </g>
  </svg>
</template>

<script>
import * as d3 from 'd3';

const color = ['#c11f48', '#f87e4b', '#ffcc60', '#d84e5e'];

export default {
  components: {
  },

  props: {
    // 大小
    data: Array,
    sum: Number,
  },

  data() {
    return {
      color,
    };
  },

  computed: {
    arc() {
      return d3.arc().innerRadius(67)
        .outerRadius(100);
      // .cornerRadius(20);
    },

    arcs() {
      const data = [];
      this.data.forEach((d) => {
        data.push(d.patient, d.all - d.patient);
      });

      const pie = d3.pie()
        .padAngle(0.005)
        .sort(null).value((d) => d);
      return pie(data);
    },
  },

  methods: {
    arcRadius(d) {
      if (d.index * 2 === 1) {
        return this.arc(d);
      }
      return this.arc.startAngle(d.startAngle)
        .endAngle(d.endAngle + (20 * (Math.PI / 180))).cornerRadius(20)();
    },
  },

};
</script>

<style lang="scss">
// icon样式需要全局设置

  .ring-icon {
    outline: none!important;

    svg {
      filter: drop-shadow(1px 1px 4px rgba(0,0,0,.5));
      opacity: 0.9;

      path {
        fill-opacity: 0.9;
      }

      .hover {
        path {
          fill: none;
        }
      }

      text {
        text-align: center;
        font-size: 25px;
      }
    }
  }
</style>
