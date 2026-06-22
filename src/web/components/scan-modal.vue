<script setup lang="ts">
import { ref } from 'vue';
defineProps<{ open: boolean }>();
defineEmits<{ close: [] }>();
const code = ref('');
const result = ref<'item' | 'bin' | 'unknown' | null>(null);
function lookup() { result.value = code.value.toLowerCase().includes('bin') ? 'bin' : code.value ? 'unknown' : null; }
</script>

<template>
  <div v-if="open" class="modal-backdrop" role="dialog" aria-modal="true">
    <div class="scan-modal card">
      <h2>Scan or Enter Code</h2><p>Scan a barcode/QR code or type a code manually.</p>
      <input v-model="code" placeholder="Scan item, roll, bin, vendor barcode, or job label" @keyup.enter="lookup" />
      <div class="modal-actions"><button class="btn primary" type="button" @click="lookup">Lookup</button><button class="btn secondary" type="button" @click="$emit('close')">Cancel</button></div>
      <div v-if="result" class="scan-result"><h3>{{ result === 'bin' ? 'Bin Found' : result === 'item' ? 'Item Found' : 'Unknown Barcode' }}</h3><p v-if="result === 'unknown'">This code is not mapped yet.</p>
        <div class="result-actions"><a v-if="result === 'unknown'" href="/inventory/barcodes/map">Map to Existing Item</a><a v-if="result === 'unknown'" href="/inventory/items/new">Create New Item</a><a v-if="result === 'bin'" href="/locations/bins">View Bin</a><a v-if="result === 'bin'" href="/counts/new">Start Count</a></div></div>
    </div>
  </div>
</template>
