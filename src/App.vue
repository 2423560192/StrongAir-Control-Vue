<template>
  <div id="app">
    <el-container>
      <el-header class="main-header">
        <div class="header-left">
          <div class="logo">
            <svg viewBox="0 0 24 24" width="32" height="32">
              <path fill="currentColor" d="M22,16v-2l-8.5-5V3.5C13.5,2.67,12.83,2,12,2s-1.5,0.67-1.5,1.5V9L2,14v2l8.5-2.5V19L8,20.5L8,22l4-1l4,1l0-1.5L13.5,19 v-5.5L22,16z"/>
            </svg>
          </div>
          <h1>强国战机管控平台</h1>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="el-dropdown-link">
              管理员 <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-container>
        <el-aside width="220px">
          <el-menu
            :router="true"
            default-active="/aircraft"
            class="el-menu-vertical"
            background-color="#001529"
            text-color="#fff"
            :unique-opened="true"
            active-text-color="#409EFF">
            <div class="menu-header">系统导航</div>
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-plane"></i>
                <span>飞机管理</span>
              </template>
              <el-menu-item index="/aircraft">飞机列表</el-menu-item>
              <el-menu-item index="/aircraft/stats">数据统计</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        
        <el-main class="main-content">
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss">
@keyframes radar-beam {
  0% {
    transform: rotate(0deg);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: rotate(360deg);
    opacity: 0;
  }
}

@keyframes glow {
  0% { text-shadow: 0 0 5px #00e5ff, 0 0 10px #00e5ff; }
  50% { text-shadow: 0 0 20px #00e5ff, 0 0 30px #00e5ff; }
  100% { text-shadow: 0 0 5px #00e5ff, 0 0 10px #00e5ff; }
}

:root {
  --primary-bg: #0a192f;
  --secondary-bg: #172a45;
  --accent-color: #64ffda;
  --text-primary: #ccd6f6;
  --text-secondary: #8892b0;
  --border-glow: rgba(100, 255, 218, 0.3);
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background: #000;
  color: var(--text-primary);
}

#app {
  font-family: 'Microsoft YaHei', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  min-width: 1200px;
  background: radial-gradient(circle at center, var(--primary-bg) 0%, #000 100%);
}

.main-header {
  background-color: var(--primary-bg);
  color: white;
  line-height: 60px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 15px var(--border-glow);
  border-bottom: 1px solid var(--accent-color);
  
  .header-left {
    display: flex;
    align-items: center;
    
    .logo {
      width: 40px;
      height: 40px;
      margin-right: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(100, 255, 218, 0.1);
      border-radius: 4px;
      position: relative;
      overflow: hidden;
      
      svg {
        color: var(--accent-color);
        animation: glow 2s infinite;
      }
      
      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: conic-gradient(from 0deg, transparent 0deg, var(--border-glow) 360deg);
        animation: radar-beam 4s linear infinite;
      }
    }
    
    h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 2px;
      animation: glow 3s infinite;
      color: var(--accent-color);
    }
  }
  
  .header-right {
    .el-dropdown-link {
      color: var(--text-primary);
      cursor: pointer;
      
      &:hover {
        color: var(--accent-color);
        text-shadow: 0 0 10px var(--accent-color);
      }
    }
  }
}

.el-aside {
  background-color: var(--primary-bg);
  box-shadow: 2px 0 15px var(--border-glow);
  border-right: 1px solid var(--accent-color);
  
  .el-menu {
    border-right: none;
    height: calc(100vh - 60px);
    background-color: var(--primary-bg) !important;
    
    .menu-header {
      padding: 16px 20px;
      color: var(--accent-color);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      text-shadow: 0 0 10px var(--accent-color);
    }
    
    .el-menu-item {
      color: var(--text-secondary) !important;
      
      &:hover, &:focus {
        background: var(--secondary-bg) !important;
        color: var(--text-primary) !important;
      }
      
      &.is-active {
        background: var(--secondary-bg) !important;
        color: var(--accent-color) !important;
        text-shadow: 0 0 10px var(--accent-color);
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 3px;
          background: var(--accent-color);
          box-shadow: 0 0 10px var(--accent-color);
        }
      }
    }
  }
}

.el-main {
  background-color: var(--secondary-bg);
  padding: 20px;
  
  &.main-content {
    min-height: calc(100vh - 60px);
  }
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--primary-bg);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(100, 255, 218, 0.3);
  border-radius: 3px;
  
  &:hover {
    background: rgba(100, 255, 218, 0.5);
  }
}

.el-card {
  background: var(--primary-bg) !important;
  border: 1px solid var(--accent-color) !important;
  box-shadow: 0 0 15px var(--border-glow) !important;
  
  .el-card__header {
    border-bottom: 1px solid var(--accent-color);
  }
}

.el-button--primary {
  background: rgba(100, 255, 218, 0.1);
  border-color: var(--accent-color);
  color: var(--accent-color);
  text-shadow: 0 0 5px var(--accent-color);
  
  &:hover, &:focus {
    background: rgba(100, 255, 218, 0.2);
    border-color: var(--accent-color);
    color: var(--text-primary);
    box-shadow: 0 0 15px var(--border-glow);
  }
}
</style> 