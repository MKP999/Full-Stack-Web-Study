<template>
  <div>
    <button @click="changeMsg">修改同级组件</button>
    <h2 @click="testListeners">点击测试 $listeners</h2>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        
      }
    },
    methods: {
      changeMsg() {
        this.$Bus.$emit('change', '修改后')
      },
      testListeners() {
        this.$listeners.doTest()
        this.$listeners.doMore()
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>