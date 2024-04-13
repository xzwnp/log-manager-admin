<template>
  <div>
    <el-form :model="form" label-width="100px" :rules="passwordRules" ref="ruleFormRef">
      <el-form-item label="原密码" style="width: 400px" prop="originalPassword">
        <el-input type="password" show-password v-model="form.originalPassword" />
      </el-form-item>
      <el-form-item label="新密码" style="width: 400px" prop="newPassword">
        <el-input type="password" show-password v-model="form.newPassword" />
      </el-form-item>
      <el-form-item label="确认密码" style="width: 400px" prop="confirmPassword">
        <el-input type="password" show-password v-model="form.confirmPassword" />
      </el-form-item>
      <el-form-item>
        <span style="width: 70px"></span>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          提交
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { changePassword } from "@/api/user";
import { REGEXP_PWD } from "@/views/login/utils/rule";

const form = reactive({
  originalPassword: null,
  newPassword: null,
  confirmPassword: null
});


const ruleFormRef = ref<FormInstance>();

const passwordRules = reactive({
  originalPassword: [
    { required: true, message: "请输入原密码", trigger: "blur" }
  ],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入新密码"));
        } else if (!REGEXP_PWD.test(value)) {
          callback(
            new Error("密码格式应为8-18位数字、字母、符号的任意两种组合")
          );
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  confirmPassword: [
    { required: true, message: "请再次输入新密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入新密码"));
        } else if (!REGEXP_PWD.test(value)) {
          callback(
            new Error("密码格式应为8-18位数字、字母、符号的任意两种组合")
          );
        } else {
          callback();
        }
      },
      trigger: "blur"
    },
    {
      validator: (rule, value, callback) => {
        if (value !== form.newPassword) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      }, trigger: "blur"
    }
  ]
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  console.log(formEl);
  await formEl.validate((valid, fields) => {
    if (valid) {
      changePassword(form).then(res => {
        ElMessage.success("修改成功!");
      });
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
<style scoped lang="scss">

</style>
