import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

// eventbus
Vue.prototype.$Bus = new Vue()

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
