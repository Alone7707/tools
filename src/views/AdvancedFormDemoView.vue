<template>
    <div class="advanced-form-demo">
        <h2>高级表单组件演示</h2>

        <!-- 基础表单 -->
        <section class="demo-section">
            <h3>基础表单</h3>
            <BaseForm ref="basicFormRef" :model="basicForm" :rules="basicRules" label-width="100px"
                @submit="handleBasicSubmit">
                <BaseFormItem label="用户名" prop="username">
                    <BaseInput v-model="basicForm.username" placeholder="请输入用户名" />
                </BaseFormItem>

                <BaseFormItem label="邮箱" prop="email">
                    <BaseInput v-model="basicForm.email" type="email" placeholder="请输入邮箱" />
                </BaseFormItem>

                <BaseFormItem label="密码" prop="password">
                    <BaseInput v-model="basicForm.password" type="password" placeholder="请输入密码" />
                </BaseFormItem>

                <BaseFormItem label="确认密码" prop="confirmPassword">
                    <BaseInput v-model="basicForm.confirmPassword" type="password" placeholder="请再次输入密码" />
                </BaseFormItem>

                <BaseFormItem>
                    <BaseButton type="primary" native-type="submit">提交</BaseButton>
                    <BaseButton @click="resetBasicForm">重置</BaseButton>
                </BaseFormItem>
            </BaseForm>
        </section>

        <!-- 复杂表单 -->
        <section class="demo-section">
            <h3>复杂表单</h3>
            <BaseForm ref="advancedFormRef" :model="advancedForm" :rules="advancedRules" label-width="120px"
                label-position="top" @submit="handleAdvancedSubmit">
                <div class="form-row">
                    <div class="form-col">
                        <BaseFormItem label="姓名" prop="name">
                            <BaseInput v-model="advancedForm.name" placeholder="请输入姓名" />
                        </BaseFormItem>
                    </div>
                    <div class="form-col">
                        <BaseFormItem label="年龄" prop="age">
                            <BaseInput v-model.number="advancedForm.age" type="number" placeholder="请输入年龄" />
                        </BaseFormItem>
                    </div>
                </div>

                <BaseFormItem label="性别" prop="gender">
                    <BaseRadioGroup v-model="advancedForm.gender" :options="genderOptions" direction="horizontal" />
                </BaseFormItem>

                <BaseFormItem label="兴趣爱好" prop="hobbies">
                    <BaseCheckboxGroup v-model="advancedForm.hobbies" :options="hobbyOptions" direction="horizontal"
                        show-select-all />
                </BaseFormItem>

                <BaseFormItem label="所在城市" prop="city">
                    <BaseSelect v-model="advancedForm.city" :options="cityOptions" placeholder="请选择城市" />
                </BaseFormItem>

                <BaseFormItem label="自我介绍" prop="introduction">
                    <BaseTextarea v-model="advancedForm.introduction" :rows="4" :max-length="500" show-count
                        placeholder="请输入自我介绍" />
                </BaseFormItem>

                <BaseFormItem label="上传头像" prop="avatar">
                    <div class="upload-area">
                        <input type="file" accept="image/*" @change="handleFileChange" style="display: none"
                            ref="fileInput">
                        <BaseButton type="info" @click="$refs.fileInput.click()" icon="📁">
                            选择文件
                        </BaseButton>
                        <span v-if="advancedForm.avatar" class="file-name">{{ advancedForm.avatar }}</span>
                    </div>
                </BaseFormItem>

                <BaseFormItem prop="agree">
                    <BaseCheckbox v-model="advancedForm.agree">
                        我同意<a href="#" @click.prevent>用户协议</a>和<a href="#" @click.prevent>隐私政策</a>
                    </BaseCheckbox>
                </BaseFormItem>

                <BaseFormItem>
                    <BaseButton type="primary" native-type="submit">提交表单</BaseButton>
                    <BaseButton @click="resetAdvancedForm">重置表单</BaseButton>
                    <BaseButton type="info" @click="validateAdvancedForm">验证表单</BaseButton>
                </BaseFormItem>
            </BaseForm>
        </section>

        <!-- 行内表单 -->
        <section class="demo-section">
            <h3>行内表单</h3>
            <BaseForm ref="inlineFormRef" :model="inlineForm" :rules="inlineRules" inline @submit="handleInlineSubmit">
                <BaseFormItem label="搜索" prop="keyword">
                    <BaseInput v-model="inlineForm.keyword" placeholder="请输入关键词" style="width: 200px;" />
                </BaseFormItem>

                <BaseFormItem label="状态" prop="status">
                    <BaseSelect v-model="inlineForm.status" :options="statusOptions" placeholder="请选择状态"
                        style="width: 120px;" />
                </BaseFormItem>

                <BaseFormItem>
                    <BaseButton type="primary" native-type="submit" icon="🔍">搜索</BaseButton>
                    <BaseButton @click="resetInlineForm">重置</BaseButton>
                </BaseFormItem>
            </BaseForm>
        </section>

        <!-- 动态表单 -->
        <section class="demo-section">
            <h3>动态表单</h3>
            <BaseForm ref="dynamicFormRef" :model="dynamicForm" :rules="dynamicRules" label-width="120px">
                <BaseFormItem v-for="(contact, index) in dynamicForm.contacts" :key="index" :label="`联系人${index + 1}`"
                    :prop="`contacts.${index}.name`">
                    <div class="dynamic-item">
                        <BaseInput v-model="contact.name" placeholder="请输入姓名"
                            style="width: 200px; margin-right: 10px;" />
                        <BaseInput v-model="contact.phone" placeholder="请输入电话"
                            style="width: 200px; margin-right: 10px;" />
                        <BaseButton type="danger" size="small" @click="removeContact(index)"
                            :disabled="dynamicForm.contacts.length <= 1" icon="🗑">
                            删除
                        </BaseButton>
                    </div>
                </BaseFormItem>

                <BaseFormItem>
                    <BaseButton type="success" @click="addContact" icon="+">添加联系人</BaseButton>
                </BaseFormItem>

                <BaseFormItem>
                    <BaseButton type="primary" @click="submitDynamicForm" icon="📨">提交</BaseButton>
                    <BaseButton @click="resetDynamicForm">重置</BaseButton>
                </BaseFormItem>
            </BaseForm>
        </section>

        <!-- 验证触发测试 -->
        <section class="demo-section">
            <h3>验证触发方式测试</h3>
            <BaseForm ref="triggerFormRef" :model="triggerForm" :rules="triggerRules" label-width="150px">
                <!-- 失焦时验证 -->
                <BaseFormItem label="失焦验证" prop="blurField" :validate-trigger="['blur']">
                    <BaseInput v-model="triggerForm.blurField" placeholder="失去焦点时验证" />
                    <template #extra>
                        <span class="trigger-hint">触发方式：blur</span>
                    </template>
                </BaseFormItem>

                <!-- 值改变时验证 -->
                <BaseFormItem label="值改变验证" prop="changeField" :validate-trigger="['change']">
                    <BaseInput v-model="triggerForm.changeField" placeholder="值改变时验证" />
                    <template #extra>
                        <span class="trigger-hint">触发方式：change</span>
                    </template>
                </BaseFormItem>

                <!-- 输入时验证 -->
                <BaseFormItem label="输入时验证" prop="inputField" :validate-trigger="['input']">
                    <BaseInput v-model="triggerForm.inputField" placeholder="每次输入时验证" />
                    <template #extra>
                        <span class="trigger-hint">触发方式：input</span>
                    </template>
                </BaseFormItem>

                <!-- 多种触发方式 -->
                <BaseFormItem label="多重触发" prop="multiTriggerField" :validate-trigger="['blur', 'change', 'input']">
                    <BaseInput v-model="triggerForm.multiTriggerField" placeholder="支持多种触发方式" />
                    <template #extra>
                        <span class="trigger-hint">触发方式：blur + change + input</span>
                    </template>
                </BaseFormItem>

                <BaseFormItem>
                    <BaseButton type="primary" @click="validateTriggerForm" icon="✓">验证表单</BaseButton>
                    <BaseButton @click="resetTriggerForm">重置表单</BaseButton>
                </BaseFormItem>
            </BaseForm>
        </section>
        <section class="demo-section">
            <h3>表单数据</h3>
            <div class="data-display">
                <div class="data-item">
                    <h4>基础表单数据：</h4>
                    <pre>{{ JSON.stringify(basicForm, null, 2) }}</pre>
                </div>
                <div class="data-item">
                    <h4>复杂表单数据：</h4>
                    <pre>{{ JSON.stringify(advancedForm, null, 2) }}</pre>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import BaseForm from '@/components/ui/BaseForm.vue'
