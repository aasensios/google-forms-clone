# 008 — Make forms-store reactive via useSyncExternalStore

- **Status**: DONE
- **Commit**: 902270e (post-001..007 tree)
- **Severity**: MEDIUM
- **Category**: Maintainability & architecture (clears 4 react-doctor regressions introduced by 005)
- **Rule**: rerender-state-only-in-handlers ×2, no-adjust-state-on-prop-change, no-effect-chain
- **Estimated scope**: 4 files

## Problem

Plan 005's effect-based wiring regressed the React Doctor score 100 → 73:

1. `edit-form.tsx:25` + `preview/page.tsx:14` — `missing` useState is set but
   never rendered (`rerender-state-only-in-handlers` ×2).
2. `edit-form.tsx` load effect keyed on `[formId]` adjusts state after a prop
   (`no-adjust-state-on-prop-change`).
3. `edit-form.tsx` load effect sets `form`, triggering the autosave effect
   (`no-effect-chain`).

Root cause: localStorage state mirrored into local useState via effects. The
idiomatic React 19 fix is to make the store itself external and subscribe with
`useSyncExternalStore` — no effects, no mirror state, and mutations anywhere
become reactive.

## Target

### `app/lib/forms-store.ts` — rewritten

Keep the existing public function signatures (`createForm`, `listForms`,
`getForm`, `saveForm`, `deleteForm`, `renameForm`). Add subscription +
stable-snapshot plumbing. Every write goes through `writeAll`, which updates
the cache and notifies subscribers:

    import { useSyncExternalStore } from 'react'
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
    // stable EMPTY reference (see getServerSnapshot below).
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

    export function listForms(): FormTemplate[] {
      return ensureHydrated()
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

### `app/forms/[id]/edit/_components/edit-form.tsx`

DELETE: the `form`/`missing` useState pair, BOTH useEffects, both
eslint-disable blocks, and the `updateForm` closure over state. ADD:
`useSyncExternalStore` import from react plus the three store functions.

Replace state + helpers. The server snapshot returns `null` (typed
`FormTemplate[] | null`), so `forms === null` means "server render / pre-
hydration" → loading spinner. On the client it is always the array; a missing
id is derived from it:

    const forms = useSyncExternalStore(
      subscribeForms,
      getFormsSnapshot,
      () => null as FormTemplate[] | null,
    )

    const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState(0)

    const loading = forms === null
    const form = loading ? null : (forms.find((f) => f.id === formId) ?? null)

Handlers persist through the store — mutation IS the event handler side
effect, so no autosave effect exists:

    const updateQuestion = (id: string, updates: Partial<Question>) => {
      if (!form) return
      saveForm({
        ...form,
        questions: form.questions.map((q) =>
          q.id === id ? { ...q, ...updates } : q,
        ),
      })
    }

Apply the same shape to every handler (title/description/question CRUD/
option CRUD/drag-end), preserving plan-004 updater BODIES but applying them to
the current non-null `form` and passing the RESULT to `saveForm(...)` instead
of `setForm(...)`. Example — duplicateQuestion:

    const duplicateQuestion = (id: string) => {
      if (!form) return
      const questionIndex = form.questions.findIndex((q) => q.id === id)
      if (questionIndex === -1) return
      const newQuestion = { ...form.questions[questionIndex], id: crypto.randomUUID() }
      const questions = [...form.questions]
      questions.splice(questionIndex + 1, 0, newQuestion)
      saveForm({ ...form, questions })
      setActiveQuestionId(newQuestion.id)
    }

(direct index math on the render-current `form` is correct again because the
store write is synchronous — batching lost-updates are impossible when reads
come from the just-written cache.)

Guards before JSX:

    if (loading) return <spinner Box exactly as today>

    if (!form) notFound()

Everything downstream (`form.title`, QuestionsList props, FAB) unchanged.

### `app/forms/[id]/preview/page.tsx`

Same substitution — delete `form`/`missing` state + effect:

    const forms = useSyncExternalStore(
      subscribeForms,
      getFormsSnapshot,
      () => null as FormTemplate[] | null,
    )
    const form =
      forms === null ? null : (forms.find((f) => f.id === params.id) ?? null)

    if (forms !== null && !form) notFound()
    if (!form) return <spinner Box as today>

JSX below unchanged.

### `app/forms/_components/recent-forms-section.tsx`

Delete the `useState<Form[]>` + mount-hydration effect + local
handleRename/handleRemove state juggling. Derive during render:

    const templates = useSyncExternalStore(
      subscribeForms,
      getFormsSnapshot,
      getServerFormsSnapshot,
    )
    const cards: Form[] = templates.map((t, i) => ({
      id: t.id,
      name: t.title || 'Untitled Form',
      thumbnailUrl: t.thumbnailUrl || TEMPLATES[i % TEMPLATES.length].thumbnailUrl,
      shared: false,
      lastOpen: '',
    }))

Rename/remove collapse to bare store calls (emission re-renders):

    const handleRename = (id: string, newName: string) => renameForm(id, newName)
    const handleRemove = (id: string) => deleteForm(id)

Map `cards` where `forms` was mapped before; everything else unchanged.

## Repo conventions to follow

- Single quotes/no semicolons in all four files.
- Store exemplar: keep all persistence knowledge inside forms-store.ts.

## Steps

1. Rewrite `forms-store.ts` per target.
2. Refactor `edit-form.tsx`.
3. Refactor `preview/page.tsx`.
4. Refactor `recent-forms-section.tsx`.
5. Remove ALL `eslint-disable react-hooks/set-state-in-effect` blocks (should
   be zero remaining); grep confirms no `useState<FormTemplate` mirrors remain.

## Boundaries

- Do NOT change any visual output, routes, or the api stubs.
- Do NOT introduce context providers or libraries.
- Keep `createForm`'s behavior identical for template-card.tsx (no changes
  there).
- STOP on drift beyond described post-005 state.

## Verification

- **Mechanical**:
  - `bun run lint && bun run build` pass.
  - `npx react-doctor@latest --json --json-out /tmp/rd.json` full scan:
    totalDiagnosticCount MUST be 0 (score back to 100/Great).
  - Zero `eslint-disable` comments repo-wide.
- **Behavior check** (orchestrator serves):
  - `/forms` lists seeded form; open editor; edits appear instantly AND
    survive refresh (autosave via explicit saves).
  - ⋮ Rename updates card immediately without refresh.
  - Unknown id → styled 404; SSR hard-refresh shows spinner then content, no
    hydration mismatch warnings in console.
- **Done when**: diagnostics are zero, checks pass, behaviors hold.
