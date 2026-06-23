<script setup lang="ts">
import SidebarNav from './sidebar-nav.vue';
</script>

<template>
  <div class="app-shell">
    <SidebarNav />
    <main class="app-main">
      <slot />
    </main>
  </div>
</template>
