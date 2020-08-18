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
    <v-card class="card-divide card-margin" v-if="tabIndex!==-1">
      <v-data-table
        dense
        :headers="modelHeader[tabIndex]"
        :items="datum"
        single-expand
        :expanded.sync="expanded"
        :hide-default-footer="true"
        item-key="index"
        :show-expand="tabIndex === 0"
      >
        <template v-slot:expanded-item="{ headers, item }"
          v-if="tabIndex===0"
        >
          <td :colspan="headers.length" class="expand-content">
            <circle-progress
              :ratio="item.chu_fang_xiang_si_du"
              label="处方相似度"
            />
            <circle-progress
              :ratio="item.risk"
              label="风险度"
            />
          </td>
        </template>
        <!-- <template v-slot:item="{ item }">
          <bar :scale="item.scale" />
        </template> -->
      </v-data-table>
    </v-card>
  </v-sheet>
</template>

<script>
import CircleProgress from '@/components/small/CircleProgress.vue';
import {
  fetchOrgGroupHospital, fetchOrgMultiPlacePrescribe,
  fetchOrgSwipeLittleCard, fetchOrgFalseHospital,
} from '@/util/http';
import Bar from '@/components/small/Bar.vue';

export default {
  props: {
    title: String,
    type: String,
    id: String,
    data: Object,
  },

  components: {
    CircleProgress,
    // Bar,
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
      expanded: [],
      modelHeader: [
        // NOTE群体就医
        [
          { align: 'center', value: 'index', text: '序号' },
          { align: 'center', value: 'zu_nei_ren_shu', text: '组内人数' },
          { align: 'center', value: 'qun_ti_jiu_yi_ci_shu', text: '群体就医次数' },
          { align: 'center', value: 'chu_fang_shu_liang', text: '处方数量' },
          { align: 'center', value: 'chu_fang_bing_zhen_duan_shu', text: '处方病诊断数' },
          { align: 'center', value: 'chu_fang_yao_pin_zhong_lei_shu', text: '处方药品类数' },
          { align: 'center', value: 'yi_chang_lie_zhi_fei_yong', text: '报销费用' },
          { align: 'center', text: '', value: 'data-table-expand' },
          // { value: '', text: '处方相似度' },
          // { value: 'risk', text: '风险' },
        ],
        // NOTE多地开药
        [
          { align: 'center', value: 'index', text: '序号' },
          // 键值
          { align: 'center', value: 'key', text: '医师编号' },
          { align: 'center', value: 'yi_shi_xing_ming', text: '医师姓名' },
          { align: 'center', value: 'yi_chang_ji_gou', text: '异常机构' },
          { align: 'center', value: 'yi_chang_fei_yong', text: '异常费用' },
          // 额外处理
          { align: 'center', value: 'duo_di_kai_yao', text: '多地开药次数' },

        ],
        // NOTE刷空卡
        [
        ],
        // NOTE刷小卡
        [
          { align: 'center', value: 'index', text: '序号' },
          { align: 'center', value: 'key', text: '参保人编号' },
          { align: 'center', value: 'can_bao_ren_xing_ming', text: '参保人姓名' },
          { align: 'center', value: 'zong_ju_li', text: '总距离' },
          { align: 'center', value: 'jinge', text: '刷卡总金额' },
        ],
        // NOTE虚假住院
        [
          { align: 'center', value: 'index', text: '序号' },
          { align: 'center', value: 'key', text: '编码' },
          { align: 'center', value: 'patient_name', text: '姓名' },
          { align: 'center', value: 'hospital_interval', text: '住院间隔' },
          { align: 'center', value: 'zhu_yuan_zong_fei_yong', text: '住院总费用' },
          // 额外处理
          { align: 'center', value: 'zhu_yuan_ci_shu', text: '住院次数' },
          { align: 'center', value: 'yao_zhan_bi', text: '药占比' },
        ],
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
        case 1:
          this.getOrgMultiPlacePrescribe();
          break;
        case 3:
          this.getOrgSwipeLittleCard();
          break;
        case 4:
          this.getOrgFalseHosipital();
          break;
        default:
          console.log('.');
      }
    },

    async getOrgGroupHospital() {
      const data = await fetchOrgGroupHospital({
        hospitalId: this.id,
      });

      this.datum = Object.values(data).map((d, index) => ({ ...d, ...{ index: index + 1 } }));
    },

    async getOrgMultiPlacePrescribe() {
      const data = await fetchOrgMultiPlacePrescribe({
        hospitalId: this.id,
      });

      this.datum = Object.keys(data).map((key, index) => (
        { ...data[key], ...{ index: index + 1, key } }
      ));
    },

    async getOrgSwipeLittleCard() {
      const data = await fetchOrgSwipeLittleCard({
        hospitalId: this.id,
      });

      this.datum = Object.keys(data).map((key, index) => (
        { ...data[key], ...{ index: index + 1, key } }
      ));
    },

    async getOrgFalseHosipital() {
      const data = await fetchOrgFalseHospital({
        hospitalId: this.id,
      });

      this.datum = Object.keys(data.xu_jia_zhu_yuan).map((key, index) => (
        { ...data.xu_jia_zhu_yuan[key], ...{ index: index + 1, key } }
      ));
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
      margin: 10px 0;
      pointer-events: initial;
      overflow: auto;

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
      width:  2px;
    }
    &::-webkit-scrollbar-track {
      background: #eee;
      border: 1px solid #ccc;
    }

    .v-data-table__wrapper {
      overflow-x: hidden;
    }
    th, td {
      padding: 0!important;
    }

    .expand-content {
      width: 150px;
      height: 150px!important;

      svg {
        width: 50%;
      }
    }
  }
</style>
