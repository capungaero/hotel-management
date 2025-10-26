'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, Search, Bed, Users, DollarSign, CalendarDays, MapPin, Phone, Mail } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

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

interface Booking {
  id: string
  guestName: string
  guestEmail: string
  guestPhone: string
  checkInDate: string
  checkOutDate: string
  adults: number
  children: number
  totalPrice: number
  status: string
  specialRequests?: string
  room: {
    id: string
    roomNumber: string
    roomType: {
      name: string
      price: number
    }
  }
  createdAt: string
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
  
  // Calendar states
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedDateBookings, setSelectedDateBookings] = useState<Booking[]>([])
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [calendarLoading, setCalendarLoading] = useState(false)
  
  // Booking creation states
  const [showCreateBookingModal, setShowCreateBookingModal] = useState(false)
  const [availableRoomsForDate, setAvailableRoomsForDate] = useState<Room[]>([])
  const [bookingForm, setBookingForm] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    roomId: '',
    adults: 2,
    children: 0,
    specialRequests: ''
  })
  const [createBookingLoading, setCreateBookingLoading] = useState(false)
  
  // Double click and confirmation states
  const [lastClickedDate, setLastClickedDate] = useState<Date | undefined>()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchRoomTypes()
    fetchCalendarBookings()
  }, [])
  
  useEffect(() => {
    fetchCalendarBookings()
  }, [currentMonth])
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeout) {
        clearTimeout(clickTimeout)
      }
    }
  }, [clickTimeout])

  const fetchRoomTypes = async () => {
    try {
      const response = await fetch('/api/room-types')
      const data = await response.json()
      setRoomTypes(data)
    } catch (error) {
      console.error('Failed to fetch room types:', error)
    }
  }
  
  const fetchCalendarBookings = async () => {
    setCalendarLoading(true)
    try {
      const month = (currentMonth.getMonth() + 1).toString().padStart(2, '0')
      const year = currentMonth.getFullYear().toString()
      const response = await fetch(`/api/bookings/calendar?month=${month}&year=${year}`)
      const data = await response.json()
      setBookings(data)
    } catch (error) {
      console.error('Failed to fetch calendar bookings:', error)
    } finally {
      setCalendarLoading(false)
    }
  }
  
  const getBookingsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return bookings.filter(booking => {
      const checkIn = booking.checkInDate
      const checkOut = booking.checkOutDate
      return dateStr >= checkIn && dateStr < checkOut
    })
  }
  
  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return
    
    const dateBookings = getBookingsForDate(date)
    
    if (dateBookings.length > 0) {
      // Single click for existing bookings - show details immediately
      setSelectedDate(date)
      setSelectedDateBookings(dateBookings)
      setShowBookingModal(true)
    } else {
      // Check if date is in the future for potential booking creation
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (date >= today) {
        // Check for double click
        if (lastClickedDate && date.getTime() === lastClickedDate.getTime()) {
          // Double click detected
          if (clickTimeout) {
            clearTimeout(clickTimeout)
            setClickTimeout(null)
          }
          setSelectedDate(date)
          setShowConfirmDialog(true)
        } else {
          // First click - wait for potential second click
          setLastClickedDate(date)
          const timeout = setTimeout(() => {
            setLastClickedDate(undefined)
            setClickTimeout(null)
          }, 300)
          setClickTimeout(timeout)
        }
      }
    }
  }
  
  const handleConfirmAddBooking = async () => {
    setShowConfirmDialog(false)
    await fetchAvailableRoomsForDate(selectedDate!)
    setShowCreateBookingModal(true)
  }
  
  const handleCancelAddBooking = () => {
    setShowConfirmDialog(false)
    setSelectedDate(undefined)
    setLastClickedDate(undefined)
  }
  
  const fetchAvailableRoomsForDate = async (date: Date) => {
    try {
      // For single day booking, check next day as check-out
      const checkIn = format(date, 'yyyy-MM-dd')
      const checkOut = format(new Date(date.getTime() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
      
      const response = await fetch(`/api/rooms/available?checkInDate=${checkIn}&checkOutDate=${checkOut}`)
      const data = await response.json()
      setAvailableRoomsForDate(data)
    } catch (error) {
      console.error('Failed to fetch available rooms:', error)
    }
  }
  
  const handleCreateBooking = async () => {
    if (!selectedDate || !bookingForm.guestName || !bookingForm.guestEmail || !bookingForm.guestPhone || !bookingForm.roomId) {
      alert('Please fill in all required fields')
      return
    }
    
    setCreateBookingLoading(true)
    try {
      const checkIn = format(selectedDate, 'yyyy-MM-dd')
      const checkOut = format(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
      
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingForm,
          checkInDate: checkIn,
          checkOutDate: checkOut
        })
      })
      
      if (response.ok) {
        const newBooking = await response.json()
        alert('Booking created successfully!')
        setShowCreateBookingModal(false)
        setBookingForm({
          guestName: '',
          guestEmail: '',
          guestPhone: '',
          roomId: '',
          adults: 2,
          children: 0,
          specialRequests: ''
        })
        // Refresh calendar bookings
        fetchCalendarBookings()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create booking')
      }
    } catch (error) {
      console.error('Failed to create booking:', error)
      alert('Failed to create booking')
    } finally {
      setCreateBookingLoading(false)
    }
  }
  
  const isDateWithBooking = (date: Date) => {
    return getBookingsForDate(date).length > 0
  }
  
  const getBookingCountForDate = (date: Date) => {
    return getBookingsForDate(date).length
  }

  const searchRooms = async () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates')
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams({
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        adults: adults.toString(),
        children: children.toString(),
        ...(selectedRoomType && selectedRoomType !== 'all' && { roomTypeId: selectedRoomType })
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
    window.location.href = `/booking?roomId=${room.id}&checkIn=${checkIn?.toISOString().split('T')[0]}&checkOut=${checkOut?.toISOString().split('T')[0]}&adults=${adults}&children=${children}`
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
                    <SelectItem value="all">All types</SelectItem>
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

      {/* Booking Calendar Section */}
      <section className="container mx-auto px-4 py-8">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <CalendarDays className="h-6 w-6" />
              <span>Booking Calendar</span>
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                {format(currentMonth, 'MMMM yyyy')}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col xl:flex-row gap-8">
              {/* Calendar */}
              <div className="flex-1">
                {calendarLoading ? (
                  <div className="flex justify-center items-center h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading calendar...</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      month={currentMonth}
                      onMonthChange={setCurrentMonth}
                      className="w-full border-0 rounded-lg"
                      modifiers={{
                        hasBooking: isDateWithBooking
                      }}
                      modifiersStyles={{
                        hasBooking: {
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          fontWeight: 'bold',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }
                      }}
                      components={{
                        DayContent: ({ date, ...props }) => {
                          const bookingCount = getBookingCountForDate(date)
                          const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                          const isPast = date < new Date() && !isToday
                          
                          return (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <div 
                                {...props} 
                                className={`
                                  ${isToday ? 'bg-blue-100 text-blue-600 font-bold rounded-lg' : ''}
                                  ${isPast ? 'text-gray-400' : ''}
                                  ${!isToday && !isPast ? 'hover:bg-gray-100 rounded-lg transition-colors' : ''}
                                  w-8 h-8 flex items-center justify-center text-sm
                                `}
                              >
                                {date.getDate()}
                              </div>
                              {bookingCount > 0 && (
                                <div className="absolute bottom-1 right-1 flex gap-0.5">
                                  {bookingCount <= 3 ? (
                                    Array.from({ length: bookingCount }).map((_, i) => (
                                      <div 
                                        key={i} 
                                        className="w-1.5 h-1.5 bg-gradient-to-r from-pink-500 to-red-500 rounded-full"
                                      ></div>
                                    ))
                                  ) : (
                                    <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                      <span className="text-xs text-white font-bold">+</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        },
                        Head: () => {
                          const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                          return (
                            <div className="grid grid-cols-7 mb-2">
                              {weekdays.map((day, index) => (
                                <div 
                                  key={index} 
                                  className={`
                                    text-center text-xs font-semibold py-2
                                    ${index === 0 || index === 6 ? 'text-red-500' : 'text-gray-700'}
                                  `}
                                >
                                  {day}
                                </div>
                              ))}
                            </div>
                          )
                        }
                      }}
                    />
                  </div>
                )}
              </div>
              
              {/* Legend & Stats */}
              <div className="xl:w-96">
                <div className="space-y-6">
                  {/* Calendar Legend */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                    <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      Calendar Legend
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                        <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-sm"></div>
                        <span className="text-sm font-medium">Dates with bookings</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                        <div className="flex gap-0.5">
                          <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">Booking indicators</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                        <div className="w-6 h-6 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600">T</span>
                        </div>
                        <span className="text-sm font-medium">Today</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Monthly Stats */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                    <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      Monthly Stats
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Total Bookings</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {bookings.length}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Occupied Rooms</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {bookings.reduce((acc, booking) => acc + 1, 0)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Total Revenue</span>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          ${bookings.reduce((acc, booking) => acc + booking.totalPrice, 0).toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Tips */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                    <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                      Quick Tips
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span><strong>Click</strong> on highlighted dates to see booking details</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span><strong>Double-click</strong> on empty dates to add new booking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        <span>Use arrow buttons to navigate between months</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>Colored dots indicate number of active bookings</span>
                      </li>
                    </ul>
                  </div>
                </div>
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
                            {(() => {
                              try {
                                return JSON.parse(room.roomType.amenities).map((amenity: string, index: number) => (
                                  <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {amenity}
                                  </span>
                                ))
                              } catch (error) {
                                return (
                                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {room.roomType.amenities}
                                  </span>
                                )
                              }
                            })()}
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
      
      {/* Booking Detail Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Booking Details for {selectedDate && format(selectedDate, 'PPP')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedDateBookings.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No bookings found for this date.</p>
            ) : (
              selectedDateBookings.map((booking) => (
                <Card key={booking.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Guest Information */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-lg">Guest Information</h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Name:</span>
                            <span className="text-sm">{booking.guestName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{booking.guestEmail}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{booking.guestPhone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                              {booking.adults} adults {booking.children > 0 && `+ ${booking.children} children`}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Booking Information */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-lg">Booking Information</h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                              Room {booking.room.roomNumber} ({booking.room.roomType.name})
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                              {format(new Date(booking.checkInDate), 'MMM dd')} - {format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-semibold">${booking.totalPrice}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {booking.specialRequests && (
                      <div className="mt-4 p-3 bg-gray-50 rounded">
                        <h5 className="font-medium text-sm mb-1">Special Requests:</h5>
                        <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Create Booking Modal */}
      <Dialog open={showCreateBookingModal} onOpenChange={setShowCreateBookingModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Create Booking for {selectedDate && format(selectedDate, 'PPP')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Available Rooms */}
            <div>
              <h4 className="font-semibold mb-3">Available Rooms</h4>
              {availableRoomsForDate.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No rooms available for this date.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                  {availableRoomsForDate.map((room) => (
                    <Card 
                      key={room.id} 
                      className={`cursor-pointer transition-all ${
                        bookingForm.roomId === room.id 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setBookingForm({...bookingForm, roomId: room.id})}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">Room {room.roomNumber}</h5>
                            <p className="text-sm text-gray-600">{room.roomType.name}</p>
                            <p className="text-xs text-gray-500">Floor {room.floor}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm">${room.roomType.price}</p>
                            <p className="text-xs text-gray-500">/night</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Guest Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guestName">Guest Name *</Label>
                <Input
                  id="guestName"
                  value={bookingForm.guestName}
                  onChange={(e) => setBookingForm({...bookingForm, guestName: e.target.value})}
                  placeholder="Enter guest name"
                />
              </div>
              <div>
                <Label htmlFor="guestEmail">Email *</Label>
                <Input
                  id="guestEmail"
                  type="email"
                  value={bookingForm.guestEmail}
                  onChange={(e) => setBookingForm({...bookingForm, guestEmail: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guestPhone">Phone *</Label>
                <Input
                  id="guestPhone"
                  value={bookingForm.guestPhone}
                  onChange={(e) => setBookingForm({...bookingForm, guestPhone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label>Guests</Label>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      min="1"
                      value={bookingForm.adults}
                      onChange={(e) => setBookingForm({...bookingForm, adults: parseInt(e.target.value) || 1})}
                      placeholder="Adults"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="number"
                      min="0"
                      value={bookingForm.children}
                      onChange={(e) => setBookingForm({...bookingForm, children: parseInt(e.target.value) || 0})}
                      placeholder="Children"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Input
                id="specialRequests"
                value={bookingForm.specialRequests}
                onChange={(e) => setBookingForm({...bookingForm, specialRequests: e.target.value})}
                placeholder="Any special requests (optional)"
              />
            </div>

            {/* Booking Summary */}
            {bookingForm.roomId && (
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-semibold mb-2">Booking Summary</h4>
                <div className="text-sm space-y-1">
                  <p>Check-in: {selectedDate && format(selectedDate, 'PPP')}</p>
                  <p>Check-out: {selectedDate && format(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000), 'PPP')}</p>
                  <p>Guests: {bookingForm.adults} adults {bookingForm.children > 0 && `+ ${bookingForm.children} children`}</p>
                  {(() => {
                    const selectedRoom = availableRoomsForDate.find(r => r.id === bookingForm.roomId)
                    return selectedRoom ? (
                      <p className="font-semibold">Total: ${selectedRoom.roomType.price}/night</p>
                    ) : null
                  })()}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowCreateBookingModal(false)}
                disabled={createBookingLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateBooking}
                disabled={createBookingLoading || !bookingForm.roomId || !bookingForm.guestName || !bookingForm.guestEmail || !bookingForm.guestPhone}
              >
                {createBookingLoading ? 'Creating...' : 'Create Booking'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation Dialog for Adding Booking */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md bg-gradient-to-br from-white to-blue-50 border-0 shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white -mx-6 px-6 py-4 rounded-t-lg">
            <DialogTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-white/20 rounded-lg">
                <CalendarDays className="h-5 w-5" />
              </div>
              Add New Booking
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Do you want to add a new booking for:
              </p>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-center gap-3">
                  <CalendarIcon className="h-8 w-8" />
                  <p className="text-xl font-bold">
                    {selectedDate && format(selectedDate, 'EEEE, MMMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-amber-800 mb-1">Quick Reminder</p>
                  <p className="text-xs text-amber-700">
                    You'll be able to select an available room and enter guest details in the next step.
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              Click "Add Booking" to continue, or "Cancel" to close.
            </p>
          </div>
          <DialogFooter className="gap-3 -mx-6 px-6 pb-6">
            <Button 
              variant="outline" 
              onClick={handleCancelAddBooking}
              className="flex-1 h-12 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmAddBooking}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
            >
              Add Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}