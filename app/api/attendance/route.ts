import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Attendance from "@/lib/models/Attendance"

// GET attendance records
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const studentId = searchParams.get("studentId")

    const query: any = {}

    if (date) {
      const targetDate = new Date(date)
      query.date = {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lt: new Date(targetDate.setHours(23, 59, 59, 999)),
      }
    }

    if (studentId) {
      query.studentId = studentId
    }

    const attendance = await Attendance.find(query).sort({ date: -1 })

    return NextResponse.json({ success: true, data: attendance })
  } catch (error) {
    console.error("Error fetching attendance:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch attendance" }, { status: 500 })
  }
}

// POST/PUT attendance record
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const { studentId, date, sessions } = body

    // Convert date string to Date object
    const attendanceDate = new Date(date)
    attendanceDate.setHours(0, 0, 0, 0)

    // Use upsert to update existing record or create new one
    const attendance = await Attendance.findOneAndUpdate(
      {
        studentId,
        date: {
          $gte: attendanceDate,
          $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      {
        studentId,
        date: attendanceDate,
        sessions,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    )

    return NextResponse.json({ success: true, data: attendance })
  } catch (error) {
    console.error("Error saving attendance:", error)
    return NextResponse.json({ success: false, error: "Failed to save attendance" }, { status: 500 })
  }
}
