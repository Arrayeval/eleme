<template>
  <div class="start" :class="startType">
    <span v-for="itemClass in  itemClasses"  :class="itemClass" class="start-item"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  const LENGTH = 5;
  const CLS_ON = 'on';
  const CLS_HALF = 'half';
  const CLS_OFF = 'off';


  export default {

    data () {
      return {}
    },
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      startType(){
        return 'start-' + this.size;
      },
      itemClasses(){
        let result = [];
        let score = Math.floor(this.score * 2) / 2;   //分数
        let hasDecimal = score % 1 !== 0;             //是否有半星
        let inter = Math.floor(score);
        for (let i = 0; i < inter; i++) {
          result.push(CLS_ON);                       //添加整星
        }
        if (hasDecimal) {
          result.push(CLS_HALF);                      //添加半星
        }
        while (result.length < LENGTH) {            //添加‘灰色’的星星
          result.push(CLS_OFF);
        }
        return result;
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';
  .start
    font-size 0
    .start-item
      display inline-block   //设置成行内快元素
      background-repeat no-repeat
    &.start-48
      .start-item
        width 20px
        height 20px
        marigin-right 22px
        background-size 20px 20px
        &:last-child
          margin-right 0
        &.on
          bg-image('star48_on')
        &.half
          bg-image('star48_half')
        &.off
          bg-image('star48_off')
    &.start-36
      .start-item
        width 15px
        height 15px
        margin-right 6px
        background-size 15px 15px
        &:last-child
          margin-right 0
        &.on
          bg-image('star36_on')
        &.half
          bg-image('star36_half')
        &.off
          bg-image('star36_off')
    &.start-24
      .start-item
        width 10px
        height 10px
        marigin-right 3px
        background-size 10px 10px
        &:last-child
          margin-right 0
        &.on
          bg-image('star24_on')
        &.half
          bg-image('star24_half')
        &.off
          bg-image('star24_off')


</style>
