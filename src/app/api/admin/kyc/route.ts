import { NextRequest, NextResponse } from 'next/server'
import { KYCService } from '@/lib/kyc-service'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (status) {
      where.verificationStatus = status
    }
    if (customerId) {
      where.customerId = customerId
    }

    // Fetch KYC profiles with pagination
    const [kycProfiles, total] = await Promise.all([
      db.kYCProfile.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              riskLevel: true
            }
          },
          documents: {
            select: {
              id: true,
              documentType: true,
              verificationStatus: true,
              createdAt: true
            }
          },
          checks: {
            select: {
              id: true,
              checkType: true,
              status: true,
              riskScore: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.kYCProfile.count({ where })
    ])

    // Calculate statistics
    const stats = await db.kYCProfile.groupBy({
      by: ['verificationStatus'],
      _count: {
        id: true
      }
    })

    return NextResponse.json({
      success: true,
      data: kycProfiles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: stats.reduce((acc, stat) => {
        acc[stat.verificationStatus] = stat._count.id
        return acc
      }, {} as Record<string, number>)
    })
  } catch (error) {
    console.error('Error fetching KYC profiles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch KYC profiles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerId,
      profileType,
      documents,
      checks,
      userId,
      ipAddress,
      userAgent
    } = body

    // Validate required fields
    if (!customerId || !profileType || !documents || !checks) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await KYCService.createKYCProfile({
      customerId,
      profileType,
      documents,
      checks,
      userId,
      ipAddress,
      userAgent
    })

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error creating KYC profile:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create KYC profile' },
      { status: 500 }
    )
  }
}