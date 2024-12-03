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
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Divider,
  Text
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { Place } from '@prisma/client'
import { FiMapPin, FiStar } from 'react-icons/fi'

interface PlaceFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Place>) => Promise<void>
  initialData?: Place
}

const CATEGORIES = [
  'レストラン',
  'カフェ',
  '公園',
  '映画館',
  'ショッピング',
  '美術館',
  'その他'
]

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
  } = useForm({
    defaultValues: initialData || {
      name: '',
      description: '',
      address: ''
    }
  })
  const toast = useToast()

  const onFormSubmit = async (data: Partial<Place>) => {
    try {
      await onSubmit(data)
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

              <FormControl>
                <FormLabel>住所</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiMapPin color="gray.300" />
                  </InputLeftElement>
                  <Input
                    {...register('address')}
                    placeholder="場所の住所"
                  />
                </InputGroup>
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