import BaseFormItem from '@/components/ui/BaseFormItem.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseRadioGroup from '@/components/ui/BaseRadioGroup.vue'
import BaseCheckboxGroup from '@/components/ui/BaseCheckboxGroup.vue'
import BaseCheckbox from '@/components/ui/BaseCheckbox.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

// 表单引用
const basicFormRef = ref()
const advancedFormRef = ref()
const inlineFormRef = ref()
const dynamicFormRef = ref()
const triggerFormRef = ref()

// 基础表单数据
const basicForm = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
})

// 基础表单验证规则 - Element Plus 风格
const basicRules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度应为3-20个字符', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度应为6-20个字符', trigger: 'blur' },
        { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码必须包含字母和数字', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value !== basicForm.password) {
                    callback(new Error('两次输入密码不一致'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ]
})

// 复杂表单数据
const advancedForm = reactive({
    name: '',
    age: '',
    gender: '',
    hobbies: [],
    city: '',
    introduction: '',
    avatar: '',
    agree: false
})

// 复杂表单验证规则 - Element Plus 风格
const advancedRules = reactive({
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { min: 2, max: 10, message: '姓名长度应为2-10个字符', trigger: 'blur' }
    ],
    age: [
        { required: true, message: '请输入年龄', trigger: 'blur' },
        { type: 'number', message: '年龄必须为数字', trigger: 'blur' },
        { min: 1, max: 120, message: '年龄必须在1-120之间', trigger: 'blur' }
    ],
    gender: [
        { required: true, message: '请选择性别', trigger: 'change' }
    ],
    hobbies: [
        {
            type: 'array',
            required: true,
            message: '请至少选择一个兴趣爱好',
            trigger: 'change'
        }
    ],
    city: [
        { required: true, message: '请选择城市', trigger: 'change' }
    ],
    introduction: [
        { required: true, message: '请输入自我介绍', trigger: 'blur' },
        { max: 500, message: '自我介绍不能超过500个字符', trigger: 'blur' }
    ],
    agree: [
        {
            validator: (rule, value, callback) => {
                if (value !== true) {
                    callback(new Error('请同意用户协议和隐私政策'))
                } else {
                    callback()
                }
            },
            trigger: 'change'
        }
    ]
})

