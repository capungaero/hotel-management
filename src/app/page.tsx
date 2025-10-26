'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Search, Bed, Users, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface RoomType {
  id: string
  name: string
  description: string
  price: number
  capacity: number
  amenities: string
}

interface Room {
  id: string
  roomNumber: string
  roomType: RoomType
  status: string
  floor: number
}

export default function Home() {
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [selectedRoomType, setSelectedRoomType] = useState<string>('')
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchRoomTypes()
  }, [])

  const fetchRoomTypes = async () => {
    try {
      const response = await fetch('/api/room-types')
      const data = await response.json()
      setRoomTypes(data)
    } catch (error) {
      console.error('Failed to fetch room types:', error)
    }
  }

  const searchRooms = async () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates')
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams({
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        adults: adults.toString(),
        children: children.toString(),
        ...(selectedRoomType && { roomTypeId: selectedRoomType })
      })

      const response = await fetch(`/api/rooms/search?${params}`)
      const data = await response.json()
      setAvailableRooms(data)
      setShowResults(true)
    } catch (error) {
      console.error('Failed to search rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = (room: Room) => {
    // Navigate to booking page or open booking modal
    window.location.href = `/booking?roomId=${room.id}&checkIn=${checkIn?.toISOString()}&checkOut=${checkOut?.toISOString()}&adults=${adults}&children=${children}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bed className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">Hotel Booking System</h1>
            </div>
            <nav className="flex space-x-4">
              <Button variant="ghost" onClick={() => window.location.href = '/config'}>Configuration</Button>
              <Button variant="ghost" onClick={() => window.location.href = '/financial'}>Financial</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Stay</h2>
          <p className="text-xl mb-8 text-blue-100">Book comfortable rooms at affordable prices</p>
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4 -mt-10">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Available Rooms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Check-in Date */}
              <div className="space-y-2">
                <Label>Check-in Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkIn && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Check-out Date */}
              <div className="space-y-2">
                <Label>Check-out Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkOut && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut ? format(checkOut, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      disabled={(date) => date < (checkIn || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Room Type */}
              <div className="space-y-2">
                <Label>Room Type</Label>
                <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All types</SelectItem>
                    {roomTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name} - ${type.price}/night
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <Label>Guests</Label>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      min="1"
                      value={adults}
                      onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                      placeholder="Adults"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="number"
                      min="0"
                      value={children}
                      onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                      placeholder="Children"
                    />
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button 
                  onClick={searchRooms} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Searching...' : 'Search Rooms'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Results Section */}
      {showResults && (
        <section className="container mx-auto px-4 py-8">
          <h3 className="text-2xl font-bold mb-6">Available Rooms</h3>
          {availableRooms.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No rooms available for the selected dates.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableRooms.map((room) => (
                <Card key={room.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Room {room.roomNumber}</span>
                      <span className="text-sm font-normal text-gray-500">Floor {room.floor}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold">{room.roomType.name}</h4>
                        <p className="text-sm text-gray-600">{room.roomType.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>Up to {room.roomType.capacity} guests</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold">${room.roomType.price}/night</span>
                        </div>
                      </div>

                      {room.roomType.amenities && (
                        <div>
                          <p className="text-sm font-medium mb-1">Amenities:</p>
                          <div className="flex flex-wrap gap-1">
                            {JSON.parse(room.roomType.amenities).map((amenity: string, index: number) => (
                              <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button 
                        onClick={() => handleBooking(room)}
                        className="w-full"
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}