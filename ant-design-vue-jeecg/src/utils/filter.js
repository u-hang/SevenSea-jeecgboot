import Vue from "vue";
import * as dayjs from "dayjs";

Vue.filter('MillionFormat', function (value) {
  if (!value) return ''
  if (value.toString().length > 5) {
    // var tmpVal=Math.floor(value / 10000)
    return Math.floor(value / 10000).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '万' //.toFixed(2)
  } else {
    return Math.floor(value / 10000)
  }
})

Vue.filter('NumberFormat', function (value) {
  if (!value) {
    return '0'
  }
  let intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') //将整数部分逢三一断
  return intPartFormat
})

Vue.filter('dayjs', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(dataStr).format(pattern)
})

Vue.filter('moment', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(dataStr).format(pattern)
})

/** 字符串超长截取省略号显示 */
Vue.filter('ellipsis', function (value, vlength = 25) {
  if(!value){
    return "";
  }
  console.log('vlength: '+ vlength);
  if (value.length > vlength) {
    return value.slice(0, vlength) + '...'
  }
  return value
})