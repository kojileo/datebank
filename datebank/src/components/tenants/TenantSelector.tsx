import {
    Select,
    FormControl,
    FormLabel,
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Input,
    VStack,
    useToast,
    HStack
  } from '@chakra-ui/react'
  import { useState, useEffect } from 'react'
  import TenantInviteForm from './TenantInviteForm'
  
  interface Tenant {
    id: string
    name: string
    users: Array<{
      id: string
      name: string
      email: string
    }>
  }
  
  interface TenantSelectorProps {
    selectedTenantId: string | null
    onTenantChange: (tenantId: string) => void
  }
  
  export default function TenantSelector({ selectedTenantId, onTenantChange }: TenantSelectorProps) {
    const [tenants, setTenants] = useState<Tenant[]>([])
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [newTenantName, setNewTenantName] = useState('')
    const toast = useToast()
    const inviteModal = useDisclosure()
  
    useEffect(() => {
      fetchTenants()
    }, [])
  
    const fetchTenants = async () => {
      try {
        const response = await fetch('/api/tenants')
        const data = await response.json()
        setTenants(data)
      } catch (error) {
        toast({
          title: 'エラーが発生しました',
          description: 'テナントの取得に失敗しました',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
  
    const handleCreateTenant = async () => {
      try {
        await fetch('/api/tenants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newTenantName }),
        })
        await fetchTenants()
        onClose()
        setNewTenantName('')
        toast({
          title: '作成完了',
          description: 'カップルを作成しました',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } catch (error) {
        toast({
          title: 'エラーが発生しました',
          description: 'カップルの作成に失敗しました',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
  
    return (
      <>
        <FormControl>
          <FormLabel>カップルを選択</FormLabel>
          <HStack spacing={4}>
            <Select
              value={selectedTenantId || ''}
              onChange={(e) => onTenantChange(e.target.value)}
            >
              <option value="">選択してください</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))}
            </Select>
            <Button onClick={onOpen} colorScheme="blue">
              新規作成
            </Button>
            {selectedTenantId && (
              <Button onClick={inviteModal.onOpen} colorScheme="green">
                招待
              </Button>
            )}
          </HStack>
        </FormControl>
  
        {/* 新規作成モーダル */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>新しいカップルを作成</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} pb={4}>
                <Input
                  placeholder="カップル名"
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                />
                <Button 
                  onClick={handleCreateTenant} 
                  colorScheme="blue"
                  isDisabled={!newTenantName.trim()}
                  width="full"
                >
                  作成
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
  
        {/* 招待モーダル */}
        {selectedTenantId && (
          <TenantInviteForm
            isOpen={inviteModal.isOpen}
            onClose={inviteModal.onClose}
            tenantId={selectedTenantId}
          />
        )}
      </>
    )
  }