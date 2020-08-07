import Vue from 'vue';
import VueRouter from 'vue-router';
import Landing from '@/views/landing/Landing.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing,
  },
  {
    path: '/monitor',
    name: 'Monitor',
    component: () => import('../views/monitor/Monitor.vue'),
    meta: {
      links: [
        {
          action: '1',
          title: '基金本地情况',
          active: true,
          items: [
            { title: '公立医院' },
            { title: '民营医院' },
            { title: '零售药店' },
            { title: '社区卫生服务中心' },
            { title: '其他社会办医' },
          ],
        },
        {
          action: '2',
          title: '基金异地情况',
          items: [
            { title: '市内异地' },
            { title: '省内异地' },
            { title: '跨省异地' },
          ],
        },
        {
          action: '3',
          title: '基金明细监测',
          items: [
            { title: '按列支渠道' },
            { title: '按费用结构' },
          ],
        },
      ],
    },
  },
  {
    path: '/warning',
    name: 'Warning',
    component: () => import('../views/warning/Warning.vue'),
    meta: {
      links: [
        {
          action: '1',
          title: '机构预算预警',
          active: true,
          items: [
            { title: '公立医院' },
            { title: '社区卫生服务中心' },
            { title: '民营医院' },
            { title: '其他社会办医' },
            { title: '零售药店' },
          ],
        },
        {
          action: '2',
          title: '违规行为预警',
          items: [
            { title: '机构违规预警' },
            { title: '参保人员违规预警' },
            { title: '医师违规预警' },
            { title: '药师违规预警' },
          ],
        },
      ],
    },
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/search/Search.vue'),
    meta: {
      links: [
        {
          action: '1',
          title: '排名查看',
          active: true,
          items: [],
        },
        {
          action: '2',
          title: '机构汇总',
          items: [],
        },
        {
          action: '2',
          title: '参保人员汇总',
          items: [],
        }, {
          action: '2',
          title: '药师医师汇总',
          items: [],
        }, {
          action: '2',
          title: '费用明细',
          items: [],
        }, {
          action: '2',
          title: '就诊信息',
          items: [],
        },
      ],
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
