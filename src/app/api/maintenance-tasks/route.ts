import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const assignedTo = searchParams.get('assignedTo')
    const categoryId = searchParams.get('categoryId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    const where: any = {}
    
    if (status) where.status = status
    if (assignedTo) where.assignedTo = assignedTo
    if (categoryId) where.categoryId = categoryId
    if (startDate && endDate) {
      where.scheduledDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }
    
    const tasks = await db.maintenanceTask.findMany({
      where,
      include: {
        category: true,
        staff: {
          select: { id: true, name: true, email: true }
        },
        room: {
          select: { id: true, roomNumber: true }
        }
      },
      orderBy: [
        { status: 'asc' },
        { priority: 'desc' },
        { scheduledDate: 'asc' }
      ]
    })
    
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Failed to fetch maintenance tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch maintenance tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const task = await db.maintenanceTask.create({
      data: {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        priority: data.priority || 'medium',
        assignedTo: data.assignedTo || null,
        roomId: data.roomId || null,
        scheduledDate: new Date(data.scheduledDate),
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        estimatedHours: data.estimatedHours ? parseFloat(data.estimatedHours) : null,
        notes: data.notes
      },
      include: {
        category: true,
        staff: {
          select: { id: true, name: true, email: true }
        },
        room: {
          select: { id: true, roomNumber: true }
        }
      }
    })
    
    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Failed to create maintenance task:', error)
    return NextResponse.json(
      { error: 'Failed to create maintenance task' },
      { status: 500 }
    )
  }
}