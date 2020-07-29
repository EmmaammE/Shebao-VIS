<template>
  <v-app>
    <v-img src="@/assets/landing/main.png">
      <div class="topbox">
        <div class="header">
          <div class="header-right">
            <ul>
              <li>首页</li>
              <li>基金实时监测 <Icon2/></li>
              <li>智能搜索引擎 <Icon2/></li>
              <li>智能风险预警 <Icon2/></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="downbox">
        <div class="content">
          <div class="content-top">
            <div class="content-top-img">
              <img src="../.././assets/landing/首页 icon_1.png"/>
            </div>
            <div class="content-top-text">
              医保智能监测预警系统
            </div>
          </div>
          <div class="content-down">
            <div class="content-down-box">
              <Icon4/>
              <div class="content-down-box-text">
                基金<br>实时监测
              </div>
            </div>
            <div class="content-down-box">
              <Icon5/>
              <div class="content-down-box-text">
                智能<br>搜索引擎
              </div>
            </div>
            <div class="content-down-box">
              <Icon6/>
              <div class="content-down-box-text">
                智能<br>风险预警
              </div>
            </div>
          </div>
        </div>

        <div class="right-pic">
          <img src="../.././assets/landing/首页 图片_3.png"
          height="469px"/>
        </div>
        <div class="right-icon">
          <Icon2/>
        </div>
      </div>

    </v-img>
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
* {
  margin: 0;
  padding: 0
}
li {
    list-style: none;
}
.show{
  background-color: pink;
}
.show1{
  background-color: red;
}
.show2{
  background-color: green;
}
.topbox{
  position: relative;
  height: 80px;
}
.downbox{
  position: relative;
}
.header{
  width: 2200px;
  height: 80px;
  margin: 0 auto;
  border-width: 0 0 2px 0;
  border-style:solid;
  border-color: white;
}
.header-right{
  float: right;
  height: 20px;
  margin-top: 30px;
  padding-right: 100px;
  line-height: 20px;
}
.header li {
  float: left;
  height: 20px;
  margin: 0 40px;
  font-size: 20px;
  font-family:STHeitiSC-Medium;
  color:#ffffff;
}
.content{
  position: relative;
  float: left;
  padding-top: 253px;
  padding-left: 200px;
}
.content-top{
  position: relative;
  height: 104px;
  width: 1000px;;
}
.content-top-img{
  float: left;
  margin-right: 0;
  height: 104px;
}
.content-top-img img{
  height: 100%;
}
.content-top-text{
  float: left;
  margin-left: 20px;
  height: 104px;
  font-size: 70px;
  line-height: 104px;
  font-family:YouSheBiaoTiHei;
  color:#024abd;
  letter-spacing:3.7px;
}
.content-down{
  position: relative;
}
.content-down-box{
  float: left;
  margin: 100px;
}
.content-down-box-text{
  margin-top: 20px;;
  text-align:center;
  font-family:STHeitiSC-Light;
  font-size:40px;
  color:#ffffff;
}
.right-pic{
  float: left;
  margin-top: 300px;
  margin-left: 147px;
}
.right-icon{
  float: left;
  margin-top: 530px;
  margin-left: 100px;
  transform:rotate(270deg) scale(7,7);
}
.test{
  background-color: #fff;
}
</style>
