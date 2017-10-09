import Vue from 'vue';
import Router from 'vue-router';


/*
* 通过webpack.base.conf.js的配置，alis---resolve--components 配置相对路径
* */
//import seller from '../components/seller/seller.vue';
import seller from 'components/seller/seller.vue';
//import goods from '../components/goods/goods.vue';
import goods from 'components/goods/goods.vue';
import ratings from 'components/ratings/ratings.vue';


Vue.use(Router);
//let router=new Router();
//router.go('/goods');
export default new Router({
  routes: [
    {
      path: '/',//默认路劲(命名视图)
     // component: goods
      components: {
      //  default:goods,
        a: goods,
        b: seller,
        c:ratings
      }
    },

    {
      path: '/seller',
      name: 'seller',
      component: seller
    },
    {
      path: '/goods',
      name: 'goods',
      component: goods
    },
    {
      path: '/ratings',
      name: 'ratings',
      component: ratings
    }
  ]
})
