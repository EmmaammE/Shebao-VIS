<template>
  <v-card flat class="filter-card">
    <p class="sub-title">筛选条件</p>
    <div class="divider" />
    <p>时间区间</p>

    <!-- 时间选择 -->
    <div class="time-container">
      <v-menu
        ref="menu1"
        v-model="menu1"
        :close-on-content-click="false"
        :return-value.sync="dateStart"
        transition="scale-transition"
        offset-y
      >
        <template v-slot:activator="{ on, attrs }">
          <input
            v-model="dateStart"
            v-bind="attrs"
            v-on="on"
            class="date-input"
          />
        </template>
        <v-date-picker v-model="dateStart" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu1 = false">取消</v-btn>
          <v-btn text color="primary" @click="$refs.menu1.save(dateStart)">保存</v-btn>
        </v-date-picker>
      </v-menu>
      <div>|</div>
      <v-menu
        ref="menu2"
        v-model="menu2"
        :close-on-content-click="false"
        :return-value.sync="dateEnd"
        transition="scale-transition"
        offset-y
      >
        <template v-slot:activator="{ on, attrs }">
        <input
            v-model="dateEnd"
            v-bind="attrs"
            v-on="on"
            class="date-input"
          />
        </template>
        <v-date-picker v-model="dateEnd" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu2 = false">取消</v-btn>
          <v-btn text color="primary" @click="$refs.menu2.save(dateEnd)">保存</v-btn>
        </v-date-picker>
      </v-menu>
    </div>
    <!-- 时间选择 end-->

    <!-- slot-->
    <div v-if="type" class="s-legends">
      <div class="divider" />
      <span>总店汇总</span>

      <div class="divider" />
      <p>地域类型</p>
      <span>本地</span>
      <span>市内异地</span>
      <span>省内异地</span>
      <span>跨省异地</span>

      <div class="divider" />
      <p>机构类型</p>
      <span>公立医院</span>
      <span>民营医院</span>
      <span>社区卫生服务中心</span>
      <span>零售药店</span>
      <span>其他门诊部</span>
      <span>口腔内门诊部</span>
    </div>

    <div class="divider" />

    <!-- footer -->
    <input
      v-model="condition"
      :placeholder="label"
      class="s-input"
    />

    <div class="divider" />

    <div class="btn-container">
      <button>重置</button>
      <button class="primary--text">查询</button>
    </div>
  </v-card>
</template>

<script>

export default {
  name: 'filterCard',
  props: {
    label: String,
  },
  data() {
    return {
      dateStart: new Date().toISOString().substr(0, 10),
      dateEnd: new Date().toISOString().substr(0, 10),
      menu1: false,
      menu2: false,

      // 查询条件
      condition: '',

      type: true,
    };
  },
};
</script>

<style scoped lang="scss">
  p.sub-title {
    font-family:PingFangSC-Semibold;
    font-size: 18px;
    color:#262626;
    letter-spacing:0;
    text-align:left;
    font-weight: bold;
    margin: 0;
  }

  p {
    margin: 0;
  }

  .filter-card {
    border-radius: 10px;
    width: 11vw;
    background: rgba($color: #fcfcfc, $alpha: 0.85);
    position: absolute;
    top: 3vh;
    left: 2vw;
    z-index: 1100;
    padding: 15px;
    box-shadow: 1px 2px 5px rgba($color: #000, $alpha: 0.1)!important;

    .time-container {
      display: flex;
      align-items: center;
      flex-direction: column;
      background: #fcfcfc;
    }

    .date-input {
      border: 2px solid #efefef;
      padding: 5px 10px;
      color: #7589a2;
    }

    .date-input:focus {
      outline: none;
    }

    .divider {
      background: #efefef;
      height: 2px;
      border-color: #efefef;
      width: 100%;
      margin: 5px 0;
    }

    .s-input {
      padding: 5px 7px;
      color: #9c9c9c;
      :focus {
        color: #000;
      }
    }

    .btn-container {
      margin: 15px auto 5px;
      display: flex;
      flex-direction: column;
      width: 5vw;

      button {
        padding: 3px 15px;
        border: 1px solid #c0c0c0;
        border-radius: 15px;
        letter-spacing: 4px;
        margin: 5px 0;
        outline:none;
      }
    }

    .s-legends {
      display: flex;
      flex-direction: column;

      span {
        position: relative;
        text-indent: 15px;
        margin: 5px 10px;
      }

      span::before {
        content: '';
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 1px solid #c0c0c0;;
        position: absolute;
        left: -10px;
      }

      span::after {
        content: '';
        width: 10px;
        height: 10px;
        top: 2px;
        border-radius: 50%;
        border: 1px solid #c0c0c0;
        position: absolute;
        left: -8px;
      }
    }
  }
</style>
