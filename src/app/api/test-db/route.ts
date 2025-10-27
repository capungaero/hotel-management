import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { testSupabaseConnection } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('Testing database connections...')
    
    // Test Prisma/Supabase connection
    await db.$connect()
    console.log('Prisma database connected successfully!')
    
    // Test simple query
    const count = await db.roomType.count()
    console.log('Room types count:', count)
    
    // Get room types
    const roomTypes = await db.roomType.findMany()
    console.log('Room types found:', roomTypes.length)
    
    // Test Supabase client connection
    const supabaseTest = await testSupabaseConnection()
    console.log('Supabase client test:', supabaseTest)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connections successful',
      prisma: {
        connected: true,
        roomTypesCount: count,
        roomTypes: roomTypes 
      },
      supabase: supabaseTest,
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
        databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
      }
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: error.stack,
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
        databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
      }
    }, { status: 500 })
  } finally {
    await db.$disconnect()
  }
}