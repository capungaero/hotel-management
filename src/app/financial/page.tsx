'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar as CalendarIcon,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  CreditCard,
  Bed
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface FinancialRecord {
  id: string
  type: 'income' | 'expense'
  category: string
  description: string
  amount: number
  date: string
  referenceId?: string
  createdAt: string
}

interface Booking {
  id: string
  guestName: string
  totalPrice: number
  status: string
  createdAt: string
  room: {
    roomNumber: string
    roomType: {
      name: string
    }
  }
}

export default function FinancialPage() {
  const [records, setRecords] = useState<FinancialRecord[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  })

  // Form states
  const [recordForm, setRecordForm] = useState({
    type: 'expense',
    category: '',
    description: '',
    amount: '',
    date: new Date()
  })

  const [showAddDialog, setShowAddDialog] = useState(false)

  useEffect(() => {
    fetchFinancialRecords()
    fetchBookings()
  }, [])

  const fetchFinancialRecords = async () => {
    try {
      const response = await fetch('/api/financial')
      const data = await response.json()
      setRecords(data)
    } catch (error) {
      console.error('Failed to fetch financial records:', error)
    }
  }

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings')
      const data = await response.json()
      setBookings(data)
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    }
  }

  const saveFinancialRecord = async () => {
    setLoading(true)
    try {
      const payload = {
        type: recordForm.type,
        category: recordForm.category,
        description: recordForm.description,
        amount: parseFloat(recordForm.amount),
        date: recordForm.date
      }

      const response = await fetch('/api/financial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setRecordForm({
          type: 'expense',
          category: '',
          description: '',
          amount: '',
          date: new Date()
        })
        setShowAddDialog(false)
        fetchFinancialRecords()
      }
    } catch (error) {
      console.error('Failed to save financial record:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotals = () => {
    const filteredRecords = records.filter(record => {
      const recordDate = new Date(record.date)
      return recordDate >= dateRange.from && recordDate <= dateRange.to
    })

    const income = filteredRecords
      .filter(r => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0)

    const expense = filteredRecords
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0)

    const profit = income - expense

    return { income, expense, profit }
  }

  const getCategoryTotals = () => {
    const filteredRecords = records.filter(record => {
      const recordDate = new Date(record.date)
      return recordDate >= dateRange.from && recordDate <= dateRange.to
    })

    const categoryMap = new Map<string, { income: number; expense: number }>()

    filteredRecords.forEach(record => {
      const current = categoryMap.get(record.category) || { income: 0, expense: 0 }
      if (record.type === 'income') {
        current.income += record.amount
      } else {
        current.expense += record.amount
      }
      categoryMap.set(record.category, current)
    })

    return Array.from(categoryMap.entries()).map(([category, totals]) => ({
      category,
      ...totals,
      net: totals.income - totals.expense
    }))
  }

  const { income, expense, profit } = calculateTotals()
  const categoryTotals = getCategoryTotals()

  const incomeCategories = [
    'room_booking',
    'additional_service',
    'other_income'
  ]

  const expenseCategories = [
    'salary',
    'maintenance',
    'utilities',
    'supplies',
    'marketing',
    'other_expense'
  ]

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
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Manajemen Keuangan</h2>
          <p className="text-xl mb-8 text-green-100">Pantau dan kelola keuangan hotel Anda</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center space-x-3 mb-8">
          <DollarSign className="h-8 w-8 text-green-600" />
          <h2 className="text-3xl font-bold text-gray-900">Dashboard Keuangan</h2>
        </div>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Rp {income.toLocaleString('id-ID')}</div>
              <p className="text-xs text-muted-foreground">
                {format(dateRange.from, 'dd MMM')} - {format(dateRange.to, 'dd MMM yyyy')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">Rp {expense.toLocaleString('id-ID')}</div>
              <p className="text-xs text-muted-foreground">
                {format(dateRange.from, 'dd MMM')} - {format(dateRange.to, 'dd MMM yyyy')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Laba Bersih</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                Rp {profit.toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-muted-foreground">
                {format(dateRange.from, 'dd MMM')} - {format(dateRange.to, 'dd MMM yyyy')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Date Range Selector */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pilih Rentang Tanggal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <Label>Dari Tanggal</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(dateRange.from, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => date && setDateRange({ ...dateRange, from: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Sampai Tanggal</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(dateRange.to, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => date && setDateRange({ ...dateRange, to: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Catatan
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Catatan Keuangan</DialogTitle>
                    <DialogDescription>
                      Tambah catatan pemasukan atau pengeluaran baru untuk melacak data keuangan Anda
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Tipe</Label>
                      <Select value={recordForm.type} onValueChange={(value: 'income' | 'expense') => setRecordForm({...recordForm, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Pemasukan</SelectItem>
                          <SelectItem value="expense">Pengeluaran</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Kategori</Label>
                      <Select value={recordForm.category} onValueChange={(value) => setRecordForm({...recordForm, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {(recordForm.type === 'income' ? incomeCategories : expenseCategories).map(category => (
                            <SelectItem key={category} value={category}>
                              {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Deskripsi</Label>
                      <Input
                        value={recordForm.description}
                        onChange={(e) => setRecordForm({...recordForm, description: e.target.value})}
                        placeholder="Masukkan deskripsi"
                      />
                    </div>
                    <div>
                      <Label>Jumlah</Label>
                      <Input
                        type="number"
                        value={recordForm.amount}
                        onChange={(e) => setRecordForm({...recordForm, amount: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label>Tanggal</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !recordForm.date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(recordForm.date, "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={recordForm.date}
                            onSelect={(date) => date && setRecordForm({...recordForm, date})}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={saveFinancialRecord} disabled={loading}>
                        Simpan Catatan
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                        Batal
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="records" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="records">Catatan Keuangan</TabsTrigger>
            <TabsTrigger value="bookings">Pendapatan Booking</TabsTrigger>
            <TabsTrigger value="categories">Ringkasan Kategori</TabsTrigger>
          </TabsList>

          {/* Financial Records Tab */}
          <TabsContent value="records">
            <Card>
              <CardHeader>
                <CardTitle>Catatan Keuangan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {records
                    .filter(record => {
                      const recordDate = new Date(record.date)
                      return recordDate >= dateRange.from && recordDate <= dateRange.to
                    })
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((record) => (
                    <div key={record.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={record.type === 'income' ? 'default' : 'destructive'}>
                              {record.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                            </Badge>
                            <span className="font-medium">{record.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                          </div>
                          <p className="text-sm text-gray-600">{record.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(new Date(record.date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div className={`text-lg font-semibold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {record.type === 'income' ? '+' : '-'}Rp {record.amount.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Revenue Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Pendapatan Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {bookings
                    .filter(booking => {
                      const bookingDate = new Date(booking.createdAt)
                      return bookingDate >= dateRange.from && bookingDate <= dateRange.to
                    })
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">
                              <Receipt className="h-3 w-3 mr-1" />
                              Booking
                            </Badge>
                            <span className="font-medium">{booking.guestName}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Kamar {booking.room.roomNumber} - {booking.room.roomType.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div className="text-lg font-semibold text-green-600">
                          Rp {booking.totalPrice.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Category Summary Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryTotals.map((item) => (
                    <div key={item.category} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">
                          {item.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h3>
                        <div className={`font-semibold ${item.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.net >= 0 ? <ArrowUpRight className="inline h-4 w-4 mr-1" /> : <ArrowDownRight className="inline h-4 w-4 mr-1" />}
                          Rp {Math.abs(item.net).toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Pemasukan: </span>
                          <span className="font-medium text-green-600">Rp {item.income.toLocaleString('id-ID')}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Pengeluaran: </span>
                          <span className="font-medium text-red-600">Rp {item.expense.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}