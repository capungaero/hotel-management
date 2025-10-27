'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, ArrowLeft, Users, DollarSign, Bed } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface Room {
  id: string
  roomNumber: string
  roomType: {
    id: string
    name: string
    price: number
    capacity: number
    amenities: string
  }
  floor: number
}

interface AdditionalCharge {
  id: string
  name: string
  price: number
  chargeType: string
  description: string
}

function BookingPageContent() {
  const searchParams = useSearchParams()
  const roomId = searchParams.get('roomId')
  const checkIn = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')
  const adults = searchParams.get('adults')
  const children = searchParams.get('children')

  const [room, setRoom] = useState<Room | null>(null)
  const [additionalCharges, setAdditionalCharges] = useState<AdditionalCharge[]>([])
  const [selectedCharges, setSelectedCharges] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [bookingData, setBookingData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    specialRequests: ''
  })

  useEffect(() => {
    if (roomId) {
      fetchRoomDetails()
      fetchAdditionalCharges()
    }
  }, [roomId])

  const fetchRoomDetails = async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}`)
      const data = await response.json()
      setRoom(data)
    } catch (error) {
      console.error('Failed to fetch room details:', error)
    }
  }

  const fetchAdditionalCharges = async () => {
    try {
      const response = await fetch('/api/additional-charges')
      const data = await response.json()
      setAdditionalCharges(data.filter((charge: AdditionalCharge) => charge.isActive))
    } catch (error) {
      console.error('Failed to fetch additional charges:', error)
    }
  }

  const calculateTotalPrice = () => {
    if (!room || !checkIn || !checkOut) return 0

    const nights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    )
    
    let total = room.roomType.price * nights

    // Add additional charges
    selectedCharges.forEach(chargeId => {
      const charge = additionalCharges.find(c => c.id === chargeId)
      if (charge) {
        switch (charge.chargeType) {
          case 'per_night':
            total += charge.price * nights
            break
          case 'per_stay':
            total += charge.price
            break
          case 'per_person':
            total += charge.price * (parseInt(adults || '2') + parseInt(children || '0'))
            break
        }
      }
    })

    return total
  }

  const handleBooking = async () => {
    if (!room || !checkIn || !checkOut) return

    setLoading(true)
    try {
      const bookingPayload = {
        roomId: room.id,
        guestName: bookingData.guestName,
        guestEmail: bookingData.guestEmail,
        guestPhone: bookingData.guestPhone,
        checkInDate: new Date(checkIn),
        checkOutDate: new Date(checkOut),
        adults: parseInt(adults || '2'),
        children: parseInt(children || '0'),
        totalPrice: calculateTotalPrice(),
        specialRequests: bookingData.specialRequests,
        additionalCharges: selectedCharges
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      })

      if (response.ok) {
        const booking = await response.json()
        alert('Booking successful! Booking ID: ' + booking.id)
        window.location.href = '/'
      } else {
        const error = await response.json()
        alert('Booking failed: ' + error.error)
      }
    } catch (error) {
      console.error('Failed to create booking:', error)
      alert('Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading room details...</p>
        </div>
      </div>
    )
  }

  const nights = checkIn && checkOut ? Math.ceil(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
  ) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Complete Your Booking</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Guest Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guestName">Full Name *</Label>
                    <Input
                      id="guestName"
                      value={bookingData.guestName}
                      onChange={(e) => setBookingData({...bookingData, guestName: e.target.value})}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestEmail">Email *</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      value={bookingData.guestEmail}
                      onChange={(e) => setBookingData({...bookingData, guestEmail: e.target.value})}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="guestPhone">Phone Number *</Label>
                  <Input
                    id="guestPhone"
                    type="tel"
                    value={bookingData.guestPhone}
                    onChange={(e) => setBookingData({...bookingData, guestPhone: e.target.value})}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                    placeholder="Any special requests or preferences..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Services */}
            {additionalCharges.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Additional Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {additionalCharges.map((charge) => (
                      <div key={charge.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={charge.id}
                            checked={selectedCharges.includes(charge.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCharges([...selectedCharges, charge.id])
                              } else {
                                setSelectedCharges(selectedCharges.filter(id => id !== charge.id))
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <div>
                            <label htmlFor={charge.id} className="font-medium cursor-pointer">
                              {charge.name}
                            </label>
                            {charge.description && (
                              <p className="text-sm text-gray-600">{charge.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${charge.price}</p>
                          <p className="text-xs text-gray-500">
                            {charge.chargeType === 'per_night' && 'per night'}
                            {charge.chargeType === 'per_stay' && 'per stay'}
                            {charge.chargeType === 'per_person' && 'per person'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Room Details */}
                <div className="border-b pb-4">
                  <h3 className="font-semibold flex items-center gap-2 mb-2">
                    <Bed className="h-4 w-4" />
                    Room {room.roomNumber}
                  </h3>
                  <p className="text-sm text-gray-600">{room.roomType.name}</p>
                  <p className="text-xs text-gray-500">Floor {room.floor}</p>
                </div>

                {/* Booking Details */}
                <div className="border-b pb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Check-in:</span>
                    <span>{checkIn ? format(new Date(checkIn), 'MMM dd, yyyy') : ''}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Check-out:</span>
                    <span>{checkOut ? format(new Date(checkOut), 'MMM dd, yyyy') : ''}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Nights:</span>
                    <span>{nights}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Guests:
                    </span>
                    <span>{adults} adults, {children} children</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Room ({nights} nights × ${room.roomType.price}):</span>
                    <span>${room.roomType.price * nights}</span>
                  </div>
                  
                  {selectedCharges.map(chargeId => {
                    const charge = additionalCharges.find(c => c.id === chargeId)
                    if (!charge) return null
                    
                    let chargeTotal = charge.price
                    switch (charge.chargeType) {
                      case 'per_night':
                        chargeTotal *= nights
                        break
                      case 'per_person':
                        chargeTotal *= (parseInt(adults || '2') + parseInt(children || '0'))
                        break
                    }
                    
                    return (
                      <div key={chargeId} className="flex justify-between text-sm">
                        <span>{charge.name}:</span>
                        <span>${chargeTotal}</span>
                      </div>
                    )
                  })}
                  
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {calculateTotalPrice()}
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={handleBooking}
                  disabled={loading || !bookingData.guestName || !bookingData.guestEmail || !bookingData.guestPhone}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Processing...' : 'Complete Booking'}
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  By completing this booking, you agree to our terms and conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading booking page...</p>
        </div>
      </div>
    }>
      <BookingPageContent />
    </Suspense>
  )
}