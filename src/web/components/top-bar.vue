<script setup lang="ts">
import AppLink from './app-link.vue';
defineEmits<{ scan: [] }>();
</script>

<template>
  <header class="top-bar">
    <div>
      <h1>Dashboard</h1>
      <p>Shop-floor inventory status for NuePrint</p>
    </div>
    <div class="top-actions">
      <button class="btn secondary" type="button" @click="$emit('scan')">▦ Scan</button>
      <AppLink class="btn primary" href="/receiving/new">⇩ Quick Receive</AppLink>
      <AppLink class="btn magenta" href="/jobs/new">⊕ Create Job</AppLink>
    </div>
  </header>
</template>
