import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { email } = await request.json()

    // テナントの存在確認と権限チェック
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
      return new NextResponse('テナントが見つからないか、権限がありません', { status: 404 })
    }

    // 既に招待されているかチェック
    const existingUser = tenant.users.find(user => user.email === email)
    if (existingUser) {
      return new NextResponse('このユーザーは既にメンバーです', { status: 400 })
    }

    // 招待されるユーザーの検索または作成
    let invitedUser = await prisma.user.findUnique({
      where: { email }
    })

    if (!invitedUser) {
      invitedUser = await prisma.user.create({
        data: {
          email,
          emailVerified: null
        }
      })
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

    // 招待メールの送信
    await resend.emails.send({
      from: 'DateBank <noreply@resend.dev>',
      to: email,
      subject: `${session.user.name || 'パートナー'}からDateBankに招待されました`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2B6CB0;">DateBankへようこそ！</h1>
          <p>${session.user.name || 'パートナー'}があなたを招待しました。</p>
          <p>以下のリンクからログインして、共有スペースにアクセスできます：</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/login?email=${email}" 
             style="display: inline-block; background-color: #2B6CB0; color: white; 
                    padding: 12px 24px; text-decoration: none; border-radius: 6px; 
                    margin: 16px 0;">
            DateBankにログインする
          </a>
          <p style="color: #666; font-size: 14px; margin-top: 24px;">
            ※このメールに心当たりがない場合は、無視していただいて構いません。
          </p>
        </div>
      `
    })

    return NextResponse.json({ message: '招待メールを送信しました' })
  } catch (error) {
    console.error('Invite error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}