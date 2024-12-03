import { Providers } from './providers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'カップルプラン',
  description: 'デートスポットを管理するアプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}