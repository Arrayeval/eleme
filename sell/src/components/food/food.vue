<template>
  <transition name="move">
    <div class="good" v-show="showFlag" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="">
          <div class="back" @click="showFlag=false">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="sell-count">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>

          <!--cartcontrol组件-->
          <div class="cartcontrol-wrapper">
            <cart-control :food="food"></cart-control>
          </div>
          <!---"加入购物车"按钮-->
          <div @click.stop.prevent="addFirst($event)" class="buy" v-show="!food.count || food.count===0">加入购物车</div>
        </div>

        <!--split就是一个分割线-->
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <!--商品评价-->
        <split v-show="food.info"></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <rating-select :select-type="selectType" :only-content="onlyContent" :desc="desc"
                         :ratings="food.ratings"></rating-select>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length!=0">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating ,key) in food.ratings"
                  class="rating-item">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" alt="" class="avatar" width="12" height="12">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">

  import Vue from 'vue';

  import BScroll from 'better-scroll';

  import cartcontrol from 'components/cartcontrol/cartcontrol';
  //分割下组件
  import split from "components/split/split";
  //
  import ratingselect from "components/ratingselect/ratingselect";

  //引入时间格式函数
  import {formatDate} from '../../common/js/date';

  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;
  export default {
    name: 'food',
    data () {
      return {
        showFlag: false,
        //ratingselect中的props数据初始化
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽',
        },
      }
    },
    created(){
      this.bus.$on('content.toggle', (e) => {
        this.onlyContent = e;
        this.$nextTick(() => {
          this.foodScroll.refresh();
        });
      });
      this.bus.$on('ratingtype.select', (e) => {
        this.selectType = e;
        this.$nextTick(() => {
          this.foodScroll.refresh();
        });
      });
    },
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      _initBScroll(){
        this.foodScroll = new BScroll(this.$refs.food, {
          click: true,
        });
      },

      //控制商品详情页的显示
      show(){
        //显示浮层
        this.showFlag = true;

        //每一次展开详情页面，都要进行初始化
        this.selectType = ALL;
        this.onlyContent = true;

        //加载better-scroll方法
        this.$nextTick(() => {
          if (!this.foodScroll) {//优化：如果已经加载foodScroll，就不在重新生成，而是刷新一下即可
            this._initBScroll();
          }
          else {
            this.foodScroll.refresh();
          }
        });
      },

      /*添加商品*/
      addFirst(event){
        if (!event._constructed) {
          return;
        }
        //触发抛物线小球
        this.bus.$emit('cart.add', event.target);
        //一般给对象新添加属性的时候建议使用Vue.set()方法，这样可以避免一些检测不到的问题
        Vue.set(this.food, 'count', 1);
      },

      /*进行内容的过滤*/
      needShow(type, text){
        if (!text && this.onlyContent) {
          return false;
        }
        if (this.selectType == ALL) {
          return true;
        }
        else {
          return type === this.selectType;
        }
      }
    },
    filters:{
      formatDate(time){
            let date=new Date(time);
            return formatDate(date,'yyyy-MM-dd hh:mm:ss');
        }
    },
    components: {
      'cart-control': cartcontrol,
      split,
      'rating-select': ratingselect
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';
  .good
    position fixed
    left 0
    top 0
    bottom 48px
    z-index 30
    width 100%
    background #fff
    &.move-enter
      tranform translate3d(100%, 0, 0)
      transition all 0.3s linear
    &.move-enter-active
      tranform translate3d(100%, 0, 0)
      transition all 0.3s linear

    .image-header
      position relative
      width 100%
      height 0
      padding-top 100%
      img
        position absolute
        top 0
        left 0
        width 100%
        height 100%
      .back
        position absolute
        top 10px
        left 0
        .icon-arrow_lift
          display block
          padding 10px
          font-size 20px
          color #fff

    .content
      padding 18px
      position relative
      .title
        line-height 14px
        margin-bottom 8px
        font-size 14px
        font-weight 700
        color rgb(7, 17, 27)
      .detail
        margin-bottom 18px
        line-height 10px
        height 10px
        font-size 0
        .sell-count, .rating
          font-size 10px
          color rgb(147, 153, 159)
        .sell-count
          margin-right 12px

      .price
        font-weight 700
        line-height 24px
        font-size 0
        .now
          margin-right 8px
          font-size 14px
          color rgb(240, 20, 20)
        .old
          text-decoration line-through
          font-size 10px
          color rgb(147, 153, 159)

      .cartcontrol-wrapper
        position absolute
        right 12px
        bottom 12px
      .buy
        position absolute
        right 18px
        bottom 18px
        z-index 10
        height 24px
        line-height 24px
        padding 0 12px
        font-size 10px
        border-radius 12px
        color #fff
        background rgb(0, 160, 220)

    .info
      padding 18px
      .title
        line-height 14px
        margin-bottom 6px
        font-size 14px
        color rgb(77, 17, 27)
      .text
        line-height 24px
        padding 0 8px
        font-size 12px
        color rgb(77, 85, 93)

    .rating
      padding-top 18px
      .title
        line-height 14px
        margin-left 18px
        font-size 14px
        color rgb(77, 17, 27)
      .rating-wrapper
        padding 0 18px
        .rating-item
          position relative
          padding 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position absolute
            right 0
            top 16px
            line-height 12px
            font-size 0
            .name
              display inline-block
              vertical-align top
              margin-right 6px
              font-size 10px
              color rgb(147, 153, 159)
            .avatar
              border-radius 50%

          .time
            margin-bottom 6px
            line-height 12px
            font-size 10px
            color rgb(147, 153, 159)
          .text
            line-height 16px
            font-size 12px
            color rgb(7, 17, 27)
            .icon-thumb_up, .icon-thumb_down
              line-height 24px
              margin-right 4px
              font-size 12px
            .icon-thumb_up
              color rgb(0, 160, 220)
            .icon-thumb_down
              color rgb(147, 153, 159)
        .no-rating
          padding 16px 0
          font-size 12px
          color rgb(17,153,159)
</style>
