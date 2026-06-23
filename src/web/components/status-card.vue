<script setup lang="ts">
import AppLink from './app-link.vue';
import StatusBadge from './status-badge.vue';
defineProps<{ title: string; value: string; badge: string; tone: 'success' | 'warning' | 'danger' | 'info' | 'neutral'; text: string; action: string; href: string; icon: string }>();
</script>

<template>
  <article class="card status-card" :class="tone">
    <div class="card-cross" />
    <div class="status-icon">{{ icon }}</div>
    <div><h3>{{ title }}</h3><strong>{{ value }}</strong><StatusBadge :tone="tone" :label="badge" /><p>{{ text }}</p></div>
    <AppLink class="card-link" :href="href">{{ action }} <span>›</span></AppLink>
  </article>
</template>
