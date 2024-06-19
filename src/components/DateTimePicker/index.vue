<template>
  <span>
     <el-date-picker
       type="datetimerange"
       :shortcuts="shortcuts"
       range-separator="至"
       start-placeholder="开始时间"
       end-placeholder="结束时间"
       value-format="YYYY-MM-DD HH:mm:ss"
       v-bind="$attrs"
     />
  </span>
</template>

<script lang="ts" setup>

const shortcuts = [
  {
    text: "最近15分钟",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 1000 * 60 * 15);
      return [start, end];
    }
  },
  {
    text: "最近1小时",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 1000 * 60 * 60);
      return [start, end];
    }
  },
  {
    text: "最近3小时",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 1000 * 60 * 60 * 3);
      return [start, end];
    }
  },
  {
    text: "最近1天",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 1000 * 60 * 60 * 24);
      return [start, end];
    }
  },
  {
    text: "最近一周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 1000 * 60 * 60 * 24 * 7);
      return [start, end];
    }
  },
  {
    text: "最近30天",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 1000 * 60 * 60 * 24 * 30);
      return [start, end];
    }
  }
];
</script>
<style scoped>
</style>
