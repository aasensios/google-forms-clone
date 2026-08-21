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
            An unexpected error occurred. Your forms are saved locally and were
            not affected.
          </Typography>
          <Button variant="contained" onClick={reset}>
            Try again
          </Button>
        </Paper>
      </Container>
    </Box>
  )
}
