<template>
  <div class="page-shell">
    <h2 class="mb-3">Dashboard</h2>

    <!-- KPIs -->
    <div class="grid kpi-grid">
      <div class="col-12 md:col-3 kpi-col">
        <Card class="kpi-card">
          <template #content>
            <div class="kpi">
              <div class="kpi-icon primary"><i class="pi pi-list"></i></div>
              <div class="kpi-body">
                <div class="kpi-label">Total ideas</div>
                <div class="kpi-value">{{ store.total }}</div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-3 kpi-col">
        <Card class="kpi-card">
          <template #content>
            <div class="kpi">
              <div class="kpi-icon accent"><i class="pi pi-calendar-plus"></i></div>
              <div class="kpi-body">
                <div class="kpi-label">New this month</div>
                <div class="kpi-value">
                  {{ thisMonth }}
                  <span v-if="trendPct !== null" :class="['trend', trendPct >= 0 ? 'up' : 'down']">
                    <i :class="['pi', trendPct >= 0 ? 'pi-arrow-up' : 'pi-arrow-down']"></i>
                    {{ Math.abs(trendPct) }}%
                  </span>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-3 kpi-col">
        <Card class="kpi-card">
          <template #content>
            <div class="kpi">
              <div class="kpi-icon green"><i class="pi pi-star"></i></div>
              <div class="kpi-body">
                <div class="kpi-label">Top idea</div>
                <div class="kpi-text ellipsis">{{ store.mostVoted?.title || '—' }}</div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-3 kpi-col">
        <Card class="kpi-card kpi-card--tags">
          <template #content>
            <div class="kpi kpi--tags">
              <div class="kpi-icon blue"><i class="pi pi-tags"></i></div>
              <div class="kpi-body">
                <div class="kpi-label">By status</div>
                <div class="tag-wrap">
                  <Tag v-for="s in store.byStatus" :key="s.status" :value="s.status + ': ' + s.count" />
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Demo data controls -->
    <div class="flex justify-content-end gap-2 mb-2">
      <Button label="Add 20 demo ideas" class="p-button-text" @click="store.demoFill(20, 12)" />
      <Button label="Reset demo data" severity="danger" class="p-button-text" @click="store.demoReset(50)" />
    </div>

    <!-- Charts row -->
    <div class="grid">
      <!-- Ideas per month -->
      <div class="col-12 md:col-8">
        <Card class="section-card">
          <template #title>Ideas per month</template>
          <template #content>
            <p class="section-hint">Last 12 months. Hover points for exact counts.</p>
            <div class="chart-wrap">
              <Chart type="line" :data="chartData" :options="chartOptions" />
            </div>
          </template>
        </Card>
      </div>

      <!-- Status breakdown (NEW) -->
      <div class="col-12 md:col-4">
        <Card class="section-card">
          <template #title>Status breakdown</template>
          <template #content>
            <p class="section-hint">Where ideas live right now.</p>
            <div class="doughnut-wrap">
              <Chart type="doughnut" :data="statusChartData" :options="statusChartOptions" />
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Extras -->
    <div class="grid">
      <div class="col-12 md:col-6">
        <Card class="section-card">
          <template #title>Top tags</template>
          <template #content>
            <p class="section-hint">Most used tags across ideas.</p>
            <div class="flex gap-2 flex-wrap">
              <Tag v-for="t in topTags" :key="t.tag" :value="t.tag + ' · ' + t.count" />
              <span v-if="!topTags.length" class="text-600">No tags yet.</span>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6">
        <Card class="section-card">
          <template #title>Recent ideas</template>
          <template #content>
            <p class="section-hint">Latest submissions.</p>
            <ul class="recent-list">
              <li v-for="i in recentIdeas" :key="i.id">
                <span class="title ellipsis">{{ i.title }}</span>
                <span class="date">{{ formatDate(i.createdAt) }}</span>
              </li>
              <li v-if="!recentIdeas.length" class="text-600">No recent ideas.</li>
            </ul>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useIdeasStore } from '../stores/ideas'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Chart from 'primevue/chart'
import 'chart.js/auto'

const store = useIdeasStore()

