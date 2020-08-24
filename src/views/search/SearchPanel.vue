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
        class="s-table"
        :headers="headers"
        :items="tableData"
        item-key="index"
        disable-sort
        hide-default-header
        @click:row="rowClick"
        single-select
        v-model="activeIndex"
      >
        <template v-slot:[`item.xing_bie`]="{ item }">
          <div class="custom-avatar">
            <component :is="avatar(item.xing_bie)"
              width="45"
              height="45"
            >
            </component>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <search-info
      :data="datum?datum[activeKey]:{}"
      v-bind="panel"
      :people="people"
    />
  </div>
</template>

<script>
import GirlIcon from '@/assets/search/icon_1.svg';
import BoyIcon from '@/assets/search/icon_2.svg';
import { fetchDoctorInfo, fetchPatientInfo, fetchInfo } from '@/util/http';
import SearchInfo from './SearchInfo.vue';

export default {
  name: 'Search',
  components: {
    SearchInfo,
  },
  data: () => ({
    dateBegin: new Date().toISOString().substr(0, 10),
    dateEnd: new Date().toISOString().substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
    id: null,
    pageNum: 1,
    headersData: [
      [
        // 就诊信息
        {
          align: 'center', text: '性别', value: 'xing_bie',
        }, {
          align: 'center', text: '序号', value: 'index',
        }, {
          align: 'center', text: '姓名', value: 'name',
        }, {
          align: 'center', text: '社保编号', value: 'she_bao_bian_hao',
        }, {
          align: 'center', text: '身份证号', value: 'shen_fen_zheng_hao',
        }, {
          align: 'center', text: '参保类别', value: 'can_bao_lei_xing',
        }, {
          align: 'center', text: '就诊状态', value: 'jiu_zhi_zhuang_tai',
        },
      ], [
        {
          align: 'center', text: '性别', value: 'xing_bie',
        }, {
          align: 'center', text: '序号', value: 'index',
        }, {
          align: 'center', text: '姓名', value: 'xing_ming',
        }, {
          align: 'center', text: '社保编号', value: 'key',
        }, {
          align: 'center', text: '服务机构名称', value: 'fu_wu_ji_gou_ming_cheng',
        },
      ], [
        {
          align: 'center', text: '性别', value: 'xing_bie',
        }, {
          align: 'center', text: '序号', value: 'index',
        }, {
          align: 'center', text: '姓名', value: 'name',
        }, {
          align: 'center', text: '社保编号', value: 'she_bao_bian_hao',
        }, {
          align: 'center', text: '身份证号', value: 'shen_fen_zheng_hao',
        }, {
          align: 'center', text: '参保类别', value: 'can_bao_lei_xing',
        }, {
          align: 'center', text: '就诊状态', value: 'jiu_zhi_zhuang_tai',
        },
      ]],
    // 表格数据
    tableData: [
    ],
    activeIndex: [{ index: 1 }],
    activeKey: '',
    // 原始数据
    datum: {},
    people: [],
  }),

  mounted() {
    this.getData();
  },

  watch: {
    $route: 'getData',
  },

  computed: {
    compType() {
      const { routeType } = this.$route.params;
      switch (routeType) {
        case 'people':
          return 2;
        case 'doctor':
          return 1;
        case 'info':
          return 0;
        default:
          return 3;
      }
    },
    // header() {
    //   switch (this.compType) {
    //     case 1:
    //       return ['医疗费用']
    //     case 2:
    //     default:
    //       return
    //   }
    // },
    headers() {
      return this.headersData[this.compType];
    },
    panel() {
      // 返回不同组件panel的信息
      switch (this.compType) {
        case 1:
          // 药师医师汇总
          return {
            menu: [
              { value: 'yi_bao_fen_lei', text: '医保分类' },
              { value: 'fei_yong_gou_cheng_qing_kuang', text: '费用构成' },
            ],
            info: [
              { text: '就职状态', value: 'jiu_zhi_zhuang_tai' },
              { text: '参保类别', value: 'can_bao_lei_xing' },
              { text: '身份证号', value: 'shen_fen_zheng_hao' },
              { text: '社保编号', value: 'she_bao_bian_hao' },
            ],
            header: [
              { text: '就职状态', value: 'jiu_zhi_zhuang_tai' },
              { text: '医保服务人次数', value: 'shen_fen_zheng_hao' },
              { text: '医保服务人数', value: 'yi_bao_fu_wu_ren_shu' },
            ],
          };
        case 2:
          // 参保人员汇总
          return {
            menu: [
              { value: 'yi_liao_fei_yong', text: '医疗费用' },
              { value: 'fei_yong_gou_cheng_qing_kuang', text: '费用构成' },
              { value: 'ji_jin_lie_zhi_qing_kuang', text: '基金列支' },
            ],
            info: [
              { text: '就职状态', value: 'jiu_zhi_zhuang_tai' },
              { text: '参保类别', value: 'can_bao_lei_xing' },
              { text: '身份证号', value: 'shen_fen_zheng_hao' },
              { text: '社保编号', value: 'she_bao_bian_hao' },
            ],
          };
        default:
          return {

          };
      }
    },
  },

  methods: {
    avatar(d) {
      return d === '女' ? GirlIcon : BoyIcon;
    },

    getData() {
      this.activeKey = '';
      switch (this.compType) {
        case 1:
          this.getDoctorInfo();
          break;
        case 2:
          this.getPeopleInfo();
          break;
        default:
      }
    },

    async getDoctorInfo() {
      const data = await fetchDoctorInfo({
        startDay: this.dateBegin,
        endDay: this.dateEnd,
        searchItem: this.id,
        pageNum: this.pageNum,
      });

      this.datum = data.patient_page;

      this.tableData = Object.keys(data.doctor_page).map((key, index) => {
        if (index === 0) {
          this.activeKey = key;
        }
        return {
          ...data.doctor_page[key], ...{ key, index: index + 1 },
        };
      });
    },

    async getPeopleInfo() {
      const data = await fetchPatientInfo({
        startDay: this.dateBegin,
        endDay: this.dateEnd,
        searchItem: this.id,
        pageNum: this.pageNum,
      });

      const people = [];
      this.datum = data.patient_page;
      this.tableData = Object.keys(data.patient_page).map((key, index) => {
        if (index === 0) {
          this.activeKey = key;
        }
        people.push({
          text: data.patient_page[key].ji_ben_qing_kuang.name,
          value: key,
          index: index + 1,
        });
        return { ...data.patient_page[key].ji_ben_qing_kuang, ...{ index: index + 1, key } };
      });

      this.people = people;
      // this.datum = Object.keys1data.patient_page).map((key, index) => (
      //   {...data.}
      // ));
    },
    async getTreatmentInfo() {
      const data = await fetchInfo({
        startDay: this.dateBegin,
        endDay: this.dateEnd,
        searchItem: this.id,
        pageNum: this.pageNum,
        //       orgType: 机构类型(列表)

        // treatmentType: 就诊类型

        // patientId: 就诊人编码

        // doctorName: 处方医师

        // orgName: 机构名称,

      });
    },
    rowClick(item, row) {
      row.select(true);
      this.activeIndex = [{ index: item.index }];
      this.activeKey = item.key;
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
    padding: 10px 10px 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
  }

  p.sub-title {
    font-family:PingFangSC-Semibold;
    font-size: $chart-title;
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
      font-size: $sub-title;
      line-height: 40px;
      color: $she-grey;
    }

    .v-input {
      margin: 0 10px;
    }
  }

  .custom-input {
    border-bottom: 2px solid #eee;
  }

  .custom-avatar {
    display: flex;
  }

  .v-data-table {
    height: 30vh;
    flex: 1 1 60%;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;

  }
</style>
