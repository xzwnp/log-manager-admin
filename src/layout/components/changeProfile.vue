<template>
  <div>
    <el-form :model="form" label-width="100px" :rules="formRules" ref="ruleFormRef">
      <el-form-item label="姓名" style="width: 400px" prop="nickname">
        <el-input v-model="form.nickname" />
      </el-form-item>
      <el-form-item label="手机号" style="width: 400px" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="邮箱" style="width: 400px" prop="email">
        <el-input v-model="form.email" />
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
import { editUserProfile } from "@/api/user";
import { EMAIL_REGEX, PHONE_NUMBER_REGEX, REGEXP_PWD } from "@/views/login/utils/rule";

const form = reactive({
  nickname: null,
  phone: null,
  email: null
});


const ruleFormRef = ref<FormInstance>();

const formRules = reactive({
  nickname: [
    { required: true, message: "请输入姓名", trigger: "blur" }
  ],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入手机号"));
        } else if (!PHONE_NUMBER_REGEX.test(value)) {
          callback(
            new Error("手机号格式不正确")
          );
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入邮箱"));
        } else if (!EMAIL_REGEX.test(value)) {
          callback(
            new Error("邮箱格式不正确")
          );
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      editUserProfile(form).then(res => {
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
