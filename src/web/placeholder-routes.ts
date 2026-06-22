import type { PlaceholderRoute } from './router';

export const placeholderRoutes: Record<string, PlaceholderRoute> = {
  '/inventory/allocations': { path: '/inventory/allocations', title: 'Allocations', description: 'Review material reserved for active production jobs.', bullets: ['Open allocations', 'Job material commitments', 'Release and adjustment workflows'] },
  '/inventory/roll-measurement': { path: '/inventory/roll-measurement', title: 'Roll Measurement', description: 'Calculate remaining length for roll media using shop-floor measurements.', bullets: ['Manual remaining length', 'Outer diameter and build thickness', 'Roll label preview'] },
  '/jobs': { path: '/jobs', title: 'Jobs', description: 'Track local NuePrint production jobs and material requirements.', action: 'Create Job', actionHref: '/jobs/new', bullets: ['Client name and job number', 'Due date and source', 'Future allocation planning'] },
  '/jobs/new': { path: '/jobs/new', title: 'Create Job', description: 'Create a local production job before allocating material.', bullets: ['Client details', 'Due date', 'Optional external reference'] },
  '/jobs/select-for-allocation': { path: '/jobs/select-for-allocation', title: 'Select Job for Allocation', description: 'Choose a job before reserving available inventory.', bullets: ['Job search', 'Material requirements', 'Allocation readiness'] },
  '/pick-lists': { path: '/pick-lists', title: 'Pick Lists', description: 'Pull job materials by bin, item, roll, or unit label.', action: 'Create Pick List', actionHref: '/pick-lists/new' },
  '/pick-lists/new': { path: '/pick-lists/new', title: 'Create Pick List', description: 'Build a guided pick list from job allocations.', bullets: ['Job selection', 'Bin sequence', 'Label scan confirmation'] },
  '/counts': { path: '/counts', title: 'Counts', description: 'Run cycle counts by bin, item, category, or location.', action: 'Start Count', actionHref: '/counts/new' },
  '/counts/new': { path: '/counts/new', title: 'New Cycle Count', description: 'Count material and record variance reason codes.', bullets: ['Bin count', 'Item count', 'Variance review'] },
  '/reports': { path: '/reports', title: 'Reports', description: 'Operational inventory reporting for shortages, low stock, and movement.', bullets: ['Low stock', 'Shortages', 'Ledger movement'] },
  '/reports/low-stock': { path: '/reports/low-stock', title: 'Low Stock Report', description: 'Review items below reorder thresholds once stock policies are configured.' },
  '/reports/shortages': { path: '/reports/shortages', title: 'Shortages Report', description: 'See jobs missing required material before production starts.' },
  '/machines': { path: '/machines', title: 'Machines', description: 'Prepare work-center visibility for printers, cutters, laminators, and finishing equipment.' },
  '/vendors': { path: '/vendors', title: 'Vendors', description: 'Manage supplier records, vendor SKUs, and purchasing units.' },
  '/settings': { path: '/settings', title: 'Settings', description: 'Configure system preferences for the standalone Gnosis Inventory MVP.' },
  '/settings/system': { path: '/settings/system', title: 'System Settings', description: 'Configure PostgreSQL and local runtime settings.' },
  '/settings/system-health': { path: '/settings/system-health', title: 'System Health', description: 'Review API, database, and runtime readiness.' },
  '/settings/integrations': { path: '/settings/integrations', title: 'Integrations', description: 'Optional adapters live here; core inventory workflows run without them.' },
  '/settings/import': { path: '/settings/import', title: 'Import Starting Inventory', description: 'Prepare a guided import flow for beginning balances and labels.' },
};
