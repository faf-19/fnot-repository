// Storage utility that works in preview (localStorage) and can be easily switched to database
export interface Student {
  id: string
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
  id: string
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

// Storage class that can work with localStorage or database
class StorageManager {
  private isClient = typeof window !== "undefined"

  // Student operations
  async getStudents(filters?: { group?: string; search?: string }): Promise<Student[]> {
    if (!this.isClient) return []

    const students = JSON.parse(localStorage.getItem("students") || "[]") as Student[]

    let filtered = students

    if (filters?.group && filters.group !== "all") {
      filtered = filtered.filter((student) => student.group === filters.group)
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(
        (student) =>
          student.fullName.toLowerCase().includes(search) ||
          student.spiritualName.toLowerCase().includes(search) ||
          student.class.toLowerCase().includes(search),
      )
    }

    return filtered.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
  }

  async getStudent(id: string): Promise<Student | null> {
    if (!this.isClient) return null

    const students = JSON.parse(localStorage.getItem("students") || "[]") as Student[]
    return students.find((student) => student.id === id) || null
  }

  async createStudent(studentData: Omit<Student, "id" | "group" | "registrationDate">): Promise<Student> {
    if (!this.isClient) throw new Error("Not available on server")

    const students = JSON.parse(localStorage.getItem("students") || "[]") as Student[]

    // Check for duplicates
    const duplicate = students.find(
      (s) =>
        (s.fullName === studentData.fullName &&
          s.spiritualName === studentData.spiritualName &&
          s.age === studentData.age) ||
        s.phone === studentData.phone,
    )

    if (duplicate) {
      throw new Error("ይህ ተማሪ አስቀድሞ ተመዝግቧል።")
    }

    const getAgeGroup = (age: number): string => {
      if (age >= 4 && age <= 6) return "ቡድን ሀ"
      if (age >= 7 && age <= 10) return "ቡድን ለ"
      if (age >= 11 && age <= 14) return "ቡድን ሐ"
      if (age >= 15 && age <= 18) return "ቡድን መ"
      return "ሌላ"
    }

    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      group: getAgeGroup(studentData.age),
      registrationDate: new Date().toISOString(),
    }

    students.push(newStudent)
    localStorage.setItem("students", JSON.stringify(students))

    return newStudent
  }

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    if (!this.isClient) throw new Error("Not available on server")

    const students = JSON.parse(localStorage.getItem("students") || "[]") as Student[]
    const index = students.findIndex((student) => student.id === id)

    if (index === -1) {
      throw new Error("Student not found")
    }

    students[index] = { ...students[index], ...updates }
    localStorage.setItem("students", JSON.stringify(students))

