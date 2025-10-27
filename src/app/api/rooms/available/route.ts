import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const checkInDate = searchParams.get('checkInDate')
    const checkOutDate = searchParams.get('checkOutDate')

    if (!checkInDate || !checkOutDate) {
      return NextResponse.json({ error: 'Check-in and check-out dates are required' }, { status: 400 })
    }

    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)

    // Find booked rooms for the selected dates
    const bookedRooms = await db.booking.findMany({
      where: {
        status: { not: 'cancelled' },
        OR: [
          {
            AND: [
              { checkInDate: { lte: checkIn } },
              { checkOutDate: { gt: checkIn } }
            ]
          },
          {
            AND: [
              { checkInDate: { lt: checkOut } },
              { checkOutDate: { gte: checkOut } }
            ]
          },
          {
            AND: [
              { checkInDate: { gte: checkIn } },
              { checkOutDate: { lte: checkOut } }
            ]
          }
        ]
      },
      select: { roomId: true }
    })

    const bookedRoomIds = bookedRooms.map(booking => booking.roomId)

    // Find available rooms
    const availableRooms = await db.room.findMany({
      where: {
        id: { notIn: bookedRoomIds },
        status: 'available'
      },
      include: {
        roomType: true
      },
      orderBy: {
        roomNumber: 'asc'
      }
    })

    // Format response
    const formattedRooms = availableRooms.map(room => ({
      id: room.id,
      roomNumber: room.roomNumber,
      floor: room.floor,
      status: room.status,
      roomType: {
        id: room.roomType.id,
        name: room.roomType.name,
        description: room.roomType.description,
        price: room.roomType.price,
        capacity: room.roomType.capacity,
        amenities: room.roomType.amenities
      }
    }))

    return NextResponse.json(formattedRooms)
  } catch (error) {
    console.error('Failed to fetch available rooms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch available rooms' },
      { status: 500 }
    )
  }
}