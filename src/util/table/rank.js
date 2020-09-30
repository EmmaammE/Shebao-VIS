// 表格的表头
const header = [
  { text: '序号' },
  {
    text: '机构基本情况',
    children: [
      { text: '机构名称' },
      { text: '机构编码' },
      { text: '地址' },
    ],
  },
  {
    text: '医疗费用发生情况',
    children: [
      {
        text: '医药费用发生总体情况',
        children: [
          { text: '累计总医药费用发生数' },
          { text: '列支医药费用发生数' },
          { text: '总人头' },
          { text: '总人次' },
          { text: '人次人头比' },
          { text: '人均列支费用（元）' },
          { text: '次均列支费用(元)' },
        ],
      },
      {
        text: '按就诊类别分类情况',
        children: [
          {
            text: '住院情况',
            children: [
              { text: '列支费用' },
              { text: '人头数' },
              { text: '人次数' },
              { text: '人均费用' },
              { text: '均次费用' },
            ],
          },
          {
            text: '门诊情况',
            children: [
              { text: '列支费用' },
              { text: '人头数' },
              { text: '人次数' },
              { text: '人均费用' },
              { text: '均次费用' },
            ],
          },
          {
            text: '规定病种情况',
            children: [
              { text: '列支费用' },
              { text: '人头数' },
              { text: '人次数' },
              { text: '人均费用' },
              { text: '均次费用' },
            ],
          },
          {
            text: '家庭病床情况',
            children: [
              { text: '列支费用' },
              { text: '人头数' },
              { text: '人次数' },
              { text: '人均费用' },
              { text: '均次费用' },
            ],
          },
        ],
      },
      {
        text: '按费用结构分类情况',
        children: [
          { text: '化验费及占比' },
          { text: '检查费及占比' },
          { text: '中医治疗费及占比' },
          { text: '物理治疗费及占比' },
          { text: '手术费及占比' },
          {
            text: '药品费及占比',
            children: [
              { text: '西药费及占比' },
              { text: '中成药费及占比' },
              { text: '中草药及占比' },
            ],
          },
          { text: '材料费及占比' },
          { text: '其他及占比' },
        ],
      },
    ],
  },
  {
    text: '总报销支出费用',
    children: [
      {
        text: '个人账户',
        children: [
          { text: '本年账户' },
          { text: '历年账户' },
        ],
      },
      { text: '统筹账户' },
      { text: '大病保险' },
      { text: '救助基金' },
      { text: '基金支付比例' },
    ],
  },
  {
    text: '个人现金支付',
    children: [
      { text: '现金支付总额' },
      { text: '现金支付比例' },
    ],
  },
];

const leaves = [
  { text: '序号', value: 'index' },
  { text: '机构名称', value: 'ji_gou_ming_cheng' },
  { text: '机构编码', value: 'key' },
  { text: '地址', value: 'di_zhi' },

  { text: '累计总医药费用发生数', value: 'lei_ji_zong_yi_yao_fei_yong' },
  { text: '列支医药费用发生数', value: 'lei_ji_lie_zhi_yi_yao_fei_yong' },
  { text: '总人头', value: 'zong_ren_tou' },
  { text: '总人次', value: 'zong_ren_ci' },
  { text: '人次人头比', value: 'ren_tou_ren_ci_bi' },
  { text: '人均列支费用（元）', value: 'ren_jun_lie_zhi_fei_yong' },
  { text: '次均列支费用(元)', value: 'ci_jun_lie_zhi_fei_yong' },

  { text: '列支费用', value: 'lie_zhi_fei_yong', prefix: 'zhu_yuan' },
  { text: '人头数', value: 'ren_tou_shu', prefix: 'zhu_yuan' },
  { text: '人次数', value: 'ren_ci_shu', prefix: 'zhu_yuan' },
  { text: '人均费用', value: 'ren_jun_fei_yong', prefix: 'zhu_yuan' },
  { text: '均次费用', value: 'jun_ci_fei_yong', prefix: 'zhu_yuan' },

  { text: '列支费用', value: 'lie_zhi_fei_yong', prefix: 'men_zhen' },
  { text: '人头数', value: 'ren_tou_shu', prefix: 'men_zhen' },
  { text: '人次数', value: 'ren_ci_shu', prefix: 'men_zhen' },
  { text: '人均费用', value: 'ren_jun_fei_yong', prefix: 'men_zhen' },
  { text: '均次费用', value: 'jun_ci_fei_yong', prefix: 'men_zhen' },

  { text: '列支费用', value: 'lie_zhi_fei_yong', prefix: 'gui_ding_bing_zhong' },
  { text: '人头数', value: 'ren_tou_shu', prefix: 'gui_ding_bing_zhong' },
  { text: '人次数', value: 'ren_ci_shu', prefix: 'gui_ding_bing_zhong' },
  { text: '人均费用', value: 'ren_jun_fei_yong', prefix: 'gui_ding_bing_zhong' },
  { text: '均次费用', value: 'jun_ci_fei_yong', prefix: 'gui_ding_bing_zhong' },

  { text: '列支费用', value: 'lie_zhi_fei_yong', prefix: 'jia_ting_bing_chuang' },
  { text: '人头数', value: 'ren_tou_shu', prefix: 'jia_ting_bing_chuang' },
  { text: '人次数', value: 'ren_ci_shu', prefix: 'jia_ting_bing_chuang_ting_bing_chuang' },
  { text: '人均费用', value: 'ren_jun_fei_yong', prefix: 'jia_ting_bing_chuang' },
  { text: '均次费用', value: 'jun_ci_fei_yong', prefix: 'jia_ting_bing_chuang' },

  { text: '化验费及占比', value: 'hua_yan_fei' },
  { text: '检查费及占比', value: 'jian_cha_fei' },
  { text: '中医治疗费及占比', value: 'zhong_yi_zhi_liao_fei' },
  { text: '物理治疗费及占比', value: 'wu_li_zhi_liao_fei' },
  { text: '手术费及占比', value: 'shou_shu_fei' },

  { text: '西药费及占比', value: 'xi_yao_fei' },
  { text: '中成药费及占比', value: 'zhong_cheng_yao_fei' },
  { text: '中草药及占比', value: 'zhong_cao_yao_fei' },

  { text: '材料费及占比', value: 'cai_liao_fei' },
  { text: '其他及占比', value: 'qi_ta' },

  { text: '本年账户', value: 'ben_nian_zhang_hu' },
  { text: '历年账户', value: 'li_nian_zhang_hu' },

  { text: '统筹账户', value: 'tong_chou_zhang_hu' },
  { text: '大病保险', value: 'da_bing_bao_xian' },
  { text: '救助基金', value: 'jiu_zhu_ji_jin' },
  { text: '基金支付比例', value: 'ji_jin_zhi_fu_bi_li' },

  { text: '现金支付总额', value: 'xian_jin_zhi_fu_zong_e' },
  { text: '现金支付比例', value: 'xian_jin_zhi_fu_bi_li' },
];

