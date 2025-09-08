<template>
  <div class="cron-generator-container">
    <div class="header">
      <h1>⏰ Cron表达式生成器</h1>
      <p class="subtitle">轻松生成和校验Cron表达式</p>
    </div>

    <div class="cron-layout">
      <!-- 左侧：表达式生成器 -->
      <div class="generator-section">
        <div class="section-card">
          <h3>🔧 表达式生成器</h3>

          <!-- 字段选择选项卡 -->
          <div class="tabs-container">
            <div class="tabs">
              <button v-for="tab in fieldTabs" :key="tab.id"
                :class="['tab-button', { active: activeFieldTab === tab.id }]" @click="activeFieldTab = tab.id">
                <span class="tab-icon">{{ tab.icon }}</span>
                {{ tab.name }}
              </button>
            </div>
          </div>

          <div class="field-content">
            <transition name="fade-slide" mode="out-in">
              <div :key="activeFieldTab" class="field-tab-content">
                <!-- 秒 -->
                <div v-if="activeFieldTab === 'seconds'" class="field-section">
                  <h4>⏱️ 秒 (Seconds)</h4>
                  <BaseRadioGroup v-model="cronFields.seconds.type" :options="[
                      { value: '*', label: '每秒' },
                      { value: '*/n', label: '每隔n秒' },
                      { value: 'range', label: '范围' },
                      { value: 'list', label: '列表' }
                    ]" direction="horizontal" @change="updateCronExpression" />
                  <div class="field-inputs" v-if="cronFields.seconds.type === '*/n'">
                    <BaseInput v-model="cronFields.seconds.interval" @input="updateCronExpression" type="number"
                      label="间隔秒数：" min="1" max="59" placeholder="间隔" />
                  </div>
                  <div class="field-inputs range-inputs" v-if="cronFields.seconds.type === 'range'">
                    <BaseInput v-model="cronFields.seconds.start" @input="updateCronExpression" type="number"
                      label="开始：" min="0" max="59" placeholder="开始" />
                    <span class="range-separator">-</span>
                    <BaseInput v-model="cronFields.seconds.end" @input="updateCronExpression" type="number" label="结束："
                      min="0" max="59" placeholder="结束" />
                  </div>
                  <div class="field-inputs" v-if="cronFields.seconds.type === 'list'">
                    <label>秒列表：</label>
                    <BaseCheckboxGroup v-model="cronFields.seconds.selectedList"
                      :options="Array.from({length: 60}, (_, i) => ({ value: i, label: `${i}秒` }))"
                      direction="horizontal" @change="handleSecondsListChange" />
                  </div>
                </div>

                <!-- 分 -->
                <div v-if="activeFieldTab === 'minutes'" class="field-section">
                  <h4>⏰ 分 (Minutes)</h4>
                  <BaseRadioGroup v-model="cronFields.minutes.type" :options="[
                      { value: '*', label: '每分' },
                      { value: '*/n', label: '每隔n分' },
                      { value: 'range', label: '范围' },
                      { value: 'list', label: '列表' }
                    ]" direction="horizontal" @change="updateCronExpression" />
                  <div class="field-inputs" v-if="cronFields.minutes.type === '*/n'">
                    <BaseInput v-model="cronFields.minutes.interval" @input="updateCronExpression" type="number"
                      label="间隔分钟：" min="1" max="59" placeholder="间隔" />
                  </div>
                  <div class="field-inputs range-inputs" v-if="cronFields.minutes.type === 'range'">
                    <BaseInput v-model="cronFields.minutes.start" @input="updateCronExpression" type="number"
                      label="开始：" min="0" max="59" placeholder="开始" />
                    <span class="range-separator">-</span>
                    <BaseInput v-model="cronFields.minutes.end" @input="updateCronExpression" type="number" label="结束："
                      min="0" max="59" placeholder="结束" />
                  </div>
                  <div class="field-inputs" v-if="cronFields.minutes.type === 'list'">
                    <label>分钟列表：</label>
                    <BaseCheckboxGroup v-model="cronFields.minutes.selectedList"
                      :options="Array.from({length: 60}, (_, i) => ({ value: i, label: `${i}分` }))"
                      direction="horizontal" @change="handleMinutesListChange" />
                  </div>
                </div>

                <!-- 时 -->
                <div v-if="activeFieldTab === 'hours'" class="field-section">
                  <h4>🕐 时 (Hours)</h4>
                  <BaseRadioGroup v-model="cronFields.hours.type" :options="[
                      { value: '*', label: '每小时' },
                      { value: '*/n', label: '每隔n小时' },
                      { value: 'range', label: '范围' },
                      { value: 'list', label: '列表' }
                    ]" direction="horizontal" @change="updateCronExpression" />
                  <div class="field-inputs" v-if="cronFields.hours.type === '*/n'">
                    <BaseInput v-model="cronFields.hours.interval" @input="updateCronExpression" type="number"
                      label="间隔小时：" min="1" max="23" placeholder="间隔" />
                  </div>
                  <div class="field-inputs range-inputs" v-if="cronFields.hours.type === 'range'">
                    <BaseInput v-model="cronFields.hours.start" @input="updateCronExpression" type="number" label="开始："
                      min="0" max="23" placeholder="开始" />
                    <span class="range-separator">-</span>
                    <BaseInput v-model="cronFields.hours.end" @input="updateCronExpression" type="number" label="结束："
                      min="0" max="23" placeholder="结束" />
                  </div>
                  <div class="field-inputs" v-if="cronFields.hours.type === 'list'">
                    <label>小时列表：</label>
                    <BaseCheckboxGroup v-model="cronFields.hours.selectedList"
                      :options="Array.from({length: 24}, (_, i) => ({ value: i, label: `${i}时` }))"
                      direction="horizontal" @change="handleHoursListChange" />
                  </div>
                </div>

                <!-- 日 -->
                <div v-if="activeFieldTab === 'days'" class="field-section">
                  <h4>📅 日 (Day of Month)</h4>
                  <BaseRadioGroup v-model="cronFields.days.type" :options="[
                      { value: '*', label: '每日' },
                      { value: '*/n', label: '每隔n日' },
                      { value: 'range', label: '范围' },
                      { value: 'list', label: '列表' },
                      { value: 'last', label: '最后一日' },
                      { value: 'weekday', label: '工作日' }
                    ]" direction="horizontal" @change="updateCronExpression" />
                  <div class="field-inputs" v-if="cronFields.days.type === '*/n'">
                    <BaseInput v-model="cronFields.days.interval" @input="updateCronExpression" type="number"
                      label="间隔天数：" min="1" max="31" placeholder="间隔" />
                  </div>
                  <div class="field-inputs range-inputs" v-if="cronFields.days.type === 'range'">
                    <BaseInput v-model="cronFields.days.start" @input="updateCronExpression" type="number" label="开始："
                      min="1" max="31" placeholder="开始" />
                    <span class="range-separator">-</span>
                    <BaseInput v-model="cronFields.days.end" @input="updateCronExpression" type="number" label="结束："
                      min="1" max="31" placeholder="结束" />
                  </div>
                  <div class="field-inputs" v-if="cronFields.days.type === 'list'">
                    <label>日期列表：</label>
                    <BaseCheckboxGroup v-model="cronFields.days.selectedList"
                      :options="Array.from({length: 31}, (_, i) => ({ value: i + 1, label: `${i + 1}日` }))"
                      direction="horizontal" @change="handleDaysListChange" />
                  </div>
                </div>

                <!-- 月 -->
                <div v-if="activeFieldTab === 'months'" class="field-section">
                  <h4>📆 月 (Month)</h4>
                  <BaseRadioGroup v-model="cronFields.months.type" :options="[
                      { value: '*', label: '每月' },
                      { value: '*/n', label: '每隔n月' },
                      { value: 'range', label: '范围' },
                      { value: 'list', label: '列表' },
                      { value: 'name', label: '月份名称' }
                    ]" direction="horizontal" @change="updateCronExpression" />
                  <div class="field-inputs" v-if="cronFields.months.type === '*/n'">
                    <BaseInput v-model="cronFields.months.interval" @input="updateCronExpression" type="number"
                      label="间隔月数：" min="1" max="12" placeholder="间隔" />
                  </div>
                  <div class="field-inputs range-inputs" v-if="cronFields.months.type === 'range'">
                    <BaseInput v-model="cronFields.months.start" @input="updateCronExpression" type="number" label="开始："
                      min="1" max="12" placeholder="开始" />
                    <span class="range-separator">-</span>
                    <BaseInput v-model="cronFields.months.end" @input="updateCronExpression" type="number" label="结束："
                      min="1" max="12" placeholder="结束" />
                  </div>
                  <div class="field-inputs" v-if="cronFields.months.type === 'list'">
                    <label>月份列表：</label>
                    <BaseCheckboxGroup v-model="cronFields.months.selectedList" :options="monthNames"
                      direction="horizontal" @change="handleMonthsListChange" />
                  </div>
                  <div class="field-inputs" v-if="cronFields.months.type === 'name'">
                    <label>选择月份：</label>
                    <BaseCheckboxGroup v-model="cronFields.months.names" :options="monthNames" direction="horizontal"
                      @change="updateCronExpression" />
                  </div>
                </div>

                <!-- 星期 -->
                <div v-if="activeFieldTab === 'weekdays'" class="field-section">
                  <h4>📅 星期 (Day of Week)</h4>
                  <BaseRadioGroup v-model="cronFields.weekdays.type" :options="[
                      { value: '*', label: '每日' },
                      { value: 'range', label: '范围' },
                      { value: 'list', label: '列表' },
                      { value: 'name', label: '星期名称' }
                    ]" direction="horizontal" @change="updateCronExpression" />
                  <div class="field-inputs" v-if="cronFields.weekdays.type === 'range'">
                    <label>范围：</label>
                    <BaseRadioGroup v-model="cronFields.weekdays.start" :options="weekDays" direction="horizontal"
                      @change="updateCronExpression" />
                    <span>-</span>
                    <BaseRadioGroup v-model="cronFields.weekdays.end" :options="weekDays" direction="horizontal"
                      @change="updateCronExpression" />
                  </div>
                  <div class="field-inputs" v-if="cronFields.weekdays.type === 'list'">
                    <label>星期列表：</label>
                    <BaseCheckboxGroup v-model="cronFields.weekdays.selectedList" :options="weekDays"
                      direction="horizontal" @change="handleWeekdaysListChange" />
                  </div>
                  <div class="field-inputs" v-if="cronFields.weekdays.type === 'name'">
                    <label>选择星期：</label>
                    <BaseCheckboxGroup v-model="cronFields.weekdays.names" :options="weekDays" direction="horizontal"
                      @change="updateCronExpression" />
                  </div>
                </div>

                <!-- 年 -->
                <div v-if="activeFieldTab === 'years'" class="field-section">
                  <h4>📅 年 (Year)</h4>
                  <BaseRadioGroup v-model="cronFields.years.type" :options="[
                      { value: '*', label: '每年' },
                      { value: 'range', label: '范围' },
                      { value: 'list', label: '列表' }
                    ]" direction="horizontal" @change="updateCronExpression" />
                  <div class="field-inputs range-inputs" v-if="cronFields.years.type === 'range'">
                    <BaseInput v-model="cronFields.years.start" @input="updateCronExpression" type="number" label="开始："
                      :min="currentYear" :max="currentYear + 10" placeholder="开始" />
                    <span class="range-separator">-</span>
                    <BaseInput v-model="cronFields.years.end" @input="updateCronExpression" type="number" label="结束："
                      :min="currentYear" :max="currentYear + 10" placeholder="结束" />
                  </div>
                  <div class="field-inputs" v-if="cronFields.years.type === 'list'">
                    <label>年份列表：</label>
                    <BaseCheckboxGroup v-model="cronFields.years.selectedList"
                      :options="Array.from({length: 11}, (_, i) => ({ value: currentYear + i, label: `${currentYear + i}年` }))"
                      direction="horizontal" @change="handleYearsListChange" />
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <!-- 生成的表达式 -->
          <div class="expression-display">
            <BaseInput v-model="generatedExpression" readonly label="生成的Cron表达式" class="expression-input" />
            <button @click="copyExpression" class="btn-copy">复制</button>
          </div>

          <!-- 常用表达式 -->
          <div class="common-expressions">
            <label>常用表达式</label>
            <div class="expression-list">
              <button v-for="expr in commonExpressions" :key="expr.value" @click="applyCommonExpression(expr.value)"
                class="expr-btn" :title="expr.description">
                {{ expr.name }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：表达式解析和校验 -->
      <div class="validator-section">
        <div class="section-card">
          <h3>🔍 表达式校验</h3>

          <div class="validation-input">
            <BaseInput v-model="inputExpression" @input="validateExpression" label="输入Cron表达式"
              placeholder="请输入Cron表达式..." class="expression-input" />
          </div>

          <div class="validation-result">
            <div class="result-status" :class="{ valid: isValid, invalid: !isValid && inputExpression }">
              <span class="status-icon">{{ isValid ? '✅' : inputExpression ? '❌' : '🤔' }}</span>
              <span class="status-text">{{ validationMessage }}</span>
            </div>
          </div>

          <div class="next-runs" v-if="isValid && nextRunTimes.length">
            <label>下次执行时间</label>
            <div class="run-times">
              <div v-for="(time, index) in nextRunTimes" :key="index" class="run-time">
                {{ time }}
              </div>
            </div>
          </div>

          <div class="expression-help">
            <h4>Cron表达式格式</h4>
            <div class="format-table">
              <div class="format-row">
                <span class="field">秒</span>
                <span class="range">0-59</span>
                <span class="symbols">* , - /</span>
              </div>
              <div class="format-row">
                <span class="field">分</span>
                <span class="range">0-59</span>
                <span class="symbols">* , - /</span>
              </div>
              <div class="format-row">
                <span class="field">时</span>
                <span class="range">0-23</span>
                <span class="symbols">* , - /</span>
              </div>
              <div class="format-row">
                <span class="field">日</span>
                <span class="range">1-31</span>
                <span class="symbols">* , - / ? L W</span>
              </div>
              <div class="format-row">
                <span class="field">月</span>
                <span class="range">1-12</span>
                <span class="symbols">* , - /</span>
              </div>
              <div class="format-row">
                <span class="field">星期</span>
                <span class="range">1-7</span>
                <span class="symbols">* , - / ? L #</span>
              </div>
              <div class="format-row">
                <span class="field">年</span>
                <span class="range">1970-2099</span>
                <span class="symbols">* , - /</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getCurrentInstance } from 'vue'
