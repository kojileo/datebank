import { Box, Container, Flex } from '@chakra-ui/react'
import Navbar from './Navbar'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <Box minH="100vh">
        <Navbar />
        <Box as="main">
          {children}
        </Box>
      </Box>
    )
  }