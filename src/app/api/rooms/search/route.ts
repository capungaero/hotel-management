import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const checkIn = new Date(searchParams.get('checkIn')!)
    const checkOut = new Date(searchParams.get('checkOut')!)
    const adults = parseInt(searchParams.get('adults') || '2')
    const children = parseInt(searchParams.get('children') || '0')
    const roomTypeId = searchParams.get('roomTypeId')

    // Find rooms that are available for the given dates
    const bookedRooms = await db.booking.findMany({
      where: {
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
        ],
        status: {
          notIn: ['cancelled']
        }
      },
      select: {
        roomId: true
      }
    })

    const bookedRoomIds = bookedRooms.map(booking => booking.roomId)

    // Build the where clause
    const whereClause: any = {
      id: {
        notIn: bookedRoomIds
      },
      status: 'available'
    }

    if (roomTypeId) {
      whereClause.roomTypeId = roomTypeId
    }

    // Find available rooms with capacity filter
    const availableRooms = await db.room.findMany({
      where: whereClause,
      include: {
        roomType: {
          where: {
            capacity: {
              gte: adults + children
            }
          }
        }
      },
      orderBy: {
        roomNumber: 'asc'
      }
    })

    // Filter out rooms that don't have matching room types
    const filteredRooms = availableRooms.filter(room => room.roomType !== null)

    return NextResponse.json(filteredRooms)
  } catch (error) {
    console.error('Failed to search rooms:', error)
    return NextResponse.json(
      { error: 'Failed to search rooms' },
      { status: 500 }
    )
  }
}