<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="欢迎使用 Vue2 项目模板"/>
    
    <div class="counter">
      <h2>Vuex 计数器示例</h2>
      <p>当前计数: {{ count }}</p>
      <button @click="increment">增加</button>
      <button @click="decrement">减少</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  computed: {
    ...mapState(['count'])
  },
  methods: {
    ...mapActions(['increment', 'decrement'])
  }
}
</script>

<style scoped lang="scss">
.counter {
  margin-top: 30px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  
  button {
    margin: 0 5px;
    padding: 8px 16px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background-color: #3aa876;
    }
  }
}
</style> 