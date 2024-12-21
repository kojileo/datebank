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
    const tenant = await prisma.tenant.create({
      data: {
        name: json.name,
        users: {
          connect: { id: session.user.id }
        }
      },
      include: {
        users: true
      }
    })

    return NextResponse.json(tenant)
  } catch (error) {
    console.error('Tenant creation error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const tenants = await prisma.tenant.findMany({
      where: {
        users: {
          some: {
            id: session.user.id
          }
        }
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json(tenants)
  } catch (error) {
    console.error('Tenants fetch error:', error)
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