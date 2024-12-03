import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const params = await context.params
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    await prisma.place.delete({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Delete error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const params = await context.params
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const json = await request.json()
    const place = await prisma.place.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: json,
    })

    return NextResponse.json(place)
  } catch (error) {
    console.error('Update error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}