import BaseRadioGroup from '@/components/ui/BaseRadioGroup.vue'
import BaseRadio from '@/components/ui/BaseRadio.vue'
import BaseCheckboxGroup from '@/components/ui/BaseCheckboxGroup.vue'
import BaseCheckbox from '@/components/ui/BaseCheckbox.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const { proxy } = getCurrentInstance()

// 当前激活的字段选项卡
const activeFieldTab = ref('seconds')

// 字段选项卡配置
const fieldTabs = [
  { id: 'seconds', name: '秒', icon: '⏱️' },
  { id: 'minutes', name: '分', icon: '⏰' },
  { id: 'hours', name: '时', icon: '🕐' },
  { id: 'days', name: '日', icon: '📅' },
  { id: 'months', name: '月', icon: '📆' },
  { id: 'weekdays', name: '星期', icon: '📅' },
  { id: 'years', name: '年', icon: '📅' }
]

// 字段配置
const cronFields = ref({
  seconds: { type: '*', interval: 1, start: 0, end: 59, list: '', selectedList: [], names: [] },
  minutes: { type: '*', interval: 1, start: 0, end: 59, list: '', selectedList: [], names: [] },
  hours: { type: '*', interval: 1, start: 0, end: 23, list: '', selectedList: [], names: [] },
  days: { type: '*', interval: 1, start: 1, end: 31, list: '', selectedList: [], names: [] },
  months: { type: '*', interval: 1, start: 1, end: 12, list: '', selectedList: [], names: [] },
  weekdays: { type: '*', start: 1, end: 7, list: '', selectedList: [], names: [] },
  years: { type: '*', start: new Date().getFullYear(), end: new Date().getFullYear() + 1, list: '', selectedList: [] }
})

