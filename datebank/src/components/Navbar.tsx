import {
  Box,
  Flex,
  Button,
  useColorMode,
  useColorModeValue,
  IconButton,
  HStack,
  Container,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar
} from '@chakra-ui/react'
import { FiSun, FiMoon, FiUser } from 'react-icons/fi'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { data: session } = useSession()
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box 
      bg={bg} 
      borderBottom="1px" 
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex="sticky"
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Text 
            fontSize="xl" 
            fontWeight="bold"
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
          >
            DateBank
          </Text>

          <HStack spacing={4}>
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
              variant="ghost"
              _hover={{
                bg: useColorModeValue('gray.100', 'gray.700')
              }}
            />
            
            {session ? (
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  rounded="full"
                  padding={0}
                  minW={10}
                >
                  {session.user?.image ? (
                    <Avatar 
                      size="sm" 
                      src={session.user.image}
                      name={session.user.name || undefined}
                    />
                  ) : (
                    <FiUser />
                  )}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => signOut()}>
                    ログアウト
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button 
                onClick={() => signIn('google')}
                colorScheme="blue"
                size="sm"
              >
                ログイン
              </Button>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}