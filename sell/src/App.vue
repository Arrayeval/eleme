<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <!--<router-link :to="{name:'myTest'}">444444444444444444</router-link>-->


    <!--头部--->
    <v-header :seller="seller"></v-header>


    <!---导航-->
    <div class="tab">
      <div class="tab-item border-1px">
        <router-link :to="{name:'goods'}" class="tag-item" >商品</router-link>
      </div>
      <div class="tab-item">
        <router-link :to="{name:'ratings'}" class="tag-item">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link :to="{name:'seller'}" class="tag-item"> 商家</router-link>
      </div>
    </div>
    <!--<div class="content">content</div>-->
    <transition name="style" mode="out-in">
      <keep-alive>
        <router-view :seller="seller"></router-view>

        <!--名命视图--->
        <router-view name="a"></router-view>
        <router-view name="b"></router-view>
        <router-view name="c"></router-view>
      </keep-alive>
    </transition>


  </div>
</template>

<script type="text/ecmascript-6">
  import header from 'components/header/header.vue';


  const ERR_OK = 0;
  export default {
    name: 'app',
    components: {
      'vHeader': header,
    },
    data()  {
      return {
        seller: {},
      };
    },
    created(){
      this.$http.get('/api/seller')
        .then((res) => {
          (res.data.errno===ERR_OK) && (this.seller=res.data.data);
       //  console.log(this.seller);
        }).catch((err) => {
        console.log(err);
      })
    }


  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  //过度样式
  .style-enter-active, .style-leave-active {
    transition: all .3s;
  }

  .style-enter, .style-leave-to {
    opacity: 0
  }

  @import './common/stylus/mixin.styl'
  #app
    .tab
      display: flex
      width: 100%
      line-height: 40px
      border-1px(rgba(7, 17, 27, 0.1))
      .tab-item
        flex: 1
        text-align: center
        .tag-item
          display: block
          font-size: 14px
          color: rgb(77, 85, 93)
          &.router-link-active
            color: rgb(240, 20, 20)


</style>