    return students[index]
  }

  async deleteStudent(id: string): Promise<void> {
    if (!this.isClient) throw new Error("Not available on server")

    const students = JSON.parse(localStorage.getItem("students") || "[]") as Student[]
    const filtered = students.filter((student) => student.id !== id)
    localStorage.setItem("students", JSON.stringify(filtered))

    // Also delete related attendance records
    const attendance = JSON.parse(localStorage.getItem("attendance") || "[]") as AttendanceRecord[]
    const filteredAttendance = attendance.filter((record) => record.studentId !== id)
    localStorage.setItem("attendance", JSON.stringify(filteredAttendance))
  }

  // Attendance operations
  async getAttendance(filters?: { date?: string; studentId?: string }): Promise<AttendanceRecord[]> {
    if (!this.isClient) return []

    const attendance = JSON.parse(localStorage.getItem("attendance") || "[]") as AttendanceRecord[]

    let filtered = attendance

    if (filters?.date) {
      filtered = filtered.filter((record) => record.date === filters.date)
    }

    if (filters?.studentId) {
      filtered = filtered.filter((record) => record.studentId === filters.studentId)
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  async saveAttendance(attendanceData: Omit<AttendanceRecord, "id">): Promise<AttendanceRecord> {
    if (!this.isClient) throw new Error("Not available on server")

    const attendance = JSON.parse(localStorage.getItem("attendance") || "[]") as AttendanceRecord[]

    // Find existing record for same student and date
    const existingIndex = attendance.findIndex(
      (record) => record.studentId === attendanceData.studentId && record.date === attendanceData.date,
    )

    const newRecord: AttendanceRecord = {
      ...attendanceData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    }

    if (existingIndex >= 0) {
      // Update existing record
      attendance[existingIndex] = { ...attendance[existingIndex], ...newRecord, id: attendance[existingIndex].id }
      localStorage.setItem("attendance", JSON.stringify(attendance))
      return attendance[existingIndex]
    } else {
      // Create new record
      attendance.push(newRecord)
      localStorage.setItem("attendance", JSON.stringify(attendance))
      return newRecord
    }
  }

  async saveBulkAttendance(date: string, records: Omit<AttendanceRecord, "id" | "date">[]): Promise<void> {
    if (!this.isClient) throw new Error("Not available on server")

    for (const record of records) {
      await this.saveAttendance({ ...record, date })
    }
  }

  // Statistics
  async getAttendanceStats(filters?: {
    studentId?: string
    group?: string
    startDate?: string
    endDate?: string
  }): Promise<{ students: AttendanceStats[]; overall: any }> {
    if (!this.isClient) return { students: [], overall: null }

    const students = await this.getStudents({ group: filters?.group })
    const allAttendance = await this.getAttendance()

    const statsPromises = students.map(async (student) => {
      let studentAttendance = allAttendance.filter((record) => record.studentId === student.id)

      // Apply date filters
      if (filters?.startDate || filters?.endDate) {
        studentAttendance = studentAttendance.filter((record) => {
          const recordDate = new Date(record.date)
          const start = filters?.startDate ? new Date(filters.startDate) : new Date("1900-01-01")
          const end = filters?.endDate ? new Date(filters.endDate) : new Date("2100-12-31")
          return recordDate >= start && recordDate <= end
        })
      }

      return this.calculateStudentStats(student, studentAttendance)
    })

    const allStats = await Promise.all(statsPromises)

    // Filter by specific student if requested
    const filteredStats = filters?.studentId
      ? allStats.filter((stat) => stat.student.id === filters.studentId)
      : allStats

    // Calculate overall statistics
    const overallStats = {
      totalStudents: students.length,
      totalDaysWithAttendance: [...new Set(allAttendance.map((record) => record.date))].length,
      averageAttendanceRate: allStats.reduce((sum, stat) => sum + stat.attendancePercentage, 0) / allStats.length || 0,
      totalSessions: allStats.reduce((sum, stat) => sum + stat.totalSessions, 0),
      totalAttendedSessions: allStats.reduce((sum, stat) => sum + stat.attendedSessions, 0),
    }

    return {
      students: filteredStats,
      overall: overallStats,
    }
  }

  private calculateStudentStats(student: Student, attendanceRecords: AttendanceRecord[]): AttendanceStats {
    const totalDays = attendanceRecords.length
    let attendedSessions = 0
    let totalSessions = 0
    let mondayAttended = 0
    let wednesdayAttended = 0
    let fridayAttended = 0
    let totalMondays = 0
    let totalWednesdays = 0
    let totalFridays = 0

    attendanceRecords.forEach((record) => {
      // Count total possible sessions (3 per day)
      totalSessions += 3
      totalMondays += 1
      totalWednesdays += 1
      totalFridays += 1

      // Count attended sessions
      if (record.sessions.monday) {
        attendedSessions += 1
        mondayAttended += 1
      }
      if (record.sessions.wednesday) {
        attendedSessions += 1
        wednesdayAttended += 1
      }
      if (record.sessions.friday) {
        attendedSessions += 1
        fridayAttended += 1
      }
    })

    const attendancePercentage = totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0

    return {
      student,
      totalDays,
      attendedSessions,
      totalSessions,
      attendancePercentage: Math.round(attendancePercentage * 100) / 100,
      sessionStats: {
        monday: {
          attended: mondayAttended,
          total: totalMondays,
          percentage: totalMondays > 0 ? Math.round((mondayAttended / totalMondays) * 100) : 0,
        },
        wednesday: {
          attended: wednesdayAttended,
          total: totalWednesdays,
          percentage: totalWednesdays > 0 ? Math.round((wednesdayAttended / totalWednesdays) * 100) : 0,
        },
        friday: {
          attended: fridayAttended,
          total: totalFridays,
          percentage: totalFridays > 0 ? Math.round((fridayAttended / totalFridays) * 100) : 0,
        },
      },
    }
  }

  // Get system statistics
  async getSystemStats(): Promise<any> {
    if (!this.isClient) return null

    const students = await this.getStudents()
    const attendance = await this.getAttendance()

    const today = new Date().toISOString().split("T")[0]
    const todayAttendance = attendance.filter((record) => record.date === today)

    const groupStats = students.reduce(
      (acc, student) => {
        acc[student.group] = (acc[student.group] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      students: {
        total: students.length,
        male: students.filter((s) => s.sex === "ወንድ").length,
        female: students.filter((s) => s.sex === "ሴት").length,
        byGroup: Object.entries(groupStats).map(([group, count]) => ({ _id: group, count })),
      },
      attendance: {
        today: todayAttendance.length,
      },
    }
  }
}

export const storage = new StorageManager()
