import {
  Box,
  VStack,
  Heading,
  Text,
  IconButton,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Badge
} from '@chakra-ui/react'
import { FiMoreVertical, FiEdit2, FiTrash2, FiExternalLink } from 'react-icons/fi'
import { Place } from '@prisma/client'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

interface PlaceCardProps {
  place: Place & {
    createdBy?: {
      name: string | null
      email: string | null
    }
  }
  onEdit: (place: Place) => void
  onDelete: (id: string) => void
}

export default function PlaceCard({ place, onEdit, onDelete }: PlaceCardProps) {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      borderColor={borderColor}
      p={4}
      position="relative"
    >
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between" align="flex-start">
          <Heading size="md" noOfLines={2}>
            {place.name}
          </Heading>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FiMoreVertical />}
              variant="ghost"
              size="sm"
              aria-label="オプション"
            />
            <MenuList>
              <MenuItem icon={<FiEdit2 />} onClick={() => onEdit(place)}>
                編集
              </MenuItem>
              <MenuItem
                icon={<FiTrash2 />}
                onClick={() => onDelete(place.id)}
                color="red.500"
              >
                削除
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>

        {place.description && (
          <Text fontSize="sm" color="gray.500" noOfLines={2}>
            {place.description}
          </Text>
        )}

        {place.address && (
          <Text fontSize="sm" color="gray.500" noOfLines={1}>
            {place.address}
          </Text>
        )}

        {place.url && (
          <Link href={place.url} isExternal color="blue.500" fontSize="sm">
            <HStack spacing={1}>
              <FiExternalLink />
              <Text>ウェブサイトを開く</Text>
            </HStack>
          </Link>
        )}

        {place.visitDate && (
          <Text fontSize="sm" color="gray.500">
            訪問予定日: {format(new Date(place.visitDate), 'yyyy年MM月dd日', { locale: ja })}
          </Text>
        )}

        <Text fontSize="xs" color="gray.500">
          作成者: {place.createdBy?.name || place.createdBy?.email}
        </Text>
      </VStack>
    </Box>
  )
}