import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { isActive } = body

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive must be a boolean' },
        { status: 400 }
      )
    }

    const sdkVersion = await db.sdkVersion.update({
      where: {
        id: params.id
      },
      data: {
        isActive
      }
    })

    return NextResponse.json({
      success: true,
      data: sdkVersion
    })

  } catch (error) {
    console.error('SDK update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.sdkVersion.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({
      success: true,
      message: 'SDK version deleted successfully'
    })

  } catch (error) {
    console.error('SDK deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}