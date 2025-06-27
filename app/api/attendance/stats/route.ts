import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Attendance from "@/lib/models/Attendance"
import Student from "@/lib/models/Student"

// GET attendance statistics
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")
    const group = searchParams.get("group")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Build date filter
    const dateFilter: any = {}
    if (startDate || endDate) {
      dateFilter.date = {}
      if (startDate) dateFilter.date.$gte = new Date(startDate)
      if (endDate) dateFilter.date.$lte = new Date(endDate)
    }

    if (studentId) {
      // Get stats for specific student
      const attendanceRecords = await Attendance.find({
        studentId,
        ...dateFilter,
      }).sort({ date: -1 })

      const student = await Student.findById(studentId)
      if (!student) {
        return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 })
      }

      const stats = calculateStudentStats(attendanceRecords)

      return NextResponse.json({
        success: true,
        data: {
          student,
          ...stats,
          records: attendanceRecords,
        },
      })
    } else {
      // Get stats for all students or by group
      const studentFilter: any = {}
      if (group && group !== "all") {
        studentFilter.group = group
      }

      const students = await Student.find(studentFilter).sort({ fullName: 1 })

      const statsPromises = students.map(async (student) => {
        const attendanceRecords = await Attendance.find({
          studentId: student._id.toString(),
          ...dateFilter,
        })

        const stats = calculateStudentStats(attendanceRecords)

        return {
          student,
          ...stats,
        }
      })

      const allStats = await Promise.all(statsPromises)

      // Calculate overall statistics
      const overallStats = {
        totalStudents: students.length,
        totalDaysWithAttendance: await Attendance.distinct("date", dateFilter).then((dates) => dates.length),
        averageAttendanceRate:
          allStats.reduce((sum, stat) => sum + stat.attendancePercentage, 0) / allStats.length || 0,
        totalSessions: allStats.reduce((sum, stat) => sum + stat.totalSessions, 0),
        totalAttendedSessions: allStats.reduce((sum, stat) => sum + stat.attendedSessions, 0),
      }

      return NextResponse.json({
        success: true,
        data: {
          students: allStats,
          overall: overallStats,
        },
      })
    }
  } catch (error) {
    console.error("Error fetching attendance stats:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch attendance statistics" }, { status: 500 })
  }
}

function calculateStudentStats(attendanceRecords: any[]) {
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
