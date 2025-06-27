import { type NextRequest, NextResponse } from "next/server"
import { storage } from "@/lib/storage"

// POST bulk attendance update
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, attendanceRecords } = body

    await storage.saveBulkAttendance(date, attendanceRecords)

    return NextResponse.json({
      success: true,
      message: "Attendance saved successfully",
    })
  } catch (error) {
    console.error("Error saving bulk attendance:", error)
    return NextResponse.json({ success: false, error: "Failed to save attendance" }, { status: 500 })
  }
}
