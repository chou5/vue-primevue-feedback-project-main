<template>
  <form @submit.prevent="onSubmit" class="p-fluid form-shell">
    <!-- Summary errors -->
    <Message v-if="summaryErrors.length" severity="error" :closable="false" class="mb-3">
      <strong>Please fix the following:</strong>
      <ul class="mt-2 pl-3">
        <li v-for="(e,i) in summaryErrors" :key="i">{{ e }}</li>
      </ul>
    </Message>

    <!-- 1) Idea Basics -->
    <Card class="section-card">
      <template #title>Idea Basics</template>
      <template #content>
        <p class="section-hint">Name the idea and explain the problem. Add a category and a few tags.</p>

        <div class="field">
          <label :for="ids.title" class="font-semibold">Title <span class="req">*</span></label>
          <InputText :id="ids.title" v-model.trim="form.title" placeholder="e.g., Inline tag editor in Ideas table" :aria-invalid="!!errors.title" />
          <small class="p-error" v-if="errors.title">{{ errors.title }}</small>
        </div>

        <div class="field">
          <div class="flex align-items-center justify-content-between">
            <label :for="ids.description" class="font-semibold">Description <span class="req">*</span></label>
            <small class="text-600">{{ descChars }}/500</small>
          </div>
          <Textarea
            :id="ids.description"
            v-model.trim="form.description"
            rows="6"
            auto-resize
            :maxLength="500"
            placeholder="Briefly describe the problem and what ‘good’ looks like."
            :aria-invalid="!!errors.description"
          />
          <small class="p-error" v-if="errors.description">{{ errors.description }}</small>
        </div>

        <div class="grid form-grid">
          <div class="col-12 md:col-6">
            <label :for="ids.category" class="font-semibold">Category</label>
            <Dropdown :id="ids.category" v-model="form.category" :options="categories" placeholder="Select" />
            <small class="text-600">Helps us group similar ideas.</small>
          </div>
          <div class="col-12 md:col-6">
            <label :for="ids.tags" class="font-semibold">Tags</label>
            <Chips :id="ids.tags" v-model="form.tags" separator="," placeholder="Press Enter to add a tag" />
            <small class="text-600">Try 1–3 tags like “table”, “a11y”, “export”.</small>
          </div>
        </div>
      </template>
    </Card>

    <!-- 2) Impact & Priority -->
    <Card class="section-card">
      <template #title>Impact & Priority</template>
      <template #content>
        <p class="section-hint">Who benefits and how strongly? Rough estimates are fine.</p>

        <div class="grid form-grid">
          <div class="col-12 md:col-6">
            <label :for="ids.personas" class="font-semibold">Personas</label>
            <MultiSelect :id="ids.personas" v-model="form.personas" :options="personas" placeholder="Select personas" display="chip" />
            <small class="text-600">e.g., PM, Dev, Analyst.</small>
          </div>

          <div class="col-12 md:col-6">
            <label :for="ids.impact" class="font-semibold">Impact: {{ form.impact }}</label>
            <Slider :id="ids.impact" v-model="form.impact" :min="1" :max="10" />
            <small class="text-600">1 = minor · 10 = game changer</small>
          </div>

          <div class="col-12 md:col-6">
            <label :for="ids.reach" class="font-semibold">Expected reach</label>
            <InputNumber :id="ids.reach" v-model="form.reach" :min="0" :max="1000000" :useGrouping="false" />
            <small class="text-600">How many users might benefit?</small>
          </div>

          <div class="col-12 md:col-6">
            <label :for="ids.targetDate" class="font-semibold">Target date</label>
            <Calendar
              :id="ids.targetDate"
              v-model="form.targetDate"
              showIcon
              showButtonBar
              dateFormat="yy-mm-dd"
              :manualInput="true"
              @blur="onDateBlur"
            />
            <small class="text-600">Optional rough target.</small>
          </div>
        </div>
      </template>
    </Card>

    <!-- 3) Technical -->
    <Card class="section-card">
      <template #title>Technical</template>
      <template #content>
        <p class="section-hint">Any constraints or links we should know about.</p>

        <div class="grid form-grid">
          <div class="col-12 md:col-6">
            <label :for="ids.complexity" class="font-semibold">Complexity</label>
            <Dropdown :id="ids.complexity" v-model="form.complexity" :options="complexities" optionLabel="label" optionValue="value" placeholder="Select" />
          </div>

          <div class="col-12 md:col-6">
            <label :for="ids.dependencies" class="font-semibold">Dependencies</label>
            <Chips :id="ids.dependencies" v-model="form.dependencies" separator="," placeholder="e.g., auth, API v2" />
          </div>

          <div class="col-12 md:col-8">
            <label :for="ids.repo" class="font-semibold">Repo / Doc URL</label>
            <InputText :id="ids.repo" v-model.trim="form.repo" placeholder="https://..." :aria-invalid="!!errors.repo" />
            <small class="p-error" v-if="errors.repo">{{ errors.repo }}</small>
            <small v-else class="text-600">Optional: link to code or spec.</small>
          </div>

          <div class="col-12 md:col-4">
            <label class="font-semibold">Privacy</label>
            <div class="flex align-items-center gap-3 mt-2">
              <div class="flex align-items-center gap-2">
                <RadioButton inputId="privacy-public" name="privacy" value="public" v-model="form.privacy" />
                <label for="privacy-public">Public</label>
              </div>
              <div class="flex align-items-center gap-2">
                <RadioButton inputId="privacy-private" name="privacy" value="private" v-model="form.privacy" />
                <label for="privacy-private">Private</label>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- 4) Contact & Meta -->
    <Card class="section-card">
      <template #title>Contact & Meta</template>
      <template #content>
        <p class="section-hint">We’ll contact you only if needed or if you opt into updates.</p>

        <div class="grid form-grid">
          <div class="col-12 md:col-4">
            <label :for="ids.requester" class="font-semibold">Your name <span class="req">*</span></label>
            <InputText :id="ids.requester" v-model.trim="form.requester" :aria-invalid="!!errors.requester" />
            <small class="p-error" v-if="errors.requester">{{ errors.requester }}</small>
          </div>

          <div class="col-12 md:col-4">
            <label :for="ids.email" class="font-semibold">Email <span class="req">*</span></label>
            <InputText :id="ids.email" v-model.trim="form.email" placeholder="you@company.com" :aria-invalid="!!errors.email" />
            <small class="p-error" v-if="errors.email">{{ errors.email }}</small>
          </div>

          <div class="col-12 md:col-4">
            <label class="font-semibold">Notifications</label>
            <div class="flex align-items-center gap-2 mt-2">
              <InputSwitch v-model="form.notify" :inputId="ids.notify" />
              <label :for="ids.notify">Email me about status updates</label>
            </div>
          </div>

          <div class="col-12 mt-1">
            <div class="flex align-items-start gap-2">
              <Checkbox :inputId="ids.consent" v-model="form.consent" :binary="true" />
              <label :for="ids.consent">I agree this submission may be reviewed and stored. <span class="req">*</span></label>
            </div>
            <small class="p-error" v-if="errors.consent">{{ errors.consent }}</small>
          </div>
        </div>
      </template>
    </Card>

    <!-- Actions -->
    <div class="actions-bar">
      <div class="flex gap-2 justify-content-end">
        <Button label="Save draft" icon="pi pi-save" class="p-button-text" type="button" @click="saveDraft" />
        <Button label="Clear" icon="pi pi-times" class="p-button-text" type="button" @click="clearAll" />
        <Button label="Submit idea" icon="pi pi-check" type="submit" />
      </div>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue'
