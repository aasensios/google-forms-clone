# Plans

Audit date: 2026-08-22 (baseline commit `902270e`, React Doctor score 100).
Source: improve-react audit — findings 1–3, 5 plus user-selected missed
opportunities (localStorage persistence, route boundaries, dark-mode tab
contrast).

## Execution order

| # | Plan | Status | Depends on |
|---|------|--------|------------|
| 1 | [001 — Pass question ids to SortableContext](001-sortable-context-item-ids.md) | DONE | — |
| 2 | [003 — Give icon buttons accessible names](003-accessible-names-icon-buttons.md) | DONE | — |
| 3 | [007 — Fix dark-mode selected-tab contrast](007-dark-mode-tab-contrast.md) | DONE | — |
| 4 | [002 — Make card activation surfaces keyboard-accessible](002-keyboard-accessible-card-surfaces.md) | DONE | — |
| 5 | [004 — Standardize edit-form mutations on functional updaters](004-functional-state-updaters-edit-form.md) | DONE | — |
| 6 | [006 — Add route error and not-found boundaries](006-route-boundaries.md) | DONE | — |
| 7 | [005 — Persist forms in localStorage behind a store module](005-local-persistence.md) | DONE — wiring superseded by 008 | 002, 004, 006 |
| 8 | [008 — Make forms-store reactive via useSyncExternalStore](008-reactive-forms-store.md) | DONE | 005 |

Plans 1–6 are mutually independent and can execute in any order; the listed
sequence runs quickest verifications first. **Plan 005 must run last** — it
rewrites files touched by 002 (template-card), 004 (edit-form), and depends on
006's styled 404 for its missing-id behavior check.

## Not planned (explicitly out of scope)

- Real backend/API persistence — replaced by localStorage per user decision.
- Search bar filtering (finding #6) and option-identity refactor (#4),
  duplicate-text keys (#8), polish cluster (#9) — not selected.
- Measurement-gated perf items (editor keystroke re-renders, eager thumbnails)
  — need Profiler/Network evidence first.