// data:原始数据
const handleData = (data) => {
  const resArr = [];
  let tmp;

  Object.keys(data).forEach((key, index) => {
    const res = {};

    const d = data[key];
    leaves.forEach((leave, j) => {
      switch (j) {
        case 0:
          // 序号
          res[leave.value] = index + 1;
          break;

        case 1:
        case 3:
          // 基本情况
          res[leave.value] = d.ji_ben_qing_kuang[leave.value];
          break;

        case 2:
          // 机构编码
          res[leave.value] = key;
          break;

        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
          // 医疗费用
          res[leave.value] = d.yi_liao_fei_yong[leave.value];
          break;

        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
          // 住院情况
          res[leave.value] = d.yi_liao_fei_yong.zhu_yuan_qing_kuang[leave.value];
          break;

        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
          // 门诊情况
          res[leave.value + leave.prefix] = d.yi_liao_fei_yong.men_zhen_qing_kuang[leave.value];
          leave.value += leave.prefix;
          break;

        case 21:
        case 22:
        case 23:
        case 24:
        case 25:
          // 规定病种情况
          res[leave.value + leave.prefix] = d.yi_liao_fei_yong
            .gui_ding_bing_zhong_qing_kuang[leave.value];
          leave.value += leave.prefix;
          break;

        case 26:
        case 27:
        case 28:
        case 29:
        case 30:
          // 家庭病床情况
          res[leave.value + leave.prefix] = d.yi_liao_fei_yong
            .jia_ting_bing_chuang_qing_kuang[leave.value];
          leave.value += leave.prefix;
          break;

        case 31:
        case 32:
        case 33:
        case 34:
        case 35:
          // 化验费 检查费 中医 物理 手术费
          tmp = d.fei_yong_gou_cheng_qing_kuang.zhen_liao_xiang_mu[leave.value];
          res[leave.value] = `${tmp.value}/${tmp.ratio === null ? '0.00' : tmp.ratio}`;
          break;

        case 36:
        case 37:
        case 38:
          // 药品费
          tmp = d.fei_yong_gou_cheng_qing_kuang.yao_pin_fei[leave.value];
          res[leave.value] = `${tmp.value}/${tmp.ratio === null ? '0.00' : tmp.ratio}`;
          break;

        case 39:
        case 40:
          // 材料费和其他
          tmp = d.fei_yong_gou_cheng_qing_kuang[leave.value];
          res[leave.value] = `${tmp.value}/${tmp.ratio === null ? '0.00' : tmp.ratio}`;
          break;

        case 41:
        case 42:
          // 个人账户
          res[leave.value] = d.zong_bao_xiao_zhi_chu_fei_yong.ge_ren_zhang_hu[leave.value];
          break;

        case 43:
        case 44:
        case 45:
        case 46:
          // 总报销支出费用
          res[leave.value] = d.zong_bao_xiao_zhi_chu_fei_yong[leave.value];
          break;

        case 47:
        case 48:
          // 个人先进支付
          res[leave.value] = d.ge_ren_xian_jin_zhi_fu[leave.value];
          break;

        default:
          console.log(j);
          break;
      }
    });

    resArr.push(res);
  });

  return resArr;
};

export {
  header,
  leaves,
  handleData,
};
