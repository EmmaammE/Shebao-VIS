<template>
  <v-app>
    <v-img src="@/assets/landing/main.png" />
    <div class="content">
      <header>
        <ul class="text-md-body-1 text-lg-body-1 text-xl-body-1">
          <li>
            <router-link to="/">首页 </router-link>
          </li>
          <li>
            <router-link to="/monitor">基金实时监测 <Icon2/></router-link>
          </li>
          <li>
            <router-link to="/search">智能搜索引擎 <Icon2/></router-link>
          </li>
          <li>
            <router-link to="/warning">智能风险预警</router-link>
          <Icon2/></li>
        </ul>
      </header>

      <div class="downbox">
        <div class="s-title">
          <v-img max-width="45px" src="../.././assets/landing/首页 icon_1.png"></v-img>
          <h2>医保智能监测预警系统</h2>
        </div>

        <div class="content-container">
          <div class="icon-lists">
          <div class="box">
            <Icon4/>
            <p>基金<br />实时监测</p>
          </div>
          <div class="box">
            <Icon5/>
            <p>智能<br>搜索引擎</p>
          </div>
          <div class="box">
            <Icon6/>
            <p>智能<br>风险预警</p>
          </div>

        </div>

        <div class="s-img">
          <v-img max-width="40%" src="../.././assets/landing/首页 图片_3.png" />
        </div>
        </div>
      </div>
    </div>

  </v-app>
</template>

<script>
import Icon2 from '@/assets/landing/首页 icon_2.svg';
import Icon4 from '@/assets/landing/icon_4.svg';
import Icon5 from '@/assets/landing/icon_5.svg';
import Icon6 from '@/assets/landing/icon_6.svg';

export default {
  name: 'Landing',
  components: {
    Icon2,
    Icon4,
    Icon5,
    Icon6,
  },
  created() {
    this.$emit('update:layout', 'div');
  },
};
</script>

<style scoped lang="scss">

  .v-image__image--cover {
    position: relative;
  }

  .content {
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    padding: 1% 10%;
    background: rgba($color: #024ab0, $alpha: 0.2);
  }

  header {
    color: #fff;
    display: flex;
    border-bottom: 1px solid rgb(236, 222, 222);
    justify-content: flex-end;
    padding: 10px 0;

    ul {
      display: flex;
      float: right;
      justify-content: space-between;
      width: 100%;
      min-width: fit-content;
      flex: 0 0 50%;
    }

    li {
      list-style: none;
      display: inline-block;
      display: flex;
      align-items: center;
      cursor: pointer;
      margin: 0 10px;

      a {
        color: #fff;
        text-decoration: none;
      }

      svg {
        margin: 0 10px;
      }
    }
  }

  .downbox {
    display: flex;
    flex-direction: column;
    height: 90vh;
    margin: 15% 1vw;

    .s-title {
      display: flex;
      align-items: center;
      margin-left: 2vw;

      h2 {
        margin: 0 10px;
        font-family:YouSheBiaoTiHei;
        color:#024abd;
        letter-spacing:3.7px;
        text-align:center;
        font-size: 3rem;
      }
    }

    .content-container {
      display: grid;
      grid-template-columns: 55% auto;

      .s-img {
        padding: 1vh 1vw;
      }
    }

    .icon-lists {
      display: flex;
      width: 100%;
      justify-content: space-around;
      align-items: center;
      padding-top: 3vh;

      .box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        p {
          font-family:STHeitiSC-Light;
          font-size:1.5rem;
          color:#ffffff;
          letter-spacing:1.87px;
          text-align:center;
        }
      }

      div {
        svg {
          transform: scale(0.7);
        }
      }
    }
  }

</style>
