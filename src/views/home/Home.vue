<template>
  <div class="home">
    <line-chart-container />
    <calendar
      v-bind="setting"
      :datum="data"
    />
    <sunburst
      v-bind="sunburstSetting"
      :root="data2"
      :colorSchema="color"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import * as d3 from 'd3';
import LineChartContainer from '@/views/home/LineChartContainer.vue';
import Calendar from '@/components/Calendar.vue';
import Sunburst from '@/components/Sunburst.vue';
import fakeData from '@/mixins/data2';
import fakeData2 from '@/mixins/flare-11.5.json';

const setting = {
  width: 800,
  height: 250,
  cellSize: 14,
  marginLeft: 60,
  marginTop: 10,
};

const partition = (data) => {
  const root = d3.hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  return d3.partition()
    .size([2 * Math.PI, root.height + 1])(root);
};

const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, fakeData2.children.length + 1));

const sunburstSetting = {
  width: 500,
};

sunburstSetting.radius = sunburstSetting.width / 7;

export default {
  name: 'Home',
  components: {
    LineChartContainer,
    Calendar,
    Sunburst,
  },
  data() {
    return {
      setting,
      data: fakeData,
      sunburstSetting,
      // eslint-disable-next-line
      data2: partition(fakeData2).each((d) => d.current = d),
      color,
    };
  },

  mounted() {
    // fetch data
  },
};
</script>
