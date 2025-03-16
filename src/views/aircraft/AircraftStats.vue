<template>
  <div class="aircraft-stats">
    <div class="page-header">
      <div class="header-title">
        <i class="el-icon-data-line"></i>
        <span>飞机数据统计</span>
      </div>
    </div>
    <el-card>
      <div>数据统计功能开发中...</div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AircraftStats'
}
</script>

<style lang="scss" scoped>
.aircraft-stats {
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