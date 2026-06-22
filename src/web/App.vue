<script setup lang="ts">
import { computed } from 'vue';
import DashboardPage from './pages/dashboard-page.vue';
import InventoryListPage from './pages/inventory-list-page.vue';
import ItemCreatePage from './pages/item-create-page.vue';
import LocationsPage from './pages/locations-page.vue';
import ReceivingNewPage from './pages/receiving-new-page.vue';
import ReceivingPage from './pages/receiving-page.vue';
import './styles/dashboard-base.css';
import './styles/dashboard-cards.css';
import './styles/dashboard-responsive.css';

const path = computed(() => window.location.pathname);
</script>

<template>
  <InventoryListPage v-if="path === '/inventory'" />
  <ItemCreatePage v-else-if="path === '/inventory/new'" />
  <ReceivingPage v-else-if="path === '/receiving'" />
  <ReceivingNewPage v-else-if="path === '/receiving/new'" />
  <LocationsPage v-else-if="path === '/locations'" />
  <DashboardPage v-else />
</template>
