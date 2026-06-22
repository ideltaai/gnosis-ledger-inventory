<script setup lang="ts">
import AppShell from '../components/app-shell.vue';
import PageHeader from '../components/page-header.vue';
import { navigateTo, type PlaceholderRoute } from '../router';

defineProps<{ route: PlaceholderRoute }>();
</script>

<template>
  <AppShell>
    <PageHeader :title="route.title" :subtitle="route.description"><span class="status-badge info">Coming Next</span></PageHeader>
    <section class="card placeholder-panel">
      <div class="workflow-icon">◎</div><h2>{{ route.title }}</h2><p>{{ route.description }}</p>
      <ul><li v-for="bullet in route.bullets" :key="bullet">{{ bullet }}</li></ul>
      <div class="modal-actions"><button class="btn primary" type="button" @click="navigateTo(route.actionHref ?? '/dashboard')">{{ route.action }}</button><button class="btn secondary" type="button" @click="navigateTo('/dashboard')">Dashboard</button></div>
    </section>
  </AppShell>
</template>
