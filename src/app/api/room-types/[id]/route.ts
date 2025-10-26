import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const { name, description, price, capacity, amenities } = data

    const roomType = await db.roomType.update({
      where: {
        id: params.id
      },
      data: {
        name,
        description,
        price: parseFloat(price),
        capacity: parseInt(capacity),
        amenities: amenities ? JSON.stringify(amenities) : null
      }
    })

    return NextResponse.json(roomType)
  } catch (error) {
    console.error('Failed to update room type:', error)
    return NextResponse.json(
      { error: 'Failed to update room type' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.roomType.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete room type:', error)
    return NextResponse.json(
      { error: 'Failed to delete room type' },
      { status: 500 }
    )
  }
}