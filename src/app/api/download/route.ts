import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')
    const version = searchParams.get('version') || '2.1.0'

    if (!platform || !['android', 'ios'].includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform specified' },
        { status: 400 }
      )
    }

    // Get SDK version from database
    const sdkVersion = await db.sdkVersion.findFirst({
      where: {
        platform,
        version,
        isActive: true
      }
    })

    if (!sdkVersion) {
      return NextResponse.json(
        { error: 'SDK version not found' },
        { status: 404 }
      )
    }

    // Parse changelog if it's a string
    const changelog = typeof sdkVersion.changelog === 'string' 
      ? JSON.parse(sdkVersion.changelog) 
      : sdkVersion.changelog || []

    return NextResponse.json({
      success: true,
      data: {
        platform: sdkVersion.platform,
        version: sdkVersion.version,
        filename: sdkVersion.filename,
        size: sdkVersion.size,
        checksum: sdkVersion.checksum,
        downloadUrl: sdkVersion.downloadUrl,
        documentation: platform === 'android' 
          ? 'https://docs.paam.com/sdk/android' 
          : 'https://docs.paam.com/sdk/ios',
        changelog: changelog,
        releaseDate: sdkVersion.releaseDate.toISOString(),
        minimumRequirements: platform === 'android' 
          ? 'Android 5.0+ (API 21+)' 
          : 'iOS 13.0+',
        dependencies: platform === 'android'
          ? ['No external dependencies required']
          : ['SystemConfiguration.framework', 'CoreLocation.framework']
      }
    })

  } catch (error) {
    console.error('Download API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { platform, version, developerInfo } = body

    if (!platform || !['android', 'ios'].includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform specified' },
        { status: 400 }
      )
    }

    // Get SDK version from database
    const sdkVersion = await db.sdkVersion.findFirst({
      where: {
        platform,
        version: version || '2.1.0',
        isActive: true
      }
    })

    if (!sdkVersion) {
      return NextResponse.json(
        { error: 'SDK version not found' },
        { status: 404 }
      )
    }

    // In a real implementation, this would:
    // 1. Validate the developer's API key
    // 2. Record the download for analytics
    // 3. Generate a signed download URL
    // 4. Send download confirmation email

    // For demo purposes, we'll create a download record
    const downloadId = `dl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Create download record (in a real app, you'd get user info from session)
    try {
      await db.download.create({
        data: {
          userId: 'demo_user', // In real app, get from authenticated user
          sdkVersionId: sdkVersion.id,
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        }
      })
    } catch (error) {
      console.error('Error recording download:', error)
      // Continue even if recording fails
    }
    
    return NextResponse.json({
      success: true,
      data: {
        downloadId,
        downloadUrl: sdkVersion.downloadUrl,
        expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour
        instructions: {
          android: {
            title: 'Android SDK Installation',
            steps: [
              'Download the .aar file',
              'Add it to your app/libs directory',
              'Add implementation files("libs/paam-fintech-sdk-android-2.1.0.aar") to build.gradle',
              'Sync Gradle and rebuild your project',
              'Follow the initialization guide in documentation'
            ]
          },
          ios: {
            title: 'iOS SDK Installation',
            steps: [
              'Download the .xcframework file',
              'Drag it into your Xcode project',
              'Check "Copy items if needed"',
              'Add to your app target in "Embed & Sign"',
              'Follow the initialization guide in documentation'
            ]
          }
        }[platform]
      }
    })

  } catch (error) {
    console.error('Download request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}