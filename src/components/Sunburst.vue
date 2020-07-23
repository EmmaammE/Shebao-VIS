<template>
    <svg :width="width" :height="width" class="sunburst">
        <g :transform="`translate(${width / 2},${width / 2})`">
            <g v-for="(d,index) in datum.descendants().slice(1)"
              :key="index"
            >
              <path
                ref="path"
                :fill="pathColor(d)"
                :fill-opacity="arcVisible(d.current)?(d.children?0.6:0.4):0"
                :d="arc(d.current)"
                @click="clicked($event, d)"
              />
              <text
                :fill-opacity="+labelVisible(d.current)"
                :transform="labelTransform(d.current)"
              >
                {{d.data.name}}
              </text>
            </g>
        </g>
    </svg>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'Sunburst',
  props: {
    width: Number,
    radius: Number,
    root: Object,
    colorSchema: Function,
  },

  data() {
    return {
      datum: this.root,
    };
  },

  methods: {
    pathColor(d) {
      if (d.depth > 1) {
        return this.pathColor(d.parent);
      }
      return this.colorSchema(d.data.name);
    },

    arcVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    },

    labelVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    },

    labelTransform(d) {
      const x = ((d.x0 + d.x1) / 2) * (180 / Math.PI);
      const y = ((d.y0 + d.y1) / 2) * this.radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    },

    clicked(event, p) {
      // TODO
    },

  },

  computed: {
    arc() {
      const { radius } = this;
      return d3.arc()
        .startAngle((d) => d.x0)
        .endAngle((d) => d.x1)
        .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius((d) => d.y0 * radius)
        .outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 1));
    },
  },
};
</script>

<style scoped lang="scss">
  .sunburst {
    text {
      pointer-events: none;
      text-anchor: middle;
      user-select: none;
      font-size: 10px;
    }

    circle {
      fill: none;
      pointer-events: all;
    }

    path {
      cursor: pointer;
    }
  }
</style>
