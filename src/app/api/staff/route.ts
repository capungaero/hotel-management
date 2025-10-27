import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const staff = await db.staff.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        position: true,
        department: true,
        hireDate: true
      }
    })
    
    return NextResponse.json(staff)
  } catch (error) {
    console.error('Failed to fetch staff:', error)
    return NextResponse.json(
      { error: 'Failed to fetch staff' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const staff = await db.staff.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        position: data.position,
        department: data.department,
        hireDate: new Date(data.hireDate)
      }
    })
    
    return NextResponse.json(staff, { status: 201 })
  } catch (error) {
    console.error('Failed to create staff:', error)
    return NextResponse.json(
      { error: 'Failed to create staff' },
      { status: 500 }
    )
  }
}