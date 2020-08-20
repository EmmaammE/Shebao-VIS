<template>
  <div class="w-container">
    <v-card>
      <v-data-table
        class="s-table"
        :headers="headers"
        :items-per-page="5"
        :items="pageData">

        <template v-slot:[`item.key`]="{ item }">
          <div class="s-col">{{item.key}}</div>
        </template>

        <template v-slot:[`item.type`]="{ item }">
          <!-- 多地开药次数 -->
          <div class="bar-container">
            <bar
              :scale="scale"
              :datum="[Object.keys(item.five_min).length,
                Object.keys(item.ten_min).length,
                Object.keys(item.sixty_min).length]"
              :data="item.type"
            />
            <p>{{item.type}}</p>
          </div>
        </template>
      </v-data-table>
    </v-card>
    <v-card>
      <v-sheet class="header">
        <div class="avatar"><GirlIcon/></div>
        <v-card class="s-tab">
          <div v-for="(tab,i) in tabs" :key="tab"
            :class="activeIndex === i ? 'active':''"
            @click="changeTab(i)"
          >{{tab}}</div>
        </v-card>
      </v-sheet>
      <v-simple-table dense>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center"
                v-for="text in headers2"
                :key="text"
              >{{text}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in desserts" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.calories }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script>
import { fetchDoctorViolationInfo } from '@/util/http';
import GirlIcon from '@/assets/search/icon_1.svg';
import Bar from '@/components/small/Bar.vue';
import * as d3 from 'd3';

export default {
  components: {
    Bar,
    GirlIcon,
  },

  data() {
    return {
      headers: [
        {
          text: '序号',
          value: 'index',
          align: 'center',
          sortable: false,
        },
        {
          text: '医师编号',
          align: 'center',
          sortable: false,
          value: 'key',
        },
        {
          text: '医师姓名',
          value: 'name',
          align: 'center',
          sortable: false,
        },
        {
          text: '异常机构',
          value: 'yi_chang_ji_gou_shu_liang',
          align: 'center',
        },
        {
          text: '异常费用',
          value: 'yi_chang_fei_yong',
          align: 'center',
        },
        {
          text: '多地开药次数',
          value: 'type',
          align: 'center',
          sortable: false,
        },
      ],

      headers2: [
        '序号', '机构代码', '医疗机构名称', '结算时间', '就诊人',
        '就诊流水号', '医疗费总额', '报销金额',
      ],

      pageData: [],
      scale: d3.scaleLinear().range([0, 100]),
      activeIndex: 1,
      tabs: ['5分钟', '10分钟', '20分钟', '1天'],
    };
  },

  mounted() {
    this.getDoctorViolationInfo();
  },

  methods: {
    async getDoctorViolationInfo() {
      const data = await fetchDoctorViolationInfo();
      // console.log(data);

      let maxValue = Number.MIN_VALUE;
      this.pageData = Object.keys(data.doctor_page)
        .map((key, index) => {
          const size = Object.keys(data.doctor_page[key].day).length;
          maxValue = Math.max(maxValue, size);
          return {
            ...data.doctor_page[key], key, index: index + 1, type: size,
          };
        });

      this.scale = this.scale.domain([0, maxValue]);
    },

    changeTab(e) {
      this.activeIndex = e;
    },
  },

};
</script>

<style scoped lang="scss">
  .w-container {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-gap: 10px;
    margin: 10px;
    height: calc(90vh - 20px);

    .s-table,
    .v-data-table__wrapper {
       height: calc(90vh - 20px);
    }

    .s-col {
      max-width: 100px;
    }

    th {
      padding: 2px!important;
    }

    .header {
      padding: 20px 10px;
      display: flex;
      align-items: center;
      justify-content: space-around;

      .avatar {
        height: 60px;
        display: flex;
        align-items: center;
      }
    }

    //右侧
    .s-tab {
      display: flex;
      justify-content: space-around;

      div {
        padding: 10px 45px;
        height: 52px;
        line-height: 32px;
        cursor: pointer;
        color:  $she-c;
        border-radius: 4px;
        transition: all 300ms ease-in-out;

        &.active {
          background: $she-c;
          color: #fff;
        }
      }
    }
  }
</style>
