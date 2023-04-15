'use client'

import { Box, ThemeProvider } from '@mui/material'
import { theme } from '@/app/theme'
import AppBar from '@/app/components/AppBar'
import TemplatesSection from '@/app/components/TemplatesSection'
import RecentFormsSection from '@/app/components/RecentFormsSection'

export default function Forms() {
  return (
    <ThemeProvider theme={theme}>
      <main>
        <Box sx={{ color: 'grey.700' }}>
          <AppBar />
          <TemplatesSection />
          <RecentFormsSection />
        </Box>
      </main>
    </ThemeProvider>
  )
}
