import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const tasks = await db.housekeepingTask.findMany({
      where: { isActive: true },
      orderBy: { category: 'asc' }
    })
    
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Failed to fetch housekeeping tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch housekeeping tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const task = await db.housekeepingTask.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        estimatedTime: parseInt(data.estimatedTime) || 30
      }
    })
    
    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Failed to create housekeeping task:', error)
    return NextResponse.json(
      { error: 'Failed to create housekeeping task' },
      { status: 500 }
    )
  }
}