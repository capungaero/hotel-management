import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      roomId,
      guestName,
      guestEmail,
      guestPhone,
      checkInDate,
      checkOutDate,
      adults,
      children,
      totalPrice,
      specialRequests,
      additionalCharges
    } = data

    // Create booking
    const booking = await db.booking.create({
      data: {
        roomId,
        guestName,
        guestEmail,
        guestPhone,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        adults: parseInt(adults),
        children: parseInt(children),
        totalPrice: parseFloat(totalPrice),
        specialRequests,
        status: 'confirmed'
      }
    })

    // Create booking charges if any
    if (additionalCharges && additionalCharges.length > 0) {
      for (const chargeId of additionalCharges) {
        const charge = await db.additionalCharge.findUnique({
          where: { id: chargeId }
        })

        if (charge) {
          await db.bookingCharge.create({
            data: {
              bookingId: booking.id,
              additionalChargeId: chargeId,
              quantity: 1,
              price: charge.price
            }
          })
        }
      }
    }

    // Create financial record for income
    await db.financialRecord.create({
      data: {
        type: 'income',
        category: 'room_booking',
        description: `Room booking for ${guestName} - Room ${roomId}`,
        amount: parseFloat(totalPrice),
        date: new Date(),
        referenceId: booking.id
      }
    })

    // Update room status
    await db.room.update({
      where: { id: roomId },
      data: { status: 'occupied' }
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Failed to create booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const bookings = await db.booking.findMany({
      include: {
        room: {
          include: {
            roomType: true
          }
        },
        payments: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}