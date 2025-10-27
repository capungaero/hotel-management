import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const categories = await db.maintenanceCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })
    
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Failed to fetch maintenance categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch maintenance categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const category = await db.maintenanceCategory.create({
      data: {
        name: data.name,
        description: data.description,
        color: data.color || '#3B82F6'
      }
    })
    
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Failed to create maintenance category:', error)
    return NextResponse.json(
      { error: 'Failed to create maintenance category' },
      { status: 500 }
    )
  }
}