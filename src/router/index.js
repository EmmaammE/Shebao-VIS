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
          ],
        },
        {
          action: '2',
          title: '基金异地情况',
          items: [

          ],
        },
        {
          action: '3',
          title: '基金明细监测',
          items: [

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
            { title: '民营医院' },
            { title: '零售药店' },
            { title: '社区卫生服务中心' },
            { title: '其他社会办医' },

          ],
        },
        {
          action: '2',
          title: '违规行为预警',
          items: [

          ],
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
