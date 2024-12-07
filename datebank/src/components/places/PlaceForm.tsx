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
  useToast,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Divider
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { Place } from '@prisma/client'
import { FiLink, FiCalendar } from 'react-icons/fi'

interface PlaceFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Place>) => Promise<void>
  initialData?: Place
}

type FormInputs = {
  name: string
  description: string | null
  url: string | null
  visitDate: string | null
}

export default function PlaceForm({
  isOpen,
  onClose,
  onSubmit,
  initialData
}: PlaceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormInputs>({
    defaultValues: initialData ? {
      ...initialData,
      visitDate: initialData.visitDate ? new Date(initialData.visitDate).toISOString().split('T')[0] : ''
    } : {
      name: '',
      description: '',
      url: '',
      visitDate: ''
    }
  })
  const toast = useToast()

  const onFormSubmit = async (data: FormInputs) => {
    try {
      await onSubmit({
        ...data,
        visitDate: data.visitDate ? new Date(data.visitDate) : null
      })
      reset()
      onClose()
      toast({
        title: initialData ? '更新しました' : '登録しました',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      })
    } catch (error) {
      toast({
        title: 'エラーが発生しました',
        description: error instanceof Error ? error.message : '予期せぬエラーが発生しました',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      })
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="xl"
      motionPreset="slideInBottom"
    >
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent>
        <ModalHeader>
          {initialData ? '場所を編集' : '新しい場所を追加'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired isInvalid={!!errors.name}>
                <FormLabel>名前</FormLabel>
                <Input
                  {...register('name', {
                    required: '名前は必須です',
                    minLength: { value: 2, message: '2文字以上入力してください' }
                  })}
                  placeholder="場所の名前"
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>説明</FormLabel>
                <Textarea
                  {...register('description')}
                  placeholder="この場所の説明や、おすすめポイントなど"
                  rows={4}
                />
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.url}>
                <FormLabel>URL</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiLink color="gray.300" />
                  </InputLeftElement>
                  <Input
                    {...register('url', {
                      required: 'URLは必須です',
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: '有効なURLを入力してください'
                      }
                    })}
                    placeholder="https://example.com"
                    type="url"
                  />
                </InputGroup>
                <FormErrorMessage>
                  {errors.url && errors.url.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.visitDate}>
                <FormLabel>訪問予定日</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiCalendar color="gray.300" />
                  </InputLeftElement>
                  <Input
                    {...register('visitDate', {
                      required: '訪問予定日は必須です'
                    })}
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </InputGroup>
                <FormErrorMessage>
                  {errors.visitDate && errors.visitDate.message}
                </FormErrorMessage>
              </FormControl>

              <Divider />

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={isSubmitting}
                loadingText="保存中..."
                mt={4}
              >
                {initialData ? '更新する' : '登録する'}
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}