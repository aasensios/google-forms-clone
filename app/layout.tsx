import './globals.css'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import ThemeModeProvider from '@/app/theme-provider'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

export const metadata = {
  title: 'Google Forms clone',
  description: 'Exercise to replicate Google Forms web app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript />
        <AppRouterCacheProvider>
          <ThemeModeProvider>{children}</ThemeModeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
