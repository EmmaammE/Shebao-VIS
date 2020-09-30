// 机构预算预警
const header = [
  { text: '序号' },
  { text: '机构名称' },
  {
    text: '普通门诊人次人头比',
    children: [
      { text: '预算' },
      { text: '实际' },
    ],
  },
  {
    text: '普通门诊均次费用',
    children: [
      { text: '预算' },
      { text: '实际' },
    ],
  },
  {
    text: '规定病种人头人次比',
    children: [
      { text: '预算' },
      { text: '实际' },
    ],
  },
  {
    text: '规定病种均次费用',
    children: [
      { text: '预算' },
      { text: '实际' },
    ],
  },
  {
    text: '家庭病床人头人次比',
    children: [
      { text: '预算' },
      { text: '实际' },
    ],
  },
  {
    text: '家庭病床均次费用',
    children: [
      { text: '预算' },
      { text: '实际' },
    ],
  },
  {
    text: '购药人头人次比',
    children: [
      { text: '预算' },
      { text: '实际' },
    ],
  },
  {
    text: '购药均次费用',
    children: [
      { text: '预算' },
      { text: '实际' },
    ],
  },
  {
    text: '月度普通门诊总额',
    children: [
      { text: '预算' },
      { text: '实际' },
    ],
  },
  {
    text: '月度规定病种总额',
    children: [
      { text: '预算' },
      { text: '实际' },
    ],
  },
  {
    text: '月度住院总额',
    children: [
      { text: '预算' },
      { text: '实际' },
    ],
  },
  {
    text: '月度家庭病床总额',
    children: [
      { text: '预算' },
      { text: '实际' },
    ],
  },
  {
    text: '月度药店购药总额',
    children: [
      { text: '预算' },
      { text: '实际' },
    ],
  },

  {
    text: '年度普通门诊总额',
    children: [
      { text: '预算' },
      { text: '实际' },
    ],
  },
  {
    text: '年度规定病种总额',
    children: [
      { text: '预算' },
      { text: '实际' },
    ],
  },
  {
    text: '年度住院总额',
    children: [
      { text: '预算' },
      { text: '实际' },
    ],
  },
  {
    text: '年度家庭病床总额',
    children: [
      { text: '预算' },
      { text: '实际' },
    ],
  },
  {
    text: '年度药店购药总额',
    children: [
      { text: '预算' },
      { text: '实际' },
    ],
  },
];

