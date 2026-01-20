'use client'

import { theme } from '@/app/theme'
import { ThemeProvider } from '@mui/material'

export default function FormsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
