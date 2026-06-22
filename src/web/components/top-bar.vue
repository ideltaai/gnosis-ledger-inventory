<script setup lang="ts">
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
      <a class="btn primary" href="/receiving/new">⇩ Quick Receive</a>
      <a class="btn magenta" href="/jobs/new">⊕ Create Job</a>
    </div>
  </header>
</template>
