# NOTES

Concise implementation notes for the Vue + PrimeVue Ideas app.

---

## Overview
Small internal tool to **submit**, **browse/manage**, and **visualize** ideas/feedback. Emphasis on clear UX, accessibility, and maintainable code. No backend—state is client-side via Pinia.

## Stack
- **Vue 3 + Vite**
- **Pinia** for state
- **Vue Router** with route `meta.title`
- **PrimeVue** UI (DataTable, Dialog, Dropdown, MultiSelect, Chips, Calendar, Slider, Tag, Button, etc.)
- **Chart.js** via `primevue/chart`

## Structure
```
src/
  components/      # NavBar, IdeaForm, IdeaTable
  pages/           # Dashboard, Ideas, Submit, StyleGuide
  router/          # route definitions (Dashboard is home)
  stores/          # useIdeasStore (ideas + derived metrics + demo helpers)
  styles/          # tokens & layout utilities (optional)
  composables/     # small helpers (e.g., useDraft)
```
- **NavBar**: centered menu, active highlighting, mobile hamburger; left label reflects `route.meta.title`.
- **Consistent SFC order**: `<template>` → `<script setup>` → `<style scoped>`.

## Data Model (simplified)
```ts
Idea = {
  id: string
  title: string
  description: string
  category: string | null
  tags: string[]
  personas: string[]
  impact: number          // 1–10
  reach: number
  targetDate: Date | null
  complexity: 'S'|'M'|'L' | null
  dependencies: string[]
  repo: string
  privacy: 'public' | 'private'
  requester: string
  email: string
  notify: boolean
  consent: boolean
  status: 'new'|'triaged'|'in-progress'|'done'|'archived'
  votes: number
  createdAt: string | Date
}
```

## Key Features
### Submit/Edit (IdeaForm.vue)
- One component for **create/edit** via `mode` + optional `initial`.
- **Validation**: title, description, requester, email, consent (+ basic email/URL checks).
- **Drafts** in `localStorage`:
  - Keys: `submitIdeaDraft:new` and `submitIdeaDraft:edit:<id>`.
  - Actions: **Save Draft**, **Clear** (create → blank, edit → original snapshot).
- **Target Date** supports typing (`manualInput`) and picker; blur won’t clear a chosen date.

### Ideas List (IdeaTable.vue)
- Filters: global search (title/description/tags), **Category**, **Status**.
- **Column chooser** (keep same option object refs to ensure chip selection works).
- **Edit** dialog pre-fills; **Delete** confirm; **Vote** with simple “already voted” guard.
- Helpful empty state; chips for tags; search icon aligned via scoped CSS.

### Dashboard (Dashboard.vue)
- KPIs: **Total**, **New this month**, **Top idea**, **By status** (tags).
- Charts: **Line** (ideas per month) and **Donut** (status breakdown).
- Demo data controls: add/reset to exercise visuals quickly.

### Navigation (NavBar.vue)
- Centered desktop nav, mobile **hamburger** overlay.
- Left label = `route.meta.title` (Dashboard/Ideas/Submit/Style).
- Theme toggle slot supported.

## Styling
- PrimeVue theme baseline; small scoped CSS for layout/spacing.
- Optional shared utilities: `styles/tokens.css` (spacing, radii, shadows) and `styles/layout.css` (section card rhythm, toolbar grid, table cell spacing).

## Tradeoffs & Known Limits
- Client-only app; “Notifications” switch is **UI only** (no email).
- Client-side filtering/pagination; not suited for very large datasets.
- Voting is optimistic and naive (no auth/security).
- Minimal validation; server should mirror and enforce in a real app.

## How to Run
```bash
# install
npm install

# dev
npm run dev

# build
npm run build
npm run preview
```

## Future Work
- Backend (auth, persistence, server-side validation).
- Server-side pagination/filtering + aggregation endpoints for charts.
- Saved filter views, bulk actions, export.
- Tests: store unit tests, form validation tests, E2E for submit/edit/filter/vote.
