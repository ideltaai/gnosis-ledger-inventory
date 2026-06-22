<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AppShell from '../components/app-shell.vue';
import PageHeader from '../components/page-header.vue';
import { createItem, listCategories, type Category, type Item } from '../api/inventory-api';

const organizationId = ref(localStorage.getItem('organizationId') ?? '');
const categories = ref<Category[]>([]);
const saved = ref<Item | null>(null);
const form = ref({ sku: '', name: '', categoryId: '', trackingMode: 'unit-tracked', reorderPoint: 0, attributes: '{ "width": "", "color": "" }' });
async function loadCategories() { if (organizationId.value) categories.value = await listCategories(organizationId.value); }
async function save() {
  localStorage.setItem('organizationId', organizationId.value);
  saved.value = await createItem({ organizationId: organizationId.value, sku: form.value.sku, name: form.value.name, categoryId: form.value.categoryId || undefined, trackingMode: form.value.trackingMode, attributes: { ...JSON.parse(form.value.attributes || '{}'), reorderPoint: form.value.reorderPoint } });
}
onMounted(loadCategories);
</script>

<template>
  <AppShell><PageHeader title="Create Item" subtitle="Add a print-shop material that can be received and tracked." />
    <section v-if="saved" class="card success-state"><h2>Item saved</h2><p>{{ saved.sku }} — {{ saved.name }}</p><a class="btn primary" href="/inventory">View Inventory</a><a class="btn secondary" :href="`/receiving/new?itemId=${saved.id}`">Receive This Item</a></section>
    <form v-else class="card form-card" @submit.prevent="save"><label>Organization ID<input v-model="organizationId" required @blur="loadCategories" /></label><label>SKU<input v-model="form.sku" required /></label><label>Item name<input v-model="form.name" required /></label><label>Category<select v-model="form.categoryId"><option value="">Uncategorized</option><option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option></select></label><label>Tracking mode<select v-model="form.trackingMode"><option>unit-tracked</option><option>bulk-tracked</option></select></label><label>Reorder point<input v-model.number="form.reorderPoint" type="number" min="0" /></label><label>Attributes JSON<textarea v-model="form.attributes" rows="5" /></label><button class="btn primary" type="submit">Save Item</button></form>
  </AppShell>
</template>