/* Helpers */
function monthKey(d) { const dt = new Date(d); return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}` }
function addMonths(date, n) { const d = new Date(date); d.setMonth(d.getMonth()+n); return d }
function formatDate(d) { const dd = new Date(d); return dd.toISOString().slice(0,10) }

/* Last 12 contiguous months */
const last12Labels = computed(() => {
  const now = new Date(), labels = []
  for (let i=11; i>=0; i--) {
    const dt = addMonths(new Date(now.getFullYear(), now.getMonth(), 1), -i)
    labels.push(`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}`)
  }
  return labels
})

/* Counts aligned to labels */
const countsLast12 = computed(() => {
  const map = new Map()
  for (const i of store.ideas) {
    const k = monthKey(i.createdAt)
    map.set(k, (map.get(k) || 0) + 1)
  }
  return last12Labels.value.map(l => map.get(l) || 0)
})

/* KPI trend */
const thisMonth = computed(() => countsLast12.value.at(-1) || 0)
const prevMonth = computed(() => countsLast12.value.at(-2) || 0)
const trendPct = computed(() => (prevMonth.value === 0 ? null : Math.round(((thisMonth.value - prevMonth.value)/prevMonth.value)*100)))

/* Line chart */
const chartData = computed(() => ({
  labels: last12Labels.value,
  datasets: [{
    label: 'Ideas',
    data: countsLast12.value,
    borderColor: '#60A5FA',
    backgroundColor(ctx){
      const { chart } = ctx; const { ctx: c, chartArea } = chart; if (!chartArea) return 'rgba(96,165,250,.25)'
      const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
      g.addColorStop(0,'rgba(96,165,250,.35)'); g.addColorStop(1,'rgba(96,165,250,.05)'); return g
    },
    pointBackgroundColor: '#93c5fd',
    borderWidth: 3, pointRadius: 4, pointHoverRadius: 7, tension: .35, fill: true
  }]
}))
const chartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display:false }, tooltip: { mode:'index', intersect:false } },
  layout: { padding: { left: 12, right: 12, top: 6, bottom: 4 } },
  scales: {
    x: { offset: true, grid: { drawOnChartArea:false }, ticks: { color:'#94a3b8', maxRotation:0, autoSkip:true, maxTicksLimit:12 } },
    y: { beginAtZero: true, ticks: { precision:0 } }
  }
}

/* ---- NEW: Status doughnut ---- */
const statusOrder = ['new', 'triaged', 'in-progress', 'done', 'archived']
const statusColors = {
  new:        '#60A5FA',   // blue
  triaged:    '#94A3B8',   // slate
  'in-progress': '#F59E0B',// amber
  done:       '#10B981',   // emerald
  archived:   '#9CA3AF'    // gray
}
const statusChartData = computed(() => {
  const counts = new Map()
  for (const s of store.byStatus) counts.set(s.status, s.count)
  const labels = statusOrder.filter(s => counts.get(s) > 0 || counts.has(s))
  const data   = labels.map(l => counts.get(l) || 0)
  const colors = labels.map(l => statusColors[l] || '#cbd5e1')
  return {
    labels,
    datasets: [{ data, backgroundColor: colors, borderWidth: 1 }]
  }
})
const statusChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: {
    legend: { position: 'right', labels: { usePointStyle: true } },
    tooltip: {
      callbacks: {
        label(ctx) {
          const total = ctx.dataset.data.reduce((a,b)=>a+b,0) || 1
          const v = ctx.parsed
          const pct = Math.round((v/total)*100)
          return ` ${ctx.label}: ${v} (${pct}%)`
        }
      }
    }
  }
}

/* Top tags & recent */
const topTags = computed(() => {
  const m = new Map()
  for (const i of store.ideas) for (const t of i.tags || []) m.set(t, (m.get(t)||0)+1)
  return [...m.entries()].sort((a,b)=>b[1]-a[1]).slice(0,8).map(([tag,count])=>({tag,count}))
})
const recentIdeas = computed(() => [...store.ideas].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,6))
</script>

<style scoped>
/* Page shell */
.page-shell { max-width: 1120px; margin: 0 auto; padding: 1.25rem 1rem 2rem; }

/* KPI cards */
.kpi-col { display: flex; }
.kpi-card { flex: 1; }
.kpi-card :deep(.p-card-content) { padding: 1rem 1rem; height: 100%; }

.kpi { display: flex; gap: .85rem; align-items: center; height: 100%; }
.kpi--tags { align-items: flex-start; }

.kpi-icon {
  flex: 0 0 44px; width: 44px; height: 44px; border-radius: 12px;
  display: grid; place-items: center; font-size: 1.2rem;
  background: var(--surface-200, #e5e7eb); color: var(--text-color);
}
.kpi-icon.primary { background: rgba(96,165,250,.16); color: #3b82f6; }
.kpi-icon.accent  { background: rgba(251,191,36,.18); color: #f59e0b; }
.kpi-icon.green   { background: rgba(52,211,153,.18); color: #10b981; }
.kpi-icon.blue    { background: rgba(59,130,246,.15); color: #2563eb; }

.kpi-body { min-width: 0; display: flex; flex-direction: column; justify-content: center; }
.kpi-label { font-size: .9rem; color: var(--text-color-secondary); }
.kpi-value { font-size: 1.8rem; font-weight: 700; display: flex; align-items: center; gap: .5rem; }
.kpi-text { font-size: 1rem; font-weight: 600; }

/* Trend pill */
.trend { font-size: .8rem; padding: .2rem .4rem; border-radius: 6px; }
.trend.up   { background: rgba(34,197,94,.15); color: #16a34a; }
.trend.down { background: rgba(244,63,94,.15); color: #e11d48; }

/* Section cards */
.section-card { margin-top: 1rem; margin-bottom: 1rem; }
.section-card :deep(.p-card-content) { padding: 1.2rem 1.2rem 1rem; }
.section-card :deep(.p-card-title) { padding: 1rem 1.2rem 0; }
.section-hint { margin: .35rem 0 1rem; color: var(--text-color-secondary); }

/* Recent list */
.recent-list { list-style: none; padding: 0; margin: 0; }
.recent-list li { display: flex; justify-content: space-between; align-items: center; padding: .5rem 0; border-bottom: 1px dashed var(--surface-border); }
.recent-list li:last-child { border-bottom: 0; }
.recent-list .title { font-weight: 600; }
.recent-list .date { font-size: .85rem; color: var(--text-color-secondary); }

/* Utils */
.ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.text-600 { color: var(--text-color-secondary); }
.tag-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: .1rem .1rem;    
  margin-top: .5rem; 
}

.tag-wrap :deep(.p-tag) {
  padding: .2rem .6rem;
  font-size: .82rem;
  border-radius: 10px;
  border: 1px solid var(--surface-border);
}

</style>
