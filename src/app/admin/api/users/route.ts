import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const users = await db.user.findMany({
      include: {
        downloads: {
          select: {
            id: true,
            downloadedAt: true
          }
        },
        apiKeys: {
          select: {
            id: true,
            name: true,
            isActive: true,
            createdAt: true,
            lastUsed: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: users
    })

  } catch (error) {
    console.error('Users API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}