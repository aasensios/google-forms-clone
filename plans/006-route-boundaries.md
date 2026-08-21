# 006 — Add route error and not-found boundaries

- **Status**: DONE
- **Commit**: 902270e
- **Severity**: MEDIUM
- **Category**: Maintainability & architecture (missed opportunity)
- **Rule**: Beyond the scan
- **Estimated scope**: 2 new files

## Problem

No `error.tsx`, `global-error.tsx`, `not-found.tsx`, or `loading.tsx` exists
anywhere under `app/` (verified by glob). Any runtime throw inside a route
unmounts to Next's default unstyled crash screen, and unknown URLs get the
default Next 404 — both jarring in an otherwise fully themed MUI app. Plan 005
makes `notFound()` calls real (deleted/missing form ids), so a styled 404 is
required for its behavior check.

A `loading.tsx` is deliberately NOT added: all data loading is synchronous
localStorage reads (plan 005), so there is nothing to suspend.

## Target

### New file: `app/error.tsx`

    'use client'

    import { Box, Button, Container, Paper, Typography } from '@mui/material'
    import { useEffect } from 'react'

    export default function Error({
      error,
      reset,
    }: {
      error: Error & { digest?: string }
      reset: () => void
    }) {
      useEffect(() => {
        console.error(error)
      }, [error])

      return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8 }}>
          <Container maxWidth="sm">
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                borderTop: '10px solid',
                borderTopColor: 'error.main',
              }}
            >
              <Typography variant="h5" gutterBottom>
                Something went wrong
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                An unexpected error occurred. Your forms are saved locally and
                were not affected.
              </Typography>
              <Button variant="contained" onClick={reset}>
                Try again
              </Button>
            </Paper>
          </Container>
        </Box>
      )
    }

(`console.error` here is the documented Next.js error-boundary pattern; it is
the single sanctioned console call despite the repo having none.)

### New file: `app/not-found.tsx`

    'use client'

    import { Box, Button, Container, Paper, Typography } from '@mui/material'
    import Link from 'next/link'

    export default function NotFound() {
      return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8 }}>
          <Container maxWidth="sm">
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                borderTop: '10px solid',
                borderTopColor: 'primary.main',
              }}
            >
              <Typography variant="h5" gutterBottom>
                404 — Form not found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                The form you&rsquo;re looking for doesn&rsquo;t exist or was
                deleted.
              </Typography>
              <Button component={Link} href="/forms" variant="contained">
                Back to Forms
              </Button>
            </Paper>
          </Container>
        </Box>
      )
    }

## Repo conventions to follow

- Page-level styling exemplar: `app/forms/[id]/preview/page.tsx` (full-bleed
  `bgcolor: 'background.default'` + `Paper` cards + `Container maxWidth`).
- Single quotes, no semicolons (matches app/page.tsx, theme.ts).
- `Button component={Link}` pattern keeps next/link client routing.

## Steps

1. Create `app/error.tsx` with the exact target.
2. Create `app/not-found.tsx` with the exact target.
3. Re-read diff; no other file changes.

## Boundaries

- Do NOT add `loading.tsx`, `global-error.tsx`, or route-segment boundaries.
- Do NOT touch existing pages.
- Do NOT add dependencies.
- STOP if `plans/005-local-persistence.md` is not yet applied AND you cannot
  verify the 404 path — then verify only via an unknown URL like `/nope`.

## Verification

- **Mechanical**: `bun run lint && bun run build` pass.
- **Behavior check** (`bun run start`):
  - Visit `/definitely-not-a-route` → styled "404 — Form not found" card on
    themed background; "Back to Forms" navigates client-side to `/forms`.
  - If plan 005 applied: delete a form, visit `/forms/<its-id>/edit` → same
    styled 404 (not Next's default).
  - Error boundary: temporarily add `throw new Error('test')` at the top of
    `EditForm`'s return path, load an edit page → styled "Something went
    wrong"; click "Try again" → recovers or stays styled (never the raw Next
    crash overlay in production build). REMOVE the throw afterwards and
    confirm with grep.
- **Done when**: both boundaries render themed UI and all checks pass.
