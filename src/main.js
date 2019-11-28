import Vue from 'vue'
import Vuex from 'vuex';
import VueRouter from 'vue-router'
import App from './App.vue'
import routes from './routes.js'
import store from './store'
import '../public/theme/index.css'
import ElementUI from 'element-ui'
import {
  getCookie
} from './api/cookie.js'
import {
  AccesstoPermissions
} from './api/index.js'
import moment from 'vue-moment'
import momentc from 'moment/moment'

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(moment)

//时间戳过滤器
Vue.filter('momentc', function(value, formatString) {
  var date = new Date(value);
  formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
  return momentc(date).format(formatString); // 这是时间戳转时间
});


// 登录拦截
const router = new VueRouter(routes)
router.beforeEach(({
  meta,
  path
}, from, next) => {
  var {
    auth = true
  } = meta
  if (auth && path != '/OFRIlogin' && path != '/XYZNlogin' && path != '/XYAFlogin' && path != '/commonPassword/step1' && path != '/commonPassword/step2' && path != '/commonPassword/step3') {
    var data = AccesstoPermissions();
    var Data = data.data;
    var users = {
      CorporateName:data.CorporateName,
      Permission: Data.Permission,
      information: Data.information,
      identity_type: Data.identity_type
    };
    store.commit('setUsers', users);
    if (data.success == false) {
      console.log(data.CorporateName);
      return next({
        path: '/'+data.CorporateName+"login"
      })
    }
  }
  next()
})

// 全局按钮权限控制
Vue.prototype.Jurisdiction = function(val) {
  var Permission = store.state.user.Permission
  for (var i = 0; i < Permission.length; i++) {
    if (val == Permission[i].permissionCode) {
      return true;
      break;
    }
  }
};

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
