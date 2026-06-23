<script setup lang="ts">
import { ref } from 'vue';
import AppShell from '../components/app-shell.vue';
import EmptyState from '../components/empty-state.vue';
import LabelPreviewModal from '../components/label-preview-modal.vue';
import PageHeader from '../components/page-header.vue';
import { createBin, createLocation, listBins, listLocations, type Bin, type Location } from '../api/locations-api';

const organizationId = ref(localStorage.getItem('organizationId') ?? '');
const locations = ref<Location[]>([]);
const bins = ref<Bin[]>([]);
const newLocation = ref('');
const selectedLocation = ref('');
const newBin = ref('');
const labelBin = ref<Bin | null>(null);
async function load() { localStorage.setItem('organizationId', organizationId.value); locations.value = await listLocations(organizationId.value); }
async function loadLocationBins() { bins.value = selectedLocation.value ? await listBins(selectedLocation.value) : []; }
async function addLocation() { await createLocation(organizationId.value, newLocation.value); newLocation.value = ''; await load(); }
async function addBin() { const bin = await createBin(selectedLocation.value, newBin.value || undefined); newBin.value = ''; await loadLocationBins(); labelBin.value = bin; }
</script>

<template><AppShell><PageHeader title="Locations & Bins" subtitle="Manage the shop-floor map used for receiving, labels, and cycle counts." />
  <section class="card form-card"><label>Organization ID<input v-model="organizationId" required /></label><button class="btn primary" type="button" @click="load">Load Locations</button><label>Add Location<input v-model="newLocation" placeholder="Main Warehouse" /></label><button class="btn secondary" type="button" @click="addLocation">Add Location</button></section>
  <EmptyState v-if="!locations.length" title="No locations loaded" text="Load or create a location before adding bins." action="Load Locations" href="/locations" />
  <section v-else class="card form-card"><label>Location<select v-model="selectedLocation" @change="loadLocationBins"><option value="">Select location</option><option v-for="loc in locations" :key="loc.id" :value="loc.id">{{ loc.name }}</option></select></label><label>Add Bin Code<input v-model="newBin" placeholder="Leave blank to generate" /></label><button class="btn primary" type="button" @click="addBin">Add Bin</button></section>
  <section v-if="bins.length" class="card table-wrap"><table><thead><tr><th>Bin Code</th><th>Status</th><th>Actions</th></tr></thead><tbody><tr v-for="bin in bins" :key="bin.id"><td>{{ bin.code }}</td><td>{{ bin.active === false ? 'Inactive' : 'Active' }}</td><td><button class="table-action" type="button" @click="labelBin = bin">Print Bin Label</button></td></tr></tbody></table></section>
  <LabelPreviewModal :open="!!labelBin" kind="bin" :title="labelBin?.code ?? ''" :code="labelBin?.code ?? ''" subtitle="Location bin label" @close="labelBin = null" />
</AppShell></template>
