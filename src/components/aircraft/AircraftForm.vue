<template>
  <el-form 
    ref="form"
    :model="form"
    :rules="rules"
    label-width="120px">
    <el-form-item label="飞机名称" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    
    <el-form-item label="飞机类型" prop="type">
      <el-select v-model="form.type" placeholder="请选择飞机类型">
        <el-option label="战斗机" value="战斗机"></el-option>
        <el-option label="运输机" value="运输机"></el-option>
        <el-option label="侦查机" value="侦查机"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="飞机数量" prop="quantity">
      <el-input-number v-model="form.quantity" :min="1"></el-input-number>
    </el-form-item>

    <el-form-item label="飞行高度(米)" prop="altitude">
      <el-input-number v-model="form.altitude" :min="0"></el-input-number>
    </el-form-item>

    <el-form-item label="飞行速度(马赫)" prop="speed">
      <el-input-number v-model="form.speed" :min="0" :precision="1"></el-input-number>
    </el-form-item>

    <el-form-item label="隐身性能" prop="stealth">
      <el-select v-model="form.stealth" placeholder="请选择隐身性能">
        <el-option value="优秀">
          <span style="float: left">优秀</span>
          <span style="float: right; color: #8492a6; font-size: 13px">
            <i class="el-icon-star-on" style="color: #F7BA2A"></i>
            <i class="el-icon-star-on" style="color: #F7BA2A"></i>
            <i class="el-icon-star-on" style="color: #F7BA2A"></i>
            <i class="el-icon-star-on" style="color: #F7BA2A"></i>
          </span>
        </el-option>
        <el-option value="良好">
          <span style="float: left">良好</span>
          <span style="float: right; color: #8492a6; font-size: 13px">
            <i class="el-icon-star-on" style="color: #F7BA2A"></i>
            <i class="el-icon-star-on" style="color: #F7BA2A"></i>
            <i class="el-icon-star-on" style="color: #F7BA2A"></i>
            <i class="el-icon-star-on" style="color: #F7BA2A"></i>
            <i class="el-icon-star-off" style="color: #C6D1DE"></i>
          </span>
        </el-option>
        <el-option value="一般">
          <span style="float: left">一般</span>
          <span style="float: right; color: #8492a6; font-size: 13px">
            <i class="el-icon-star-on" style="color: #F7BA2A"></i>
            <i class="el-icon-star-on" style="color: #F7BA2A"></i>
            <i class="el-icon-star-on" style="color: #F7BA2A"></i>
            <i class="el-icon-star-off" style="color: #C6D1DE"></i>
            <i class="el-icon-star-off" style="color: #C6D1DE"></i>
          </span>
        </el-option>
        <el-option value="较差">
          <span style="float: left">较差</span>
          <span style="float: right; color: #8492a6; font-size: 13px">
            <i class="el-icon-star-on" style="color: #F7BA2A"></i>
            <i class="el-icon-star-on" style="color: #F7BA2A"></i>
            <i class="el-icon-star-off" style="color: #C6D1DE"></i>
            <i class="el-icon-star-off" style="color: #C6D1DE"></i>
            <i class="el-icon-star-off" style="color: #C6D1DE"></i>
          </span>
        </el-option>
        <el-option value="很差">
          <span style="float: left">很差</span>
          <span style="float: right; color: #8492a6; font-size: 13px">
            <i class="el-icon-star-on" style="color: #F7BA2A"></i>
            <i class="el-icon-star-off" style="color: #C6D1DE"></i>
            <i class="el-icon-star-off" style="color: #C6D1DE"></i>
            <i class="el-icon-star-off" style="color: #C6D1DE"></i>
            <i class="el-icon-star-off" style="color: #C6D1DE"></i>
          </span>
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="雷达型号" prop="radarModel">
      <el-input v-model="form.radarModel"></el-input>
    </el-form-item>

    <!-- 战斗机特有字段 -->
    <template v-if="form.type === '战斗机'">
      <el-form-item label="载弹数量" prop="payload">
        <el-input-number v-model="form.payload" :min="0"></el-input-number>
      </el-form-item>
      
      <el-form-item label="武器类型" prop="weaponTypes">
        <el-input v-model="form.weaponTypes" placeholder="如：空空导弹,空地导弹"></el-input>
      </el-form-item>
      
      <el-form-item label="作战半径(公里)" prop="combatRange">
        <el-input-number v-model="form.combatRange" :min="0"></el-input-number>
      </el-form-item>
    </template>
    
    <!-- 运输机特有字段 -->
    <template v-if="form.type === '运输机'">
      <el-form-item label="载货量(吨)" prop="cargoCapacity">
        <el-input-number v-model="form.cargoCapacity" :min="0"></el-input-number>
      </el-form-item>
      
      <el-form-item label="货舱容积(立方米)" prop="cargoSpace">
        <el-input-number v-model="form.cargoSpace" :min="0"></el-input-number>
      </el-form-item>
      
      <el-form-item label="最大航程(公里)" prop="maxRange">
        <el-input-number v-model="form.maxRange" :min="0"></el-input-number>
      </el-form-item>
    </template>
    
    <!-- 侦查机特有字段 -->
    <template v-if="form.type === '侦查机'">
      <el-form-item label="侦查范围(公里)" prop="reconRange">
        <el-input-number v-model="form.reconRange" :min="0"></el-input-number>
      </el-form-item>
      
      <el-form-item label="传感器类型" prop="sensorTypes">
        <el-input v-model="form.sensorTypes" placeholder="如：红外,雷达,光电"></el-input>
      </el-form-item>
      
      <el-form-item label="续航时间(小时)" prop="endurance">
        <el-input-number v-model="form.endurance" :min="0"></el-input-number>
      </el-form-item>
    </template>

    <el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="$emit('cancel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { createAircraft, updateAircraft } from '@/api/aircraft'

