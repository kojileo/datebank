import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const json = await request.json()
    const { tenantId, ...placeData } = json

    const place = await prisma.place.create({
      data: {
        ...placeData,
        user: {
          connect: { id: session.user.id }
        },
        createdBy: {
          connect: { id: session.user.id }
        },
        tenant: {
          connect: { id: tenantId }
        }
      }
    })

    return NextResponse.json(place)
  } catch (error) {
    console.error('Place creation error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}


export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const tenantId = searchParams.get('tenantId')

  if (!tenantId) {
    return new NextResponse('Tenant ID is required', { status: 400 })
  }

  try {
    const places = await prisma.place.findMany({
      where: {
        tenantId,
        tenant: {
          users: {
            some: {
              id: session.user.id
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(places)
  } catch (error) {
    console.error('Places fetch error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
