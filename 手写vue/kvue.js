// 数据响应式
function defineReactive(obj, key, value) {

    // 若value是对象 则需要递归处理
    observe(value)

    // 依赖收集，创建Dep实例
    const dep = new Dep()

    Object.defineProperty(obj, key, {
        get() {
            console.log('get', value)
            // 调用到get就收集依赖
            Dep.target && dep.addDep(Dep.target)
            return value
        },
        set(newValue) {
            if (newValue !== value) {
                value = newValue
                console.log('set', newValue)
                // 依赖 通知更细
                dep.notify()
            }
        }
    })
}

// 对对象中的每个属性执行响应式
function observe(obj) {
    // 严谨判断
    if (typeof obj !== 'object' || obj == null) {
        return 
    }

    // 创建Observer实例:以后出现一个对象，就会有一个Observer实例
    new Observer(obj)
}

class KVue {
    constructor(options) {
        // 保存选项
        this.$options = options
        this.$data = options.data

        // 响应式处理
        observe(this.$data)

        // 代理
        proxy(this)

        // 编译模板 编译器
        new Compile('#app', this)
    }
}

// 做数据响应化
class Observer {
    constructor(value) {
        this.value = value
        this.walk(value)
    }

    // 遍历对象做响应式
    walk(obj) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key])
        })
    }
}

// 对data做代理 （template中可以直接获取data属性 通过这层代理，无需data.xxx）
function proxy(vm) {
    Object.keys(vm.$data).forEach(key => {
        Object.defineProperty(vm, key, {
            get() {
                return vm.$data[key]
            },
            set(value) {
                vm.$data[key] = value
            }
        })
    })
}

// 编译 - Compile 编译模板
// Compiler: 解析模板，找到依赖，并和前面拦截的属性关联起来
// new Compiler('#app', vm)
class Compile {
    constructor(el, vm) {
        this.$el = document.querySelector(el)
        this.$vm = vm
        
        if (this.$el) {
            this.compile(this.$el)
        }
    }

    compile(el) {
        const childNodes = el.childNodes
        // 遍历这个el
        Array.from(childNodes).forEach(node => {
            if (this.isElement(node)) {
                console.log("编译元素" + node.nodeName)
                this.compileElement(node)
            } else if (this.isInterpolation(node)) {
                console.log("编译插值⽂本" + node.textContent)
                this.compileText(node)
            }

            // 递归
            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node)
            }
        })
    }

    // 编译插值 —— 解析绑定表达式{{}}
    compileText(node) {
        // console.log(RegExp.$1)
        // // 转化为对应的data属性-值
        // node.textContent = this.$vm[RegExp.$1]
        this.update(node, RegExp.$1, 'text')
    }

    // 编译元素 元素中可能有指令 v-text 或者 @事件
    compileElement(node) {
        let nodeAttrs = node.attributes
        // 遍历元素中的所有属性
        Array.from(nodeAttrs).forEach(attr => {
            let attrName = attr.name
            let exp = attr.value
            // 判断是否为 指令
            if (this.isDirective(attrName)) {
                // v-text 截取从第二位开始 text
                let dir = attrName.substring(2)
                // 若有 text这个方法 就执行 text(node, exp)
                this[dir] && this[dir](node, exp)
            }
        })
    }

    // 更新封装 封装是为了便于为每个依赖添加一个watcher
    update (node, exp, dir) {
        const fn = this[dir+'Updater']
        // 此处是第一次的加载 渲染 初始化
        fn && fn(node, this.$vm[exp])
        // 更新
        new Watcher(this.$vm, exp, function(val) {
            // 此处是用于观察者的渲染
            fn && fn(node, val)
        })

    }

    // 判断是否为 dom编译元素
    isElement(node) {
        console.log(node)
        return node.nodeType == 1
    }

    // 判断是否为 编译插值文本 {{counter}}
    isInterpolation(node) {
        return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }

    // 判断是否为 指令 是否为 k-开头
    isDirective(attr) {
        return attr.indexOf('k-') == 0
    }

    // 执行 k-text指令
    text(node, exp) {
        // node.textContent = this.$vm[exp]
        this.update(node, exp, 'text')
    }

    // 执行 k-html指令
    html(node, exp) {
        // node.innerHTML = this.$vm[exp]
        this.update(node, exp, 'html')
    }

    // 执行text更新函数
    textUpdater(node, exp) {
        node.textContent = exp
    }

    // 执行html更新函数
    htmlUpdater(node, exp) {
        node.innerHTML = exp
    }
}


// Watcher
//临时⽤于保存watcher测试⽤
// const watcher = []

// 监听器：负责更新视图
class Watcher {
    constructor(vm, key, updateFn) {
        //kvue实例
        this.vm = vm
        // 依赖key
        this.key = key
        // 更新函数
        this.updateFn = updateFn

        // // 临时放入 watchers数组
        // watcher.push(this)

        // 读一下当前key，触发依赖收集
        // Dep的静态属性target
        Dep.target = this
        vm[key]
        Dep.target = null
    }

    // 更新
    // 未来会被dep调用
    update () {
        this.updateFn.call(this.vm, this.vm[this.key])
    }
}

// 声明Dep
// Dep: 保存所有watcher实例，当某个key发生变化，通知他们执行更新
class Dep {
    constructor() {
        this.deps = []
    }

    // 添加依赖
    addDep(dep) {
        this.deps.push(dep)
    }

    // 通知 更新
    notify() {
        this.deps.forEach(dep => dep.update())
    }

}