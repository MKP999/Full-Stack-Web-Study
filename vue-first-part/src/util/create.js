import Vue from 'vue'

// 创建函数接受要创建组件定义
function create(Component, props) {
  // 一、Vue.extend
  const Ctor = Vue.extend(Component)
  const comp = new Ctor({propsData: props})
  console.log(comp)
  comp.$mount()

  document.body.appendChild(comp.$el)
  // 给组件实例添加销毁方法
  comp.remove = () => {
    document.body.removeChild(comp.$el)
    comp.$destroy()
  }

  // 二、 vue实例
  // 创建一个vue 新实例
  // const vm = new Vue({
  //   render(h) {
  //     // render函数将传入组件配置对象转换为虚拟dom
  //     // console.log(h(Component, {props}))
  //     console.log({props})
  //     return h(Component, {props})
  //   },
  // }).$mount()// $mount()本质上将vdom=》dom
  // console.log(vm)

  // // 将⽣成dom元素追加⾄body
  // document.body.appendChild(vm.$el)
  // // 给组件实例添加销毁方法
  // const comp = vm.$children[0]
  // comp.remove = () => {
  //   document.body.removeChild(vm.$el)
  //   vm.$destroy()
  // }

  return comp
}

export default create