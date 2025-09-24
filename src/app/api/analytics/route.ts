import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7d'

    // Calculate date range
    const now = new Date()
    let startDate: Date
    let previousStartDate: Date

    switch (range) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        previousStartDate = new Date(now.getTime() - 48 * 60 * 60 * 1000)
        break
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        previousStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        previousStartDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        previousStartDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        previousStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
    }

    // Fetch all data in parallel
    const [
      totalDownloads,
      totalUsers,
      activeApiKeys,
      currentPeriodDownloads,
      previousPeriodDownloads,
      sdkVersions,
      downloads,
      users
    ] = await Promise.all([
      // Total downloads
      db.download.count(),
      
      // Total users
      db.user.count(),
      
      // Active API keys
      db.apiKey.count({ where: { isActive: true } }),
      
      // Current period downloads
      db.download.count({ where: { downloadedAt: { gte: startDate } } }),
      
      // Previous period downloads
      db.download.count({ where: { downloadedAt: { gte: previousStartDate, lt: startDate } } }),
      
      // SDK versions with download counts
      db.sdkVersion.findMany({
        include: {
          downloads: {
            where: { downloadedAt: { gte: startDate } }
          }
        }
      }),
      
      // All downloads for geographic analysis
      db.download.findMany({
        include: {
          user: true,
          sdkVersion: true
        },
        orderBy: { downloadedAt: 'desc' },
        take: 100
      }),
      
      // All users
      db.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
      })
    ])

    // Calculate platform stats
    const platformStats = {
      android: sdkVersions
        .filter(sdk => sdk.platform === 'android')
        .reduce((sum, sdk) => sum + sdk.downloads.length, 0),
      ios: sdkVersions
        .filter(sdk => sdk.platform === 'ios')
        .reduce((sum, sdk) => sum + sdk.downloads.length, 0)
    }

    // Calculate top versions
    const topVersions = sdkVersions
      .map(sdk => ({
        version: sdk.version,
        platform: sdk.platform,
        downloads: sdk.downloads.length
      }))
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 10)

    // Calculate downloads by time period
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const downloadsToday = downloads.filter(d => new Date(d.downloadedAt) >= today).length

    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const downloadsThisWeek = downloads.filter(d => new Date(d.downloadedAt) >= weekAgo).length

    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const downloadsThisMonth = downloads.filter(d => new Date(d.downloadedAt) >= monthAgo).length

    // Generate mock geographic data (in real app, this would come from IP geolocation)
    const geographicData = [
      { country: 'United States', downloads: Math.floor(totalDownloads * 0.35), percentage: 35 },
      { country: 'United Kingdom', downloads: Math.floor(totalDownloads * 0.15), percentage: 15 },
      { country: 'Germany', downloads: Math.floor(totalDownloads * 0.12), percentage: 12 },
      { country: 'France', downloads: Math.floor(totalDownloads * 0.10), percentage: 10 },
      { country: 'Canada', downloads: Math.floor(totalDownloads * 0.08), percentage: 8 },
      { country: 'Australia', downloads: Math.floor(totalDownloads * 0.06), percentage: 6 },
      { country: 'Japan', downloads: Math.floor(totalDownloads * 0.05), percentage: 5 },
      { country: 'Singapore', downloads: Math.floor(totalDownloads * 0.04), percentage: 4 },
      { country: 'Others', downloads: Math.floor(totalDownloads * 0.05), percentage: 5 }
    ]

    // Generate recent activity
    const recentActivity = [
      {
        type: 'download' as const,
        description: 'New SDK download - Android v2.1.0',
        timestamp: '2 minutes ago'
      },
      {
        type: 'user_registration' as const,
        description: 'New developer registered from United States',
        timestamp: '5 minutes ago'
      },
      {
        type: 'api_key_created' as const,
        description: 'API key created for FinTech App',
        timestamp: '8 minutes ago'
      },
      {
        type: 'download' as const,
        description: 'New SDK download - iOS v2.1.0',
        timestamp: '12 minutes ago'
      },
      {
        type: 'user_registration' as const,
        description: 'New developer registered from Germany',
        timestamp: '15 minutes ago'
      }
    ]

    // Calculate mock revenue (in real app, this would come from payment system)
    const revenue = totalDownloads * 2.5 // $2.50 per download on average

    return NextResponse.json({
      success: true,
      data: {
        totalDownloads,
        totalUsers,
        activeApiKeys,
        revenue: Math.floor(revenue),
        downloadsToday,
        downloadsThisWeek,
        downloadsThisMonth,
        platformStats,
        topVersions,
        recentActivity,
        geographicData
      }
    })

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}