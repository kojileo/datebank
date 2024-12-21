import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const tenant = await prisma.tenant.findFirst({
      where: {
        id: params.id,
        users: {
          some: {
            id: session.user.id
          }
        }
      },
      include: {
        users: true
      }
    })

    if (!tenant) {
      return new NextResponse('Tenant not found', { status: 404 })
    }

    return NextResponse.json(tenant)
  } catch (error) {
    console.error('Tenant fetch error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    await prisma.tenant.delete({
      where: {
        id: params.id,
        users: {
          some: {
            id: session.user.id
          }
        }
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Tenant delete error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
