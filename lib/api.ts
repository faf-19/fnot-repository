// API utility functions for client-side data fetching

export interface Student {
  _id?: string
  fullName: string
  spiritualName: string
  sex: string
  age: number
  class: string
  familyName: string
  phone: string
  address: string
  photo?: string
  group: string
  registrationDate: string
}

export interface AttendanceRecord {
  _id?: string
  studentId: string
  date: string
  sessions: {
    monday: boolean
    wednesday: boolean
    friday: boolean
  }
}

export interface AttendanceStats {
  student: Student
  totalDays: number
  attendedSessions: number
  totalSessions: number
  attendancePercentage: number
  sessionStats: {
    monday: { attended: number; total: number; percentage: number }
    wednesday: { attended: number; total: number; percentage: number }
    friday: { attended: number; total: number; percentage: number }
  }
}

// Students API
export const studentsApi = {
  // Get all students
  getAll: async (params?: { group?: string; search?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.group) searchParams.append("group", params.group)
    if (params?.search) searchParams.append("search", params.search)

    const response = await fetch(`/api/students?${searchParams}`)
    return response.json()
  },

  // Get single student
  getById: async (id: string) => {
    const response = await fetch(`/api/students/${id}`)
    return response.json()
  },

  // Create new student
  create: async (student: Omit<Student, "_id" | "group" | "registrationDate">) => {
    const response = await fetch("/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    })
    return response.json()
  },

  // Update student
  update: async (id: string, student: Partial<Student>) => {
    const response = await fetch(`/api/students/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    })
    return response.json()
  },

  // Delete student
  delete: async (id: string) => {
    const response = await fetch(`/api/students/${id}`, {
      method: "DELETE",
    })
    return response.json()
  },
}

// Attendance API
export const attendanceApi = {
  // Get attendance records
  get: async (params?: { date?: string; studentId?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.date) searchParams.append("date", params.date)
    if (params?.studentId) searchParams.append("studentId", params.studentId)

    const response = await fetch(`/api/attendance?${searchParams}`)
    return response.json()
  },

  // Save single attendance record
  save: async (attendance: Omit<AttendanceRecord, "_id">) => {
    const response = await fetch("/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(attendance),
    })
    return response.json()
  },

  // Save bulk attendance records
  saveBulk: async (date: string, attendanceRecords: Omit<AttendanceRecord, "_id" | "date">[]) => {
    const response = await fetch("/api/attendance/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date, attendanceRecords }),
    })
    return response.json()
  },

  // Get attendance statistics
  getStats: async (params?: {
    studentId?: string
    group?: string
    startDate?: string
    endDate?: string
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.studentId) searchParams.append("studentId", params.studentId)
    if (params?.group) searchParams.append("group", params.group)
    if (params?.startDate) searchParams.append("startDate", params.startDate)
    if (params?.endDate) searchParams.append("endDate", params.endDate)

    const response = await fetch(`/api/attendance/stats?${searchParams}`)
    return response.json()
  },
}

// Statistics API
export const statsApi = {
  get: async () => {
    const response = await fetch("/api/stats")
    return response.json()
  },
}
