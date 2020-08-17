import axios from 'axios';

// const prefix = '/api/';
const prefix = '/mock/'; // 代理接口

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

// 搜索引擎
export const fetchRank = (params) => fire('POST', 'getRank', params);

export const fetchOrgInfo = (params) => fire('POST', 'getOrgInfo', params);

export const fetchDetail = (params) => fire('POST', 'getFeeDetail', params);

// 智能风险预警
export const fetchFundMonitorInfo = (params) => fire('POST', 'getFundMonitoringInfo', params);

export const fetchOrgViolationInfo = () => fire('POST', 'getOrgViolationInfo', {});

export const fetchDoctorViolationInfo = () => fire('POST', 'getDoctorViolationInfo', {});

export const fetchOrgFalseHospital = (param) => fire('POST', 'getOrgFalseHospital', param);

// 机构
export const fetchOrgGroupHospital = (param) => fire('POST', 'getOrgGroupHospital', param);
