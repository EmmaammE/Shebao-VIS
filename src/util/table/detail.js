const header = [
  {
    value: 'index', text: '序号',
  },
  {
    value: 'yao_pin_fu_wu_xiang_mu', text: '药品服务项目',
  },
  {
    value: 'ji_gou_ming_cheng', text: '机构名称',
  },
  {
    value: 'zong_fei_yong_zhi_chi', text: '总费用支出',
  },
  {
    value: 'lie_zhi_fei_yong', text: '列支费用',
  },
  {
    value: 'fei_yong_zhan_bi', text: '费用占比',
  },
  {
    value: 'dan_jia', text: '单价',
  },
  {
    value: 'fu_wu_yi_bao_ren_ci', text: '服务医保人次',
  },
  {
    value: 'fu_wu_yi_bao_ren_ci', text: '服务医保人次数',
  },
];

const leaves = header.slice();

const handleData = (data) => {
  const arr = [];

  Object.keys(data).forEach((key, index) => {
    const res = {};
    leaves.forEach((leave, j) => {
      switch (j) {
        case 0:
          res[leave.value] = index + 1;
          break;
        default:
          res[leave.value] = data[key][leave.value];
      }
    });

    arr.push(res);
  });

  return arr;
};

export {
  header,
  leaves,
  handleData,
};
