<template>
 <v-card flat >
  <v-overlay v-if="loading" :value="loading" color="#fff" >
    <v-progress-circular indeterminate size="64" color="#98cbfa"></v-progress-circular>
  </v-overlay>

   <div class="profile-container" v-else>
     <v-card class="header">
     <div class="org-info">
        <div class="icon-wrapper">
          <HosIcon />
        </div>
        <p>{{title}}</p>
     </div>
     <div class="s-info">
       <span>机构编码：{{id}}</span>
       <span>盈利类型：{{type}}</span>
       <span>法定代表人：{{person}}</span>
       <span>地址：{{address}}</span>
     </div>
   </v-card>
   <div class="content">

    <div class="box">
      <p class="profile-title">医保费用发生总体情况</p>
      <div class="box-header">
        <div class="legends">
          <span><i> </i>2019年</span>
          <span><i> </i>2020年</span>
        </div>

        <div>
          <v-radio-group v-model="radioGroup" row
            dense
            hide-details
          >
            <v-radio
              v-for="(n,index) in radioLabels"
              :key="n"
              :label="n"
              :value="index"
            ></v-radio>
          </v-radio-group>
        </div>
      </div>

      <div class="first-row">
        <line-container
          v-for="d in charts1"
          :key="d.text"
          :title="d.text"
          :amount="189"
          :rank="charts[d.value].rank[radioValues[radioGroup]]"
          :data="charts[d.value].time_series"
          :tick="d.tick"
        />
      </div>
      <div class="second-row">
        <line-container
          v-for="d in charts2"
          :key="d.text"
          :title="d.text"
          :amount="189"
          :rank="charts[d.value].rank[radioValues[radioGroup]]"
          :data="charts[d.value].time_series"
          :tick="d.tick"
        />
      </div>
    </div>

    <profile-card
      v-for="n in 3"
      :key="n"
      :title="titles[n-1]"
      :menu="menus[n-1]"
      :radioLabels="radioLabelsArr[n-1]"
      :header="'同期列支费用分布比较'"
      :datum="pieDatum[n-1]"
      :tabs="tabs[n-1]"
    />

    <div class="box">
      <p class="profile-title">服务人群结构分析</p>
      <v-card class="card">
        <div class="btn-container">
          <v-btn
          v-for="(d,index) in menu"
          :key="d"
          @click="changeTab(index)"
          :class="menuIndex === index ? 'active': ''"
          >{{d}}</v-btn>
          <div class="two">
            <v-btn
              v-for="(d,index) in submenu"
              :key="index"
              @click="changeMenu(index)"
              :class="submenuIndex === index ? 'active':''"
            >{{d}}</v-btn>
          </div>
        </div>
        <div class="jiegou-wrapper">
          <p>{{menu[menuIndex]}}{{submenu[submenuIndex]}}排名</p>
          <!--svg -->
          <round-barchart
            :data="fuwuData[menuValue[menuIndex]][submenuValue[submenuIndex]]"
            :unit="submenuIndex===1?'元':'次'"
          />
        </div>
      </v-card>
    </div>

   </div>
   </div>
 </v-card>
</template>

<script>
import LineContainer from '@/components/charts/LineContainer.vue';
import ProfileCard from '@/components/charts/ProfileCard.vue';
import { fetchOrgPortraitDetail } from '@/util/http';
import HosIcon from '@/assets/search/hospital.svg';
import RoundBarchart from '@/components/charts/RoundBarchart.vue';

