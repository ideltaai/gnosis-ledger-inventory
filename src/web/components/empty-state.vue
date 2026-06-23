<script setup lang="ts">
import AppLink from './app-link.vue';
defineProps<{ title: string; text: string; action: string; href: string }>();
</script>
<template><div class="card empty-state"><div class="workflow-icon">◎</div><h2>{{ title }}</h2><p>{{ text }}</p><AppLink class="btn primary" :href="href">{{ action }}</AppLink></div></template>
