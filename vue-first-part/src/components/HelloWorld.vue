<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>{{value}}</p>
    
    <eventBus1 v-bind="$attrs" v-on="$listeners" test="$attrs的测试" more="$attrs再次测试" ref="refElement" />
    <eventBus2 @doTest="Test" @doMore="more" />
  </div>
</template>

<script>
import eventBus1 from './eventBus1'
import eventBus2 from './eventBus2'
export default {
  provide() {
    return {
      foo: 'provide test',
      test: this.Test
    }
  },
  components:{
    eventBus1,
    eventBus2
  },
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      value: '测试$parent'
    }
  },
  mounted() {
    console.log('this.$children =>', this.$children[0].value)
    console.log('refs => ', this.$refs.refElement)
    console.log('refs value => ', this.$refs.refElement.value)
  },
  methods: {
    Test() {
      console.log('$listers 测试')
    },
    more() {
      console.log('$listers 再次测试')
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
