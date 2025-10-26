import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create room types
  const standardRoom = await prisma.roomType.create({
    data: {
      name: 'Standard Room',
      description: 'Comfortable room with basic amenities',
      price: 100,
      capacity: 2,
      amenities: JSON.stringify(['WiFi', 'TV', 'Air Conditioning', 'Private Bathroom'])
    }
  })

  const deluxeRoom = await prisma.roomType.create({
    data: {
      name: 'Deluxe Room',
      description: 'Spacious room with premium amenities',
      price: 150,
      capacity: 3,
      amenities: JSON.stringify(['WiFi', 'Smart TV', 'Mini Bar', 'Air Conditioning', 'Private Bathroom', 'Balcony'])
    }
  })

  const suiteRoom = await prisma.roomType.create({
    data: {
      name: 'Executive Suite',
      description: 'Luxury suite with separate living area',
      price: 250,
      capacity: 4,
      amenities: JSON.stringify(['WiFi', 'Smart TV', 'Mini Bar', 'Air Conditioning', 'Private Bathroom', 'Balcony', 'Living Room', 'Kitchenette'])
    }
  })

  console.log('Created room types')

  // Create rooms
  for (let floor = 1; floor <= 3; floor++) {
    for (let room = 1; room <= 5; room++) {
      const roomNumber = `${floor}${room.toString().padStart(2, '0')}`
      let roomTypeId = standardRoom.id

      if (roomNumber.endsWith('04') || roomNumber.endsWith('05')) {
        roomTypeId = deluxeRoom.id
      }
      if (roomNumber === '305') {
        roomTypeId = suiteRoom.id
      }

      await prisma.room.create({
        data: {
          roomNumber,
          roomTypeId,
          floor,
          status: 'available'
        }
      })
    }
  }

  console.log('Created rooms')

  // Create additional charges
  await prisma.additionalCharge.createMany({
    data: [
      {
        name: 'Breakfast',
        description: 'Continental breakfast buffet',
        price: 15,
        chargeType: 'per_person',
        isActive: true
      },
      {
        name: 'Lunch',
        description: '3-course lunch meal',
        price: 25,
        chargeType: 'per_person',
        isActive: true
      },
      {
        name: 'Dinner',
        description: '4-course dinner meal',
        price: 35,
        chargeType: 'per_person',
        isActive: true
      },
      {
        name: 'Spa Access',
        description: 'Full day spa access',
        price: 50,
        chargeType: 'per_stay',
        isActive: true
      },
      {
        name: 'Laundry Service',
        description: 'Professional laundry service',
        price: 20,
        chargeType: 'per_stay',
        isActive: true
      },
      {
        name: 'Airport Transfer',
        description: 'Round trip airport transfer',
        price: 40,
        chargeType: 'per_stay',
        isActive: true
      },
      {
        name: 'Late Checkout',
        description: 'Late checkout until 2 PM',
        price: 30,
        chargeType: 'per_stay',
        isActive: true
      }
    ]
  })

  console.log('Created additional charges')

  // Create some sample financial records
  await prisma.financialRecord.createMany({
    data: [
      {
        type: 'expense',
        category: 'utilities',
        description: 'Monthly electricity bill',
        amount: 500,
        date: new Date()
      },
      {
        type: 'expense',
        category: 'supplies',
        description: 'Cleaning supplies and toiletries',
        amount: 200,
        date: new Date()
      },
      {
        type: 'expense',
        category: 'salary',
        description: 'Staff salaries',
        amount: 3000,
        date: new Date()
      }
    ]
  })

  console.log('Created sample financial records')

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })