'use client'

import { useEffect, useState, useCallback } from 'react'
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
  useColorModeValue,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react'
import { Place } from '@prisma/client'
import PlaceCard from '@/components/places/PlaceCard'
import PlaceForm from '@/components/places/PlaceForm'
import { useSession } from 'next-auth/react'
import Layout from '@/components/Layout'
import TenantSelector from '@/components/tenants/TenantSelector'

export default function Home() {
  const [places, setPlaces] = useState<Place[]>([])
  const [selectedPlace, setSelectedPlace] = useState<Place | undefined>()
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: session } = useSession()
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.100, purple.100)',
    'linear(to-r, blue.900, purple.900)'
  )

  const fetchPlaces = useCallback(async () => {
    if (!session?.user?.id || !selectedTenantId) return
    try {
      const response = await fetch(`/api/places?tenantId=${selectedTenantId}`)
      if (!response.ok) throw new Error('場所の取得に失敗しました')
      const data = await response.json()
      setPlaces(data.map((place: Place) => ({
        ...place,
        createdBy: {
          name: session.user?.name || null,
          email: session.user?.email || null
        }
      })))
    } catch (error) {
      console.error('Places fetch error:', error)
    }
  }, [session?.user?.id, selectedTenantId, session?.user?.name, session?.user?.email])

  useEffect(() => {
    if (session?.user?.id && selectedTenantId) {
      fetchPlaces()
    }
  }, [session, selectedTenantId, fetchPlaces])

  const handleSubmit = async (data: Partial<Place>) => {
    if (!selectedTenantId) return

    try {
      if (selectedPlace) {
        await fetch(`/api/places/${selectedPlace.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, tenantId: selectedTenantId }),
        })
      } else {
        await fetch('/api/places', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, tenantId: selectedTenantId }),
        })
      }
      fetchPlaces()
      setSelectedPlace(undefined)
      onClose()
    } catch (error) {
      console.error('Place save error:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/places/${id}`, { method: 'DELETE' })
      fetchPlaces()
    } catch (error) {
      console.error('Place delete error:', error)
    }
  }

  if (!session) {
    return (
      <Layout>
        <VStack
          spacing={8}
          justify="center"
          align="center"
          minH="60vh"
          bgGradient={bgGradient}
          p={8}
          borderRadius="lg"
        >
          <Heading>カップルプランへようこそ</Heading>
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
      </Layout>
    )
  }

  return (
    <Layout>
      <VStack spacing={8} p={8}>
        <Box w="full" maxW="md">
          <TenantSelector
            selectedTenantId={selectedTenantId}
            onTenantChange={setSelectedTenantId}
          />
        </Box>

        {selectedTenantId ? (
          <>
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

            {places.length === 0 ? (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <AlertTitle>場所が登録されていません</AlertTitle>
                <AlertDescription>
                  「新しい場所を追加」ボタンから、お気に入りの場所を登録してみましょう。
                </AlertDescription>
              </Alert>
            ) : (
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
            )}

            <PlaceForm
              isOpen={isOpen}
              onClose={onClose}
              onSubmit={handleSubmit}
              initialData={selectedPlace}
            />
          </>
        ) : (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <AlertTitle>カップルを選択してください</AlertTitle>
            <AlertDescription>
              カップルを選択するか、新しく作成してください。
            </AlertDescription>
          </Alert>
        )}
      </VStack>
    </Layout>
  )
}