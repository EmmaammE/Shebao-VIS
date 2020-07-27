<template>
  <v-app class="s-container">
    <v-navigation-drawer app floating class="s-drawer">
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
          <router-link to="/"><HomeIcon /></router-link>
          <router-link to="/monitor"><MonitorIcon /></router-link>
          <router-link to="/search"><SearchIcon /></router-link>
          <router-link to="/warning"><WarningIcon /></router-link>
        </div>
        <v-list nav dense>
          <v-list-group
            v-for="item in links"
            :key="item.title"
            v-model="item.active"
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
      </v-sheet>
    </v-navigation-drawer>

    <v-app-bar app outlined flat class="s-bar">
      <!-- -->
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
        <slot></slot>
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
      { title: 'landing', icon: HomeIcon },
      { title: 'monitor', icon: SearchIcon },
      { title: 'search', icon: MonitorIcon },
      { title: 'warning', icon: WarningIcon },
    ],
    mini: true,
  }),
};
</script>

<style scoped lang="scss">
  .s-container {
    display: grid;
    background: $she-bg;

    $gap: 4px;

    .v-toolbar {
      box-shadow: none;
    }

    .s-drawer {
      background: $she-bg;

      .s-header {
        display: flex;

        .v-image {
          flex: 0 0 30%;
          align-self: center;
        }
      }

      .v-divider {
        border: 2px solid $she-bg;
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

          .router-link-exact-active {
            path {
              fill: #4E80D1;
            }
          }
        }
      }

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
  }

</style>
