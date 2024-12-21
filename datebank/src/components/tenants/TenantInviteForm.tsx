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
    FormControl,
    FormLabel,
    FormErrorMessage,
    Text
  } from '@chakra-ui/react'
  import { useState } from 'react'
  
  interface TenantInviteFormProps {
    isOpen: boolean
    onClose: () => void
    tenantId: string
  }
  
  export default function TenantInviteForm({ isOpen, onClose, tenantId }: TenantInviteFormProps) {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const toast = useToast()
  
    const validateEmail = (email: string) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }
  
    const handleInvite = async () => {
      if (!validateEmail(email)) {
        setError('有効なメールアドレスを入力してください')
        return
      }
  
      setIsLoading(true)
      setError('')
  
      try {
        const response = await fetch(`/api/tenants/${tenantId}/invite`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })
  
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || '招待に失敗しました')
        }
  
        toast({
          title: '招待メールを送信しました',
          description: `${email}宛に招待メールを送信しました`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
  
        onClose()
        setEmail('')
      } catch (error) {
        setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました')
        toast({
          title: 'エラーが発生しました',
          description: error instanceof Error ? error.message : '予期せぬエラーが発生しました',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>パートナーを招待</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} pb={4}>
              <Text fontSize="sm" color="gray.600">
                パートナーのメールアドレスを入力して招待メールを送信します。
              </Text>
              <FormControl isInvalid={!!error}>
                <FormLabel>メールアドレス</FormLabel>
                <Input
                  type="email"
                  placeholder="partner@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError('')
                  }}
                />
                {error && <FormErrorMessage>{error}</FormErrorMessage>}
              </FormControl>
              <Button
                colorScheme="blue"
                width="full"
                onClick={handleInvite}
                isLoading={isLoading}
                isDisabled={!email.trim()}
              >
                招待する
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  }