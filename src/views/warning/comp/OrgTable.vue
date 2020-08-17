<template>
  <v-sheet class="sheet-container">
    <v-card class="card-container-1 card-divide">
      <h4>{{title}}</h4>
      <h4>{{ id}}</h4>
      <div class="s-card-table">
        <div class="header">
          <span>均次指标</span>
          <span>交易次数</span>
          <span>发生金额</span>
        </div>
        <ul v-if="data">
          <li v-for="(d,index) in tableHeader"
            :key="index"
            @click="clickTab(index)"
            :class="tabIndex===index?'active':''"
          >
            <span>{{d.title}}</span>
            <span>{{data[d.key].num}}</span>
            <span>{{data[d.key].money}}</span>
          </li>
        </ul>
      </div>
    </v-card>
    <v-card class="card-divide card-margin">
      <div class="table-item">
        <span>序号</span>
        <span>组内人数</span>
        <span>群体就医次数</span>
        <span>处方数量</span>
        <span>处方病诊断数</span>
        <span>处方药品类数</span>
        <span>报销费用</span>
      </div>
       <v-list-group
          v-for="(item,i) in datum"
          :key="item.title"
          :value="active===i"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <div class="table-item">
                <span v-for="d in item.title" :key="d">{{d}}</span>
              </div>
            </v-list-item-content>
          </template>

          <!-- <v-list-item
          >
            <v-list-item-content class="item-content"> -->
              <circle-progress
                v-for="(subItem) in item.items"
                :key="subItem+'cir'"
                :ratio="subItem"
              />
            <!-- </v-list-item-content>
          </v-list-item> -->
        </v-list-group>
    </v-card>
  </v-sheet>
</template>

<script>
import CircleProgress from '@/components/small/CircleProgress.vue';
import { fetchOrgGroupHospital } from '@/util/http';

export default {
  props: {
    title: String,
    type: String,
    id: String,
    data: Object,
  },

  components: {
    CircleProgress,
  },

  data() {
    return {
      tableHeader: [
        { key: 'qun_ti_jiu_yi', title: '群体就医' },
        { key: 'duo_di_kai_yao', title: '多地开药' },
        { key: 'shua_kong_ka', title: '刷空卡' },
        { key: 'shua_xiao_ka', title: '刷小卡' },
        { key: 'xu_jia_zhu_yuan', title: '虚假住院' },
      ],
      tabIndex: -1,
      datum: [],
      active: 0,
    };
  },

  watch: {
    tabIndex() {
      this.getData();
    },
  },

  methods: {
    clickTab(index) {
      this.tabIndex = index;
    },

    getData() {
      switch (this.tabIndex) {
        case 0:
          this.getOrgGroupHospital();
          break;
        default:
          console.log('.');
      }
    },

    async getOrgGroupHospital() {
      const data = await fetchOrgGroupHospital({
        hospitalId: this.id,
      });

      this.datum = Object.values(data).map((d, index) => ({
        title: [
          index, d.zu_nei_ren_shu, d.qun_ti_jiu_yi_ci_shu, d.chu_fang_shu_liang,
          d.chu_fang_bing_zhen_duan_shu, d.chu_fang_yao_pin_zhong_lei_shu,
          d.bao_xiao_fei_yong,
        ],
        items: [
          d.chu_fang_xiang_si_du,
          d.risk,
        ],
      }));
    },
  },
};
</script>
<style lang="scss">
  .sheet-container {
    display: flex;
    background: transparent!important;
  }
  .card-divide {
    height: 53%;
  }
  .card-container-1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    width: 15vw;

    .s-card-table {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin: 15px 0;
      pointer-events: initial;

      span {
        width: 5vw;
        text-align: center;
      }

      .header {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }

      ul {
        list-style: none;
        display: block;
        padding: 0;

        li {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          color: #aeaeae;
          border-bottom: 1px solid #aeaeae;
          border-left: 2px solid #fff;
          transition: all ease-in-out 300ms;
          cursor: pointer;
        }

        li.active {
          background: linear-gradient(to right, #eaf1f9, #f5f7fb);
          border-left: 2px solid #94bfef;
          color: #3294f8;
        }
      }
    }
  }

  .card-margin {
    margin: 0 5px;
    padding: 10px;
    overflow: auto;
    max-height: 55*0.53vh;
    pointer-events: initial;

    &::-webkit-scrollbar {
      width:  10px;
    }
    &::-webkit-scrollbar-track {
      background: #eee;
      border: 1px solid #ccc;
    }

    .table-item {
      display: flex;
      justify-content: space-between;
      span {
        display: inline-block;
        width: px;
        text-align: center;
      }
    }

    .item-content {
      display: flex;
    }
  }
</style>
