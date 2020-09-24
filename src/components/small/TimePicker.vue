<template>
  <!-- 时间选择 -->
  <div :class="type?'time-container type-2':'time-container'">
    <v-menu
      ref="menu1"
      v-model="localMenu1"
      :close-on-content-click="false"
      :return-value.sync="localDateStart"
      transition="scale-transition"
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <input
          v-model="localDateStart"
          v-bind="attrs"
          v-on="on"
          class="date-input"
        />
      </template>
      <v-date-picker v-model="localDateStart" no-title scrollable>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="localMenu1 = false">取消</v-btn>
        <v-btn text color="primary" @click="$refs.menu1.save(localDateStart)">保存</v-btn>
      </v-date-picker>
    </v-menu>
    <div>—</div>
    <v-menu
      ref="menu2"
      v-model="localMenu2"
      :close-on-content-click="false"
      :return-value.sync="localDateEnd"
      transition="scale-transition"
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
      <input
          v-model="localDateEnd"
          v-bind="attrs"
          v-on="on"
          class="date-input"
        />
      </template>
      <v-date-picker v-model="localDateEnd" no-title scrollable>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="localMenu2 = false">取消</v-btn>
        <v-btn text color="primary" @click="$refs.menu2.save(localDateEnd)">保存</v-btn>
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
    type: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    localValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },

    localMenu1: {
      get() {
        return this.menu1;
      },
      set(value) {
        this.$emit('updateMenu1', value);
      },
    },

    localMenu2: {
      get() {
        return this.menu2;
      },
      set(value) {
        this.$emit('updateMenu2', value);
      },
    },

    localDateStart: {
      get() {
        return this.dateStart;
      },
      set(value) {
        if (this.type !== true) {
          this.$emit('updateDateEnd', null);
        }
        this.$emit('updateDateStart', value);
      },
    },

    localDateEnd: {
      get() {
        return this.dateEnd;
      },

      set(value) {
        this.$emit('updateDateEnd', value);
      },
    },
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
