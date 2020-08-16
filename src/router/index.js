import Vue from 'vue';
import VueRouter from 'vue-router';
import Landing from '@/views/landing/Landing.vue';
import WarningList from '@/views/warning/WarningList.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/', redirect: '/landing',
  },
  {
    path: '/landing',
    name: 'Landing',
    component: Landing,
  },
  {
    path: '/monitor', redirect: '/monitor/public',
  },
  {
    path: '/monitor/:routeType',
    name: 'Monitor',
    component: () => import('../views/monitor/Monitor.vue'),
    props: true,
    meta: {
      links: [
        {
          key: 'monitor',
          title: '基金本地情况',
          items: [
            { title: '公立医院' },
            { title: '民营医院' },
            { title: '零售药店' },
            { title: '社区卫生服务中心' },
            { title: '其他社会办医' },
          ],
        },
        {
          key: 'monitor',
          title: '基金异地情况',
          items: [
            { title: '市内异地' },
            { title: '省内异地' },
            { title: '跨省异地' },
          ],
        },
        {
          key: 'monitor',
          title: '基金明细监测',
          items: [
            { title: '按列支渠道' },
            { title: '按费用结构' },
          ],
        },
      ],
    },
  },
  { path: '/warning', redirect: '/warning/public' },
  {
    path: '/warning/:routeType',
    name: 'Warning',
    component: () => import('../views/warning/Warning.vue'),
    meta: {
      links: [
        {
          title: '机构预算预警',
          key: 'warning',
          items: [
            { title: '公立医院' },
            { title: '社区卫生服务中心' },
            { title: '民营医院' },
            { title: '其他社会办医' },
            { title: '零售药店' },
          ],
        },
        {
          key: 'warning',
          title: '违规行为预警',
          items: [
            { title: '机构违规预警' },
            { title: '参保人违规预警' },
            { title: '药师违规预警' },
          ],
        },
      ],
    },
  },
  {
    path: '/search', redirect: '/search/rank',
  },
  {
    path: '/search/:routeType',
    name: 'Search',
    component: () => import('../views/search/Search.vue'),
    meta: {
      links: [
        {
          title: '排名查看',
          active: true,
          items: [],
        },
        {
          title: '机构汇总',
          items: [],
        },
        {
          title: '参保人员汇总',
          items: [],
        }, {
          title: '药师医师汇总',
          items: [],
        }, {
          title: '费用明细',
          items: [],
        }, {
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
