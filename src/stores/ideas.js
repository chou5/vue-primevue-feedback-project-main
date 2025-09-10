// src/stores/ideas.js
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

const VOTES_KEY = 'votedIdeaIds'
const SEED_KEY = 'demoSeedV1'

const loadVoted = () => {
  try { return JSON.parse(localStorage.getItem(VOTES_KEY) || '[]') } catch { return [] }
}
const saveVoted = (arr) => localStorage.setItem(VOTES_KEY, JSON.stringify(arr))

// ---------------- Demo data helpers ----------------
const categories = ['UX', 'Platform', 'Ops', 'Growth', 'Other']
const personasAll = ['PM', 'Dev', 'Designer', 'Analyst', 'CS', 'Sales']
const statuses = ['new', 'triaged', 'in-progress', 'done', 'archived']
const titles = [
  'Inline tag editor', 'Bulk export CSV', 'Dark mode polish', 'Funnel analytics',
  'One-click triage', 'Duplicate detector', 'Keyboard shortcuts', 'Slack webhook',
  'Guided tour', 'Perf budget alerts', 'A11y audit', 'Segmented control',
  'Card grid view', 'CSV import wizard', 'SLA tracker', 'Saved filters',
  'Drill-down chart', 'Role-based fields', 'SSO hardening', 'Autosave drafts'
]

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function pickMany(arr, n) {
  const s = new Set(); while (s.size < n) s.add(pick(arr)); return [...s]
}
function randomInt(a, b) { return Math.floor(a + Math.random() * (b - a + 1)) }
function dateInPastMonths(monthsBack) {
  const now = new Date()
  const m = randomInt(0, monthsBack - 1)
  const d = new Date(now.getFullYear(), now.getMonth() - m, randomInt(1, 28), randomInt(0, 23), randomInt(0, 59))
  return d.toISOString()
}
function weightedStatus() {
  // slightly prefer active states
  const pool = ['new','new','triaged','in-progress','in-progress','done','done','archived']
  return pick(pool)
}
function makeIdea() {
  const title = pick(titles)
  const cat = pick(categories)
  const tagsPool = ['table','export','auth','api','ux','perf','a11y','chart','docs','ops','growth','notifications']
  const idea = {
    id: uuidv4(),
    title,
    description: `${title} feature for the product workspace.`,
    category: cat,
    tags: pickMany(tagsPool, randomInt(1, 3)),
    personas: pickMany(personasAll, randomInt(1, 3)),
    impact: randomInt(3, 9),
    reach: randomInt(50, 5000),
    targetDate: null,
    complexity: pick(['S','M','L']),
    dependencies: [],
    repo: '',
    privacy: 'public',
    requester: pick(['Sherry','Alex','Taylor','Jordan','Sam','Casey']),
    email: 'demo@example.com',
    notify: Math.random() > 0.3,
    consent: true,
    status: weightedStatus(),
    votes: randomInt(0, 25),
    createdAt: dateInPastMonths(12)
  }
  return idea
}
function generateIdeas(n = 50) {
  return Array.from({ length: n }, makeIdea).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}
// ----------------------------------------------------

export const useIdeasStore = defineStore('ideas', {
  state: () => {
    // Persist demo seed so Vite HMR/hard refresh keeps data stable
    let ideas = []
    try {
      const saved = localStorage.getItem(SEED_KEY)
      ideas = saved ? JSON.parse(saved) : generateIdeas(50)
      if (!saved) localStorage.setItem(SEED_KEY, JSON.stringify(ideas))
    } catch {
      ideas = generateIdeas(50)
    }
    return {
      ideas,
      loading: false,
      error: null,
      votedIds: loadVoted(),
      categories,
      statuses,
      personas: personasAll
    }
  },
  getters: {
    total: (s) => s.ideas.length,
    mostVoted: (s) => s.ideas.slice().sort((a, b) => b.votes - a.votes)[0] || null,
    byStatus: (s) => s.statuses.map(st => ({ status: st, count: s.ideas.filter(i => i.status === st).length })),
    newThisMonth: (s) => {
      const m = new Date().getMonth(), y = new Date().getFullYear()
      return s.ideas.filter(i => { const d = new Date(i.createdAt); return d.getMonth() === m && d.getFullYear() === y }).length
    },
    hasVoted: (s) => (id) => s.votedIds.includes(id)
  },
  actions: {
    add(payload) {
      const idea = { id: uuidv4(), status: 'new', votes: 0, createdAt: new Date().toISOString(), ...payload }
      this.ideas.unshift(idea)
      // persist
      localStorage.setItem(SEED_KEY, JSON.stringify(this.ideas))
      return idea
    },
    patch(id, partial) {
      const idx = this.ideas.findIndex(i => i.id === id)
      if (idx > -1) this.ideas[idx] = { ...this.ideas[idx], ...partial }
      localStorage.setItem(SEED_KEY, JSON.stringify(this.ideas))
    },
    remove(id) {
      this.ideas = this.ideas.filter(i => i.id !== id)
      this.votedIds = this.votedIds.filter(x => x !== id)
      saveVoted(this.votedIds)
      localStorage.setItem(SEED_KEY, JSON.stringify(this.ideas))
    },
    upvoteIdea(id) {
      if (this.votedIds.includes(id)) return false
      const idea = this.ideas.find(i => i.id === id)
      if (!idea) return false
      idea.votes += 1
      this.votedIds.push(id)
      saveVoted(this.votedIds)
      localStorage.setItem(SEED_KEY, JSON.stringify(this.ideas))
      return true
    },

    // ---- Demo utilities ----
    demoFill(n = 20, months = 12) {
      // temporarily override date generator with a scoped months window
      const original = dateInPastMonths
      const scopedDate = (m) => {
        const now = new Date()
        const mm = Math.floor(Math.random() * Math.max(1, months))
        const d = new Date(now.getFullYear(), now.getMonth() - mm, randomInt(1, 28), randomInt(0, 23), randomInt(0, 59))
        return d.toISOString()
      }
      // create n ideas
      const newOnes = Array.from({ length: n }, () => {
        const idea = makeIdea()
        idea.createdAt = scopedDate(months)
        return idea
      })
      this.ideas = [...newOnes, ...this.ideas].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      localStorage.setItem(SEED_KEY, JSON.stringify(this.ideas))
    },
    demoReset(n = 50) {
      this.ideas = generateIdeas(n)
      localStorage.setItem(SEED_KEY, JSON.stringify(this.ideas))
      this.votedIds = []
      saveVoted(this.votedIds)
    }
  }
})
