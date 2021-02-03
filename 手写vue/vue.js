// 响应式
function defineReactive(obj, key, value) {

    observe(value)

    // 创建依赖收集实例
    const dep = new Dep()

    Object.defineProperty(obj, key, {
        get() {
            console.log('get ' +value)
            Dep.target && dep.addDep(Dep.target)
            return value
        },
        set(newValue) {
            if (newValue !== value) {
                console.log('set ' + obj[key])
                value = newValue

                // 通知更新
                dep.notify()
            }
        }
    })
}

// 遍历对象
function observe(obj) {
    if (typeof obj !== 'object' || obj == null) {
        return
    }

    new Observer(obj)
}

class KVue {
    constructor(options) {
        this.$options = options
        this.$data = options.data
        
        // 响应
        observe(this.$data)

        // 代理
        proxy(this)

        // 编译
        new Compiler('#app', this)
    }

}

// 数据响应
class Observer {
    constructor(obj) {
        this.obj = obj
        this.walk(obj)
    }

    walk(obj) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key])
        })
    }
}

// 代理data
function proxy(vm) {
    Object.keys(vm.$data).forEach(key => {
        Object.defineProperty(vm, key, {
            get() {
                return vm.$data[key]
            },
            set(newValue) {
                vm.$data[key] = newValue
            }
        })
    })
}

// 编译器
class Compiler {
    constructor(el, vm) {
        this.$el = document.querySelector(el)
        this.$vm = vm

        if (this.$el) {
            this.compile(this.$el)
        }
    }

    compile(el) {
        const childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            if (this.isElement(node)) {
                console.log("编译元素", node)
                this.compileElement(node)
            } else if (this.isInterpolation(node)) {
                console.log("编译插值文本", node)
                this.compileText(node)
            }
            
            // 递归处理
            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node)
            }
        })

    }

    isElement(node) {
        return node.nodeType == 1
    }

    isInterpolation(node) {
        return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }

    // 编译插值文本
    compileText(node) {
        // console.log(RegExp.$1)
        // node.textContent = this.$vm[RegExp.$1]
        this.update(node, RegExp.$1, 'text')
    }

    // 编译元素
    compileElement(node) {
        const attributes = node.attributes
        Array.from(attributes).forEach(attr => {
            const attrName = attr.name
            const exp = attr.value
            // 判断是否为 指令
            if (this.isDirective(attrName)) {
                const dir = attrName.slice(2)
                this[dir] && this[dir](node, exp)
            }
        })
    }

    update(node, exp, dir) {
        const fn = this[dir+'Updater']
        // 初始化
        fn && fn(node, this.$vm[exp])

        // 观察者更新
        new Watcher(this.$vm, exp, function(val) {
            fn && fn(node, val)
        })
    }

    isDirective(attrName) {
        return attrName.indexOf('k-') === 0
    }

    text(node, exp) {
        // node.textContent = this.$vm[exp]
        this.update(node, exp, 'text')
    }

    html(node, exp) {
        // node.innerHTML = this.$vm[exp]
        this.update(node, exp, 'html')
    }

    textUpdater(node, value) {
        node.textContent = value
    }

    htmlUpdater(node, value) {
        node.innerHTML = value
    }

}

// 监听 观察者
class Watcher {
    constructor(vm, key, updateFn) {
        this.vm = vm
        this.key = key
        this.updateFn = updateFn 

        Dep.target = this
        vm[key]
        Dep.target = null
    }

    update () {
        this.updateFn.call(this.vm, this.vm[this.key])
    }
}

// 依赖收集
class Dep {
    constructor() {
        this.deps = []
    }

    addDep(dep) {
        this.deps.push(dep)
    }

    notify() {
        this.deps.forEach(dep => dep.update())
    }
}