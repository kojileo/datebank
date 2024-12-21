import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // 招待する側のユーザーがテナントに所属しているか確認
    const tenant = await prisma.tenant.findFirst({
      where: {
        id: params.id,
        users: {
          some: {
            id: session.user.id
          }
        }
      }
    })

    if (!tenant) {
      return new NextResponse('Tenant not found or unauthorized', { status: 404 })
    }

    const { email } = await request.json()

    // 招待されるユーザーの存在確認
    const invitedUser = await prisma.user.findUnique({
      where: { email }
    })

    if (!invitedUser) {
      return new NextResponse('Invited user not found', { status: 404 })
    }

    // 既に招待されているか確認
    const existingMembership = await prisma.tenant.findFirst({
      where: {
        id: params.id,
        users: {
          some: {
            id: invitedUser.id
          }
        }
      }
    })

    if (existingMembership) {
      return new NextResponse('User is already a member', { status: 400 })
    }

    // テナントにユーザーを追加
    await prisma.tenant.update({
      where: { id: params.id },
      data: {
        users: {
          connect: { id: invitedUser.id }
        }
      }
    })

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error('Invite error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
