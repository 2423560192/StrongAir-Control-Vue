<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      有关更多信息，请查看
      <a href="https://cn.vuejs.org/" target="_blank" rel="noopener">Vue.js 官方文档</a>。
    </p>
    <h3>常用链接</h3>
    <ul>
      <li><a href="https://router.vuejs.org/zh/" target="_blank" rel="noopener">Vue Router</a></li>
      <li><a href="https://vuex.vuejs.org/zh/" target="_blank" rel="noopener">Vuex</a></li>
      <li><a href="https://github.com/axios/axios" target="_blank" rel="noopener">Axios</a></li>
      <li><a href="https://cli.vuejs.org/zh/" target="_blank" rel="noopener">Vue CLI</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<style scoped lang="scss">
.hello {
  h3 {
    margin: 40px 0 0;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
    
    li {
      display: inline-block;
      margin: 0 10px;
      
      a {
        color: #42b983;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style> 