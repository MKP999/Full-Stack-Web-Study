<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    // model ref rules
    provide() {
      return {
        form: this  // 这里传递的是表单组件的实例
      }
    },
    props: {
      model: {
        type: Object,
        required: true
      },
      rules: Object
    },
    methods: {
      // 全局校验
      // 执行内部所有的 FormItem校验
      validate(cb) {
        const tasks = this.$children.filter(item => item.prop)
          .map(item => item.validate())

    //统一校验 结果
        Promise.all(tasks).then(() => cb(true))
          .catch(() => cb(false))
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>