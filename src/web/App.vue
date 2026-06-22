<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { apiGet } from './http';

type HealthResponse = { ok: boolean; checks: { database: string } };

const status = ref('Checking API health...');

onMounted(async () => {
  try {
    const health = await apiGet<HealthResponse>('/api/health');
    status.value = health.ok ? `API healthy; database ${health.checks.database}.` : 'API unavailable.';
  } catch {
    status.value = 'API unavailable in this environment.';
  }
});
</script>

<template>
  <main class="shell">
    <h1>Gnosis Ledger Inventory</h1>
    <p>Standalone inventory ledger foundation.</p>
    <p class="status">{{ status }}</p>
  </main>
</template>

<style scoped>
.shell {
  max-width: 64rem;
  margin: 4rem auto;
  padding: 2rem;
  font-family: Inter, system-ui, sans-serif;
}

.status {
  padding: 1rem;
  border: 1px solid #d8dee9;
  border-radius: 0.75rem;
}
</style>
