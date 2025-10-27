import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const { name, description, price, chargeType, isActive } = data

    const charge = await db.additionalCharge.update({
      where: {
        id: params.id
      },
      data: {
        name,
        description,
        price: parseFloat(price),
        chargeType,
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json(charge)
  } catch (error) {
    console.error('Failed to update additional charge:', error)
    return NextResponse.json(
      { error: 'Failed to update additional charge' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.additionalCharge.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete additional charge:', error)
    return NextResponse.json(
      { error: 'Failed to delete additional charge' },
      { status: 500 }
    )
  }
}