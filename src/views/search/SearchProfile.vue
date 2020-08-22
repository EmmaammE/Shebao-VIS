<template>
 <v-card flat class="profile-container">
   <v-card class="header">
     <div>icon</div>
     <p>{{title}}</p>
     <div class="s-info">
       <span>机构编码：{{id}}</span>
       <span>盈利类型：{{type}}</span>
       <span>法定代表人：{{person}}</span>
       <span>地址：{{address}}</span>
     </div>
   </v-card>
   <div class="content">

    <div class="box">
      <p>医保费用发生总体情况</p>
      <div class="box-header">
        <div>
          <span>2019年</span>
          <span>2020年</span>
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
          title="2020年总列支费用费"
          :amount="189"
          :rank="1"
        />
      </div>
      <div class="second-row">
        <line-container
          title="2020年总列支费用费"
          :amount="189"
          :rank="1"
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
    />

    <div class="box">
      <p>服务人群结构分析</p>
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
        <div>
          <p>{{menu[menuIndex]}}{{submenu[submenuIndex]}}排名</p>
          <!--svg -->
        </div>
      </v-card>
    </div>

   </div>
 </v-card>
</template>

<script>
import LineContainer from '@/components/charts/LineContainer.vue';
import ProfileCard from '@/components/charts/ProfileCard.vue';

export default {
  components: {
    LineContainer,
    ProfileCard,
  },
  data() {
    return {
      title: '杭州市富阳区中医院',
      id: 9101,
      person: 'XXX',
      type: '非营利性医疗机构',
      address: 'hhhhhhhhhhhh',

      // 医保费用
      radioGroup: 1,
      radioLabels: ['区内', '市内', '省内', '国内'],

      // barchart + piechart
      titles: ['就诊类别分析', '费用结构分析', '总医药费用'],
      menus: [
        ['列支费用', '人均列支费用', '就诊人数', '就诊人次', '人头人次比'],
        ['列支费用分布', '药品费用分布'],
        ['报销支出费用', '个人现金支付费用'],
      ],
      radioLabelsArr: [
        ['住院', '门诊', '规定病种', '家庭病床'],
        ['化验', '检查', '手术', '中医治疗', '物理治疗', '药品', '材料', '其他费用'],
        ['本年账户', '历年账户', '统筹账户', '大病保险', '救助基金'],
      ],

      // 服务人群结构分析
      menuIndex: 0,
      submenuIndex: 0,
      menu: [
        '住院就诊人员', '门诊就诊人员', '规定病种就诊人员', '家庭病床就诊人员',
      ],
      submenu: [
        '人次数', '金额',
      ],
    };
  },

  methods: {
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
        min-height: 20vh;

        p {
          font-size: $sub-title;
          font-weight: bold;
        }
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
    }
    .first-row {
      display: flex;
      margin: 10px 0;

      .line-card {
        flex: 0 0 33%;
      }
    }

    .second-row {
      display: flex;
      flex: 0 0 25%;
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
  }
</style>
