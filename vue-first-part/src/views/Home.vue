<template>
  <div class="home">
    <!-- <KInput v-model="value" placeholder="username" />
    <KFormItem label="username" prop="username">
      <KInput v-model="value" placeholder="username" />
    </KFormItem> -->

    <KForm :model="formData" :rules="rules" ref="KForm">
      <KFormItem label="username" prop="username">
        <KInput v-model="formData.username" placeholder="username" />
      </KFormItem>
      <KFormItem label="password" prop="password">
        <KInput v-model="formData.password" placeholder="password" />
      </KFormItem>
      <KFormItem>
        <button @click="sumbit">Sumbit</button>
      </KFormItem>
    </KForm>

    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App" message="传给孙组件" @getMessage="getMessage" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import KInput from '@/components/form/KInput.vue'
import KFormItem from '@/components/form/KFormItem.vue'
import KForm from '@/components/form/KForm.vue'
import Notice from '@/components/Notice.vue'
import create from '@/util/create'

export default {
  name: 'Home',
  components: {
    HelloWorld,
    KInput,
    KFormItem,
    KForm
  },
  data() {
    return {
      value: '',
      formData: {
        username: '',
        password: ''
      },
      rules: {
        username: [{required: true, message: '请输入用户名'}],
        password: [{required: true, message: '请输入密码'}]
      }
    }
  },
  methods: {
    getMessage() {
      console.log('我来自爷组件 home')
    },
    // 提交
    sumbit() {
      // 全局校验
      this.$refs.KForm.validate(isValid => {
        console.log(isValid)
        if (isValid) {
          console.log('success ~~~~~~~~~~~~~~~')
        } else {
          console.log('fail ~~~~~~~~~~~~~~~')
        }
         const notice = create(Notice, {
            title: '提示',
            message: isValid ? 'very good' : 'laji',
            duration: 2000
          })
          notice.show()
      })
    }
  },
}
</script>
