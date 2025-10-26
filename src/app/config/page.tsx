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
    if (!confirm('Apakah Anda yakin ingin menghapus tipe kamar ini?')) return
    
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
    if (!confirm('Apakah Anda yakin ingin menghapus biaya tambahan ini?')) return
    
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
              <Bed className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">Sikabuview</h1>
            </div>
            <nav className="flex space-x-4">
              <Button variant="ghost" onClick={() => window.location.href = '/'}>Beranda</Button>
              <Button variant="ghost" onClick={() => window.location.href = '/maintenance'}>Pemeliharaan</Button>
              <Button variant="ghost" onClick={() => window.location.href = '/housekeeping'}>Housekeeping</Button>
              <Button variant="ghost" onClick={() => window.location.href = '/config'}>Konfigurasi</Button>
              <Button variant="ghost" onClick={() => window.location.href = '/financial'}>Keuangan</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Konfigurasi Sistem</h2>
          <p className="text-xl mb-8 text-purple-100">Atur pengaturan dan konfigurasi hotel Anda</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center space-x-3 mb-8">
          <Settings className="h-8 w-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-900">Dashboard Konfigurasi</h2>
        </div>
        <Tabs defaultValue="room-types" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="room-types">Tipe Kamar</TabsTrigger>
            <TabsTrigger value="rooms">Kamar</TabsTrigger>
            <TabsTrigger value="charges">Biaya Tambahan</TabsTrigger>
          </TabsList>

          {/* Room Types Tab */}
          <TabsContent value="room-types">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Room Types List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bed className="h-5 w-5" />
                    Tipe Kamar
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
                          <span>Harga: <span className="font-semibold">Rp {type.price.toLocaleString('id-ID')}/malam</span></span>
                          <span>Kapasitas: <span className="font-semibold">{type.capacity} tamu</span></span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Kamar: {type.rooms.length}
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
                    {editingRoomType ? 'Edit Tipe Kamar' : 'Tambah Tipe Kamar'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="roomTypeName">Nama</Label>
                    <Input
                      id="roomTypeName"
                      value={roomTypeForm.name}
                      onChange={(e) => setRoomTypeForm({...roomTypeForm, name: e.target.value})}
                      placeholder="contoh: Kamar Deluxe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="roomTypeDescription">Deskripsi</Label>
                    <Textarea
                      id="roomTypeDescription"
                      value={roomTypeForm.description}
                      onChange={(e) => setRoomTypeForm({...roomTypeForm, description: e.target.value})}
                      placeholder="Deskripsi kamar..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="roomTypePrice">Harga per Malam</Label>
                      <Input
                        id="roomTypePrice"
                        type="number"
                        value={roomTypeForm.price}
                        onChange={(e) => setRoomTypeForm({...roomTypeForm, price: e.target.value})}
                        placeholder="500000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="roomTypeCapacity">Kapasitas</Label>
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
                    <Label htmlFor="roomTypeAmenities">Fasilitas (dipisah koma)</Label>
                    <Input
                      id="roomTypeAmenities"
                      value={roomTypeForm.amenities}
                      onChange={(e) => setRoomTypeForm({...roomTypeForm, amenities: e.target.value})}
                      placeholder="WiFi, TV, Mini Bar, AC"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={saveRoomType} disabled={loading}>
                      {editingRoomType ? 'Perbarui' : 'Tambah'} Tipe Kamar
                    </Button>
                    {editingRoomType && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingRoomType(null)
                          setRoomTypeForm({ name: '', description: '', price: '', capacity: '', amenities: '' })
                        }}
                      >
                        Batal
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
                  <CardTitle>Kamar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {rooms.map((room) => {
                      const roomType = roomTypes.find(rt => rt.id === room.roomTypeId)
                      return (
                        <div key={room.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">Kamar {room.roomNumber}</h3>
                              <p className="text-sm text-gray-600">
                                {roomType?.name} - Lantai {room.floor}
                              </p>
                            </div>
                            <Badge 
                              variant={room.status === 'available' ? 'default' : 
                                      room.status === 'occupied' ? 'destructive' : 'secondary'}
                            >
                              {room.status === 'available' ? 'Tersedia' : 
                                      room.status === 'occupied' ? 'Terisi' : room.status}
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
                  <CardTitle>Tambah Kamar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="roomNumber">Nomor Kamar</Label>
                    <Input
                      id="roomNumber"
                      value={roomForm.roomNumber}
                      onChange={(e) => setRoomForm({...roomForm, roomNumber: e.target.value})}
                      placeholder="contoh: 101"
                    />
                  </div>
                  <div>
                    <Label htmlFor="roomTypeSelect">Tipe Kamar</Label>
                    <Select value={roomForm.roomTypeId} onValueChange={(value) => setRoomForm({...roomForm, roomTypeId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe kamar" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name} - Rp {type.price.toLocaleString('id-ID')}/malam
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="roomFloor">Lantai</Label>
                    <Input
                      id="roomFloor"
                      type="number"
                      value={roomForm.floor}
                      onChange={(e) => setRoomForm({...roomForm, floor: e.target.value})}
                      placeholder="contoh: 1"
                    />
                  </div>
                  <Button onClick={saveRoom} disabled={loading}>
                    Tambah Kamar
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
                    Biaya Tambahan
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
                          <span>Harga: <span className="font-semibold">Rp {charge.price.toLocaleString('id-ID')}</span></span>
                          <span>Tipe: <span className="font-semibold">{charge.chargeType.replace('_', ' ')}</span></span>
                        </div>
                        <div className="mt-1">
                          <Badge variant={charge.isActive ? 'default' : 'secondary'}>
                            {charge.isActive ? 'Aktif' : 'Tidak Aktif'}
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
                    {editingCharge ? 'Edit Biaya' : 'Tambah Biaya Tambahan'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="chargeName">Nama</Label>
                    <Input
                      id="chargeName"
                      value={chargeForm.name}
                      onChange={(e) => setChargeForm({...chargeForm, name: e.target.value})}
                      placeholder="contoh: Sarapan"
                    />
                  </div>
                  <div>
                    <Label htmlFor="chargeDescription">Deskripsi</Label>
                    <Textarea
                      id="chargeDescription"
                      value={chargeForm.description}
                      onChange={(e) => setChargeForm({...chargeForm, description: e.target.value})}
                      placeholder="Deskripsi biaya..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="chargePrice">Harga</Label>
                      <Input
                        id="chargePrice"
                        type="number"
                        value={chargeForm.price}
                        onChange={(e) => setChargeForm({...chargeForm, price: e.target.value})}
                        placeholder="15"
                      />
                    </div>
                    <div>
                      <Label htmlFor="chargeType">Tipe Biaya</Label>
                      <Select value={chargeForm.chargeType} onValueChange={(value) => setChargeForm({...chargeForm, chargeType: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="per_night">Per Malam</SelectItem>
                          <SelectItem value="per_stay">Per Menginap</SelectItem>
                          <SelectItem value="per_person">Per Orang</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={saveAdditionalCharge} disabled={loading}>
                      {editingCharge ? 'Perbarui' : 'Tambah'} Biaya
                    </Button>
                    {editingCharge && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingCharge(null)
                          setChargeForm({ name: '', description: '', price: '', chargeType: 'per_stay' })
                        }}
                      >
                        Batal
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