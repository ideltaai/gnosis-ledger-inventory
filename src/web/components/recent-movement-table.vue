<script setup lang="ts">
const rows = [
  ['May 22, 2025 10:24 AM', 'Received', '3M 8125 Gloss White Vinyl 54in x 150ft', '2 rolls', 'Receiving / R01-A01', 'Dan G.'],
  ['May 22, 2025 09:58 AM', 'Allocated', 'Neenah Classic Crest 100# Cover 26x40', '5 reams', 'Paper / P02-B03', 'Alex R.'],
  ['May 22, 2025 09:32 AM', 'Transferred', 'Sintra White 3mm 48x96', '10 sheets', 'Sheet Goods / S01-C02', 'Maya T.'],
  ['May 22, 2025 09:05 AM', 'Consumed', 'Roland ECO-SOL MAX 2 Cyan 220ml', '1 cartridge', 'Inks / I01-A02', 'Chris M.'],
  ['May 22, 2025 08:41 AM', 'Cycle Counted', 'Gildan 5000 Black L', '24 each', 'Apparel / A03-D01', 'Dan G.'],
];
</script>

<template>
  <section class="movement-section">
    <div class="section-heading"><h2>Recent Inventory Movement</h2><span class="preview-badge">Demo Preview Data ⓘ</span></div>
    <div class="table-wrap card"><table><thead><tr><th>Time</th><th>Action</th><th>Item</th><th>Quantity</th><th>Location / Bin</th><th>User</th></tr></thead>
      <tbody><tr v-for="row in rows" :key="row[0]"><td><span class="dot" />{{ row[0] }} <b>Preview</b></td><td>{{ row[1] }}</td><td>{{ row[2] }}</td><td>{{ row[3] }}</td><td>{{ row[4] }}</td><td>{{ row[5] }}</td></tr></tbody></table>
      <p class="demo-note">ⓘ This is demo preview data for evaluation purposes only.</p></div>
  </section>
</template>
