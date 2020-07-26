<template>
  <v-app id="app-container">
    <header>
      <div class="box">
        <v-row>
          <v-col :cols="3" align-self="center">
            <v-img
              height="48px"
              contain
              src="@/assets/common/header.png"
              @click="drawer = !drawer"
            ></v-img>
          </v-col>

          <v-col :cols="9">
            <span class="title">
            医保<br/>智能监测预警系统
          </span>
          </v-col>
        </v-row>
      </div>

      <div class="textarea-container box">
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
      </div>

      <div class="box">
        <div class="tool-btn"><BackIcon/></div>
      </div>
      <div class="box">
        <div class="tool-btn"><NextIcon/></div>
      </div>
    </header>

    <div class=" content-container">
      <transition>
              <aside v-show="drawer">
        <v-card flat>
          <div class="icon-nav">
            <router-link to="/"><HomeIcon /></router-link>
            <router-link to="/monitor"><MonitorIcon /></router-link>
            <router-link to="/search"><SearchIcon /></router-link>
            <router-link to="/warning"><WarningIcon /></router-link>
          </div>
        </v-card>

        <v-card>
          <v-list nav>
            <v-list-group
              v-for="item in links"
              :key="item.title"
              v-model="item.active"
              :prepend-icon="item.action"
              no-action
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item
                v-for="subItem in item.items"
                :key="subItem.title"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="subItem.title"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-list>
        </v-card>
      </aside>
      </transition>

      <main>
        <slot/>
      </main>
    </div>
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

export default {
  props: {
    source: String,
    links: Array,
  },
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
      { title: 'Landing', icon: HomeIcon },
      { title: 'Monitor', icon: SearchIcon },
      { title: 'Search', icon: MonitorIcon },
      { title: 'Warning', icon: WarningIcon },
    ],
    mini: true,
  }),
};
</script>

<style scoped lang="scss">
  #app {
    background: $she-bg;
    height: 100vh;
    box-sizing: border-box;

    .title {
      font-size: 2rem;
    }

    .router-link-exact-active {
      path {
        fill: #4E80D1;
      }
    }

    .box {
      box-shadow: 0px 1px 2px -1px rgba(0, 0, 0, 0.2)!important;
      background: #fff;
      margin: 0 $she-padding $she-padding 0;
    }

    header {
      display: flex;

      .v-toolbar__content {
        padding: 0;
        margin: 12px 0
      }
      .v-image {
        margin: 0 0.7rem 0 1.2rem;
        cursor: pointer;
      }

      .v-sheet.v-card {
        margin: 0 $she-padding $she-padding 0;
      }

      .textarea-container {
        width: 71vw;
        display: flex;
        align-items: center;
        background: $she-fg;

        .v-input {
          max-width: 50%;
          margin: 0 15px;
        }
      }
    }

    .tool-btn {
      width: 5vw;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 95%;
    }

    .content-container {
      height: 100%;
      margin: 2px 0 0 0;
      display: flex;
    }

    aside {
      display: flex;
      min-height: 100%;
      flex: 0 0 10%
    }

    .icon-nav {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;

      svg {
        margin: 1.2rem;
        transform: scale(0.8);
      }
    }

  }

  main {
    overflow: auto;
    max-height: calc(100vh - 80px);
    background: $she-bg;
    margin: 0 4px;
  }
</style>
