'use client'

import type { FormTemplate } from '@/app/types'
import { notFound } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Box, CircularProgress, Container, Paper, Typography } from '@mui/material'
import { useSyncExternalStore } from 'react'
import {
  getFormsSnapshot,
  subscribeForms,
} from '@/app/lib/forms-store'

export default function PreviewPage() {
  const params = useParams<{ id: string }>()
  const formId = params.id
  const forms = useSyncExternalStore(
    subscribeForms,
    getFormsSnapshot,
    () => null as FormTemplate[] | null,
  )
  const form =
    forms === null ? null : (forms.find((f) => f.id === formId) ?? null)

  if (forms !== null && !form) notFound()

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
