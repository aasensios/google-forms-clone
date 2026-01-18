'use client'

import { Box, ThemeProvider } from '@mui/material'
import { theme } from '@/app/theme'
import AppBar from '@/app/components/app-bar'
import TemplatesSection from '@/app/components/templates-section'
import RecentFormsSection from '@/app/components/recent-forms-section'

export default function Forms() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        component="main"
        sx={{
          backgroundColor: 'background.default',
          color: 'grey.700',
          minHeight: '100dvh',
        }}
      >
        <AppBar />
        <TemplatesSection />
        <RecentFormsSection />
      </Box>
    </ThemeProvider>
  )
}
