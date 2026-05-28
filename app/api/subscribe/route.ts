import { getCloudflareContext } from '@opennextjs/cloudflare'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as { email?: string } | null
    const email = body?.email?.trim().toLowerCase()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    const { env } = getCloudflareContext()
    await env.DB
      .prepare('INSERT INTO subscribers (email) VALUES (?) ON CONFLICT(email) DO NOTHING')
      .bind(email)
      .run()

    return NextResponse.json({ message: "You're on the list!" }, { status: 200 })
  } catch (err) {
    console.error('Subscribe error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