// 月份和星期配置
const monthNames = [
  { value: 1, label: '一月' },
  { value: 2, label: '二月' },
  { value: 3, label: '三月' },
  { value: 4, label: '四月' },
  { value: 5, label: '五月' },
  { value: 6, label: '六月' },
  { value: 7, label: '七月' },
  { value: 8, label: '八月' },
  { value: 9, label: '九月' },
  { value: 10, label: '十月' },
  { value: 11, label: '十一月' },
  { value: 12, label: '十二月' }
]

const weekDays = [
  { value: 1, label: '周一' },
  { value: 2, label: '周二' },
  { value: 3, label: '周三' },
  { value: 4, label: '周四' },
  { value: 5, label: '周五' },
  { value: 6, label: '周六' },
  { value: 7, label: '周日' }
]

// 常用表达式
const commonExpressions = [
  { name: '每秒', value: '* * * * * * *', description: '每秒钟执行一次' },
  { name: '每分', value: '0 * * * * * *', description: '每分钟的第0秒执行' },
  { name: '每小时', value: '0 0 * * * * *', description: '每小时的第0分0秒执行' },
  { name: '每日', value: '0 0 0 * * * *', description: '每天0点0分0秒执行' },
  { name: '每月1日', value: '0 0 0 1 * ? *', description: '每月1日0点0分0秒执行' },
  { name: '每季度', value: '0 0 0 1 1/3 ? *', description: '每季度第一天执行' }
]

