<template>
  <v-app class="s-container">
    <v-navigation-drawer app floating class="s-drawer"
      :mobile-breakpoint="0">
      <template v-slot:prepend>
        <v-sheet class="s-header">
          <v-img
            height="2rem"
            contain
            src="@/assets/common/header.png"
            @click="drawer = !drawer"
          ></v-img>

          <span class="title">
            医保<br/>智能监测预警系统
          </span>
        </v-sheet>
      </template>

      <v-divider></v-divider>

      <v-sheet class="s-lists">
        <div class="icon-lists">
          <router-link to="/landing"><HomeIcon /></router-link>
          <router-link to="/monitor"><MonitorIcon /></router-link>
          <router-link to="/search"><SearchIcon /></router-link>
          <router-link to="/warning"><WarningIcon /></router-link>
        </div>
        <!-- NOTE v-if 是否是层级导航 -->
        <v-list nav dense
          v-if="$route.meta.linkIndex!==1"
        >
          <v-list-group
            v-for="(item,i) in links"
            :key="item.title"
            :value="i===activeMenu"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="(subItem) in item.items"
              :key="subItem.title"
              :to="subItem.href"
            >
              <!-- active-class="active" -->
              <v-list-item-content>
                <v-list-item-title
                  v-text="subItem.title"
                >
                </v-list-item-title>
                <div v-if="subItem.title === '参保人违规预警'
                  && $route.fullPath==='/warning/action/people'"
                  class="layout-insert">
                  <div>违规劣质费用</div>
                  <div>违规人数</div>
                  <div>违规机构数</div>
                  <hr />
                  <ul>
                    <li>群体就医</li>
                    <li>虚假住院</li>
                    <li>刷空卡</li>
                    <li>刷小卡</li>
                  </ul>
                  <hr />
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
        <!-- NOTE v-else 不是层级导航, 路由控制的布局-->
        <v-list nav dense
          v-else
        >
          <v-list-item
            v-for="(item) in links"
            :key="item.title"
            :to="item.href"
            active-class="custom-active"
          >
            <v-list-item-content>
              <v-list-item-title
                v-text="item.title"
              >
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-sheet>
    </v-navigation-drawer>

    <v-app-bar app outlined flat class="s-bar">
      <div class="s-bar-content">
        <v-text-field
          flat
          hide-details
          label="Search"
          solo
        >
          <template v-slot:prepend-inner>
            <SearchIconIcon />
          </template>
        </v-text-field>
        <div></div>
        <div class="tool-btn"><BackIcon/></div>
        <div class="tool-btn"><NextIcon/></div>
      </div>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <router-view :routeType="$route.params.routeType" />
      </v-container>
    </v-main>

  </v-app>
</template>

<script>
import BackIcon from '@/assets/common/back.svg';
import NextIcon from '@/assets/common/next.svg';
import SearchIconIcon from '@/assets/common/searchIcon.svg';
import HomeIcon from '@/assets/common/home.svg';
import MonitorIcon from '@/assets/common/monitor.svg';
import SearchIcon from '@/assets/common/search.svg';
import WarningIcon from '@/assets/common/warning.svg';
import { ROUTE_PARAM, FUND_TYPE } from '@/util/type';