export default {
  name: 'AircraftForm',
  props: {
    aircraft: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: {
        name: '',
        type: '',
        quantity: 1,
        altitude: 0,
        speed: 0,
        stealth: '',
        radarModel: '',
        // 战斗机特有
        payload: 0,
        weaponTypes: '',
        combatRange: 0,
        // 运输机特有
        cargoCapacity: 0,
        cargoSpace: 0,
        maxRange: 0,
        // 侦查机特有
        reconRange: 0,
        sensorTypes: '',
        endurance: 0
      },
      originalForm: null, // 用于存储原始表单数据
      rules: {
        name: [
          { required: true, message: '请输入飞机名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择飞机类型', trigger: 'change' }
        ],
        quantity: [
          { required: true, message: '请输入飞机数量', trigger: 'blur' }
        ],
        altitude: [
          { required: true, message: '请输入飞行高度', trigger: 'blur' }
        ],
        speed: [
          { required: true, message: '请输入飞行速度', trigger: 'blur' }
        ],
        stealth: [
          { required: true, message: '请选择隐身性能', trigger: 'change' }
        ],
        radarModel: [
          { required: true, message: '请输入雷达型号', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.aircraft) {
      console.log('Editing aircraft:', this.aircraft); // 调试用
      this.form = {
        name: this.aircraft.name,
        type: this.aircraft.type,
        quantity: this.aircraft.quantity,
        altitude: Number(this.aircraft.flightAltitude) || 0,
        speed: Number(this.aircraft.flightSpeed) || 0,
        stealth: this.getStealthText(this.aircraft.stealthLevel),
        radarModel: this.aircraft.radarModel,
        // 战斗机特有
        payload: Number(this.aircraft.weaponCapacity) || 0,
        weaponTypes: this.aircraft.weaponTypes || '',
        combatRange: Number(this.aircraft.combatRange) || 0,
        // 运输机特有
        cargoCapacity: Number(this.aircraft.cargoCapacity) || 0,
        cargoSpace: Number(this.aircraft.cargoSpace) || 0,
        maxRange: Number(this.aircraft.maxRange) || 0,
        // 侦查机特有
        reconRange: Number(this.aircraft.reconRange) || 0,
        sensorTypes: this.aircraft.sensorTypes || '',
        endurance: Number(this.aircraft.endurance) || 0
      }
      // 保存原始表单数据的副本
      this.originalForm = JSON.stringify(this.form);
    } else {
      this.originalForm = JSON.stringify(this.form);
    }
  },
  computed: {
    // 检查表单是否被修改
    isFormChanged() {
      return this.originalForm !== JSON.stringify(this.form);
    }
  },
  methods: {
    getStealthText(level) {
      if (!level) return '一般'
      if (level >= 9) return '优秀'  // 5星
      if (level >= 7) return '良好'  // 4星
      if (level >= 5) return '一般'  // 3星
      if (level >= 3) return '较差'  // 2星
      return '很差'                  // 1星
    },
    async submitForm() {
      try {
        await this.$refs.form.validate()
        const formData = {
          name: this.form.name,
          type: this.form.type,
          quantity: Number(this.form.quantity),
          flightAltitude: Number(this.form.altitude),
          flightSpeed: Number(this.form.speed),
          stealthLevel: this.getStealthLevel(this.form.stealth),
          radarModel: this.form.radarModel
        }
        
        if (this.form.type === '战斗机') {
          formData.weaponCapacity = Number(this.form.payload)
          formData.weaponTypes = this.form.weaponTypes
          formData.combatRange = Number(this.form.combatRange)
        } else if (this.form.type === '运输机') {
          formData.cargoCapacity = Number(this.form.cargoCapacity)
          formData.cargoSpace = Number(this.form.cargoSpace)
          formData.maxRange = Number(this.form.maxRange)
        } else if (this.form.type === '侦查机') {
          formData.reconRange = Number(this.form.reconRange)
          formData.sensorTypes = this.form.sensorTypes
          formData.endurance = Number(this.form.endurance)
        }
        
        this.$emit('submit', formData)
      } catch (error) {
        throw error
      }
    },
    getStealthLevel(text) {
      const levels = {
        '优秀': 10,  // 5星
        '良好': 8,   // 4星
        '一般': 6,   // 3星
        '较差': 3,   // 2星
        '很差': 1    // 1星
      }
      return levels[text] || 6
    }
  }
}
</script> 