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
  AlertDescription,
  Spinner,
  Center
} from '@chakra-ui/react'
import { Place } from '@prisma/client'
import PlaceCard from '@/components/places/PlaceCard'
import PlaceForm from '@/components/places/PlaceForm'
import { useSession } from 'next-auth/react'
import Layout from '@/components/Layout'
import TenantSelector from '@/components/tenants/TenantSelector'
import { useToast } from '@chakra-ui/react'

export default function Home() {
  const [places, setPlaces] = useState<Place[]>([])
  const [selectedPlace, setSelectedPlace] = useState<Place | undefined>()
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: session, status } = useSession()
  const toast = useToast()
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.100, purple.100)',
    'linear(to-r, blue.900, purple.900)'
  )

  const fetchPlaces = useCallback(async () => {
    if (!session?.user?.id || !selectedTenantId) return
    setIsLoading(true)
    try {
      const response = await fetch(`/api/places?tenantId=${selectedTenantId}`)
      if (!response.ok) throw new Error('場所の取得に失敗しました')
      const data = await response.json()
      setPlaces(data)
    } catch (error) {
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
  }, [session?.user?.id, selectedTenantId, toast])

  useEffect(() => {
    if (session?.user?.id && selectedTenantId) {
      fetchPlaces()
    }
  }, [session, selectedTenantId, fetchPlaces])

  const handleSubmit = async (data: Partial<Place>) => {
    if (!selectedTenantId) return

    try {
      const endpoint = selectedPlace 
        ? `/api/places/${selectedPlace.id}`
        : '/api/places'
      const method = selectedPlace ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, tenantId: selectedTenantId }),
      })

      if (!response.ok) throw new Error('保存に失敗しました')

      fetchPlaces()
      setSelectedPlace(undefined)
      onClose()
      
      toast({
        title: `場所を${selectedPlace ? '更新' : '追加'}しました`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'エラーが発生しました',
        description: error instanceof Error ? error.message : '予期せぬエラーが発生しました',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/places/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('削除に失敗しました')
      
      fetchPlaces()
      toast({
        title: '場所を削除しました',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'エラーが発生しました',
        description: error instanceof Error ? error.message : '予期せぬエラーが発生しました',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  if (status === 'loading') {
    return (
      <Layout>
        <Center minH="60vh">
          <Spinner size="xl" />
        </Center>
      </Layout>
    )
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
        <Box w="full" maxW="2xl">
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

            {isLoading ? (
              <Center py={8}>
                <Spinner size="lg" />
              </Center>
            ) : places.length === 0 ? (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>場所が登録されていません</AlertTitle>
                  <AlertDescription>
                    「新しい場所を追加」ボタンから、お気に入りの場所を登録してみましょう。
                  </AlertDescription>
                </Box>
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
            <Box>
              <AlertTitle>カップルを選択してください</AlertTitle>
              <AlertDescription>
                カップルを選択するか、新しく作成してください。
              </AlertDescription>
            </Box>
          </Alert>
        )}
      </VStack>
    </Layout>
  )
}