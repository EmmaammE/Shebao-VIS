<template>
<!-- 时间选择 -->
  <div :class="type?'time-container type-2':'time-container'">
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
    <div>—</div>
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
</template>

<script>
export default {
  props: {
    dateStart: String,
    dateEnd: String,
    menu1: Boolean,
    menu2: Boolean,
    type: Boolean,
  },
};
</script>

<style scoped lang="scss">
  .time-container {
    display: flex;
    align-items: center;
    background: #fcfcfc;
  }

  .type-2 {
    border: 2px solid #efefef;
  }

  .type-2 .date-input {
    border: 0!important;
  }

  .date-input {
    border: 2px solid #efefef;
    padding: 2px 5px;
    color: #7589a2;
    border-radius: 15px;
    font-family:PingFangSC-Semibold;
    font-size:12px;
    color:#597390;
    letter-spacing:0;
    text-align:center;
    width: 90px;
  }

  .date-input:focus {
    outline: none;
  }
</style>
