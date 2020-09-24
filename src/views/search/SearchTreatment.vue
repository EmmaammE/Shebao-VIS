<template>
  <div class="search-container treatment">
    <v-card outlined class="content-card">

      <div class="card-condition">
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

        <v-sheet class="info-inputs">
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
              v-model.trim="infoid"
              label="就诊人编码"
              hide-details
              :height="30"
              class="min-height"
            ></v-text-field>

            <v-text-field
              dense
              outlined
              flat
              hide-details
              v-model.trim="yishi"
              label="处方医师"
              :height="30"
              class="min-height"
            ></v-text-field>

            <v-text-field
              dense
              outlined
              hide-details
              v-model.trim="orgName"
              label="机构名称"
              :height="30"
              class="min-height"
            ></v-text-field>

            <div class="s-btn-container">
              <button @click="reset">重置</button>
              <button @click="toGetData">查询</button>
            </div>
          </div>
        </v-sheet>

        <p class="she-title text-margin">数据结果</p>
      </div>

      <div class="table-wrapper">
        <v-data-table
          class="s-table"
          :headers="headersData"
          :items="tableData"
          item-key="index"
          disable-sort
          single-expand
          @click:row="rowClick"
          single-select
          v-model="activeIndex"
          :options.sync="options"
          :server-items-length="totalItems"
          :loading="loading"
          :footer-props="{'disable-items-per-page':true}"
          show-expand
          dense
          fixed-header
          height="45vh"
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

          <template v-slot:expanded-item="{ item }">
            <td :colspan="10" class="expand-content">
              <div class="expand-content">
                <div class="outer">
                  <div v-for="(d,i) in expandHeader"
                    class="pie-wrapper"
                    :key="i"
                  >
                    <p>{{d.text}}:{{item[d.value]}}（元）</p>
                    <div class="radio-group">
                      <div
                        v-for="(inner,index) in d.values"
                        :key="index"
                        class="radio"
                      >
                        <input type="radio" class="radio-btn" :name="inner"/>
                        <label class="label">
                          <span :style="
                            {background:
                              colorScale(d.keys.length)
                              (pieChartData(item, d).colorHash[d.keys[index]])
                              || '#efefef'}"
                            ></span>
                          {{inner}}</label>
                      </div>
                    </div>

                    <pie-chart
                      v-bind="pieChartData(item, d)"
                      :type="0"
                    />
                  </div>
                </div>
              </div>
            </td>
          </template>
        </v-data-table>
      </div>
    </v-card>
  </div>
</template>

<script>
import { fetchInfo } from '@/util/http';
import GirlIcon from '@/assets/search/icon_1.svg';
import BoyIcon from '@/assets/search/icon_2.svg';
import * as d3 from 'd3';
import PieChart from './PieChart.vue';

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

