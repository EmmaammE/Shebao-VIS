<template>
  <div class="search-container">
    <v-card outlined class="content-card">
      <p class="she-title">筛选条件</p>
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
              :height="30"
              class="min-height"
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
              :height="30"
              class="min-height"
            ></v-text-field>
          </template>
          <v-date-picker v-model="dateEnd" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu2 = false">取消</v-btn>
            <v-btn text color="primary" @click="$refs.menu2.save(dateEnd)">保存</v-btn>
          </v-date-picker>
        </v-menu>
      </v-sheet>

      <v-sheet v-if="compType!==0" class="custom-input">
        <v-text-field
          outlined
          dense
          hide-details="true"
          v-model.trim="id"
          :height="30"
          class="min-height"
          label="身份证号、社保卡号或姓名"
        ></v-text-field>

        <div class="s-btn-container">
          <button @click="toReset">重置</button>
          <button @click="toGetData">查询</button>
        </div>
      </v-sheet>

      <v-sheet v-else class="info-inputs">
        <!-- 两个多选 -->
        <div v-for="n in 2" :key="n" class="wrapper type-container">
          <p class="text-lg-body-2">{{n === 1 ? '机构类型': '就诊类型'}}</p>
          <v-list dense>
            <v-list-item-group
              v-model="infoModel[n-1]"
              multiple
            >
              <template v-for="(item, i) in infoItems[n-1]">
                <v-divider
                  v-if="!item"
                  :key="`divider-${i}`"
                ></v-divider>

                <v-list-item
                  v-else
                  dense
                  :key="`item-${i}`"
                  :value="item"
                  active-class="primary--text text--accent-4"
                >
                  <template v-slot:default="{ active, toggle }">
                    <v-list-item-content>
                      <v-list-item-title v-text="item"></v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-checkbox
                        dense
                        :input-value="active"
                        :true-value="item"
                        color="primary accent-4"
                        @click="toggle"
                      ></v-checkbox>
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </template>
            </v-list-item-group>
          </v-list>
        </div>

        <div class="wrapper">
          <v-text-field
            dense
            outlined
            v-model="infoid"
            label="就诊人编码"
            hide-details
          ></v-text-field>

          <v-text-field
            dense
            outlined
            flat
            hide-details
            v-model="yishi"
            label="处方医师"
          ></v-text-field>

          <v-text-field
            dense
            outlined
            hide-details
            v-model="orgName"
            label="机构名称"
          ></v-text-field>
        </div>
      </v-sheet>

      <p class="she-title text-margin">数据结果</p>

      <v-data-table
        class="s-table"
        :headers="headers"
        :items="tableData"
        item-key="index"
        disable-sort
        @click:row="rowClick"
        single-select
        v-model="activeIndex"
        :options.sync="options"
        :server-items-length="totalItems"
        :loading="loading"
        :footer-props="{'disable-items-per-page':true}"
        height="70vh"
        fixed-header
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
      :compType="compType"
      @changeKey="changeKey"
    />
  </div>
</template>

<script>
import GirlIcon from '@/assets/search/icon_1.svg';
import BoyIcon from '@/assets/search/icon_2.svg';
import { fetchDoctorInfo, fetchPatientInfo, fetchInfo } from '@/util/http';
import SearchInfo from './SearchInfo.vue';

// 就诊信息查询参数中文转英文
const HASH = {
  公立医院: 'public',
  民营医院: 'private',
  零售药店: 'drugstore',
  门诊: 'men_zhen',
  住院: 'zhu_yuan',
  规定病种: 'gui_ding_bing_chuang',
  家庭病床: 'jia_ting_bing_chuang',
};

