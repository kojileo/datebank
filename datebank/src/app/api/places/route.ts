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
    const place = await prisma.place.create({
      data: {
        ...json,
        userId: session.user.id,
      },
    })

    return NextResponse.json(place)
  } catch (error) {
    console.error('Place creation error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const places = await prisma.place.findMany({
      where: {
        userId: session.user.id
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
