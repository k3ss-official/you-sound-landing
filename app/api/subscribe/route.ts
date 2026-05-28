export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request?.json?.().catch(() => null)
    const email = body?.email?.trim?.()?.toLowerCase?.()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Upsert to avoid duplicate errors
    await prisma.subscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    })

    return NextResponse.json(
      { message: "You're on the list!" },
      { status: 200 }
    )
  } catch (err: any) {
    console.error('Subscribe error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
