<script setup lang="ts">
defineProps<{ title: string; description: string; button: string; href?: string; icon: string; note?: string; disabled?: boolean }>();
defineEmits<{ action: [] }>();
</script>

<template>
  <article class="card workflow-card">
    <div class="workflow-icon">{{ icon }}</div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <button v-if="!href" class="btn primary wide" type="button" :disabled="disabled" @click="$emit('action')">{{ button }}</button>
    <a v-else class="btn primary wide" :class="{ disabled }" :href="disabled ? undefined : href">{{ button }}</a>
    <small v-if="note">{{ note }}</small>
  </article>
</template>
