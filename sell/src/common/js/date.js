/**
 * Created by Administrator on 2017/10/7 0007.
 */

/*
使用正则表达式进行匹配
* */
export function  formatDate(date,fmt){
  if(/(y+)/.test(fmt)){
    fmt=fmt.replace(RegExp.$1,(date.getFullYear()+'').substr(4-RegExp.$1.length));
  }
  let o = {
    "M+":date.getMonth()+1,
    "d+":date.getDate(),
    "h+":date.getHours(),
    "m+":date.getMinutes(),
    "s+":date.getSeconds()
  };
  for(let k in o){
    if(new RegExp(`(${k})`).test(fmt)){
      let str=o[k]+'';
      fmt=fmt.replace(RegExp.$1,(RegExp.$1.length===1)?str:padLeftZero(str));//月，日，时，分，秒存在单数的情况
    }
  }
  return fmt;
};
function padLeftZero(str){//补0
  return ('00'+str).substr(str.length);
}
