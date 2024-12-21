import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
  VStack,
  useToast,
} from '@chakra-ui/react'

interface TenantInviteFormProps {
  isOpen: boolean
  onClose: () => void
  tenantId: string
}

export default function TenantInviteForm({ isOpen, onClose, tenantId }: TenantInviteFormProps) {
  const toast = useToast()

  const handleInvite = async (email: string) => {
    try {
      const response = await fetch(`/api/tenants/${tenantId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!response.ok) throw new Error('招待に失敗しました')
      
      toast({
        title: '招待を送信しました',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      onClose()
    } catch (error) {
      toast({
        title: 'エラーが発生しました',
        description: '招待の送信に失敗しました',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>パートナーを招待</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <Input placeholder="メールアドレス" type="email" />
            <Button colorScheme="blue" width="full">
              招待を送信
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}