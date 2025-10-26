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
import { Checkbox } from '@/components/ui/checkbox'
import { CalendarIcon, Plus, Home, Clock, User, CheckCircle, Filter, Search, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface HousekeepingTask {
  id: string
  name: string
  description?: string
  category: string
  estimatedTime: number
}

interface HousekeepingAssignment {
  id: string
  scheduledDate: string
  status: string
  priority: string
  completedAt?: string
  notes?: string
  task: HousekeepingTask
  staff: {
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

export default function HousekeepingPage() {
  const [assignments, setAssignments] = useState<HousekeepingAssignment[]>([])
  const [tasks, setTasks] = useState<HousekeepingTask[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(false)
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [assignedFilter, setAssignedFilter] = useState('all')
  
  const [assignmentForm, setAssignmentForm] = useState({
    taskId: '',
    assignedTo: '',
    roomId: '',
    scheduledDate: new Date(),
    priority: 'medium',
    notes: ''
  })

  useEffect(() => {
    fetchAssignments()
    fetchTasks()
    fetchStaff()
  }, [selectedDate])

  const fetchAssignments = async () => {
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      const response = await fetch(`/api/housekeeping-assignments?date=${dateStr}`)
      const data = await response.json()
      setAssignments(data)
    } catch (error) {
      console.error('Failed to fetch housekeeping assignments:', error)
    }
  }

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/housekeeping-tasks')
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error('Failed to fetch housekeeping tasks:', error)
    }
  }

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/staff')
      const data = await response.json()
      setStaff(data.filter((s: Staff) => s.department === 'housekeeping'))
    } catch (error) {
      console.error('Failed to fetch staff:', error)
    }
  }

  const handleCreateAssignment = async () => {
    if (!assignmentForm.taskId || !assignmentForm.assignedTo) {
      alert('Please select a task and assign to staff')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/housekeeping-assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignmentForm)
      })

      if (response.ok) {
        setShowAssignmentDialog(false)
        setAssignmentForm({
          taskId: '',
          assignedTo: '',
          roomId: '',
          scheduledDate: new Date(),
          priority: 'medium',
          notes: ''
        })
        fetchAssignments()
      } else {
        alert('Failed to create assignment')
      }
    } catch (error) {
      console.error('Failed to create assignment:', error)
      alert('Failed to create assignment')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateAssignmentStatus = async (assignmentId: string, status: string) => {
    try {
      const response = await fetch(`/api/housekeeping-assignments/${assignmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        fetchAssignments()
      } else {
        alert('Failed to update assignment status')
      }
    } catch (error) {
      console.error('Failed to update assignment status:', error)
      alert('Failed to update assignment status')
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'skipped': return <Clock className="h-4 w-4 text-gray-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getTaskCategoryColor = (category: string) => {
    switch (category) {
      case 'bathroom': return 'bg-blue-100 text-blue-800'
      case 'bedroom': return 'bg-purple-100 text-purple-800'
      case 'public_area': return 'bg-green-100 text-green-800'
      case 'kitchen': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.staff.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter
    const matchesAssigned = assignedFilter === 'all' || assignment.staff.id === assignedFilter
    
    return matchesSearch && matchesStatus && matchesAssigned
  })

  const taskStats = {
    total: assignments.length,
    completed: assignments.filter(a => a.status === 'completed').length,
    inProgress: assignments.filter(a => a.status === 'in_progress').length,
    pending: assignments.filter(a => a.status === 'pending').length
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

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-8 w-8 text-teal-600" />
            <h2 className="text-3xl font-bold text-gray-900">Manajemen Housekeeping</h2>
          </div>
          <Button 
            onClick={() => setShowAssignmentDialog(true)}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tugas Baru
          </Button>
        </div>
        {/* Date Selector and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Date Picker */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Pilih Tanggal</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
          
          {/* Stats Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Selesai</p>
                    <p className="text-2xl font-bold text-green-700">{taskStats.completed}</p>
                    <p className="text-xs text-green-600">
                      {taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}% selesai
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Sedang Berjalan</p>
                    <p className="text-2xl font-bold text-blue-700">{taskStats.inProgress}</p>
                    <p className="text-xs text-blue-600">Sedang dikerjakan</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Menunggu</p>
                    <p className="text-2xl font-bold text-yellow-700">{taskStats.pending}</p>
                    <p className="text-xs text-yellow-600">Menunggu dimulai</p>
                  </div>
                  <Home className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>
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
                    <SelectItem value="skipped">Dilewati</SelectItem>
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

        {/* Assignments List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Tugas Housekeeping untuk {format(selectedDate, 'dd MMM yyyy')} ({filteredAssignments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAssignments.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Tidak ada tugas housekeeping ditemukan untuk tanggal ini</p>
                </div>
              ) : (
                filteredAssignments.map((assignment) => (
                  <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(assignment.status)}
                            <h3 className="font-semibold text-lg">{assignment.task.name}</h3>
                            <Badge className={getPriorityColor(assignment.priority)}>
                              {assignment.priority}
                            </Badge>
                            <Badge className={getTaskCategoryColor(assignment.task.category)}>
                              {assignment.task.category}
                            </Badge>
                          </div>
                          
                          {assignment.task.description && (
                            <p className="text-gray-600 mb-3">{assignment.task.description}</p>
                          )}
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {assignment.staff.name}
                            </div>
                            {assignment.room && (
                              <div className="flex items-center gap-1">
                                <Home className="h-4 w-4" />
                                Kamar {assignment.room.roomNumber}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Est. {assignment.task.estimatedTime} menit
                            </div>
                            {assignment.completedAt && (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" />
                                Selesai pukul {format(new Date(assignment.completedAt), 'HH:mm')}
                              </div>
                            )}
                          </div>
                          
                          {assignment.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded">
                              <p className="text-sm text-gray-600">
                                <strong>Notes:</strong> {assignment.notes}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          {assignment.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateAssignmentStatus(assignment.id, 'in_progress')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Start
                            </Button>
                          )}
                          {assignment.status === 'in_progress' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateAssignmentStatus(assignment.id, 'completed')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Complete
                            </Button>
                          )}
                          {assignment.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateAssignmentStatus(assignment.id, 'skipped')}
                            >
                              Skip
                            </Button>
                          )}
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

      {/* New Assignment Dialog */}
      <Dialog open={showAssignmentDialog} onOpenChange={setShowAssignmentDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Create New Housekeeping Assignment
            </DialogTitle>
            <DialogDescription>
              Assign housekeeping tasks to staff members for specific rooms and dates
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task">Task *</Label>
                <Select value={assignmentForm.taskId} onValueChange={(value) => setAssignmentForm({...assignmentForm, taskId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select task" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        <div>
                          <div className="font-medium">{task.name}</div>
                          <div className="text-sm text-gray-500">{task.category} • {task.estimatedTime} min</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="assignedTo">Assign To *</Label>
                <Select value={assignmentForm.assignedTo} onValueChange={(value) => setAssignmentForm({...assignmentForm, assignedTo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff" />
                  </SelectTrigger>
                  <SelectContent>
                    {staff.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={assignmentForm.priority} onValueChange={(value) => setAssignmentForm({...assignmentForm, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Scheduled Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !assignmentForm.scheduledDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {assignmentForm.scheduledDate ? format(assignmentForm.scheduledDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={assignmentForm.scheduledDate}
                      onSelect={(date) => date && setAssignmentForm({...assignmentForm, scheduledDate: date})}
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
                value={assignmentForm.notes}
                onChange={(e) => setAssignmentForm({...assignmentForm, notes: e.target.value})}
                placeholder="Additional notes for this assignment..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignmentDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateAssignment}
              disabled={loading}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
            >
              {loading ? 'Creating...' : 'Create Assignment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}