const headersData = [
  [
    // 就诊信息
    {
      align: 'center', text: '性别', value: 'xing_bie', width: 45,
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
    // 药师医师汇总
    {
      align: 'center', text: '性别', value: 'xing_bie', width: 55,
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
      align: 'center', text: '性别', value: 'xing_bie', width: 55,
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
  ]];

export default {
  name: 'Search',
  components: {
    SearchInfo,
  },
  data: () => ({
    dateBegin: new Date('2019-01-01').toISOString().substr(0, 10),
    dateEnd: new Date().toISOString().substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
    id: null,

    // 表格数据
    tableData: [
    ],
    activeIndex: [{ index: 1 }],
    activeKey: '',
    // 原始数据
    datum: {},
    people: [],

    // 表格分页设置
    loading: true,
    options: {},
    totalItems: 0,

    // 就诊信息查询条件
    // 就诊人编码 处方医师 机构名称
    infoid: null,
    yishi: null,
    orgName: null,
    infoItems: [
      ['公立医院',
        '民营医院',
        '零售药店'],
      [
        '门诊',
        '住院',
        '规定病种',
        '家庭病床',
      ],
    ],
    //  当前选中的机构类型
    infoModel: [
      ['公立医院',
        '民营医院',
        '零售药店'],
      [
        '门诊',
        '住院',
        '规定病种',
        '家庭病床',
      ],
    ],
  }),

  watch: {
    $route: 'initData',
    options: {
      handler() {
        this.getData().then((data) => {
          this.tableData = data.items;
          this.totalItems = data.total;

          // 更新选中行
          this.activeIndex = [{ index: 1 }];
        });
      },
      deep: true,
    },
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

    panel() {
      // 返回不同组件panel的信息
      switch (this.compType) {
        case 1:
          // 药师医师汇总
          return {
            // 饼图的tab栏
            menu: [
              { value: 'yi_bao_fen_lei_fu_wu_qing_kuang', text: '医保服务总列支费用' },
              { value: 'fei_yong_gou_cheng_qing_kuang', text: '费用构成' },
            ],
            // 头像旁边的小字
            info: [
              { text: '医保医师号', value: 'key' },
              { text: '服务机构', value: 'fu_wu_ji_gou_ming_cheng' },
            ],
            // 上方的数字
            header: [
              { text: '医保服务总列支费用', value: 'yi_bao_fu_wu_zong_lie_zhi_fei_yong' },
              { text: '医保服务人次数', value: 'yi_bao_fu_wu_ren_ci' },
              { text: '医保服务人数', value: 'yi_bao_fu_wu_ren_shu' },
            ],
          };
        case 2:
          // 参保人员汇总
          return {
            menu: [
              { value: 'ji_jin_lie_zhi_qing_kuang', text: '累计总医药费用' },
              { value: 'yi_liao_fei_yong', text: '累计列支费用及次数' },
              { value: 'fei_yong_gou_cheng_qing_kuang', text: '费用构成及占比' },
            ],
            header: [
              { value: 'lei_ji_zong_yi_yao_fei_yong', text: '累计总医药费用' },
              { value: 'lei_ji_lie_zhi_yi_yao_fei_yong', text: '累计列支费用' },
              { value: 'lei_ji_shua_ka_pin_ci_shu', text: '费用刷卡次数' },
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

    headers() {
      return headersData[this.compType];
    },
  },

  methods: {
    avatar(d) {
      return d === '女' ? GirlIcon : BoyIcon;
    },

    toReset() {
      this.dateBegin = new Date('2019-01-01').toISOString().substr(0, 10);
      this.dateEnd = new Date().toISOString().substr(0, 10);
      this.id = null;
    },

    toGetData() {
      this.getData().then((data) => {
        this.tableData = data.items;
        this.totalItems = data.total;

        // 更新选中行
        this.activeIndex = [{ index: 1 }];
      });
    },

    getData() {
      this.activeKey = '';
      this.loading = true;

      switch (this.compType) {
        case 1:
          return this.getDoctorInfo();
        case 2:
          return this.getPeopleInfo();
        default:
          // 3
          return this.getTreatmentInfo();
      }
    },

    initData() {
      this.toReset();
      this.tableData = [];

      this.getData().then((data) => {
        this.tableData = data.items;
        this.totalItems = data.total;

        // 更新选中行
        this.activeIndex = [{ index: 1 }];
      });
    },

    async getDoctorInfo() {
      // 药师医师汇总
      const { page } = this.options;
      const data = await fetchDoctorInfo({
        startDay: this.dateBegin,
        endDay: this.dateEnd,
        searchItem: this.id,
        pageNum: page,
      });

      const people = [];

      const items = Object.keys(data.doctor_page).map((key, index) => {
        if (index === 0) {
          this.activeKey = key;
        }

        data.doctor_page[key].ji_ben_qing_kuang.key = key;

        people.push({
          text: data.doctor_page[key].ji_ben_qing_kuang.xing_ming,
          value: {
            key,
            index: index + 1,
          },

        });
        return {
          ...data.doctor_page[key].ji_ben_qing_kuang, ...{ key, index: index + 1 },
        };
      });

      return new Promise((resolve) => {
        setTimeout(() => {
          this.loading = false;
          this.people = people;
          this.datum = data.doctor_page;

          resolve({
            items,
            total: data.total_doctor_num,
          });
        }, 1000);
      });
    },

    async getPeopleInfo() {
      const { page } = this.options;

      const data = await fetchPatientInfo({
        startDay: this.dateBegin,
        endDay: this.dateEnd,
        searchItem: this.id,
        pageNum: page,
      });

      this.datum = data.patient_page;
      const people = [];

      const items = Object.keys(data.patient_page).map((key, index) => {
        if (index === 0) {
          this.activeKey = key;
        }
        people.push({
          text: data.patient_page[key].ji_ben_qing_kuang.name,
          value: {
            key,
            index: index + 1,
          },
        });
        return { ...data.patient_page[key].ji_ben_qing_kuang, ...{ index: index + 1, key } };
      });

      return new Promise((resolve) => {
        setTimeout(() => {
          this.loading = false;
          this.people = people;

          resolve({
            items,
            total: data.total_patient_num,
          });
        }, 1000);
      });
    },

    async getTreatmentInfo() {
      const { page } = this.options;

      const data = await fetchInfo({
        startDay: this.dateBegin,
        endDay: this.dateEnd,
        searchItem: this.id,
        pageNum: page,
        orgType: this.infoModel[0].map((d) => HASH[d]),
        treatmentType: this.infoModel[1].map((d) => HASH[d]),
        patientId: this.infoid,
        doctorName: this.yishi,
        orgName: this.orgName,
      });

      const people = [];
      this.datum = data.treatment_page;
      const items = Object.keys(data.treatment_page).map((key, index) => {
        if (index === 0) {
          this.activeKey = key;
        }
        people.push({
          text: data.treatment_page[key].jiu_zhen_ren.name,
          value: key,
          index: index + 1,
        });
        return { ...data.treatment_page[key].ji_ben_qing_kuang, ...{ index: index + 1, key } };
      });

      // if (itemsPerPage > 0) {
      //   items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
      // }

      return new Promise((resolve) => {
        setTimeout(() => {
          this.loading = false;
          this.people = people;

          resolve({
            items,
            total: data.treatment_num,
          });
        }, 1000);
      });
    },

    rowClick(item, row) {
      row.select(true);
      this.activeIndex = [{ index: item.index }];
      this.activeKey = item.key;
    },

    changeKey(e) {
      this.activeKey = e.key;
      this.activeIndex = [{ index: e.index }];
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

    p {
      margin: 0;
    }
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
    border-bottom: 2px solid #ccc;
    border-radius: 0;
    align-items: center;

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
    border-bottom: 2px solid #ccc;
    display: flex;
    align-items: center;
  }

  .custom-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .v-data-table {
    height: 30vh;
    flex: 1 1 60%;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  // 就诊信息查询的条件
  .info-inputs {
    .wrapper {
      display: flex;
      border-bottom: 2px solid #ccc;
      align-items: center;

      p {
        margin: 0;
      }

      .v-list {
        padding: 0;
      }
      .v-list-item-group {
        display: flex;
      }

      .v-text-field {
        margin-right: 10px;
      }
    }
  }
</style>
