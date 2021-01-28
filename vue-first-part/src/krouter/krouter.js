let Vue;    // 引用构造函数 VueRouter使用
// 需求分析
// 作为⼀个插件存在：实现VueRouter类和install⽅法
// 实现两个全局组件：router-view⽤于显示匹配组件内容，router-link⽤于跳转
// 监控url变化：监听hashchange或popstate事件
// 响应最新url：创建⼀个响应式的属性current，当它改变时获取对应组件并显示

// 保存选项
class VueRouter {
    constructor(options) {
        this.$options = options;

        // 处理路由
        // 缓存path和route映射关系
        this.routesMap = {}
        this.$options.routes.forEach(route => {
            this.routesMap[route.path] = route
        })
        
        // 创建current响应式 为当前url
        Vue.util.defineReactive(this, 'current', '/')
        // 监听hash的变化  hashchange 
        window.addEventListener('hashchange', this.onHashChange.bind(this))
        window.addEventListener('load', this.onHashChange.bind(this))
    }

    onHashChange () {
        this.current = window.location.hash.slice(1)
        console.log(this.current)
    }
}

// 插件：实现install⽅法，注册$router
// Vue.use() 方法会自动调用 install
VueRouter.install = function (_Vue) {
    // 引⽤构造函数，VueRouter中要使⽤
    Vue = _Vue;

    // 任务1：挂载$router
    // 使用mixin 主要原因是use代码在前，Router实例创建在后，⽽install逻辑⼜需要⽤到该实例
    Vue.mixin({
        beforeCreate() {
            // 只有根组件拥有router选项
            if (this.$options.router) {
                // vm.$router 总路由
                Vue.prototype.$router = this.$options.router
            }
        },
    })
    
    // 任务2：实现两个全局组件router-link和router-view
    // 参数 Vue.component(component-name(组件名), Component(组件))
    Vue.component('router-link', {
        props: {
            to: {
                type: String,
                required: true,
                default: ''
            }
        },
        render(h) {
            // 参数 h(tag类型, props属性或事件, children)
            return h('a', {
                    attrs: {'href': '#' + this.to }
                },
                this.$slots.default
            )
        },
    })
    Vue.component('router-view', {
        render(h) {
            // 组件
            // let component;
            // this.$router.$options.routes.forEach(route => {
            //     if(route.path === this.$router.current) {
            //         component = route.component
            //     }
            // })
            // 动态获取对应组件
            const { routesMap, current } = this.$router
            const component = routesMap[current] ? routesMap[current].component : null
            return h(component)
        },
    })
}

export default VueRouter