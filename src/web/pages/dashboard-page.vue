<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AppShell from '../components/app-shell.vue';
import RecentMovementTable from '../components/recent-movement-table.vue';
import ScanModal from '../components/scan-modal.vue';
import SnapshotCard from '../components/snapshot-card.vue';
import StatusCard from '../components/status-card.vue';
import TopBar from '../components/top-bar.vue';
import WorkflowCard from '../components/workflow-card.vue';
import { apiGet } from '../http';

type HealthResponse = { ok: boolean; checks: { database: 'ok' | 'not_configured' } };
const health = ref<HealthResponse | null>(null);
const healthFailed = ref(false);
const scanOpen = ref(false);

const apiStatus = computed(() => healthFailed.value ? {
  value: 'Offline', badge: 'Connection Issue', tone: 'danger' as const,
  text: 'The dashboard could not reach the inventory API.',
} : { value: 'Healthy', badge: 'Online', tone: 'success' as const, text: 'The inventory API is responding.' });
const databaseStatus = computed(() => health.value?.checks.database === 'ok' ? {
  value: 'Connected', badge: 'Live', tone: 'success' as const, text: 'Inventory data is being persisted.',
} : { value: 'Not Configured', badge: 'Setup Needed', tone: 'warning' as const, text: 'Connect PostgreSQL to enable persisted inventory workflows.' });

const workflows = [
  ['Receive Material', 'Check in rolls, paper, rigid sheets, apparel, inks, and consumables.', 'Start Receiving', '/receiving/new', '⇩', 'Scan vendor barcode or search SKU'],
  ['Scan Barcode', 'Lookup an item, bin, roll unit, vendor barcode, or job label.', 'Scan Now', '', '▥', ''],
  ['Allocate to Job', 'Reserve available material for a client job before production starts.', 'Allocate Inventory', '/jobs/select-for-allocation', '⬡', 'Available after jobs are created.'],
  ['Create Pick List', 'Pull job materials by bin, item, roll, or unit label.', 'Create Pick List', '/pick-lists/new', '☑', 'Requires an active job or allocation.'],
  ['Measure Roll', 'Enter roll build thickness or outer diameter to calculate remaining length.', 'Measure Roll', '/inventory/roll-measurement', '◎', 'Uses thickness + core diameter'],
  ['Cycle Count', 'Count a bin, category, item, or location and record variances.', 'Start Count', '/counts/new', '#', ''],
] as const;

onMounted(async () => {
  try { health.value = await apiGet<HealthResponse>('/api/health'); } catch { healthFailed.value = true; }
});
</script>

<template>
  <AppShell>
    <TopBar @scan="scanOpen = true" />
    <section class="status-grid">
      <StatusCard title="API Status" :value="apiStatus.value" :badge="apiStatus.badge" :tone="apiStatus.tone" :text="apiStatus.text" action="View Health" href="/settings/system-health" icon="⌁" />
      <StatusCard title="Database" :value="databaseStatus.value" :badge="databaseStatus.badge" :tone="databaseStatus.tone" :text="databaseStatus.text" action="Configure Database" href="/settings/system" icon="◉" />
      <StatusCard title="Inventory Health" value="Ready for Setup" badge="Setup" tone="info" text="Seed items, bins, vendors, and categories to begin tracking." action="View Inventory" href="/inventory" icon="⬡" />
      <StatusCard title="Integrations" value="Optional" badge="Jira Disabled" tone="warning" text="Core workflows run without external integrations." action="Manage Integrations" href="/settings/integrations" icon="⌘" />
    </section>

    <section class="dashboard-section">
      <div class="section-heading"><div><h2>Shop Floor Workflows</h2><p>Fast actions for receiving, picking, counting, and tracking material.</p></div></div>
      <div class="workflow-grid">
        <WorkflowCard v-for="item in workflows" :key="item[0]" :title="item[0]" :description="item[1]" :button="item[2]" :href="item[3] || undefined" :icon="item[4]" :note="item[5]" @action="scanOpen = true" />
      </div>
    </section>

    <section class="dashboard-section">
      <div class="section-heading"><h2>Today’s Inventory Snapshot</h2></div>
      <div class="snapshot-grid">
        <SnapshotCard label="Low Stock" :value="0" text="Items below reorder point" href="/reports/low-stock" icon="↘" tone="magenta" />
        <SnapshotCard label="Open Shortages" :value="0" text="Jobs missing required materials" href="/reports/shortages" icon="!" tone="yellow" />
        <SnapshotCard label="Active Allocations" :value="0" text="Materials reserved to jobs" href="/inventory/allocations" icon="⬡" tone="cyan" />
        <SnapshotCard label="Pick Lists" :value="0" text="Pick lists waiting to be pulled" href="/pick-lists" icon="☷" tone="neutral" />
      </div>
    </section>

    <RecentMovementTable />
    <ScanModal :open="scanOpen" @close="scanOpen = false" />
  </AppShell>
</template>
