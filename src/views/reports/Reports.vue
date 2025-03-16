<template>
  <div class="reports">
    <div class="page-header">
      <div class="header-title">
        <i class="el-icon-data-analysis"></i>
        <span>统计报表</span>
      </div>
    </div>
    <el-card>
      <div>统计报表功能开发中...</div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Reports'
}
</script>

<style lang="scss" scoped>
.reports {
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