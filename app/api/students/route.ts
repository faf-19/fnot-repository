import { type NextRequest, NextResponse } from "next/server"
import { storage } from "@/lib/storage"

// GET all students
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const group = searchParams.get("group")
    const search = searchParams.get("search")

    const filters: any = {}
    if (group && group !== "all") filters.group = group
    if (search) filters.search = search

    const students = await storage.getStudents(filters)

    return NextResponse.json({ success: true, data: students })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch students" }, { status: 500 })
  }
}

// POST new student
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const student = await storage.createStudent(body)

    return NextResponse.json({ success: true, data: student }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating student:", error)

    if (error.message.includes("ተመዝግቧል")) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to create student" }, { status: 500 })
  }
}
