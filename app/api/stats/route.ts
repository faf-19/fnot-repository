import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Student from "@/lib/models/Student"
import Attendance from "@/lib/models/Attendance"

// GET statistics
export async function GET() {
  try {
    await dbConnect()

    // Get student statistics
    const totalStudents = await Student.countDocuments()
    const maleStudents = await Student.countDocuments({ sex: "ወንድ" })
    const femaleStudents = await Student.countDocuments({ sex: "ሴት" })

    // Get students by group
    const groupStats = await Student.aggregate([
      {
        $group: {
          _id: "$group",
          count: { $sum: 1 },
        },
      },
    ])

    // Get recent attendance statistics
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayAttendance = await Attendance.countDocuments({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        students: {
          total: totalStudents,
          male: maleStudents,
          female: femaleStudents,
          byGroup: groupStats,
        },
        attendance: {
          today: todayAttendance,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching statistics:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch statistics" }, { status: 500 })
  }
}
