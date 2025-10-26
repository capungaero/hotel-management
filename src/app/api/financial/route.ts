import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const records = await db.financialRecord.findMany({
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json(records)
  } catch (error) {
    console.error('Failed to fetch financial records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch financial records' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { type, category, description, amount, date } = data

    const record = await db.financialRecord.create({
      data: {
        type,
        category,
        description,
        amount: parseFloat(amount),
        date: new Date(date)
      }
    })

    return NextResponse.json(record)
  } catch (error) {
    console.error('Failed to create financial record:', error)
    return NextResponse.json(
      { error: 'Failed to create financial record' },
      { status: 500 }
    )
  }
}