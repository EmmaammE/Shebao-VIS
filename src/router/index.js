import Vue from 'vue';
import VueRouter from 'vue-router';
import Landing from '@/views/landing/Landing.vue';
import Layout from '@/views/Layout.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/landing' },
  {
    path: '/landing',
    name: 'Landing',
    component: Landing,
  },
  { path: '/search', redirect: '/search/rank' },
  { path: '/monitor', redirect: '/monitor/local/public' },
  { path: '/warning', redirect: '/warning/budget/public' },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'monitor/:submenu/:routeType',
        component: () => import('../views/monitor/Monitor.vue'),
        name: '基金实时监测',
        meta: {
          linkIndex: 0,
        },
      },
      {
        path: 'search/rank',
        component: () => import('../views/search/SearchRank'),
        name: '智能搜索引擎-排名查看',
        meta: {
          linkIndex: 1,
        },
      },
      {
        path: 'search/profile',
        component: () => import('../views/search/SearchMap'),
        name: '智能搜索引擎-机构画像',
        meta: {
          linkIndex: 1,
          type: 2,
        },
      },
      {
        path: 'search/profile/:orgId',
        component: () => import('../views/search/SearchProfile'),
        name: '智能搜索引擎-机构画像-详细信息',
        meta: {
          linkIndex: 1,
        },
      },

      {
        path: 'search/jigou/table',
        component: () => import('../views/Table.vue'),
        meta: {
          linkIndex: 1,
          type: 1,
        },
      },

      {
        path: 'search/jigou',
        component: () => import('../views/search/SearchMap'),
        name: '智能搜索引擎-机构汇总',
        meta: {
          linkIndex: 1,
          type: 1,
          table: true,
        },
      },
      {
        path: 'search/mingxi',
        component: () => import('../views/search/SearchMap'),
        name: '智能搜索引擎-费用明细',
        meta: {
          linkIndex: 1,
          type: 0,
        },
      },
      {
        path: 'search/info',
        component: () => import('../views/search/SearchTreatment'),
        name: '智能搜索引擎-就诊信息',
        meta: {
          linkIndex: 1,
        },
      },
      {
        path: 'search/:routeType',
        component: () => import('../views/search/SearchPanel'),
        name: '智能搜索引擎',
        meta: {
          linkIndex: 1,
        },
      },
      {
        path: 'warning/action/people',
        name: '智能预警-参保人',
        component: () => import('@/views/warning/WarningPeople.vue'),
        meta: {
          linkIndex: 2,
          activeIndex: 1,
        },
      },
      {
        path: 'warning/action/doctor',
        name: '智能预警-药师',
        component: () => import('@/views/warning/WarningList.vue'),
        meta: {
          linkIndex: 2,
          activeIndex: 1,
        },
      },
      {
        path: 'warning/action/organization',
        name: '智能预警-机构',
        component: () => import('@/views/warning/WarningMap.vue'),
        meta: {
          linkIndex: 2,
          activeIndex: 1,
        },
      },

      // 机构预算预警
      {
        path: 'warning/budget/:routeType/table',
        component: () => import('../views/Table.vue'),
        meta: {
          linkIndex: 2,
          activeIndex: 0,
        },
      },
      {
        path: 'warning/budget/:routeType',
        name: '智能预警',
        component: () => import('@/views/warning/WarningMap.vue'),
        meta: {
          linkIndex: 2,
          activeIndex: 0,
          table: true,
        },
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
