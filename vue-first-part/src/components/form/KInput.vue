<template>
  <div>
    <input :type="type" :value="value" @input="input" v-bind="$attrs">
    <!-- {{value}} -->
  </div>
</template>

<script>
  export default {
    inheritAttrs: false,
    props: {
      type: {
        type: String,
        default: 'text'
      },
      value: {
        type:String,
        default: ''
      }
    },
    methods: {
      input(e) {
        // 触发父级的 v-model语法糖中的 input事件
        this.$emit('input', e.target.value)
        // 检测
        this.$parent.$emit('validate')
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>