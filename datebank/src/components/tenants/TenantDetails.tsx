import {
    Box,
    VStack,
    Heading,
    Text,
    Avatar,
    HStack,
    Button,
    useDisclosure,
    Divider,
    useToast,
    Badge
  } from '@chakra-ui/react'
  import { useEffect, useState } from 'react'
  import TenantInviteForm from './TenantInviteForm'
  
  interface User {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
  
  interface TenantDetailsProps {
    tenantId: string
  }
  
  export default function TenantDetails({ tenantId }: TenantDetailsProps) {
    const [tenant, setTenant] = useState<{
      id: string
      name: string
      users: User[]
      createdAt: string
    } | null>(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
  
    const fetchTenantDetails = async () => {
      try {
        const response = await fetch(`/api/tenants/${tenantId}`)
        if (!response.ok) throw new Error('テナント情報の取得に失敗しました')
        const data = await response.json()
        setTenant(data)
      } catch (error) {
        toast({
          title: 'エラーが発生しました',
          description: error instanceof Error ? error.message : '予期せぬエラーが発生しました',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
  
    useEffect(() => {
      if (tenantId) {
        fetchTenantDetails()
      }
    }, [tenantId])
  
    if (!tenant) return null
  
    return (
      <Box p={4} borderWidth="1px" borderRadius="lg">
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between">
            <Heading size="md">{tenant.name}</Heading>
            <Button size="sm" colorScheme="blue" onClick={onOpen}>
              パートナーを招待
            </Button>
          </HStack>
  
          <Divider />
  
          <VStack align="stretch" spacing={2}>
            <Text fontWeight="bold">メンバー</Text>
            {tenant.users.map((user) => (
              <HStack key={user.id} spacing={3}>
                <Avatar size="sm" src={user.image || undefined} name={user.name || undefined} />
                <Box>
                  <Text fontSize="sm" fontWeight="medium">
                    {user.name || 'No name'}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {user.email}
                  </Text>
                </Box>
                <Badge ml="auto" colorScheme="green">
                  メンバー
                </Badge>
              </HStack>
            ))}
          </VStack>
  
          <Text fontSize="xs" color="gray.500">
            作成日: {new Date(tenant.createdAt).toLocaleDateString('ja-JP')}
          </Text>
        </VStack>
  
        <TenantInviteForm
          isOpen={isOpen}
          onClose={() => {
            onClose()
            fetchTenantDetails() // 招待後に詳細を更新
          }}
          tenantId={tenantId}
        />
      </Box>
    )
  }