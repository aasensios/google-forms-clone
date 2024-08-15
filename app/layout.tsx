import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
