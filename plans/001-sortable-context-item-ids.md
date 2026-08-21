# 001 — Pass question ids to SortableContext

- **Status**: DONE
- **Commit**: 902270e
- **Severity**: HIGH
- **Category**: Bugs & correctness
- **Rule**: Beyond the scan (dnd-kit API misuse; scanner-invisible)
- **Estimated scope**: 1 file, 1 line

## Problem

`app/forms/[id]/edit/_components/questions-list.tsx:59` passes full `Question`
objects where dnd-kit's `SortableContext` requires an array of identifiers
(`string | number`). dnd-kit internally resolves the active item with
`items.indexOf(active.id)`; `active.id` is the question id string, so indexOf
returns `-1` for every lookup. Consequences on the app's hottest interaction:

- `verticalListSortingStrategy` cannot compute displacement, so sibling cards
  do not shift live while dragging.
- Keyboard sorting (Space to lift, arrows to move — `KeyboardSensor` is already
  configured at lines 45–50) silently does nothing.
- The final drop still lands correctly only because `handleDragEnd` in
  `edit-form.tsx` re-derives indexes from ids itself.

Current code:

    // app/forms/[id]/edit/_components/questions-list.tsx:59 — current
    <SortableContext items={questions} strategy={verticalListSortingStrategy}>

## Target

    // target
    <SortableContext
      items={questions.map((question) => question.id)}
      strategy={verticalListSortingStrategy}
    >

The option-level `SortableContext` in
`app/forms/[id]/edit/_components/question-options-editor.tsx:260-262` is
already correct (`items={optionIds}`, a string array) — do not touch it.

## Repo conventions to follow

- Plain arrow functions inline in JSX props are used throughout this file.
- No new imports needed; `questions` is already typed `Question[]`.

## Steps

1. At `app/forms/[id]/edit/_components/questions-list.tsx:59`, apply the exact
   target above. Preserve surrounding behavior and formatting (this file uses
   single quotes, no semicolons).
2. Re-read the diff and remove unrelated churn.

## Boundaries

- Do NOT change any other prop of `SortableContext`, `DndContext`, or
  `SortableQuestion`.
- Do NOT touch `handleDragEnd` in `edit-form.tsx` — it stays correct.
- Do NOT refactor the option editor.
- Do NOT add dependencies.
- STOP if line 59 no longer reads `<SortableContext items={questions}` — the
  file has drifted; report instead of improvising.

## Verification

- **Mechanical**:
  - `bun run lint` passes.
  - `bun run build` passes (Turbopack).
- **Behavior check**: Serve with `bun run start`, open `/forms/<any-id>/edit`,
  add a second question via the FAB, then:
  - Drag one question below/above the other → siblings must displace smoothly
    during the drag (before the fix they snap only on release).
  - Tab to a drag handle, press Space to lift, press ArrowDown → the card must
    actually move down live (before the fix nothing moved).
- **Done when**: both interactions visibly displace siblings mid-drag and all
  checks pass.
