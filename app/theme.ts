import { createTheme } from '@mui/material'

export const theme = createTheme({
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
