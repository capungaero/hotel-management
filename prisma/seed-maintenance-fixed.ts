import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding maintenance and housekeeping data...')

  // Get existing rooms
  const rooms = await prisma.room.findMany()
  if (rooms.length === 0) {
    console.log('❌ No rooms found. Please run the main seed first.')
    return
  }

  // Create maintenance categories
  const maintenanceCategories = await Promise.all([
    prisma.maintenanceCategory.create({
      data: {
        name: 'HVAC System',
        description: 'Heating, ventilation, and air conditioning maintenance',
        color: '#FF6B6B'
      }
    }),
    prisma.maintenanceCategory.create({
      data: {
        name: 'Plumbing',
        description: 'Pipes, drains, and fixtures maintenance',
        color: '#4ECDC4'
      }
    }),
    prisma.maintenanceCategory.create({
      data: {
        name: 'Electrical',
        description: 'Electrical systems and equipment maintenance',
        color: '#45B7D1'
      }
    }),
    prisma.maintenanceCategory.create({
      data: {
        name: 'General Repairs',
        description: 'General building and furniture repairs',
        color: '#96CEB4'
      }
    }),
    prisma.maintenanceCategory.create({
      data: {
        name: 'Safety Equipment',
        description: 'Fire safety, emergency equipment maintenance',
        color: '#FFEAA7'
      }
    })
  ])

  console.log('✅ Created maintenance categories')

  // Create staff
  const maintenanceStaff = await Promise.all([
    prisma.staff.create({
      data: {
        name: 'John Smith',
        email: 'john.smith@hotel.com',
        phone: '+1234567890',
        position: 'Maintenance Technician',
        department: 'maintenance',
        hireDate: new Date('2023-01-15')
      }
    }),
    prisma.staff.create({
      data: {
        name: 'Mike Johnson',
        email: 'mike.johnson@hotel.com',
        phone: '+1234567891',
        position: 'Maintenance Supervisor',
        department: 'maintenance',
        hireDate: new Date('2022-06-10')
      }
    })
  ])

  const housekeepingStaff = await Promise.all([
    prisma.staff.create({
      data: {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@hotel.com',
        phone: '+1234567892',
        position: 'Housekeeper',
        department: 'housekeeping',
        hireDate: new Date('2023-03-20')
      }
    }),
    prisma.staff.create({
      data: {
        name: 'Maria Garcia',
        email: 'maria.garcia@hotel.com',
        phone: '+1234567893',
        position: 'Housekeeper',
        department: 'housekeeping',
        hireDate: new Date('2023-02-10')
      }
    }),
    prisma.staff.create({
      data: {
        name: 'Lisa Chen',
        email: 'lisa.chen@hotel.com',
        phone: '+1234567894',
        position: 'Housekeeping Supervisor',
        department: 'housekeeping',
        hireDate: new Date('2022-11-05')
      }
    })
  ])

  console.log('✅ Created staff members')

  // Create housekeeping tasks
  const housekeepingTasks = await Promise.all([
    prisma.housekeepingTask.create({
      data: {
        name: 'Clean Bathroom',
        description: 'Clean and sanitize bathroom fixtures, floor, and mirror',
        category: 'bathroom',
        estimatedTime: 30
      }
    }),
    prisma.housekeepingTask.create({
      data: {
        name: 'Change Bed Linens',
        description: 'Remove used linens and make bed with fresh linens',
        category: 'bedroom',
        estimatedTime: 15
      }
    }),
    prisma.housekeepingTask.create({
      data: {
        name: 'Vacuum Carpet',
        description: 'Vacuum all carpeted areas in the room',
        category: 'bedroom',
        estimatedTime: 20
      }
    }),
    prisma.housekeepingTask.create({
      data: {
        name: 'Dust Furniture',
        description: 'Dust all surfaces including furniture, shelves, and decorations',
        category: 'bedroom',
        estimatedTime: 15
      }
    }),
    prisma.housekeepingTask.create({
      data: {
        name: 'Clean Windows',
        description: 'Clean interior windows and glass surfaces',
        category: 'bedroom',
        estimatedTime: 10
      }
    }),
    prisma.housekeepingTask.create({
      data: {
        name: 'Restock Amenities',
        description: 'Restock toiletries, coffee, and other room amenities',
        category: 'bedroom',
        estimatedTime: 10
      }
    }),
    prisma.housekeepingTask.create({
      data: {
        name: 'Clean Lobby Area',
        description: 'Vacuum, dust, and clean main lobby area',
        category: 'public_area',
        estimatedTime: 45
      }
    }),
    prisma.housekeepingTask.create({
      data: {
        name: 'Clean Hallways',
        description: 'Vacuum and clean all hallway surfaces',
        category: 'public_area',
        estimatedTime: 30
      }
    }),
    prisma.housekeepingTask.create({
      data: {
        name: 'Empty Trash',
        description: 'Empty and replace trash liners in all areas',
        category: 'public_area',
        estimatedTime: 15
      }
    }),
    prisma.housekeepingTask.create({
      data: {
        name: 'Clean Kitchen Area',
        description: 'Clean and sanitize kitchen surfaces and equipment',
        category: 'kitchen',
        estimatedTime: 60
      }
    })
  ])

  console.log('✅ Created housekeeping tasks')

  // Create some sample maintenance tasks using existing rooms
  const sampleMaintenanceTasks = await Promise.all([
    prisma.maintenanceTask.create({
      data: {
        title: 'Fix Air Conditioning in Room ' + rooms[0].roomNumber,
        description: 'AC unit not cooling properly, needs inspection and repair',
        categoryId: maintenanceCategories[0].id, // HVAC
        priority: 'high',
        assignedTo: maintenanceStaff[0].id,
        roomId: rooms[0].id,
        scheduledDate: new Date(),
        estimatedHours: 2,
        notes: 'Guest reported AC not working since yesterday'
      }
    }),
    prisma.maintenanceTask.create({
      data: {
        title: 'Replace Light Bulbs in Hallway',
        description: 'Several LED lights are flickering and need replacement',
        categoryId: maintenanceCategories[2].id, // Electrical
        priority: 'medium',
        assignedTo: maintenanceStaff[0].id,
        scheduledDate: new Date(),
        estimatedHours: 1,
        notes: 'LED bulbs needed from storage'
      }
    }),
    prisma.maintenanceTask.create({
      data: {
        title: 'Check Fire Extinguishers',
        description: 'Monthly inspection and maintenance of fire safety equipment',
        categoryId: maintenanceCategories[4].id, // Safety Equipment
        priority: 'medium',
        assignedTo: maintenanceStaff[1].id,
        scheduledDate: new Date(),
        estimatedHours: 3,
        notes: 'Check all floors and document inspection'
      }
    })
  ])

  console.log('✅ Created sample maintenance tasks')

  // Create some sample housekeeping assignments for today
  const today = new Date()
  today.setHours(9, 0, 0, 0) // Set to 9 AM today

  const sampleAssignments = await Promise.all([
    prisma.housekeepingAssignment.create({
      data: {
        taskId: housekeepingTasks[0].id, // Clean Bathroom
        assignedTo: housekeepingStaff[0].id,
        roomId: rooms[0].id,
        scheduledDate: today,
        priority: 'high',
        status: 'pending'
      }
    }),
    prisma.housekeepingAssignment.create({
      data: {
        taskId: housekeepingTasks[1].id, // Change Bed Linens
        assignedTo: housekeepingStaff[0].id,
        roomId: rooms[0].id,
        scheduledDate: today,
        priority: 'high',
        status: 'pending'
      }
    }),
    prisma.housekeepingAssignment.create({
      data: {
        taskId: housekeepingTasks[6].id, // Clean Lobby Area
        assignedTo: housekeepingStaff[1].id,
        scheduledDate: today,
        priority: 'medium',
        status: 'in_progress'
      }
    }),
    prisma.housekeepingAssignment.create({
      data: {
        taskId: housekeepingTasks[2].id, // Vacuum Carpet
        assignedTo: housekeepingStaff[2].id,
        roomId: rooms.length > 1 ? rooms[1].id : rooms[0].id,
        scheduledDate: today,
        priority: 'medium',
        status: 'completed',
        completedAt: new Date(),
        notes: 'Carpet cleaned successfully'
      }
    })
  ])

  console.log('✅ Created sample housekeeping assignments')

  console.log('🎉 Maintenance and housekeeping data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })