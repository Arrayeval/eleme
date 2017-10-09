<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highLight':totalCount>0}">
              <span class="icon-shopping_cart" :class="{'highLight':totalCount>0}"></span>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}  </div>
          </div>
          <div class="price" :class="{'highLight':totalPrice>0}">￥{{totalPrice}}元</div>
          <div class="desc">另收配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="[totalPrice >= minPrice? 'enough':'not-enough','']">
            {{payDesc}}
          </div>
        </div>
      </div>

      <!--抛物线小球-->
      <div class="ball-container">
        <!---每一小球是有两层的，一层决定着x方向，一层决定着y方向-->
        <transition-group tag="div" name="drop" @before-enter="beforeEnter" @enter="Enter" @after-enter="afterEnter">
          <div v-for="(ball,key) in balls" :key="key" v-show="ball.show" class="ball">
            <div class="inner innerHook"></div>
          </div>
        </transition-group>
      </div>

      <!--购物车列表-->
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow && fold">
            <div class="list-header">
              <h1 class="title">购物车</h1>
              <span class="empty" @click="empty"> 清空</span>
            </div>
            <div class="list-content" ref="listcontent">
              <ul>
                <li class="food" v-for="(food,key) in selectFoods">
                  <span class="name">{{food.name}}</span>
                  <div class="price">
                    <span>￥{{food.price * food.count}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food"></cartcontrol>
                  </div>
                </li>
              </ul>
            </div>
        </div>
      </transition>
    </div>

    <!--模糊背影-->
    <transition name="fade">
      <div class="list-mark" v-show="listShow && fold" @click="hideList">
      </div>
    </transition>
  </div>


</template>

<script type="text/ecmascript-6">
  //下滑
  import BScroll from 'better-scroll';

  //加减按钮（商品右侧）
  import cartcontrol from 'components/cartcontrol/cartcontrol';

  export default {
    name: ' ',
    data () {
      return {
        balls: [
          {show: false},
          {show: false},
          {show: false},
          {show: false},
          {show: false}
        ],
        dropBalls: [],
        fold: false,//购物车列表默认“收缩”

      }
    },
    //props: ['deliveryPrice','minPrice']
    props: {
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      },
      selectFoods: {//选择的商品数量
        type: Array,
        default(){
          return [
            {price: 1, count: 2},
            {price: 1, count: 2},
            {price: 1, count: 2},
            {price: 1, count: 2},
            {price: 1, count: 2},
            {price: 1, count: 2},
            {price: 1, count: 20},
            {price: 1, count: 2},
          ];
        }
      },

    },
    computed: {
      //选中的商品总价
      totalPrice(){
        let total = 0;
//                this.selectFoods.forEach((food)=>{
//                    total+=food.price*food.count;
//                });

        total = this.selectFoods.reduce((total, cur) => {
          total += cur.price * cur.count;
          return total;
        }, total);
        return total;
      },

      //选中商品总数
      totalCount(){
        let count = 0;
        count = this.selectFoods.reduce((count, cur) => {
          return count += cur.count;
        }, count);
        return count;
      },

      //结算描述
      payDesc(){
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`;
        }
        else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}元起送`;
        }
        else {
          return '去结算';
        }
      },

      /*购物车折叠listShow*/
      listShow(){
        if (!this.totalCount) {//没有添加商品（折叠）
          this.fold=false;
          return false;
        }
        else {
          return true;
        }
      }
    },
    methods: {
      beforeEnter(el){
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();//获得元素相对于窗口的位置(终点位置)
            let x = (rect.left - 32);
            let y = -(window.innerHeight - rect.top - 22);

            /*
             * 设置初始位置
             * */
            //外层控制着y轴
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;

            //内层控制着x轴
            let inner = el.getElementsByClassName('innerHook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
        // console.log(el);
      },
      Enter(el){
        //console.log(el);
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight; //强制浏览器进行重绘
        this.$nextTick(() => {
          //归位
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('innerHook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
        });

      },
      afterEnter(el){
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },

      //开关“购物车”列表
      toggleList(){
        if (this.totalCount) {
          this.fold = !this.fold;
          this.fold &&   //购物车列表下滑
          //购物车下拉列表better-scroll
          this._initScroll();
        }
        return 0;
      },

      //购物车列表
      _initScroll(){
        this.$nextTick(()=>{
          this.scroll=new BScroll(this.$refs.listcontent,{
            click:true
          });
          /*
          if(!this.scroll){//优化：减少初始话
            this.scroll=new BScroll(this.$refs.listcontent,{
              click:true
            });

          }
          else{
            this.scroll.refresh();
          }
          */
        });
      },

      //清空购物车
      empty(){
        this.selectFoods.forEach(function(food){
            food.count=0;
        });
      },
      //点击阴影，关闭购物车列表
      hideList(){
          this.fold=false;
      },
      //pay
      pay(){
          if(this.totalPrice<this.minPrice){
              return ;
          }
          window.alert(`支付${this.totalPrice}`);
      }
    },

    created(){
      //p抛物线小球
      this.bus.$on('cart.add', target => {
        // console.log(target);
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = target;//target是当前的DOM元素
            this.dropBalls.push(ball);
            return;//结束整个函数
          }
        }
      })
    },

    beforeDestroy(){
      //this.$root.Bus.$off("你的名字");
      this.$parent.Bus.$off("cart.add");   //值得说一句的是，这个$root就是$parent ，建议还是写成$parent
    },

    components: {
      cartcontrol,
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';
  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px

    .content
      display flex
      background #141d27
      color rgba(255, 255, 255, 0.4)
      font-size 0
      .content-left
        flex 1

        .logo-wrapper
          display inline-block
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          vertical-align top
          border-radius 50%
          background #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            text-align center
            background #2b343c
            &.highLight
              background rgb(0, 160, 220)

            .icon-shopping_cart
              font-size 24px
              color #80858a
              line-height 44px
              &.highLight
                color #fff

          .num
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #fff
            background rgb(240, 20, 20)
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)

        .desc
          display inline-block
          vertical-align top
          margin 12px 0 0 12px
          line-height 24px

          font-size 10px

        .price
          display inline-block
          vertical-align top
          margin-top 12px
          line-height 24px
          padding-right 12px
          box-sizing border-box
          border-right 1px solid rgba(255, 255, 255, 0.1)
          &.highLight
            color #fff

          font-size 16px
          font-weight 700
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          font-weight 700
          background #2b333b
          &.not-enough
            background #2b333b
          &.enough
            background #00b43c
            color #fff

  //抛物线小球样式
    .ball-container
      .ball
        position fixed //相对于视口坐的动画，因此要设置position:fixed
        left 32px
        bottom 22px
        z-index 200
        &.drop-enter, &.drop-enter-active
          transition all 0.5s cubic-bezier(0.49, -0.29, 0.75, 0.41)
          .inner
            width 16px
            height 16px
            border-radius 50%
            background rgb(0, 160, 220)
            transition all 0.5s linear

  //购物车列表
    .shopcart-list
      position absolute
      top 0
      left 0
      z-index -1
      width 100%
      transform translate3d(0, -100%, 0)
      &.fold-leave-active
        transition all 0.3s linear
        transform translate3d(0, 0, 0)

      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background #f3f5f7
        border-bottom 2px solid rgba(7, 17, 27, 0.1)
        .title
          float left
          font-size 14px
          color rgb(7, 17, 27)
        .empty
          float right
          font-size 12px
          color rgb(0, 160, 220)

      .list-content
        padding 0 18px
        max-height 217px
        overflow hidden
        background #fff
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          border-1px(rgba(7,17,27,0.1))
          .name
            line-height 24px
            font-size 14px
            color rgb(7,17,27)
          .price
            position absolute
            right 90px
            bottom 12px
            line-height 24px
            font-weight 700px
            font-size 14px
            color rgb(240,20,20)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 6px

  .list-mark
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 40
    opacity 1
    filter blur(5px)
    -webkit-backdrop-filter blur(5px)
    backdrop-filter blur(5px)
    background rgba(7,17,27,0.6)
    transition all 0.3s linear
    &.fade-enter,&.fade-leave
      opacity 0
      background rgba(7,17,27,0)
      transition all 0.3s linear

</style>
