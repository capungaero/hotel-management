'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, Plus, Wrench, Clock, User, AlertCircle, CheckCircle, Filter, Search } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface MaintenanceTask {
  id: string
  title: string
  description?: string
  priority: string
  status: string
  scheduledDate: string
  dueDate?: string
  completedAt?: string
  estimatedHours?: number
  actualHours?: number
  notes?: string
  category: {
    id: string
    name: string
    color: string
  }
  staff?: {
    id: string
    name: string
    email: string
  }
  room?: {
    id: string
    roomNumber: string
  }
}

interface Staff {
  id: string
  name: string
  email: string
  position: string
  department: string
}

interface MaintenanceCategory {
  id: string
  name: string
  color: string
}

export default function MaintenancePage() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [categories, setCategories] = useState<MaintenanceCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [assignedFilter, setAssignedFilter] = useState('all')
  
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    priority: 'medium',
    assignedTo: '',
    roomId: '',
    scheduledDate: new Date(),
    dueDate: null as Date | null,
    estimatedHours: '',
    notes: ''
  })

  useEffect(() => {
    fetchTasks()
    fetchStaff()
    fetchCategories()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/maintenance-tasks')
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error('Failed to fetch maintenance tasks:', error)
    }
  }

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/staff')
      const data = await response.json()
      setStaff(data.filter((s: Staff) => s.department === 'maintenance'))
    } catch (error) {
      console.error('Failed to fetch staff:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/maintenance-categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleCreateTask = async () => {
    if (!taskForm.title || !taskForm.categoryId) {
      alert('Please fill in required fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/maintenance-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskForm)
      })

      if (response.ok) {
        setShowTaskDialog(false)
        setTaskForm({
          title: '',
          description: '',
          categoryId: '',
          priority: 'medium',
          assignedTo: '',
          roomId: '',
          scheduledDate: new Date(),
          dueDate: null,
          estimatedHours: '',
          notes: ''
        })
        fetchTasks()
      } else {
        alert('Failed to create task')
      }
    } catch (error) {
      console.error('Failed to create task:', error)
      alert('Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
    try {
      const response = await fetch(`/api/maintenance-tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        fetchTasks()
      } else {
        alert('Failed to update task status')
      }
    } catch (error) {
      console.error('Failed to update task status:', error)
      alert('Failed to update task status')
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600" />
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-red-600" />
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    const matchesAssigned = assignedFilter === 'all' || task.staff?.id === assignedFilter
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssigned
  })

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

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Wrench className="h-8 w-8 text-orange-600" />
            <h2 className="text-3xl font-bold text-gray-900">Manajemen Pemeliharaan</h2>
          </div>
          <Button 
            onClick={() => setShowTaskDialog(true)}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tugas Baru
          </Button>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Tugas Mendesak</p>
                  <p className="text-2xl font-bold text-red-700">
                    {tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Sedang Berjalan</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {tasks.filter(t => t.status === 'in_progress').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Selesai Hari Ini</p>
                  <p className="text-2xl font-bold text-green-700">
                    {tasks.filter(t => 
                      t.status === 'completed' && 
                      t.completedAt && 
                      new Date(t.completedAt).toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Menunggu</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {tasks.filter(t => t.status === 'pending').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <Label>Cari</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari tugas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="min-w-[150px]">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="in_progress">Sedang Berjalan</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="min-w-[150px]">
                <Label>Prioritas</Label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Prioritas</SelectItem>
                    <SelectItem value="urgent">Mendesak</SelectItem>
                    <SelectItem value="high">Tinggi</SelectItem>
                    <SelectItem value="medium">Sedang</SelectItem>
                    <SelectItem value="low">Rendah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="min-w-[150px]">
                <Label>Ditugaskan Kepada</Label>
                <Select value={assignedFilter} onValueChange={setAssignedFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Staff</SelectItem>
                    {staff.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Tugas Pemeliharaan ({filteredTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8">
                  <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Tidak ada tugas pemeliharaan ditemukan</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <Card key={task.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(task.status)}
                            <h3 className="font-semibold text-lg">{task.title}</h3>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: task.category.color }}
                            />
                            <span className="text-sm text-gray-600">{task.category.name}</span>
                          </div>
                          
                          {task.description && (
                            <p className="text-gray-600 mb-3">{task.description}</p>
                          )}
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              Dijadwalkan: {format(new Date(task.scheduledDate), 'dd MMM yyyy')}
                            </div>
                            {task.dueDate && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Batas Waktu: {format(new Date(task.dueDate), 'dd MMM yyyy')}
                              </div>
                            )}
                            {task.staff && (
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {task.staff.name}
                              </div>
                            )}
                            {task.room && (
                              <div className="flex items-center gap-1">
                                <Wrench className="h-4 w-4" />
                                Room {task.room.roomNumber}
                              </div>
                            )}
                            {task.estimatedHours && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Est. {task.estimatedHours}h
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          {task.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateTaskStatus(task.id, 'in_progress')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Start
                            </Button>
                          )}
                          {task.status === 'in_progress' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Complete
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedTask(task)
                              // Handle edit
                            }}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Create New Maintenance Task
            </DialogTitle>
            <DialogDescription>
              Fill in the details to create a new maintenance task
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={taskForm.categoryId} onValueChange={(value) => setTaskForm({...taskForm, categoryId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={taskForm.description}
                onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                placeholder="Describe the maintenance task..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={taskForm.priority} onValueChange={(value) => setTaskForm({...taskForm, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="assignedTo">Assign To</Label>
                <Select value={taskForm.assignedTo} onValueChange={(value) => setTaskForm({...taskForm, assignedTo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {staff.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="estimatedHours">Estimated Hours</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  step="0.5"
                  value={taskForm.estimatedHours}
                  onChange={(e) => setTaskForm({...taskForm, estimatedHours: e.target.value})}
                  placeholder="2.0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Scheduled Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !taskForm.scheduledDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {taskForm.scheduledDate ? format(taskForm.scheduledDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={taskForm.scheduledDate}
                      onSelect={(date) => date && setTaskForm({...taskForm, scheduledDate: date})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !taskForm.dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {taskForm.dueDate ? format(taskForm.dueDate, "PPP") : "Optional due date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={taskForm.dueDate}
                      onSelect={(date) => setTaskForm({...taskForm, dueDate: date})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={taskForm.notes}
                onChange={(e) => setTaskForm({...taskForm, notes: e.target.value})}
                placeholder="Additional notes..."
                rows={2}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTaskDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTask}
              disabled={loading}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}