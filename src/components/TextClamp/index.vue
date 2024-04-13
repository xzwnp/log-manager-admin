<template>
  <div class="text-clamp">
    <p v-text="clampedText"></p>
    <button v-if="isOverflowed" @click="toggleClamp">
      {{ isClamped ? "展开" : "收起" }}
    </button>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";

export default {
  props: {
    text: String,
    maxLines: {
      type: Number,
      default: 3 // 默认显示3行
    }
  },
  setup(props) {
    const isClamped = ref(true);
    const clampedText = ref(props.text);

    const isOverflowed = computed(() => {
      const element = document.createElement("div");
      element.style.overflow = "hidden";
      element.style.position = "absolute";
      element.style.width = "100%";
      element.style.whiteSpace = "pre-wrap";
      element.style.wordWrap = "break-word";
      element.style.maxHeight = `${props.maxLines * 1.5}em`; // 1.5em per line
      element.textContent = props.text;
      document.body.appendChild(element);
      const overflowed = element.scrollHeight > element.clientHeight;
      document.body.removeChild(element);
      return overflowed;
    });

    watch(isClamped, () => {
      clampedText.value = isClamped.value ? "123" : props.text;
    });

    const toggleClamp = () => {
      isClamped.value = !isClamped.value;
    };

    return {
      isClamped,
      clampedText,
      isOverflowed,
      toggleClamp
    };
  }
};
</script>

<style scoped>
.text-clamp {
  position: relative;
}
</style>
