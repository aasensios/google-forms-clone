import { Roboto_Flex } from 'next/font/google'
import { createTheme } from '@mui/material'

const roboto = Roboto_Flex({
  weight: ['400', '700'],
  subsets: ['latin'],
})

export const theme = createTheme({
  typography: {
    fontFamily: [roboto.style.fontFamily, 'sans-serif'].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          paddingInline: 16,
          textTransform: 'none',
        },
      },
    },
  },
})
