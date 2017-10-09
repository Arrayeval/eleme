<template>
  <div class="ratingselect">
    <div class="rating-type">
      <span class="block positive" :class="{'active':selectType===2}" @click="select(2,$event)">{{desc.all}}
      <span class="count">{{ratings.length}}</span>
      </span>
      <span class="block positive" :class="{'active':selectType===0}" @click="select(0,$event)">{{desc.positive}}
      <span class="count">{{positives.length}}</span>
      </span>
      <span class="block negative" :class="{'active':selectType===1}" @click="select(1,$event)">{{desc.negative}}
      <span class="count">{{negatives.length}}</span>
      </span>
    </div>

    <div class="switch" :class="{'on':onlyContent}" @click="toggleContent($event)">
      <span class="icon-check_circle"></span>
      <span class="text">只看内容评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    name: ' ',
    data () {
      return {}
    },
    computed:{
        positives(){

            return this.ratings.filter((rating)=>{
                return rating.rateType===POSITIVE;
            });
        },
        negatives(){
            return this.ratings.filter((rating)=>{
                return rating.rateType===NEGATIVE;
            });
        },
    },
    props: {
      ratings: {//评价
        type: Array,
        default(){
          return [];
        }
      },
      selectType: {//选择类型
        type: Number,
        default: ALL
      },
      onlyContent: {//只读内容
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default(){
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意',
          }
        }
      }
    },
    methods: {
      select(type, event){
        if (!event._constructed) {
          return;
        }
        this.selectType = type;
        this.bus.$emit('ratingtype.select',type);
      },

      toggleContent(event){
          if(!event._constructed){
              return ;
          }
          this.onlyContent=!this.onlyContent;
          this.bus.$emit('content.toggle',this.onlyContent);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';
  .ratingselect
    .rating-type
      padding 18px 0
      margin 0 18px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size 0
      .block
        display inline-block
        padding 8px 12px
        margin-right 8px
        border-radius 1px
        font-size 12px
        color rbg(77, 85, 93)
        &.active
          color #fff
        .count
          line-height 16px
          margin-left 2px
          font-size 8px
        &.positive
          background rgba(0, 160, 220, 0.2)
          &.active
            background rgb(0, 160, 220)
        &.negative
          background rgba(77, 85, 93, 0.2)
          &.active
            background rgb(77, 85, 93)

    .switch
      padding 12px 18px
      line-height 24px
      border-bottom 1px solid rgba(7, 17, 27, 0.1)
      color rgb(147, 153, 159)
      font-size 0
      &.on
        .icon-check_circle
          color #00c850
      .icon-check_circle
        display inline-block
        vertical-align top
        margin-right 4px
        font-size 24px

      .text
        display inline-block
        vertical-align top
        font-size 12px

</style>
