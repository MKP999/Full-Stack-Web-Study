import Vue from 'vue'
import Vuex from './kvuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    counter: 0
  },
  mutations: {
    add(state, num) {
      state.counter += num
    }
  },
  actions: {
    asyncAdd({commit}, num) {
      setTimeout(() => {
        commit('add', num)
      }, 1000)
    } 
  },
  modules: {
  }
})
