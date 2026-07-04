'use client'

import { Box } from '@mui/material'
import AppBar from './_components/app-bar'
import TemplatesSection from './_components/templates-section'
import RecentFormsSection from './_components/recent-forms-section'

export default function Forms() {
  return (
    <Box
      component="main"
      sx={{
        backgroundColor: 'background.default',
        color: 'text.primary',
        minHeight: '100dvh',
      }}
    >
      <AppBar />
      <TemplatesSection />
      <RecentFormsSection />
    </Box>
  )
}
