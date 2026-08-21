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
