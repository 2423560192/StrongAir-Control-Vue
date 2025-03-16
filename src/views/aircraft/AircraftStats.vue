<template>
  <div class="aircraft-stats">
    <div class="page-header">
      <div class="header-title">
        <i class="el-icon-data-line"></i>
        <span>飞机数据统计</span>
      </div>
    </div>
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6">
        <div class="card-wrapper" :style="{ animationDelay: '0.1s' }">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-header">
              <i class="el-icon-plane"></i>
              <span>飞机总数</span>
            </div>
            <div class="stat-number">{{ animatedStats.totalAircraft }}</div>
            <div class="stat-footer">
              <span>可用: {{ stats.availableAircraft || 0 }}</span>
              <span>任务中: {{ stats.inMissionAircraft || 0 }}</span>
            </div>
            <div class="card-glow"></div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card-wrapper" :style="{ animationDelay: '0.2s' }">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-header">
              <i class="el-icon-document"></i>
              <span>任务统计</span>
            </div>
            <div class="stat-number">{{ animatedStats.totalMissions }}</div>
            <div class="stat-footer">
              <span>进行中: {{ stats.activeMissions || 0 }}</span>
              <span>已完成: {{ stats.completedMissions || 0 }}</span>
            </div>
            <div class="card-glow"></div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card-wrapper" :style="{ animationDelay: '0.3s' }">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-header">
              <i class="el-icon-time"></i>
              <span>飞行时长(小时)</span>
            </div>
            <div class="stat-number">{{ animatedStats.totalFlightHours }}</div>
            <div class="stat-footer">
              <span>本月: {{ stats.monthlyFlightHours || 0 }}</span>
            </div>
            <div class="card-glow"></div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card-wrapper" :style="{ animationDelay: '0.4s' }">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-header">
              <i class="el-icon-data-line"></i>
              <span>任务完成率</span>
            </div>
            <div class="stat-number">
              <span>{{ animatedStats.missionSuccessRate }}</span><span class="percent">%</span>
            </div>
            <div class="stat-footer">
              <span>本月: {{ stats.monthlySuccessRate || 0 }}%</span>
            </div>
            <div class="card-glow"></div>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-container">
      <el-col :span="12">
        <div class="chart-wrapper" :style="{ animationDelay: '0.5s' }">
          <el-card class="chart-card">
            <div slot="header">
              <span>飞机类型分布</span>
              <div class="radar-scan"></div>
            </div>
            <div class="chart" ref="typeChart"></div>
            <div class="chart-overlay"></div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-wrapper" :style="{ animationDelay: '0.6s' }">
          <el-card class="chart-card">
            <div slot="header">
              <span>任务类型分布</span>
              <div class="radar-scan"></div>
            </div>
            <div class="chart" ref="missionChart"></div>
            <div class="chart-overlay"></div>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-container">
      <el-col :span="24">
        <div class="chart-wrapper" :style="{ animationDelay: '0.7s' }">
          <el-card class="chart-card">
            <div slot="header">
              <span>近期任务趋势</span>
              <div class="radar-scan"></div>
              <el-radio-group v-model="timeRange" size="small" @change="updateTrendChart">
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="year">年</el-radio-button>
              </el-radio-group>
            </div>
            <div class="chart" ref="trendChart"></div>
            <div class="chart-overlay"></div>
            <div class="pulse-dots">
              <div class="pulse-dot" v-for="i in 5" :key="i" :style="{ 
                left: `${20 + i * 15}%`, 
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.5}s`
              }"></div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getAircraftStats } from '@/api/aircraft'

export default {
  name: 'AircraftStats',
  data() {
    return {
      loading: false,
      timeRange: 'week',
      animatedStats: {
        totalAircraft: 0,
        totalMissions: 0,
        totalFlightHours: 0,
        missionSuccessRate: 0
      },
      stats: {
        totalAircraft: 0,
        availableAircraft: 0,
        inMissionAircraft: 0,
        totalMissions: 0,
        activeMissions: 0,
        completedMissions: 0,
        totalFlightHours: 0,
        monthlyFlightHours: 0,
        missionSuccessRate: 0,
        monthlySuccessRate: 0
      },
      charts: {
        typeChart: null,
        missionChart: null,
        trendChart: null
      }
    }
  },
  mounted() {
    this.initCharts()
    this.fetchStats()
    this.initAnimations()
  },
  beforeDestroy() {
    // 销毁图表实例
    Object.values(this.charts).forEach(chart => {
      if (chart) {
        chart.dispose()
      }
    })
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    async fetchStats() {
      this.loading = true
      try {
        const res = await getAircraftStats()
        if (res.code === 200) {
          this.stats = res.data
          
          // 计算前端需要的总计值
          if (this.stats) {
            // 确保总飞机数正确 - 将undefined值视为0
            const fighterCount = this.stats.fighterCount || 0;
            const transportCount = this.stats.transportCount || 0;
            const reconCount = this.stats.reconCount || 0;
            this.stats.totalAircraft = fighterCount + transportCount + reconCount;
            console.log("飞机总数", this.stats.totalAircraft);
            
            // 确保总任务数正确 - 将undefined值视为0
            const activeMissions = this.stats.activeMissions || 0;
            const completedMissions = this.stats.completedMissions || 0;
            this.stats.totalMissions = activeMissions + completedMissions;
            console.log("任务总数", this.stats.totalMissions);
            
            // 确保任务完成率正确
            if (this.stats.missionSuccessRate) {
              this.stats.missionSuccessRate = parseFloat(this.stats.missionSuccessRate.toFixed(1))
            }
            
            if (this.stats.monthlySuccessRate) {
              this.stats.monthlySuccessRate = parseFloat(this.stats.monthlySuccessRate.toFixed(1))
            }

            // 强制更新视图
            this.$forceUpdate();
            console.log("更新后的数据:", JSON.stringify(this.stats));
          }
          
          this.updateCharts()
          this.animateCounters()
        }
      } catch (error) {
        this.$message.error('获取统计数据失败')
        console.error("获取统计数据失败:", error);
      } finally {
        this.loading = false
      }
    },
    initCharts() {
      // 初始化飞机类型分布图
      this.charts.typeChart = echarts.init(this.$refs.typeChart)
      this.charts.missionChart = echarts.init(this.$refs.missionChart)
      this.charts.trendChart = echarts.init(this.$refs.trendChart)
      
      window.addEventListener('resize', this.handleResize)
    },
    initAnimations() {
      // 添加鼠标移动跟踪效果
      document.addEventListener('mousemove', this.handleMouseMove)
    },
    handleMouseMove(e) {
      const cards = document.querySelectorAll('.card-glow')
      cards.forEach(card => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        card.style.setProperty('--mouse-x', `${x}px`)
        card.style.setProperty('--mouse-y', `${y}px`)
      })
    },
    animateCounters() {
      console.log("开始动画计数器，数据:", JSON.stringify(this.stats));
      // 创建临时数据对象用于动画
      this.animatedStats = {
        totalAircraft: 0,
        totalMissions: 0,
        totalFlightHours: 0,
        missionSuccessRate: 0
      }
      
      // 动画持续时间
      const duration = 2000
      const startTime = Date.now()
      
      // 目标值
      const targets = {
        totalAircraft: this.stats.totalAircraft || 0,
        totalMissions: this.stats.totalMissions || 0,
        totalFlightHours: this.stats.totalFlightHours || 0,
        missionSuccessRate: this.stats.missionSuccessRate || 0
      }
      
      console.log("动画目标值:", targets);
      
      const animate = () => {
        const currentTime = Date.now()
        const elapsed = currentTime - startTime
        
        if (elapsed < duration) {
          // 计算当前进度 (0-1)
          const progress = elapsed / duration
          
          // 更新动画值
          this.animatedStats.totalAircraft = Math.floor(targets.totalAircraft * progress)
          this.animatedStats.totalMissions = Math.floor(targets.totalMissions * progress)
          this.animatedStats.totalFlightHours = Math.floor(targets.totalFlightHours * progress)
          this.animatedStats.missionSuccessRate = parseFloat((targets.missionSuccessRate * progress).toFixed(1))
          
          // 继续动画
          requestAnimationFrame(animate)
        } else {
          // 动画结束，设置为最终值
          this.animatedStats = { ...targets }
        }
      }
      
      // 开始动画
      animate()
    },
    handleResize() {
      Object.values(this.charts).forEach(chart => {
        if (chart) {
          chart.resize()
        }
      })
    },
    updateCharts() {
      // 更新飞机类型分布图
      this.charts.typeChart.setOption({
        backgroundColor: 'transparent',
        title: {
          text: '飞机类型分布',
          left: 'center',
          textStyle: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: 500
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}架 ({d}%)',
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderColor: '#00e5ff',
          borderWidth: 1,
          textStyle: {
            color: '#ffffff'
          }
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: {
            color: '#ffffff'
          }
        },
        series: [{
          type: 'pie',
          radius: ['30%', '70%'],
          data: [
            { 
              value: this.stats.fighterCount, 
              name: '战斗机',
              itemStyle: { color: '#00e5ff' }
            },
            { 
              value: this.stats.transportCount, 
              name: '运输机',
              itemStyle: { color: '#00ffb3' }
            },
            { 
              value: this.stats.reconCount, 
              name: '侦察机',
              itemStyle: { color: '#ff9e00' }
            }
          ],
          itemStyle: {
            borderRadius: 4,
            borderColor: 'rgba(0,229,255,0.2)',
            borderWidth: 2
          },
          label: {
            show: true,
            color: '#ffffff',
            formatter: '{b}\n{c}架',
            fontSize: 14
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0,229,255,0.5)'
            }
          },
          roseType: 'radius',
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }]
      })

      // 更新任务类型分布图
      this.charts.missionChart.setOption({
        backgroundColor: 'transparent',
        title: {
          text: '任务类型分布',
          left: 'center',
          textStyle: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: 500
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}次 ({d}%)',
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderColor: '#00e5ff',
          borderWidth: 1,
          textStyle: {
            color: '#ffffff'
          }
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: {
            color: '#ffffff'
          }
        },
        series: [{
          type: 'pie',
          radius: ['30%', '70%'],
          data: this.stats.missionTypeDistribution || [],
          itemStyle: {
            borderRadius: 4,
            borderColor: 'rgba(0,229,255,0.2)',
            borderWidth: 2
          },
          label: {
            show: true,
            color: '#ffffff',
            formatter: '{b}\n{c}次',
            fontSize: 14
          },
          roseType: 'radius',
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }]
      })

      // 更新任务趋势图
      this.updateTrendChart()
    },
    updateTrendChart() {
      let data = []
      if (this.stats.missionTrend) {
        data = this.stats.missionTrend[this.timeRange] || []
      }
      
      this.charts.trendChart.setOption({
        backgroundColor: 'transparent',
        title: {
          text: '任务趋势',
          left: 'center',
          textStyle: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: 500
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderColor: '#00e5ff',
          borderWidth: 1,
          textStyle: {
            color: '#ffffff'
          }
        },
        grid: {
          top: 60,
          bottom: 30,
          left: 40,
          right: 40,
          containLabel: true
        },
        visualMap: {
          show: false,
          dimension: 1,
          pieces: [{
            lte: 10,
            color: '#00e5ff'
          }, {
            gt: 10,
            lte: 20,
            color: '#00ffb3'
          }, {
            gt: 20,
            color: '#ff9e00'
          }]
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.date),
          axisLine: {
            lineStyle: {
              color: 'rgba(0,229,255,0.5)'
            }
          },
          axisLabel: {
            color: '#ffffff'
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: 'rgba(0,229,255,0.5)'
            }
          },
          axisLabel: {
            color: '#ffffff'
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(0,229,255,0.1)'
            }
          }
        },
        series: [{
          name: '任务数',
          type: 'line',
          smooth: true,
          data: data.map(item => item.count),
          itemStyle: {
            color: '#00e5ff'
          },
          lineStyle: {
            color: '#00e5ff',
            width: 2
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(0,229,255,0.4)'
              }, {
                offset: 1,
                color: 'rgba(0,229,255,0)'
              }]
            }
          },
          symbol: 'circle',
          symbolSize: 8,
          showSymbol: false,
          emphasis: {
            scale: true,
            focus: 'series',
            itemStyle: {
              color: '#ffffff',
              borderColor: '#00e5ff',
              borderWidth: 2,
              shadowColor: 'rgba(0,229,255,0.8)',
              shadowBlur: 10
            }
          },
          markLine: {
            silent: true,
            lineStyle: {
              color: 'rgba(255,158,0,0.5)'
            },
            data: [
              {
                type: 'average',
                name: '平均值'
              }
            ]
          }
        }]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.aircraft-stats {
  padding: 20px;
  background-color: transparent;
  min-height: 100vh;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 10% 10%, rgba(0,229,255,0.1) 0%, transparent 30%),
      radial-gradient(circle at 90% 90%, rgba(0,255,179,0.1) 0%, transparent 30%),
      linear-gradient(to bottom, rgba(10,25,47,0.9) 0%, rgba(0,0,0,0.95) 100%);
    z-index: -1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(rgba(0,229,255,0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,0.1) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: -1;
    opacity: 0.3;
  }

  .page-header {
    background: rgba(0,0,0,0.3);
    padding: 16px 24px;
    border-radius: 4px;
    margin-bottom: 20px;
    border: 1px solid rgba(0,229,255,0.3);
    box-shadow: 0 0 20px rgba(0,229,255,0.1);
    backdrop-filter: blur(5px);
    
    .header-title {
      font-size: 18px;
      font-weight: 500;
      color: #ffffff;
      
      i {
        margin-right: 8px;
        font-size: 20px;
        color: #00e5ff;
        text-shadow: 0 0 10px rgba(0,229,255,0.8);
      }
    }
  }

  .card-wrapper {
    animation: fadeInUp 0.8s ease-out forwards;
    opacity: 0;
    transform: translateY(20px);
  }

  .chart-wrapper {
    animation: fadeInUp 0.8s ease-out forwards;
    opacity: 0;
    transform: translateY(20px);
  }

  .stat-cards {
    margin-bottom: 20px;

    .el-card {
      background: rgba(0,0,0,0.3);
      border: 1px solid rgba(0,229,255,0.3);
      box-shadow: 0 0 20px rgba(0,229,255,0.1);
      backdrop-filter: blur(5px);
      position: relative;
      overflow: hidden;
      
      &:hover {
        transform: translateY(-2px);
        transition: all 0.3s;
        box-shadow: 0 0 30px rgba(0,229,255,0.2);
        border-color: rgba(0,229,255,0.5);
       
        .card-glow {
          opacity: 0.2;
        }
      }
    }
  }

  .card-glow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at var(--mouse-x) var(--mouse-y),
      rgba(0, 229, 255, 0.8),
      transparent 40%
    );
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
    z-index: 0;
  }

  .stat-card {
    .stat-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      position: relative;
      z-index: 1;
      
      i {
        font-size: 24px;
        margin-right: 10px;
        color: #00e5ff;
        text-shadow: 0 0 10px rgba(0,229,255,0.8);
        animation: pulse 2s infinite;
      }

      span {
        color: #ffffff;
        font-weight: 500;
      }
    }

    .stat-number {
      font-size: 28px;
      font-weight: bold;
      margin: 10px 0;
      color: #00e5ff;
      text-shadow: 0 0 10px rgba(0,229,255,0.8);
      position: relative;
      z-index: 1;
      
      .percent {
        font-size: 20px;
        margin-left: 2px;
      }
    }

    .stat-footer {
      display: flex;
      justify-content: space-between;
      color: rgba(255,255,255,0.7);
      position: relative;
      z-index: 1;

      span {
        &:first-child {
          color: #00ffb3;
        }
        &:last-child {
          color: #ff9e00;
        }
      }
    }
  }

  .chart-container {
    margin-bottom: 20px;

    .chart-card {
      background: rgba(0,0,0,0.3);
      border: 1px solid rgba(0,229,255,0.3);
      box-shadow: 0 0 20px rgba(0,229,255,0.1);
      backdrop-filter: blur(5px);
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: conic-gradient(transparent, rgba(0,229,255,0.1), transparent 30%);
        animation: rotate 10s linear infinite;
      }
      
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.3);
        backdrop-filter: blur(5px);
      }

      .chart {
        height: 300px;
        padding: 20px;
        position: relative;
        z-index: 1;
      }

      .chart-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 2px,
            rgba(0, 229, 255, 0.05) 2px,
            rgba(0, 229, 255, 0.05) 4px
          );
        pointer-events: none;
        z-index: 2;
        opacity: 0.3;
      }

      ::v-deep .el-card__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(0,0,0,0.4);
        padding: 15px 20px;
        border-bottom: 1px solid rgba(0,229,255,0.3);
        position: relative;
        z-index: 1;

        span {
          color: #ffffff;
          font-weight: 500;
          text-shadow: 0 0 10px rgba(0,229,255,0.5);
        }

        .radar-scan {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.2), transparent);
          animation: scan 3s ease-in-out infinite;
          z-index: 0;
        }

        .el-radio-group {
          .el-radio-button__inner {
            border-color: rgba(0,229,255,0.3);
            background: rgba(0,0,0,0.4);
            color: #ffffff;
            
            &:hover {
              color: #00e5ff;
              border-color: rgba(0,229,255,0.5);
            }
          }
          
          .is-active .el-radio-button__inner {
            background-color: rgba(0,229,255,0.2);
            border-color: #00e5ff;
            color: #ffffff;
            box-shadow: 0 0 10px rgba(0,229,255,0.5);
          }
        }
      }
    }
  }

  .pulse-dots {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: none;
    
    .pulse-dot {
      position: absolute;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #00e5ff;
      box-shadow: 0 0 10px rgba(0, 229, 255, 0.8);
      animation: pulseDot 3s infinite;
    }
  }
  
  .particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
    
    .particle {
      position: absolute;
      width: 3px;
      height: 3px;
      background-color: rgba(0, 229, 255, 0.6);
      border-radius: 50%;
      box-shadow: 0 0 5px rgba(0, 229, 255, 0.8);
      animation: float 10s linear infinite;
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes scan {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes pulseDot {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(2);
    opacity: 0.3;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(20px);
    opacity: 0;
  }
}
</style> 