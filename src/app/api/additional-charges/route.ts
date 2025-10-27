import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const charges = await db.additionalCharge.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(charges)
  } catch (error) {
    console.error('Failed to fetch additional charges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch additional charges' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, description, price, chargeType } = data

    const charge = await db.additionalCharge.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        chargeType
      }
    })

    return NextResponse.json(charge)
  } catch (error) {
    console.error('Failed to create additional charge:', error)
    return NextResponse.json(
      { error: 'Failed to create additional charge' },
      { status: 500 }
    )
  }
}