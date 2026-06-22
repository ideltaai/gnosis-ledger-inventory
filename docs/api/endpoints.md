# Inventory Domain API Endpoints

All write endpoints validate JSON with Zod and persist to PostgreSQL. Mutable domain writes also write audit metadata when appropriate.

## Health

```bash
curl http://localhost:4317/api/health
```

## Categories

```bash
curl 'http://localhost:4317/api/categories?organizationId=<org-uuid>'
curl -X POST http://localhost:4317/api/categories -H 'content-type: application/json' \
  -d '{"organizationId":"<org-uuid>","name":"Roll Media","categoryType":"roll_media"}'
curl -X PATCH http://localhost:4317/api/categories/<category-uuid> -H 'content-type: application/json' \
  -d '{"name":"Rigid Substrates"}'
curl -X DELETE http://localhost:4317/api/categories/<category-uuid>
```

## Items

```bash
curl 'http://localhost:4317/api/items?organizationId=<org-uuid>&search=vinyl'
curl http://localhost:4317/api/items/<item-uuid>
curl -X POST http://localhost:4317/api/items -H 'content-type: application/json' \
  -d '{"organizationId":"<org-uuid>","sku":"RM-001","name":"54in Vinyl","trackingMode":"unit-tracked","attributes":{"width":"54in"}}'
curl -X PATCH http://localhost:4317/api/items/<item-uuid> -H 'content-type: application/json' \
  -d '{"active":false}'
```

## Vendors and pricing

```bash
curl 'http://localhost:4317/api/vendors?organizationId=<org-uuid>'
curl -X POST http://localhost:4317/api/vendors -H 'content-type: application/json' \
  -d '{"organizationId":"<org-uuid>","name":"Grimco"}'
curl -X POST http://localhost:4317/api/item-vendor-pricing -H 'content-type: application/json' \
  -d '{"itemId":"<item-uuid>","vendorId":"<vendor-uuid>","unitCost":185,"preferred":true,"vendorSku":"GR-54","purchaseUnit":"roll"}'
```

## Locations and bins

```bash
curl 'http://localhost:4317/api/locations?organizationId=<org-uuid>'
curl -X POST http://localhost:4317/api/locations -H 'content-type: application/json' \
  -d '{"organizationId":"<org-uuid>","name":"Main Warehouse"}'
curl 'http://localhost:4317/api/bins?locationId=<location-uuid>'
curl 'http://localhost:4317/api/bins/generate-code?locationId=<location-uuid>'
curl 'http://localhost:4317/api/bins/lookup?code=BIN-001'
```

## Barcode mapping and lookup

```bash
curl -X POST http://localhost:4317/api/barcodes -H 'content-type: application/json' \
  -d '{"organizationId":"<org-uuid>","barcode":"12345","priority":"vendor_barcode","itemId":"<item-uuid>"}'
curl 'http://localhost:4317/api/barcodes/lookup?barcode=12345'
```

Unknown barcode lookup returns `{ "known": false, "mappingRequired": true }` shape for the mapping flow.

## Receiving and allocation

```bash
curl -X POST http://localhost:4317/api/receiving -H 'content-type: application/json' \
  -d '{"organizationId":"<org-uuid>","itemId":"<item-uuid>","binId":"<bin-uuid>","quantity":10}'
curl -X POST http://localhost:4317/api/allocations -H 'content-type: application/json' \
  -d '{"organizationId":"<org-uuid>","itemId":"<item-uuid>","binId":"<bin-uuid>","quantity":4}'
```

## Jobs

```bash
curl 'http://localhost:4317/api/jobs?organizationId=<org-uuid>'
curl -X POST http://localhost:4317/api/jobs -H 'content-type: application/json' \
  -d '{"organizationId":"<org-uuid>","jobNumber":"JOB-1001","name":"Lobby Signage","clientName":"Acme","dueDate":"2026-07-15"}'
```

## Availability

```bash
curl 'http://localhost:4317/api/inventory/availability?itemId=<item-uuid>&binId=<bin-uuid>'
```

## Reason codes and roll measurements

```bash
curl 'http://localhost:4317/api/reason-codes?organizationId=<org-uuid>'
curl -X POST http://localhost:4317/api/reason-codes -H 'content-type: application/json' \
  -d '{"organizationId":"<org-uuid>","code":"scrap","label":"Scrap","category":"scrap"}'
curl -X POST http://localhost:4317/api/roll-measurements -H 'content-type: application/json' \
  -d '{"organizationId":"<org-uuid>","inventoryUnitId":"<unit-uuid>","itemId":"<item-uuid>","binId":"<bin-uuid>","manualRemainingLength":42}'
```
