<script setup lang="ts">
defineProps<{ open: boolean; kind: 'item' | 'bin' | 'unit'; title: string; code: string; subtitle: string }>();
defineEmits<{ close: [] }>();
function printLabel() { window.print(); }
</script>

<template>
  <div v-if="open" class="modal-backdrop" role="dialog" aria-modal="true">
    <div class="scan-modal card label-modal">
      <h2>{{ kind === 'bin' ? 'Bin Label Preview' : kind === 'unit' ? 'Unit Label Preview' : 'Item Label Preview' }}</h2>
      <div class="print-label">
        <strong>GNOSIS INVENTORY</strong><h3>{{ title }}</h3><p>{{ subtitle }}</p>
        <div class="barcode-visual"><span v-for="n in 18" :key="n" :style="{ height: `${24 + (n % 5) * 9}px` }" /></div>
        <b>{{ code }}</b><small>{{ new Date().toLocaleDateString() }}</small>
      </div>
      <div class="modal-actions"><button class="btn primary" type="button" @click="printLabel">Print Label</button><button class="btn secondary" type="button" @click="$emit('close')">Close</button></div>
    </div>
  </div>
</template>
