# 007 — Fix dark-mode selected-tab contrast

- **Status**: DONE
- **Commit**: 902270e
- **Severity**: MEDIUM
- **Category**: Accessibility (contrast, WCAG 1.4.3 AA)
- **Rule**: Beyond the scan
- **Estimated scope**: 1 file, ~8 lines

## Problem

`app/forms/[id]/edit/_components/edit-form-header.tsx:46-51` renders the tab
strip with `textColor="primary"` on `bgcolor: 'background.paper'`. In dark
mode that resolves to `palette.primary.main` = deepPurple[300] = **#9575cd**
(`app/theme.ts:16`) on paper **#2d2d2d** (`app/theme.ts:17`).

Computed contrast: **3.74:1** — below the WCAG AA minimum of 4.5:1 for normal
text (~14px tab labels). Every session's primary navigation is affected in
dark mode.

Current code:

    // app/theme.ts:29-31 — current
    MuiTab: {
      styleOverrides: { root: { textTransform: 'none' } },
    },

## Target

Scope the fix to dark mode only — do NOT change `palette.primary.main`
globally: white-on-primary button/FAB text would drop to ~2.4:1 and regress
every contained button.

`deepPurple[200]` (#b39ddb) on #2d2d2d computes to **~5.7:1** — passes AA with
headroom. It is already exported as dark `palette.primary.light`
(`theme.ts:16`), so no new color values enter the theme.

    // app/theme.ts:29-31 — target
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: 'none',
          '&.Mui-selected': {
            color: theme.palette.primary.main,
            ...theme.applyStyles('dark', {
              color: theme.palette.primary.light,
            }),
          },
        }),
      },
    },

The explicit `color: theme.palette.primary.main` base keeps light mode
byte-identical (light selected tabs currently use primary.main at a computed
7.3:1 — passing). Nesting `theme.applyStyles(...)` inside a selector object is
the established repo pattern:

    // exemplar — app/forms/_components/account-menu.tsx:141-146
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.grey[700],
      }),
    },

(The project runs with `cssVariables: true`, so `applyStyles` emits a
`prefers-color-scheme` media query — no `.dark` class dependency.)

## Repo conventions to follow

- styleOverrides-as-callback is standard MUI v9; this is the file's first one,
  so imitate the account-menu.tsx applyStyles nesting shown above.
- Single quotes, no semicolons, 2-space indent.

## Steps

1. Replace the `MuiTab` entry in `app/theme.ts` with the exact target.
2. Re-read diff; nothing else changes.

## Boundaries

- Do NOT modify `palette.primary` values, other components' overrides, or any
  component file.
- Do NOT introduce hardcoded hex colors.
- STOP if theme.ts differs from the commit stamp.

## Verification

- **Mechanical**: `bun run lint && bun run build` pass; `npx
  react-doctor@latest` score unchanged.
- **Behavior check**:
  - Serve, open `/forms/<any-id>/edit`, toggle OS appearance to dark → the
    active tab label reads clearly against the paper bar; light mode tabs look
    pixel-identical to before.
  - Optional precise check: DevTools eyedropper the rendered selected-tab
    color (#b39ddb) and bar (#2d2d2d) and recompute ≈5.7:1 ≥ 4.5:1.
  - Confirm unselected tabs, indicators, buttons, FAB are visually unchanged.
- **Done when**: dark selected-tab contrast computes ≥ 4.5:1, light mode is
  unchanged, checks pass.
