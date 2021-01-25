<template>
  <div>
    <h3>{{msg}}</h3>
    <p>{{value}}</p>
    <h1>{{$attrs.message}}</h1>
    <h1 @click="getGrandaMeth">调用爷爷组件方法</h1>
    <b>{{$attrs.test}} - {{$attrs.more}}</b>
    <div></div>
    <button disabled="disabled">{{foo}}</button>
  </div>
</template>

<script>
  export default {
    inject: ['foo', 'test'],
    data() {
      return {
        msg: '修改前',
        value:'测试$children'
      }
    }, 
    mounted() {
      this.test()
      // $parent
      console.log('111=>', this.$parent.value)
      // eventBus
      this.$Bus.$on('change', val =>{
        this.msg = val
      })
    },
    methods: {
      getGrandaMeth() {
        this.$listeners.getMessage()
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>