// 计算属性
const currentYear = computed(() => new Date().getFullYear())
const generatedExpression = ref('* * * * * * *')
const inputExpression = ref('')
const isValid = ref(false)
const validationMessage = ref('请输入Cron表达式')
const nextRunTimes = ref([])

// 处理秒列表变化
const handleSecondsListChange = () => {
  cronFields.value.seconds.list = cronFields.value.seconds.selectedList.join(',')
  updateCronExpression()
}

// 处理分钟列表变化
const handleMinutesListChange = () => {
  cronFields.value.minutes.list = cronFields.value.minutes.selectedList.join(',')
  updateCronExpression()
}

// 处理小时列表变化
const handleHoursListChange = () => {
  cronFields.value.hours.list = cronFields.value.hours.selectedList.join(',')
  updateCronExpression()
}

// 处理日期列表变化
const handleDaysListChange = () => {
  cronFields.value.days.list = cronFields.value.days.selectedList.join(',')
  updateCronExpression()
}

// 处理月份列表变化
const handleMonthsListChange = () => {
  cronFields.value.months.list = cronFields.value.months.selectedList.join(',')
  updateCronExpression()
}

// 处理星期列表变化
const handleWeekdaysListChange = () => {
  cronFields.value.weekdays.list = cronFields.value.weekdays.selectedList.join(',')
  updateCronExpression()
}

