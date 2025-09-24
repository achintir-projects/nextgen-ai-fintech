import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const riskLevel = searchParams.get('riskLevel')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } }
      ]
    }
    if (riskLevel) {
      where.riskLevel = riskLevel
    }

    // Fetch customers with pagination
    const [customers, total] = await Promise.all([
      db.customer.findMany({
        where,
        include: {
          kycProfiles: {
            select: {
              id: true,
              profileType: true,
              verificationStatus: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' },
            take: 1 // Get latest KYC profile
          },
          accounts: {
            select: {
              id: true,
              accountType: true,
              balance: true,
              status: true
            }
          },
          _count: {
            select: {
              kycProfiles: true,
              accounts: true,
              transactions: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.customer.count({ where })
    ])

    // Calculate statistics
    const stats = await Promise.all([
      db.customer.groupBy({
        by: ['riskLevel'],
        _count: { id: true }
      }),
      db.customer.groupBy({
        by: ['status'],
        _count: { id: true }
      })
    ])

    const riskStats = stats[0].reduce((acc, stat) => {
      acc[stat.riskLevel] = stat._count.id
      return acc
    }, {} as Record<string, number>)

    const statusStats = stats[1].reduce((acc, stat) => {
      acc[stat.status] = stat._count.id
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      success: true,
      data: customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        riskLevels: riskStats,
        statuses: statusStats
      }
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      organizationId,
      customerId,
      email,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      nationality,
      countryOfResidence,
      riskLevel
    } = body

    // Validate required fields
    if (!customerId || !email || !firstName || !lastName || !dateOfBirth || !nationality || !countryOfResidence) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if customer already exists
    const existingCustomer = await db.customer.findUnique({
      where: { customerId }
    })

    if (existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer with this ID already exists' },
        { status: 400 }
      )
    }

    // Create customer
    const customer = await db.customer.create({
      data: {
        organizationId,
        customerId,
        email,
        firstName,
        lastName,
        phone,
        dateOfBirth: new Date(dateOfBirth),
        nationality,
        countryOfResidence,
        riskLevel: riskLevel || 'MEDIUM'
      }
    })

    return NextResponse.json({
      success: true,
      data: customer
    })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create customer' },
      { status: 500 }
    )
  }
}