<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AppShell from '../components/app-shell.vue';
import LabelPreviewModal from '../components/label-preview-modal.vue';
import PageHeader from '../components/page-header.vue';
import { listItems, type Item } from '../api/inventory-api';
import { listBins, listLocations, type Bin, type Location } from '../api/locations-api';
import { receiveInventory } from '../api/receiving-api';

const organizationId = ref(localStorage.getItem('organizationId') ?? '');
const items = ref<Item[]>([]);
const locations = ref<Location[]>([]);
const bins = ref<Bin[]>([]);
const savedUnitCode = ref('');
const selectedItem = ref<Item | null>(null);
const form = ref({ itemId: new URLSearchParams(location.search).get('itemId') ?? '', locationId: '', binId: '', vendor: '', quantity: 1, unitCost: 0, reference: '' });
async function loadItems() { if (organizationId.value) items.value = await listItems(organizationId.value); selectedItem.value = items.value.find((item) => item.id === form.value.itemId) ?? null; }
async function loadLocations() { if (organizationId.value) locations.value = await listLocations(organizationId.value); }
async function loadBins() { if (form.value.locationId) bins.value = await listBins(form.value.locationId); }
async function saveReceipt(preview: boolean) {
  localStorage.setItem('organizationId', organizationId.value);
  const receipt = await receiveInventory({ organizationId: organizationId.value, itemId: form.value.itemId, binId: form.value.binId, quantity: form.value.quantity, reference: form.value.reference || form.value.vendor });
  selectedItem.value = items.value.find((item) => item.id === form.value.itemId) ?? null;
  savedUnitCode.value = preview ? receipt.unitId : '';
}
onMounted(() => { void loadItems(); void loadLocations(); });
</script>

<template>
  <AppShell><PageHeader title="Quick Receive" subtitle="Receive material into a real location and bin using the persisted API." />
    <section v-if="savedUnitCode" class="card success-state"><h2>Receipt saved</h2><p>Inventory availability now reflects the received quantity.</p><button class="btn primary" type="button" @click="savedUnitCode = savedUnitCode">Label Preview Open</button><a class="btn secondary" href="/receiving/new">Receive Another Item</a><a class="btn secondary" href="/inventory">View Inventory</a></section>
    <form class="card form-card" @submit.prevent="saveReceipt(false)"><label>Organization ID<input v-model="organizationId" required @blur="loadItems(); loadLocations()" /></label><label>Item<select v-model="form.itemId" required @change="selectedItem = items.find((item) => item.id === form.itemId) ?? null"><option value="">Select item</option><option v-for="item in items" :key="item.id" :value="item.id">{{ item.sku }} — {{ item.name }}</option></select></label><label>Location<select v-model="form.locationId" required @change="loadBins"><option value="">Select location</option><option v-for="loc in locations" :key="loc.id" :value="loc.id">{{ loc.name }}</option></select></label><label>Bin<select v-model="form.binId" required><option value="">Select bin</option><option v-for="bin in bins" :key="bin.id" :value="bin.id">{{ bin.code }}</option></select></label><label>Vendor<input v-model="form.vendor" placeholder="Vendor or PO" /></label><label>Quantity<input v-model.number="form.quantity" type="number" min="0.0001" step="0.0001" required /></label><label>Unit cost<input v-model.number="form.unitCost" type="number" min="0" step="0.01" /></label><label>Reference<input v-model="form.reference" placeholder="PO, packing slip, or note" /></label><button class="btn primary" type="submit">Save Receipt</button><button class="btn secondary" type="button" @click="saveReceipt(true)">Save & Preview Label</button></form>
    <LabelPreviewModal :open="!!savedUnitCode" kind="unit" :title="selectedItem?.name ?? 'Received Unit'" :code="savedUnitCode" :subtitle="selectedItem?.sku ?? 'Inventory unit'" @close="savedUnitCode = ''" />
  </AppShell>
</template>
