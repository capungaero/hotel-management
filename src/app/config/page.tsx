'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Settings, Plus, Edit, Trash2, Bed, DollarSign, Coffee } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

interface RoomType {
  id: string
  name: string
  description: string
  price: number
  capacity: number
  amenities: string
  rooms: { id: string; roomNumber: string; status: string }[]
}

interface AdditionalCharge {
  id: string
  name: string
  description: string
  price: number
  chargeType: string
  isActive: boolean
}

interface Room {
  id: string
  roomNumber: string
  roomTypeId: string
  floor: number
  status: string
}

export default function ConfigPage() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [additionalCharges, setAdditionalCharges] = useState<AdditionalCharge[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(false)

  // Form states
  const [roomTypeForm, setRoomTypeForm] = useState({
    name: '',
    description: '',
    price: '',
    capacity: '',
    amenities: ''
  })
  const [chargeForm, setChargeForm] = useState({
    name: '',
    description: '',
    price: '',
    chargeType: 'per_stay'
  })
  const [roomForm, setRoomForm] = useState({
    roomNumber: '',
    roomTypeId: '',
    floor: ''
  })

  const [editingRoomType, setEditingRoomType] = useState<string | null>(null)
  const [editingCharge, setEditingCharge] = useState<string | null>(null)

  useEffect(() => {
    fetchRoomTypes()
    fetchAdditionalCharges()
    fetchRooms()
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

  const fetchAdditionalCharges = async () => {
    try {
      const response = await fetch('/api/additional-charges')
      const data = await response.json()
      setAdditionalCharges(data)
    } catch (error) {
      console.error('Failed to fetch additional charges:', error)
    }
  }

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms')
      const data = await response.json()
      setRooms(data)
    } catch (error) {
      console.error('Failed to fetch rooms:', error)
    }
  }

  const saveRoomType = async () => {
    setLoading(true)
    try {
      const amenities = roomTypeForm.amenities.split(',').map(a => a.trim()).filter(a => a)
      const payload = {
        name: roomTypeForm.name,
        description: roomTypeForm.description,
        price: parseFloat(roomTypeForm.price),
        capacity: parseInt(roomTypeForm.capacity),
        amenities
      }

      const url = editingRoomType ? `/api/room-types/${editingRoomType}` : '/api/room-types'
      const method = editingRoomType ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setRoomTypeForm({ name: '', description: '', price: '', capacity: '', amenities: '' })
        setEditingRoomType(null)
        fetchRoomTypes()
      }
    } catch (error) {
      console.error('Failed to save room type:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveAdditionalCharge = async () => {
    setLoading(true)
    try {
      const payload = {
        name: chargeForm.name,
        description: chargeForm.description,
        price: parseFloat(chargeForm.price),
        chargeType: chargeForm.chargeType
      }

      const url = editingCharge ? `/api/additional-charges/${editingCharge}` : '/api/additional-charges'
      const method = editingCharge ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setChargeForm({ name: '', description: '', price: '', chargeType: 'per_stay' })
        setEditingCharge(null)
        fetchAdditionalCharges()
      }
    } catch (error) {
      console.error('Failed to save additional charge:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveRoom = async () => {
    setLoading(true)
    try {
      const payload = {
        roomNumber: roomForm.roomNumber,
        roomTypeId: roomForm.roomTypeId,
        floor: parseInt(roomForm.floor)
      }

      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setRoomForm({ roomNumber: '', roomTypeId: '', floor: '' })
        fetchRooms()
      }
    } catch (error) {
      console.error('Failed to save room:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteRoomType = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room type?')) return
    
    try {
      const response = await fetch(`/api/room-types/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchRoomTypes()
      }
    } catch (error) {
      console.error('Failed to delete room type:', error)
    }
  }

  const deleteAdditionalCharge = async (id: string) => {
    if (!confirm('Are you sure you want to delete this additional charge?')) return
    
    try {
      const response = await fetch(`/api/additional-charges/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchAdditionalCharges()
      }
    } catch (error) {
      console.error('Failed to delete additional charge:', error)
    }
  }

  const toggleChargeStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/additional-charges/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      })
      if (response.ok) {
        fetchAdditionalCharges()
      }
    } catch (error) {
      console.error('Failed to update charge status:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">Configuration</h1>
            </div>
            <Button variant="ghost" onClick={() => window.location.href = '/'}>
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="room-types" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="room-types">Room Types</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="charges">Additional Charges</TabsTrigger>
          </TabsList>

          {/* Room Types Tab */}
          <TabsContent value="room-types">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Room Types List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bed className="h-5 w-5" />
                    Room Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {roomTypes.map((type) => (
                      <div key={type.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{type.name}</h3>
                            <p className="text-sm text-gray-600">{type.description}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingRoomType(type.id)
                                setRoomTypeForm({
                                  name: type.name,
                                  description: type.description || '',
                                  price: type.price.toString(),
                                  capacity: type.capacity.toString(),
                                  amenities: type.amenities ? JSON.parse(type.amenities).join(', ') : ''
                                })
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteRoomType(type.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Price: <span className="font-semibold">${type.price}/night</span></span>
                          <span>Capacity: <span className="font-semibold">{type.capacity} guests</span></span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Rooms: {type.rooms.length}
                        </div>
                        {type.amenities && (
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {JSON.parse(type.amenities).map((amenity: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Add/Edit Room Type Form */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingRoomType ? 'Edit Room Type' : 'Add Room Type'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="roomTypeName">Name</Label>
                    <Input
                      id="roomTypeName"
                      value={roomTypeForm.name}
                      onChange={(e) => setRoomTypeForm({...roomTypeForm, name: e.target.value})}
                      placeholder="e.g., Deluxe Room"
                    />
                  </div>
                  <div>
                    <Label htmlFor="roomTypeDescription">Description</Label>
                    <Textarea
                      id="roomTypeDescription"
                      value={roomTypeForm.description}
                      onChange={(e) => setRoomTypeForm({...roomTypeForm, description: e.target.value})}
                      placeholder="Room description..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="roomTypePrice">Price per Night</Label>
                      <Input
                        id="roomTypePrice"
                        type="number"
                        value={roomTypeForm.price}
                        onChange={(e) => setRoomTypeForm({...roomTypeForm, price: e.target.value})}
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="roomTypeCapacity">Capacity</Label>
                      <Input
                        id="roomTypeCapacity"
                        type="number"
                        value={roomTypeForm.capacity}
                        onChange={(e) => setRoomTypeForm({...roomTypeForm, capacity: e.target.value})}
                        placeholder="2"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="roomTypeAmenities">Amenities (comma-separated)</Label>
                    <Input
                      id="roomTypeAmenities"
                      value={roomTypeForm.amenities}
                      onChange={(e) => setRoomTypeForm({...roomTypeForm, amenities: e.target.value})}
                      placeholder="WiFi, TV, Mini Bar, Air Conditioning"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={saveRoomType} disabled={loading}>
                      {editingRoomType ? 'Update' : 'Add'} Room Type
                    </Button>
                    {editingRoomType && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingRoomType(null)
                          setRoomTypeForm({ name: '', description: '', price: '', capacity: '', amenities: '' })
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Rooms Tab */}
          <TabsContent value="rooms">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rooms List */}
              <Card>
                <CardHeader>
                  <CardTitle>Rooms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {rooms.map((room) => {
                      const roomType = roomTypes.find(rt => rt.id === room.roomTypeId)
                      return (
                        <div key={room.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">Room {room.roomNumber}</h3>
                              <p className="text-sm text-gray-600">
                                {roomType?.name} - Floor {room.floor}
                              </p>
                            </div>
                            <Badge 
                              variant={room.status === 'available' ? 'default' : 
                                      room.status === 'occupied' ? 'destructive' : 'secondary'}
                            >
                              {room.status}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Add Room Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Add Room</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="roomNumber">Room Number</Label>
                    <Input
                      id="roomNumber"
                      value={roomForm.roomNumber}
                      onChange={(e) => setRoomForm({...roomForm, roomNumber: e.target.value})}
                      placeholder="e.g., 101"
                    />
                  </div>
                  <div>
                    <Label htmlFor="roomTypeSelect">Room Type</Label>
                    <Select value={roomForm.roomTypeId} onValueChange={(value) => setRoomForm({...roomForm, roomTypeId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name} - ${type.price}/night
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="roomFloor">Floor</Label>
                    <Input
                      id="roomFloor"
                      type="number"
                      value={roomForm.floor}
                      onChange={(e) => setRoomForm({...roomForm, floor: e.target.value})}
                      placeholder="e.g., 1"
                    />
                  </div>
                  <Button onClick={saveRoom} disabled={loading}>
                    Add Room
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Additional Charges Tab */}
          <TabsContent value="charges">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Charges List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Additional Charges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {additionalCharges.map((charge) => (
                      <div key={charge.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{charge.name}</h3>
                            <p className="text-sm text-gray-600">{charge.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={charge.isActive}
                              onCheckedChange={(checked) => toggleChargeStatus(charge.id, checked)}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingCharge(charge.id)
                                setChargeForm({
                                  name: charge.name,
                                  description: charge.description || '',
                                  price: charge.price.toString(),
                                  chargeType: charge.chargeType
                                })
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteAdditionalCharge(charge.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Price: <span className="font-semibold">${charge.price}</span></span>
                          <span>Type: <span className="font-semibold">{charge.chargeType.replace('_', ' ')}</span></span>
                        </div>
                        <div className="mt-1">
                          <Badge variant={charge.isActive ? 'default' : 'secondary'}>
                            {charge.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Add/Edit Charge Form */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingCharge ? 'Edit Charge' : 'Add Additional Charge'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="chargeName">Name</Label>
                    <Input
                      id="chargeName"
                      value={chargeForm.name}
                      onChange={(e) => setChargeForm({...chargeForm, name: e.target.value})}
                      placeholder="e.g., Breakfast"
                    />
                  </div>
                  <div>
                    <Label htmlFor="chargeDescription">Description</Label>
                    <Textarea
                      id="chargeDescription"
                      value={chargeForm.description}
                      onChange={(e) => setChargeForm({...chargeForm, description: e.target.value})}
                      placeholder="Charge description..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="chargePrice">Price</Label>
                      <Input
                        id="chargePrice"
                        type="number"
                        value={chargeForm.price}
                        onChange={(e) => setChargeForm({...chargeForm, price: e.target.value})}
                        placeholder="15"
                      />
                    </div>
                    <div>
                      <Label htmlFor="chargeType">Charge Type</Label>
                      <Select value={chargeForm.chargeType} onValueChange={(value) => setChargeForm({...chargeForm, chargeType: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="per_night">Per Night</SelectItem>
                          <SelectItem value="per_stay">Per Stay</SelectItem>
                          <SelectItem value="per_person">Per Person</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={saveAdditionalCharge} disabled={loading}>
                      {editingCharge ? 'Update' : 'Add'} Charge
                    </Button>
                    {editingCharge && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingCharge(null)
                          setChargeForm({ name: '', description: '', price: '', chargeType: 'per_stay' })
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}