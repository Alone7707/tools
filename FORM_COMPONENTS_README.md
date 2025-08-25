# 表单组件库使用指南

本文档介绍了基于原生 HTML 表单元素封装的 Vue 3 组件库，这些组件继承了原生标签的所有属性，并提供了现代化的样式和增强功能。

> ✨ **重要更新**：验证系统已全面支持 **Element Plus 风格的验证规则定义**，同时保持向后兼容。推荐使用新的 Element Plus 风格进行开发，以获得更好的开发体验。

## 目录

- [快速开始](#快速开始)
- [基础输入组件](#基础输入组件)
- [选择组件](#选择组件)
- [按钮组件](#按钮组件)
- [表单系统组件](#表单系统组件)
- [验证规则系统](#验证规则系统)
- [完整使用示例](#完整使用示例)
- [主题支持](#主题支持)
- [最佳实践](#最佳实践)

## 快速开始

### 安装使用

组件已集成到项目中，可以直接在 Vue 组件中导入使用：

```vue
<script setup>
import BaseInput from '@/components/BaseInput.vue'
import BaseForm from '@/components/BaseForm.vue'
import BaseFormItem from '@/components/BaseFormItem.vue'
</script>
```

### 基本概念

1. **原生属性继承**：所有组件都使用 `v-bind="$attrs"` 继承原生标签属性
2. **主题适配**：组件自动适配项目的深色/浅色主题
3. **验证系统**：内置完整的表单验证机制，支持同步和异步验证
4. **响应式设计**：所有组件都支持响应式布局

## 基础输入组件

### BaseInput - 输入框组件

基于原生 `<input>` 标签封装的输入框组件。

#### 基本用法

```vue
<BaseInput
  v-model="value"
  label="用户名"
  placeholder="请输入用户名"
  hint="用户名长度为3-20个字符"
/>
```

#### Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| modelValue | String/Number | '' | 绑定值 |
| label | String | '' | 输入框标签 |
| error | String | '' | 错误信息 |
| hint | String | '' | 提示信息 |
| disabled | Boolean | false | 是否禁用 |

#### 事件

- `update:modelValue` - 值更新事件
- `blur` - 失去焦点事件
- `focus` - 获得焦点事件

### BaseTextarea - 文本域组件

基于原生 `<textarea>` 标签封装的文本域组件。

#### 基本用法

```vue
<BaseTextarea
  v-model="value"
  label="描述"
  :rows="4"
  :max-length="200"
  show-count
  hint="详细描述您的需求"
/>
```

#### Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| modelValue | String | '' | 绑定值 |
| label | String | '' | 文本域标签 |
| error | String | '' | 错误信息 |
| hint | String | '' | 提示信息 |
| disabled | Boolean | false | 是否禁用 |
| rows | String/Number | 4 | 行数 |
| maxLength | Number | null | 最大长度 |
| showCount | Boolean | false | 是否显示字数统计 |

## 选择组件

### BaseRadio - 单选框组件

基于原生 `<input type="radio">` 标签封装的单选框组件。

#### 基本用法

```vue
<BaseRadio
  v-model="gender"
  value="male"
  label="男"
  name="gender"
/>
<BaseRadio
  v-model="gender"
  value="female"
  label="女"
  name="gender"
/>
```

#### Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| modelValue | String/Number/Boolean | '' | 绑定值 |
| value | String/Number/Boolean | - | 单选框的值 |
| label | String | '' | 单选框标签 |
| name | String | '' | 单选框组名 |
| disabled | Boolean | false | 是否禁用 |

### BaseRadioGroup - 单选框组

提供单选框组功能的组件。

#### 基本用法

```vue
<BaseRadioGroup
  v-model="theme"
  label="主题偏好"
  :options="themeOptions"
  direction="horizontal"
  hint="选择您喜欢的主题风格"
/>
```

#### Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| modelValue | String/Number/Boolean | '' | 绑定值 |
| options | Array | [] | 选项数组 |
| label | String | '' | 组标签 |
| direction | String | 'horizontal' | 排列方向：horizontal/vertical |
| disabled | Boolean | false | 是否禁用 |
| name | String | '' | 单选框组名 |
| error | String | '' | 错误信息 |
| hint | String | '' | 提示信息 |

#### options 格式

```javascript
const options = [
  { label: '选项1', value: 'option1', disabled: false },
  { label: '选项2', value: 'option2', disabled: true }
]
```

### BaseCheckbox - 复选框组件

基于原生 `<input type="checkbox">` 标签封装的复选框组件。

#### 基本用法

```vue
<BaseCheckbox
  v-model="agreeTerms"
  label="我同意服务条款"
/>
```

#### 数组模式用法

```vue
<BaseCheckbox
  v-model="selectedItems"
  value="item1"
  label="选项1"
/>
```

#### Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| modelValue | Boolean/Array | false | 绑定值 |
| value | String/Number/Boolean | true | 复选框的值 |
| label | String | '' | 复选框标签 |
| disabled | Boolean | false | 是否禁用 |
| indeterminate | Boolean | false | 是否为半选状态 |

### BaseCheckboxGroup - 复选框组

提供复选框组功能的组件。

#### 基本用法

```vue
<BaseCheckboxGroup
  v-model="interests"
  label="兴趣爱好"
  :options="interestOptions"
  direction="horizontal"
  show-select-all
  :max="3"
  hint="最多选择3项"
/>
```

#### Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| modelValue | Array | [] | 绑定值 |
| options | Array | [] | 选项数组 |
| label | String | '' | 组标签 |
| direction | String | 'horizontal' | 排列方向：horizontal/vertical |
| disabled | Boolean | false | 是否禁用 |
| showSelectAll | Boolean | false | 是否显示全选 |
| selectAllText | String | '全选' | 全选按钮文本 |
| min | Number | 0 | 最少选择数量 |
| max | Number | null | 最多选择数量 |
| error | String | '' | 错误信息 |
| hint | String | '' | 提示信息 |

## 按钮组件

### BaseButton - 按钮组件

基于原生 `<button>` 标签封装的按钮组件，支持多种类型、尺寸和状态。

#### 基本用法

```vue
<BaseButton type="primary">主要按钮</BaseButton>
<BaseButton type="success" icon="✓">成功按钮</BaseButton>
<BaseButton type="danger" :loading="loading">加载中...</BaseButton>
```

#### Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| type | String | 'default' | 按钮类型：default/primary/secondary/success/warning/danger/info/text/link |
| size | String | 'medium' | 按钮尺寸：mini/small/medium/large |
| plain | Boolean | false | 是否为朴素按钮 |
| round | Boolean | false | 是否为圆角按钮 |
| circle | Boolean | false | 是否为圆形按钮 |
| disabled | Boolean | false | 是否禁用 |
| loading | Boolean | false | 是否加载中 |
| icon | String/Object | null | 图标 |
| iconPosition | String | 'left' | 图标位置：left/right |
| nativeType | String | 'button' | 原生按钮类型：button/submit/reset |
| block | Boolean | false | 是否为块级按钮 |

#### 事件

- `click` - 点击事件

#### 使用示例

```vue
<!-- 基本用法 -->
<BaseButton>默认按钮</BaseButton>
<BaseButton type="primary">主要按钮</BaseButton>
<BaseButton type="success">成功按钮</BaseButton>

<!-- 不同尺寸 -->
<BaseButton size="mini">迷你按钮</BaseButton>
<BaseButton size="small">小型按钮</BaseButton>
<BaseButton size="large">大型按钮</BaseButton>

<!-- 特殊形状 -->
<BaseButton type="primary" round>圆角按钮</BaseButton>
<BaseButton type="primary" circle icon="+"></BaseButton>

<!-- 图标按钮 -->
<BaseButton type="primary" icon="💾">保存</BaseButton>
<BaseButton type="danger" icon="🗑">删除</BaseButton>

<!-- 加载状态 -->
<BaseButton type="primary" :loading="true">加载中...</BaseButton>

<!-- 朴素按钮 -->
<BaseButton type="primary" plain>朴素按钮</BaseButton>

<!-- 文字按钮 -->
<BaseButton type="text">文字按钮</BaseButton>
<BaseButton type="link">链接按钮</BaseButton>

<!-- 块级按钮 -->
<BaseButton type="primary" block>块级按钮</BaseButton>
```

## 表单系统组件

### BaseForm - 表单容器

表单容器组件，提供统一的数据管理和验证功能。

#### 基本用法

```vue
<BaseForm
  ref="formRef"
  :model="formData"
  :rules="formRules"
  label-width="100px"
  @submit="handleSubmit"
>
  <BaseFormItem prop="username" label="用户名">
    <BaseInput v-model="formData.username" placeholder="请输入用户名" />
  </BaseFormItem>
  
  <BaseFormItem prop="email" label="邮箱">
    <BaseInput v-model="formData.email" type="email" placeholder="请输入邮箱" />
  </BaseFormItem>
  
  <button type="submit">提交</button>
</BaseForm>
```

#### Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| model | Object | {} | 表单数据对象 |
| rules | Object | {} | 验证规则对象 |
| labelWidth | String | 'auto' | 标签宽度 |
| labelPosition | String | 'right' | 标签对齐方式：left/right/top |
| disabled | Boolean | false | 是否禁用整个表单 |
| validateOnRuleChange | Boolean | true | 是否在规则改变时触发验证 |

#### 方法

- `validate()` - 验证整个表单
- `validateField(prop)` - 验证指定字段
- `resetFields()` - 重置表单
- `clearValidation()` - 清除验证结果

#### 事件

- `submit` - 表单提交事件
- `validate` - 验证完成事件

### BaseFormItem - 表单项包装

表单项包装组件，为表单控件提供标签、验证和布局功能。

#### 基本用法

```vue
<BaseFormItem
  prop="username"
  label="用户名"
  :rules="[{ required: true, message: '请输入用户名' }]"
  validate-trigger="blur"
>
  <BaseInput v-model="formData.username" placeholder="请输入用户名" />
</BaseFormItem>
```

#### Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| prop | String | '' | 表单域属性名 |
| label | String | '' | 标签文本 |
| labelWidth | String | '' | 标签宽度 |
| required | Boolean | false | 是否显示必填标记 |
| rules | Array | [] | 验证规则 |
| error | String | '' | 错误信息 |
| showMessage | Boolean | true | 是否显示验证消息 |
| validateTrigger | String/Array | 'change' | 验证触发方式：blur/focus/change/input |

#### 验证触发方式说明

- `blur` - 失去焦点时验证
- `focus` - 获得焦点时验证  
- `change` - 值改变时验证
- `input` - 输入时验证
- 可以组合使用：`['blur', 'change']`

## 验证规则系统

组件库内置了完整的验证规则系统，支持同步和异步验证，**完全兼容 Element Plus 风格的验证规则定义**。

### Element Plus 风格验证规则（推荐）

#### 基础规则定义

```javascript
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应为3-20个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', message: '年龄必须为数字', trigger: 'blur' },
    { min: 1, max: 120, message: '年龄必须在1-120之间', trigger: 'blur' }
  ],
  hobbies: [
    {
      type: 'array',
      required: true,
      message: '请至少选择一个兴趣爱好',
      trigger: 'change'
    }
  ],
  birthdate: [
    {
      type: 'date',
      required: true,
      message: '请选择出生日期',
      trigger: 'change'
    }
  ]
})
```

#### 支持的验证属性

| 属性名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| required | Boolean | 是否必填 | `{ required: true }` |
| type | String | 数据类型 | `email`, `number`, `array`, `date`, `url` |
| min | Number | 最小长度/值 | `{ min: 3 }` |
| max | Number | 最大长度/值 | `{ max: 20 }` |
| pattern | RegExp | 正则表达式 | `{ pattern: /^[a-zA-Z]+$/ }` |
| validator | Function | 自定义验证函数 | `{ validator: (rule, value, callback) => {} }` |
| message | String | 错误提示信息 | `{ message: '请输入用户名' }` |
| trigger | String/Array | 验证触发时机 | `'blur'`, `'change'`, `['blur', 'change']` |

#### 验证触发时机

- `blur` - 失去焦点时验证（适用于输入框）
- `change` - 值改变时验证（适用于选择器、开关等）
- `input` - 输入时验证（实时验证）
- 可以组合使用：`['blur', 'change']`

#### 自定义验证器

```javascript
const customRules = {
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码至少6位'))
        } else if (!/^(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
          callback(new Error('密码必须包含字母和数字'))
        } else {
          callback() // 验证通过
        }
      },
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== formData.password) {
          callback(new Error('两次密码输入不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
```

#### 异步验证

```javascript
const asyncRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      validator: async (rule, value, callback) => {
        try {
          const response = await fetch(`/api/check-username?name=${value}`)
          const result = await response.json()
          if (!result.available) {
            callback(new Error('用户名已被占用'))
          } else {
            callback()
          }
        } catch (error) {
          callback(new Error('验证失败，请重试'))
        }
      },
      trigger: 'blur'
    }
  ]
}
```

### 内置验证规则（兼容模式）

为了保持向后兼容，仍然支持原有的内置规则：

#### 基础规则

```javascript
import { ValidationRules } from '@shared/validation'

const rules = {
  username: [
    ValidationRules.required('用户名不能为空'),
    ValidationRules.minLength(3, '用户名至少3个字符'),
    ValidationRules.maxLength(20, '用户名不能超过20个字符')
  ],
  email: [
    ValidationRules.required('邮箱不能为空'),
    ValidationRules.email('请输入有效的邮箱地址')
  ],
  phone: [
    ValidationRules.required('手机号不能为空'),
    ValidationRules.phone('请输入有效的手机号')
  ],
  age: [
    ValidationRules.required('年龄不能为空'),
    ValidationRules.number('年龄必须是数字'),
    ValidationRules.range(1, 120, '年龄必须在1-120之间')
  ]
}
```

#### 可用的验证规则

| 规则名 | 参数 | 说明 |
|--------|------|------|
| required | message | 必填验证 |
| minLength | length, message | 最小长度验证 |
| maxLength | length, message | 最大长度验证 |
| email | message | 邮箱格式验证 |
| phone | message | 手机号格式验证 |
| number | message | 数字验证 |
| integer | message | 整数验证 |
| range | min, max, message | 数值范围验证 |
| pattern | regex, message | 正则表达式验证 |
| custom | validator, message | 自定义验证函数 |

#### 自定义验证规则

```javascript
const customRules = {
  password: [
    ValidationRules.required('密码不能为空'),
    ValidationRules.minLength(8, '密码至少8位'),
    ValidationRules.custom(
      (value) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)
      },
      '密码必须包含大小写字母和数字'
    )
  ],
  confirmPassword: [
    ValidationRules.required('请确认密码'),
    ValidationRules.custom(
      (value, model) => {
        return value === model.password
      },
      '两次密码输入不一致'
    )
  ]
}
```

#### 异步验证

```javascript
const asyncRules = {
  username: [
    ValidationRules.required('用户名不能为空'),
    {
      asyncValidator: async (value) => {
        const response = await fetch(`/api/check-username?name=${value}`)
        const result = await response.json()
        if (!result.available) {
          throw new Error('用户名已被占用')
        }
      },
      trigger: 'blur'
    }
  ]
}
```

## 完整使用示例

### 用户注册表单

```vue
<template>
  <BaseForm
    ref="registerForm"
    :model="registerData"
    :rules="registerRules"
    label-width="120px"
    @submit="handleRegister"
  >
    <!-- 基本信息 -->
    <h3>基本信息</h3>
    
    <BaseFormItem prop="username" label="用户名">
      <BaseInput 
        v-model="registerData.username" 
        placeholder="请输入用户名"
        hint="3-20个字符，支持字母、数字、下划线"
      />
    </BaseFormItem>
    
    <BaseFormItem prop="email" label="邮箱">
      <BaseInput 
        v-model="registerData.email" 
        type="email"
        placeholder="请输入邮箱地址"
      />
    </BaseFormItem>
    
    <BaseFormItem prop="phone" label="手机号">
      <BaseInput 
        v-model="registerData.phone" 
        placeholder="请输入手机号"
      />
    </BaseFormItem>
    
    <!-- 个人信息 -->
    <h3>个人信息</h3>
    
    <BaseFormItem prop="gender" label="性别">
      <BaseRadioGroup 
        v-model="registerData.gender"
        :options="genderOptions"
        direction="horizontal"
      />
    </BaseFormItem>
    
    <BaseFormItem prop="age" label="年龄">
      <BaseInput 
        v-model="registerData.age" 
        type="number"
        placeholder="请输入年龄"
      />
    </BaseFormItem>
    
    <BaseFormItem prop="interests" label="兴趣爱好">
      <BaseCheckboxGroup 
        v-model="registerData.interests"
        :options="interestOptions"
        direction="horizontal"
        :max="3"
        hint="最多选择3项"
      />
    </BaseFormItem>
    
    <BaseFormItem prop="bio" label="个人简介">
      <BaseTextarea 
        v-model="registerData.bio"
        :rows="4"
        :max-length="200"
        show-count
        placeholder="简单介绍一下自己"
      />
    </BaseFormItem>
    
    <!-- 协议同意 -->
    <BaseFormItem prop="agreeTerms">
      <BaseCheckbox 
        v-model="registerData.agreeTerms"
        label="我已阅读并同意用户协议和隐私政策"
      />
    </BaseFormItem>
    
    <div class="form-actions">
      <button type="button" @click="resetForm">重置</button>
      <button type="submit" :disabled="submitting">{{ submitting ? '注册中...' : '注册' }}</button>
    </div>
  </BaseForm>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ValidationRules } from '@shared/validation'

const registerForm = ref()
const submitting = ref(false)

const registerData = reactive({
  username: '',
  email: '',
  phone: '',
  gender: '',
  age: '',
  interests: [],
  bio: '',
  agreeTerms: false
})

const genderOptions = [
  { label: '男', value: 'male' },
  { label: '女', value: 'female' },
  { label: '其他', value: 'other' }
]

const interestOptions = [
  { label: '编程', value: 'programming' },
  { label: '设计', value: 'design' },
  { label: '音乐', value: 'music' },
  { label: '运动', value: 'sports' },
  { label: '阅读', value: 'reading' },
  { label: '旅行', value: 'travel' }
]

const registerRules = reactive({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应为3-20个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  age: [
    { required: true, message: '年龄不能为空', trigger: 'blur' },
    { type: 'number', message: '年龄必须是数字', trigger: 'blur' },
    { min: 1, max: 120, message: '年龄必须在1-120之间', trigger: 'blur' }
  ],
  interests: [
    {
      type: 'array',
      required: true,
      message: '请至少选择一个兴趣爱好',
      trigger: 'change'
    }
  ],
  agreeTerms: [
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

const handleRegister = async () => {
  try {
    const isValid = await registerForm.value.validate()
    if (isValid) {
      submitting.value = true
      // 模拟注册请求
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('注册成功！')
      resetForm()
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  registerForm.value.resetFields()
}
</script>

<style scoped>
.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.form-actions button {
  padding: 8px 24px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background: var(--background-color);
  color: var(--text-color);
  cursor: pointer;
}

.form-actions button[type="submit"] {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.form-actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

h3 {
  margin: 24px 0 16px 0;
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 8px;
}
</style>
```

## 主题支持

所有组件都支持项目的主题系统，自动适配深色/浅色模式。组件使用了以下 CSS 变量：

- `--primary-color` - 主色调
- `--background-color` - 背景色
- `--text-color` - 文本色
- `--text-secondary-color` - 次要文本色
- `--border-color` - 边框色
- `--input-background` - 输入框背景色
- `--card-background` - 卡片背景色

## 最佳实践

### 1. 表单设计原则

#### 用户体验优先
- 提供清晰的标签和提示信息
- 使用合适的表单控件类型
- 合理的验证时机（blur 验证主要字段，change 验证选择项）
- 及时的错误反馈和成功提示

#### 性能优化
- 使用防抖动验证对于实时验证
- 异步验证使用 AbortController 取消旧请求
- 合理使用 computed 和 watch

### 2. 组件使用指南

#### BaseInput 使用技巧
```vue
<!-- 推荐：同时提供 label 和 placeholder -->
<BaseInput 
  v-model="email"
  label="邮箱地址"
  placeholder="请输入邮箱地址"
  type="email"
  hint="用于接收重要通知"
/>

<!-- 避免：缺少提示信息 -->
<BaseInput v-model="email" />
```

#### BaseRadioGroup vs BaseRadio
```vue
<!-- 推荐：使用 BaseRadioGroup 管理选项 -->
<BaseRadioGroup 
  v-model="gender"
  label="性别"
  :options="genderOptions"
/>

<!-- 只有在需要复杂布局时才直接使用 BaseRadio -->
<div class="custom-layout">
  <BaseRadio v-model="gender" value="male" label="男" />
  <div class="description">详细说明...</div>
  <BaseRadio v-model="gender" value="female" label="女" />
</div>
```

#### BaseButton 使用技巧
```vue
<!-- 推荐：根据功能选择合适的类型和尺寸 -->
<BaseButton type="primary" icon="💾">保存</BaseButton>
<BaseButton type="danger" icon="🗑" size="small">删除</BaseButton>
<BaseButton type="text" @click="handleCancel">取消</BaseButton>

<!-- 推荐：使用加载状态提示用户操作进度 -->
<BaseButton type="primary" :loading="submitting" @click="handleSubmit">
  {{ submitting ? '提交中...' : '提交' }}
</BaseButton>

<!-- 推荐：使用图标增强按钮语义 -->
<BaseButton type="success" icon="✓" size="small">确认</BaseButton>
<BaseButton type="warning" icon="⚠" plain>警告</BaseButton>

<!-- 推荐：合理的按钮组合布局 -->
<div class="button-group">
  <BaseButton type="primary">主要操作</BaseButton>
  <BaseButton>次要操作</BaseButton>
  <BaseButton type="text">取消</BaseButton>
</div>

<!-- 避免：过多相同类型的按钮 -->
<BaseButton type="primary">按钮1</BaseButton>
<BaseButton type="primary">按钮2</BaseButton>
<BaseButton type="primary">按钮3</BaseButton>
```

#### 验证规则组合
```vue
<script setup>
// Element Plus 风格验证规则（推荐）
const passwordRules = [
  { required: true, message: '密码不能为空', trigger: 'blur' },
  { min: 8, message: '密码至少8位', trigger: 'blur' },
  {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: '密码必须包含大小写字母和数字',
    trigger: 'blur'
  },
  {
    validator: (rule, value, callback) => {
      if (!/[!@#$%^&*]/.test(value)) {
        callback(new Error('密码必须包含特殊字符'))
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }
]

// 也可以使用内置规则（兼容模式）
const legacyRules = [
  ValidationRules.required('密码不能为空'),
  ValidationRules.minLength(8, '密码至少8位'),
  ValidationRules.pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    '密码必须包含大小写字母和数字'
  )
]
</script>
```

### 3. 常见问题解决

#### 问题 1：验证不触发

**现象**：设置了 validateTrigger 但验证不生效

**解决**：
1. 确保 BaseFormItem 的 prop 属性对应表单数据的字段名
2. 检查表单组件是否放在 BaseForm 内部
3. 确认验证规则格式正确

```vue
<!-- 正确做法 -->
<BaseForm :model="formData" :rules="formRules">
  <BaseFormItem prop="username">
    <BaseInput v-model="formData.username" />
  </BaseFormItem>
</BaseForm>

<script setup>
const formData = reactive({ username: '' })
const formRules = {
  username: [ValidationRules.required('用户名必填')]
}
</script>
```

#### 问题 2：样式不生效

**现象**：自定义样式不生效或被覆盖

**解决**：
1. 使用 CSS 变量进行主题定制
2. 使用 :deep() 选择器修改组件内部样式

```vue
<style scoped>
/* 推荐：使用 CSS 变量 */
.custom-form {
  --primary-color: #007bff;
  --border-color: #e0e0e0;
}

/* 需要时：使用 deep 选择器 */
:deep(.base-input__input) {
  border-radius: 8px;
}
</style>
```

#### 问题 3：性能问题

**现象**：大表单卡顿或验证过于频繁

**解决**：
1. 对验证函数进行防抖动处理
2. 使用 v-show 替代 v-if 优化渲染
3. 合理使用验证触发时机

```javascript
// 防抖动验证
import { debounce } from 'lodash-es'

const validateField = debounce(async (field) => {
  await formRef.value.validateField(field)
}, 300)
```

### 4. 开发指导

#### 组件扩展

如果需要扩展组件功能，推荐使用组合式 API：

```vue
<template>
  <div class="enhanced-input">
    <BaseInput v-bind="inputProps" @input="handleInput" />
    <div v-if="showSuggestions" class="suggestions">
      <!-- 自动完成建议 -->
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseInput from '@/components/BaseInput.vue'

const props = defineProps({
  // 继承 BaseInput 的所有 props
  ...BaseInput.props,
  suggestions: Array
})

const inputProps = computed(() => {
  const { suggestions, ...baseProps } = props
  return baseProps
})
</script>
```

#### 自定义验证规则

```javascript
// utils/customValidation.js
export const CustomRules = {
  // 身份证验证
  idCard: (message = '请输入正确的身份证号') => ({
    validator: (value) => {
      const pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      return pattern.test(value)
    },
    message
  }),
  
  // 密码强度验证
  strongPassword: (message = '密码强度不够') => ({
    validator: (value) => {
      // 至少包含大小写字母、数字、特殊字符中的3种
      const patterns = [
        /[a-z]/, /[A-Z]/, /\d/, /[!@#$%^&*]/
      ]
      return patterns.filter(p => p.test(value)).length >= 3
    },
    message
  })
}
```

## 原生属性继承

所有组件都使用了 `v-bind="$attrs"`，确保继承原生标签的所有属性，如：

- `type`、`placeholder`、`readonly`、`required` 等（Input）
- `rows`、`cols`、`wrap` 等（Textarea）
- `name`、`required`、`form` 等（Radio/Checkbox）

## 演示页面

访问 `/form-demo` 路由查看所有组件的实际效果和使用示例。

## 注意事项

1. 所有组件都支持 v-model 双向绑定
2. RadioGroup 和 CheckboxGroup 的 options 必须是数组格式
3. 组件会自动生成唯一的 ID 用于 label 关联
4. 禁用状态会应用到所有子元素
5. 错误状态优先级高于提示信息
6. 表单验证支持深层嵌套和动态数组
7. 所有组件都支持无障碍访问（a11y）

---

更多问题和建议，请查阅源码或联系开发团队。