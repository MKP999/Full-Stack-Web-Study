import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Notice from '@/components/Notice.vue'
import create from '@/util/create'
import store from './store'

Vue.prototype.$notice = function (props) {
  create(Notice,props).show()
}

Vue.config.productionTip = false

// eventbus
Vue.prototype.$Bus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
