<script setup lang="ts">
import DashboardPage from './pages/dashboard-page.vue';
import InventoryListPage from './pages/inventory-list-page.vue';
import ItemCreatePage from './pages/item-create-page.vue';
import LocationsPage from './pages/locations-page.vue';
import PlaceholderPage from './pages/placeholder-page.vue';
import ReceivingNewPage from './pages/receiving-new-page.vue';
import ReceivingPage from './pages/receiving-page.vue';
import { placeholderRoutes } from './placeholder-routes';
import { currentPath } from './router';
import './styles/dashboard-base.css';
import './styles/dashboard-cards.css';
import './styles/dashboard-responsive.css';
</script>

<template>
  <DashboardPage v-if="currentPath === '/dashboard'" />
  <InventoryListPage v-else-if="currentPath === '/inventory'" />
  <ItemCreatePage v-else-if="currentPath === '/inventory/new'" />
  <ReceivingPage v-else-if="currentPath === '/receiving'" />
  <ReceivingNewPage v-else-if="currentPath === '/receiving/new'" />
  <LocationsPage v-else-if="currentPath === '/locations'" />
  <PlaceholderPage v-else-if="placeholderRoutes[currentPath]" :route="placeholderRoutes[currentPath]" />
  <PlaceholderPage v-else :route="{ path: currentPath, title: 'Workflow Not Found', description: 'This route is not part of the current Gnosis Inventory MVP navigation.', action: 'Back to Dashboard', actionHref: '/dashboard', bullets: ['Use the sidebar navigation', 'Return to Dashboard', 'Continue MVP setup'] }" />
</template>
