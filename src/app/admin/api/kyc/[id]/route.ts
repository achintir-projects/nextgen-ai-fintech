import { NextRequest, NextResponse } from 'next/server'
import { KYCService } from '@/lib/kyc-service'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const kycProfile = await KYCService.getKYCProfile(params.id)
    
    if (!kycProfile) {
      return NextResponse.json(
        { success: false, error: 'KYC profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: kycProfile
    })
  } catch (error) {
    console.error('Error fetching KYC profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch KYC profile' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, reason, userId } = body

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      )
    }

    const result = await KYCService.updateKYCProfileStatus(
      params.id,
      status,
      reason,
      userId
    )

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error updating KYC profile:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update KYC profile' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.kYCProfile.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'KYC profile deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting KYC profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete KYC profile' },
      { status: 500 }
    )
  }
}