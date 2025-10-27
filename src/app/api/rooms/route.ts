import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const rooms = await db.room.findMany({
      include: {
        roomType: true
      },
      orderBy: {
        roomNumber: 'asc'
      }
    })

    return NextResponse.json(rooms)
  } catch (error) {
    console.error('Failed to fetch rooms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { roomNumber, roomTypeId, floor } = data

    const room = await db.room.create({
      data: {
        roomNumber,
        roomTypeId,
        floor: parseInt(floor),
        status: 'available'
      },
      include: {
        roomType: true
      }
    })

    return NextResponse.json(room)
  } catch (error) {
    console.error('Failed to create room:', error)
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    )
  }
}