import {
    Box,
    Heading,
    Text,
    Stack,
    IconButton,
    HStack,
    useColorModeValue,
    Badge,
    Divider,
    useDisclosure,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button
  } from '@chakra-ui/react'
  import { FiEdit2, FiTrash2, FiMapPin, FiInfo, FiLink, FiCalendar } from 'react-icons/fi'
  import type { Place } from '@prisma/client'
  import { useRef } from 'react'
  
  interface PlaceCardProps {
    place: Place
    onEdit: (place: Place) => void
    onDelete: (id: string) => void
  }
  
  export default function PlaceCard({ place, onEdit, onDelete }: PlaceCardProps) {
    const bg = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.200', 'gray.700')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef<HTMLButtonElement>(null)
  
    return (
      <>
        <Box
          bg={bg}
          border="1px"
          borderColor={borderColor}
          shadow="sm"
          rounded="lg"
          p={6}
          transition="all 0.2s"
          _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
          position="relative"
        >
          <Stack spacing={4}>
            <HStack justify="space-between" align="start">
              <Heading size="md" noOfLines={2}>
                {place.name}
              </Heading>
              <HStack spacing={2}>
                <IconButton
                  aria-label="Edit place"
                  icon={<FiEdit2 />}
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                  onClick={() => onEdit(place)}
                />
                <IconButton
                  aria-label="Delete place"
                  icon={<FiTrash2 />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={onOpen}
                />
              </HStack>
            </HStack>
  
            {place.description && (
              <Text 
                color={useColorModeValue('gray.600', 'gray.400')}
                noOfLines={3}
                fontSize="sm"
              >
                <FiInfo style={{ display: 'inline', marginRight: '8px' }} />
                {place.description}
              </Text>
            )}
  
            <Divider />
  
            {place.address && (
              <HStack spacing={2}>
                <FiMapPin />
                <Text 
                  fontSize="sm" 
                  color={useColorModeValue('gray.600', 'gray.400')}
                  noOfLines={1}
                >
                  {place.address}
                </Text>
              </HStack>
            )}
  
            {place.url && (
              <HStack spacing={2}>
                <FiLink />
                <Text 
                  fontSize="sm" 
                  color={useColorModeValue('blue.600', 'blue.400')}
                  as="a"
                  href={place.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ウェブサイトを開く
                </Text>
              </HStack>
            )}

            {place.visitDate && (
              <HStack spacing={2}>
                <FiCalendar />
                <Text fontSize="sm">
                  訪問予定日: {new Date(place.visitDate).toLocaleDateString('ja-JP')}
                </Text>
              </HStack>
            )}
          </Stack>
        </Box>
  
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                場所を削除
              </AlertDialogHeader>
  
              <AlertDialogBody>
                「{place.name}」を削除してもよろしいですか？
                この操作は取り消せません。
              </AlertDialogBody>
  
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  キャンセル
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    onDelete(place.id)
                    onClose()
                  }}
                  ml={3}
                >
                  削除
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
  }