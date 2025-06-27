import { type NextRequest, NextResponse } from "next/server"
import { storage } from "@/lib/storage"

// GET attendance statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")
    const group = searchParams.get("group")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const filters: any = {}
    if (studentId) filters.studentId = studentId
    if (group && group !== "all") filters.group = group
    if (startDate) filters.startDate = startDate
    if (endDate) filters.endDate = endDate

    const stats = await storage.getAttendanceStats(filters)

    if (studentId) {
      // Return single student stats
      const studentStats = stats.students[0]
      if (!studentStats) {
        return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 })
      }

      const attendance = await storage.getAttendance({ studentId })

      return NextResponse.json({
        success: true,
        data: {
          ...studentStats,
          records: attendance,
        },
      })
    } else {
      // Return all students stats
      return NextResponse.json({
        success: true,
        data: stats,
      })
    }
  } catch (error) {
    console.error("Error fetching attendance stats:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch attendance statistics" }, { status: 500 })
  }
}