export default {
  // 就诊信息
  components: {
    PieChart,
  },

  data: () => ({
    dateBegin: new Date('2019-01-01').toISOString().substr(0, 10),
    dateEnd: new Date().toISOString().substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
    id: null,
    headersData: [
      // 就诊信息
      {
        align: 'center', text: '性别', value: 'xing_bie',
      }, {
        align: 'center', text: '序号', value: 'index',
      },
      {
        align: 'center', text: '就诊人编码', value: 'jiu_zhen_ren_bian_ma',
      }, {
        align: 'center', text: '就诊人名称', value: 'jiu_zhen_ren_ming_cheng',
      }, {
        align: 'center', text: '就诊人流水号', value: 'jiu_zhen_ren_liu_shui_hao', width: 150,
      }, {
        align: 'center', text: '单据号', value: 'dan_ju_hao', width: 150,
      },
      {
        align: 'center', text: '费用情况', value: 'data-table-expand', width: 100,
      }, {
        align: 'center', text: '疾病名称', value: 'ji_bing_ming_cheng',
      }, {
        align: 'center', text: '疾病编号', value: 'ji_bing_bian_hao', width: 100,
      },
      {
        align: 'center', text: '结算流水号', value: 'key',
      },
      {
        align: 'center', text: '科室名称', value: 'ke_shi_ming_cheng',
      }, {
        align: 'center', text: '就诊类型', value: 'jiu_zhen_lei_xing',
      }, {
        align: 'center', text: '医师姓名', value: 'yi_shi_xing_ming',
      }, {
        align: 'center', text: '医师编号', value: 'yi_shi_bian_hao',
      }, {
        align: 'center', text: '机构名称', value: 'ji_gou_ming_cheng',
      }, {
        align: 'center', text: '机构编码', value: 'ji_gou_bian_ma',
      }, {
        align: 'center', text: '机构等级', value: 'ji_gou_deng_ji',
      }, {
        align: 'center', text: '机构类型', value: 'ji_gou_lei_xing',
      }, {
        align: 'center', text: '机构地域', value: 'ji_gou_di_yu',
      },

    ],
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
      [
        '公立医院',
        '民营医院',
        '零售药店',
      ],
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
    // 表格展开的数据
    expandHeader: [
      {
        text: '总报销费用',
        value: 'zong_bao_xiao_jin_e',
        keys: [
          'tong_chou_zhi_chu',
          'da_e_zhi_fu_jin_e',
          'zhang_hu_zhi_fu',
          'kun_nan_jiu_zhu_ji_jin_zhi_chu',
          // TODO  缺少现金支付
        ],
        values: [
          '统筹支出',
          '大额支付',
          '账户支付',
          '困难救助基金',
          '现金支付',
        ],
      },
      {
        text: '医疗费用综合',
        value: 'yi_liao_fei_yong_zong_he',
        keys: [
          'yao_pin_fei_yong',
          'zhen_liao_xiang_mu_fei_yong',
          'cai_liao_fei_yong',
          // 直接计算？
          // 'qi_ta',
        ],
        values: [
          '药品',
          '诊疗项目',
          '材料',
          '其他',
        ],
      },
      {
        text: '个人现金支付',
        value: '',
        keys: [
          'zi_fei_fei_yong',
          'zi_li_fei_yong',
          // zi_fu_fei_yong
        ],
        values: [
          '自负',
          '自费',
          '自理',
        ],
      },
    ],
  }),

  watch: {
    $route: 'getData',
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

  methods: {
    avatar(d) {
      return d === '女' ? GirlIcon : BoyIcon;
    },

    toGetData() {
      this.getData().then((data) => {
        this.tableData = data.items;
        this.totalItems = data.total;

        // 更新选中行
        this.activeIndex = [{ index: 1 }];
      });
    },

    reset() {
      this.dateBegin = new Date('2019-01-01').toISOString().substr(0, 10);
      this.dateEnd = new Date().toISOString().substr(0, 10);
      // 就诊人编码 处方医师 机构名称
      this.infoid = null;
      this.yishi = null;
      this.orgName = null;
      this.infoModel = [
        ['公立医院',
          '民营医院',
          '零售药店'],
        [
          '门诊',
          '住院',
          '规定病种',
          '家庭病床',
        ],
      ];
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

    pieChartData(item, d) {
      const values = [];
      const colorHash = {};
      d.keys.forEach((key, j) => {
        if (item[key] && (+item[key]) > 0) {
          values.push({
            text: d.values[j],
            value: +item[key],
          });
          colorHash[key] = values.length - 1;
        }
      });

      // console.log(colorHash);
      return {
        colorScale: this.colorScale(values.length),
        data: values,
        colorHash,
      };
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

        return {
          ...data.treatment_page[key].chu_fang_yi_shi,
          ...data.treatment_page[key].fei_yong,
          ...data.treatment_page[key].ji_bing,
          ...data.treatment_page[key].ji_gou,
          ...data.treatment_page[key].jiu_zhen_ren,
          ...{
            index: index + 1,
            key,
            jiu_zhen_lei_xing: data.treatment_page[key].jiu_zhen_lei_xing,
            ke_shi_ming_cheng: data.treatment_page[key].ke_shi_ming_cheng,
          },
        };
      });

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

    colorScale(size) {
      return d3.scaleLinear()
        .range(['#5d77ff', '#889aff', '#a7b5ff', '#c8d0ff', '#d1d7f9'])
        .domain(d3.ticks(0, size, 5));
    },
  },

};
</script>

<style scoped lang="scss">
  .search-container {
    padding: 0;
    height: 100%;

    p {
      margin: 0;
    }
  }

  .card-condition {
    width: 60%;
  }

  .content-card {
    padding: 10px 10px 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    min-height: calc(100vh - 70px);
  }

  .v-input {
    margin: 10px 0;
    font-size: 0.8rem;
  }

  .date-container {
    display: flex;
    border-bottom: 2px solid #ccc;
    border-radius: 0;
    align-items: center;
    padding-bottom: 5px;

    p {
      font-size: $sub-title;
      line-height: 40px;
      color: $she-grey;
      margin: 0;
    }

    .v-input {
      margin: 4px 10px;
    }
  }

  .custom-input {
    border-bottom: 2px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .custom-avatar {
    display: flex;
    justify-content: center;
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

  .treatment {
    .table-wrapper {
      width: 80vw;
      // height: 50vh;
      // overflow: auto;
    }
    .expand-content {
      height: 45vh;
      padding: 10px;

      p {
        margin: 0;
        font-size: 1rem;
        font-weight: 400;
      }

      .outer {
        display: flex;
        justify-content: center;
        align-items: center;

        .pie-wrapper{
          flex: 1 1 33%;
          margin: 0 4px;

          svg {
            .line {
              fill: none;
            }
          }
       }
      }

    }
  }
</style>
