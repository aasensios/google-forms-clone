import { createTheme } from '@mui/material'
import { deepPurple } from '@mui/material/colors'

export const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: deepPurple,
        background: { default: '#f0ebf8', paper: '#ffffff' },
        text: { primary: '#3c4043' },
      },
    },
    dark: {
      palette: {
        primary: { main: deepPurple[300], light: deepPurple[200], dark: deepPurple[400] },
        background: { default: '#1e1e1e', paper: '#2d2d2d' },
        text: { primary: '#e8eaed' },
      },
    },
  },
  typography: {
    fontFamily: 'var(--font-inter), sans-serif',
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
