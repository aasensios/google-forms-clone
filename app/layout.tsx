import './globals.css'

export const metadata = {
  title: 'TrustMe',
  description: 'Google Forms clone',
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
