import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Attendance from "@/lib/models/Attendance"

// POST bulk attendance update
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const { date, attendanceRecords } = body

    const attendanceDate = new Date(date)
    attendanceDate.setHours(0, 0, 0, 0)

    // Prepare bulk operations
    const bulkOps = attendanceRecords.map((record: any) => ({
      updateOne: {
        filter: {
          studentId: record.studentId,
          date: {
            $gte: attendanceDate,
            $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000),
          },
        },
        update: {
          studentId: record.studentId,
          date: attendanceDate,
          sessions: record.sessions,
        },
        upsert: true,
      },
    }))

    // Execute bulk operation
    const result = await Attendance.bulkWrite(bulkOps)

    return NextResponse.json({
      success: true,
      message: "Attendance saved successfully",
      result: {
        modified: result.modifiedCount,
        upserted: result.upsertedCount,
      },
    })
  } catch (error) {
    console.error("Error saving bulk attendance:", error)
    return NextResponse.json({ success: false, error: "Failed to save attendance" }, { status: 500 })
  }
}
