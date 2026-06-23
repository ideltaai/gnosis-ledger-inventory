<script setup lang="ts">
import { navigateTo } from '../router';

defineProps<{ href: string }>();
</script>

<template>
  <a :href="href" @click.prevent="navigateTo(href)"><slot /></a>
</template>
