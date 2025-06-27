import { type NextRequest, NextResponse } from "next/server"
import { storage } from "@/lib/storage"

// GET attendance records
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const studentId = searchParams.get("studentId")

    const filters: any = {}
    if (date) filters.date = date
    if (studentId) filters.studentId = studentId

    const attendance = await storage.getAttendance(filters)

    return NextResponse.json({ success: true, data: attendance })
  } catch (error) {
    console.error("Error fetching attendance:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch attendance" }, { status: 500 })
  }
}

// POST attendance record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, date, sessions } = body

    const attendance = await storage.saveAttendance({
      studentId,
      date,
      sessions,
    })

    return NextResponse.json({ success: true, data: attendance })
  } catch (error) {
    console.error("Error saving attendance:", error)
    return NextResponse.json({ success: false, error: "Failed to save attendance" }, { status: 500 })
  }
}
