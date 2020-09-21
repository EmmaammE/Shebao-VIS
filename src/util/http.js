import axios from 'axios';

// const prefix = '/api/';
const prefix = '/real/';
// const prefix = '/mock/'; // 代理接口

function fire(method, URL, data) {
  if (method === 'POST') {
    return axios.post(prefix + URL, data)
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  }
  // if (method === 'GET') {
  //   // TODO
  // }
  return Promise.resolve();
}

export const fetchFeeStatistics = (params) => fire('POST', 'getFeeStatistics', params);

export const fetchFeeTimeSeries = (params) => fire('POST', 'getFeeTimeSeries', params);

export const fetchFundDetailStatistics = (params) => fire('POST', 'getFundDetailStatistics', params);

export const fetchFundDetailTimeSeries = (params) => fire('POST', 'getFundDetailTimeSeries', params);
// 搜索引擎
export const fetchRank = (params) => fire('POST', 'getRank', params);

export const fetchOrgInfo = (params) => fire('POST', 'getOrgInfo', params);

export const fetchDetail = (params) => fire('POST', 'getFeeDetail', params);

export const fetchDoctorInfo = (params) => fire('POST', 'getDoctorInfo', params);
// 参保人员汇总
export const fetchPatientInfo = (params) => fire('POST', 'getPatientInfo', params);
// 就诊信息
export const fetchInfo = (params) => fire('POST', 'getTreatmentInfo', params);
// 机构画像基本信息
export const fetchOrgPortraitBasic = (params) => fire('POST', 'getOrgPortraitBasic', params);
// 机构画像详细信息
export const fetchOrgPortraitDetail = (params) => fire('POST', 'getOrgPortraitDetail', params);
// 智能风险预警
export const fetchFundMonitorInfo = (params) => fire('POST', 'getFundMonitoringInfo', params);

export const fetchOrgViolationInfo = () => fire('POST', 'getOrgViolationInfo', {});

export const fetchDoctorViolationInfo = (params) => fire('POST', 'getDoctorViolationInfo', params);

// 机构
export const fetchOrgGroupHospital = (param) => fire('POST', 'getOrgGroupHospital', param);

export const fetchOrgMultiPlacePrescribe = (param) => fire('POST', 'getOrgMultiPlacePrescribe', param);

export const fetchOrgSwipeLittleCard = (param) => fire('POST', 'getOrgSwipeLittleCard', param);

export const fetchOrgFalseHospital = (param) => fire('POST', 'getOrgFalseHospital', param);

export const fetchPatientViolationInfo = (params) => fire('POST', 'getPatientViolationInfo', params);

// 参保人违规预警的三个明细
export const fetchPatientViolationGroup = (params) => fire('POST', 'getPatientViolationGroup', params);
export const fetchPatientViolationLittleCard = (params) => fire('POST', 'getPatientViolationLittleCard', params);
export const fetchPatientViolationFalseHospital = (params) => fire('POST', 'getPatientViolationFalseHospital', params);
