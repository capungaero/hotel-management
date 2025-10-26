import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    if (!month || !year) {
      return NextResponse.json({ error: 'Month and year are required' }, { status: 400 })
    }

    // Calculate start and end dates for the month
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
    const endDate = new Date(parseInt(year), parseInt(month), 0) // Last day of month

    // Fetch bookings for the specified month
    const bookings = await db.booking.findMany({
      where: {
        OR: [
          {
            AND: [
              { checkInDate: { lte: endDate } },
              { checkOutDate: { gt: startDate } }
            ]
          }
        ],
        status: {
          not: 'cancelled'
        }
      },
      include: {
        room: {
          include: {
            roomType: true
          }
        }
      },
      orderBy: {
        checkInDate: 'asc'
      }
    })

    // Format bookings for calendar display
    const calendarBookings = bookings.map(booking => ({
      id: booking.id,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone,
      checkInDate: booking.checkInDate.toISOString().split('T')[0],
      checkOutDate: booking.checkOutDate.toISOString().split('T')[0],
      adults: booking.adults,
      children: booking.children,
      totalPrice: booking.totalPrice,
      status: booking.status,
      specialRequests: booking.specialRequests,
      room: {
        id: booking.room.id,
        roomNumber: booking.room.roomNumber,
        roomType: {
          name: booking.room.roomType.name,
          price: booking.room.roomType.price
        }
      },
      createdAt: booking.createdAt.toISOString()
    }))

    return NextResponse.json(calendarBookings)
  } catch (error) {
    console.error('Failed to fetch calendar bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calendar bookings' },
      { status: 500 }
    )
  }
}