# 005 — Persist forms in localStorage behind a store module

- **Status**: DONE
- **Commit**: 902270e
- **Severity**: HIGH (turns the demo into a working app)
- **Category**: Maintainability & architecture (missed opportunity, user-directed)
- **Rule**: Beyond the scan
- **Estimated scope**: 1 new module + 6 files touched

## Problem

Nothing persists. Verified facts: `app/api/forms/route.ts` POST fabricates an
id and returns 201 without writing anything; `[id]/route.ts` DELETE returns
204 touching nothing; zero `fetch()` calls exist client-side; the edit page
ignores its id and renders a mock (`edit/page.tsx`, `{ ...INITIAL_FORM, id }`);
preview does the same; renames/deletes/question edits evaporate on refresh.

**User decision: no backend. Use browser persistence — localStorage (chosen
over IndexedDB).** Rationale: documents are small JSON (a few KB), volume is
dozens of forms max, reads want to be synchronous to keep client pages simple;
IndexedDB's async machinery buys nothing at this scale. All access is funneled
through ONE module so swapping in a real backend later touches one file.

## Target

### New file: `app/lib/forms-store.ts`

    import type { FormTemplate } from '@/app/types'

    const STORAGE_KEY = 'gfc:forms'

    function readAll(): FormTemplate[] {
      if (typeof window === 'undefined') return []
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw === null) return []
      try {
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }

    function writeAll(forms: FormTemplate[]) {
      if (typeof window === 'undefined') return
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(forms))
    }

    export function createForm(title?: string): FormTemplate {
      const form: FormTemplate = {
        id: crypto.randomUUID(),
        title: title || 'Untitled Form',
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
      writeAll([form, ...readAll()])
      return form
    }

    export function listForms(): FormTemplate[] {
      const forms = readAll()
      if (
        typeof window !== 'undefined' &&
        window.localStorage.getItem(STORAGE_KEY) === null
      ) {
        // first run: seed one starter form so /forms isn't empty
        const seed: FormTemplate = {
          id: crypto.randomUUID(),
          title: 'Untitled Form',
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
        writeAll([seed])
        return [seed]
      }
      return forms
    }

    export function getForm(id: string): FormTemplate | null {
      return readAll().find((form) => form.id === id) ?? null
    }

    export function saveForm(form: FormTemplate) {
      const forms = readAll()
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
      writeAll(readAll().filter((form) => form.id !== id))
    }

    export function renameForm(id: string, title: string) {
      saveForm({ ...getForm(id)!, title })
    }

(The seed shape mirrors the deleted INITIAL_FORM mocks so the first-run UX is
identical to today's.)

### `app/forms/[id]/edit/page.tsx` — server shell passes only the id

Delete the whole current file body (INITIAL_FORM mock included) and replace:

    import EditForm from './_components/edit-form'

    export default async function EditPage({
      params,
    }: {
      params: Promise<{ id: string }>
    }) {
      const { id } = await params
      return <EditForm formId={id} />
    }

### `app/forms/[id]/edit/_components/edit-form.tsx` — load by id + autosave

Change signature from `initialForm: FormTemplate` to `formId: string`. Add
imports: `useEffect` (extend existing react import), `notFound` from
`next/navigation`, `CircularProgress` to the MUI import, and
`import { getForm, saveForm } from '@/app/lib/forms-store'`.

Replace state init:

    const [form, setForm] = useState<FormTemplate | null>(null)
    const [missing, setMissing] = useState(false)
    const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState(0)

Add above the return (AFTER all handlers):

    useEffect(() => {
      const loaded = getForm(formId)
      if (loaded) {
        setForm(loaded)
        setActiveQuestionId(loaded.questions[0]?.id || null)
      } else {
        setMissing(true)
      }
    }, [formId])

    useEffect(() => {
      if (form) saveForm(form)
    }, [form])

Guard the JSX: while loading render a centered spinner; when missing call
`notFound()`:

    if (missing) notFound()

    if (!form) {
      return (
        <Box
          sx={{
            bgcolor: 'background.default',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      )
    }

The rest of the JSX keeps using `form.title` etc. unchanged (TS now knows
`form` is non-null past the guard).

### `app/forms/[id]/preview/page.tsx` — client component reading the store

Replace entire file:

    'use client'

    import type { FormTemplate } from '@/app/types'
    import { notFound } from 'next/navigation'
    import { useParams } from 'next/navigation'
    import { Box, CircularProgress, Container, Paper, Typography } from '@mui/material'
    import { useEffect, useState } from 'react'
    import { getForm } from '@/app/lib/forms-store'

    export default function PreviewPage() {
      const params = useParams<{ id: string }>()
      const formId = params.id
      const [form, setForm] = useState<FormTemplate | null>(null)
      const [missing, setMissing] = useState(false)

      useEffect(() => {
        const loaded = getForm(formId)
        if (loaded) setForm(loaded)
        else setMissing(true)
      }, [formId])

      if (missing) notFound()

      if (!form) {
        return (
          <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        )
      }

      return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
          <Container maxWidth="md">
            <Paper sx={{ p: 3, mb: 2, borderTop: '10px solid', borderTopColor: 'primary.main' }}>
              <Typography variant="h4" gutterBottom>
                {form.title}
              </Typography>
              <Typography variant="body1">{form.description}</Typography>
            </Paper>
            <Paper sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Form preview functionality coming soon...
              </Typography>
            </Paper>
          </Container>
        </Box>
      )
    }

(This also makes the previously dead `if (!form) notFound()` real.)

### `app/forms/_components/recent-forms-section.tsx` — hydrate from store

Read the CURRENT file first. Replace the static
`import formsData from '../../data/forms.json'`-style usage with store
hydration on mount, deriving card models from templates. Keep the existing
card grid, `onRename`/`onRemove` prop flow into `FormCard` untouched — only
the data source changes:

    import { deleteForm, listForms, renameForm } from '@/app/lib/forms-store'
    import type { Form, FormTemplate } from '@/app/types'
    import { TEMPLATES } from '../constants/templates'

    // inside the component:
    const [forms, setForms] = useState<Form[]>([])
    useEffect(() => {
      const templates = listForms()
      setForms(
        templates.map((t: FormTemplate, i: number) => ({
          id: t.id,
          name: t.title || 'Untitled Form',
          thumbnailUrl:
            t.thumbnailUrl ||
            TEMPLATES[i % TEMPLATES.length].thumbnailUrl,
          shared: false,
          lastOpen: '',
        })),
      )
    }, [])

    const handleRename = (id: string, newName: string) => {
      renameForm(id, newName)
      setForms((prev) =>
        prev.map((f) => (f.id === id ? { ...f, name: newName } : f)),
      )
    }

    const handleRemove = (id: string) => {
      deleteForm(id)
      setForms((prev) => prev.filter((f) => f.id !== id))
    }

Pass `onRename={handleRename}` / `onRemove={handleRemove}` where FormCard is
rendered. If the old code kept forms in a different state shape, adapt names
but NOT the store calls. Delete the JSON import and any now-unused vars.

NOTE: check whether `FormTemplate` gains an optional `thumbnailUrl?: string`
field in `app/types.ts` (add it if absent — optional, so nothing else breaks).

### `app/forms/_components/template-card.tsx` — create + persist + navigate

Replace the onClick (keep plan-002's keyboard attrs intact):

    onClick={() => {
      const form = createForm(template.name)
      router.push(`/forms/${form.id}/edit`)
    }}

with `import { createForm } from '@/app/lib/forms-store'` added.

## Repo conventions to follow

- Single quotes/no semicolons in edit-form.tsx, recent-forms-section.tsx,
  template-card.tsx, types.ts; double quotes/semicolons in preview page's
  neighbors — match each file you touch.
- Client data hooks exemplar: `recent-forms-section.tsx` already uses
  `useState`; `edit-form-header.tsx:24-26` shows `useParams` usage.
- Store module lives under `app/lib/` (new dir) — plain functions, no classes,
  no React imports.

## Steps

1. Create `app/lib/forms-store.ts` exactly as specified.
2. Rewrite `edit/page.tsx`.
3. Apply edit-form.tsx changes (signature, state, two effects, guards).
4. Rewrite `preview/page.tsx`.
5. Rewire `recent-forms-section.tsx` (+ add `thumbnailUrl?` to FormTemplate).
6. Update `template-card.tsx` onClick.
7. Grep for leftovers: `INITIAL_FORM` must have zero remaining references;
   `data/forms.json` import gone from client code.
8. Re-read diff for unrelated churn.

## Boundaries

- Do NOT wire search filtering (separate finding, not selected).
- Do NOT modify the API routes under `app/api/**` (they stay as inert stubs).
- Do NOT add dependencies, IndexedDB, or abstraction layers beyond the one
  module.
- Do NOT change visual design of any page (spinner styling aside).
- Do NOT touch question-card/options-editor/question-view-content.
- STOP if edit-form.tsx doesn't match plan-004's post-state (handlers must be
  functional updaters); execute plan 004 FIRST.

## Verification

- **Mechanical**: `bun run lint && bun run build` pass; grep confirms no
  `INITIAL_FORM` remains; `npx react-doctor@latest` full scan score ≥ previous.
- **Behavior check** (`bun run start`):
  1. First-ever visit (fresh profile/incognito): `/forms` shows exactly one
     "Untitled Form" card.
  2. Click it → editor loads that form (spinner briefly). Rename via title
     field, add a checkbox question with two options.
  3. Refresh the browser → edits are STILL THERE (before: everything reset).
  4. Back on `/forms`: card shows the new title; ⋮ → Rename works and
     persists after refresh; ⋮ → Remove deletes the card AND refresh keeps it
     deleted; clicking "Move to trash" then revisiting `/forms/<deleted-id>/edit`
     renders the styled 404 (plan 006 boundary), not a crash.
  5. Template card click creates a NEW persisted form titled after the
     template; preview route shows its saved title/description.
  6. DevTools → Application → Local Storage shows `gfc:forms` JSON array.
  7. SSR sanity: hard-refresh `/forms` — no hydration mismatch errors in console.
- **Done when**: the full create→edit→refresh→rename→delete matrix survives
  reloads and all checks pass.
