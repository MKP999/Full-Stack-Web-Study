let Vue

class Store {
    constructor(options = {}) {
        this._vm = new Vue ({
            data: {
                // $$ 表示什么
                $$state: options.state
            }
        })
        // 保存⽤户配置的mutations选项
        this.mutations = options.mutations || {}
        // 保存⽤户编写的actions选项
        this._actions = options.actions || {}

        // 绑定commit上下⽂否则action中调⽤commit时可能出问题!!
        // 同时也把action绑了，因为action可以互调
        const store = this
        const { commit, action } = store
        this.commit = function boundCommit(type, payload) {
            commit.bind(store, type, payload)
        }
        this.action = function boundAction(type, payload) {
            return action.call(store, type, payload)
            }
    }

    get state() {
        return this._vm._data.$$state
    }

    set state(v) {
        return console.error('please use replaceState to reset state')
    }

    commit (type, payload) {
        // 获取type对应的mutation
        const entry = this._mutations[type]

        if (!entry) {
            console.error(`unknown mutation type: ${type}`);
            return
        }
        // 指定上下⽂为Store实例
        // 传递state给mutation
        entry(this.state, payload);
    }

    dispatch (type, payload) {
        // 获取⽤户编写的type对应的action
        const entry = this._actions[type]

        if (!entry) {
            console.error(`unknown mutation type: ${type}`);
            return
        }

        // 异步结果处理常常需要返回Promise
        return entry(this, payload);
    }
}

function install (_Vue) {
    Vue = _Vue

    // 挂在全局$store
    Vue.mixin({
        beforeCreate() {
            if (this.$options.store) {
                Vue.prototype.$store = this.$options.store
            }
        },
    })
}

export default {
    Store,
    install
}