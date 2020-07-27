<template>
  <div class="search-container">
    <v-card outlined class="content-card">
      <p class="sub-title">筛选条件</p>
      <v-sheet class="date-container">
        <p>时间区间</p>
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="dateBegin"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateBegin"
              outlined
              dense
              readonly
              hide-details="true"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="dateBegin" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false">取消</v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(dateBegin)">保存</v-btn>
          </v-date-picker>
        </v-menu>

        <p>-</p>

        <v-menu
          ref="menu2"
          v-model="menu2"
          :close-on-content-click="false"
          :return-value.sync="dateEnd"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateEnd"
              outlined
              readonly
              dense
              hide-details="true"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="dateEnd" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu2 = false">取消</v-btn>
            <v-btn text color="primary" @click="$refs.menu2.save(dateEnd)">保存</v-btn>
          </v-date-picker>
        </v-menu>
      </v-sheet>

      <v-sheet class="custom-input">
        <v-text-field
          outlined
          dense
          hide-details="true"
          v-model="id"
          label="身份证号、社保卡号或姓名"
        ></v-text-field>
      </v-sheet>

      <p class="sub-title">数据结果</p>

      <v-data-table
        :headers="headers"
        :items="datum"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:item.sex="{ item }">
          <div class="custom-avatar">
            <component :is="avatar(item.sex)">
            </component>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-card outlined class="content-card"></v-card>
  </div>
</template>

<script>
import layout from '@/mixins/layout';
import GirlIcon from '@/assets/search/icon_1.svg';
import BoyIcon from '@/assets/search/icon_2.svg';

export default {
  name: 'Search',
  components: {
  },
  data: () => ({
    dateBegin: new Date().toISOString().substr(0, 10),
    dateEnd: new Date().toISOString().substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
    id: '',
    headers: [
      {
        text: '性别',
        align: 'start',
        sortable: false,
        value: 'sex',
      },
      { text: '姓名', value: 'name' },
      { text: '社保卡号', value: 'sheid' },
      { text: '身份证号', value: 'id' },
      { text: '参保类型', value: 'type' },
      { text: '就职状态', value: 'status' },
    ],
    datum: [
      {
        sex: 0,
        name: '郑丽萍',
        sheid: '3333',
        id: '421003',
        type: '在职非公务员',
        status: '在职',
      },
    ],
  }),

  mixins: [layout],

  methods: {
    avatar(d) {
      return d === 0 ? GirlIcon : BoyIcon;
    },
  },
};
</script>

<style scoped lang="scss">
  .search-container {
    padding: 0;
    display: grid;
    grid-template-columns: 50% 50%;
    grid-gap: 2px;
    height: 100%;
  }

  .content-card {
    padding: 1rem;
  }

  p.sub-title {
    font-family:PingFangSC-Semibold;
    font-size: 18px;
    color:#262626;
    letter-spacing:0;
    text-align:left;
    font-weight: bold;
  }

  .v-input {
    margin: 10px 0;
  }

  .date-container {
    display: flex;
    border-bottom: 2px solid #eee;
    border-radius: 0;

    p {
      font-size: 1rem;
      line-height: 40px;
    }

    .v-input {
      margin: 0 10px;
    }
  }

  .custom-input {
    border-bottom: 2px solid #eee;
  }
</style>