const HASH = {
  就诊类别分析: 'jiu_zhen_lei_bie_fen_xi',
  费用结构分析: 'fei_yong_jie_gou_fen_xi',
  总医药费用: 'zong_yi_yao_fei_yong',
  住院: 'zhu_yuan',
  门诊: 'men_zhen',
  规定病种: 'gui_ding_bing_zhong',
  家庭病床: 'jia_ting_bing_chuang',
};
export default {
  components: {
    LineContainer,
    ProfileCard,
    HosIcon,
    RoundBarchart,
  },
  data() {
    return {
      // 是否未加载完数据
      loading: true,

      title: '杭州市富阳区中医院',
      id: 9101,
      person: 'XXX',
      type: '非营利性医疗机构',
      address: 'hhhhhhhhhhhh',

      // 第一排的linechart
      charts1: [
        { text: '次均列支费用', value: 'ci_jun_lie_zhi_fei_yong', tick: '（元)' },
        { text: '人次人头比', value: 'ren_ci_ren_tou_bi', tick: '' },
        { text: '人均列支费用', value: 'ren_jun_lie_zhi_fei_yong', tick: '（元）' },
      ],
      charts2: [
        { text: '总列支费用', value: 'zong_lie_zhi_fei_yong', tick: '（元）' },
        { text: '总人次数', value: 'zong_ren_ci_shu', tick: '（次）' },
        { text: '总人头数', value: 'zong_ren_tou_shu', tick: '（头）' },
        { text: '总医药费用', value: 'zong_yi_yao_fei_yong', tick: '（元）' },
      ],
      // 上面两派图的数据
      charts: {},

      // 医保费用
      radioGroup: 0,
      radioLabels: ['区内', '市内', '省内', '国内'],
      radioValues: ['qu_nei', 'shi_nei', 'sheng_nei', 'guo_nei'],

      // barchart + piechart
      titles: ['就诊类别分析', '费用结构分析', '总医药费用'],
      menus: [
        ['列支费用'],
        ['列支费用分布', '药品费用分布'],
        ['报销支出费用'],
      ],
      // 只有数值的数据
      tabs: [
        [{ text: '人均列支费用', unit: '元' },
          { text: '就诊人数', unit: '人' },
          { text: '就诊人次', unit: '次' },
          { text: '人头人次比', unit: '%' }],
        [],
        [{ text: '个人现金支付费用', unit: '元' }],
      ],
      radioLabelsArr: [
        ['住院', '门诊', '规定病种', '家庭病床'],
        ['化验', '检查', '手术', '中医治疗', '物理治疗', '药品', '材料', '其他费用'],
        ['本年账户', '历年账户', '统筹账户', '大病保险', '救助基金'],
      ],
      pieDatum: [],

      // 服务人群结构分析
      menuIndex: 0,
      submenuIndex: 0,
      menu: [
        '住院就诊人员', '门诊就诊人员', '规定病种就诊人员', '家庭病床就诊人员',
      ],
      menuValue: [
        'zhu_yuan_jiu_zhen',
        'men_zhen_jiu_zhen',
        'gui_ding_bing_zhong',
        'jia_ting_bing_chuang',
      ],
      submenu: [
        '人次数', '金额',
      ],
      submenuValue: [
        'ren_ci_shu', 'jin_e',
      ],
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    async getData() {
      // 根据机构编码获得数据
      const data = await fetchOrgPortraitDetail({
        orgId: this.$route.params.orgId,
      });
      this.title = data.basicInfo.name;
      this.id = data.basicInfo.ji_gou_dai_ma;
      this.type = data.basicInfo.ying_li_lei_xing;
      this.address = data.basicInfo.di_zhi;
      this.person = data.basicInfo.fa_ding_dai_biao_ren;
      // console.log(data);
      this.loading = false;
      this.charts = data.zong_ti_qing_kuang;
      this.fuwuData = data.fu_wu_ren_qun_jie_gou_fen_xi;

      this.pieDatum = this.titles.map((d) => data[HASH[d]]);
    },
    changeTab(index) {
      this.menuIndex = index;
    },
    changeMenu(index) {
      this.submenuIndex = index;
    },
  },
};
</script>

<style scoped lang="scss">
  .profile-container {
    display: flex;
    flex-direction: column;
    padding: 20px;
    height: calc(90vh - 10px);
    margin: 5px 15px;

    .header {
      display: flex;
      height: 11vh;
      align-items: center;
      justify-content: space-evenly;

      .org-info {
        display: flex;
        align-items: center;
      }

      .icon-wrapper {
        border: 1.5px solid #034ec4;
        border-radius: 50%;
        width: 65px;
        height: 65px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px;

        svg {
          transform: scale(1.5);
        }
      }
      // padding: 10px;

      p {
        margin: 0;
        font-size: $title;
        color: $she-primary;
      }

      .s-info {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        font-size: $sub-title;

        span {
          flex: 0 0 50%;
          margin: 4px 0;
        }
      }
    }

    .content {
      height: calc(78vh);
      overflow: auto;

      .box {
        display: flex;
        flex-direction: column;
        padding: 20px 2px;
        min-height: 14vh;
      }
    }

    // -----------
    .box-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      div {
        display: flex;
      }

      .legends {
        span {
          display: flex;
          align-items: center;
          position: relative;
          padding: 4px 10px;
          border: 1px solid #cfcfcf;
          border-radius: 4px;
          margin-right: 15px;
          cursor: pointer;

          i {
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            margin: 0 0.5rem 0 0;
          }
        }

        span:nth-child(1) {
          i {
            background: #6672fb;
          }
        }

        span:nth-child(2) {
          i {
            background: #d8adf2;
          }
        }

        span.active {
          color: #1976d2;
        }
      }
    }

    .first-row {
      display: flex;
      margin: 10px 0;
      justify-content: space-between;

      .line-card {
        flex: 0 0 32.4%;
        border-radius: 10px;
      }
    }

    .second-row {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;

      .line-card {
        flex: 0 0 24%;
        border-radius: 10px;
      }
    }

    // 服务人群结构分析
    .card {
      display: flex;
      padding: 20px;
    }

    .btn-container {
      display: flex;
      flex-direction: column;
      flex: 0 0 20%;
      justify-content: space-evenly;
      align-items: space-evenly;
      // margin: 0 20px;
      padding: 20px;

      .v-btn {
        margin: 10px 0;
        background: #fff!important;

        &.active {
          background: $she-primary!important;
          color: #fff;
        }
      }

      .two {
        display: flex;
        justify-content: space-between;

        .v-btn {
          flex: 0 0 46%;
        }
      }
    }

    .jiegou-wrapper {
      width: 100%;
    }
  }
</style>
