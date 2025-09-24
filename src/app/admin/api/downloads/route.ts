import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const downloads = await db.download.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        sdkVersion: {
          select: {
            id: true,
            version: true,
            platform: true,
            filename: true
          }
        }
      },
      orderBy: {
        downloadedAt: 'desc'
      },
      take: 100 // Limit to last 100 downloads
    })

    return NextResponse.json({
      success: true,
      data: downloads
    })

  } catch (error) {
    console.error('Downloads API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}