export default {
  components: {
    BackIcon,
    NextIcon,
    SearchIconIcon,
    HomeIcon,
    SearchIcon,
    WarningIcon,
    MonitorIcon,
  },
  data: () => ({
    drawer: true,
    items: [
      { title: 'landing', icon: HomeIcon },
      { title: 'monitor', icon: SearchIcon },
      { title: 'search', icon: MonitorIcon },
      { title: 'warning', icon: WarningIcon },
    ],
    mini: true,
    ROUTE_PARAM,
  }),

  methods: {
  },

  computed: {
    fundString() {
      return ROUTE_PARAM[this.routeType];
    },
    // 返回展开的menu
    activeMenu() {
      if (this.$route.meta.linkIndex === 0) {
        return {
          local: 0,
          other: 1,
          mingxi: 2,

        }[this.$route.params.submenu];
      }
      return this.$route.meta.activeIndex;
    },
    // 返回匹配的link数组
    links() {
      const index = this.$route.meta.linkIndex;
      const linksArr = [
        [
          {
            title: '基金本地情况',
            items: [
              { title: '公立医院', href: '/monitor/local/public' },
              { title: '民营医院', href: '/monitor/local/private' },
              { title: '零售药店', href: '/monitor/local/drugstore' },
              { title: '社区卫生服务中心', href: '/monitor/local/community' },
              { title: '其他社会办医', href: '/monitor/local/social' },
            ],
          },
          {
            title: '基金异地情况',
            items: [
              { title: '市内异地', href: '/monitor/other/city' },
              { title: '省内异地', href: '/monitor/other/province' },
              { title: '跨省异地', href: '/monitor/other/trans_province' },
            ],
          },
          {
            title: '基金明细监测',
            items: [
              { title: '按列支渠道', href: '/monitor/mingxi/liezhi' },
              { title: '按费用结构', href: '/monitor/mingxi/feiyong' },
            ],
          },
        ],
        [
          {
            title: '排名查看',
            href: '/search/rank',
          },
          {
            title: '机构汇总',
            href: '/search/jigou',
          },
          {
            title: '参保人员汇总',
            href: '/search/people',

          }, {
            title: '药师医师汇总',
            href: '/search/doctor',

          }, {
            title: '费用明细',
            href: '/search/mingxi',

          }, {
            title: '就诊信息',
            href: '/search/info',
          },
          {
            title: '机构画像',
            href: '/search/profile',
          },
        ],
        [
          {
            title: '机构预算预警',
            items: [
              { title: '公立医院', href: '/warning/budget/public' },
              { title: '民营医院', href: '/warning/budget/private' },
              { title: '零售药店', href: '/warning/budget/drugstore' },
              { title: '社区卫生服务中心', href: '/warning/budget/community' },
              { title: '其他社会办医', href: '/warning/budget/social' },
            ],
          },
          {
            title: '违规行为预警',
            items: [
              { title: '机构违规预警', href: '/warning/action/organization' },
              { title: '参保人违规预警', href: '/warning/action/people' },
              { title: '药师违规预警', href: '/warning/action/doctor' },
            ],
          },
        ],
      ];

      return linksArr[index];
    },
  },
};
</script>

<style scoped lang="scss">
  .s-container {
    display: grid;
    background: $she-bg;

    $gap: 4px;
    $nav-height: 9vh;

    .v-main {
      padding: $nav-height 0px 0px 256px!important;
    }

    .v-toolbar {
      box-shadow: none;
    }

    .v-list-item__title {
      cursor: pointer;
    }

    .v-list {
      width: 100%;
      padding-left: 0;
      // padding-right: 0;
    }

    .v-list-group__items {
      .v-list-item {
        text-indent: 2px;
      }
    }

    .s-drawer {
      background: $she-bg;

      .s-header {
        display: flex;
        align-items: center;

        .v-image {
          flex: 0 0 30%;
          align-self: center;
        }
      }

      .v-divider {
        border: 2px solid $she-bg;
      }

      .v-list-item {
        border-left: 5px solid #fff;
      }

      .active {
        color: $she-primary!important;

        * {
          background: #fff!important;
        }
      }

      .s-lists {
        display: flex;
        height: 100%;

        .icon-lists {
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-right: 2px solid $she-bg;
          box-sizing: border-box;

          svg {
            margin: 1.2rem;
            transform: scale(0.8);
          }

          .router-link-active {
            path {
              fill: #4E80D1;
            }
          }
        }
      }

    }

    .s-bar {
      // 设置header的高度
      min-height: $nav-height;
    }

    .s-header {
      min-height: $nav-height;
    }

    header {
      border-color: #fff;
      background: #fff!important;
      margin-left: 4px;

     .s-bar-content {
        width: 100%;
        display: grid;
        grid-template-columns: 45% auto 64px 64px;
     }

     .v-input {
       align-items: center;
     }

      .tool-btn {
        border: 4px solid $she-bg;
        height: 64px;
        width: 64px;
        border-width: 0 2px 0 2px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .container--fluid {
      padding: 4px;
      height: 100%;
    }

    // 参保人违规预警，侧边栏插入内容
    .layout-insert {
      display: flex;
      flex-direction: column;
      color: $she-primary;
      padding: 10px 0;
      line-height: 25px;
      font-size: $sub-title;

      hr {
        background: $she-border;
        color: $she-border;

        height: 1px;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 10px 0;

        li {
          position: relative;
          padding-left: 30px;
          display: flex;
          align-items: center;

          &::before,
          &::after  {
            content: '';
            position: absolute;
            border-radius: 50%;
            left: 1px;
          }

          &::after {
            width: 12px;
            height: 12px;
            top: 6px;
            left: 4px;
          }

          &::before {
            width: 18px;
            height: 18px;
          }
        }

        @each $c in $yujing {
          $i: index($yujing, $c);
          li:nth-child(#{$i})::after {
            background: $c;
          }

          li:nth-child(#{$i})::before {
            border: 1px solid $c;
          }
        }
      }
    }
  }

</style>
