<template>
  <div class="goods">

    <!--左侧菜单-->
    <div class="menu-wrapper" ref="menuwrapper">
      <ul>
        <li v-for="(item , key) in goods" class="menu-item border-1px" :class="{'current':currentIndex==key}"
            @click="selectMenu(key,$event)">
          <span class="text">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
eeeeeeeeeeeeeeeeee
    <!--右侧商品导航-->
    <div class="foods-wrapper" ref="foodswrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item "  @click="selectFood(food,$event)">
              <div class="icon">
                <img width="57px" height="57px" :src="food.icon" alt="">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">${{food.price}}</span><span class="old"
                                                                v-show="food.oldPrice">${{food.oldPrice}}</span>
                </div>
                <!--加减按钮控件-->
                <div class="cartcontrol-wrapper">
                  <cart-control :food="food"></cart-control>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <!--底部金额组件-->
    <shop-cart   :select-foods="selectFoods"  :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shop-cart>

    <!--商品详情-->
    <food :food="selectedFood" ref='food'></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from "vue";
  //下滑
  import BScroll from 'better-scroll';
  //底部计算价格
  import shopcart from 'components/shopcart/shopcart';
  //加减按钮（商品右侧）
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  //food (商品详情)
  import food from 'components/food/food';

  const ERR_OK = 0;
  export default {
    name: ' ',

    data () {//wwwwwww
      return {
        Bus:new Vue(),//中央事件总线(用于抛物线小球)
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood:{}
      }
    },

    props: {
      seller: {
        type: Object
      },
    },

    //计算属性实时的发生变化
    computed: {
      currentIndex(){//this.scrollY是始终是在变化的。因此导致i变化
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];//上边界
          let height2 = this.listHeight[i + 1];//下边界
          if (!height2 || this.scrollY >= height1 && this.scrollY < height2)
            return i;
        }
        return 0;
      },
      /*
      * 选中的food
      * */
      selectFoods(){
          let foods=[];
          this.goods.forEach((good)=>{
              good.foods.forEach((food)=>{
                if(food.count){//说明已经选中
                  foods.push(food);
                }
              });

          });
          return foods;
      }
    },
    created(){
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      this.$http.get('/api/goods').then((res) => {
        (res.data.errno === ERR_OK) &&
        (this.goods = res.data.data);
        /// console.table(this.goods);
        this.$nextTick(() => {
          this._initScroll();
          this._calculateHeight();
        });
      });


    },
    methods: {
      /*
       * 左侧选中（标记）右侧
       * */
      selectMenu(index, event){
        if (!event._constructed) {
          //better-scroll经过改造event对象，在自定义开发的时候event拥有_constructed属性，如果在浏览器下面是没有这个属性的
          return 0;
        }
        let foodList = this.$refs.foodswrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];

        this.foodsScroll.scrollToElement(el, 300);//滚动到el元素,300毫秒
      },

      /*
       * 滚动效果
       * */
      _initScroll(){
        this.menuScroll = new BScroll(this.$refs.menuwrapper, {
          click: true,//better-scroll在移动端初始化的时候会禁止一些默认事件（例如点击事件），因此要进行额外的配置
          /*
           但是有时这样会有bug,就是在你在pc端运行时，事件可能会出发两次，这个时候我们就要就行判断
           */
        });
        this.foodsScroll = new BScroll(this.$refs.foodswrapper, {
          probeType: 3,//实施监听滚动
          click: true
        });
        this.foodsScroll.on('scroll', (pos) => {//监听滚动事件
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },

      /*
       * 计算滚动
       * */
      _calculateHeight(){
        let foodList = this.$refs.foodswrapper.getElementsByClassName('food-list-hook');
        //得到的是一个类数组对象，具有数组的属性但是不萌使用数组的API
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;//累加之后push数组，因为高度是累加的
          this.listHeight.push(height);
        }

//              [].reduce(function(total,cur){
//                  total+=cur.clientHeight;
//                  this.listHeight.push(total);
//                console.log(this.listHeight);
//              }.call(foodList),height);

        // console.log(this.listHeight);
      },

      /*
      * 选中商品
      * */
      selectFood(food,event){
          if(!event._constructed){
              return ;
          }
         // console.log(food);
          this.selectedFood=food;
          this.$refs.food.show();
      },


    },
    components: {
      'shop-cart': shopcart,
      'cart-control':cartcontrol,
      food,
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';
  .goods
    position absolute
    top 174px
    bottom 46px
    width 100%
    display flex
    overflow hidden

    .menu-wrapper
      flex 0 0 80px
      width 80px
      background #f3f5f7
      .menu-item
        display table
        height 54px
        width 56px
        padding 0 12px
        line-height 14px
        &.current
          position relative
          margin-top 10px
          background #fff
          font-weight 700
          .text
            border-none()
        .icon
          display inline-block
          width 16px
          height 16px
          vertical-align top
          margin-right 2px
          background-size 16px 16px
          background-repeat no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display table-cell
          width 56px
          vertical-align middle
          font-size 12px
          border-1px (rgba(7, 17, 27, 0.1))

    .foods-wrapper
      flex 1
      .title
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147, 152, 159)
        background-color #f3f5f7
      .food-item
        display flex
        margin 18px
        padding-bottom 18px
        border-1px (rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom 0
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          .name
            margin 2px 0 8px 0
            height 14px
            line-height 14px
            font-size 14px
            color rgb(7, 17, 27)
          .desc, .extra
            line-height 10px
            font-size 10px
            color rgb(147, 153, 159)
          .desc
            margin-bottom 8px
            line-height 12px
          .extra
            .count
              margin-right 12px
          .price
            font-weight 700
            line-height 24px
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
            right 0
            bottom 12px

</style>
