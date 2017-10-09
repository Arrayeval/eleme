<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content" >
      <!--第一部分-->
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>

      <!--第二部分-->
      <split></split>
      <rating-select :select-type="selectType" :only-content="onlyContent" :desc="desc"
                     :ratings="ratings"></rating-select>

      <!--第三部分-->
      <!--评论列表-->
      <div class="rating-wrapper">
        <ul>
          <li v-for="(rating,key) in ratings" class="rating-item" v-show="needShow(rating.rateType,rating.text)">
            <div class="avatar"><!--人物头像-->
              <img width="28px" height="28px" :src="rating.avatar" alt="">
            </div>
            <div class="content"><!--类容部分-->
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
              </div>
              <p class="text"> {{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length!=0">
                <span class="icon-thumb_up"></span>
                <span class="item-rec"  v-for="(rec,key) in rating.recommend">{{rec}}</span>
                <!--<span class="item-rec">{{rating.recommend[0]}}</span>-->
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';

  import star from "components/start/start";
  //分割下组件
  import split from "components/split/split";
  //
  import ratingselect from "components/ratingselect/ratingselect";

  //时间格式化
  import {formatDate} from '../../common/js/date';

  const ERR_NO = 0;
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    name: 'ratings',
    data () {
      return {
        ratings: [],
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
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      star,
      split,
      'rating-select': ratingselect
    },
    created(){
      //获取数据
      let self = this;
      self.$http.get('/api/ratings')
        .then((res) => {
          if (res.data.errno === ERR_NO) {
            self.ratings = res.data.data;
            this.$nextTick(() => {
              this._initScroll();
            });

          }

        })
        .catch((err) => err);

      //筛选
      this.bus.$on('content.toggle', (e) => {
        this.onlyContent = e;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      });
      this.bus.$on('ratingtype.select', (e) => {
        this.selectType = e;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      });
    },
    methods: {
      _initScroll(){
        this.scroll = new BScroll(this.$refs.ratings, {
          click: true,
        });
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
    filters: {
      formatDate(time){
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';
  .ratings
    position absolute
    top 174px
    bottom 0
    left 0
    width 100%
    overflow hidden
    .overview
      display flex
      padding 18px 0
      .overview-left
        padding: 6px 0
        flex 0 0 137px
        width 137px
        border-right 1px solid rgba(7, 17, 27, 0.1)
        text-align center
        line-height 24px
        @media only screen and (max-width: 320px)
          flex 0 0 120px
          width 120px
        .score
          margin-bottom 6px
          font-size 24px
          color rgb(255, 153, 0)
        .title
          margin-bottom 6px
          font-size 12px
          color rgb(7, 17, 27)
        .rank
          line-height 10px
          font-size 10px
          color rgb(147, 153, 159)
      .overview-right
        flex 1
        padding 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left 6px
        .score-wrapper
          margin-bottom 8px
          font-size 0
          .title
            display inline-block
            vertical-align top
            line-height 18px
            font-size 12px
            color rgb(7, 17, 27)
          .start
            display inline-block
            vertical-align top
            line-height 18px
            margin 0 12px
          .score
            display inline-block
            vertical-align top
            font-size 12px
            color rgb(255, 153, 0)

        .delivery-wrapper
          font-size 0
          .title
            display inline-block
            vertical-align top
            font-size 12px
            color rgb(7, 17, 27)
          .delivery
            margin-left 12px
            font-size 12px
            color rgb(147, 153, 159)
    .rating-wrapper
      padding 0 18px
      .rating-item
        padding 18px 0
        border-1px(rgba(7,17,27,0.1))
        display flex
        .avatar
          flex 0 0 28px
          width 28px
          margin-right 12px
          img
            border-radius 50%

        .content
          position relative
          flex 1
          vertical-align top
          .name
            margin-bottom 4px
            line-height 12px
            font-size 10px
            color rgb(7,17,27)
          .star-wrapper
            margin-bottom 6px
            font-size 0
            .start
              display inline-block
              vertical-align top
              margin-right 6px
            .delivery
              display inline-block
              vertical-align top
              font-size 10px
              line-height 12px
              color rgb(147,153,159)

          .text
            margin-bottom 8px
            line-height 18px
            color rgb(7,17,27)
            font-size 12px
          .recommend
            line-height 16px
            font-size 0
            .icon-thumb_up,.item-rec
              display inline-block
              margin 0 8px 4px 0
              font-size 9px
            .icon-thumb_up
              color rgb(0,160,220)
            .item-rec
              padding 0 6px
              border 1px solid rgba(7,17,27,0.1)
              border-radius 1px
              font-size 9px
              color rgb(147,153,159)
              background #fff

          .time
            position absolute
            top 0
            right 0
            line-height 12px
            font-size 10px
            color rgba(7,17,27,0.5)
</style>
