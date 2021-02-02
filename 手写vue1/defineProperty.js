
// 数据响应式
function defineReactive(obj, key, value) {

    // 若value是对象 则需要递归处理
    observe(value)

    Object.defineProperty(obj, key, {
        get() {
            console.log('get', value)
            return value
        },
        set(newValue) {
            if (newValue !== value) {
                value = newValue
                console.log('set', newValue)
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

    Object.keys(obj).forEach(key => {
        defineReactive(obj, key, obj[key])
    })
}

// 对象先添加属性
// 由于新增属性无法被拦截，所以必须有特定api做对应响应式拦截
function set(obj, key, value) {
    if (typeof obj !== 'object' || obj == null) {
        return
    }

    defineReactive(obj, key, value)
}

// const obj = {}
// defineReactive(obj, 'foo', 'foo')

// obj.foo
// obj.foo = 'bar'
const obj = {foo: 'foo', bar: 'bar', a: {foo: 1}}
observe(obj)
set(obj, 'abc', 'abc')

