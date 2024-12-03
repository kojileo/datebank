'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'

const config = {
  initialColorMode: 'system',
  useSystemColorMode: true,
}

const theme = extendTheme({ config })

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <SessionProvider>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>
          {children}
        </ChakraProvider>
      </SessionProvider>
    </CacheProvider>
  )
}