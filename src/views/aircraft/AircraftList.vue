<template>
  <div class="aircraft-list">
    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      <el-alert
        :title="error"
        type="error"
        effect="dark"
        show-icon>
      </el-alert>
    </div>

    <!-- 搜索区域 -->
    <div class="search-panel">
      <div class="panel-header">
        <div class="title">
          <i class="el-icon-plane"></i>
          <span>飞机管理</span>
        </div>
        <el-button type="primary" @click="handleAdd">
          <i class="el-icon-plus"></i>
          添加飞机
        </el-button>
      </div>
      <div class="search-form">
        <el-form :inline="true" :model="searchForm" class="form-content">
          <el-form-item label="飞机名称">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入飞机名称"
              prefix-icon="el-icon-search"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="飞机类型">
            <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
              <el-option label="战斗机" value="战斗机"></el-option>
              <el-option label="运输机" value="运输机"></el-option>
              <el-option label="侦查机" value="侦查机"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="aircraftList"
        stripe
        class="aircraft-table">
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="飞机名称"
          min-width="120">
          <template slot-scope="scope">
            <div class="aircraft-name">
              <i class="el-icon-plane"></i>
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          width="100"
          align="center">
          <template slot-scope="scope">
            <el-tag :type="getTypeTag(scope.row.type)">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="quantity"
          label="数量"
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="flightAltitude"
          label="飞行高度(米)"
          width="110"
          align="center">
          <template slot-scope="scope">
            {{ formatAltitude(scope.row.flightAltitude) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="flightSpeed"
          label="速度(马赫)"
          width="110"
          align="center">
          <template slot-scope="scope">
            <span class="speed-value">{{ formatSpeed(scope.row.flightSpeed) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="stealthLevel"
          label="隐身性能"
          width="110"
          align="center">
          <template slot-scope="scope">
            <el-rate
              :value="scope.row.stealthLevel / 2"
              disabled
              show-score
              text-color="#ff9900">
            </el-rate>
          </template>
        </el-table-column>
        <el-table-column
          prop="radarModel"
          label="雷达型号"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="weaponCapacity"
          label="载弹数量"
          width="100"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type === '战斗机'">{{ scope.row.weaponCapacity }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="missionStatus"
          label="任务状态"
          width="120">
          <template slot-scope="scope">
            <el-popover
              placement="right"
              width="400"
              trigger="hover"
              v-if="scope.row.currentMission">
              <div class="mission-status-detail">
                <h4>当前任务信息</h4>
                <el-descriptions :column="1" border size="small">
                  <el-descriptions-item label="任务名称">{{ scope.row.currentMission?.missionName }}</el-descriptions-item>
                  <el-descriptions-item label="任务类型">{{ scope.row.currentMission?.missionType }}</el-descriptions-item>
                  <el-descriptions-item label="开始时间">{{ formatDateTime(scope.row.currentMission?.startTime) }}</el-descriptions-item>
                  <el-descriptions-item label="派遣数量">{{ scope.row.currentMission?.aircraftCount }}</el-descriptions-item>
                  <el-descriptions-item label="任务描述">{{ scope.row.currentMission?.description || '暂无描述' }}</el-descriptions-item>
                </el-descriptions>
              </div>
              <el-tag slot="reference" :type="getMissionStatusType(scope.row.missionStatus)">
                {{ formatMissionStatus(scope.row.missionStatus) }}
              </el-tag>
            </el-popover>
            <el-tag v-else :type="getMissionStatusType(scope.row.missionStatus)">
              {{ formatMissionStatus(scope.row.missionStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="350"
          align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="info"
              @click="handleViewDetail(scope.row)">
              查看详细
            </el-button>
            <el-button
              size="mini"
              type="warning"
              @click="handleEdit(scope.row)">
              修改
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleAssign(scope.row)">
              分配任务
            </el-button>
            <el-button
              size="mini"
              type="success"
              @click="handleViewMissions(scope.row)">
              任务列表
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>

    <!-- 添加飞机对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '添加飞机' : '修改飞机'"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <aircraft-form
        ref="aircraftForm"
        :aircraft="currentAircraft"
        @submit="handleSubmit"
        @cancel="dialogVisible = false">
      </aircraft-form>
    </el-dialog>

    <!-- 分配任务对话框 -->
    <el-dialog
      title="分配任务"
      :visible.sync="assignDialogVisible"
      width="30%">
      <el-form :model="assignForm" label-width="100px">
        <el-form-item label="飞机名称">
          <el-input v-model="assignForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="分配数量">
          <el-input-number 
            v-model="assignForm.quantity" 
            :min="1" 
            :max="currentRow ? currentRow.quantity : 1">
          </el-input-number>
        </el-form-item>
        <el-form-item label="任务名称" required>
          <el-input v-model="assignForm.missionName"></el-input>
        </el-form-item>
        <el-form-item label="任务类型" required>
          <el-select v-model="assignForm.missionType" placeholder="请选择任务类型">
            <el-option label="战斗任务" value="战斗任务"></el-option>
            <el-option label="侦查任务" value="侦查任务"></el-option>
            <el-option label="运输任务" value="运输任务"></el-option>
            <el-option label="训练任务" value="训练任务"></el-option>
            <el-option label="救援任务" value="救援任务"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input type="textarea" v-model="assignForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAssignSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 任务列表对话框 -->
    <el-dialog
      title="任务列表"
      :visible.sync="missionDialogVisible"
      width="80%">
      <div v-loading="missionLoading">
        <el-table
          :data="missionList"
          stripe
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            prop="missionName"
            label="任务名称"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop="missionType"
            label="任务类型"
            width="100">
          </el-table-column>
          <el-table-column
            prop="description"
            label="任务描述"
            min-width="150">
            <template slot-scope="scope">
              {{ scope.row.description || '暂无描述' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="aircraftCount"
            label="派遣数量"
            width="100"
            align="center">
          </el-table-column>
          <el-table-column
            label="任务时间"
            min-width="300">
            <template slot-scope="scope">
              <div>开始：{{ formatDateTime(scope.row.startTime) }}</div>
              <div v-if="scope.row.endTime">结束：{{ formatDateTime(scope.row.endTime) }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="120">
            <template slot-scope="scope">
              <el-tag :type="getMissionStatusType(scope.row.status)">
                {{ formatMissionStatus(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="120"
            align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                @click="handleRecall(scope.row)"
                :disabled="!['NOT_STARTED', 'IN_PROGRESS'].includes(scope.row.status)">
                召回
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 飞机详情对话框 -->
    <el-dialog
      title="飞机详细信息"
      :visible.sync="detailDialogVisible"
      width="60%">
      <div v-loading="detailLoading">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="飞机ID">{{ aircraftDetail.id }}</el-descriptions-item>
          <el-descriptions-item label="飞机名称">{{ aircraftDetail.name }}</el-descriptions-item>
          <el-descriptions-item label="飞机类型">
            <el-tag :type="getTypeTag(aircraftDetail.type)">{{ aircraftDetail.type }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="飞机数量">{{ aircraftDetail.quantity }}</el-descriptions-item>
          <el-descriptions-item label="飞行高度(米)">{{ formatAltitude(aircraftDetail.flightAltitude) }}</el-descriptions-item>
          <el-descriptions-item label="飞行速度(马赫)">{{ formatSpeed(aircraftDetail.flightSpeed) }}</el-descriptions-item>
          <el-descriptions-item label="隐身等级">
            <el-rate
              :value="aircraftDetail.stealthLevel / 2"
              disabled
              show-score
              text-color="#ff9900">
            </el-rate>
          </el-descriptions-item>
          <el-descriptions-item label="雷达型号">{{ aircraftDetail.radarModel }}</el-descriptions-item>
          <el-descriptions-item label="任务状态">
            <el-tag :type="getMissionStatusTag(aircraftDetail.missionStatus)">
              {{ formatMissionStatus(aircraftDetail.missionStatus) }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
        
        <!-- 战斗机特有属性 -->
        <div v-if="aircraftDetail.type === '战斗机'" class="specific-info">
          <h3>战斗机特有属性</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="载弹量">{{ aircraftDetail.weaponCapacity }}</el-descriptions-item>
            <el-descriptions-item label="武器类型">{{ aircraftDetail.weaponTypes }}</el-descriptions-item>
            <el-descriptions-item label="作战半径(公里)">{{ aircraftDetail.combatRange }}</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <!-- 运输机特有属性 -->
        <div v-if="aircraftDetail.type === '运输机'" class="specific-info">
          <h3>运输机特有属性</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="载货量(吨)">{{ aircraftDetail.cargoCapacity }}</el-descriptions-item>
            <el-descriptions-item label="货舱容积(立方米)">{{ aircraftDetail.cargoSpace }}</el-descriptions-item>
            <el-descriptions-item label="最大航程(公里)">{{ aircraftDetail.maxRange }}</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <!-- 侦查机特有属性 -->
        <div v-if="aircraftDetail.type === '侦查机'" class="specific-info">
          <h3>侦查机特有属性</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="侦查范围(公里)">{{ aircraftDetail.reconRange }}</el-descriptions-item>
            <el-descriptions-item label="传感器类型">{{ aircraftDetail.sensorTypes }}</el-descriptions-item>
            <el-descriptions-item label="续航时间(小时)">{{ aircraftDetail.endurance }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAircraftList, getAircraft, deleteAircraft, createAircraft, updateAircraft, assignMission, getMissions, recallMission, getAircraftStatus } from '@/api/aircraft'
import AircraftForm from '@/components/aircraft/AircraftForm.vue'

export default {
  name: 'AircraftList',
  components: {
    AircraftForm
  },
  data() {
    return {
      loading: false,
      error: '',
      aircraftList: [],
      searchForm: {
        name: '',
        type: ''
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      dialogType: 'add',
      assignDialogVisible: false,
      assignForm: {
        name: '',
        quantity: 1,
        missionName: '',
        missionType: '',
        description: ''
      },
      currentRow: null,
      missionDialogVisible: false,
      missionLoading: false,
      missionList: [],
      currentAircraft: null,
      detailDialogVisible: false,
      detailLoading: false,
      aircraftDetail: {},
      statusUpdateTimer: null
    }
  },
  created() {
    this.fetchData()
    this.startStatusUpdate()
  },
  beforeDestroy() {
    this.clearStatusUpdate()
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const res = await getAircraftList()
        this.aircraftList = res.data || []
        this.total = this.aircraftList.length
        this.aircraftList.forEach(aircraft => {
          this.updateAircraftStatus(aircraft)
        })
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    formatAltitude(val) {
      return val ? val.toLocaleString() : '-'
    },
    formatSpeed(val) {
      return val ? val.toFixed(1) : '-'
    },
    getTypeTag(type) {
      const tags = {
        '战斗机': 'danger',
        '运输机': 'success',
        '侦查机': 'warning'
      }
      return tags[type] || 'info'
    },
    getMissionStatusTag(status) {
      const tags = {
        'IN_PROGRESS': 'success',
        'COMPLETED': 'info',
        'ABORTED': 'danger'
      }
      return tags[status] || 'info'
    },
    formatMissionStatus(status) {
      const statusMap = {
        'IDLE': '待执行',
        'NOT_STARTED': '未开始',
        'IN_PROGRESS': '进行中',
        'COMPLETED': '已完成',
        'ABORTED': '已中止'
      }
      return statusMap[status] || status
    },
    handleSearch() {
      this.currentPage = 1
      this.fetchData()
    },
    resetSearch() {
      this.searchForm = {
        name: '',
        type: ''
      }
      this.handleSearch()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    handleAdd() {
      this.dialogType = 'add'
      this.currentAircraft = null
      this.dialogVisible = true
    },
    handleClose(done) {
      if (this.$refs.aircraftForm && this.$refs.aircraftForm.isFormChanged) {
        this.$confirm('表单已修改，确认关闭？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'dark-message-box'
        }).then(() => {
          done();
        }).catch(() => {
          // 取消关闭
        });
      } else {
        // 如果表单未修改，直接关闭
        done();
      }
    },
    async handleSubmit(formData) {
      try {
        if (this.dialogType === 'add') {
          await createAircraft(formData)
        } else {
          await updateAircraft(this.currentAircraft.id, formData)
        }
        this.$refs.aircraftForm.originalForm = null; // 重置表单状态，避免触发修改确认
        this.dialogVisible = false
        this.fetchData()
        this.$notify({
          title: '成功',
          message: this.dialogType === 'add' ? '添加成功' : '修改成功',
          type: 'success',
          position: 'top-right',
          duration: 2000,
          customClass: 'success-notify'
        })
      } catch (error) {
        if (error !== 'cancel') {
          this.$notify.error({
            title: '错误',
            message: error.message || (this.dialogType === 'add' ? '添加失败' : '修改失败'),
            position: 'top-right',
            duration: 4000
          })
        }
      }
    },
    handleAssign(row) {
      this.currentRow = row
      this.assignForm.name = row.name
      this.assignForm.quantity = 1
      this.assignForm.missionName = `${row.name}的任务`
      this.assignForm.missionType = ''
      this.assignForm.description = ''
      this.assignDialogVisible = true
    },
    async handleAssignSubmit() {
      try {
        if (!this.assignForm.name || !this.assignForm.quantity || !this.assignForm.missionName || !this.assignForm.missionType) {
          this.$message.error('请填写完整信息')
          return
        }
        
        if (this.assignForm.quantity > this.currentRow.quantity) {
          this.$message.error('分配数量不能超过现有数量')
          return
        }

        const res = await assignMission({
          name: this.assignForm.name,
          quantity: this.assignForm.quantity,
          missionName: this.assignForm.missionName,
          missionType: this.assignForm.missionType,
          description: this.assignForm.description
        })
        this.$message.success(res.data?.message || '任务分配成功')
        this.assignDialogVisible = false
        this.fetchData()
      } catch (error) {
        this.$message.error(error.response?.data?.message || '任务分配失败')
      }
    },
    handleAssignClose() {
      this.assignDialogVisible = false
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该飞机?', '提示', {
          type: 'warning'
        })
        await deleteAircraft(row.id)
        this.$message.success('删除成功')
        this.fetchData()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败')
        }
      }
    },
    async handleViewMissions(row) {
      this.currentAircraft = row
      this.missionDialogVisible = true
      await this.fetchMissions(row.id)
    },
    async fetchMissions(aircraftId) {
      this.missionLoading = true
      try {
        const res = await getMissions(aircraftId)
        this.missionList = res.data || []
      } catch (error) {
        this.$message.error('获取任务列表失败')
      } finally {
        this.missionLoading = false
      }
    },
    async handleRecall(mission) {
      try {
        await this.$confirm('确认召回该飞机?', '提示', {
          type: 'warning',
          customClass: 'dark-message-box'
        })
        await recallMission(mission.id)
        this.$notify({
          title: '成功',
          message: '召回成功',
          type: 'success',
          position: 'top-right',
          duration: 2000
        })
        await this.fetchMissions(this.currentAircraft.id)
        await this.fetchData()
      } catch (error) {
        if (error !== 'cancel') {
          this.$notify.error({
            title: '错误',
            message: '召回失败',
            position: 'top-right',
            duration: 4000
          })
        }
      }
    },
    async handleViewDetail(row) {
      this.detailDialogVisible = true
      this.detailLoading = true
      this.aircraftDetail = {}
      
      try {
        const response = await getAircraft(row.id)
        this.aircraftDetail = response.data || {}
      } catch (error) {
        this.$message.error('获取飞机详情失败')
      } finally {
        this.detailLoading = false
      }
    },
    async handleEdit(row) {
      this.dialogType = 'edit'
      this.detailLoading = true
      
      try {
        const response = await getAircraft(row.id)
        if (response.data) {
          console.log('Got aircraft data:', response.data); // 调试用
          this.currentAircraft = response.data
          this.dialogVisible = true
        } else {
          throw new Error('未获取到飞机数据')
        }
      } catch (error) {
        this.$notify.error({
          title: '错误',
          message: error.message || '获取飞机信息失败',
          position: 'top-right',
          duration: 4000
        })
      } finally {
        this.detailLoading = false
      }
    },
    formatDateTime(dateStr) {
      if (!dateStr) return '未设置'
      const date = new Date(dateStr)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },
    getMissionStatusType(status) {
      const typeMap = {
        'IDLE': '',  // 使用默认样式
        'NOT_STARTED': 'info',
        'IN_PROGRESS': 'warning',
        'COMPLETED': 'success',
        'ABORTED': 'danger'
      }
      return typeMap[status] || 'info'
    },
    async updateAircraftStatus(aircraft) {
      try {
        const res = await getAircraftStatus(aircraft.id)
        if (res.data) {
          // 更新飞机状态
          aircraft.missionStatus = res.data.currentMission ? res.data.missionStatus : 'IDLE'
          aircraft.currentMission = res.data.currentMission
        }
      } catch (error) {
        console.error('更新飞机状态失败:', error)
      }
    },
    startStatusUpdate() {
      // 每30秒更新一次状态
      this.statusUpdateTimer = setInterval(() => {
        if (this.aircraftList.length) {
          this.aircraftList.forEach(aircraft => {
            this.updateAircraftStatus(aircraft)
          })
        }
      }, 30000)
    },
    clearStatusUpdate() {
      if (this.statusUpdateTimer) {
        clearInterval(this.statusUpdateTimer)
        this.statusUpdateTimer = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.aircraft-list {
  .error-message {
    margin-bottom: 20px;
  }

  .search-panel {
    background: var(--primary-bg);
    border-radius: 4px;
    margin-bottom: 20px;
    border: 1px solid var(--accent-color);
    box-shadow: 0 0 15px var(--border-glow);

    .panel-header {
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--accent-color);

      .title {
        font-size: 18px;
        font-weight: 500;
        color: var(--accent-color);
        display: flex;
        align-items: center;
        text-shadow: 0 0 10px var(--accent-color);

        i {
          margin-right: 8px;
          font-size: 20px;
        }
      }
    }

    .search-form {
      padding: 20px;

      .form-content {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
    }
  }

  .table-card {
    .aircraft-table {
      margin: 10px 0;
      background: transparent;

      &::before {
        display: none;
      }

      .aircraft-name {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-primary);

        i {
          color: var(--accent-color);
        }
      }

      .speed-value {
        color: #ff9900;
        font-weight: 500;
      }
    }
  }

  .pagination-container {
    padding: 20px 0;
    text-align: right;
  }
}

/* Element UI 样式覆盖 */
.aircraft-list {
  ::v-deep .el-table {
    background-color: transparent !important;
    color: var(--text-primary) !important;

    th {
      background-color: var(--secondary-bg) !important;
      color: var(--accent-color) !important;
      border-bottom: 1px solid var(--accent-color) !important;
    }

    td {
      background-color: var(--primary-bg) !important;
      border-bottom: 1px solid rgba(100, 255, 218, 0.1) !important;
    }

    tr:hover td {
      background-color: var(--secondary-bg) !important;
    }
  }

  ::v-deep .el-input__inner {
    background-color: transparent !important;
    border-color: var(--accent-color) !important;
    color: var(--text-primary) !important;

    &:focus {
      box-shadow: 0 0 10px var(--border-glow);
    }
  }

  ::v-deep .el-select .el-input__inner:hover {
    border-color: var(--accent-color) !important;
  }

  ::v-deep .el-pagination {
    .btn-prev,
    .btn-next,
    .el-pager li {
      background-color: var(--primary-bg) !important;
      color: var(--text-primary) !important;
      border: 1px solid var(--accent-color) !important;

      &:hover {
        color: var(--accent-color) !important;
      }

      &.active {
        background-color: var(--accent-color) !important;
        color: var(--primary-bg) !important;
      }
    }
  }
}

.specific-info {
  margin-top: 20px;
  
  h3 {
    margin-bottom: 10px;
    font-size: 16px;
    color: #409EFF;
    border-left: 3px solid #409EFF;
    padding-left: 10px;
  }
}

/* 自定义确认对话框样式 */
.el-message-box {
  background-color: #0a192f;
  border: 1px solid #64ffda;
  border-radius: 4px;
  box-shadow: 0 0 15px rgba(100, 255, 218, 0.3);
}

.el-message-box__title {
  color: #ccd6f6;
}

.el-message-box__content {
  color: #8892b0;
}

.el-message-box__btns button {
  background: transparent;
  border-color: #64ffda;
  color: #64ffda;
}

.el-message-box__btns button:hover {
  background-color: rgba(100, 255, 218, 0.1);
  color: #fff;
}

.el-message-box__btns button.el-button--primary {
  background-color: rgba(100, 255, 218, 0.2);
}

.mission-status-detail {
  h4 {
    margin: 0 0 10px;
    color: var(--accent-color);
    font-size: 14px;
  }
  
  .el-descriptions {
    margin-bottom: 10px;
  }
}
</style> 