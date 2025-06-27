import { type NextRequest, NextResponse } from "next/server"
import { storage } from "@/lib/storage"

// GET single student
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const student = await storage.getStudent(params.id)

    if (!student) {
      return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: student })
  } catch (error) {
    console.error("Error fetching student:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch student" }, { status: 500 })
  }
}

// PUT update student
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const student = await storage.updateStudent(params.id, body)

    return NextResponse.json({ success: true, data: student })
  } catch (error: any) {
    console.error("Error updating student:", error)

    if (error.message === "Student not found") {
      return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json({ success: false, error: "Failed to update student" }, { status: 500 })
  }
}

// DELETE student
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await storage.deleteStudent(params.id)

    return NextResponse.json({ success: true, message: "Student deleted successfully" })
  } catch (error) {
    console.error("Error deleting student:", error)
    return NextResponse.json({ success: false, error: "Failed to delete student" }, { status: 500 })
  }
}
