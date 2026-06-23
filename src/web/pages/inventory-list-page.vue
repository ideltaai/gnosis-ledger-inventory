<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AppShell from '../components/app-shell.vue';
import EmptyState from '../components/empty-state.vue';
import LabelPreviewModal from '../components/label-preview-modal.vue';
import PageHeader from '../components/page-header.vue';
import { availability, listItems, type Item } from '../api/inventory-api';

const organizationId = ref(localStorage.getItem('organizationId') ?? '');
const search = ref('');
const items = ref<Item[]>([]);
const status = ref('Enter an organization id, then load inventory.');
const labelItem = ref<Item | null>(null);
const availabilityByItem = ref<Record<string, number>>({});

async function loadItems() {
  localStorage.setItem('organizationId', organizationId.value);
  items.value = await listItems(organizationId.value, search.value);
  status.value = items.value.length ? 'Inventory loaded from PostgreSQL-backed API.' : 'No items found.';
  for (const item of items.value) availability(item.id).then((row) => { availabilityByItem.value[item.id] = row.available; }).catch(() => undefined);
}
onMounted(() => { if (organizationId.value) void loadItems(); });
</script>

<template>
  <AppShell><PageHeader title="Inventory" subtitle="Search material, review availability, and start receiving."><a class="btn primary" href="/inventory/new">Add Item</a></PageHeader>
    <section class="card form-card"><label>Organization ID<input v-model="organizationId" placeholder="Seeded organization UUID" /></label><label>Search SKU or name<input v-model="search" placeholder="vinyl, ink, apparel" @keyup.enter="loadItems" /></label><button class="btn primary" type="button" @click="loadItems">Load Inventory</button></section>
    <EmptyState v-if="!items.length" title="No inventory items loaded" :text="status" action="Create First Item" href="/inventory/new" />
    <section v-else class="card table-wrap"><table><thead><tr><th>SKU</th><th>Item</th><th>Tracking</th><th>Status</th><th>Available</th><th>Actions</th></tr></thead><tbody><tr v-for="item in items" :key="item.id"><td>{{ item.sku }}</td><td>{{ item.name }}</td><td>{{ item.tracking_mode }}</td><td>{{ item.active === false ? 'Inactive' : 'Active' }}</td><td>{{ availabilityByItem[item.id] ?? '—' }}</td><td><a class="table-action" :href="`/receiving/new?itemId=${item.id}`">Receive</a><button class="table-action" type="button" @click="labelItem = item">Print Label</button></td></tr></tbody></table></section>
    <LabelPreviewModal :open="!!labelItem" kind="item" :title="labelItem?.name ?? ''" :code="labelItem?.sku ?? ''" subtitle="Inventory item label" @close="labelItem = null" />
  </AppShell>
</template>