const leavesOrigin = [
  { text: '序号', value: 'index', prefix: [] },
  { text: '机构名称', value: 'ji_gou_ming_cheng', prefix: [] },

  // 普通门诊人次人头比
  {
    text: '预算',
    value: 'yu_suan',
    prefix: [
      'ren_tou_ren_ci_bi', 'pu_tong_men_zhen',
    ],
  },
  {
    text: '实际',
    value: 'shi_ji',
    prefix: [
      'ren_tou_ren_ci_bi', 'pu_tong_men_zhen',
    ],
  },

  // 普通门诊均次费用
  {
    text: '预算',
    value: 'yu_suan',
    prefix: [
      'jun_ci_fei_yong', 'pu_tong_men_zhen',
    ],
  },
  {
    text: '实际',
    value: 'shi_ji',
    prefix: [
      'jun_ci_fei_yong', 'pu_tong_men_zhen',
    ],
  },

  // 规定病种人头人次比
  {
    text: '预算',
    value: 'yu_suan',
    prefix: [
      'ren_tou_ren_ci_bi', 'gui_ding_bing_zhong',
    ],
  },
  {
    text: '实际',
    value: 'shi_ji',
    prefix: [
      'ren_tou_ren_ci_bi', 'gui_ding_bing_zhong',
    ],
  },

  // 规定病种均次费用
  {
    text: '预算',
    value: 'yu_suan',
    prefix: [
      'jun_ci_fei_yong', 'gui_ding_bing_zhong',
    ],
  },
  {
    text: '实际',
    value: 'shi_ji',
    prefix: [
      'jun_ci_fei_yong', 'gui_ding_bing_zhong',
    ],
  },

  // 家庭病床-人头人次比
  {
    text: '预算',
    value: 'yu_suan',
    prefix: [
      'ren_tou_ren_ci_bi', 'jia_ting_bing_chuang',
    ],
  },
  {
    text: '实际',
    value: 'shi_ji',
    prefix: [
      'ren_tou_ren_ci_bi', 'jia_ting_bing_chuang',
    ],
  },

  // 家庭病床-均次费用
  {
    text: '预算',
    value: 'yu_suan',
    prefix: [
      'jun_ci_fei_yong', 'jia_ting_bing_chuang',
    ],
  },
  {
    text: '实际',
    value: 'shi_ji',
    prefix: [
      'jun_ci_fei_yong', 'jia_ting_bing_chuang',
    ],
  },

  // 购药-人头人次比
  {
    text: '预算',
    value: 'yu_suan',
    prefix: [
      'ren_tou_ren_ci_bi', 'gou_yao',
    ],
  },
  {
    text: '实际',
    value: 'shi_ji',
    prefix: [
      'ren_tou_ren_ci_bi', 'gou_yao',
    ],
  },

  // 购药-均次费用
  {
    text: '预算',
    value: 'yu_suan',
    prefix: [
      'jun_ci_fei_yong', 'gou_yao',
    ],
  },
  {
    text: '实际',
    value: 'shi_ji',
    prefix: [
      'jun_ci_fei_yong', 'gou_yao',
    ],
  },

  // '月度普通门诊总额',
  { text: '预算', value: 'yu_suan', prefix: ['pu_tong_men_zhen'] },
  { text: '实际', value: 'shi_ji', prefix: ['pu_tong_men_zhen'] },
  //  '月度规定病种总额',
  { text: '预算', value: 'yu_suan', prefix: ['gui_ding_bing_zhong'] },
  { text: '实际', value: 'shi_ji', prefix: ['gui_ding_bing_zhong'] },
  //  '月度住院总额',
  { text: '预算', value: 'yu_suan', prefix: ['zhu_yuan'] },
  { text: '实际', value: 'shi_ji', prefix: ['zhu_yuan'] },

  // '月度家庭病床总额',
  { text: '预算', value: 'yu_suan', prefix: ['jia_ting_bing_chuang'] },
  { text: '实际', value: 'shi_ji', prefix: ['jia_ting_bing_chuang'] },

  // '月度药店购药总额',
  { text: '预算', value: 'yu_suan', prefix: ['yao_dian'] },
  { text: '实际', value: 'shi_ji', prefix: ['yao_dian'] },

  // 年度指标
  {
    text: '预算',
    value: 'yu_suan',
    prefix: [
      'nian_du_zhi_biao', 'pu_tong_men_zhen',
    ],
  },
  {
    text: '实际',
    value: 'shi_ji',
    prefix: [
      'nian_du_zhi_biao', 'pu_tong_men_zhen',
    ],
  },
  // 年度指标
  {
    text: '预算',
    value: 'yu_suan',
    prefix: [
      'nian_du_zhi_biao', 'gui_ding_bing_zhong',
    ],
  },
  {
    text: '实际',
    value: 'shi_ji',
    prefix: [
      'nian_du_zhi_biao', 'gui_ding_bing_zhong',
    ],
  },
  // 年度指标
  {
    text: '预算',
    value: 'yu_suan',
    prefix: [
      'nian_du_zhi_biao', 'zhu_yuan',
    ],
  },
  {
    text: '实际',
    value: 'shi_ji',
    prefix: [
      'nian_du_zhi_biao', 'zhu_yuan',
    ],
  },
  // 年度指标
  {
    text: '预算',
    value: 'yu_suan',
    prefix: [
      'nian_du_zhi_biao', 'jia_ting_bing_chuang',
    ],
  },
  {
    text: '实际',
    value: 'shi_ji',
    prefix: [
      'nian_du_zhi_biao', 'jia_ting_bing_chuang',
    ],
  },
  // 年度指标
  {
    text: '预算',
    value: 'yu_suan',
    prefix: [
      'nian_du_zhi_biao', 'yao_dian',
    ],
  },
  {
    text: '实际',
    value: 'shi_ji',
    prefix: [
      'nian_du_zhi_biao', 'yao_dian',
    ],
  },
];

const handleData = (data) => {
  const resArr = [];

  Object.keys(data).forEach((key, index) => {
    const res = {};

    const d = data[key];
    let a;
    leavesOrigin.forEach((leave, j) => {
      switch (j) {
        case 0:
          res[leave.value] = index + 1;
          break;

        case 1:
          res[leave.value] = d[leave.value];
          break;

        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 21:
        case 22:
        case 23:
        case 24:
        case 25:
        case 26:
        case 27:
          a = 0;
          Object.values(d.yue_du_zhi_biao)
            .forEach((value) => {
              if (value[leave.prefix[0]]) {
                a += value[leave.prefix[0]][leave.value];
              }
            });
          res[leave.value + leave.prefix[0]] = a;
          break;

        default:
          if (d[leave.prefix[0]][leave.prefix[1]]) {
            res[leave.value + leave.prefix.join('')] = d[leave.prefix[0]][leave.prefix[1]][leave.value];
          }
      }
    });

    resArr.push(res);
  });

  return resArr;
};

const leaves = leavesOrigin.map((leave) => ({
  text: leave.text,
  value: leave.value + leave.prefix.join(''),
  prefix: leave.prefix,
  value2: leave.value,
}));

export {
  header,
  leaves,
  handleData,
};
