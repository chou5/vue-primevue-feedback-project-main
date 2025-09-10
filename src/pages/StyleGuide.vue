<template>
  <div class="page-shell">
    <h2 class="mb-2">Style Guide</h2>
    <p class="text-600 mb-4">
      Quick reference for typography, buttons, inputs, and tokens. Uses the same card spacing and rhythm as the Submit form.
    </p>

    <!-- 1) Typography & Buttons -->
    <Card class="section-card">
      <template #title>Typography & Buttons</template>
      <template #content>
        <p class="section-hint">Headings, body text, and button variants.</p>

        <div class="typo mb-3">
          <h1 class="mb-2">H1 — Page Title</h1>
          <h2 class="mb-3">H2 — Section</h2>
          <p>Body text, <a href="#" @click.prevent>link</a>, <strong>bold</strong>.</p>
        </div>

        <div class="flex align-items-center gap-2 flex-wrap">
          <Button label="Primary" />
          <Button label="Text" class="p-button-text" />
          <Button label="Danger" severity="danger" />
          <Button label="Disabled" :disabled="true" />
        </div>
      </template>
    </Card>

    <!-- 2) Inputs -->
    <Card class="section-card">
      <template #title>Inputs</template>
      <template #content>
        <p class="section-hint">Standard inputs with clear labels, helpers, and states.</p>

        <div class="grid form-grid">
          <div class="col-12">
            <label for="sg-input" class="font-semibold">InputText</label>
            <InputText id="sg-input" placeholder="InputText" />
          </div>

          <div class="col-12">
            <label for="sg-textarea" class="font-semibold">Textarea</label>
            <Textarea id="sg-textarea" rows="3" auto-resize placeholder="Textarea" />
          </div>

          <div class="col-12 md:col-6">
            <label for="sg-dropdown" class="font-semibold">Dropdown</label>
            <Dropdown id="sg-dropdown" v-model="ddValue" :options="ddOptions" placeholder="Dropdown" class="w-full" />
          </div>

          <div class="col-12 md:col-6">
            <label for="sg-chips" class="font-semibold">Chips</label>
            <!-- Prefilled so pills render immediately -->
            <Chips id="sg-chips" v-model="chipsDemo" separator="," />
            <small class="text-600">Type and press Enter to add more.</small>
          </div>
        </div>
      </template>
    </Card>

    <!-- 3) Toggles & Choices (NEW) -->
    <Card class="section-card">
      <template #title>Toggles & Choices</template>
      <template #content>
        <p class="section-hint">Switches, checkboxes, and radios with labels.</p>

        <div class="grid form-grid">
          <!-- InputSwitch -->
          <div class="col-12 md:col-4">
            <label class="font-semibold">InputSwitch</label>
            <div class="flex align-items-center gap-2 mt-2">
              <InputSwitch v-model="notifyOn" inputId="sg-switch-on" />
              <label for="sg-switch-on">Email me about updates</label>
            </div>
            <div class="flex align-items-center gap-2 mt-2">
              <InputSwitch v-model="notifyOff" inputId="sg-switch-off" disabled />
              <label for="sg-switch-off" class="text-600">Disabled</label>
            </div>
          </div>

          <!-- Checkbox -->
          <div class="col-12 md:col-4">
            <label class="font-semibold">Checkbox</label>
            <div class="flex align-items-center gap-2 mt-2">
              <Checkbox v-model="agree" :binary="true" inputId="sg-check" />
              <label for="sg-check">I agree to terms</label>
            </div>
            <div class="flex align-items-center gap-2 mt-2">
              <Checkbox v-model="agreeDisabled" :binary="true" inputId="sg-check-disabled" disabled />
              <label for="sg-check-disabled" class="text-600">Disabled</label>
            </div>
          </div>

          <!-- Radio -->
          <div class="col-12 md:col-4">
            <label class="font-semibold">Radio buttons</label>
            <div class="flex align-items-center gap-3 mt-2">
              <div class="flex align-items-center gap-2">
                <RadioButton v-model="privacy" inputId="sg-public" name="sg-privacy" value="public" />
                <label for="sg-public">Public</label>
              </div>
              <div class="flex align-items-center gap-2">
                <RadioButton v-model="privacy" inputId="sg-private" name="sg-privacy" value="private" />
                <label for="sg-private">Private</label>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- 4) States -->
    <Card class="section-card">
      <template #title>States</template>
      <template #content>
        <p class="section-hint">Focus, invalid, and disabled examples.</p>

        <div class="grid form-grid">
          <div class="col-12 md:col-4">
            <label for="sg-focus" class="font-semibold">Focus</label>
            <InputText id="sg-focus" placeholder="Auto-focused" autofocus />
            <small class="text-600">Visible focus ring for keyboard users.</small>
          </div>

          <div class="col-12 md:col-4">
            <label for="sg-invalid" class="font-semibold">Invalid</label>
            <InputText id="sg-invalid" class="p-invalid" placeholder="Invalid input" />
            <small class="p-error">This field is required.</small>
          </div>

          <div class="col-12 md:col-4">
            <label for="sg-disabled" class="font-semibold">Disabled</label>
            <InputText id="sg-disabled" placeholder="Disabled input" :disabled="true" />
          </div>
        </div>
      </template>
    </Card>

    <!-- 5) Tokens -->
    <Card class="section-card">
      <template #title>Design Tokens</template>
      <template #content>
        <p class="section-hint">Core theme variables.</p>

        <div class="mb-3">
          <h3 class="token-title">Colors</h3>
          <div class="palette">
            <div class="swatch"><span class="chip" style="background: var(--primary-color)"></span><small>Primary</small></div>
            <div class="swatch"><span class="chip" style="background: var(--surface-300, #e5e7eb)"></span><small>Surface</small></div>
            <div class="swatch"><span class="chip" style="background: var(--highlight-bg, #dbeafe)"></span><small>Highlight</small></div>
            <div class="swatch"><span class="chip" style="background: var(--text-color, #111827)"></span><small>Text</small></div>
          </div>
        </div>

        <div class="mb-2">
          <h3 class="token-title">Spacing</h3>
          <div class="spacers">
            <div class="spacer"><span class="bar s-4"></span><small>4</small></div>
            <div class="spacer"><span class="bar s-8"></span><small>8</small></div>
            <div class="spacer"><span class="bar s-12"></span><small>12</small></div>
            <div class="spacer"><span class="bar s-16"></span><small>16</small></div>
          </div>
        </div>

        <div>
          <h3 class="token-title">Radius</h3>
          <div class="radii">
            <div class="radius r-6"></div>
            <div class="radius r-12"></div>
            <div class="radius r-20"></div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Chips from 'primevue/chips'