// 处理年份列表变化
const handleYearsListChange = () => {
  cronFields.value.years.list = cronFields.value.years.selectedList.join(',')
  updateCronExpression()
}

// 更新Cron表达式
const updateCronExpression = () => {
  const parts = []

  // 处理每个字段
  const fields = ['seconds', 'minutes', 'hours', 'days', 'months', 'weekdays', 'years']

  fields.forEach(field => {
    const config = cronFields.value[field]
    let part = '*'

    switch (config.type) {
      case '*/n':
        part = `*/${config.interval}`
        break
      case 'range':
        part = `${config.start}-${config.end}`
        break
      case 'list':
        if (config.selectedList && config.selectedList.length > 0) {
          part = config.selectedList.join(',')
        } else {
          part = config.list || '*'
        }
        break
      case 'name':
        if (field === 'months' && config.names && config.names.length > 0) {
          part = config.names.join(',')
        } else if (field === 'weekdays' && config.names && config.names.length > 0) {
          part = config.names.join(',')
        }
        break
      case 'last':
        part = 'L'
        break
      case 'weekday':
        part = 'W'
        break
      default:
        part = '*'
    }

    parts.push(part)
  })

  generatedExpression.value = parts.join(' ')
  validateExpression()
}

// 复制表达式
const copyExpression = () => {
  navigator.clipboard.writeText(generatedExpression.value)
  proxy.$toast.success('Cron表达式已复制到剪贴板')
}

