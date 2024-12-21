import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  FormErrorMessage
} from '@chakra-ui/react'
import { useState } from 'react'
import { Place } from '@prisma/client'

interface PlaceFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Place>) => Promise<void>
  initialData?: Place
}

export default function PlaceForm({ isOpen, onClose, onSubmit, initialData }: PlaceFormProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [address, setAddress] = useState(initialData?.address || '')
  const [url, setUrl] = useState(initialData?.url || '')
  const [visitDate, setVisitDate] = useState(
    initialData?.visitDate ? new Date(initialData.visitDate).toISOString().split('T')[0] : ''
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit({
        name,
        description,
        address,
        url,
        visitDate: visitDate ? new Date(visitDate) : null,
      })
      resetForm()
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setName('')
    setDescription('')
    setAddress('')
    setUrl('')
    setVisitDate('')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{initialData ? '場所を編集' : '新しい場所を追加'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} pb={4}>
              <FormControl isRequired isInvalid={!name}>
                <FormLabel>名前</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="場所の名前"
                />
                {!name && <FormErrorMessage>名前は必須です</FormErrorMessage>}
              </FormControl>

              <FormControl>
                <FormLabel>説明</FormLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="場所の説明"
                />
              </FormControl>

              <FormControl>
                <FormLabel>住所</FormLabel>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="住所"
                />
              </FormControl>

              <FormControl>
                <FormLabel>URL</FormLabel>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  type="url"
                />
              </FormControl>

              <FormControl>
                <FormLabel>訪問予定日</FormLabel>
                <Input
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  type="date"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={isSubmitting}
                isDisabled={!name}
              >
                {initialData ? '更新' : '追加'}
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}