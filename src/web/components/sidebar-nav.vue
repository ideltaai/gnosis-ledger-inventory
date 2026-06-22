<script setup lang="ts">
import AppLink from './app-link.vue';
import { currentPath } from '../router';
const navItems = [
  ['Dashboard', '/dashboard', '▦'], ['Receiving', '/receiving', '⇩'], ['Inventory', '/inventory', '⬡'],
  ['Locations & Bins', '/locations', '⌖'], ['Jobs', '/jobs', '▣'], ['Pick Lists', '/pick-lists', '☑'],
  ['Counts', '/counts', '#'], ['Reports', '/reports', '▥'], ['Machines', '/machines', '⚙'],
  ['Vendors', '/vendors', '▱'], ['Settings', '/settings', '☷'],
];
</script>

<template>
  <aside class="sidebar">
    <div class="brand-block">
      <div class="brand-row"><span class="cmyk-mark"><i /><i /><i /></span><span>GNOSIS<br><em>INVENTORY</em></span></div>
      <div class="brand-divider" />
      <div class="client-mark"><span class="np-mark">NP</span><strong>NUEPRINT</strong></div>
      <p>NuePrint MVP</p>
    </div>
    <nav class="nav-list" aria-label="Main navigation">
      <AppLink v-for="item in navItems" :key="item[0]" :href="item[1]" class="nav-item" :class="{ active: currentPath === item[1] || (item[1] !== '/dashboard' && currentPath.startsWith(item[1])) }">
        <span>{{ item[2] }}</span>{{ item[0] }}
      </AppLink>
    </nav>
    <footer class="sidebar-footer">
      <div class="user-card"><span class="avatar">DG</span><span><strong>Dan</strong><small>Admin</small></span></div>
      <AppLink class="sign-out" href="/settings">⇲ Sign Out</AppLink>
      <div class="cmyk-footer"><i /><i /><i /><i /></div>
    </footer>
  </aside>
</template>
