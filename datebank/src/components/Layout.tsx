import { Box, Container, Flex } from '@chakra-ui/react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex direction="column" minH="100vh">
      <Navbar />
      <Container maxW="container.xl" flex="1" py={8}>
        <Box>{children}</Box>
      </Container>
      <Footer />
    </Flex>
  )
}