import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      guestName,
      guestEmail,
      guestPhone,
      roomId,
      checkInDate,
      checkOutDate,
      adults,
      children,
      specialRequests
    } = body

    // Validate required fields
    if (!guestName || !guestEmail || !guestPhone || !roomId || !checkInDate || !checkOutDate || !adults) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate dates
    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    
    if (checkIn >= checkOut) {
      return NextResponse.json(
        { error: 'Check-out date must be after check-in date' },
        { status: 400 }
      )
    }

    if (checkIn < new Date().setHours(0, 0, 0, 0)) {
      return NextResponse.json(
        { error: 'Check-in date cannot be in the past' },
        { status: 400 }
      )
    }

    // Check if room exists and is available
    const room = await db.room.findUnique({
      where: { id: roomId },
      include: { roomType: true }
    })

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      )
    }

    // Check for conflicting bookings
    const conflictingBooking = await db.booking.findFirst({
      where: {
        roomId,
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
      }
    })

    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'Room is not available for the selected dates' },
        { status: 409 }
      )
    }

    // Calculate total price
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    const totalPrice = nights * room.roomType.price

    // Create booking
    const booking = await db.booking.create({
      data: {
        guestName,
        guestEmail,
        guestPhone,
        roomId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        adults: parseInt(adults),
        children: parseInt(children) || 0,
        totalPrice,
        status: 'confirmed',
        specialRequests: specialRequests || null
      },
      include: {
        room: {
          include: {
            roomType: true
          }
        }
      }
    })

    // Update room status
    await db.room.update({
      where: { id: roomId },
      data: { status: 'booked' }
    })

    // Create financial record
    await db.financialRecord.create({
      data: {
        type: 'income',
        category: 'booking',
        description: `Booking for ${guestName} - Room ${room.roomNumber}`,
        amount: totalPrice,
        date: new Date(),
        referenceId: booking.id
      }
    })

    // Format response
    const responseBooking = {
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
    }

    return NextResponse.json(responseBooking, { status: 201 })
  } catch (error) {
    console.error('Failed to create booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}