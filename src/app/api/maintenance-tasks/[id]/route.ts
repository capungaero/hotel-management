import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const task = await db.maintenanceTask.findUnique({
      where: { id: params.id },
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
    
    if (!task) {
      return NextResponse.json(
        { error: 'Maintenance task not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(task)
  } catch (error) {
    console.error('Failed to fetch maintenance task:', error)
    return NextResponse.json(
      { error: 'Failed to fetch maintenance task' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    const updateData: any = {
      title: data.title,
      description: data.description,
      categoryId: data.categoryId,
      priority: data.priority,
      assignedTo: data.assignedTo || null,
      roomId: data.roomId || null,
      scheduledDate: new Date(data.scheduledDate),
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      estimatedHours: data.estimatedHours ? parseFloat(data.estimatedHours) : null,
      actualHours: data.actualHours ? parseFloat(data.actualHours) : null,
      notes: data.notes
    }
    
    // Handle status changes
    if (data.status === 'completed' && data.status !== 'currentStatus') {
      updateData.completedAt = new Date()
    } else if (data.status !== 'completed' && data.status === 'currentStatus') {
      updateData.completedAt = null
    }
    
    if (data.status) {
      updateData.status = data.status
    }
    
    const task = await db.maintenanceTask.update({
      where: { id: params.id },
      data: updateData,
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
    
    return NextResponse.json(task)
  } catch (error) {
    console.error('Failed to update maintenance task:', error)
    return NextResponse.json(
      { error: 'Failed to update maintenance task' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.maintenanceTask.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ message: 'Maintenance task deleted successfully' })
  } catch (error) {
    console.error('Failed to delete maintenance task:', error)
    return NextResponse.json(
      { error: 'Failed to delete maintenance task' },
      { status: 500 }
    )
  }
}