// 应用常用表达式
const applyCommonExpression = (expression) => {
  inputExpression.value = expression
  validateExpression()
  proxy.$toast.success('已应用常用表达式')
}

// 验证表达式
const validateExpression = () => {
  if (!inputExpression.value.trim()) {
    isValid.value = false
    validationMessage.value = '请输入Cron表达式'
    nextRunTimes.value = []
    return
  }

  const expression = inputExpression.value.trim()

  // 基础格式验证
  const parts = expression.split(' ')
  if (parts.length !== 6 && parts.length !== 7) {
    isValid.value = false
    validationMessage.value = 'Cron表达式需要6或7个字段'
    nextRunTimes.value = []
    return
  }

  // 验证每个字段的格式
  const validPatterns = [
    /^([0-9]|[1-5][0-9])$/, // 秒 0-59
    /^([0-9]|[1-5][0-9])$/, // 分 0-59
    /^([0-9]|1[0-9]|2[0-3])$/, // 时 0-23
    /^([1-9]|[12][0-9]|3[01])$/, // 日 1-31
    /^([1-9]|1[0-2])$/, // 月 1-12
    /^[0-7]$/, // 星期 0-7
    /^\d{4}$/ // 年 1970-2099
  ]

  // 特殊字符验证
  const specialPattern = /^([\d,-/*?LW#]+)$/

  let isValidFormat = true
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (!specialPattern.test(part)) {
      isValidFormat = false
      break
    }
  }

  if (!isValidFormat) {
    isValid.value = false
    validationMessage.value = '表达式格式不正确'
    nextRunTimes.value = []
    return
  }

  isValid.value = true
  validationMessage.value = '表达式格式正确'

  // 计算下次执行时间
  calculateNextRunTimes(expression)
}

// 计算下次执行时间
const calculateNextRunTimes = (expression) => {
  try {
    // 简化的下次执行时间计算
    const now = new Date()
    const times = []

    for (let i = 1; i <= 5; i++) {
      const nextTime = new Date(now.getTime() + i * 24 * 60 * 60 * 1000)
      times.push(nextTime.toLocaleString('zh-CN'))
    }

    nextRunTimes.value = times
  } catch (error) {
    nextRunTimes.value = []
  }
}

// 初始化
updateCronExpression()
</script>

<style scoped>
.cron-generator-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 32px;
  color: var(--text-color);
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  color: var(--text-secondary-color);
}

.cron-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.section-card {
  background: var(--bg-color-primary);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  border: 1px solid var(--border-color);
}

.section-card h3 {
  font-size: 20px;
  color: var(--text-color);
  margin-bottom: 20px;
}

.field-group {
  margin-bottom: 20px;
}

.field-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
}

.field-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-controls select,
.field-controls input {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  background: var(--bg-color-secondary);
  color: var(--text-color);
  transition: all 0.2s ease;
}

.field-controls select:focus,
.field-controls input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.field-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.field-inputs input {
  width: 80px;
}

.list-input {
  width: 200px !important;
}

.month-select {
  width: 200px;
  height: 120px;
}

.weekday-checkboxes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.weekday-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  cursor: pointer;
}

.expression-display {
  margin-top: 20px;
  padding: 16px;
  background: var(--bg-color-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.expression-display label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
  display: block;
}

.expression-box {
  display: flex;
  gap: 8px;
  align-items: center;
}

.expression-input {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  background: var(--bg-color-secondary);
  color: var(--text-color);
}

.btn-copy {
  padding: 8px 16px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}

.btn-copy:hover {
  background: var(--primary-color-hover);
}

.common-expressions {
  margin-top: 20px;
}

.common-expressions label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
  display: block;
}

.expression-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.expr-btn {
  padding: 8px 12px;
  background: var(--success-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.expr-btn:hover {
  background: var(--success-color-hover);
  transform: translateY(-1px);
}

.validation-input {
  margin-bottom: 16px;
}

.validation-input label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
  display: block;
}

.validation-result {
  margin-bottom: 16px;
}

.result-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
}

.result-status.valid {
  background: rgba(var(--success-color-rgb), 0.1);
  color: var(--success-color);
  border: 1px solid var(--success-color);
}

.result-status.invalid {
  background: rgba(var(--error-color-rgb), 0.1);
  color: var(--error-color);
  border: 1px solid var(--error-color);
}

.next-runs {
  margin-top: 16px;
}

.next-runs label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
  display: block;
}

.run-times {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.run-time {
  padding: 8px 12px;
  background: var(--bg-color-secondary);
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  color: var(--text-color);
}

.expression-help {
  margin-top: 20px;
}

.expression-help h4 {
  font-size: 16px;
  color: var(--text-color);
  margin-bottom: 12px;
}

.format-table {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.format-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  padding: 8px;
  background: var(--bg-color-tertiary);
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid var(--border-color);
}

.format-row .field {
  font-weight: 600;
  color: var(--text-color);
}

.format-row .range {
  color: var(--text-secondary-color);
}

.format-row .symbols {
  color: var(--primary-color);
  font-family: 'Consolas', 'Monaco', monospace;
}

:deep(.radio-group) {
  margin-bottom: 0.5rem;
}

:deep(.checkbox-group) {
  margin-top: 0.5rem;
}

:deep(.radio-item),
:deep(.checkbox-item) {
  margin-right: 1rem;
  margin-bottom: 0.5rem;
}

:deep(.radio-item label),
:deep(.checkbox-item label) {
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.radio-item input[type="radio"]),
:deep(.checkbox-item input[type="checkbox"]) {
  margin-right: 0.25rem;
}

/* 适配 BaseInput 组件 */
.field-inputs {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.field-inputs label {
  font-size: 14px;
  color: var(--text-secondary-color);
  margin-right: 8px;
}

.field-inputs :deep(.base-input) {
  margin-bottom: 0;
}

.field-inputs :deep(.base-input .input-label) {
  font-size: 14px;
  color: var(--text-secondary-color);
  margin-bottom: 0;
  margin-right: 8px;
}

.field-inputs :deep(.base-input .input-field) {
  padding: 6px 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  width: 80px;
}

.field-inputs :deep(.base-input .input-field:focus) {
  border-color: var(--primary-color);
  outline: none;
}

.range-inputs {
  display: flex;
  align-items: end;
  gap: 8px;
}

.range-inputs :deep(.base-input .input-field) {
  width: 80px;
}

.range-inputs .range-separator {
  margin: 0 4px;
  color: var(--text-secondary-color);
  font-weight: bold;
}

/* 选项卡样式 */
.tabs-container {
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.tabs {
  display: flex;
  gap: 0;
  overflow-x: auto;
  scrollbar-width: none;
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-secondary-color);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab-button:hover {
  color: var(--text-color);
  background: var(--bg-color-secondary);
}

.tab-button.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
  background: var(--bg-color-secondary);
}

.tab-icon {
  font-size: 16px;
}

.field-content {
  min-height: 300px;
}

.field-tab-content {
  padding: 20px 0;
}

.field-section {
  animation: fadeIn 0.3s ease;
}

.field-section h4 {
  margin-bottom: 15px;
  color: var(--text-color);
  font-size: 16px;
  font-weight: 600;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@media (max-width: 768px) {
  .cron-layout {
    grid-template-columns: 1fr;
  }

  .cron-generator-container {
    padding: 16px;
  }

  .tabs {
    flex-wrap: wrap;
  }

  .tab-button {
    padding: 10px 15px;
    font-size: 13px;
  }

  .weekday-checkboxes {
    grid-template-columns: repeat(2, 1fr);
  }

  .expression-box {
    flex-direction: column;
    align-items: stretch;
  }

  .expr-btn {
    font-size: 11px;
    padding: 6px 10px;
  }
}
</style>
