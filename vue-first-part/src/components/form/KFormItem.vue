<template>
  <div>
    <!-- 显示label -->
    <label v-if="label">{{label}}</label>
    <!-- 插槽 -->
    <slot></slot>
    <!-- 错误显示 -->
    <p v-if="error" style="color:red">{{error}}</p>
  </div>
</template>

<script>
// element 使用的表单验证 
  import Schema from 'async-validator';
  export default {
    inject: ['form'],
    props: {
      label: {
        type: String,
        default: ''
      },
      // 使用 prop 获取表单验证的具体某个item
      prop: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        error: ''
      }
    },
    mounted() {
      this.$on('validate', () => {
        this.validate()
      })
    },
    methods: {
      validate(){
        // console.log(111)
        const rules = this.form.rules[this.prop]
        const value = this.form.model[this.prop]
        const schema = new Schema({[this.prop]: rules})
        return schema.validate({[this.prop]: value}, errors => {
          if(errors) {
            this.error = errors[0].message
          } else {
            this.error = ''
          }
        })
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>