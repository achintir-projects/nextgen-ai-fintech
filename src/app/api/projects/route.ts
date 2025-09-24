import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const whereClause: any = { userId }
    if (status && status !== 'all') {
      whereClause.status = status
    }

    const projects = await db.project.findMany({
      where: whereClause,
      include: {
        builds: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        deployments: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: projects
    })

  } catch (error) {
    console.error('Projects API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, type, platform, config, buildSettings, userId } = body

    if (!name || !type || !userId) {
      return NextResponse.json(
        { error: 'Name, type, and userId are required' },
        { status: 400 }
      )
    }

    const project = await db.project.create({
      data: {
        name,
        description,
        type,
        platform,
        config: config || {},
        buildSettings: buildSettings || {},
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: project
    })

  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}