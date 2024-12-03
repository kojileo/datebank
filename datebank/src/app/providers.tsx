'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'

const config = {
  initialColorMode: 'light', // デフォルトのカラーモードを'light'に設定
  useSystemColorMode: false,  // システムのカラーモード設定を無効化
}

const theme = extendTheme({ config })

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CacheProvider>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          {children}
        </ChakraProvider>
      </CacheProvider>
    </SessionProvider>
  )
}