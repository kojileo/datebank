'use client'

import {
  SimpleGrid,
  Skeleton,
  useToast
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import type { Place } from '@prisma/client'
import PlaceCard from './PlaceCard'

export default function PlaceList() {
  const [places, setPlaces] = useState<Place[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  const handleUpdate = (updatedPlace: Place) => {
    setPlaces(places.map(p => 
      p.id === updatedPlace.id ? updatedPlace : p
    ))
  }

  const handleDelete = (deletedId: string) => {
    setPlaces(places.filter(p => p.id !== deletedId))
  }

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch('/api/places')
        if (!response.ok) throw new Error('データの取得に失敗しました')
        
        const data = await response.json()
        setPlaces(data)
      } catch (_) {
        toast({
          title: 'エラー',
          description: '場所の一覧を取得できませんでした',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlaces()
  }, [toast])

  if (isLoading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} p={4}>
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} height="200px" />
        ))}
      </SimpleGrid>
    )
  }
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} p={4}>
      {places.map((place) => (
        <PlaceCard
          key={place.id}
          place={place}
          onEdit={handleUpdate}
          onDelete={handleDelete}
        />
      ))}
    </SimpleGrid>
  )
}