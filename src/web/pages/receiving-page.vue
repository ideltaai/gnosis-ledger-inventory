<script setup lang="ts">
import AppShell from '../components/app-shell.vue';
import EmptyState from '../components/empty-state.vue';
import PageHeader from '../components/page-header.vue';
</script>
<template><AppShell><PageHeader title="Receiving" subtitle="Start a guided receiving session for rolls, bins, apparel, inks, and consumables."><a class="btn primary" href="/receiving/new">New Receiving Session</a></PageHeader><EmptyState title="No recent receipts loaded" text="Receive material to start building persisted inventory history." action="Start Receiving" href="/receiving/new" /></AppShell></template>
