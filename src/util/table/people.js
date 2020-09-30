// 参保人违规预警
const header = [
  { text: '序号', value: 'index' },
  { text: '机构代码', value: 'ji_gou_dai_ma' },
  { text: '医疗机构名称', value: 'ji_gou_ming_cheng' },
  { text: '就诊人', value: 'jiu_zhen_ren' },
  { text: '就诊时间', value: 'jie_suan_shi_jian' },
  { text: '就诊人流水号', value: 'jiu_zhen_liu_shui' },
  { text: '医疗费用总额', value: 'yi_liao_fei_zong_e' },
  { text: '医保报销金额', value: 'bao_xiao_zong_e' },
  { text: '医师', value: 'yi_shi' },
];

const leaves = header;

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
