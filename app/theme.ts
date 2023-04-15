import { Inter, Roboto_Flex } from 'next/font/google'
import { createTheme } from '@mui/material'

const inter = Inter({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
})

const robotoFlex = Roboto_Flex({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
})

export const theme = createTheme({
  typography: {
    fontFamily: [inter.style.fontFamily, 'sans-serif'].join(','),
    // allVariants: {
    //   color: '#3c4043',
    // },
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