import Card from 'primevue/card'
import Message from 'primevue/message'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Chips from 'primevue/chips'
import MultiSelect from 'primevue/multiselect'
import Slider from 'primevue/slider'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import RadioButton from 'primevue/radiobutton'
import InputSwitch from 'primevue/inputswitch'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import { useDraft } from '../composables/useDraft'

/* props / emits */
const props = defineProps({
  categories: Array,
  personas: Array,
  initial: { type: Object, default: null }, // when editing
  mode: { type: String, default: 'create' } // 'create' | 'edit'
})
const emit = defineEmits(['submit', 'savedraft', 'cleared'])

/* helpers */
const toDate = (val) => {
  if (!val) return null
  const d = val instanceof Date ? val : new Date(val)
  return isNaN(d.getTime()) ? null : d
}
const deepClone = (o) =>
  JSON.parse(JSON.stringify(o, (k, v) => (v instanceof Date ? { __dt: v.toISOString() } : v)), (k, v) =>
    v && v.__dt ? new Date(v.__dt) : v
  )

/* draft key */
const draftKey = computed(() =>
  props.mode === 'edit' ? `submitIdeaDraft:edit:${props.initial?.id ?? 'unknown'}` : 'submitIdeaDraft:new'
)
const draft = useDraft(() => draftKey.value)

