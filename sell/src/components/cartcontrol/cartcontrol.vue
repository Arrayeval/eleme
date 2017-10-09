<template>
  <div class="cartcontrol">
    <transition name="move" mode="out-in">
      <div class="cart-decrease " v-show="food.count>0" @click.stop.prevent="desCount($event)">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
      <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>


  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from "vue";
  export default {
    name: ' ',
    data () {
      return {}
    },
    props: {
      food: {
        type: Object,
      }
    },
    created(){
      //console.log(this.food);
    },
    methods: {
        //每一次触发加减按钮都会改变food，很明显我的food是一个props,所以也会间接触发goods中的变化

      /*
       * 加
       * */
      addCart(event){
        /*
         if(!event._constructed){//如果是浏览其就不执行后面的
         return 0;
         }
         */
        //better-scroll禁止了click事件，你要在初始化的时候经行设置click:true
        if (!this.food.count) {
          // this.food.count=1;
          //food是没有count属性的，如果直接加上food.count,vue框架是不会进行双向绑定检测变化的，你要通过Vue.set(对象,'属性值',初始值)
          Vue.set(this.food, 'count', 1);
        }
        else {
          this.food.count++;
        }

     //  console.log(event.target);

        //派发事件（抛物线小球）
        this.bus.$emit('cart.add',event.target);
        //this.$emit('cart.add',event.target);

      },
      /*
       * 减
       * */
      desCount(event){
        if (!event._constructed) {
          return 0;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size 0
    .cart-decrease
      display inline-block
      padding 6px
      transition all 0.3s linear
      &.move-transition
        opacity 1
        transform translate3D(0,0,0)
      .inner
        line-height 24px
        font-size 24px
        color rgba(0, 160, 220, 0.2)
        transition all 0.4s linear
        tranform rotate(0)
      &.move-enter,&.move-leave
        opacity 0
        transform translate3D(24px,0 ,0)


    .cart-count
      display inline-block
      vertical-align top
      width 12px
      padding-top 6px
      line-height 24px
      text-align center
      font-size 10px
      color rbg(147, 153, 159)
    .cart-add
      display inline-block
      padding 6px
      line-height 24px
      font-size 24px
      color rgba(0, 160, 220, 0.2)

</style>
