<script setup lang="ts">
defineProps<{ title: string; text: string; action: string; href: string }>();
</script>
<template><div class="card empty-state"><div class="workflow-icon">◎</div><h2>{{ title }}</h2><p>{{ text }}</p><a class="btn primary" :href="href">{{ action }}</a></div></template>