/* options & ids */
const ids = {
  title: 'title', description: 'description', category: 'category', tags: 'tags',
  personas: 'personas', impact: 'impact', reach: 'reach', targetDate: 'targetDate',
  complexity: 'complexity', dependencies: 'dependencies', repo: 'repo',
  privacy: 'privacy', requester: 'requester', email: 'email', notify: 'notify', consent: 'consent'
}
const complexities = [
  { label: 'Small', value: 'S' },
  { label: 'Medium', value: 'M' },
  { label: 'Large', value: 'L' }
]

/* form state */
const blank = {
  title: '', description: '', category: null, tags: [],
  personas: [], impact: 5, reach: 0, targetDate: null,
  complexity: null, dependencies: [], repo: '',
  privacy: 'public', requester: '', email: '', notify: true, consent: false
}
const form = reactive({ ...blank })
const originalSnapshot = ref(null) // used by clear in edit

function resetToBlank(){ Object.assign(form, deepClone(blank)) }
function applySnapshot(src){
  if (!src) return resetToBlank()
  Object.keys(blank).forEach(k => {
    if (k === 'targetDate') form[k] = toDate(src[k])
    else form[k] = Array.isArray(src[k]) ? [...src[k]] : (src[k] ?? blank[k])
  })
}
function applyInitial(src){
  originalSnapshot.value = deepClone(src ?? blank)
  applySnapshot(originalSnapshot.value)
}

/* draft load */
function loadDraftIntoForm() {
  const parsed = draft.load()
  if (!parsed) return false
  Object.assign(form, parsed)
  if (form.targetDate) form.targetDate = toDate(form.targetDate)
  return true
}

/* mount / watchers */
onMounted(() => {
  if (props.mode === 'edit') {
    const used = loadDraftIntoForm()
    if (!used) applyInitial(props.initial)
    else originalSnapshot.value = deepClone(props.initial ?? blank)
  } else {
    const used = loadDraftIntoForm()
    if (!used) applyInitial(null)
  }
})
watch([() => props.initial, () => draftKey.value], () => {
  if (props.mode === 'edit') {
    const used = loadDraftIntoForm()
    if (!used) applyInitial(props.initial)
    else originalSnapshot.value = deepClone(props.initial ?? blank)
  }
})

/* validation / submit */
const errors = reactive({})
const categories = computed(() => props.categories || ['UX','Platform','Ops','Growth','Other'])
const personas = computed(() => props.personas || ['PM','Dev','Designer','Analyst','CS','Sales'])
const descChars = computed(() => (form.description || '').length)
const urlOk = (v) => !v || /^https?:\/\//i.test(v)
const emailOk = (v) => /.+@.+\..+/.test(v)

function validate(){
  const e = {}
  if (!form.title) e.title = 'Title is required'
  if (!form.description) e.description = 'Description is required'
  if (form.repo && !urlOk(form.repo)) e.repo = 'Link must be a valid http(s) URL'
  if (!form.requester) e.requester = 'Your name is required'
  if (!form.email) e.email = 'Email is required'
  else if (!emailOk(form.email)) e.email = 'Invalid email format'
  if (!form.consent) e.consent = 'Please accept to proceed'
  return e
}
const summaryErrors = computed(() => Object.values(errors))

function onSubmit(){
  const v = validate()
  Object.keys(errors).forEach(k => delete errors[k])
  Object.assign(errors, v)
  if (Object.keys(v).length) return
  emit('submit', { ...deepClone(form) })
}

/* draft & clear */
function saveDraft(){ draft.save(deepClone(form)); emit('savedraft', { mode: props.mode }) }
function clearAll(){
  draft.clear()
  Object.keys(errors).forEach(k => delete errors[k])
  if (props.mode === 'edit') applySnapshot(originalSnapshot.value || props.initial || blank)
  else resetToBlank()
  emit('cleared', { mode: props.mode })
}

/* date behavior: do not clear on blur if unchanged */
function onDateBlur(e){
  const val = e?.target?.value?.trim?.()
  if (val && !form.targetDate) {
    const d = new Date(val)
    if (!isNaN(d.getTime())) form.targetDate = d
  }
}
</script>

<style scoped>
.form-shell { padding: .25rem 0 1.25rem; }
.form-grid { gap: 1.25rem 1rem; }
.field { margin-bottom: 1.5rem; }
.req { color: var(--red-500); }
.text-600 { color: var(--text-2); }
.actions-bar { margin-top: .25rem; padding: 1.25rem 0; border-top: 1px solid var(--surface-border); }
</style>
