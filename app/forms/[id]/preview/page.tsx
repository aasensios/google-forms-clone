import type { FormTemplate } from '@/app/types'
import { notFound } from 'next/navigation'
import { Box, Container, Paper, Typography } from '@mui/material'

// Mock initial data - in a real app this would come from an API/DB
const INITIAL_FORM: FormTemplate = {
  id: '1',
  title: 'Untitled Form',
  description: 'Form description',
  questions: [
    {
      id: 'q1',
      title: 'Untitled Question',
      type: 'radio',
      options: ['Option 1'],
      required: false,
    },
  ],
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // In a real app we'd fetch the data
  const form = { ...INITIAL_FORM, id }

  if (!form) {
    notFound()
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