import InputSwitch from 'primevue/inputswitch'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'

const ddOptions = ref(['Alpha', 'Beta', 'Gamma'])
const ddValue = ref(null)
const chipsDemo = ref(['design', 'ui'])

/* Toggles & choices demo state */
const notifyOn = ref(true)
const notifyOff = ref(false)
const agree = ref(false)
const agreeDisabled = ref(true)
const privacy = ref('public')
</script>

<style scoped>
/* Page padding to match the nicer form */
.page-shell { max-width: 1120px; margin: 0 auto; padding: 1.25rem 1rem 2rem; }

/* Section spacing & generous inner padding (like IdeaForm) */
.section-card { margin-bottom: 2rem; }
.section-card :deep(.p-card-content) { padding: 1.5rem 1.5rem 1.25rem; }
.section-card :deep(.p-card-title) { padding: 1.25rem 1.5rem 0; }

.section-hint { margin: .35rem 0 1rem; color: var(--text-color-secondary); }
.text-600 { color: var(--text-color-secondary); }

/* Column/row gaps inside grids */
.form-grid { gap: 1.25rem 1rem; }

/* Palette */
.palette { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .75rem; }
.swatch { display: flex; align-items: center; gap: .5rem; }
.chip { width: 28px; height: 20px; border-radius: 6px; border: 1px solid var(--surface-border); display: inline-block; }
.token-title { margin: 0 0 .5rem; font-size: 0.95rem; color: var(--text-color-secondary); }

/* Spacing bars */
.spacers { display: flex; gap: .75rem; align-items: center; }
.spacer { display: flex; flex-direction: column; align-items: center; gap: .25rem; }
.bar { width: 64px; background: var(--surface-300, #e5e7eb); border-radius: 999px; border: 1px solid var(--surface-border); }
.s-4 { height: 4px; } .s-8 { height: 8px; } .s-12 { height: 12px; } .s-16 { height: 16px; }

/* Radius samples */
.radii { display: flex; gap: .75rem; align-items: center; }
.radius { width: 48px; height: 32px; background: var(--surface-300, #e5e7eb); border: 1px solid var(--surface-border); }
.r-6 { border-radius: 6px; } .r-12 { border-radius: 12px; } .r-20 { border-radius: 20px; }

/* Tidy heading margins */
.typo :is(h1, h2) { margin-top: 0; }
</style>