// 行内表单数据
const inlineForm = reactive({
    keyword: '',
    status: ''
})

// 行内表单验证规则 - Element Plus 风格
const inlineRules = reactive({
    keyword: [
        { required: true, message: '请输入搜索关键词', trigger: 'blur' }
    ],
    status: [
        { required: true, message: '请选择状态', trigger: 'change' }
    ]
})

// 动态表单数据
const dynamicForm = reactive({
    contacts: [
        { name: '', phone: '' }
    ]
})

// 动态表单验证规则
const dynamicRules = reactive({})

// 选项数据
const genderOptions = [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' },
    { label: '其他', value: 'other' }
]

const hobbyOptions = [
    { label: '阅读', value: 'reading' },
    { label: '音乐', value: 'music' },
    { label: '运动', value: 'sports' },
    { label: '旅行', value: 'travel' },
    { label: '摄影', value: 'photography' },
    { label: '编程', value: 'programming' }
]

const cityOptions = [
    { label: '北京', value: 'beijing' },
    { label: '上海', value: 'shanghai' },
    { label: '广州', value: 'guangzhou' },
    { label: '深圳', value: 'shenzhen' },
    { label: '杭州', value: 'hangzhou' }
]

const statusOptions = [
    { label: '全部', value: '' },
    { label: '启用', value: 'enabled' },
    { label: '禁用', value: 'disabled' }
]

// 表单提交处理
const handleBasicSubmit = async (formData, result) => {
    console.log('基础表单提交:', formData, result)
    alert('基础表单提交成功！')
}

const handleAdvancedSubmit = async (formData, result) => {
    console.log('复杂表单提交:', formData, result)
    alert('复杂表单提交成功！')
}

const handleInlineSubmit = async (formData, result) => {
    console.log('行内表单提交:', formData, result)
    alert(`搜索关键词：${formData.keyword}`)
}

// 表单重置
const resetBasicForm = () => {
    basicFormRef.value?.resetFields()
}

const resetAdvancedForm = () => {
    advancedFormRef.value?.resetFields()
}

const resetInlineForm = () => {
    inlineFormRef.value?.resetFields()
}

const resetDynamicForm = () => {
    dynamicFormRef.value?.resetFields()
}

// 表单验证
const validateAdvancedForm = async () => {
    const result = await advancedFormRef.value?.validate()
    if (result?.valid) {
        alert('表单验证通过！')
    } else {
        alert(`表单验证失败，${result?.invalidFields || 0} 个字段有错误`)
    }
}

