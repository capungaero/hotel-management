import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const assignedTo = searchParams.get('assignedTo')
    const status = searchParams.get('status')
    
    const where: any = {}
    
    if (date) {
      const targetDate = new Date(date)
      const nextDay = new Date(targetDate)
      nextDay.setDate(nextDay.getDate() + 1)
      
      where.scheduledDate = {
        gte: targetDate,
        lt: nextDay
      }
    }
    
    if (assignedTo) where.assignedTo = assignedTo
    if (status) where.status = status
    
    const assignments = await db.housekeepingAssignment.findMany({
      where,
      include: {
        task: true,
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
    
    return NextResponse.json(assignments)
  } catch (error) {
    console.error('Failed to fetch housekeeping assignments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch housekeeping assignments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const assignment = await db.housekeepingAssignment.create({
      data: {
        taskId: data.taskId,
        assignedTo: data.assignedTo,
        roomId: data.roomId || null,
        scheduledDate: new Date(data.scheduledDate),
        priority: data.priority || 'medium',
        notes: data.notes
      },
      include: {
        task: true,
        staff: {
          select: { id: true, name: true, email: true }
        },
        room: {
          select: { id: true, roomNumber: true }
        }
      }
    })
    
    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error('Failed to create housekeeping assignment:', error)
    return NextResponse.json(
      { error: 'Failed to create housekeeping assignment' },
      { status: 500 }
    )
  }
}