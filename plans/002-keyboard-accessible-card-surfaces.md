# 002 — Make card activation surfaces keyboard-accessible

- **Status**: DONE
- **Commit**: 902270e
- **Severity**: HIGH
- **Category**: Accessibility
- **Rule**: react-doctor/click-events-have-key-events (+ no-static-element-interactions, same fix family)
- **Estimated scope**: 4 files, ~40 lines

## Problem

Four click-activation surfaces are non-interactive elements (`div`-based) with
`onClick` but no `role`, `tabIndex`, or keyboard handler. Keyboard-only users
cannot: open a recent form, create a form from a template, or activate an
inactive question into edit mode — and question delete/duplicate/options/type
controls all live behind that last one.

Canonical fix recipe (react-doctor/click-events-have-key-events): "Prefer
replacing the static element with a native `<button>` … If the div must stay,
add an `onKeyDown` handler that fires the same callback when `event.key` is
`'Enter'` or `' '`, plus `role='button'` and `tabIndex={0}`."

Native `<button>` is NOT viable here because each surface contains other
interactive elements (MUI Menu IconButton inside form-card; drag handle and
edit controls inside question-card) — nesting buttons is invalid HTML. So use
the div-with-role pattern on all four surfaces.

Current code (all four sites):

    // app/forms/[id]/edit/_components/question-card.tsx:37-38 — current
    <Paper
      onClick={onClick}
      data-active={isActive || undefined}

    // app/forms/[id]/edit/_components/question-view-content.tsx:23 — current
    <Box onClick={onClick} sx={{ cursor: "pointer" }}>

    // app/forms/_components/form-card.tsx:102-105 — current
    <MuiCard
      variant="outlined"
      elevation={0}
      onClick={() => router.push(`/forms/${form.id}/edit`)}

    // app/forms/_components/template-card.tsx:9-12 — current
    <MuiCard
      variant="outlined"
      elevation={0}
      onClick={() => router.push(`/forms/${crypto.randomUUID()}/edit`)}

Note: `question-view-content.tsx` sits INSIDE the `Paper` of
`question-card.tsx`, which will become focusable itself — so its own
`onClick` becomes redundant.

## Target

Shared handler shape (add inside each component, above the return):

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        onClick();
      }
    };

The `event.target === event.currentTarget` guard is REQUIRED where the surface
contains inputs/buttons (question-card's active state contains TextFields;
form-card contains the menu IconButton) — without it, Enter pressed inside an
inner input would re-trigger card activation. For template-card (no inner
interactive elements) the guard may be omitted but keeping it is fine.

Surface targets:

    // app/forms/[id]/edit/_components/question-card.tsx — target Paper props
    <Paper
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      data-active={isActive || undefined}
      sx={{
        // …existing sx unchanged, plus add:
        cursor: "pointer",
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: "-2px",
        },
      }}

    // app/forms/[id]/edit/_components/question-view-content.tsx — target
    <Box sx={{ cursor: "pointer" }}>
    // (remove its onClick entirely; the wrapping Paper handles mouse + keyboard)

    // app/forms/_components/form-card.tsx — target MuiCard props
    <MuiCard
      variant="outlined"
      elevation={0}
      role="button"
      tabIndex={0}
      aria-label={`Open form ${form.name}`}
      onClick={() => router.push(`/forms/${form.id}/edit`)}
      onKeyDown={handleKeyDown}
      sx={{
        // …existing sx unchanged, plus add:
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: "-2px",
        },
      }}

    // app/forms/_components/template-card.tsx — target MuiCard props
    <MuiCard
      variant="outlined"
      elevation={0}
      role="button"
      tabIndex={0}
      aria-label={`Create form from template ${template.name}`}
      onClick={() => router.push(`/forms/${crypto.randomUUID()}/edit`)}
      onKeyDown={handleKeyDown}
      sx={{
        // …existing sx unchanged, plus add:
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: "-2px",
        },
      }}

In form-card.tsx and template-card.tsx the components declare
`const router = useRouter()` already; name the keydown handler
`handleKeyDown` in both for consistency.

## Repo conventions to follow

- These files use double quotes + semicolons (question-card.tsx,
  question-view-content.tsx, form-card.tsx, template-card.tsx) — keep their
  existing style per file. questions-list-style single quotes are NOT used here.
- Focus-ring exemplar: `app/forms/_components/account-menu.tsx:32-38`
  (explicit outline on focus).
- Do not extract a shared util/hook — repo has no such abstraction yet and 4
  inline copies are acceptable at this size.

## Steps

1. `question-card.tsx`: add `handleKeyDown` (with guard), spread the target
   props onto `Paper`, merge the two new sx keys into the existing sx object.
2. `question-view-content.tsx`: remove `onClick` from the root `Box`; keep
   everything else. The `onClick` prop of this component becomes unused —
   remove it from the Props type AND from the JSX usage site
   `question-card.tsx:91-94` (`<QuestionViewContent question={question} />`).
3. `form-card.tsx`: add `handleKeyDown` (with guard), apply target props/sx.
4. `template-card.tsx`: add `handleKeyDown`, apply target props/sx.
5. Re-read the diff; remove unrelated churn.

## Boundaries

- Do NOT convert any Card/Paper into `<button>` or `component="button"` —
  nested-button HTML violation.
- Do NOT change routing behavior, menu behavior, or stopPropagation logic in
  form-card handlers.
- Do NOT touch the drag handle Box in question-card (plan 003 names it).
- Do NOT add dependencies or shared utilities.
- STOP if any file's surrounding code differs materially from the excerpts
  above; report drift instead of improvising.

## Verification

- **Mechanical**:
  - `bun run lint` passes.
  - `bun run build` passes.
  - `npx react-doctor@latest --scope changed` reports no new diagnostics and
    score stays 100.
- **Behavior check** (`bun run start`):
  - `/forms`: Tab reaches each form card → visible focus ring; Enter/Space
    navigates to its editor. Tab reaches each template card → Enter/Space
    creates + opens a form. Mouse click still works; the card's "Form actions"
    ⋮ button still opens the menu WITHOUT navigating (stopPropagation intact).
  - `/forms/<id>/edit`: Tab moves through cards; Enter/Space on an inactive
    card activates it (accent border + edit controls appear). Typing Enter
    INSIDE an active question's title/options TextField must NOT deactivate/
    reactivate anything (guard works).
  - Screen-reader spot check (macOS VO: Cmd+F5): cards announce as "button"
    with their labels.
- **Done when**: every listed interaction works via keyboard alone and checks
  pass.