// 动态表单操作
const addContact = () => {
    const index = dynamicForm.contacts.length
    dynamicForm.contacts.push({ name: '', phone: '' })

    // 动态添加验证规则 - Element Plus 风格
    dynamicRules[`contacts.${index}.name`] = [
        { required: true, message: '请输入姓名', trigger: 'blur' }
    ]
    dynamicRules[`contacts.${index}.phone`] = [
        { required: true, message: '请输入电话', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ]
}

const removeContact = (index) => {
    if (dynamicForm.contacts.length > 1) {
        dynamicForm.contacts.splice(index, 1)

        // 移除对应的验证规则
        delete dynamicRules[`contacts.${index}.name`]
        delete dynamicRules[`contacts.${index}.phone`]
    }
}

const submitDynamicForm = async () => {
    const result = await dynamicFormRef.value?.validate()
    if (result?.valid) {
        console.log('动态表单提交:', dynamicForm)
        alert('动态表单提交成功！')
    }
}

// 文件上传处理
const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        advancedForm.avatar = file.name
    }
}

// 验证触发测试方法
const validateTriggerForm = async () => {
    const result = await triggerFormRef.value?.validate()
    if (result?.valid) {
        alert('触发测试表单验证通过！')
    } else {
        alert(`触发测试表单验证失败，${result?.invalidFields || 0} 个字段有错误`)
    }
}

const resetTriggerForm = () => {
    triggerFormRef.value?.resetFields()
}

// 验证触发测试表单数据
const triggerForm = reactive({
    blurField: '',
    changeField: '',
    inputField: '',
    multiTriggerField: ''
})

// 验证触发测试规则 - Element Plus 风格
const triggerRules = reactive({
    blurField: [
        { required: true, message: '此字段为必填项', trigger: 'blur' },
        { min: 3, message: '至少输入3个字符', trigger: 'blur' }
    ],
    changeField: [
        { required: true, message: '此字段为必填项', trigger: 'change' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: 'change' }
    ],
    inputField: [
        { required: true, message: '此字段为必填项', trigger: 'input' },
        { min: 5, max: 10, message: '长度必须在5-10个字符之间', trigger: 'input' }
    ],
    multiTriggerField: [
        { required: true, message: '此字段为必填项', trigger: ['blur', 'change'] },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }
    ]
})
</script>

<style scoped lang="scss">
.advanced-form-demo {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;

    h2 {
        color: var(--text-color);
        margin-bottom: 30px;
        text-align: center;
    }

    .demo-section {
        margin-bottom: 40px;
        padding: 24px;
        background: var(--card-background);
        border-radius: 8px;
        border: 1px solid var(--border-color);

        h3 {
            color: var(--text-color);
            margin-bottom: 24px;
            font-size: 18px;
            font-weight: 600;
            border-bottom: 2px solid var(--primary-color);
            padding-bottom: 8px;
        }
    }

    .trigger-hint {
        color: var(--text-secondary-color);
        font-size: 12px;
        font-style: italic;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 16px;
    }

    .form-col {
        min-width: 0;
    }

    .dynamic-item {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .upload-area {
        display: flex;
        align-items: center;
        gap: 12px;

        .file-name {
            color: var(--text-secondary-color);
            font-size: 14px;
        }
    }

    .data-display {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;

        .data-item {
            h4 {
                margin-bottom: 12px;
                color: var(--text-color);
                font-size: 14px;
            }

            pre {
                background: var(--input-background);
                border: 1px solid var(--border-color);
                border-radius: 4px;
                padding: 16px;
                font-size: 12px;
                color: var(--text-color);
                overflow-x: auto;
                max-height: 300px;
                overflow-y: auto;
            }
        }
    }
}

// 按钮样式
.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin-right: 8px;
    transition: all 0.2s ease;

    &.btn-primary {
        background: var(--primary-color);
        color: white;

        &:hover {
            opacity: 0.9;
        }
    }

    &.btn-secondary {
        background: var(--text-secondary-color);
        color: white;

        &:hover {
            opacity: 0.9;
        }
    }

    &.btn-outline {
        background: transparent;
        border: 1px solid var(--border-color);
        color: var(--text-color);

        &:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
        }
    }

    &.btn-danger {
        background: #ff4757;
        color: white;

        &:hover {
            opacity: 0.9;
        }

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }

    &.btn-small {
        padding: 4px 8px;
        font-size: 12px;
    }

    &:last-child {
        margin-right: 0;
    }
}

a {
    color: var(--primary-color);
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
}
</style>