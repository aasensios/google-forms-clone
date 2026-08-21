import type { FormTemplate } from '@/app/types'

const STORAGE_KEY = 'gfc:forms'

const listeners = new Set<() => void>()
let snapshot: FormTemplate[] = []
let hydrated = false
const EMPTY: FormTemplate[] = []

export function subscribeForms(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function makeForm(title: string): FormTemplate {
  return {
    id: crypto.randomUUID(),
    title,
    description: 'Form description',
    questions: [
      {
        id: crypto.randomUUID(),
        title: 'Untitled Question',
        type: 'radio',
        options: ['Option 1'],
        required: false,
      },
    ],
  }
}

// First client-side access hydrates the cache from localStorage;
// seeding one starter form on very first run. Server always gets the
// stable EMPTY reference (see getServerFormsSnapshot below).
function ensureHydrated(): FormTemplate[] {
  if (hydrated || typeof window === 'undefined') return snapshot
  hydrated = true
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw === null) {
    snapshot = [makeForm('Untitled Form')]
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
    return snapshot
  }
  try {
    const parsed = JSON.parse(raw)
    snapshot = Array.isArray(parsed) ? parsed : []
  } catch {
    snapshot = []
  }
  return snapshot
}

function writeAll(forms: FormTemplate[]) {
  if (typeof window === 'undefined') return
  snapshot = forms
  hydrated = true
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(forms))
  listeners.forEach((listener) => listener())
}

/** Referentially stable between writes — safe as a store snapshot. */
export function getFormsSnapshot(): FormTemplate[] {
  return ensureHydrated()
}

export function getServerFormsSnapshot(): FormTemplate[] {
  return EMPTY
}

export function createForm(title?: string): FormTemplate {
  const form = makeForm(title || 'Untitled Form')
  writeAll([form, ...getFormsSnapshot()])
  return form
}

export function getForm(id: string): FormTemplate | null {
  return getFormsSnapshot().find((form) => form.id === id) ?? null
}

export function saveForm(form: FormTemplate) {
  const forms = getFormsSnapshot()
  const index = forms.findIndex((f) => f.id === form.id)
  if (index === -1) {
    writeAll([form, ...forms])
  } else {
    const next = [...forms]
    next[index] = form
    writeAll(next)
  }
}

export function deleteForm(id: string) {
  writeAll(getFormsSnapshot().filter((form) => form.id !== id))
}

export function renameForm(id: string, title: string) {
  const form = getForm(id)
  if (form) saveForm({ ...form, title })
}
