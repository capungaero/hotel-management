import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    console.log('Testing database connection...')
    
    // Test database connection
    await db.$connect()
    console.log('Database connected successfully!')
    
    // Test simple query
    const count = await db.roomType.count()
    console.log('Room types count:', count)
    
    // Get room types
    const roomTypes = await db.roomType.findMany()
    console.log('Room types found:', roomTypes.length)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      count: count,
      roomTypes: roomTypes 
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: error.stack 
    }, { status: 500 })
  } finally {
    await db.$disconnect()
  }
}