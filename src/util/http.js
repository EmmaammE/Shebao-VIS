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

export const fetchRank = (params) => fire('POST', 'getRank', params);
