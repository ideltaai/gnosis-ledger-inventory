<script setup lang="ts">
defineProps<{ tone: 'success' | 'warning' | 'danger' | 'info' | 'neutral'; label: string }>();
</script>

<template><span class="status-badge" :class="tone">{{ label }}</span></template>
