'use client'

import { Box, ThemeProvider } from '@mui/material'
import AppBar from '@/app/components/AppBar'
import NewFormSection from '@/app/components/NewFormSection'
import { theme } from '@/app/theme'

export default function Forms() {
  return (
    <ThemeProvider theme={theme}>
      <main>
        <Box sx={{ color: 'grey.700' }}>
          <AppBar />
          <NewFormSection />
        </Box>
      </main>
    </ThemeProvider>
  )
}
