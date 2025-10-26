import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const roomTypes = await db.roomType.findMany({
      include: {
        rooms: {
          select: {
            id: true,
            roomNumber: true,
            status: true
          }
        }
      },
      orderBy: {
        price: 'asc'
      }
    })

    return NextResponse.json(roomTypes)
  } catch (error) {
    console.error('Failed to fetch room types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch room types' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, description, price, capacity, amenities } = data

    const roomType = await db.roomType.create({
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
    console.error('Failed to create room type:', error)
    return NextResponse.json(
      { error: 'Failed to create room type' },
      { status: 500 }
    )
  }
}