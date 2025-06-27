import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Student, { type IStudent } from "@/lib/models/Student"

// GET all students
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const group = searchParams.get("group")
    const search = searchParams.get("search")

    const query: any = {}

    if (group && group !== "all") {
      query.group = group
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { spiritualName: { $regex: search, $options: "i" } },
        { class: { $regex: search, $options: "i" } },
      ]
    }

    const students = await Student.find(query).sort({ registrationDate: -1 })

    return NextResponse.json({ success: true, data: students })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch students" }, { status: 500 })
  }
}

// POST new student
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()

    // Calculate age group
    const getAgeGroup = (age: number): string => {
      if (age >= 4 && age <= 6) return "ቡድን ሀ"
      if (age >= 7 && age <= 10) return "ቡድን ለ"
      if (age >= 11 && age <= 14) return "ቡድን ሐ"
      if (age >= 15 && age <= 18) return "ቡድን መ"
      return "ሌላ"
    }

    const studentData: Partial<IStudent> = {
      ...body,
      group: getAgeGroup(body.age),
      registrationDate: new Date(),
    }

    // Check for duplicates
    const existingStudent = await Student.findOne({
      $or: [
        {
          fullName: body.fullName,
          spiritualName: body.spiritualName,
          age: body.age,
        },
        { phone: body.phone },
      ],
    })

    if (existingStudent) {
      return NextResponse.json({ success: false, error: "ይህ ተማሪ አስቀድሞ ተመዝግቧል።" }, { status: 400 })
    }

    const student = new Student(studentData)
    await student.save()

    return NextResponse.json({ success: true, data: student }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating student:", error)

    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: "ይህ ስልክ ቁጥር አስቀድሞ ተመዝግቧል።" }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to create student" }, { status: 500 })
  }
}
