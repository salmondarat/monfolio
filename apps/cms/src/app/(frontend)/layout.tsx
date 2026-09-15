import React from 'react'

export const metadata = {
  title: 'Monfolio CMS',
  description: 'Content management for the Monfolio website.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
