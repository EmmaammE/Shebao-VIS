<template>
  <v-sheet class="sheet-container">
      <v-card class="card-container-1">
    <h4>{{title}}</h4>
    <h4>{{ id}}</h4>
    <div class="s-card-table">
      <div class="header">
        <span>均次指标</span>
        <span>交易次数</span>
        <span>发生金额</span>
      </div>
      <ul v-if="Object.keys(data).length!==0">
        <li v-for="(d,index) in tableHeader"
          :key="index"
        >
          <span>{{d.title}}</span>
          <span>{{data[d.key].num}}</span>
          <span>{{data[d.key].money}}</span>
        </li>
      </ul>
    </div>
  </v-card>
  <v-card>
    <circle-progress />
  </v-card>
  </v-sheet>
</template>

<script>
import CircleProgress from '@/components/small/CircleProgress.vue';

export default {
  props: {
    title: String,
    type: String,
    id: String,
    data: Object,
  },

  components: {
    CircleProgress,
  },

  data() {
    return {
      tableHeader: [
        { key: 'qun_ti_jiu_yi', title: '群体就医' },
        { key: 'duo_di_kai_yao', title: '多地开药' },
        { key: 'shua_kong_ka', title: '刷空卡' },
        { key: 'shua_xiao_ka', title: '刷小卡' },
        { key: 'xu_jia_zhu_yuan', title: '虚假住院' },
      ],
    };
  },
};
</script>
<style lang="scss">
  .cmp {
    height: 20vh;
    top: 30vh;
  }

  .cmp.active{
    height: 30vh;
  }

  .sheet-container {
    display: flex;
  }
  .card-container-1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    width: 15vw;

    .s-card-table {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin: 15px 0;

      span {
        width: 5vw;
        text-align: center;
      }

      .header {
        display: flex;
         justify-content: space-between;
        width: 100%;
      }

      ul {
        list-style: none;
        display: block;
        padding: 0;

        li {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          color: #aeaeae;
          border-bottom: 1px solid #aeaeae;

        }

        li.active {
          background: linear-gradient(to right, #eaf1f9, #f5f7fb);
          border-left: 5px solid #94bfef;
        }
      }
    }
  }
</style>
