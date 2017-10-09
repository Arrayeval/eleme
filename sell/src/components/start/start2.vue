<template>
  <div class="start" :class="startType">
    <span v-for="itemClass in  itemClasses" :class="itemClass" class="start-item"></span>
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
        let score = Math.floor(this.score * 2) / 2;
        let hasDecimal = score % 1 !== 0;
        let inter = Math.floor(score);
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON);
        }
        if (hasDecimal) {
          result.push(CLS_HALF);
        }
        while (result.length < LENGTH) {
          reslut.push(CLS_OFF);
        }
        return reslut;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';
  .start
    font-size 0
    .start-item
      display inline-block
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
          bg-image('start48_on')
        &.half
          bg-image('start48_half')
        &.off
          bg-image('start48_off')
    &.start-36
      .start-item
        width 15px
        height 15px
        marigin-right 6px
        background-size 15px 15px
        &:last-child
          margin-right 0
        &.on
          bg-image('start36_on')
        &.half
          bg-image('start36_half')
        &.off
          bg-image('start36_off')
    &.start-24
      .start-item
        width 10px
        height 10px
        marigin-right 3px
        background-size 10px 10px
        &:last-child
          margin-right 0
        &.on
          bg-image('start24_on')
        &.half
          bg-image('start24_half')
        &.off
          bg-image('start24_off')


</style>
