import { Box, Text } from '@chakra-ui/react'

export default function Footer() {
  return (
    <Box as="footer" py={4} textAlign="center" bg="gray.100">
      <Text fontSize="sm" color="gray.600">
        © 2023 カップルプラン. All rights reserved.
      </Text>
    </Box>
  )
}