"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Save, Users } from "lucide-react"

interface Student {
  id: string
  fullName: string
  spiritualName: string
  sex: string
  age: number
  class: string
  familyName: string
  phone: string
  address: string
  photo?: string
  group: string
  registrationDate: string
}

interface AttendanceRecord {
  studentId: string
  date: string
  sessions: {
    monday: boolean
    wednesday: boolean
    friday: boolean
  }
}

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedGroup, setSelectedGroup] = useState("ቡድን ሀ")
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0])
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem("students") || "[]")
    setStudents(savedStudents)

    // Load existing attendance for the current date
    const savedAttendance = JSON.parse(localStorage.getItem("attendance") || "{}")
    setAttendance(savedAttendance)
  }, [])

  const filteredStudents = students.filter((student) => student.group === selectedGroup)

  const getAttendanceKey = (studentId: string, date: string) => `${studentId}-${date}`

  const updateAttendance = (studentId: string, session: "monday" | "wednesday" | "friday", checked: boolean) => {
    const key = getAttendanceKey(studentId, currentDate)
    setAttendance((prev) => ({
      ...prev,
      [key]: {
        studentId,
        date: currentDate,
        sessions: {
          ...(prev[key]?.sessions || { monday: false, wednesday: false, friday: false }),
          [session]: checked,
        },
      },
    }))
  }

  const saveAttendance = () => {
    setIsSaving(true)
    localStorage.setItem("attendance", JSON.stringify(attendance))
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  const getSessionAttendance = (studentId: string, session: "monday" | "wednesday" | "friday") => {
    const key = getAttendanceKey(studentId, currentDate)
    return attendance[key]?.sessions[session] || false
  }

  const getGroupColor = (group: string) => {
    switch (group) {
      case "ቡድን ሀ":
        return "bg-blue-100 text-blue-800"
      case "ቡድን ለ":
        return "bg-green-100 text-green-800"
      case "ቡድን ሐ":
        return "bg-purple-100 text-purple-800"
      case "ቡድን መ":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="amharic-text">ወደ ቤት ገጽ</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 amharic-text">የተማሪ መገኘት መቁጠሪያ</h1>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-full sm:w-64 amharic-text">
              <SelectValue placeholder="ቡድን ይምረጡ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ቡድን ሀ" className="amharic-text">
                ቡድን ሀ (4-6 ዓመት)
              </SelectItem>
              <SelectItem value="ቡድን ለ" className="amharic-text">
                ቡድን ለ (7-10 ዓመት)
              </SelectItem>
              <SelectItem value="ቡድን ሐ" className="amharic-text">
                ቡድን ሐ (11-14 ዓመት)
              </SelectItem>
              <SelectItem value="ቡድን መ" className="amharic-text">
                ቡድን መ (15-18 ዓመት)
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button onClick={saveAttendance} disabled={isSaving} className="amharic-text">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "እየተቀመጠ..." : "መገኘት ቀምጥ"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="amharic-text">{selectedGroup}</CardTitle>
                <CardDescription className="amharic-text">
                  {new Date(currentDate).toLocaleDateString("am-ET", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </div>
              <Badge className={getGroupColor(selectedGroup)}>{filteredStudents.length} ተማሪዎች</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2 amharic-text">በዚህ ቡድን ውስጥ ተማሪ የለም</h3>
                <p className="text-gray-500 amharic-text">በመጀመሪያ ተማሪዎችን ማስመዝገብ ያስፈልጋል።</p>
                <Link href="/register">
                  <Button className="mt-4 amharic-text">አዲስ ተማሪ መዝግብ</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 amharic-text">ተማሪ</th>
                      <th className="text-center py-3 px-2 amharic-text">ሰኞ</th>
                      <th className="text-center py-3 px-2 amharic-text">እሮብ</th>
                      <th className="text-center py-3 px-2 amharic-text">አርብ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                              {student.photo ? (
                                <img
                                  src={student.photo || "/placeholder.svg"}
                                  alt={student.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <Users className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 amharic-text">{student.fullName}</p>
                              <p className="text-sm text-gray-500 amharic-text">{student.spiritualName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-center py-4 px-2">
                          <Checkbox
                            checked={getSessionAttendance(student.id, "monday")}
                            onCheckedChange={(checked) => updateAttendance(student.id, "monday", checked as boolean)}
                          />
                        </td>
                        <td className="text-center py-4 px-2">
                          <Checkbox
                            checked={getSessionAttendance(student.id, "wednesday")}
                            onCheckedChange={(checked) => updateAttendance(student.id, "wednesday", checked as boolean)}
                          />
                        </td>
                        <td className="text-center py-4 px-2">
                          <Checkbox
                            checked={getSessionAttendance(student.id, "friday")}
                            onCheckedChange={(checked) => updateAttendance(student.id, "friday", checked as boolean)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
