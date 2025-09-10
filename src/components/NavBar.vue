<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()
const isOpen = ref(false)

const links = [
  { to: '/dashboard',  label: 'Dashboard',  icon: 'pi pi-chart-line' },
  { to: '/ideas',      label: 'Ideas',      icon: 'pi pi-table' },
  { to: '/submit',     label: 'Submit',     icon: 'pi pi-send' },
  { to: '/style',      label: 'Style',      icon: 'pi pi-sliders-h' }
]

const pageTitle = computed(() =>
  (route.meta?.title as string | undefined) ??
  links.find(l => route.path.startsWith(l.to))?.label ??
  ''
)

const isActive = (to: string) => route.path.startsWith(to)

/* Close mobile menu on route change */
watch(() => route.fullPath, () => { isOpen.value = false })

/* ESC to close */
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') isOpen.value = false
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <header class="navbar surface-card border-bottom-1 border-200 px-3 py-2">
    <!-- Left: page title -->
    <div class="brand-title" aria-live="polite">{{ pageTitle }}</div>

    <!-- Center: navigation (desktop) -->
    <nav class="nav">
      <RouterLink
        v-for="item in links"
        :key="item.to"
        :to="item.to"
        class="nav-link"
        :class="{ active: isActive(item.to) }"
      >
        <i :class="item.icon" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <!-- Mobile hamburger -->
    <button
      class="hamburger"
      type="button"
      :aria-expanded="isOpen ? 'true' : 'false'"
      aria-label="Open menu"
      @click="isOpen = !isOpen"
    >
      <i class="pi pi-bars" />
    </button>

    <!-- Right: controls (theme toggle etc) -->
    <div class="right">
      <slot name="right"></slot>
    </div>
  </header>

  <!-- Mobile menu overlay -->
  <transition name="fade">
    <div v-if="isOpen" class="mobile-overlay" @click.self="isOpen = false">
      <transition name="slide-down">
        <div class="mobile-sheet">
          <div class="mobile-head">
            <div class="mobile-title">Menu</div>
            <button class="icon-btn" aria-label="Close menu" @click="isOpen = false">
              <i class="pi pi-times" />
            </button>
          </div>

          <nav class="mobile-nav" role="menu">
            <RouterLink
              v-for="item in links"
              :key="item.to"
              :to="item.to"
              class="mobile-link"
              :class="{ active: isActive(item.to) }"
              role="menuitem"
              @click="isOpen = false"
            >
              <i :class="item.icon" />
              <span>{{ item.label }}</span>
            </RouterLink>
          </nav>

          <div class="mobile-right">
            <slot name="right"></slot>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
/* ====== LAYOUT ====== */
.navbar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;  /* left title | center nav | right controls */
  align-items: center;
}

/* Fixed width keeps layout stable as title changes */
.brand-title {
  justify-self: start;
  width: 8.75rem;               /* tweak if you want more/less room */
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav {
  justify-self: center;
  display: inline-flex;
  gap: .5rem;
}

.right {
  justify-self: end;
  display: inline-flex;
  align-items: center;
  gap: .5rem;
}

/* ====== LINKS ====== */
.nav-link {
  display: inline-flex;
  align-items: center;
  gap: .375rem;
  padding: .35rem .6rem;
  border-radius: .5rem;
  color: var(--text-color);
  text-decoration: none;
}
.nav-link.active {
  background: var(--surface-100);
  font-weight: 600;
}
.nav-link :deep(.pi) {
  font-size: .95rem;
}

/* ====== HAMBURGER (hidden on desktop) ====== */
.hamburger {
  display: none;                 /* shown on mobile only */
  justify-self: center;          /* occupies the center column when shown */
  background: transparent;
  border: 0;
  padding: .25rem .5rem;
  border-radius: .5rem;
  cursor: pointer;
}
.hamburger:hover { background: var(--surface-100); }
.hamburger :deep(.pi) { font-size: 1.25rem; }

/* ====== MOBILE OVERLAY MENU ====== */
.mobile-overlay {
  position: fixed;
  inset: 0;
  background: color-mix(in oklab, var(--maskbg, #000) 35%, transparent);
  z-index: 1000;
}
.mobile-sheet {
  position: absolute;
  left: .75rem;
  right: .75rem;
  top: .75rem;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: .75rem;
  box-shadow: 0 10px 30px rgba(0,0,0,.15);
  padding: .5rem .5rem .75rem;
}

.mobile-head {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: .25rem .25rem .25rem .5rem;
}
.mobile-title { font-weight: 600; }
.icon-btn {
  background: transparent;
  border: 0;
  padding: .25rem .5rem;
  border-radius: .5rem;
  cursor: pointer;
}
.icon-btn:hover { background: var(--surface-100); }

.mobile-nav {
  display: flex;
  flex-direction: column;
  padding: .25rem;
}
.mobile-link {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .6rem .5rem;
  border-radius: .5rem;
  text-decoration: none;
  color: var(--text-color);
}
.mobile-link.active {
  background: var(--surface-100);
  font-weight: 600;
}
.mobile-link :deep(.pi) { font-size: 1.1rem; }

.mobile-right {
  margin-top: .25rem;
  padding: .25rem .5rem 0;
  display: flex;
  gap: .5rem;
}

/* ====== TRANSITIONS ====== */
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-down-enter-active, .slide-down-leave-active {
  transition: transform .18s ease, opacity .18s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  transform: translateY(-6px);
  opacity: 0;
}

/* ====== RESPONSIVE ====== */
@media (max-width: 768px) {
  .nav { display: none; }         /* hide desktop nav */
  .hamburger { display: inline-flex; }
  .brand-title { width: 7.25rem; }   /* a bit narrower on mobile */
}
</style>
