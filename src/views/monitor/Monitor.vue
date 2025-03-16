<template>
  <div class="monitor">
    <div class="page-header">
      <div class="header-title">
        <i class="el-icon-monitor"></i>
        <span>实时监控</span>
      </div>
    </div>
    <el-card>
      <div>实时监控功能开发中...</div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Monitor'
}
</script>

<style lang="scss" scoped>
.monitor {
  .page-header {
    background: white;
    padding: 16px 24px;
    border-radius: 4px;
    margin-bottom: 20px;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    
    .header-title {
      font-size: 18px;
      font-weight: 500;
      color: #1f2f3d;
      
      i {
        margin-right: 8px;
        font-size: 20px;
      }
    }
  }
}
</style> 