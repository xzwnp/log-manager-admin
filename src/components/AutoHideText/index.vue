<template>
  <div class="container">
    <div v-if="props.text.length > props.autoHideThreshold && hideOverflow">
      <p v-html="props.text.substring(0,props.autoHideThreshold)"></p>
      <el-button type="text" v-if="props.text.length > props.autoHideThreshold" @click="hideOverflow = false">展开
      </el-button>
    </div>
    <div v-else>
      <p v-html="props.text"></p>
      <el-button type="text" v-if="props.text.length > props.autoHideThreshold" @click="hideOverflow=true">折叠
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';

const props = defineProps({
  text: String,
  autoHideThreshold: {
    type: Number,
    default: 300,
  },
})
const hideOverflow = ref(true)
</script>
<style scoped lang="scss">

</style>
