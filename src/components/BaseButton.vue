<template>
  <button
    :class="buttonClasses"
    :type="type"
    @click="$emit('click')"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'BaseButton',
  props: {
    type: {
      type: String,
      default: 'button',
    },
    variant: {
      type: String,
      default: 'primary',
    },
    size: {
      type: String,
      default: 'medium',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const buttonClasses = computed(() => [
      'base-button',
      `btn-${props.variant}`,
      `btn-${props.size}`,
      { 'btn-disabled': props.disabled },
    ]);

    return {
      buttonClasses,
    };
  },
});
</script>

<style scoped>
.base-button {
  @apply px-4 py-2 rounded focus:outline-none transition duration-200;
}

.btn-primary {
  @apply bg-blue-500 text-white;
}

.btn-secondary {
  @apply bg-gray-500 text-white;
}

.btn-medium {
  @apply text-base;
}

.btn-small {
  @apply text-sm;
}

.btn-disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>