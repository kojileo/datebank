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
  Avatar,
  MenuDivider,
  VStack,
  MenuGroup,
  Tooltip,
  useToast
} from '@chakra-ui/react'
import { FiSun, FiMoon, FiUser, FiLogOut, FiLogIn, FiSettings } from 'react-icons/fi'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { data: session, status } = useSession()
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const toast = useToast()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      toast({
        title: 'ログインに失敗しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      })
    }
  }

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut({ callbackUrl: '/' })
      toast({
        title: 'ログアウトしました',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      })
    } catch (error) {
      toast({
        title: 'ログアウトに失敗しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      })
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <Box 
      bg={bg} 
      borderBottom="1px" 
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex="sticky"
      backdropFilter="blur(8px)"
      backgroundColor={useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)')}
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Text 
            fontSize="xl" 
            fontWeight="bold"
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
            cursor="pointer"
            onClick={() => window.location.href = '/'}
          >
            カップルプラン
          </Text>

          <HStack spacing={4}>
            <Tooltip label={colorMode === 'light' ? 'ダークモード' : 'ライトモード'}>
              <IconButton
                aria-label="Toggle color mode"
                icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
                onClick={toggleColorMode}
                variant="ghost"
                _hover={{
                  bg: useColorModeValue('gray.100', 'gray.700')
                }}
              />
            </Tooltip>
            
            {status === 'loading' ? (
              <Button size="sm" isLoading variant="ghost">
                Loading...
              </Button>
            ) : session ? (
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  rounded="full"
                  padding={2}
                  display="flex"
                  alignItems="center"
                >
                  <HStack spacing={2}>
                    <Avatar 
                      size="sm" 
                      src={session.user?.image || undefined}
                      name={session.user?.name || undefined}
                    />
                    <Text 
                      display={{ base: 'none', md: 'block' }}
                      maxW="150px" 
                      overflow="hidden" 
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {session.user?.name}
                    </Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuGroup title="プロフィール">
                    <MenuItem>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">{session.user?.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {session.user?.email}
                        </Text>
                      </VStack>
                    </MenuItem>
                  </MenuGroup>
                  <MenuDivider />
                  <MenuItem 
                    icon={<FiSettings />}
                    onClick={() => window.location.href = '/settings'}
                  >
                    設定
                  </MenuItem>
                  <MenuItem 
                    icon={<FiLogOut />}
                    onClick={handleSignOut}
                    isDisabled={isSigningOut}
                  >
                    {isSigningOut ? 'ログアウト中...' : 'ログアウト'}
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button 
                leftIcon={<FiLogIn />}
                onClick={handleSignIn}
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