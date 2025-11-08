import './globals.css'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'

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
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
