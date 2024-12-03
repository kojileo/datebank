'use client'

import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import { FiPlus } from 'react-icons/fi'
import { FaGoogle } from 'react-icons/fa'
import {
  Grid,
  Button,
  useDisclosure,
  VStack,
  Heading,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { Place } from '@prisma/client'
import PlaceCard from '@/components/places/PlaceCard'
import PlaceForm from '@/components/places/PlaceForm'
import { useSession } from 'next-auth/react'

export default function Home() {
  const [places, setPlaces] = useState<Place[]>([])
  const [selectedPlace, setSelectedPlace] = useState<Place | undefined>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: session } = useSession()
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.100, purple.100)',
    'linear(to-r, blue.900, purple.900)'
  )

  useEffect(() => {
    if (session) {
      fetchPlaces()
    }
  }, [session])

  const fetchPlaces = async () => {
    const response = await fetch('/api/places')
    const data = await response.json()
    setPlaces(data)
  }

  const handleSubmit = async (data: Partial<Place>) => {
    if (selectedPlace) {
      await fetch(`/api/places/${selectedPlace.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } else {
      await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    }
    fetchPlaces()
    setSelectedPlace(undefined)
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/places/${id}`, { method: 'DELETE' })
    fetchPlaces()
  }

  if (!session) {
    return (
      <VStack
        spacing={8}
        justify="center"
        align="center"
        minH="60vh"
        bgGradient={bgGradient}
        p={8}
        borderRadius="lg"
      >
        <Heading>DateBankへようこそ</Heading>
        <Text textAlign="center">
          お気に入りの場所を保存して、素敵なデートプランを立てましょう。
        </Text>
        <Button
          onClick={() => signIn('google')}
          size="lg"
          colorScheme="blue"
          leftIcon={<FaGoogle />}
        >
          Googleでログイン
        </Button>
      </VStack>
    )
  }

  return (
    <VStack spacing={8}>
      <Button
        leftIcon={<FiPlus />}
        colorScheme="blue"
        onClick={() => {
          setSelectedPlace(undefined)
          onOpen()
        }}
      >
        新しい場所を追加
      </Button>

      <Grid
        templateColumns={{
          base: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
        gap={6}
        width="full"
      >
        {places.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            onEdit={(place) => {
              setSelectedPlace(place)
              onOpen()
            }}
            onDelete={handleDelete}
          />
        ))}
      </Grid>

      <PlaceForm
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
        initialData={selectedPlace}
      />
    </VStack>
  )
}