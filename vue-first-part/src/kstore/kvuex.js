let Vue

class Store {
  constructor(options = {}) {
    console.log(options);
    // 借鸡生蛋 将state打造成响应式，（原理放在data中）
    this._vm = new Vue({
      data: {
        $$state: options.state
      }
    })
    // 保存 mutations
    this._mutations = options.mutations || {} 
    // 保存 actions
    this._actions = options.actions || {} 

    // 上两者绑定this指向
    const store = this
    const { commit, dispatch } = store
    this.commit = function boundCommit(type, payload) {
      commit.call(store, type, payload)
    }
    this.dispatch = function boundDispatch(type, payload) {
      dispatch.call(store, type, payload)
    }
  }
  
  // 获取 state
  get state() {
    return this._vm._data.$$state
  }
  // 直接设置 state 不允许  
  set state(v) {
    console.error('please use replaceState to reset state')
  }

  // commit
  commit (type, payload) {
    // 获取方法
    const entry = this._mutations[type]
    console.log(this._mutations, type)
    if (!entry) {
      console.error(`${type} is undefined`)
      return
    }
    entry(this.state, payload)
  }
  
  // dispatch
  dispatch(type, payload) {
    const entry = this._actions[type]

    if (!entry) {
      console.error(`${type} is undefined`)
      return
    }

    entry(this, payload)
  }

}

function install(_Vue) {
  Vue = _Vue

  // 挂载全局 $store
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        // 全局挂载
        Vue.prototype.$store = this.$options.store
      }
    },
  })
}

// 以对象的形式导出 才能实现外部的 new Vuex.Store({})
export default {
  Store,
  install
}