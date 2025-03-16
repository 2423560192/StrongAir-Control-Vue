<template>
  <div class="task-assignment">
    <el-card>
      <div slot="header" class="clearfix">
        <span>任务分配</span>
        <el-button 
          style="float: right; padding: 3px 0" 
          type="text"
          @click="goBack">
          返回列表
        </el-button>
      </div>

      <el-form 
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="任务类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择任务类型">
            <el-option label="空中巡逻" value="patrol"></el-option>
            <el-option label="战术打击" value="strike"></el-option>
            <el-option label="运输任务" value="transport"></el-option>
            <el-option label="侦察任务" value="recon"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="起飞时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择起飞时间">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="预计时长(小时)" prop="duration">
          <el-input-number 
            v-model="form.duration" 
            :min="1" 
            :max="24">
          </el-input-number>
        </el-form-item>

        <el-form-item label="任务描述" prop="description">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入任务详细描述"
            v-model="form.description">
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">分配任务</el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getAircraft, assignTask } from '@/api/aircraft'

export default {
  name: 'TaskAssignment',
  data() {
    return {
      aircraftId: this.$route.params.aircraftId,
      aircraft: null,
      form: {
        name: '',
        type: '',
        startTime: '',
        duration: 1,
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择任务类型', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择起飞时间', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入任务描述', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchAircraftInfo()
  },
  methods: {
    async fetchAircraftInfo() {
      try {
        const response = await getAircraft(this.aircraftId)
        this.aircraft = response.data
      } catch (error) {
        this.$message.error('获取飞机信息失败')
        this.goBack()
      }
    },
    async submitForm() {
      try {
        await this.$refs.form.validate()
        await assignTask(this.aircraftId, this.form)
        this.$message.success('任务分配成功')
        this.goBack()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('任务分配失败')
        }
      }
    },
    goBack() {
      this.$router.push({ name: 'AircraftList' })
    }
  }
}
</script>

<style lang="scss" scoped>
.task-assignment {
  padding: 20px;
  
  .el-card {
    margin-bottom: 20px;
  }
  
  .el-form {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style> 