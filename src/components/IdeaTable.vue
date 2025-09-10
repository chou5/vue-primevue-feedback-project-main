<template>
  <Card class="section-card">
    <template #content>
      <h3 v-if="!hideTitle" class="section-heading">Browse &amp; manage</h3>

      <!-- Toolbar -->
      <div class="toolbar">
       <span class="p-input-icon-left search-field">
          <i class="pi pi-search" />
          <InputText v-model="global" placeholder="Search title / description / tags" class="w-full" />
        </span>

        <MultiSelect v-model="categoryFilter" :options="store.categories" placeholder="Category" display="chip" class="w-full" />
        <MultiSelect v-model="statusFilter"   :options="store.statuses"   placeholder="Status"   display="chip" class="w-full" />

        <div class="toolbar-right">
          <MultiSelect v-model="visibleColumns" :options="columnOptions" optionLabel="header" placeholder="Columns" display="chip" class="w-16rem"/>
          <RouterLink to="/submit">
            <Button label="Submit idea" icon="pi pi-plus" class="p-button-text" />
          </RouterLink>
        </div>
      </div>

      <!-- Table -->
      <DataTable
        :value="paged" :paginator="true" :rows="10" :rowsPerPageOptions="[10,20,50]"
        :sortField="sortField" :sortOrder="sortOrder" @sort="onSort"
        rowHover stripedRows responsiveLayout="scroll" class="ideas-table"
      >
        <Column v-if="colVisible('title')" field="title" header="Title" :sortable="true" style="width:36%;">
          <template #body="{ data }"><div class="ellipsis" :title="data.title">{{ data.title }}</div></template>
        </Column>

        <Column v-if="colVisible('category')" field="category" header="Category" :sortable="true" style="width:12%;">
          <template #body="{ data }"><span class="text-900">{{ data.category }}</span></template>
        </Column>

        <Column v-if="colVisible('status')" field="status" header="Status" :sortable="true" style="width:14%;">
          <template #body="{ data }"><span class="text-900">{{ data.status }}</span></template>
        </Column>

        <Column v-if="colVisible('tags')" field="tags" header="Tags" :sortable="true" style="width:18%;">
          <template #body="{ data }"><div class="chips-row"><Tag v-for="t in data.tags" :key="t" :value="t" /></div></template>
        </Column>

        <Column v-if="colVisible('votes')" field="votes" header="Votes" :sortable="true" style="width:8%; text-align:center;">
          <template #body="{ data }">
            <div class="flex justify-content-center">
              <Button :disabled="store.hasVoted(data.id)" @click="vote(data)" size="small" :label="String(data.votes)" icon="pi pi-thumbs-up" />
            </div>
          </template>
        </Column>

        <Column v-if="colVisible('actions')" field="actions" header="Actions" :sortable="false" style="width:12%;">
          <template #body="{ data }">
            <div class="flex gap-1 justify-content-end">
              <Button icon="pi pi-pencil" text @click="edit(data)" />
              <Button icon="pi pi-trash" text severity="danger" @click="del(data)" />
            </div>
          </template>
        </Column>

        <template #empty><div class="empty">No ideas match. Try adjusting filters or clearing the search.</div></template>
      </DataTable>
    </template>
  </Card>

  <!-- Edit dialog -->
  <Dialog v-model:visible="showEdit" header="Edit Idea" modal style="width: 60vw">
    <IdeaForm :key="editKey" mode="edit" :categories="store.categories" :personas="store.personas" :initial="editInitial" @submit="saveEdit" @savedraft="onDraftSaved" />
  </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useIdeasStore } from '../stores/ideas'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import IdeaForm from './IdeaForm.vue'

const props = defineProps({ hideTitle: { type: Boolean, default: false } })
const store = useIdeasStore()
const toast = useToast()
const confirm = useConfirm()

/* filters & state (kept inline) */
const global = ref('')
const categoryFilter = ref([])
const statusFilter = ref([])
const sortField = ref('createdAt')
const sortOrder = ref(-1)

/* column chooser (KEEP same object references) */
const columnOptions = [
  { field: 'title', header: 'Title' },
  { field: 'category', header: 'Category' },
  { field: 'status', header: 'Status' },
  { field: 'tags', header: 'Tags' },
  { field: 'votes', header: 'Votes' },
  { field: 'actions', header: 'Actions', sortable: false }
]
const visibleColumns = ref(columnOptions.slice())
const colVisible = (field) => visibleColumns.value.some(v => v.field === field)

/* data */
const filtered = computed(() => {
  const q = global.value.trim().toLowerCase()
  return store.ideas.filter(i => {
    const matchesQ  = !q || [i.title, i.description, (i.tags||[]).join(' ')].join(' ').toLowerCase().includes(q)
    const matchesCat = !categoryFilter.value.length || categoryFilter.value.includes(i.category)
    const matchesSt  = !statusFilter.value.length   || statusFilter.value.includes(i.status)
    return matchesQ && matchesCat && matchesSt
  })
})
const sorted = computed(() => filtered.value.slice().sort((a,b)=>{
  const f = sortField.value, dir = sortOrder.value
  return (a[f] > b[f] ? 1 : a[f] < b[f] ? -1 : 0) * dir
}))
const paged = computed(() => sorted.value)
function onSort(evt){ sortField.value = evt.sortField; sortOrder.value = evt.sortOrder }

/* edit dialog */
const showEdit = ref(false)
let editingId = null
const editInitial = ref(null)
const editKey = ref(0)

function edit(row){ editingId = row.id; editInitial.value = { ...row }; editKey.value++; showEdit.value = true }
function saveEdit(payload){ store.patch(editingId, payload); showEdit.value = false; toast.add({ severity:'success', summary:'Saved', life: 1500 }) }
function onDraftSaved(){ showEdit.value = false; toast.add({ severity: 'success', summary: 'Draft saved', life: 1200 }) }
function del(row){
  confirm.require({
    message: `Delete “${row.title}”?`,
    header: 'Confirm',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => { store.remove(row.id); toast.add({ severity:'info', summary:'Deleted', life:1200 }) }
  })
}
function vote(row){
  const ok = store.upvoteIdea(row.id)
  if (ok) toast.add({ severity:'success', summary:'Thanks for voting!', life:1200 })
  else toast.add({ severity:'warn', summary:'You already voted', life:1500 })
}
</script>
<style scoped>
/* Search input: keep the icon perfectly centered and spaced */
.toolbar .search-field { position: relative; }

.toolbar .search-field :deep(.pi.pi-search) {
  position: absolute;
  left: .75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;              /* clicks go to the input */
  color: var(--text-color-secondary);
  line-height: 1;
  font-size: 0.95rem;                /* tweak if you want a bigger/smaller icon */
}

.toolbar .search-field :deep(input.p-inputtext) {
  padding-left: 2.25rem;             /* room for the icon */
}
</style>
