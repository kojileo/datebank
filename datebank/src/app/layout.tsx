import { Providers } from './providers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DateBank',
  description: 'デートスポットを管理するアプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}