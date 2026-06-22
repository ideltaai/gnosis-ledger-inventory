<script setup lang="ts">
defineProps<{ label: string; value: number; text: string; href: string; icon: string; tone: string }>();
</script>

<template>
  <article class="card snapshot-card">
    <span class="snapshot-icon" :class="tone">{{ icon }}</span>
    <div><h3>{{ label }}</h3><strong>{{ value }}</strong><p>{{ text }}</p><a :href="href">View {{ label }} ›</a></div>
  </article>
</template>
