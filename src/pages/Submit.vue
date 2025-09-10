<template>
  <div class="page-shell">
    <h2 class="mb-2">Submit an Idea</h2>
    <p class="text-600 mb-4">In 1–2 minutes: name the idea, explain the problem, and leave your contact.</p>

    <IdeaForm
      mode="create"
      :categories="store.categories"
      :personas="store.personas"
      @submit="onSubmit"
      @savedraft="onSavedDraft"
      @cleared="onCleared"
    />
  </div>
</template>

<script setup>
import { useIdeasStore } from '../stores/ideas'
import IdeaForm from '../components/IdeaForm.vue'
import { useToast } from 'primevue/usetoast'
const store = useIdeasStore()
const toast = useToast()

function onSubmit(payload){ store.add(payload); toast.add({ severity:'success', summary:'Idea submitted', life:1500 }) }
function onSavedDraft(){ toast.add({ severity:'success', summary:'Draft saved (this device)', life:1200 }) }
function onCleared(){ toast.add({ severity:'info', summary:'Form cleared', life:900 }) }
</script>
