<template>
  <div class="about">
    <h1>关于页面</h1>
    <p>这是一个使用 Vue2 构建的项目示例。</p>
    <p>它包含了以下技术栈：</p>
    <ul>
      <li>Vue2</li>
      <li>Vue Router</li>
      <li>Vuex</li>
      <li>Axios</li>
      <li>SCSS</li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.about {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  
  ul {
    display: inline-block;
    text-align: left;
    margin: 20px auto;
    
    li {
      margin: 10px 0;
    }
  }
}
</style> 