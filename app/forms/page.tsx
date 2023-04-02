'use client'

// import { Roboto_Flex } from 'next/font/google'
import { Box, ThemeProvider } from '@mui/material'
import AppBar from '@/app/components/AppBar'
import NewFormSection from '@/app/components/NewFormSection'
import { theme } from '@/app/theme'

// const roboto = Roboto_Flex({
//   weight: ['400', '700'],
//   subsets: ['latin'],
// })

export default function Forms() {
  return (
    <ThemeProvider theme={theme}>
      <main
      // className={roboto.className}
      >
        <Box sx={{ color: 'grey.700' }}>
          <AppBar />
          <NewFormSection />
        </Box>
      </main>
    </ThemeProvider>
  )
}
