# 004 — Standardize edit-form mutations on functional updaters

- **Status**: DONE
- **Commit**: 902270e
- **Severity**: MEDIUM
- **Category**: Bugs & correctness
- **Rule**: Beyond the scan (lost-update class; exhaustive-deps adjacent)
- **Estimated scope**: 1 file, ~60 lines rewritten

## Problem

`app/forms/[id]/edit/_components/edit-form.tsx` mixes two state-update idioms.
Four handlers correctly use functional updaters (`handleTitleChange`:24,
`handleDescriptionChange`:28, `addQuestion`:40, `updateQuestion`:48,
`deleteQuestion`:74, `handleDragEnd`:130), but five derive new state from the
render-closure `form` before calling `setForm`, reintroducing stale-snapshot
lost updates when events batch:

    // edit-form.tsx:56-71 — current (duplicateQuestion)
    const duplicateQuestion = (id: string) => {
      const questionIndex = form.questions.findIndex((q) => q.id === id)
      if (questionIndex === -1) return
      const questionToDuplicate = form.questions[questionIndex]
      const newQuestion = { ...questionToDuplicate, id: crypto.randomUUID() }
      const newQuestions = [...form.questions]
      newQuestions.splice(questionIndex + 1, 0, newQuestion)
      setForm((prev) => ({ ...prev, questions: newQuestions }))
      setActiveQuestionId(newQuestion.id)
    }

Two rapid Duplicate clicks batched into one commit both splice into the SAME
snapshot — the second result overwrites the first and one copy vanishes. Same
closure-read pattern: `handleOptionChange`:86, `addOption`:95, 
`addOtherOption`:113, `removeOption`:120.

## Target

Rewrite the five handlers to compute exclusively from `prev`. File uses single
quotes, no semicolons. `OTHER_LABEL` also moves to module scope (it is a pure
constant currently rebuilt per render at line 83):

    // module scope, directly ABOVE `export default function EditForm(...)`
    const OTHER_LABEL = 'Other…'

    const duplicateQuestion = (id: string) => {
      const newId = crypto.randomUUID()
      setForm((prev) => {
        const questionIndex = prev.questions.findIndex((q) => q.id === id)
        if (questionIndex === -1) return prev
        const questions = [...prev.questions]
        questions.splice(questionIndex + 1, 0, {
          ...prev.questions[questionIndex],
          id: newId,
        })
        return { ...prev, questions }
      })
      setActiveQuestionId(newId)
    }

    const handleOptionChange = (
      qId: string,
      optIndex: number,
      value: string,
    ) => {
      setForm((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === qId && q.options
            ? {
                ...q,
                options: q.options.map((opt, i) =>
                  i === optIndex ? value : opt,
                ),
              }
            : q,
        ),
      }))
    }

    const addOption = (qId: string) => {
      setForm((prev) => ({
        ...prev,
        questions: prev.questions.map((q) => {
          if (q.id !== qId) return q
          const options = q.options || []
          const otherIndex = options.findIndex((opt) => opt === OTHER_LABEL)
          const maxNum = options.reduce((max, opt) => {
            const match = opt.match(/^Option (\d+)$/)
            return match ? Math.max(max, parseInt(match[1])) : max
          }, 0)
          const newOption = `Option ${maxNum + 1}`
          const newOptions = [...options]
          if (otherIndex !== -1) {
            newOptions.splice(otherIndex, 0, newOption)
          } else {
            newOptions.push(newOption)
          }
          return { ...q, options: newOptions }
        }),
      }))
    }

    const addOtherOption = (qId: string) => {
      setForm((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === qId && !q.options?.some((opt) => opt === OTHER_LABEL)
            ? { ...q, options: [...(q.options || []), OTHER_LABEL] }
            : q,
        ),
      }))
    }

    const removeOption = (qId: string, optIndex: number) => {
      setForm((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === qId && q.options
            ? { ...q, options: q.options.filter((_, i) => i !== optIndex) }
            : q,
        ),
      }))
    }

Notes:
- `duplicateQuestion` generates `newId` OUTSIDE the updater (updaters must be
  pure — StrictMode double-invokes them) and activates it optimistically;
  the updater itself no-ops (`return prev`) if the source vanished.
- Delete the now-unused inner `OTHER_LABEL` at old line 83.
- All other handlers stay exactly as they are.

## Repo conventions to follow

- Functional-updater exemplar in the same file: `edit-form.tsx:47-54`
  (`updateQuestion`). Match its spread style.
- Single quotes, no semicolons, 2-space indent (this file).

## Steps

1. Move `OTHER_LABEL` to module scope above the component.
2. Replace the five handlers with the exact targets above.
3. Re-read the diff — only these six regions may change.

## Boundaries

- Do NOT touch `addQuestion`, `updateQuestion`, `deleteQuestion`,
  `handleDragEnd`, `activeQuestionId` semantics, or any JSX below line 142.
- Do NOT introduce a reducer, useReducer, or extract helpers to new files.
- Do NOT reorder exports or change the component's props interface.
- STOP if the file drifts from the commit stamp (e.g., plan 005 already
  applied) — report instead of improvising.

## Verification

- **Mechanical**: `bun run lint && bun run build` pass.
- **Behavior check** (`bun run start`, `/forms/<any-id>/edit`):
  - Add option → rename it → quickly click Duplicate twice on the same
    question → THREE total copies appear (before: sometimes two).
  - Add option appears before "Other…" and numbering continues (`Option 2`,
    never colliding); "add Other" twice yields ONE Other row; remove middle
    option keeps remaining values intact; drag-reorder still works.
- **Done when**: all editor actions behave identically to before under normal
  clicking AND the rapid-double-click duplicate case retains both copies.
