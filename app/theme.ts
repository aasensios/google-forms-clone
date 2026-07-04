import { Inter } from 'next/font/google'
import { createTheme } from '@mui/material'

const inter = Inter({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
})

export const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        background: { default: '#f0ebf8', paper: '#ffffff' },
        text: { primary: '#3c4043' },
      },
    },
    dark: {
      palette: {
        background: { default: '#1e1e1e', paper: '#2d2d2d' },
        text: { primary: '#e8eaed' },
      },
    },
  },
  typography: {
    fontFamily: [inter.style.fontFamily, 'sans-serif'].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: { root: { textTransform: 'none' } },
    },
    MuiTab: {
      styleOverrides: { root: { textTransform: 'none' } },
    },
  },
})
