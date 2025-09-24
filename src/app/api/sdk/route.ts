import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')
    const active = searchParams.get('active')

    const where: any = {}
    if (platform) {
      where.platform = platform
    }
    if (active !== null) {
      where.isActive = active === 'true'
    }

    const sdkVersions = await db.sdkVersion.findMany({
      where,
      include: {
        downloads: {
          select: {
            id: true,
            downloadedAt: true,
            userId: true
          }
        }
      },
      orderBy: [
        { platform: 'asc' },
        { releaseDate: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: sdkVersions
    })

  } catch (error) {
    console.error('SDK API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { version, platform, filename, size, checksum, downloadUrl, changelog } = body

    // Validate required fields
    if (!version || !platform || !filename || !size || !checksum || !downloadUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if version already exists for this platform
    const existingVersion = await db.sdkVersion.findFirst({
      where: {
        version,
        platform
      }
    })

    if (existingVersion) {
      return NextResponse.json(
        { error: 'Version already exists for this platform' },
        { status: 400 }
      )
    }

    const sdkVersion = await db.sdkVersion.create({
      data: {
        version,
        platform,
        filename,
        size,
        checksum,
        downloadUrl,
        changelog: changelog || null,
        releaseDate: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: sdkVersion
    })

  } catch (error) {
    console.error('SDK creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}