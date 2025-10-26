import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('Testing database connection...')
    
    // Test database connection
    await prisma.$connect()
    console.log('Database connected successfully!')
    
    // Test simple query
    const count = await prisma.roomType.count()
    console.log('Room types count:', count)
    
    // Get room types
    const roomTypes = await prisma.roomType.findMany()
    console.log('Room types found:', roomTypes.length)
    
    return Response.json({ 
      success: true, 
      message: 'Database connection successful',
      count: count,
      roomTypes: roomTypes 
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return Response.json({ 
      success: false, 
      error: error.message,
      details: error.stack 
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}