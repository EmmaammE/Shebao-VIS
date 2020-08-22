<template>
   <div class="box">
      <p>{{title}}</p>
      <v-card class="panel">
        <div class="panel-box">
          <div>
            <v-btn v-for="(d,index) in menu"
              :key="index"
              :class="activeIndex===index?'active':''"
              @click="changeIndex(index)"
              color="#fff"
            >{{d}}</v-btn>
          </div>

          <div class="legends">
            <div
              v-for="(label ,i) in radioLabels"
              :key="label"
            >
              <span :style="{background: colorScale(i)}"/>
              {{label}}
            </div>
          </div>

          <div class="legends">
            <div>
              <span
                :style="{background: '#9d60fb'}"
              ></span>
              2019年数据
            </div>
          </div>

          <!-- svg -->
          <div>
            <svg viewBox="0 0 120 60">
            </svg>
          </div>

        </div>

        <div class="panel-box">
          <div class="header-btn">
            <v-btn class="active">{{header}}</v-btn>
          </div>
          <div class="legends">
            <div>
              <span :style="{background:'#5d77ff'}"></span>
              2019年数据
            </div>
            <div>
              <span :style="{background:'#5d77ff'}"></span>
              2020年数据
            </div>
          </div>

          <!-- barchart -->
        </div>
      </v-card>
    </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  props: {
    title: String,
    menu: Array,
    radioLabels: Array,
    header: String,
  },

  data() {
    return {
      activeIndex: 0,
    };
  },

  computed: {
    colorScale() {
      return d3.scaleLinear()
        .range(['#5d77ff', '#889aff', '#a7b5ff', '#c8d0ff', '#d1d7f9'])
        .domain(d3.ticks(0, this.radioLabels.length, 5));
    },
  },

  methods: {
    changeIndex(index) {
      this.activeIndex = index;
    },
  },
};
</script>

<style scoped lang="scss">
  .panel {
    display: grid;
    grid-template-columns: 50% 50%;
    padding: 20px;

    .panel-box {
      display: flex;
      flex-direction: column;

      .v-btn {
        margin: 0 5px;

        &.active {
          background: $she-c!important;
          color: #fff;
        }
      }

      .header-btn {
        pointer-events: none;
      }

      .legends {
        display: flex;
        font-size: $f-small;

        div {
          display: flex;
          align-items: center;
          margin: 10px;
          line-height: 10px;
        }

        span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 8px;
        }
      }
    }
  }
</style>
