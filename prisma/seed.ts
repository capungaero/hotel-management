import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create room types
  const standardRoom = await prisma.roomType.create({
    data: {
      name: 'Standard Room',
      description: 'Comfortable room with basic amenities',
      price: 500000,
      capacity: 2,
      amenities: JSON.stringify(['AC', 'TV', 'WiFi', 'Bathroom'])
    }
  })

  const deluxeRoom = await prisma.roomType.create({
    data: {
      name: 'Deluxe Room',
      description: 'Spacious room with premium amenities',
      price: 750000,
      capacity: 2,
      amenities: JSON.stringify(['AC', 'TV', 'WiFi', 'Mini Bar', 'Bathroom', 'Balcony'])
    }
  })

  const suiteRoom = await prisma.roomType.create({
    data: {
      name: 'Suite Room',
      description: 'Luxury suite with separate living area',
      price: 1500000,
      capacity: 4,
      amenities: JSON.stringify(['AC', 'TV', 'WiFi', 'Mini Bar', 'Bathroom', 'Balcony', 'Living Room', 'Kitchen'])
    }
  })

  console.log('Room types created:', { standardRoom, deluxeRoom, suiteRoom })

  // Create some rooms
  for (let i = 1; i <= 10; i++) {
    let roomTypeId
    let roomNumber
    
    if (i <= 5) {
      roomTypeId = standardRoom.id
      roomNumber = `100${i}`
    } else if (i <= 8) {
      roomTypeId = deluxeRoom.id
      roomNumber = `200${i - 5}`
    } else {
      roomTypeId = suiteRoom.id
      roomNumber = `300${i - 8}`
    }

    await prisma.room.create({
      data: {
        roomNumber,
        roomTypeId,
        floor: Math.floor(i / 4) + 1,
        status: 'available'
      }
    })
  }

  console.log('Rooms created successfully')

  // Create maintenance categories
  const electricalCategory = await prisma.maintenanceCategory.create({
    data: {
      name: 'Electrical',
      description: 'Electrical maintenance and repairs',
      color: '#FF6B6B'
    }
  })

  const plumbingCategory = await prisma.maintenanceCategory.create({
    data: {
      name: 'Plumbing',
      description: 'Plumbing maintenance and repairs',
      color: '#4ECDC4'
    }
  })

  const hvacCategory = await prisma.maintenanceCategory.create({
    data: {
      name: 'HVAC',
      description: 'Heating, ventilation, and air conditioning',
      color: '#45B7D1'
    }
  })

  console.log('Maintenance categories created')

  // Create housekeeping tasks
  const dailyCleaning = await prisma.housekeepingTask.create({
    data: {
      name: 'Daily Room Cleaning',
      description: 'Complete room cleaning and sanitization',
      category: 'bedroom',
      estimatedTime: 30
    }
  })

  const bathroomCleaning = await prisma.housekeepingTask.create({
    data: {
      name: 'Bathroom Cleaning',
      description: 'Thorough bathroom cleaning and restocking',
      category: 'bathroom',
      estimatedTime: 20
    }
  })

  const publicAreaCleaning = await prisma.housekeepingTask.create({
    data: {
      name: 'Public Area Cleaning',
      description: 'Cleaning of lobby, corridors, and common areas',
      category: 'public_area',
      estimatedTime: 45
    }
  })

  console.log('Housekeeping tasks created')

  // Create staff members
  const housekeeper1 = await prisma.staff.create({
    data: {
      name: 'Siti Nurhaliza',
      email: 'siti@hotel.com',
      phone: '+62812345678',
      position: 'housekeeper',
      department: 'housekeeping',
      hireDate: new Date('2024-01-15')
    }
  })

  const housekeeper2 = await prisma.staff.create({
    data: {
      name: 'Budi Santoso',
      email: 'budi@hotel.com',
      phone: '+62823456789',
      position: 'housekeeper',
      department: 'housekeeping',
      hireDate: new Date('2024-02-01')
    }
  })

  const maintenance1 = await prisma.staff.create({
    data: {
      name: 'Ahmad Wijaya',
      email: 'ahmad@hotel.com',
      phone: '+62834567890',
      position: 'maintenance',
      department: 'maintenance',
      hireDate: new Date('2024-01-20')
    }
  })

  console.log('Staff members created')

  // Create sample financial records
  await prisma.financialRecord.createMany({
    data: [
      {
        type: 'income',
        category: 'room_booking',
        description: 'Standard Room Booking - Room 1001',
        amount: 500000,
        date: new Date()
      },
      {
        type: 'income',
        category: 'room_booking',
        description: 'Deluxe Room Booking - Room 2001',
        amount: 750000,
        date: new Date()
      },
      {
        type: 'expense',
        category: 'salary',
        description: 'Staff Salary Payment',
        amount: 5000000,
        date: new Date()
      },
      {
        type: 'expense',
        category: 'maintenance',
        description: 'AC Repair Cost',
        amount: 250000,
        date: new Date()
      }
    ]
  })

  console.log('Financial records created')

  console.log('Seeding finished successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })