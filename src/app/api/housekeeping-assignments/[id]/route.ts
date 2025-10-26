import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    const updateData: any = {
      status: data.status,
      notes: data.notes
    }
    
    // Handle completion
    if (data.status === 'completed') {
      updateData.completedAt = new Date()
    } else if (data.status !== 'completed') {
      updateData.completedAt = null
    }
    
    const assignment = await db.housekeepingAssignment.update({
      where: { id: params.id },
      data: updateData,
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
    
    return NextResponse.json(assignment)
  } catch (error) {
    console.error('Failed to update housekeeping assignment:', error)
    return NextResponse.json(
      { error: 'Failed to update housekeeping assignment' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.housekeepingAssignment.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ message: 'Housekeeping assignment deleted successfully' })
  } catch (error) {
    console.error('Failed to delete housekeeping assignment:', error)
    return NextResponse.json(
      { error: 'Failed to delete housekeeping assignment' },
      { status: 500 }
    )
  }
}